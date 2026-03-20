import { useState, useMemo } from 'react'
import { ChevronDown, ChevronRight, Building2, Users, Plus, Settings, Shield, Eye, Edit, FileCheck, Cog } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { DataTable } from '@/components/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { organizationTree } from '@/mocks/data/organizations'
import type { OrgNode } from '@/stores/organization'

// ---------------------------------------------------------------------------
// Role mock data
// ---------------------------------------------------------------------------

interface Role {
  id: string
  name: string
  scope: string
  memberCount: number
  description: string
  permissions?: RolePermission
}

interface RolePermission {
  view: boolean
  edit: boolean
  approve: boolean
  config: boolean
  modules: string[]
}

const mockRoles: Role[] = [
  {
    id: 'role-admin',
    name: '系统管理员',
    scope: '全局管理、用户管理、系统配置',
    memberCount: 2,
    description: '拥有所有系统权限',
    permissions: {
      view: true,
      edit: true,
      approve: true,
      config: true,
      modules: ['dashboard', 'risk', 'suppliers', 'map', 'warroom', 'optimization', 'reports', 'rules', 'admin'],
    },
  },
  {
    id: 'role-analyst',
    name: '风控分析师',
    scope: '风险事件查看、分析、规则配置',
    memberCount: 8,
    description: '负责风险事件分析与规则管理',
    permissions: {
      view: true,
      edit: true,
      approve: false,
      config: true,
      modules: ['dashboard', 'risk', 'suppliers', 'map', 'reports', 'rules'],
    },
  },
  {
    id: 'role-manager',
    name: '业务经理',
    scope: '案件管理、任务分配、审批',
    memberCount: 5,
    description: '负责案件处理与流程推进',
    permissions: {
      view: true,
      edit: true,
      approve: true,
      config: false,
      modules: ['dashboard', 'risk', 'suppliers', 'map', 'warroom', 'reports'],
    },
  },
  {
    id: 'role-viewer',
    name: '只读用户',
    scope: '仪表盘查看、报表查看',
    memberCount: 15,
    description: '仅可查看数据，无操作权限',
    permissions: {
      view: true,
      edit: false,
      approve: false,
      config: false,
      modules: ['dashboard', 'reports'],
    },
  },
  {
    id: 'role-auditor',
    name: '审计员',
    scope: '审计日志查看、合规报告导出',
    memberCount: 3,
    description: '负责合规审计与日志审查',
    permissions: {
      view: true,
      edit: false,
      approve: false,
      config: false,
      modules: ['dashboard', 'reports', 'admin'],
    },
  },
]

// ---------------------------------------------------------------------------
// OrgTree display component
// ---------------------------------------------------------------------------

function OrgTreeItem({
  node,
  level,
}: {
  node: OrgNode
  level: number
}) {
  const [expanded, setExpanded] = useState(true)
  const hasChildren = !!node.children?.length

  const typeLabel: Record<string, string> = {
    group: '集团',
    division: '事业部',
    branch: '分公司',
    factory: '工厂',
  }

  const typeBadgeClass: Record<string, string> = {
    group: 'bg-blue-50 text-blue-700 border-blue-200',
    division: 'bg-purple-50 text-purple-700 border-purple-200',
    branch: 'bg-green-50 text-green-700 border-green-200',
    factory: 'bg-orange-50 text-orange-700 border-orange-200',
  }

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-gray-50',
        )}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
      >
        {hasChildren ? (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex h-4 w-4 shrink-0 items-center justify-center"
          >
            {expanded ? (
              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
            )}
          </button>
        ) : (
          <span className="h-4 w-4 shrink-0" />
        )}
        <Building2 className="h-4 w-4 text-gray-400" />
        <span className="flex-1 text-gray-700">{node.name}</span>
        <Badge
          variant="outline"
          className={cn('text-[10px]', typeBadgeClass[node.type])}
        >
          {typeLabel[node.type]}
        </Badge>
      </div>
      {hasChildren && expanded && (
        <div>
          {node.children!.map((child) => (
            <OrgTreeItem
              key={child.id}
              node={child}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Permission matrix component
// ---------------------------------------------------------------------------

const PERMISSION_MODULES = [
  { key: 'dashboard', label: '驾驶舱', icon: Shield },
  { key: 'risk', label: '风险运营', icon: Eye },
  { key: 'suppliers', label: '供应商', icon: Building2 },
  { key: 'map', label: '风险地图', icon: Eye },
  { key: 'warroom', label: '协同处置', icon: Edit },
  { key: 'optimization', label: '优化中心', icon: Cog },
  { key: 'reports', label: '报告中心', icon: FileCheck },
  { key: 'rules', label: '规则中心', icon: Settings },
  { key: 'admin', label: '系统管理', icon: Cog },
]

const PERMISSION_TYPES = [
  { key: 'view', label: '查看', color: 'text-blue-600' },
  { key: 'edit', label: '编辑', color: 'text-green-600' },
  { key: 'approve', label: '审批', color: 'text-orange-600' },
  { key: 'config', label: '配置', color: 'text-purple-600' },
]

interface PermissionMatrixProps {
  permissions: RolePermission
  onChange?: (perms: RolePermission) => void
  readonly?: boolean
}

function PermissionMatrix({ permissions, onChange, readonly = false }: PermissionMatrixProps) {
  const togglePermission = (type: keyof Omit<RolePermission, 'modules'>) => {
    if (readonly || !onChange) return
    onChange({
      ...permissions,
      [type]: !permissions[type],
    })
  }

  const toggleModule = (moduleKey: string) => {
    if (readonly || !onChange) return
    const hasModule = permissions.modules.includes(moduleKey)
    onChange({
      ...permissions,
      modules: hasModule
        ? permissions.modules.filter((m) => m !== moduleKey)
        : [...permissions.modules, moduleKey],
    })
  }

  return (
    <div className="space-y-4">
      {/* Global permissions */}
      <div className="grid grid-cols-4 gap-3">
        {PERMISSION_TYPES.map((type) => (
          <div
            key={type.key}
            className={cn(
              'flex items-center gap-2 rounded-lg border p-3 transition-colors',
              readonly ? 'cursor-default' : 'cursor-pointer hover:bg-gray-50',
              permissions[type.key as keyof Omit<RolePermission, 'modules'>]
                ? 'border-blue-200 bg-blue-50/50'
                : 'border-gray-200 bg-white',
            )}
            onClick={() => togglePermission(type.key as keyof Omit<RolePermission, 'modules'>)}
          >
            <Checkbox
              checked={permissions[type.key as keyof Omit<RolePermission, 'modules'>]}
              disabled={readonly}
            />
            <span className={cn('text-sm font-medium', type.color)}>{type.label}</span>
          </div>
        ))}
      </div>

      {/* Module permissions */}
      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-700">模块</th>
              <th className="px-3 py-2 text-center font-medium text-gray-700 w-16">访问</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {PERMISSION_MODULES.map((module) => {
              const Icon = module.icon
              const hasAccess = permissions.modules.includes(module.key)
              return (
                <tr
                  key={module.key}
                  className={cn(
                    'hover:bg-gray-50',
                    !readonly && 'cursor-pointer',
                  )}
                  onClick={() => toggleModule(module.key)}
                >
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">{module.label}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <Checkbox checked={hasAccess} disabled={readonly} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Role templates
// ---------------------------------------------------------------------------

const ROLE_TEMPLATES = [
  { name: '系统管理员', permissions: mockRoles[0].permissions },
  { name: '风控分析师', permissions: mockRoles[1].permissions },
  { name: '业务经理', permissions: mockRoles[2].permissions },
  { name: '只读用户', permissions: mockRoles[3].permissions },
  { name: '审计员', permissions: mockRoles[4].permissions },
]

const roleColumns: ColumnDef<Role, unknown>[] = [
  {
    accessorKey: 'name',
    header: '角色名',
    size: 140,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-gray-400" />
        <span className="font-medium text-gray-900">
          {row.original.name}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'scope',
    header: '权限范围',
    size: 280,
    cell: ({ row }) => (
      <span className="text-gray-600">{row.original.scope}</span>
    ),
  },
  {
    accessorKey: 'memberCount',
    header: '成员数',
    size: 80,
    cell: ({ row }) => (
      <Badge variant="secondary">{row.original.memberCount} 人</Badge>
    ),
  },
  {
    accessorKey: 'description',
    header: '描述',
    size: 200,
    cell: ({ row }) => (
      <span className="text-sm text-gray-500">
        {row.original.description}
      </span>
    ),
  },
  {
    id: 'actions',
    header: '操作',
    size: 100,
    cell: () => (
      <Button
        variant="ghost"
        size="sm"
        className="h-7 gap-1 text-blue-600 hover:text-blue-700"
        onClick={(e) => {
          e.stopPropagation()
          // Will be handled by parent component
        }}
      >
        <Settings className="h-3.5 w-3.5" />
        配置
      </Button>
    ),
  },
]

// ---------------------------------------------------------------------------
// OrgRoles Page
// ---------------------------------------------------------------------------

export default function OrgRoles() {
  const [roles, setRoles] = useState<Role[]>(mockRoles)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [configDialogOpen, setConfigDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)

  // New role form state
  const [newRoleName, setNewRoleName] = useState('')
  const [newRoleDesc, setNewRoleDesc] = useState('')
  const [newRoleScope, setNewRoleScope] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [newRolePermissions, setNewRolePermissions] = useState<RolePermission>({
    view: true,
    edit: false,
    approve: false,
    config: false,
    modules: ['dashboard'],
  })

  const handleCreateRole = () => {
    if (!newRoleName.trim()) {
      toast.error('请输入角色名称')
      return
    }

    const newRole: Role = {
      id: `role-${Date.now()}`,
      name: newRoleName.trim(),
      scope: newRoleScope.trim() || '自定义权限范围',
      memberCount: 0,
      description: newRoleDesc.trim() || '自定义角色',
      permissions: { ...newRolePermissions },
    }

    setRoles((prev) => [...prev, newRole])
    setCreateDialogOpen(false)
    resetCreateForm()
    toast.success(`角色 "${newRole.name}" 创建成功`)
  }

  const resetCreateForm = () => {
    setNewRoleName('')
    setNewRoleDesc('')
    setNewRoleScope('')
    setSelectedTemplate('')
    setNewRolePermissions({
      view: true,
      edit: false,
      approve: false,
      config: false,
      modules: ['dashboard'],
    })
  }

  const handleTemplateSelect = (templateName: string) => {
    setSelectedTemplate(templateName)
    const template = ROLE_TEMPLATES.find((t) => t.name === templateName)
    if (template?.permissions) {
      setNewRolePermissions({ ...template.permissions })
    }
  }

  const handleOpenConfig = (role: Role) => {
    setSelectedRole(role)
    setConfigDialogOpen(true)
  }

  const handleSavePermissions = () => {
    if (!selectedRole) return
    setRoles((prev) =>
      prev.map((r) =>
        r.id === selectedRole.id ? { ...selectedRole } : r
      )
    )
    setConfigDialogOpen(false)
    toast.success(`角色 "${selectedRole.name}" 权限已更新`)
  }

  // Update role columns to include click handler
  const columnsWithActions: ColumnDef<Role, unknown>[] = useMemo(
    () =>
      roleColumns.map((col) =>
        col.id === 'actions'
          ? {
              ...col,
              cell: ({ row }) => (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 text-blue-600 hover:text-blue-700"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleOpenConfig(row.original)
                  }}
                >
                  <Settings className="h-3.5 w-3.5" />
                  配置
                </Button>
              ),
            }
          : col
      ),
    []
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          组织与角色
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          管理组织结构与角色权限
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Organization Tree */}
        <div className="rounded-lg border bg-white">
          <div className="border-b px-4 py-3">
            <h3 className="text-sm font-semibold text-gray-900">
              组织结构
            </h3>
          </div>
          <div className="p-2">
            {organizationTree.map((node) => (
              <OrgTreeItem key={node.id} node={node} level={0} />
            ))}
          </div>
        </div>

        {/* Roles Table */}
        <div className="space-y-0">
          <div className="rounded-lg border bg-white">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="text-sm font-semibold text-gray-900">
                角色列表
              </h3>
              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1">
                    <Plus className="h-4 w-4" />
                    新增角色
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>新增角色</DialogTitle>
                    <DialogDescription>
                      创建新角色并配置权限，可选择从模板继承
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label>角色名称</Label>
                        <Input
                          placeholder="输入角色名称"
                          value={newRoleName}
                          onChange={(e) => setNewRoleName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>继承模板</Label>
                        <Select
                          value={selectedTemplate}
                          onValueChange={handleTemplateSelect}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="选择模板（可选）" />
                          </SelectTrigger>
                          <SelectContent>
                            {ROLE_TEMPLATES.map((t) => (
                              <SelectItem key={t.name} value={t.name}>
                                {t.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>权限范围描述</Label>
                      <Input
                        placeholder="描述该角色的权限范围"
                        value={newRoleScope}
                        onChange={(e) => setNewRoleScope(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>描述</Label>
                      <Input
                        placeholder="输入角色描述"
                        value={newRoleDesc}
                        onChange={(e) => setNewRoleDesc(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>权限矩阵</Label>
                      <PermissionMatrix
                        permissions={newRolePermissions}
                        onChange={setNewRolePermissions}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCreateDialogOpen(false)
                        resetCreateForm()
                      }}
                    >
                      取消
                    </Button>
                    <Button onClick={handleCreateRole}>创建</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="p-4">
              <DataTable
                columns={columnsWithActions}
                data={roles}
                showPagination={false}
                emptyMessage="暂无角色"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Config Dialog */}
      <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>配置角色权限</DialogTitle>
            <DialogDescription>
              {selectedRole && `编辑 "${selectedRole.name}" 的权限配置`}
            </DialogDescription>
          </DialogHeader>
          {selectedRole && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>角色名称</Label>
                  <Input
                    value={selectedRole.name}
                    onChange={(e) =>
                      setSelectedRole({ ...selectedRole, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>成员数</Label>
                  <Input value={`${selectedRole.memberCount} 人`} disabled />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>权限范围描述</Label>
                <Input
                  value={selectedRole.scope}
                  onChange={(e) =>
                    setSelectedRole({ ...selectedRole, scope: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>权限矩阵</Label>
                <PermissionMatrix
                  permissions={selectedRole.permissions || newRolePermissions}
                  onChange={(perms) =>
                    setSelectedRole({ ...selectedRole, permissions: perms })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfigDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSavePermissions}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

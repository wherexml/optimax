import { useState } from 'react'
import { ChevronDown, ChevronRight, Building2, Users } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'

import { cn } from '@/lib/utils'
import { DataTable } from '@/components/DataTable'
import { Badge } from '@/components/ui/badge'
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
}

const mockRoles: Role[] = [
  {
    id: 'role-admin',
    name: '系统管理员',
    scope: '全局管理、用户管理、系统配置',
    memberCount: 2,
    description: '拥有所有系统权限',
  },
  {
    id: 'role-analyst',
    name: '风控分析师',
    scope: '风险事件查看、分析、规则配置',
    memberCount: 8,
    description: '负责风险事件分析与规则管理',
  },
  {
    id: 'role-manager',
    name: '业务经理',
    scope: '案件管理、任务分配、审批',
    memberCount: 5,
    description: '负责案件处理与流程推进',
  },
  {
    id: 'role-viewer',
    name: '只读用户',
    scope: '仪表盘查看、报表查看',
    memberCount: 15,
    description: '仅可查看数据，无操作权限',
  },
  {
    id: 'role-auditor',
    name: '审计员',
    scope: '审计日志查看、合规报告导出',
    memberCount: 3,
    description: '负责合规审计与日志审查',
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
// Role columns
// ---------------------------------------------------------------------------

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
]

// ---------------------------------------------------------------------------
// OrgRoles Page
// ---------------------------------------------------------------------------

export default function OrgRoles() {
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
            <div className="border-b px-4 py-3">
              <h3 className="text-sm font-semibold text-gray-900">
                角色列表
              </h3>
            </div>
            <div className="p-4">
              <DataTable
                columns={roleColumns}
                data={mockRoles}
                showPagination={false}
                emptyMessage="暂无角色"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

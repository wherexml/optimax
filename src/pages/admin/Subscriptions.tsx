import { useState, useMemo } from 'react'
import { Plus, Send, Users, User, CheckCircle } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'

import { DataTable } from '@/components/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type DigestType = 'realtime' | 'daily' | 'weekly'
type ChannelType = 'email' | 'sms' | 'webhook'
type RecipientType = 'individual' | 'group'

interface Subscription {
  id: string
  recipient: string
  recipientType: RecipientType
  groupName?: string
  thresholdCondition: string
  digestType: DigestType
  channel: ChannelType
  enabled: boolean
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const mockSubscriptions: Subscription[] = [
  {
    id: 'sub-001',
    recipient: '张伟',
    recipientType: 'individual',
    thresholdCondition: '严重及以上风险事件',
    digestType: 'realtime',
    channel: 'email',
    enabled: true,
  },
  {
    id: 'sub-002',
    recipient: '李明',
    recipientType: 'individual',
    thresholdCondition: '所有采购类风险',
    digestType: 'daily',
    channel: 'email',
    enabled: true,
  },
  {
    id: 'sub-003',
    recipient: '赵强',
    recipientType: 'individual',
    thresholdCondition: '供应商评分低于70分',
    digestType: 'realtime',
    channel: 'sms',
    enabled: true,
  },
  {
    id: 'sub-004',
    recipient: '运维团队',
    recipientType: 'group',
    groupName: '运维值班组',
    thresholdCondition: '数据源断流告警',
    digestType: 'realtime',
    channel: 'webhook',
    enabled: true,
  },
  {
    id: 'sub-005',
    recipient: '王芳',
    recipientType: 'individual',
    thresholdCondition: '合同到期提醒（30天内）',
    digestType: 'weekly',
    channel: 'email',
    enabled: true,
  },
  {
    id: 'sub-006',
    recipient: '风控部门',
    recipientType: 'group',
    groupName: '风控全体',
    thresholdCondition: '质量不合格率超5%',
    digestType: 'daily',
    channel: 'email',
    enabled: false,
  },
]

// Predefined groups for selection
const PREDEFINED_GROUPS = [
  { id: 'ops', name: '运维值班组', memberCount: 5 },
  { id: 'risk', name: '风控全体', memberCount: 12 },
  { id: 'procurement', name: '采购部门', memberCount: 8 },
  { id: 'quality', name: '质量部门', memberCount: 6 },
  { id: 'management', name: '管理层', memberCount: 4 },
]

// ---------------------------------------------------------------------------
// Badge configs
// ---------------------------------------------------------------------------

const digestBadge: Record<DigestType, { label: string; className: string }> = {
  realtime: {
    label: '实时',
    className: 'bg-red-50 text-red-700 border-red-200',
  },
  daily: {
    label: '日报',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  weekly: {
    label: '周报',
    className: 'bg-purple-50 text-purple-700 border-purple-200',
  },
}

const channelBadge: Record<ChannelType, { label: string; className: string }> = {
  email: {
    label: '邮件',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  sms: {
    label: '短信',
    className: 'bg-green-50 text-green-700 border-green-200',
  },
  webhook: {
    label: 'Webhook',
    className: 'bg-orange-50 text-orange-700 border-orange-200',
  },
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function Subscriptions() {
  const [data, setData] = useState(mockSubscriptions)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [sendingTest, setSendingTest] = useState<string | null>(null)

  // New subscription form state
  const [formRecipientType, setFormRecipientType] = useState<RecipientType>('individual')
  const [formRecipient, setFormRecipient] = useState('')
  const [formGroup, setFormGroup] = useState('')
  const [formCondition, setFormCondition] = useState('')
  const [formDigest, setFormDigest] = useState<DigestType>('realtime')
  const [formChannel, setFormChannel] = useState<ChannelType>('email')

  function handleCreate() {
    if (formRecipientType === 'individual' && !formRecipient.trim()) {
      toast.error('请输入接收人姓名')
      return
    }
    if (formRecipientType === 'group' && !formGroup) {
      toast.error('请选择接收群组')
      return
    }
    if (!formCondition.trim()) {
      toast.error('请输入阈值条件')
      return
    }

    const groupInfo = formRecipientType === 'group'
      ? PREDEFINED_GROUPS.find((g) => g.id === formGroup)
      : undefined

    const newSub: Subscription = {
      id: `sub-${Date.now()}`,
      recipient: formRecipientType === 'individual' ? formRecipient.trim() : groupInfo?.name || '未知群组',
      recipientType: formRecipientType,
      groupName: formRecipientType === 'group' ? groupInfo?.name : undefined,
      thresholdCondition: formCondition.trim(),
      digestType: formDigest,
      channel: formChannel,
      enabled: true,
    }
    setData((prev) => [...prev, newSub])
    setDialogOpen(false)
    resetForm()
    toast.success('订阅规则已创建')
  }

  function resetForm() {
    setFormRecipientType('individual')
    setFormRecipient('')
    setFormGroup('')
    setFormCondition('')
    setFormDigest('realtime')
    setFormChannel('email')
  }

  async function handleTestSend(sub: Subscription) {
    setSendingTest(sub.id)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setSendingTest(null)

    toast.success(`测试通知已发送至 "${sub.recipient}"`, {
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      description: `渠道: ${channelBadge[sub.channel].label}`,
    })
  }

  function handleToggle(id: string, enabled: boolean) {
    setData((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled } : s))
    )
    toast.success(enabled ? '订阅已启用' : '订阅已停用')
  }

  const columns: ColumnDef<Subscription, unknown>[] = useMemo(
    () => [
      {
        accessorKey: 'recipient',
        header: '接收人/组',
        size: 140,
        cell: ({ row }) => {
          const sub = row.original
          return (
            <div className="flex items-center gap-2">
              {sub.recipientType === 'group' ? (
                <Users className="h-4 w-4 text-blue-500" />
              ) : (
                <User className="h-4 w-4 text-gray-400" />
              )}
              <span className="font-medium text-gray-900">
                {sub.recipient}
              </span>
              {sub.recipientType === 'group' && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px]">
                  群组
                </Badge>
              )}
            </div>
          )
        },
      },
      {
        accessorKey: 'thresholdCondition',
        header: '阈值条件',
        size: 250,
        cell: ({ row }) => (
          <span className="text-gray-600">
            {row.original.thresholdCondition}
          </span>
        ),
      },
      {
        accessorKey: 'digestType',
        header: '摘要类型',
        size: 90,
        cell: ({ row }) => {
          const cfg = digestBadge[row.original.digestType]
          return (
            <Badge variant="outline" className={cfg.className}>
              {cfg.label}
            </Badge>
          )
        },
      },
      {
        accessorKey: 'channel',
        header: '渠道',
        size: 100,
        cell: ({ row }) => {
          const cfg = channelBadge[row.original.channel]
          return (
            <Badge variant="outline" className={cfg.className}>
              {cfg.label}
            </Badge>
          )
        },
      },
      {
        accessorKey: 'enabled',
        header: '状态',
        size: 80,
        cell: ({ row }) => (
          <Switch
            checked={row.original.enabled}
            onCheckedChange={(checked) => handleToggle(row.original.id, checked)}
          />
        ),
      },
      {
        id: 'actions',
        header: '操作',
        size: 100,
        cell: ({ row }) => {
          const sub = row.original
          const isSending = sendingTest === sub.id
          return (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 text-blue-600 hover:text-blue-700"
                  disabled={isSending || !sub.enabled}
                >
                  {isSending ? (
                    <Send className="h-3.5 w-3.5 animate-pulse" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                  测试
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64" align="end">
                <div className="space-y-3">
                  <div className="text-sm font-medium">发送测试通知</div>
                  <div className="text-xs text-gray-500">
                    接收人: {sub.recipient}<br />
                    渠道: {channelBadge[sub.channel].label}<br />
                    条件: {sub.thresholdCondition}
                  </div>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => handleTestSend(sub)}
                    disabled={isSending}
                  >
                    {isSending ? '发送中...' : '确认发送'}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )
        },
      },
    ],
    [sendingTest],
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            订阅配置
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            管理通知订阅规则
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              新增订阅
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>新增订阅规则</DialogTitle>
              <DialogDescription>
                配置新的通知订阅规则，设置接收人和触发条件
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              {/* Recipient Type Selection */}
              <div className="space-y-1.5">
                <Label>接收范围</Label>
                <RadioGroup
                  value={formRecipientType}
                  onValueChange={(v) => setFormRecipientType(v as RecipientType)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="individual" id="r-individual" />
                    <Label htmlFor="r-individual" className="cursor-pointer flex items-center gap-1">
                      <User className="h-4 w-4" />
                      个人
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="group" id="r-group" />
                    <Label htmlFor="r-group" className="cursor-pointer flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      群组
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Recipient / Group Selection */}
              {formRecipientType === 'individual' ? (
                <div className="space-y-1.5">
                  <Label>接收人</Label>
                  <Input
                    placeholder="输入接收人姓名"
                    value={formRecipient}
                    onChange={(e) => setFormRecipient(e.target.value)}
                  />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Label>接收群组</Label>
                  <Select value={formGroup} onValueChange={setFormGroup}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择群组" />
                    </SelectTrigger>
                    <SelectContent>
                      {PREDEFINED_GROUPS.map((g) => (
                        <SelectItem key={g.id} value={g.id}>
                          {g.name} ({g.memberCount}人)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-1.5">
                <Label>阈值条件</Label>
                <Input
                  placeholder="输入触发条件描述，如：严重及以上风险事件"
                  value={formCondition}
                  onChange={(e) => setFormCondition(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>摘要类型</Label>
                  <Select
                    value={formDigest}
                    onValueChange={(v) => setFormDigest(v as DigestType)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">实时</SelectItem>
                      <SelectItem value="daily">日报</SelectItem>
                      <SelectItem value="weekly">周报</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>渠道</Label>
                  <Select
                    value={formChannel}
                    onValueChange={(v) =>
                      setFormChannel(v as ChannelType)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">邮件</SelectItem>
                      <SelectItem value="sms">短信</SelectItem>
                      <SelectItem value="webhook">Webhook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDialogOpen(false)
                  resetForm()
                }}
              >
                取消
              </Button>
              <Button onClick={handleCreate}>创建</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        columns={columns}
        data={data}
        showPagination={false}
        emptyMessage="暂无订阅规则"
      />
    </div>
  )
}

import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'

import { DataTable } from '@/components/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type DigestType = 'realtime' | 'daily' | 'weekly'
type ChannelType = 'email' | 'sms' | 'webhook'

interface Subscription {
  id: string
  recipient: string
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
    thresholdCondition: '严重及以上风险事件',
    digestType: 'realtime',
    channel: 'email',
    enabled: true,
  },
  {
    id: 'sub-002',
    recipient: '李明',
    thresholdCondition: '所有采购类风险',
    digestType: 'daily',
    channel: 'email',
    enabled: true,
  },
  {
    id: 'sub-003',
    recipient: '赵强',
    thresholdCondition: '供应商评分低于70分',
    digestType: 'realtime',
    channel: 'sms',
    enabled: true,
  },
  {
    id: 'sub-004',
    recipient: '运维团队',
    thresholdCondition: '数据源断流告警',
    digestType: 'realtime',
    channel: 'webhook',
    enabled: true,
  },
  {
    id: 'sub-005',
    recipient: '王芳',
    thresholdCondition: '合同到期提醒（30天内）',
    digestType: 'weekly',
    channel: 'email',
    enabled: true,
  },
  {
    id: 'sub-006',
    recipient: '陈静',
    thresholdCondition: '质量不合格率超5%',
    digestType: 'daily',
    channel: 'email',
    enabled: false,
  },
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

  // New subscription form state
  const [formRecipient, setFormRecipient] = useState('')
  const [formCondition, setFormCondition] = useState('')
  const [formDigest, setFormDigest] = useState<DigestType>('realtime')
  const [formChannel, setFormChannel] = useState<ChannelType>('email')

  function handleCreate() {
    if (!formRecipient.trim() || !formCondition.trim()) {
      toast.error('请填写完整信息')
      return
    }
    const newSub: Subscription = {
      id: `sub-${Date.now()}`,
      recipient: formRecipient.trim(),
      thresholdCondition: formCondition.trim(),
      digestType: formDigest,
      channel: formChannel,
      enabled: true,
    }
    setData((prev) => [...prev, newSub])
    setDialogOpen(false)
    setFormRecipient('')
    setFormCondition('')
    setFormDigest('realtime')
    setFormChannel('email')
    toast.success('订阅规则已创建')
  }

  const columns: ColumnDef<Subscription, unknown>[] = useMemo(
    () => [
      {
        accessorKey: 'recipient',
        header: '接收人',
        size: 120,
        cell: ({ row }) => (
          <span className="font-medium text-gray-900">
            {row.original.recipient}
          </span>
        ),
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
          <Badge
            variant="outline"
            className={
              row.original.enabled
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-gray-50 text-gray-500 border-gray-200'
            }
          >
            {row.original.enabled ? '启用' : '停用'}
          </Badge>
        ),
      },
    ],
    [],
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新增订阅规则</DialogTitle>
              <DialogDescription>
                配置新的通知订阅规则，设置接收人和触发条件
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label>接收人</Label>
                <Input
                  placeholder="输入接收人姓名"
                  value={formRecipient}
                  onChange={(e) => setFormRecipient(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>阈值条件</Label>
                <Input
                  placeholder="输入触发条件描述"
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
                onClick={() => setDialogOpen(false)}
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

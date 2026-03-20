/**
 * Publish Panel Component
 * FE-082: Publish and archive panel with recipients, frequency, channels, scheduling
 */

import { useState, useMemo } from 'react'
import {
  Send,
  Clock,
  Calendar,
  Users,
  Mail,
  Bell,
  MessageCircle,
  Check,
  Loader2,
  RotateCcw,
  Copy,
  Eye,
  FileText,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { toast } from 'sonner'
import type { PublishConfig } from './ReportEditor'
import type { ReportRecipient, PublishedReport } from '@/mocks/data/reports'
import { publishedReports } from '@/mocks/data/reports'
import { DataTable } from '@/components/DataTable'
import type { ColumnDef } from '@tanstack/react-table'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PublishPanelProps {
  isOpen: boolean
  onClose: () => void
  onPublish: (config: PublishConfig) => void
  recipients: ReportRecipient[]
  reportTitle: string
}

// ---------------------------------------------------------------------------
// Channel Icons
// ---------------------------------------------------------------------------

const channelIcons: Record<string, React.ReactNode> = {
  email: <Mail className="h-4 w-4" />,
  in_app: <Bell className="h-4 w-4" />,
  wechat: <MessageCircle className="h-4 w-4" />,
  dingtalk: <MessageCircle className="h-4 w-4" />,
}

const channelLabels: Record<string, string> = {
  email: '邮件',
  in_app: '站内消息',
  wechat: '企业微信',
  dingtalk: '钉钉',
}

const frequencyLabels: Record<string, string> = {
  once: '仅一次',
  daily: '每天',
  weekly: '每周',
  monthly: '每月',
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function PublishPanel({
  isOpen,
  onClose,
  onPublish,
  recipients,
}: PublishPanelProps) {
  const [_reportTitle] = useState('')
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([])
  const [selectedChannels, setSelectedChannels] = useState<('email' | 'in_app' | 'wechat' | 'dingtalk')[]>(['email', 'in_app'])
  const [schedule, setSchedule] = useState<'immediate' | 'later'>('immediate')
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(new Date())
  const [scheduledTime, setScheduledTime] = useState('09:00')
  const [frequency, setFrequency] = useState<'once' | 'daily' | 'weekly' | 'monthly'>('once')
  const [isPublishing, setIsPublishing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('publish')

  // Filter recipients by search
  const filteredRecipients = useMemo(() => {
    if (!searchQuery.trim()) return recipients
    const query = searchQuery.toLowerCase()
    return recipients.filter(
      (r) =>
        r.name.toLowerCase().includes(query) ||
        r.email.toLowerCase().includes(query) ||
        r.department.toLowerCase().includes(query) ||
        r.role.toLowerCase().includes(query)
    )
  }, [recipients, searchQuery])

  // Group recipients by department
  const groupedRecipients = useMemo(() => {
    const groups: Record<string, ReportRecipient[]> = {}
    filteredRecipients.forEach((r) => {
      if (!groups[r.department]) groups[r.department] = []
      groups[r.department].push(r)
    })
    return groups
  }, [filteredRecipients])

  // Toggle recipient selection
  const toggleRecipient = (id: string) => {
    setSelectedRecipients((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    )
  }

  // Toggle channel selection
  const toggleChannel = (channel: 'email' | 'in_app' | 'wechat' | 'dingtalk') => {
    setSelectedChannels((prev) =>
      prev.includes(channel)
        ? prev.filter((c) => c !== channel)
        : [...prev, channel]
    )
  }

  // Select all recipients in a department
  const selectDepartment = (department: string, selected: boolean) => {
    const deptRecipients = groupedRecipients[department].map((r) => r.id)
    if (selected) {
      setSelectedRecipients((prev) => [...new Set([...prev, ...deptRecipients])])
    } else {
      setSelectedRecipients((prev) => prev.filter((id) => !deptRecipients.includes(id)))
    }
  }

  // Handle publish
  const handlePublish = async () => {
    if (selectedRecipients.length === 0) {
      toast.error('请至少选择一个接收人')
      return
    }
    if (selectedChannels.length === 0) {
      toast.error('请至少选择一个发送渠道')
      return
    }

    setIsPublishing(true)
    // Simulate publish delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const config: PublishConfig = {
      recipients: selectedRecipients,
      channels: selectedChannels,
      schedule,
      ...(schedule === 'later' && scheduledDate && {
        scheduledAt: new Date(
          scheduledDate.getFullYear(),
          scheduledDate.getMonth(),
          scheduledDate.getDate(),
          parseInt(scheduledTime.split(':')[0]),
          parseInt(scheduledTime.split(':')[1])
        ).toISOString(),
      }),
      frequency,
    }

    onPublish(config)
    setIsPublishing(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>发布报告</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="publish">
              <Send className="mr-2 h-4 w-4" />
              发布配置
            </TabsTrigger>
            <TabsTrigger value="history">
              <Clock className="mr-2 h-4 w-4" />
              历史报告
            </TabsTrigger>
          </TabsList>

          <TabsContent value="publish" className="mt-4">
            <div className="flex gap-4">
              {/* Left: Recipients */}
              <Card className="flex-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    选择接收人
                    <Badge variant="secondary">
                      已选 {selectedRecipients.length} 人
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder="搜索姓名、邮箱、部门..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mb-3"
                  />
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {Object.entries(groupedRecipients).map(([dept, users]) => (
                        <div key={dept}>
                          <div className="flex items-center gap-2 mb-1">
                            <Checkbox
                              checked={users.every((u) => selectedRecipients.includes(u.id))}
                              onCheckedChange={(checked) => selectDepartment(dept, !!checked)}
                            />
                            <span className="text-xs font-medium text-muted-foreground">
                              {dept}
                            </span>
                          </div>
                          <div className="ml-6 space-y-1">
                            {users.map((user) => (
                              <div
                                key={user.id}
                                className="flex items-center gap-2 py-1"
                              >
                                <Checkbox
                                  checked={selectedRecipients.includes(user.id)}
                                  onCheckedChange={() => toggleRecipient(user.id)}
                                />
                                <div className="flex-1">
                                  <div className="text-sm">{user.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {user.role} · {user.email}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Right: Channels & Schedule */}
              <div className="w-80 space-y-4">
                {/* Channels */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">发送渠道</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {(['email', 'in_app', 'wechat', 'dingtalk'] as const).map((channel) => (
                        <div
                          key={channel}
                          className={cn(
                            'flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors',
                            selectedChannels.includes(channel)
                              ? 'bg-primary/10 border border-primary/20'
                              : 'hover:bg-muted border border-transparent'
                          )}
                          onClick={() => toggleChannel(channel)}
                        >
                          <Checkbox checked={selectedChannels.includes(channel)} />
                          <div className="flex items-center gap-2 flex-1">
                            {channelIcons[channel]}
                            <span className="text-sm">{channelLabels[channel]}</span>
                          </div>
                          {selectedChannels.includes(channel) && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Schedule */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">发送时间</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <RadioGroup
                      value={schedule}
                      onValueChange={(v) => setSchedule(v as 'immediate' | 'later')}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="immediate" id="immediate" />
                        <Label htmlFor="immediate">立即发送</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="later" id="later" />
                        <Label htmlFor="later">预约发送</Label>
                      </div>
                    </RadioGroup>

                    {schedule === 'later' && (
                      <div className="space-y-3 pl-6">
                        <div className="flex gap-2">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-36 justify-start text-left font-normal"
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                {scheduledDate ? (
                                  scheduledDate.toLocaleDateString('zh-CN')
                                ) : (
                                  <span>选择日期</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={scheduledDate}
                                onSelect={setScheduledDate}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <Input
                            type="time"
                            value={scheduledTime}
                            onChange={(e) => setScheduledTime(e.target.value)}
                            className="w-28"
                          />
                        </div>

                        <div>
                          <Label className="text-xs mb-1.5 block">发送频率</Label>
                          <div className="flex gap-2">
                            {(['once', 'daily', 'weekly', 'monthly'] as const).map((f) => (
                              <Badge
                                key={f}
                                variant={frequency === f ? 'default' : 'outline'}
                                className="cursor-pointer"
                                onClick={() => setFrequency(f)}
                              >
                                {frequencyLabels[f]}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <ReportHistoryTable />
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button
            onClick={handlePublish}
            disabled={isPublishing || selectedRecipients.length === 0}
          >
            {isPublishing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            {schedule === 'immediate' ? '立即发布' : '预约发布'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ---------------------------------------------------------------------------
// Report History Table
// ---------------------------------------------------------------------------

function ReportHistoryTable() {
  const [reports] = useState<PublishedReport[]>(publishedReports)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredReports = useMemo(() => {
    if (!searchQuery.trim()) return reports
    const query = searchQuery.toLowerCase()
    return reports.filter(
      (r) =>
        r.title.toLowerCase().includes(query) ||
        r.type.toLowerCase().includes(query)
    )
  }, [reports, searchQuery])

  const columns: ColumnDef<PublishedReport>[] = [
    {
      accessorKey: 'title',
      header: '报告名称',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.original.title}</span>
        </div>
      ),
    },
    {
      accessorKey: 'type',
      header: '类型',
      cell: ({ row }) => {
        const typeColors: Record<string, string> = {
          daily: 'bg-blue-100 text-blue-800',
          weekly: 'bg-emerald-100 text-emerald-800',
          monthly: 'bg-violet-100 text-violet-800',
          special: 'bg-amber-100 text-amber-800',
          retrospective: 'bg-rose-100 text-rose-800',
        }
        const typeLabels: Record<string, string> = {
          daily: '日报',
          weekly: '周报',
          monthly: '月报',
          special: '专题',
          retrospective: '复盘',
        }
        return (
          <Badge variant="secondary" className={typeColors[row.original.type]}>
            {typeLabels[row.original.type] || row.original.type}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'publishedAt',
      header: '发布时间',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {new Date(row.original.publishedAt).toLocaleDateString('zh-CN')}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: '状态',
      cell: ({ row }) => {
        const statusConfig: Record<string, { label: string; className: string }> = {
          published: { label: '已发布', className: 'bg-emerald-100 text-emerald-800' },
          archived: { label: '已归档', className: 'bg-gray-100 text-gray-800' },
          revoked: { label: '已撤回', className: 'bg-red-100 text-red-800' },
        }
        const config = statusConfig[row.original.status]
        return (
          <Badge variant="secondary" className={config?.className}>
            {config?.label || row.original.status}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'readCount',
      header: '阅读',
      cell: ({ row }) => (
        <span className="text-sm">{row.original.readCount} 次</span>
      ),
    },
    {
      id: 'actions',
      header: '操作',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => toast.success('查看报告', { description: row.original.title })}
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => toast.success('复制报告', { description: row.original.title })}
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
          {row.original.status === 'published' && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => toast.success('撤回报告', { description: row.original.title })}
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Input
          placeholder="搜索历史报告..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-72"
        />
        <div className="text-sm text-muted-foreground">
          共 {filteredReports.length} 个报告
        </div>
      </div>
      <DataTable
        columns={columns}
        data={filteredReports}
        showPagination={true}
        pageSize={5}
        maxHeight="350px"
      />
    </div>
  )
}

export default PublishPanel

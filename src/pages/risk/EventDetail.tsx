import { useMemo, useEffect, useState } from 'react'
import { useParams, Link } from '@tanstack/react-router'
import {
  ChevronRight,
  ArrowUpRight,
  Bell,
  Share2,
  UserCog,
  Clock,
  CalendarDays,
  User,
  Globe2,
  Hash,
  TrendingUp,
  FileText,
  Network,
  BarChart3,
  Zap,
  History,
} from 'lucide-react'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import type { RiskEvent } from '@/types/event'
import type { Severity } from '@/types/enums'
import { SeverityBadge } from '@/components/common/SeverityBadge'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { mockFullEvents, generateSources, generateActivities, riskTypeLabels } from '@/mocks/data/events'

import { EvidencePanel } from '@/components/event/EvidencePanel'
import { RelationGraph } from '@/components/event/RelationGraph'
import { ImpactPanel } from '@/components/event/ImpactPanel'
import { RecommendedActions } from '@/components/event/RecommendedActions'
import { ActivityTimeline } from '@/components/event/ActivityTimeline'

// ---------------------------------------------------------------------------
// Severity banner config
// ---------------------------------------------------------------------------

const severityBannerConfig: Record<
  Severity,
  { bg: string; border: string; text: string }
> = {
  critical: { bg: 'bg-red-600', border: 'border-red-700', text: 'text-white' },
  high: { bg: 'bg-orange-500', border: 'border-orange-600', text: 'text-white' },
  medium: { bg: 'bg-yellow-500', border: 'border-yellow-600', text: 'text-yellow-950' },
  low: { bg: 'bg-green-500', border: 'border-green-600', text: 'text-white' },
  info: { bg: 'bg-blue-500', border: 'border-blue-600', text: 'text-white' },
}

// ---------------------------------------------------------------------------
// SLA countdown
// ---------------------------------------------------------------------------

function useSLACountdown(slaDueAt?: string) {
  const [remaining, setRemaining] = useState('')
  const [isOverdue, setIsOverdue] = useState(false)

  useEffect(() => {
    if (!slaDueAt) return

    const tick = () => {
      const now = Date.now()
      const due = new Date(slaDueAt).getTime()
      const diff = due - now

      if (diff <= 0) {
        setRemaining('已超时')
        setIsOverdue(true)
        return
      }

      setIsOverdue(false)
      const hours = Math.floor(diff / 3600000)
      const minutes = Math.floor((diff % 3600000) / 60000)

      if (hours >= 24) {
        const days = Math.floor(hours / 24)
        const remHours = hours % 24
        setRemaining(`${days}天${remHours}小时`)
      } else {
        setRemaining(`${hours}小时${minutes}分钟`)
      }
    }

    tick()
    const timer = setInterval(tick, 60000)
    return () => clearInterval(timer)
  }, [slaDueAt])

  return { remaining, isOverdue }
}

// ---------------------------------------------------------------------------
// Tab config
// ---------------------------------------------------------------------------

const tabConfig = [
  { value: 'basic', label: '基础信息', icon: FileText },
  { value: 'evidence', label: '证据与来源', icon: Globe2 },
  { value: 'relations', label: '关联对象', icon: Network },
  { value: 'impact', label: '影响量化', icon: BarChart3 },
  { value: 'actions', label: '推荐动作', icon: Zap },
  { value: 'timeline', label: '活动时间线', icon: History },
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function EventDetail() {
  const { eventId } = useParams({ from: '/authenticated/risk/events/$eventId' })

  const event = useMemo(() => mockFullEvents[eventId], [eventId])
  const sources = useMemo(() => generateSources(eventId), [eventId])
  const activities = useMemo(() => {
    // Generate more activities (10+) by combining multiple rounds
    const base = generateActivities(eventId)
    const extra = generateActivities(eventId + '-extra')
    const extra2 = generateActivities(eventId + '-extra2')
    return [...base, ...extra, ...extra2]
      .map((a, i) => ({ ...a, id: `${a.id}-${i}` }))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [eventId])

  const { remaining: slaRemaining, isOverdue: slaOverdue } = useSLACountdown(event?.sla_due_at)

  if (!event) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-muted-foreground">事件未找到</p>
          <p className="text-sm text-muted-foreground">ID: {eventId}</p>
          <Button variant="outline" asChild>
            <Link to="/risk/workbench">返回风险工作台</Link>
          </Button>
        </div>
      </div>
    )
  }

  const bannerConfig = severityBannerConfig[event.severity]

  return (
    <div className="space-y-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 px-6 py-3 text-sm text-muted-foreground">
        <Link
          to="/risk/workbench"
          className="hover:text-foreground transition-colors"
        >
          风险工作台
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">事件详情</span>
      </div>

      {/* Severity Banner */}
      <div
        className={cn(
          'px-6 py-4 border-b',
          bannerConfig.bg,
          bannerConfig.border,
          bannerConfig.text,
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-2">
            {/* Title row */}
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold leading-tight">{event.title}</h1>
              <Badge
                variant="outline"
                className={cn(
                  'text-xs border-current/30',
                  bannerConfig.text,
                )}
              >
                {riskTypeLabels[event.type]}
              </Badge>
              <SeverityBadge severity={event.severity} size="sm" />
            </div>

            {/* Meta row */}
            <div className="flex items-center gap-4 flex-wrap text-sm opacity-90">
              <span className="flex items-center gap-1">
                <Hash className="h-3.5 w-3.5" />
                {event.event_id}
              </span>
              <span className="flex items-center gap-1">
                <Globe2 className="h-3.5 w-3.5" />
                来源 {event.source_count} 个
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" />
                置信度 {event.confidence}%
              </span>
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" />
                更新于 {new Date(event.updated_at).toLocaleDateString('zh-CN')}
              </span>
              <span className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                {event.owner_name}
              </span>
              {slaRemaining && (
                <span
                  className={cn(
                    'flex items-center gap-1 font-medium',
                    slaOverdue && 'animate-pulse',
                  )}
                >
                  <Clock className="h-3.5 w-3.5" />
                  SLA {slaOverdue ? '已超时' : `剩余 ${slaRemaining}`}
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-current border-0"
              onClick={() => toast.info('升级功能开发中')}
            >
              <ArrowUpRight className="mr-1 h-3.5 w-3.5" />
              升级
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-current border-0"
              onClick={() => toast.success('已订阅该事件')}
            >
              <Bell className="mr-1 h-3.5 w-3.5" />
              订阅
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-current border-0"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                toast.success('链接已复制到剪贴板')
              }}
            >
              <Share2 className="mr-1 h-3.5 w-3.5" />
              共享
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-current border-0"
              onClick={() => toast.info('编辑责任人功能开发中')}
            >
              <UserCog className="mr-1 h-3.5 w-3.5" />
              编辑责任人
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 py-4">
        <Tabs defaultValue="basic">
          <TabsList className="w-full justify-start gap-1">
            {tabConfig.map((tab) => {
              const Icon = tab.icon
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="gap-1.5"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </TabsTrigger>
              )
            })}
          </TabsList>

          {/* Basic Info */}
          <TabsContent value="basic" className="mt-4">
            <BasicInfoTab event={event} />
          </TabsContent>

          {/* Evidence */}
          <TabsContent value="evidence" className="mt-4">
            <EvidencePanel
              aiSummary={event.ai_summary}
              sources={sources}
            />
          </TabsContent>

          {/* Relations */}
          <TabsContent value="relations" className="mt-4">
            <RelationGraph
              eventTitle={event.title}
              impactObjects={event.impact_objects}
            />
          </TabsContent>

          {/* Impact */}
          <TabsContent value="impact" className="mt-4">
            <ImpactPanel />
          </TabsContent>

          {/* Actions */}
          <TabsContent value="actions" className="mt-4">
            <RecommendedActions eventSeverity={event.severity} />
          </TabsContent>

          {/* Timeline */}
          <TabsContent value="timeline" className="mt-4">
            <ActivityTimeline activities={activities} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Basic Info Sub-component
// ---------------------------------------------------------------------------

function BasicInfoTab({ event }: { event: RiskEvent }) {
  const infoItems = [
    { label: '事件 ID', value: event.event_id },
    { label: '风险类型', value: riskTypeLabels[event.type] },
    { label: '严重级别', value: <SeverityBadge severity={event.severity} size="sm" /> },
    { label: '当前状态', value: <StatusBadge status={event.status} size="sm" /> },
    { label: '置信度', value: `${event.confidence}%` },
    { label: '来源数', value: `${event.source_count} 个` },
    { label: '责任人', value: event.owner_name },
    { label: '所属区域', value: event.region },
    { label: '发生时间', value: new Date(event.occurred_at).toLocaleString('zh-CN') },
    { label: '发现时间', value: new Date(event.discovered_at).toLocaleString('zh-CN') },
    { label: '创建时间', value: new Date(event.created_at).toLocaleString('zh-CN') },
    { label: '更新时间', value: new Date(event.updated_at).toLocaleString('zh-CN') },
    { label: 'SLA 截止', value: event.sla_due_at ? new Date(event.sla_due_at).toLocaleString('zh-CN') : '-' },
    { label: '组织 ID', value: event.organization_id },
  ]

  return (
    <div className="space-y-4">
      {/* AI Summary */}
      {event.ai_summary && (
        <Card className="border-violet-200 bg-violet-50/50">
          <CardContent className="p-4">
            <p className="text-sm leading-relaxed text-violet-900">{event.ai_summary}</p>
          </CardContent>
        </Card>
      )}

      {/* Info grid */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 lg:grid-cols-3">
            {infoItems.map((item) => (
              <div key={item.label} className="space-y-1">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <div className="text-sm font-medium">
                  {typeof item.value === 'string' ? item.value : item.value}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      {event.tags.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-2">标签</p>
            <div className="flex gap-2 flex-wrap">
              {event.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Impact objects count */}
      <Card>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground mb-2">关联影响对象</p>
          <p className="text-sm font-medium">{event.impact_objects.length} 个对象</p>
          <p className="text-xs text-muted-foreground mt-1">
            切换到"关联对象"标签页查看详情
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

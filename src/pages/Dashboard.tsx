import { useState, useCallback, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts'
import {
  AlertTriangle,
  ShieldAlert,
  Clock,
  DollarSign,
  Building2,
  ArrowRight,
  FileText,
  Download,
  Eye,
  ChevronRight,
  Bell,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { toast } from 'sonner'

import { KPICard } from '@/components/common/KPICard'
import { SeverityBadge } from '@/components/common/SeverityBadge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { severity as severityTokens, brand, accent } from '@/lib/tokens/colors'
import type { Trend, Severity, ReportType } from '@/types/enums'

// ---------------------------------------------------------------------------
// Time Range
// ---------------------------------------------------------------------------

type TimeRange = '7d' | '30d' | '90d'

const TIME_RANGE_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: '7d', label: '7天' },
  { value: '30d', label: '30天' },
  { value: '90d', label: '90天' },
]

// ---------------------------------------------------------------------------
// KPI Mock Data
// ---------------------------------------------------------------------------

interface KPIItem {
  id: string
  title: string
  value: string | number
  trend: Trend
  trendLabel: string
  sparklineData: number[]
  description: string
  navigateTo: string
  icon: typeof AlertTriangle
}

const KPI_ITEMS: KPIItem[] = [
  {
    id: 'critical-events',
    title: '重大事件数',
    value: 12,
    trend: 'up',
    trendLabel: '+8.3%',
    sparklineData: [5, 7, 6, 9, 8, 11, 12],
    description: '当前未关闭的严重级别风险事件总数',
    navigateTo: '/risk/workbench',
    icon: ShieldAlert,
  },
  {
    id: 'high-risk-open',
    title: '高风险未闭环',
    value: 28,
    trend: 'down',
    trendLabel: '-3.2%',
    sparklineData: [35, 33, 30, 32, 29, 27, 28],
    description: '高危及以上级别且尚未解决的事件数量',
    navigateTo: '/risk/workbench',
    icon: AlertTriangle,
  },
  {
    id: 'sla-overdue',
    title: 'SLA 超期数',
    value: 5,
    trend: 'up',
    trendLabel: '+25%',
    sparklineData: [2, 3, 2, 4, 3, 4, 5],
    description: '超出 SLA 响应或处理时限的任务数',
    navigateTo: '/admin/sla',
    icon: Clock,
  },
  {
    id: 'order-impact',
    title: '影响订单金额',
    value: '¥4,580万',
    trend: 'down',
    trendLabel: '-12%',
    sparklineData: [5800, 5200, 5500, 4900, 4700, 4600, 4580],
    description: '受风险事件影响的关联订单总金额',
    navigateTo: '/optimization',
    icon: DollarSign,
  },
  {
    id: 'suppliers-covered',
    title: '覆盖供应商数',
    value: '1,247',
    trend: 'stable',
    trendLabel: '',
    sparklineData: [1240, 1242, 1245, 1244, 1246, 1247, 1247],
    description: '纳入风险监控的供应商总数',
    navigateTo: '/suppliers',
    icon: Building2,
  },
]

// ---------------------------------------------------------------------------
// Trend Chart Mock Data
// ---------------------------------------------------------------------------

function generateTrendData(days: number) {
  const data = []
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    data.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      critical: Math.floor(Math.random() * 5 + 2),
      high: Math.floor(Math.random() * 10 + 5),
      medium: Math.floor(Math.random() * 15 + 8),
      low: Math.floor(Math.random() * 8 + 3),
    })
  }
  return data
}

// ---------------------------------------------------------------------------
// Pie Chart Mock Data
// ---------------------------------------------------------------------------

const PIE_DATA = [
  { name: '供应中断', value: 35 },
  { name: '质量问题', value: 28 },
  { name: '合规违规', value: 18 },
  { name: '财务风险', value: 15 },
  { name: '地缘政治', value: 12 },
  { name: '自然灾害', value: 8 },
  { name: '网络安全', value: 6 },
  { name: '法规变更', value: 4 },
]

const PIE_COLORS = [
  brand[500],
  accent[500],
  severityTokens.high.DEFAULT,
  severityTokens.medium.DEFAULT,
  '#7C3AED',
  '#059669',
  '#0891B2',
  '#64748B',
]

const PIE_TOTAL = PIE_DATA.reduce((sum, d) => sum + d.value, 0)

// ---------------------------------------------------------------------------
// Bar Chart — Regional Distribution
// ---------------------------------------------------------------------------

const REGION_DATA = [
  { name: '华东', value: 45 },
  { name: '华南', value: 32 },
  { name: '华北', value: 28 },
  { name: '华中', value: 18 },
  { name: '西南', value: 12 },
  { name: '东南亚', value: 8 },
  { name: '欧洲', value: 5 },
  { name: '北美', value: 3 },
]

function getBarColor(value: number) {
  if (value >= 40) return severityTokens.critical.DEFAULT
  if (value >= 25) return severityTokens.high.DEFAULT
  if (value >= 15) return severityTokens.medium.DEFAULT
  return severityTokens.low.DEFAULT
}

// ---------------------------------------------------------------------------
// Escalation Items
// ---------------------------------------------------------------------------

interface EscalationItem {
  id: string
  title: string
  severity: Severity
  time: string
}

const ESCALATION_ITEMS: EscalationItem[] = [
  {
    id: 'ESC-001',
    title: '某核心芯片供应商产线停工',
    severity: 'critical',
    time: '10分钟前',
  },
  {
    id: 'ESC-002',
    title: '东南亚物流通道中断预警',
    severity: 'critical',
    time: '25分钟前',
  },
  {
    id: 'ESC-003',
    title: '原材料价格异常波动',
    severity: 'high',
    time: '1小时前',
  },
  {
    id: 'ESC-004',
    title: '供应商资质认证过期',
    severity: 'high',
    time: '2小时前',
  },
  {
    id: 'ESC-005',
    title: '关键零部件质检不合格批次',
    severity: 'medium',
    time: '3小时前',
  },
]

// ---------------------------------------------------------------------------
// Pending Approvals
// ---------------------------------------------------------------------------

interface ApprovalItem {
  id: string
  title: string
  caseRef: string
  submitter: string
}

const APPROVAL_ITEMS: ApprovalItem[] = [
  {
    id: 'APR-001',
    title: '切换备选供应商方案',
    caseRef: 'CASE-2024-0156',
    submitter: '张明',
  },
  {
    id: 'APR-002',
    title: '紧急采购审批',
    caseRef: 'CASE-2024-0149',
    submitter: '李薇',
  },
  {
    id: 'APR-003',
    title: '风险缓释预算申请',
    caseRef: 'CASE-2024-0162',
    submitter: '王浩',
  },
]

// ---------------------------------------------------------------------------
// Overdue Tasks
// ---------------------------------------------------------------------------

interface OverdueTask {
  id: string
  title: string
  overdueDays: number
  assignee: string
}

const OVERDUE_TASKS: OverdueTask[] = [
  {
    id: 'TSK-001',
    title: '供应商现场审核',
    overdueDays: 5,
    assignee: '赵一飞',
  },
  {
    id: 'TSK-002',
    title: '替代物料认证测试',
    overdueDays: 3,
    assignee: '孙丽',
  },
  {
    id: 'TSK-003',
    title: '风险评估报告编写',
    overdueDays: 2,
    assignee: '陈刚',
  },
  {
    id: 'TSK-004',
    title: '客户影响通知',
    overdueDays: 1,
    assignee: '周敏',
  },
]

// ---------------------------------------------------------------------------
// Reports
// ---------------------------------------------------------------------------

interface ReportItem {
  id: string
  title: string
  type: ReportType
  publishedAt: string
}

const REPORT_TYPE_LABELS: Record<string, string> = {
  daily: '日报',
  weekly: '周报',
  special: '专题',
}

const REPORT_ITEMS: ReportItem[] = [
  {
    id: 'RPT-001',
    title: '供应链风险日报 — 2026.03.20',
    type: 'daily',
    publishedAt: '2026-03-20 08:00',
  },
  {
    id: 'RPT-002',
    title: '第12周供应链风险周报',
    type: 'weekly',
    publishedAt: '2026-03-17 09:00',
  },
  {
    id: 'RPT-003',
    title: '东南亚地区供应链专题分析',
    type: 'special',
    publishedAt: '2026-03-15 14:00',
  },
  {
    id: 'RPT-004',
    title: '供应链风险日报 — 2026.03.19',
    type: 'daily',
    publishedAt: '2026-03-19 08:00',
  },
  {
    id: 'RPT-005',
    title: '半导体行业风险专题报告',
    type: 'special',
    publishedAt: '2026-03-14 10:30',
  },
]

// ---------------------------------------------------------------------------
// Custom Tooltip for Charts
// ---------------------------------------------------------------------------

function TrendChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number; color: string; name: string }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border bg-background p-3 shadow-lg">
      <p className="mb-1.5 text-xs font-medium text-muted-foreground">
        {label}
      </p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-xs">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-semibold">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

function PieChartTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    payload: { fill: string }
  }>
}) {
  if (!active || !payload?.length) return null
  const entry = payload[0]
  return (
    <div className="rounded-lg border bg-background p-3 shadow-lg">
      <div className="flex items-center gap-2 text-xs">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: entry.payload.fill }}
        />
        <span className="font-medium">{entry.name}</span>
        <span className="font-semibold">{entry.value} 件</span>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Dashboard Component
// ---------------------------------------------------------------------------

export default function Dashboard() {
  const navigate = useNavigate()
  const [timeRange, setTimeRange] = useState<TimeRange>('30d')

  const trendData = useMemo(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
    return generateTrendData(days)
  }, [timeRange])

  const handleKPIClick = useCallback(
    (to: string) => {
      navigate({ to })
    },
    [navigate],
  )

  const handleBarClick = useCallback(() => {
    navigate({ to: '/map' })
  }, [navigate])

  const handleAction = useCallback((action: string, id: string) => {
    toast.success(`${action}操作已触发`, {
      description: `目标: ${id}`,
    })
  }, [])

  const handleReportPreview = useCallback((title: string) => {
    toast.info('预览功能开发中', { description: title })
  }, [])

  const handleReportDownload = useCallback((title: string) => {
    toast.success('报告下载已开始', { description: title })
  }, [])

  return (
    <div className="space-y-6">
      {/* ----------------------------------------------------------------- */}
      {/* Header: Title + Time Range Selector                               */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            风险驾驶舱
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            供应链风险全局概览与实时监控
          </p>
        </div>

        <div className="inline-flex items-center rounded-lg border bg-muted p-1">
          {TIME_RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTimeRange(opt.value)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-all',
                timeRange === opt.value
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* FE-040: KPI Summary Cards                                         */}
      {/* ----------------------------------------------------------------- */}
      <div className="grid grid-cols-5 gap-4">
        {KPI_ITEMS.map((kpi) => (
          <KPICard
            key={kpi.id}
            title={kpi.title}
            value={kpi.value}
            trend={kpi.trend}
            trendLabel={kpi.trendLabel}
            sparklineData={kpi.sparklineData}
            description={kpi.description}
            onClick={() => handleKPIClick(kpi.navigateTo)}
          />
        ))}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* FE-041: Trend Line Chart + Risk Type Pie Chart                    */}
      {/* ----------------------------------------------------------------- */}
      <div className="grid grid-cols-3 gap-4">
        {/* Trend Line Chart — 2/3 width */}
        <Card className="col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">风险趋势</CardTitle>
                <CardDescription>按严重级别统计事件变化趋势</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart
                data={trendData}
                margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  className="text-muted-foreground"
                  interval={timeRange === '7d' ? 0 : 'preserveStartEnd'}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  className="text-muted-foreground"
                  width={32}
                />
                <RechartsTooltip
                  content={<TrendChartTooltip />}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  formatter={(value: string) => (
                    <span className="text-xs text-muted-foreground">
                      {value}
                    </span>
                  )}
                />
                <Line
                  name="严重"
                  type="monotone"
                  dataKey="critical"
                  stroke={severityTokens.critical.DEFAULT}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  name="高危"
                  type="monotone"
                  dataKey="high"
                  stroke={severityTokens.high.DEFAULT}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  name="中危"
                  type="monotone"
                  dataKey="medium"
                  stroke={severityTokens.medium.DEFAULT}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  name="低危"
                  type="monotone"
                  dataKey="low"
                  stroke={severityTokens.low.DEFAULT}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Type Pie Chart — 1/3 width */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">风险类型分布</CardTitle>
            <CardDescription>按风险类型统计事件数量</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {PIE_DATA.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <RechartsTooltip content={<PieChartTooltip />} />
                {/* Center label */}
                <text
                  x="50%"
                  y="46%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-foreground text-2xl font-bold"
                >
                  {PIE_TOTAL}
                </text>
                <text
                  x="50%"
                  y="56%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-muted-foreground text-xs"
                >
                  总事件数
                </text>
              </PieChart>
            </ResponsiveContainer>

            {/* Legend below pie */}
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5">
              {PIE_DATA.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{
                      backgroundColor: PIE_COLORS[idx % PIE_COLORS.length],
                    }}
                  />
                  <span className="truncate text-xs text-muted-foreground">
                    {item.name}
                  </span>
                  <span className="ml-auto text-xs font-medium">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* FE-042: Regional Risk Distribution (Bar Chart)                    */}
      {/* ----------------------------------------------------------------- */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">风险分布概览</CardTitle>
              <CardDescription>
                按区域统计风险事件数量，点击条形查看详情
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: '/map' })}
              className="text-xs text-muted-foreground"
            >
              查看风险地图 <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={REGION_DATA}
              layout="vertical"
              margin={{ top: 0, right: 24, left: 8, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                className="stroke-muted"
              />
              <XAxis
                type="number"
                tick={{ fontSize: 11 }}
                className="text-muted-foreground"
              />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
                width={56}
              />
              <RechartsTooltip
                formatter={(value) => [`${value} 件`, '事件数']}
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid hsl(var(--border))',
                  fontSize: '12px',
                }}
              />
              <Bar
                dataKey="value"
                radius={[0, 4, 4, 0]}
                cursor="pointer"
                onClick={handleBarClick}
              >
                {REGION_DATA.map((entry) => (
                  <Cell key={entry.name} fill={getBarColor(entry.value)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ----------------------------------------------------------------- */}
      {/* FE-043: Escalations, Approvals, Overdue Tasks                     */}
      {/* ----------------------------------------------------------------- */}
      <div className="grid grid-cols-3 gap-4">
        {/* Escalation Items */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-destructive" />
                <CardTitle className="text-base">升级事项</CardTitle>
              </div>
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-xs"
                onClick={() => navigate({ to: '/risk/workbench' })}
              >
                查看全部 <ChevronRight className="ml-0.5 h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {ESCALATION_ITEMS.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="h-full w-1 shrink-0 self-stretch rounded-full bg-destructive" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <SeverityBadge severity={item.severity} size="sm" />
                    <span className="text-xs text-muted-foreground">
                      {item.time}
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0 text-xs"
                  onClick={() => handleAction('处理', item.id)}
                >
                  处理
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-500" />
                <CardTitle className="text-base">待审批方案</CardTitle>
              </div>
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-xs"
                onClick={() => navigate({ to: '/optimization' })}
              >
                查看全部 <ChevronRight className="ml-0.5 h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {APPROVAL_ITEMS.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{item.caseRef}</span>
                    <span>|</span>
                    <span>{item.submitter}</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0 text-xs"
                  onClick={() => handleAction('审批', item.id)}
                >
                  审批
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Overdue Tasks */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <CardTitle className="text-base">超时任务</CardTitle>
              </div>
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-xs"
                onClick={() => navigate({ to: '/risk/workbench' })}
              >
                查看全部 <ChevronRight className="ml-0.5 h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {OVERDUE_TASKS.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{task.title}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs">
                    <span className="font-semibold text-destructive">
                      超期 {task.overdueDays} 天
                    </span>
                    <span className="text-muted-foreground">|</span>
                    <span className="text-muted-foreground">
                      {task.assignee}
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0 text-xs"
                  onClick={() => handleAction('催办', task.id)}
                >
                  催办
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* FE-044: Recent Reports                                            */}
      {/* ----------------------------------------------------------------- */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">最近报告</CardTitle>
            </div>
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-xs"
              onClick={() => navigate({ to: '/reports' })}
            >
              查看全部报告 <ChevronRight className="ml-0.5 h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {REPORT_ITEMS.map((report) => (
              <div
                key={report.id}
                className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {report.title}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="text-[11px]">
                      {REPORT_TYPE_LABELS[report.type] ?? report.type}
                    </Badge>
                    <span>{report.publishedAt}</span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs"
                    onClick={() => handleReportPreview(report.title)}
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    预览
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs"
                    onClick={() => handleReportDownload(report.title)}
                  >
                    <Download className="mr-1 h-3 w-3" />
                    下载
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

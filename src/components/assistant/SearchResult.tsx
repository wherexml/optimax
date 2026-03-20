/**
 * OptiMax AI Assistant - Search Result Component
 * FE-121: Natural Language Search + Search Results
 */

import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Building2,
  BarChart3,
  Calendar,
  User,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { severity } from '@/lib/tokens/colors'
import type { SearchResult } from '@/mocks/data/assistant'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SearchResultProps {
  result: SearchResult
  className?: string
}

// ---------------------------------------------------------------------------
// Animation Variants
// ---------------------------------------------------------------------------

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
}

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

function getSeverityColor(level: string) {
  switch (level) {
    case 'critical':
      return severity.critical
    case 'high':
      return severity.high
    case 'medium':
      return severity.medium
    case 'low':
      return severity.low
    default:
      return severity.info
  }
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  if (days < 30) return `${Math.floor(days / 7)}周前`
  return date.toLocaleDateString('zh-CN')
}

// ---------------------------------------------------------------------------
// Event Result Card
// ---------------------------------------------------------------------------

function EventResultCard({ event }: { event: NonNullable<SearchResult['events']>[number] }) {
  const colors = getSeverityColor(event.severity)

  return (
    <motion.div variants={itemVariants}>
      <Card className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5">
        <CardContent className="p-3">
          <div className="flex items-start gap-3">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: colors.bg }}
            >
              <AlertTriangle className="h-4 w-4" style={{ color: colors.DEFAULT }} />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-medium text-foreground truncate">
                {event.title}
              </h4>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0"
                  style={{
                    backgroundColor: colors.bg,
                    color: colors.text,
                    borderColor: colors.border,
                  }}
                >
                  {event.severity === 'critical'
                    ? '严重'
                    : event.severity === 'high'
                      ? '高危'
                      : event.severity === 'medium'
                        ? '中危'
                        : '低危'}
                </Badge>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatRelativeTime(event.occurred_at)}
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {event.owner_name}
                </span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                影响 {event.impact_count} 个对象
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Supplier Result Card
// ---------------------------------------------------------------------------

function SupplierResultCard({ supplier }: { supplier: NonNullable<SearchResult['suppliers']>[number] }) {
  const riskLevel = supplier.risk_score >= 80 ? 'high' : supplier.risk_score >= 60 ? 'medium' : 'low'
  const colors = getSeverityColor(riskLevel)

  return (
    <motion.div variants={itemVariants}>
      <Card className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5">
        <CardContent className="p-3">
          <div className="flex items-start gap-3">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: colors.bg }}
            >
              <Building2 className="h-4 w-4" style={{ color: colors.DEFAULT }} />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-medium text-foreground truncate">
                {supplier.name}
              </h4>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0"
                  style={{
                    backgroundColor: colors.bg,
                    color: colors.text,
                  }}
                >
                  风险分 {supplier.risk_score}
                </Badge>
                <span>{supplier.region}</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                当前 {supplier.current_events} 个未闭环事件
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Stats Result Card
// ---------------------------------------------------------------------------

function StatsResultCard({ stats }: { stats: NonNullable<SearchResult['stats']> }) {
  const TrendIcon = stats.trend === 'up' ? TrendingUp : stats.trend === 'down' ? TrendingDown : Minus
  const trendColor = stats.trend === 'up' ? 'text-red-500' : stats.trend === 'down' ? 'text-green-500' : 'text-gray-500'

  return (
    <motion.div variants={itemVariants}>
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{stats.total_events}</div>
              <div className="text-xs text-muted-foreground">事件总数</div>
            </div>
            <div className="text-center">
              <TrendIcon className={`h-5 w-5 mx-auto ${trendColor}`} />
              <div className="text-xs text-muted-foreground mt-1">
                {stats.trend === 'up' ? '上升趋势' : stats.trend === 'down' ? '下降趋势' : '趋于平稳'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-red-600">{stats.critical_count}</div>
              <div className="text-xs text-muted-foreground">严重</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-orange-600">{stats.high_count}</div>
              <div className="text-xs text-muted-foreground">高危</div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t text-xs text-muted-foreground text-center">
            统计周期：{stats.period}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function SearchResultComponent({ result, className }: SearchResultProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={className}
    >
      <Card className="border border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-[#2F6FED]" />
              <CardTitle className="text-sm font-semibold">
                {result.type === 'events'
                  ? '事件搜索结果'
                  : result.type === 'suppliers'
                    ? '供应商搜索结果'
                    : result.type === 'stats'
                      ? '统计分析结果'
                      : '综合搜索结果'}
              </CardTitle>
            </div>
            <Badge variant="secondary" className="text-[10px]">
              置信度 {(result.confidence * 100).toFixed(0)}%
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Summary */}
          <motion.p
            variants={itemVariants}
            className="text-sm text-foreground leading-relaxed"
          >
            {result.summary}
          </motion.p>

          {/* Event Results */}
          {result.events && result.events.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                相关事件 ({result.events.length})
              </h4>
              <div className="space-y-2">
                {result.events.map((event) => (
                  <EventResultCard key={event.event_id} event={event} />
                ))}
              </div>
            </div>
          )}

          {/* Supplier Results */}
          {result.suppliers && result.suppliers.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                相关供应商 ({result.suppliers.length})
              </h4>
              <div className="space-y-2">
                {result.suppliers.map((supplier) => (
                  <SupplierResultCard key={supplier.supplier_id} supplier={supplier} />
                ))}
              </div>
            </div>
          )}

          {/* Stats Results */}
          {result.stats && <StatsResultCard stats={result.stats} />}

          {/* Data Timestamp */}
          <motion.div variants={itemVariants} className="pt-2 text-xs text-muted-foreground text-right">
            数据更新时间：{new Date(result.data_timestamp).toLocaleString('zh-CN')}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default SearchResultComponent

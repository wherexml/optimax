import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Lightbulb,
  FileSearch,
  Target,
  AlertTriangle,
  History,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SeverityBadge } from '@/components/common/SeverityBadge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

import type {
  MappingSuggestion,
  SeveritySuggestion,
  SimilarCase,
} from '@/mocks/data/suggestions'
import {
  getConfidenceColor,
  getConfidenceBorderColor,
} from '@/mocks/data/suggestions'
import type { Severity } from '@/types/enums'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AISuggestionPanelProps {
  eventId: string
  mappingSuggestions: MappingSuggestion[]
  severitySuggestion: SeveritySuggestion | null
  similarCases: SimilarCase[]
  onAcceptMapping?: (suggestionId: string) => void
  onRejectMapping?: (suggestionId: string) => void
  onAcceptSeverity?: () => void
  onRejectSeverity?: () => void
  onViewCaseDetail?: (caseId: string) => void
}

interface SuggestionCardProps {
  confidence: number
  title: string
  subtitle?: string
  children: React.ReactNode
  onAccept?: () => void
  onReject?: () => void
  onViewReason?: () => void
  expandable?: boolean
  defaultExpanded?: boolean
}

// ---------------------------------------------------------------------------
// Suggestion Card Component
// ---------------------------------------------------------------------------

function SuggestionCard({
  confidence,
  title,
  subtitle,
  children,
  onAccept,
  onReject,
  onViewReason,
  expandable = false,
  defaultExpanded = true,
}: SuggestionCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const confidenceClass = getConfidenceColor(confidence)
  const borderClass = getConfidenceBorderColor(confidence)

  return (
    <Card className={`border ${borderClass} overflow-hidden`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              <Badge
                variant="secondary"
                className={`text-xs ${confidenceClass}`}
              >
                置信度 {confidence}%
              </Badge>
            </div>
            {subtitle && (
              <CardDescription className="mt-1 text-xs">
                {subtitle}
              </CardDescription>
            )}
          </div>
          {expandable && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="pt-0">
              {children}
              <div className="mt-3 flex items-center gap-2">
                {onAccept && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1 text-xs text-green-600 hover:bg-green-50 hover:text-green-700"
                    onClick={onAccept}
                  >
                    <ThumbsUp className="h-3 w-3" />
                    采纳
                  </Button>
                )}
                {onReject && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={onReject}
                  >
                    <ThumbsDown className="h-3 w-3" />
                    拒绝
                  </Button>
                )}
                {onViewReason && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 gap-1 text-xs"
                    onClick={onViewReason}
                  >
                    <FileSearch className="h-3 w-3" />
                    查看依据
                  </Button>
                )}
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Reason Dialog
// ---------------------------------------------------------------------------

interface ReasonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  reason: string
}

function ReasonDialog({ open, onOpenChange, title, reason }: ReasonDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            AI 分析依据
          </DialogTitle>
          <DialogDescription>{title}</DialogDescription>
        </DialogHeader>
        <div className="rounded-lg bg-muted p-4">
          <p className="text-sm leading-relaxed">{reason}</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function AISuggestionPanel({
  eventId: _eventId,
  mappingSuggestions,
  severitySuggestion,
  similarCases,
  onAcceptMapping,
  onRejectMapping,
  onAcceptSeverity,
  onRejectSeverity,
  onViewCaseDetail,
}: AISuggestionPanelProps) {
  const [reasonDialogOpen, setReasonDialogOpen] = useState(false)
  const [reasonDialogTitle, setReasonDialogTitle] = useState('')
  const [reasonDialogContent, setReasonDialogContent] = useState('')

  const handleViewReason = (title: string, reason: string) => {
    setReasonDialogTitle(title)
    setReasonDialogContent(reason)
    setReasonDialogOpen(true)
  }

  const handleAcceptMapping = (suggestionId: string) => {
    onAcceptMapping?.(suggestionId)
    toast.success('已采纳映射建议')
  }

  const handleRejectMapping = (suggestionId: string) => {
    onRejectMapping?.(suggestionId)
    toast.info('已拒绝映射建议')
  }

  const handleAcceptSeverity = () => {
    onAcceptSeverity?.()
    toast.success('已采纳级别建议')
  }

  const handleRejectSeverity = () => {
    onRejectSeverity?.()
    toast.info('已拒绝级别建议')
  }

  const hasSuggestions =
    mappingSuggestions.length > 0 ||
    severitySuggestion ||
    similarCases.length > 0

  if (!hasSuggestions) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Lightbulb className="h-10 w-10 text-muted-foreground/50" />
          <p className="mt-3 text-sm text-muted-foreground">
            暂无 AI 建议
          </p>
          <p className="text-xs text-muted-foreground/70">
            系统正在分析相关数据...
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-amber-500" />
        <h3 className="text-sm font-semibold">AI 智能建议</h3>
      </div>

      <ScrollArea className="max-h-[400px]">
        <div className="space-y-3 pr-3">
          {/* Mapping Suggestions */}
          {mappingSuggestions.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Target className="h-3.5 w-3.5" />
                <span>映射建议</span>
              </div>
              {mappingSuggestions.map((suggestion) => (
                <SuggestionCard
                  key={suggestion.id}
                  confidence={suggestion.confidence}
                  title={suggestion.objectName}
                  subtitle={`${getObjectTypeLabel(suggestion.objectType)} · ${suggestion.objectId}`}
                  onAccept={() => handleAcceptMapping(suggestion.id)}
                  onReject={() => handleRejectMapping(suggestion.id)}
                  onViewReason={() =>
                    handleViewReason(
                      `映射建议：${suggestion.objectName}`,
                      suggestion.reason
                    )
                  }
                >
                  <p className="text-xs text-muted-foreground">
                    {suggestion.reason}
                  </p>
                </SuggestionCard>
              ))}
            </div>
          )}

          {mappingSuggestions.length > 0 && severitySuggestion && <Separator />}

          {/* Severity Suggestion */}
          {severitySuggestion && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>级别建议</span>
              </div>
              <SuggestionCard
                confidence={severitySuggestion.confidence}
                title="风险级别调整建议"
                subtitle={`建议从 ${getSeverityLabel(severitySuggestion.currentSeverity)} 调整为 ${getSeverityLabel(severitySuggestion.suggestedSeverity)}`}
                onAccept={handleAcceptSeverity}
                onReject={handleRejectSeverity}
                onViewReason={() =>
                  handleViewReason(
                    '级别调整建议',
                    severitySuggestion.reason
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">当前</div>
                    <SeverityBadge
                      severity={severitySuggestion.currentSeverity}
                      size="sm"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="h-px bg-border" />
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">建议</div>
                    <SeverityBadge
                      severity={severitySuggestion.suggestedSeverity}
                      size="sm"
                    />
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {severitySuggestion.reason}
                </p>
              </SuggestionCard>
            </div>
          )}

          {(mappingSuggestions.length > 0 || severitySuggestion) &&
            similarCases.length > 0 && <Separator />}

          {/* Similar Cases */}
          {similarCases.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <History className="h-3.5 w-3.5" />
                <span>相似案例</span>
              </div>
              {similarCases.map((caseItem) => (
                <Card
                  key={caseItem.id}
                  className="cursor-pointer transition-colors hover:bg-muted/50"
                  onClick={() => onViewCaseDetail?.(caseItem.eventId)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium">
                            {caseItem.title}
                          </span>
                          <Badge
                            variant="secondary"
                            className="text-xs shrink-0"
                          >
                            相似度 {caseItem.similarity}%
                          </Badge>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <SeverityBadge
                            severity={caseItem.severity}
                            size="sm"
                          />
                          <span>|</span>
                          <span>{caseItem.status}</span>
                          <span>|</span>
                          <span>处置 {caseItem.resolutionDays} 天</span>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                          {caseItem.outcome}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Reason Dialog */}
      <ReasonDialog
        open={reasonDialogOpen}
        onOpenChange={setReasonDialogOpen}
        title={reasonDialogTitle}
        reason={reasonDialogContent}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getObjectTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    supplier: '供应商',
    material: '物料',
    order: '订单',
    site: '站点',
    region: '区域',
    customer: '客户',
  }
  return labels[type] ?? type
}

function getSeverityLabel(severity: Severity): string {
  const labels: Record<Severity, string> = {
    critical: '严重',
    high: '高危',
    medium: '中危',
    low: '低危',
    info: '信息',
  }
  return labels[severity] ?? severity
}

export default AISuggestionPanel

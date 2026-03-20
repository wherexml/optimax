/**
 * OptiMax AI Assistant - Explanation Card Component
 * FE-121: Natural Language Search + Explanation Cards
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Lightbulb,
  Database,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import type { ExplanationData } from '@/mocks/data/assistant'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ExplanationCardProps {
  explanation: ExplanationData
  className?: string
}

// ---------------------------------------------------------------------------
// Animation Variants
// ---------------------------------------------------------------------------

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
}

const contentVariants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: { height: 'auto', opacity: 1 },
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ExplanationCard({ explanation, className }: ExplanationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { copied, copyToClipboard } = useCopyToClipboard()

  const handleCopyConclusion = () => {
    copyToClipboard(explanation.conclusion)
  }

  const confidenceColor =
    explanation.confidence >= 0.9
      ? 'bg-green-100 text-green-700'
      : explanation.confidence >= 0.7
        ? 'bg-yellow-100 text-yellow-700'
        : 'bg-orange-100 text-orange-700'

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      className={className}
    >
      <Card className="border-l-4 border-l-[#2F6FED]">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2F6FED]/10">
                <Lightbulb className="h-4 w-4 text-[#2F6FED]" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">AI 分析结论</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  基于多维度数据智能分析
                </p>
              </div>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={handleCopyConclusion}
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <span className="text-xs font-medium text-muted-foreground">
                      复制
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{copied ? '已复制' : '复制结论'}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Conclusion */}
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm font-medium text-foreground">
              {explanation.conclusion}
            </p>
          </div>

          {/* Confidence Badge */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={confidenceColor}>
              置信度 {(explanation.confidence * 100).toFixed(0)}%
            </Badge>
            {explanation.related_events && explanation.related_events.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {explanation.related_events.length} 个关联事件
              </Badge>
            )}
          </div>

          {/* Expandable Content */}
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-full justify-between text-xs font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <span className="flex items-center gap-2">
                <Info className="h-3.5 w-3.5" />
                查看推理过程与数据来源
              </span>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>

            {isExpanded && (
              <motion.div
                initial="collapsed"
                animate="expanded"
                variants={contentVariants}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-3 space-y-4">
                  {/* Reasoning */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Lightbulb className="h-3.5 w-3.5 text-[#2F6FED]" />
                      推理依据
                    </h4>
                    <ul className="space-y-1.5">
                      {explanation.reasoning.map((reason, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-xs text-muted-foreground"
                        >
                          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#2F6FED]/10 text-[10px] font-medium text-[#2F6FED]">
                            {index + 1}
                          </span>
                          <span className="pt-0.5">{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Data Sources */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Database className="h-3.5 w-3.5 text-[#2E8B57]" />
                      数据来源
                    </h4>
                    <ul className="space-y-1">
                      {explanation.data_sources.map((source, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-xs text-muted-foreground"
                        >
                          <CheckCircle className="h-3 w-3 text-[#2E8B57]" />
                          {source}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Related Events */}
                  {explanation.related_events &&
                    explanation.related_events.length > 0 && (
                      <>
                        <div className="space-y-2">
                          <h4 className="text-xs font-semibold text-foreground">
                            关联事件
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {explanation.related_events.map((eventId) => (
                              <Badge
                                key={eventId}
                                variant="secondary"
                                className="cursor-pointer text-xs"
                              >
                                {eventId}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default ExplanationCard

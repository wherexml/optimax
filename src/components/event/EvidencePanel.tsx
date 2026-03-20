import { useState, useMemo } from 'react'
import {
  Sparkles,
  Globe,
  ExternalLink,
  ChevronDown,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import type { EventSource } from '@/types/event'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface EvidencePanelProps {
  aiSummary?: string
  sources: EventSource[]
  className?: string
}

// ---------------------------------------------------------------------------
// Language badge config
// ---------------------------------------------------------------------------

const langLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  zh: { label: '中文', variant: 'default' },
  en: { label: 'English', variant: 'secondary' },
  ja: { label: '日本語', variant: 'outline' },
}

function getCredibilityColor(score: number): string {
  if (score >= 85) return 'bg-green-500'
  if (score >= 70) return 'bg-yellow-500'
  return 'bg-orange-500'
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function EvidencePanel({ aiSummary, sources, className }: EvidencePanelProps) {
  const [expandedSource, setExpandedSource] = useState<string | null>(null)

  const sortedSources = useMemo(
    () => [...sources].sort((a, b) => b.credibility - a.credibility),
    [sources],
  )

  return (
    <div className={cn('space-y-4', className)}>
      {/* AI Summary Card */}
      {aiSummary && (
        <Accordion type="single" collapsible defaultValue="ai-summary">
          <AccordionItem value="ai-summary" className="border rounded-lg">
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-100">
                  <Sparkles className="h-3.5 w-3.5 text-violet-600" />
                </div>
                <span className="text-sm font-semibold">AI 分析摘要</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="rounded-md bg-violet-50 p-3 text-sm leading-relaxed text-violet-900">
                {aiSummary}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {/* Sources List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe className="h-4 w-4 text-muted-foreground" />
            情报来源
            <Badge variant="secondary" className="ml-1 text-xs">
              {sources.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {sortedSources.map((source, idx) => {
            const langConfig = langLabels[source.language] ?? {
              label: source.language,
              variant: 'outline' as const,
            }
            const isExpanded = expandedSource === source.source_id

            return (
              <div key={source.source_id}>
                {idx > 0 && <Separator className="mb-3" />}
                <div className="space-y-2">
                  {/* Source header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{source.name}</span>
                      <Badge variant={langConfig.variant} className="text-[10px] px-1.5 py-0">
                        {langConfig.label}
                      </Badge>
                    </div>
                    {source.url && (
                      <Button variant="ghost" size="sm" className="h-6 px-2" asChild>
                        <a href={source.url} target="_blank" rel="noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    )}
                  </div>

                  {/* Credibility */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-16 shrink-0">
                      可信度
                    </span>
                    <Progress
                      value={source.credibility}
                      className={cn('h-1.5 flex-1', '[&>div]:' + getCredibilityColor(source.credibility))}
                    />
                    <span className="text-xs font-medium w-8 text-right">
                      {source.credibility}%
                    </span>
                  </div>

                  {/* Published time */}
                  <p className="text-xs text-muted-foreground">
                    发布时间：{new Date(source.published_at).toLocaleString('zh-CN')}
                  </p>

                  {/* Excerpt */}
                  {source.excerpt && (
                    <div>
                      <button
                        onClick={() =>
                          setExpandedSource(isExpanded ? null : source.source_id)
                        }
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        原文预览
                        <ChevronDown
                          className={cn(
                            'h-3 w-3 transition-transform duration-200',
                            isExpanded && 'rotate-180',
                          )}
                        />
                      </button>
                      {isExpanded && (
                        <div className="mt-1.5 rounded-md bg-muted/50 p-2.5 text-xs leading-relaxed text-muted-foreground">
                          {source.excerpt}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}

import { Shield } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { Severity } from '@/types/enums'
import { severity as severityTokens } from '@/lib/tokens/colors'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type BadgeSize = 'sm' | 'md' | 'lg'

interface SeverityBadgeProps {
  /** Severity level */
  severity: Severity
  /** Display size */
  size?: BadgeSize
  /** Additional className */
  className?: string
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const severityConfig: Record<
  Severity,
  { label: string; bg: string; text: string; border: string; showIcon: boolean }
> = {
  critical: {
    label: '严重',
    bg: severityTokens.critical.DEFAULT,
    text: '#FFFFFF',
    border: severityTokens.critical.DEFAULT,
    showIcon: true,
  },
  high: {
    label: '高危',
    bg: severityTokens.high.DEFAULT,
    text: '#FFFFFF',
    border: severityTokens.high.DEFAULT,
    showIcon: false,
  },
  medium: {
    label: '中危',
    bg: severityTokens.medium.DEFAULT,
    text: '#422006',
    border: severityTokens.medium.DEFAULT,
    showIcon: false,
  },
  low: {
    label: '低危',
    bg: severityTokens.low.DEFAULT,
    text: '#FFFFFF',
    border: severityTokens.low.DEFAULT,
    showIcon: false,
  },
  info: {
    label: '信息',
    bg: severityTokens.info.DEFAULT,
    text: '#FFFFFF',
    border: severityTokens.info.DEFAULT,
    showIcon: false,
  },
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-[11px] gap-0.5',
  md: 'px-2 py-0.5 text-xs gap-1',
  lg: 'px-2.5 py-1 text-sm gap-1.5',
}

const iconSizes: Record<BadgeSize, string> = {
  sm: 'h-3 w-3',
  md: 'h-3.5 w-3.5',
  lg: 'h-4 w-4',
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SeverityBadge({
  severity,
  size = 'md',
  className,
}: SeverityBadgeProps) {
  const config = severityConfig[severity]

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md font-semibold',
        sizeClasses[size],
        className
      )}
      style={{
        backgroundColor: config.bg,
        color: config.text,
        borderColor: config.border,
      }}
    >
      {config.showIcon && <Shield className={iconSizes[size]} />}
      {config.label}
    </span>
  )
}

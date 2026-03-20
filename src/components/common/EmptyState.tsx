import { type LucideIcon, Inbox, SearchX, Lock, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type EmptyStateVariant = 'default' | 'search' | 'permission' | 'expired'

interface EmptyStateProps {
  icon?: LucideIcon
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  variant?: EmptyStateVariant
  className?: string
}

const variantConfig: Record<
  EmptyStateVariant,
  { icon: LucideIcon; title: string; description: string }
> = {
  default: {
    icon: Inbox,
    title: '暂无数据',
    description: '当前没有可显示的内容',
  },
  search: {
    icon: SearchX,
    title: '未找到匹配结果',
    description: '尝试调整筛选条件',
  },
  permission: {
    icon: Lock,
    title: '无权访问',
    description: '请联系管理员获取访问权限',
  },
  expired: {
    icon: Clock,
    title: '数据已过期',
    description: '请刷新页面获取最新数据',
  },
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  variant = 'default',
  className,
}: EmptyStateProps) {
  const config = variantConfig[variant]
  const Icon = icon ?? config.icon
  const displayTitle = title ?? config.title
  const displayDescription = description ?? config.description

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 text-center',
        className,
      )}
    >
      <Icon className="h-12 w-12 text-muted-foreground/50" strokeWidth={1.5} />
      <h3 className="mt-4 text-base font-semibold text-foreground">
        {displayTitle}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">{displayDescription}</p>
      {actionLabel && onAction && (
        <Button className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

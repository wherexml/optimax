/**
 * ShortcutHelpModal Component
 * FE-151: Global Shortcut System
 *
 * Displays all registered keyboard shortcuts
 * Accessible via Shift+? (question mark key)
 */

import { useMemo, useState, useCallback } from 'react'
import { Keyboard, Command, ArrowRight } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { isMac } from '@/hooks/useHotkeys'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Hook: useShortcutHelp (moved to top for proper export)
// ---------------------------------------------------------------------------

interface UseShortcutHelpReturn {
  /** Whether the help modal is open */
  isOpen: boolean
  /** Open the help modal */
  openHelp: () => void
  /** Close the help modal */
  closeHelp: () => void
  /** Toggle the help modal */
  toggleHelp: () => void
}

/**
 * Hook to manage the shortcut help modal state
 *
 * @example
 * const { isOpen, openHelp, closeHelp, toggleHelp } = useShortcutHelp()
 *
 * // In your component:
 * <ShortcutHelpModal open={isOpen} onOpenChange={closeHelp} />
 */
export function useShortcutHelp(): UseShortcutHelpReturn {
  const [isOpen, setIsOpen] = useState(false)

  const openHelp = useCallback(() => setIsOpen(true), [])
  const closeHelp = useCallback(() => setIsOpen(false), [])
  const toggleHelp = useCallback(() => setIsOpen((prev) => !prev), [])

  return {
    isOpen,
    openHelp,
    closeHelp,
    toggleHelp,
  }
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ShortcutDefinition {
  combo: string
  description: string
  category: 'navigation' | 'action' | 'global'
}

interface ShortcutHelpModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// ---------------------------------------------------------------------------
// Default Shortcuts (built-in)
// ---------------------------------------------------------------------------

const DEFAULT_SHORTCUTS: ShortcutDefinition[] = [
  // Global
  { combo: 'ctrl+k', description: '打开全局搜索', category: 'global' },
  { combo: 'alt+n', description: '打开消息中心', category: 'global' },
  { combo: 'alt+h', description: '返回首页', category: 'global' },
  { combo: 'shift+?', description: '显示快捷键帮助', category: 'global' },
  { combo: 'ctrl+shift+a', description: '打开 AI 智能助手', category: 'global' },

  // Navigation
  { combo: 'alt+w', description: '跳转到工作台', category: 'navigation' },
  { combo: 'alt+m', description: '跳转到风险地图', category: 'navigation' },
  { combo: 'alt+r', description: '跳转到报告中心', category: 'navigation' },

  // Actions
  { combo: 'esc', description: '关闭弹窗/抽屉', category: 'action' },
  { combo: 'enter', description: '确认/提交', category: 'action' },
]

// ---------------------------------------------------------------------------
// Category Configuration
// ---------------------------------------------------------------------------

const CATEGORY_CONFIG = {
  global: {
    label: '全局操作',
    color: 'bg-blue-500/10 text-blue-600 border-blue-200',
    icon: Command,
  },
  navigation: {
    label: '页面导航',
    color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
    icon: ArrowRight,
  },
  action: {
    label: '快捷操作',
    color: 'bg-amber-500/10 text-amber-600 border-amber-200',
    icon: Keyboard,
  },
} as const

// ---------------------------------------------------------------------------
// Platform-aware Key Display
// ---------------------------------------------------------------------------

function PlatformKey({ key: keyLabel }: { key: string }) {
  const isMacPlatform = isMac()

  // Map special keys to platform-specific display
  const keyMap: Record<string, React.ReactNode> = {
    cmd: isMacPlatform ? ( '⌘'
    ) : (
      <span className="text-[10px]">Ctrl</span>
    ),
    ctrl: isMacPlatform ? ( '⌃'
    ) : (
      <span className="text-[10px]">Ctrl</span>
    ),
    alt: isMacPlatform ? ( '⌥'
    ) : (
      <span className="text-[10px]">Alt</span>
    ),
    shift: isMacPlatform ? ( '⇧'
    ) : (
      <span className="text-[10px]">Shift</span>
    ),
    k: 'K',
    n: 'N',
    h: 'H',
    w: 'W',
    m: 'M',
    r: 'R',
    '?': '?',
    escape: 'Esc',
    enter: ( 'Enter'
    ),
  }

  const display = keyMap[keyLabel.toLowerCase()] || keyLabel.toUpperCase()

  return (
    <kbd
      className={cn(
        'inline-flex h-6 min-w-6 items-center justify-center rounded border px-1.5 font-mono text-xs font-medium',
        'border-neutral-200 bg-white text-neutral-700 shadow-sm',
        'dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
      )}
    >
      {display}
    </kbd>
  )
}

// ---------------------------------------------------------------------------
// Shortcut Row Component
// ---------------------------------------------------------------------------

function ShortcutRow({ shortcut }: { shortcut: ShortcutDefinition }) {
  const parts = shortcut.combo.toLowerCase().split('+')

  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-sm text-neutral-700 dark:text-neutral-300">
        {shortcut.description}
      </span>
      <div className="flex items-center gap-1">
        {parts.map((part, index) => (
          <div key={index} className="flex items-center gap-1">
            <PlatformKey key={part} />
            {index < parts.length - 1 && (
              <span className="text-neutral-400">+</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Category Section Component
// ---------------------------------------------------------------------------

function CategorySection({
  category,
  shortcuts,
}: {
  category: keyof typeof CATEGORY_CONFIG
  shortcuts: ShortcutDefinition[]
}) {
  const config = CATEGORY_CONFIG[category]
  const Icon = config.icon

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-neutral-500" />
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          {config.label}
        </h3>
        <Badge variant="outline" className={cn('text-xs', config.color)}>
          {shortcuts.length}
        </Badge>
      </div>
      <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
        {shortcuts.map((shortcut) => (
          <ShortcutRow key={shortcut.combo} shortcut={shortcut} />
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function ShortcutHelpModal({ open, onOpenChange }: ShortcutHelpModalProps) {
  const groupedShortcuts = useMemo(() => {
    const groups: Record<string, ShortcutDefinition[]> = {
      global: [],
      navigation: [],
      action: [],
    }

    DEFAULT_SHORTCUTS.forEach((shortcut) => {
      if (groups[shortcut.category]) {
        groups[shortcut.category].push(shortcut)
      }
    })

    return groups
  }, [])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-900/20">
              <Keyboard className="h-4 w-4 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <DialogTitle className="text-base">快捷键帮助</DialogTitle>
              <DialogDescription className="sr-only">
                查看所有可用的键盘快捷键
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 pr-4">
            {/* Global Shortcuts */}
            {groupedShortcuts.global.length > 0 && (
              <CategorySection
                category="global"
                shortcuts={groupedShortcuts.global}
              />
            )}

            {/* Navigation Shortcuts */}
            {groupedShortcuts.navigation.length > 0 && (
              <CategorySection
                category="navigation"
                shortcuts={groupedShortcuts.navigation}
              />
            )}

            {/* Action Shortcuts */}
            {groupedShortcuts.action.length > 0 && (
              <CategorySection
                category="action"
                shortcuts={groupedShortcuts.action}
              />
            )}

            {/* Platform Tip */}
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-800/50">
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                <span className="font-medium">提示：</span>
                {isMac()
                  ? '在 macOS 上，Cmd (⌘) 键作为主要修饰键；在 Windows 上，Ctrl 键作为主要修饰键。'
                  : '在 Windows 上，Ctrl 键作为主要修饰键；在 macOS 上，Cmd (⌘) 键作为主要修饰键。'}
              </p>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            关闭
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ShortcutHelpModal

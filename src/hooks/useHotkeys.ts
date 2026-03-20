/**
 * useHotkeys Hook
 * FE-151: Global Shortcut System
 *
 * Centralized keyboard shortcut management using native events
 * Provides declarative API for registering shortcuts
 */

import { useEffect, useRef } from 'react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type KeyCombo = string

type ShortcutHandler = (event: KeyboardEvent) => void

interface ShortcutConfig {
  /** Key combination (e.g., 'ctrl+k', 'alt+n', '?') */
  combo: KeyCombo
  /** Handler function */
  handler: ShortcutHandler
  /** Whether the shortcut is enabled */
  enabled?: boolean
  /** Prevent default browser behavior */
  preventDefault?: boolean
  /** Stop event propagation */
  stopPropagation?: boolean
  /** Description for help modal */
  description: string
  /** Category for grouping in help modal */
  category?: 'navigation' | 'action' | 'global'
}

interface RegisteredShortcut extends ShortcutConfig {
  id: string
}

// ---------------------------------------------------------------------------
// Global Registry (singleton)
// ---------------------------------------------------------------------------

class HotkeyRegistry {
  private shortcuts: Map<string, RegisteredShortcut> = new Map()
  private isListening = false

  register(shortcut: RegisteredShortcut): () => void {
    this.shortcuts.set(shortcut.id, shortcut)
    this.ensureListening()
    return () => this.unregister(shortcut.id)
  }

  unregister(id: string): void {
    this.shortcuts.delete(id)
    if (this.shortcuts.size === 0) {
      this.stopListening()
    }
  }

  private ensureListening(): void {
    if (!this.isListening) {
      document.addEventListener('keydown', this.handleKeyDown)
      this.isListening = true
    }
  }

  private stopListening(): void {
    if (this.isListening) {
      document.removeEventListener('keydown', this.handleKeyDown)
      this.isListening = false
    }
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    const combo = this.normalizeEvent(event)

    for (const shortcut of this.shortcuts.values()) {
      if (!shortcut.enabled) continue

      if (this.matchesCombo(combo, shortcut.combo)) {
        if (shortcut.preventDefault !== false) {
          event.preventDefault()
        }
        if (shortcut.stopPropagation) {
          event.stopPropagation()
        }
        shortcut.handler(event)
        break
      }
    }
  }

  private normalizeEvent(event: KeyboardEvent): string {
    const parts: string[] = []

    if (event.metaKey) parts.push('cmd')
    if (event.ctrlKey) parts.push('ctrl')
    if (event.altKey) parts.push('alt')
    if (event.shiftKey) parts.push('shift')

    const key = event.key.toLowerCase()
    if (!['meta', 'control', 'alt', 'shift'].includes(key)) {
      parts.push(key)
    }

    return parts.join('+')
  }

  private matchesCombo(input: string, target: string): boolean {
    return input === target.toLowerCase()
  }

  getAllShortcuts(): RegisteredShortcut[] {
    return Array.from(this.shortcuts.values())
  }
}

// Singleton instance
const registry = new HotkeyRegistry()

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

interface UseHotkeysOptions {
  /** Shortcut configurations */
  shortcuts: ShortcutConfig[]
  /** Unique identifier for this hook instance */
  scope?: string
}

/**
 * Register keyboard shortcuts
 *
 * @example
 * useHotkeys({
 *   shortcuts: [
 *     { combo: 'ctrl+k', handler: () => openSearch(), description: '全局搜索' },
 *     { combo: 'alt+n', handler: () => openNotifications(), description: '消息中心' },
 *   ]
 * })
 */
export function useHotkeys({ shortcuts, scope = 'default' }: UseHotkeysOptions): void {
  const shortcutsRef = useRef(shortcuts)

  // Update ref when shortcuts change
  useEffect(() => {
    shortcutsRef.current = shortcuts
  }, [shortcuts])

  useEffect(() => {
    const cleanupFns: (() => void)[] = []

    shortcuts.forEach((config, index) => {
      const id = `${scope}-${index}-${config.combo}`
      const unregister = registry.register({
        ...config,
        id,
        enabled: config.enabled ?? true,
        preventDefault: config.preventDefault ?? true,
      })
      cleanupFns.push(unregister)
    })

    return () => {
      cleanupFns.forEach((fn) => fn())
    }
  }, [scope, shortcuts])
}

// ---------------------------------------------------------------------------
// Single shortcut hook
// ---------------------------------------------------------------------------

interface UseHotkeyOptions {
  combo: KeyCombo
  handler: ShortcutHandler
  enabled?: boolean
  preventDefault?: boolean
  stopPropagation?: boolean
  description: string
  category?: 'navigation' | 'action' | 'global'
}

/**
 * Register a single keyboard shortcut
 *
 * @example
 * useHotkey({
 *   combo: 'ctrl+k',
 *   handler: () => openSearch(),
 *   description: '全局搜索'
 * })
 */
export function useHotkey(options: UseHotkeyOptions): void {
  useHotkeys({
    shortcuts: [options],
    scope: 'single',
  })
}

// ---------------------------------------------------------------------------
// Utility: Check if modifier keys are pressed
// ---------------------------------------------------------------------------

export function isModifierPressed(
  event: KeyboardEvent,
  modifiers: { ctrl?: boolean; alt?: boolean; shift?: boolean; meta?: boolean }
): boolean {
  if (modifiers.ctrl !== undefined && event.ctrlKey !== modifiers.ctrl) return false
  if (modifiers.alt !== undefined && event.altKey !== modifiers.alt) return false
  if (modifiers.shift !== undefined && event.shiftKey !== modifiers.shift) return false
  if (modifiers.meta !== undefined && event.metaKey !== modifiers.meta) return false
  return true
}

// ---------------------------------------------------------------------------
// Utility: Parse key combo
// ---------------------------------------------------------------------------

export function parseKeyCombo(combo: string): {
  key: string
  ctrl: boolean
  alt: boolean
  shift: boolean
  meta: boolean
} {
  const parts = combo.toLowerCase().split('+')
  return {
    key: parts.find((p) => !['ctrl', 'alt', 'shift', 'cmd', 'meta'].includes(p)) || '',
    ctrl: parts.includes('ctrl'),
    alt: parts.includes('alt'),
    shift: parts.includes('shift'),
    meta: parts.includes('cmd') || parts.includes('meta'),
  }
}

// ---------------------------------------------------------------------------
// Utility: Format combo for display
// ---------------------------------------------------------------------------

export function formatKeyCombo(combo: string): string {
  const parsed = parseKeyCombo(combo)
  const parts: string[] = []

  if (parsed.meta) parts.push('⌘')
  if (parsed.ctrl) parts.push('Ctrl')
  if (parsed.alt) parts.push('Alt')
  if (parsed.shift) parts.push('Shift')

  // Special key formatting
  const keyMap: Record<string, string> = {
    k: 'K',
    n: 'N',
    h: 'H',
    '?': '?',
    escape: 'Esc',
    enter: 'Enter',
    tab: 'Tab',
    space: 'Space',
    arrowup: '↑',
    arrowdown: '↓',
    arrowleft: '←',
    arrowright: '→',
  }

  parts.push(keyMap[parsed.key] || parsed.key.toUpperCase())

  return parts.join(' + ')
}

// ---------------------------------------------------------------------------
// Get all registered shortcuts (for help modal)
// ---------------------------------------------------------------------------

export function getAllRegisteredShortcuts(): Omit<RegisteredShortcut, 'handler'>[] {
  return registry
    .getAllShortcuts()
    .map(({ handler, ...rest }) => rest)
}

// ---------------------------------------------------------------------------
// Platform detection
// ---------------------------------------------------------------------------

export function isMac(): boolean {
  return navigator.platform.toLowerCase().includes('mac')
}

export function isWindows(): boolean {
  return navigator.platform.toLowerCase().includes('win')
}

/**
 * Get the platform-specific modifier key name
 */
export function getModifierKeyName(): string {
  return isMac() ? '⌘' : 'Ctrl'
}

/**
 * Convert key combo to platform-specific format
 */
export function toPlatformCombo(combo: string): string {
  if (isMac()) {
    return combo.replace('ctrl', 'cmd')
  }
  return combo.replace('cmd', 'ctrl')
}

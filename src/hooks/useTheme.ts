import { useEffect, useCallback } from 'react'
import { useThemeStore, initTheme, listenToSystemTheme, type Theme } from '@/stores/theme'

export type { Theme }

interface UseThemeReturn {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

/**
 * Hook for managing theme state and applying it to the document
 * Handles:
 * - Theme persistence via localStorage
 * - System preference detection
 * - CSS class application for dark mode
 * - Hydration mismatch handling
 */
export function useTheme(): UseThemeReturn {
  const theme = useThemeStore((state) => state.theme)
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme)
  const setTheme = useThemeStore((state) => state.setTheme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement

    // Remove both classes first
    root.classList.remove('light', 'dark')

    // Add the resolved theme class
    root.classList.add(resolvedTheme)

    // Also set data-theme attribute for CSS selectors
    root.setAttribute('data-theme', resolvedTheme)
  }, [resolvedTheme])

  // Initialize theme on mount (handle hydration)
  useEffect(() => {
    initTheme()
  }, [])

  // Listen to system theme changes
  useEffect(() => {
    return listenToSystemTheme()
  }, [])

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  }
}

/**
 * Hook to get just the resolved theme for conditional rendering
 * Optimized for components that only need to know light/dark state
 */
export function useResolvedTheme(): 'light' | 'dark' {
  return useThemeStore((state) => state.resolvedTheme)
}

/**
 * Hook to check if current theme is dark
 * Useful for conditional icon rendering
 */
export function useIsDark(): boolean {
  return useThemeStore((state) => state.resolvedTheme === 'dark')
}

/**
 * Hook to toggle theme with callback
 * Returns a memoized toggle function
 */
export function useToggleTheme(): () => void {
  const toggle = useThemeStore((state) => state.toggleTheme)
  return useCallback(() => toggle(), [toggle])
}

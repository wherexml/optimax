/**
 * useResponsive Hook
 * FE-153: Responsive Adaptation (1280px Minimum Width)
 *
 * Provides responsive breakpoints and sidebar auto-collapse functionality
 * Ensures 1280px minimum width compatibility
 */

import { useEffect, useState, useCallback, useMemo } from 'react'

// ---------------------------------------------------------------------------
// Breakpoints
// ---------------------------------------------------------------------------

export const BREAKPOINTS = {
  /** Extra small: < 640px */
  xs: 640,
  /** Small: 640px - 768px */
  sm: 768,
  /** Medium: 768px - 1024px */
  md: 1024,
  /** Large: 1024px - 1280px */
  lg: 1280,
  /** Extra large: 1280px - 1536px */
  xl: 1536,
  /** 2XL: 1536px - 1920px */
  '2xl': 1920,
  /** Ultra wide: >= 1920px */
  ultrawide: 2560,
} as const

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Breakpoint = keyof typeof BREAKPOINTS

interface ResponsiveState {
  /** Current viewport width */
  width: number
  /** Current viewport height */
  height: number
  /** Whether viewport is at least 'xs' */
  isXs: boolean
  /** Whether viewport is at least 'sm' */
  isSm: boolean
  /** Whether viewport is at least 'md' */
  isMd: boolean
  /** Whether viewport is at least 'lg' */
  isLg: boolean
  /** Whether viewport is at least 'xl' */
  isXl: boolean
  /** Whether viewport is at least '2xl' */
  is2xl: boolean
  /** Whether viewport is ultrawide */
  isUltrawide: boolean
  /** Current breakpoint name */
  breakpoint: Breakpoint | 'xs'
  /** Whether the screen is below minimum width (1280px) */
  isBelowMinWidth: boolean
  /** Whether sidebar should be auto-collapsed */
  shouldCollapseSidebar: boolean
  /** Whether device is likely touch-based */
  isTouch: boolean
  /** Whether device is in portrait orientation */
  isPortrait: boolean
  /** Whether device is in landscape orientation */
  isLandscape: boolean
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Responsive hook for tracking viewport changes
 *
 * @example
 * const { isLg, isXl, shouldCollapseSidebar } = useResponsive()
 *
 * // Conditional rendering
 * {isLg && <Sidebar />}
 *
 * // Grid classes
 * <div className={isXl ? 'grid-cols-5' : 'grid-cols-4'}>
 */
export function useResponsive(): ResponsiveState {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  const [isTouch, setIsTouch] = useState(false)
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
  )

  // Update dimensions on resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
      setOrientation(
        window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
      )
    }

    // Detect touch device
    const detectTouch = () => {
      setIsTouch(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0
      )
    }

    // Initial detection
    detectTouch()
    handleResize()

    // Add listeners
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [])

  // Calculate responsive state
  const state = useMemo<ResponsiveState>(() => {
    const { width, height } = dimensions

    // Determine current breakpoint
    let breakpoint: Breakpoint | 'xs' = 'xs'
    if (width >= BREAKPOINTS.ultrawide) breakpoint = 'ultrawide'
    else if (width >= BREAKPOINTS['2xl']) breakpoint = '2xl'
    else if (width >= BREAKPOINTS.xl) breakpoint = 'xl'
    else if (width >= BREAKPOINTS.lg) breakpoint = 'lg'
    else if (width >= BREAKPOINTS.md) breakpoint = 'md'
    else if (width >= BREAKPOINTS.sm) breakpoint = 'sm'

    return {
      width,
      height,
      isXs: width >= BREAKPOINTS.xs,
      isSm: width >= BREAKPOINTS.sm,
      isMd: width >= BREAKPOINTS.md,
      isLg: width >= BREAKPOINTS.lg,
      isXl: width >= BREAKPOINTS.xl,
      is2xl: width >= BREAKPOINTS['2xl'],
      isUltrawide: width >= BREAKPOINTS.ultrawide,
      breakpoint,
      isBelowMinWidth: width < BREAKPOINTS.lg,
      shouldCollapseSidebar: width < BREAKPOINTS.xl, // Auto-collapse below 1536px
      isTouch,
      isPortrait: orientation === 'portrait',
      isLandscape: orientation === 'landscape',
    }
  }, [dimensions, isTouch, orientation])

  return state
}

// ---------------------------------------------------------------------------
// Hook: useSidebarCollapse
// ---------------------------------------------------------------------------

interface SidebarCollapseOptions {
  /** Breakpoint at which to collapse sidebar */
  collapseBelow?: Breakpoint
  /** Whether to use auto-collapse behavior */
  autoCollapse?: boolean
}

interface SidebarCollapseState {
  /** Whether sidebar is collapsed */
  collapsed: boolean
  /** Manually toggle sidebar */
  toggle: () => void
  /** Manually collapse sidebar */
  collapse: () => void
  /** Manually expand sidebar */
  expand: () => void
  /** Set collapsed state */
  setCollapsed: (collapsed: boolean) => void
}

/**
 * Hook for managing sidebar collapse state with responsive behavior
 *
 * @example
 * const { collapsed, toggle, setCollapsed } = useSidebarCollapse({
 *   collapseBelow: 'xl',
 *   autoCollapse: true,
 * })
 *
 * <Sidebar collapsed={collapsed} />
 */
export function useSidebarCollapse(
  options: SidebarCollapseOptions = {}
): SidebarCollapseState {
  const { collapseBelow = 'xl', autoCollapse = true } = options
  const responsive = useResponsive()

  const [manualCollapsed, setManualCollapsed] = useState<boolean | null>(null)

  // Calculate collapsed state
  const collapsed = useMemo(() => {
    // If manually set, use manual value
    if (manualCollapsed !== null) {
      return manualCollapsed
    }

    // If auto-collapse is enabled, collapse below specified breakpoint
    if (autoCollapse) {
      const breakpointValue = BREAKPOINTS[collapseBelow]
      return responsive.width < breakpointValue
    }

    return false
  }, [manualCollapsed, autoCollapse, collapseBelow, responsive.width])

  const toggle = useCallback(() => {
    setManualCollapsed((prev) => !(prev ?? collapsed))
  }, [collapsed])

  const collapse = useCallback(() => {
    setManualCollapsed(true)
  }, [])

  const expand = useCallback(() => {
    setManualCollapsed(false)
  }, [])

  const setCollapsed = useCallback((value: boolean) => {
    setManualCollapsed(value)
  }, [])

  // Reset manual state when breakpoint changes (if auto-collapse is on)
  useEffect(() => {
    if (autoCollapse) {
      setManualCollapsed(null)
    }
  }, [responsive.breakpoint, autoCollapse])

  return {
    collapsed,
    toggle,
    collapse,
    expand,
    setCollapsed,
  }
}

// ---------------------------------------------------------------------------
// Hook: useGridColumns
// ---------------------------------------------------------------------------

interface GridColumnsOptions {
  /** Columns at xs breakpoint */
  xs?: number
  /** Columns at sm breakpoint */
  sm?: number
  /** Columns at md breakpoint */
  md?: number
  /** Columns at lg breakpoint */
  lg?: number
  /** Columns at xl breakpoint */
  xl?: number
  /** Columns at 2xl breakpoint */
  '2xl'?: number
}

/**
 * Hook for responsive grid columns
 *
 * @example
 * const columns = useGridColumns({
 *   xs: 1,
 *   sm: 2,
 *   md: 3,
 *   lg: 4,
 *   xl: 5,
 *   '2xl': 6,
 * })
 *
 * <div style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
 */
export function useGridColumns(
  options: GridColumnsOptions = {}
): number {
  const responsive = useResponsive()

  return useMemo(() => {
    if (responsive.is2xl && options['2xl'] !== undefined) return options['2xl']
    if (responsive.isXl && options.xl !== undefined) return options.xl
    if (responsive.isLg && options.lg !== undefined) return options.lg
    if (responsive.isMd && options.md !== undefined) return options.md
    if (responsive.isSm && options.sm !== undefined) return options.sm
    if (options.xs !== undefined) return options.xs

    // Default fallback
    return options.lg ?? options.xl ?? options.md ?? options.sm ?? options.xs ?? 1
  }, [responsive, options])
}

// ---------------------------------------------------------------------------
// Utility: Generate responsive class names
// ---------------------------------------------------------------------------

interface ResponsiveClasses {
  /** Base classes (always applied) */
  base?: string
  /** Classes for xs and above */
  xs?: string
  /** Classes for sm and above */
  sm?: string
  /** Classes for md and above */
  md?: string
  /** Classes for lg and above */
  lg?: string
  /** Classes for xl and above */
  xl?: string
  /** Classes for 2xl and above */
  '2xl'?: string
}

/**
 * Generate responsive Tailwind classes
 *
 * @example
 * const className = responsiveClasses({
 *   base: 'grid-cols-1',
 *   sm: 'sm:grid-cols-2',
 *   lg: 'lg:grid-cols-4',
 *   xl: 'xl:grid-cols-5',
 * })
 */
export function responsiveClasses(classes: ResponsiveClasses): string {
  const parts: string[] = []

  if (classes.base) parts.push(classes.base)
  if (classes.xs) parts.push(classes.xs)
  if (classes.sm) parts.push(classes.sm)
  if (classes.md) parts.push(classes.md)
  if (classes.lg) parts.push(classes.lg)
  if (classes.xl) parts.push(classes.xl)
  if (classes['2xl']) parts.push(classes['2xl'])

  return parts.join(' ')
}

// ---------------------------------------------------------------------------
// Utility: Media query match
// ---------------------------------------------------------------------------

/**
 * Check if a media query matches
 *
 * @example
 * const isWideScreen = useMediaQuery('(min-width: 1280px)')
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const media = window.matchMedia(query)

    const updateMatch = () => setMatches(media.matches)
    updateMatch()

    // Modern browsers
    if (media.addEventListener) {
      media.addEventListener('change', updateMatch)
      return () => media.removeEventListener('change', updateMatch)
    }

    // Legacy browsers
    media.addListener(updateMatch)
    return () => media.removeListener(updateMatch)
  }, [query])

  return matches
}

// ---------------------------------------------------------------------------
// Utility: Container width calculation
// ---------------------------------------------------------------------------

/**
 * Calculate optimal container width based on viewport
 *
 * Ensures content fits within 1280px minimum width constraint
 */
export function useContainerWidth(
  maxWidth: number = 1920,
  minWidth: number = 1280
): { width: number; padding: number } {
  const { width: viewportWidth } = useResponsive()

  return useMemo(() => {
    // Calculate available space
    const sidebarWidth = viewportWidth < BREAKPOINTS.xl ? 64 : 240
    const availableWidth = viewportWidth - sidebarWidth - 48 // 48px for padding

    // Constrain to min/max
    const contentWidth = Math.max(minWidth - sidebarWidth - 48, Math.min(availableWidth, maxWidth))
    const padding = Math.max(16, (viewportWidth - sidebarWidth - contentWidth) / 2)

    return { width: contentWidth, padding }
  }, [viewportWidth, maxWidth, minWidth])
}

// ---------------------------------------------------------------------------
// Constants for common responsive patterns
// ---------------------------------------------------------------------------

/** Dashboard KPI card grid classes for 1280px+ compatibility */
export const DASHBOARD_GRID_CLASSES = {
  /** 5-column grid for xl and above, 4-column for lg, 3-column for md, 2-column for sm, 1-column for xs */
  kpis: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
  /** 3-column grid for lg and above, 2-column for md, 1-column below */
  cards: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  /** 2-column grid for md and above, 1-column below */
  split: 'grid-cols-1 lg:grid-cols-2',
} as const

/** Table column width presets for different breakpoints */
export const TABLE_WIDTH_PRESETS = {
  /** Fixed width for action columns */
  actions: 'w-24 lg:w-32',
  /** Fixed width for date columns */
  date: 'w-28 lg:w-36',
  /** Fixed width for status/badge columns */
  status: 'w-20 lg:w-24',
  /** Fixed width for ID columns */
  id: 'w-24 lg:w-28',
  /** Adaptive width for content columns */
  content: 'min-w-0 flex-1',
} as const

/** Drawer width presets */
export const DRAWER_WIDTH_PRESETS = {
  /** Small drawer (e.g., filters) */
  sm: 'w-80',
  /** Medium drawer (e.g., detail view) */
  md: 'w-96 lg:w-[480px]',
  /** Large drawer (e.g., side panels) */
  lg: 'w-96 lg:w-[560px] xl:w-[640px]',
} as const

/**
 * OptiMax Design Tokens - Shadows
 *
 * Four-level elevation system + semantic aliases.
 */

export const shadows = {
  /** Subtle border-like shadow for cards at rest */
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  /** Default elevation for interactive cards */
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
  /** Raised elements, dropdowns */
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
  /** Modals, popovers */
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
} as const

/** Semantic shadow aliases mapping to the elevation levels */
export const semanticShadows = {
  card: shadows.sm,
  cardHover: shadows.md,
  dropdown: shadows.lg,
  modal: shadows.xl,
  /** Inner shadow for inset inputs */
  inset: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  /** Focus ring – used with outline utilities */
  focusRing: '0 0 0 3px rgba(47, 111, 237, 0.25)',
} as const

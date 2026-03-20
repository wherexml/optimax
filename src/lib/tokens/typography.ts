/**
 * OptiMax Design Tokens - Typography
 *
 * Font family: Inter + system fallback
 * Scale: based on 14px body text
 */

export const fontFamily = {
  sans: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, 'Courier New', monospace",
} as const

/**
 * Font-size / line-height / font-weight tuples.
 *
 * Usage in Tailwind:  `text-h1` -> [24px, { lineHeight: '32px', fontWeight: '700' }]
 */
export const fontSize = {
  h1: ['24px', { lineHeight: '32px', fontWeight: '700' }],
  h2: ['18px', { lineHeight: '28px', fontWeight: '600' }],
  h3: ['16px', { lineHeight: '24px', fontWeight: '600' }],
  body: ['14px', { lineHeight: '22px', fontWeight: '400' }],
  'body-medium': ['14px', { lineHeight: '22px', fontWeight: '500' }],
  small: ['12px', { lineHeight: '18px', fontWeight: '400' }],
  'small-medium': ['12px', { lineHeight: '18px', fontWeight: '500' }],
  tiny: ['11px', { lineHeight: '16px', fontWeight: '400' }],
} as const

/** Standalone weight tokens (when you need just the weight) */
export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const

/** Letter-spacing tokens */
export const letterSpacing = {
  tight: '-0.01em',
  normal: '0em',
  wide: '0.02em',
  wider: '0.04em',
} as const

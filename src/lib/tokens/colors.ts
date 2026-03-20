/**
 * OptiMax Design Tokens - Colors
 *
 * Brand primary: #173F5F
 * Desktop-first: 1440px design, min 1280px
 */

// ---------------------------------------------------------------------------
// Brand
// ---------------------------------------------------------------------------

export const brand = {
  DEFAULT: '#173F5F',
  50: '#E8EEF3',
  100: '#D1DDE7',
  200: '#A3BBCF',
  300: '#7599B7',
  400: '#47779F',
  500: '#173F5F',
  600: '#13334C',
  700: '#0F2739',
  800: '#0B1B26',
  900: '#070F13',
} as const

export const accent = {
  DEFAULT: '#2F6FED',
  50: '#EFF6FF',
  100: '#DBEAFE',
  200: '#BFDBFE',
  300: '#93C5FD',
  400: '#60A5FA',
  500: '#2F6FED',
  600: '#2563EB',
  700: '#1D4ED8',
  800: '#1E40AF',
  900: '#1E3A8A',
} as const

// ---------------------------------------------------------------------------
// Semantic
// ---------------------------------------------------------------------------

export const success = {
  DEFAULT: '#2E8B57',
  50: '#F0FDF4',
  100: '#DCFCE7',
  200: '#BBF7D0',
  300: '#86EFAC',
  400: '#4ADE80',
  500: '#2E8B57',
  600: '#16A34A',
  700: '#15803D',
  800: '#166534',
  900: '#14532D',
} as const

export const warning = {
  DEFAULT: '#D98A00',
  50: '#FFFBEB',
  100: '#FEF3C7',
  200: '#FDE68A',
  300: '#FCD34D',
  400: '#FBBF24',
  500: '#D98A00',
  600: '#D97706',
  700: '#B45309',
  800: '#92400E',
  900: '#78350F',
} as const

export const danger = {
  DEFAULT: '#D64545',
  50: '#FEF2F2',
  100: '#FEE2E2',
  200: '#FECACA',
  300: '#FCA5A5',
  400: '#F87171',
  500: '#D64545',
  600: '#DC2626',
  700: '#B91C1C',
  800: '#991B1B',
  900: '#7F1D1D',
} as const

export const info = {
  DEFAULT: '#2F6FED',
  50: '#EFF6FF',
  100: '#DBEAFE',
  200: '#BFDBFE',
  300: '#93C5FD',
  400: '#60A5FA',
  500: '#2F6FED',
  600: '#2563EB',
  700: '#1D4ED8',
  800: '#1E40AF',
  900: '#1E3A8A',
} as const

/** Semantic color shorthand (backward-compatible) */
export const semantic = {
  info: { DEFAULT: info.DEFAULT, light: info[100], dark: info[800] },
  success: { DEFAULT: success.DEFAULT, light: success[100], dark: success[800] },
  warning: { DEFAULT: warning.DEFAULT, light: warning[100], dark: warning[800] },
  danger: { DEFAULT: danger.DEFAULT, light: danger[100], dark: danger[800] },
} as const

// ---------------------------------------------------------------------------
// Severity (risk levels)
// ---------------------------------------------------------------------------

export const severity = {
  critical: {
    DEFAULT: '#D64545',
    bg: '#FEF2F2',
    border: '#FECACA',
    text: '#991B1B',
  },
  high: {
    DEFAULT: '#EA580C',
    bg: '#FFF7ED',
    border: '#FED7AA',
    text: '#9A3412',
  },
  medium: {
    DEFAULT: '#D98A00',
    bg: '#FFFBEB',
    border: '#FDE68A',
    text: '#92400E',
  },
  low: {
    DEFAULT: '#2E8B57',
    bg: '#F0FDF4',
    border: '#BBF7D0',
    text: '#166534',
  },
  info: {
    DEFAULT: '#2F6FED',
    bg: '#EFF6FF',
    border: '#BFDBFE',
    text: '#1E40AF',
  },
} as const

// ---------------------------------------------------------------------------
// Status
// ---------------------------------------------------------------------------

export const status = {
  new: {
    DEFAULT: '#2F6FED',
    bg: '#EFF6FF',
    border: '#BFDBFE',
    text: '#1E40AF',
  },
  investigating: {
    DEFAULT: '#D98A00',
    bg: '#FFFBEB',
    border: '#FDE68A',
    text: '#92400E',
  },
  inProgress: {
    DEFAULT: '#7C3AED',
    bg: '#F5F3FF',
    border: '#DDD6FE',
    text: '#5B21B6',
  },
  resolved: {
    DEFAULT: '#2E8B57',
    bg: '#F0FDF4',
    border: '#BBF7D0',
    text: '#166534',
  },
  archived: {
    DEFAULT: '#6B7280',
    bg: '#F9FAFB',
    border: '#E5E7EB',
    text: '#374151',
  },
  rejected: {
    DEFAULT: '#DC2626',
    bg: '#FEF2F2',
    border: '#FECACA',
    text: '#991B1B',
  },
} as const

// ---------------------------------------------------------------------------
// Neutral
// ---------------------------------------------------------------------------

export const neutral = {
  0: '#FFFFFF',
  50: '#F5F8FC',
  100: '#E8EDF5',
  200: '#D9E2F3',
  300: '#C2CFEA',
  400: '#9CA3AF',
  500: '#6B7280',
  600: '#4B5563',
  700: '#374151',
  800: '#1F2937',
  900: '#111827',
  950: '#030712',
} as const

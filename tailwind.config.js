/** @type {import('tailwindcss').Config} */
import { brand, accent as accentToken, success, warning, danger, info as infoToken, severity, status, neutral } from './src/lib/tokens/colors'
import { spacing } from './src/lib/tokens/spacing'
import { fontFamily, fontSize } from './src/lib/tokens/typography'
import { shadows, semanticShadows } from './src/lib/tokens/shadows'

export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // --- OptiMax brand tokens ---
        brand,
        'accent-brand': accentToken,
        success,
        warning,
        danger,
        'info-brand': infoToken,
        neutral,

        // Severity (flat keys for easy Tailwind usage)
        severity: {
          critical: severity.critical.DEFAULT,
          'critical-bg': severity.critical.bg,
          'critical-border': severity.critical.border,
          'critical-text': severity.critical.text,
          high: severity.high.DEFAULT,
          'high-bg': severity.high.bg,
          'high-border': severity.high.border,
          'high-text': severity.high.text,
          medium: severity.medium.DEFAULT,
          'medium-bg': severity.medium.bg,
          'medium-border': severity.medium.border,
          'medium-text': severity.medium.text,
          low: severity.low.DEFAULT,
          'low-bg': severity.low.bg,
          'low-border': severity.low.border,
          'low-text': severity.low.text,
          info: severity.info.DEFAULT,
          'info-bg': severity.info.bg,
          'info-border': severity.info.border,
          'info-text': severity.info.text,
        },
        'om-status': {
          new: status.new.DEFAULT,
          'new-bg': status.new.bg,
          'new-border': status.new.border,
          'new-text': status.new.text,
          investigating: status.investigating.DEFAULT,
          'investigating-bg': status.investigating.bg,
          'investigating-border': status.investigating.border,
          'investigating-text': status.investigating.text,
          'in-progress': status.inProgress.DEFAULT,
          'in-progress-bg': status.inProgress.bg,
          'in-progress-border': status.inProgress.border,
          'in-progress-text': status.inProgress.text,
          resolved: status.resolved.DEFAULT,
          'resolved-bg': status.resolved.bg,
          'resolved-border': status.resolved.border,
          'resolved-text': status.resolved.text,
          archived: status.archived.DEFAULT,
          'archived-bg': status.archived.bg,
          'archived-border': status.archived.border,
          'archived-text': status.archived.text,
          rejected: status.rejected.DEFAULT,
          'rejected-bg': status.rejected.bg,
          'rejected-border': status.rejected.border,
          'rejected-text': status.rejected.text,
        },

        // --- shadcn/ui CSS variable colors (preserved) ---
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      spacing,
      fontFamily: {
        sans: fontFamily.sans.split(', '),
        mono: fontFamily.mono.split(', '),
      },
      fontSize,
      boxShadow: {
        ...shadows,
        card: semanticShadows.card,
        'card-hover': semanticShadows.cardHover,
        dropdown: semanticShadows.dropdown,
        modal: semanticShadows.modal,
        inset: semanticShadows.inset,
        'focus-ring': semanticShadows.focusRing,
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      screens: {
        desktop: '1280px',
        wide: '1440px',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

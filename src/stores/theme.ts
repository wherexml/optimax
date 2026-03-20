import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  resolveTheme: () => 'light' | 'dark'
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: getSystemTheme(),

      setTheme: (theme: Theme) => {
        const resolved = theme === 'system' ? getSystemTheme() : theme
        set({ theme, resolvedTheme: resolved })
      },

      toggleTheme: () => {
        const current = get().theme
        const resolved = get().resolvedTheme
        let newTheme: Theme

        if (current === 'system') {
          // If system, toggle to the opposite of current resolved
          newTheme = resolved === 'light' ? 'dark' : 'light'
        } else {
          // If manual, toggle between light and dark
          newTheme = current === 'light' ? 'dark' : 'light'
        }

        set({
          theme: newTheme,
          resolvedTheme: newTheme,
        })
      },

      resolveTheme: () => {
        const { theme } = get()
        return theme === 'system' ? getSystemTheme() : theme
      },
    }),
    {
      name: 'optimax-theme',
      partialize: (state) => ({ theme: state.theme }),
    },
  ),
)

// Initialize resolved theme after hydration
export function initTheme(): void {
  const { theme, setTheme } = useThemeStore.getState()
  // Re-resolve to ensure correct value after hydration
  if (theme === 'system') {
    setTheme('system')
  }
}

// Listen to system theme changes
export function listenToSystemTheme(): () => void {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  const handler = () => {
    const { theme, setTheme } = useThemeStore.getState()
    if (theme === 'system') {
      setTheme('system')
    }
  }

  mediaQuery.addEventListener('change', handler)
  return () => mediaQuery.removeEventListener('change', handler)
}

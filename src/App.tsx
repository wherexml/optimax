import '@/styles/globals.css'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from '@tanstack/react-router'
import { queryClient } from '@/lib/query-client'
import { createAppRouter } from '@/router'
import { Toaster } from '@/components/common/Toaster'
import { useTheme } from '@/hooks/useTheme'

const router = createAppRouter(queryClient)

function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize theme on mount
  useTheme()
  return <>{children}</>
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App

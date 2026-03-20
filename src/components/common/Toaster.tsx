import { Toaster as SonnerToaster } from 'sonner'

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        classNames: {
          toast: 'border-border bg-background text-foreground shadow-lg',
          success: 'border-success/30 bg-success/5 text-success',
          error: 'border-destructive/30 bg-destructive/5 text-destructive',
        },
      }}
      richColors
      closeButton
    />
  )
}

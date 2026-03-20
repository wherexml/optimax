import { Link, useRouter } from '@tanstack/react-router'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMemo } from 'react'

export default function ErrorPage() {
  const router = useRouter()
  const errorCode = useMemo(
    () => Math.random().toString(36).substring(2, 8).toUpperCase(),
    [],
  )

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center text-center px-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-foreground">出了点问题</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          应用遇到了意外错误，请尝试重试或返回首页。
        </p>
        <p className="mt-3 font-mono text-xs text-muted-foreground/70">
          错误编号: {errorCode}
        </p>
        <div className="mt-8 flex items-center gap-3">
          <Button variant="outline" onClick={() => router.invalidate()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            重试
          </Button>
          <Button asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              返回首页
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

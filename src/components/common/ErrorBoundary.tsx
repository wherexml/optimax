import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  errorCode: string
  error: Error | null
}

function generateErrorCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      errorCode: '',
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorCode: generateErrorCode(),
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(
      `[ErrorBoundary] Code: ${this.state.errorCode}`,
      error,
      errorInfo,
    )
  }

  handleRetry = () => {
    this.setState({ hasError: false, errorCode: '', error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="mt-6 text-lg font-semibold text-foreground">
            出了点问题
          </h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            {this.state.error?.message || '组件渲染时发生了意外错误，请尝试重试。'}
          </p>
          <p className="mt-3 font-mono text-xs text-muted-foreground/70">
            错误编号: {this.state.errorCode}
          </p>
          <Button className="mt-6" onClick={this.handleRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            重试
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

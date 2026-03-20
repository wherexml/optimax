import { useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'

export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('已复制到剪贴板')

      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      timerRef.current = setTimeout(() => {
        setCopied(false)
        timerRef.current = null
      }, 2000)
    } catch {
      setCopied(false)
      toast.error('复制失败')
    }
  }, [])

  return { copied, copyToClipboard }
}

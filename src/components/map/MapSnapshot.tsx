import { Camera } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'

import { Button } from '@/components/ui/button'

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MapSnapshot() {
  const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss')

  const handleSnapshot = () => {
    toast.success('快照已保存', {
      description: `时间: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`,
    })
  }

  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" size="sm" onClick={handleSnapshot}>
        <Camera className="mr-1.5 h-4 w-4" />
        导出快照
      </Button>
      <span className="text-xs text-muted-foreground">
        {timestamp}
      </span>
    </div>
  )
}

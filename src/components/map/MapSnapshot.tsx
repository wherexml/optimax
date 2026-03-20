import { useState } from 'react'
import { Camera, Download, FilePlus, Loader2 } from 'lucide-react'
import { toPng } from 'html-to-image'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { LayerState } from '@/components/map/LayerControl'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MapSnapshotProps {
  chartRef?: React.RefObject<HTMLElement | null>
  filters?: LayerState
  nodes?: Array<{
    id: string
    name: string
    severity: string
    eventCount: number
  }>
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MapSnapshot({ chartRef, filters, nodes = [] }: MapSnapshotProps) {
  const navigate = useNavigate()
  const [isExporting, setIsExporting] = useState(false)
  const [snapshotName, setSnapshotName] = useState('')
  const [snapshotNote, setSnapshotNote] = useState('')
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
  const dateStr = format(new Date(), 'yyyyMMdd')

  // Generate watermark text
  const getWatermarkText = () => {
    const parts = [`OptiMax 风险地图 · ${timestamp}`]
    if (filters) {
      const activeFilters: string[] = []
      if (!filters.critical || !filters.high || !filters.medium || !filters.low) {
        const severities = []
        if (filters.critical) severities.push('严重')
        if (filters.high) severities.push('高危')
        if (filters.medium) severities.push('中危')
        if (filters.low) severities.push('低危')
        if (severities.length > 0) activeFilters.push(`级别:${severities.join(',')}`)
      }
      if (filters.timeWindow && filters.timeWindow !== 'all') {
        activeFilters.push(`时间:${filters.timeWindow}`)
      }
      if (activeFilters.length > 0) {
        parts.push(`筛选条件: ${activeFilters.join(' | ')}`)
      }
    }
    parts.push(`节点数: ${nodes.length}`)
    return parts.join(' · ')
  }

  const generateSnapshot = async (): Promise<string | null> => {
    if (!chartRef?.current) {
      toast.error('无法找到地图元素')
      return null
    }

    try {
      // Clone the element to add watermark
      const originalElement = chartRef.current
      const clone = originalElement.cloneNode(true) as HTMLElement

      // Add watermark
      const watermark = document.createElement('div')
      watermark.style.cssText = `
        position: absolute;
        bottom: 8px;
        right: 8px;
        background: rgba(255, 255, 255, 0.9);
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 10px;
        color: #666;
        border: 1px solid #e5e7eb;
        max-width: 80%;
        word-break: break-all;
      `
      watermark.textContent = getWatermarkText()
      clone.style.position = 'relative'
      clone.appendChild(watermark)

      // Temporarily add to document for rendering
      clone.style.position = 'fixed'
      clone.style.left = '-9999px'
      clone.style.top = '-9999px'
      document.body.appendChild(clone)

      // Generate PNG
      const dataUrl = await toPng(clone, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      })

      document.body.removeChild(clone)
      return dataUrl
    } catch (error) {
      console.error('Snapshot generation failed:', error)
      toast.error('生成快照失败')
      return null
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const dataUrl = await generateSnapshot()
      if (dataUrl) {
        // Create download link
        const link = document.createElement('a')
        link.download = `risk-map-${dateStr}.png`
        link.href = dataUrl
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast.success('快照已导出', {
          description: `文件名: risk-map-${dateStr}.png`,
        })
      }
    } finally {
      setIsExporting(false)
    }
  }

  const handleAddToReport = async () => {
    setIsExporting(true)
    try {
      const dataUrl = await generateSnapshot()
      if (dataUrl) {
        setPreviewUrl(dataUrl)
        setShowReportDialog(true)
        setSnapshotName(`风险地图快照 ${format(new Date(), 'MM/dd HH:mm')}`)
      }
    } finally {
      setIsExporting(false)
    }
  }

  const handleConfirmAddToReport = () => {
    // Store snapshot data in localStorage for report center to access
    const snapshotData = {
      id: `snapshot-${Date.now()}`,
      name: snapshotName,
      note: snapshotNote,
      imageUrl: previewUrl,
      timestamp: new Date().toISOString(),
      filters,
      nodeCount: nodes.length,
    }

    const existingSnapshots = JSON.parse(localStorage.getItem('riskMapSnapshots') || '[]')
    localStorage.setItem(
      'riskMapSnapshots',
      JSON.stringify([...existingSnapshots, snapshotData])
    )

    toast.success('已添加到报告草稿', {
      description: '可在报告中心查看',
      action: {
        label: '去报告中心',
        onClick: () => navigate({ to: '/reports' }),
      },
    })

    setShowReportDialog(false)
    setSnapshotName('')
    setSnapshotNote('')
    setPreviewUrl(null)
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Camera className="mr-1.5 h-4 w-4" />
            )}
            导出快照
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleAddToReport}
            disabled={isExporting}
          >
            <FilePlus className="mr-1.5 h-4 w-4" />
            添加到报告
          </Button>
        </div>
        <span className="text-xs text-muted-foreground">
          {timestamp}
        </span>
      </div>

      {/* Add to Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>添加到报告</DialogTitle>
            <DialogDescription>
              将当前地图快照添加到报告草稿中
            </DialogDescription>
          </DialogHeader>

          {previewUrl && (
            <div className="rounded-md border bg-muted p-2">
              <img
                src={previewUrl}
                alt="快照预览"
                className="max-h-40 w-full rounded object-contain"
              />
              <p className="mt-1 text-center text-xs text-muted-foreground">
                水印: {getWatermarkText()}
              </p>
            </div>
          )}

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="snapshot-name">快照名称</Label>
              <Input
                id="snapshot-name"
                value={snapshotName}
                onChange={(e) => setSnapshotName(e.target.value)}
                placeholder="输入快照名称..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="snapshot-note">备注（可选）</Label>
              <Textarea
                id="snapshot-note"
                value={snapshotNote}
                onChange={(e) => setSnapshotNote(e.target.value)}
                placeholder="添加备注说明..."
                rows={2}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              <p>快照信息:</p>
              <ul className="mt-1 space-y-0.5">
                <li>· 节点数: {nodes.length}</li>
                <li>· 生成时间: {timestamp}</li>
                {filters?.timeWindow && <li>· 时间范围: {filters.timeWindow}</li>}
              </ul>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">取消</Button>
            </DialogClose>
            <Button
              onClick={handleConfirmAddToReport}
              disabled={!snapshotName.trim()}
            >
              <Download className="mr-1.5 h-4 w-4" />
              确认添加
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

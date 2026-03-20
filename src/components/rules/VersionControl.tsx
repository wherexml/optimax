import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GitBranch,
  Rocket,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  GitCompare,
  Percent,
  Calendar,
  FileText,
  Eye,
  Undo2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'

import type {
  RuleVersion,
  VersionDiff,
  GrayReleaseConfig,
} from '@/mocks/data/versions'
import {
  getVersionsForRule,
  getVersionDiff,
  getStatusBadgeVariant,
  getChangeTypeLabel,
  getChangeTypeColor,
  grayReleaseScopes,
} from '@/mocks/data/versions'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface VersionControlProps {
  ruleId: string
  ruleName: string
  currentVersionId?: string
  onPublish?: (versionId: string, config?: GrayReleaseConfig) => void
  onRollback?: (versionId: string) => void
  onViewDiff?: (versionId1: string, versionId2: string) => void
}

interface VersionCardProps {
  version: RuleVersion
  isCurrent: boolean
  isPrevious: boolean
  onPublish: () => void
  onRollback: () => void
  onViewDiff: () => void
  onToggleExpand: () => void
  expanded: boolean
}

// ---------------------------------------------------------------------------
// Version Card Component
// ---------------------------------------------------------------------------

function VersionCard({
  version,
  isCurrent,
  isPrevious,
  onPublish,
  onRollback,
  onViewDiff,
  onToggleExpand,
  expanded,
}: VersionCardProps) {
  const statusConfig = getStatusBadgeVariant(version.status)
  const changeTypeClass = getChangeTypeColor(version.changeType)

  return (
    <Card
      className={`relative overflow-hidden transition-all ${
        isCurrent
          ? 'border-blue-500/50 bg-blue-50/30'
          : isPrevious
            ? 'border-amber-500/50 bg-amber-50/30'
            : ''
      }`}
    >
      {/* Status indicator */}
      {(isCurrent || isPrevious) && (
        <div
          className={`absolute left-0 top-0 h-full w-1 ${
            isCurrent ? 'bg-blue-500' : 'bg-amber-500'
          }`}
        />
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-semibold">
                {version.version}
              </CardTitle>
              <Badge variant="outline" className={statusConfig.className}>
                {statusConfig.label}
              </Badge>
              <Badge variant="outline" className={`text-xs ${changeTypeClass}`}>
                {getChangeTypeLabel(version.changeType)}
              </Badge>
              {version.isGrayRelease && (
                <Badge
                  variant="outline"
                  className="text-xs border-purple-200 bg-purple-50 text-purple-700"
                >
                  <Percent className="mr-1 h-3 w-3" />
                  灰度
                </Badge>
              )}
            </div>
            <CardDescription className="mt-1 text-xs">
              {version.changeDescription}
            </CardDescription>
          </div>

          <div className="flex items-center gap-1">
            {version.status === 'draft' && (
              <Button
                size="sm"
                className="h-7 gap-1 text-xs"
                onClick={onPublish}
              >
                <Rocket className="h-3.5 w-3.5" />
                发布
              </Button>
            )}
            {version.status === 'published' && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 gap-1 text-xs text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                onClick={onRollback}
              >
                <Undo2 className="h-3.5 w-3.5" />
                回滚
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0"
              onClick={onToggleExpand}
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="pt-0">
              <Separator className="mb-3" />

              {/* Version details */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground">发布时间</span>
                  <p className="font-medium">
                    {version.publishedAt
                      ? new Date(version.publishedAt).toLocaleString('zh-CN')
                      : '未发布'}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">发布人</span>
                  <p className="font-medium">
                    {version.publishedBy ?? '-'}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">生效时间</span>
                  <p className="font-medium">
                    {version.effectiveAt
                      ? new Date(version.effectiveAt).toLocaleString('zh-CN')
                      : '立即生效'}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">配置统计</span>
                  <p className="font-medium">
                    {version.conditionCount} 个条件 · {version.actionCount} 个动作
                  </p>
                </div>
              </div>

              {/* Gray release scope */}
              {version.isGrayRelease && version.grayReleaseScope.length > 0 && (
                <div className="mt-3">
                  <span className="text-xs text-muted-foreground">灰度范围</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {version.grayReleaseScope.map((scopeId) => {
                      const scope = grayReleaseScopes.find((s) => s.id === scopeId)
                      return (
                        <Badge
                          key={scopeId}
                          variant="secondary"
                          className="text-xs"
                        >
                          {scope?.name ?? scopeId}
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-3 flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 gap-1 text-xs"
                  onClick={onViewDiff}
                >
                  <GitCompare className="h-3.5 w-3.5" />
                  对比
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 gap-1 text-xs"
                >
                  <Eye className="h-3.5 w-3.5" />
                  预览
                </Button>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Diff View Component
// ---------------------------------------------------------------------------

interface DiffViewProps {
  diffs: VersionDiff[]
  version1: string
  version2: string
}

function DiffView({ diffs, version1, version2 }: DiffViewProps) {
  if (diffs.length === 0) {
    return (
      <div className="py-8 text-center">
        <FileText className="mx-auto h-10 w-10 text-muted-foreground/50" />
        <p className="mt-2 text-sm text-muted-foreground">暂无变更详情</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{version1}</span>
        <span className="text-muted-foreground/50">→</span>
        <span>{version2}</span>
      </div>

      {diffs.map((diff, index) => (
        <div
          key={index}
          className={`rounded-lg border p-3 ${
            diff.changeType === 'added'
              ? 'border-green-200 bg-green-50/50'
              : diff.changeType === 'removed'
                ? 'border-red-200 bg-red-50/50'
                : 'border-amber-200 bg-amber-50/50'
          }`}
        >
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`text-xs ${
                diff.changeType === 'added'
                  ? 'border-green-200 text-green-700'
                  : diff.changeType === 'removed'
                    ? 'border-red-200 text-red-700'
                    : 'border-amber-200 text-amber-700'
              }`}
            >
              {diff.changeType === 'added'
                ? '新增'
                : diff.changeType === 'removed'
                  ? '删除'
                  : '修改'}
            </Badge>
            <span className="text-sm font-medium">{diff.field}</span>
          </div>
          <div className="mt-2 space-y-1 text-xs">
            {diff.changeType !== 'added' && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">旧值:</span>
                <span className="font-mono line-through text-red-600/70">
                  {String(diff.oldValue)}
                </span>
              </div>
            )}
            {diff.changeType !== 'removed' && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">新值:</span>
                <span className="font-mono text-green-600">
                  {String(diff.newValue)}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Publish Dialog
// ---------------------------------------------------------------------------

interface PublishDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  version: RuleVersion | null
  onConfirm: (config: GrayReleaseConfig) => void
}

function PublishDialog({
  open,
  onOpenChange,
  version,
  onConfirm,
}: PublishDialogProps) {
  const [grayRelease, setGrayRelease] = useState(false)
  const [selectedScopes, setSelectedScopes] = useState<string[]>([])
  const [effectiveTime, setEffectiveTime] = useState<'immediate' | 'scheduled'>('immediate')
  const [scheduledTime, setScheduledTime] = useState('')

  const handleConfirm = () => {
    const config: GrayReleaseConfig = {
      enabled: grayRelease,
      scope: selectedScopes,
      percentage: selectedScopes.length > 0 ? Math.round(100 / grayReleaseScopes.length * selectedScopes.length) : 100,
    }
    onConfirm(config)
    onOpenChange(false)
    // Reset
    setGrayRelease(false)
    setSelectedScopes([])
    setEffectiveTime('immediate')
    setScheduledTime('')
  }

  const toggleScope = (scopeId: string) => {
    setSelectedScopes((prev) =>
      prev.includes(scopeId)
        ? prev.filter((id) => id !== scopeId)
        : [...prev, scopeId]
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-blue-500" />
            发布版本
          </DialogTitle>
          <DialogDescription>
            即将发布 {version?.version}，请配置发布选项
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Gray release toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Percent className="h-4 w-4 text-purple-500" />
              <Label htmlFor="gray-release">灰度发布</Label>
            </div>
            <Switch
              id="gray-release"
              checked={grayRelease}
              onCheckedChange={setGrayRelease}
            />
          </div>

          {/* Gray release scope */}
          {grayRelease && (
            <div className="rounded-lg border p-3">
              <Label className="text-xs text-muted-foreground">选择灰度范围</Label>
              <div className="mt-2 space-y-2">
                {grayReleaseScopes.map((scope) => (
                  <div key={scope.id} className="flex items-center gap-2">
                    <Checkbox
                      id={scope.id}
                      checked={selectedScopes.includes(scope.id)}
                      onCheckedChange={() => toggleScope(scope.id)}
                    />
                    <Label htmlFor={scope.id} className="text-sm">
                      {scope.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Effective time */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Label>生效时间</Label>
            </div>
            <Select value={effectiveTime} onValueChange={(v: 'immediate' | 'scheduled') => setEffectiveTime(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">立即生效</SelectItem>
                <SelectItem value="scheduled">定时生效</SelectItem>
              </SelectContent>
            </Select>
            {effectiveTime === 'scheduled' && (
              <input
                type="datetime-local"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
            )}
          </div>

          {/* Warning for blocking rules */}
          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              高危阻断规则发布后可能影响业务流程，请确保已进行充分测试。
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={grayRelease && selectedScopes.length === 0}
          >
            <Rocket className="mr-2 h-4 w-4" />
            确认发布
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ---------------------------------------------------------------------------
// Rollback Dialog
// ---------------------------------------------------------------------------

interface RollbackDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  version: RuleVersion | null
  onConfirm: () => void
}

function RollbackDialog({ open, onOpenChange, version, onConfirm }: RollbackDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Undo2 className="h-5 w-5 text-amber-500" />
            回滚版本
          </DialogTitle>
          <DialogDescription>
            确认将规则回滚到 {version?.version}？
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">目标版本</div>
            <div className="font-medium">{version?.version}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              {version?.changeDescription}
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              回滚操作将立即生效，当前正在运行的流程可能受到影响。请确认已通知相关业务方。
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
          >
            <Undo2 className="mr-2 h-4 w-4" />
            确认回滚
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function VersionControl({
  ruleId,
  ruleName: _ruleName,
  currentVersionId,
  onPublish,
  onRollback,
}: VersionControlProps) {
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set())
  const [diffDialogOpen, setDiffDialogOpen] = useState(false)
  const [publishDialogOpen, setPublishDialogOpen] = useState(false)
  const [rollbackDialogOpen, setRollbackDialogOpen] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState<RuleVersion | null>(null)
  const [diffVersions, setDiffVersions] = useState<{ v1: string; v2: string } | null>(null)

  const versions = useMemo(() => getVersionsForRule(ruleId), [ruleId])
  const currentVersion = useMemo(
    () => versions.find((v) => v.id === currentVersionId) ?? versions[0],
    [versions, currentVersionId]
  )
  const previousVersion = useMemo(
    () => versions.find((v) => v.status === 'rolled_back'),
    [versions]
  )

  const toggleExpand = (versionId: string) => {
    setExpandedVersions((prev) => {
      const next = new Set(prev)
      if (next.has(versionId)) {
        next.delete(versionId)
      } else {
        next.add(versionId)
      }
      return next
    })
  }

  const handlePublish = (version: RuleVersion) => {
    setSelectedVersion(version)
    setPublishDialogOpen(true)
  }

  const handleRollback = (version: RuleVersion) => {
    setSelectedVersion(version)
    setRollbackDialogOpen(true)
  }

  const handleViewDiff = (version: RuleVersion) => {
    // Compare with the previous version
    const currentIdx = versions.findIndex((v) => v.id === version.id)
    const prevVersion = versions[currentIdx + 1]
    if (prevVersion) {
      setDiffVersions({ v1: version.version, v2: prevVersion.version })
      setSelectedVersion(version)
      setDiffDialogOpen(true)
    } else {
      toast.info('没有可对比的历史版本')
    }
  }

  const handleConfirmPublish = (config: GrayReleaseConfig) => {
    if (selectedVersion) {
      onPublish?.(selectedVersion.id, config)
      toast.success(`版本 ${selectedVersion.version} 发布成功`)
    }
  }

  const handleConfirmRollback = () => {
    if (selectedVersion) {
      onRollback?.(selectedVersion.id)
      toast.success(`已回滚到 ${selectedVersion.version}`)
    }
  }

  const diffs = useMemo(() => {
    if (!diffVersions || !selectedVersion) return []
    const prevVersion = versions.find((v) => v.version === diffVersions.v2)
    if (!prevVersion) return []
    return getVersionDiff(selectedVersion.id, prevVersion.id)
  }, [diffVersions, selectedVersion, versions])

  if (versions.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <GitBranch className="h-10 w-10 text-muted-foreground/50" />
          <p className="mt-3 text-sm text-muted-foreground">暂无版本记录</p>
          <p className="text-xs text-muted-foreground/70">
            保存规则后将创建第一个版本
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">版本管理</h3>
          <Badge variant="secondary" className="text-xs">
            {versions.length} 个版本
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="text-xs border-blue-200 bg-blue-50 text-blue-700"
          >
            当前: {currentVersion?.version}
          </Badge>
        </div>
      </div>

      {/* Version list */}
      <ScrollArea className="max-h-[500px]">
        <div className="space-y-3 pr-3">
          {versions.map((version) => (
            <VersionCard
              key={version.id}
              version={version}
              isCurrent={version.id === currentVersion?.id}
              isPrevious={version.id === previousVersion?.id}
              onPublish={() => handlePublish(version)}
              onRollback={() => handleRollback(version)}
              onViewDiff={() => handleViewDiff(version)}
              onToggleExpand={() => toggleExpand(version.id)}
              expanded={expandedVersions.has(version.id)}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Diff Dialog */}
      <Dialog open={diffDialogOpen} onOpenChange={setDiffDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GitCompare className="h-5 w-5 text-blue-500" />
              版本对比
            </DialogTitle>
            <DialogDescription>
              {diffVersions?.v2} → {diffVersions?.v1}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[400px]">
            <DiffView
              diffs={diffs}
              version1={diffVersions?.v1 ?? ''}
              version2={diffVersions?.v2 ?? ''}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Publish Dialog */}
      <PublishDialog
        open={publishDialogOpen}
        onOpenChange={setPublishDialogOpen}
        version={selectedVersion}
        onConfirm={handleConfirmPublish}
      />

      {/* Rollback Dialog */}
      <RollbackDialog
        open={rollbackDialogOpen}
        onOpenChange={setRollbackDialogOpen}
        version={selectedVersion}
        onConfirm={handleConfirmRollback}
      />
    </div>
  )
}

export default VersionControl

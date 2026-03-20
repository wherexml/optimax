/**
 * Report Template Library Component
 * FE-080: Template library with directory tree, card grid, and search
 */

import { useState, useMemo } from 'react'
import {
  FileText,
  Calendar,
  LayoutTemplate,
  Clock,
  Search,
  MoreHorizontal,
  Copy,
  Eye,
  Plus,
  FolderOpen,
  ChevronRight,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { EmptyState } from '@/components/common/EmptyState'
import {
  reportTemplates,
  type ReportTemplate,
} from '@/mocks/data/reports'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TemplateLibraryProps {
  onSelectTemplate: (template: ReportTemplate) => void
  selectedTemplateId?: string
  className?: string
}

interface TemplateCategory {
  id: string
  name: string
  icon: React.ReactNode
  types: ReportTemplate['type'][]
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const categories: TemplateCategory[] = [
  {
    id: 'daily',
    name: '日报',
    icon: <Clock className="h-4 w-4" />,
    types: ['daily'],
  },
  {
    id: 'weekly',
    name: '周报',
    icon: <Calendar className="h-4 w-4" />,
    types: ['weekly'],
  },
  {
    id: 'monthly',
    name: '月报',
    icon: <FileText className="h-4 w-4" />,
    types: ['monthly'],
  },
  {
    id: 'retrospective',
    name: '复盘报告',
    icon: <LayoutTemplate className="h-4 w-4" />,
    types: ['retrospective'],
  },
  {
    id: 'special',
    name: '专题报告',
    icon: <FolderOpen className="h-4 w-4" />,
    types: ['special'],
  },
]

const typeColors: Record<ReportTemplate['type'], string> = {
  daily: 'bg-blue-100 text-blue-800',
  weekly: 'bg-emerald-100 text-emerald-800',
  monthly: 'bg-violet-100 text-violet-800',
  special: 'bg-amber-100 text-amber-800',
  retrospective: 'bg-rose-100 text-rose-800',
}

const typeLabels: Record<ReportTemplate['type'], string> = {
  daily: '日报',
  weekly: '周报',
  monthly: '月报',
  special: '专题',
  retrospective: '复盘',
}

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

function TemplateCard({
  template,
  isSelected,
  onSelect,
  onPreview,
  onDuplicate,
}: {
  template: ReportTemplate
  isSelected: boolean
  onSelect: () => void
  onPreview: () => void
  onDuplicate: () => void
}) {
  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md',
        isSelected && 'ring-2 ring-primary ring-offset-1'
      )}
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className={cn('text-xs', typeColors[template.type])}
              >
                {typeLabels[template.type]}
              </Badge>
              {template.isBuiltin && (
                <Badge variant="outline" className="text-xs">
                  内置
                </Badge>
              )}
            </div>
            <h4 className="mt-2 font-medium text-sm line-clamp-1">
              {template.name}
            </h4>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 -mr-2"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onPreview() }}>
                <Eye className="mr-2 h-4 w-4" />
                预览
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDuplicate() }}>
                <Copy className="mr-2 h-4 w-4" />
                复制模板
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-muted-foreground line-clamp-2">
          {template.description}
        </p>
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>{template.sections.length} 个章节</span>
          <span>已使用 {template.useCount} 次</span>
        </div>
      </CardContent>
    </Card>
  )
}

function CategoryTree({
  categories,
  activeCategory,
  onSelectCategory,
  templates,
}: {
  categories: TemplateCategory[]
  activeCategory: string | null
  onSelectCategory: (id: string | null) => void
  templates: ReportTemplate[]
}) {
  const getCount = (types: ReportTemplate['type'][]) =>
    templates.filter((t) => types.includes(t.type)).length

  return (
    <div className="space-y-1">
      <button
        onClick={() => onSelectCategory(null)}
        className={cn(
          'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
          activeCategory === null
            ? 'bg-primary/10 text-primary font-medium'
            : 'hover:bg-muted text-muted-foreground'
        )}
      >
        <LayoutTemplate className="h-4 w-4" />
        <span className="flex-1">全部模板</span>
        <Badge variant="secondary" className="text-xs">
          {templates.length}
        </Badge>
      </button>
      <Separator className="my-2" />
      {categories.map((category) => {
        const count = getCount(category.types)
        const isActive = activeCategory === category.id
        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={cn(
              'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
              isActive
                ? 'bg-primary/10 text-primary font-medium'
                : 'hover:bg-muted text-muted-foreground'
            )}
          >
            {category.icon}
            <span className="flex-1">{category.name}</span>
            <Badge variant="secondary" className="text-xs">
              {count}
            </Badge>
          </button>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function TemplateLibrary({
  onSelectTemplate,
  selectedTemplateId,
  className,
}: TemplateLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filteredTemplates = useMemo(() => {
    let result = reportTemplates

    if (activeCategory) {
      const category = categories.find((c) => c.id === activeCategory)
      if (category) {
        result = result.filter((t) => category.types.includes(t.type))
      }
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query)
      )
    }

    return result
  }, [searchQuery, activeCategory])

  const handlePreview = (template: ReportTemplate) => {
    // Preview logic - could open a modal
    console.log('Preview template:', template)
  }

  const handleDuplicate = (template: ReportTemplate) => {
    // Duplicate logic
    console.log('Duplicate template:', template)
  }

  return (
    <div className={cn('flex h-full gap-4', className)}>
      {/* Left Sidebar - Category Tree */}
      <div className="w-56 flex-shrink-0">
        <div className="rounded-lg border bg-card p-3">
          <h3 className="mb-3 px-3 text-sm font-medium">模板分类</h3>
          <CategoryTree
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            templates={reportTemplates}
          />
        </div>
      </div>

      {/* Main Content - Template Grid */}
      <div className="flex-1">
        {/* Search Bar */}
        <div className="mb-4 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="搜索模板名称或描述..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="sm">
            <Plus className="mr-1.5 h-4 w-4" />
            新建模板
          </Button>
        </div>

        {/* Template Grid */}
        <ScrollArea className="h-[calc(100vh-280px)]">
          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isSelected={template.id === selectedTemplateId}
                  onSelect={() => onSelectTemplate(template)}
                  onPreview={() => handlePreview(template)}
                  onDuplicate={() => handleDuplicate(template)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              variant="search"
              title="未找到模板"
              description="尝试调整搜索词或选择其他分类"
            />
          )}
        </ScrollArea>

        {/* Quick Stats */}
        <div className="mt-4 flex items-center gap-6 border-t pt-4 text-xs text-muted-foreground">
          <span>共 {reportTemplates.length} 个模板</span>
          <span className="flex items-center gap-1">
            <ChevronRight className="h-3 w-3" />
            内置 {reportTemplates.filter((t) => t.isBuiltin).length} 个
          </span>
          <span className="flex items-center gap-1">
            <ChevronRight className="h-3 w-3" />
            自定义 {reportTemplates.filter((t) => !t.isBuiltin).length} 个
          </span>
        </div>
      </div>
    </div>
  )
}

export default TemplateLibrary

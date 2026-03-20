import { useState, useMemo } from 'react'
import { Building2, ChevronDown, ChevronRight, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useOrganizationStore, type OrgNode } from '@/stores/organization'
import { organizationTree } from '@/mocks/data/organizations'

export default function OrgSwitcher() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const { currentOrg, setCurrentOrg } = useOrganizationStore()

  const displayName = currentOrg?.name ?? '华智集团'

  function handleSelect(node: OrgNode) {
    setCurrentOrg(node)
    setOpen(false)
    setSearch('')
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="h-9 gap-2 px-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        >
          <Building2 className="h-4 w-4 text-brand-500" />
          <span className="max-w-[160px] truncate">{displayName}</span>
          <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-72 p-0"
        align="start"
        sideOffset={8}
      >
        <div className="border-b p-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索组织..."
              className="h-8 pl-8 text-sm"
            />
          </div>
        </div>
        <ScrollArea className="max-h-72">
          <div className="p-1">
            {organizationTree.map((node) => (
              <OrgTreeNode
                key={node.id}
                node={node}
                search={search}
                selectedId={currentOrg?.id ?? null}
                onSelect={handleSelect}
                level={0}
              />
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

function OrgTreeNode({
  node,
  search,
  selectedId,
  onSelect,
  level,
}: {
  node: OrgNode
  search: string
  selectedId: string | null
  onSelect: (node: OrgNode) => void
  level: number
}) {
  const [expanded, setExpanded] = useState(true)
  const hasChildren = !!node.children?.length

  const matchesSelf = useMemo(
    () =>
      !search ||
      node.name.toLowerCase().includes(search.toLowerCase()),
    [search, node.name],
  )

  const matchesDescendant = useMemo(() => {
    if (!search || !node.children) return false
    function check(nodes: OrgNode[]): boolean {
      return nodes.some(
        (n) =>
          n.name.toLowerCase().includes(search.toLowerCase()) ||
          (n.children && check(n.children)),
      )
    }
    return check(node.children)
  }, [search, node.children])

  if (search && !matchesSelf && !matchesDescendant) return null

  const isSelected = node.id === selectedId

  const typeLabel: Record<string, string> = {
    group: '集团',
    division: '事业部',
    branch: '分公司',
    factory: '工厂',
  }

  return (
    <div>
      <button
        onClick={() => {
          onSelect(node)
        }}
        className={cn(
          'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-neutral-50',
          isSelected && 'bg-brand-50 text-brand-500 font-medium',
          !isSelected && 'text-neutral-700',
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {hasChildren ? (
          <span
            onClick={(e) => {
              e.stopPropagation()
              setExpanded((prev) => !prev)
            }}
            className="flex h-4 w-4 shrink-0 items-center justify-center"
          >
            {expanded ? (
              <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
            )}
          </span>
        ) : (
          <span className="h-4 w-4 shrink-0" />
        )}
        <span className="flex-1 truncate text-left">{node.name}</span>
        <span className="shrink-0 text-[10px] text-neutral-400">
          {typeLabel[node.type] ?? ''}
        </span>
      </button>
      {hasChildren && expanded && (
        <div>
          {node.children!.map((child) => (
            <OrgTreeNode
              key={child.id}
              node={child}
              search={search}
              selectedId={selectedId}
              onSelect={onSelect}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

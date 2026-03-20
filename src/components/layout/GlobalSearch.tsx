import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  AlertTriangle,
  Building2,
  Clock,
  FolderKanban,
  Search,
} from 'lucide-react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'

// ---------------------------------------------------------------------------
// Mock searchable data
// ---------------------------------------------------------------------------

interface SearchableItem {
  id: string
  title: string
  category: 'event' | 'supplier' | 'case'
  url: string
}

const SEARCHABLE_DATA: SearchableItem[] = [
  // Events
  {
    id: 'evt-001',
    title: '供应商A原材料短缺',
    category: 'event',
    url: '/risk/events/evt-001',
  },
  {
    id: 'evt-002',
    title: '深圳工厂质检不合格',
    category: 'event',
    url: '/risk/events/evt-002',
  },
  {
    id: 'evt-003',
    title: '华东区域物流延迟',
    category: 'event',
    url: '/risk/events/evt-003',
  },
  // Suppliers
  {
    id: 'sup-001',
    title: '华芯科技',
    category: 'supplier',
    url: '/suppliers/sup-001',
  },
  {
    id: 'sup-002',
    title: '鸿运电子',
    category: 'supplier',
    url: '/suppliers/sup-002',
  },
  {
    id: 'sup-003',
    title: '金诚材料',
    category: 'supplier',
    url: '/suppliers/sup-003',
  },
  {
    id: 'sup-004',
    title: '东方精密',
    category: 'supplier',
    url: '/suppliers/sup-004',
  },
  // Cases
  {
    id: 'case-001',
    title: 'Case-001 紧急替代方案',
    category: 'case',
    url: '/warroom/case-001',
  },
  {
    id: 'case-002',
    title: 'Case-002 质量整改',
    category: 'case',
    url: '/warroom/case-002',
  },
]

const CATEGORY_CONFIG = {
  event: { label: '事件', icon: AlertTriangle },
  supplier: { label: '供应商', icon: Building2 },
  case: { label: 'Case', icon: FolderKanban },
} as const

const RECENT_SEARCHES_KEY = 'optimax_recent_searches'
const MAX_RECENT = 5

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getRecentSearches(): SearchableItem[] {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY)
    return raw ? (JSON.parse(raw) as SearchableItem[]) : []
  } catch {
    return []
  }
}

function saveRecentSearch(item: SearchableItem) {
  const recent = getRecentSearches().filter((r) => r.id !== item.id)
  recent.unshift(item)
  localStorage.setItem(
    RECENT_SEARCHES_KEY,
    JSON.stringify(recent.slice(0, MAX_RECENT)),
  )
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState<SearchableItem[]>([])
  const navigate = useNavigate()

  // Cmd/Ctrl+K shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Load recent searches when dialog opens
  useEffect(() => {
    if (open) {
      setRecentSearches(getRecentSearches())
    }
  }, [open])

  const handleSelect = useCallback(
    (item: SearchableItem) => {
      saveRecentSearch(item)
      setOpen(false)
      navigate({ to: item.url })
    },
    [navigate],
  )

  // Group data by category
  const events = SEARCHABLE_DATA.filter((d) => d.category === 'event')
  const suppliers = SEARCHABLE_DATA.filter((d) => d.category === 'supplier')
  const cases = SEARCHABLE_DATA.filter((d) => d.category === 'case')

  return (
    <>
      {/* Trigger button in TopBar */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="hidden h-8 gap-2 border-neutral-200 bg-neutral-50 px-3 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 sm:flex"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="text-sm">搜索...</span>
        <kbd className="pointer-events-none ml-1 inline-flex h-5 select-none items-center gap-0.5 rounded border border-neutral-200 bg-white px-1.5 font-mono text-[10px] font-medium text-neutral-400">
          <span className="text-xs">&#8984;</span>K
        </kbd>
      </Button>

      {/* Mobile: icon-only */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="h-8 w-8 text-neutral-500 hover:text-neutral-700 sm:hidden"
      >
        <Search className="h-4 w-4" />
      </Button>

      {/* Command Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="搜索事件、供应商、Case..." />
        <CommandList>
          <CommandEmpty>未找到匹配结果</CommandEmpty>

          {/* Recent searches */}
          {recentSearches.length > 0 && (
            <CommandGroup heading="最近搜索">
              {recentSearches.map((item) => {
                const Icon = CATEGORY_CONFIG[item.category].icon
                return (
                  <CommandItem
                    key={`recent-${item.id}`}
                    value={item.title}
                    onSelect={() => handleSelect(item)}
                  >
                    <Clock className="mr-2 h-4 w-4 text-neutral-400" />
                    <span>{item.title}</span>
                    <Icon className="ml-auto h-3.5 w-3.5 text-neutral-400" />
                  </CommandItem>
                )
              })}
            </CommandGroup>
          )}

          {recentSearches.length > 0 && <CommandSeparator />}

          {/* Events */}
          <CommandGroup heading="事件">
            {events.map((item) => (
              <CommandItem
                key={item.id}
                value={item.title}
                onSelect={() => handleSelect(item)}
              >
                <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
                <span>{item.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          {/* Suppliers */}
          <CommandGroup heading="供应商">
            {suppliers.map((item) => (
              <CommandItem
                key={item.id}
                value={item.title}
                onSelect={() => handleSelect(item)}
              >
                <Building2 className="mr-2 h-4 w-4 text-blue-500" />
                <span>{item.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          {/* Cases */}
          <CommandGroup heading="Case">
            {cases.map((item) => (
              <CommandItem
                key={item.id}
                value={item.title}
                onSelect={() => handleSelect(item)}
              >
                <FolderKanban className="mr-2 h-4 w-4 text-purple-500" />
                <span>{item.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}

import { useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table'
import { Inbox } from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

import { DataTablePagination } from './DataTablePagination'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DataTableProps<TData, TValue> {
  /** Column definitions */
  columns: ColumnDef<TData, TValue>[]
  /** Row data */
  data: TData[]
  /** Show loading skeleton */
  isLoading?: boolean
  /** Number of skeleton rows to show while loading */
  skeletonRowCount?: number
  /** Enable row selection */
  enableRowSelection?: boolean
  /** Enable multi-row selection (requires enableRowSelection) */
  enableMultiRowSelection?: boolean
  /** Callback when row selection changes */
  onRowSelectionChange?: (selection: RowSelectionState) => void
  /** Callback when a row is clicked */
  onRowClick?: (row: TData) => void
  /** Initial page size */
  pageSize?: number
  /** Page size options */
  pageSizeOptions?: number[]
  /** Show pagination controls */
  showPagination?: boolean
  /** Custom empty state message */
  emptyMessage?: string
  /** Custom empty state icon */
  emptyIcon?: React.ReactNode
  /** Max height for scrollable body (e.g., "500px", "calc(100vh - 300px)") */
  maxHeight?: string
  /** Additional className for the wrapper */
  className?: string
  /** Toolbar content rendered before column configuration */
  toolbarContent?: React.ReactNode
}

// ---------------------------------------------------------------------------
// Skeleton Rows
// ---------------------------------------------------------------------------

function DataTableSkeleton({
  columns,
  rowCount,
}: {
  columns: number
  rowCount: number
}) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, rowIdx) => (
        <TableRow key={rowIdx}>
          {Array.from({ length: columns }).map((_, colIdx) => (
            <TableCell key={colIdx}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

// ---------------------------------------------------------------------------
// Empty State
// ---------------------------------------------------------------------------

function DataTableEmpty({
  colSpan,
  message,
  icon,
}: {
  colSpan: number
  message: string
  icon?: React.ReactNode
}) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-32 text-center">
        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
          {icon ?? <Inbox className="h-8 w-8" />}
          <span className="text-sm">{message}</span>
        </div>
      </TableCell>
    </TableRow>
  )
}

// ---------------------------------------------------------------------------
// DataTable
// ---------------------------------------------------------------------------

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  skeletonRowCount = 5,
  enableRowSelection = false,
  enableMultiRowSelection = true,
  onRowSelectionChange,
  onRowClick,
  pageSize = 20,
  pageSizeOptions = [20, 50, 100],
  showPagination = true,
  emptyMessage = '暂无数据',
  emptyIcon,
  maxHeight,
  className,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  })

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    enableRowSelection,
    enableMultiRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: (updater) => {
      const next =
        typeof updater === 'function' ? updater(rowSelection) : updater
      setRowSelection(next)
      onRowSelectionChange?.(next)
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className={cn('space-y-0', className)}>
      <div
        className="rounded-md border"
        style={maxHeight ? { maxHeight, overflow: 'auto' } : undefined}
      >
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted/95 backdrop-blur-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <DataTableSkeleton
                columns={columns.length}
                rowCount={skeletonRowCount}
              />
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn(onRowClick && 'cursor-pointer')}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <DataTableEmpty
                colSpan={columns.length}
                message={emptyMessage}
                icon={emptyIcon}
              />
            )}
          </TableBody>
        </Table>
      </div>
      {showPagination && !isLoading && data.length > 0 && (
        <DataTablePagination
          table={table}
          pageSizeOptions={pageSizeOptions}
        />
      )}
    </div>
  )
}

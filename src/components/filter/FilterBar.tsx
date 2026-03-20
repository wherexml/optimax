import { useState, useCallback } from 'react'
import { CalendarIcon, Search } from 'lucide-react'
import { format } from 'date-fns'
import type { DateRange } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FilterType =
  | 'text'
  | 'select'
  | 'multi-select'
  | 'date-range'
  | 'number-range'

export interface FilterOption {
  label: string
  value: string
}

export interface FilterFieldConfig {
  /** Unique key for this filter */
  key: string
  /** Display label */
  label: string
  /** Filter input type */
  type: FilterType
  /** Placeholder text */
  placeholder?: string
  /** Options for select / multi-select */
  options?: FilterOption[]
  /** Min value for number-range */
  min?: number
  /** Max value for number-range */
  max?: number
}

export type FilterValue =
  | string
  | string[]
  | DateRange
  | { min?: number; max?: number }

export type FilterValues = Record<string, FilterValue>

// ---------------------------------------------------------------------------
// FilterComponent
// ---------------------------------------------------------------------------

interface FilterComponentProps {
  config: FilterFieldConfig
  value: FilterValue | undefined
  onChange: (key: string, value: FilterValue | undefined) => void
}

export function FilterComponent({
  config,
  value,
  onChange,
}: FilterComponentProps) {
  const { key, type, label, placeholder, options = [], min, max } = config

  switch (type) {
    case 'text':
      return (
        <div className="flex items-center gap-1">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholder ?? label}
            value={(value as string) ?? ''}
            onChange={(e) =>
              onChange(key, e.target.value || undefined)
            }
            className="h-8 w-[180px]"
          />
        </div>
      )

    case 'select':
      return (
        <Select
          value={(value as string) ?? ''}
          onValueChange={(v) => onChange(key, v || undefined)}
        >
          <SelectTrigger className="h-8 w-[160px]">
            <SelectValue placeholder={placeholder ?? label} />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )

    case 'multi-select':
      return <MultiSelectFilter config={config} value={value} onChange={onChange} />

    case 'date-range':
      return <DateRangeFilter keyName={key} value={value as DateRange | undefined} onChange={onChange} placeholder={placeholder ?? label} />

    case 'number-range':
      return (
        <NumberRangeFilter
          keyName={key}
          value={value as { min?: number; max?: number } | undefined}
          onChange={onChange}
          min={min}
          max={max}
          placeholder={placeholder ?? label}
        />
      )

    default:
      return null
  }
}

// ---------------------------------------------------------------------------
// MultiSelect (internal)
// ---------------------------------------------------------------------------

function MultiSelectFilter({
  config,
  value,
  onChange,
}: FilterComponentProps) {
  const selected = (value as string[]) ?? []
  const options = config.options ?? []

  const toggle = (optValue: string) => {
    const next = selected.includes(optValue)
      ? selected.filter((v) => v !== optValue)
      : [...selected, optValue]
    onChange(config.key, next.length > 0 ? next : undefined)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          {config.label}
          {selected.length > 0 && (
            <Badge variant="secondary" className="ml-1 rounded-sm px-1 text-xs">
              {selected.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-2" align="start">
        <div className="space-y-1">
          {options.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
            >
              <Checkbox
                checked={selected.includes(opt.value)}
                onCheckedChange={() => toggle(opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

// ---------------------------------------------------------------------------
// DateRange (internal)
// ---------------------------------------------------------------------------

function DateRangeFilter({
  keyName,
  value,
  onChange,
  placeholder,
}: {
  keyName: string
  value: DateRange | undefined
  onChange: (key: string, value: FilterValue | undefined) => void
  placeholder: string
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn('h-8 justify-start text-left font-normal', !value && 'text-muted-foreground')}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value?.from ? (
            value.to ? (
              <>
                {format(value.from, 'yyyy-MM-dd')} ~ {format(value.to, 'yyyy-MM-dd')}
              </>
            ) : (
              format(value.from, 'yyyy-MM-dd')
            )
          ) : (
            placeholder
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={value}
          onSelect={(range) => onChange(keyName, range ?? undefined)}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  )
}

// ---------------------------------------------------------------------------
// NumberRange (internal)
// ---------------------------------------------------------------------------

function NumberRangeFilter({
  keyName,
  value,
  onChange,
  min: minBound,
  max: maxBound,
  placeholder,
}: {
  keyName: string
  value: { min?: number; max?: number } | undefined
  onChange: (key: string, value: FilterValue | undefined) => void
  min?: number
  max?: number
  placeholder: string
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn('h-8', !value && 'text-muted-foreground')}
        >
          {value?.min != null || value?.max != null
            ? `${value.min ?? ''} - ${value.max ?? ''}`
            : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] space-y-2 p-3" align="start">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="最小值"
            min={minBound}
            max={maxBound}
            value={value?.min ?? ''}
            onChange={(e) => {
              const v = e.target.value ? Number(e.target.value) : undefined
              const next = { ...value, min: v }
              const hasValue = next.min != null || next.max != null
              onChange(keyName, hasValue ? next : undefined)
            }}
            className="h-8"
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="number"
            placeholder="最大值"
            min={minBound}
            max={maxBound}
            value={value?.max ?? ''}
            onChange={(e) => {
              const v = e.target.value ? Number(e.target.value) : undefined
              const next = { ...value, max: v }
              const hasValue = next.min != null || next.max != null
              onChange(keyName, hasValue ? next : undefined)
            }}
            className="h-8"
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}

// ---------------------------------------------------------------------------
// ActiveFilters
// ---------------------------------------------------------------------------

interface ActiveFiltersProps {
  fields: FilterFieldConfig[]
  values: FilterValues
  onRemove: (key: string) => void
  onReset: () => void
}

function formatFilterValue(
  field: FilterFieldConfig,
  value: FilterValue
): string {
  switch (field.type) {
    case 'text':
    case 'select': {
      const str = value as string
      const opt = field.options?.find((o) => o.value === str)
      return opt ? opt.label : str
    }
    case 'multi-select': {
      const arr = value as string[]
      return arr
        .map((v) => field.options?.find((o) => o.value === v)?.label ?? v)
        .join(', ')
    }
    case 'date-range': {
      const dr = value as DateRange
      if (!dr.from) return ''
      return dr.to
        ? `${format(dr.from, 'MM/dd')} ~ ${format(dr.to, 'MM/dd')}`
        : format(dr.from, 'yyyy-MM-dd')
    }
    case 'number-range': {
      const nr = value as { min?: number; max?: number }
      return `${nr.min ?? ''} - ${nr.max ?? ''}`
    }
    default:
      return String(value)
  }
}

export function ActiveFilters({
  fields,
  values,
  onRemove,
  onReset,
}: ActiveFiltersProps) {
  const activeKeys = Object.keys(values).filter(
    (k) => values[k] !== undefined
  )

  if (activeKeys.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {activeKeys.map((key) => {
        const field = fields.find((f) => f.key === key)
        if (!field) return null
        return (
          <Badge key={key} variant="secondary" className="gap-1 pr-1">
            <span className="text-muted-foreground">{field.label}:</span>
            <span>{formatFilterValue(field, values[key])}</span>
            <button
              type="button"
              className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
              onClick={() => onRemove(key)}
              aria-label={`移除筛选 ${field.label}`}
            >
              <span className="text-xs leading-none">&times;</span>
            </button>
          </Badge>
        )
      })}
      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2 text-xs text-muted-foreground"
        onClick={onReset}
      >
        全部重置
      </Button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// FilterBar
// ---------------------------------------------------------------------------

interface FilterBarProps {
  /** Filter field definitions */
  fields: FilterFieldConfig[]
  /** Controlled filter values */
  values?: FilterValues
  /** Callback when any filter changes */
  onChange?: (values: FilterValues) => void
  /** Additional className */
  className?: string
}

export function FilterBar({
  fields,
  values: controlledValues,
  onChange,
  className,
}: FilterBarProps) {
  const [internalValues, setInternalValues] = useState<FilterValues>({})
  const values = controlledValues ?? internalValues

  const handleChange = useCallback(
    (key: string, value: FilterValue | undefined) => {
      const next = { ...values }
      if (value === undefined) {
        delete next[key]
      } else {
        next[key] = value
      }
      if (!controlledValues) {
        setInternalValues(next)
      }
      onChange?.(next)
    },
    [values, controlledValues, onChange]
  )

  const handleRemove = useCallback(
    (key: string) => handleChange(key, undefined),
    [handleChange]
  )

  const handleReset = useCallback(() => {
    if (!controlledValues) {
      setInternalValues({})
    }
    onChange?.({})
  }, [controlledValues, onChange])

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex flex-wrap items-center gap-2">
        {fields.map((field) => (
          <FilterComponent
            key={field.key}
            config={field}
            value={values[field.key]}
            onChange={handleChange}
          />
        ))}
      </div>
      <ActiveFilters
        fields={fields}
        values={values}
        onRemove={handleRemove}
        onReset={handleReset}
      />
    </div>
  )
}

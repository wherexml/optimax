/**
 * ScenarioBuilder Component
 *
 * FE-110: 场景构建器
 * - 关联事件选择
 * - 受影响对象选择
 * - 时间窗设置
 * - 服务水平目标
 * - 业务优先级权重滑块
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar,
  Target,
  AlertCircle,
  Package,
  Building2,
  Truck,
  TrendingUp,
  Copy,
  Check,
  ChevronDown,
} from 'lucide-react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { severity } from '@/lib/tokens/colors'

import type { OptimizationScenario, PriorityWeights, AffectedObject } from '@/types/optimization'
import { mockEventsForSelection, mockAffectedObjects } from '@/mocks/data/optimization'

interface ScenarioBuilderProps {
  scenario?: OptimizationScenario
  onSave?: (scenario: Partial<OptimizationScenario>) => void
  onCopy?: () => void
  className?: string
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

// Object type icons
const objectTypeIcons: Record<AffectedObject['type'], typeof Package> = {
  supplier: Building2,
  material: Package,
  order: Truck,
  site: Building2,
  warehouse: Building2,
}

const objectTypeLabels: Record<AffectedObject['type'], string> = {
  supplier: '供应商',
  material: '物料',
  order: '订单',
  site: '生产基地',
  warehouse: '仓库',
}

export function ScenarioBuilder({ scenario, onSave, onCopy, className }: ScenarioBuilderProps) {
  const [selectedEvent, setSelectedEvent] = useState(scenario?.eventId || '')
  const [selectedObjects, setSelectedObjects] = useState<string[]>(
    scenario?.affectedObjects.map(o => o.id) || []
  )
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: scenario?.timeWindow.start ? new Date(scenario.timeWindow.start) : undefined,
    to: scenario?.timeWindow.end ? new Date(scenario.timeWindow.end) : undefined,
  })
  const [serviceTarget, setServiceTarget] = useState(scenario?.serviceLevel.target || 95)
  const [serviceMinimum, setServiceMinimum] = useState(scenario?.serviceLevel.minimum || 90)
  const [weights, setWeights] = useState<PriorityWeights>({
    cost: scenario?.priorityWeights.cost ?? 30,
    delivery: scenario?.priorityWeights.delivery ?? 50,
    risk: scenario?.priorityWeights.risk ?? 20,
  })
  const [copied, setCopied] = useState(false)
  const [eventSearchOpen, setEventSearchOpen] = useState(false)

  // Normalize weights to sum to 100
  const normalizeWeights = (newWeights: Partial<PriorityWeights>) => {
    const updated = { ...weights, ...newWeights }
    const sum = updated.cost + updated.delivery + updated.risk
    if (sum > 0) {
      const factor = 100 / sum
      return {
        cost: Math.round(updated.cost * factor),
        delivery: Math.round(updated.delivery * factor),
        risk: Math.round(updated.risk * factor),
      }
    }
    return updated
  }

  const handleWeightChange = (key: keyof PriorityWeights, value: number) => {
    setWeights(prev => normalizeWeights({ ...prev, [key]: value }))
  }

  const handleObjectToggle = (objectId: string) => {
    setSelectedObjects(prev =>
      prev.includes(objectId)
        ? prev.filter(id => id !== objectId)
        : [...prev, objectId]
    )
  }

  const handleCopy = () => {
    onCopy?.()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = () => {
    const selectedEventData = mockEventsForSelection.find(e => e.id === selectedEvent)
    onSave?.({
      eventId: selectedEvent,
      eventTitle: selectedEventData?.title,
      affectedObjects: mockAffectedObjects.filter(o => selectedObjects.includes(o.id)),
      timeWindow: {
        start: dateRange.from?.toISOString() || new Date().toISOString(),
        end: dateRange.to?.toISOString() || new Date().toISOString(),
      },
      serviceLevel: {
        target: serviceTarget,
        minimum: serviceMinimum,
      },
      priorityWeights: weights,
    })
  }

  const selectedEventData = mockEventsForSelection.find(e => e.id === selectedEvent)

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className={cn('space-y-6', className)}
    >
      {/* Header Actions */}
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {scenario ? scenario.name : '新建优化场景'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            配置优化参数，定义约束条件和业务目标
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            复制场景
          </Button>
          <Button size="sm" onClick={handleSave}>
            保存场景
          </Button>
        </div>
      </motion.div>

      {/* Associated Event */}
      <motion.div variants={fadeInUp}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blue-500" />
              关联事件
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Popover open={eventSearchOpen} onOpenChange={setEventSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={eventSearchOpen}
                  className="w-full justify-between"
                >
                  {selectedEventData ? (
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor:
                            severity[selectedEventData.severity as keyof typeof severity]?.DEFAULT ||
                            severity.medium.DEFAULT,
                        }}
                      />
                      <span className="truncate">{selectedEventData.title}</span>
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {selectedEventData.date}
                      </Badge>
                    </div>
                  ) : (
                    '选择关联事件...'
                  )}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="搜索事件..." />
                  <CommandList>
                    <CommandEmpty>未找到匹配的事件</CommandEmpty>
                    <CommandGroup>
                      {mockEventsForSelection.map(event => (
                        <CommandItem
                          key={event.id}
                          value={event.id}
                          onSelect={() => {
                            setSelectedEvent(event.id)
                            setEventSearchOpen(false)
                          }}
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{
                                backgroundColor:
                                  severity[event.severity as keyof typeof severity]?.DEFAULT ||
                                  severity.medium.DEFAULT,
                              }}
                            />
                            <span className="flex-1">{event.title}</span>
                            <Badge variant="secondary" className="text-xs">
                              {event.date}
                            </Badge>
                          </div>
                          {selectedEvent === event.id && (
                            <Check className="ml-2 h-4 w-4" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>
      </motion.div>

      {/* Affected Objects */}
      <motion.div variants={fadeInUp}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Package className="w-4 h-4 text-purple-500" />
              受影响对象
              <Badge variant="secondary" className="ml-2">
                {selectedObjects.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {mockAffectedObjects.map(object => {
                const Icon = objectTypeIcons[object.type]
                const isSelected = selectedObjects.includes(object.id)
                return (
                  <button
                    key={object.id}
                    onClick={() => handleObjectToggle(object.id)}
                    className={cn(
                      'flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-200',
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-6 h-6 mb-2',
                        isSelected ? 'text-blue-500' : 'text-gray-400'
                      )}
                    />
                    <span
                      className={cn(
                        'text-xs font-medium text-center',
                        isSelected ? 'text-blue-700' : 'text-gray-700'
                      )}
                    >
                      {object.name}
                    </span>
                    <span className="text-[10px] text-gray-400 mt-1">
                      {objectTypeLabels[object.type]}
                    </span>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Time Window & Service Level */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Window */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-green-500" />
              优化时间窗
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label className="text-sm text-gray-600 mb-2 block">开始日期</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !dateRange.from && 'text-muted-foreground'
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        format(dateRange.from, 'yyyy年MM月dd日', { locale: zhCN })
                      ) : (
                        <span>选择日期</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={dateRange.from}
                      onSelect={date => setDateRange(prev => ({ ...prev, from: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex-1">
                <Label className="text-sm text-gray-600 mb-2 block">结束日期</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !dateRange.to && 'text-muted-foreground'
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {dateRange.to ? (
                        format(dateRange.to, 'yyyy年MM月dd日', { locale: zhCN })
                      ) : (
                        <span>选择日期</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={dateRange.to}
                      onSelect={date => setDateRange(prev => ({ ...prev, to: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Level Objectives */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Target className="w-4 h-4 text-orange-500" />
              服务水平目标 (SLA)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label className="text-sm text-gray-600">目标服务水平</Label>
                <span className="text-sm font-medium">{serviceTarget}%</span>
              </div>
              <Slider
                value={[serviceTarget]}
                onValueChange={([value]) => setServiceTarget(value)}
                min={80}
                max={100}
                step={1}
              />
              <p className="text-xs text-gray-500">
                优化后需要达到的服务水平百分比
              </p>
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label className="text-sm text-gray-600">最低可接受水平</Label>
                <span className="text-sm font-medium">{serviceMinimum}%</span>
              </div>
              <Slider
                value={[serviceMinimum]}
                onValueChange={([value]) => setServiceMinimum(Math.min(value, serviceTarget))}
                min={70}
                max={100}
                step={1}
              />
              <p className="text-xs text-gray-500">
                低于此水平方案将被标记为不可行
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Priority Weights */}
      <motion.div variants={fadeInUp}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              业务优先级权重
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Cost Weight */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">成本优化</Label>
                  <Badge variant={weights.cost > 40 ? 'default' : 'secondary'}>
                    {weights.cost}%
                  </Badge>
                </div>
                <Slider
                  value={[weights.cost]}
                  onValueChange={([value]) => handleWeightChange('cost', value)}
                  min={0}
                  max={100}
                  step={5}
                />
                <p className="text-xs text-gray-500">
                  优先最小化总成本，包括采购、运输和生产成本
                </p>
              </div>

              {/* Delivery Weight */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">交付保障</Label>
                  <Badge variant={weights.delivery > 40 ? 'default' : 'secondary'}>
                    {weights.delivery}%
                  </Badge>
                </div>
                <Slider
                  value={[weights.delivery]}
                  onValueChange={([value]) => handleWeightChange('delivery', value)}
                  min={0}
                  max={100}
                  step={5}
                />
                <p className="text-xs text-gray-500">
                  优先确保准时交付，最小化延期风险
                </p>
              </div>

              {/* Risk Weight */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">风险控制</Label>
                  <Badge variant={weights.risk > 40 ? 'default' : 'secondary'}>
                    {weights.risk}%
                  </Badge>
                </div>
                <Slider
                  value={[weights.risk]}
                  onValueChange={([value]) => handleWeightChange('risk', value)}
                  min={0}
                  max={100}
                  step={5}
                />
                <p className="text-xs text-gray-500">
                  优先降低供应链风险，增强韧性
                </p>
              </div>
            </div>

            {/* Weight Distribution Bar */}
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 whitespace-nowrap">权重分布:</span>
                <div className="flex-1 h-4 rounded-full overflow-hidden flex">
                  <div
                    className="bg-blue-500 transition-all duration-300"
                    style={{ width: `${weights.cost}%` }}
                  />
                  <div
                    className="bg-green-500 transition-all duration-300"
                    style={{ width: `${weights.delivery}%` }}
                  />
                  <div
                    className="bg-orange-500 transition-all duration-300"
                    style={{ width: `${weights.risk}%` }}
                  />
                </div>
              </div>
              <div className="flex justify-center gap-6 mt-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-xs text-gray-600">成本 {weights.cost}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs text-gray-600">交付 {weights.delivery}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-xs text-gray-600">风险 {weights.risk}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

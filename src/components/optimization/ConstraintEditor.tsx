/**
 * ConstraintEditor Component
 *
 * FE-111: 参数与约束条件编辑面板
 * - 六大参数分组: 成本/交付/产能/合规/库存/物流
 * - 可调范围标注
 * - 实时标记变更项
 * - 保存为模板操作
 */

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign,
  Truck,
  Factory,
  ShieldCheck,
  Package,
  Route,
  Save,
  RotateCcw,
  AlertCircle,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

import type {
  ConstraintParameters,
  AdjustableParameter,
  ConstraintTemplate,
} from '@/types/optimization'
import {
  defaultConstraintParameters,
  mockConstraintTemplates,
} from '@/mocks/data/optimization'

interface ConstraintEditorProps {
  initialParameters?: ConstraintParameters
  onChange?: (parameters: ConstraintParameters, hasChanges: boolean) => void
  onSaveTemplate?: (template: Partial<ConstraintTemplate>) => void
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
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
}

// Parameter group config
const parameterGroups = [
  {
    key: 'cost',
    label: '成本参数',
    icon: DollarSign,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    key: 'delivery',
    label: '交付参数',
    icon: Truck,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  {
    key: 'capacity',
    label: '产能参数',
    icon: Factory,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  {
    key: 'compliance',
    label: '合规参数',
    icon: ShieldCheck,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
  },
  {
    key: 'inventory',
    label: '库存参数',
    icon: Package,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  {
    key: 'logistics',
    label: '物流参数',
    icon: Route,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
  },
] as const

type ParameterGroupKey = typeof parameterGroups[number]['key']

// Single parameter input component
interface ParameterInputProps {
  parameter: AdjustableParameter
  onChange: (value: number) => void
}

function ParameterInput({ parameter, onChange }: ParameterInputProps) {
  const percentage = ((parameter.currentValue - parameter.min) / (parameter.max - parameter.min)) * 100
  const isChanged = parameter.changed || parameter.currentValue !== parameter.defaultValue
  const isNearLimit = percentage > 90 || percentage < 10

  return (
    <div className={cn('p-4 rounded-lg border transition-all duration-200', isChanged ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-200')}>      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium text-gray-900">
              {parameter.name}
            </Label>
            {isChanged && (
              <Badge variant="outline" className="text-amber-600 border-amber-300 text-[10px]">
                已修改
              </Badge>
            )}
            {isNearLimit && (
              <Badge variant="outline" className="text-red-600 border-red-300 text-[10px]">
                接近极限
              </Badge>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">{parameter.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={parameter.currentValue}
            onChange={e => onChange(parseFloat(e.target.value) || 0)}
            className={cn(
              'w-24 text-right font-mono',
              isChanged && 'border-amber-300 bg-amber-50'
            )}
          />
          <span className="text-sm text-gray-500 min-w-[40px]">{parameter.unit}</span>
        </div>
      </div>

      {/* Slider */}
      <div className="space-y-2">
        <Slider
          value={[parameter.currentValue]}
          onValueChange={([value]) => onChange(value)}
          min={parameter.min}
          max={parameter.max}
          step={parameter.unit === '%' || parameter.unit === '倍' ? 0.1 : 1}
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>{parameter.min}{parameter.unit}</span>
          <span className={isChanged ? 'text-amber-600 font-medium' : 'text-gray-500'}>
            默认值: {parameter.defaultValue}{parameter.unit}
          </span>
          <span>{parameter.max}{parameter.unit}</span>
        </div>
      </div>
    </div>
  )
}

export function ConstraintEditor({
  initialParameters,
  onChange,
  onSaveTemplate,
  className,
}: ConstraintEditorProps) {
  const [parameters, setParameters] = useState<ConstraintParameters>(
    initialParameters || defaultConstraintParameters
  )
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const [templateDescription, setTemplateDescription] = useState('')
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['cost', 'delivery'])

  // Check if any parameter has changed
  const hasChanges = useCallback(() => {
    for (const group of parameterGroups) {
      const groupParams = parameters[group.key]
      for (const key of Object.keys(groupParams)) {
        const param = groupParams[key as keyof typeof groupParams] as AdjustableParameter
        if (param.currentValue !== param.defaultValue) {
          return true
        }
      }
    }
    return false
  }, [parameters])

  // Update a specific parameter
  const updateParameter = useCallback(
    (group: ParameterGroupKey, key: string, value: number) => {
      setParameters(prev => {
        const prevParam = prev[group][key as keyof typeof prev[typeof group]] as AdjustableParameter
        const updated: ConstraintParameters = {
          ...prev,
          [group]: {
            ...prev[group],
            [key]: {
              ...prevParam,
              currentValue: value,
              changed: value !== prevParam.defaultValue,
            },
          },
        }
        onChange?.(updated, hasChanges())
        return updated
      })
    },
    [onChange, hasChanges]
  )

  // Reset all parameters to defaults
  const handleReset = useCallback(() => {
    setParameters(defaultConstraintParameters)
    onChange?.(defaultConstraintParameters, false)
  }, [onChange])

  // Load template
  const handleLoadTemplate = useCallback((templateId: string) => {
    const template = mockConstraintTemplates.find(t => t.id === templateId)
    if (template) {
      setParameters(template.parameters)
      setSelectedTemplate(templateId)
      onChange?.(template.parameters, true)
    }
  }, [onChange])

  // Save as template
  const handleSaveTemplate = useCallback(() => {
    if (templateName.trim()) {
      onSaveTemplate?.({
        name: templateName,
        description: templateDescription,
        parameters,
      })
      setSaveDialogOpen(false)
      setTemplateName('')
      setTemplateDescription('')
    }
  }, [templateName, templateDescription, parameters, onSaveTemplate])

  // Get changed parameters count
  const getChangedCount = useCallback(() => {
    let count = 0
    for (const group of parameterGroups) {
      const groupParams = parameters[group.key]
      for (const key of Object.keys(groupParams)) {
        const param = groupParams[key as keyof typeof groupParams] as AdjustableParameter
        if (param.currentValue !== param.defaultValue) {
          count++
        }
      }
    }
    return count
  }, [parameters])

  const changedCount = getChangedCount()

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className={cn('space-y-4', className)}
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">参数与约束条件</h2>
          <p className="text-sm text-gray-500 mt-1">
            配置六大维度约束参数，系统将基于这些条件生成优化方案
          </p>
        </div>
        <div className="flex items-center gap-3">
          {changedCount > 0 && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-700">
              {changedCount} 项已修改
            </Badge>
          )}
          <Select value={selectedTemplate} onValueChange={handleLoadTemplate}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="加载模板..." />
            </SelectTrigger>
            <SelectContent>
              {mockConstraintTemplates.map(template => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            重置
          </Button>
          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Save className="w-4 h-4 mr-2" />
                保存模板
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>保存约束模板</DialogTitle>
                <DialogDescription>
                  将当前参数配置保存为模板，方便下次快速应用
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>模板名称</Label>
                  <Input
                    value={templateName}
                    onChange={e => setTemplateName(e.target.value)}
                    placeholder="例如：应急响应模式"
                  />
                </div>
                <div className="space-y-2">
                  <Label>描述</Label>
                  <Input
                    value={templateDescription}
                    onChange={e => setTemplateDescription(e.target.value)}
                    placeholder="简要描述适用场景"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleSaveTemplate} disabled={!templateName.trim()}>
                  保存
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Constraint Groups Accordion */}
      <motion.div variants={fadeInUp}>
        <Accordion
          type="multiple"
          value={expandedGroups}
          onValueChange={setExpandedGroups}
          className="space-y-3"
        >
          {parameterGroups.map(group => {
            const Icon = group.icon
            const groupParams = parameters[group.key]
            const groupChangedCount = Object.values(groupParams).filter(
              p => p.currentValue !== p.defaultValue
            ).length

            return (
              <AccordionItem
                key={group.key}
                value={group.key}
                className={cn(
                  'border rounded-lg overflow-hidden',
                  groupChangedCount > 0 ? 'border-amber-300' : 'border-gray-200'
                )}
              >
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={cn('p-2 rounded-lg', group.bgColor)}>
                      <Icon className={cn('w-5 h-5', group.color)} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{group.label}</span>
                        {groupChangedCount > 0 && (
                          <Badge variant="outline" className="text-amber-600 border-amber-300 text-[10px]">
                            {groupChangedCount} 项修改
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {Object.keys(groupParams).length} 个参数
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className={cn('px-4 pb-4', group.bgColor.replace('bg-', 'bg-opacity-30 '))}>
                  <div className="space-y-3 pt-2">
                    {Object.entries(groupParams).map(([key, param]) => (
                      <ParameterInput
                        key={key}
                        parameter={param}
                        onChange={value => updateParameter(group.key, key, value)}
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </motion.div>

      {/* Summary Card */}
      <motion.div variants={fadeInUp}>
        <Card className={cn(changedCount > 0 ? 'border-amber-300 bg-amber-50/50' : '')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className={cn('w-5 h-5', changedCount > 0 ? 'text-amber-500' : 'text-gray-400')} />
                <span className="text-sm text-gray-700">
                  {changedCount > 0 ? (
                    <>
                      已修改 <strong>{changedCount}</strong> 个参数，
                      <span className="text-amber-600"> 优化结果将基于新约束生成</span>
                    </>
                  ) : (
                    '当前使用默认约束参数配置'
                  )}
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleReset} disabled={changedCount === 0}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  恢复默认
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

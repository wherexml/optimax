/**
 * OptimizationCenter Page
 *
 * Main page for supply chain optimization center.
 * Integrates:
 * - FE-110: ScenarioBuilder
 * - FE-111: ConstraintEditor
 * - FE-112: RecommendationList
 * - FE-113: ComparisonPanel
 * - FE-114: ExecutionChecklist
 */

import * as React from 'react'
import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Settings,
  Lightbulb,
  Scale,
  CheckSquare,
  Play,
  RotateCcw,
  ChevronRight,
  Sparkles,
  AlertCircle,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

import {
  ScenarioBuilder,
  ConstraintEditor,
  RecommendationList,
  ComparisonPanel,
  ExecutionChecklist,
} from '@/components/optimization'

import type {
  OptimizationScenario,
  OptimizationSolution,
  ConstraintParameters,
  ConstraintTemplate,
  ExecutionTaskStatus,
} from '@/types/optimization'
import { mockScenarios, mockSolutions, mockExecutionChecklists } from '@/mocks/data/optimization'

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

// Step config
const steps = [
  { id: 'scenario', label: '场景构建', icon: Settings, description: '配置优化场景' },
  { id: 'constraints', label: '参数约束', icon: Settings, description: '设置约束条件' },
  { id: 'recommendations', label: '方案列表', icon: Lightbulb, description: '查看优化方案' },
  { id: 'comparison', label: '方案对比', icon: Scale, description: '对比分析方案' },
  { id: 'execution', label: '执行清单', icon: CheckSquare, description: '拆解执行任务' },
]

export default function OptimizationCenter() {
  const [currentStep, setCurrentStep] = useState('scenario')
  const [activeTab, setActiveTab] = useState('scenario')
  const [selectedScenario] = useState<OptimizationScenario | undefined>(
    mockScenarios[0]
  )
  const [constraintParams, setConstraintParams] = useState<ConstraintParameters | undefined>()
  const [hasConstraintChanges, setHasConstraintChanges] = useState(false)
  const [selectedSolutions] = useState<OptimizationSolution[]>([])
  const [solutionsForComparison, setSolutionsForComparison] = useState<
    [OptimizationSolution, OptimizationSolution] | null
  >(null)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationComplete, setOptimizationComplete] = useState(false)

  // Step navigation
  const canProceedToStep = (stepId: string) => {
    switch (stepId) {
      case 'scenario':
        return true
      case 'constraints':
        return true
      case 'recommendations':
        return optimizationComplete
      case 'comparison':
        return optimizationComplete && selectedSolutions.length >= 2
      case 'execution':
        return optimizationComplete && selectedSolutions.length > 0
      default:
        return false
    }
  }

  const goToStep = (stepId: string) => {
    if (canProceedToStep(stepId)) {
      setCurrentStep(stepId)
      setActiveTab(stepId)
    }
  }

  // Run optimization
  const handleRunOptimization = useCallback(() => {
    setIsOptimizing(true)
    // Simulate optimization delay
    setTimeout(() => {
      setIsOptimizing(false)
      setOptimizationComplete(true)
      setActiveTab('recommendations')
      setCurrentStep('recommendations')
    }, 2000)
  }, [])

  // Reset optimization
  const handleReset = useCallback(() => {
    setOptimizationComplete(false)
    setSolutionsForComparison(null)
    setActiveTab('scenario')
    setCurrentStep('scenario')
  }, [])

  // Scenario save
  const handleScenarioSave = useCallback((scenario: Partial<OptimizationScenario>) => {
    console.log('Saving scenario:', scenario)
    // In real app, would save to backend
  }, [])

  // Constraint change
  const handleConstraintChange = useCallback(
    (params: ConstraintParameters, hasChanges: boolean) => {
      setConstraintParams(params)
      setHasConstraintChanges(hasChanges)
    },
    []
  )

  // Constraint template save
  const handleSaveTemplate = useCallback((template: Partial<ConstraintTemplate>) => {
    console.log('Saving template:', template)
  }, [])

  // Solution select
  const handleSolutionSelect = useCallback((solution: OptimizationSolution) => {
    console.log('Select solution:', solution)
  }, [])

  // Solution compare
  const handleSolutionCompare = useCallback((solutions: OptimizationSolution[]) => {
    if (solutions.length === 2) {
      setSolutionsForComparison([solutions[0], solutions[1]])
      setActiveTab('comparison')
      setCurrentStep('comparison')
    }
  }, [])

  // Solution star
  const handleSolutionStar = useCallback((solutionId: string, starred: boolean) => {
    console.log('Star solution:', solutionId, starred)
  }, [])

  // Task update
  const handleTaskUpdate = useCallback((taskId: string, status: ExecutionTaskStatus) => {
    console.log('Update task:', taskId, status)
  }, [])

  // Initiate approval
  const handleInitiateApproval = useCallback(() => {
    console.log('Initiate approval workflow')
  }, [])

  // Push tasks
  const handlePushTasks = useCallback(() => {
    console.log('Push tasks to external systems')
  }, [])

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-50/50"
    >
      {/* Page Header */}
      <motion.div
        variants={fadeInUp}
        className="sticky top-0 z-10 bg-white border-b border-gray-200"
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">优化中心</h1>
              <p className="text-sm text-gray-500 mt-1">
                基于约束条件的供应链优化方案生成与执行管理
              </p>
            </div>
            <div className="flex items-center gap-3">
              {optimizationComplete && (
                <Badge className="bg-green-100 text-green-700 border-green-300">
                  <Sparkles className="w-3 h-3 mr-1" />
                  优化完成
                </Badge>
              )}
              {hasConstraintChanges && (
                <Badge variant="outline" className="text-amber-600 border-amber-300">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  约束已修改
                </Badge>
              )}
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                重置
              </Button>
              <Button
                size="sm"
                onClick={handleRunOptimization}
                disabled={isOptimizing}
                className={cn(
                  isOptimizing && 'animate-pulse'
                )}
              >
                <Play className="w-4 h-4 mr-2" />
                {isOptimizing ? '优化中...' : '运行优化'}
              </Button>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 mt-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = step.id === currentStep
              const isCompleted = steps.findIndex(s => s.id === currentStep) > index
              const isDisabled = !canProceedToStep(step.id)

              return (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => goToStep(step.id)}
                    disabled={isDisabled}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                      isActive && 'bg-blue-50 text-blue-700',
                      isCompleted && 'text-green-600',
                      !isActive && !isCompleted && !isDisabled && 'text-gray-600 hover:bg-gray-100',
                      isDisabled && 'text-gray-400 cursor-not-allowed'
                    )}
                  >
                    <div
                      className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center text-xs',
                        isActive && 'bg-blue-500 text-white',
                        isCompleted && 'bg-green-500 text-white',
                        !isActive && !isCompleted && 'bg-gray-200 text-gray-600'
                      )}
                    >
                      {isCompleted ? <Icon className="w-3 h-3" /> : index + 1}
                    </div>
                    <span className="hidden lg:inline">{step.label}</span>
                  </button>
                  {index < steps.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="hidden">
            {steps.map(step => (
              <TabsTrigger key={step.id} value={step.id}>
                {step.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Scenario Builder */}
          <TabsContent value="scenario" className="mt-0">
            <motion.div variants={fadeInUp}>
              <ScenarioBuilder
                scenario={selectedScenario}
                onSave={handleScenarioSave}
                onCopy={() => console.log('Copy scenario')}
              />
            </motion.div>
          </TabsContent>

          {/* Constraint Editor */}
          <TabsContent value="constraints" className="mt-0">
            <motion.div variants={fadeInUp}>
              <ConstraintEditor
                initialParameters={constraintParams}
                onChange={handleConstraintChange}
                onSaveTemplate={handleSaveTemplate}
              />
            </motion.div>
          </TabsContent>

          {/* Recommendation List */}
          <TabsContent value="recommendations" className="mt-0">
            <motion.div variants={fadeInUp}>
              {!optimizationComplete ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <Play className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">尚未运行优化</h3>
                    <p className="text-sm text-gray-500 mt-2 mb-6">
                      请先配置场景和约束条件，然后点击"运行优化"生成方案
                    </p>
                    <Button onClick={handleRunOptimization}>
                      <Play className="w-4 h-4 mr-2" />
                      运行优化
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <RecommendationList
                  solutions={mockSolutions}
                  onSelect={handleSolutionSelect}
                  onCompare={handleSolutionCompare}
                  onStar={handleSolutionStar}
                />
              )}
            </motion.div>
          </TabsContent>

          {/* Comparison Panel */}
          <TabsContent value="comparison" className="mt-0">
            <motion.div variants={fadeInUp}>
              {!solutionsForComparison ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <Scale className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">选择方案进行对比</h3>
                    <p className="text-sm text-gray-500 mt-2 mb-6">
                      请在方案列表中选择两个方案进行对比分析
                    </p>
                    <Button onClick={() => setActiveTab('recommendations')}>
                      前往方案列表
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <ComparisonPanel
                  solutions={solutionsForComparison}
                  onExport={() => console.log('Export comparison')}
                  onAdopt={(id) => console.log('Adopt solution:', id)}
                />
              )}
            </motion.div>
          </TabsContent>

          {/* Execution Checklist */}
          <TabsContent value="execution" className="mt-0">
            <motion.div variants={fadeInUp}>
              <ExecutionChecklist
                checklist={mockExecutionChecklists[0]}
                onTaskUpdate={handleTaskUpdate}
                onInitiateApproval={handleInitiateApproval}
                onPushTasks={handlePushTasks}
              />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  )
}

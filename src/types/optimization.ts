/**
 * OptiMax Type Definitions - Optimization Center
 *
 * Types for supply chain optimization scenarios, recommendations,
 * constraints, and execution workflows.
 */

// ---------------------------------------------------------------------------
// Optimization Scenario
// ---------------------------------------------------------------------------

/** Priority weight configuration for multi-objective optimization */
export interface PriorityWeights {
  cost: number      // 0-100, cost minimization weight
  delivery: number  // 0-100, on-time delivery weight
  risk: number      // 0-100, risk mitigation weight
}

/** Time window for optimization scope */
export interface TimeWindow {
  start: string     // ISO 8601 date
  end: string       // ISO 8601 date
}

/** Service level objective configuration */
export interface ServiceLevelObjective {
  target: number    // Target percentage (0-100)
  minimum: number   // Minimum acceptable percentage
}

/** Affected object in the optimization scenario */
export interface AffectedObject {
  id: string
  type: 'supplier' | 'material' | 'order' | 'site' | 'warehouse'
  name: string
  code?: string
}

/** Optimization scenario definition */
export interface OptimizationScenario {
  id: string
  name: string
  description?: string
  status: 'draft' | 'ready' | 'running' | 'completed' | 'failed'
  eventId?: string
  eventTitle?: string
  affectedObjects: AffectedObject[]
  timeWindow: TimeWindow
  serviceLevel: ServiceLevelObjective
  priorityWeights: PriorityWeights
  createdAt: string
  updatedAt: string
  createdBy: string
}

/** Scenario creation payload */
export interface ScenarioCreatePayload {
  name: string
  description?: string
  eventId?: string
  affectedObjects: AffectedObject[]
  timeWindow: TimeWindow
  serviceLevel: ServiceLevelObjective
  priorityWeights: PriorityWeights
}

/** Scenario update payload */
export interface ScenarioUpdatePayload {
  name?: string
  description?: string
  affectedObjects?: AffectedObject[]
  timeWindow?: TimeWindow
  serviceLevel?: ServiceLevelObjective
  priorityWeights?: PriorityWeights
}

// ---------------------------------------------------------------------------
// Constraint Parameters
// ---------------------------------------------------------------------------

/** Parameter value with adjustable range */
export interface AdjustableParameter {
  name: string
  currentValue: number
  defaultValue: number
  min: number
  max: number
  unit: string
  description: string
  changed?: boolean
}

/** Constraint parameter groups */
export interface ConstraintParameters {
  cost: {
    maxBudgetIncrease: AdjustableParameter
    unitCostLimit: AdjustableParameter
    transportationBudget: AdjustableParameter
  }
  delivery: {
    maxDelayDays: AdjustableParameter
    onTimeDeliveryRate: AdjustableParameter
    expediteShippingCost: AdjustableParameter
  }
  capacity: {
    maxOvertimeHours: AdjustableParameter
    overtimeRate: AdjustableParameter
    shiftCapacity: AdjustableParameter
  }
  compliance: {
    requiredCertifications: AdjustableParameter
    complianceScore: AdjustableParameter
    auditFrequency: AdjustableParameter
  }
  inventory: {
    safetyStockMultiplier: AdjustableParameter
    maxInventoryDays: AdjustableParameter
    turnoverTarget: AdjustableParameter
  }
  logistics: {
    maxLeadTime: AdjustableParameter
    routeFlexibility: AdjustableParameter
    carrierCapacity: AdjustableParameter
  }
}

/** Constraint template for saving/loading */
export interface ConstraintTemplate {
  id: string
  name: string
  description?: string
  parameters: ConstraintParameters
  createdAt: string
  updatedAt: string
}

// ---------------------------------------------------------------------------
// Optimization Solution
// ---------------------------------------------------------------------------

/** Solution feasibility status */
export type SolutionStatus = 'recommended' | 'feasible' | 'infeasible'

/** Key constraint indicator for a solution */
export interface ConstraintIndicator {
  type: 'cost' | 'delivery' | 'capacity' | 'compliance' | 'inventory' | 'logistics'
  satisfied: boolean
  margin: number  // How close to the limit (negative means violation)
}

/** Optimization solution from the engine */
export interface OptimizationSolution {
  id: string
  scenarioId: string
  name: string
  status: SolutionStatus
  costChange: number        // Percentage change from baseline
  deliveryChange: number    // Days change (negative is improvement)
  confidence: number        // 0-100 confidence score
  affectedOrders: number
  riskReduction: number     // Percentage risk reduction
  constraints: ConstraintIndicator[]
  infeasibleReasons?: string[]
  whyRecommended?: string
  isStarred?: boolean
  createdAt: string
}

/** Solution comparison data */
export interface SolutionComparison {
  baseline: OptimizationSolution
  alternatives: OptimizationSolution[]
}

// ---------------------------------------------------------------------------
// Execution Checklist
// ---------------------------------------------------------------------------

/** Execution task type */
export type ExecutionTaskType = 'action' | 'approval' | 'sync'

/** Execution task status */
export type ExecutionTaskStatus = 'pending' | 'in_progress' | 'completed' | 'rejected'

/** External system for sync tasks */
export type ExternalSystem = 'erp' | 'scm' | 'wms' | 'tms' | 'crm'

/** Single execution checklist item */
export interface ExecutionTask {
  id: string
  solutionId: string
  type: ExecutionTaskType
  title: string
  description?: string
  assignee: {
    id: string
    name: string
    avatar?: string
  }
  dueDate: string
  status: ExecutionTaskStatus
  externalSystem?: ExternalSystem
  dependencies?: string[]  // Task IDs that must complete before this
  completedAt?: string
  completedBy?: string
  rejectionReason?: string
}

/** Execution checklist for a solution */
export interface ExecutionChecklist {
  solutionId: string
  solutionName: string
  tasks: ExecutionTask[]
  progress: {
    total: number
    completed: number
    pending: number
    rejected: number
  }
  estimatedCompletion: string
}

/** Task creation payload */
export interface ExecutionTaskCreatePayload {
  type: ExecutionTaskType
  title: string
  description?: string
  assigneeId: string
  dueDate: string
  externalSystem?: ExternalSystem
  dependencies?: string[]
}

// ---------------------------------------------------------------------------
// Optimization Results
// ---------------------------------------------------------------------------

/** Summary of optimization run */
export interface OptimizationResult {
  scenarioId: string
  runId: string
  status: 'running' | 'completed' | 'failed' | 'cancelled'
  startedAt: string
  completedAt?: string
  solutionsGenerated: number
  recommendedCount: number
  feasibleCount: number
  infeasibleCount: number
  errorMessage?: string
}

/** Filter options for solution list */
export interface SolutionFilter {
  status?: SolutionStatus[]
  minConfidence?: number
  maxCostChange?: number
  starredOnly?: boolean
}

/** Sort options for solution list */
export type SolutionSortField =
  | 'confidence'
  | 'costChange'
  | 'deliveryChange'
  | 'riskReduction'
  | 'affectedOrders'
  | 'createdAt'

export interface SolutionSort {
  field: SolutionSortField
  direction: 'asc' | 'desc'
}

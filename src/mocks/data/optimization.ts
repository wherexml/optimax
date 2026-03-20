/**
 * OptiMax Mock Data - Optimization Center
 *
 * Mock data for scenarios, solutions, constraints, and execution workflows.
 */

import type {
  OptimizationScenario,
  OptimizationSolution,
  ConstraintParameters,
  ConstraintTemplate,
  ExecutionTask,
  ExecutionChecklist,
  OptimizationResult,
  AffectedObject,
} from '@/types/optimization'

// ---------------------------------------------------------------------------
// Affected Objects
// ---------------------------------------------------------------------------

export const mockAffectedObjects: AffectedObject[] = [
  { id: 'SUP-001', type: 'supplier', name: '东莞精密电子有限公司', code: 'DZ001' },
  { id: 'SUP-015', type: 'supplier', name: '惠州新材料科技有限公司', code: 'HZ015' },
  { id: 'MAT-042', type: 'material', name: '高精度电路板 PCBA-2301', code: 'PCBA2301' },
  { id: 'MAT-078', type: 'material', name: '锂电池组 18650-2600mAh', code: 'BAT18650' },
  { id: 'ORD-2024-0892', type: 'order', name: '欧洲区Q2批量订单', code: 'EU-Q2-892' },
  { id: 'ORD-2024-0893', type: 'order', name: '北美区紧急补货单', code: 'NA-URG-893' },
  { id: 'SITE-003', type: 'site', name: '深圳龙华生产基地', code: 'SZ-LH-003' },
  { id: 'SITE-007', type: 'site', name: '东莞松山湖工厂', code: 'DG-SSL-007' },
  { id: 'WH-001', type: 'warehouse', name: '深圳中心仓', code: 'SZ-CDC-001' },
  { id: 'WH-005', type: 'warehouse', name: '广州保税仓', code: 'GZ-BOND-005' },
]

// ---------------------------------------------------------------------------
// Scenarios
// ---------------------------------------------------------------------------

export const mockScenarios: OptimizationScenario[] = [
  {
    id: 'SCN-2024-001',
    name: '台风影响替代方案优化',
    description: '应对台风"海葵"对华南供应链的影响，寻找替代供应商和转产方案',
    status: 'completed',
    eventId: 'EVT-2024-0156',
    eventTitle: '台风"海葵"影响东莞供应商交货',
    affectedObjects: [
      mockAffectedObjects[0],
      mockAffectedObjects[1],
      mockAffectedObjects[2],
      mockAffectedObjects[6],
      mockAffectedObjects[8],
    ],
    timeWindow: {
      start: '2024-09-15T00:00:00Z',
      end: '2024-10-31T23:59:59Z',
    },
    serviceLevel: {
      target: 95,
      minimum: 90,
    },
    priorityWeights: {
      cost: 30,
      delivery: 50,
      risk: 20,
    },
    createdAt: '2024-09-10T08:30:00Z',
    updatedAt: '2024-09-12T14:20:00Z',
    createdBy: 'user-001',
  },
  {
    id: 'SCN-2024-002',
    name: 'Q4旺季产能扩充方案',
    description: '针对Q4订单高峰，优化产能分配和加班安排',
    status: 'ready',
    affectedObjects: [
      mockAffectedObjects[6],
      mockAffectedObjects[7],
      mockAffectedObjects[3],
      mockAffectedObjects[4],
      mockAffectedObjects[5],
    ],
    timeWindow: {
      start: '2024-10-01T00:00:00Z',
      end: '2024-12-31T23:59:59Z',
    },
    serviceLevel: {
      target: 98,
      minimum: 95,
    },
    priorityWeights: {
      cost: 40,
      delivery: 45,
      risk: 15,
    },
    createdAt: '2024-09-18T10:00:00Z',
    updatedAt: '2024-09-20T16:45:00Z',
    createdBy: 'user-001',
  },
  {
    id: 'SCN-2024-003',
    name: '北美航线物流成本优化',
    description: '应对海运费用上涨，评估空运和多式联运方案',
    status: 'draft',
    affectedObjects: [
      mockAffectedObjects[5],
      mockAffectedObjects[9],
      mockAffectedObjects[1],
    ],
    timeWindow: {
      start: '2024-10-15T00:00:00Z',
      end: '2024-11-30T23:59:59Z',
    },
    serviceLevel: {
      target: 92,
      minimum: 85,
    },
    priorityWeights: {
      cost: 60,
      delivery: 30,
      risk: 10,
    },
    createdAt: '2024-09-22T09:15:00Z',
    updatedAt: '2024-09-22T09:15:00Z',
    createdBy: 'user-002',
  },
]

// ---------------------------------------------------------------------------
// Constraint Parameters
// ---------------------------------------------------------------------------

export const defaultConstraintParameters: ConstraintParameters = {
  cost: {
    maxBudgetIncrease: {
      name: '最大预算增幅',
      currentValue: 15,
      defaultValue: 15,
      min: 0,
      max: 50,
      unit: '%',
      description: '相对于基准预算的最大增加比例',
    },
    unitCostLimit: {
      name: '单位成本上限',
      currentValue: 125,
      defaultValue: 120,
      min: 80,
      max: 200,
      unit: '%',
      description: '单位成本相对于标准成本的上限',
    },
    transportationBudget: {
      name: '运输预算',
      currentValue: 500000,
      defaultValue: 450000,
      min: 100000,
      max: 1000000,
      unit: 'CNY',
      description: '可用于紧急运输的预算上限',
    },
  },
  delivery: {
    maxDelayDays: {
      name: '最大允许延期',
      currentValue: 7,
      defaultValue: 7,
      min: 0,
      max: 30,
      unit: '天',
      description: '订单交付允许的最大延期天数',
    },
    onTimeDeliveryRate: {
      name: '准时交付率目标',
      currentValue: 95,
      defaultValue: 95,
      min: 80,
      max: 100,
      unit: '%',
      description: '优化后需要达到的准时交付率',
    },
    expediteShippingCost: {
      name: '加急运费上限',
      currentValue: 80000,
      defaultValue: 50000,
      min: 0,
      max: 200000,
      unit: 'CNY',
      description: '可用于加急运输的费用上限',
    },
  },
  capacity: {
    maxOvertimeHours: {
      name: '最大加班时长',
      currentValue: 80,
      defaultValue: 60,
      min: 0,
      max: 120,
      unit: '小时/月',
      description: '每月每位员工的最大加班小时数',
    },
    overtimeRate: {
      name: '加班费率倍数',
      currentValue: 1.5,
      defaultValue: 1.5,
      min: 1.0,
      max: 3.0,
      unit: '倍',
      description: '加班工资相对于正常工资的倍数',
    },
    shiftCapacity: {
      name: '班次产能利用率',
      currentValue: 85,
      defaultValue: 80,
      min: 50,
      max: 100,
      unit: '%',
      description: '设备班次产能利用率目标',
    },
  },
  compliance: {
    requiredCertifications: {
      name: '必需认证数量',
      currentValue: 5,
      defaultValue: 5,
      min: 3,
      max: 10,
      unit: '个',
      description: '替代供应商必须具备的认证数量',
    },
    complianceScore: {
      name: '合规评分下限',
      currentValue: 85,
      defaultValue: 85,
      min: 60,
      max: 100,
      unit: '分',
      description: '供应商合规评分最低要求',
    },
    auditFrequency: {
      name: '审核频率',
      currentValue: 12,
      defaultValue: 12,
      min: 6,
      max: 24,
      unit: '月',
      description: '供应商现场审核间隔（月）',
    },
  },
  inventory: {
    safetyStockMultiplier: {
      name: '安全库存倍数',
      currentValue: 1.5,
      defaultValue: 1.2,
      min: 1.0,
      max: 3.0,
      unit: '倍',
      description: '安全库存相对于正常需求的倍数',
    },
    maxInventoryDays: {
      name: '最大库存天数',
      currentValue: 45,
      defaultValue: 30,
      min: 7,
      max: 90,
      unit: '天',
      description: '原材料最大库存持有天数',
    },
    turnoverTarget: {
      name: '库存周转目标',
      currentValue: 8,
      defaultValue: 10,
      min: 4,
      max: 15,
      unit: '次/年',
      description: '年度库存周转率目标',
    },
  },
  logistics: {
    maxLeadTime: {
      name: '最大交付周期',
      currentValue: 21,
      defaultValue: 14,
      min: 7,
      max: 60,
      unit: '天',
      description: '从下单到交付的最大允许时间',
    },
    routeFlexibility: {
      name: '路线灵活度',
      currentValue: 70,
      defaultValue: 70,
      min: 0,
      max: 100,
      unit: '%',
      description: '允许使用替代运输路线的比例',
    },
    carrierCapacity: {
      name: '承运商容量保障',
      currentValue: 90,
      defaultValue: 90,
      min: 50,
      max: 100,
      unit: '%',
      description: '主要承运商承诺的运力保障比例',
    },
  },
}

// ---------------------------------------------------------------------------
// Constraint Templates
// ---------------------------------------------------------------------------

export const mockConstraintTemplates: ConstraintTemplate[] = [
  {
    id: 'TPL-001',
    name: '标准生产优化',
    description: '适用于常规产能优化场景',
    parameters: defaultConstraintParameters,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-06-20T00:00:00Z',
  },
  {
    id: 'TPL-002',
    name: '应急响应模式',
    description: '用于突发事件后的快速恢复',
    parameters: {
      ...defaultConstraintParameters,
      cost: {
        ...defaultConstraintParameters.cost,
        maxBudgetIncrease: {
          ...defaultConstraintParameters.cost.maxBudgetIncrease,
          currentValue: 30,
        },
      },
      delivery: {
        ...defaultConstraintParameters.delivery,
        maxDelayDays: {
          ...defaultConstraintParameters.delivery.maxDelayDays,
          currentValue: 3,
        },
      },
    },
    createdAt: '2024-03-10T00:00:00Z',
    updatedAt: '2024-03-10T00:00:00Z',
  },
  {
    id: 'TPL-003',
    name: '成本优先模式',
    description: '在成本可控前提下寻找最优方案',
    parameters: {
      ...defaultConstraintParameters,
      cost: {
        ...defaultConstraintParameters.cost,
        maxBudgetIncrease: {
          ...defaultConstraintParameters.cost.maxBudgetIncrease,
          currentValue: 5,
        },
        unitCostLimit: {
          ...defaultConstraintParameters.cost.unitCostLimit,
          currentValue: 105,
        },
      },
    },
    createdAt: '2024-05-01T00:00:00Z',
    updatedAt: '2024-05-01T00:00:00Z',
  },
]

// ---------------------------------------------------------------------------
// Optimization Solutions
// ---------------------------------------------------------------------------

export const mockSolutions: OptimizationSolution[] = [
  // Recommended solutions (green)
  {
    id: 'SOL-001',
    scenarioId: 'SCN-2024-001',
    name: '华东供应商转产方案',
    status: 'recommended',
    costChange: 8.5,
    deliveryChange: -2,
    confidence: 94,
    affectedOrders: 156,
    riskReduction: 72,
    constraints: [
      { type: 'cost', satisfied: true, margin: 6.5 },
      { type: 'delivery', satisfied: true, margin: 5 },
      { type: 'capacity', satisfied: true, margin: 15 },
      { type: 'compliance', satisfied: true, margin: 9 },
      { type: 'inventory', satisfied: true, margin: 5 },
      { type: 'logistics', satisfied: true, margin: 7 },
    ],
    whyRecommended: '在最小成本增加的前提下，实现了最快的交付恢复和最高的风险缓解。通过启用已通过审核的华东地区备选供应商，可在3天内恢复70%产能。',
    isStarred: true,
    createdAt: '2024-09-11T10:30:00Z',
  },
  {
    id: 'SOL-002',
    scenarioId: 'SCN-2024-001',
    name: '多源并行供应方案',
    status: 'recommended',
    costChange: 12.3,
    deliveryChange: -3,
    confidence: 91,
    affectedOrders: 203,
    riskReduction: 85,
    constraints: [
      { type: 'cost', satisfied: true, margin: 2.7 },
      { type: 'delivery', satisfied: true, margin: 6 },
      { type: 'capacity', satisfied: true, margin: 8 },
      { type: 'compliance', satisfied: true, margin: 12 },
      { type: 'inventory', satisfied: true, margin: 3 },
      { type: 'logistics', satisfied: true, margin: 4 },
    ],
    whyRecommended: '分散供应风险的最佳方案，通过3个区域供应商并行供货，大幅降低单点故障风险，适合长期战略合作。',
    isStarred: false,
    createdAt: '2024-09-11T10:35:00Z',
  },
  // Feasible solutions
  {
    id: 'SOL-003',
    scenarioId: 'SCN-2024-001',
    name: '空运紧急补货方案',
    status: 'feasible',
    costChange: 28.7,
    deliveryChange: -5,
    confidence: 88,
    affectedOrders: 89,
    riskReduction: 65,
    constraints: [
      { type: 'cost', satisfied: true, margin: -13.7 },
      { type: 'delivery', satisfied: true, margin: 8 },
      { type: 'capacity', satisfied: true, margin: 20 },
      { type: 'compliance', satisfied: true, margin: 15 },
      { type: 'inventory', satisfied: true, margin: 10 },
      { type: 'logistics', satisfied: true, margin: 12 },
    ],
    isStarred: false,
    createdAt: '2024-09-11T10:40:00Z',
  },
  {
    id: 'SOL-004',
    scenarioId: 'SCN-2024-001',
    name: '延期交付协商方案',
    status: 'feasible',
    costChange: 2.1,
    deliveryChange: 7,
    confidence: 96,
    affectedOrders: 245,
    riskReduction: 45,
    constraints: [
      { type: 'cost', satisfied: true, margin: 12.9 },
      { type: 'delivery', satisfied: true, margin: -0 },
      { type: 'capacity', satisfied: true, margin: 25 },
      { type: 'compliance', satisfied: true, margin: 18 },
      { type: 'inventory', satisfied: true, margin: 15 },
      { type: 'logistics', satisfied: true, margin: 20 },
    ],
    isStarred: false,
    createdAt: '2024-09-11T10:45:00Z',
  },
  {
    id: 'SOL-005',
    scenarioId: 'SCN-2024-001',
    name: '产能加班扩充方案',
    status: 'feasible',
    costChange: 15.8,
    deliveryChange: 0,
    confidence: 92,
    affectedOrders: 178,
    riskReduction: 58,
    constraints: [
      { type: 'cost', satisfied: true, margin: -0.8 },
      { type: 'delivery', satisfied: true, margin: 7 },
      { type: 'capacity', satisfied: true, margin: -5 },
      { type: 'compliance', satisfied: true, margin: 20 },
      { type: 'inventory', satisfied: true, margin: 12 },
      { type: 'logistics', satisfied: true, margin: 15 },
    ],
    isStarred: true,
    createdAt: '2024-09-11T10:50:00Z',
  },
  // Infeasible solutions
  {
    id: 'SOL-006',
    scenarioId: 'SCN-2024-001',
    name: '单一替代供应商方案',
    status: 'infeasible',
    costChange: 5.2,
    deliveryChange: -1,
    confidence: 65,
    affectedOrders: 134,
    riskReduction: 30,
    constraints: [
      { type: 'cost', satisfied: true, margin: 9.8 },
      { type: 'delivery', satisfied: true, margin: 6 },
      { type: 'capacity', satisfied: false, margin: -25 },
      { type: 'compliance', satisfied: true, margin: 10 },
      { type: 'inventory', satisfied: true, margin: 8 },
      { type: 'logistics', satisfied: false, margin: -8 },
    ],
    infeasibleReasons: [
      '替代供应商产能不足以覆盖全部订单需求（缺口约25%）',
      '物流路线受台风影响尚未恢复，预计延误8天以上',
    ],
    isStarred: false,
    createdAt: '2024-09-11T10:55:00Z',
  },
  {
    id: 'SOL-007',
    scenarioId: 'SCN-2024-001',
    name: '库存调配方案',
    status: 'infeasible',
    costChange: -2.5,
    deliveryChange: 3,
    confidence: 70,
    affectedOrders: 67,
    riskReduction: 25,
    constraints: [
      { type: 'cost', satisfied: true, margin: 17.5 },
      { type: 'delivery', satisfied: true, margin: 4 },
      { type: 'capacity', satisfied: true, margin: 15 },
      { type: 'compliance', satisfied: true, margin: 12 },
      { type: 'inventory', satisfied: false, margin: -35 },
      { type: 'logistics', satisfied: true, margin: 10 },
    ],
    infeasibleReasons: [
      '现有安全库存仅能覆盖3天生产需求，不足以支撑订单交付',
      '跨仓调配需要额外7天运输时间，超出客户可接受范围',
    ],
    isStarred: false,
    createdAt: '2024-09-11T11:00:00Z',
  },
]

// ---------------------------------------------------------------------------
// Execution Tasks
// ---------------------------------------------------------------------------

export const mockExecutionTasks: ExecutionTask[] = [
  // Action tasks
  {
    id: 'TASK-001',
    solutionId: 'SOL-001',
    type: 'action',
    title: '启动华东供应商产能验证',
    description: '联系杭州、苏州备选供应商，确认产能可用性和交付时间表',
    assignee: { id: 'user-003', name: '张明', avatar: '/avatars/user-003.png' },
    dueDate: '2024-09-13T18:00:00Z',
    status: 'completed',
    completedAt: '2024-09-12T16:30:00Z',
    completedBy: 'user-003',
  },
  {
    id: 'TASK-002',
    solutionId: 'SOL-001',
    type: 'action',
    title: '更新物料需求计划(MRP)',
    description: '在ERP系统中调整下周物料需求，优先分配给华东供应商',
    assignee: { id: 'user-005', name: '李华', avatar: '/avatars/user-005.png' },
    dueDate: '2024-09-14T12:00:00Z',
    status: 'in_progress',
  },
  {
    id: 'TASK-003',
    solutionId: 'SOL-001',
    type: 'action',
    title: '安排加急物流运输',
    description: '预订华东至深圳的加急货运，确保原材料按时到达',
    assignee: { id: 'user-007', name: '王强', avatar: '/avatars/user-007.png' },
    dueDate: '2024-09-15T10:00:00Z',
    status: 'pending',
    dependencies: ['TASK-001'],
  },
  // Approval tasks
  {
    id: 'TASK-004',
    solutionId: 'SOL-001',
    type: 'approval',
    title: '预算超支审批',
    description: '本次方案预计增加成本8.5%（约￥126万），需要财务总监审批',
    assignee: { id: 'user-010', name: '陈总', avatar: '/avatars/user-010.png' },
    dueDate: '2024-09-13T12:00:00Z',
    status: 'completed',
    completedAt: '2024-09-13T10:15:00Z',
    completedBy: 'user-010',
  },
  {
    id: 'TASK-005',
    solutionId: 'SOL-001',
    type: 'approval',
    title: '供应商变更审批',
    description: '变更主要供应商需要采购委员会审批',
    assignee: { id: 'user-008', name: '刘总', avatar: '/avatars/user-008.png' },
    dueDate: '2024-09-14T18:00:00Z',
    status: 'in_progress',
  },
  {
    id: 'TASK-006',
    solutionId: 'SOL-001',
    type: 'approval',
    title: '客户交付时间调整确认',
    description: '部分订单交付时间需延后2天，需与客户经理确认',
    assignee: { id: 'user-006', name: '赵敏', avatar: '/avatars/user-006.png' },
    dueDate: '2024-09-14T15:00:00Z',
    status: 'pending',
  },
  // Sync tasks
  {
    id: 'TASK-007',
    solutionId: 'SOL-001',
    type: 'sync',
    title: '同步至SAP系统',
    description: '更新供应商主数据和采购订单',
    assignee: { id: 'user-005', name: '李华', avatar: '/avatars/user-005.png' },
    dueDate: '2024-09-15T12:00:00Z',
    status: 'pending',
    externalSystem: 'erp',
    dependencies: ['TASK-004', 'TASK-005'],
  },
  {
    id: 'TASK-008',
    solutionId: 'SOL-001',
    type: 'sync',
    title: '更新WMS库存策略',
    description: '调整安全库存水平和补货触发点',
    assignee: { id: 'user-007', name: '王强', avatar: '/avatars/user-007.png' },
    dueDate: '2024-09-15T14:00:00Z',
    status: 'pending',
    externalSystem: 'wms',
    dependencies: ['TASK-004'],
  },
  {
    id: 'TASK-009',
    solutionId: 'SOL-001',
    type: 'sync',
    title: '通知TMS调整运输计划',
    description: '取消原东莞供应商提货计划，新增华东提货点',
    assignee: { id: 'user-007', name: '王强', avatar: '/avatars/user-007.png' },
    dueDate: '2024-09-14T18:00:00Z',
    status: 'pending',
    externalSystem: 'tms',
    dependencies: ['TASK-002'],
  },
  {
    id: 'TASK-010',
    solutionId: 'SOL-001',
    type: 'sync',
    title: '推送供应商门户通知',
    description: '向新供应商发送订单确认和质量标准文档',
    assignee: { id: 'user-003', name: '张明', avatar: '/avatars/user-003.png' },
    dueDate: '2024-09-14T16:00:00Z',
    status: 'pending',
    externalSystem: 'scm',
    dependencies: ['TASK-001'],
  },
]

// ---------------------------------------------------------------------------
// Execution Checklists
// ---------------------------------------------------------------------------

export const mockExecutionChecklists: ExecutionChecklist[] = [
  {
    solutionId: 'SOL-001',
    solutionName: '华东供应商转产方案',
    tasks: mockExecutionTasks.filter(t => t.solutionId === 'SOL-001'),
    progress: {
      total: 10,
      completed: 2,
      pending: 8,
      rejected: 0,
    },
    estimatedCompletion: '2024-09-15T18:00:00Z',
  },
]

// ---------------------------------------------------------------------------
// Optimization Results
// ---------------------------------------------------------------------------

export const mockOptimizationResults: OptimizationResult[] = [
  {
    scenarioId: 'SCN-2024-001',
    runId: 'RUN-001',
    status: 'completed',
    startedAt: '2024-09-11T10:00:00Z',
    completedAt: '2024-09-11T11:05:00Z',
    solutionsGenerated: 7,
    recommendedCount: 2,
    feasibleCount: 3,
    infeasibleCount: 2,
  },
]

// ---------------------------------------------------------------------------
// Mock Events for Selection
// ---------------------------------------------------------------------------

export const mockEventsForSelection = [
  { id: 'EVT-2024-0156', title: '台风"海葵"影响东莞供应商交货', severity: 'high' as const, date: '2024-09-10' },
  { id: 'EVT-2024-0157', title: '芯片短缺影响Q4生产计划', severity: 'critical' as const, date: '2024-09-08' },
  { id: 'EVT-2024-0158', title: '原材料价格波动预警', severity: 'medium' as const, date: '2024-09-05' },
  { id: 'EVT-2024-0159', title: '新环保法规合规性检查', severity: 'medium' as const, date: '2024-09-03' },
  { id: 'EVT-2024-0160', title: '关键供应商财务风险预警', severity: 'high' as const, date: '2024-09-01' },
]

// ---------------------------------------------------------------------------
// Mock Users for Assignment
// ---------------------------------------------------------------------------

export const mockUsersForAssignment = [
  { id: 'user-001', name: '系统管理员', role: 'admin', avatar: '/avatars/admin.png' },
  { id: 'user-002', name: '采购经理', role: 'manager', avatar: '/avatars/manager.png' },
  { id: 'user-003', name: '张明', role: 'analyst', avatar: '/avatars/user-003.png' },
  { id: 'user-004', name: '李华', role: 'analyst', avatar: '/avatars/user-004.png' },
  { id: 'user-005', name: '王强', role: 'analyst', avatar: '/avatars/user-005.png' },
  { id: 'user-006', name: '赵敏', role: 'manager', avatar: '/avatars/user-006.png' },
  { id: 'user-007', name: '刘总', role: 'manager', avatar: '/avatars/user-007.png' },
  { id: 'user-008', name: '陈总', role: 'manager', avatar: '/avatars/user-008.png' },
  { id: 'user-009', name: '钱工', role: 'analyst', avatar: '/avatars/user-009.png' },
  { id: 'user-010', name: '孙工', role: 'analyst', avatar: '/avatars/user-010.png' },
]

/**
 * OptiMax Mock Data - Solutions
 *
 * War Room 方案对比数据
 */

import type { Solution, ConstraintConflict } from '@/types/solution'

// ---------------------------------------------------------------------------
// Solutions for CASE-2026-0001 (华芯半导体芯片交付严重延迟应急响应)
// ---------------------------------------------------------------------------

const constraintConflicts1: ConstraintConflict[] = [
  { type: 'capacity', description: '三星电子产能紧张，交货周期可能延长', severity: 'warning' },
  { type: 'budget', description: '紧急采购价格较常规价格上浮 35%', severity: 'warning' },
]

const constraintConflicts2: ConstraintConflict[] = [
  { type: 'compliance', description: '台积电新供应商需通过合规审核，预计增加 5 个工作日', severity: 'warning' },
]

const constraintConflicts3: ConstraintConflict[] = [
  { type: 'quality', description: '国产芯片性能较原规格下降 15%，需重新评估产品兼容性', severity: 'critical' },
  { type: 'contract', description: '与华芯合同中有排他性条款，切换供应商可能触发违约金', severity: 'warning' },
]

export const mockSolutionsCase1: Solution[] = [
  {
    solution_id: 'SOL-2026-0001',
    case_id: 'CASE-2026-0001',
    title: '从三星电子紧急采购芯片',
    description: '与三星电子签订紧急采购协议，从韩国工厂调拨芯片满足生产需求。三星作为 Tier-1 供应商，质量稳定，交付有保障。',
    is_recommended: true,
    status: 'proposed',
    reason: '综合成本、交期、质量因素，此方案为最优解。三星电子与我司有长期合作关系，质量稳定，可快速响应紧急需求。',
    cost_impact: {
      amount: 2850000,
      currency: 'CNY',
      percentage: 35,
    },
    delivery_impact: {
      days: 3,
      description: '预计延迟 3 天交付',
    },
    constraint_conflicts: constraintConflicts1,
    confidence: 92,
    author: {
      user_id: 'U001',
      name: '张明',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangming',
    },
    created_at: '2026-03-20T10:00:00Z',
    updated_at: '2026-03-20T10:00:00Z',
  },
  {
    solution_id: 'SOL-2026-0002',
    case_id: 'CASE-2026-0001',
    title: '从台积电追加订单',
    description: '向台积电追加紧急订单，利用其富余产能满足部分需求。需协调产能分配，预计可供应 60% 需求量。',
    is_recommended: false,
    status: 'proposed',
    cost_impact: {
      amount: 2100000,
      currency: 'CNY',
      percentage: 25,
    },
    delivery_impact: {
      days: 7,
      description: '预计延迟 7 天交付',
    },
    constraint_conflicts: constraintConflicts2,
    confidence: 78,
    author: {
      user_id: 'U002',
      name: '李芳',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lifang',
    },
    created_at: '2026-03-20T11:30:00Z',
    updated_at: '2026-03-20T11:30:00Z',
  },
  {
    solution_id: 'SOL-2026-0003',
    case_id: 'CASE-2026-0001',
    title: '启用国产替代芯片',
    description: '紧急采购国内厂商中芯国际的替代芯片，需进行兼容性测试，预计可满足基本功能需求。',
    is_recommended: false,
    status: 'abandoned',
    reason: '国产芯片性能不满足高端产品要求，且存在合同违约风险。经评估，风险过高，不宜采用。',
    cost_impact: {
      amount: 1500000,
      currency: 'CNY',
      percentage: 18,
    },
    delivery_impact: {
      days: 14,
      description: '预计延迟 14 天交付',
    },
    constraint_conflicts: constraintConflicts3,
    confidence: 45,
    author: {
      user_id: 'U003',
      name: '王建国',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangjianguo',
    },
    created_at: '2026-03-19T16:00:00Z',
    updated_at: '2026-03-20T09:00:00Z',
  },
  {
    solution_id: 'SOL-2026-0004',
    case_id: 'CASE-2026-0001',
    title: '调整生产计划，优先保障核心订单',
    description: '根据现有库存，调整生产计划，优先保障核心客户订单，非核心订单延期交付。',
    is_recommended: false,
    status: 'proposed',
    cost_impact: {
      amount: 800000,
      currency: 'CNY',
      percentage: 10,
    },
    delivery_impact: {
      days: 0,
      description: '核心订单正常交付，非核心订单延期 30 天',
    },
    confidence: 85,
    author: {
      user_id: 'U006',
      name: '刘强',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liuqiang',
    },
    created_at: '2026-03-20T09:00:00Z',
    updated_at: '2026-03-20T09:00:00Z',
  },
]

// ---------------------------------------------------------------------------
// Solutions for CASE-2026-0002 (中泰钢铁环保停产应急处置)
// ---------------------------------------------------------------------------

const constraintConflictsCase2_1: ConstraintConflict[] = [
  { type: 'budget', description: '宝武钢铁价格较中泰钢铁上浮 22%', severity: 'warning' },
]

const constraintConflictsCase2_2: ConstraintConflict[] = [
  { type: 'capacity', description: '进口钢材交货周期长，无法满足紧急需求', severity: 'critical' },
  { type: 'compliance', description: '进口钢材需报关检验，增加 10 个工作日', severity: 'warning' },
]

export const mockSolutionsCase2: Solution[] = [
  {
    solution_id: 'SOL-2026-0005',
    case_id: 'CASE-2026-0002',
    title: '从宝武钢铁紧急采购',
    description: '与宝武钢铁签订紧急供货协议，从武汉工厂调拨钢材满足生产需求。',
    is_recommended: true,
    status: 'approved',
    reason: '宝武钢铁为国内最大钢铁企业，产能充足，质量稳定，可快速响应。',
    cost_impact: {
      amount: 5800000,
      currency: 'CNY',
      percentage: 22,
    },
    delivery_impact: {
      days: 2,
      description: '预计延迟 2 天交付',
    },
    constraint_conflicts: constraintConflictsCase2_1,
    confidence: 95,
    author: {
      user_id: 'U001',
      name: '张明',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangming',
    },
    created_at: '2026-03-15T14:00:00Z',
    updated_at: '2026-03-16T10:00:00Z',
  },
  {
    solution_id: 'SOL-2026-0006',
    case_id: 'CASE-2026-0002',
    title: '从日本进口钢材',
    description: '紧急从日本新日铁采购钢材，通过空运方式快速到货。',
    is_recommended: false,
    status: 'rejected',
    reason: '交货周期过长，无法满足紧急需求，且进口手续复杂。',
    cost_impact: {
      amount: 12500000,
      currency: 'CNY',
      percentage: 45,
    },
    delivery_impact: {
      days: 21,
      description: '预计延迟 21 天交付',
    },
    constraint_conflicts: constraintConflictsCase2_2,
    confidence: 30,
    author: {
      user_id: 'U002',
      name: '李芳',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lifang',
    },
    created_at: '2026-03-15T16:00:00Z',
    updated_at: '2026-03-16T09:00:00Z',
  },
]

// ---------------------------------------------------------------------------
// All Solutions Combined
// ---------------------------------------------------------------------------

export const mockSolutions: Solution[] = [
  ...mockSolutionsCase1,
  ...mockSolutionsCase2,
]

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

export function getSolutionsByCaseId(caseId: string): Solution[] {
  return mockSolutions.filter(s => s.case_id === caseId)
}

export function getRecommendedSolution(caseId: string): Solution | undefined {
  return mockSolutions.find(s => s.case_id === caseId && s.is_recommended)
}

export function getAlternativeSolutions(caseId: string): Solution[] {
  return mockSolutions.filter(s => s.case_id === caseId && !s.is_recommended)
}

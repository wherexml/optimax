import type { AlternativeSupplier } from '@/types/supplier'

// ---------------------------------------------------------------------------
// Alternative Supplier Mock Data
// 与 SUP-001 深圳华芯微电子（MCU芯片/功率半导体供应商）可替代的候选供应商
// ---------------------------------------------------------------------------

export const alternativeSuppliers: AlternativeSupplier[] = [
  {
    supplier_id: 'SUP-ALT-001',
    name: '上海复旦微电子集团股份有限公司',
    region: '华东',
    cost_delta: 8.5, // +8.5%
    lead_time_delta: -3, // -3天（更快）
    risk_score: 38,
    qualifications: ['ISO9001', 'ISO14001', 'IATF16949', 'AEC-Q100', '军工保密资质'],
    constraints: ['仅限大陆区域供货', '军工产品需审批'],
  },
  {
    supplier_id: 'SUP-ALT-002',
    name: '无锡华润微电子有限公司',
    region: '华东',
    cost_delta: -2.3, // -2.3%（更便宜）
    lead_time_delta: 5, // +5天（更慢）
    risk_score: 45,
    qualifications: ['ISO9001', 'ISO14001', 'IATF16949', 'AEC-Q100'],
    constraints: ['功率半导体产能受限', '车规认证范围有限'],
  },
  {
    supplier_id: 'SUP-ALT-003',
    name: 'NXP Semiconductors (China)',
    region: '华东',
    cost_delta: 25.0, // +25%
    lead_time_delta: -7, // -7天（最快）
    risk_score: 22,
    qualifications: ['ISO9001', 'ISO14001', 'IATF16949', 'AEC-Q100', 'ASIL-D'],
    constraints: ['需外汇结算', '出口管制清单筛查', 'MOQ较高'],
  },
]

// ---------------------------------------------------------------------------
// Helper function to get alternative suppliers for a given supplier
// ---------------------------------------------------------------------------

export function getAlternativeSuppliers(_supplierId: string): AlternativeSupplier[] {
  // 目前返回通用的替代供应商列表
  // 未来可根据 supplierId 返回不同的替代供应商
  return alternativeSuppliers
}

// ---------------------------------------------------------------------------
// Comparison summary statistics
// ---------------------------------------------------------------------------

export interface ComparisonSummary {
  avgCostDelta: number
  avgLeadTimeDelta: number
  avgRiskScore: number
  lowestRiskId: string
  lowestCostId: string
  fastestDeliveryId: string
}

export function getComparisonSummary(alternatives: AlternativeSupplier[]): ComparisonSummary {
  if (alternatives.length === 0) {
    return {
      avgCostDelta: 0,
      avgLeadTimeDelta: 0,
      avgRiskScore: 0,
      lowestRiskId: '',
      lowestCostId: '',
      fastestDeliveryId: '',
    }
  }

  const avgCostDelta = alternatives.reduce((sum, s) => sum + s.cost_delta, 0) / alternatives.length
  const avgLeadTimeDelta = alternatives.reduce((sum, s) => sum + s.lead_time_delta, 0) / alternatives.length
  const avgRiskScore = alternatives.reduce((sum, s) => sum + s.risk_score, 0) / alternatives.length

  const lowestRisk = alternatives.reduce((min, s) => (s.risk_score < min.risk_score ? s : min))
  const lowestCost = alternatives.reduce((min, s) => (s.cost_delta < min.cost_delta ? s : min))
  const fastestDelivery = alternatives.reduce((min, s) => (s.lead_time_delta < min.lead_time_delta ? s : min))

  return {
    avgCostDelta: Math.round(avgCostDelta * 10) / 10,
    avgLeadTimeDelta: Math.round(avgLeadTimeDelta * 10) / 10,
    avgRiskScore: Math.round(avgRiskScore * 10) / 10,
    lowestRiskId: lowestRisk.supplier_id,
    lowestCostId: lowestCost.supplier_id,
    fastestDeliveryId: fastestDelivery.supplier_id,
  }
}

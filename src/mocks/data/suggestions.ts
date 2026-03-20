import type { Severity } from '@/types/enums'

// ---------------------------------------------------------------------------
// AI Suggestion Types
// ---------------------------------------------------------------------------

export interface MappingSuggestion {
  id: string
  objectType: 'supplier' | 'material' | 'order' | 'site' | 'region'
  objectName: string
  objectId: string
  confidence: number // 0-100
  reason: string
}

export interface SeveritySuggestion {
  id: string
  suggestedSeverity: Severity
  currentSeverity: Severity
  confidence: number
  reason: string
}

export interface SimilarCase {
  id: string
  eventId: string
  title: string
  severity: Severity
  status: string
  resolutionDays: number
  similarity: number // 0-100
  outcome: string
}

export interface AISuggestionSet {
  eventId: string
  mappingSuggestions: MappingSuggestion[]
  severitySuggestion: SeveritySuggestion | null
  similarCases: SimilarCase[]
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

export const mockMappingSuggestions: Record<string, MappingSuggestion[]> = {
  'EVT-001': [
    {
      id: 'map-001',
      objectType: 'supplier',
      objectName: '深圳华芯微电子有限公司',
      objectId: 'SUP-001',
      confidence: 92,
      reason: '事件描述中明确提及该企业，且地理位置与报道区域吻合',
    },
    {
      id: 'map-002',
      objectType: 'material',
      objectName: 'MCU芯片',
      objectId: 'MAT-001',
      confidence: 78,
      reason: '关键词匹配：芯片、半导体、供应紧张',
    },
    {
      id: 'map-003',
      objectType: 'site',
      objectName: '深圳龙华生产基地',
      objectId: 'SITE-001',
      confidence: 65,
      reason: '地理位置接近，可能影响生产',
    },
  ],
  'EVT-002': [
    {
      id: 'map-004',
      objectType: 'supplier',
      objectName: '上海博锐精密机械股份有限公司',
      objectId: 'SUP-002',
      confidence: 88,
      reason: '企业名称与报道高度相关',
    },
    {
      id: 'map-005',
      objectType: 'order',
      objectName: 'ORD-2026-0315-001',
      objectId: 'ORD-001',
      confidence: 72,
      reason: '该订单涉及报道中的产品线',
    },
  ],
  'EVT-003': [
    {
      id: 'map-006',
      objectType: 'region',
      objectName: '华北地区',
      objectId: 'REG-001',
      confidence: 85,
      reason: '事件影响范围主要覆盖该区域',
    },
  ],
  'EVT-004': [
    {
      id: 'map-007',
      objectType: 'supplier',
      objectName: '河北中泰钢铁集团有限公司',
      objectId: 'SUP-004',
      confidence: 95,
      reason: '事件主体明确指向该企业',
    },
  ],
  'EVT-005': [
    {
      id: 'map-008',
      objectType: 'supplier',
      objectName: 'TechVision Materials GmbH',
      objectId: 'SUP-003',
      confidence: 89,
      reason: '德国供应商，关键词匹配度高',
    },
  ],
}

export const mockSeveritySuggestions: Record<string, SeveritySuggestion> = {
  'EVT-001': {
    id: 'sev-001',
    suggestedSeverity: 'high',
    currentSeverity: 'medium',
    confidence: 82,
    reason: '影响范围扩大，多家客户受到影响，建议上调至高危',
  },
  'EVT-004': {
    id: 'sev-002',
    suggestedSeverity: 'critical',
    currentSeverity: 'high',
    confidence: 91,
    reason: '环保处罚可能导致停产，影响重大',
  },
}

export const mockSimilarCases: Record<string, SimilarCase[]> = {
  'EVT-001': [
    {
      id: 'case-001',
      eventId: 'EVT-HIST-001',
      title: '2025年Q4芯片供应紧张事件',
      severity: 'high',
      status: '已解决',
      resolutionDays: 7,
      similarity: 87,
      outcome: '通过启用备用供应商解决，影响金额约200万元',
    },
    {
      id: 'case-002',
      eventId: 'EVT-HIST-002',
      title: '某半导体企业交付延迟预警',
      severity: 'medium',
      status: '已解决',
      resolutionDays: 5,
      similarity: 76,
      outcome: '提前通知客户调整生产计划，未造成实际损失',
    },
    {
      id: 'case-003',
      eventId: 'EVT-HIST-003',
      title: '原材料短缺导致的生产中断',
      severity: 'critical',
      status: '已解决',
      resolutionDays: 12,
      similarity: 68,
      outcome: '紧急采购替代材料，成本增加15%',
    },
  ],
  'EVT-002': [
    {
      id: 'case-004',
      eventId: 'EVT-HIST-004',
      title: '机械加工企业产能不足事件',
      severity: 'medium',
      status: '已解决',
      resolutionDays: 4,
      similarity: 79,
      outcome: '协调其他供应商分担订单',
    },
  ],
  'EVT-004': [
    {
      id: 'case-005',
      eventId: 'EVT-HIST-005',
      title: '2025年钢铁企业环保整改事件',
      severity: 'critical',
      status: '已解决',
      resolutionDays: 15,
      similarity: 92,
      outcome: '供应商完成整改后恢复供货，期间启用替代方案',
    },
    {
      id: 'case-006',
      eventId: 'EVT-HIST-006',
      title: '某重金属企业排放超标处罚',
      severity: 'high',
      status: '已解决',
      resolutionDays: 8,
      similarity: 81,
      outcome: '罚款并限期整改，短期内供应受限',
    },
  ],
}

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

export function getAISuggestionsForEvent(eventId: string): AISuggestionSet {
  return {
    eventId,
    mappingSuggestions: mockMappingSuggestions[eventId] ?? [],
    severitySuggestion: mockSeveritySuggestions[eventId] ?? null,
    similarCases: mockSimilarCases[eventId] ?? [],
  }
}

export function getConfidenceColor(confidence: number): string {
  if (confidence >= 90) return 'text-green-600 bg-green-50'
  if (confidence >= 70) return 'text-blue-600 bg-blue-50'
  if (confidence >= 50) return 'text-yellow-600 bg-yellow-50'
  return 'text-orange-600 bg-orange-50'
}

export function getConfidenceBorderColor(confidence: number): string {
  if (confidence >= 90) return 'border-green-200'
  if (confidence >= 70) return 'border-blue-200'
  if (confidence >= 50) return 'border-yellow-200'
  return 'border-orange-200'
}

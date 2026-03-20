import type { Severity } from '@/types/enums'

export type RiskNodeType = 'supplier' | 'site' | 'port'

export type RiskNodeStatus = 'active' | 'resolved'

export type RiskNodeRiskType =
  | 'supplyDisruption'
  | 'qualityIssue'
  | 'geopolitical'
  | 'naturalDisaster'
  | 'cyberSecurity'

export interface RiskNode {
  id: string
  name: string
  lat: number
  lng: number
  severity: Severity
  eventCount: number
  riskSummary: string
  nodeType: RiskNodeType
  riskType: RiskNodeRiskType
  region: string
  status: RiskNodeStatus
  updatedAt: string
}

export const severityColor: Record<Severity, string> = {
  critical: '#D64545',
  high: '#EA580C',
  medium: '#D98A00',
  low: '#2E8B57',
  info: '#2F6FED',
}

export const severityRank: Record<Severity, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
  info: 0,
}

export const severityLabel: Record<Severity, string> = {
  critical: '严重',
  high: '高危',
  medium: '中危',
  low: '低危',
  info: '信息',
}

export const riskTypeLabel: Record<RiskNodeRiskType, string> = {
  supplyDisruption: '供应中断',
  qualityIssue: '质量问题',
  geopolitical: '地缘政治',
  naturalDisaster: '自然灾害',
  cyberSecurity: '网络安全',
}

export const nodeTypeLabel: Record<RiskNodeType, string> = {
  supplier: '供应商',
  site: '站点',
  port: '港口',
}

export function getHigherSeverity(current: Severity, next: Severity) {
  return severityRank[next] > severityRank[current] ? next : current
}

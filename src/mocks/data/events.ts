import type { RiskEvent, RiskEventListItem, EventSource, EventActivity, ImpactObject } from '@/types/event'
import type { Severity, RiskType, EventStatus, ActivityType } from '@/types/enums'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const statuses: EventStatus[] = ['new', 'in_progress', 'resolved', 'archived']
const owners = [
  { id: 'u-001', name: '张三' },
  { id: 'u-002', name: '李四' },
  { id: 'u-003', name: '王五' },
  { id: 'u-004', name: '赵六' },
]

const riskTypeLabels: Record<RiskType, string> = {
  supply_disruption: '供应中断',
  quality_issue: '质量问题',
  compliance_violation: '合规违规',
  financial_risk: '财务风险',
  geopolitical: '地缘政治',
  natural_disaster: '自然灾害',
  cyber_security: '网络安全',
  regulatory_change: '法规变更',
}

const regions = ['华东', '华南', '华北', '华中', '西南', '东南亚', '欧洲', '北美']

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomDate(daysBack: number): string {
  const now = Date.now()
  const offset = Math.random() * daysBack * 86400000
  return new Date(now - offset).toISOString()
}

function slaDate(severity: Severity, occurredAt: string): string {
  const base = new Date(occurredAt)
  const daysMap: Record<Severity, number> = {
    critical: 1,
    high: 3,
    medium: 7,
    low: 14,
    info: 30,
  }
  base.setDate(base.getDate() + daysMap[severity])
  return base.toISOString()
}

// ---------------------------------------------------------------------------
// Event titles pool (Chinese)
// ---------------------------------------------------------------------------

const titlePool: { type: RiskType; title: string }[] = [
  { type: 'supply_disruption', title: '芯片供应商产线停机导致关键元器件断供' },
  { type: 'supply_disruption', title: '马六甲海峡航运拥堵影响原材料到港' },
  { type: 'supply_disruption', title: '核心供应商 TechParts 宣布不可抗力停产' },
  { type: 'supply_disruption', title: '稀土材料价格飙升 30% 触发供应预警' },
  { type: 'supply_disruption', title: '二级供应商东莞精工突发火灾停产' },
  { type: 'quality_issue', title: '批次 #BT2026-0312 焊接缺陷率超标' },
  { type: 'quality_issue', title: '进口钢材检测发现成分不达标' },
  { type: 'quality_issue', title: '客户反馈 Q1 批次产品耐久性异常' },
  { type: 'quality_issue', title: '供应商来料 IQC 连续 3 批不合格' },
  { type: 'compliance_violation', title: 'EU CBAM 碳边境调节机制新规影响评估' },
  { type: 'compliance_violation', title: '供应商环保资质到期未续' },
  { type: 'compliance_violation', title: 'REACH 法规新增限制物质清单更新' },
  { type: 'compliance_violation', title: '出口管制清单更新波及 3 家供应商' },
  { type: 'financial_risk', title: '核心供应商信用评级下调至 BB-' },
  { type: 'financial_risk', title: '汇率波动导致采购成本超预算 15%' },
  { type: 'financial_risk', title: '供应商年报显示现金流持续恶化' },
  { type: 'financial_risk', title: '大客户回款延迟引发供应商资金链紧张' },
  { type: 'geopolitical', title: '红海局势升级影响欧洲航线物流时效' },
  { type: 'geopolitical', title: '新一轮贸易关税政策调整影响进口成本' },
  { type: 'geopolitical', title: '东南亚某国政局动荡影响当地工厂运营' },
  { type: 'geopolitical', title: '中美科技出口限制清单扩大' },
  { type: 'natural_disaster', title: '台湾地震影响半导体供应链' },
  { type: 'natural_disaster', title: '华南暴雨预警 — 多个仓库面临洪涝风险' },
  { type: 'natural_disaster', title: '日本福冈台风预警影响港口运营' },
  { type: 'natural_disaster', title: '印度热浪导致工厂限电减产' },
  { type: 'cyber_security', title: '供应商 ERP 系统遭勒索软件攻击' },
  { type: 'cyber_security', title: '物流合作伙伴 API 接口数据泄露' },
  { type: 'cyber_security', title: '供应商邮件系统钓鱼攻击事件' },
  { type: 'cyber_security', title: '工控系统漏洞预警 (CVE-2026-XXXX)' },
  { type: 'regulatory_change', title: '新版《数据安全法》实施细则征求意见' },
  { type: 'regulatory_change', title: '欧盟电池法规强制回收要求即将生效' },
  { type: 'regulatory_change', title: '碳排放配额交易新规影响供应商准入' },
  { type: 'regulatory_change', title: '海关 HS 编码调整影响进口申报流程' },
  { type: 'supply_disruption', title: '越南工厂因罢工停产三天' },
  { type: 'quality_issue', title: '涂层厚度偏差导致退货率上升' },
]

// ---------------------------------------------------------------------------
// AI Summaries
// ---------------------------------------------------------------------------

const summaries = [
  '根据多源情报分析，该事件可能在未来 72 小时内进一步恶化。建议立即启动应急预案，联系备选供应商确认产能。',
  '经 AI 研判，事件影响范围有限，当前库存可覆盖 14 天需求。建议持续监控并准备 Plan B。',
  '综合情报显示该风险为高置信度事件，影响 5 个关键 SKU 的交付。建议升级处理优先级并通知相关业务线。',
  '该事件已被多个权威信源确认，预计影响周期 2-4 周。建议立即评估替代方案并启动商务谈判。',
  '初步分析表明该风险事件置信度较低，建议持续观察 48 小时后再做决策。',
]

// ---------------------------------------------------------------------------
// Impact objects pool
// ---------------------------------------------------------------------------

const impactObjectPool: ImpactObject[] = [
  { type: 'supplier', id: 'sup-001', name: '深圳恒达电子', confidence: 95 },
  { type: 'supplier', id: 'sup-002', name: 'TechParts Inc.', confidence: 88 },
  { type: 'supplier', id: 'sup-003', name: '东莞精工制造', confidence: 72 },
  { type: 'material', id: 'mat-001', name: 'MLCC 电容 0402', confidence: 90 },
  { type: 'material', id: 'mat-002', name: '高纯度铜箔 T2', confidence: 85 },
  { type: 'material', id: 'mat-003', name: 'BT树脂基板', confidence: 78 },
  { type: 'order', id: 'ord-001', name: 'PO-2026-03-0158', confidence: 92 },
  { type: 'order', id: 'ord-002', name: 'PO-2026-03-0231', confidence: 80 },
  { type: 'order', id: 'ord-003', name: 'PO-2026-02-0892', confidence: 65 },
  { type: 'region', id: 'reg-001', name: '长三角产业集群', confidence: 88 },
  { type: 'customer', id: 'cus-001', name: '华为终端', confidence: 75 },
  { type: 'site', id: 'site-001', name: '苏州工厂 A 区', confidence: 82 },
]

// ---------------------------------------------------------------------------
// Generate 35 events
// ---------------------------------------------------------------------------

function generateEvents(): RiskEventListItem[] {
  const items: RiskEventListItem[] = []

  for (let i = 0; i < 35; i++) {
    const template = titlePool[i % titlePool.length]
    const sev = i < 3 ? 'critical' : i < 8 ? 'high' : i < 18 ? 'medium' : i < 28 ? 'low' : 'info'
    const sts = i < 10 ? pick(['new', 'in_progress'] as EventStatus[]) : pick(statuses)
    const owner = owners[i % owners.length]
    const occurredAt = randomDate(30)
    const confidence = randomInt(35, 99)

    items.push({
      event_id: `EVT-${String(i + 1).padStart(4, '0')}`,
      title: template.title,
      type: template.type,
      severity: sev,
      status: sts,
      owner_name: owner.name,
      source_count: randomInt(1, 12),
      confidence,
      occurred_at: occurredAt,
      sla_due_at: slaDate(sev, occurredAt),
      region: pick(regions),
      updated_at: randomDate(5),
      impact_count: randomInt(1, 8),
      tag_count: randomInt(0, 5),
    })
  }

  return items
}

export const mockEventListItems: RiskEventListItem[] = generateEvents()

// ---------------------------------------------------------------------------
// Full event detail (for drawer)
// ---------------------------------------------------------------------------

function generateFullEvent(item: RiskEventListItem): RiskEvent {
  const owner = owners.find((o) => o.name === item.owner_name) ?? owners[0]
  const impacts = Array.from(
    { length: randomInt(2, 5) },
    () => impactObjectPool[randomInt(0, impactObjectPool.length - 1)]
  )

  return {
    event_id: item.event_id,
    title: item.title,
    type: item.type,
    severity: item.severity,
    source_count: item.source_count,
    confidence: item.confidence,
    occurred_at: item.occurred_at,
    discovered_at: new Date(
      new Date(item.occurred_at).getTime() + randomInt(1, 12) * 3600000
    ).toISOString(),
    status: item.status,
    owner_id: owner.id,
    owner_name: owner.name,
    impact_objects: impacts,
    tags: ['供应链', '紧急', '自动发现'].slice(0, randomInt(1, 3)),
    ai_summary: pick(summaries),
    sla_due_at: item.sla_due_at,
    organization_id: 'org-001',
    region: item.region,
    created_at: item.occurred_at,
    updated_at: item.updated_at,
  }
}

export const mockFullEvents: Record<string, RiskEvent> = Object.fromEntries(
  mockEventListItems.map((item) => [item.event_id, generateFullEvent(item)])
)

// ---------------------------------------------------------------------------
// Event activities (for drawer timeline)
// ---------------------------------------------------------------------------

const activityTemplates: { type: ActivityType; description: string; from?: string; to?: string }[] = [
  { type: 'status_change', description: '事件状态变更', from: '新入库', to: '处理中' },
  { type: 'assignment', description: '将事件指派给处理人' },
  { type: 'comment', description: '初步分析完成，该事件影响 3 个关键订单，建议升级处理' },
  { type: 'severity_change', description: '调整严重级别', from: '中危', to: '高危' },
  { type: 'mapping_change', description: '关联了 2 个新的影响对象' },
  { type: 'comment', description: '已联系备选供应商，预计 48 小时内可确认产能' },
  { type: 'approval', description: '审批通过应急采购申请' },
]

export function generateActivities(eventId: string): EventActivity[] {
  const count = randomInt(3, 5)
  return Array.from({ length: count }, (_, i) => {
    const tmpl = activityTemplates[i % activityTemplates.length]
    const actor = pick(owners)
    return {
      id: `${eventId}-act-${i + 1}`,
      actor_id: actor.id,
      actor_name: actor.name,
      action: tmpl.description,
      description: tmpl.description,
      timestamp: randomDate(7),
      before_value: tmpl.from,
      after_value: tmpl.to,
      type: tmpl.type,
    }
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

// ---------------------------------------------------------------------------
// Event sources (for drawer)
// ---------------------------------------------------------------------------

const sourcePool: Omit<EventSource, 'source_id' | 'published_at'>[] = [
  {
    name: '路透社',
    credibility: 95,
    language: 'en',
    url: 'https://reuters.com/article/example',
    excerpt:
      'According to industry sources, the factory shutdown is expected to last at least two weeks, affecting major clients in the electronics sector.',
  },
  {
    name: '供应商门户',
    credibility: 90,
    language: 'zh',
    excerpt: '供应商通过官方门户发布停产通知，预计恢复时间待定。已建议客户启动安全库存。',
  },
  {
    name: '舆情监测系统',
    credibility: 70,
    language: 'zh',
    excerpt: '社交媒体出现多条关于该供应商停产的讨论，信息待进一步核实。',
  },
  {
    name: '海关数据平台',
    credibility: 88,
    language: 'zh',
    excerpt: '近 30 天相关 HS 编码进口量环比下降 22%，与预警信号吻合。',
  },
]

export function generateSources(eventId: string): EventSource[] {
  const count = randomInt(1, 3)
  return Array.from({ length: count }, (_, i) => {
    const tmpl = sourcePool[i % sourcePool.length]
    return {
      source_id: `${eventId}-src-${i + 1}`,
      ...tmpl,
      published_at: randomDate(14),
    }
  })
}

// ---------------------------------------------------------------------------
// Export labels for filters
// ---------------------------------------------------------------------------

export { riskTypeLabels, owners }

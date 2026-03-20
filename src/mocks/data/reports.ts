/**
 * OptiMax Mock Data - Reports
 * Includes templates, drafts, and published reports
 */

import type { ReportSchedule } from '@/types/report'

// ---------------------------------------------------------------------------
// Report Templates
// ---------------------------------------------------------------------------

export interface ReportTemplate {
  id: string
  name: string
  type: 'daily' | 'weekly' | 'monthly' | 'special' | 'retrospective'
  description: string
  thumbnail?: string
  sections: string[]
  useCount: number
  isBuiltin: boolean
  createdAt: string
}

export const reportTemplates: ReportTemplate[] = [
  {
    id: 'tpl-daily-001',
    name: '风险运营日报',
    type: 'daily',
    description: '每日风险事件汇总、新增事件、处置进展',
    sections: ['summary', 'new_events', 'resolved_events', 'pending_alerts', 'kpi_metrics'],
    useCount: 128,
    isBuiltin: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'tpl-weekly-001',
    name: '供应商风险周报',
    type: 'weekly',
    description: '本周供应商风险变化、高风险供应商清单、预警事件',
    sections: ['summary', 'supplier_overview', 'risk_changes', 'top_alerts', 'regional_risk'],
    useCount: 86,
    isBuiltin: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'tpl-monthly-001',
    name: '供应链风控月报',
    type: 'monthly',
    description: '月度风险评估、趋势分析、案例复盘、改进建议',
    sections: ['executive_summary', 'risk_trends', 'category_analysis', 'supplier_scorecard', 'case_studies', 'recommendations'],
    useCount: 45,
    isBuiltin: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'tpl-retro-001',
    name: '风险事件复盘模板',
    type: 'retrospective',
    description: '重大风险事件复盘、根因分析、改进措施跟踪',
    sections: ['event_summary', 'timeline', 'root_cause', 'impact_analysis', 'lessons_learned', 'action_items'],
    useCount: 32,
    isBuiltin: true,
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'tpl-special-001',
    name: '自然灾害专题报告',
    type: 'special',
    description: '针对自然灾害事件的专项风险评估报告',
    sections: ['disaster_overview', 'affected_regions', 'supplier_impact', 'mitigation_status', 'contingency_plans'],
    useCount: 18,
    isBuiltin: true,
    createdAt: '2026-02-01T00:00:00Z',
  },
  {
    id: 'tpl-special-002',
    name: '合规风险审计报告',
    type: 'special',
    description: '供应商合规风险审计发现与整改建议',
    sections: ['audit_scope', 'findings', 'compliance_gaps', 'remediation_plan', 'timeline'],
    useCount: 24,
    isBuiltin: true,
    createdAt: '2026-02-10T00:00:00Z',
  },
  {
    id: 'tpl-custom-001',
    name: '区域风险对比分析',
    type: 'special',
    description: '自定义区域风险对比分析',
    sections: ['summary', 'regional_comparison', 'trend_analysis'],
    useCount: 12,
    isBuiltin: false,
    createdAt: '2026-03-10T00:00:00Z',
  },
  {
    id: 'tpl-custom-002',
    name: '高管风险简报',
    type: 'weekly',
    description: '面向高管的精简风险简报，突出重点',
    sections: ['executive_summary', 'critical_alerts', 'financial_impact', 'action_required'],
    useCount: 67,
    isBuiltin: false,
    createdAt: '2026-03-12T00:00:00Z',
  },
]

// ---------------------------------------------------------------------------
// Report Drafts
// ---------------------------------------------------------------------------

export interface ReportDraft {
  id: string
  title: string
  templateId?: string
  type: 'daily' | 'weekly' | 'monthly' | 'special' | 'retrospective'
  status: 'draft' | 'editing' | 'ready'
  content: ReportContentBlock[]
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface ReportContentBlock {
  id: string
  type: 'text' | 'metric' | 'chart' | 'table' | 'map_snapshot' | 'event_summary' | 'case_conclusion'
  content: string
  config?: Record<string, unknown>
  order: number
}

export const reportDrafts: ReportDraft[] = [
  {
    id: 'draft-001',
    title: '2026年3月20日风险日报（草稿）',
    templateId: 'tpl-daily-001',
    type: 'daily',
    status: 'editing',
    content: [
      {
        id: 'block-001',
        type: 'text',
        content: '# 风险运营日报\n\n报告周期：2026年3月20日\n\n## 总体概况\n\n今日系统共监测到风险事件12起，其中高危事件3起，中危事件5起，低危事件4起。已处置完成8起，剩余4起正在跟进中。',
        order: 1,
      },
      {
        id: 'block-002',
        type: 'metric',
        content: JSON.stringify({
          newEvents: 12,
          highRisk: 3,
          resolved: 8,
          pending: 4,
        }),
        order: 2,
      },
    ],
    createdAt: '2026-03-20T08:00:00Z',
    updatedAt: '2026-03-20T10:30:00Z',
    createdBy: '张三',
  },
  {
    id: 'draft-002',
    title: '华东区域供应商风险周报（草稿）',
    type: 'weekly',
    status: 'draft',
    content: [],
    createdAt: '2026-03-18T14:00:00Z',
    updatedAt: '2026-03-18T14:00:00Z',
    createdBy: '李四',
  },
]

// ---------------------------------------------------------------------------
// Published Reports
// ---------------------------------------------------------------------------

export interface PublishedReport {
  id: string
  title: string
  type: 'daily' | 'weekly' | 'monthly' | 'special' | 'retrospective'
  status: 'published' | 'archived' | 'revoked'
  periodStart: string
  periodEnd: string
  publishedAt: string
  publishedBy: string
  recipients: string[]
  channels: ('email' | 'in_app' | 'wechat' | 'dingtalk')[]
  readCount: number
  relatedEvents: string[]
  relatedCases: string[]
  fileSize?: number
}

export const publishedReports: PublishedReport[] = [
  {
    id: 'rep-2026-03-019',
    title: '2026年3月19日风险日报',
    type: 'daily',
    status: 'published',
    periodStart: '2026-03-19T00:00:00Z',
    periodEnd: '2026-03-19T23:59:59Z',
    publishedAt: '2026-03-19T18:00:00Z',
    publishedBy: '张三',
    recipients: [' Risk Management Team', '供应链总监', '运营 VP'],
    channels: ['email', 'in_app'],
    readCount: 45,
    relatedEvents: ['evt-001', 'evt-002'],
    relatedCases: ['case-001'],
  },
  {
    id: 'rep-2026-03-018',
    title: '2026年3月18日风险日报',
    type: 'daily',
    status: 'published',
    periodStart: '2026-03-18T00:00:00Z',
    periodEnd: '2026-03-18T23:59:59Z',
    publishedAt: '2026-03-18T18:00:00Z',
    publishedBy: '张三',
    recipients: ['Risk Management Team', '供应链总监'],
    channels: ['email', 'in_app'],
    readCount: 42,
    relatedEvents: ['evt-003'],
    relatedCases: [],
  },
  {
    id: 'rep-2026-W12',
    title: '2026年第12周供应商风险周报',
    type: 'weekly',
    status: 'published',
    periodStart: '2026-03-15T00:00:00Z',
    periodEnd: '2026-03-21T23:59:59Z',
    publishedAt: '2026-03-21T09:00:00Z',
    publishedBy: '李四',
    recipients: ['管理层', '风控委员会'],
    channels: ['email'],
    readCount: 28,
    relatedEvents: ['evt-001', 'evt-002', 'evt-003', 'evt-004'],
    relatedCases: ['case-001', 'case-002'],
  },
  {
    id: 'rep-2026-M02',
    title: '2026年2月供应链风控月报',
    type: 'monthly',
    status: 'archived',
    periodStart: '2026-02-01T00:00:00Z',
    periodEnd: '2026-02-28T23:59:59Z',
    publishedAt: '2026-03-05T10:00:00Z',
    publishedBy: '王五',
    recipients: ['CEO', 'CFO', '供应链总监', '风控总监'],
    channels: ['email', 'in_app'],
    readCount: 67,
    relatedEvents: ['evt-005', 'evt-006', 'evt-007'],
    relatedCases: ['case-003'],
  },
  {
    id: 'rep-retro-001',
    title: '泰国洪灾风险事件复盘报告',
    type: 'retrospective',
    status: 'published',
    periodStart: '2026-03-01T00:00:00Z',
    periodEnd: '2026-03-15T23:59:59Z',
    publishedAt: '2026-03-16T14:00:00Z',
    publishedBy: '张三',
    recipients: ['风控委员会', '业务连续性管理组'],
    channels: ['email', 'in_app'],
    readCount: 35,
    relatedEvents: ['evt-008'],
    relatedCases: ['case-004'],
  },
]

// ---------------------------------------------------------------------------
// Report Schedules
// ---------------------------------------------------------------------------

export const reportSchedules: ReportSchedule[] = [
  {
    schedule_id: 'sch-001',
    report_type: 'daily',
    format: 'pdf',
    cron_expression: '0 18 * * *',
    recipients: ['user-001', 'user-002', 'user-003'],
    enabled: true,
    last_run_at: '2026-03-19T18:00:00Z',
    next_run_at: '2026-03-20T18:00:00Z',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    schedule_id: 'sch-002',
    report_type: 'weekly',
    format: 'pdf',
    cron_expression: '0 9 * * 1',
    recipients: ['user-001', 'user-004'],
    enabled: true,
    last_run_at: '2026-03-17T09:00:00Z',
    next_run_at: '2026-03-24T09:00:00Z',
    created_at: '2026-01-01T00:00:00Z',
  },
]

// ---------------------------------------------------------------------------
// Mock Users for Recipient Selection
// ---------------------------------------------------------------------------

export interface ReportRecipient {
  id: string
  name: string
  email: string
  role: string
  department: string
  avatar?: string
}

export const reportRecipients: ReportRecipient[] = [
  { id: 'user-001', name: '张三', email: 'zhangsan@company.com', role: '风控经理', department: '风险管理部' },
  { id: 'user-002', name: '李四', email: 'lisi@company.com', role: '供应链总监', department: '供应链管理部' },
  { id: 'user-003', name: '王五', email: 'wangwu@company.com', role: '运营VP', department: '运营管理部' },
  { id: 'user-004', name: '赵六', email: 'zhaoliu@company.com', role: 'CEO', department: '总裁办' },
  { id: 'user-005', name: '钱七', email: 'qianqi@company.com', role: 'CFO', department: '财务部' },
  { id: 'user-006', name: '孙八', email: 'sunba@company.com', role: '风控专员', department: '风险管理部' },
  { id: 'user-007', name: '周九', email: 'zhoujiu@company.com', role: '采购经理', department: '采购部' },
  { id: 'user-008', name: '吴十', email: 'wushi@company.com', role: '质量经理', department: '质量管理部' },
]

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

export function getTemplatesByType(type: ReportTemplate['type']): ReportTemplate[] {
  return reportTemplates.filter((t) => t.type === type)
}

export function getTemplateById(id: string): ReportTemplate | undefined {
  return reportTemplates.find((t) => t.id === id)
}

export function getPublishedReportsByStatus(status: PublishedReport['status']): PublishedReport[] {
  return publishedReports.filter((r) => r.status === status)
}

export function getReportById(id: string): PublishedReport | undefined {
  return publishedReports.find((r) => r.id === id)
}

export function getDraftById(id: string): ReportDraft | undefined {
  return reportDrafts.find((d) => d.id === id)
}

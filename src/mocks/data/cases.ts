/**
 * OptiMax Mock Data - Cases
 */

import type { Case, CaseListItem, Participant } from '@/types/case'
import type { Severity, CaseStatus } from '@/types/enums'

// ---------------------------------------------------------------------------
// Mock Participants
// ---------------------------------------------------------------------------

export const mockParticipants: Participant[] = [
  { user_id: 'U001', name: '张明', role: '供应链经理', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangming' },
  { user_id: 'U002', name: '李芳', role: '采购主管', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lifang' },
  { user_id: 'U003', name: '王建国', role: '风险分析师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangjianguo' },
  { user_id: 'U004', name: '陈晓红', role: '物流协调员', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chenxiaohong' },
  { user_id: 'U005', name: '赵伟', role: '合规专员', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhaowei' },
  { user_id: 'U006', name: '刘强', role: '生产计划', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liuqiang' },
  { user_id: 'U007', name: '周敏', role: '质量工程师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhoumin' },
  { user_id: 'U008', name: '吴磊', role: '财务分析', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wulei' },
]

// ---------------------------------------------------------------------------
// Mock Cases
// ---------------------------------------------------------------------------

export const mockCases: Case[] = [
  {
    case_id: 'CASE-2026-0001',
    title: '华芯半导体芯片交付严重延迟应急响应',
    level: 'critical' as Severity,
    owner_id: 'U001',
    owner_name: '张明',
    participants: [
      mockParticipants[0],
      mockParticipants[1],
      mockParticipants[2],
      mockParticipants[5],
      mockParticipants[6],
    ],
    sla_due_at: '2026-03-21T18:00:00Z',
    status: 'deciding' as CaseStatus,
    related_event_id: 'EVT-2026-0156',
    related_event_title: '华芯半导体工厂火灾导致停产',
    next_action: '等待替代供应商方案审批',
    decision_status: '待决策',
    created_at: '2026-03-18T08:00:00Z',
    updated_at: '2026-03-20T14:30:00Z',
  },
  {
    case_id: 'CASE-2026-0002',
    title: '中泰钢铁环保停产应急处置',
    level: 'critical' as Severity,
    owner_id: 'U002',
    owner_name: '李芳',
    participants: [
      mockParticipants[1],
      mockParticipants[2],
      mockParticipants[3],
      mockParticipants[5],
      mockParticipants[6],
      mockParticipants[7],
    ],
    sla_due_at: '2026-03-22T12:00:00Z',
    status: 'executing' as CaseStatus,
    related_event_id: 'EVT-2026-0142',
    related_event_title: '中泰钢铁因环保检查全面停产',
    next_action: '执行备选钢材采购计划',
    decision_status: '已通过',
    created_at: '2026-03-15T10:00:00Z',
    updated_at: '2026-03-20T16:00:00Z',
  },
  {
    case_id: 'CASE-2026-0003',
    title: '台北地震供应链影响评估',
    level: 'high' as Severity,
    owner_id: 'U003',
    owner_name: '王建国',
    participants: [
      mockParticipants[2],
      mockParticipants[3],
      mockParticipants[4],
      mockParticipants[6],
    ],
    sla_due_at: '2026-03-23T09:00:00Z',
    status: 'analyzing' as CaseStatus,
    related_event_id: 'EVT-2026-0138',
    related_event_title: '台北附近海域6.2级地震',
    next_action: '评估受影响供应商清单',
    decision_status: '无需决策',
    created_at: '2026-03-14T14:00:00Z',
    updated_at: '2026-03-20T10:00:00Z',
  },
]

// ---------------------------------------------------------------------------
// Case List Items (for list views)
// ---------------------------------------------------------------------------

export const mockCaseListItems: CaseListItem[] = [
  {
    case_id: 'CASE-2026-0001',
    title: '华芯半导体芯片交付严重延迟应急响应',
    level: 'critical',
    status: 'deciding',
    owner_name: '张明',
    sla_due_at: '2026-03-21T18:00:00Z',
    related_event_title: '华芯半导体工厂火灾导致停产',
    updated_at: '2026-03-20T14:30:00Z',
    participant_count: 5,
    task_count: 8,
    completed_task_count: 3,
  },
  {
    case_id: 'CASE-2026-0002',
    title: '中泰钢铁环保停产应急处置',
    level: 'critical',
    status: 'executing',
    owner_name: '李芳',
    sla_due_at: '2026-03-22T12:00:00Z',
    related_event_title: '中泰钢铁因环保检查全面停产',
    updated_at: '2026-03-20T16:00:00Z',
    participant_count: 6,
    task_count: 12,
    completed_task_count: 7,
  },
  {
    case_id: 'CASE-2026-0003',
    title: '台北地震供应链影响评估',
    level: 'high',
    status: 'analyzing',
    owner_name: '王建国',
    sla_due_at: '2026-03-23T09:00:00Z',
    related_event_title: '台北附近海域6.2级地震',
    updated_at: '2026-03-20T10:00:00Z',
    participant_count: 4,
    task_count: 6,
    completed_task_count: 2,
  },
]

// ---------------------------------------------------------------------------
// Legacy exports for compatibility
// ---------------------------------------------------------------------------

export interface CaseLegacy {
  id: string
  title: string
  status: string
  priority: string
  createdAt: string
}

export const cases: CaseLegacy[] = mockCases.map(c => ({
  id: c.case_id,
  title: c.title,
  status: c.status,
  priority: c.level,
  createdAt: c.created_at,
}))

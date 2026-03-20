/**
 * OptiMax Mock Data - War Room Activities & Comments
 *
 * War Room 时间线与评论数据
 */

import type { WarRoomActivity, WarRoomComment, WarRoomActivityType } from '@/types/solution'

// ---------------------------------------------------------------------------
// War Room Activities for CASE-2026-0001
// ---------------------------------------------------------------------------

export const mockActivitiesCase1: WarRoomActivity[] = [
  {
    activity_id: 'ACT-2026-0001',
    case_id: 'CASE-2026-0001',
    type: 'case_created',
    actor: {
      user_id: 'U001',
      name: '张明',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangming',
    },
    description: '创建了 Case',
    related_id: 'CASE-2026-0001',
    related_type: 'task',
    created_at: '2026-03-18T08:00:00Z',
  },
  {
    activity_id: 'ACT-2026-0002',
    case_id: 'CASE-2026-0001',
    type: 'participant_added',
    actor: {
      user_id: 'U001',
      name: '张明',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangming',
    },
    description: '添加了参会人: 李芳、王建国、刘强、周敏',
    created_at: '2026-03-18T08:05:00Z',
  },
  {
    activity_id: 'ACT-2026-0003',
    case_id: 'CASE-2026-0001',
    type: 'task_created',
    actor: {
      user_id: 'U002',
      name: '李芳',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lifang',
    },
    description: '创建了任务: 确认华芯半导体工厂受损情况',
    related_id: 'TASK-2026-0001',
    related_type: 'task',
    created_at: '2026-03-18T08:30:00Z',
  },
  {
    activity_id: 'ACT-2026-0004',
    case_id: 'CASE-2026-0001',
    type: 'task_status_changed',
    actor: {
      user_id: 'U002',
      name: '李芳',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lifang',
    },
    description: '更新任务状态',
    related_id: 'TASK-2026-0001',
    related_type: 'task',
    from_state: '待领取',
    to_state: '已完成',
    created_at: '2026-03-18T16:00:00Z',
  },
  {
    activity_id: 'ACT-2026-0005',
    case_id: 'CASE-2026-0001',
    type: 'case_escalated',
    actor: {
      user_id: 'SYSTEM',
      name: '系统',
    },
    description: 'Case 升级为严重级别',
    from_state: 'high',
    to_state: 'critical',
    created_at: '2026-03-18T16:30:00Z',
  },
  {
    activity_id: 'ACT-2026-0006',
    case_id: 'CASE-2026-0001',
    type: 'task_created',
    actor: {
      user_id: 'U006',
      name: '刘强',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liuqiang',
    },
    description: '创建了任务: 评估现有芯片库存',
    related_id: 'TASK-2026-0002',
    related_type: 'task',
    created_at: '2026-03-18T09:00:00Z',
  },
  {
    activity_id: 'ACT-2026-0007',
    case_id: 'CASE-2026-0001',
    type: 'task_status_changed',
    actor: {
      user_id: 'U006',
      name: '刘强',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liuqiang',
    },
    description: '更新任务状态',
    related_id: 'TASK-2026-0002',
    related_type: 'task',
    from_state: '待领取',
    to_state: '已完成',
    created_at: '2026-03-19T10:00:00Z',
  },
  {
    activity_id: 'ACT-2026-0008',
    case_id: 'CASE-2026-0001',
    type: 'solution_proposed',
    actor: {
      user_id: 'U001',
      name: '张明',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangming',
    },
    description: '提交了方案: 从三星电子紧急采购芯片',
    related_id: 'SOL-2026-0001',
    related_type: 'solution',
    created_at: '2026-03-20T10:00:00Z',
  },
  {
    activity_id: 'ACT-2026-0009',
    case_id: 'CASE-2026-0001',
    type: 'solution_proposed',
    actor: {
      user_id: 'U002',
      name: '李芳',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lifang',
    },
    description: '提交了方案: 从台积电追加订单',
    related_id: 'SOL-2026-0002',
    related_type: 'solution',
    created_at: '2026-03-20T11:30:00Z',
  },
  {
    activity_id: 'ACT-2026-0010',
    case_id: 'CASE-2026-0001',
    type: 'solution_proposed',
    actor: {
      user_id: 'U003',
      name: '王建国',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangjianguo',
    },
    description: '提交了方案: 启用国产替代芯片 (已放弃)',
    related_id: 'SOL-2026-0003',
    related_type: 'solution',
    created_at: '2026-03-19T16:00:00Z',
  },
  {
    activity_id: 'ACT-2026-0011',
    case_id: 'CASE-2026-0001',
    type: 'attachment_uploaded',
    actor: {
      user_id: 'U003',
      name: '王建国',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangjianguo',
    },
    description: '上传了附件: 华芯半导体火灾影响评估报告.pdf',
    related_id: 'ATT-2026-0001',
    related_type: 'attachment',
    created_at: '2026-03-20T12:00:00Z',
  },
  {
    activity_id: 'ACT-2026-0012',
    case_id: 'CASE-2026-0001',
    type: 'minute_created',
    actor: {
      user_id: 'SYSTEM',
      name: 'AI 助手',
    },
    description: 'AI 生成了会议纪要: 华芯半导体应急响应会议纪要',
    related_id: 'MIN-2026-0001',
    related_type: 'minute',
    created_at: '2026-03-20T11:00:00Z',
  },
  {
    activity_id: 'ACT-2026-0013',
    case_id: 'CASE-2026-0001',
    type: 'minute_updated',
    actor: {
      user_id: 'U001',
      name: '张明',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangming',
    },
    description: '修订了会议纪要 (版本 2)',
    related_id: 'MIN-2026-0001',
    related_type: 'minute',
    from_state: '1',
    to_state: '2',
    created_at: '2026-03-20T14:30:00Z',
  },
  {
    activity_id: 'ACT-2026-0014',
    case_id: 'CASE-2026-0001',
    type: 'decision_made',
    actor: {
      user_id: 'U001',
      name: '张明',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangming',
    },
    description: '做出决策: 采纳三星电子紧急采购方案',
    related_id: 'SOL-2026-0001',
    related_type: 'solution',
    from_state: '待决策',
    to_state: '已通过',
    created_at: '2026-03-20T15:00:00Z',
  },
  {
    activity_id: 'ACT-2026-0015',
    case_id: 'CASE-2026-0001',
    type: 'attachment_uploaded',
    actor: {
      user_id: 'U002',
      name: '李芳',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lifang',
    },
    description: '上传了附件: 三星电子采购合同草案.docx',
    related_id: 'ATT-2026-0002',
    related_type: 'attachment',
    created_at: '2026-03-20T15:00:00Z',
  },
  {
    activity_id: 'ACT-2026-0016',
    case_id: 'CASE-2026-0001',
    type: 'task_created',
    actor: {
      user_id: 'U005',
      name: '赵伟',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhaowei',
    },
    description: '创建了任务: 替代供应商方案审批',
    related_id: 'TASK-2026-0005',
    related_type: 'task',
    created_at: '2026-03-20T10:00:00Z',
  },
]

// ---------------------------------------------------------------------------
// War Room Activities for CASE-2026-0002
// ---------------------------------------------------------------------------

export const mockActivitiesCase2: WarRoomActivity[] = [
  {
    activity_id: 'ACT-2026-0101',
    case_id: 'CASE-2026-0002',
    type: 'case_created',
    actor: {
      user_id: 'U002',
      name: '李芳',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lifang',
    },
    description: '创建了 Case',
    created_at: '2026-03-15T10:00:00Z',
  },
  {
    activity_id: 'ACT-2026-0102',
    case_id: 'CASE-2026-0002',
    type: 'solution_proposed',
    actor: {
      user_id: 'U001',
      name: '张明',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangming',
    },
    description: '提交了方案: 从宝武钢铁紧急采购',
    related_id: 'SOL-2026-0005',
    related_type: 'solution',
    created_at: '2026-03-15T14:00:00Z',
  },
  {
    activity_id: 'ACT-2026-0103',
    case_id: 'CASE-2026-0002',
    type: 'decision_made',
    actor: {
      user_id: 'U002',
      name: '李芳',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lifang',
    },
    description: '批准方案: 从宝武钢铁紧急采购',
    related_id: 'SOL-2026-0005',
    related_type: 'solution',
    from_state: '待审批',
    to_state: '已批准',
    created_at: '2026-03-16T10:00:00Z',
  },
  {
    activity_id: 'ACT-2026-0104',
    case_id: 'CASE-2026-0002',
    type: 'solution_rejected',
    actor: {
      user_id: 'U002',
      name: '李芳',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lifang',
    },
    description: '驳回了方案: 从日本进口钢材',
    related_id: 'SOL-2026-0006',
    related_type: 'solution',
    from_state: '待审批',
    to_state: '已驳回',
    created_at: '2026-03-16T09:00:00Z',
  },
  {
    activity_id: 'ACT-2026-0105',
    case_id: 'CASE-2026-0002',
    type: 'minute_created',
    actor: {
      user_id: 'U002',
      name: '李芳',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lifang',
    },
    description: '创建了会议纪要: 中泰钢铁环保停产应急会议',
    related_id: 'MIN-2026-0003',
    related_type: 'minute',
    created_at: '2026-03-15T16:00:00Z',
  },
]

// ---------------------------------------------------------------------------
// All Activities Combined
// ---------------------------------------------------------------------------

export const mockActivities: WarRoomActivity[] = [
  ...mockActivitiesCase1,
  ...mockActivitiesCase2,
]

// ---------------------------------------------------------------------------
// War Room Comments for CASE-2026-0001
// ---------------------------------------------------------------------------

export const mockCommentsCase1: WarRoomComment[] = [
  {
    comment_id: 'CMT-2026-0001',
    case_id: 'CASE-2026-0001',
    content: '@李芳 请尽快确认三星电子的产能情况，我们需要在明天中午前做出最终决策。',
    author: {
      user_id: 'U001',
      name: '张明',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangming',
      role: '供应链经理',
    },
    mentions: [{ user_id: 'U002', name: '李芳' }],
    created_at: '2026-03-20T09:30:00Z',
    updated_at: '2026-03-20T09:30:00Z',
  },
  {
    comment_id: 'CMT-2026-0002',
    case_id: 'CASE-2026-0001',
    parent_id: 'CMT-2026-0001',
    content: '@张明 已联系三星电子销售总监，确认可紧急调拨 5000 片芯片，预计 3 天内到货。详细报价已发邮件。',
    author: {
      user_id: 'U002',
      name: '李芳',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lifang',
      role: '采购主管',
    },
    mentions: [{ user_id: 'U001', name: '张明' }],
    created_at: '2026-03-20T10:15:00Z',
    updated_at: '2026-03-20T10:15:00Z',
  },
  {
    comment_id: 'CMT-2026-0003',
    case_id: 'CASE-2026-0001',
    content: '@刘强 库存盘点进展如何？我们需要准确数据来评估生产调整方案。',
    author: {
      user_id: 'U001',
      name: '张明',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangming',
      role: '供应链经理',
    },
    mentions: [{ user_id: 'U006', name: '刘强' }],
    created_at: '2026-03-20T08:45:00Z',
    updated_at: '2026-03-20T08:45:00Z',
  },
  {
    comment_id: 'CMT-2026-0004',
    case_id: 'CASE-2026-0001',
    parent_id: 'CMT-2026-0003',
    content: '@张明 盘点已完成，数据已更新到附件中的库存盘点表。当前可用库存约 3500 片，按当前生产计划可维持 7 天。',
    author: {
      user_id: 'U006',
      name: '刘强',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liuqiang',
      role: '生产计划',
    },
    mentions: [{ user_id: 'U001', name: '张明' }],
    created_at: '2026-03-20T09:00:00Z',
    updated_at: '2026-03-20T09:00:00Z',
  },
  {
    comment_id: 'CMT-2026-0005',
    case_id: 'CASE-2026-0001',
    content: '建议同时考虑台积电方案作为备选，以防三星交付出现意外。虽然交期较长，但可以作为保险。',
    author: {
      user_id: 'U003',
      name: '王建国',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangjianguo',
      role: '风险分析师',
    },
    created_at: '2026-03-20T11:00:00Z',
    updated_at: '2026-03-20T11:00:00Z',
  },
  {
    comment_id: 'CMT-2026-0006',
    case_id: 'CASE-2026-0001',
    parent_id: 'CMT-2026-0005',
    content: '同意王建国的建议。我已经让采购部同时跟进台积电的报价，但优先级还是三星方案。',
    author: {
      user_id: 'U001',
      name: '张明',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangming',
      role: '供应链经理',
    },
    created_at: '2026-03-20T11:30:00Z',
    updated_at: '2026-03-20T11:30:00Z',
  },
  {
    comment_id: 'CMT-2026-0007',
    case_id: 'CASE-2026-0001',
    content: '@周敏 请帮忙评估一下三星芯片的质量标准是否符合我们的要求，特别是新批次的产品。',
    author: {
      user_id: 'U001',
      name: '张明',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangming',
      role: '供应链经理',
    },
    mentions: [{ user_id: 'U007', name: '周敏' }],
    created_at: '2026-03-20T14:00:00Z',
    updated_at: '2026-03-20T14:00:00Z',
  },
]

// ---------------------------------------------------------------------------
// All Comments Combined
// ---------------------------------------------------------------------------

export const mockComments: WarRoomComment[] = [
  ...mockCommentsCase1,
]

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

export function getActivitiesByCaseId(caseId: string): WarRoomActivity[] {
  return mockActivities
    .filter(a => a.case_id === caseId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export function getCommentsByCaseId(caseId: string): WarRoomComment[] {
  return mockComments
    .filter(c => c.case_id === caseId && !c.parent_id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export function getRepliesByCommentId(commentId: string): WarRoomComment[] {
  return mockComments
    .filter(c => c.parent_id === commentId)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
}

export function getActivityTypeLabel(type: WarRoomActivityType): string {
  const labels: Record<WarRoomActivityType, string> = {
    case_created: '创建 Case',
    case_escalated: '升级 Case',
    task_created: '创建任务',
    task_status_changed: '更新任务',
    task_assigned: '分配任务',
    solution_proposed: '提交方案',
    solution_approved: '批准方案',
    solution_rejected: '驳回方案',
    minute_created: '创建纪要',
    minute_updated: '更新纪要',
    attachment_uploaded: '上传附件',
    participant_added: '添加参会人',
    participant_removed: '移除参会人',
    comment_added: '发表评论',
    decision_made: '做出决策',
  }
  return labels[type] || type
}

export function getActivityTypeColor(type: WarRoomActivityType): string {
  const colors: Record<WarRoomActivityType, string> = {
    case_created: 'bg-blue-100 text-blue-700',
    case_escalated: 'bg-red-100 text-red-700',
    task_created: 'bg-slate-100 text-slate-700',
    task_status_changed: 'bg-purple-100 text-purple-700',
    task_assigned: 'bg-indigo-100 text-indigo-700',
    solution_proposed: 'bg-cyan-100 text-cyan-700',
    solution_approved: 'bg-green-100 text-green-700',
    solution_rejected: 'bg-orange-100 text-orange-700',
    minute_created: 'bg-teal-100 text-teal-700',
    minute_updated: 'bg-teal-50 text-teal-600',
    attachment_uploaded: 'bg-gray-100 text-gray-700',
    participant_added: 'bg-pink-100 text-pink-700',
    participant_removed: 'bg-pink-50 text-pink-600',
    comment_added: 'bg-yellow-100 text-yellow-700',
    decision_made: 'bg-emerald-100 text-emerald-700',
  }
  return colors[type] || 'bg-gray-100 text-gray-700'
}

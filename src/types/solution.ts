/**
 * OptiMax Type Definitions - Solution (War Room)
 */

// ---------------------------------------------------------------------------
// Solution - 处置方案
// ---------------------------------------------------------------------------

export interface Solution {
  solution_id: string
  case_id: string
  title: string
  description: string
  /** 是否为推荐方案 */
  is_recommended: boolean
  /** 方案状态 */
  status: 'proposed' | 'approved' | 'rejected' | 'abandoned'
  /** 推荐原因或放弃原因 */
  reason?: string
  /** 成本变化: 正数表示增加，负数表示节省 */
  cost_impact: {
    amount: number
    currency: string
    percentage: number
  }
  /** 交期影响: 正数表示延迟，负数表示提前 */
  delivery_impact: {
    days: number
    description: string
  }
  /** 约束冲突列表 */
  constraint_conflicts?: ConstraintConflict[]
  /** 置信度 0-100 */
  confidence: number
  /** 方案作者 */
  author: {
    user_id: string
    name: string
    avatar?: string
  }
  created_at: string
  updated_at: string
}

export interface ConstraintConflict {
  type: 'capacity' | 'budget' | 'compliance' | 'quality' | 'contract'
  description: string
  severity: 'critical' | 'warning' | 'info'
}

// ---------------------------------------------------------------------------
// Meeting Minutes - 会议纪要
// ---------------------------------------------------------------------------

export interface MeetingMinute {
  minute_id: string
  case_id: string
  title: string
  content: string
  /** 是否为 AI 初稿 */
  is_ai_draft: boolean
  /** 版本号 */
  version: number
  /** 修订历史 */
  revision_history?: MinuteRevision[]
  author: {
    user_id: string
    name: string
    avatar?: string
  }
  created_at: string
  updated_at: string
}

export interface MinuteRevision {
  revision_id: string
  version: number
  content_before: string
  content_after: string
  revised_by: {
    user_id: string
    name: string
  }
  revised_at: string
  comment?: string
}

// ---------------------------------------------------------------------------
// Attachment - 附件
// ---------------------------------------------------------------------------

export interface Attachment {
  attachment_id: string
  case_id: string
  minute_id?: string
  file_name: string
  file_size: number
  file_type: string
  /** 文件 URL (mock) */
  url: string
  uploaded_by: {
    user_id: string
    name: string
    avatar?: string
  }
  uploaded_at: string
}

// ---------------------------------------------------------------------------
// War Room Activity - War Room 活动
// ---------------------------------------------------------------------------

export type WarRoomActivityType =
  | 'case_created'
  | 'case_escalated'
  | 'task_created'
  | 'task_status_changed'
  | 'task_assigned'
  | 'solution_proposed'
  | 'solution_approved'
  | 'solution_rejected'
  | 'minute_created'
  | 'minute_updated'
  | 'attachment_uploaded'
  | 'participant_added'
  | 'participant_removed'
  | 'comment_added'
  | 'decision_made'

export interface WarRoomActivity {
  activity_id: string
  case_id: string
  type: WarRoomActivityType
  actor: {
    user_id: string
    name: string
    avatar?: string
  }
  description: string
  /** 关联对象 ID */
  related_id?: string
  /** 关联对象类型 */
  related_type?: 'task' | 'solution' | 'minute' | 'attachment' | 'comment'
  /** 变更前后的状态 */
  from_state?: string
  to_state?: string
  created_at: string
}

// ---------------------------------------------------------------------------
// War Room Comment - War Room 评论
// ---------------------------------------------------------------------------

export interface WarRoomComment {
  comment_id: string
  case_id: string
  parent_id?: string // 回复的评论 ID
  content: string
  author: {
    user_id: string
    name: string
    avatar?: string
    role?: string
  }
  /** 被提及的用户 */
  mentions?: {
    user_id: string
    name: string
  }[]
  created_at: string
  updated_at: string
}

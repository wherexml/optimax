/**
 * OptiMax Mock Data - Meeting Minutes
 *
 * War Room 会议纪要数据
 */

import type { MeetingMinute, MinuteRevision, Attachment } from '@/types/solution'

// ---------------------------------------------------------------------------
// Minute Revisions
// ---------------------------------------------------------------------------

const revisionHistory1: MinuteRevision[] = [
  {
    revision_id: 'REV-2026-0001',
    version: 1,
    content_before: '',
    content_after: '## AI 会议纪要初稿\n\n**会议时间**: 2026-03-20 09:00\n**参会人员**: 张明、李芳、王建国、刘强\n\n**讨论内容**:\n1. 华芯半导体工厂火灾影响评估\n2. 现有库存盘点情况\n3. 替代供应商方案讨论\n\n**决议**:\n- 采纳三星电子紧急采购方案\n- 刘强负责生产计划调整\n- 李芳跟进合同审批流程',
    revised_by: {
      user_id: 'SYSTEM',
      name: 'AI 助手',
    },
    revised_at: '2026-03-20T11:00:00Z',
    comment: 'AI 根据会议录音自动生成',
  },
  {
    revision_id: 'REV-2026-0002',
    version: 2,
    content_before: '## AI 会议纪要初稿\n\n**会议时间**: 2026-03-20 09:00\n**参会人员**: 张明、李芳、王建国、刘强\n\n**讨论内容**:\n1. 华芯半导体工厂火灾影响评估\n2. 现有库存盘点情况\n3. 替代供应商方案讨论\n\n**决议**:\n- 采纳三星电子紧急采购方案\n- 刘强负责生产计划调整\n- 李芳跟进合同审批流程',
    content_after: '## 华芯半导体应急响应会议 - 修订版\n\n**会议时间**: 2026-03-20 09:00-11:00\n**参会人员**: 张明(主持)、李芳、王建国、刘强、周敏\n**会议形式**: 紧急 War Room 会议\n\n### 1. 事件背景\n华芯半导体工厂于 2026-03-18 发生火灾，导致生产线全面停产。我司受影响芯片订单金额约 2.5 亿元。\n\n### 2. 现状汇报\n**库存情况** (刘强汇报):\n- 现有库存可维持生产约 7 天\n- 安全库存已启动调拨\n- 建议优先保障核心客户订单\n\n**替代方案** (李芳汇报):\n- 方案 A: 三星电子紧急采购 (推荐)\n  - 成本增加 285 万元 (+35%)\n  - 交期延迟 3 天\n  - 质量稳定，长期合作\n- 方案 B: 台积电追加订单\n  - 成本增加 210 万元 (+25%)\n  - 交期延迟 7 天\n  - 需通过合规审核\n\n### 3. 风险评估\n**王建国**指出:\n- 三星方案综合风险最低\n- 需关注汇率波动影响\n- 建议锁定采购价格\n\n### 4. 会议决议\n| 事项 | 负责人 | 完成时间 | 状态 |\n|------|--------|----------|------|\n| 启动三星电子紧急采购 | 李芳 | 2026-03-20 18:00 | 进行中 |\n| 调整生产计划优先核心订单 | 刘强 | 2026-03-20 14:00 | 已完成 |\n| 财务影响评估报告 | 吴磊 | 2026-03-21 12:00 | 待启动 |\n| 供应商风险评级更新 | 李芳 | 2026-03-22 18:00 | 待启动 |\n\n### 5. 下一步行动\n- 每日 10:00 召开进展同步会\n- 关键节点及时升级\n- 做好客户沟通预案',
    revised_by: {
      user_id: 'U001',
      name: '张明',
    },
    revised_at: '2026-03-20T14:30:00Z',
    comment: '补充详细讨论内容和决议表格',
  },
]

// ---------------------------------------------------------------------------
// Meeting Minutes for CASE-2026-0001
// ---------------------------------------------------------------------------

export const mockMinutesCase1: MeetingMinute[] = [
  {
    minute_id: 'MIN-2026-0001',
    case_id: 'CASE-2026-0001',
    title: '华芯半导体应急响应会议纪要',
    content: '## 华芯半导体应急响应会议 - 修订版\n\n**会议时间**: 2026-03-20 09:00-11:00\n**参会人员**: 张明(主持)、李芳、王建国、刘强、周敏\n**会议形式**: 紧急 War Room 会议\n\n### 1. 事件背景\n华芯半导体工厂于 2026-03-18 发生火灾，导致生产线全面停产。我司受影响芯片订单金额约 2.5 亿元。\n\n### 2. 现状汇报\n**库存情况** (刘强汇报):\n- 现有库存可维持生产约 7 天\n- 安全库存已启动调拨\n- 建议优先保障核心客户订单\n\n**替代方案** (李芳汇报):\n- 方案 A: 三星电子紧急采购 (推荐)\n  - 成本增加 285 万元 (+35%)\n  - 交期延迟 3 天\n  - 质量稳定，长期合作\n- 方案 B: 台积电追加订单\n  - 成本增加 210 万元 (+25%)\n  - 交期延迟 7 天\n  - 需通过合规审核\n\n### 3. 风险评估\n**王建国**指出:\n- 三星方案综合风险最低\n- 需关注汇率波动影响\n- 建议锁定采购价格\n\n### 4. 会议决议\n| 事项 | 负责人 | 完成时间 | 状态 |\n|------|--------|----------|------|\n| 启动三星电子紧急采购 | 李芳 | 2026-03-20 18:00 | 进行中 |\n| 调整生产计划优先核心订单 | 刘强 | 2026-03-20 14:00 | 已完成 |\n| 财务影响评估报告 | 吴磊 | 2026-03-21 12:00 | 待启动 |\n| 供应商风险评级更新 | 李芳 | 2026-03-22 18:00 | 待启动 |\n\n### 5. 下一步行动\n- 每日 10:00 召开进展同步会\n- 关键节点及时升级\n- 做好客户沟通预案',
    is_ai_draft: false,
    version: 2,
    revision_history: revisionHistory1,
    author: {
      user_id: 'U001',
      name: '张明',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangming',
    },
    created_at: '2026-03-20T11:00:00Z',
    updated_at: '2026-03-20T14:30:00Z',
  },
  {
    minute_id: 'MIN-2026-0002',
    case_id: 'CASE-2026-0001',
    title: '每日进展同步会 - Day 2',
    content: '## 每日进展同步会\n\n**会议时间**: 2026-03-21 10:00\n**参会人员**: 张明、李芳、刘强\n\n### 进展汇报\n\n**李芳**: 三星电子采购合同已签署，首批货物预计 2026-03-24 到货。\n\n**刘强**: 生产计划已调整，核心订单保障方案已执行，预计影响降至最低。\n\n### 新问题\n- 台积电提出可追加 20% 产能，是否需要调整采购策略？\n\n### 决议\n- 维持三星方案，不追加台积电订单\n- 明日继续同步进展',
    is_ai_draft: true,
    version: 1,
    author: {
      user_id: 'SYSTEM',
      name: 'AI 助手',
    },
    created_at: '2026-03-21T10:30:00Z',
    updated_at: '2026-03-21T10:30:00Z',
  },
]

// ---------------------------------------------------------------------------
// Meeting Minutes for CASE-2026-0002
// ---------------------------------------------------------------------------

export const mockMinutesCase2: MeetingMinute[] = [
  {
    minute_id: 'MIN-2026-0003',
    case_id: 'CASE-2026-0002',
    title: '中泰钢铁环保停产应急会议',
    content: '## 中泰钢铁环保停产应急会议\n\n**会议时间**: 2026-03-15 14:00\n**参会人员**: 李芳(主持)、张明、王建国、刘强、陈晓红\n\n### 会议内容\n1. 确认中泰钢铁停产时间和影响范围\n2. 库存盘点结果汇报\n3. 替代供应商方案讨论\n\n### 决议\n- 采纳宝武钢铁紧急采购方案\n- 启动库存调拨\n- 通知客户可能的交付调整',
    is_ai_draft: false,
    version: 1,
    author: {
      user_id: 'U002',
      name: '李芳',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lifang',
    },
    created_at: '2026-03-15T16:00:00Z',
    updated_at: '2026-03-15T16:00:00Z',
  },
]

// ---------------------------------------------------------------------------
// All Minutes Combined
// ---------------------------------------------------------------------------

export const mockMinutes: MeetingMinute[] = [
  ...mockMinutesCase1,
  ...mockMinutesCase2,
]

// ---------------------------------------------------------------------------
// Attachments
// ---------------------------------------------------------------------------

export const mockAttachments: Attachment[] = [
  {
    attachment_id: 'ATT-2026-0001',
    case_id: 'CASE-2026-0001',
    minute_id: 'MIN-2026-0001',
    file_name: '华芯半导体火灾影响评估报告.pdf',
    file_size: 2456789,
    file_type: 'application/pdf',
    url: '/mock/attachments/impact-report.pdf',
    uploaded_by: {
      user_id: 'U003',
      name: '王建国',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangjianguo',
    },
    uploaded_at: '2026-03-20T12:00:00Z',
  },
  {
    attachment_id: 'ATT-2026-0002',
    case_id: 'CASE-2026-0001',
    minute_id: 'MIN-2026-0001',
    file_name: '三星电子采购合同草案.docx',
    file_size: 567890,
    file_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    url: '/mock/attachments/samsung-contract.docx',
    uploaded_by: {
      user_id: 'U002',
      name: '李芳',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lifang',
    },
    uploaded_at: '2026-03-20T15:00:00Z',
  },
  {
    attachment_id: 'ATT-2026-0003',
    case_id: 'CASE-2026-0001',
    minute_id: 'MIN-2026-0001',
    file_name: '库存盘点表.xlsx',
    file_size: 123456,
    file_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    url: '/mock/attachments/inventory.xlsx',
    uploaded_by: {
      user_id: 'U006',
      name: '刘强',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liuqiang',
    },
    uploaded_at: '2026-03-20T09:30:00Z',
  },
  {
    attachment_id: 'ATT-2026-0004',
    case_id: 'CASE-2026-0002',
    minute_id: 'MIN-2026-0003',
    file_name: '宝武钢铁报价单.pdf',
    file_size: 890123,
    file_type: 'application/pdf',
    url: '/mock/attachments/baowu-quotation.pdf',
    uploaded_by: {
      user_id: 'U001',
      name: '张明',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangming',
    },
    uploaded_at: '2026-03-15T15:00:00Z',
  },
]

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

export function getMinutesByCaseId(caseId: string): MeetingMinute[] {
  return mockMinutes.filter(m => m.case_id === caseId).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

export function getAttachmentsByCaseId(caseId: string): Attachment[] {
  return mockAttachments.filter(a => a.case_id === caseId).sort(
    (a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime()
  )
}

export function getAttachmentsByMinuteId(minuteId: string): Attachment[] {
  return mockAttachments.filter(a => a.minute_id === minuteId).sort(
    (a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime()
  )
}

export function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }
  if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }
  return `${bytes} B`
}

export function getFileIcon(fileType: string): string {
  if (fileType.includes('pdf')) return 'pdf'
  if (fileType.includes('word') || fileType.includes('document')) return 'word'
  if (fileType.includes('excel') || fileType.includes('sheet')) return 'excel'
  if (fileType.includes('powerpoint') || fileType.includes('presentation')) return 'ppt'
  if (fileType.includes('image')) return 'image'
  return 'file'
}

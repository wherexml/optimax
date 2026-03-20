/**
 * OptiMax AI Assistant Mock Data
 * FE-120~123: Global Intelligent Assistant
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AssistantSession {
  id: string
  title: string
  created_at: string
  updated_at: string
  messages: AssistantMessage[]
}

export interface AssistantMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  tools_used?: string[]
  result_data?: SearchResult
  explanation?: ExplanationData
}

export interface SearchResult {
  type: 'events' | 'suppliers' | 'stats' | 'mixed'
  events?: EventResult[]
  suppliers?: SupplierResult[]
  stats?: StatsData
  summary: string
  confidence: number
  data_timestamp: string
}

export interface EventResult {
  event_id: string
  title: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  status: string
  occurred_at: string
  owner_name: string
  impact_count: number
}

export interface SupplierResult {
  supplier_id: string
  name: string
  risk_score: number
  region: string
  status: string
  current_events: number
}

export interface StatsData {
  total_events: number
  critical_count: number
  high_count: number
  medium_count: number
  low_count: number
  trend: 'up' | 'down' | 'stable'
  period: string
}

export interface ExplanationData {
  question: string
  conclusion: string
  reasoning: string[]
  data_sources: string[]
  confidence: number
  related_events?: string[]
}

export interface QuickAction {
  id: string
  label: string
  icon: string
  description: string
  requires_confirmation: boolean
}

// ---------------------------------------------------------------------------
// Preset Questions
// ---------------------------------------------------------------------------

export const PRESET_QUESTIONS = [
  {
    id: '1',
    label: '最近一周高风险事件',
    query: '请帮我查看最近一周的高风险事件',
    category: 'event',
  },
  {
    id: '2',
    label: '某供应商为什么被判高风险',
    query: '为什么供应商 "深圳精密制造有限公司" 被判为高风险？',
    category: 'supplier',
  },
  {
    id: '3',
    label: '本月风险趋势分析',
    query: '分析本月的风险趋势',
    category: 'stats',
  },
  {
    id: '4',
    label: '超期未处理事件',
    query: '查找所有超期未处理的风险事件',
    category: 'event',
  },
  {
    id: '5',
    label: '华东区域供应商风险',
    query: '华东区域有哪些高风险供应商？',
    category: 'supplier',
  },
]

// ---------------------------------------------------------------------------
// Quick Actions
// ---------------------------------------------------------------------------

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'generate_report',
    label: '生成简报',
    icon: 'FileText',
    description: '基于当前会话内容生成风险简报',
    requires_confirmation: true,
  },
  {
    id: 'create_case',
    label: '建 Case',
    icon: 'Briefcase',
    description: '为当前事件创建协同处置 Case',
    requires_confirmation: true,
  },
  {
    id: 'create_task',
    label: '创建任务',
    icon: 'CheckSquare',
    description: '创建跟进任务',
    requires_confirmation: false,
  },
  {
    id: 'notify_owner',
    label: '通知责任人',
    icon: 'Bell',
    description: '通知相关责任人关注风险',
    requires_confirmation: false,
  },
]

// ---------------------------------------------------------------------------
// Mock Search Results
// ---------------------------------------------------------------------------

export const MOCK_SEARCH_RESULTS: Record<string, SearchResult> = {
  '最近一周高风险事件': {
    type: 'events',
    events: [
      {
        event_id: 'EVT-2024-0315-001',
        title: '供应商深圳精密发生劳资纠纷',
        severity: 'critical',
        status: 'investigating',
        occurred_at: '2024-03-15T08:30:00Z',
        owner_name: '张小明',
        impact_count: 12,
      },
      {
        event_id: 'EVT-2024-0314-002',
        title: '台风预警影响广东沿海供应商',
        severity: 'high',
        status: 'in_progress',
        occurred_at: '2024-03-14T14:20:00Z',
        owner_name: '李小红',
        impact_count: 8,
      },
      {
        event_id: 'EVT-2024-0313-003',
        title: '原材料价格波动超过阈值',
        severity: 'high',
        status: 'new',
        occurred_at: '2024-03-13T09:15:00Z',
        owner_name: '王大力',
        impact_count: 5,
      },
    ],
    summary: '最近一周发现 3 起高风险事件，其中 1 起严重级别，2 起高危级别。主要涉及劳资纠纷、自然灾害预警和原材料价格波动。',
    confidence: 0.95,
    data_timestamp: '2024-03-20T10:00:00Z',
  },
  '某供应商为什么被判高风险': {
    type: 'suppliers',
    suppliers: [
      {
        supplier_id: 'SUP-001',
        name: '深圳精密制造有限公司',
        risk_score: 87,
        region: '华南区',
        status: 'active',
        current_events: 3,
      },
    ],
    summary: '该供应商因近期发生劳资纠纷、交付延迟率上升、以及关键物料依赖度高等因素被判定为高风险。',
    confidence: 0.92,
    data_timestamp: '2024-03-20T10:00:00Z',
  },
  '本月风险趋势分析': {
    type: 'stats',
    stats: {
      total_events: 156,
      critical_count: 8,
      high_count: 32,
      medium_count: 67,
      low_count: 49,
      trend: 'up',
      period: '2024-03-01至2024-03-20',
    },
    summary: '本月风险事件总量较上月同期上升 15%，其中高危及以上事件占比 25.6%，主要集中在供应商质量和自然灾害两类。',
    confidence: 0.88,
    data_timestamp: '2024-03-20T10:00:00Z',
  },
  '超期未处理事件': {
    type: 'events',
    events: [
      {
        event_id: 'EVT-2024-0301-010',
        title: '江苏某供应商环保违规',
        severity: 'high',
        status: 'investigating',
        occurred_at: '2024-03-01T10:00:00Z',
        owner_name: '赵小强',
        impact_count: 6,
      },
      {
        event_id: 'EVT-2024-0305-008',
        title: '关键物料供应中断风险',
        severity: 'critical',
        status: 'in_progress',
        occurred_at: '2024-03-05T16:30:00Z',
        owner_name: '孙小美',
        impact_count: 15,
      },
    ],
    summary: '发现 2 起超期未处理事件，均已超 SLA 时限，建议立即升级处理。',
    confidence: 0.98,
    data_timestamp: '2024-03-20T10:00:00Z',
  },
  '华东区域供应商风险': {
    type: 'mixed',
    suppliers: [
      {
        supplier_id: 'SUP-002',
        name: '上海精工科技有限公司',
        risk_score: 72,
        region: '华东区',
        status: 'active',
        current_events: 2,
      },
      {
        supplier_id: 'SUP-003',
        name: '浙江华通电子厂',
        risk_score: 65,
        region: '华东区',
        status: 'active',
        current_events: 1,
      },
    ],
    summary: '华东区域目前有 2 家供应商处于中高风险状态，主要受原材料供应紧张和物流成本上升影响。',
    confidence: 0.85,
    data_timestamp: '2024-03-20T10:00:00Z',
  },
}

// ---------------------------------------------------------------------------
// Mock Explanations
// ---------------------------------------------------------------------------

export const MOCK_EXPLANATIONS: ExplanationData[] = [
  {
    question: '为什么供应商 "深圳精密制造有限公司" 被判为高风险？',
    conclusion: '该供应商综合风险评分 87 分，属于高风险等级。',
    reasoning: [
      '近期发生劳资纠纷（3月15日），导致生产停滞风险',
      '过去30天交付延迟率上升至 23%，超出阈值（15%）',
      '关键物料依赖度 85%，替代方案有限',
      '财务指标显示现金流紧张，应付账款周期延长至 90 天',
    ],
    data_sources: [
      '供应商档案数据（2024-03-20更新）',
      '风险事件库（EVT-2024-0315-001）',
      '交付记录（最近30天）',
      '财务系统接口',
    ],
    confidence: 0.92,
    related_events: ['EVT-2024-0315-001', 'EVT-2024-0310-015'],
  },
  {
    question: '本月风险事件为什么增加？',
    conclusion: '本月风险事件较上月增加 15%，主要受外部环境影响。',
    reasoning: [
      '3月份进入春季，自然灾害（台风、洪水）预警增多',
      '春节后供应商复工率不稳定，导致交付风险上升',
      '原材料市场价格波动幅度加大，触发更多价格预警',
      '新版环保政策实施，部分供应商面临合规调整',
    ],
    data_sources: [
      '风险事件趋势分析',
      '气象预警数据',
      '市场价格指数',
      '政策库',
    ],
    confidence: 0.88,
  },
]

// ---------------------------------------------------------------------------
// Mock Chat History
// ---------------------------------------------------------------------------

export const MOCK_CHAT_HISTORY: AssistantSession[] = [
  {
    id: 'session-001',
    title: '最近一周高风险事件查询',
    created_at: '2024-03-20T09:30:00Z',
    updated_at: '2024-03-20T09:35:00Z',
    messages: [
      {
        id: 'msg-001',
        role: 'user',
        content: '请帮我查看最近一周的高风险事件',
        timestamp: '2024-03-20T09:30:00Z',
      },
      {
        id: 'msg-002',
        role: 'assistant',
        content: '已为您查询到最近一周的高风险事件。发现 3 起高风险事件，其中 1 起严重级别。',
        timestamp: '2024-03-20T09:31:00Z',
        tools_used: ['search_events', 'filter_by_severity'],
        result_data: MOCK_SEARCH_RESULTS['最近一周高风险事件'],
      },
    ],
  },
  {
    id: 'session-002',
    title: '深圳精密供应商风险分析',
    created_at: '2024-03-19T14:00:00Z',
    updated_at: '2024-03-19T14:15:00Z',
    messages: [
      {
        id: 'msg-003',
        role: 'user',
        content: '为什么供应商深圳精密制造有限公司被判为高风险？',
        timestamp: '2024-03-19T14:00:00Z',
      },
      {
        id: 'msg-004',
        role: 'assistant',
        content: '根据分析，该供应商因近期发生劳资纠纷、交付延迟率上升、以及关键物料依赖度高等因素被判定为高风险。',
        timestamp: '2024-03-19T14:01:00Z',
        tools_used: ['query_supplier', 'analyze_risk_factors'],
        explanation: MOCK_EXPLANATIONS[0],
      },
    ],
  },
  {
    id: 'session-003',
    title: '本月风险趋势分析',
    created_at: '2024-03-18T10:00:00Z',
    updated_at: '2024-03-18T10:10:00Z',
    messages: [
      {
        id: 'msg-005',
        role: 'user',
        content: '分析本月的风险趋势',
        timestamp: '2024-03-18T10:00:00Z',
      },
      {
        id: 'msg-006',
        role: 'assistant',
        content: '本月风险事件总量较上月同期上升 15%，其中高危及以上事件占比 25.6%。',
        timestamp: '2024-03-18T10:02:00Z',
        tools_used: ['analyze_trends', 'compare_periods'],
        result_data: MOCK_SEARCH_RESULTS['本月风险趋势分析'],
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

export function findMockResult(query: string): SearchResult | null {
  // Simple fuzzy matching
  for (const [key, value] of Object.entries(MOCK_SEARCH_RESULTS)) {
    if (query.includes(key) || key.includes(query)) {
      return value
    }
  }
  // Return default if no match
  return {
    type: 'mixed',
    summary: `已收到您的问题："${query}"。这是一个模拟响应，实际场景中将调用 AI 服务进行分析。`,
    confidence: 0.75,
    data_timestamp: new Date().toISOString(),
  }
}

export function findExplanation(query: string): ExplanationData | null {
  for (const exp of MOCK_EXPLANATIONS) {
    if (query.includes(exp.question) || exp.question.includes(query)) {
      return exp
    }
  }
  return null
}

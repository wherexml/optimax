// Version mock data for Rule Center
// Severity type available for future version severity tracking

// ---------------------------------------------------------------------------
// Version Types
// ---------------------------------------------------------------------------

export interface RuleVersion {
  id: string
  ruleId: string
  version: string
  status: 'draft' | 'published' | 'rolled_back' | 'deprecated'
  publishedAt: string | null
  publishedBy: string | null
  changeDescription: string
  changeType: 'major' | 'minor' | 'patch'
  isGrayRelease: boolean
  grayReleaseScope: string[] // organization IDs for gray release
  effectiveAt: string | null
  conditionCount: number
  actionCount: number
}

export interface VersionDiff {
  field: string
  oldValue: string | number | boolean
  newValue: string | number | boolean
  changeType: 'added' | 'removed' | 'modified'
}

export interface GrayReleaseConfig {
  enabled: boolean
  scope: string[]
  percentage: number
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

export const mockRuleVersions: Record<string, RuleVersion[]> = {
  'rule-001': [
    {
      id: 'ver-001-3',
      ruleId: 'rule-001',
      version: 'v2.1.0',
      status: 'published',
      publishedAt: '2026-03-15T10:00:00Z',
      publishedBy: '张三',
      changeDescription: '新增供应商信用评级条件，优化触发阈值',
      changeType: 'minor',
      isGrayRelease: false,
      grayReleaseScope: [],
      effectiveAt: '2026-03-15T10:00:00Z',
      conditionCount: 4,
      actionCount: 3,
    },
    {
      id: 'ver-001-2',
      ruleId: 'rule-001',
      version: 'v2.0.0',
      status: 'rolled_back',
      publishedAt: '2026-02-20T14:30:00Z',
      publishedBy: '李四',
      changeDescription: '重构条件逻辑，支持多层级嵌套',
      changeType: 'major',
      isGrayRelease: true,
      grayReleaseScope: ['org-001', 'org-002'],
      effectiveAt: '2026-02-20T14:30:00Z',
      conditionCount: 3,
      actionCount: 2,
    },
    {
      id: 'ver-001-1',
      ruleId: 'rule-001',
      version: 'v1.2.3',
      status: 'deprecated',
      publishedAt: '2026-01-10T09:00:00Z',
      publishedBy: '张三',
      changeDescription: '修复阈值计算bug，调整通知模板',
      changeType: 'patch',
      isGrayRelease: false,
      grayReleaseScope: [],
      effectiveAt: '2026-01-10T09:00:00Z',
      conditionCount: 3,
      actionCount: 2,
    },
    {
      id: 'ver-001-0',
      ruleId: 'rule-001',
      version: 'v1.0.0',
      status: 'deprecated',
      publishedAt: '2025-12-01T08:00:00Z',
      publishedBy: '王五',
      changeDescription: '初始版本上线',
      changeType: 'major',
      isGrayRelease: false,
      grayReleaseScope: [],
      effectiveAt: '2025-12-01T08:00:00Z',
      conditionCount: 2,
      actionCount: 1,
    },
  ],
  'rule-002': [
    {
      id: 'ver-002-2',
      ruleId: 'rule-002',
      version: 'v1.5.0',
      status: 'published',
      publishedAt: '2026-03-10T11:00:00Z',
      publishedBy: '赵六',
      changeDescription: '新增财务风险评估条件',
      changeType: 'minor',
      isGrayRelease: true,
      grayReleaseScope: ['org-001'],
      effectiveAt: '2026-03-17T00:00:00Z',
      conditionCount: 5,
      actionCount: 4,
    },
    {
      id: 'ver-002-1',
      ruleId: 'rule-002',
      version: 'v1.4.2',
      status: 'deprecated',
      publishedAt: '2026-02-01T10:00:00Z',
      publishedBy: '赵六',
      changeDescription: '优化审批流配置',
      changeType: 'patch',
      isGrayRelease: false,
      grayReleaseScope: [],
      effectiveAt: '2026-02-01T10:00:00Z',
      conditionCount: 4,
      actionCount: 3,
    },
  ],
  'rule-003': [
    {
      id: 'ver-003-1',
      ruleId: 'rule-003',
      version: 'v3.0.0',
      status: 'draft',
      publishedAt: null,
      publishedBy: null,
      changeDescription: '全面升级至v3架构，支持实时计算',
      changeType: 'major',
      isGrayRelease: false,
      grayReleaseScope: [],
      effectiveAt: null,
      conditionCount: 6,
      actionCount: 5,
    },
    {
      id: 'ver-003-0',
      ruleId: 'rule-003',
      version: 'v2.8.1',
      status: 'published',
      publishedAt: '2026-03-01T09:00:00Z',
      publishedBy: '张三',
      changeDescription: '性能优化，降低延迟',
      changeType: 'patch',
      isGrayRelease: false,
      grayReleaseScope: [],
      effectiveAt: '2026-03-01T09:00:00Z',
      conditionCount: 5,
      actionCount: 4,
    },
  ],
}

// ---------------------------------------------------------------------------
// Mock Diff Data
// ---------------------------------------------------------------------------

export const mockVersionDiffs: Record<string, VersionDiff[]> = {
  'ver-001-3_ver-001-2': [
    { field: '触发条件.供应商信用评级', oldValue: '无', newValue: '小于C级', changeType: 'added' },
    { field: '阈值.风险评分', oldValue: '70', newValue: '65', changeType: 'modified' },
    { field: '动作.发送消息', oldValue: '2条', newValue: '3条', changeType: 'modified' },
  ],
  'ver-001-2_ver-001-1': [
    { field: '条件逻辑', oldValue: '单层AND', newValue: '多层嵌套', changeType: 'modified' },
    { field: '条件组.嵌套层级', oldValue: '1', newValue: '3', changeType: 'modified' },
  ],
  'ver-001-1_ver-001-0': [
    { field: '阈值计算', oldValue: '简单累加', newValue: '加权平均', changeType: 'modified' },
    { field: '通知模板', oldValue: '模板v1', newValue: '模板v2', changeType: 'modified' },
  ],
  'ver-002-2_ver-002-1': [
    { field: '触发条件.财务风险', oldValue: '无', newValue: '资产负债率>70%', changeType: 'added' },
    { field: '审批流', oldValue: '一级审批', newValue: '二级审批', changeType: 'modified' },
  ],
}

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

export function getVersionsForRule(ruleId: string): RuleVersion[] {
  return mockRuleVersions[ruleId] ?? []
}

export function getVersionDiff(versionId1: string, versionId2: string): VersionDiff[] {
  const key = `${versionId1}_${versionId2}`
  const reverseKey = `${versionId2}_${versionId1}`
  return mockVersionDiffs[key] ?? mockVersionDiffs[reverseKey] ?? []
}

export function getStatusBadgeVariant(status: RuleVersion['status']): {
  label: string
  className: string
} {
  switch (status) {
    case 'published':
      return { label: '已发布', className: 'bg-green-50 text-green-700 border-green-200' }
    case 'draft':
      return { label: '草稿', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' }
    case 'rolled_back':
      return { label: '已回滚', className: 'bg-orange-50 text-orange-700 border-orange-200' }
    case 'deprecated':
      return { label: '已废弃', className: 'bg-gray-50 text-gray-500 border-gray-200' }
    default:
      return { label: '未知', className: 'bg-gray-50 text-gray-500 border-gray-200' }
  }
}

export function getChangeTypeLabel(type: RuleVersion['changeType']): string {
  switch (type) {
    case 'major':
      return '重大变更'
    case 'minor':
      return '功能变更'
    case 'patch':
      return '补丁修复'
    default:
      return '未知'
  }
}

export function getChangeTypeColor(type: RuleVersion['changeType']): string {
  switch (type) {
    case 'major':
      return 'text-red-600 bg-red-50 border-red-200'
    case 'minor':
      return 'text-blue-600 bg-blue-50 border-blue-200'
    case 'patch':
      return 'text-green-600 bg-green-50 border-green-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

export const grayReleaseScopes = [
  { id: 'org-001', name: '华东事业部' },
  { id: 'org-002', name: '华南事业部' },
  { id: 'org-003', name: '华北事业部' },
  { id: 'org-004', name: '西南事业部' },
  { id: 'org-005', name: '海外事业部' },
]

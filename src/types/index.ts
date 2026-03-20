/**
 * OptiMax Type Definitions - Barrel Export
 *
 * All types are re-exported from this index for convenient imports:
 *   import type { RiskEvent, Severity, Supplier } from '@/types'
 */

// Enums & union types
export type {
  Severity,
  RiskType,
  EventStatus,
  CaseStatus,
  TaskStatus,
  TaskType,
  RuleStatus,
  ReportType,
  ReportFormat,
  DataSourceType,
  DataSourceStatus,
  NotificationType,
  NotificationPriority,
  SupplierStatus,
  SupplierSensitivity,
  SupplierTier,
  UserRole,
  UserStatus,
  PlanType,
  AuditAction,
  AuditEntityType,
  SubscriptionFrequency,
  SubscriptionChannel,
  ActivityType,
  ImpactObjectType,
  Trend,
} from './enums'

// Event
export type {
  RiskEvent,
  RiskEventListItem,
  RiskEventCreatePayload,
  RiskEventUpdatePayload,
  ImpactObject,
  EventSource,
  EventActivity,
} from './event'

// Supplier
export type {
  Supplier,
  SupplierListItem,
  SupplierCreatePayload,
  SupplierUpdatePayload,
  SupplierRiskFactor,
  AlternativeSupplier,
} from './supplier'

// Case & Task
export type {
  Case,
  CaseListItem,
  CaseCreatePayload,
  CaseUpdatePayload,
  CaseTask,
  CaseTaskCreatePayload,
  CaseTaskUpdatePayload,
  Participant,
} from './case'

// Rule
export type {
  Rule,
  RuleListItem,
  RuleCreatePayload,
  RuleUpdatePayload,
  RuleCondition,
  RuleConditionGroup,
  RuleAction,
} from './rule'

// Report
export type {
  Report,
  ReportListItem,
  ReportCreatePayload,
  ReportSection,
  ReportSchedule,
  ReportKpi,
} from './report'

// User
export type {
  User,
  UserListItem,
  UserCreatePayload,
  UserUpdatePayload,
  UserPreferences,
  AuthTokens,
  LoginPayload,
  RegisterPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  ChangePasswordPayload,
} from './user'

// Organization
export type {
  Organization,
  OrganizationStats,
  OrganizationCreatePayload,
  OrganizationUpdatePayload,
} from './organization'

// Audit
export type {
  AuditEntry,
  AuditEntryListItem,
  AuditChange,
  AuditQueryParams,
} from './audit'

// Recommendation
export type {
  Recommendation,
  RecommendationStep,
  AIAnalysisResult,
} from './recommendation'

// Subscription
export type {
  Subscription,
  SubscriptionListItem,
  SubscriptionCreatePayload,
  SubscriptionUpdatePayload,
  SubscriptionFilter,
} from './subscription'

// Notification
export type {
  Notification,
  NotificationListItem,
  NotificationCount,
  NotificationQueryParams,
} from './notification'

// ---------------------------------------------------------------------------
// Shared utility types
// ---------------------------------------------------------------------------

/** Standard paginated API response */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

/** Standard API error response */
export interface ApiError {
  code: string
  message: string
  details?: Record<string, string[]>
}

/** Generic API response wrapper */
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

/** Sort configuration for table columns */
export interface SortConfig {
  field: string
  direction: 'asc' | 'desc'
}

/** Date range filter */
export interface DateRange {
  from: string // ISO 8601
  to: string // ISO 8601
}

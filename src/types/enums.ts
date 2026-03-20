/**
 * OptiMax Type Definitions - Enums & Union Types
 */

// ---------------------------------------------------------------------------
// Risk & Severity
// ---------------------------------------------------------------------------

/** Risk severity levels, ordered from most to least severe */
export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info'

/** Broad risk category classification */
export type RiskType =
  | 'supply_disruption'
  | 'quality_issue'
  | 'compliance_violation'
  | 'financial_risk'
  | 'geopolitical'
  | 'natural_disaster'
  | 'cyber_security'
  | 'regulatory_change'

// ---------------------------------------------------------------------------
// Event
// ---------------------------------------------------------------------------

/** Lifecycle status of a risk event */
export type EventStatus =
  | 'new'
  | 'merged'
  | 'pending_mapping'
  | 'pending_analysis'
  | 'alerted'
  | 'in_progress'
  | 'resolved'
  | 'archived'
  | 'rejected'

// ---------------------------------------------------------------------------
// Case
// ---------------------------------------------------------------------------

/** Lifecycle status of a case */
export type CaseStatus =
  | 'draft'
  | 'open'
  | 'analyzing'
  | 'deciding'
  | 'executing'
  | 'reviewing'
  | 'closed'

// ---------------------------------------------------------------------------
// Task
// ---------------------------------------------------------------------------

/** Lifecycle status of a task */
export type TaskStatus =
  | 'pending'
  | 'in_progress'
  | 'pending_approval'
  | 'completed'
  | 'overdue'

/** Task category */
export type TaskType =
  | 'investigation'
  | 'mitigation'
  | 'notification'
  | 'approval'
  | 'execution'

// ---------------------------------------------------------------------------
// Rule
// ---------------------------------------------------------------------------

/** Rule activation status */
export type RuleStatus = 'enabled' | 'disabled' | 'draft'

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

/** Report generation types */
export type ReportType = 'daily' | 'weekly' | 'monthly' | 'special' | 'retrospective'

/** Report output format */
export type ReportFormat = 'pdf' | 'excel' | 'html'

// ---------------------------------------------------------------------------
// Data Source
// ---------------------------------------------------------------------------

/** Data source origin */
export type DataSourceType = 'external' | 'internal'

/** Data source status */
export type DataSourceStatus = 'active' | 'inactive' | 'error' | 'syncing'

// ---------------------------------------------------------------------------
// Notification
// ---------------------------------------------------------------------------

/** Notification category */
export type NotificationType = 'alert' | 'approval' | 'system' | 'report'

/** Notification urgency */
export type NotificationPriority = 'urgent' | 'high' | 'normal' | 'low'

// ---------------------------------------------------------------------------
// Supplier
// ---------------------------------------------------------------------------

/** Supplier operational status */
export type SupplierStatus = 'active' | 'inactive' | 'suspended' | 'pending'

/** Supplier sensitivity classification */
export type SupplierSensitivity = 'high' | 'medium' | 'low'

/** Supplier tier classification */
export type SupplierTier = 1 | 2 | 3

// ---------------------------------------------------------------------------
// User & Organization
// ---------------------------------------------------------------------------

/** User role within the organization */
export type UserRole = 'admin' | 'analyst' | 'manager' | 'viewer' | 'auditor'

/** User account status */
export type UserStatus = 'active' | 'inactive' | 'locked' | 'pending'

/** Organization subscription plan */
export type PlanType = 'free' | 'professional' | 'enterprise'

// ---------------------------------------------------------------------------
// Audit
// ---------------------------------------------------------------------------

/** Audit log action types */
export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'login'
  | 'logout'
  | 'export'
  | 'approve'
  | 'reject'
  | 'assign'
  | 'escalate'

/** Audit target entity types */
export type AuditEntityType =
  | 'event'
  | 'case'
  | 'task'
  | 'rule'
  | 'report'
  | 'supplier'
  | 'user'
  | 'subscription'
  | 'notification'

// ---------------------------------------------------------------------------
// Subscription
// ---------------------------------------------------------------------------

/** Subscription monitoring frequency */
export type SubscriptionFrequency = 'realtime' | 'hourly' | 'daily' | 'weekly'

/** Subscription channel */
export type SubscriptionChannel = 'email' | 'sms' | 'webhook' | 'in_app'

// ---------------------------------------------------------------------------
// Activity
// ---------------------------------------------------------------------------

/** Activity log entry types */
export type ActivityType =
  | 'status_change'
  | 'assignment'
  | 'comment'
  | 'severity_change'
  | 'mapping_change'
  | 'approval'

// ---------------------------------------------------------------------------
// Impact Object
// ---------------------------------------------------------------------------

/** Types of objects that can be impacted by a risk event */
export type ImpactObjectType =
  | 'supplier'
  | 'site'
  | 'material'
  | 'order'
  | 'region'
  | 'customer'

// ---------------------------------------------------------------------------
// Trend
// ---------------------------------------------------------------------------

/** Directional trend indicator */
export type Trend = 'up' | 'down' | 'stable'

/**
 * OptiMax Type Definitions - Notification
 */

import type { NotificationType, NotificationPriority } from './enums'

// ---------------------------------------------------------------------------
// Core Notification
// ---------------------------------------------------------------------------

export interface Notification {
  notification_id: string
  type: NotificationType
  priority: NotificationPriority
  title: string
  message: string
  recipient_id: string
  read: boolean
  read_at?: string // ISO 8601
  action_url?: string // deep link to relevant page
  action_label?: string
  entity_type?: string
  entity_id?: string
  sender_id?: string
  sender_name?: string
  expires_at?: string // ISO 8601
  organization_id: string
  created_at: string // ISO 8601
}

// ---------------------------------------------------------------------------
// Notification Badge / Count
// ---------------------------------------------------------------------------

export interface NotificationCount {
  total: number
  unread: number
  by_type: Record<NotificationType, number>
}

// ---------------------------------------------------------------------------
// List helpers
// ---------------------------------------------------------------------------

export interface NotificationListItem
  extends Pick<
    Notification,
    | 'notification_id'
    | 'type'
    | 'priority'
    | 'title'
    | 'message'
    | 'read'
    | 'action_url'
    | 'sender_name'
    | 'created_at'
  > {}

/** Query parameters for notification listing */
export interface NotificationQueryParams {
  type?: NotificationType
  read?: boolean
  priority?: NotificationPriority
  page?: number
  page_size?: number
}

/**
 * OptiMax Type Definitions - User
 */

import type { UserRole, UserStatus } from './enums'

// ---------------------------------------------------------------------------
// Core User
// ---------------------------------------------------------------------------

export interface User {
  user_id: string
  email: string
  name: string
  avatar?: string
  role: UserRole
  status: UserStatus
  department?: string
  title?: string
  phone?: string
  timezone: string
  locale: string
  organization_id: string
  last_login_at?: string // ISO 8601
  created_at: string // ISO 8601
  updated_at: string // ISO 8601
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export interface AuthTokens {
  access_token: string
  refresh_token: string
  expires_in: number // seconds
  token_type: 'Bearer'
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
  name: string
  organization_name?: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  token: string
  password: string
}

export interface ChangePasswordPayload {
  current_password: string
  new_password: string
}

// ---------------------------------------------------------------------------
// User Preferences
// ---------------------------------------------------------------------------

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: 'zh-CN' | 'en-US'
  notifications_enabled: boolean
  email_digest: 'realtime' | 'daily' | 'weekly' | 'none'
  default_dashboard?: string
}

// ---------------------------------------------------------------------------
// List helpers
// ---------------------------------------------------------------------------

export interface UserListItem
  extends Pick<
    User,
    | 'user_id'
    | 'email'
    | 'name'
    | 'avatar'
    | 'role'
    | 'status'
    | 'department'
    | 'last_login_at'
  > {}

export interface UserCreatePayload {
  email: string
  name: string
  role: UserRole
  department?: string
  title?: string
  phone?: string
}

export interface UserUpdatePayload extends Partial<UserCreatePayload> {
  status?: UserStatus
}

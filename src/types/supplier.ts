/**
 * OptiMax Type Definitions - Supplier
 */

import type {
  SupplierStatus,
  SupplierSensitivity,
  SupplierTier,
  Trend,
} from './enums'

// ---------------------------------------------------------------------------
// Core Supplier
// ---------------------------------------------------------------------------

export interface Supplier {
  supplier_id: string
  name: string
  code: string
  region: string
  country: string
  status: SupplierStatus
  certifications: string[]
  sensitivity: SupplierSensitivity
  risk_score: number // 0-100
  tier: SupplierTier
  key_materials: string[]
  contact_name?: string
  contact_email?: string
  established_year?: number
  annual_volume?: number
  created_at: string // ISO 8601
  updated_at: string // ISO 8601
}

// ---------------------------------------------------------------------------
// Risk Factor (radar chart data)
// ---------------------------------------------------------------------------

export interface SupplierRiskFactor {
  dimension: string // e.g. 严重度/关键性/替代性/财务/合规/交付
  score: number // 0-100
  weight: number // 0-1
  trend: Trend
}

// ---------------------------------------------------------------------------
// Alternative Supplier
// ---------------------------------------------------------------------------

export interface AlternativeSupplier {
  supplier_id: string
  name: string
  region: string
  cost_delta: number // percentage (+/-)
  lead_time_delta: number // days (+/-)
  risk_score: number // 0-100
  qualifications: string[]
  constraints: string[]
}

// ---------------------------------------------------------------------------
// List helpers
// ---------------------------------------------------------------------------

export interface SupplierListItem
  extends Pick<
    Supplier,
    | 'supplier_id'
    | 'name'
    | 'code'
    | 'region'
    | 'country'
    | 'status'
    | 'sensitivity'
    | 'risk_score'
    | 'tier'
    | 'updated_at'
  > {
  active_event_count: number
}

export interface SupplierCreatePayload {
  name: string
  code: string
  region: string
  country: string
  tier: SupplierTier
  sensitivity: SupplierSensitivity
  certifications?: string[]
  key_materials?: string[]
  contact_name?: string
  contact_email?: string
  established_year?: number
}

export interface SupplierUpdatePayload extends Partial<SupplierCreatePayload> {
  status?: SupplierStatus
}

import type { Supplier } from '@/types/supplier'
import type { EventStatus, Severity, Trend } from '@/types/enums'

// ---------------------------------------------------------------------------
// Supplier Risk Factor (radar chart)
// ---------------------------------------------------------------------------

export interface MockSupplierRiskFactor {
  dimension: string
  score: number
  weight: number
  trend: Trend
}

// ---------------------------------------------------------------------------
// Score Trend (line chart)
// ---------------------------------------------------------------------------

export interface MockScoreTrend {
  month: string
  score: number
}

// ---------------------------------------------------------------------------
// Alert History Event
// ---------------------------------------------------------------------------

export interface MockAlertEvent {
  event_id: string
  title: string
  severity: Severity
  created_at: string
  status: EventStatus
  resolution_days: number | null
}

// ---------------------------------------------------------------------------
// Network - Sub-supplier
// ---------------------------------------------------------------------------

export interface MockSubSupplier {
  supplier_id: string
  name: string
  tier: 2 | 3
  region: string
  risk_score: number
  parent_id: string
}

// ---------------------------------------------------------------------------
// Network - Site
// ---------------------------------------------------------------------------

export interface MockSite {
  site_id: string
  name: string
  city: string
  country: string
  type: string
}

// ---------------------------------------------------------------------------
// Network - Material
// ---------------------------------------------------------------------------

export interface MockMaterial {
  material_id: string
  name: string
  category: string
  criticality: 'high' | 'medium' | 'low'
  annual_volume: string
}

// ---------------------------------------------------------------------------
// Full supplier profile mock
// ---------------------------------------------------------------------------

export interface MockSupplierProfile extends Supplier {
  risk_factors: MockSupplierRiskFactor[]
  score_trend: MockScoreTrend[]
  recurrence_count: number
  alert_history: MockAlertEvent[]
  stats: {
    close_rate: number
    avg_resolution_days: number
    open_count: number
  }
  sub_suppliers: MockSubSupplier[]
  sites: MockSite[]
  materials: MockMaterial[]
  related_orders: number
}

// ---------------------------------------------------------------------------
// 5 Mock Suppliers
// ---------------------------------------------------------------------------

export const mockSuppliers: MockSupplierProfile[] = [
  {
    supplier_id: 'SUP-001',
    name: '深圳华芯微电子有限公司',
    code: 'USCC-91440300MA5FKE3T2X',
    region: '华南',
    country: '中国',
    status: 'active',
    certifications: ['ISO9001', 'ISO14001', 'IATF16949'],
    sensitivity: 'high',
    risk_score: 65,
    tier: 1,
    key_materials: ['MCU芯片', '功率半导体', '传感器IC'],
    contact_name: '张明',
    contact_email: 'zhangming@huaxin-ic.com',
    established_year: 2008,
    annual_volume: 12500000,
    created_at: '2024-03-15T08:00:00Z',
    updated_at: '2026-03-18T10:30:00Z',
    risk_factors: [
      { dimension: '严重度', score: 72, weight: 0.2, trend: 'up' },
      { dimension: '关键性', score: 85, weight: 0.25, trend: 'stable' },
      { dimension: '替代性', score: 40, weight: 0.15, trend: 'down' },
      { dimension: '财务', score: 55, weight: 0.15, trend: 'stable' },
      { dimension: '合规', score: 68, weight: 0.15, trend: 'up' },
      { dimension: '交付', score: 70, weight: 0.1, trend: 'up' },
    ],
    score_trend: [
      { month: '2025-04', score: 52 },
      { month: '2025-05', score: 48 },
      { month: '2025-06', score: 55 },
      { month: '2025-07', score: 60 },
      { month: '2025-08', score: 58 },
      { month: '2025-09', score: 62 },
      { month: '2025-10', score: 59 },
      { month: '2025-11', score: 64 },
      { month: '2025-12', score: 61 },
      { month: '2026-01', score: 66 },
      { month: '2026-02', score: 63 },
      { month: '2026-03', score: 65 },
    ],
    recurrence_count: 3,
    alert_history: [
      { event_id: 'EVT-101', title: '芯片交付延迟超14天', severity: 'high', created_at: '2026-03-10T09:00:00Z', status: 'in_progress', resolution_days: null },
      { event_id: 'EVT-102', title: 'ISO14001认证即将过期', severity: 'medium', created_at: '2026-02-20T14:30:00Z', status: 'resolved', resolution_days: 5 },
      { event_id: 'EVT-103', title: '财务审计异常-应收账款激增', severity: 'high', created_at: '2026-02-05T11:00:00Z', status: 'resolved', resolution_days: 8 },
      { event_id: 'EVT-104', title: '工厂环保处罚通报', severity: 'critical', created_at: '2026-01-15T08:20:00Z', status: 'resolved', resolution_days: 3 },
      { event_id: 'EVT-105', title: '关键原材料供应中断风险', severity: 'high', created_at: '2025-12-22T16:00:00Z', status: 'resolved', resolution_days: 6 },
      { event_id: 'EVT-106', title: '产品质量投诉批次追溯', severity: 'medium', created_at: '2025-11-18T10:45:00Z', status: 'resolved', resolution_days: 4 },
      { event_id: 'EVT-107', title: '人员流失率超过阈值', severity: 'low', created_at: '2025-10-05T09:15:00Z', status: 'resolved', resolution_days: 2 },
      { event_id: 'EVT-108', title: '地缘政治风险-出口管制变更', severity: 'critical', created_at: '2025-09-12T13:00:00Z', status: 'in_progress', resolution_days: null },
      { event_id: 'EVT-109', title: '次级供应商破产预警', severity: 'high', created_at: '2025-08-28T07:30:00Z', status: 'resolved', resolution_days: 3 },
      { event_id: 'EVT-110', title: '网络安全事件-数据泄露', severity: 'critical', created_at: '2025-07-14T22:00:00Z', status: 'in_progress', resolution_days: null },
    ],
    stats: {
      close_rate: 0.82,
      avg_resolution_days: 4.2,
      open_count: 3,
    },
    sub_suppliers: [
      { supplier_id: 'SUP-001-T2-A', name: '东莞晶锐材料科技', tier: 2, region: '华南', risk_score: 45, parent_id: 'SUP-001' },
      { supplier_id: 'SUP-001-T2-B', name: '苏州纳微新材料', tier: 2, region: '华东', risk_score: 32, parent_id: 'SUP-001' },
      { supplier_id: 'SUP-001-T2-C', name: '武汉光谷半导体设备', tier: 2, region: '华中', risk_score: 58, parent_id: 'SUP-001' },
      { supplier_id: 'SUP-001-T3-A', name: '广州精密模具厂', tier: 3, region: '华南', risk_score: 28, parent_id: 'SUP-001-T2-A' },
      { supplier_id: 'SUP-001-T3-B', name: '佛山高纯化学品', tier: 3, region: '华南', risk_score: 41, parent_id: 'SUP-001-T2-A' },
      { supplier_id: 'SUP-001-T3-C', name: '昆山光刻胶材料', tier: 3, region: '华东', risk_score: 55, parent_id: 'SUP-001-T2-B' },
      { supplier_id: 'SUP-001-T3-D', name: '无锡封装测试中心', tier: 3, region: '华东', risk_score: 22, parent_id: 'SUP-001-T2-B' },
      { supplier_id: 'SUP-001-T3-E', name: '襄阳电子气体供应', tier: 3, region: '华中', risk_score: 37, parent_id: 'SUP-001-T2-C' },
    ],
    sites: [
      { site_id: 'SITE-001', name: '深圳龙华生产基地', city: '深圳', country: '中国', type: '生产' },
      { site_id: 'SITE-002', name: '东莞松山湖研发中心', city: '东莞', country: '中国', type: '研发' },
      { site_id: 'SITE-003', name: '马来西亚槟城封测厂', city: '槟城', country: '马来西亚', type: '封测' },
    ],
    materials: [
      { material_id: 'MAT-001', name: 'STM32系列MCU', category: '芯片', criticality: 'high', annual_volume: '500万颗' },
      { material_id: 'MAT-002', name: 'IGBT功率模块', category: '功率器件', criticality: 'high', annual_volume: '120万只' },
      { material_id: 'MAT-003', name: 'MEMS压力传感器', category: '传感器', criticality: 'medium', annual_volume: '300万颗' },
      { material_id: 'MAT-004', name: '车规级电容', category: '被动器件', criticality: 'medium', annual_volume: '2000万只' },
      { material_id: 'MAT-005', name: '封装基板', category: '封装材料', criticality: 'low', annual_volume: '80万片' },
    ],
    related_orders: 47,
  },
  {
    supplier_id: 'SUP-002',
    name: '上海博锐精密机械股份有限公司',
    code: 'USCC-91310000MA1FL8HX3B',
    region: '华东',
    country: '中国',
    status: 'active',
    certifications: ['ISO9001', 'AS9100D'],
    sensitivity: 'medium',
    risk_score: 42,
    tier: 1,
    key_materials: ['精密轴承', 'CNC加工件', '液压组件'],
    contact_name: '李芳',
    contact_email: 'lifang@borui-precision.com',
    established_year: 2012,
    annual_volume: 8200000,
    created_at: '2024-06-01T08:00:00Z',
    updated_at: '2026-03-15T14:00:00Z',
    risk_factors: [
      { dimension: '严重度', score: 38, weight: 0.2, trend: 'down' },
      { dimension: '关键性', score: 60, weight: 0.25, trend: 'stable' },
      { dimension: '替代性', score: 55, weight: 0.15, trend: 'stable' },
      { dimension: '财务', score: 30, weight: 0.15, trend: 'down' },
      { dimension: '合规', score: 35, weight: 0.15, trend: 'stable' },
      { dimension: '交付', score: 42, weight: 0.1, trend: 'up' },
    ],
    score_trend: [
      { month: '2025-04', score: 38 },
      { month: '2025-05', score: 40 },
      { month: '2025-06', score: 36 },
      { month: '2025-07', score: 42 },
      { month: '2025-08', score: 39 },
      { month: '2025-09', score: 44 },
      { month: '2025-10', score: 41 },
      { month: '2025-11', score: 43 },
      { month: '2025-12', score: 40 },
      { month: '2026-01', score: 45 },
      { month: '2026-02', score: 43 },
      { month: '2026-03', score: 42 },
    ],
    recurrence_count: 1,
    alert_history: [
      { event_id: 'EVT-201', title: '交付延期3天', severity: 'low', created_at: '2026-03-05T10:00:00Z', status: 'resolved', resolution_days: 2 },
      { event_id: 'EVT-202', title: '质检批次不良率上升', severity: 'medium', created_at: '2026-01-22T09:00:00Z', status: 'resolved', resolution_days: 4 },
      { event_id: 'EVT-203', title: '原材料成本波动预警', severity: 'low', created_at: '2025-11-10T15:00:00Z', status: 'resolved', resolution_days: 1 },
      { event_id: 'EVT-204', title: '供应商工厂搬迁通知', severity: 'medium', created_at: '2025-09-20T08:00:00Z', status: 'resolved', resolution_days: 7 },
      { event_id: 'EVT-205', title: '年度审核发现轻微不符合', severity: 'low', created_at: '2025-07-15T11:00:00Z', status: 'resolved', resolution_days: 3 },
      { event_id: 'EVT-206', title: '合同续签风险评估', severity: 'info', created_at: '2025-06-01T14:00:00Z', status: 'resolved', resolution_days: 2 },
      { event_id: 'EVT-207', title: '设备故障导致产能下降', severity: 'medium', created_at: '2025-05-18T10:30:00Z', status: 'resolved', resolution_days: 5 },
      { event_id: 'EVT-208', title: '新增环保法规合规审查', severity: 'low', created_at: '2025-04-22T09:00:00Z', status: 'resolved', resolution_days: 3 },
      { event_id: 'EVT-209', title: '物流路线中断备选方案', severity: 'medium', created_at: '2025-03-15T16:00:00Z', status: 'resolved', resolution_days: 2 },
      { event_id: 'EVT-210', title: '供应商信用评级下调', severity: 'high', created_at: '2025-02-10T08:00:00Z', status: 'resolved', resolution_days: 6 },
    ],
    stats: {
      close_rate: 1.0,
      avg_resolution_days: 3.5,
      open_count: 0,
    },
    sub_suppliers: [
      { supplier_id: 'SUP-002-T2-A', name: '宁波海天钢材', tier: 2, region: '华东', risk_score: 25, parent_id: 'SUP-002' },
      { supplier_id: 'SUP-002-T2-B', name: '常州精工热处理', tier: 2, region: '华东', risk_score: 30, parent_id: 'SUP-002' },
      { supplier_id: 'SUP-002-T2-C', name: '台州恒力液压', tier: 2, region: '华东', risk_score: 35, parent_id: 'SUP-002' },
      { supplier_id: 'SUP-002-T3-A', name: '绍兴特钢冶炼', tier: 3, region: '华东', risk_score: 20, parent_id: 'SUP-002-T2-A' },
      { supplier_id: 'SUP-002-T3-B', name: '义乌密封件厂', tier: 3, region: '华东', risk_score: 18, parent_id: 'SUP-002-T2-C' },
    ],
    sites: [
      { site_id: 'SITE-004', name: '上海嘉定工厂', city: '上海', country: '中国', type: '生产' },
      { site_id: 'SITE-005', name: '苏州太仓精加工中心', city: '太仓', country: '中国', type: '加工' },
      { site_id: 'SITE-006', name: '上海张江研发部', city: '上海', country: '中国', type: '研发' },
    ],
    materials: [
      { material_id: 'MAT-006', name: '精密滚动轴承', category: '轴承', criticality: 'high', annual_volume: '200万套' },
      { material_id: 'MAT-007', name: '五轴CNC加工件', category: '加工件', criticality: 'medium', annual_volume: '50万件' },
      { material_id: 'MAT-008', name: '液压缸总成', category: '液压', criticality: 'medium', annual_volume: '30万套' },
      { material_id: 'MAT-009', name: '高强度紧固件', category: '紧固件', criticality: 'low', annual_volume: '800万只' },
      { material_id: 'MAT-010', name: '精密密封圈', category: '密封件', criticality: 'low', annual_volume: '1500万只' },
    ],
    related_orders: 32,
  },
  {
    supplier_id: 'SUP-003',
    name: 'TechVision Materials GmbH',
    code: 'DE-HRB-289456',
    region: '欧洲',
    country: '德国',
    status: 'active',
    certifications: ['ISO9001', 'ISO14001', 'REACH', 'RoHS'],
    sensitivity: 'high',
    risk_score: 28,
    tier: 1,
    key_materials: ['特种工程塑料', '光学涂层材料', '碳纤维预浸料'],
    contact_name: 'Hans Mueller',
    contact_email: 'h.mueller@techvision-mat.de',
    established_year: 1995,
    annual_volume: 22000000,
    created_at: '2023-11-20T08:00:00Z',
    updated_at: '2026-03-17T09:00:00Z',
    risk_factors: [
      { dimension: '严重度', score: 25, weight: 0.2, trend: 'down' },
      { dimension: '关键性', score: 90, weight: 0.25, trend: 'stable' },
      { dimension: '替代性', score: 20, weight: 0.15, trend: 'stable' },
      { dimension: '财务', score: 15, weight: 0.15, trend: 'down' },
      { dimension: '合规', score: 22, weight: 0.15, trend: 'stable' },
      { dimension: '交付', score: 30, weight: 0.1, trend: 'stable' },
    ],
    score_trend: [
      { month: '2025-04', score: 30 },
      { month: '2025-05', score: 28 },
      { month: '2025-06', score: 32 },
      { month: '2025-07', score: 29 },
      { month: '2025-08', score: 27 },
      { month: '2025-09', score: 26 },
      { month: '2025-10', score: 28 },
      { month: '2025-11', score: 25 },
      { month: '2025-12', score: 27 },
      { month: '2026-01', score: 29 },
      { month: '2026-02', score: 26 },
      { month: '2026-03', score: 28 },
    ],
    recurrence_count: 0,
    alert_history: [
      { event_id: 'EVT-301', title: 'REACH法规更新影响评估', severity: 'low', created_at: '2026-02-28T10:00:00Z', status: 'resolved', resolution_days: 3 },
      { event_id: 'EVT-302', title: '欧洲能源价格波动影响', severity: 'medium', created_at: '2026-01-10T14:00:00Z', status: 'resolved', resolution_days: 4 },
      { event_id: 'EVT-303', title: '物流延迟-港口罢工', severity: 'high', created_at: '2025-10-15T08:00:00Z', status: 'resolved', resolution_days: 2 },
      { event_id: 'EVT-304', title: '产品认证更新通知', severity: 'info', created_at: '2025-08-20T09:00:00Z', status: 'resolved', resolution_days: 1 },
      { event_id: 'EVT-305', title: '新材料测试批次评审', severity: 'low', created_at: '2025-06-10T11:00:00Z', status: 'resolved', resolution_days: 5 },
      { event_id: 'EVT-306', title: '年度合规审核完成', severity: 'info', created_at: '2025-04-25T15:00:00Z', status: 'resolved', resolution_days: 1 },
      { event_id: 'EVT-307', title: '供应合同价格调整谈判', severity: 'medium', created_at: '2025-03-12T10:00:00Z', status: 'resolved', resolution_days: 8 },
      { event_id: 'EVT-308', title: '原材料质量波动检测', severity: 'medium', created_at: '2025-01-18T09:30:00Z', status: 'resolved', resolution_days: 3 },
      { event_id: 'EVT-309', title: 'EU碳边境调节税影响', severity: 'low', created_at: '2024-11-22T14:00:00Z', status: 'resolved', resolution_days: 6 },
      { event_id: 'EVT-310', title: '供应商IT系统升级通知', severity: 'info', created_at: '2024-09-05T10:00:00Z', status: 'resolved', resolution_days: 1 },
    ],
    stats: {
      close_rate: 1.0,
      avg_resolution_days: 3.4,
      open_count: 0,
    },
    sub_suppliers: [
      { supplier_id: 'SUP-003-T2-A', name: 'BASF Specialty Chemicals', tier: 2, region: '欧洲', risk_score: 15, parent_id: 'SUP-003' },
      { supplier_id: 'SUP-003-T2-B', name: 'Toray Carbon Fibers EU', tier: 2, region: '欧洲', risk_score: 20, parent_id: 'SUP-003' },
      { supplier_id: 'SUP-003-T2-C', name: 'Schott Optical Coatings', tier: 2, region: '欧洲', risk_score: 12, parent_id: 'SUP-003' },
      { supplier_id: 'SUP-003-T3-A', name: 'Evonik Polymer Resins', tier: 3, region: '欧洲', risk_score: 18, parent_id: 'SUP-003-T2-A' },
      { supplier_id: 'SUP-003-T3-B', name: 'SGL Carbon Precursors', tier: 3, region: '欧洲', risk_score: 22, parent_id: 'SUP-003-T2-B' },
    ],
    sites: [
      { site_id: 'SITE-007', name: 'Munich Production Plant', city: '慕尼黑', country: '德国', type: '生产' },
      { site_id: 'SITE-008', name: 'Hamburg Distribution Center', city: '汉堡', country: '德国', type: '仓储' },
      { site_id: 'SITE-009', name: 'Stuttgart R&D Lab', city: '斯图加特', country: '德国', type: '研发' },
    ],
    materials: [
      { material_id: 'MAT-011', name: 'PEEK工程塑料颗粒', category: '特种塑料', criticality: 'high', annual_volume: '120吨' },
      { material_id: 'MAT-012', name: 'AR光学镀膜材料', category: '光学材料', criticality: 'high', annual_volume: '50吨' },
      { material_id: 'MAT-013', name: 'T800碳纤维预浸料', category: '复合材料', criticality: 'high', annual_volume: '200吨' },
      { material_id: 'MAT-014', name: 'LCP液晶聚合物', category: '特种塑料', criticality: 'medium', annual_volume: '80吨' },
      { material_id: 'MAT-015', name: '硅基防护涂层', category: '涂层材料', criticality: 'low', annual_volume: '30吨' },
    ],
    related_orders: 18,
  },
  {
    supplier_id: 'SUP-004',
    name: '河北中泰钢铁集团有限公司',
    code: 'USCC-91130000MA0D5R6X9P',
    region: '华北',
    country: '中国',
    status: 'suspended',
    certifications: ['ISO9001'],
    sensitivity: 'medium',
    risk_score: 82,
    tier: 2,
    key_materials: ['冷轧钢板', '镀锌钢卷', '特种钢管'],
    contact_name: '王建国',
    contact_email: 'wangjianguo@zhongtai-steel.cn',
    established_year: 2001,
    annual_volume: 35000000,
    created_at: '2024-01-10T08:00:00Z',
    updated_at: '2026-03-12T16:00:00Z',
    risk_factors: [
      { dimension: '严重度', score: 85, weight: 0.2, trend: 'up' },
      { dimension: '关键性', score: 50, weight: 0.25, trend: 'stable' },
      { dimension: '替代性', score: 70, weight: 0.15, trend: 'stable' },
      { dimension: '财务', score: 90, weight: 0.15, trend: 'up' },
      { dimension: '合规', score: 88, weight: 0.15, trend: 'up' },
      { dimension: '交付', score: 75, weight: 0.1, trend: 'up' },
    ],
    score_trend: [
      { month: '2025-04', score: 55 },
      { month: '2025-05', score: 58 },
      { month: '2025-06', score: 62 },
      { month: '2025-07', score: 60 },
      { month: '2025-08', score: 65 },
      { month: '2025-09', score: 70 },
      { month: '2025-10', score: 72 },
      { month: '2025-11', score: 75 },
      { month: '2025-12', score: 78 },
      { month: '2026-01', score: 80 },
      { month: '2026-02', score: 79 },
      { month: '2026-03', score: 82 },
    ],
    recurrence_count: 5,
    alert_history: [
      { event_id: 'EVT-401', title: '环保处罚-超标排放停产', severity: 'critical', created_at: '2026-03-08T08:00:00Z', status: 'in_progress', resolution_days: null },
      { event_id: 'EVT-402', title: '银行贷款违约风险', severity: 'critical', created_at: '2026-02-25T10:00:00Z', status: 'in_progress', resolution_days: null },
      { event_id: 'EVT-403', title: '安全生产事故通报', severity: 'critical', created_at: '2026-02-10T14:00:00Z', status: 'alerted', resolution_days: null },
      { event_id: 'EVT-404', title: '交付全面延迟通知', severity: 'high', created_at: '2026-01-20T09:00:00Z', status: 'resolved', resolution_days: 12 },
      { event_id: 'EVT-405', title: '主要客户流失预警', severity: 'high', created_at: '2025-12-15T11:00:00Z', status: 'resolved', resolution_days: 8 },
      { event_id: 'EVT-406', title: '关键设备老化维修风险', severity: 'medium', created_at: '2025-11-08T10:00:00Z', status: 'resolved', resolution_days: 5 },
      { event_id: 'EVT-407', title: '产品质量下降投诉增多', severity: 'high', created_at: '2025-10-22T14:30:00Z', status: 'resolved', resolution_days: 7 },
      { event_id: 'EVT-408', title: '经营层变动-CEO离职', severity: 'medium', created_at: '2025-09-01T08:00:00Z', status: 'resolved', resolution_days: 3 },
      { event_id: 'EVT-409', title: '能耗超标限电影响', severity: 'medium', created_at: '2025-07-25T15:00:00Z', status: 'resolved', resolution_days: 4 },
      { event_id: 'EVT-410', title: '原料价格暴涨转嫁风险', severity: 'high', created_at: '2025-06-10T10:00:00Z', status: 'resolved', resolution_days: 6 },
    ],
    stats: {
      close_rate: 0.70,
      avg_resolution_days: 6.4,
      open_count: 3,
    },
    sub_suppliers: [
      { supplier_id: 'SUP-004-T2-A', name: '唐山瑞丰焦化', tier: 2, region: '华北', risk_score: 72, parent_id: 'SUP-004' },
      { supplier_id: 'SUP-004-T2-B', name: '邯郸远大矿业', tier: 2, region: '华北', risk_score: 65, parent_id: 'SUP-004' },
      { supplier_id: 'SUP-004-T2-C', name: '天津港物流仓储', tier: 2, region: '华北', risk_score: 30, parent_id: 'SUP-004' },
      { supplier_id: 'SUP-004-T3-A', name: '内蒙古煤炭运销', tier: 3, region: '华北', risk_score: 50, parent_id: 'SUP-004-T2-A' },
      { supplier_id: 'SUP-004-T3-B', name: '山西铁矿石开采', tier: 3, region: '华北', risk_score: 60, parent_id: 'SUP-004-T2-B' },
    ],
    sites: [
      { site_id: 'SITE-010', name: '唐山曹妃甸钢铁基地', city: '唐山', country: '中国', type: '生产' },
      { site_id: 'SITE-011', name: '天津滨海仓储中心', city: '天津', country: '中国', type: '仓储' },
      { site_id: 'SITE-012', name: '石家庄管理总部', city: '石家庄', country: '中国', type: '行政' },
    ],
    materials: [
      { material_id: 'MAT-016', name: 'SPCC冷轧钢板', category: '板材', criticality: 'medium', annual_volume: '5万吨' },
      { material_id: 'MAT-017', name: '热镀锌钢卷DX51D', category: '卷材', criticality: 'medium', annual_volume: '3万吨' },
      { material_id: 'MAT-018', name: 'Q345特种钢管', category: '管材', criticality: 'low', annual_volume: '1.5万吨' },
      { material_id: 'MAT-019', name: '不锈钢304薄板', category: '板材', criticality: 'low', annual_volume: '8000吨' },
      { material_id: 'MAT-020', name: '合金结构钢棒材', category: '棒材', criticality: 'low', annual_volume: '1.2万吨' },
    ],
    related_orders: 8,
  },
  {
    supplier_id: 'SUP-005',
    name: 'Sakura Electronics Co., Ltd.',
    code: 'JP-CORP-4010401089012',
    region: '亚太',
    country: '日本',
    status: 'inactive',
    certifications: ['ISO9001', 'ISO14001', 'JIS'],
    sensitivity: 'low',
    risk_score: 35,
    tier: 2,
    key_materials: ['电容器', '继电器', '连接器'],
    contact_name: 'Takeshi Yamada',
    contact_email: 't.yamada@sakura-elec.co.jp',
    established_year: 1988,
    annual_volume: 5600000,
    created_at: '2024-08-15T08:00:00Z',
    updated_at: '2026-01-20T11:00:00Z',
    risk_factors: [
      { dimension: '严重度', score: 30, weight: 0.2, trend: 'stable' },
      { dimension: '关键性', score: 35, weight: 0.25, trend: 'down' },
      { dimension: '替代性', score: 65, weight: 0.15, trend: 'stable' },
      { dimension: '财务', score: 25, weight: 0.15, trend: 'stable' },
      { dimension: '合规', score: 20, weight: 0.15, trend: 'down' },
      { dimension: '交付', score: 38, weight: 0.1, trend: 'stable' },
    ],
    score_trend: [
      { month: '2025-04', score: 40 },
      { month: '2025-05', score: 38 },
      { month: '2025-06', score: 42 },
      { month: '2025-07', score: 39 },
      { month: '2025-08', score: 37 },
      { month: '2025-09', score: 35 },
      { month: '2025-10', score: 36 },
      { month: '2025-11', score: 34 },
      { month: '2025-12', score: 37 },
      { month: '2026-01', score: 35 },
      { month: '2026-02', score: 34 },
      { month: '2026-03', score: 35 },
    ],
    recurrence_count: 0,
    alert_history: [
      { event_id: 'EVT-501', title: '合作终止-合同到期未续', severity: 'info', created_at: '2026-01-15T10:00:00Z', status: 'archived', resolution_days: 1 },
      { event_id: 'EVT-502', title: '日元汇率波动影响评估', severity: 'low', created_at: '2025-11-20T09:00:00Z', status: 'resolved', resolution_days: 2 },
      { event_id: 'EVT-503', title: '地震灾害供应影响排查', severity: 'high', created_at: '2025-08-15T06:00:00Z', status: 'resolved', resolution_days: 3 },
      { event_id: 'EVT-504', title: '产品替代方案评估完成', severity: 'info', created_at: '2025-06-22T14:00:00Z', status: 'resolved', resolution_days: 5 },
      { event_id: 'EVT-505', title: '供应商年度现场审核', severity: 'low', created_at: '2025-04-10T10:00:00Z', status: 'resolved', resolution_days: 2 },
      { event_id: 'EVT-506', title: '电子元器件缺货预警', severity: 'medium', created_at: '2025-02-18T08:00:00Z', status: 'resolved', resolution_days: 4 },
      { event_id: 'EVT-507', title: '物流运费上涨通知', severity: 'low', created_at: '2025-01-05T11:00:00Z', status: 'resolved', resolution_days: 1 },
      { event_id: 'EVT-508', title: '质量体系认证更新', severity: 'info', created_at: '2024-11-12T15:00:00Z', status: 'resolved', resolution_days: 1 },
      { event_id: 'EVT-509', title: '台风季节供应保障计划', severity: 'medium', created_at: '2024-09-08T09:00:00Z', status: 'resolved', resolution_days: 3 },
      { event_id: 'EVT-510', title: '新产品导入样品确认', severity: 'info', created_at: '2024-08-20T10:00:00Z', status: 'resolved', resolution_days: 7 },
    ],
    stats: {
      close_rate: 1.0,
      avg_resolution_days: 2.9,
      open_count: 0,
    },
    sub_suppliers: [
      { supplier_id: 'SUP-005-T2-A', name: 'Murata Ceramic Components', tier: 2, region: '亚太', risk_score: 15, parent_id: 'SUP-005' },
      { supplier_id: 'SUP-005-T2-B', name: 'Omron Relay Division', tier: 2, region: '亚太', risk_score: 18, parent_id: 'SUP-005' },
      { supplier_id: 'SUP-005-T2-C', name: 'Hirose Electric Connectors', tier: 2, region: '亚太', risk_score: 12, parent_id: 'SUP-005' },
      { supplier_id: 'SUP-005-T3-A', name: 'TDK Ferrite Materials', tier: 3, region: '亚太', risk_score: 10, parent_id: 'SUP-005-T2-A' },
      { supplier_id: 'SUP-005-T3-B', name: 'Sumitomo Copper Wire', tier: 3, region: '亚太', risk_score: 14, parent_id: 'SUP-005-T2-B' },
    ],
    sites: [
      { site_id: 'SITE-013', name: 'Osaka Main Factory', city: '大阪', country: '日本', type: '生产' },
      { site_id: 'SITE-014', name: 'Tokyo Sales Office', city: '东京', country: '日本', type: '销售' },
      { site_id: 'SITE-015', name: 'Nagoya Testing Center', city: '名古屋', country: '日本', type: '测试' },
    ],
    materials: [
      { material_id: 'MAT-021', name: 'MLCC陶瓷电容', category: '电容器', criticality: 'medium', annual_volume: '3000万只' },
      { material_id: 'MAT-022', name: '小型功率继电器', category: '继电器', criticality: 'low', annual_volume: '500万只' },
      { material_id: 'MAT-023', name: 'FPC连接器', category: '连接器', criticality: 'low', annual_volume: '800万只' },
      { material_id: 'MAT-024', name: '铝电解电容', category: '电容器', criticality: 'low', annual_volume: '1200万只' },
      { material_id: 'MAT-025', name: '信号继电器', category: '继电器', criticality: 'low', annual_volume: '200万只' },
    ],
    related_orders: 5,
  },
]

// ---------------------------------------------------------------------------
// Helper to find a supplier by ID
// ---------------------------------------------------------------------------

export function findSupplierById(id: string): MockSupplierProfile | undefined {
  return mockSuppliers.find((s) => s.supplier_id === id)
}

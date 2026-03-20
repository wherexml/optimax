import { useMemo } from 'react'
import { useParams, Link } from '@tanstack/react-router'
import {
  ChevronRight,
  Bell,
  GitCompare,
  Download,
  Building2,
  ShieldCheck,
  MapPin,
  Hash,
  AlertTriangle,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

import { RiskScorePanel } from '@/components/supplier/RiskScorePanel'
import { AlertHistory } from '@/components/supplier/AlertHistory'
import { NetworkRelation } from '@/components/supplier/NetworkRelation'
import { findSupplierById } from '@/mocks/data/suppliers'

import type { SupplierStatus, SupplierSensitivity } from '@/types/enums'

// ---------------------------------------------------------------------------
// Status badge configs
// ---------------------------------------------------------------------------

const statusConfig: Record<SupplierStatus, { label: string; className: string }> = {
  active: { label: '合作中', className: 'bg-green-100 text-green-800 border-green-200' },
  inactive: { label: '已停用', className: 'bg-gray-100 text-gray-600 border-gray-200' },
  suspended: { label: '已暂停', className: 'bg-red-100 text-red-700 border-red-200' },
  pending: { label: '待审核', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
}

const sensitivityConfig: Record<SupplierSensitivity, { label: string; className: string }> = {
  high: { label: '高敏感', className: 'bg-red-50 text-red-700 border-red-200' },
  medium: { label: '中敏感', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  low: { label: '低敏感', className: 'bg-green-50 text-green-700 border-green-200' },
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function SupplierProfile() {
  const { supplierId } = useParams({ from: '/authenticated/suppliers/$supplierId' })
  const supplier = useMemo(() => findSupplierById(supplierId), [supplierId])

  if (!supplier) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold">未找到供应商</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            供应商 ID: {supplierId} 不存在
          </p>
          <Link
            to="/suppliers"
            className="mt-4 inline-block text-sm text-blue-600 hover:underline"
          >
            返回供应商列表
          </Link>
        </div>
      </div>
    )
  }

  const sConfig = statusConfig[supplier.status]
  const senConfig = sensitivityConfig[supplier.sensitivity]

  return (
    <div className="space-y-6 p-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/suppliers" className="hover:text-foreground transition-colors">
          供应商列表
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-foreground">{supplier.name}</span>
      </nav>

      {/* Top profile section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        {/* Left: name + meta */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{supplier.name}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Hash className="h-3.5 w-3.5" />
                  {supplier.code}
                </span>
                <Separator orientation="vertical" className="h-4" />
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {supplier.region} · {supplier.country}
                </span>
                {supplier.established_year && (
                  <>
                    <Separator orientation="vertical" className="h-4" />
                    <span>成立于 {supplier.established_year} 年</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status badge */}
            <span
              className={cn(
                'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
                sConfig.className,
              )}
            >
              {sConfig.label}
            </span>

            {/* Sensitivity badge */}
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
                senConfig.className,
              )}
            >
              <ShieldCheck className="h-3 w-3" />
              {senConfig.label}
            </span>

            {/* Tier */}
            <Badge variant="outline" className="text-xs">
              Tier-{supplier.tier}
            </Badge>

            {/* Certifications */}
            {supplier.certifications.map((cert) => (
              <Badge key={cert} variant="secondary" className="text-xs">
                {cert}
              </Badge>
            ))}
          </div>
        </div>

        {/* Right: action buttons */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Bell className="h-3.5 w-3.5" />
            订阅
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <GitCompare className="h-3.5 w-3.5" />
            对比
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-3.5 w-3.5" />
            导出
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList>
          <TabsTrigger value="basic">基础信息</TabsTrigger>
          <TabsTrigger value="risk">风险评分</TabsTrigger>
          <TabsTrigger value="alerts">预警历史</TabsTrigger>
          <TabsTrigger value="network">网络关系</TabsTrigger>
        </TabsList>

        {/* === Tab 1: Basic Info === */}
        <TabsContent value="basic">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">企业信息</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">企业名称</dt>
                    <dd className="font-medium">{supplier.name}</dd>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">统一编码</dt>
                    <dd className="font-mono text-xs">{supplier.code}</dd>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">区域 / 国家</dt>
                    <dd>{supplier.region} / {supplier.country}</dd>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">成立年份</dt>
                    <dd>{supplier.established_year ?? '-'}</dd>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">供应商层级</dt>
                    <dd>Tier-{supplier.tier}</dd>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">年采购额</dt>
                    <dd>
                      {supplier.annual_volume
                        ? `${(supplier.annual_volume / 10000).toLocaleString()} 万元`
                        : '-'}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">联系与认证</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">联系人</dt>
                    <dd>{supplier.contact_name ?? '-'}</dd>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">邮箱</dt>
                    <dd className="text-xs">{supplier.contact_email ?? '-'}</dd>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">认证</dt>
                    <dd className="flex flex-wrap gap-1">
                      {supplier.certifications.map((c) => (
                        <Badge key={c} variant="secondary" className="text-[11px]">
                          {c}
                        </Badge>
                      ))}
                    </dd>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">关键物料</dt>
                    <dd className="flex flex-wrap gap-1">
                      {supplier.key_materials.map((m) => (
                        <Badge key={m} variant="outline" className="text-[11px]">
                          {m}
                        </Badge>
                      ))}
                    </dd>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">创建时间</dt>
                    <dd className="text-xs text-muted-foreground">
                      {new Date(supplier.created_at).toLocaleDateString('zh-CN')}
                    </dd>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">更新时间</dt>
                    <dd className="text-xs text-muted-foreground">
                      {new Date(supplier.updated_at).toLocaleDateString('zh-CN')}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* === Tab 2: Risk Score === */}
        <TabsContent value="risk">
          <RiskScorePanel
            riskScore={supplier.risk_score}
            riskFactors={supplier.risk_factors}
            scoreTrend={supplier.score_trend}
            recurrenceCount={supplier.recurrence_count}
          />
        </TabsContent>

        {/* === Tab 3: Alert History === */}
        <TabsContent value="alerts">
          <AlertHistory events={supplier.alert_history} stats={supplier.stats} />
        </TabsContent>

        {/* === Tab 4: Network Relation === */}
        <TabsContent value="network">
          <NetworkRelation
            supplierName={supplier.name}
            supplierId={supplier.supplier_id}
            subSuppliers={supplier.sub_suppliers}
            sites={supplier.sites}
            materials={supplier.materials}
            relatedOrders={supplier.related_orders}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

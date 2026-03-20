import {
  Building2,
  ChevronRight,
  Factory,
  MapPin,
  Package,
  ShoppingCart,
  Network,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type {
  MockSubSupplier,
  MockSite,
  MockMaterial,
} from '@/mocks/data/suppliers'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface NetworkRelationProps {
  supplierName: string
  supplierId: string
  subSuppliers: MockSubSupplier[]
  sites: MockSite[]
  materials: MockMaterial[]
  relatedOrders: number
}

// ---------------------------------------------------------------------------
// Helper: risk color
// ---------------------------------------------------------------------------

function getRiskColor(score: number): string {
  if (score >= 70) return 'text-red-600'
  if (score >= 50) return 'text-orange-500'
  if (score >= 30) return 'text-yellow-600'
  return 'text-green-600'
}

function getRiskBg(score: number): string {
  if (score >= 70) return 'bg-red-50'
  if (score >= 50) return 'bg-orange-50'
  if (score >= 30) return 'bg-yellow-50'
  return 'bg-green-50'
}

function getCriticalityStyle(c: string): { bg: string; text: string } {
  switch (c) {
    case 'high':
      return { bg: 'bg-red-50 border-red-200', text: 'text-red-700' }
    case 'medium':
      return { bg: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-700' }
    default:
      return { bg: 'bg-green-50 border-green-200', text: 'text-green-700' }
  }
}

const criticalityLabel: Record<string, string> = {
  high: '高',
  medium: '中',
  low: '低',
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function NetworkRelation({
  supplierName,
  supplierId,
  subSuppliers,
  sites,
  materials,
  relatedOrders,
}: NetworkRelationProps) {
  const tier2 = subSuppliers.filter((s) => s.tier === 2)
  const tier3 = subSuppliers.filter((s) => s.tier === 3)

  return (
    <div className="space-y-6">
      {/* Tier-N supply chain tree */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Network className="h-4 w-4 text-blue-500" />
            Tier-N 供应关系
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {/* Tier-1: current supplier */}
          <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-3">
            <Building2 className="h-5 w-5 text-blue-600" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-900">{supplierName}</p>
              <p className="text-xs text-blue-600">Tier-1 / {supplierId}</p>
            </div>
            <Badge variant="secondary" className="text-xs">
              本供应商
            </Badge>
          </div>

          {/* Tier-2 */}
          {tier2.map((t2) => {
            const children = tier3.filter((t3) => t3.parent_id === t2.supplier_id)
            return (
              <div key={t2.supplier_id} className="ml-6">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <ChevronRight className="h-3 w-3" />
                </div>
                <div className="ml-2 rounded-lg border bg-card px-4 py-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Factory className="h-4 w-4 text-indigo-500" />
                      <div>
                        <p className="text-sm font-medium">{t2.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Tier-2 / {t2.region}
                        </p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        'rounded-md px-2 py-0.5 text-xs font-semibold',
                        getRiskBg(t2.risk_score),
                        getRiskColor(t2.risk_score),
                      )}
                    >
                      风险 {t2.risk_score}
                    </span>
                  </div>
                </div>

                {/* Tier-3 children */}
                {children.map((t3) => (
                  <div key={t3.supplier_id} className="ml-8">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <ChevronRight className="h-3 w-3" />
                    </div>
                    <div className="ml-2 rounded-lg border border-dashed bg-muted/40 px-4 py-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Factory className="h-3.5 w-3.5 text-gray-400" />
                          <div>
                            <p className="text-xs font-medium">{t3.name}</p>
                            <p className="text-[11px] text-muted-foreground">
                              Tier-3 / {t3.region}
                            </p>
                          </div>
                        </div>
                        <span
                          className={cn(
                            'rounded-md px-1.5 py-0.5 text-[11px] font-semibold',
                            getRiskBg(t3.risk_score),
                            getRiskColor(t3.risk_score),
                          )}
                        >
                          风险 {t3.risk_score}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          })}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Key materials */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Package className="h-4 w-4 text-purple-500" />
              关键物料
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {materials.map((m) => {
                const style = getCriticalityStyle(m.criticality)
                return (
                  <div
                    key={m.material_id}
                    className="flex items-center justify-between rounded-lg border px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-medium">{m.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {m.category} / 年用量: {m.annual_volume}
                      </p>
                    </div>
                    <span
                      className={cn(
                        'rounded-md border px-1.5 py-0.5 text-[11px] font-medium',
                        style.bg,
                        style.text,
                      )}
                    >
                      关键性: {criticalityLabel[m.criticality]}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Sites + Orders */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="h-4 w-4 text-teal-500" />
                工厂/站点分布
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sites.map((s) => (
                  <div
                    key={s.site_id}
                    className="flex items-center justify-between rounded-lg border px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <Factory className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{s.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {s.city}, {s.country}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {s.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <ShoppingCart className="h-4 w-4 text-amber-500" />
                关联订单
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <p className="text-3xl font-bold">{relatedOrders}</p>
              <p className="text-sm text-muted-foreground">笔活跃订单</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

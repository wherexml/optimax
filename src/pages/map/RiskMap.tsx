import { useState, useMemo, useCallback } from 'react'
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Globe } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapInfoWindow } from '@/components/common/MapInfoWindow'
import { LayerControl, defaultLayerState, type LayerState } from '@/components/map/LayerControl'
import { NodeRanking, type RankingItem } from '@/components/map/NodeRanking'
import { MapSnapshot } from '@/components/map/MapSnapshot'
import type { Severity } from '@/types/enums'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RiskNode {
  id: string
  name: string
  lat: number
  lng: number
  severity: Severity
  eventCount: number
  riskSummary: string
  nodeType: 'supplier' | 'site' | 'port'
  riskType: 'supplyDisruption' | 'qualityIssue' | 'geopolitical' | 'naturalDisaster' | 'cyberSecurity'
}

// ---------------------------------------------------------------------------
// Mock 20 global risk nodes
// ---------------------------------------------------------------------------

const mockRiskNodes: RiskNode[] = [
  { id: 'N01', name: '深圳华芯半导体基地', lat: 22.5, lng: 114.0, severity: 'critical', eventCount: 12, riskSummary: '芯片交付延迟超14天，产能严重不足', nodeType: 'supplier', riskType: 'supplyDisruption' },
  { id: 'N02', name: '上海自贸区仓储港', lat: 31.2, lng: 121.5, severity: 'high', eventCount: 8, riskSummary: '港口拥堵导致物流延迟3-5天', nodeType: 'port', riskType: 'supplyDisruption' },
  { id: 'N03', name: '慕尼黑精密材料工厂', lat: 48.1, lng: 11.6, severity: 'low', eventCount: 2, riskSummary: 'REACH法规更新，需评估合规影响', nodeType: 'site', riskType: 'qualityIssue' },
  { id: 'N04', name: '东京电子元器件中心', lat: 35.7, lng: 139.7, severity: 'medium', eventCount: 5, riskSummary: '日元汇率波动影响采购成本', nodeType: 'supplier', riskType: 'geopolitical' },
  { id: 'N05', name: '唐山钢铁生产基地', lat: 39.6, lng: 118.2, severity: 'critical', eventCount: 15, riskSummary: '环保处罚停产，银行贷款违约风险', nodeType: 'site', riskType: 'qualityIssue' },
  { id: 'N06', name: '新加坡物流枢纽', lat: 1.3, lng: 103.8, severity: 'low', eventCount: 1, riskSummary: '新航线开通，物流效率提升', nodeType: 'port', riskType: 'supplyDisruption' },
  { id: 'N07', name: '底特律汽车零部件仓库', lat: 42.3, lng: -83.0, severity: 'high', eventCount: 7, riskSummary: '关税政策变动影响进口成本', nodeType: 'site', riskType: 'geopolitical' },
  { id: 'N08', name: '台北半导体封测厂', lat: 25.0, lng: 121.5, severity: 'critical', eventCount: 10, riskSummary: '地震预警，产线紧急停工检查', nodeType: 'supplier', riskType: 'naturalDisaster' },
  { id: 'N09', name: '槟城封装测试中心', lat: 5.4, lng: 100.3, severity: 'medium', eventCount: 4, riskSummary: '季风季节物流受阻预警', nodeType: 'site', riskType: 'naturalDisaster' },
  { id: 'N10', name: '鹿特丹港口', lat: 51.9, lng: 4.5, severity: 'medium', eventCount: 6, riskSummary: '欧洲港口罢工风险上升', nodeType: 'port', riskType: 'geopolitical' },
  { id: 'N11', name: '孟买化工供应商', lat: 19.1, lng: 72.9, severity: 'high', eventCount: 9, riskSummary: '原材料价格暴涨，供应不稳定', nodeType: 'supplier', riskType: 'supplyDisruption' },
  { id: 'N12', name: '圣保罗矿业基地', lat: -23.5, lng: -46.6, severity: 'medium', eventCount: 3, riskSummary: '铁矿石出口政策调整预警', nodeType: 'site', riskType: 'geopolitical' },
  { id: 'N13', name: '首尔电池材料中心', lat: 37.6, lng: 127.0, severity: 'low', eventCount: 2, riskSummary: '新型电池材料测试进展顺利', nodeType: 'supplier', riskType: 'qualityIssue' },
  { id: 'N14', name: '墨尔本稀土加工厂', lat: -37.8, lng: 145.0, severity: 'medium', eventCount: 4, riskSummary: '稀土出口限制政策待定', nodeType: 'site', riskType: 'geopolitical' },
  { id: 'N15', name: '迪拜转运港', lat: 25.2, lng: 55.3, severity: 'low', eventCount: 1, riskSummary: '中转效率正常，无异常', nodeType: 'port', riskType: 'supplyDisruption' },
  { id: 'N16', name: '班加罗尔IT服务中心', lat: 12.9, lng: 77.6, severity: 'high', eventCount: 6, riskSummary: '网络攻击事件，数据泄露风险', nodeType: 'site', riskType: 'cyberSecurity' },
  { id: 'N17', name: '武汉光谷研发基地', lat: 30.6, lng: 114.3, severity: 'medium', eventCount: 3, riskSummary: '核心研发人员离职率上升', nodeType: 'site', riskType: 'qualityIssue' },
  { id: 'N18', name: '胡志明市组装工厂', lat: 10.8, lng: 106.7, severity: 'low', eventCount: 2, riskSummary: '劳动法规变化需关注', nodeType: 'supplier', riskType: 'geopolitical' },
  { id: 'N19', name: '洛杉矶港', lat: 33.7, lng: -118.3, severity: 'high', eventCount: 8, riskSummary: '港口拥堵持续，船期延误频繁', nodeType: 'port', riskType: 'supplyDisruption' },
  { id: 'N20', name: '约翰内斯堡矿产供应', lat: -26.2, lng: 28.0, severity: 'critical', eventCount: 11, riskSummary: '矿区罢工导致铂族金属供应中断', nodeType: 'supplier', riskType: 'supplyDisruption' },
]

// ---------------------------------------------------------------------------
// Severity color map
// ---------------------------------------------------------------------------

const severityColor: Record<Severity, string> = {
  critical: '#D64545',
  high: '#EA580C',
  medium: '#D98A00',
  low: '#2E8B57',
  info: '#2F6FED',
}

// ---------------------------------------------------------------------------
// Custom tooltip
// ---------------------------------------------------------------------------

function ScatterTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const node = payload[0].payload as RiskNode
  return (
    <div className="rounded-md border bg-white px-3 py-2 text-xs shadow-md">
      <div className="font-semibold">{node.name}</div>
      <div className="text-muted-foreground">{node.eventCount} 件事件</div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Ranking data derivation
// ---------------------------------------------------------------------------

const topRegions: RankingItem[] = [
  { id: 'R1', name: '华南地区', eventCount: 27, severity: 'critical' },
  { id: 'R2', name: '华北地区', eventCount: 18, severity: 'critical' },
  { id: 'R3', name: '北美西海岸', eventCount: 15, severity: 'high' },
  { id: 'R4', name: '东南亚', eventCount: 12, severity: 'medium' },
  { id: 'R5', name: '南亚', eventCount: 10, severity: 'high' },
  { id: 'R6', name: '西欧', eventCount: 8, severity: 'medium' },
  { id: 'R7', name: '非洲南部', eventCount: 7, severity: 'critical' },
  { id: 'R8', name: '南美', eventCount: 3, severity: 'medium' },
]

const topSites: RankingItem[] = [
  { id: 'S1', name: '唐山钢铁生产基地', eventCount: 15, severity: 'critical' },
  { id: 'S2', name: '深圳华芯半导体', eventCount: 12, severity: 'critical' },
  { id: 'S3', name: '约翰内斯堡矿产', eventCount: 11, severity: 'critical' },
  { id: 'S4', name: '台北半导体封测厂', eventCount: 10, severity: 'critical' },
  { id: 'S5', name: '孟买化工供应商', eventCount: 9, severity: 'high' },
]

// ---------------------------------------------------------------------------
// Helper: map latitude (-90,90) to chart Y (0, 100)
//         map longitude (-180,180) to chart X (0, 100)
// ---------------------------------------------------------------------------

function toChartX(lng: number) {
  return ((lng + 180) / 360) * 100
}

function toChartY(lat: number) {
  return ((lat + 90) / 180) * 100
}

// ---------------------------------------------------------------------------
// RiskMap Page
// ---------------------------------------------------------------------------

export default function RiskMap() {
  const [layers, setLayers] = useState<LayerState>(defaultLayerState)
  const [selectedNode, setSelectedNode] = useState<RiskNode | null>(null)

  // Filter nodes based on layers
  const filteredNodes = useMemo(() => {
    return mockRiskNodes.filter((node) => {
      // Severity filter
      if (!layers[node.severity as keyof LayerState]) return false
      // Node type filter
      if (!layers[node.nodeType as keyof LayerState]) return false
      // Risk type filter
      if (!layers[node.riskType as keyof LayerState]) return false
      return true
    })
  }, [layers])

  // Transform for chart
  const chartData = useMemo(() => {
    return filteredNodes.map((node) => ({
      ...node,
      x: toChartX(node.lng),
      y: toChartY(node.lat),
      z: node.eventCount * 60,
    }))
  }, [filteredNodes])

  const handleNodeClick = useCallback((_: unknown, entry: any) => {
    if (entry?.payload) {
      setSelectedNode(entry.payload as RiskNode)
    }
  }, [])

  return (
    <div className="space-y-4 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">风险地图</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            全球供应链风险分布概览 ({filteredNodes.length} 个活跃节点)
          </p>
        </div>
        <MapSnapshot />
      </div>

      {/* Main content: Map + Sidebar */}
      <div className="flex gap-4">
        {/* Map card */}
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="h-5 w-5 text-muted-foreground" />
              全球风险分布
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <ResponsiveContainer width="100%" height={520}>
              <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
                <XAxis
                  type="number"
                  dataKey="x"
                  domain={[0, 100]}
                  tick={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                  name="经度"
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  domain={[0, 100]}
                  tick={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                  name="纬度"
                />
                <ZAxis type="number" dataKey="z" range={[80, 600]} name="事件数" />
                <Tooltip content={<ScatterTooltip />} cursor={false} />
                <Scatter
                  data={chartData}
                  onClick={handleNodeClick}
                  className="cursor-pointer"
                >
                  {chartData.map((node) => (
                    <Cell
                      key={node.id}
                      fill={severityColor[node.severity]}
                      fillOpacity={0.75}
                      stroke={severityColor[node.severity]}
                      strokeWidth={selectedNode?.id === node.id ? 3 : 1}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>

            {/* Info window for selected node */}
            {selectedNode && (
              <div className="absolute left-1/2 top-4 z-20 -translate-x-1/2">
                <MapInfoWindow
                  name={selectedNode.name}
                  riskSummary={selectedNode.riskSummary}
                  recentEventCount={selectedNode.eventCount}
                  severity={selectedNode.severity}
                  arrowPosition="bottom"
                  onClose={() => setSelectedNode(null)}
                  onViewDetail={() => {
                    setSelectedNode(null)
                  }}
                />
              </div>
            )}

            {/* Legend */}
            <div className="mt-2 flex items-center justify-center gap-4">
              {(['critical', 'high', 'medium', 'low'] as Severity[]).map((s) => (
                <div key={s} className="flex items-center gap-1.5 text-xs">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: severityColor[s] }}
                  />
                  <span className="text-muted-foreground">
                    {s === 'critical' ? '严重' : s === 'high' ? '高危' : s === 'medium' ? '中危' : '低危'}
                  </span>
                </div>
              ))}
              <span className="text-xs text-muted-foreground">
                (节点越大 = 事件越多)
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Right sidebar */}
        <div className="w-[280px] shrink-0 space-y-4">
          <LayerControl layers={layers} onChange={setLayers} />
          <NodeRanking topRegions={topRegions} topSites={topSites} />
        </div>
      </div>
    </div>
  )
}

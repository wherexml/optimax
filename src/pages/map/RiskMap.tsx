import { useEffect, useMemo, useRef, useState } from 'react'
import { Globe } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapInfoWindow } from '@/components/common/MapInfoWindow'
import { LayerControl, defaultLayerState, type LayerState } from '@/components/map/LayerControl'
import { MapSnapshot } from '@/components/map/MapSnapshot'
import { NodeRanking, type RankingItem } from '@/components/map/NodeRanking'
import { RiskWorldMap } from '@/components/map/RiskWorldMap'
import {
  getHigherSeverity,
  severityColor,
  severityLabel,
  type RiskNode,
  type RiskNodeStatus,
} from '@/components/map/risk-map-shared'
import type { Severity } from '@/types/enums'

const DAY_IN_MS = 24 * 60 * 60 * 1000

function daysAgo(days: number) {
  return new Date(Date.now() - days * DAY_IN_MS).toISOString()
}

const mockRiskNodes: RiskNode[] = [
  {
    id: 'N01',
    name: '深圳华芯半导体基地',
    lat: 22.5,
    lng: 114.0,
    severity: 'critical',
    eventCount: 12,
    riskSummary: '芯片交付延迟超 14 天，晶圆排产未恢复，影响下游汽车与消费电子排单。',
    nodeType: 'supplier',
    riskType: 'supplyDisruption',
    region: '华南地区',
    status: 'active',
    updatedAt: daysAgo(2),
  },
  {
    id: 'N02',
    name: '上海自贸区仓储港',
    lat: 31.2,
    lng: 121.5,
    severity: 'high',
    eventCount: 8,
    riskSummary: '港口拥堵持续 3 天，转运箱量积压，进口关键零部件交付被迫后移。',
    nodeType: 'port',
    riskType: 'supplyDisruption',
    region: '华东地区',
    status: 'active',
    updatedAt: daysAgo(4),
  },
  {
    id: 'N03',
    name: '慕尼黑精密材料工厂',
    lat: 48.1,
    lng: 11.6,
    severity: 'low',
    eventCount: 2,
    riskSummary: 'REACH 合规整改已完成，残余风险较低，但需继续观察供应商资质变更。',
    nodeType: 'site',
    riskType: 'qualityIssue',
    region: '西欧',
    status: 'resolved',
    updatedAt: daysAgo(18),
  },
  {
    id: 'N04',
    name: '东京电子元器件中心',
    lat: 35.7,
    lng: 139.7,
    severity: 'medium',
    eventCount: 5,
    riskSummary: '日元波动加大短期采购成本，元器件报价出现 6% 上浮。',
    nodeType: 'supplier',
    riskType: 'geopolitical',
    region: '东北亚',
    status: 'active',
    updatedAt: daysAgo(11),
  },
  {
    id: 'N05',
    name: '唐山钢铁生产基地',
    lat: 39.6,
    lng: 118.2,
    severity: 'critical',
    eventCount: 15,
    riskSummary: '环保处罚导致高炉停摆，订单履约压力扩大，并触发融资违约预警。',
    nodeType: 'site',
    riskType: 'qualityIssue',
    region: '华北地区',
    status: 'active',
    updatedAt: daysAgo(1),
  },
  {
    id: 'N06',
    name: '新加坡物流枢纽',
    lat: 1.3,
    lng: 103.8,
    severity: 'low',
    eventCount: 1,
    riskSummary: '临时分流已完成，转运效率恢复，当前仅保留例行监控。',
    nodeType: 'port',
    riskType: 'supplyDisruption',
    region: '东南亚',
    status: 'resolved',
    updatedAt: daysAgo(6),
  },
  {
    id: 'N07',
    name: '底特律汽车零部件仓库',
    lat: 42.3,
    lng: -83.0,
    severity: 'high',
    eventCount: 7,
    riskSummary: '关税政策扰动导致进口成本上升，北美备件补库周期被拉长。',
    nodeType: 'site',
    riskType: 'geopolitical',
    region: '北美中部',
    status: 'active',
    updatedAt: daysAgo(9),
  },
  {
    id: 'N08',
    name: '台北半导体封测厂',
    lat: 25.0,
    lng: 121.5,
    severity: 'critical',
    eventCount: 10,
    riskSummary: '地震预警触发停线检查，封测产能短时下降，客户交付承诺需重排。',
    nodeType: 'supplier',
    riskType: 'naturalDisaster',
    region: '东北亚',
    status: 'active',
    updatedAt: daysAgo(3),
  },
  {
    id: 'N09',
    name: '槟城封装测试中心',
    lat: 5.4,
    lng: 100.3,
    severity: 'medium',
    eventCount: 4,
    riskSummary: '季风天气影响陆海联运，出货节拍出现波动，仍可通过调拨缓冲。',
    nodeType: 'site',
    riskType: 'naturalDisaster',
    region: '东南亚',
    status: 'active',
    updatedAt: daysAgo(14),
  },
  {
    id: 'N10',
    name: '鹿特丹港口',
    lat: 51.9,
    lng: 4.5,
    severity: 'medium',
    eventCount: 6,
    riskSummary: '港口工会谈判未落地，欧洲转运船期存在延误风险。',
    nodeType: 'port',
    riskType: 'geopolitical',
    region: '西欧',
    status: 'active',
    updatedAt: daysAgo(15),
  },
  {
    id: 'N11',
    name: '孟买化工供应商',
    lat: 19.1,
    lng: 72.9,
    severity: 'high',
    eventCount: 9,
    riskSummary: '化工原料价格急涨，供应商要求重新议价，并提示交期可能拉长。',
    nodeType: 'supplier',
    riskType: 'supplyDisruption',
    region: '南亚',
    status: 'active',
    updatedAt: daysAgo(5),
  },
  {
    id: 'N12',
    name: '圣保罗矿业基地',
    lat: -23.5,
    lng: -46.6,
    severity: 'medium',
    eventCount: 3,
    riskSummary: '出口许可审核恢复正常，矿石出运恢复，但仍保留政策敏感监测。',
    nodeType: 'site',
    riskType: 'geopolitical',
    region: '南美',
    status: 'resolved',
    updatedAt: daysAgo(37),
  },
  {
    id: 'N13',
    name: '首尔电池材料中心',
    lat: 37.6,
    lng: 127.0,
    severity: 'low',
    eventCount: 2,
    riskSummary: '新材料验证持续推进，暂无重大偏差，仅需跟踪良率变化。',
    nodeType: 'supplier',
    riskType: 'qualityIssue',
    region: '东北亚',
    status: 'resolved',
    updatedAt: daysAgo(27),
  },
  {
    id: 'N14',
    name: '墨尔本稀土加工厂',
    lat: -37.8,
    lng: 145.0,
    severity: 'medium',
    eventCount: 4,
    riskSummary: '稀土出口限制仍未定案，下季度合同谈判存在较大不确定性。',
    nodeType: 'site',
    riskType: 'geopolitical',
    region: '大洋洲',
    status: 'active',
    updatedAt: daysAgo(22),
  },
  {
    id: 'N15',
    name: '迪拜转运港',
    lat: 25.2,
    lng: 55.3,
    severity: 'low',
    eventCount: 1,
    riskSummary: '港区运作稳定，承担部分亚欧之间的应急转运兜底任务。',
    nodeType: 'port',
    riskType: 'supplyDisruption',
    region: '中东',
    status: 'active',
    updatedAt: daysAgo(12),
  },
  {
    id: 'N16',
    name: '班加罗尔 IT 服务中心',
    lat: 12.9,
    lng: 77.6,
    severity: 'high',
    eventCount: 6,
    riskSummary: '发现针对供应链系统的定向攻击，需立即轮换密钥并加强接口隔离。',
    nodeType: 'site',
    riskType: 'cyberSecurity',
    region: '南亚',
    status: 'active',
    updatedAt: daysAgo(2),
  },
  {
    id: 'N17',
    name: '武汉光谷研发基地',
    lat: 30.6,
    lng: 114.3,
    severity: 'medium',
    eventCount: 3,
    riskSummary: '关键岗位流失率抬升，短期会拖慢验证节奏与设计交付。',
    nodeType: 'site',
    riskType: 'qualityIssue',
    region: '华中地区',
    status: 'active',
    updatedAt: daysAgo(29),
  },
  {
    id: 'N18',
    name: '胡志明市组装工厂',
    lat: 10.8,
    lng: 106.7,
    severity: 'low',
    eventCount: 2,
    riskSummary: '劳动法规调整已完成合规适配，生产恢复平稳。',
    nodeType: 'supplier',
    riskType: 'geopolitical',
    region: '东南亚',
    status: 'resolved',
    updatedAt: daysAgo(44),
  },
  {
    id: 'N19',
    name: '洛杉矶港',
    lat: 33.7,
    lng: -118.3,
    severity: 'high',
    eventCount: 8,
    riskSummary: '持续拥堵导致船期不稳定，西海岸客户交付 SLA 面临挑战。',
    nodeType: 'port',
    riskType: 'supplyDisruption',
    region: '北美西海岸',
    status: 'active',
    updatedAt: daysAgo(7),
  },
  {
    id: 'N20',
    name: '约翰内斯堡矿产供应',
    lat: -26.2,
    lng: 28.0,
    severity: 'critical',
    eventCount: 11,
    riskSummary: '矿区罢工叠加治安压力，铂族金属供应短线面临中断风险。',
    nodeType: 'supplier',
    riskType: 'supplyDisruption',
    region: '非洲南部',
    status: 'active',
    updatedAt: daysAgo(4),
  },
]

function matchesTimeWindow(updatedAt: string, timeWindow: LayerState['timeWindow']) {
  if (timeWindow === 'all') return true

  const timeWindowDays: Record<Exclude<LayerState['timeWindow'], 'all'>, number> = {
    '7d': 7,
    '30d': 30,
    '90d': 90,
  }

  const updatedAtTs = new Date(updatedAt).getTime()
  if (Number.isNaN(updatedAtTs)) return false

  return Date.now() - updatedAtTs <= timeWindowDays[timeWindow] * DAY_IN_MS
}

function matchesStatus(status: RiskNodeStatus, layers: LayerState) {
  if (status === 'active') return layers.showActive
  return layers.showResolved
}

function toRankingItems(nodes: RiskNode[]) {
  return [...nodes]
    .sort((left, right) => right.eventCount - left.eventCount)
    .slice(0, 5)
    .map((node) => ({
      id: node.id,
      name: node.name,
      eventCount: node.eventCount,
      severity: node.severity,
      lat: node.lat,
      lng: node.lng,
      nodeId: node.id,
    }))
}

export default function RiskMap() {
  const [layers, setLayers] = useState<LayerState>(defaultLayerState)
  const [selectedNode, setSelectedNode] = useState<RiskNode | null>(null)
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)
  const chartRef = useRef<HTMLDivElement>(null)

  const filteredNodes = useMemo(() => {
    return mockRiskNodes.filter((node) => {
      if (!layers[node.severity as keyof LayerState]) return false
      if (!layers[node.nodeType as keyof LayerState]) return false
      if (!layers[node.riskType as keyof LayerState]) return false
      if (!matchesStatus(node.status, layers)) return false
      if (!matchesTimeWindow(node.updatedAt, layers.timeWindow)) return false
      return true
    })
  }, [layers])

  useEffect(() => {
    if (!selectedNode) return
    if (!filteredNodes.some((node) => node.id === selectedNode.id)) {
      setSelectedNode(null)
    }
  }, [filteredNodes, selectedNode])

  const stats = useMemo(() => {
    const bySeverity: Record<Severity, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0,
    }

    for (const node of filteredNodes) {
      bySeverity[node.severity] += 1
    }

    const totalEvents = filteredNodes.reduce((sum, node) => sum + node.eventCount, 0)
    return { bySeverity, totalEvents }
  }, [filteredNodes])

  const { topRegions, topSites, topSuppliers } = useMemo(() => {
    const regionMap = new Map<string, RankingItem>()

    for (const node of filteredNodes) {
      const existing = regionMap.get(node.region)
      if (!existing) {
        regionMap.set(node.region, {
          id: `region-${node.region}`,
          name: node.region,
          eventCount: node.eventCount,
          severity: node.severity,
        })
        continue
      }

      existing.eventCount += node.eventCount
      existing.severity = getHigherSeverity(existing.severity, node.severity)
    }

    return {
      topRegions: [...regionMap.values()]
        .sort((left, right) => right.eventCount - left.eventCount)
        .slice(0, 8),
      topSites: toRankingItems(filteredNodes.filter((node) => node.nodeType === 'site')),
      topSuppliers: toRankingItems(filteredNodes.filter((node) => node.nodeType === 'supplier')),
    }
  }, [filteredNodes])

  const activeFiltersCount = useMemo(() => {
    return Object.entries(layers).filter(([key, value]) => {
      if (key === 'timeWindow') return false
      return typeof value === 'boolean' && !value
    }).length
  }, [layers])

  const handleSelectNode = (node: RiskNode) => {
    setSelectedNode({ ...node })
    setHoveredNodeId(node.id)
  }

  const handleFocusNode = (nodeId: string) => {
    const node =
      filteredNodes.find((item) => item.id === nodeId) ??
      mockRiskNodes.find((item) => item.id === nodeId)
    if (node) {
      handleSelectNode(node)
    }
  }

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">风险地图</h1>
            <Badge variant="secondary" className="font-mono text-xs">
              {filteredNodes.length} 节点
            </Badge>
            {activeFiltersCount > 0 && (
              <Badge variant="outline" className="text-xs">
                {activeFiltersCount} 个筛选器生效
              </Badge>
            )}
            <Badge variant="outline" className="border-cyan-200 bg-cyan-50 text-xs text-cyan-700">
              动态地图模式
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            全球供应链风险分布概览 · {stats.totalEvents} 件风险事件
          </p>
        </div>
        <MapSnapshot chartRef={chartRef} filters={layers} nodes={filteredNodes} />
      </div>

      <div className="flex items-center gap-6 rounded-lg border bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">风险分布:</span>
        </div>
        {(['critical', 'high', 'medium', 'low'] as Severity[]).map((severity) => (
          <div key={severity} className="flex items-center gap-1.5">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: severityColor[severity] }}
            />
            <span className="text-sm font-semibold">{stats.bySeverity[severity]}</span>
            <span className="text-xs text-muted-foreground">{severityLabel[severity]}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <Card className="flex-1" ref={chartRef}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="h-5 w-5 text-muted-foreground" />
              全球风险分布
            </CardTitle>
            <p className="text-sm font-normal text-muted-foreground">
              参考 WorldMonitor 的地图交互方式，支持拖拽、缩放、节点脉冲与侧栏联动定位。
            </p>
          </CardHeader>
          <CardContent className="relative">
            <RiskWorldMap
              nodes={filteredNodes}
              selectedNode={selectedNode}
              hoveredNodeId={hoveredNodeId}
              onNodeClick={handleSelectNode}
              onNodeHover={setHoveredNodeId}
            />

            {selectedNode && (
              <div className="absolute left-1/2 top-4 z-30 -translate-x-1/2">
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

            <div className="bg-slate-950/78 absolute bottom-4 left-4 z-20 rounded-2xl border border-white/10 px-4 py-3 text-white shadow-lg backdrop-blur-md">
              <div className="mb-2 text-xs font-medium tracking-wide text-slate-200">严重级别</div>
              <div className="space-y-1.5">
                {(['critical', 'high', 'medium', 'low'] as Severity[]).map((severity) => (
                  <div key={severity} className="flex items-center gap-2">
                    <span
                      className="inline-block h-3 w-3 rounded-full"
                      style={{ backgroundColor: severityColor[severity] }}
                    />
                    <span className="text-xs text-slate-200">{severityLabel[severity]}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 border-t border-white/10 pt-2 text-[10px] text-slate-300">
                节点大小 = 事件数量
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="w-[280px] shrink-0 space-y-4">
          <LayerControl layers={layers} onChange={setLayers} />
          <NodeRanking
            topRegions={topRegions}
            topSites={topSites}
            topSuppliers={topSuppliers}
            onFocusNode={handleFocusNode}
          />
        </div>
      </div>
    </div>
  )
}

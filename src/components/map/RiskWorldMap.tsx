import { useEffect, useMemo, useRef, useState } from 'react'
import type { Layer, PickingInfo } from '@deck.gl/core'
import { ScatterplotLayer, TextLayer } from '@deck.gl/layers'
import { MapboxOverlay } from '@deck.gl/mapbox'
import { Info, LocateFixed, Minus, Move, Plus } from 'lucide-react'
import maplibregl, { type ProjectionSpecification, type StyleSpecification } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

import {
  nodeTypeLabel,
  severityColor,
  severityLabel,
  severityRank,
  type RiskNode,
} from '@/components/map/risk-map-shared'
import { localizeMapLabels } from '@/components/map/map-locale'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const PRIMARY_STYLE_URL = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
const FALLBACK_STYLE_URL = 'https://tiles.openfreemap.org/styles/dark'

const DEFAULT_CENTER: [number, number] = [64.4068, 33.0314]
const DEFAULT_ZOOM = 1.76
const MIN_ZOOM = 1.15
const MAX_ZOOM = 6
const WORLD_BOUNDS = [
  [-179.8, -60],
  [179.8, 84],
] as const

const MAP_STYLE_ID = 'risk-map-deckgl-styles'
const MERCATOR_PROJECTION: ProjectionSpecification = { type: 'mercator' }
const EMPTY_STYLE: StyleSpecification = {
  version: 8,
  projection: MERCATOR_PROJECTION,
  sources: {},
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: {
        'background-color': '#050816',
      },
    },
  ],
}

interface RiskWorldMapProps {
  nodes: RiskNode[]
  selectedNode: RiskNode | null
  hoveredNodeId?: string | null
  className?: string
  onNodeClick: (node: RiskNode) => void
  onNodeHover: (nodeId: string | null) => void
}

type RemoteStyle = StyleSpecification & {
  projection?: ProjectionSpecification
}

function clampZoom(zoom: number) {
  return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom))
}

function getFocusZoom(node: RiskNode) {
  return clampZoom(2.8 + Math.min(1.15, node.eventCount / 12))
}

function hexToRgb(hex: string): [number, number, number] {
  const normalized = hex.replace('#', '')
  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map((part) => `${part}${part}`)
          .join('')
      : normalized

  return [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16),
  ]
}

function getNodeRadius(node: RiskNode) {
  return 18_000 + node.eventCount * 2_600
}

function normalizeStyleSpecification(style: RemoteStyle): StyleSpecification {
  return {
    ...style,
    projection: style.projection ?? MERCATOR_PROJECTION,
  }
}

async function loadStyleSpecification(url: string) {
  const response = await window.fetch(url, { mode: 'cors' })
  if (!response.ok) {
    throw new Error(`Failed to load map style: ${url} (${response.status})`)
  }

  const style = (await response.json()) as RemoteStyle
  return normalizeStyleSpecification(style)
}

function ensureMapStyles() {
  if (document.getElementById(MAP_STYLE_ID)) return

  const style = document.createElement('style')
  style.id = MAP_STYLE_ID
  style.textContent = `
    .risk-map-shell .maplibregl-map {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }

    .risk-map-shell .maplibregl-canvas-container,
    .risk-map-shell .maplibregl-canvas {
      width: 100%;
      height: 100%;
      outline: none;
    }

    .risk-map-shell .maplibregl-control-container,
    .risk-map-shell .maplibregl-ctrl-logo,
    .risk-map-shell .maplibregl-ctrl-attrib {
      display: none !important;
    }
  `

  document.head.appendChild(style)
}

export function RiskWorldMap({
  nodes,
  selectedNode,
  hoveredNodeId,
  className,
  onNodeClick,
  onNodeHover,
}: RiskWorldMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const overlayRef = useRef<MapboxOverlay | null>(null)
  const onNodeClickRef = useRef(onNodeClick)
  const onNodeHoverRef = useRef(onNodeHover)
  const selectedNodeIdRef = useRef<string | null>(null)
  const usingFallbackStyleRef = useRef(false)

  const [mapReady, setMapReady] = useState(false)
  const [viewZoom, setViewZoom] = useState(DEFAULT_ZOOM)
  const [pulseTime, setPulseTime] = useState(() => Date.now())

  useEffect(() => {
    onNodeClickRef.current = onNodeClick
  }, [onNodeClick])

  useEffect(() => {
    onNodeHoverRef.current = onNodeHover
  }, [onNodeHover])

  const visibleRegions = useMemo(() => new Set(nodes.map((node) => node.region)).size, [nodes])

  const zoomLabel = viewZoom <= 1.85 ? '全球态势' : viewZoom <= 3.2 ? '区域聚焦' : '节点排查'

  const sortedNodes = useMemo(() => {
    return [...nodes].sort((left, right) => {
      const severityGap = severityRank[left.severity] - severityRank[right.severity]
      if (severityGap !== 0) return severityGap
      return left.eventCount - right.eventCount
    })
  }, [nodes])

  const highlightedNodes = useMemo(() => {
    return sortedNodes.filter(
      (node) =>
        node.id === selectedNode?.id ||
        node.id === hoveredNodeId ||
        (selectedNode == null && hoveredNodeId == null && node.severity === 'critical'),
    )
  }, [hoveredNodeId, selectedNode, sortedNodes])

  const labelNodes = useMemo(() => {
    return sortedNodes.filter((node) => node.id === selectedNode?.id || node.id === hoveredNodeId)
  }, [hoveredNodeId, selectedNode, sortedNodes])

  useEffect(() => {
    ensureMapStyles()
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPulseTime(Date.now())
    }, 420)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    let disposed = false
    let resizeObserver: ResizeObserver | null = null

    const syncViewZoom = () => {
      const map = mapRef.current
      if (!map) return
      setViewZoom(map.getZoom())
    }

    const swapToFallbackStyle = async () => {
      const map = mapRef.current
      if (!map || usingFallbackStyleRef.current) return

      usingFallbackStyleRef.current = true

      try {
        const fallbackStyle = await loadStyleSpecification(FALLBACK_STYLE_URL)
        if (!mapRef.current || disposed) return
        map.setStyle(fallbackStyle)
      } catch {
        // Keep current map if fallback loading also fails.
      }
    }

    const bootMap = async () => {
      let initialStyle = EMPTY_STYLE

      try {
        initialStyle = await loadStyleSpecification(PRIMARY_STYLE_URL)
      } catch {
        usingFallbackStyleRef.current = true
        try {
          initialStyle = await loadStyleSpecification(FALLBACK_STYLE_URL)
        } catch {
          initialStyle = EMPTY_STYLE
        }
      }

      if (disposed || !containerRef.current) return

      const map = new maplibregl.Map({
        container: containerRef.current,
        style: initialStyle,
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        pitch: 0,
        bearing: 0,
        minZoom: MIN_ZOOM,
        maxZoom: MAX_ZOOM,
        maxBounds: WORLD_BOUNDS as maplibregl.LngLatBoundsLike,
        renderWorldCopies: false,
        attributionControl: false,
        dragRotate: false,
        pitchWithRotate: false,
        touchPitch: false,
        boxZoom: false,
      } as unknown as maplibregl.MapOptions & { preserveDrawingBuffer?: boolean })

      const overlay = new MapboxOverlay({
        interleaved: true,
        layers: [],
        pickingRadius: 10,
        useDevicePixels: window.devicePixelRatio > 2 ? 2 : true,
      })

      mapRef.current = map
      overlayRef.current = overlay

      map.on('load', () => {
        map.setProjection(MERCATOR_PROJECTION)
        localizeMapLabels(map, 'zh')
        map.addControl(overlay as unknown as maplibregl.IControl)
        map.jumpTo({
          center: DEFAULT_CENTER,
          zoom: DEFAULT_ZOOM,
        })
        map.resize()
        syncViewZoom()
        setMapReady(true)
      })

      map.on('style.load', () => {
        map.setProjection(MERCATOR_PROJECTION)
        localizeMapLabels(map, 'zh')
      })

      map.on('moveend', syncViewZoom)
      map.on('zoomend', syncViewZoom)
      map.on('mouseleave', () => {
        map.getCanvas().style.cursor = ''
        onNodeHoverRef.current(null)
      })

      map.on('error', (event) => {
        const message = event.error?.message ?? ''
        if (
          message.includes('Failed to fetch') ||
          message.includes('AJAXError') ||
          message.includes('CORS') ||
          message.includes('NetworkError') ||
          message.includes('403') ||
          message.includes('Forbidden')
        ) {
          void swapToFallbackStyle()
        }
      })

      resizeObserver = new ResizeObserver(() => {
        map.resize()
      })
      resizeObserver.observe(containerRef.current)
      requestAnimationFrame(() => map.resize())
    }

    void bootMap()

    return () => {
      disposed = true
      setMapReady(false)
      resizeObserver?.disconnect()
      overlayRef.current?.finalize()
      overlayRef.current = null
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    const overlay = overlayRef.current
    if (!map || !overlay || !mapReady) return

    const pulseScale = 1 + 0.55 * (0.5 + 0.5 * Math.sin(pulseTime / 320))

    const layers: Layer[] = [
      new ScatterplotLayer<RiskNode>({
        id: 'risk-node-glow',
        data: sortedNodes,
        pickable: false,
        opacity: 1,
        radiusUnits: 'meters',
        getPosition: (node) => [node.lng, node.lat],
        getRadius: (node) => getNodeRadius(node) * 1.45,
        radiusMinPixels: 12,
        radiusMaxPixels: 34,
        stroked: false,
        getFillColor: (node) => {
          const [r, g, b] = hexToRgb(severityColor[node.severity])
          const alpha = node.id === selectedNode?.id ? 92 : node.id === hoveredNodeId ? 80 : 36
          return [r, g, b, alpha] as [number, number, number, number]
        },
        updateTriggers: {
          getFillColor: [selectedNode?.id, hoveredNodeId],
        },
      }),
      new ScatterplotLayer<RiskNode>({
        id: 'risk-node-base',
        data: sortedNodes,
        pickable: true,
        opacity: 1,
        radiusUnits: 'meters',
        getPosition: (node) => [node.lng, node.lat],
        getRadius: (node) => getNodeRadius(node),
        radiusMinPixels: 6,
        radiusMaxPixels: 24,
        stroked: true,
        lineWidthUnits: 'pixels',
        getFillColor: (node) => {
          const [r, g, b] = hexToRgb(severityColor[node.severity])
          return [r, g, b, 214] as [number, number, number, number]
        },
        getLineColor: (node) => {
          if (node.id === selectedNode?.id)
            return [255, 255, 255, 255] as [number, number, number, number]
          if (node.id === hoveredNodeId)
            return [226, 232, 240, 255] as [number, number, number, number]
          return [15, 23, 42, 180] as [number, number, number, number]
        },
        getLineWidth: (node) =>
          node.id === selectedNode?.id || node.id === hoveredNodeId ? 3 : 1.6,
        onHover: (info: PickingInfo<RiskNode>) => {
          map.getCanvas().style.cursor = info.object ? 'pointer' : ''
          onNodeHoverRef.current(info.object?.id ?? null)
        },
        onClick: (info: PickingInfo<RiskNode>) => {
          if (!info.object) return
          onNodeClickRef.current(info.object)
        },
        updateTriggers: {
          getLineColor: [selectedNode?.id, hoveredNodeId],
          getLineWidth: [selectedNode?.id, hoveredNodeId],
        },
      }),
    ]

    if (highlightedNodes.length > 0) {
      layers.push(
        new ScatterplotLayer<RiskNode>({
          id: 'risk-node-pulse',
          data: highlightedNodes,
          pickable: false,
          opacity: 1,
          radiusUnits: 'meters',
          getPosition: (node) => [node.lng, node.lat],
          getRadius: (node) => getNodeRadius(node) * 1.08,
          radiusScale: pulseScale,
          radiusMinPixels: 10,
          radiusMaxPixels: 38,
          filled: false,
          stroked: true,
          lineWidthUnits: 'pixels',
          lineWidthMinPixels: 1.5,
          getLineColor: (node) => {
            const [r, g, b] = hexToRgb(severityColor[node.severity])
            const alpha = node.id === selectedNode?.id ? 140 : 100
            return [r, g, b, alpha] as [number, number, number, number]
          },
          updateTriggers: {
            radiusScale: [pulseScale],
            getLineColor: [selectedNode?.id, hoveredNodeId],
          },
        }),
      )
    }

    if (labelNodes.length > 0) {
      layers.push(
        new TextLayer<RiskNode>({
          id: 'risk-node-label',
          data: labelNodes,
          pickable: false,
          billboard: true,
          sizeUnits: 'pixels',
          getText: (node) => node.name,
          getPosition: (node) => [node.lng, node.lat],
          getColor: [248, 250, 252, 255],
          getSize: 12,
          getPixelOffset: [0, -26],
          getTextAnchor: 'middle',
          getAlignmentBaseline: 'bottom',
          background: true,
          getBackgroundColor: [2, 6, 23, 226],
          backgroundPadding: [8, 5, 8, 5],
          fontFamily: 'system-ui, sans-serif',
          fontWeight: 700,
          parameters: {
            depthTest: false,
          } as Record<string, unknown>,
        }),
      )

      layers.push(
        new TextLayer<RiskNode>({
          id: 'risk-node-subtitle',
          data: labelNodes,
          pickable: false,
          billboard: true,
          sizeUnits: 'pixels',
          getText: (node) =>
            `${severityLabel[node.severity]} · ${node.eventCount} 件 · ${nodeTypeLabel[node.nodeType]}`,
          getPosition: (node) => [node.lng, node.lat],
          getColor: [203, 213, 225, 255],
          getSize: 10,
          getPixelOffset: [0, -12],
          getTextAnchor: 'middle',
          getAlignmentBaseline: 'bottom',
          background: true,
          getBackgroundColor: [2, 6, 23, 226],
          backgroundPadding: [8, 0, 8, 7],
          fontFamily: 'system-ui, sans-serif',
          fontWeight: 500,
          parameters: {
            depthTest: false,
          } as Record<string, unknown>,
        }),
      )
    }

    overlay.setProps({ layers })
  }, [hoveredNodeId, labelNodes, mapReady, pulseTime, selectedNode, sortedNodes, highlightedNodes])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapReady || !selectedNode) return
    if (selectedNodeIdRef.current === selectedNode.id) return

    selectedNodeIdRef.current = selectedNode.id
    map.flyTo({
      center: [selectedNode.lng, selectedNode.lat],
      zoom: getFocusZoom(selectedNode),
      speed: 0.95,
      curve: 1.3,
      essential: true,
    })
  }, [mapReady, selectedNode])

  useEffect(() => {
    if (selectedNode) return
    selectedNodeIdRef.current = null
  }, [selectedNode])

  const adjustZoom = (delta: number) => {
    const map = mapRef.current
    if (!map) return

    map.easeTo({
      zoom: clampZoom(map.getZoom() + delta),
      duration: 320,
      essential: true,
    })
  }

  const resetView = () => {
    const map = mapRef.current
    if (!map) return

    selectedNodeIdRef.current = null
    onNodeHoverRef.current(null)
    map.easeTo({
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      pitch: 0,
      bearing: 0,
      duration: 700,
      essential: true,
    })
  }

  return (
    <div
      className={cn(
        'risk-map-shell relative h-[520px] overflow-hidden rounded-[28px] border border-slate-200/80 bg-slate-950 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.55)]',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(96,165,250,0.14),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(56,189,248,0.1),transparent_22%),radial-gradient(circle_at_50%_78%,rgba(251,113,133,0.08),transparent_30%),linear-gradient(180deg,rgba(15,23,42,0.24),rgba(15,23,42,0.1))]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-24 bg-gradient-to-b from-white/10 via-transparent to-transparent" />

      <div ref={containerRef} className="absolute inset-0" />

      <div className="bg-slate-950/82 absolute left-4 top-4 z-20 max-w-[300px] rounded-2xl border border-white/15 px-4 py-3 text-white shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-slate-300/80">
          <Move className="h-3.5 w-3.5" />
          动态地图
        </div>
        <div className="mt-2 text-lg font-semibold">全球供应链风险态势</div>
        <p className="mt-1 text-xs leading-5 text-slate-300">
          直接参考 WorldMonitor 的平面底图与数据图层渲染方式，点位与地图坐标严格绑定。
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
          <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-slate-100">
            {zoomLabel}
          </span>
          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-cyan-100">
            {nodes.length} 个节点
          </span>
          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-emerald-100">
            {visibleRegions} 个区域
          </span>
          {selectedNode && (
            <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-amber-50">
              {selectedNode.region}
            </span>
          )}
        </div>
      </div>

      <div className="absolute right-4 top-4 z-20 flex flex-col gap-2">
        <Button
          variant="secondary"
          size="icon"
          className="bg-slate-900/86 h-9 w-9 rounded-xl border border-white/10 text-white shadow-md backdrop-blur hover:bg-slate-800"
          onClick={() => adjustZoom(0.45)}
          aria-label="放大地图"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="bg-slate-900/86 h-9 w-9 rounded-xl border border-white/10 text-white shadow-md backdrop-blur hover:bg-slate-800"
          onClick={() => adjustZoom(-0.45)}
          aria-label="缩小地图"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="bg-slate-900/86 h-9 w-9 rounded-xl border border-white/10 text-white shadow-md backdrop-blur hover:bg-slate-800"
          onClick={resetView}
          aria-label="重置地图视角"
        >
          <LocateFixed className="h-4 w-4" />
        </Button>
      </div>

      <div className="bg-slate-950/74 absolute bottom-4 right-4 z-20 rounded-2xl border border-white/10 px-3 py-2 text-xs text-slate-200 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Info className="h-3.5 w-3.5 text-cyan-300" />
          <span>
            {selectedNode
              ? `${selectedNode.name} · ${severityLabel[selectedNode.severity]}`
              : '点击节点可查看详情'}
          </span>
        </div>
      </div>

      {nodes.length === 0 && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="rounded-2xl border border-dashed border-white/15 bg-slate-950/75 px-5 py-4 text-center text-sm text-slate-200 backdrop-blur">
            当前筛选条件下暂无风险节点
          </div>
        </div>
      )}
    </div>
  )
}

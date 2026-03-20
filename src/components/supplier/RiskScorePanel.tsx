import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { AlertTriangle, ArrowUp, ArrowDown, Minus, RotateCcw } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { MockSupplierRiskFactor, MockScoreTrend } from '@/mocks/data/suppliers'
import type { Trend } from '@/types/enums'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RiskScorePanelProps {
  riskScore: number
  riskFactors: MockSupplierRiskFactor[]
  scoreTrend: MockScoreTrend[]
  recurrenceCount: number
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getRiskLevel(score: number): { label: string; color: string; bgColor: string } {
  if (score >= 80) return { label: '高危', color: '#DC2626', bgColor: '#FEF2F2' }
  if (score >= 60) return { label: '中危', color: '#D97706', bgColor: '#FFFBEB' }
  if (score >= 40) return { label: '关注', color: '#2563EB', bgColor: '#EFF6FF' }
  return { label: '低危', color: '#16A34A', bgColor: '#F0FDF4' }
}

function TrendIcon({ trend }: { trend: Trend }) {
  if (trend === 'up') return <ArrowUp className="h-3 w-3 text-red-500" />
  if (trend === 'down') return <ArrowDown className="h-3 w-3 text-green-500" />
  return <Minus className="h-3 w-3 text-gray-400" />
}

// ---------------------------------------------------------------------------
// Circular Progress Ring
// ---------------------------------------------------------------------------

function ScoreRing({ score, color }: { score: number; color: string }) {
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const progress = (score / 100) * circumference
  const offset = circumference - progress

  return (
    <svg width="180" height="180" viewBox="0 0 180 180">
      <circle
        cx="90"
        cy="90"
        r={radius}
        fill="none"
        stroke="#E5E7EB"
        strokeWidth="10"
      />
      <circle
        cx="90"
        cy="90"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 90 90)"
        className="transition-all duration-700 ease-out"
      />
      <text
        x="90"
        y="82"
        textAnchor="middle"
        className="fill-foreground text-4xl font-bold"
        fontSize="40"
        fontWeight="700"
      >
        {score}
      </text>
      <text
        x="90"
        y="105"
        textAnchor="middle"
        className="fill-muted-foreground text-xs"
        fontSize="12"
      >
        / 100
      </text>
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function RiskScorePanel({
  riskScore,
  riskFactors,
  scoreTrend,
  recurrenceCount,
}: RiskScorePanelProps) {
  const riskLevel = getRiskLevel(riskScore)

  const radarData = riskFactors.map((f) => ({
    dimension: f.dimension,
    score: f.score,
    fullMark: 100,
  }))

  return (
    <div className="space-y-6">
      {/* Top row: Score ring + Risk level + Recurrence */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Overall score */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              总体风险评分
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-3">
            <ScoreRing score={riskScore} color={riskLevel.color} />
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold"
              style={{ backgroundColor: riskLevel.bgColor, color: riskLevel.color }}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              {riskLevel.label}
            </span>
          </CardContent>
        </Card>

        {/* Radar chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              评分因子雷达图
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis
                    dataKey="dimension"
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fontSize: 10, fill: '#9CA3AF' }}
                    axisLine={false}
                  />
                  <Radar
                    name="风险评分"
                    dataKey="score"
                    stroke={riskLevel.color}
                    fill={riskLevel.color}
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            {/* Factor detail list */}
            <div className="mt-2 grid grid-cols-3 gap-x-4 gap-y-1 text-xs">
              {riskFactors.map((f) => (
                <div key={f.dimension} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{f.dimension}</span>
                  <span className="flex items-center gap-1 font-medium">
                    {f.score}
                    <TrendIcon trend={f.trend} />
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row: Trend chart + Recurrence */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              近12月评分趋势
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    tickFormatter={(v: string) => v.slice(5)}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB',
                      fontSize: '12px',
                    }}
                    formatter={(value) => [`${value} 分`, '风险评分']}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke={riskLevel.color}
                    strokeWidth={2}
                    dot={{ r: 3, fill: riskLevel.color }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              风险复发记录
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-3 pt-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-50">
              <RotateCcw className="h-8 w-8 text-orange-500" />
            </div>
            <div className="text-center">
              <p className={cn(
                'text-3xl font-bold',
                recurrenceCount > 0 ? 'text-orange-600' : 'text-green-600'
              )}>
                {recurrenceCount}
              </p>
              <p className="text-xs text-muted-foreground">条复发事件</p>
            </div>
            {recurrenceCount > 0 && (
              <p className="text-center text-xs text-orange-600">
                存在重复风险模式，建议深入分析根因
              </p>
            )}
            {recurrenceCount === 0 && (
              <p className="text-center text-xs text-green-600">
                暂无复发记录，风险管理良好
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

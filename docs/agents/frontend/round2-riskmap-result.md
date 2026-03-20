# OptiMax 风险地图功能 - Round 2 开发结果

> **开发日期**: 2026-03-20
> **负责人**: Frontend Agent
> **任务范围**: FE-060 ~ FE-063

---

## 一、任务完成概览

| 任务ID | 标题 | 状态 | 文件路径 |
|--------|------|------|----------|
| FE-060 | RiskMap.tsx 主画布完善 | ✅ 完成 | `src/pages/map/RiskMap.tsx` |
| FE-061 | LayerControl.tsx 图层控制完善 | ✅ 完成 | `src/components/map/LayerControl.tsx` |
| FE-062 | NodeRanking.tsx 节点排行完善 | ✅ 完成 | `src/components/map/NodeRanking.tsx` |
| FE-063 | MapSnapshot.tsx 地图快照完善 | ✅ 完成 | `src/components/map/MapSnapshot.tsx` |

---

## 二、功能实现详情

### 2.1 FE-060: RiskMap.tsx 主画布完善

#### 核心功能
- **世界地图散点图**: 使用 Recharts ScatterChart 展示 20+ 全球风险节点
- **动态节点大小**: 根据事件数量动态计算节点大小 (z = eventCount * 50 + 100)
- **交互效果**:
  - 点击节点显示 MapInfoWindow 弹窗
  - Hover 时透明度变化和高亮边框
  - 选中节点时 4px 粗边框
- **统计面板**: 顶部显示各严重级别节点数量统计
- **悬浮图例**: 左下角显示严重级别图例和节点大小说明

#### 新增依赖
```typescript
// 新增导入
import { Info } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
```

#### 数据增强
- 添加 `topSuppliers` 供应商排行数据
- 排行项增加 `lat`/`lng`/`nodeId` 字段用于地图联动

---

### 2.2 FE-061: LayerControl.tsx 图层控制完善

#### 新增筛选维度
| 筛选类型 | 选项 | 说明 |
|----------|------|------|
| **时间范围** | 近7天 / 近30天 / 近90天 / 全部 | Select 下拉选择 |
| **事件状态** | 活跃中 / 已解决 | Switch 开关 |
| **风险类型** | 供应中断 / 质量问题 / 地缘政治 / 自然灾害 / 网络安全 | Switch 开关 |
| **节点类型** | 供应商 / 站点 / 港口 | Switch 开关 |
| **严重级别** | 严重 / 高危 / 中危 / 低危 | Switch 开关 |

#### 新增功能
- **折叠面板**: 使用 Collapsible 组件，可收起/展开
- **重置按钮**: 一键重置所有筛选条件到默认状态
- **保存视图**: 将当前筛选配置保存到 localStorage
- **已保存视图列表**: 显示最近 5 个保存的视图
- **筛选计数**: 显示当前生效的筛选器数量

#### LayerState 扩展
```typescript
export interface LayerState {
  // ... 原有字段
  timeWindow: '7d' | '30d' | '90d' | 'all'
  showActive: boolean
  showResolved: boolean
}
```

---

### 2.3 FE-062: NodeRanking.tsx 节点排行完善

#### 功能增强
- **供应商排行**: 新增 Top 风险供应商排行列表
- **可展开明细**: 使用 Collapsible 组件，点击排行项展开详情
- **地图定位**: 展开详情后显示"地图定位"按钮，点击联动主地图
- **查看详情**: 跳转到供应商画像页 (`/suppliers/:id`)

#### 交互流程
1. 点击排行项 -> 展开详情面板
2. 详情面板显示:
   - 事件数量
   - 地理坐标 (lat, lng)
   - "地图定位"按钮 (如果有 nodeId)
   - "查看详情"按钮

#### 排行联动
```typescript
interface NodeRankingProps {
  topRegions: RankingItem[]
  topSites: RankingItem[]
  topSuppliers?: RankingItem[]
  onFocusNode?: (nodeId: string) => void  // 新增
}
```

---

### 2.4 FE-063: MapSnapshot.tsx 地图快照完善

#### 核心功能
- **PNG 导出**: 使用 `html-to-image` 库实现真正的 DOM 转 PNG
- **水印功能**: 自动添加时间戳、筛选条件、节点数水印
- **添加到报告**: 支持将快照保存到报告草稿
- **预览弹窗**: 添加到报告前显示预览

#### 导出流程
```
导出快照:
  1. 克隆地图 DOM 元素
  2. 动态添加水印 div
  3. 临时挂载到 document
  4. 调用 toPng() 生成 DataURL
  5. 创建下载链接
  6. 清理临时元素
```

#### 水印内容
```
OptiMax 风险地图 · 2026-03-20 14:30:00
筛选条件: 级别:严重,高危 · 时间:30d
节点数: 15
```

#### 报告集成
- 快照数据存储到 localStorage: `riskMapSnapshots`
- 存储字段: id, name, note, imageUrl, timestamp, filters, nodeCount
- 点击"去报告中心"跳转到 `/reports`

#### 新增依赖
```bash
pnpm add html-to-image
```

---

## 三、UI/UX 改进

### RiskMap.tsx
- 标题区域添加节点数量 Badge
- 新增筛选器生效数量提示
- 优化 Tooltip 内容 (显示节点类型、风险类型、事件数)
- 左下角悬浮图例面板
- 右下角位置指示器

### LayerControl.tsx
- 折叠/展开动画
- 分组标题使用大写跟踪样式
- 重置/保存按钮图标
- 已保存视图列表带时间戳

### NodeRanking.tsx
- 可展开详情面板
- 地图定位按钮 (Navigation 图标)
- 查看详情按钮 (ExternalLink 图标)
- 排行序号前3名高亮显示

### MapSnapshot.tsx
- 双按钮布局: "导出快照" + "添加到报告"
- 导出时显示 Loading 状态
- 预览弹窗显示快照缩略图
- 表单验证 (名称必填)

---

## 四、TypeScript 类型更新

### RankingItem 扩展
```typescript
export interface RankingItem {
  id: string
  name: string
  eventCount: number
  severity: Severity
  lat?: number        // 新增
  lng?: number        // 新增
  nodeId?: string     // 新增
}
```

### LayerState 扩展
```typescript
export interface LayerState {
  // ... 原有布尔字段
  timeWindow: '7d' | '30d' | '90d' | 'all'  // 新增
  showActive: boolean                        // 新增
  showResolved: boolean                      // 新增
}
```

---

## 五、构建结果

```
✅ TypeScript 编译通过
✅ Vite 构建成功 (731ms)
✅ 零错误，零警告

主要输出文件:
- dist/assets/RiskMap-C3g14D0p.js (50.04 kB │ gzip: 17.38 kB)
- dist/assets/index-jaUVSJSh.js (226.64 kB │ gzip: 71.70 kB)
- dist/assets/index-BUZAYkvT.css (63.55 kB │ gzip: 12.11 kB)
```

---

## 六、验收标准验证

| 验收项 | 状态 | 说明 |
|--------|------|------|
| 世界地图散点图展示 20+ 风险节点 | ✅ | 20个全球节点，覆盖亚洲/欧洲/北美/南美/非洲/澳洲 |
| 图层控制面板可筛选严重级别/节点类型/风险类型 | ✅ | 5类筛选维度，含时间范围和事件状态 |
| 右侧面板显示区域排行和站点排行 | ✅ | 三列排行：区域/站点/供应商 |
| 地图快照导出功能 | ✅ | PNG导出 + 水印 + 报告集成 |
| TypeScript 零错误，pnpm build 通过 | ✅ | 构建成功 |
| 点击节点显示 MapInfoWindow 弹窗 | ✅ | 弹窗显示节点名称/风险摘要/事件数/严重级别 |

---

## 七、使用说明

### 访问风险地图
```
http://localhost:21000/map
```

### 筛选操作
1. 点击右侧面板"图层控制"展开筛选选项
2. 切换各类开关筛选节点
3. 点击"重置"按钮恢复默认
4. 点击"保存"按钮保存当前视图

### 排行联动
1. 点击右侧面板"风险排行"中的任意站点
2. 展开详情面板
3. 点击"地图定位"按钮，主地图会高亮对应节点
4. 点击"查看详情"跳转到供应商画像

### 导出快照
1. 点击右上角"导出快照"按钮下载 PNG
2. 或点击"添加到报告"保存到报告草稿
3. 在弹窗中填写快照名称和备注
4. 点击"去报告中心"跳转到报告页面

---

## 八、后续优化建议

1. **性能优化**: 当地图节点超过 100 个时考虑虚拟化
2. **地图增强**: 考虑集成 ECharts Map 或 Leaflet 实现真实地图
3. **筛选联动**: 筛选条件变化时，排行列表同步更新
4. **快照管理**: 添加快照列表页面，支持删除和预览历史快照

---

**报告生成时间**: 2026-03-20
**状态**: 已完成并提交

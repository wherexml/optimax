# OptiMax 设计系统

## 概览

基于 shadcn/ui + Tailwind CSS 的企业级设计系统，提供完整的颜色、字体、间距和阴影令牌。

---

## 颜色系统

### 品牌色

| Token | 值 | 用途 |
|-------|-----|------|
| `brand.DEFAULT` | `#173F5F` | 主品牌色 |
| `accent.DEFAULT` | `#2F6FED` | 强调色 |
| `success.DEFAULT` | `#2E8B57` | 成功色 |
| `warning.DEFAULT` | `#D98A00` | 警告色 |
| `danger.DEFAULT` | `#D64545` | 危险色 |
| `info.DEFAULT` | `#2F6FED` | 信息色 |

### 严重级别色

| 级别 | Token | 色值 |
|------|-------|------|
| 严重 | `severity.critical` | `#D64545` |
| 高危 | `severity.high` | `#EA580C` |
| 中危 | `severity.medium` | `#D98A00` |
| 低危 | `severity.low` | `#2E8B57` |

### 状态色

| 状态 | Token | 色值 |
|------|-------|------|
| 新建 | `status.new` | `#2F6FED` |
| 分析中 | `status.investigating` | `#D98A00` |
| 已解决 | `status.resolved` | `#2E8B57` |

### 中性色

使用 Tailwind 内置的 gray/zinc/slate 色阶。

---

## 字体系统

```typescript
// Tailwind 配置
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'Menlo', 'monospace'],
}

// 字号
h1: { fontSize: '24px', fontWeight: '700', lineHeight: '32px' }
h2: { fontSize: '18px', fontWeight: '600', lineHeight: '28px' }
h3: { fontSize: '16px', fontWeight: '600', lineHeight: '24px' }
body: { fontSize: '14px', fontWeight: '400', lineHeight: '22px' }
small: { fontSize: '12px', fontWeight: '400', lineHeight: '18px' }
```

---

## 间距系统

基于 4px 网格:

| Token | 值 | 用途 |
|-------|-----|------|
| `spacing[1]` | `4px` | 紧凑间距 |
| `spacing[2]` | `8px` | 小间距 |
| `spacing[4]` | `16px` | 默认间距 |
| `spacing[6]` | `24px` | 大间距 |
| `spacing[8]` | `32px` | 区块间距 |

### 语义化间距

| Token | 值 | 用途 |
|-------|-----|------|
| `cardPaddingDefault` | `24px` | 卡片内边距 |
| `pagePaddingDefault` | `24px` | 页面边距 |

---

## 阴影系统

| Token | 用途 |
|-------|------|
| `shadow.sm` | 小元素 (按钮, 输入框) |
| `shadow.md` | 卡片 |
| `shadow.lg` | 下拉菜单 |
| `shadow.xl` | 模态框 |

语义别名: `card`, `cardHover`, `dropdown`, `modal`, `focusRing`

---

## 动画系统

### Framer Motion Variants

```typescript
// 容器交错动画
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

// 淡入上移动画
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
};

// 缩放入场
const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1, scale: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};
```

### 微交互

| 交互 | 效果 |
|------|------|
| 按钮悬停 | `scale: 1.02` + 颜色变化 |
| 卡片悬停 | `y: -2` + 阴影增强 |
| 图标悬停 | `rotate: ±10deg` |
| 复制反馈 | 图标变化 + Sonner Toast |

---

## 组件规范

### 基础组件 (shadcn/ui)

位于 `src/components/ui/`:

| 组件 | 用途 |
|------|------|
| Button | 按钮 (variants: default, destructive, outline, ghost, link) |
| Card | 卡片容器 |
| Badge | 标签 |
| Input | 输入框 |
| Textarea | 多行文本 |
| Dialog | 对话框 |
| Sheet | 侧边抽屉 |
| Popover | 弹出框 |
| Tooltip | 工具提示 |
| Select | 下拉选择 |
| Checkbox | 复选框 |
| Radio | 单选框 |
| Switch | 开关 |
| Accordion | 手风琴 |
| Tabs | 标签页 |
| Table | 表格 |
| Calendar | 日历 |
| DatePicker | 日期选择 |
| Command | 命令面板 |
| Form | 表单 (React Hook Form + Zod) |
| Progress | 进度条 |
| Slider | 滑块 |
| ScrollArea | 滚动区域 |

### 通用业务组件

位于 `src/components/common/`:

| 组件 | 用途 |
|------|------|
| `KPICard` | 仪表盘指标卡 (带 sparkline) |
| `SeverityBadge` | 风险严重级别 |
| `StatusBadge` | 状态指示器 |
| `Timeline` | 活动时间线 |
| `AnimatedContainer` | 统一入场动画容器 |
| `ShortcutHelpModal` | 快捷键帮助弹窗 |
| `ApprovalBar` | 审批工作流 UI |
| `MapInfoWindow` | 地图弹窗 |
| `Toaster` | Toast 通知 |

### 布局组件

位于 `src/components/layout/`:

| 组件 | 用途 |
|------|------|
| `AppShell` | 主布局容器 |
| `Sidebar` | 导航侧边栏 (可折叠) |
| `TopBar` | 顶部导航栏 |
| `ContentArea` | 页面内容区 |
| `GlobalSearch` | 全局搜索 (Cmd+K) |
| `NotificationCenter` | 通知中心 |
| `UserMenu` | 用户下拉菜单 |
| `OrgSwitcher` | 组织切换器 |

### 数据表格

位于 `src/components/DataTable/`:

| 组件 | 用途 |
|------|------|
| `DataTable` | TanStack Table 封装 |
| `FilterBar` | 高级筛选栏 |
| `ActionsCell` | 操作列单元格 |
| `BadgeCell` | 状态列单元格 |
| `TooltipCopyableCell` | 可复制单元格 |

---

## 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Cmd+K` | 全局搜索 |
| `Alt+R` | 重新分析 |
| `Alt+A` | 跳到处置建议 Tab |
| `Alt+M` | 跳到基础信息 Tab |
| `Alt+W` | 跳到工作流 Tab |
| `Alt+D` | 跳到原始数据 Tab |
| `Shift+/` | 显示快捷键帮助 |

---

## 术语规范

| 旧术语 | 新术语 |
|--------|--------|
| 研判 | 分析 |
| 研判结论 | AI 分析结论 |
| 关键特征 | 攻击特征 |
| 研判时间线 | 分析时间线 |

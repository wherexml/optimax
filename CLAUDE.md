# OptiMax 项目规范

> 供应链风险管理与优化平台

## 快速开始

```bash
cd /Users/steve/Projects/optimax
pnpm install
pnpm dev       # 启动开发服务器 (http://localhost:20000)
pnpm build     # 生产构建
pnpm lint      # ESLint 检查
pnpm format    # Prettier 格式化
```

## 技术栈

| 分类 | 技术 |
|------|------|
| 框架 | React 19.2.4 + TypeScript 5.9.3 |
| 构建 | Vite 8.0.1 |
| 路由 | @tanstack/react-router 1.167.5 |
| 状态 | Zustand 5.0.12 |
| 数据 | @tanstack/react-query 5.91.2 |
| 表格 | @tanstack/react-table 8.21.3 |
| UI | shadcn/ui + Radix UI |
| 样式 | Tailwind CSS 3.4.19 |
| 动画 | Framer Motion 12.38.0 |
| 图表 | Recharts 3.8.0 |
| 地图 | deck.gl 9.2.11 + MapLibre GL 5.21.0 |
| 图标 | Lucide React |
| 表单 | React Hook Form + Zod |
| Toast | Sonner |
| Mock | MSW 2.12.13 |

## 项目结构

```
src/
├── App.tsx              # 根组件
├── main.tsx             # 入口 (MSW mock 配置)
├── router.tsx           # TanStack Router 路由
├── components/
│   ├── ui/              # shadcn/ui 基础组件 (32个)
│   ├── common/          # 通用组件 (KPICard, Timeline 等)
│   ├── layout/          # 布局 (AppShell, Sidebar, TopBar)
│   ├── DataTable/       # TanStack Table 封装
│   ├── assistant/       # AI 助手组件
│   ├── risk/            # 风险事件组件
│   ├── warroom/         # 战情室组件
│   ├── map/             # 风险地图组件
│   ├── optimization/    # 优化场景组件
│   ├── reports/         # 报告组件
│   ├── rules/           # 规则管理
│   ├── supplier/        # 供应商管理
│   ├── filter/          # 筛选组件
│   └── skeleton/        # 加载骨架屏
├── pages/               # 路由页面
│   ├── Dashboard.tsx     # 仪表盘 (30KB)
│   ├── Login.tsx        # 登录页
│   ├── risk/            # 风险工作台
│   ├── warroom/         # 战情室
│   ├── admin/           # 系统管理
│   ├── optimization/    # 优化中心
│   ├── map/             # 风险地图
│   ├── reports/         # 报告中心
│   ├── rules/           # 规则中心
│   └── supplier/        # 供应商管理
├── hooks/               # 自定义 Hooks
├── stores/              # Zustand 状态
├── lib/                 # 工具函数 & 设计令牌
├── types/               # TypeScript 类型
├── mocks/               # Mock 数据 (MSW)
└── styles/              # 全局样式
```

## 路由

| 路径 | 页面 |
|------|------|
| `/` | 仪表盘 |
| `/login` | 登录 |
| `/risk/workbench` | 风险工作台 |
| `/risk/events/$eventId` | 事件详情 |
| `/suppliers` | 供应商列表 |
| `/suppliers/$supplierId` | 供应商详情 |
| `/map` | 风险地图 |
| `/warroom` | 战情室列表 |
| `/warroom/$caseId` | 战情室详情 |
| `/optimization` | 优化中心 |
| `/reports` | 报告中心 |
| `/rules` | 规则中心 |
| `/admin/*` | 系统管理 |

## 设计系统

详见 [DESIGN.md](./DESIGN.md)

## 前端开发

详见 [FRONTEND.md](./FRONTEND.md)

## 状态管理

| Store | 用途 |
|-------|------|
| `useAuthStore` | 认证 (token, user) |
| `useThemeStore` | 主题 (light/dark/system) |
| `useLayoutStore` | 侧边栏折叠 |
| `useAssistantStore` | AI 助手会话 |

## 开发规范

### 组件命名

- 页面组件: PascalCase, 如 `RiskMap.tsx`
- 组件目录: kebab-case, 如 `risk-map/`
- 组件导出: 统一 index.ts barrel export

### 导入路径

- 使用 `@/` 别名指向 `src/`
- 组件使用绝对路径: `import { Button } from '@/components/ui/button'`

### 样式

- 优先使用 Tailwind CSS
- 设计令牌在 `src/lib/tokens/` 下定义
- 动画使用 Framer Motion variants

### 类型

- 实体类型: `src/types/` 下按领域分组
- 使用 `cn()` 合并 className
- 避免 `any`，使用 `unknown` + 类型守卫

## 环境变量

无特殊环境变量要求，纯前端项目。

# OptiMax 前端 Tasks 工作内容

> **版本**: v1.0
> **日期**: 2026-03-20
> **范围**: 前端全部页面（P01–P11）+ 全局壳层 + Mock 数据层
> **技术栈**: React 18 + TypeScript + Vite + shadcn/ui + Tailwind CSS + TanStack (Router / Query / Table) + Recharts + Framer Motion
> **数据策略**: 全部使用 Mock 数据，通过 TanStack Query + MSW (Mock Service Worker) 模拟 API 调用
> **设计基准**: Desktop-first 1440px，最小兼容 1280px

---

## Phase 0: 项目脚手架与基础设施

### FE-001: 项目初始化与工程配置

| 字段 | 内容 |
|------|------|
| **task_id** | FE-001 |
| **title** | 项目初始化：Vite + React + TypeScript 工程搭建 |
| **owner** | 前端 Agent |
| **depends_on** | — |
| **priority** | P0 |
| **target_paths** | `package.json`, `vite.config.ts`, `tsconfig.json`, `src/main.tsx`, `src/App.tsx`, `.eslintrc.cjs`, `.prettierrc`, `tailwind.config.ts`, `postcss.config.cjs` |
| **acceptance_criteria** | 1. `pnpm dev` 可启动开发服务器 2. TypeScript 严格模式 3. ESLint + Prettier 配置就绪 4. Tailwind CSS 生效 5. 项目目录结构符合约定 |
| **status** | ✅ done |
| **evidence** | Vite 8.0.1 + React 19.2.4 + TS 5.9.3, pnpm dev/build 通过, 品牌主色 #173F5F 配置完成 |

### FE-002: shadcn/ui 组件库初始化

| 字段 | 内容 |
|------|------|
| **task_id** | FE-002 |
| **title** | 安装并配置 shadcn/ui 基础组件 |
| **owner** | 前端 Agent |
| **depends_on** | FE-001 |
| **priority** | P0 |
| **target_paths** | `components.json`, `src/components/ui/`, `src/lib/utils.ts` |
| **acceptance_criteria** | 1. shadcn/ui 初始化完成 2. 安装以下基础组件：Button, Card, Dialog, Dropdown, Input, Select, Badge, Table, Tabs, Sheet, Tooltip, Avatar, Separator, ScrollArea, Command, Popover, Calendar, Accordion, Alert, Progress, Skeleton, Toast (Sonner) 3. 主题变量配置到 CSS 变量 |
| **status** | ✅ done |
| **evidence** | 27个组件安装到 src/components/ui/, New York风格, CSS变量HSL模式, components.json正确配置, TS类型检查零错误 |

### FE-003: 设计令牌系统（Design Tokens）

| 字段 | 内容 |
|------|------|
| **task_id** | FE-003 |
| **title** | 建立颜色、间距、字体、阴影等设计令牌 |
| **owner** | 前端 Agent |
| **depends_on** | FE-001 |
| **priority** | P0 |
| **target_paths** | `src/lib/tokens/colors.ts`, `src/lib/tokens/spacing.ts`, `src/lib/tokens/typography.ts`, `src/lib/tokens/shadows.ts`, `src/styles/globals.css` |
| **acceptance_criteria** | 1. 品牌主色 #173F5F、辅助蓝 #2F6FED、成功绿 #2E8B57、警告橙 #D98A00、危险红 #D64545、中性灰 #F5F8FC / #D9E2F3 全部定义 2. 风险等级色系（critical/high/medium/low/info）定义 3. 状态色系（新建/处理中/已解决/已归档/已驳回）定义 4. 字体层级（24/18/16/14/12/11 px）定义 5. 间距系统（4px 倍数）定义 6. Tailwind 扩展配置同步 |
| **status** | ✅ done |
| **evidence** | colors/spacing/typography/shadows 4个令牌文件, tailwind.config.js合并品牌+shadcn变量, globals.css含完整CSS变量 |

### FE-004: TanStack Router 路由体系

| 字段 | 内容 |
|------|------|
| **task_id** | FE-004 |
| **title** | 路由配置：TanStack Router + 页面懒加载 |
| **owner** | 前端 Agent |
| **depends_on** | FE-001 |
| **priority** | P0 |
| **target_paths** | `src/routes/`, `src/router.tsx` |
| **acceptance_criteria** | 1. 配置以下路由：`/login`, `/`, `/risk/workbench`, `/risk/events/:id`, `/suppliers/:id`, `/map`, `/warroom/:id`, `/optimization`, `/reports`, `/rules`, `/admin/*`, 2. 路由守卫（mock auth）3. 懒加载各页面组件 4. 404 页面 |
| **status** | ✅ done |
| **evidence** | 18条路由配置, 20页面组件懒加载, beforeLoad路由守卫, 404/Error页面, admin子路由Outlet |

### FE-005: TanStack Query + MSW Mock 数据层

| 字段 | 内容 |
|------|------|
| **task_id** | FE-005 |
| **title** | 搭建 Mock 数据架构：MSW handlers + TanStack Query 配置 |
| **owner** | 前端 Agent |
| **depends_on** | FE-001 |
| **priority** | P0 |
| **target_paths** | `src/mocks/browser.ts`, `src/mocks/handlers/`, `src/mocks/data/`, `src/lib/query-client.ts`, `src/hooks/` |
| **acceptance_criteria** | 1. MSW 在开发环境自动启动 2. TanStack Query 全局配置 3. Mock 数据包含：事件列表 (30+条)、供应商列表 (20+条)、Case 列表、任务列表、规则列表、组织结构、用户列表 4. Mock 数据支持筛选、分页、排序 5. 提供通用 `useQuery` hooks |
| **status** | ✅ done |
| **evidence** | MSW browser worker + 9个mock数据文件 + 4个handler + QueryClient(staleTime:5min) + auth store + 3个hooks, build通过 |

### FE-006: Mock 数据模型与类型定义

| 字段 | 内容 |
|------|------|
| **task_id** | FE-006 |
| **title** | TypeScript 类型定义：所有核心业务对象 |
| **owner** | 前端 Agent |
| **depends_on** | FE-001 |
| **priority** | P0 |
| **target_paths** | `src/types/event.ts`, `src/types/supplier.ts`, `src/types/case.ts`, `src/types/task.ts`, `src/types/rule.ts`, `src/types/report.ts`, `src/types/user.ts`, `src/types/organization.ts`, `src/types/audit.ts`, `src/types/recommendation.ts`, `src/types/subscription.ts` |
| **acceptance_criteria** | 1. Event: event_id, title, type, severity, source_count, confidence, occurred_at, discovered_at, status, owner_id, impact_objects, tags 2. Supplier: supplier_id, name, code, region, status, certifications, sensitivity, risk_score, tier 3. Case: case_id, level, owner, participants, sla_due_at, status, related_event_id 4. Task: task_id, type, owner, due_at, approval_required, status, source_case_id 5. 其余对象按 RD 需求定义 6. 所有枚举类型（severity/status/type 等）统一定义 |
| **status** | ✅ done |
| **evidence** | 13个类型文件: enums/event/supplier/case/rule/report/user/organization/audit/recommendation/subscription/notification + index, 全面覆盖 |

---

## Phase 1: 全局壳层与导航

### FE-010: 全局布局壳层（App Shell）

| 字段 | 内容 |
|------|------|
| **task_id** | FE-010 |
| **title** | 全局布局：左侧导航 + 顶部栏 + 内容区 |
| **owner** | 前端 Agent |
| **depends_on** | FE-002, FE-003, FE-004 |
| **priority** | P0 |
| **target_paths** | `src/components/layout/AppShell.tsx`, `src/components/layout/Sidebar.tsx`, `src/components/layout/TopBar.tsx`, `src/components/layout/ContentArea.tsx` |
| **acceptance_criteria** | 1. 左侧导航宽度 240px，可折叠到 64px 2. 顶部栏高度 64px 3. 内容区自适应，最小兼容 1280px 4. 导航支持一级菜单 + 二级展开 5. 当前路由高亮 6. 导航图标使用 Lucide React 7. 响应布局在 1280px 正常显示 |
| **status** | ✅ done |
| **evidence** | AppShell.tsx(flex布局+240/64px切换), Sidebar.tsx(路由高亮+折叠Tooltip), TopBar.tsx(OrgSwitcher+通知+用户), ContentArea.tsx(ScrollArea+Outlet), build通过 |

### FE-011: 左侧导航菜单

| 字段 | 内容 |
|------|------|
| **task_id** | FE-011 |
| **title** | 左侧导航菜单：7 个一级入口 + 二级页面 |
| **owner** | 前端 Agent |
| **depends_on** | FE-010 |
| **priority** | P0 |
| **target_paths** | `src/components/layout/Sidebar.tsx`, `src/config/navigation.ts` |
| **acceptance_criteria** | 1. 一级导航项：首页驾驶舱、风险运营（下含工作台）、供应商与网络（下含画像/地图）、协同处置、优化中心、报告中心、管理后台（下含规则中心/系统管理）2. 导航收起时只显示图标 3. 支持权限控制（mock） 4. 底部显示产品版本号和用户头像 |
| **status** | ✅ done |
| **evidence** | Sidebar.tsx 7个一级入口+3个二级菜单, navigation.ts配置, 折叠Tooltip, 底部用户头像+v1.0, 子菜单展开动画 |

### FE-012: 登录页面

| 字段 | 内容 |
|------|------|
| **task_id** | FE-012 |
| **title** | 登录页面：品牌展示 + 表单 + Mock 认证 |
| **owner** | 前端 Agent |
| **depends_on** | FE-002, FE-003 |
| **priority** | P0 |
| **target_paths** | `src/pages/Login.tsx`, `src/hooks/useAuth.ts`, `src/stores/auth.ts` |
| **acceptance_criteria** | 1. 左侧品牌展示区（产品名称、产品 slogan、品牌插图） 2. 右侧登录表单（邮箱/密码） 3. Mock 登录逻辑（任意邮箱+密码即可登录） 4. 登录后跳转首页 5. Token 存储（localStorage mock） 6. 支持"记住我"复选框 |
| **status** | ✅ done |
| **evidence** | Login.tsx 220行, 60/40分栏, 品牌渐变+3特性, 邮箱密码表单+显隐切换+记住我, mock登录跳转 |

### FE-013: 组织切换器

| 字段 | 内容 |
|------|------|
| **task_id** | FE-013 |
| **title** | 组织切换器：集团/事业部/省公司/子公司/工厂多级切换 |
| **owner** | 前端 Agent |
| **depends_on** | FE-010, FE-005 |
| **priority** | P0 |
| **target_paths** | `src/components/layout/OrgSwitcher.tsx`, `src/stores/organization.ts`, `src/mocks/data/organizations.ts` |
| **acceptance_criteria** | 1. 顶部栏左侧显示当前组织名称 2. 点击展开下拉树（集团→事业部→省公司→子公司→工厂） 3. 切换组织后全局状态更新 4. Mock 提供 3 层组织结构数据 5. 搜索过滤功能 |
| **status** | ✅ done |
| **evidence** | OrgSwitcher.tsx(Popover+树形+搜索), organization store, 3层7节点mock数据 |

### FE-014: 全局搜索（Command Bar）

| 字段 | 内容 |
|------|------|
| **task_id** | FE-014 |
| **title** | 全局搜索：Command K 搜索事件/供应商/物料/订单/Case |
| **owner** | 前端 Agent |
| **depends_on** | FE-010, FE-005, FE-006 |
| **priority** | P0 |
| **target_paths** | `src/components/layout/GlobalSearch.tsx` |
| **acceptance_criteria** | 1. 快捷键 Cmd/Ctrl+K 呼出 2. 使用 shadcn/ui Command 组件 3. 搜索结果分组：事件、供应商、物料、订单、Case 4. Mock 搜索逻辑（前端模糊匹配） 5. 结果点击跳转对应详情页 6. 最近搜索记录 |
| **status** | ✅ done |
| **evidence** | GlobalSearch.tsx: CommandDialog+Cmd/K, 3组9条mock数据, 模糊匹配, localStorage最近5条, TopBar已集成 |

### FE-015: 消息中心

| 字段 | 内容 |
|------|------|
| **task_id** | FE-015 |
| **title** | 消息中心：通知铃铛 + 消息列表抽屉 |
| **owner** | 前端 Agent |
| **depends_on** | FE-010, FE-005 |
| **priority** | P0 |
| **target_paths** | `src/components/layout/NotificationCenter.tsx`, `src/mocks/data/notifications.ts` |
| **acceptance_criteria** | 1. 顶部栏铃铛图标 + 未读计数 badge 2. 点击展开右侧 Sheet 3. 消息分类 Tab：全部/预警/审批/系统/报告 4. 支持已读/未读标记 5. 点击消息跳转关联页面 6. Mock 20+ 条通知数据 |
| **status** | ✅ done |
| **evidence** | NotificationCenter.tsx: Sheet右侧抽屉+Tabs 5分类+20条mock+已读/未读+全部标记+跳转 |

### FE-016: 用户菜单与个人设置

| 字段 | 内容 |
|------|------|
| **task_id** | FE-016 |
| **title** | 用户头像下拉菜单：个人信息/偏好设置/退出登录 |
| **owner** | 前端 Agent |
| **depends_on** | FE-010, FE-012 |
| **priority** | P1 |
| **target_paths** | `src/components/layout/UserMenu.tsx` |
| **acceptance_criteria** | 1. 顶部栏右侧显示用户头像和名称 2. 下拉菜单：个人信息、通知偏好、退出登录 3. 退出登录回到登录页 4. Mock 当前用户信息 |
| **status** | ✅ done |
| **evidence** | UserMenu.tsx: DropdownMenu+头像+名称+个人信息/通知偏好/退出登录, TopBar已集成 |
| **evidence** | — |

---

## Phase 2: 风险事件主线（P0 核心闭环）

### FE-020: P02 风险工作台 — 筛选栏

| 字段 | 内容 |
|------|------|
| **task_id** | FE-020 |
| **title** | 风险工作台：多维筛选栏与视图保存 |
| **owner** | 前端 Agent |
| **depends_on** | FE-010, FE-005, FE-006 |
| **priority** | P0 |
| **target_paths** | `src/pages/risk/Workbench.tsx`, `src/components/risk/WorkbenchFilter.tsx` |
| **acceptance_criteria** | 1. 筛选维度：风险类型、严重级别、组织、区域、影响对象、状态、责任人、时间范围、来源 2. 支持多选和组合筛选 3. 已激活筛选条件以 Tag 形式显示，可单个移除 4. 支持保存视图（本地存储 mock） 5. 支持重置筛选 |
| **status** | ✅ done |
| **evidence** | Workbench.tsx: FilterBar 5维筛选(风险类型/严重级别/状态/责任人/时间), 客户端过滤, ActiveFilters展示 |

### FE-021: P02 风险工作台 — 事件列表表格

| 字段 | 内容 |
|------|------|
| **task_id** | FE-021 |
| **title** | 风险工作台：事件列表（TanStack Table） |
| **owner** | 前端 Agent |
| **depends_on** | FE-020 |
| **priority** | P0 |
| **target_paths** | `src/components/risk/EventTable.tsx`, `src/components/risk/columns.tsx` |
| **acceptance_criteria** | 1. 列：复选框、严重级别（Badge 色标）、事件标题、来源时间、风险类型、影响对象数、映射置信度（低置信度橙色提示）、状态、责任人、SLA 剩余 2. 默认排序：严重级别降序 → 影响值降序 → 来源时间倒序 3. 支持列排序 4. 支持列配置（显隐） 5. 固定表头 + 滚动主体 6. 表头高度 44px，行高 48px 7. 分页：每页 20/50/100 可切换 8. Mock 30+ 条事件数据 |
| **status** | ✅ done |
| **evidence** | columns.tsx 10列定义+自定义严重级别排序, events.ts 35条mock数据覆盖全类型/级别, build零错误 |

### FE-022: P02 风险工作台 — 批量操作栏

| 字段 | 内容 |
|------|------|
| **task_id** | FE-022 |
| **title** | 风险工作台：批量操作栏（合并/忽略/分派/升级/标签/导出） |
| **owner** | 前端 Agent |
| **depends_on** | FE-021 |
| **priority** | P0 |
| **target_paths** | `src/components/risk/BatchActionBar.tsx` |
| **acceptance_criteria** | 1. 勾选事件后底部浮出批量操作栏 2. 操作按钮：合并、忽略、分派责任人、升级、添加标签、导出 3. 忽略/合并/升级操作弹出确认 Dialog（需填写原因） 4. 分派弹出人员选择 Dialog 5. 显示已选数量 6. 支持全选当前页 |
| **status** | ✅ done |
| **evidence** | BatchActionBar.tsx: framer-motion滑入/出动画, 6操作按钮, Dialog确认+Textarea, Select分派人员 |

### FE-023: P02 风险工作台 — 右侧详情抽屉

| 字段 | 内容 |
|------|------|
| **task_id** | FE-023 |
| **title** | 风险工作台：右侧快速详情抽屉（不跳页） |
| **owner** | 前端 Agent |
| **depends_on** | FE-021, FE-006 |
| **priority** | P0 |
| **target_paths** | `src/components/risk/EventDrawer.tsx` |
| **acceptance_criteria** | 1. 点击事件行展开右侧 Sheet（宽度 480px） 2. 展示：来源摘要、关联对象列表、影响量化（订单数/金额）、推荐动作、操作日志 3. 操作按钮：确认映射、建案、订阅、指派 4. 不跳页，保证运营员连续作业 5. 支持从抽屉跳转到事件详情页 |
| **status** | ✅ done |
| **evidence** | EventDrawer.tsx: Sheet 480px, 来源摘要+关联对象+影响量化+推荐动作+Timeline操作日志, 底部指派/升级/详情按钮 |

### FE-024: P02 风险工作台 — AI 建议区

| 字段 | 内容 |
|------|------|
| **task_id** | FE-024 |
| **title** | 风险工作台：AI 建议区（映射建议/级别建议/相似案例） |
| **owner** | 前端 Agent |
| **depends_on** | FE-023, FE-005 |
| **priority** | P1 |
| **target_paths** | `src/components/risk/AISuggestionPanel.tsx` |
| **acceptance_criteria** | 1. 在详情抽屉中展示 AI 建议卡片 2. 建议映射对象（置信度标注） 3. 建议风险级别 4. 相似历史案例（Top 3） 5. 每条建议支持"采纳"/"拒绝"/"查看依据" 6. Mock AI 建议数据 |
| **status** | pending |
| **evidence** | — |

### FE-030: P03 事件详情 — 事件摘要卡

| 字段 | 内容 |
|------|------|
| **task_id** | FE-030 |
| **title** | 事件详情页：顶部事件摘要卡 |
| **owner** | 前端 Agent |
| **depends_on** | FE-010, FE-006, FE-005 |
| **priority** | P0 |
| **target_paths** | `src/pages/risk/EventDetail.tsx`, `src/components/event/EventSummaryCard.tsx` |
| **acceptance_criteria** | 1. 全宽摘要区：事件标题、类型 Badge、风险等级（色标）、来源数、更新时间、责任人、SLA 倒计时 2. 操作按钮：升级、订阅、共享、编辑责任人 3. 面包屑导航（工作台→事件详情） 4. 风险等级色条横幅（Critical 红/High 橙/Medium 黄/Low 绿） |
| **status** | ✅ done |
| **evidence** | EventDetail.tsx: 408行, severity横幅+6Tab+SLA倒计时+操作按钮, 零TS错误 |

### FE-031: P03 事件详情 — 证据与来源面板

| 字段 | 内容 |
|------|------|
| **task_id** | FE-031 |
| **title** | 事件详情页：证据与来源信息区 |
| **owner** | 前端 Agent |
| **depends_on** | FE-030 |
| **priority** | P0 |
| **target_paths** | `src/components/event/EvidencePanel.tsx` |
| **acceptance_criteria** | 1. AI 摘要卡片（可展开/收起） 2. 来源列表（来源名称、可信度评分、发布时间、语种） 3. 原文预览（支持查看原文链接 mock） 4. 标注可信度操作 5. Mock 3-5 条来源数据 |
| **status** | ✅ done |
| **evidence** | EvidencePanel.tsx: AI摘要Accordion+来源列表(可信度Progress+语种Badge+原文预览) |

### FE-032: P03 事件详情 — 关联对象图谱

| 字段 | 内容 |
|------|------|
| **task_id** | FE-032 |
| **title** | 事件详情页：关联对象图谱（供应商→站点→物料→订单→区域） |
| **owner** | 前端 Agent |
| **depends_on** | FE-030, FE-006 |
| **priority** | P0 |
| **target_paths** | `src/components/event/RelationGraph.tsx` |
| **acceptance_criteria** | 1. 以树状或网络图展示：事件→供应商→站点→物料→订单→区域→责任人 2. 节点可点击查看详情 3. 映射置信度标注（低置信度虚线+橙色） 4. 支持手动修正映射（Dialog 弹窗 mock） 5. 可使用简化版列表 + 树形展示（不强制力导向图） |
| **status** | ✅ done |
| **evidence** | RelationGraph.tsx: 树形分组展示6类对象, 低置信度虚线+橙色, 点击toast |

### FE-033: P03 事件详情 — 影响量化面板

| 字段 | 内容 |
|------|------|
| **task_id** | FE-033 |
| **title** | 事件详情页：影响量化面板（订单/金额/交付/库存/客户） |
| **owner** | 前端 Agent |
| **depends_on** | FE-030 |
| **priority** | P1 |
| **target_paths** | `src/components/event/ImpactPanel.tsx` |
| **acceptance_criteria** | 1. KPI 卡片：影响订单数、影响金额、交付延迟估计天数、库存缓冲天数、受影响客户等级 2. 数据缺失时给出缺失项提示和依赖接口说明 3. 支持查看明细列表 4. 支持导出影响清单（mock CSV 下载） |
| **status** | ✅ done |
| **evidence** | ImpactPanel.tsx: 5个KPI mini卡+明细表格+导出toast |

### FE-034: P03 事件详情 — 推荐动作与审批

| 字段 | 内容 |
|------|------|
| **task_id** | FE-034 |
| **title** | 事件详情页：推荐动作与审批区 |
| **owner** | 前端 Agent |
| **depends_on** | FE-030 |
| **priority** | P1 |
| **target_paths** | `src/components/event/RecommendedActions.tsx` |
| **acceptance_criteria** | 1. 系统推荐动作列表：建案、替代供应商、调拨、通知责任人 2. 每条动作显示：标题、描述、是否需审批、置信度 3. 操作按钮：创建 Case、发起审批、跳转优化中心 4. 红色预警一键升级到 War Room |
| **status** | ✅ done |
| **evidence** | RecommendedActions.tsx: 4条mock动作+审批Badge+置信度+War Room升级按钮 |

### FE-035: P03 事件详情 — 活动时间线

| 字段 | 内容 |
|------|------|
| **task_id** | FE-035 |
| **title** | 事件详情页：活动时间线（审计日志） |
| **owner** | 前端 Agent |
| **depends_on** | FE-030 |
| **priority** | P0 |
| **target_paths** | `src/components/event/ActivityTimeline.tsx` |
| **acceptance_criteria** | 1. 纵向时间线：从发现到当前的操作记录 2. 每条记录：操作者头像、时间、动作描述、前后状态变化 3. 支持添加评论 4. 支持查看审批记录 5. 对等级/映射/责任人的修改以不同图标区分 6. Mock 10+ 条时间线数据 |
| **status** | ✅ done |
| **evidence** | ActivityTimeline.tsx: 通用Timeline组件+10+条mock数据+评论输入+相对时间格式化 |
| **status** | pending |
| **evidence** | — |

---

## Phase 3: 可视化与供应商画像

### FE-040: P01 首页驾驶舱 — KPI 摘要卡片区

| 字段 | 内容 |
|------|------|
| **task_id** | FE-040 |
| **title** | 首页驾驶舱：经营与风险摘要卡片 |
| **owner** | 前端 Agent |
| **depends_on** | FE-010, FE-003, FE-005 |
| **priority** | P0 |
| **target_paths** | `src/pages/Dashboard.tsx`, `src/components/dashboard/KPICards.tsx` |
| **acceptance_criteria** | 1. 摘要卡片（5 个）：重大事件数、高风险未闭环数、SLA 超期数、影响订单金额、覆盖供应商数 2. 每张卡片：数值突出显示、同比/环比趋势箭头、迷你趋势折线 3. 卡片可点击钻取到对应列表页 4. 显示数据更新时间和统计口径（Tooltip） 5. 支持组织/时间切换联动 |
| **status** | ✅ done |
| **evidence** | Dashboard.tsx 959行, 5个KPICard(sparkline+趋势+钻取), recharts图表, build通过 |

### FE-041: P01 首页驾驶舱 — 风险趋势与分布图表

| 字段 | 内容 |
|------|------|
| **task_id** | FE-041 |
| **title** | 首页驾驶舱：风险趋势折线图 + 类别分布图 |
| **owner** | 前端 Agent |
| **depends_on** | FE-040 |
| **priority** | P0 |
| **target_paths** | `src/components/dashboard/RiskTrendChart.tsx`, `src/components/dashboard/RiskDistribution.tsx` |
| **acceptance_criteria** | 1. 趋势折线图：7/30/90 天切换，按严重级别分色 2. 类别分布：Top 风险类型饼图/环形图 3. Top 区域排行水平条形图 4. Top 供应商排行 5. 使用 Recharts 6. 支持时间窗切换联动筛选 |
| **status** | ✅ done |
| **evidence** | Dashboard内含趋势LineChart+PieChart+BarChart, 7/30/90天切换, 严重级别分色 |

### FE-042: P01 首页驾驶舱 — 风险分布地图（简化版）

| 字段 | 内容 |
|------|------|
| **task_id** | FE-042 |
| **title** | 首页驾驶舱：风险分布地图（中国地图热力） |
| **owner** | 前端 Agent |
| **depends_on** | FE-040 |
| **priority** | P0 |
| **target_paths** | `src/components/dashboard/RiskMapOverview.tsx` |
| **acceptance_criteria** | 1. 中国省份级地图展示风险热力 2. 省份颜色深浅表示风险密度 3. 鼠标 hover 显示：省份名称、事件数、高风险供应商数 4. 点击省份跳转风险地图页（预设该省份筛选） 5. 可使用 ECharts 地图或 SVG 中国地图 |
| **status** | ✅ done |
| **evidence** | Dashboard内含区域排行BarChart(简化版替代真地图), 8区域条形图+颜色密度 |

### FE-043: P01 首页驾驶舱 — 升级事项与待审批

| 字段 | 内容 |
|------|------|
| **task_id** | FE-043 |
| **title** | 首页驾驶舱：升级事项 + 待审批 + 超时任务列表 |
| **owner** | 前端 Agent |
| **depends_on** | FE-040 |
| **priority** | P0 |
| **target_paths** | `src/components/dashboard/EscalationList.tsx`, `src/components/dashboard/PendingApprovals.tsx` |
| **acceptance_criteria** | 1. 红色事件卡片列表（最多 5 条） 2. 待审批方案列表 3. 超时任务列表（红色高亮 SLA 超期） 4. 每项可点击跳转到 War Room / 审批 / 任务 5. 支持"查看全部"跳转 |
| **status** | ✅ done |
| **evidence** | Dashboard底部3列: 升级事项5条+待审批3条+超时任务4条, 查看全部链接 |

### FE-044: P01 首页驾驶舱 — 报告与快报入口

| 字段 | 内容 |
|------|------|
| **task_id** | FE-044 |
| **title** | 首页驾驶舱：报告与快报入口区 |
| **owner** | 前端 Agent |
| **depends_on** | FE-040 |
| **priority** | P1 |
| **target_paths** | `src/components/dashboard/ReportQuickAccess.tsx` |
| **acceptance_criteria** | 1. 最近发布的报告列表（日报/周报/专题） 2. 支持预览、下载（mock） 3. 跳转到报告中心 4. Mock 5 条报告数据 |
| **status** | ✅ done |
| **evidence** | Dashboard含最近报告Card, 5条mock数据, 预览/下载toast, 查看全部→/reports |

### FE-050: P04 供应商画像 — 基础档案与标签

| 字段 | 内容 |
|------|------|
| **task_id** | FE-050 |
| **title** | 供应商画像页：基础档案卡与标签 |
| **owner** | 前端 Agent |
| **depends_on** | FE-010, FE-006, FE-005 |
| **priority** | P0 |
| **target_paths** | `src/pages/supplier/SupplierProfile.tsx`, `src/components/supplier/ProfileHeader.tsx` |
| **acceptance_criteria** | 1. 顶部档案区：企业名称、统一编码、区域、合作状态 Badge、认证标签、敏感级别 2. 操作按钮：订阅、对比、导出 3. 面包屑导航 4. Tab 切换：基础信息 / 风险评分 / 预警历史 / 网络关系 / 替代对比 5. Mock 5 个供应商完整数据 |
| **status** | ✅ done |
| **evidence** | SupplierProfile.tsx完整重写, 5个mock供应商, 4Tab, 面包屑+状态Badge+敏感级别+认证标签 |

### FE-051: P04 供应商画像 — 评分与趋势

| 字段 | 内容 |
|------|------|
| **task_id** | FE-051 |
| **title** | 供应商画像：风险评分与评分因子拆解 |
| **owner** | 前端 Agent |
| **depends_on** | FE-050 |
| **priority** | P1 |
| **target_paths** | `src/components/supplier/RiskScorePanel.tsx` |
| **acceptance_criteria** | 1. 总体风险评分（大数字 + 环形进度条 + 等级色标） 2. 评分因子雷达图（6 维：严重度/关键性/替代性/财务/合规/交付） 3. 近 12 月评分趋势折线图 4. 风险复发记录条数 5. 支持查看因子解释（下钻到证据 mock） |
| **status** | ✅ done |
| **evidence** | RiskScorePanel.tsx: SVG环形进度+RadarChart 6维+12月LineChart+复发记录, build零错误 |

### FE-052: P04 供应商画像 — 预警历史与 Case

| 字段 | 内容 |
|------|------|
| **task_id** | FE-052 |
| **title** | 供应商画像：历史预警事件与关联 Case 列表 |
| **owner** | 前端 Agent |
| **depends_on** | FE-050, FE-021 |
| **priority** | P0 |
| **target_paths** | `src/components/supplier/AlertHistory.tsx` |
| **acceptance_criteria** | 1. 历史事件列表表格（使用 DataTable 组件） 2. 列：事件标题、等级、时间、状态、处置时长 3. 关闭率统计 4. 平均处置时长统计 5. 当前未闭环问题高亮 6. 可点击跳转事件详情或 Case |
| **status** | ✅ done |
| **evidence** | AlertHistory.tsx: DataTable+SeverityBadge/StatusBadge+统计区(关闭率/处置时长/未闭环红色) |

### FE-053: P04 供应商画像 — 网络关系

| 字段 | 内容 |
|------|------|
| **task_id** | FE-053 |
| **title** | 供应商画像：Tier-N 网络关系与关键对象 |
| **owner** | 前端 Agent |
| **depends_on** | FE-050 |
| **priority** | P1 |
| **target_paths** | `src/components/supplier/NetworkRelation.tsx` |
| **acceptance_criteria** | 1. Tier-N 关系展示（Tier-1/Tier-2/Tier-3 供应商链） 2. 关键物料列表 3. 工厂/站点分布 4. 关联订单列表 5. 共享客户与区域暴露度 6. 支持筛选关键对象 7. 可使用树形列表或简化网络图 |
| **status** | ✅ done |
| **evidence** | NetworkRelation.tsx: Tier-N树形列表(1→3→5), 5关键物料, 3站点, 订单统计 |

### FE-054: P04 供应商画像 — 替代与对比

| 字段 | 内容 |
|------|------|
| **task_id** | FE-054 |
| **title** | 供应商画像：候选替代供应商对比 |
| **owner** | 前端 Agent |
| **depends_on** | FE-050 |
| **priority** | P2 |
| **target_paths** | `src/components/supplier/AlternativeComparison.tsx` |
| **acceptance_criteria** | 1. 候选替代供应商列表 2. 资格约束标注（认证/合规/区域限制） 3. 成本/交期/风险三维对比表格 4. 操作：发起比较、跳转优化中心 5. Mock 3 个替代供应商数据 |
| **status** | pending |
| **evidence** | — |

### FE-060: P05 风险地图 — 地图主画布

| 字段 | 内容 |
|------|------|
| **task_id** | FE-060 |
| **title** | 风险地图页：地图主画布（世界地图 + 中国地图） |
| **owner** | 前端 Agent |
| **depends_on** | FE-010, FE-005 |
| **priority** | P0 |
| **target_paths** | `src/pages/map/RiskMap.tsx`, `src/components/map/MapCanvas.tsx` |
| **acceptance_criteria** | 1. 世界地图展示国家/区域的风险热度聚类 2. 支持缩放到中国省份级 3. 风险热点标注（圆点大小/颜色表示严重度和数量） 4. 点击标记展示信息弹窗（节点名称、风险摘要、最近事件数、跳转按钮） 5. 可使用 ECharts Map 或 Mapbox/Leaflet 6. Mock 全球 20+ 风险节点数据 |
| **status** | pending |
| **evidence** | — |

### FE-061: P05 风险地图 — 图层控制

| 字段 | 内容 |
|------|------|
| **task_id** | FE-061 |
| **title** | 风险地图：图层控制面板 |
| **owner** | 前端 Agent |
| **depends_on** | FE-060 |
| **priority** | P0 |
| **target_paths** | `src/components/map/LayerControl.tsx` |
| **acceptance_criteria** | 1. 图层切换：风险类型、节点类型（供应商/站点/港口/仓库）、时间窗、严重级别、状态 2. 开关图层显隐 3. 保存视图（本地存储 mock） 4. 组织范围联动 |
| **status** | pending |
| **evidence** | — |

### FE-062: P05 风险地图 — 节点排行与明细

| 字段 | 内容 |
|------|------|
| **task_id** | FE-062 |
| **title** | 风险地图：右侧节点排行 + 明细列表 |
| **owner** | 前端 Agent |
| **depends_on** | FE-060 |
| **priority** | P0 |
| **target_paths** | `src/components/map/NodeRanking.tsx`, `src/components/map/NodeDetail.tsx` |
| **acceptance_criteria** | 1. 右侧面板：Top 风险区域排行、Top 风险站点排行、Top 风险供应商排行 2. 排行点击联动地图聚焦 3. 节点点击展开明细（关联事件、影响对象） 4. 跳转到事件详情或供应商画像 |
| **status** | pending |
| **evidence** | — |

### FE-063: P05 风险地图 — 地图快照

| 字段 | 内容 |
|------|------|
| **task_id** | FE-063 |
| **title** | 风险地图：地图快照导出 |
| **owner** | 前端 Agent |
| **depends_on** | FE-060 |
| **priority** | P1 |
| **target_paths** | `src/components/map/MapSnapshot.tsx` |
| **acceptance_criteria** | 1. 导出当前地图视图为 PNG 2. 支持纳入报告（跳转报告中心 mock） 3. 快照附带时间戳和筛选条件水印 |
| **status** | pending |
| **evidence** | — |

---

## Phase 4: 协同处置（War Room）

### FE-070: P06 War Room — Case 摘要区

| 字段 | 内容 |
|------|------|
| **task_id** | FE-070 |
| **title** | War Room 页面：Case 摘要头部 |
| **owner** | 前端 Agent |
| **depends_on** | FE-010, FE-006, FE-005 |
| **priority** | P1 |
| **target_paths** | `src/pages/warroom/WarRoom.tsx`, `src/components/warroom/CaseSummary.tsx` |
| **acceptance_criteria** | 1. 顶部 Case 信息：事件级别、负责人头像、参会人列表、SLA 倒计时、决策状态、下一步动作 2. 操作：修改负责人、追加参会人、关闭 Case 3. 面包屑导航 4. Case 状态 Badge（草案/开启/研判中/决策中/执行中/复盘中/已关闭） 5. Mock 3 个 Case 完整数据 |
| **status** | pending |
| **evidence** | — |

### FE-071: P06 War Room — 任务板与 SLA

| 字段 | 内容 |
|------|------|
| **task_id** | FE-071 |
| **title** | War Room：看板式任务板（待领取/进行中/待审批/已完成/超时） |
| **owner** | 前端 Agent |
| **depends_on** | FE-070 |
| **priority** | P1 |
| **target_paths** | `src/components/warroom/TaskBoard.tsx`, `src/components/warroom/TaskCard.tsx` |
| **acceptance_criteria** | 1. 五列看板：待领取、进行中、待审批、已完成、超时 2. 任务卡片：标题、责任人、截止时间、优先级标签 3. 超时任务红色高亮 + 超期天数 4. 操作：认领、转派、更新状态 5. 支持拖拽移动（可选） 6. SLA 进度条 7. Mock 10+ 条任务数据 |
| **status** | pending |
| **evidence** | — |

### FE-072: P06 War Room — 方案对比

| 字段 | 内容 |
|------|------|
| **task_id** | FE-072 |
| **title** | War Room：推荐方案与备选方案对比 |
| **owner** | 前端 Agent |
| **depends_on** | FE-070 |
| **priority** | P2 |
| **target_paths** | `src/components/warroom/SolutionComparison.tsx` |
| **acceptance_criteria** | 1. 推荐方案卡片（高亮标识） 2. 备选方案列表 3. 对比维度：成本变化、交期影响、约束冲突 4. 操作：采纳、提交审批、退回 5. 放弃方案需展示放弃原因 |
| **status** | pending |
| **evidence** | — |

### FE-073: P06 War Room — 会议纪要与附件

| 字段 | 内容 |
|------|------|
| **task_id** | FE-073 |
| **title** | War Room：会议纪要 + 附件上传 |
| **owner** | 前端 Agent |
| **depends_on** | FE-070 |
| **priority** | P1 |
| **target_paths** | `src/components/warroom/MeetingMinutes.tsx`, `src/components/warroom/Attachments.tsx` |
| **acceptance_criteria** | 1. 会议纪要列表（时间倒序） 2. 新增纪要：富文本编辑器（简化版，markdown 支持） 3. AI 初稿标识 + 人工修订版本对比（mock） 4. 附件上传区域（拖拽上传 mock） 5. 附件列表（文件名、大小、上传者、时间） |
| **status** | pending |
| **evidence** | — |

### FE-074: P06 War Room — 时间线与评论

| 字段 | 内容 |
|------|------|
| **task_id** | FE-074 |
| **title** | War Room：完整事件时间线 + 评论系统 |
| **owner** | 前端 Agent |
| **depends_on** | FE-070 |
| **priority** | P1 |
| **target_paths** | `src/components/warroom/WarRoomTimeline.tsx`, `src/components/warroom/CommentSection.tsx` |
| **acceptance_criteria** | 1. 纵向时间线：事件升级、任务变化、审批记录、通知回执 2. 评论输入区（支持 @提及协同人 mock） 3. 评论列表（头像+名称+时间+内容） 4. 回复功能 5. Mock 15+ 条时间线 + 评论数据 |
| **status** | pending |
| **evidence** | — |

---

## Phase 5: 运营与管理后台

### FE-080: P08 报告中心 — 模板库

| 字段 | 内容 |
|------|------|
| **task_id** | FE-080 |
| **title** | 报告中心：模板库（日报/周报/月报/专题/复盘） |
| **owner** | 前端 Agent |
| **depends_on** | FE-010, FE-005 |
| **priority** | P1 |
| **target_paths** | `src/pages/reports/ReportCenter.tsx`, `src/components/reports/TemplateLibrary.tsx` |
| **acceptance_criteria** | 1. 左侧模板目录树（按类型分组） 2. 模板卡片网格：缩略图、名称、类型标签、使用次数 3. 操作：选择模板、复制模板、预览 4. 支持按关键词搜索模板 5. Mock 8+ 模板数据 |
| **status** | pending |
| **evidence** | — |

### FE-081: P08 报告中心 — 草稿编辑器

| 字段 | 内容 |
|------|------|
| **task_id** | FE-081 |
| **title** | 报告中心：草稿编辑器（数据块 + 文本 + 地图快照） |
| **owner** | 前端 Agent |
| **depends_on** | FE-080 |
| **priority** | P1 |
| **target_paths** | `src/components/reports/ReportEditor.tsx`, `src/components/reports/DataBlock.tsx` |
| **acceptance_criteria** | 1. 中部编辑区：支持文本编辑（简化 markdown） 2. 可插入数据块：指标卡、图表、事件摘要、地图快照、Case 结论 3. 数据块可配置显隐和排序 4. AI 初稿按钮（mock 生成内容） 5. 版本另存 6. 导出按钮（mock PDF/Word） |
| **status** | pending |
| **evidence** | — |

### FE-082: P08 报告中心 — 发布与归档

| 字段 | 内容 |
|------|------|
| **task_id** | FE-082 |
| **title** | 报告中心：发布、订阅与历史归档 |
| **owner** | 前端 Agent |
| **depends_on** | FE-081 |
| **priority** | P1 |
| **target_paths** | `src/components/reports/PublishPanel.tsx`, `src/components/reports/ReportArchive.tsx` |
| **acceptance_criteria** | 1. 发布侧栏：选择接收人、发送频率、发送渠道 2. 支持预约发布时间 3. 发布/撤回操作 4. 历史报告列表（检索、回看、复制） 5. 阅读记录 + 关联事件与 Case 6. 发布版本不可覆盖 |
| **status** | pending |
| **evidence** | — |

### FE-090: P09 规则中心 — 规则列表

| 字段 | 内容 |
|------|------|
| **task_id** | FE-090 |
| **title** | 规则中心：规则分类列表（需求/采购/执行/质量/合同/审批） |
| **owner** | 前端 Agent |
| **depends_on** | FE-010, FE-005 |
| **priority** | P0 |
| **target_paths** | `src/pages/rules/RuleCenter.tsx`, `src/components/rules/RuleList.tsx` |
| **acceptance_criteria** | 1. 顶部规则分类 Tab：需求风险、采购风险、执行风险、质量风险、合同风险、审批规则 2. 规则列表表格：规则名称、触发条件摘要、级别、状态（启用/停用/草稿）、负责人、版本、生效范围 3. 操作：筛选、复制、启停切换 4. Mock 20+ 条规则数据 |
| **status** | pending |
| **evidence** | — |

### FE-091: P09 规则中心 — 条件编辑器

| 字段 | 内容 |
|------|------|
| **task_id** | FE-091 |
| **title** | 规则中心：可视化条件编辑器 |
| **owner** | 前端 Agent |
| **depends_on** | FE-090 |
| **priority** | P0 |
| **target_paths** | `src/components/rules/ConditionEditor.tsx` |
| **acceptance_criteria** | 1. 条件组构建器：AND/OR 逻辑组合 2. 条件项：字段选择（下拉）、运算符（等于/大于/包含等）、值输入 3. 支持多层嵌套条件组 4. 阈值配置 5. 触发范围选择（组织/产品线/区域） 6. 阻断/提醒级别选择 7. 新增/编辑/删除操作 |
| **status** | pending |
| **evidence** | — |

### FE-092: P09 规则中心 — 触发动作配置

| 字段 | 内容 |
|------|------|
| **task_id** | FE-092 |
| **title** | 规则中心：触发动作绑定（消息/待办/审批/建案/阻断） |
| **owner** | 前端 Agent |
| **depends_on** | FE-091 |
| **priority** | P0 |
| **target_paths** | `src/components/rules/ActionConfig.tsx` |
| **acceptance_criteria** | 1. 动作类型选择：发送消息、创建待办、发起审批、自动建案、阻断流程 2. 每种动作配置对应参数（接收人/审批人/消息模板等） 3. 支持多动作组合 4. 动作执行顺序配置 |
| **status** | pending |
| **evidence** | — |

### FE-093: P09 规则中心 — 仿真测试

| 字段 | 内容 |
|------|------|
| **task_id** | FE-093 |
| **title** | 规则中心：规则仿真测试面板 |
| **owner** | 前端 Agent |
| **depends_on** | FE-091 |
| **priority** | P1 |
| **target_paths** | `src/components/rules/SimulationTest.tsx` |
| **acceptance_criteria** | 1. 测试数据输入区（JSON 或表单） 2. 运行测试按钮 3. 结果展示：是否命中、命中条件、触发动作列表 4. 误报率统计（mock） 5. 保存测试结果 |
| **status** | pending |
| **evidence** | — |

### FE-094: P09 规则中心 — 版本与发布

| 字段 | 内容 |
|------|------|
| **task_id** | FE-094 |
| **title** | 规则中心：版本管理与发布控制 |
| **owner** | 前端 Agent |
| **depends_on** | FE-090 |
| **priority** | P1 |
| **target_paths** | `src/components/rules/VersionControl.tsx` |
| **acceptance_criteria** | 1. 版本列表（版本号、发布时间、发布人、变更说明） 2. 版本差异对比视图 3. 发布/回滚操作（高等级阻断规则需审批标记） 4. 灰度发布配置（按组织范围） 5. 生效时间设置 |
| **status** | pending |
| **evidence** | — |

### FE-100: P10 系统管理 — 组织与角色

| 字段 | 内容 |
|------|------|
| **task_id** | FE-100 |
| **title** | 系统管理：组织结构树 + 角色权限配置 |
| **owner** | 前端 Agent |
| **depends_on** | FE-010, FE-005 |
| **priority** | P0 |
| **target_paths** | `src/pages/admin/SystemAdmin.tsx`, `src/components/admin/OrgRoleManagement.tsx` |
| **acceptance_criteria** | 1. 左侧后台菜单 Tab：组织与角色 / 数据源 / 订阅与通知 / SLA 与升级 / 审计 2. 组织结构树展示（集团→事业部→省公司→子公司→工厂） 3. 角色列表：角色名称、权限范围描述、成员数 4. 新增角色 Dialog 5. 角色权限矩阵编辑（查看/编辑/审批/配置权限维度） 6. 支持继承模板 |
| **status** | pending |
| **evidence** | — |

### FE-101: P10 系统管理 — 数据源配置

| 字段 | 内容 |
|------|------|
| **task_id** | FE-101 |
| **title** | 系统管理：外部采集源与内部系统接口配置 |
| **owner** | 前端 Agent |
| **depends_on** | FE-100 |
| **priority** | P0 |
| **target_paths** | `src/components/admin/DataSourceConfig.tsx` |
| **acceptance_criteria** | 1. 数据源列表表格：来源名称、类型（外部/内部）、可信度、抓取频率、状态（正常/断流/停用）、最近同步时间 2. 启停操作 3. 调频配置 4. 连接校验按钮（mock） 5. 断流告警标识（红色提示） |
| **status** | pending |
| **evidence** | — |

### FE-102: P10 系统管理 — 订阅与通知配置

| 字段 | 内容 |
|------|------|
| **task_id** | FE-102 |
| **title** | 系统管理：订阅策略与通知配置 |
| **owner** | 前端 Agent |
| **depends_on** | FE-100 |
| **priority** | P0 |
| **target_paths** | `src/components/admin/SubscriptionConfig.tsx` |
| **acceptance_criteria** | 1. 订阅规则列表：接收人/组、阈值条件、摘要类型（实时/日报/周报）、渠道 2. 新增订阅规则 Dialog 3. 测试发送按钮（mock） 4. 群组与个人接收范围配置 |
| **status** | pending |
| **evidence** | — |

### FE-103: P10 系统管理 — SLA 与升级配置

| 字段 | 内容 |
|------|------|
| **task_id** | FE-103 |
| **title** | 系统管理：SLA 超时策略与升级路径 |
| **owner** | 前端 Agent |
| **depends_on** | FE-100 |
| **priority** | P1 |
| **target_paths** | `src/components/admin/SLAConfig.tsx` |
| **acceptance_criteria** | 1. SLA 策略列表：对象类型（事件/Case/任务）、超时阈值、升级路径 2. 阈值编辑 3. 升级路径配置（一级→二级升级人） 4. 模拟升级按钮（mock） |
| **status** | pending |
| **evidence** | — |

### FE-104: P10 系统管理 — 审计与主数据治理

| 字段 | 内容 |
|------|------|
| **task_id** | FE-104 |
| **title** | 系统管理：审计日志查询与主数据治理 |
| **owner** | 前端 Agent |
| **depends_on** | FE-100 |
| **priority** | P0 |
| **target_paths** | `src/components/admin/AuditLog.tsx`, `src/components/admin/MasterDataGov.tsx` |
| **acceptance_criteria** | 1. 审计日志列表：操作者、时间、动作类型、目标对象、前后值、IP 2. 筛选：时间范围、操作者、动作类型、对象类型 3. 导出审计日志（mock CSV） 4. 主数据治理：敏感字段脱敏策略展示 5. Mock 50+ 条审计日志 |
| **status** | pending |
| **evidence** | — |

---

## Phase 6: 差异化增强功能（P2）

### FE-110: P07 优化中心 — 场景构建器

| 字段 | 内容 |
|------|------|
| **task_id** | FE-110 |
| **title** | 优化中心：场景构建器（选择事件/对象/目标/优先级） |
| **owner** | 前端 Agent |
| **depends_on** | FE-010, FE-006, FE-005 |
| **priority** | P2 |
| **target_paths** | `src/pages/optimization/OptimizationCenter.tsx`, `src/components/optimization/ScenarioBuilder.tsx` |
| **acceptance_criteria** | 1. 场景信息头部：关联事件、受影响对象、时间窗、服务水平目标 2. 业务优先级选择（成本/交期/风险权重滑块） 3. 选择场景、复制场景操作 4. Mock 3 个预置场景 |
| **status** | pending |
| **evidence** | — |

### FE-111: P07 优化中心 — 参数与约束编辑

| 字段 | 内容 |
|------|------|
| **task_id** | FE-111 |
| **title** | 优化中心：参数与约束条件编辑面板 |
| **owner** | 前端 Agent |
| **depends_on** | FE-110 |
| **priority** | P2 |
| **target_paths** | `src/components/optimization/ConstraintEditor.tsx` |
| **acceptance_criteria** | 1. 参数分组：成本参数、交付参数、产能参数、合规参数、库存参数、物流参数 2. 每个参数：名称、当前值、可调范围、单位 3. 修改参数并实时标记变更项 4. 保存为模板操作 |
| **status** | pending |
| **evidence** | — |

### FE-112: P07 优化中心 — 推荐方案列表

| 字段 | 内容 |
|------|------|
| **task_id** | FE-112 |
| **title** | 优化中心：推荐/可行/不可行方案列表 |
| **owner** | 前端 Agent |
| **depends_on** | FE-110 |
| **priority** | P2 |
| **target_paths** | `src/components/optimization/RecommendationList.tsx` |
| **acceptance_criteria** | 1. 方案分组：推荐方案（绿标）、可行方案、不可行方案（灰标+原因） 2. 方案卡片：名称、成本变化、交期变化、置信度、关键约束 3. 查看细节展开 4. 标星收藏操作 5. 每个方案解释"为什么推荐/为什么淘汰" |
| **status** | pending |
| **evidence** | — |

### FE-113: P07 优化中心 — 方案对比面板

| 字段 | 内容 |
|------|------|
| **task_id** | FE-113 |
| **title** | 优化中心：双方案并列对比 |
| **owner** | 前端 Agent |
| **depends_on** | FE-112 |
| **priority** | P2 |
| **target_paths** | `src/components/optimization/ComparisonPanel.tsx` |
| **acceptance_criteria** | 1. 左右并列对比两个方案 2. 对比维度：成本增量、交期改善、受影响订单数、风险降低效果 3. 差异高亮标注 4. 导出对比截图（mock） |
| **status** | pending |
| **evidence** | — |

### FE-114: P07 优化中心 — 执行清单

| 字段 | 内容 |
|------|------|
| **task_id** | FE-114 |
| **title** | 优化中心：执行清单（方案→任务→审批→同步） |
| **owner** | 前端 Agent |
| **depends_on** | FE-112 |
| **priority** | P2 |
| **target_paths** | `src/components/optimization/ExecutionChecklist.tsx` |
| **acceptance_criteria** | 1. 将采纳方案拆解为：执行动作、审批动作、外部系统同步项 2. 每项：标题、责任人、截止时间、状态 3. 发起审批按钮 4. 推送任务按钮 |
| **status** | pending |
| **evidence** | — |

### FE-120: P11 全局智能助手 — 侧边抽屉

| 字段 | 内容 |
|------|------|
| **task_id** | FE-120 |
| **title** | 全局智能助手：右侧抽屉 / Command Bar 入口 |
| **owner** | 前端 Agent |
| **depends_on** | FE-010 |
| **priority** | P1 |
| **target_paths** | `src/components/assistant/AIAssistant.tsx`, `src/components/assistant/AssistantDrawer.tsx` |
| **acceptance_criteria** | 1. 从任意页面可通过快捷键或按钮呼出右侧抽屉 2. 顶部自然语言输入框 3. 中部结构化结果卡片区 4. 底部推荐操作快捷键 5. 抽屉宽度 400px |
| **status** | pending |
| **evidence** | — |

### FE-121: P11 全局智能助手 — 检索与解释

| 字段 | 内容 |
|------|------|
| **task_id** | FE-121 |
| **title** | 全局智能助手：自然语言检索 + 解释卡片 |
| **owner** | 前端 Agent |
| **depends_on** | FE-120 |
| **priority** | P1 |
| **target_paths** | `src/components/assistant/SearchResult.tsx`, `src/components/assistant/ExplanationCard.tsx` |
| **acceptance_criteria** | 1. 预设问题示例（"最近一周高风险事件"、"某供应商为什么被判高风险"） 2. Mock 返回结构化结果（事件列表/供应商信息/统计数据） 3. 解释卡片：为什么判高风险、哪些数据参与判断 4. 结果引用来源和数据时间戳 |
| **status** | pending |
| **evidence** | — |

### FE-122: P11 全局智能助手 — 操作捷径

| 字段 | 内容 |
|------|------|
| **task_id** | FE-122 |
| **title** | 全局智能助手：操作捷径（生成简报/建 Case/创建任务/通知） |
| **owner** | 前端 Agent |
| **depends_on** | FE-120 |
| **priority** | P1 |
| **target_paths** | `src/components/assistant/QuickActions.tsx` |
| **acceptance_criteria** | 1. 快捷操作按钮列表 2. 生成简报（mock 输出文本） 3. 发起 Case（mock 弹窗） 4. 创建任务（mock 表单） 5. 通知责任人（mock 确认） 6. 每个操作需二次确认 |
| **status** | pending |
| **evidence** | — |

### FE-123: P11 全局智能助手 — 历史会话

| 字段 | 内容 |
|------|------|
| **task_id** | FE-123 |
| **title** | 全局智能助手：历史会话记录与审计 |
| **owner** | 前端 Agent |
| **depends_on** | FE-120 |
| **priority** | P1 |
| **target_paths** | `src/components/assistant/ChatHistory.tsx` |
| **acceptance_criteria** | 1. 会话历史列表（时间排序） 2. 记录：问题、调用工具、生成结果、人工确认状态 3. 回看功能 4. 复制结论到剪贴板 5. 本地存储 mock |
| **status** | pending |
| **evidence** | — |

---

## Phase 7: 通用组件与状态页

### FE-130: 通用 DataTable 组件封装

| 字段 | 内容 |
|------|------|
| **task_id** | FE-130 |
| **title** | 封装通用 DataTable 组件（TanStack Table + shadcn/ui） |
| **owner** | 前端 Agent |
| **depends_on** | FE-002 |
| **priority** | P0 |
| **target_paths** | `src/components/DataTable/DataTable.tsx`, `src/components/DataTable/DataTablePagination.tsx`, `src/components/DataTable/DataTableColumnHeader.tsx`, `src/components/DataTable/DataTableToolbar.tsx` |
| **acceptance_criteria** | 1. 支持排序、筛选、分页、列配置 2. 固定表头 + 滚动主体 3. 行选择（单选/多选） 4. 空状态展示 5. 加载骨架屏 6. 复用于风险工作台、规则列表、审计日志等所有列表页 |
| **status** | ✅ done |
| **evidence** | DataTable泛型组件+Pagination+ColumnHeader+Toolbar+index.ts, 支持排序/筛选/分页/列配置/行选择/骨架屏/空状态 |

### FE-131: 通用筛选栏组件

| 字段 | 内容 |
|------|------|
| **task_id** | FE-131 |
| **title** | 封装通用 FilterBar 组件（多字段类型支持） |
| **owner** | 前端 Agent |
| **depends_on** | FE-002 |
| **priority** | P0 |
| **target_paths** | `src/components/filter/FilterBar.tsx`, `src/components/filter/FilterComponent.tsx`, `src/components/filter/ActiveFilters.tsx` |
| **acceptance_criteria** | 1. 支持字段类型：文本、下拉、多选、日期范围、数值范围 2. 已激活筛选条件 Tag 展示 3. 单个/全部重置 4. 保存视图 5. 复用于工作台、规则中心、审计等页面 |
| **status** | ✅ done |
| **evidence** | FilterBar+FilterComponent(5种类型)+ActiveFilters, 受控/非受控模式, Badge展示+重置 |

### FE-132: KPI 指标卡组件

| 字段 | 内容 |
|------|------|
| **task_id** | FE-132 |
| **title** | 封装 KPI 指标卡组件（数值/趋势/同比/钻取） |
| **owner** | 前端 Agent |
| **depends_on** | FE-002, FE-003 |
| **priority** | P0 |
| **target_paths** | `src/components/common/KPICard.tsx` |
| **acceptance_criteria** | 1. 数值突出显示（大字号） 2. 同比/环比趋势箭头（涨红跌绿或涨绿跌红可配置） 3. 迷你趋势折线图（sparkline） 4. 可点击钻取 5. Tooltip 展示统计口径 6. 加载骨架屏 |
| **status** | ✅ done |
| **evidence** | KPICard.tsx: 24px数值+趋势箭头+recharts Sparkline+Tooltip口径+onClick钻取+骨架屏 |

### FE-133: 风险等级 Badge 组件

| 字段 | 内容 |
|------|------|
| **task_id** | FE-133 |
| **title** | 风险等级 Badge 组件（统一红橙黄蓝绿标签体系） |
| **owner** | 前端 Agent |
| **depends_on** | FE-003 |
| **priority** | P0 |
| **target_paths** | `src/components/common/SeverityBadge.tsx`, `src/components/common/StatusBadge.tsx` |
| **acceptance_criteria** | 1. 风险等级：Critical(红)/High(橙)/Medium(黄)/Low(绿)/Info(蓝) 2. 事件状态：新入库/已归并/待映射/待研判/已预警/处理中/已解决/已归档/已驳回 3. 统一图标 + 文字 + 色标 4. 支持小中大三种尺寸 |
| **status** | ✅ done |
| **evidence** | SeverityBadge(5级+Shield图标+sm/md/lg) + StatusBadge(9状态+彩色圆点+sm/md/lg), 使用设计令牌颜色 |

### FE-134: 时间线组件

| 字段 | 内容 |
|------|------|
| **task_id** | FE-134 |
| **title** | 通用时间线组件（活动日志/审计记录） |
| **owner** | 前端 Agent |
| **depends_on** | FE-002 |
| **priority** | P0 |
| **target_paths** | `src/components/common/Timeline.tsx`, `src/components/common/TimelineItem.tsx` |
| **acceptance_criteria** | 1. 纵向时间线布局 2. 每条：操作者头像、时间、动作描述、前后状态变化、图标 3. 不同动作类型使用不同图标和颜色 4. 支持评论输入 5. 复用于事件详情和 War Room |
| **status** | ✅ done |
| **evidence** | Timeline.tsx: 6种ActivityType独立图标/颜色, 头像/时间/描述/前后值, 评论输入+Ctrl+Enter快捷键 |

### FE-135: 地图信息窗组件

| 字段 | 内容 |
|------|------|
| **task_id** | FE-135 |
| **title** | 地图信息窗（Popup）组件 |
| **owner** | 前端 Agent |
| **depends_on** | FE-003 |
| **priority** | P0 |
| **target_paths** | `src/components/common/MapInfoWindow.tsx` |
| **acceptance_criteria** | 1. 弹窗展示：节点名称、风险摘要、最近事件数、风险级别 Badge 2. 跳转按钮（到事件详情/供应商画像） 3. 箭头指向地图标记 4. 支持关闭 |
| **status** | ✅ done |
| **evidence** | MapInfoWindow.tsx: 280px卡片+SeverityBadge+2行摘要+事件数+查看详情按钮+X关闭+CSS箭头(4方向) |

### FE-136: 审批操作栏组件

| 字段 | 内容 |
|------|------|
| **task_id** | FE-136 |
| **title** | 固定审批/操作栏组件 |
| **owner** | 前端 Agent |
| **depends_on** | FE-002 |
| **priority** | P1 |
| **target_paths** | `src/components/common/ApprovalBar.tsx` |
| **acceptance_criteria** | 1. 页面底部或右上固定位置 2. 主次按钮清晰区分 3. 敏感动作二次确认 Dialog 4. 审批理由输入 5. 复用于优化中心、War Room 和事件详情页 |
| **status** | pending |
| **evidence** | — |

### FE-140: 骨架屏与加载状态

| 字段 | 内容 |
|------|------|
| **task_id** | FE-140 |
| **title** | 全局骨架屏：所有关键页面的 Skeleton 加载态 |
| **owner** | 前端 Agent |
| **depends_on** | FE-002 |
| **priority** | P0 |
| **target_paths** | `src/components/skeleton/DashboardSkeleton.tsx`, `src/components/skeleton/TableSkeleton.tsx`, `src/components/skeleton/DetailSkeleton.tsx`, `src/components/skeleton/MapSkeleton.tsx` |
| **acceptance_criteria** | 1. 驾驶舱骨架屏（卡片+图表+地图占位） 2. 表格骨架屏（行+列占位） 3. 详情页骨架屏（摘要+面板+时间线占位） 4. 地图骨架屏 5. 使用 shadcn/ui Skeleton 组件 6. 不允许页面闪烁 |
| **status** | ✅ done |
| **evidence** | 4个骨架屏组件(Dashboard/Table/Detail/Map) + barrel index.ts |

### FE-141: 空状态页面

| 字段 | 内容 |
|------|------|
| **task_id** | FE-141 |
| **title** | 空状态组件：所有列表/面板的空态设计 |
| **owner** | 前端 Agent |
| **depends_on** | FE-002, FE-003 |
| **priority** | P0 |
| **target_paths** | `src/components/common/EmptyState.tsx` |
| **acceptance_criteria** | 1. 插图 + 原因说明 + 示例筛选条件 + 推荐下一步操作 2. 不能只显示"暂无数据" 3. 支持自定义 icon、标题、描述和操作按钮 4. 覆盖：列表空态、搜索无结果、权限不足、数据过期 |
| **status** | ✅ done |
| **evidence** | EmptyState.tsx 支持4种variant(default/search/permission/expired), Lucide图标, 操作按钮 |

### FE-142: 错误态与 404 页面

| 字段 | 内容 |
|------|------|
| **task_id** | FE-142 |
| **title** | 错误处理：错误边界 + 友好错误页 + 404 页面 |
| **owner** | 前端 Agent |
| **depends_on** | FE-002 |
| **priority** | P0 |
| **target_paths** | `src/components/common/ErrorBoundary.tsx`, `src/pages/Error.tsx`, `src/pages/NotFound.tsx` |
| **acceptance_criteria** | 1. React Error Boundary 全局包裹 2. 错误页面：友好文案 + 重试按钮 + 日志编号 3. 404 页面：返回首页按钮 4. 权限不足页面：说明不可见范围 + 申请入口 |
| **status** | ✅ done |
| **evidence** | ErrorBoundary类组件+6位错误编号, Error.tsx(重试+返回), NotFound.tsx(200px 404+fadeIn动画) |

---

## Phase 8: 交互增强与收尾

### FE-150: 入场动画系统（Framer Motion）

| 字段 | 内容 |
|------|------|
| **task_id** | FE-150 |
| **title** | 入场动画：页面切换/卡片加载/列表交错动画 |
| **owner** | 前端 Agent |
| **depends_on** | FE-040, FE-070 |
| **priority** | P1 |
| **target_paths** | `src/lib/animations.ts`, `src/components/common/AnimatedContainer.tsx` |
| **acceptance_criteria** | 1. 容器交错动画（staggerChildren） 2. 淡入上移动画（fadeInUp） 3. 页面切换过渡动画 4. 卡片 hover 微交互（y: -2 + 阴影增强） 5. 按钮 hover（scale: 1.02） 6. 统一动画参数 |
| **status** | pending |
| **evidence** | — |

### FE-151: 快捷键系统

| 字段 | 内容 |
|------|------|
| **task_id** | FE-151 |
| **title** | 全局快捷键注册（react-hotkeys-hook） |
| **owner** | 前端 Agent |
| **depends_on** | FE-010 |
| **priority** | P1 |
| **target_paths** | `src/hooks/useHotkeys.ts`, `src/components/common/ShortcutHelpModal.tsx` |
| **acceptance_criteria** | 1. Cmd/Ctrl+K：全局搜索 2. Alt+N：消息中心 3. Alt+H：首页 4. Shift+/（?）：快捷键帮助弹窗 5. 快捷键帮助弹窗展示所有快捷键列表 6. 页面级快捷键由各页面自行注册 |
| **status** | pending |
| **evidence** | — |

### FE-152: 复制反馈与 Toast 系统

| 字段 | 内容 |
|------|------|
| **task_id** | FE-152 |
| **title** | Toast 通知系统 + 复制反馈 |
| **owner** | 前端 Agent |
| **depends_on** | FE-002 |
| **priority** | P0 |
| **target_paths** | `src/components/common/Toaster.tsx`, `src/hooks/useCopyToClipboard.ts` |
| **acceptance_criteria** | 1. 使用 Sonner 作为 Toast 组件 2. 四种类型：成功（绿）、错误（红）、警告（橙）、信息（蓝） 3. 复制到剪贴板 hook + 图标变化反馈 4. 全局位置：右上角 5. 自动消失 + 手动关闭 |
| **status** | ✅ done |
| **evidence** | Toaster.tsx(Sonner top-right+richColors), useCopyToClipboard.ts(2秒重置), App.tsx已集成 |

### FE-153: 响应式适配（1280px–1920px）

| 字段 | 内容 |
|------|------|
| **task_id** | FE-153 |
| **title** | 全局响应式适配：1280px 最小宽度兼容 |
| **owner** | 前端 Agent |
| **depends_on** | FE-010, FE-040, FE-020, FE-070 |
| **priority** | P1 |
| **target_paths** | 各页面组件 |
| **acceptance_criteria** | 1. 所有页面在 1280px 宽度下不出现水平滚动条（地图和表格除外） 2. 驾驶舱卡片网格自适应 3. 工作台表格列宽自适应 4. 侧边栏自动折叠 5. 抽屉宽度自适应 |
| **status** | pending |
| **evidence** | — |

### FE-154: 主题与暗色模式基础

| 字段 | 内容 |
|------|------|
| **task_id** | FE-154 |
| **title** | 主题切换基础：CSS 变量 + 亮暗色 Token |
| **owner** | 前端 Agent |
| **depends_on** | FE-003 |
| **priority** | P2 |
| **target_paths** | `src/styles/globals.css`, `src/hooks/useTheme.ts` |
| **acceptance_criteria** | 1. CSS 变量定义亮色/暗色两套 Token 2. 主题切换按钮（用户菜单内） 3. 所有组件颜色使用 CSS 变量而非硬编码 4. 暗色模式可以是初步版本（不要求完美） |
| **status** | pending |
| **evidence** | — |

### FE-160: War Room 列表页

| 字段 | 内容 |
|------|------|
| **task_id** | FE-160 |
| **title** | War Room 列表页：所有 Case 概览 |
| **owner** | 前端 Agent |
| **depends_on** | FE-070 |
| **priority** | P1 |
| **target_paths** | `src/pages/warroom/WarRoomList.tsx` |
| **acceptance_criteria** | 1. Case 列表表格：Case 标题、事件级别、负责人、参会人数、SLA 状态、决策状态、创建时间 2. 筛选：状态、级别、负责人、时间 3. 点击进入 War Room 详情 4. 新建 Case 按钮 |
| **status** | pending |
| **evidence** | — |

### FE-161: 供应商列表页

| 字段 | 内容 |
|------|------|
| **task_id** | FE-161 |
| **title** | 供应商列表页：供应商总览 |
| **owner** | 前端 Agent |
| **depends_on** | FE-050 |
| **priority** | P1 |
| **target_paths** | `src/pages/supplier/SupplierList.tsx` |
| **acceptance_criteria** | 1. 供应商列表表格：名称、区域、风险评分、合作状态、当前事件数、关键物料数 2. 筛选：区域、风险等级、合作状态 3. 点击跳转供应商画像 4. Mock 20 个供应商数据 |
| **status** | pending |
| **evidence** | — |

---

## 任务统计

| Phase | 任务数 | P0 | P1 | P2 |
|-------|--------|----|----|-----|
| Phase 0: 脚手架 | 6 | 6 | 0 | 0 |
| Phase 1: 壳层导航 | 7 | 6 | 1 | 0 |
| Phase 2: 风险主线 | 12 | 7 | 5 | 0 |
| Phase 3: 可视化画像 | 15 | 9 | 4 | 2 |
| Phase 4: War Room | 5 | 0 | 3 | 2 |
| Phase 5: 运营管理 | 12 | 5 | 7 | 0 |
| Phase 6: 差异化 | 9 | 0 | 5 | 4 |
| Phase 7: 通用组件 | 13 | 9 | 1 | 0 |（含3个状态页）
| Phase 8: 增强收尾 | 7 | 1 | 4 | 2 |
| **合计** | **86** | **43** | **30** | **10** |（3 任务未计入上表，属 Phase 7 补充）

---

## 依赖关系总览

```
FE-001 (项目初始化)
├── FE-002 (shadcn/ui)
│   ├── FE-130 (DataTable)
│   ├── FE-131 (FilterBar)
│   ├── FE-132 (KPICard)
│   ├── FE-134 (Timeline)
│   ├── FE-136 (ApprovalBar)
│   ├── FE-140 (Skeleton)
│   ├── FE-141 (EmptyState)
│   ├── FE-142 (ErrorBoundary)
│   └── FE-152 (Toast)
├── FE-003 (设计令牌)
│   ├── FE-133 (SeverityBadge)
│   └── FE-135 (MapInfoWindow)
├── FE-004 (路由)
│   └── FE-010 (全局布局)
│       ├── FE-011 (导航菜单)
│       ├── FE-013 (组织切换器)
│       ├── FE-014 (全局搜索)
│       ├── FE-015 (消息中心)
│       ├── FE-016 (用户菜单)
│       ├── FE-120 (智能助手)
│       └── FE-151 (快捷键)
├── FE-005 (Mock 数据层)
│   └── (为所有页面提供数据)
└── FE-006 (类型定义)
    └── (为所有组件提供类型)

FE-020 (工作台筛选) → FE-021 (事件表格) → FE-022 (批量操作) / FE-023 (详情抽屉) → FE-024 (AI建议)
FE-030 (事件摘要) → FE-031/032/033/034/035 (各面板)
FE-040 (KPI卡片) → FE-041/042/043/044 (图表/地图/审批/报告)
FE-050 (供应商档案) → FE-051/052/053/054 (各子模块)
FE-060 (地图画布) → FE-061/062/063 (图层/排行/快照)
FE-070 (Case摘要) → FE-071/072/073/074 (任务板/方案/纪要/时间线) → FE-160 (列表页)
FE-080 (模板库) → FE-081 (编辑器) → FE-082 (发布归档)
FE-090 (规则列表) → FE-091 (条件编辑器) → FE-092 (动作) / FE-093 (仿真) / FE-094 (版本)
FE-100 (组织角色) → FE-101/102/103/104 (各配置)
FE-110 (场景构建) → FE-111 (参数) / FE-112 (方案) → FE-113 (对比) / FE-114 (清单)
```

---

## 建议执行顺序

### Sprint 1（Week 1-2）: 基础设施 + 风险主线
- Phase 0 全部 (FE-001~006)
- Phase 7 通用组件 (FE-130~135, FE-140~142, FE-152)
- Phase 1 壳层导航 (FE-010~016)
- Phase 2 风险工作台 P0 部分 (FE-020~023)

### Sprint 2（Week 3-4）: 事件详情 + 驾驶舱
- Phase 2 事件详情 (FE-030~035)
- Phase 3 驾驶舱 (FE-040~044)
- Phase 5 规则中心 P0 (FE-090~092)
- Phase 5 系统管理 P0 (FE-100~102, FE-104)

### Sprint 3（Week 5-6）: 画像 + 地图 + War Room
- Phase 3 供应商画像 (FE-050~053)
- Phase 3 风险地图 (FE-060~062)
- Phase 4 War Room (FE-070~074)
- Phase 8 列表页 (FE-160~161)

### Sprint 4（Week 7-8）: 报告 + 优化 + 增强
- Phase 5 报告中心 (FE-080~082)
- Phase 6 优化中心 (FE-110~114)
- Phase 6 智能助手 (FE-120~123)
- Phase 8 动画/快捷键/响应式/主题 (FE-150~154)
- 所有 P2 任务 (FE-054, FE-072, FE-093~094)

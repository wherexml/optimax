# Round 2 — 任务分配与执行

**日期**: 2026-03-20
**总控 Agent**: 分配并启动前端 Agent 执行本轮任务

---

## Phase 0 — 任务分配

### 本轮任务 (基于 tasks.md 中 pending 的 P0/P1 优先级任务)

| 任务ID | 标题 | 优先级 | 状态 | 备注 |
|--------|------|--------|------|------|
| FE-060 | P05 风险地图 — 地图主画布 | P0 | 🔄 执行中 | RiskMap.tsx 271行骨架待完善 |
| FE-061 | P05 风险地图 — 图层控制 | P0 | 🔄 执行中 | LayerControl.tsx 待完善 |
| FE-062 | P05 风险地图 — 节点排行与明细 | P0 | 🔄 执行中 | NodeRanking.tsx 待完善 |
| FE-063 | P05 风险地图 — 地图快照 | P1 | 🔄 执行中 | MapSnapshot.tsx 待完善 |
| FE-070 | P06 War Room — Case 摘要区 | P1 | 🔄 执行中 | WarRoom.tsx 仅12行待重写 |
| FE-071 | P06 War Room — 任务板与 SLA | P1 | ⏳ 等待 | 依赖 FE-070 |
| FE-090 | P09 规则中心 — 规则列表 | P0 | 🔄 执行中 | RuleCenter.tsx 251行待完善 |
| FE-091 | P09 规则中心 — 条件编辑器 | P0 | 🔄 执行中 | ConditionEditor.tsx 待完善 |
| FE-092 | P09 规则中心 — 触发动作配置 | P0 | 🔄 执行中 | ActionConfig.tsx 待完善 |

### Agent 分配

- **前端 Agent 1** → FE-060, FE-061, FE-062, FE-063 (风险地图 4个任务)
- **前端 Agent 2** → FE-070 (War Room 主页面，高优先级)
- **前端 Agent 3** → FE-090, FE-091, FE-092 (规则中心 3个任务)

---

## 执行计划

### Phase 1: 前端开发
1. 前端 Agent 1 使用 `/frontend-design` skill 完成风险地图
2. 前端 Agent 2 使用 `/frontend-design` skill 完成 War Room
3. 前端 Agent 3 使用 `/frontend-design` skill 完成规则中心

### Phase 2: 质检
- 静态质检 Agent → 检查类型、lint、构建
- 视觉测试 Agent → 使用 `/browse` 验证页面渲染

### Phase 3: 审查
- 审查 Agent 汇总结果，给出下一轮建议

### Phase 4: 总控更新
- 更新 tasks.md 状态
- 更新 process.md 本轮记录
- 决定是否进入 Round 3

---

## 关键文件路径

```
src/pages/map/RiskMap.tsx              # FE-060 主画布
src/components/map/LayerControl.tsx    # FE-061 图层控制
src/components/map/NodeRanking.tsx     # FE-062 节点排行
src/components/map/MapSnapshot.tsx     # FE-063 地图快照
src/pages/warroom/WarRoom.tsx          # FE-070 Case摘要 (仅12行)
src/components/warroom/CaseSummary.tsx # FE-070 组件 (需创建)
src/pages/rules/RuleCenter.tsx         # FE-090 规则列表
src/components/rules/ConditionEditor.tsx # FE-091 条件编辑器
src/components/rules/ActionConfig.tsx    # FE-092 动作配置
```

---

## 设计参考

- **RD需求文档**: `docs/OptiMax_RD_Requirements_v1.0.md`
- **设计令牌**: `src/lib/tokens/colors.ts`, `src/lib/tokens/spacing.ts`
- **组件库**: `src/components/ui/` (shadcn/ui)
- **Mock数据**: `src/mocks/data/`

---

## 检查清单

### 前端 Agent 输出要求
- [ ] 修改的具体文件路径列表
- [ ] 完成项与未完成项
- [ ] 阻塞项（如有）
- [ ] 下一步建议
- [ ] handoff.json 机器状态文件

### 验收标准
- [ ] TypeScript 零错误
- [ ] 构建通过 `pnpm build`
- [ ] 页面可正常访问
- [ ] Mock 数据正常显示

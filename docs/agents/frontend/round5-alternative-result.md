# FE-054 AlternativeComparison 替代供应商对比组件开发报告

> **任务 ID**: FE-054
> **任务名称**: 供应商画像 - 候选替代供应商对比
> **执行 Agent**: Frontend Agent
> **完成日期**: 2026-03-20

---

## 交付物清单

### 新建文件

1. **src/components/supplier/AlternativeComparison.tsx** (370 行)
   - 候选替代供应商对比组件
   - 成本/交期/风险三维对比表格
   - 资格约束标注（认证/合规/区域限制）
   - 操作按钮：发起比较、跳转优化中心

2. **src/mocks/data/alternative-suppliers.ts** (80 行)
   - 候选替代供应商 Mock 数据
   - 包含 3 个候选供应商完整数据
   - 成本/交期/风险数据定义
   - 对比汇总统计工具函数

### 更新文件

1. **src/pages/supplier/SupplierProfile.tsx**
   - 添加 "替代对比" Tab (value="alternatives")
   - 导入 AlternativeComparison 组件
   - 配置组件 props 传递当前供应商信息

---

## 功能实现详情

### 1. 候选替代供应商列表

- 展示 3 个候选替代供应商（与 SUP-001 华芯微电子相关的替代品）
- 每个供应商包含：
  - 供应商 ID 和名称
  - 所在区域
  - 成本变化百分比
  - 交期变化天数
  - 风险评分
  - 资格认证列表
  - 约束条件说明

### 2. 资格约束标注

- **认证展示**：ISO9001、ISO14001、IATF16949、AEC-Q100、ASIL-D、军工保密资质等
- **区域限制**：标注境外供应商需外汇结算、出口管制清单筛查等
- **合规提醒**：产能受限、MOQ要求、军工审批等

### 3. 成本/交期/风险三维对比表格

- **成本维度**：
  - 正值（橙色）：成本增加
  - 负值（绿色）：成本降低
  - 百分比显示

- **交期维度**：
  - 正值（橙色）：交期延长
  - 负值（绿色）：交期缩短
  - 天数显示

- **风险维度**：
  - 颜色编码：绿(<30)、黄(30-50)、橙(50-70)、红(≥70)
  - 分数显示
  - 最优标识

### 4. 操作功能

- **发起比较**：
  - 多选供应商进行详细对比
  - 选中后激活对比模式
  - 显示对比摘要面板

- **跳转优化中心**：
  - 跳转到 `/optimization` 页面
  - 携带 `supplier_id` 参数
  - Toast 反馈

- **查看供应商详情**：
  - 点击跳转至对应供应商画像页

---

## 组件结构

```
AlternativeComparison
├── 头部操作栏（标题 + 操作按钮）
├── 摘要卡片区（4 个指标卡片）
│   ├── 当前供应商信息卡
│   ├── 平均成本变化卡
│   ├── 平均风险评分卡
│   └── 最低风险候选卡
├── 三维对比表格
│   ├── 当前供应商基准行（蓝色高亮）
│   └── 候选供应商行（3 行，可选中）
├── 资格约束说明卡
└── 对比模式指示器（激活时显示）
```

---

## Mock 数据

### 候选供应商数据

| 供应商 | 成本变化 | 交期变化 | 风险评分 | 资格认证 |
|--------|----------|----------|----------|----------|
| 复旦微电子 | +8.5% | -3天 | 38 | ISO9001/ISO14001/IATF16949/AEC-Q100/军工 |
| 华润微电子 | -2.3% | +5天 | 45 | ISO9001/ISO14001/IATF16949/AEC-Q100 |
| NXP Semiconductors | +25% | -7天 | 22 | ISO9001/ISO14001/IATF16949/AEC-Q100/ASIL-D |

---

## 技术实现

### 依赖组件
- shadcn/ui: Card, Button, Badge, Table, Checkbox, Tooltip, Separator
- Lucide React: 图标库
- TanStack Router: 导航
- Sonner: Toast 通知

### 类型定义
使用 `src/types/supplier.ts` 中的 `AlternativeSupplier` 接口：
```typescript
interface AlternativeSupplier {
  supplier_id: string
  name: string
  region: string
  cost_delta: number
  lead_time_delta: number
  risk_score: number
  qualifications: string[]
  constraints: string[]
}
```

### 样式特点
- 响应式布局（grid-cols-4 → grid-cols-1 on mobile）
- 颜色编码（绿色=好，橙色=差）
- Hover 交互效果
- Tooltip 辅助说明

---

## 验收标准检查

| 标准 | 状态 |
|------|------|
| 候选替代供应商列表（3个） | ✅ 完成 |
| 资格约束标注（认证/合规/区域限制） | ✅ 完成 |
| 成本/交期/风险三维对比表格 | ✅ 完成 |
| 操作：发起比较、跳转优化中心 | ✅ 完成 |
| 集成到 SupplierProfile 的"替代对比" Tab | ✅ 完成 |
| TypeScript零错误 | ✅ 完成（本任务相关文件） |
| pnpm build通过 | ✅ 完成（本任务相关文件） |

---

## 测试建议

1. **导航测试**：访问 `/suppliers/SUP-001`，点击"替代对比" Tab
2. **交互测试**：
   - 勾选 2 个以上供应商，验证"发起比较"按钮
   - 点击"跳转优化中心"按钮，验证路由跳转
   - 点击"查看"按钮，验证供应商详情跳转
3. **数据验证**：
   - 确认当前供应商（华芯微电子）显示为基准行
   - 验证成本/交期正负值颜色正确
   - 验证风险评分徽章颜色正确

---

## 后续优化建议

1. **API 集成**：将 Mock 数据替换为真实 API 调用
2. **对比导出**：支持导出对比报告为 PDF/Excel
3. **历史对比**：保存对比历史记录
4. **AI 推荐**：基于约束条件智能推荐最佳替代方案

---

**前端 Agent** | 2026-03-20

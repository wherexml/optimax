# OptiMax 前端开发指南

## 架构概览

```
App.tsx
└── AppShell (布局容器)
    ├── Sidebar (导航)
    ├── TopBar (顶部栏)
    └── ContentArea (内容区)
        └── Router Outlet (TanStack Router)
```

---

## 路由系统

使用 `@tanstack/react-router`，配置在 `src/router.tsx`。

### 添加新路由

```typescript
// src/router.tsx
const routeTree = rootRoute.addChildren([
  indexRoute,
  // 新增路由
  route('new-page', '/new-page', () => import('./pages/NewPage')),
]);
```

### 路由守卫

使用 `beforeLoad` 钩子实现权限控制:

```typescript
const someRoute = new Route({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/login' });
    }
  },
});
```

### 动态路由参数

```typescript
// 定义: route('events/$eventId', '/events/:eventId')
// 使用:
import { useParams } from '@tanstack/react-router';
const { eventId } = useParams({ from: '/events/$eventId' });
```

---

## 状态管理

### Zustand Store 模式

```typescript
// src/stores/example.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ExampleState {
  value: string;
  setValue: (value: string) => void;
}

export const useExampleStore = create<ExampleState>()(
  persist(
    (set) => ({
      value: '',
      setValue: (value) => set({ value }),
    }),
    { name: 'example-storage' }
  )
);
```

### React Query 数据获取

```typescript
// src/hooks/useData.ts
import { useQuery } from '@tanstack/react-query';

export function useData(id: string) {
  return useQuery({
    queryKey: ['data', id],
    queryFn: async () => {
      const res = await fetch(`/api/data/${id}`);
      return res.json();
    },
    enabled: !!id,
  });
}
```

---

## 组件开发

### 创建新组件

```typescript
// src/components/example/ExampleCard.tsx
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface ExampleCardProps {
  title: string;
  className?: string;
}

export function ExampleCard({ title, className }: ExampleCardProps) {
  return (
    <Card className={cn('p-4', className)}>
      <h3>{title}</h3>
    </Card>
  );
}
```

```typescript
// src/components/example/index.ts
export { ExampleCard } from './ExampleCard';
```

### 使用 shadcn/ui 组件

```typescript
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Variants: default, destructive, outline, ghost, link
<Button variant="outline">Click me</Button>
```

### 表单处理

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export function MyForm() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '' },
  });

  return (
    <form onSubmit={form.handleSubmit(console.log)}>
      <input {...form.register('name')} />
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

---

## 地图开发

### deck.gl 集成

```typescript
import { DeckGL } from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import { Map } from 'react-map-gl/maplibre';

function RiskMap() {
  const layers = [
    new GeoJsonLayer({
      id: 'risk-nodes',
      data: riskData,
      getFillColor: [255, 0, 0, 180],
      getRadius: 1000,
    }),
  ];

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={layers}
    >
      <Map mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json" />
    </DeckGL>
  );
}
```

---

## 动画集成

```typescript
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/animations';

export function AnimatedList({ items }: { items: string[] }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {items.map((item) => (
        <motion.div key={item} variants={fadeInUp}>
          {item}
        </motion.div>
      ))}
    </motion.div>
  );
}
```

---

## 快捷键开发

```typescript
// src/hooks/useHotkeys.ts
import { useHotkeys } from 'react-hotkeys-hook';

useHotkeys('alt+r', () => {
  // 重新分析
});
```

---

## Mock 数据

### MSW 配置

```typescript
// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/data', () => {
    return HttpResponse.json({ data: mockData });
  }),
];
```

### 直接使用 Mock 数据

```typescript
// src/hooks/useCases.ts
import { cases } from '@/mocks/data/cases';

export function useCases() {
  return useQuery({
    queryKey: ['cases'],
    queryFn: async () => cases,
  });
}
```

---

## 样式开发

### Tailwind CSS

```typescript
// 使用设计令牌
<div className="p-6 bg-brand text-white shadow-card">

// 条件类名
<div className={cn(
  'p-4',
  isActive && 'bg-accent',
  className
)}>

// 响应式
<div className="hidden md:block lg:grid lg:grid-cols-3">
```

### CSS 变量

```css
/* src/styles/globals.css */
:root {
  --color-primary: #173F5F;
  --color-accent: #2F6FED;
}
```

---

## 工具函数

```typescript
import { cn } from '@/lib/utils';

// 合并类名
cn('px-4 py-2', isActive && 'bg-blue-500', className)

// 格式化
formatDate(date)     // 格式化日期
formatNumber(num)    // 格式化数字
formatCurrency(num)  // 格式化货币
```

---

## 常见模式

### 数据展示

```typescript
// 使用 DataTable
import { DataTable } from '@/components/DataTable';
import { FilterBar } from '@/components/filter';

<DataTable
  data={data}
  columns={columns}
  searchKey="name"
/>
```

### 状态反馈

```typescript
import { toast } from 'sonner';

toast.success('操作成功');
toast.error('操作失败');
toast.loading('加载中...');
```

### 加载状态

```typescript
import { Skeleton } from '@/components/skeleton';

<Skeleton className="h-4 w-[200px]" />
```

---

## 目录约定

- 页面组件 → `src/pages/[feature]/PageName.tsx`
- 业务组件 → `src/components/[feature]/`
- Hooks → `src/hooks/useXxx.ts`
- Store → `src/stores/xxx.ts`
- 类型 → `src/types/xxx.ts`
- Mock → `src/mocks/data/xxx.ts`

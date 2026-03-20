import React, { type ReactNode } from 'react'
import {
  createRouter,
  createRootRouteWithContext,
  createRoute,
  redirect,
  Outlet,
  ScrollRestoration,
} from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'

// Layout
const AppShell = React.lazy(() => import('@/components/layout/AppShell'))

// Lazy-loaded page components
const Login = React.lazy(() => import('@/pages/Login'))
const Dashboard = React.lazy(() => import('@/pages/Dashboard'))
const Workbench = React.lazy(() => import('@/pages/risk/Workbench'))
const EventDetail = React.lazy(() => import('@/pages/risk/EventDetail'))
const SupplierList = React.lazy(() => import('@/pages/supplier/SupplierList'))
const SupplierProfile = React.lazy(
  () => import('@/pages/supplier/SupplierProfile'),
)
const RiskMap = React.lazy(() => import('@/pages/map/RiskMap'))
const WarRoomList = React.lazy(() => import('@/pages/warroom/WarRoomList'))
const WarRoom = React.lazy(() => import('@/pages/warroom/WarRoom'))
const OptimizationCenter = React.lazy(
  () => import('@/pages/optimization/OptimizationCenter'),
)
const ReportCenter = React.lazy(() => import('@/pages/reports/ReportCenter'))
const RuleCenter = React.lazy(() => import('@/pages/rules/RuleCenter'))
const SystemAdmin = React.lazy(() => import('@/pages/admin/SystemAdmin'))
const OrgRoles = React.lazy(() => import('@/pages/admin/OrgRoles'))
const DataSources = React.lazy(() => import('@/pages/admin/DataSources'))
const Subscriptions = React.lazy(() => import('@/pages/admin/Subscriptions'))
const SLAConfig = React.lazy(() => import('@/pages/admin/SLAConfig'))
const AuditLog = React.lazy(() => import('@/pages/admin/AuditLog'))
const NotFound = React.lazy(() => import('@/pages/NotFound'))
const ErrorPage = React.lazy(() => import('@/pages/Error'))

// --- Auth guard helper ---

function isAuthenticated(): boolean {
  return !!localStorage.getItem('token')
}

function requireAuth() {
  if (!isAuthenticated()) {
    throw redirect({ to: '/login' })
  }
}

// --- Suspense wrapper ---

function SuspenseWrapper({ children }: { children: ReactNode }) {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-gray-400">Loading...</div>
        </div>
      }
    >
      {children}
    </React.Suspense>
  )
}

// --- Router context ---

interface RouterContext {
  queryClient: QueryClient
}

// --- Root route ---

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <SuspenseWrapper>
      <ScrollRestoration />
      <Outlet />
    </SuspenseWrapper>
  ),
  errorComponent: () => (
    <SuspenseWrapper>
      <ErrorPage />
    </SuspenseWrapper>
  ),
  notFoundComponent: () => (
    <SuspenseWrapper>
      <NotFound />
    </SuspenseWrapper>
  ),
})

// --- Public routes ---

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: () => <Login />,
  beforeLoad: () => {
    if (isAuthenticated()) {
      throw redirect({ to: '/' })
    }
  },
})

// --- Authenticated layout route ---

const authenticatedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'authenticated',
  component: () => <AppShell />,
  beforeLoad: requireAuth,
})

// --- Authenticated routes (children of layout) ---

const dashboardRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/',
  component: () => <Dashboard />,
})

const workbenchRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/risk/workbench',
  component: () => <Workbench />,
})

const eventDetailRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/risk/events/$eventId',
  component: () => <EventDetail />,
})

const supplierListRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/suppliers',
  component: () => <SupplierList />,
})

const supplierProfileRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/suppliers/$supplierId',
  component: () => <SupplierProfile />,
})

const riskMapRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/map',
  component: () => <RiskMap />,
})

const warRoomListRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/warroom',
  component: () => <WarRoomList />,
})

const warRoomDetailRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/warroom/$caseId',
  component: () => <WarRoom />,
})

const optimizationRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/optimization',
  component: () => <OptimizationCenter />,
})

const reportsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/reports',
  component: () => <ReportCenter />,
})

const rulesRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/rules',
  component: () => <RuleCenter />,
})

// --- Admin routes (with nested outlet) ---

const adminRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/admin',
  component: () => <SystemAdmin />,
})

const adminOrgRolesRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/org-roles',
  component: () => <OrgRoles />,
})

const adminDataSourcesRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/data-sources',
  component: () => <DataSources />,
})

const adminSubscriptionsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/subscriptions',
  component: () => <Subscriptions />,
})

const adminSLARoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/sla',
  component: () => <SLAConfig />,
})

const adminAuditRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/audit',
  component: () => <AuditLog />,
})

// --- Route tree ---

const routeTree = rootRoute.addChildren([
  loginRoute,
  authenticatedRoute.addChildren([
    dashboardRoute,
    workbenchRoute,
    eventDetailRoute,
    supplierListRoute,
    supplierProfileRoute,
    riskMapRoute,
    warRoomListRoute,
    warRoomDetailRoute,
    optimizationRoute,
    reportsRoute,
    rulesRoute,
    adminRoute.addChildren([
      adminOrgRolesRoute,
      adminDataSourcesRoute,
      adminSubscriptionsRoute,
      adminSLARoute,
      adminAuditRoute,
    ]),
  ]),
])

// --- Create router ---

export function createAppRouter(queryClient: QueryClient) {
  return createRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: 'intent',
  })
}

// --- Type registration ---

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createAppRouter>
  }
}

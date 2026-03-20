import {
  LayoutDashboard,
  ShieldAlert,
  Building2,
  Users,
  Settings2,
  FileText,
  Shield,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  label: string
  icon: LucideIcon
  path?: string
  children?: NavChild[]
}

export interface NavChild {
  label: string
  path: string
}

export const navigationItems: NavItem[] = [
  {
    label: '首页驾驶舱',
    icon: LayoutDashboard,
    path: '/',
  },
  {
    label: '风险运营',
    icon: ShieldAlert,
    children: [
      { label: '工作台', path: '/risk/workbench' },
    ],
  },
  {
    label: '供应商与网络',
    icon: Building2,
    children: [
      { label: '供应商列表', path: '/suppliers' },
      { label: '风险地图', path: '/map' },
    ],
  },
  {
    label: '协同处置',
    icon: Users,
    path: '/warroom',
  },
  {
    label: '优化中心',
    icon: Settings2,
    path: '/optimization',
  },
  {
    label: '报告中心',
    icon: FileText,
    path: '/reports',
  },
  {
    label: '管理后台',
    icon: Shield,
    children: [
      { label: '规则中心', path: '/rules' },
      { label: '系统管理', path: '/admin' },
    ],
  },
]

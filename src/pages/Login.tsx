import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import {
  ShieldCheck,
  BarChart3,
  Users,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/stores/auth'

const features = [
  {
    icon: ShieldCheck,
    title: '实时风险监测',
    desc: '全天候监控供应链各环节风险因素，自动预警',
  },
  {
    icon: BarChart3,
    title: '智能分析决策',
    desc: '基于 AI 的风险评估模型，辅助快速决策',
  },
  {
    icon: Users,
    title: '协同处置闭环',
    desc: '跨部门协作，端到端追踪处置进展',
  },
]

export default function Login() {
  const router = useRouter()
  const login = useAuthStore((s) => s.login)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('请输入邮箱和密码')
      return
    }

    setLoading(true)

    // Mock login - simulate network delay
    await new Promise((r) => setTimeout(r, 600))

    const mockUser = {
      id: 'user-1',
      name: email.split('@')[0] || '用户',
      email,
      role: 'admin',
    }

    login('mock-token-' + Date.now(), mockUser)
    setLoading(false)
    router.navigate({ to: '/' })
  }

  return (
    <div className="flex h-screen min-h-[600px] min-w-[1024px]">
      {/* Left: Brand Panel */}
      <div
        className="relative flex w-[60%] flex-col justify-center px-16"
        style={{
          background: 'linear-gradient(135deg, #173F5F 0%, #0F2739 100%)',
        }}
      >
        {/* Decorative circles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-white/[0.03]" />
          <div className="absolute -bottom-32 right-10 h-96 w-96 rounded-full bg-white/[0.02]" />
          <div className="absolute right-1/4 top-1/4 h-48 w-48 rounded-full bg-white/[0.04]" />
        </div>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-bold tracking-tight text-white">
            OptiMax
          </h1>
          <p className="mt-4 text-lg text-white/70">
            智能供应链风险预警与协同处置平台
          </p>

          <div className="mt-12 flex flex-col gap-8">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <f.icon className="h-5 w-5 text-white/80" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">
                    {f.title}
                  </h3>
                  <p className="mt-1 text-sm text-white/50">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="absolute bottom-8 left-16 text-xs text-white/30">
          &copy; 2026 OptiMax. All rights reserved.
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex w-[40%] items-center justify-center bg-white px-8">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold text-neutral-900">欢迎回来</h2>
          <p className="mt-2 text-sm text-neutral-500">
            登录您的 OptiMax 账户以继续
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-sm text-neutral-700">
                邮箱地址
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="h-10"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-sm text-neutral-700">
                密码
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="h-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={remember}
                  onCheckedChange={(v) => setRemember(v === true)}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-normal text-neutral-600"
                >
                  记住我
                </Label>
              </div>
              <button
                type="button"
                className="text-sm text-accent-brand-500 hover:text-accent-brand-600 hover:underline"
              >
                忘记密码？
              </button>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-danger-500">{error}</p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className={cn(
                'h-10 w-full bg-brand-500 text-white hover:bg-brand-600',
                'transition-colors duration-200',
              )}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? '登录中...' : '登录'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

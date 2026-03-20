import { useNavigate } from '@tanstack/react-router'
import { Bell, LogOut, Moon, Sun, User, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/stores/auth'
import { useTheme } from '@/hooks/useTheme'
import type { Theme } from '@/stores/theme'

export default function UserMenu() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const { theme, setTheme, resolvedTheme } = useTheme()

  const handleLogout = () => {
    logout()
    navigate({ to: '/login' })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-md px-2 py-1 text-sm text-neutral-600 transition-colors hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:text-neutral-400 dark:hover:bg-neutral-800">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-brand-100 text-xs text-brand-600 dark:bg-brand-900 dark:text-brand-300">
              {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
            </AvatarFallback>
          </Avatar>
          <span
            className={cn(
              'hidden max-w-[100px] truncate font-medium desktop:block',
            )}
          >
            {user?.name ?? '用户'}
          </span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.name ?? '用户'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email ?? ''}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer gap-2">
          <User className="h-4 w-4" />
          个人信息
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer gap-2">
          <Bell className="h-4 w-4" />
          通知偏好
        </DropdownMenuItem>

        {/* Theme Switcher Submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer gap-2">
            {resolvedTheme === 'dark' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
            主题设置
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(value as Theme)}>
              <DropdownMenuRadioItem value="light" className="gap-2 cursor-pointer">
                <Sun className="h-4 w-4" />
                浅色模式
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark" className="gap-2 cursor-pointer">
                <Moon className="h-4 w-4" />
                深色模式
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system" className="gap-2 cursor-pointer">
                <Monitor className="h-4 w-4" />
                跟随系统
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer gap-2 text-red-600 focus:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

import { Link } from '@tanstack/react-router'
import { Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <motion.div
        className="flex flex-col items-center text-center px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <h1
          className="font-bold leading-none text-muted-foreground/20 select-none"
          style={{ fontSize: 200 }}
        >
          404
        </h1>
        <h2 className="-mt-4 text-2xl font-bold text-foreground">
          页面未找到
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          您访问的页面不存在或已被移除
        </p>
        <Button className="mt-8" asChild>
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            返回首页
          </Link>
        </Button>
      </motion.div>
    </div>
  )
}

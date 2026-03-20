import { Outlet } from '@tanstack/react-router'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function ContentArea() {
  return (
    <ScrollArea className="h-full">
      <main className="p-6">
        <Outlet />
      </main>
    </ScrollArea>
  )
}

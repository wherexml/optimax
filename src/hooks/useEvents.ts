import { useQuery } from '@tanstack/react-query'
import type { RiskEvent } from '@/types/event'

export function useEvents() {
  return useQuery<RiskEvent[]>({
    queryKey: ['events'],
    queryFn: async () => {
      const res = await fetch('/api/events')
      if (!res.ok) throw new Error('Failed to fetch events')
      return res.json() as Promise<RiskEvent[]>
    },
  })
}

export function useEvent(id: string) {
  return useQuery<RiskEvent>({
    queryKey: ['events', id],
    queryFn: async () => {
      const res = await fetch(`/api/events/${id}`)
      if (!res.ok) throw new Error('Failed to fetch event')
      return res.json() as Promise<RiskEvent>
    },
    enabled: !!id,
  })
}

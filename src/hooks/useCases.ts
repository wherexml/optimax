import { useQuery } from '@tanstack/react-query'
import type { Case } from '@/mocks/data/cases'

export function useCases() {
  return useQuery<Case[]>({
    queryKey: ['cases'],
    queryFn: async () => {
      const res = await fetch('/api/cases')
      if (!res.ok) throw new Error('Failed to fetch cases')
      return res.json() as Promise<Case[]>
    },
  })
}

export function useCase(id: string) {
  return useQuery<Case>({
    queryKey: ['cases', id],
    queryFn: async () => {
      const res = await fetch(`/api/cases/${id}`)
      if (!res.ok) throw new Error('Failed to fetch case')
      return res.json() as Promise<Case>
    },
    enabled: !!id,
  })
}

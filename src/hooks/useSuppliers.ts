import { useQuery } from '@tanstack/react-query'
import type { MockSupplierProfile } from '@/mocks/data/suppliers'

export function useSuppliers() {
  return useQuery<MockSupplierProfile[]>({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const res = await fetch('/api/suppliers')
      if (!res.ok) throw new Error('Failed to fetch suppliers')
      return res.json() as Promise<MockSupplierProfile[]>
    },
  })
}

export function useSupplier(id: string) {
  return useQuery<MockSupplierProfile>({
    queryKey: ['suppliers', id],
    queryFn: async () => {
      const res = await fetch(`/api/suppliers/${id}`)
      if (!res.ok) throw new Error('Failed to fetch supplier')
      return res.json() as Promise<MockSupplierProfile>
    },
    enabled: !!id,
  })
}

import { http, HttpResponse } from 'msw'
import { mockSuppliers } from '../data/suppliers'

export const supplierHandlers = [
  http.get('/api/suppliers', () => {
    return HttpResponse.json(mockSuppliers)
  }),

  http.get('/api/suppliers/:id', ({ params }) => {
    const supplier = mockSuppliers.find((s) => s.supplier_id === params.id)
    if (!supplier) {
      return HttpResponse.json(
        { message: 'Supplier not found' },
        { status: 404 },
      )
    }
    return HttpResponse.json(supplier)
  }),
]

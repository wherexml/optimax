import { http, HttpResponse } from 'msw'
import { cases } from '../data/cases'

export const caseHandlers = [
  http.get('/api/cases', () => {
    return HttpResponse.json(cases)
  }),

  http.get('/api/cases/:id', ({ params }) => {
    const c = cases.find((item) => item.id === params.id)
    if (!c) {
      return HttpResponse.json({ message: 'Case not found' }, { status: 404 })
    }
    return HttpResponse.json(c)
  }),
]

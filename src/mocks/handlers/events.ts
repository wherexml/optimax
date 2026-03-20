import { http, HttpResponse } from 'msw'
import { mockEventListItems, mockFullEvents } from '../data/events'

export const eventHandlers = [
  http.get('/api/events', () => {
    return HttpResponse.json(mockEventListItems)
  }),

  http.get('/api/events/:id', ({ params }) => {
    const event = mockFullEvents[params.id as string]
    if (!event) {
      return HttpResponse.json({ message: 'Event not found' }, { status: 404 })
    }
    return HttpResponse.json(event)
  }),
]

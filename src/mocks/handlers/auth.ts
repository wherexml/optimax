import { http, HttpResponse } from 'msw'

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as {
      email?: string
      password?: string
    }

    if (body.email && body.password) {
      return HttpResponse.json({
        token: 'mock-jwt-token',
        user: {
          id: '1',
          name: 'Demo User',
          email: body.email,
          role: 'admin',
        },
      })
    }

    return HttpResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 },
    )
  }),
]

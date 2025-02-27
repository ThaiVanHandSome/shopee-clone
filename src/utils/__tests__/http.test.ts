import { beforeEach } from 'node:test'
import { HttpStatusCode } from 'src/constants/httpStatusCode.enum'
import http from 'src/utils/http'
import { describe, expect, it } from 'vitest'

describe('http axios', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('Gọi API', async () => {
    const res = await http.get('products')
    expect(res.status).toBe(HttpStatusCode.Ok)
  })

  it('Auth request', async () => {
    await http.post('login', {
      email: 'user939@gmail.com',
      password: '123456'
    })
    const res = await http.get('me')
    expect(res.status).toBe(HttpStatusCode.Ok)
  })

  it('Refresh token', async () => {
    await http.post(
      'login',
      {
        email: 'user939@gmail.com',
        password: '123456'
      },
      {
        headers: {
          'expire-access-token': 1,
          'expire-refresh-token': 10000000000
        }
      }
    )
    await new Promise((resolve) => setTimeout(resolve, 3000))
    const res = await http.get('me')
    expect(res.status).toBe(HttpStatusCode.Ok)
  })
})

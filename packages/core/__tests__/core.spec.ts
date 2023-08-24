import { describe, test, expect } from 'vitest'
import { Client, useClient } from '../src/index'

const BASE_URL = '/'
const ACCESS_TOKEN = ''

const onRequest = <T extends Client>(options: T): T => {
  options.headers({ Authorization: ACCESS_TOKEN })
  return options
}

describe('core package', () => {
  test('should fetch target url', async () => {
    const { client } = useClient<{
      paths: {
        '/pets': {
          post: {
            body: { pageSize: number }
            response: { data: boolean }
          }
        }
      }
    }>({ baseURL: BASE_URL, onRequest })
    const { data } = await client('/pets').body({ pageSize: 10 }).post()
    expect(!!data).toBe(true)
  })

  test('should set header before fetch', async () => {
    const headers: Record<string, string> = {}
    const { client } = useClient({
      baseURL: BASE_URL,
      onRequest: (options) => {
        headers.Authorization = ACCESS_TOKEN
        options.headers(headers)
        return options
      }
    })
    await client('/kube/listpods').body({}).post()
    expect(!!headers.Authorization).toBe(true)
  })

  test('should set flag after fetch', async () => {
    let flag = false
    const { client } = useClient({
      baseURL: BASE_URL,
      onResponse: () => {
        flag = true
      }
    })
    await client('/kube/listpods').body({}).post()
    expect(flag).toBe(true)
  })
})

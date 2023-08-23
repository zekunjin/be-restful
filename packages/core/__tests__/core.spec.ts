import { describe, test, expect } from 'vitest'
import { Client, useClient } from '../src/index'

const BASE_URL = '/'
const ACCESS_TOKEN = ''

const beforeFetch = <T extends Client>(options: T): T => {
  options.headers({ Authorization: ACCESS_TOKEN })
  return options
}

describe('core package', () => {
  test('should fetch target url', async () => {
    const { client } = useClient({ baseURL: BASE_URL, beforeFetch })
    const { data } = await client('/kube/listnodes').body({}).post()
    expect(!!data).toBe(true)
  })

  test('should set header before fetch', async () => {
    const headers: Record<string, string> = {}
    const { client } = useClient({
      baseURL: BASE_URL,
      beforeFetch: (options) => {
        headers.Authorization = ACCESS_TOKEN
        options.headers(headers)
        return options
      }
    })
    await client('/kube/listpods').body({}).post()
    expect(!!headers.Authorization).toBe(true)
  })
})

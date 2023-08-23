import { describe, test, expect } from 'vitest'
import { useClient } from '../src/index'

const BASE_URL = '/'

describe('core package', () => {
  test('should fetch target url', async () => {
    const { client } = useClient({ baseURL: BASE_URL })
    const res = await client('/auditlog/list').body({}).post()
    expect(!!res.data).toBe(true)
  })
})

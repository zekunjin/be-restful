import { describe, test, expect } from 'vitest'
import { getOpenapiJSON } from '@be-restful/cli'
import { useClient } from '../src/index'

const BASE_URL = '/'

describe('core package', () => {
  test('should load openapi config', async () => {
    const conf = await getOpenapiJSON({ force: true })
    expect(conf.openapi).toBe('2.0')
  })

  test('should fetch target url', async () => {
    const { client } = useClient({ baseURL: BASE_URL })
    const res = await client('/auditlog/list').body({}).post()
    expect(!!res.data).toBe(true)
  })
})

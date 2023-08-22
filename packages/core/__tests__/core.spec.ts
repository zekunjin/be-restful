import { describe, test, expect } from 'vitest'
import { readSwaggerJson } from '@be-restful/cli'
import { useClient } from '../src/index'

const BASE_URL = '/'

describe('core package', () => {
  test('should load swagger config', async () => {
    const conf = await readSwaggerJson({ force: true })
    expect(conf.openapi).toBe('2.0')
  })

  test('should fetch target url', async () => {
    const { client } = await useClient({ baseURL: BASE_URL })
    const res = await client('/auditlog/list').body({}).post()
    expect(!!res.data).toBe(true)
  })
})

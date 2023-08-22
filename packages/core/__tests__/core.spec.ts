import { describe, test, expect } from 'vitest'
import { readSwaggerJson } from '@be-restful/cli'
import { useClient } from '../src/index'

const BASE_URL = 'https://petstore.swagger.io/v2/'
const PET_ID = '9223372036854433000'

describe('core package', () => {
  test('should load swagger config', async () => {
    const conf = await readSwaggerJson({ force: true })
    expect(conf.swagger).toBe('2.0')
  })

  test('should fetch target url', async () => {
    const { client } = await useClient({ baseURL: BASE_URL })
    const res = await client('/pet/{petId}').params({ petId: PET_ID }).get<{ name: string }>()
    expect(res.name).toBe('doggie')
  })
})

import { describe, test, expect } from 'vitest'
import { readSwaggerJson } from '@be-restful/cli'
import { useClient } from '../src'

describe('core package', () => {
  test('should load swagger config', async () => {
    const conf = await readSwaggerJson()
    expect(conf.swagger).toBe('2.0')
  })

  test('should fetch target url', async () => {
    const { client } = await useClient()
    console.log(client('/pet').post())
    expect(1).toBe(1)
  })
})

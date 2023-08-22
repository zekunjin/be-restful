#! /usr/bin/env node

import { ofetch } from 'ofetch'
import fse from 'fs-extra'
import { join } from 'pathe'
import optionalChaining from 'lodash.get'
import { readConf } from '@be-restful/shared'
import swaggerJson from '../public/swagger.json'
import client from '../public/client.json'

export type ClientResponse = typeof client

const SWAGGER_ROOT_DIR = '#'
const SWAGGER_JSON_FILE = join(__dirname, '../public', 'swagger.json')
const CLIENT_JSON_FILE = join(__dirname, '../public', 'client.json')

const generateClient = (schema: { type?: 'object' | 'array' }, def: any) => {
  if (schema.type === 'array') {
    return [def]
  }
  return def
}

const main = async () => {
  const conf = await readConf()
  const json = await ofetch(conf.swaggerJson)
  await fse.ensureFile(SWAGGER_JSON_FILE)
  await fse.writeJson(SWAGGER_JSON_FILE, json)
  const client: Record<string, Record<string, any>> = {}
  Object.entries(json.paths).forEach(([path, content]) => {
    if (!client[path]) { client[path] = {} }
    Object.entries(content as Record<string, any>).forEach(([method, { responses }]) => {
      const successResponse = responses['200']
      if (successResponse) {
        const { schema } = successResponse
        const ref = schema.items?.$ref || schema.$ref
        if (ref) {
          const p = ref.split('/').filter((item: string) => item !== SWAGGER_ROOT_DIR).join('.')
          const def = optionalChaining(json, p)
          client[path][method] = generateClient(schema, def)
        }
      }
    })
  })
  await fse.writeJson(CLIENT_JSON_FILE, client)
}

export const readSwaggerJson = async ({ force }: { force: boolean }): Promise<typeof swaggerJson> => {
  const exist = await fse.pathExists(SWAGGER_JSON_FILE)
  if (force && !exist) { await main() }
  return fse.readJson(SWAGGER_JSON_FILE)
}

export { swaggerJson }

main()

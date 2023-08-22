#! /usr/bin/env node

import { ofetch } from 'ofetch'
import fse from 'fs-extra'
import { join, relative } from 'pathe'
import { readConf, execAsync } from '@be-restful/shared'
import swaggerJson from '../public/swagger.json'

export * from '../public/client'

const SWAGGER_JSON_FILE = join(__dirname, '../public', 'swagger.json')
const CLIENT_DTS_FILE = join(__dirname, '../public', 'client.ts')

const main = async () => {
  const conf = await readConf()
  const json = await ofetch(conf.swaggerJson)
  await fse.ensureFile(SWAGGER_JSON_FILE)
  await fse.writeJson(SWAGGER_JSON_FILE, json)
  const from = relative('.', SWAGGER_JSON_FILE)
  const to = relative('.', CLIENT_DTS_FILE)
  await execAsync(`npx openapi-typescript ${from} -o ${to}`)
}

export const readSwaggerJson = async ({ force }: { force: boolean }): Promise<typeof swaggerJson> => {
  const exist = await fse.pathExists(SWAGGER_JSON_FILE)
  if (force && !exist) { await main() }
  return fse.readJson(SWAGGER_JSON_FILE)
}

export { swaggerJson }

main()

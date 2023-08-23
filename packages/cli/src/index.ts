#! /usr/bin/env node

import { ofetch } from 'ofetch'
import fse from 'fs-extra'
import { join, relative } from 'pathe'
import { readConf, execAsync } from '@be-restful/shared'
import openapiJSON from '../public/openapi.json'

export * from '../public/client'

const OPENAPI_JSON_FILE = join(__dirname, '../public', 'openapi.json')
const CLIENT_DTS_FILE = join(__dirname, '../public', 'client.ts')

const main = async () => {
  const conf = await readConf()
  const json = await ofetch(conf.openapi)
  await fse.ensureFile(OPENAPI_JSON_FILE)
  await fse.writeJson(OPENAPI_JSON_FILE, json)
  const from = relative('.', OPENAPI_JSON_FILE)
  const to = relative('.', CLIENT_DTS_FILE)
  await execAsync(`npx openapi-typescript ${from} -o ${to}`)
}

export const getOpenapiJSON = async ({ force }: { force: boolean }): Promise<typeof openapiJSON> => {
  const exist = await fse.pathExists(OPENAPI_JSON_FILE)
  if (force && !exist) { await main() }
  return fse.readJson(OPENAPI_JSON_FILE)
}

export { openapiJSON }

main()

#! /usr/bin/env node

import { ofetch } from 'ofetch'
import fse from 'fs-extra'
import { join } from 'pathe'
import { readConf } from '@be-restful/shared'
import swaggerJson from '../public/swagger.json'

const SWAGGER_JSON_FILE = join(__dirname, '../public', 'swagger.json')

console.log(SWAGGER_JSON_FILE)
debugger

const main = async () => {
  const conf = await readConf()
  const json = await ofetch(conf.swaggerJson)
  await fse.ensureFile(SWAGGER_JSON_FILE)
  await fse.writeJson(SWAGGER_JSON_FILE, json)
}

export const readSwaggerJson = async (): Promise<typeof swaggerJson> => {
  const exist = await fse.pathExists(SWAGGER_JSON_FILE)
  if (!exist) { await main() }
  return fse.readJson(SWAGGER_JSON_FILE)
}

export { swaggerJson }

main()

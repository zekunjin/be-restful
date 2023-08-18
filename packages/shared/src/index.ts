import { loadConfig } from 'c12'

export interface RestfulConfig {
  swaggerJSON: string
}

export const CONFIG_FILENAME = 'restful'

export const readConf = async (path = process.cwd()) => {
  const { config } = await loadConfig<RestfulConfig>({ name: CONFIG_FILENAME, cwd: path })
  if (!config) {
    throw new Error('Can not find restful config file.')
  }
  return config
}

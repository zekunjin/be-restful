import { exec } from 'node:child_process'
import { loadConfig } from 'c12'

export interface RestfulConfig {
  openapi: string
}

export const CONFIG_FILENAME = 'be-restful'

export const readConf = async (path = process.cwd()) => {
  const { config } = await loadConfig<RestfulConfig>({ name: CONFIG_FILENAME, cwd: path })
  if (!config) {
    throw new Error('Can not find restful config file.')
  }
  return config
}

export const execAsync = (cmd: string, options: { console?: boolean } = { console: true }) => {
  return new Promise((resolve, reject) => {
    const p = exec(cmd, (error, stdout) => {
      if (error) {
        reject(error)
        return
      }
      resolve(stdout)
    })

    if (options.console) {
      p.stdout?.pipe(process.stdout)
    }
  })
}

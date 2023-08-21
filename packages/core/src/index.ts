import { ofetch } from 'ofetch'
import { Swagger } from '@be-restful/swagger'

import conf from '../config.json'

class Client {
  private _url = ''
  private _params = {}
  private _body = {}
  private _query = {}

  constructor (url: string) {
    this._url = url
  }

  public params (data: Record<string, any>) {
    this._params = data
  }
}

export const defineClient = <T extends Swagger>(_conf: T) => {
  return {
    client: <U extends keyof T['paths']>(url: U) => {
      const c = new Client(url as string)
      return { ...c } as Client & { [method in keyof T['paths'][U]]: () => Promise<any> }
    }
  }
}

const { client } = defineClient(conf)
client('/pet')

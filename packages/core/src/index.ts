import { ofetch } from 'ofetch'
import { Swagger } from '@be-restful/swagger'
import conf from '../config.json'
import { ClientResponse } from './types'

type ClientExports = {
  params: (data: Record<string, string>) => void
  body: (data: Record<string, any>) => void
  query: (data: Record<string, any>) => void
  header: (data: Record<string, string>) => void
}

class Client {
  private _url = ''
  private _params: Record<string, string> = {}

  public _body = {}
  public _query = {}
  public _headers = {}

  constructor (url: string) {
    this._url = url
  }

  public params (data: Record<string, string>) {
    this._params = data
  }

  public body (data: Record<string, any>) {
    this._body = data
  }

  public query (data: Record<string, any>) {
    this._query = data
  }

  public headers (data: Record<string, string>) {
    this._headers = data
  }

  get url () {
    let res = this._url
    Object.entries(this._params).forEach(([key, value]) => {
      res = res.replaceAll(`{${key}}`, value)
    })
    return res
  }
}

const _fetch = (url: string, client: Client, method: string) => () => {
  const query = client._query
  const body = client._body
  const headers = client._headers

  return ofetch(url, { query, body, headers, method })
}

export const defineClient = <T extends Swagger>(conf: T) => () => {
  return {
    client: <U extends keyof T['paths']>(url: U) => {
      const r: Record<string, any> = {}
      const c = new Client(url as string)
      Object.keys(conf.paths[url as any]).forEach((method) => {
        r[method] = _fetch(url as string, c, method)
      })
      return { ...c, ...r } as unknown as ClientExports & { [M in keyof T['paths'][U]]: <R>() => Promise<R extends unknown | undefined ? ClientResponse : R> }
    }
  }
}

const { client } = defineClient(conf)()
const res = client('/pet/findByTags').get()
console.log(res)

import { ofetch } from 'ofetch'
import { getOpenapiJSON, paths } from '@be-restful/cli'

// @ts-ignore
type SuccessResponse<U extends keyof paths, M extends keyof paths[U]> = paths[U][M]['responses'][200]['content']['application/json']

type ClientExportReturn<T, U extends keyof paths> = ClientExports<T, U> & {
  [M in keyof paths[U]]: <R>() => R extends unknown ? Promise<SuccessResponse<U, M>> : Promise<R>
}

type ClientExports<T, U extends keyof paths> = {
  params: (data: Record<string, string>) => ClientExportReturn<T, U>
  body: (data: Record<string, any>) => ClientExportReturn<T, U>
  query: (data: Record<string, any>) => ClientExportReturn<T, U>
  header: (data: Record<string, string>) => ClientExportReturn<T, U>
}

interface UseClientOptions {
  baseURL?: string
}

class Client {
  private _opts: UseClientOptions = {}
  private _url = ''
  private _params: Record<string, string> = {}

  public _body: undefined | Record<string, any> = undefined
  public _query: undefined | Record<string, any> = undefined
  public _headers: undefined | Record<string, string> = undefined

  constructor (url: string, opts?: UseClientOptions) {
    this._url = url
    this._opts = opts || {}
  }

  public params (data: Record<string, string>) {
    this._params = data
    return this
  }

  public body (data: Record<string, any>) {
    this._body = data
    return this
  }

  public query (data: Record<string, any>) {
    this._query = data
    return this
  }

  public headers (data: Record<string, string>) {
    this._headers = data
    return this
  }

  public get () {
    return _fetch(this, 'get')(this._opts)
  }

  public post () {
    return _fetch(this, 'post')(this._opts)
  }

  public put () {
    return _fetch(this, 'put')(this._opts)
  }

  public update () {
    return _fetch(this, 'update')(this._opts)
  }

  public delete () {
    return _fetch(this, 'delete')(this._opts)
  }

  get url () {
    let res = this._url
    Object.entries(this._params).forEach(([key, value]) => {
      res = res.replaceAll(`{${key}}`, value)
    })
    return res
  }
}

const _fetch = (client: Client, method: string) => (opts: UseClientOptions = {}) => {
  const query = client._query
  const body = client._body
  const headers = client._headers

  return ofetch(client.url, { query, body, headers, method: method.toUpperCase(), ...opts })
}

export const defineClient = <T>(_conf: T) => (opts?: UseClientOptions) => {
  return {
    client: <U extends keyof paths>(url: U) => {
      const c = new Client(url as string, opts)
      return c as unknown as ClientExportReturn<T, U>
    }
  }
}

export const useClient = async (opts?: UseClientOptions) => {
  const conf = await getOpenapiJSON({ force: false })
  return defineClient(conf)(opts)
}

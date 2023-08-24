import { ofetch } from 'ofetch'
import { paths } from '@be-restful/cli'

// @ts-ignore
type SuccessResponse<U extends keyof paths, M extends keyof paths[U]> = paths[U][M]['responses'][200]['content']['application/json']
// @ts-ignore
type RequestBody<U extends keyof paths, M extends keyof paths[U]> = paths[U][M]['requestBody']['content']['application/json']

type ClientExportReturn<U extends keyof paths> = ClientExports<U> & {
  [M in keyof paths[U]]: <R>() => R extends Record<string, any> ? Promise<R> : Promise<SuccessResponse<U, M>>
}

type ClientExports<U extends keyof paths> = {
  params: (data: Record<string, string>) => ClientExportReturn<U>
  body: <D extends RequestBody<U, keyof paths[U]>> (data: D) => ClientExportReturn<U>
  query: (data: Record<string, any>) => ClientExportReturn<U>
  header: (data: Record<string, string>) => ClientExportReturn<U>
}

interface UseClientOptions {
  baseURL?: string
  retry?: number
  retryDelay?: number
  timeout?: number
  onRequest?: (options: Client) => Client
  onResponse?: (response: any) => void
  onResponseError?: (context: any) => void
}

export class Client {
  private _opts: UseClientOptions = {}
  private _url: keyof paths
  private _params: Record<string, string> = {}

  public _body: undefined | Record<string, any> = undefined
  public _query: undefined | Record<string, any> = undefined
  public _headers: undefined | Record<string, string> = undefined

  constructor (url: keyof paths, opts?: UseClientOptions) {
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
    let res = this._url as string
    Object.entries(this._params).forEach(([key, value]) => {
      res = res.replaceAll(`{${key}}`, value)
    })
    return res
  }
}

const _fetch = (client: Client, method: string) => async (opts: UseClientOptions = {}) => {
  const c = opts.onRequest ? opts.onRequest(client) : client
  const query = c._query
  const body = c._body
  const headers = c._headers

  const response = await ofetch(c.url, { query, body, headers, method: method.toUpperCase(), baseURL: opts.baseURL, onResponseError: opts.onResponseError })
  if (opts.onResponse) { opts.onResponse(response) }
  return response
}

export const defineClient = () => (opts?: UseClientOptions) => {
  return {
    client: <U extends keyof paths>(url: U) => {
      const c = new Client(url, opts)
      return c as unknown as ClientExportReturn<U>
    }
  }
}

export const useClient = (opts?: UseClientOptions) => {
  return defineClient()(opts)
}

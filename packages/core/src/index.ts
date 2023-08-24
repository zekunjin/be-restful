import { ofetch } from 'ofetch'
import { paths } from '@be-restful/cli'

// @ts-ignore
type SuccessResponse<U extends keyof paths, M extends keyof paths[U]> = paths[U][M]['responses'][200]['content']['application/json']
// @ts-ignore
type RequestBody<U extends keyof paths, M extends keyof paths[U]> = paths[U][M]['requestBody']['content']['application/json']
// @ts-ignore
type ExtraPathSuccessResponse<E extends ExtraPaths, M> = E[M]['response']
// @ts-ignore
type ExtraPathRequestBody<E extends ExtraPaths, M> = E[M]['body']

type PathMethods<U extends Paths<E>, E extends ExtraClientOptions> = E extends Record<string, any> ? (keyof paths[U]) | (keyof E['paths'][U]) : keyof paths[U]

type ClientExportReturn<U extends Paths<E>, E extends ExtraClientOptions> = ClientExports<U, E> & {
  [M in PathMethods<U, E>]: <R>() => R extends Record<string, any> ? Promise<R> : Promise<U extends keyof paths ? SuccessResponse<U, M> : E extends Record<string, any> ? ExtraPathSuccessResponse<E['paths'][U], M> : undefined>
}

type ClientExports<U extends Paths<E>, E extends ExtraClientOptions> = {
  params: (data: Record<string, string>) => ClientExportReturn<U, E>
  body: E extends Record<string, any> ? (data: ExtraPathRequestBody<E['paths'][U], keyof E['paths'][U]>) => ClientExportReturn<U, E> : (data: RequestBody<U, keyof paths[U]>) => ClientExportReturn<U, E>
  query: (data: Record<string, any>) => ClientExportReturn<U, E>
  header: (data: Record<string, string>) => ClientExportReturn<U, E>
}

type RequestMethods = 'post' | 'get' | 'put' | 'update' | 'delete'

type ExtraClientOptions = { paths: ExtraPaths } | undefined | unknown

type ExtraPaths = Record<string, Partial<Record<RequestMethods, { response: any } & Partial<{
  body: Record<string, any>
  params: Record<string, any>
  query: Record<string, any>
}>>>>

type Paths<T extends ExtraClientOptions> = T extends Record<string, any> ? keyof paths | keyof T['paths'] : keyof paths

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

export const defineClient = <E extends ExtraClientOptions>() => (opts?: UseClientOptions) => {
  return {
    client: <U extends Paths<E>>(url: U) => {
      const c = new Client(url as keyof paths, opts)
      return c as unknown as ClientExportReturn<U, E>
    }
  }
}

export const useClient = <E extends ExtraClientOptions>(opts?: UseClientOptions) => {
  return defineClient<E>()(opts)
}

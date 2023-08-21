export type DataType = 'integer' | 'int32'
export type RequestMethod = 'post' | 'get' | 'delete' | 'put' | 'update'
export type RequestConsume = 'application/json' | 'application/xml'
export type RequestIn = 'body' | 'query' | 'path'

export interface Swagger {
  basePath: string
  host: string
  swagger: string
  definitions: SwaggerDefinations
  paths: Record<string, Partial<Record<RequestMethod, SwaggerRequest>>>
}

export interface SwaggerDefinations {
  ApiResponse: SwaggerApiResponseDefination
}

export interface SwaggerApiResponseDefination {
  type: string
  properties: Record<string, { type: string, format?: string | undefined } & Record<string, any>>
}

export interface SwaggerRequest {
  consumes: string[]
  description: string
  operationId: string
  parameters: SwaggerRequestParameter[]
  produces: string[]
  summary: string
  tags: string[]
}

export interface SwaggerRequestParameter {
  description: string
  in: string
  name: string
  type: string
  format?: string | undefined
  required: boolean
}

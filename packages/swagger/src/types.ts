export type DataType = 'integer' | 'int32'
export type RequestMethod = 'post' | 'get' | 'delete' | 'put' | 'update'
export type RequestConsume = 'application/json' | 'application/' | 'delete' | 'put' | 'update'
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
  type: 'object'
  properties: Record<string, { type: DataType, format?: DataType }>
}

export interface SwaggerRequest {
  consumes: RequestConsume[]
  description: string
  operationId: string
  parameters: SwaggerRequestParameter[]
  produces: RequestConsume[]
  summary: string
  tags: string[]
}

export interface SwaggerRequestParameter {
  description: string
  in: RequestIn
  name: string
  type: DataType
  format: DataType
  required: boolean
}

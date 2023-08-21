export type DataType = 'integer' | 'int32' | 'object' | 'array' | 'string' | 'file' | 'apiKey' | 'oauth2'
export type RequestMethod = 'post' | 'get' | 'delete' | 'put' | 'update'
export type RequestConsume = 'application/json' | 'application/xml'
export type RequestIn = 'body' | 'query' | 'path'

export interface Swagger {
  basePath: string
  host: string
  swagger: string
  definitions: Record<string, SwaggerDefination>
  paths: {
    [K in string]: Partial<{
      [M in string]: SwaggerRequest
    }>
  }
}

export interface SwaggerDefination {
  type: string
  properties: Record<string, {
    type?: string | undefined
    format?: string | undefined
  } & Record<string, any>>
}

export interface SwaggerRequest {
  consumes?: string[] | undefined
  description: string
  operationId: string
  parameters: SwaggerRequestParameter[]
  produces: string[]
  summary: string
  tags: string[]
  responses: {
    [K in string]: {
      description?: string | undefined
      schema?: {
        $ref?: string | undefined
        type?: string | undefined
        items?: Record<string, string>
      }
    }
  }
}

export interface SwaggerRequestParameter {
  description?: string | undefined
  in: string
  name: string
  type?: string | undefined
  format?: string | undefined
  required: boolean
}

export type SwaggerURLs<T extends Swagger> = keyof T['paths']

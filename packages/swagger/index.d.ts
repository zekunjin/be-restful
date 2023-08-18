type DataType = 'integer' | 'int32'
type RequestMethod = 'post' | 'get' | 'delete' | 'put' | 'update'
type RequestConsume = 'application/json' | 'application/' | 'delete' | 'put' | 'update'
type RequestIn = 'body' | 'query' | 'path'

interface Swagger {
  basePath: string
  host: string
  swagger: string
  definitions: SwaggerDefinations
  paths: Record<string, Partial<Record<RequestMethod, SwaggerRequest>>>
}

interface SwaggerDefinations {
  ApiResponse: SwaggerApiResponseDefination
}

interface SwaggerApiResponseDefination {
  type: 'object'
  properties: Record<string, { type: DataType, format?: DataType }>
}

interface SwaggerRequest {
  consumes: RequestConsume[]
  description: string
  operationId: string
  parameters: SwaggerRequestParameter[]
  produces: RequestConsume[]
  summary: string
  tags: string[]
}

interface SwaggerRequestParameter {
  description: string
  in: RequestIn
  name: string
  type: DataType
  format: DataType
  required: boolean
}

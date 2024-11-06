import type {
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosRequestConfig,
  AxiosInstance,
  AxiosRequestHeaders,
  AxiosError,
  RawAxiosRequestHeaders
} from 'axios'

interface RequestInterceptors<T> {
  // 请求拦截
  requestInterceptors?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig
  requestInterceptorsCatch?: (err: any) => any
  // 响应拦截
  responseInterceptors?: (config: T) => T
  responseInterceptorsCatch?: (err: any) => any
}

interface RequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  interceptors?: RequestInterceptors<T>
}

interface AxiosConfig {
  params?: any
  data?: any
  url?: string
  method?: AxiosMethod
  headers?: RawAxiosRequestHeaders
  responseType?: AxiosResponseType
}

type AxiosMethod = 'get' | 'post' | 'delete' | 'put'
type AxiosResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'

export interface IResponse<T = any> {
  code: number
  data: T extends any ? T : T & any
  msg: string
}

export interface HttpClient {
  get: Function,
  post: Function,
  postForm: Function,
}

export interface MyResponse {
  code: number,
  msg: string,
  data?: any
}

export {
  AxiosResponse,
  RequestInterceptors,
  RequestConfig,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosError,
  AxiosConfig
}

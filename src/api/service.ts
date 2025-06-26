import { REQUEST_TIMEOUT, TRANSFORM_REQUEST_DATA } from '@/constants'
import { router } from '@/router/router'
import { useUserInfoStore } from '@/stores/user/user_info'
import { RequestConfig } from '@/types/treasure_request'

import { CONTENT_TYPE } from '@/constants'
import { AxiosConfig } from "@/types/treasure_request"

import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'

import axios from 'axios'
import qs from 'qs'

// reference https://cn.vitejs.dev/guide/env-and-mode
export const PATH_URL = import.meta.env.VITE_API_BASE_PATH
const axiosConf = {
  timeout: REQUEST_TIMEOUT,
  baseURL: PATH_URL
}
const abortControllerMap: Map<string, AbortController> = new Map()
const axiosInstance: AxiosInstance = axios.create(axiosConf)
const userInfoStore = useUserInfoStore()

// axios.get('config.json')
//   .then(response => response.data)
//   .then(data => {
//     console.log('获取到的文本内容：', data);
//   })
//   .catch(error => {
//     console.error('获取文件时出错：', error);
//   });

axiosInstance.interceptors.request.use((res: InternalAxiosRequestConfig) => {
  const controller = new AbortController()
  const url = res.url || ''
  res.signal = controller.signal
  abortControllerMap.set(url, controller)
  return res
})

axiosInstance.interceptors.response.use(
  (res: AxiosResponse) => {
    const url = res.config.url || ''
    abortControllerMap.delete(url)
    return res
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userInfo')
      userInfoStore.$reset()
      router.push('/LogIn')
    }
    return Promise.reject(error)
  }
)

const defaultRequestInterceptors = (config: InternalAxiosRequestConfig) => {
  if (
    config.method === 'post' &&
    config.headers &&
    config.headers['Content-Type'] === 'application/x-www-form-urlencoded'
  ) {
    config.data = qs.stringify(config.data)
  } else if (
    TRANSFORM_REQUEST_DATA &&
    config.method === 'post' &&
    config.headers['Content-Type'] === 'multipart/form-data'
  ) {
    // config.data = objToFormData(config.data)
  }
  if (config.method === 'get' && config.params) {
    let url = config.url as string
    url += '?'
    const keys = Object.keys(config.params)
    for (const key of keys) {
      if (config.params[key] !== void 0 && config.params[key] !== null) {
        url += `${key}=${encodeURIComponent(config.params[key])}&`
      }
    }
    url = url.substring(0, url.length - 1)
    config.params = {}
    config.url = url
  }
  return config
}

const defaultResponseInterceptors = (response: AxiosResponse) => {
  if (['/logout', '/login'].includes(response.config.url!) && response.status === 200) {
    return response
  }
  if (response?.config?.responseType === 'blob') {
    return response
  } else if (response.status >= 100 && response.status < 300) {
    return response.data
  }
}


axiosInstance.interceptors.request.use(defaultRequestInterceptors)
axiosInstance.interceptors.response.use(defaultResponseInterceptors)

const service = {
  request: (config: RequestConfig) => {
    return axiosInstance.request(config)
  },
  cancelRequest: (url: string | string[]) => {
    const urlList = Array.isArray(url) ? url : [url]
    for (const _url of urlList) {
      abortControllerMap.get(_url)?.abort()
      abortControllerMap.delete(_url)
    }
  },
  cancelAllRequest() {
    for (const controller of abortControllerMap.values()) {
      controller.abort()
    }
    abortControllerMap.clear()
  }
}

const userStore = useUserInfoStore()
const request = (option: AxiosConfig) => {
  const { url, method, params, data, headers, responseType } = option
  return service.request({
    url,
    method,
    params,
    data,
    responseType: responseType,
    headers: {
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
      'Content-Type': CONTENT_TYPE,
      'X-Token': userStore.token ?? '',
      ...headers
    }
  })
}


export default {
  get: <T = unknown>(option: AxiosConfig) => {
    return request({ method: 'get', ...option }) as Promise<T>
  },
  post: <T = unknown>(option: AxiosConfig) => {
    return request({ method: 'post', ...option }) as Promise<T>
  },
  delete: <T = unknown>(option: AxiosConfig) => {
    return request({ method: 'delete', ...option }) as Promise<T>
  },
  put: <T = unknown>(option: AxiosConfig) => {
    return request({ method: 'put', ...option }) as Promise<T>
  },
  cancelRequest: (url: string | string[]) => {
    return service.cancelRequest(url)
  },
  cancelAllRequest: () => {
    return service.cancelAllRequest()
  }


}

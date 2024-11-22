import { REQUEST_TIMEOUT, TRANSFORM_REQUEST_DATA } from '@/constants'
import { router } from '@/router'
import { useUserInfoStore } from '@/stores/user/user_info'
import { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig, RequestConfig } from '@/types/treasure_request'
import axios, { AxiosError } from 'axios'
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

axios.get('config.json')
  .then(response => response.data)
  .then(data => {
    console.log('获取到的文本内容：', data);
  })
  .catch(error => {
    console.error('获取文件时出错：', error);
  });

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
    // 如果是文件流，直接过
    return response
  } else if (response.status >= 100 && response.status < 300) {
    return response.data
  }
}


axiosInstance.interceptors.request.use(defaultRequestInterceptors)
axiosInstance.interceptors.response.use(defaultResponseInterceptors)

const service = {
  request: (config: RequestConfig) => {
    return new Promise((resolve, reject) => {
      if (config.interceptors?.requestInterceptors) {
        config = config.interceptors.requestInterceptors(config as any)
      }
      axiosInstance.request(config).then((res) => {
        resolve(res)
      }).catch((err: any) => {
        reject(err)
      })
    })
  },
  cancelRequest: (url: string | string[]) => {
    const urlList = Array.isArray(url) ? url : [url]
    for (const _url of urlList) {
      abortControllerMap.get(_url)?.abort()
      abortControllerMap.delete(_url)
    }
  },
  cancelAllRequest() {
    for (const [_, controller] of abortControllerMap) {
      controller.abort()
    }
    abortControllerMap.clear()
  }
}




export default service

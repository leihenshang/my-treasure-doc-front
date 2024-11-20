import axios, { AxiosError } from 'axios'
import { defaultRequestInterceptors, defaultResponseInterceptors } from './config'

import { AxiosInstance, InternalAxiosRequestConfig, RequestConfig, AxiosResponse } from '@/types/treasure_request'
import { REQUEST_TIMEOUT } from '@/constants'
import { router } from '@/router'
import { useUserInfoStore } from '@/stores/user/user_info';

const userInfoStore = useUserInfoStore()

// reference https://cn.vitejs.dev/guide/env-and-mode
export const PATH_URL = import.meta.env.VITE_API_BASE_PATH

const axiosConf = {
  timeout: REQUEST_TIMEOUT,
  baseURL: PATH_URL
}

axios.get('config/config.json')
  .then(response => response.data)
  .then(data => {
    if (data?.api) {
      axiosConf.baseURL = data?.api
    }
    console.log('获取到的文本内容：', data);
  })
  .catch(error => {
    console.error('获取文件时出错：', error);
  });


const abortControllerMap: Map<string, AbortController> = new Map()
const axiosInstance: AxiosInstance = axios.create(axiosConf)

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
    console.log(error)
    if (error.response?.status === 401) {
      localStorage.removeItem('userInfo')
      userInfoStore.$reset()
      router.push('/LogIn')
    }
    return Promise.reject(error)
  }
)

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

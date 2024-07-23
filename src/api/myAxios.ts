import axios, { AxiosInstance } from 'axios'
import { useUserInfoStore } from '@/stores/user/userinfo'
import { HttpClient, MyResponse } from "@/api/types"
import { REQUEST_TIMEOUT } from '@/constants'
import { CONTENT_TYPE } from '@/constants'
import service from './service'
import { AxiosConfig, IResponse } from "./types"

const request = (option: AxiosConfig) => {
    const { url, method, params, data, headers, responseType } = option
    const userStore = useUserInfoStore()
    const token = userStore.getToken
    return service.request({
        url: url,
        method,
        params,
        data,
        responseType: responseType,
        headers: {
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
            'Content-Type': CONTENT_TYPE,
            [token ?? 'X-Token']: token ?? '',
            ...headers
        }
    })
}

export default {
    get: <T = any>(option: AxiosConfig) => {
        return request({ method: 'get', ...option }) as Promise<T>
    },
    post: <T = any>(option: AxiosConfig) => {
        return request({ method: 'post', ...option }) as Promise<IResponse<T>>
      },
    delete: <T = any>(option: AxiosConfig) => {
        return request({ method: 'delete', ...option }) as Promise<IResponse<T>>
    },
    put: <T = any>(option: AxiosConfig) => {
        return request({ method: 'put', ...option }) as Promise<IResponse<T>>
    },
    cancelRequest: (url: string | string[]) => {
        return service.cancelRequest(url)
    },
    cancelAllRequest: () => {
        return service.cancelAllRequest()
    }
}

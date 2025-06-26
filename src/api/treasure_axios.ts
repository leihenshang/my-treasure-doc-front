import { CONTENT_TYPE } from '@/constants'
import { useUserInfoStore } from '@/stores/user/user_info'
import { AxiosConfig } from "@/types/treasure_request"
import { TreasureResponse } from '@/types/treasure_response'
import service from './service'

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
        return request({ method: 'post', ...option }) as unknown as Promise<TreasureResponse<T>>
    },
    delete: <T = unknown>(option: AxiosConfig) => {
        return request({ method: 'delete', ...option }) as unknown as Promise<TreasureResponse<T>>
    },
    put: <T = unknown>(option: AxiosConfig) => {
        return request({ method: 'put', ...option }) as unknown as Promise<TreasureResponse<T>>
    },
    cancelRequest: (url: string | string[]) => {
        return service.cancelRequest(url)
    },
    cancelAllRequest: () => {
        return service.cancelAllRequest()
    }
}

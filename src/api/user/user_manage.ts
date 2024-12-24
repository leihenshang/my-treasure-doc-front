import myHttp from "@/api/treasure_axios"
import { LoginUser, UserInfo } from "@/types/resource"
import { PaginationWithSort, TreasureResponse, TreasureResponseList } from "@/types/treasure_response"


export function getUserInfoList(
    pagination: PaginationWithSort = new PaginationWithSort(),
): Promise<TreasureResponseList<UserInfo>> {
    return new Promise<TreasureResponseList<UserInfo>>((resolve, reject) => {
        myHttp.get<TreasureResponse<UserInfo>>({
            url: '/api/user-manage/list', params: {
                page: pagination.page,
                pageSize: pagination.pageSize,
            }
        }).then((response) => {
            if (response?.code) {
                reject(response?.msg)
            }
            resolve(response.data as TreasureResponseList<UserInfo>)
        })
    })
}

export function getUserInfo(id: number | string = 0): Promise<TreasureResponse<UserInfo>> {
    return new Promise<TreasureResponse<UserInfo>>((resolve, reject) => {
        myHttp.get<TreasureResponse<UserInfo>>({
            url: '/api/user-manage/detail', params: {
                id
            }
        }).then((response: TreasureResponse<UserInfo>) => {
            if (response?.code) {
                reject(response?.msg)
            }
            resolve(response)
        })
    })
}

export function createUserInfo(userInfo: UserInfo): Promise<TreasureResponse<UserInfo>> {
    return new Promise<TreasureResponse<UserInfo>>((resolve, reject) => {
        myHttp.post<UserInfo>({
            url: '/api/user-manage/create', data: userInfo
        }).then((response) => {
            if (response?.code) {
                reject(response)
            }
            const resp: TreasureResponse<UserInfo> = new TreasureResponse()
            resp.data = response?.data
            resp.msg = response?.msg
            resp.code = response?.code
            resolve(resp)
        })
    })
}

export function updateUserInfo(userInfo: UserInfo): Promise<TreasureResponse<UserInfo>> {
    return new Promise<TreasureResponse<UserInfo>>((resolve, reject) => {
        myHttp.post<UserInfo>({
            url: '/api/user-manage/update', data: userInfo
        }).then((response) => {
            if (response?.code) {
                reject(response)
            }
            resolve(response)
        })
    })
}

export function resetPwd(user: LoginUser): Promise<TreasureResponse<UserInfo>> {
    return new Promise<TreasureResponse<UserInfo>>((resolve, reject) => {
        myHttp.post<UserInfo>({
            url: '/api/user-manage/reset-pwd', data: user
        }).then((response) => {
            if (response?.code) {
                reject(response)
            }
            resolve(response)
        })
    })
}


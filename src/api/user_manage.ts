import myHttp from "@/api"
import { LoginUser, UserInfo } from "@/types/resource"
import { PaginationWithSort, TreasureResponse, TreasureResponseList } from "@/types/treasure_response"


export async function getUserInfoList(
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

export async function getUserInfo(id: number | string = 0): Promise<TreasureResponse<UserInfo>> {
    return myHttp.get<TreasureResponse<UserInfo>>({
        url: '/api/user-manage/detail', params: {
            id
        }
    })
}

export async function createUserInfo(userInfo: UserInfo): Promise<TreasureResponse<UserInfo>> {
    return myHttp.post<TreasureResponse<UserInfo>>({
        url: '/api/user-manage/create', data: userInfo
    }).then(response => {
        if (response?.code) {
            return Promise.reject(response?.msg)
        }
        return response
    })
}

export async function updateUserInfo(userInfo: UserInfo): Promise<TreasureResponse<UserInfo>> {
    return myHttp.post<TreasureResponse<UserInfo>>({
        url: '/api/user-manage/update', data: userInfo
    }).then(response => {
        if (response?.code) {
            return Promise.reject(response?.msg)
        }
        return response
    })
}

export async function resetPwd(user: LoginUser): Promise<TreasureResponse<UserInfo>> {
    return myHttp.post<TreasureResponse<UserInfo>>({
        url: '/api/user-manage/reset-pwd', data: user
    }).then(response => {
        if (response?.code) {
            return Promise.reject(response?.msg)
        }
        return response
    })
}


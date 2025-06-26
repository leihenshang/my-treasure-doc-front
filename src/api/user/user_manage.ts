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
    return myHttp.get<TreasureResponse<UserInfo>>({
        url: '/api/user-manage/detail', params: {
            id
        }
    })
}

export function createUserInfo(userInfo: UserInfo): Promise<TreasureResponse<UserInfo>> {
    return myHttp.post<TreasureResponse<UserInfo>>({
        url: '/api/user-manage/create', data: userInfo
    })
}

export function updateUserInfo(userInfo: UserInfo): Promise<TreasureResponse<UserInfo>> {
    return myHttp.post<TreasureResponse<UserInfo>>({
        url: '/api/user-manage/update', data: userInfo
    })
}

export function resetPwd(user: LoginUser): Promise<TreasureResponse<UserInfo>> {
    return myHttp.post<TreasureResponse<UserInfo>>({
        url: '/api/user-manage/reset-pwd', data: user
    })
}


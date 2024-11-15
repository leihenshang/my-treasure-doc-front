import myHttp from "@/api/treasure_axios"
import { UserInfo } from "@/stores/user/types"
import { TreasureResponse, TreasureResponseList, PaginationWithSort } from "@/types/treasure_response"
import { useUserInfoStore } from '@/stores/user/user_info';

const userInfoStore = useUserInfoStore()

export async function logOut() {
    return new Promise<TreasureResponse<UserInfo>>((resolve: any, reject: any) => {
        myHttp.post<TreasureResponse<UserInfo>>({
            url: '/api/user/logout', data: {}
        }).then((response: any) => {
            if (response?.code) {
                reject(response?.msg)
                return
            }
            localStorage.removeItem('userInfo')
            userInfoStore.$reset()
            resolve()
        })

    })
}

export async function logIn(userInfo: UserInfo) {
    return new Promise<TreasureResponse<UserInfo>>((resolve: any, reject: any) => {
        myHttp.post<TreasureResponse<UserInfo>>({
            url: '/api/user/login', data: { ...userInfo }
        }).then((response: any) => {
            if (response?.code) {
                reject(response?.msg)
            } else {
                resolve(response)
            }
        })

    })
}
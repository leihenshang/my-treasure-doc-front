import myHttp from "@/api";
import { UserInfo } from "@/types/resource";
import { TreasureResponse } from "@/types/treasure_response";


export async function logOut() {
    return myHttp.post<TreasureResponse<UserInfo>>({
        url: '/api/user/logout'
    }).then(response => {
        if (response?.code) {
            return Promise.reject(response?.msg)
        }
        return response
    })
}

export async function logIn(userInfo: UserInfo) {
    return myHttp.post<TreasureResponse<UserInfo>>({
        url: '/api/user/login', data: { ...userInfo }
    }).then(response => {
        if (response?.code) {
            return Promise.reject(response?.msg)
        }
        return response
    })
}
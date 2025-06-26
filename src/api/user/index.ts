import myHttp from "@/api/treasure_axios";
import { UserInfo } from "@/types/resource";
import { TreasureResponse } from "@/types/treasure_response";


export async function logOut() {
    return myHttp.post<TreasureResponse<UserInfo>>({
        url: '/api/user/logout'
    })
}

export async function logIn(userInfo: UserInfo) {
    return myHttp.post<TreasureResponse<UserInfo>>({
        url: '/api/user/login', data: { ...userInfo }
    })
}
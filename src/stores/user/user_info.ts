import { defineStore } from 'pinia'
import { UserInfo } from '@/stores/user/types'

interface StoreUserInfo {
    userInfo: UserInfo
}

export const useUserInfoStore = defineStore('userinfo', {
    state: (): StoreUserInfo => {
        return {
            userInfo: { id: 0, account: "" }
        }
    },
    actions: {
        updateUserInfo(newUserinfo: UserInfo) {
            this.userInfo = newUserinfo
        }
    },
    getters: {
        userId: (state) => state.userInfo.id,
        token: (state) => state.userInfo.token
    }
})
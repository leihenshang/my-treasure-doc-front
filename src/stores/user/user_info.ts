import { UserInfo } from '@/types/resource'
import { defineStore } from 'pinia'

interface StoreUserInfo {
    userInfo: UserInfo
}

export const useUserInfoStore = defineStore('userinfo', {
    state: (): StoreUserInfo => {
        return {
            userInfo: { id: '', account: "" }
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
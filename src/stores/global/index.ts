import { defineStore } from 'pinia'

interface GlobalStore {
    leftMenuCollapse: boolean
}


export const useGlobalStore = defineStore('global', {
    state: (): GlobalStore => {
        return {
            leftMenuCollapse: false
        }
    },
    actions: {
        leftMenuCollapseSwitch() {
            this.leftMenuCollapse = !this.leftMenuCollapse
        }
    },
    getters: {
    }
})
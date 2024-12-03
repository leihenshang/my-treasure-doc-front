import { darkTheme, lightTheme } from 'naive-ui'
import { defineStore } from 'pinia'

interface GlobalStore {
    leftMenuCollapse: boolean,
    theme: string
}


export const useGlobalStore = defineStore('global', {
    state: (): GlobalStore => {
        return {
            leftMenuCollapse: false,
            theme: 'light',
        }
    },
    actions: {
        leftMenuCollapseSwitch() {
            this.leftMenuCollapse = !this.leftMenuCollapse
        },
        themeSwitch() {
            this.theme === 'light' ? this.theme = 'dark' : this.theme = 'light'
        }
    },
    getters: {
        uiTheme(state) {
            if (state.theme === 'light') {
                return lightTheme
            } else {
                return darkTheme
            }
        }
    }
})
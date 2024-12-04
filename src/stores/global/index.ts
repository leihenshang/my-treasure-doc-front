import { darkTheme, lightTheme } from 'naive-ui'
import { defineStore } from 'pinia'

interface GlobalStore {
    theme: string
}

export const useGlobalStore = defineStore('global', {
    state: (): GlobalStore => {
        return {
            theme: localStorage.getItem('globalState.theme') ?? 'light',
        }
    },
    actions: {
        themeSwitch() {
            this.theme === 'light' ? this.theme = 'dark' : this.theme = 'light'
            localStorage.setItem('globalState.theme', this.theme)
        }
    },
    getters: {
        currentTheme(state) {
            if (state.theme === 'light') {
                return lightTheme
            } else {
                return darkTheme
            }
        }
    }
})
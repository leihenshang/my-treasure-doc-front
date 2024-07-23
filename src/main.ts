import { createApp } from 'vue'
import App from './App.vue'
import './index.scss'
import { router } from './router'
import naive from 'naive-ui'
import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App)
app.use(router)
app.use(naive)
app.use(pinia)
app.mount('#app')

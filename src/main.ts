import { createPinia } from 'pinia'
import 'vfonts/Lato.css'
import { createApp } from 'vue'
import App from './App.vue'
import './index.scss'
import { router } from './router/router'

const pinia = createPinia()
const app = createApp(App)
app.use(router)
app.use(pinia)

window.addEventListener('keydown', function (event) {
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        console.log('Ctrl + S 快捷键被拦截');
    }
});

app.mount('#app')

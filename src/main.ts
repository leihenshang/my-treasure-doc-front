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

// 在全局添加键盘事件监听
window.addEventListener('keydown', function (event) {
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        console.log('Ctrl + S 快捷键被拦截');
        // 这里可以添加你自定义的逻辑，比如弹出提示框等
    }
});

app.mount('#app')

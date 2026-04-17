import './assets/styles/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router' // 导入统一配置的路由

// 核心：只创建一次App实例，按顺序挂载插件
const app = createApp(App)
app.use(router) // 先挂载路由
app.use(createPinia()) // 再挂载pinia
app.mount('#app') // 最后挂载到DOM
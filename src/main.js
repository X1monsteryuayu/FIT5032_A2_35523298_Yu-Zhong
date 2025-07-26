import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initializeDefaultUsers } from './utils/userManager'

// 初始化默认用户
initializeDefaultUsers()

const app = createApp(App)
app.use(router)
app.mount('#app')
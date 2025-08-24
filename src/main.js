import './assets/main.css'
import './assets/accessibility.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

// Vue
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useAuthStore } from './store'

// Firebase 配置 - 确保Firebase在应用启动时被初始化
import './firebase/config'

// PrimeVue
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/aura-light-green/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

// PrimeVue 组件
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import Card from 'primevue/card'
import Dialog from 'primevue/dialog'
import Password from 'primevue/password'

// Leaflet CSS
import 'leaflet/dist/leaflet.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(PrimeVue)
app.use(ToastService)

// 注册全局组件
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Button', Button)
app.component('InputText', InputText)
app.component('Toast', Toast)
app.component('Card', Card)
app.component('Dialog', Dialog)
app.component('Password', Password)

// 直接挂载应用，不等待认证初始化
app.mount('#app')

// 在应用挂载后初始化认证状态
const authStore = useAuthStore()
authStore.initializeAuth().then(() => {
  console.log('App挂载后的认证状态初始化完成:', {
    user: !!authStore.user,
    isAuthenticated: authStore.isAuthenticated
  });
  // 如果用户已认证且当前在登录页，则重定向到仪表板
  if (authStore.isAuthenticated && router.currentRoute.value.path === '/login') {
    console.log('用户已登录，从登录页重定向到仪表板');
    router.push('/dashboard');
  }
});
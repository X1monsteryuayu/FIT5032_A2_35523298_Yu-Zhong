、<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
    <div class="container">
      <router-link class="navbar-brand d-flex align-items-center" to="/">
        <img src="../assets/logo.svg" alt="Healthy Pathway" class="nav-logo me-2" />
        <span class="brand-text">Healthy Pathway</span>
      </router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" 
              data-bs-target="#navbarNav" aria-controls="navbarNav" 
              aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <!-- 通用导航链接 -->
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/health-articles">
              <i class="fas fa-newspaper me-1"></i>Health Articles
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/email-demo">
              <i class="fas fa-envelope me-1"></i>Email Demo
            </router-link>
          </li>
          
          <template v-if="!isAuthenticated">
            <!-- 未登录用户显示的链接 -->
            <li class="nav-item">
              <router-link class="nav-link" to="/login">Login</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/register">Register</router-link>
            </li>
          </template>
          
          <!-- 暂时强制显示用户菜单来测试 -->
          <template v-if="authStore.user">
            <!-- 已登录用户显示的链接 -->
            <li class="nav-item">
              <router-link class="nav-link" to="/doctor-rating">Doctor Rating</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/consultation">Consultation</router-link>
            </li>
            <!-- 临时添加直接的Logout按钮测试 -->
            <li class="nav-item">
              <button class="btn btn-outline-danger btn-sm ms-2" @click="handleLogout">
                Logout ({{ userName }})
              </button>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store'

const router = useRouter()
const authStore = useAuthStore()

// 使用computed来响应认证状态变化
const isAuthenticated = computed(() => {
  const authStatus = authStore.getIsAuthenticated
  console.log('导航栏 - 认证状态计算:', {
    isAuthenticated: authStatus,
    user: authStore.user?.email,
    userObject: authStore.user
  })
  return authStatus
})

const userName = computed(() => {
  if (authStore.user?.displayName) {
    return authStore.user.displayName
  } else if (authStore.user?.email) {
    // 显示邮箱的用户名部分（@之前的部分）
    return authStore.user.email.split('@')[0]
  }
  return 'User'
})

// 监听认证状态变化
watch(isAuthenticated, (newVal, oldVal) => {
  console.log('导航栏 - 认证状态变化:', { from: oldVal, to: newVal })
})

onMounted(async () => {
  // 初始化Firebase认证状态
  await authStore.initializeAuth()
  console.log('导航栏 - 认证状态初始化完成:', {
    isAuthenticated: authStore.getIsAuthenticated,
    user: authStore.user?.email
  })
  
  // 确保Bootstrap dropdown正常工作
  await nextTick()
  if (window.bootstrap && authStore.getIsAuthenticated) {
    console.log('Bootstrap dropdown 已准备好')
  }
})

const handleLogout = async () => {
  console.log('点击了Logout按钮')
  try {
    console.log('开始执行logout...')
    await authStore.logout()
    console.log('logout成功，准备跳转到登录页')
    router.push('/login')
    console.log('跳转命令已发送')
  } catch (error) {
    console.error('Logout失败:', error)
    alert('退出登录失败: ' + error.message)
  }
}
</script>

<style scoped>
.nav-logo {
  height: 30px;
  margin-right: 10px;
}

.brand-text {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-color);
}

.nav-link {
  color: var(--secondary-color) !important;
  font-weight: 500;
  transition: color 0.3s ease;
  margin: 0 10px;
}

.nav-link:hover {
  color: var(--primary-color) !important;
}
</style>

<template>
  <div class="login-page">
    <div class="login-container">
      <h2 class="text-center mb-4">Welcome Back</h2>
      <form @submit.prevent="handleLogin" class="login-form">
        <div v-if="authStore.error" class="alert alert-danger">
          {{ authStore.error }}
        </div>
        <div class="form-group mb-3">
          <label for="email">Email</label>
          <input 
            id="email"
            v-model="email" 
            type="email" 
            class="form-control" 
            placeholder="Enter your email"
            required 
            :disabled="authStore.loading"
          />
        </div>
        <div class="form-group mb-4">
          <label for="password">Password</label>
          <input 
            id="password"
            v-model="password" 
            type="password" 
            class="form-control"
            placeholder="Enter your password" 
            required 
            :disabled="authStore.loading"
          />
        </div>
        <button 
          type="submit" 
          class="btn btn-primary w-100 mb-3"
          :disabled="authStore.loading"
        >
          {{ authStore.loading ? 'Logging in...' : 'Login' }}
        </button>
        <p class="text-center">
          Don't have an account? 
          <router-link to="/register">Register here</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store'

export default {
  setup() {
    const router = useRouter()
    const route = useRoute()
    const authStore = useAuthStore()

    return {
      router,
      route,
      authStore
    }
  },
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    async handleLogin() {
      if (!this.email || !this.password) {
        alert('请输入邮箱和密码')
        return
      }
      
      console.log('尝试Firebase登录:', this.email)
      
      try {
        // 使用Firebase认证
        const user = await this.authStore.login(this.email, this.password)
        console.log('Firebase登录成功，用户:', user)

        // 登录成功后立即重定向，不等待任何异步操作
        const redirectPath = this.$route.query.redirect || '/dashboard'
        console.log('准备重定向到:', redirectPath)

        // 使用 Vue Router 进行导航
        await this.$router.push(redirectPath)
        console.log('重定向完成')
      } catch (error) {
        console.error('登录失败:', error)
        alert('登录失败，请检查您的邮箱和密码')
      }
    }
  }
}
</script>

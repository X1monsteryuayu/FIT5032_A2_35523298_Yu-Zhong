<template>
  <div class="login-page">
    <div class="login-container">
      <h2 class="text-center mb-4">Welcome Back</h2>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group mb-3">
          <label for="email">Email</label>
          <input 
            id="email"
            v-model="email" 
            type="email" 
            class="form-control" 
            placeholder="Enter your email"
            required 
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
          />
        </div>
        <button type="submit" class="btn btn-primary w-100 mb-3">Login</button>
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

export default {
  setup() {
    const router = useRouter()
    const route = useRoute()

    return {
      router,
      route
    }
  },
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    handleLogin() {
      // 从 localStorage 获取用户数据
      const storedUserData = localStorage.getItem(this.email)
      
      if (!storedUserData) {
        alert('用户不存在')
        return
      }

      const userData = JSON.parse(storedUserData)
      if (userData.password !== this.password) {
        alert('密码错误')
        return
      }

      // 登录成功，构造用户信息
      const userInfo = {
        id: Date.now(), // 生成临时 ID
        email: userData.email,
        name: userData.name,
        role: userData.role
      }
      
      // 存储用户信息
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
      
      // 如果是管理员且没有特定的重定向地址，则进入管理后台
      const redirectPath = this.route.query.redirect || (userInfo.role === 'admin' ? '/admin/dashboard' : '/dashboard')
      this.router.push(redirectPath)
    }
  }
}
</script>

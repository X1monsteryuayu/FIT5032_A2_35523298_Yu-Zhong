<template>
  <div class="login-page" role="main">
    <div class="login-container">
      <h1 class="text-center mb-4 visually-accessible-heading">欢迎回来</h1>
      <form @submit.prevent="handleLogin" class="login-form" role="form" aria-labelledby="login-heading">
        <div v-if="authStore.error" class="alert alert-danger" role="alert" aria-live="polite">
          <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
          {{ authStore.error }}
        </div>
        <div class="form-group mb-3">
          <label for="email" class="form-label required-field">
            <i class="fas fa-envelope" aria-hidden="true"></i>
            邮箱地址
            <span class="required-asterisk" aria-label="必填项">*</span>
          </label>
          <input 
            id="email"
            v-model="email" 
            type="email" 
            class="form-control" 
            placeholder="请输入您的邮箱地址"
            required 
            :disabled="authStore.loading"
            aria-describedby="email-help"
            aria-invalid="false"
            autocomplete="email"
          />
          <small id="email-help" class="form-text text-muted">
            用于登录的邮箱地址
          </small>
        </div>
        <div class="form-group mb-4">
          <label for="password" class="form-label required-field">
            <i class="fas fa-lock" aria-hidden="true"></i>
            密码
            <span class="required-asterisk" aria-label="必填项">*</span>
          </label>
          <input 
            id="password"
            v-model="password" 
            type="password" 
            class="form-control"
            placeholder="请输入您的密码" 
            required 
            :disabled="authStore.loading"
            aria-describedby="password-help"
            aria-invalid="false"
            autocomplete="current-password"
          />
          <small id="password-help" class="form-text text-muted">
            至少8位字符的密码
          </small>
        </div>
        <button 
          type="submit" 
          class="btn btn-primary w-100 mb-3"
          :disabled="authStore.loading"
          :aria-busy="authStore.loading"
          aria-describedby="login-status"
        >
          <span v-if="authStore.loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          {{ authStore.loading ? '正在登录...' : '登录' }}
        </button>
        <div id="login-status" class="visually-hidden" aria-live="polite">
          {{ authStore.loading ? '正在处理登录请求，请稍候' : '' }}
        </div>
        <p class="text-center">
          还没有账户？
          <router-link to="/register" aria-label="前往注册页面">立即注册</router-link>
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

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-container {
  max-width: 400px;
  margin: 0 auto;
  background: white;
  padding: 3rem 2rem;
  border-radius: 15px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

/* 无障碍改进 */
.visually-accessible-heading {
  font-size: 2rem;
  font-weight: 600;
  color: #2c3e50;
}

.required-field {
  font-weight: 600;
  color: #495057;
}

.required-asterisk {
  color: #dc3545;
  font-weight: bold;
  margin-left: 0.25rem;
}

.form-control {
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.25rem rgba(102, 126, 234, 0.25);
  outline: none;
}

.form-control:focus-visible {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}

.form-control[aria-invalid="true"] {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
}

.btn:focus {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}

.btn:focus-visible {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.alert {
  border-radius: 8px;
  border: none;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
  border-left: 4px solid #dc3545;
}

.form-text {
  margin-top: 0.25rem;
  font-size: 0.875rem;
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .form-control {
    border-width: 3px;
  }
  
  .btn {
    border-width: 3px;
  }
  
  .alert {
    border-width: 3px;
  }
}

/* 减少动画模式支持 */
@media (prefers-reduced-motion: reduce) {
  .form-control,
  .btn,
  .login-container {
    transition: none;
  }
  
  .btn-primary:hover:not(:disabled) {
    transform: none;
  }
}

/* 大字体模式支持 */
@media (min-resolution: 2dppx) {
  .form-control,
  .btn {
    font-size: 1.1rem;
  }
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-container {
    padding: 2rem 1.5rem;
    margin: 1rem;
  }
}
</style>

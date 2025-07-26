、<template>
  <nav class="navbar navbar-expand-lg navbar-light">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">
        <img src="../assets/logo.svg" alt="Healthy Pathway" class="nav-logo" />
        <span class="brand-text">Healthy Pathway</span>
      </router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" 
              data-bs-target="#navbarNav" aria-controls="navbarNav" 
              aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <template v-if="!isLoggedIn">
            <li class="nav-item">
              <router-link class="nav-link" to="/login">登录</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/register">注册</router-link>
            </li>
          </template>
          <template v-else>
            <li class="nav-item">
              <router-link class="nav-link" to="/health-articles">健康资讯</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/doctor-rating">医生评分</router-link>
            </li>
            <li class="nav-item">
              <span class="nav-link">Welcome, {{ userName }}</span>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/dashboard">Dashboard</router-link>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" @click.prevent="handleLogout">Logout</a>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoggedIn = ref(false)
const userName = ref('')

onMounted(() => {
  // 检查登录状态
  const userInfo = localStorage.getItem('userInfo')
  if (userInfo) {
    const user = JSON.parse(userInfo)
    isLoggedIn.value = true
    userName.value = user.name
  }
})

const handleLogout = () => {
  localStorage.removeItem('userInfo')
  isLoggedIn.value = false
  router.push('/login')
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

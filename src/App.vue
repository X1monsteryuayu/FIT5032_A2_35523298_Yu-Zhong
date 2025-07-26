<template>
  <div class="app-container">
    <!-- 响应式导航栏 -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div class="container">
        <router-link class="navbar-brand d-flex align-items-center" to="/">
          <img src="./assets/logo.svg" alt="Healthy Pathway" class="nav-logo me-2" />
          <span class="brand-text">Healthy Pathway</span>
        </router-link>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarNav" aria-controls="navbarNav"
                aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/login">Login</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/register">Register</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- 主内容区域 -->
    <main class="main-content container d-flex flex-column justify-content-center align-items-center text-center">
      <router-view></router-view>
    </main>

    <!-- 页脚 -->
    <footer class="footer mt-auto py-4 bg-white shadow-top">
      <div class="container">
        <div class="row">
          <div class="col-md-4 mb-3">
            <h5>About Us</h5>
            <p>Healthy Pathway - Your trusted healthcare companion</p>
          </div>
          <div class="col-md-4 mb-3">
            <h5>Quick Links</h5>
            <ul class="list-unstyled">
              <li><router-link to="/">Home</router-link></li>
              <li><router-link to="/login">Login</router-link></li>
              <li><router-link to="/register">Register</router-link></li>
            </ul>
          </div>
          <div class="col-md-4">
            <h5>Contact</h5>
            <p>Email: support@healthypathway.com</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

onMounted(() => {
  const toggler = document.querySelector('.navbar-toggler')
  const collapse = document.querySelector('#navbarNav')

  if (toggler && collapse) {
    toggler.addEventListener('click', () => {
      collapse.classList.toggle('show')
    })
  }
})
</script>

<style>
:root {
  --primary-color: #3498db;
  --secondary-color: #2c3e50;
  --background-color: #f5f7fa;
  --text-color: #2c3e50;
  --border-radius: 8px;
}

body {
  margin: 0;
  font-family: 'Segoe UI', Roboto, Arial, sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.navbar .nav-link {
  color: var(--secondary-color) !important;
  font-weight: 500;
}

.navbar .nav-link:hover {
  color: var(--primary-color) !important;
}

.brand-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
}

.nav-logo {
  height: 30px;
}

.main-content {
  flex: 1;
  width: 100%;
  max-width: 1200px;
  padding: 2rem 1rem;
  margin: 0 auto;

  min-height: calc(100vh - 180px); /* 头+脚高度大概是 180px */
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.footer {
  background-color: #fff;
  color: var(--text-color);
  padding-top: 2rem;
  padding-bottom: 2rem;
  border-top: 1px solid #ddd;
}

.footer h5 {
  color: var(--primary-color);
  font-weight: 600;
}

.footer p,
.footer a {
  color: var(--text-color);
  text-decoration: none;
}

.footer a:hover {
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }

  .footer {
    text-align: center;
  }
}

@media (min-width: 769px) and (max-width: 1023px) {
  .main-content {
    max-width: 90%;
    padding: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .main-content {
    max-width: 1024px;
    padding: 2rem;
    margin: 0 auto; /* ✅ 让容器居中！ */
  }
}

@media (min-width: 1400px) {
  .main-content {
    max-width: 1200px;
    padding: 3rem;
    margin: 0 auto; /* ✅ 让容器居中！ */
  }
}
</style>
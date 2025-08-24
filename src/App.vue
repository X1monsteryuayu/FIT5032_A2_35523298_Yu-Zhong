<template>
  <div class="app-container">
    <!-- 跳过链接 - 无障碍导航 -->
    <a href="#main-content" class="skip-link">跳到主要内容</a>
    
    <!-- 使用NavBar组件 -->
    <NavBar />

    <!-- 主内容区域 -->
    <main id="main-content" class="main-content container d-flex flex-column justify-content-center align-items-center text-center" role="main" tabindex="-1">
      <router-view></router-view>
    </main>

    <!-- 页脚 -->
    <footer class="footer mt-auto py-4 bg-white shadow-top" role="contentinfo">
      <div class="container">
        <div class="row">
          <div class="col-md-4 mb-3">
            <h5>关于我们</h5>
            <p>Healthy Pathway - 您可信赖的健康伙伴</p>
          </div>
          <div class="col-md-4 mb-3">
            <h5>快速链接</h5>
            <ul class="list-unstyled">
              <li><router-link to="/" aria-label="回到首页">首页</router-link></li>
              <li><router-link to="/login" aria-label="用户登录">登录</router-link></li>
              <li><router-link to="/register" aria-label="新用户注册">注册</router-link></li>
            </ul>
          </div>
          <div class="col-md-4">
            <h5>联系我们</h5>
            <p>邮箱: support@healthypathway.com</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import NavBar from './components/NavBar.vue'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

onMounted(() => {
  // 应用初始化逻辑可以在这里添加
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
<template>
  <footer class="footer">
    <div class="container">
      <div class="row">
        <div class="col-12 col-md-6 col-lg-4">
          <h5>关于我们</h5>
          <p>Healthy Pathway - 您值得信赖的健康伙伴</p>
        </div>
        <div class="col-12 col-md-6 col-lg-4">
          <h5>快速链接</h5>
          <ul class="list-unstyled">
            <li><router-link to="/">首页</router-link></li>
            <li><router-link to="/health-articles">健康资讯</router-link></li>
            <li><router-link to="/doctor-rating">医生评分</router-link></li>
          </ul>
        </div>
        <div class="col-12 col-lg-4">
          <h5>联系我们</h5>
          <p>邮箱: support@healthypathway.com</p>
          <p>电话: (555) 123-4567</p>
        </div>
      </div>
      <div class="row mt-4">
        <div class="col-12 text-center">
          <small>&copy; {{ currentYear }} Healthy Pathway. All rights reserved.</small>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'

const currentYear = ref(new Date().getFullYear())
</script>

<style scoped>
.footer {
  background-color: white;
  padding: 3rem 0;
  margin-top: auto;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
}

.footer h5 {
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  font-weight: 600;
}

.footer p {
  color: var(--text-color);
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

.footer a {
  color: var(--secondary-color);
  text-decoration: none;
  transition: color 0.3s ease;
  font-weight: 500;
  display: inline-block;
  margin-bottom: 0.75rem;
}

.footer a:hover {
  color: var(--primary-color);
}

.footer .col-12 {
  margin-bottom: 2rem;
}

@media (max-width: 575.98px) {
  .footer {
    padding: 2rem 0;
    text-align: center;
  }
}
</style>

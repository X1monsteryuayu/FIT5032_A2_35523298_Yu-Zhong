[<template>
  <div class="role-banner" :class="roleClass">
    <div class="container">
      <div class="banner-content">
        <i :class="roleIcon"></i>
        <div class="banner-text">
          <h4>{{ welcomeMessage }}</h4>
          <p>{{ roleDescription }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  role: {
    type: String,
    required: true,
    validator: (value) => ['admin', 'user'].includes(value)
  },
  username: {
    type: String,
    required: true
  }
})

const roleClass = computed(() => `role-banner-${props.role}`)
const roleIcon = computed(() => ({
  'admin': 'bi bi-shield-check',
  'user': 'bi bi-person'
}[props.role]))

const welcomeMessage = computed(() => 
  `欢迎回来，${props.username}${props.role === 'admin' ? ' (管理员)' : ''}`
)

const roleDescription = computed(() => ({
  'admin': '您可以管理系统内容和用户数据',
  'user': '浏览健康资讯，为医生评分，管理个人信息'
}[props.role]))
</script>

<style scoped>
.role-banner {
  padding: 1.5rem 0;
  margin-bottom: 2rem;
  border-radius: var(--border-radius);
}

.role-banner-admin {
  background-color: var(--primary-color);
  color: white;
}

.role-banner-user {
  background-color: #f8f9fa;
  color: var(--secondary-color);
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.banner-content i {
  font-size: 2rem;
}

.banner-text {
  margin: 0;
}

.banner-text h4 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.banner-text p {
  margin: 0.5rem 0 0;
  opacity: 0.9;
}

@media (max-width: 575.98px) {
  .banner-content {
    flex-direction: column;
    text-align: center;
  }
  
  .banner-content i {
    margin-bottom: 0.5rem;
  }
}
</style>

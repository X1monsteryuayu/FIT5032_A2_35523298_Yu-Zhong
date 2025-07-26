<template>
  <div class="admin-panel">
    <div class="container">
      <RoleBanner role="admin" :username="adminName" />
      
      <!-- 管理菜单 -->
      <div class="admin-nav mb-4">
        <div class="btn-group">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            class="btn"
            :class="[activeTab === tab.id ? 'btn-primary' : 'btn-outline-primary']"
            @click="activeTab = tab.id"
          >
            {{ tab.name }}
          </button>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="content-area">
        <!-- 用户管理 -->
        <div v-if="activeTab === 'users'" class="panel">
          <h3 class="mb-4">用户管理</h3>
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>用户名</th>
                  <th>邮箱</th>
                  <th>注册时间</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td>{{ user.id }}</td>
                  <td>{{ user.username }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ formatDate(user.registerDate) }}</td>
                  <td>
                    <span :class="['badge', user.active ? 'bg-success' : 'bg-danger']">
                      {{ user.active ? '正常' : '禁用' }}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-outline-primary me-2">编辑</button>
                    <button 
                      class="btn btn-sm"
                      :class="[user.active ? 'btn-outline-danger' : 'btn-outline-success']"
                      @click="toggleUserStatus(user)"
                    >
                      {{ user.active ? '禁用' : '启用' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 文章管理 -->
        <div v-if="activeTab === 'articles'" class="panel">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h3>文章管理</h3>
            <button class="btn btn-primary" @click="openNewArticleModal">
              新建文章
            </button>
          </div>
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>标题</th>
                  <th>分类</th>
                  <th>发布时间</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="article in articles" :key="article.id">
                  <td>{{ article.id }}</td>
                  <td>{{ article.title }}</td>
                  <td>{{ article.category }}</td>
                  <td>{{ formatDate(article.date) }}</td>
                  <td>
                    <span :class="['badge', article.published ? 'bg-success' : 'bg-warning']">
                      {{ article.published ? '已发布' : '草稿' }}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-outline-primary me-2">编辑</button>
                    <button class="btn btn-sm btn-outline-danger">删除</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 评分管理 -->
        <div v-if="activeTab === 'ratings'" class="panel">
          <h3 class="mb-4">评分管理</h3>
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>医生</th>
                  <th>总评分数</th>
                  <th>平均分</th>
                  <th>最近评分</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="rating in doctorRatings" :key="rating.doctorId">
                  <td>{{ rating.doctorName }}</td>
                  <td>{{ rating.totalRatings }}</td>
                  <td>{{ rating.averageRating.toFixed(1) }}</td>
                  <td>{{ formatDate(rating.lastRatingDate) }}</td>
                  <td>
                    <button class="btn btn-sm btn-outline-primary">查看详情</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import RoleBanner from '../components/RoleBanner.vue'

const adminName = '管理员'
const activeTab = ref('users')

const tabs = [
  { id: 'users', name: '用户管理' },
  { id: 'articles', name: '文章管理' },
  { id: 'ratings', name: '评分管理' }
]

// 模拟数据
const users = ref([
  {
    id: 1,
    username: 'user1',
    email: 'user1@example.com',
    registerDate: '2025-07-01',
    active: true
  },
  // 更多用户数据...
])

const articles = ref([
  {
    id: 1,
    title: '保持健康的饮食习惯',
    category: '饮食健康',
    date: '2025-07-20',
    published: true
  },
  // 更多文章数据...
])

const doctorRatings = ref([
  {
    doctorId: 1,
    doctorName: '张医生',
    totalRatings: 128,
    averageRating: 4.5,
    lastRatingDate: '2025-07-21'
  },
  // 更多评分数据...
])

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const toggleUserStatus = (user) => {
  user.active = !user.active
}

const openNewArticleModal = () => {
  // 实现新建文章逻辑
}
</script>

<style scoped>
.admin-panel {
  padding: 2rem 0;
}

.admin-nav {
  background: white;
  padding: 1rem;
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.panel {
  background: white;
  padding: 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-group {
  display: flex;
  gap: 0.5rem;
}

@media (max-width: 767.98px) {
  .btn-group {
    flex-direction: column;
  }
  
  .panel {
    padding: 1rem;
  }
}

.table {
  margin-bottom: 0;
}

.table th {
  white-space: nowrap;
}
</style>

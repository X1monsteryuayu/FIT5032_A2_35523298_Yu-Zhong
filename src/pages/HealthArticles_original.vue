<template>
  <div class="health-articles">
    <div class="container">
      <h1 class="text-center mb-5">健康资讯</h1>
      
      <!-- 文章搜索和筛选 -->
      <div class="search-filter mb-4">
        <div class="row g-3">
          <div class="col-md-6">
            <input 
              type="text" 
              class="form-control" 
              v-model="searchQuery"
              placeholder="搜索文章..."
              @input="filterArticles"
            >
          </div>
          <div class="col-md-3">
            <select class="form-select" v-model="selectedCategory" @change="filterArticles">
              <option value="">所有分类</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- 文章列表 -->
      <div class="row">
        <div v-for="article in filteredArticles" :key="article.id" class="col-md-6 col-lg-4 mb-4">
          <div class="article-card">
            <div class="article-image">
              <img :src="article.image" :alt="article.title">
            </div>
            <div class="article-content">
              <span class="article-category">{{ article.category }}</span>
              <h3>{{ article.title }}</h3>
              <p>{{ article.summary }}</p>
              <div class="article-footer">
                <span class="article-date">{{ formatDate(article.date) }}</span>
                <button class="btn btn-primary btn-sm" @click="readMore(article)">
                  阅读更多
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 文章为空时的提示 -->
      <div v-if="filteredArticles.length === 0" class="text-center my-5">
        <p>暂无相关文章</p>
      </div>
    </div>

    <!-- 文章详情模态框 -->
    <div class="modal fade" id="articleModal" tabindex="-1" ref="articleModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ selectedArticle?.title }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <img 
              v-if="selectedArticle?.image" 
              :src="selectedArticle.image" 
              :alt="selectedArticle?.title"
              class="img-fluid mb-3"
            >
            <div v-html="selectedArticle?.content"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Modal } from 'bootstrap'

// 模拟文章数据
const articles = ref([
  {
    id: 1,
    title: '保持健康的饮食习惯',
    summary: '了解如何通过均衡饮食来维护身体健康...',
    content: '详细的文章内容...',
    category: '饮食健康',
    image: 'https://picsum.photos/800/400',
    date: '2025-07-20'
  },
  {
    id: 2,
    title: '运动对心脏健康的重要性',
    summary: '规律运动如何帮助预防心脏疾病...',
    content: '详细的文章内容...',
    category: '运动健康',
    image: 'https://picsum.photos/800/400',
    date: '2025-07-19'
  },
  // 更多文章...
])

const searchQuery = ref('')
const selectedCategory = ref('')
const selectedArticle = ref(null)
const articleModal = ref(null)

const categories = computed(() => 
  Array.from(new Set(articles.value.map(article => article.category)))
)

const filteredArticles = computed(() => {
  return articles.value.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = !selectedCategory.value || article.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

const filterArticles = () => {
  // 实现筛选逻辑
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const readMore = (article) => {
  selectedArticle.value = article
  if (articleModal.value) {
    articleModal.value.show()
  }
}

onMounted(() => {
  articleModal.value = new Modal(document.getElementById('articleModal'))
})
</script>

<style scoped>
.health-articles {
  padding: 2rem 0;
}

.article-card {
  background: white;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.article-image {
  position: relative;
  padding-top: 56.25%; /* 16:9 宽高比 */
}

.article-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.article-category {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.article-content h3 {
  margin: 0 0 1rem;
  font-size: 1.25rem;
  color: var(--secondary-color);
}

.article-content p {
  margin: 0;
  color: var(--text-color);
  opacity: 0.8;
  flex: 1;
}

.article-footer {
  margin-top: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.article-date {
  color: var(--text-color);
  opacity: 0.7;
  font-size: 0.875rem;
}

@media (max-width: 767.98px) {
  .article-card {
    margin-bottom: 1.5rem;
  }
}
</style>

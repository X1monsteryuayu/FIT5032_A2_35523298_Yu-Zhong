<template>
  <div class="health-articles">
    <div class="container-fluid">
      <h1 class="text-center mb-4">健康资讯管理系统</h1>
      
      <!-- 导航选项卡 -->
      <ul class="nav nav-tabs mb-4" role="tablist">
        <li class="nav-item" role="presentation">
          <button 
            class="nav-link active" 
            id="articles-tab" 
            data-bs-toggle="tab" 
            data-bs-target="#articles" 
            type="button" 
            role="tab"
            @click="currentTab = 'articles'"
          >
            <i class="fas fa-newspaper me-2"></i>
            文章管理 ({{ filteredArticles.length }})
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button 
            class="nav-link" 
            id="comments-tab" 
            data-bs-toggle="tab" 
            data-bs-target="#comments" 
            type="button" 
            role="tab"
            @click="currentTab = 'comments'"
          >
            <i class="fas fa-comments me-2"></i>
            评论管理 ({{ filteredComments.length }})
          </button>
        </li>
      </ul>

      <div class="tab-content">
        <!-- 文章表格 -->
        <div class="tab-pane fade show active" id="articles" role="tabpanel">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">文章列表</h5>
              <div class="btn-group">
                <button class="btn btn-success btn-sm" @click="exportArticlesCSV">
                  <i class="fas fa-file-csv me-1"></i>导出CSV
                </button>
                <button class="btn btn-danger btn-sm" @click="exportArticlesPDF">
                  <i class="fas fa-file-pdf me-1"></i>导出PDF
                </button>
              </div>
            </div>
            
            <!-- 文章搜索过滤器 -->
            <div class="card-body pb-0">
              <div class="row g-3 mb-3">
                <div class="col-md-3">
                  <label class="form-label small">按标题搜索</label>
                  <input 
                    type="text" 
                    class="form-control form-control-sm" 
                    v-model="articleFilters.title"
                    placeholder="搜索标题..."
                  >
                </div>
                <div class="col-md-2">
                  <label class="form-label small">按作者搜索</label>
                  <input 
                    type="text" 
                    class="form-control form-control-sm" 
                    v-model="articleFilters.author"
                    placeholder="搜索作者..."
                  >
                </div>
                <div class="col-md-2">
                  <label class="form-label small">按分类筛选</label>
                  <select class="form-select form-select-sm" v-model="articleFilters.category">
                    <option value="">所有分类</option>
                    <option v-for="category in categories" :key="category" :value="category">
                      {{ category }}
                    </option>
                  </select>
                </div>
                <div class="col-md-2">
                  <label class="form-label small">排序方式</label>
                  <select class="form-select form-select-sm" v-model="articleSortBy">
                    <option value="date_desc">日期↓</option>
                    <option value="date_asc">日期↑</option>
                    <option value="views_desc">阅读量↓</option>
                    <option value="views_asc">阅读量↑</option>
                    <option value="title_asc">标题A-Z</option>
                    <option value="title_desc">标题Z-A</option>
                  </select>
                </div>
                <div class="col-md-2">
                  <label class="form-label small">每页条数</label>
                  <select class="form-select form-select-sm" v-model="articlesPerPage">
                    <option value="10">10条/页</option>
                    <option value="20">20条/页</option>
                    <option value="50">50条/页</option>
                  </select>
                </div>
                <div class="col-md-1 d-flex align-items-end">
                  <button class="btn btn-outline-secondary btn-sm" @click="clearArticleFilters">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- 文章表格 -->
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th style="width: 40%">标题</th>
                    <th style="width: 15%">作者</th>
                    <th style="width: 10%">分类</th>
                    <th style="width: 12%">发布日期</th>
                    <th style="width: 8%">阅读量</th>
                    <th style="width: 15%">标签</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="article in paginatedArticles" :key="article.id">
                    <td>
                      <div class="fw-bold">{{ article.title }}</div>
                      <small class="text-muted">{{ truncateText(article.summary, 60) }}</small>
                    </td>
                    <td>{{ article.author }}</td>
                    <td>
                      <span class="badge bg-primary">{{ article.category }}</span>
                    </td>
                    <td>{{ formatDate(article.date) }}</td>
                    <td>
                      <span class="badge bg-info">{{ article.views.toLocaleString() }}</span>
                    </td>
                    <td>
                      <span 
                        v-for="tag in article.tags" 
                        :key="tag"
                        class="badge bg-secondary me-1"
                      >
                        {{ tag }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 文章分页 -->
            <div class="card-footer d-flex justify-content-between align-items-center">
              <span class="text-muted">
                显示 {{ (currentArticlePage - 1) * articlesPerPage + 1 }} - 
                {{ Math.min(currentArticlePage * articlesPerPage, filteredArticles.length) }} 
                条，共 {{ filteredArticles.length }} 条
              </span>
              <nav>
                <ul class="pagination pagination-sm mb-0">
                  <li class="page-item" :class="{ disabled: currentArticlePage === 1 }">
                    <button class="page-link" @click="currentArticlePage = 1" :disabled="currentArticlePage === 1">
                      首页
                    </button>
                  </li>
                  <li class="page-item" :class="{ disabled: currentArticlePage === 1 }">
                    <button class="page-link" @click="currentArticlePage--" :disabled="currentArticlePage === 1">
                      上一页
                    </button>
                  </li>
                  <li 
                    v-for="page in articlePageNumbers" 
                    :key="page"
                    class="page-item" 
                    :class="{ active: page === currentArticlePage }"
                  >
                    <button class="page-link" @click="currentArticlePage = page">
                      {{ page }}
                    </button>
                  </li>
                  <li class="page-item" :class="{ disabled: currentArticlePage === totalArticlePages }">
                    <button class="page-link" @click="currentArticlePage++" :disabled="currentArticlePage === totalArticlePages">
                      下一页
                    </button>
                  </li>
                  <li class="page-item" :class="{ disabled: currentArticlePage === totalArticlePages }">
                    <button class="page-link" @click="currentArticlePage = totalArticlePages" :disabled="currentArticlePage === totalArticlePages">
                      末页
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>

        <!-- 评论表格 -->
        <div class="tab-pane fade" id="comments" role="tabpanel">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">评论管理</h5>
              <div class="btn-group">
                <button class="btn btn-success btn-sm" @click="exportCommentsCSV">
                  <i class="fas fa-file-csv me-1"></i>导出CSV
                </button>
                <button class="btn btn-danger btn-sm" @click="exportCommentsPDF">
                  <i class="fas fa-file-pdf me-1"></i>导出PDF
                </button>
              </div>
            </div>
            
            <!-- 评论搜索过滤器 -->
            <div class="card-body pb-0">
              <div class="row g-3 mb-3">
                <div class="col-md-3">
                  <label class="form-label small">按评论者搜索</label>
                  <input 
                    type="text" 
                    class="form-control form-control-sm" 
                    v-model="commentFilters.commenter"
                    placeholder="搜索评论者..."
                  >
                </div>
                <div class="col-md-4">
                  <label class="form-label small">按内容搜索</label>
                  <input 
                    type="text" 
                    class="form-control form-control-sm" 
                    v-model="commentFilters.content"
                    placeholder="搜索评论内容..."
                  >
                </div>
                <div class="col-md-2">
                  <label class="form-label small">排序方式</label>
                  <select class="form-select form-select-sm" v-model="commentSortBy">
                    <option value="date_desc">时间↓</option>
                    <option value="date_asc">时间↑</option>
                    <option value="likes_desc">点赞↓</option>
                    <option value="likes_asc">点赞↑</option>
                  </select>
                </div>
                <div class="col-md-2">
                  <label class="form-label small">每页条数</label>
                  <select class="form-select form-select-sm" v-model="commentsPerPage">
                    <option value="10">10条/页</option>
                    <option value="20">20条/页</option>
                    <option value="50">50条/页</option>
                  </select>
                </div>
                <div class="col-md-1 d-flex align-items-end">
                  <button class="btn btn-outline-secondary btn-sm" @click="clearCommentFilters">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- 评论表格 -->
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th style="width: 15%">评论者</th>
                    <th style="width: 50%">评论内容</th>
                    <th style="width: 15%">评论时间</th>
                    <th style="width: 10%">点赞数</th>
                    <th style="width: 10%">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="comment in paginatedComments" :key="comment.id">
                    <td>
                      <div class="d-flex align-items-center">
                        <img :src="comment.avatar" class="rounded-circle me-2" width="32" height="32">
                        <div>
                          <div class="fw-bold">{{ comment.commenter }}</div>
                          <small class="text-muted">{{ comment.email }}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>{{ truncateText(comment.content, 120) }}</div>
                      <small class="text-muted">文章: {{ comment.articleTitle }}</small>
                    </td>
                    <td>{{ formatDateTime(comment.date) }}</td>
                    <td>
                      <span class="badge bg-warning">
                        <i class="fas fa-thumbs-up me-1"></i>{{ comment.likes }}
                      </span>
                    </td>
                    <td>
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" @click="viewComment(comment)">
                          <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-outline-danger" @click="deleteComment(comment.id)">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 评论分页 -->
            <div class="card-footer d-flex justify-content-between align-items-center">
              <span class="text-muted">
                显示 {{ (currentCommentPage - 1) * commentsPerPage + 1 }} - 
                {{ Math.min(currentCommentPage * commentsPerPage, filteredComments.length) }} 
                条，共 {{ filteredComments.length }} 条
              </span>
              <nav>
                <ul class="pagination pagination-sm mb-0">
                  <li class="page-item" :class="{ disabled: currentCommentPage === 1 }">
                    <button class="page-link" @click="currentCommentPage = 1" :disabled="currentCommentPage === 1">
                      首页
                    </button>
                  </li>
                  <li class="page-item" :class="{ disabled: currentCommentPage === 1 }">
                    <button class="page-link" @click="currentCommentPage--" :disabled="currentCommentPage === 1">
                      上一页
                    </button>
                  </li>
                  <li 
                    v-for="page in commentPageNumbers" 
                    :key="page"
                    class="page-item" 
                    :class="{ active: page === currentCommentPage }"
                  >
                    <button class="page-link" @click="currentCommentPage = page">
                      {{ page }}
                    </button>
                  </li>
                  <li class="page-item" :class="{ disabled: currentCommentPage === totalCommentPages }">
                    <button class="page-link" @click="currentCommentPage++" :disabled="currentCommentPage === totalCommentPages">
                      下一页
                    </button>
                  </li>
                  <li class="page-item" :class="{ disabled: currentCommentPage === totalCommentPages }">
                    <button class="page-link" @click="currentCommentPage = totalCommentPages" :disabled="currentCommentPage === totalCommentPages">
                      末页
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import jsPDF from 'jspdf'

export default {
  name: 'HealthArticles',
  data() {
    return {
      currentTab: 'articles',
      
      // 文章数据
      articles: [
        {
          id: 1,
          title: '如何保持健康的生活方式',
          author: '李医生',
          category: '健康生活',
          date: '2024-01-15',
          views: 1250,
          tags: ['健康', '生活方式', '预防'],
          summary: '本文介绍了保持健康生活方式的基本原则，包括均衡饮食、规律运动、充足睡眠等重要因素。'
        },
        {
          id: 2,
          title: '心血管疾病的预防与治疗',
          author: '王医生',
          category: '心血管',
          date: '2024-01-10',
          views: 980,
          tags: ['心血管', '预防', '治疗'],
          summary: '心血管疾病是现代人常见的健康问题，本文详细介绍了预防措施和治疗方法。'
        },
        {
          id: 3,
          title: '糖尿病患者的饮食指南',
          author: '张医生',
          category: '糖尿病',
          date: '2024-01-08',
          views: 2100,
          tags: ['糖尿病', '饮食', '管理'],
          summary: '为糖尿病患者提供科学的饮食建议，帮助控制血糖水平。'
        },
        {
          id: 4,
          title: '儿童疫苗接种时间表',
          author: '陈医生',
          category: '儿科',
          date: '2024-01-05',
          views: 1560,
          tags: ['儿科', '疫苗', '预防'],
          summary: '详细的儿童疫苗接种时间表和注意事项。'
        },
        {
          id: 5,
          title: '老年人骨质疏松的预防',
          author: '刘医生',
          category: '老年医学',
          date: '2024-01-03',
          views: 890,
          tags: ['老年', '骨质疏松', '预防'],
          summary: '针对老年人群体的骨质疏松预防措施和治疗建议。'
        },
        {
          id: 6,
          title: '孕期营养补充指南',
          author: '赵医生',
          category: '妇产科',
          date: '2024-01-01',
          views: 1780,
          tags: ['孕期', '营养', '健康'],
          summary: '为准妈妈们提供科学的孕期营养补充建议。'
        },
        {
          id: 7,
          title: '常见皮肤病的识别与治疗',
          author: '孙医生',
          category: '皮肤科',
          date: '2023-12-28',
          views: 1340,
          tags: ['皮肤病', '治疗', '识别'],
          summary: '介绍常见皮肤病的症状识别和治疗方法。'
        },
        {
          id: 8,
          title: '精神健康的重要性',
          author: '周医生',
          category: '精神科',
          date: '2023-12-25',
          views: 720,
          tags: ['精神健康', '心理', '压力'],
          summary: '探讨精神健康对整体健康的重要性和维护方法。'
        },
        {
          id: 9,
          title: '眼部健康保护指南',
          author: '吴医生',
          category: '眼科',
          date: '2023-12-22',
          views: 1120,
          tags: ['眼科', '视力', '保护'],
          summary: '如何保护眼部健康，预防常见眼部疾病。'
        },
        {
          id: 10,
          title: '运动损伤的预防与康复',
          author: '郑医生',
          category: '运动医学',
          date: '2023-12-20',
          views: 1650,
          tags: ['运动', '损伤', '康复'],
          summary: '运动爱好者必读的损伤预防和康复指南。'
        },
        {
          id: 11,
          title: '呼吸系统疾病防护',
          author: '马医生',
          category: '呼吸科',
          date: '2023-12-18',
          views: 950,
          tags: ['呼吸', '疾病', '防护'],
          summary: '呼吸系统疾病的预防措施和日常护理方法。'
        },
        {
          id: 12,
          title: '健康睡眠的重要性',
          author: '林医生',
          category: '睡眠医学',
          date: '2023-12-15',
          views: 2300,
          tags: ['睡眠', '健康', '质量'],
          summary: '良好睡眠对健康的重要性及改善睡眠质量的方法。'
        }
      ],
      
      // 评论数据
      comments: [
        {
          id: 1,
          commenter: '张三',
          email: 'zhangsan@email.com',
          avatar: 'https://via.placeholder.com/32x32/007bff/ffffff?text=张',
          content: '这篇文章写得非常好，对我很有帮助。特别是关于饮食方面的建议很实用。',
          articleTitle: '如何保持健康的生活方式',
          date: '2024-01-16T10:30:00',
          likes: 15
        },
        {
          id: 2,
          commenter: '李四',
          email: 'lisi@email.com',
          avatar: 'https://via.placeholder.com/32x32/28a745/ffffff?text=李',
          content: '医生的建议很专业，我按照文章的方法调整了作息，感觉身体状况有了明显改善。',
          articleTitle: '心血管疾病的预防与治疗',
          date: '2024-01-15T14:20:00',
          likes: 23
        },
        {
          id: 3,
          commenter: '王五',
          email: 'wangwu@email.com',
          avatar: 'https://via.placeholder.com/32x32/dc3545/ffffff?text=王',
          content: '作为糖尿病患者，这个饮食指南对我来说太重要了。已经收藏了，会严格按照执行。',
          articleTitle: '糖尿病患者的饮食指南',
          date: '2024-01-14T09:15:00',
          likes: 31
        },
        {
          id: 4,
          commenter: '赵六',
          email: 'zhaoliu@email.com',
          avatar: 'https://via.placeholder.com/32x32/ffc107/ffffff?text=赵',
          content: '儿童疫苗时间表很详细，作为新手妈妈，这个信息太有用了。谢谢医生的分享！',
          articleTitle: '儿童疫苗接种时间表',
          date: '2024-01-13T16:45:00',
          likes: 18
        },
        {
          id: 5,
          commenter: '钱七',
          email: 'qianqi@email.com',
          avatar: 'https://via.placeholder.com/32x32/6f42c1/ffffff?text=钱',
          content: '我妈妈正在面临骨质疏松的问题，这篇文章提供的预防方法很实用，会推荐给她看。',
          articleTitle: '老年人骨质疏松的预防',
          date: '2024-01-12T11:30:00',
          likes: 12
        },
        {
          id: 6,
          commenter: '孙八',
          email: 'sunba@email.com',
          avatar: 'https://via.placeholder.com/32x32/20c997/ffffff?text=孙',
          content: '怀孕期间营养确实很重要，这个指南让我了解了很多之前不知道的知识点。',
          articleTitle: '孕期营养补充指南',
          date: '2024-01-11T13:20:00',
          likes: 27
        },
        {
          id: 7,
          commenter: '周九',
          email: 'zhoujiu@email.com',
          avatar: 'https://via.placeholder.com/32x32/fd7e14/ffffff?text=周',
          content: '皮肤病识别图片很清晰，对照着能够初步判断自己的情况，但还是要去医院确诊。',
          articleTitle: '常见皮肤病的识别与治疗',
          date: '2024-01-10T08:45:00',
          likes: 9
        },
        {
          id: 8,
          commenter: '吴十',
          email: 'wushi@email.com',
          avatar: 'https://via.placeholder.com/32x32/e83e8c/ffffff?text=吴',
          content: '现代社会压力大，精神健康确实需要重视。文章提到的减压方法我会尝试。',
          articleTitle: '精神健康的重要性',
          date: '2024-01-09T15:10:00',
          likes: 21
        },
        {
          id: 9,
          commenter: '郑十一',
          email: 'zhengshiyi@email.com',
          avatar: 'https://via.placeholder.com/32x32/6610f2/ffffff?text=郑',
          content: '长期使用电脑，眼睛经常干涩。按照文章的建议做眼保健操，确实有改善。',
          articleTitle: '眼部健康保护指南',
          date: '2024-01-08T12:00:00',
          likes: 14
        },
        {
          id: 10,
          commenter: '王十二',
          email: 'wangshier@email.com',
          avatar: 'https://via.placeholder.com/32x32/198754/ffffff?text=王',
          content: '运动爱好者必看！之前运动受过伤，现在知道如何正确预防了。',
          articleTitle: '运动损伤的预防与康复',
          date: '2024-01-07T17:30:00',
          likes: 33
        },
        {
          id: 11,
          commenter: '刘十三',
          email: 'liushisan@email.com',
          avatar: 'https://via.placeholder.com/32x32/17a2b8/ffffff?text=刘',
          content: '最近雾霾严重，呼吸系统防护知识很及时。口罩选择部分特别有用。',
          articleTitle: '呼吸系统疾病防护',
          date: '2024-01-06T19:15:00',
          likes: 19
        },
        {
          id: 12,
          commenter: '陈十四',
          email: 'chenshisi@email.com',
          avatar: 'https://via.placeholder.com/32x32/343a40/ffffff?text=陈',
          content: '失眠困扰我很久了，文章提到的睡眠卫生习惯我会认真执行。希望能改善睡眠质量。',
          articleTitle: '健康睡眠的重要性',
          date: '2024-01-05T21:45:00',
          likes: 26
        }
      ],

      // 过滤器
      articleFilters: {
        title: '',
        author: '',
        category: ''
      },
      commentFilters: {
        commenter: '',
        content: ''
      },

      // 排序
      articleSortBy: 'date_desc',
      commentSortBy: 'date_desc',

      // 分页
      currentArticlePage: 1,
      currentCommentPage: 1,
      articlesPerPage: 10,
      commentsPerPage: 10
    }
  },

  computed: {
    // 分类列表
    categories() {
      return [...new Set(this.articles.map(article => article.category))]
    },

    // 过滤后的文章
    filteredArticles() {
      let filtered = this.articles.filter(article => {
        return (!this.articleFilters.title || article.title.toLowerCase().includes(this.articleFilters.title.toLowerCase())) &&
               (!this.articleFilters.author || article.author.toLowerCase().includes(this.articleFilters.author.toLowerCase())) &&
               (!this.articleFilters.category || article.category === this.articleFilters.category)
      })

      // 排序
      return this.sortArticles(filtered)
    },

    // 过滤后的评论
    filteredComments() {
      let filtered = this.comments.filter(comment => {
        return (!this.commentFilters.commenter || comment.commenter.toLowerCase().includes(this.commentFilters.commenter.toLowerCase())) &&
               (!this.commentFilters.content || comment.content.toLowerCase().includes(this.commentFilters.content.toLowerCase()))
      })

      // 排序
      return this.sortComments(filtered)
    },

    // 文章分页
    totalArticlePages() {
      return Math.ceil(this.filteredArticles.length / this.articlesPerPage)
    },

    paginatedArticles() {
      const start = (this.currentArticlePage - 1) * this.articlesPerPage
      const end = start + parseInt(this.articlesPerPage)
      return this.filteredArticles.slice(start, end)
    },

    articlePageNumbers() {
      const pages = []
      const total = this.totalArticlePages
      const current = this.currentArticlePage
      
      // 显示当前页附近的页码
      const start = Math.max(1, current - 2)
      const end = Math.min(total, current + 2)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    },

    // 评论分页
    totalCommentPages() {
      return Math.ceil(this.filteredComments.length / this.commentsPerPage)
    },

    paginatedComments() {
      const start = (this.currentCommentPage - 1) * this.commentsPerPage
      const end = start + parseInt(this.commentsPerPage)
      return this.filteredComments.slice(start, end)
    },

    commentPageNumbers() {
      const pages = []
      const total = this.totalCommentPages
      const current = this.currentCommentPage
      
      const start = Math.max(1, current - 2)
      const end = Math.min(total, current + 2)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    }
  },

  watch: {
    // 监听过滤器变化，重置页码
    articleFilters: {
      handler() {
        this.currentArticlePage = 1
      },
      deep: true
    },
    commentFilters: {
      handler() {
        this.currentCommentPage = 1
      },
      deep: true
    },
    articleSortBy() {
      this.currentArticlePage = 1
    },
    commentSortBy() {
      this.currentCommentPage = 1
    }
  },

  methods: {
    // 文章排序
    sortArticles(articles) {
      const sorted = [...articles]
      switch (this.articleSortBy) {
        case 'date_desc':
          return sorted.sort((a, b) => new Date(b.date) - new Date(a.date))
        case 'date_asc':
          return sorted.sort((a, b) => new Date(a.date) - new Date(b.date))
        case 'views_desc':
          return sorted.sort((a, b) => b.views - a.views)
        case 'views_asc':
          return sorted.sort((a, b) => a.views - b.views)
        case 'title_asc':
          return sorted.sort((a, b) => a.title.localeCompare(b.title))
        case 'title_desc':
          return sorted.sort((a, b) => b.title.localeCompare(a.title))
        default:
          return sorted
      }
    },

    // 评论排序
    sortComments(comments) {
      const sorted = [...comments]
      switch (this.commentSortBy) {
        case 'date_desc':
          return sorted.sort((a, b) => new Date(b.date) - new Date(a.date))
        case 'date_asc':
          return sorted.sort((a, b) => new Date(a.date) - new Date(b.date))
        case 'likes_desc':
          return sorted.sort((a, b) => b.likes - a.likes)
        case 'likes_asc':
          return sorted.sort((a, b) => a.likes - b.likes)
        default:
          return sorted
      }
    },

    // 清除过滤器
    clearArticleFilters() {
      this.articleFilters = {
        title: '',
        author: '',
        category: ''
      }
    },

    clearCommentFilters() {
      this.commentFilters = {
        commenter: '',
        content: ''
      }
    },

    // 格式化日期
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN')
    },

    formatDateTime(dateString) {
      const date = new Date(dateString)
      return date.toLocaleString('zh-CN')
    },

    // 截取文本
    truncateText(text, length) {
      return text.length > length ? text.substring(0, length) + '...' : text
    },

    // 导出CSV
    exportArticlesCSV() {
      const headers = ['标题', '作者', '分类', '发布日期', '阅读量', '标签']
      const csvContent = [
        headers.join(','),
        ...this.filteredArticles.map(article => [
          `"${article.title}"`,
          `"${article.author}"`,
          `"${article.category}"`,
          `"${article.date}"`,
          article.views,
          `"${article.tags.join(';')}"`
        ].join(','))
      ].join('\n')

      this.downloadCSV(csvContent, '健康文章列表.csv')
    },

    exportCommentsCSV() {
      const headers = ['评论者', '评论内容', '文章标题', '评论时间', '点赞数']
      const csvContent = [
        headers.join(','),
        ...this.filteredComments.map(comment => [
          `"${comment.commenter}"`,
          `"${comment.content}"`,
          `"${comment.articleTitle}"`,
          `"${comment.date}"`,
          comment.likes
        ].join(','))
      ].join('\n')

      this.downloadCSV(csvContent, '文章评论列表.csv')
    },

    downloadCSV(content, filename) {
      const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', filename)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    },

    // 导出PDF
    exportArticlesPDF() {
      const doc = new jsPDF()
      
      // 设置字体
      doc.setFont('helvetica')
      
      // 标题
      doc.setFontSize(18)
      doc.text('Health Articles Report', 20, 20)
      
      // 统计信息
      doc.setFontSize(12)
      doc.text(`Total Articles: ${this.filteredArticles.length}`, 20, 35)
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 45)
      
      // 表头
      let yPosition = 60
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text('Title', 20, yPosition)
      doc.text('Author', 100, yPosition)
      doc.text('Category', 140, yPosition)
      doc.text('Views', 170, yPosition)
      
      // 数据行
      doc.setFont('helvetica', 'normal')
      this.filteredArticles.slice(0, 30).forEach((article, index) => {
        yPosition += 10
        if (yPosition > 270) {
          doc.addPage()
          yPosition = 20
        }
        
        doc.text(this.truncateText(article.title, 30), 20, yPosition)
        doc.text(article.author, 100, yPosition)
        doc.text(article.category, 140, yPosition)
        doc.text(article.views.toString(), 170, yPosition)
      })
      
      doc.save('健康文章报告.pdf')
    },

    exportCommentsPDF() {
      const doc = new jsPDF()
      
      doc.setFont('helvetica')
      doc.setFontSize(18)
      doc.text('Comments Report', 20, 20)
      
      doc.setFontSize(12)
      doc.text(`Total Comments: ${this.filteredComments.length}`, 20, 35)
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 45)
      
      let yPosition = 60
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text('Commenter', 20, yPosition)
      doc.text('Content', 60, yPosition)
      doc.text('Likes', 170, yPosition)
      
      doc.setFont('helvetica', 'normal')
      this.filteredComments.slice(0, 30).forEach((comment, index) => {
        yPosition += 15
        if (yPosition > 270) {
          doc.addPage()
          yPosition = 20
        }
        
        doc.text(comment.commenter, 20, yPosition)
        doc.text(this.truncateText(comment.content, 40), 60, yPosition)
        doc.text(comment.likes.toString(), 170, yPosition)
      })
      
      doc.save('文章评论报告.pdf')
    },

    // 查看评论详情
    viewComment(comment) {
      alert(`评论详情:\n\n评论者: ${comment.commenter}\n内容: ${comment.content}\n文章: ${comment.articleTitle}\n时间: ${this.formatDateTime(comment.date)}`)
    },

    // 删除评论
    deleteComment(commentId) {
      if (confirm('确定要删除这条评论吗？')) {
        const index = this.comments.findIndex(c => c.id === commentId)
        if (index > -1) {
          this.comments.splice(index, 1)
          alert('评论已删除')
        }
      }
    }
  }
}
</script>

<style scoped>
.health-articles {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 20px 0;
}

.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  border: 1px solid rgba(0, 0, 0, 0.125);
}

.table th {
  border-top: none;
  font-weight: 600;
}

.table td {
  vertical-align: middle;
}

.badge {
  font-size: 0.75em;
}

.page-link {
  border-color: #dee2e6;
}

.page-item.active .page-link {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-group-sm > .btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}

.form-control-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.form-select-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.nav-tabs .nav-link {
  border: 1px solid transparent;
  border-top-left-radius: 0.375rem;
  border-top-right-radius: 0.375rem;
}

.nav-tabs .nav-link.active {
  color: #495057;
  background-color: #fff;
  border-color: #dee2e6 #dee2e6 #fff;
}
</style>

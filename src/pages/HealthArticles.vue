<template>
  <div class="health-articles">
    <div class="container-fluid">
      <h1 class="text-center mb-4">Health Articles Management System</h1>
      
      <!-- Navigation tabs -->
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
            Articles Management ({{ filteredArticles.length }})
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
            Comments Management ({{ filteredComments.length }})
          </button>
        </li>
      </ul>

      <div class="tab-content">
        <!-- Articles table -->
        <div class="tab-pane fade show active" id="articles" role="tabpanel">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Articles List</h5>
              <div class="btn-group">
                <button class="btn btn-success btn-sm" @click="exportArticlesCSV">
                  <i class="fas fa-file-csv me-1"></i>Export CSV
                </button>
                <button class="btn btn-danger btn-sm" @click="exportArticlesPDF">
                  <i class="fas fa-file-pdf me-1"></i>Export PDF
                </button>
              </div>
            </div>
            
            <!-- Articles search filters -->
            <div class="card-body pb-0">
              <div class="row g-3 mb-3">
                <div class="col-md-3">
                  <label class="form-label small">Search by Title</label>
                  <input 
                    type="text" 
                    class="form-control form-control-sm" 
                    v-model="articleFilters.title"
                    placeholder="Search title..."
                  >
                </div>
                <div class="col-md-2">
                  <label class="form-label small">Search by Author</label>
                  <input 
                    type="text" 
                    class="form-control form-control-sm" 
                    v-model="articleFilters.author"
                    placeholder="Search author..."
                  >
                </div>
                <div class="col-md-2">
                  <label class="form-label small">Filter by Category</label>
                  <select class="form-select form-select-sm" v-model="articleFilters.category">
                    <option value="">All Categories</option>
                    <option v-for="category in categories" :key="category" :value="category">
                      {{ category }}
                    </option>
                  </select>
                </div>
                <div class="col-md-2">
                  <label class="form-label small">Sort By</label>
                  <select class="form-select form-select-sm" v-model="articleSortBy">
                    <option value="date_desc">Date ↓</option>
                    <option value="date_asc">Date ↑</option>
                    <option value="views_desc">Views ↓</option>
                    <option value="views_asc">Views ↑</option>
                    <option value="title_asc">Title A-Z</option>
                    <option value="title_desc">Title Z-A</option>
                  </select>
                </div>
                <div class="col-md-2">
                  <label class="form-label small">Per Page</label>
                  <select class="form-select form-select-sm" v-model="articlesPerPage">
                    <option value="10">10 per page</option>
                    <option value="20">20 per page</option>
                    <option value="50">50 per page</option>
                  </select>
                </div>
                <div class="col-md-1 d-flex align-items-end">
                  <button class="btn btn-outline-secondary btn-sm" @click="clearArticleFilters" aria-label="Clear all filters">
                    <i class="fas fa-times" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Articles table -->
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th style="width: 40%">Title</th>
                    <th style="width: 15%">Author</th>
                    <th style="width: 10%">Category</th>
                    <th style="width: 12%">Published Date</th>
                    <th style="width: 8%">Views</th>
                    <th style="width: 15%">Tags</th>
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

            <!-- Articles pagination -->
            <div class="card-footer d-flex justify-content-between align-items-center">
              <span class="text-muted">
                Showing {{ (currentArticlePage - 1) * articlesPerPage + 1 }} - 
                {{ Math.min(currentArticlePage * articlesPerPage, filteredArticles.length) }} 
                of {{ filteredArticles.length }} entries
              </span>
              <nav>
                <ul class="pagination pagination-sm mb-0">
                  <li class="page-item" :class="{ disabled: currentArticlePage === 1 }">
                    <button class="page-link" @click="currentArticlePage = 1" :disabled="currentArticlePage === 1">
                      First
                    </button>
                  </li>
                  <li class="page-item" :class="{ disabled: currentArticlePage === 1 }">
                    <button class="page-link" @click="currentArticlePage--" :disabled="currentArticlePage === 1">
                      Previous
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
                      Next
                    </button>
                  </li>
                  <li class="page-item" :class="{ disabled: currentArticlePage === totalArticlePages }">
                    <button class="page-link" @click="currentArticlePage = totalArticlePages" :disabled="currentArticlePage === totalArticlePages">
                      Last
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>

        <!-- Comments table -->
        <div class="tab-pane fade" id="comments" role="tabpanel">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Comments Management</h5>
              <div class="btn-group">
                <button class="btn btn-success btn-sm" @click="exportCommentsCSV">
                  <i class="fas fa-file-csv me-1"></i>Export CSV
                </button>
                <button class="btn btn-danger btn-sm" @click="exportCommentsPDF">
                  <i class="fas fa-file-pdf me-1"></i>Export PDF
                </button>
              </div>
            </div>
            
            <!-- Comments search filters -->
            <div class="card-body pb-0">
              <div class="row g-3 mb-3">
                <div class="col-md-3">
                  <label class="form-label small">Search by Commenter</label>
                  <input 
                    type="text" 
                    class="form-control form-control-sm" 
                    v-model="commentFilters.commenter"
                    placeholder="Search commenter..."
                  >
                </div>
                <div class="col-md-4">
                  <label class="form-label small">Search by Content</label>
                  <input 
                    type="text" 
                    class="form-control form-control-sm" 
                    v-model="commentFilters.content"
                    placeholder="Search comment content..."
                  >
                </div>
                <div class="col-md-2">
                  <label class="form-label small">Sort By</label>
                  <select class="form-select form-select-sm" v-model="commentSortBy">
                    <option value="date_desc">Time ↓</option>
                    <option value="date_asc">Time ↑</option>
                    <option value="likes_desc">Likes ↓</option>
                    <option value="likes_asc">Likes ↑</option>
                  </select>
                </div>
                <div class="col-md-2">
                  <label class="form-label small">Per Page</label>
                  <select class="form-select form-select-sm" v-model="commentsPerPage">
                    <option value="10">10 per page</option>
                    <option value="20">20 per page</option>
                    <option value="50">50 per page</option>
                  </select>
                </div>
                <div class="col-md-1 d-flex align-items-end">
                  <button class="btn btn-outline-secondary btn-sm" @click="clearCommentFilters" aria-label="Clear comment filters">
                    <i class="fas fa-times" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Comments table -->
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th style="width: 15%">Commenter</th>
                    <th style="width: 50%">Comment Content</th>
                    <th style="width: 15%">Comment Time</th>
                    <th style="width: 10%">Likes</th>
                    <th style="width: 10%">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="comment in paginatedComments" :key="comment.id">
                    <td>
                      <div class="d-flex align-items-center">
                        <img :src="comment.avatar" :alt="`${comment.commenter}'s avatar`" class="rounded-circle me-2" width="32" height="32">
                        <div>
                          <div class="fw-bold">{{ comment.commenter }}</div>
                          <small class="text-muted">{{ comment.email }}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>{{ truncateText(comment.content, 120) }}</div>
                      <small class="text-muted">Article: {{ comment.articleTitle }}</small>
                    </td>
                    <td>{{ formatDateTime(comment.date) }}</td>
                    <td>
                      <span class="badge bg-warning">
                        <i class="fas fa-thumbs-up me-1"></i>{{ comment.likes }}
                      </span>
                    </td>
                    <td>
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" @click="viewComment(comment)" :aria-label="`View comment by ${comment.commenter}`">
                          <i class="fas fa-eye" aria-hidden="true"></i>
                        </button>
                        <button class="btn btn-outline-danger" @click="deleteComment(comment.id)" :aria-label="`Delete comment by ${comment.commenter}`">
                          <i class="fas fa-trash" aria-hidden="true"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Comments pagination -->
            <div class="card-footer d-flex justify-content-between align-items-center">
              <span class="text-muted">
                Showing {{ (currentCommentPage - 1) * commentsPerPage + 1 }} - 
                {{ Math.min(currentCommentPage * commentsPerPage, filteredComments.length) }} 
                of {{ filteredComments.length }} entries
              </span>
              <nav>
                <ul class="pagination pagination-sm mb-0">
                  <li class="page-item" :class="{ disabled: currentCommentPage === 1 }">
                    <button class="page-link" @click="currentCommentPage = 1" :disabled="currentCommentPage === 1">
                      First
                    </button>
                  </li>
                  <li class="page-item" :class="{ disabled: currentCommentPage === 1 }">
                    <button class="page-link" @click="currentCommentPage--" :disabled="currentCommentPage === 1">
                      Previous
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
                      Next
                    </button>
                  </li>
                  <li class="page-item" :class="{ disabled: currentCommentPage === totalCommentPages }">
                    <button class="page-link" @click="currentCommentPage = totalCommentPages" :disabled="currentCommentPage === totalCommentPages">
                      Last
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
      
      // Article data
      articles: [
        {
          id: 1,
          title: 'How to Maintain a Healthy Lifestyle',
          author: 'Dr. Li',
          category: 'Healthy Living',
          date: '2024-01-15',
          views: 1250,
          tags: ['Health', 'Lifestyle', 'Prevention'],
          summary: 'This article introduces the basic principles of maintaining a healthy lifestyle, including balanced diet, regular exercise, adequate sleep and other important factors.'
        },
        {
          id: 2,
          title: 'Prevention and Treatment of Cardiovascular Disease',
          author: 'Dr. Wang',
          category: 'Cardiovascular',
          date: '2024-01-10',
          views: 980,
          tags: ['Cardiovascular', 'Prevention', 'Treatment'],
          summary: 'Cardiovascular disease is a common health problem for modern people. This article details prevention measures and treatment methods.'
        },
        {
          id: 3,
          title: 'Dietary Guidelines for Diabetic Patients',
          author: 'Dr. Zhang',
          category: 'Diabetes',
          date: '2024-01-08',
          views: 2100,
          tags: ['Diabetes', 'Diet', 'Management'],
          summary: 'Provides scientific dietary advice for diabetic patients to help control blood sugar levels.'
        },
        {
          id: 4,
          title: 'Childhood Vaccination Schedule',
          author: 'Dr. Chen',
          category: 'Pediatrics',
          date: '2024-01-05',
          views: 1560,
          tags: ['Pediatrics', 'Vaccines', 'Prevention'],
          summary: 'Detailed childhood vaccination schedule and precautions.'
        },
        {
          id: 5,
          title: 'Prevention of Osteoporosis in the Elderly',
          author: 'Dr. Liu',
          category: 'Geriatrics',
          date: '2024-01-03',
          views: 890,
          tags: ['Elderly', 'Osteoporosis', 'Prevention'],
          summary: 'Osteoporosis prevention measures and treatment recommendations for elderly populations.'
        },
        {
          id: 6,
          title: 'Nutritional Supplements During Pregnancy',
          author: 'Dr. Zhao',
          category: 'Obstetrics & Gynecology',
          date: '2024-01-01',
          views: 1780,
          tags: ['Pregnancy', 'Nutrition', 'Health'],
          summary: 'Provides scientific pregnancy nutrition supplement recommendations for expectant mothers.'
        },
        {
          id: 7,
          title: 'Identification and Treatment of Common Skin Diseases',
          author: 'Dr. Sun',
          category: 'Dermatology',
          date: '2023-12-28',
          views: 1340,
          tags: ['Skin Disease', 'Treatment', 'Identification'],
          summary: 'Introduces symptom identification and treatment methods for common skin diseases.'
        },
        {
          id: 8,
          title: 'The Importance of Mental Health',
          author: 'Dr. Zhou',
          category: 'Psychiatry',
          date: '2023-12-25',
          views: 720,
          tags: ['Mental Health', 'Psychology', 'Stress'],
          summary: 'Explores the importance of mental health for overall health and maintenance methods.'
        },
        {
          id: 9,
          title: 'Eye Health Protection Guide',
          author: 'Dr. Wu',
          category: 'Ophthalmology',
          date: '2023-12-22',
          views: 1120,
          tags: ['Ophthalmology', 'Vision', 'Protection'],
          summary: 'How to protect eye health and prevent common eye diseases.'
        },
        {
          id: 10,
          title: 'Prevention and Rehabilitation of Sports Injuries',
          author: 'Dr. Zheng',
          category: 'Sports Medicine',
          date: '2023-12-20',
          views: 1650,
          tags: ['Sports', 'Injury', 'Rehabilitation'],
          summary: 'Essential injury prevention and rehabilitation guide for sports enthusiasts.'
        },
        {
          id: 11,
          title: 'Respiratory Disease Protection',
          author: 'Dr. Ma',
          category: 'Respiratory Medicine',
          date: '2023-12-18',
          views: 950,
          tags: ['Respiratory', 'Disease', 'Protection'],
          summary: 'Prevention measures and daily care methods for respiratory diseases.'
        },
        {
          id: 12,
          title: 'The Importance of Healthy Sleep',
          author: 'Dr. Lin',
          category: 'Sleep Medicine',
          date: '2023-12-15',
          views: 2300,
          tags: ['Sleep', 'Health', 'Quality'],
          summary: 'The importance of good sleep for health and methods to improve sleep quality.'
        }
      ],
      
      // Comments data
      comments: [
        {
          id: 1,
          commenter: 'John Smith',
          email: 'john.smith@email.com',
          avatar: 'https://via.placeholder.com/32x32/007bff/ffffff?text=JS',
          content: 'This article is very well written and very helpful to me. The dietary advice is particularly practical.',
          articleTitle: 'How to Maintain a Healthy Lifestyle',
          date: '2024-01-16T10:30:00',
          likes: 15
        },
        {
          id: 2,
          commenter: 'Lisa Wang',
          email: 'lisa.wang@email.com',
          avatar: 'https://via.placeholder.com/32x32/28a745/ffffff?text=LW',
          content: "The doctor's advice is very professional. I adjusted my routine according to the article's methods and felt a significant improvement in my physical condition.",
          articleTitle: 'Prevention and Treatment of Cardiovascular Disease',
          date: '2024-01-15T14:20:00',
          likes: 23
        },
        {
          id: 3,
          commenter: 'Mike Brown',
          email: 'mike.brown@email.com',
          avatar: 'https://via.placeholder.com/32x32/dc3545/ffffff?text=MB',
          content: 'As a diabetic patient, this dietary guide is too important for me. I have bookmarked it and will strictly follow it.',
          articleTitle: 'Dietary Guidelines for Diabetic Patients',
          date: '2024-01-14T09:15:00',
          likes: 31
        },
        {
          id: 4,
          commenter: 'Sarah Johnson',
          email: 'sarah.johnson@email.com',
          avatar: 'https://via.placeholder.com/32x32/ffc107/ffffff?text=SJ',
          content: 'The childhood vaccination schedule is very detailed. As a new mother, this information is so useful. Thank you for sharing!',
          articleTitle: 'Childhood Vaccination Schedule',
          date: '2024-01-13T16:45:00',
          likes: 18
        },
        {
          id: 5,
          commenter: 'David Lee',
          email: 'david.lee@email.com',
          avatar: 'https://via.placeholder.com/32x32/6f42c1/ffffff?text=DL',
          content: 'My mother is facing osteoporosis problems. The prevention methods provided in this article are very practical, I will recommend it to her.',
          articleTitle: 'Prevention of Osteoporosis in the Elderly',
          date: '2024-01-12T11:30:00',
          likes: 12
        },
        {
          id: 6,
          commenter: 'Nancy Chen',
          email: 'nancy.chen@email.com',
          avatar: 'https://via.placeholder.com/32x32/20c997/ffffff?text=NC',
          content: 'Nutrition during pregnancy is indeed very important. This guide taught me a lot of knowledge I did not know before.',
          articleTitle: 'Nutritional Supplements During Pregnancy',
          date: '2024-01-11T13:20:00',
          likes: 27
        },
        {
          id: 7,
          commenter: 'Robert Wilson',
          email: 'robert.wilson@email.com',
          avatar: 'https://via.placeholder.com/32x32/fd7e14/ffffff?text=RW',
          content: 'The skin disease identification pictures are very clear, and I can make a preliminary judgment of my condition, but I still need to go to the hospital for diagnosis.',
          articleTitle: 'Identification and Treatment of Common Skin Diseases',
          date: '2024-01-10T08:45:00',
          likes: 9
        },
        {
          id: 8,
          commenter: 'Emily Davis',
          email: 'emily.davis@email.com',
          avatar: 'https://via.placeholder.com/32x32/e83e8c/ffffff?text=ED',
          content: 'Modern society is stressful, and mental health really needs attention. I will try the stress reduction methods mentioned in the article.',
          articleTitle: 'The Importance of Mental Health',
          date: '2024-01-09T15:10:00',
          likes: 21
        },
        {
          id: 9,
          commenter: 'Tom Anderson',
          email: 'tom.anderson@email.com',
          avatar: 'https://via.placeholder.com/32x32/6610f2/ffffff?text=TA',
          content: 'Long-term computer use makes my eyes often dry. Following the article\'s advice to do eye exercises, there is indeed improvement.',
          articleTitle: 'Eye Health Protection Guide',
          date: '2024-01-08T12:00:00',
          likes: 14
        },
        {
          id: 10,
          commenter: 'Amy Taylor',
          email: 'amy.taylor@email.com',
          avatar: 'https://via.placeholder.com/32x32/198754/ffffff?text=AT',
          content: 'A must-read for sports enthusiasts! I was injured during exercise before, and now I know how to prevent it properly.',
          articleTitle: 'Prevention and Rehabilitation of Sports Injuries',
          date: '2024-01-07T17:30:00',
          likes: 33
        },
        {
          id: 11,
          commenter: 'Chris Martinez',
          email: 'chris.martinez@email.com',
          avatar: 'https://via.placeholder.com/32x32/17a2b8/ffffff?text=CM',
          content: 'The smog has been severe recently, and respiratory protection knowledge is very timely. The mask selection section is particularly useful.',
          articleTitle: 'Respiratory Disease Protection',
          date: '2024-01-06T19:15:00',
          likes: 19
        },
        {
          id: 12,
          commenter: 'Alex Robinson',
          email: 'alex.robinson@email.com',
          avatar: 'https://via.placeholder.com/32x32/343a40/ffffff?text=AR',
          content: 'Insomnia has been bothering me for a long time. I will seriously implement the sleep hygiene habits mentioned in the article. Hope it can improve sleep quality.',
          articleTitle: 'The Importance of Healthy Sleep',
          date: '2024-01-05T21:45:00',
          likes: 26
        }
      ],

      // Filters
      articleFilters: {
        title: '',
        author: '',
        category: ''
      },
      commentFilters: {
        commenter: '',
        content: ''
      },

      // Sorting
      articleSortBy: 'date_desc',
      commentSortBy: 'date_desc',

      // Pagination
      currentArticlePage: 1,
      currentCommentPage: 1,
      articlesPerPage: 10,
      commentsPerPage: 10
    }
  },

  computed: {
    // Category list
    categories() {
      return [...new Set(this.articles.map(article => article.category))]
    },

    // Filtered articles
    filteredArticles() {
      let filtered = this.articles.filter(article => {
        return (!this.articleFilters.title || article.title.toLowerCase().includes(this.articleFilters.title.toLowerCase())) &&
               (!this.articleFilters.author || article.author.toLowerCase().includes(this.articleFilters.author.toLowerCase())) &&
               (!this.articleFilters.category || article.category === this.articleFilters.category)
      })

      // Sorting
      return this.sortArticles(filtered)
    },

    // Filtered comments
    filteredComments() {
      let filtered = this.comments.filter(comment => {
        return (!this.commentFilters.commenter || comment.commenter.toLowerCase().includes(this.commentFilters.commenter.toLowerCase())) &&
               (!this.commentFilters.content || comment.content.toLowerCase().includes(this.commentFilters.content.toLowerCase()))
      })

      // Sorting
      return this.sortComments(filtered)
    },

    // Article pagination
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
      
      // Show page numbers around current page
      const start = Math.max(1, current - 2)
      const end = Math.min(total, current + 2)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    },

    // Comment pagination
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
    // Listen for filter changes, reset page number
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
    // Article sorting
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

    // Comment sorting
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

    // Clear filters
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

    // Format date
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US')
    },

    formatDateTime(dateString) {
      const date = new Date(dateString)
      return date.toLocaleString('en-US')
    },

    // Truncate text
    truncateText(text, length) {
      return text.length > length ? text.substring(0, length) + '...' : text
    },

    // Export CSV
    exportArticlesCSV() {
      const headers = ['Title', 'Author', 'Category', 'Publish Date', 'Views', 'Tags']
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

      this.downloadCSV(csvContent, 'health-articles-list.csv')
    },

    exportCommentsCSV() {
      const headers = ['Commenter', 'Comment Content', 'Article Title', 'Comment Time', 'Likes']
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

      this.downloadCSV(csvContent, 'article-comments-list.csv')
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

    // Export PDF
    exportArticlesPDF() {
      import('jspdf').then(({ jsPDF }) => {
        const doc = new jsPDF()
        
        // Set font to support Unicode characters
        doc.setFont('helvetica')
        
        // Title
        doc.setFontSize(18)
        doc.text('Health Articles Report', 20, 20)
        
        // Statistics
        doc.setFontSize(12)
        doc.text(`Total Articles: ${this.filteredArticles.length}`, 20, 35)
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 45)
        
        // Table header
        let yPosition = 60
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.text('Title', 20, yPosition)
        doc.text('Author', 100, yPosition)
        doc.text('Category', 140, yPosition)
        doc.text('Views', 170, yPosition)
        
        // Data rows
        doc.setFont('helvetica', 'normal')
        this.filteredArticles.slice(0, 30).forEach((article, index) => {
          yPosition += 10
          if (yPosition > 270) {
            doc.addPage()
            yPosition = 20
          }
          
          // Encode text properly to handle Unicode characters
          const titleText = this.encodeForPDF(this.truncateText(article.title, 30))
          const authorText = this.encodeForPDF(article.author)
          const categoryText = this.encodeForPDF(article.category)
          
          doc.text(titleText, 20, yPosition)
          doc.text(authorText, 100, yPosition)
          doc.text(categoryText, 140, yPosition)
          doc.text(article.views.toString(), 170, yPosition)
        })
        
        doc.save('health-articles-report.pdf')
      })
    },

    exportCommentsPDF() {
      import('jspdf').then(({ jsPDF }) => {
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
          
          // Encode text properly to handle Unicode characters
          const commenterText = this.encodeForPDF(comment.commenter)
          const contentText = this.encodeForPDF(this.truncateText(comment.content, 40))
          
          doc.text(commenterText, 20, yPosition)
          doc.text(contentText, 60, yPosition)
          doc.text(comment.likes.toString(), 170, yPosition)
        })
        
        doc.save('article-comments-report.pdf')
      })
    },

    // Helper method to encode text for PDF to handle Unicode characters
    encodeForPDF(text) {
      // Convert to ASCII-safe characters or use fallback for unsupported characters
      return text
        .replace(/[\u4e00-\u9fff]/g, '?') // Replace Chinese characters with ? for now
        .replace(/[^\x00-\x7F]/g, '?') // Replace any non-ASCII characters
    },

    // View comment details
    viewComment(comment) {
      alert(`Comment Details:\n\nCommenter: ${comment.commenter}\nContent: ${comment.content}\nArticle: ${comment.articleTitle}\nTime: ${this.formatDateTime(comment.date)}`)
    },

    // Delete comment
    deleteComment(commentId) {
      if (confirm('Are you sure you want to delete this comment?')) {
        const index = this.comments.findIndex(c => c.id === commentId)
        if (index > -1) {
          this.comments.splice(index, 1)
          alert('Comment has been deleted')
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

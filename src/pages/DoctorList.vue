<template>
  <div class="doctor-list-page">
    <div class="container mt-4">
      <div class="row">
        <div class="col-12">
          <div class="card shadow">
            <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h4 class="mb-0">医生列表</h4>
              <button class="btn btn-light btn-sm" @click="generateMockData">
                <i class="bi bi-arrow-clockwise me-1"></i>
                刷新数据
              </button>
            </div>
            <div class="card-body">
              <!-- 搜索和过滤器 -->
              <div class="row mb-3">
                <div class="col-md-4">
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-search"></i>
                    </span>
                    <input
                      v-model="searchQuery"
                      type="text"
                      class="form-control"
                      placeholder="搜索医生姓名..."
                      @input="handleSearch"
                    />
                  </div>
                </div>
                <div class="col-md-3">
                  <select v-model="specialtyFilter" class="form-select" @change="handleSearch">
                    <option value="">所有专科</option>
                    <option v-for="specialty in availableSpecialties" :key="specialty" :value="specialty">
                      {{ specialty }}
                    </option>
                  </select>
                </div>
                <div class="col-md-3">
                  <select v-model="hospitalFilter" class="form-select" @change="handleSearch">
                    <option value="">所有医院</option>
                    <option v-for="hospital in availableHospitals" :key="hospital" :value="hospital">
                      {{ hospital }}
                    </option>
                  </select>
                </div>
                <div class="col-md-2">
                  <select v-model="sortBy" class="form-select" @change="handleSort">
                    <option value="name">按姓名</option>
                    <option value="rating">按评分</option>
                    <option value="experience">按经验</option>
                  </select>
                </div>
              </div>

              <!-- 数据表格 -->
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead class="table-dark">
                    <tr>
                      <th>
                        <button class="btn btn-link text-white p-0" @click="sort('name')">
                          姓名
                          <i :class="getSortIcon('name')"></i>
                        </button>
                      </th>
                      <th>
                        <button class="btn btn-link text-white p-0" @click="sort('specialty')">
                          专科
                          <i :class="getSortIcon('specialty')"></i>
                        </button>
                      </th>
                      <th>
                        <button class="btn btn-link text-white p-0" @click="sort('hospital')">
                          医院
                          <i :class="getSortIcon('hospital')"></i>
                        </button>
                      </th>
                      <th>
                        <button class="btn btn-link text-white p-0" @click="sort('rating')">
                          评分
                          <i :class="getSortIcon('rating')"></i>
                        </button>
                      </th>
                      <th>
                        <button class="btn btn-link text-white p-0" @click="sort('experience')">
                          经验 (年)
                          <i :class="getSortIcon('experience')"></i>
                        </button>
                      </th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="loading">
                      <td colspan="6" class="text-center py-4">
                        <div class="spinner-border text-primary" role="status">
                          <span class="visually-hidden">Loading...</span>
                        </div>
                      </td>
                    </tr>
                    <tr v-else-if="paginatedData.length === 0">
                      <td colspan="6" class="text-center py-4 text-muted">
                        没有找到匹配的医生
                      </td>
                    </tr>
                    <tr v-else v-for="doctor in paginatedData" :key="doctor.id">
                      <td>
                        <div class="d-flex align-items-center">
                          <div class="avatar me-2">
                            <i class="bi bi-person-circle fs-4 text-primary"></i>
                          </div>
                          <strong>{{ doctor.name }}</strong>
                        </div>
                      </td>
                      <td>
                        <span class="badge bg-info">{{ doctor.specialty }}</span>
                      </td>
                      <td>{{ doctor.hospital }}</td>
                      <td>
                        <div class="d-flex align-items-center">
                          <div class="stars me-1">
                            <i
                              v-for="n in 5"
                              :key="n"
                              class="bi"
                              :class="n <= Math.floor(doctor.rating) ? 'bi-star-fill text-warning' : 'bi-star text-muted'"
                            ></i>
                          </div>
                          <span class="fw-bold">{{ doctor.rating }}</span>
                        </div>
                      </td>
                      <td>{{ doctor.experience }}</td>
                      <td>
                        <div class="btn-group btn-group-sm">
                          <button class="btn btn-outline-primary" @click="viewProfile(doctor)">
                            查看
                          </button>
                          <button 
                            class="btn btn-primary" 
                            @click="bookAppointment(doctor)"
                            :disabled="!authStore.isAuthenticated"
                          >
                            预约
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- 分页 -->
              <nav aria-label="医生列表分页" v-if="totalPages > 1">
                <ul class="pagination justify-content-center">
                  <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <button class="page-link" @click="changePage(currentPage - 1)">
                      <i class="bi bi-chevron-left"></i>
                    </button>
                  </li>
                  
                  <li
                    v-for="page in getVisiblePages()"
                    :key="page"
                    class="page-item"
                    :class="{ active: page === currentPage }"
                  >
                    <button class="page-link" @click="changePage(page)">
                      {{ page }}
                    </button>
                  </li>
                  
                  <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <button class="page-link" @click="changePage(currentPage + 1)">
                      <i class="bi bi-chevron-right"></i>
                    </button>
                  </li>
                </ul>
              </nav>

              <!-- 分页信息 -->
              <div class="d-flex justify-content-between align-items-center mt-3">
                <div class="text-muted">
                  显示 {{ startIndex + 1 }}-{{ Math.min(endIndex, filteredData.length) }} 条，
                  共 {{ filteredData.length }} 条记录
                </div>
                <div>
                  <select v-model="itemsPerPage" class="form-select form-select-sm" @change="handlePageSizeChange">
                    <option value="5">每页 5 条</option>
                    <option value="10">每页 10 条</option>
                    <option value="20">每页 20 条</option>
                    <option value="50">每页 50 条</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 医生详情模态框 -->
    <div class="modal fade" id="doctorModal" tabindex="-1" ref="doctorModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">医生详情</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" v-if="selectedDoctor">
            <div class="text-center mb-3">
              <i class="bi bi-person-circle fs-1 text-primary"></i>
              <h4>{{ selectedDoctor.name }}</h4>
              <span class="badge bg-info">{{ selectedDoctor.specialty }}</span>
            </div>
            <div class="row">
              <div class="col-6">
                <strong>医院:</strong><br>
                {{ selectedDoctor.hospital }}
              </div>
              <div class="col-6">
                <strong>经验:</strong><br>
                {{ selectedDoctor.experience }} 年
              </div>
            </div>
            <div class="mt-3">
              <strong>评分:</strong>
              <div class="d-flex align-items-center">
                <div class="stars me-2">
                  <i
                    v-for="n in 5"
                    :key="n"
                    class="bi"
                    :class="n <= Math.floor(selectedDoctor.rating) ? 'bi-star-fill text-warning' : 'bi-star text-muted'"
                  ></i>
                </div>
                <span class="fw-bold">{{ selectedDoctor.rating }}</span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>
            <button 
              type="button" 
              class="btn btn-primary"
              @click="bookAppointment(selectedDoctor)"
              :disabled="!authStore.isAuthenticated"
            >
              预约咨询
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store'
import { Modal } from 'bootstrap'

const router = useRouter()
const authStore = useAuthStore()

// 数据
const rawData = ref([])
const loading = ref(false)
const searchQuery = ref('')
const specialtyFilter = ref('')
const hospitalFilter = ref('')
const sortBy = ref('name')
const sortOrder = ref('asc')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const selectedDoctor = ref(null)
const doctorModal = ref(null)

// 可用选项
const availableSpecialties = computed(() => {
  return [...new Set(rawData.value.map(doctor => doctor.specialty))]
})

const availableHospitals = computed(() => {
  return [...new Set(rawData.value.map(doctor => doctor.hospital))]
})

// 过滤数据
const filteredData = computed(() => {
  let data = rawData.value

  // 搜索过滤
  if (searchQuery.value) {
    data = data.filter(doctor =>
      doctor.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // 专科过滤
  if (specialtyFilter.value) {
    data = data.filter(doctor => doctor.specialty === specialtyFilter.value)
  }

  // 医院过滤
  if (hospitalFilter.value) {
    data = data.filter(doctor => doctor.hospital === hospitalFilter.value)
  }

  return data
})

// 排序数据
const sortedData = computed(() => {
  const data = [...filteredData.value]
  
  return data.sort((a, b) => {
    let aVal = a[sortBy.value]
    let bVal = b[sortBy.value]
    
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase()
      bVal = bVal.toLowerCase()
    }
    
    if (sortOrder.value === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })
})

// 分页计算
const totalPages = computed(() => Math.ceil(sortedData.value.length / itemsPerPage.value))

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => startIndex.value + itemsPerPage.value)

const paginatedData = computed(() => {
  return sortedData.value.slice(startIndex.value, endIndex.value)
})

// 方法
const generateMockData = () => {
  loading.value = true
  
  setTimeout(() => {
    const specialties = ['内科', '外科', '儿科', '妇科', '骨科', '眼科', '皮肤科', '心理科', '耳鼻喉科', '泌尿科']
    const hospitals = ['北京协和医院', '上海华山医院', '广州中山医院', '深圳人民医院', '杭州第一医院']
    const firstNames = ['张', '李', '王', '刘', '陈', '杨', '赵', '孙', '周', '吴']
    const lastNames = ['医生', '主任', '教授', '专家']
    
    rawData.value = Array.from({ length: 156 }, (_, i) => ({
      id: i + 1,
      name: firstNames[Math.floor(Math.random() * firstNames.length)] + 
            lastNames[Math.floor(Math.random() * lastNames.length)] + (i + 1),
      specialty: specialties[Math.floor(Math.random() * specialties.length)],
      hospital: hospitals[Math.floor(Math.random() * hospitals.length)],
      rating: +(Math.random() * 2 + 3).toFixed(1),
      experience: Math.floor(Math.random() * 25) + 5
    }))
    
    loading.value = false
  }, 800)
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleSort = () => {
  currentPage.value = 1
}

const sort = (column) => {
  if (sortBy.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column
    sortOrder.value = 'asc'
  }
  currentPage.value = 1
}

const getSortIcon = (column) => {
  if (sortBy.value !== column) return 'bi bi-arrow-down-up text-muted'
  return sortOrder.value === 'asc' ? 'bi bi-arrow-up' : 'bi bi-arrow-down'
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const handlePageSizeChange = () => {
  currentPage.value = 1
}

const getVisiblePages = () => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages.filter(page => page !== '...' || pages.indexOf(page) === pages.lastIndexOf(page))
}

const viewProfile = (doctor) => {
  selectedDoctor.value = doctor
  const modal = new Modal(doctorModal.value)
  modal.show()
}

const bookAppointment = (doctor) => {
  if (!authStore.isAuthenticated) {
    alert('请先登录后再预约')
    router.push('/login')
    return
  }
  
  // 跳转到预约页面，并传递医生信息
  router.push({
    name: 'Consultation',
    query: { doctorId: doctor.id, doctorName: doctor.name }
  })
}

onMounted(() => {
  generateMockData()
})
</script>

<style scoped>
.doctor-list-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.table th button {
  text-decoration: none;
  border: none;
  background: none;
}

.table th button:hover {
  text-decoration: underline;
}

.stars {
  font-size: 0.9rem;
}

.avatar {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination .page-link {
  border-radius: 6px;
  margin: 0 2px;
  border: 1px solid #dee2e6;
}

.pagination .page-item.active .page-link {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.form-select-sm {
  width: auto;
}

@media (max-width: 768px) {
  .table-responsive {
    font-size: 0.875rem;
  }
  
  .btn-group-sm .btn {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
  }
}
</style>

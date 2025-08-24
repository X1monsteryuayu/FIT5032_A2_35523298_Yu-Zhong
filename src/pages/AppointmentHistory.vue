<template>
  <div class="appointment-history-page">
    <div class="container mt-4">
      <div class="row">
        <div class="col-12">
          <div class="card shadow">
            <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
              <h4 class="mb-0">预约记录</h4>
              <div class="d-flex gap-2">
                <button class="btn btn-light btn-sm" @click="generateMockAppointments">
                  <i class="bi bi-arrow-clockwise me-1"></i>
                  刷新数据
                </button>
                <router-link to="/consultation" class="btn btn-warning btn-sm">
                  <i class="bi bi-plus-circle me-1"></i>
                  新增预约
                </router-link>
              </div>
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
                      placeholder="搜索医生姓名或预约ID..."
                      @input="handleSearch"
                    />
                  </div>
                </div>
                <div class="col-md-3">
                  <select v-model="statusFilter" class="form-select" @change="handleSearch">
                    <option value="">所有状态</option>
                    <option value="已预约">已预约</option>
                    <option value="已完成">已完成</option>
                    <option value="已取消">已取消</option>
                    <option value="待确认">待确认</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <select v-model="typeFilter" class="form-select" @change="handleSearch">
                    <option value="">所有类型</option>
                    <option value="门诊">门诊</option>
                    <option value="复查">复查</option>
                    <option value="手术咨询">手术咨询</option>
                    <option value="健康检查">健康检查</option>
                  </select>
                </div>
                <div class="col-md-2">
                  <select v-model="sortBy" class="form-select" @change="handleSort">
                    <option value="date">按日期</option>
                    <option value="doctorName">按医生</option>
                    <option value="status">按状态</option>
                  </select>
                </div>
              </div>

              <!-- 数据表格 -->
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead class="table-dark">
                    <tr>
                      <th>
                        <button class="btn btn-link text-white p-0" @click="sort('id')">
                          预约ID
                          <i :class="getSortIcon('id')"></i>
                        </button>
                      </th>
                      <th>
                        <button class="btn btn-link text-white p-0" @click="sort('doctorName')">
                          医生
                          <i :class="getSortIcon('doctorName')"></i>
                        </button>
                      </th>
                      <th>
                        <button class="btn btn-link text-white p-0" @click="sort('date')">
                          预约日期
                          <i :class="getSortIcon('date')"></i>
                        </button>
                      </th>
                      <th>
                        <button class="btn btn-link text-white p-0" @click="sort('time')">
                          时间
                          <i :class="getSortIcon('time')"></i>
                        </button>
                      </th>
                      <th>
                        <button class="btn btn-link text-white p-0" @click="sort('type')">
                          类型
                          <i :class="getSortIcon('type')"></i>
                        </button>
                      </th>
                      <th>
                        <button class="btn btn-link text-white p-0" @click="sort('status')">
                          状态
                          <i :class="getSortIcon('status')"></i>
                        </button>
                      </th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="loading">
                      <td colspan="7" class="text-center py-4">
                        <div class="spinner-border text-primary" role="status">
                          <span class="visually-hidden">Loading...</span>
                        </div>
                      </td>
                    </tr>
                    <tr v-else-if="paginatedData.length === 0">
                      <td colspan="7" class="text-center py-4 text-muted">
                        没有找到匹配的预约记录
                      </td>
                    </tr>
                    <tr v-else v-for="appointment in paginatedData" :key="appointment.id">
                      <td>
                        <span class="badge bg-secondary">#{{ appointment.id }}</span>
                      </td>
                      <td>
                        <div class="d-flex align-items-center">
                          <i class="bi bi-person-circle fs-5 text-primary me-2"></i>
                          <strong>{{ appointment.doctorName }}</strong>
                        </div>
                      </td>
                      <td>
                        <i class="bi bi-calendar3 text-muted me-1"></i>
                        {{ formatDate(appointment.date) }}
                      </td>
                      <td>
                        <i class="bi bi-clock text-muted me-1"></i>
                        {{ appointment.time }}
                      </td>
                      <td>
                        <span class="badge bg-info">{{ appointment.type }}</span>
                      </td>
                      <td>
                        <span 
                          class="badge"
                          :class="getStatusBadgeClass(appointment.status)"
                        >
                          {{ appointment.status }}
                        </span>
                      </td>
                      <td>
                        <div class="btn-group btn-group-sm">
                          <button class="btn btn-outline-primary" @click="viewDetails(appointment)">
                            详情
                          </button>
                          <button 
                            v-if="appointment.status === '已预约'"
                            class="btn btn-outline-warning" 
                            @click="rescheduleAppointment(appointment)"
                          >
                            改期
                          </button>
                          <button 
                            v-if="appointment.status === '已预约' || appointment.status === '待确认'"
                            class="btn btn-outline-danger" 
                            @click="cancelAppointment(appointment)"
                          >
                            取消
                          </button>
                          <button 
                            class="btn btn-outline-success" 
                            @click="downloadConfirmation(appointment)"
                          >
                            下载
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- 分页 -->
              <nav aria-label="预约记录分页" v-if="totalPages > 1">
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

    <!-- 预约详情模态框 -->
    <div class="modal fade" id="appointmentModal" tabindex="-1" ref="appointmentModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">预约详情</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" v-if="selectedAppointment">
            <div class="row">
              <div class="col-md-6">
                <h6 class="text-primary">基本信息</h6>
                <table class="table table-sm">
                  <tr>
                    <td><strong>预约ID:</strong></td>
                    <td>#{{ selectedAppointment.id }}</td>
                  </tr>
                  <tr>
                    <td><strong>医生:</strong></td>
                    <td>{{ selectedAppointment.doctorName }}</td>
                  </tr>
                  <tr>
                    <td><strong>日期:</strong></td>
                    <td>{{ formatDate(selectedAppointment.date) }}</td>
                  </tr>
                  <tr>
                    <td><strong>时间:</strong></td>
                    <td>{{ selectedAppointment.time }}</td>
                  </tr>
                  <tr>
                    <td><strong>类型:</strong></td>
                    <td>
                      <span class="badge bg-info">{{ selectedAppointment.type }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>状态:</strong></td>
                    <td>
                      <span 
                        class="badge"
                        :class="getStatusBadgeClass(selectedAppointment.status)"
                      >
                        {{ selectedAppointment.status }}
                      </span>
                    </td>
                  </tr>
                </table>
              </div>
              <div class="col-md-6">
                <h6 class="text-primary">附加信息</h6>
                <p><strong>预约时间:</strong><br>{{ selectedAppointment.createdAt }}</p>
                <p><strong>备注:</strong><br>{{ selectedAppointment.notes || '无' }}</p>
                <p><strong>费用:</strong><br>¥{{ selectedAppointment.fee || '待确认' }}</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>
            <button 
              type="button" 
              class="btn btn-success"
              @click="downloadConfirmation(selectedAppointment)"
            >
              下载确认单
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store'
import { Modal } from 'bootstrap'
import { downloadAppointmentPDF } from '@/services/emailService'

const router = useRouter()
const authStore = useAuthStore()

// 数据
const rawData = ref([])
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const typeFilter = ref('')
const sortBy = ref('date')
const sortOrder = ref('desc')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const selectedAppointment = ref(null)
const appointmentModal = ref(null)

// 过滤数据
const filteredData = computed(() => {
  let data = rawData.value

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    data = data.filter(appointment =>
      appointment.doctorName.toLowerCase().includes(query) ||
      appointment.id.toString().includes(query)
    )
  }

  // 状态过滤
  if (statusFilter.value) {
    data = data.filter(appointment => appointment.status === statusFilter.value)
  }

  // 类型过滤
  if (typeFilter.value) {
    data = data.filter(appointment => appointment.type === typeFilter.value)
  }

  return data
})

// 排序数据
const sortedData = computed(() => {
  const data = [...filteredData.value]
  
  return data.sort((a, b) => {
    let aVal = a[sortBy.value]
    let bVal = b[sortBy.value]
    
    if (sortBy.value === 'date') {
      aVal = new Date(aVal)
      bVal = new Date(bVal)
    } else if (typeof aVal === 'string') {
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
const generateMockAppointments = () => {
  loading.value = true
  
  setTimeout(() => {
    const doctors = ['张医生', '李医生', '王医生', '刘医生', '陈医生', '杨医生', '赵医生', '孙医生']
    const statuses = ['已预约', '已完成', '已取消', '待确认']
    const types = ['门诊', '复查', '手术咨询', '健康检查']
    const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
    
    rawData.value = Array.from({ length: 85 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() + Math.floor(Math.random() * 60) - 30) // 前后30天
      
      return {
        id: 1000 + i,
        doctorName: doctors[Math.floor(Math.random() * doctors.length)],
        date: date.toISOString().split('T')[0],
        time: times[Math.floor(Math.random() * times.length)],
        type: types[Math.floor(Math.random() * types.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleString(),
        notes: Math.random() > 0.7 ? '请提前15分钟到达' : null,
        fee: Math.floor(Math.random() * 500) + 100
      }
    })
    
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

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const getStatusBadgeClass = (status) => {
  switch (status) {
    case '已预约': return 'bg-primary'
    case '已完成': return 'bg-success'
    case '已取消': return 'bg-danger'
    case '待确认': return 'bg-warning'
    default: return 'bg-secondary'
  }
}

const viewDetails = (appointment) => {
  selectedAppointment.value = appointment
  const modal = new Modal(appointmentModal.value)
  modal.show()
}

const rescheduleAppointment = (appointment) => {
  if (confirm('确定要改期此预约吗？')) {
    // 实现改期逻辑
    router.push({
      name: 'Consultation',
      query: { reschedule: appointment.id }
    })
  }
}

const cancelAppointment = (appointment) => {
  if (confirm('确定要取消此预约吗？此操作不可撤销。')) {
    // 更新状态
    appointment.status = '已取消'
    alert('预约已取消')
  }
}

const downloadConfirmation = (appointment) => {
  const appointmentData = {
    id: appointment.id,
    patientName: authStore.user?.displayName || authStore.user?.email || 'Patient',
    patientEmail: authStore.user?.email,
    doctorName: appointment.doctorName,
    date: formatDate(appointment.date),
    time: appointment.time,
    type: appointment.type
  }
  
  downloadAppointmentPDF(appointmentData)
}

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  generateMockAppointments()
})
</script>

<style scoped>
.appointment-history-page {
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

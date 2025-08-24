<template>
  <div class="appointment-history-page">
    <div class="container mt-4">
      <div class="row">
        <div class="col-12">
          <div class="card shadow">
            <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h4 class="mb-0">
                <i class="fas fa-history me-2"></i>
                Appointment History
              </h4>
              <div class="d-flex gap-2">
                <button class="btn btn-light btn-sm" @click="generateMockAppointments">
                  <i class="fas fa-sync-alt me-1"></i>
                  Refresh Data
                </button>
                <router-link to="/appointment-booking" class="btn btn-warning btn-sm">
                  <i class="fas fa-plus-circle me-1"></i>
                  New Appointment
                </router-link>
              </div>
            </div>
            <div class="card-body">
              <!-- Search and Filters -->
              <div class="row mb-3">
                <div class="col-md-4">
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="fas fa-search"></i>
                    </span>
                    <input
                      v-model="searchQuery"
                      type="text"
                      class="form-control"
                      placeholder="Search doctor name or appointment ID..."
                      @input="handleSearch"
                    />
                  </div>
                </div>
                <div class="col-md-3">
                  <select v-model="statusFilter" class="form-select" @change="handleSearch">
                    <option value="">All Status</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <select v-model="typeFilter" class="form-select" @change="handleSearch">
                    <option value="">All Types</option>
                    <option value="General Consultation">General Consultation</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Surgery Consultation">Surgery Consultation</option>
                    <option value="Health Checkup">Health Checkup</option>
                  </select>
                </div>
                <div class="col-md-2">
                  <select v-model="sortBy" class="form-select" @change="handleSort">
                    <option value="date">By Date</option>
                    <option value="doctorName">By Doctor</option>
                    <option value="status">By Status</option>
                  </select>
                </div>
              </div>

              <!-- Data Table -->
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead class="table-dark">
                    <tr>
                      <th>
                        <button class="btn btn-link text-white p-0" @click="sort('id')">
                          Appointment ID
                          <i :class="getSortIcon('id')"></i>
                        </button>
                      </th>
                      <th>
                        <button class="btn btn-link text-white p-0" @click="sort('doctorName')">
                          Doctor
                          <i :class="getSortIcon('doctorName')"></i>
                        </button>
                      </th>
                      <th>
                        <button class="btn btn-link text-white p-0" @click="sort('date')">
                          Appointment Date
                          <i :class="getSortIcon('date')"></i>
                        </button>
                      </th>
                      <th>
                        <button class="btn btn-link text-white p-0" @click="sort('time')">
                          Time
                          <i :class="getSortIcon('time')"></i>
                        </button>
                      </th>
                      <th>
                        <button class="btn btn-link text-white p-0" @click="sort('type')">
                          Type
                          <i :class="getSortIcon('type')"></i>
                        </button>
                      </th>
                      <th>
                        <button class="btn btn-link text-white p-0" @click="sort('status')">
                          Status
                          <i :class="getSortIcon('status')"></i>
                        </button>
                      </th>
                      <th>Actions</th>
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
                        No matching appointment records found
                      </td>
                    </tr>
                    <tr v-else v-for="appointment in paginatedData" :key="appointment.id">
                      <td>
                        <span class="badge bg-secondary">#{{ appointment.id }}</span>
                      </td>
                      <td>
                        <div class="d-flex align-items-center">
                          <i class="fas fa-user-md fs-5 text-primary me-2"></i>
                          <strong>{{ appointment.doctorName }}</strong>
                        </div>
                      </td>
                      <td>
                        <i class="fas fa-calendar-alt text-muted me-1"></i>
                        {{ formatDate(appointment.date) }}
                      </td>
                      <td>
                        <i class="fas fa-clock text-muted me-1"></i>
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
                            <i class="fas fa-eye me-1"></i>
                            Details
                          </button>
                          <button 
                            v-if="appointment.status === 'Confirmed'"
                            class="btn btn-outline-warning" 
                            @click="rescheduleAppointment(appointment)"
                          >
                            <i class="fas fa-calendar-alt me-1"></i>
                            Reschedule
                          </button>
                          <button 
                            v-if="appointment.status === 'Confirmed' || appointment.status === 'Pending'"
                            class="btn btn-outline-danger" 
                            @click="cancelAppointment(appointment)"
                          >
                            <i class="fas fa-times me-1"></i>
                            Cancel
                          </button>
                          <button 
                            class="btn btn-outline-success" 
                            @click="downloadConfirmation(appointment)"
                          >
                            <i class="fas fa-download me-1"></i>
                            Download
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Pagination -->
              <nav aria-label="Appointment records pagination" v-if="totalPages > 1">
                <ul class="pagination justify-content-center">
                  <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <button class="page-link" @click="changePage(currentPage - 1)">
                      <i class="fas fa-chevron-left"></i>
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
                      <i class="fas fa-chevron-right"></i>
                    </button>
                  </li>
                </ul>
              </nav>

              <!-- Pagination Information -->
              <div class="d-flex justify-content-between align-items-center mt-3">
                <div class="text-muted">
                  Showing {{ startIndex + 1 }}-{{ Math.min(endIndex, filteredData.length) }} of {{ filteredData.length }} records
                </div>
                <div>
                  <select v-model="itemsPerPage" class="form-select form-select-sm" @change="handlePageSizeChange">
                    <option value="5">5 per page</option>
                    <option value="10">10 per page</option>
                    <option value="20">20 per page</option>
                    <option value="50">50 per page</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Appointment Details Modal -->
    <div class="modal fade" id="appointmentModal" tabindex="-1" ref="appointmentModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-info-circle me-2"></i>
              Appointment Details
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" v-if="selectedAppointment">
            <div class="row">
              <div class="col-md-6">
                <h6 class="text-primary">Basic Information</h6>
                <table class="table table-sm">
                  <tr>
                    <td><strong>Appointment ID:</strong></td>
                    <td>#{{ selectedAppointment.id }}</td>
                  </tr>
                  <tr>
                    <td><strong>Doctor:</strong></td>
                    <td>{{ selectedAppointment.doctorName }}</td>
                  </tr>
                  <tr>
                    <td><strong>Date:</strong></td>
                    <td>{{ formatDate(selectedAppointment.date) }}</td>
                  </tr>
                  <tr>
                    <td><strong>Time:</strong></td>
                    <td>{{ selectedAppointment.time }}</td>
                  </tr>
                  <tr>
                    <td><strong>Type:</strong></td>
                    <td>
                      <span class="badge bg-info">{{ selectedAppointment.type }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Status:</strong></td>
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
                <h6 class="text-primary">Additional Information</h6>
                <p><strong>Booking Time:</strong><br>{{ selectedAppointment.createdAt }}</p>
                <p><strong>Notes:</strong><br>{{ selectedAppointment.notes || 'None' }}</p>
                <p><strong>Fee:</strong><br>${{ selectedAppointment.fee || 'To be confirmed' }}</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button 
              type="button" 
              class="btn btn-success"
              @click="downloadConfirmation(selectedAppointment)"
            >
              <i class="fas fa-download me-2"></i>
              Download Confirmation
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
import * as bootstrap from 'bootstrap'
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

  // Type filter
  if (typeFilter.value) {
    data = data.filter(appointment => appointment.type === typeFilter.value)
  }

  return data
})

// Sorted data
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

// Pagination calculation
const totalPages = computed(() => Math.ceil(sortedData.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => startIndex.value + itemsPerPage.value)

const paginatedData = computed(() => {
  return sortedData.value.slice(startIndex.value, endIndex.value)
})

// Methods
const generateMockAppointments = () => {
  loading.value = true
  
  setTimeout(() => {
    const doctors = ['Dr. Johnson', 'Dr. Smith', 'Dr. Wilson', 'Dr. Brown', 'Dr. Chen', 'Dr. Davis', 'Dr. Miller', 'Dr. Garcia']
    const statuses = ['Confirmed', 'Completed', 'Cancelled', 'Pending']
    const types = ['General Consultation', 'Follow-up', 'Surgery Consultation', 'Health Checkup']
    const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
    
    rawData.value = Array.from({ length: 85 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() + Math.floor(Math.random() * 60) - 30) // ±30 days
      
      return {
        id: 1000 + i,
        doctorName: doctors[Math.floor(Math.random() * doctors.length)],
        date: date.toISOString().split('T')[0],
        time: times[Math.floor(Math.random() * times.length)],
        type: types[Math.floor(Math.random() * types.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleString(),
        notes: Math.random() > 0.7 ? 'Please arrive 15 minutes early' : null,
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
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Confirmed': return 'bg-primary'
    case 'Completed': return 'bg-success'
    case 'Cancelled': return 'bg-danger'
    case 'Pending': return 'bg-warning'
    default: return 'bg-secondary'
  }
}

const viewDetails = (appointment) => {
  selectedAppointment.value = appointment
  const modal = new bootstrap.Modal(appointmentModal.value)
  modal.show()
}

const rescheduleAppointment = (appointment) => {
  if (confirm('Are you sure you want to reschedule this appointment?')) {
    // Implement reschedule logic
    router.push({
      name: 'AppointmentBooking',
      query: { reschedule: appointment.id }
    })
  }
}

const cancelAppointment = (appointment) => {
  if (confirm('Are you sure you want to cancel this appointment? This action cannot be undone.')) {
    // Update status
    appointment.status = 'Cancelled'
    alert('Appointment has been cancelled')
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

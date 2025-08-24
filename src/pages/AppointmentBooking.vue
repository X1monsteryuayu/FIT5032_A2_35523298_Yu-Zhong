<template>
  <div class="appointment-booking">
    <!-- Header Section -->
    <div class="page-header bg-primary text-white py-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-8">
            <h1 class="display-5 fw-bold mb-3">
              <i class="fas fa-calendar-plus me-3"></i>
              Appointment Booking
            </h1>
            <p class="lead mb-0">Schedule your medical appointments with real-time availability and conflict management</p>
          </div>
          <div class="col-lg-4 text-lg-end">
            <div class="badge bg-light text-primary fs-6 p-3">
              <i class="fas fa-clock me-2"></i>
              Real-time Scheduling
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container py-5">
      <div class="row">
        <!-- Booking Form Sidebar -->
        <div class="col-lg-4 mb-4">
          <div class="card shadow-sm">
            <div class="card-header bg-white">
              <h5 class="card-title mb-0">
                <i class="fas fa-user-md me-2 text-primary"></i>
                Book New Appointment
              </h5>
            </div>
            <div class="card-body">
              <form @submit.prevent="createAppointment">
                <!-- Doctor Selection -->
                <div class="mb-3">
                  <label for="doctor" class="form-label fw-semibold">
                    <i class="fas fa-stethoscope me-2"></i>
                    Select Doctor
                  </label>
                  <select 
                    id="doctor" 
                    v-model="newAppointment.doctorId" 
                    class="form-select" 
                    required
                    @change="updateAvailableSlots"
                  >
                    <option value="">Choose a doctor...</option>
                    <option v-for="doctor in doctors" :key="doctor.id" :value="doctor.id">
                      Dr. {{ doctor.name }} - {{ doctor.specialty }}
                    </option>
                  </select>
                </div>

                <!-- Appointment Type -->
                <div class="mb-3">
                  <label for="appointmentType" class="form-label fw-semibold">
                    <i class="fas fa-clipboard-list me-2"></i>
                    Appointment Type
                  </label>
                  <select 
                    id="appointmentType" 
                    v-model="newAppointment.type" 
                    class="form-select" 
                    required
                    @change="updateDuration"
                  >
                    <option value="">Select type...</option>
                    <option value="consultation">General Consultation (30 min)</option>
                    <option value="checkup">Health Checkup (45 min)</option>
                    <option value="followup">Follow-up Visit (20 min)</option>
                    <option value="specialist">Specialist Consultation (60 min)</option>
                  </select>
                </div>

                <!-- Date Selection -->
                <div class="mb-3">
                  <label for="appointmentDate" class="form-label fw-semibold">
                    <i class="fas fa-calendar-day me-2"></i>
                    Preferred Date
                  </label>
                  <input 
                    id="appointmentDate"
                    v-model="newAppointment.date" 
                    type="date" 
                    class="form-control"
                    :min="today"
                    :max="maxDate"
                    required
                    @change="updateAvailableSlots"
                  >
                </div>

                <!-- Time Slot Selection -->
                <div class="mb-3" v-if="availableSlots.length > 0">
                  <label class="form-label fw-semibold">
                    <i class="fas fa-clock me-2"></i>
                    Available Time Slots
                  </label>
                  <div class="time-slots">
                    <div class="row g-2">
                      <div class="col-6" v-for="slot in availableSlots" :key="slot.time">
                        <label class="time-slot-option">
                          <input 
                            type="radio" 
                            v-model="newAppointment.time" 
                            :value="slot.time"
                            class="d-none"
                          >
                          <div class="time-slot-card" :class="{ 'selected': newAppointment.time === slot.time }">
                            <div class="time-text">{{ slot.time }}</div>
                            <small class="availability-text">{{ slot.available ? 'Available' : 'Booked' }}</small>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Patient Information -->
                <div class="mb-3">
                  <label for="patientName" class="form-label fw-semibold">
                    <i class="fas fa-user me-2"></i>
                    Patient Name
                  </label>
                  <input 
                    id="patientName"
                    v-model="newAppointment.patientName" 
                    type="text" 
                    class="form-control"
                    placeholder="Enter patient name"
                    required
                  >
                </div>

                <!-- Contact Information -->
                <div class="mb-3">
                  <label for="contactPhone" class="form-label fw-semibold">
                    <i class="fas fa-phone me-2"></i>
                    Contact Phone
                  </label>
                  <input 
                    id="contactPhone"
                    v-model="newAppointment.phone" 
                    type="tel" 
                    class="form-control"
                    placeholder="Enter phone number"
                    required
                  >
                </div>

                <!-- Notes -->
                <div class="mb-4">
                  <label for="notes" class="form-label fw-semibold">
                    <i class="fas fa-sticky-note me-2"></i>
                    Additional Notes
                  </label>
                  <textarea 
                    id="notes"
                    v-model="newAppointment.notes" 
                    class="form-control"
                    rows="3"
                    placeholder="Any special requirements or notes..."
                  ></textarea>
                </div>

                <!-- Submit Button -->
                <button 
                  type="submit" 
                  class="btn btn-primary btn-lg w-100"
                  :disabled="!canBookAppointment || isBooking"
                >
                  <span v-if="isBooking" class="spinner-border spinner-border-sm me-2"></span>
                  <i class="fas fa-calendar-check me-2" v-else></i>
                  {{ isBooking ? 'Booking...' : 'Book Appointment' }}
                </button>
              </form>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="card shadow-sm mt-4">
            <div class="card-body">
              <h6 class="card-title text-muted mb-3">Booking Statistics</h6>
              <div class="stats-grid">
                <div class="stat-item">
                  <div class="stat-number text-primary">{{ appointments.length }}</div>
                  <div class="stat-label">Total Appointments</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number text-success">{{ todayAppointments }}</div>
                  <div class="stat-label">Today's Appointments</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number text-info">{{ upcomingAppointments }}</div>
                  <div class="stat-label">Upcoming</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Calendar Section -->
        <div class="col-lg-8">
          <div class="card shadow-sm">
            <div class="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0">
                <i class="fas fa-calendar-alt me-2 text-primary"></i>
                Appointment Calendar
              </h5>
              <div class="calendar-controls">
                <div class="btn-group btn-group-sm">
                  <button 
                    @click="changeView('dayGridMonth')" 
                    class="btn btn-outline-primary"
                    :class="{ active: currentView === 'dayGridMonth' }"
                  >
                    Month
                  </button>
                  <button 
                    @click="changeView('timeGridWeek')" 
                    class="btn btn-outline-primary"
                    :class="{ active: currentView === 'timeGridWeek' }"
                  >
                    Week
                  </button>
                  <button 
                    @click="changeView('timeGridDay')" 
                    class="btn btn-outline-primary"
                    :class="{ active: currentView === 'timeGridDay' }"
                  >
                    Day
                  </button>
                </div>
              </div>
            </div>
            <div class="card-body p-3">
              <!-- FullCalendar Component -->
              <FullCalendar
                ref="fullCalendar"
                :options="calendarOptions"
                class="custom-calendar"
              />
            </div>
          </div>

          <!-- Legend -->
          <div class="calendar-legend mt-3">
            <div class="row">
              <div class="col-md-3">
                <div class="legend-item">
                  <span class="legend-color bg-primary"></span>
                  <span class="legend-text">Booked Appointments</span>
                </div>
              </div>
              <div class="col-md-3">
                <div class="legend-item">
                  <span class="legend-color bg-success"></span>
                  <span class="legend-text">Available Slots</span>
                </div>
              </div>
              <div class="col-md-3">
                <div class="legend-item">
                  <span class="legend-color bg-warning"></span>
                  <span class="legend-text">Pending Confirmation</span>
                </div>
              </div>
              <div class="col-md-3">
                <div class="legend-item">
                  <span class="legend-color bg-danger"></span>
                  <span class="legend-text">Conflicts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Appointment Details Modal -->
    <div class="modal fade" id="appointmentModal" tabindex="-1" aria-labelledby="appointmentModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="appointmentModalLabel">
              <i class="fas fa-info-circle me-2"></i>
              Appointment Details
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" v-if="selectedAppointment">
            <div class="row">
              <div class="col-md-6">
                <h6 class="text-muted mb-3">Patient Information</h6>
                <p><strong>Name:</strong> {{ selectedAppointment.patientName }}</p>
                <p><strong>Phone:</strong> {{ selectedAppointment.phone }}</p>
                <p><strong>Type:</strong> {{ getAppointmentTypeLabel(selectedAppointment.type) }}</p>
              </div>
              <div class="col-md-6">
                <h6 class="text-muted mb-3">Appointment Details</h6>
                <p><strong>Doctor:</strong> Dr. {{ getDoctorName(selectedAppointment.doctorId) }}</p>
                <p><strong>Date:</strong> {{ formatDate(selectedAppointment.start) }}</p>
                <p><strong>Time:</strong> {{ formatTime(selectedAppointment.start) }} - {{ formatTime(selectedAppointment.end) }}</p>
                <p><strong>Status:</strong> 
                  <span class="badge" :class="getStatusBadgeClass(selectedAppointment.status)">
                    {{ selectedAppointment.status }}
                  </span>
                </p>
              </div>
            </div>
            <div v-if="selectedAppointment.notes" class="mt-3">
              <h6 class="text-muted mb-2">Notes</h6>
              <p class="bg-light p-3 rounded">{{ selectedAppointment.notes }}</p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button 
              v-if="selectedAppointment && selectedAppointment.status === 'confirmed'"
              type="button" 
              class="btn btn-warning"
              @click="rescheduleAppointment"
            >
              <i class="fas fa-calendar-alt me-2"></i>
              Reschedule
            </button>
            <button 
              v-if="selectedAppointment && selectedAppointment.status === 'confirmed'"
              type="button" 
              class="btn btn-danger"
              @click="cancelAppointment"
            >
              <i class="fas fa-times me-2"></i>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Toast -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div id="successToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header bg-success text-white">
          <i class="fas fa-check-circle me-2"></i>
          <strong class="me-auto">Success</strong>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          {{ successMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import * as bootstrap from 'bootstrap'

export default {
  name: 'AppointmentBooking',
  components: {
    FullCalendar
  },
  data() {
    return {
      currentView: 'timeGridWeek',
      isBooking: false,
      successMessage: '',
      selectedAppointment: null,
      
      // New appointment form data
      newAppointment: {
        doctorId: '',
        type: '',
        date: '',
        time: '',
        patientName: '',
        phone: '',
        notes: ''
      },
      
      // Sample doctors data
      doctors: [
        { id: 1, name: 'Sarah Johnson', specialty: 'General Medicine', workingHours: '09:00-17:00' },
        { id: 2, name: 'Michael Chen', specialty: 'Cardiology', workingHours: '10:00-16:00' },
        { id: 3, name: 'Emily Rodriguez', specialty: 'Pediatrics', workingHours: '08:00-15:00' },
        { id: 4, name: 'David Wilson', specialty: 'Orthopedics', workingHours: '09:00-18:00' },
        { id: 5, name: 'Lisa Thompson', specialty: 'Dermatology', workingHours: '11:00-17:00' }
      ],
      
      // Appointment types with durations
      appointmentTypes: {
        consultation: { label: 'General Consultation', duration: 30 },
        checkup: { label: 'Health Checkup', duration: 45 },
        followup: { label: 'Follow-up Visit', duration: 20 },
        specialist: { label: 'Specialist Consultation', duration: 60 }
      },
      
      // Available time slots
      availableSlots: [],
      
      // All appointments
      appointments: []
    }
  },
  
  computed: {
    today() {
      return new Date().toISOString().split('T')[0]
    },
    
    maxDate() {
      const date = new Date()
      date.setMonth(date.getMonth() + 3) // 3 months ahead
      return date.toISOString().split('T')[0]
    },
    
    canBookAppointment() {
      return this.newAppointment.doctorId && 
             this.newAppointment.type && 
             this.newAppointment.date && 
             this.newAppointment.time && 
             this.newAppointment.patientName && 
             this.newAppointment.phone
    },
    
    todayAppointments() {
      const today = new Date().toISOString().split('T')[0]
      return this.appointments.filter(apt => 
        apt.start.startsWith(today)
      ).length
    },
    
    upcomingAppointments() {
      const now = new Date()
      return this.appointments.filter(apt => 
        new Date(apt.start) > now
      ).length
    },
    
    calendarOptions() {
      return {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: ''
        },
        initialView: this.currentView,
        events: this.calendarEvents,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        eventClick: this.handleEventClick,
        select: this.handleDateSelect,
        businessHours: {
          daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
          startTime: '08:00',
          endTime: '18:00'
        },
        slotMinTime: '08:00:00',
        slotMaxTime: '19:00:00',
        height: 'auto',
        eventDisplay: 'block',
        nowIndicator: true
      }
    },
    
    calendarEvents() {
      return this.appointments.map(appointment => ({
        id: appointment.id,
        title: `${appointment.patientName} - Dr. ${this.getDoctorName(appointment.doctorId)}`,
        start: appointment.start,
        end: appointment.end,
        backgroundColor: this.getEventColor(appointment.status),
        borderColor: this.getEventColor(appointment.status),
        extendedProps: {
          appointment: appointment
        }
      }))
    }
  },
  
  mounted() {
    this.generateSampleAppointments()
    this.updateAvailableSlots()
  },
  
  methods: {
    changeView(view) {
      this.currentView = view
      this.$refs.fullCalendar.getApi().changeView(view)
    },
    
    updateDuration() {
      // Update appointment duration based on type
      this.updateAvailableSlots()
    },
    
    updateAvailableSlots() {
      if (!this.newAppointment.doctorId || !this.newAppointment.date) {
        this.availableSlots = []
        return
      }
      
      const selectedDate = this.newAppointment.date
      const doctor = this.doctors.find(d => d.id == this.newAppointment.doctorId)
      
      if (!doctor) return
      
      // Generate time slots based on doctor's working hours
      const slots = this.generateTimeSlots(doctor.workingHours, selectedDate)
      this.availableSlots = slots
    },
    
    generateTimeSlots(workingHours, date) {
      const [start, end] = workingHours.split('-')
      const slots = []
      const startTime = parseInt(start.split(':')[0])
      const endTime = parseInt(end.split(':')[0])
      
      for (let hour = startTime; hour < endTime; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
          const slotDateTime = `${date}T${timeString}:00`
          
          // Check if this slot conflicts with existing appointments
          const hasConflict = this.checkTimeConflict(slotDateTime)
          
          slots.push({
            time: timeString,
            available: !hasConflict,
            datetime: slotDateTime
          })
        }
      }
      
      return slots
    },
    
    checkTimeConflict(slotDateTime) {
      const slotTime = new Date(slotDateTime)
      const appointmentDuration = this.appointmentTypes[this.newAppointment.type]?.duration || 30
      const slotEndTime = new Date(slotTime.getTime() + appointmentDuration * 60000)
      
      return this.appointments.some(appointment => {
        if (appointment.doctorId != this.newAppointment.doctorId) return false
        
        const appointmentStart = new Date(appointment.start)
        const appointmentEnd = new Date(appointment.end)
        
        // Check for overlap
        return (slotTime < appointmentEnd && slotEndTime > appointmentStart)
      })
    },
    
    async createAppointment() {
      if (!this.canBookAppointment) return
      
      this.isBooking = true
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        const appointmentDuration = this.appointmentTypes[this.newAppointment.type].duration
        const startDateTime = `${this.newAppointment.date}T${this.newAppointment.time}:00`
        const endDateTime = new Date(new Date(startDateTime).getTime() + appointmentDuration * 60000).toISOString()
        
        const newAppointment = {
          id: Date.now(),
          doctorId: this.newAppointment.doctorId,
          type: this.newAppointment.type,
          patientName: this.newAppointment.patientName,
          phone: this.newAppointment.phone,
          notes: this.newAppointment.notes,
          start: startDateTime,
          end: endDateTime,
          status: 'confirmed',
          createdAt: new Date().toISOString()
        }
        
        // Check for conflicts one more time
        if (this.checkTimeConflict(startDateTime)) {
          throw new Error('Time slot no longer available. Please select a different time.')
        }
        
        this.appointments.push(newAppointment)
        
        // Reset form
        this.newAppointment = {
          doctorId: '',
          type: '',
          date: '',
          time: '',
          patientName: '',
          phone: '',
          notes: ''
        }
        
        this.availableSlots = []
        
        this.showSuccessMessage('Appointment booked successfully!')
        
      } catch (error) {
        alert(error.message || 'Failed to book appointment. Please try again.')
      } finally {
        this.isBooking = false
      }
    },
    
    handleEventClick(clickInfo) {
      this.selectedAppointment = clickInfo.event.extendedProps.appointment
      const modal = new bootstrap.Modal(document.getElementById('appointmentModal'))
      modal.show()
    },
    
    handleDateSelect(selectInfo) {
      const selectedDate = selectInfo.startStr.split('T')[0]
      this.newAppointment.date = selectedDate
      this.updateAvailableSlots()
      
      // Scroll to booking form
      document.querySelector('.appointment-booking .card').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    },
    
    cancelAppointment() {
      if (confirm('Are you sure you want to cancel this appointment?')) {
        this.appointments = this.appointments.filter(apt => apt.id !== this.selectedAppointment.id)
        this.showSuccessMessage('Appointment cancelled successfully!')
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('appointmentModal'))
        modal.hide()
      }
    },
    
    rescheduleAppointment() {
      // Pre-fill form with current appointment data
      this.newAppointment = {
        doctorId: this.selectedAppointment.doctorId,
        type: this.selectedAppointment.type,
        patientName: this.selectedAppointment.patientName,
        phone: this.selectedAppointment.phone,
        notes: this.selectedAppointment.notes,
        date: '',
        time: ''
      }
      
      // Remove current appointment
      this.appointments = this.appointments.filter(apt => apt.id !== this.selectedAppointment.id)
      
      const modal = bootstrap.Modal.getInstance(document.getElementById('appointmentModal'))
      modal.hide()
      
      // Scroll to booking form
      document.querySelector('.appointment-booking .card').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    },
    
    getDoctorName(doctorId) {
      const doctor = this.doctors.find(d => d.id == doctorId)
      return doctor ? doctor.name : 'Unknown Doctor'
    },
    
    getAppointmentTypeLabel(type) {
      return this.appointmentTypes[type]?.label || type
    },
    
    getEventColor(status) {
      const colors = {
        confirmed: '#0d6efd',
        pending: '#ffc107',
        cancelled: '#dc3545',
        completed: '#198754'
      }
      return colors[status] || '#6c757d'
    },
    
    getStatusBadgeClass(status) {
      const classes = {
        confirmed: 'bg-primary',
        pending: 'bg-warning',
        cancelled: 'bg-danger',
        completed: 'bg-success'
      }
      return classes[status] || 'bg-secondary'
    },
    
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    
    formatTime(dateString) {
      return new Date(dateString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    
    showSuccessMessage(message) {
      this.successMessage = message
      const toast = new bootstrap.Toast(document.getElementById('successToast'))
      toast.show()
    },
    
    generateSampleAppointments() {
      // Generate some sample appointments for demonstration
      const sampleAppointments = [
        {
          id: 1,
          doctorId: 1,
          type: 'consultation',
          patientName: 'John Smith',
          phone: '+1-555-0123',
          notes: 'Regular checkup',
          start: '2024-12-25T09:00:00',
          end: '2024-12-25T09:30:00',
          status: 'confirmed',
          createdAt: '2024-12-20T10:00:00'
        },
        {
          id: 2,
          doctorId: 2,
          type: 'specialist',
          patientName: 'Jane Doe',
          phone: '+1-555-0124',
          notes: 'Heart condition follow-up',
          start: '2024-12-25T14:00:00',
          end: '2024-12-25T15:00:00',
          status: 'confirmed',
          createdAt: '2024-12-20T11:00:00'
        },
        {
          id: 3,
          doctorId: 3,
          type: 'checkup',
          patientName: 'Tommy Wilson',
          phone: '+1-555-0125',
          notes: 'Child vaccination',
          start: '2024-12-26T10:30:00',
          end: '2024-12-26T11:15:00',
          status: 'pending',
          createdAt: '2024-12-20T12:00:00'
        }
      ]
      
      this.appointments = sampleAppointments
    }
  }
}
</script>

<style scoped>
.appointment-booking {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.page-header {
  background: linear-gradient(135deg, #0d6efd 0%, #0056b3 100%);
}

.time-slots {
  max-height: 300px;
  overflow-y: auto;
}

.time-slot-option {
  cursor: pointer;
  display: block;
  width: 100%;
}

.time-slot-card {
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 12px 8px;
  text-align: center;
  transition: all 0.2s ease;
  background: white;
}

.time-slot-card:hover {
  border-color: #0d6efd;
  background-color: #f8f9ff;
}

.time-slot-card.selected {
  border-color: #0d6efd;
  background-color: #0d6efd;
  color: white;
}

.time-text {
  font-weight: 600;
  font-size: 0.9rem;
}

.availability-text {
  font-size: 0.75rem;
  opacity: 0.8;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 1rem;
  text-align: center;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: bold;
}

.stat-label {
  font-size: 0.75rem;
  color: #6c757d;
}

.calendar-legend {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  margin-right: 8px;
}

.legend-text {
  font-size: 0.875rem;
  color: #495057;
}

.custom-calendar {
  font-family: inherit;
}

/* FullCalendar customization */
:deep(.fc-header-toolbar) {
  margin-bottom: 1rem;
}

:deep(.fc-button-primary) {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

:deep(.fc-button-primary:not(:disabled):active),
:deep(.fc-button-primary:not(:disabled).fc-button-active) {
  background-color: #0b5ed7;
  border-color: #0a58ca;
}

:deep(.fc-event) {
  border: none;
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 0.8rem;
}

:deep(.fc-event-title) {
  font-weight: 500;
}

:deep(.fc-daygrid-event) {
  margin: 1px 0;
}

:deep(.fc-timegrid-slot) {
  height: 30px;
}

:deep(.fc-col-header-cell) {
  background-color: #f8f9fa;
  font-weight: 600;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .calendar-controls .btn-group {
    flex-direction: column;
  }
  
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .time-slots .col-6 {
    flex: 0 0 100%;
    max-width: 100%;
  }
}

/* Loading animation */
.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

/* Card hover effects */
.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
}

/* Form focus states */
.form-control:focus,
.form-select:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

/* Success message styling */
.toast {
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
</style>

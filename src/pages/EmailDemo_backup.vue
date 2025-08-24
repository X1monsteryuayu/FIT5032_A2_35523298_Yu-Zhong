<template>
  <div class="email-demo-page">
    <div class="container mt-4">
      <!-- Page Header -->
      <div class="row">
        <div class="col-12">
          <div class="card border-primary mb-4">
            <div class="card-header bg-primary text-white">
              <h2 class="mb-0">
                <i class="fas fa-envelope me-2"></i>
                Contact Us
              </h2>
            </div>
            <div class="card-body">
              <p class="mb-0">
                <strong>� Get in Touch:</strong>
                Send us a message and we'll get back to you as soon as possible.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <!-- Contact Form -->
        <div class="col-lg-8 mx-auto mb-4">
          <div class="card h-100">
            <div class="card-header bg-success text-white">
              <h4 class="mb-0">
                <i class="fas fa-paper-plane me-2"></i>
                Send Message
              </h4>
            </div>
            <div class="card-body">
              <form @submit.prevent="sendContactEmail">
                <div class="mb-3">
                  <label class="form-label">Name *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="contactForm.name"
                    required
                    placeholder="Enter your name"
                  >
                </div>
                
                <div class="mb-3">
                  <label class="form-label">Email *</label>
                  <input 
                    type="email" 
                    class="form-control" 
                    v-model="contactForm.email"
                    required
                    placeholder="example@email.com"
                  >
                </div>
                
                <div class="mb-3">
                  <label class="form-label">Message *</label>
                  <textarea 
                    class="form-control" 
                    rows="4"
                    v-model="contactForm.message"
                    required
                    placeholder="Enter your message..."
                  ></textarea>
                </div>
                
                <!-- File Attachment -->
                <div class="mb-3">
                  <label class="form-label">
                    <i class="fas fa-paperclip me-1"></i>
                    Attachment (Optional)
                  </label>
                  <input 
                    type="file" 
                    class="form-control" 
                    ref="contactFileInput"
                    @change="onContactFileChange"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                  >
                  <div class="form-text">
                    Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG (Max: 5MB)
                  </div>
                  <div v-if="contactForm.attachment" class="mt-2">
                    <div class="d-flex align-items-center justify-content-between bg-light p-2 rounded">
                      <span class="small">
                        <i class="fas fa-file me-1"></i>
                        {{ contactForm.attachment.name }} ({{ formatFileSize(contactForm.attachment.size) }})
                      </span>
                      <button type="button" class="btn btn-sm btn-outline-danger" @click="removeContactAttachment">
                        <i class="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  class="btn btn-success w-100"
                  :disabled="isContactSending"
                >
                  <span v-if="isContactSending">
                    <i class="fas fa-spinner fa-spin me-2"></i>
                    Sending...
                  </span>
                  <span v-else>
                    <i class="fas fa-paper-plane me-2"></i>
                    Send Contact Email
                  </span>
                </button>
              </form>
              
              <!-- Send Result -->
              <div v-if="contactResult" class="mt-3">
                <div :class="`alert alert-${contactResult.success ? 'success' : 'danger'}`">
                  <i :class="`fas fa-${contactResult.success ? 'check-circle' : 'exclamation-triangle'} me-2`"></i>
                  {{ contactResult.message }}
                  <div v-if="contactResult.messageId" class="small mt-2">
                    <strong>Message ID:</strong> {{ contactResult.messageId }}
                  </div>
                  <div v-if="contactResult.demo" class="small mt-1">
                    <span class="badge bg-warning">Demo Mode</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Appointment Confirmation Email Demo -->
        <div class="col-lg-6 mb-4">
          <div class="card h-100">
            <div class="card-header bg-info text-white">
              <h4 class="mb-0">
                <i class="fas fa-calendar-check me-2"></i>
                Appointment Confirmation Email
              </h4>
            </div>
            <div class="card-body">
              <form @submit.prevent="sendAppointmentEmail">
                <div class="mb-3">
                  <label class="form-label">Patient Name *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="appointmentForm.patientName"
                    required
                    placeholder="Enter patient name"
                  >
                </div>
                
                <div class="mb-3">
                  <label class="form-label">Patient Email *</label>
                  <input 
                    type="email" 
                    class="form-control" 
                    v-model="appointmentForm.patientEmail"
                    required
                    placeholder="patient@email.com"
                  >
                </div>
                
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Doctor</label>
                    <select class="form-control" v-model="appointmentForm.doctorName">
                      <option>Dr. Sarah Johnson</option>
                      <option>Dr. Michael Chen</option>
                      <option>Dr. Emily Davis</option>
                    </select>
                  </div>
                  
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Appointment Date</label>
                    <input 
                      type="date" 
                      class="form-control" 
                      v-model="appointmentForm.date"
                    >
                  </div>
                </div>
                
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Appointment Time</label>
                    <select class="form-control" v-model="appointmentForm.time">
                      <option>09:00</option>
                      <option>10:00</option>
                      <option>11:00</option>
                      <option>14:00</option>
                      <option>15:00</option>
                      <option>16:00</option>
                    </select>
                  </div>
                  
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Appointment Type</label>
                    <select class="form-control" v-model="appointmentForm.type">
                      <option>General Checkup</option>
                      <option>Specialist Consultation</option>
                      <option>Follow-up</option>
                      <option>Health Screening</option>
                    </select>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  class="btn btn-info w-100"
                  :disabled="isAppointmentSending"
                >
                  <span v-if="isAppointmentSending">
                    <i class="fas fa-spinner fa-spin me-2"></i>
                    Sending...
                  </span>
                  <span v-else>
                    <i class="fas fa-calendar-check me-2"></i>
                    Send Appointment Confirmation
                  </span>
                </button>
              </form>
              
              <!-- Send Result -->
              <div v-if="appointmentResult" class="mt-3">
                <div :class="`alert alert-${appointmentResult.success ? 'success' : 'danger'}`">
                  <i :class="`fas fa-${appointmentResult.success ? 'check-circle' : 'exclamation-triangle'} me-2`"></i>
                  {{ appointmentResult.message }}
                  <div v-if="appointmentResult.messageId" class="small mt-2">
                    <strong>Message ID:</strong> {{ appointmentResult.messageId }}
                  </div>
                  <div v-if="appointmentResult.demo" class="small mt-1">
                    <span class="badge bg-warning">Demo Mode</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- PDF Generation Demo -->
      <div class="row">
        <div class="col-12 mb-4">
          <div class="card">
            <div class="card-header bg-warning text-dark">
              <h4 class="mb-0">
                <i class="fas fa-file-pdf me-2"></i>
                PDF Attachment Generation Demo
              </h4>
            </div>
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-md-8">
                  <p class="mb-2">
                    <strong>📄 PDF Generation Feature:</strong>
                    The system can automatically generate professional appointment confirmation PDFs and send them as email attachments to patients.
                  </p>
                  <p class="mb-0">
                    <strong>🔧 Technical Implementation:</strong>
                    Uses jsPDF library for client-side PDF generation, supporting Chinese fonts and complex layouts.
                  </p>
                </div>
                <div class="col-md-4 text-end">
                  <button 
                    class="btn btn-warning"
                    @click="generateSamplePDF"
                    :disabled="isGeneratingPDF"
                  >
                    <span v-if="isGeneratingPDF">
                      <i class="fas fa-spinner fa-spin me-2"></i>
                      Generating...
                    </span>
                    <span v-else>
                      <i class="fas fa-download me-2"></i>
                      Generate Sample PDF
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Technical Features -->
      <div class="row">
        <div class="col-12">
          <div class="card border-dark">
            <div class="card-header bg-dark text-white">
              <h4 class="mb-0">
                <i class="fas fa-cogs me-2"></i>
                Email System Technical Features
              </h4>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-3 mb-3">
                  <div class="feature-item text-center p-3 border rounded">
                    <i class="fas fa-server fa-2x text-primary mb-2"></i>
                    <h6>Backend API</h6>
                    <small>Node.js + Express</small>
                  </div>
                </div>
                <div class="col-md-3 mb-3">
                  <div class="feature-item text-center p-3 border rounded">
                    <i class="fas fa-envelope-open-text fa-2x text-success mb-2"></i>
                    <h6>Email Service</h6>
                    <small>Nodemailer + SendGrid</small>
                  </div>
                </div>
                <div class="col-md-3 mb-3">
                  <div class="feature-item text-center p-3 border rounded">
                    <i class="fas fa-paperclip fa-2x text-info mb-2"></i>
                    <h6>Attachment Support</h6>
                    <small>File Upload + PDF Generation</small>
                  </div>
                </div>
                <div class="col-md-3 mb-3">
                  <div class="feature-item text-center p-3 border rounded">
                    <i class="fas fa-shield-alt fa-2x text-warning mb-2"></i>
                    <h6>Failover</h6>
                    <small>Demo Mode Backup</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { sendContactForm, sendAppointmentConfirmation, generateAppointmentPDF } from '@/services/emailService'

export default {
  name: 'EmailDemo',
  data() {
    return {
      // Server Status
      serverStatus: null,
      
      // Contact Form
      contactForm: {
        name: '',
        email: '',
        message: '',
        attachment: null
      },
      isContactSending: false,
      contactResult: null,
      
      // Appointment Form
      appointmentForm: {
        patientName: '',
        patientEmail: '',
        doctorName: 'Dr. Sarah Johnson',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        type: 'General Checkup',
        id: 'AP' + Date.now()
      },
      isAppointmentSending: false,
      appointmentResult: null,
      
      // PDF Generation
      isGeneratingPDF: false
    }
  },
  
  computed: {
    serverStatusClass() {
      if (this.serverStatus === null) return 'text-muted'
      return this.serverStatus ? 'text-success' : 'text-warning'
    },
    
    serverStatusIcon() {
      if (this.serverStatus === null) return 'fas fa-question-circle'
      return this.serverStatus ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle'
    },
    
    serverStatusText() {
      if (this.serverStatus === null) return 'Checking...'
      return this.serverStatus ? 'Email Server Online' : 'Demo Mode'
    }
  },
  
  mounted() {
    this.checkServerStatus()
  },
  
  methods: {
    // Check Server Status
    async checkServerStatus() {
      try {
        const response = await fetch('http://localhost:3001/health', {
          method: 'GET',
          timeout: 3000
        })
        this.serverStatus = response.ok
      } catch (error) {
        this.serverStatus = false
      }
    },
    
    // File Size Formatter
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },
    
    // Contact File Handling
    onContactFileChange(event) {
      const file = event.target.files[0]
      if (file) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          alert('File size must be less than 5MB')
          this.$refs.contactFileInput.value = ''
          return
        }
        this.contactForm.attachment = file
      }
    },
    
    removeContactAttachment() {
      this.contactForm.attachment = null
      this.$refs.contactFileInput.value = ''
    },
    
    // Send Contact Email with Attachment
    async sendContactEmail() {
      this.isContactSending = true
      this.contactResult = null
      
      try {
        // Choose the correct API endpoint based on whether there's an attachment
        let response
        
        if (this.contactForm.attachment) {
          // Send with attachment using FormData
          const formData = new FormData()
          formData.append('name', this.contactForm.name)
          formData.append('email', this.contactForm.email)
          formData.append('message', this.contactForm.message)
          formData.append('files', this.contactForm.attachment)
          
          response = await fetch('http://localhost:3001/api/send-contact-with-file', {
            method: 'POST',
            body: formData
          })
        } else {
          // Send without attachment using JSON
          response = await fetch('http://localhost:3001/api/send-contact', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: this.contactForm.name,
              email: this.contactForm.email,
              message: this.contactForm.message
            })
          })
        }
        
        const result = await response.json()
        
        if (response.ok && result.success) {
          this.contactResult = {
            success: true,
            message: result.message || 'Email sent successfully!',
            messageId: result.messageId,
            demo: result.mode === 'demo'
          }
          
          // Clear form
          this.contactForm = {
            name: '',
            email: '',
            message: '',
            attachment: null
          }
          this.$refs.contactFileInput.value = ''
        } else {
          throw new Error(result.error || 'Failed to send email')
        }
        
      } catch (error) {
        console.error('Contact email error:', error)
        
        // Fallback to demo mode
        this.contactResult = {
          success: true,
          message: 'Demo Mode: Email simulated successfully (server unavailable)',
          messageId: 'demo-contact-' + Date.now(),
          demo: true
        }
        
        // Clear form in demo mode too
        this.contactForm = {
          name: '',
          email: '',
          message: '',
          attachment: null
        }
        this.$refs.contactFileInput.value = ''
      } finally {
        this.isContactSending = false
      }
    },
    
    // Send Appointment Email
    async sendAppointmentEmail() {
      this.isAppointmentSending = true
      this.appointmentResult = null
      
      try {
        const result = await sendAppointmentConfirmation(this.appointmentForm)
        this.appointmentResult = result
        
        if (result.success) {
          // Generate new appointment ID
          this.appointmentForm.id = 'AP' + Date.now()
        }
      } catch (error) {
        this.appointmentResult = {
          success: false,
          message: 'Send failed: ' + error.message
        }
      } finally {
        this.isAppointmentSending = false
      }
    },
    
    // Generate Sample PDF
    async generateSamplePDF() {
      this.isGeneratingPDF = true
      
      try {
        const sampleData = {
          id: 'DEMO-' + Date.now(),
          patientName: 'John Doe',
          patientEmail: 'demo@example.com',
          doctorName: 'Dr. Sarah Johnson',
          date: new Date().toLocaleDateString(),
          time: '09:00',
          type: 'General Checkup'
        }
        
        const pdf = generateAppointmentPDF(sampleData)
        pdf.save(`demo_appointment_${sampleData.id}.pdf`)
        
        alert('PDF generated successfully! Download started.')
      } catch (error) {
        alert('PDF generation failed: ' + error.message)
      } finally {
        this.isGeneratingPDF = false
      }
    }
  }
}
</script>

<style scoped>
.email-demo-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.server-status {
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  text-align: center;
  border: 2px solid currentColor;
}

.feature-item {
  transition: transform 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-5px);
}

.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
}

.alert {
  border-left: 4px solid currentColor;
}

.btn {
  transition: all 0.3s ease;
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>

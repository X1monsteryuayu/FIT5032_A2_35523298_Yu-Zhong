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
                <strong>📧 Get in Touch:</strong>
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
                      <div>
                        <i class="fas fa-file me-1"></i>
                        <span class="small">{{ contactForm.attachment.name }}</span>
                        <span class="badge bg-secondary ms-2">{{ formatFileSize(contactForm.attachment.size) }}</span>
                      </div>
                      <button 
                        type="button" 
                        class="btn btn-sm btn-outline-danger"
                        @click="removeContactAttachment"
                      >
                        <i class="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div class="d-grid">
                  <button 
                    type="submit" 
                    class="btn btn-success btn-lg"
                    :disabled="isContactSending"
                  >
                    <span v-if="isContactSending">
                      <i class="fas fa-spinner fa-spin me-2"></i>
                      Sending...
                    </span>
                    <span v-else>
                      <i class="fas fa-paper-plane me-2"></i>
                      Send Message
                    </span>
                  </button>
                </div>
              </form>
              
              <!-- Result Display -->
              <div v-if="contactResult" class="mt-3">
                <div class="alert" :class="contactResult.success ? 'alert-success' : 'alert-danger'">
                  <div class="d-flex align-items-center">
                    <i :class="contactResult.success ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'" class="me-2"></i>
                    <div class="flex-grow-1">
                      {{ contactResult.message }}
                    </div>
                  </div>
                  <div v-if="contactResult.success && contactResult.messageId" class="small mt-2">
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
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmailDemo',
  data() {
    return {
      // Contact Form
      contactForm: {
        name: '',
        email: '',
        message: '',
        attachment: null
      },
      isContactSending: false,
      contactResult: null
    }
  },
  
  methods: {
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
    }
  }
}
</script>

<style scoped>
.email-demo-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  border: 1px solid rgba(0, 0, 0, 0.125);
}

.card-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
}

.form-control:focus {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn:focus {
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.alert {
  border: none;
  border-radius: 0.375rem;
}

.badge {
  font-size: 0.75em;
}
</style>

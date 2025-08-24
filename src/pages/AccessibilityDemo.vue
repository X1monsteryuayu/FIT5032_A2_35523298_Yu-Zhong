<template>
  <div class="accessibility-demo-page" role="main">
    <div class="container py-5">
      <h1 class="text-center mb-5">♿ Accessibility Features Demo</h1>
      
      <!-- Feature Overview -->
      <section aria-labelledby="overview-heading" class="mb-5">
        <h2 id="overview-heading" class="mb-4">📋 WCAG 2.1 AA Level Accessibility Features</h2>
        <div class="row">
          <div class="col-md-6 mb-4">
            <div class="card h-100">
              <div class="card-body">
                <h3 class="card-title">
                  <i class="fas fa-keyboard me-2" aria-hidden="true"></i>
                  Keyboard Navigation
                </h3>
                <p class="card-text">All interactive elements support Tab navigation with clear focus indicators.</p>
                <button class="btn btn-primary" onclick="alert('Keyboard navigation working properly!')">Test Button</button>
              </div>
            </div>
          </div>
          <div class="col-md-6 mb-4">
            <div class="card h-100">
              <div class="card-body">
                <h3 class="card-title">
                  <i class="fas fa-eye me-2" aria-hidden="true"></i>
                  Screen Reader Support
                </h3>
                <p class="card-text">Uses ARIA labels, semantic HTML, and descriptive text.</p>
                <div class="visually-hidden" aria-live="polite" id="screen-reader-demo">
                  This is hidden content that screen readers can access
                </div>
                <button class="btn btn-success" onclick="document.getElementById('screen-reader-demo').textContent = 'Screen reader content has been updated!'">
                  Update Screen Reader Content
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Accessible Form Example -->
      <section aria-labelledby="form-heading" class="mb-5">
        <h2 id="form-heading" class="mb-4">📝 Accessible Form Example</h2>
        <div class="card">
          <div class="card-body">
            <form @submit.prevent="submitForm" novalidate>
              <div class="mb-3">
                <label for="demo-name" class="form-label required-field">
                  <i class="fas fa-user me-2" aria-hidden="true"></i>
                  Name
                </label>
                <input 
                  id="demo-name"
                  v-model="formData.name"
                  type="text" 
                  class="form-control"
                  :class="{ 'is-invalid': errors.name }"
                  placeholder="Please enter your name"
                  required
                  aria-describedby="name-help name-error"
                  :aria-invalid="!!errors.name"
                >
                <small id="name-help" class="form-text text-muted">
                  Please enter your real name for identity verification
                </small>
                <div v-if="errors.name" id="name-error" class="invalid-feedback" role="alert">
                  {{ errors.name }}
                </div>
              </div>

              <div class="mb-3">
                <label for="demo-email" class="form-label required-field">
                  <i class="fas fa-envelope me-2" aria-hidden="true"></i>
                  Email
                </label>
                <input 
                  id="demo-email"
                  v-model="formData.email"
                  type="email" 
                  class="form-control"
                  :class="{ 'is-invalid': errors.email }"
                  placeholder="example@email.com"
                  required
                  aria-describedby="email-help email-error"
                  :aria-invalid="!!errors.email"
                >
                <small id="email-help" class="form-text text-muted">
                  We will send confirmation information to this email
                </small>
                <div v-if="errors.email" id="email-error" class="invalid-feedback" role="alert">
                  {{ errors.email }}
                </div>
              </div>

              <div class="mb-3">
                <label for="demo-message" class="form-label">
                  <i class="fas fa-comment me-2" aria-hidden="true"></i>
                  Message
                </label>
                <textarea 
                  id="demo-message"
                  v-model="formData.message"
                  class="form-control"
                  rows="4"
                  placeholder="Please enter your message (optional)"
                  aria-describedby="message-help"
                ></textarea>
                <small id="message-help" class="form-text text-muted">
                  Maximum 500 characters
                </small>
              </div>

              <div class="mb-3">
                <div class="form-check">
                  <input 
                    id="demo-agree"
                    v-model="formData.agree"
                    class="form-check-input" 
                    type="checkbox"
                    required
                    :aria-invalid="!!errors.agree"
                  >
                  <label class="form-check-label required-field" for="demo-agree">
                    I agree to the <a href="#" aria-label="View Terms of Service (opens in new window)">Terms of Service</a>
                  </label>
                  <div v-if="errors.agree" class="invalid-feedback d-block" role="alert">
                    {{ errors.agree }}
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="isSubmitting"
                :aria-busy="isSubmitting"
              >
                <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {{ isSubmitting ? 'Submitting...' : 'Submit Form' }}
              </button>
            </form>
          </div>
        </div>
      </section>

      <!-- Color Contrast Examples -->
      <section aria-labelledby="contrast-heading" class="mb-5">
        <h2 id="contrast-heading" class="mb-4">🎨 Color Contrast Examples</h2>
        <div class="row">
          <div class="col-md-4 mb-3">
            <div class="card bg-primary text-white">
              <div class="card-body">
                <h5 class="card-title">High Contrast</h5>
                <p class="card-text">This combination passes WCAG AA standard</p>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-3">
            <div class="card bg-success text-white">
              <div class="card-body">
                <h5 class="card-title">Success State</h5>
                <p class="card-text">Green background, white text</p>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-3">
            <div class="card bg-warning text-dark">
              <div class="card-body">
                <h5 class="card-title">Warning State</h5>
                <p class="card-text">Yellow background, dark text</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Live Feedback Area -->
      <section aria-labelledby="feedback-heading" class="mb-5">
        <h2 id="feedback-heading" class="mb-4">📢 Live Feedback Demo</h2>
        <div class="card">
          <div class="card-body">
            <p>Click the buttons below to test different types of live feedback:</p>
            <div class="btn-group mb-3" role="group" aria-label="Feedback test button group">
              <button @click="showFeedback('success')" class="btn btn-success">Success Message</button>
              <button @click="showFeedback('warning')" class="btn btn-warning">Warning Message</button>
              <button @click="showFeedback('error')" class="btn btn-danger">Error Message</button>
              <button @click="showFeedback('info')" class="btn btn-info">Info Message</button>
            </div>
            
            <!-- Live feedback area -->
            <div v-if="feedback.message" :class="['alert', `alert-${feedback.type}`]" role="alert" aria-live="polite">
              <i :class="feedbackIcon" aria-hidden="true"></i>
              {{ feedback.message }}
            </div>
            
            <!-- Status updates area -->
            <div id="status-updates" aria-live="polite" aria-atomic="true" class="visually-hidden">
              {{ statusMessage }}
            </div>
          </div>
        </div>
      </section>

      <!-- Keyboard Shortcuts -->
      <section aria-labelledby="shortcuts-heading">
        <h2 id="shortcuts-heading" class="mb-4">⌨️ Keyboard Shortcuts</h2>
        <div class="card">
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-striped" role="table" aria-label="Keyboard shortcuts list">
                <caption class="visually-hidden">Available keyboard shortcuts in the application</caption>
                <thead>
                  <tr>
                    <th scope="col">Shortcut</th>
                    <th scope="col">Function</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><kbd>Tab</kbd></td>
                    <td>Move to next focusable element</td>
                  </tr>
                  <tr>
                    <td><kbd>Shift + Tab</kbd></td>
                    <td>Move to previous focusable element</td>
                  </tr>
                  <tr>
                    <td><kbd>Enter</kbd></td>
                    <td>Activate button or link</td>
                  </tr>
                  <tr>
                    <td><kbd>Space</kbd></td>
                    <td>Activate button or checkbox</td>
                  </tr>
                  <tr>
                    <td><kbd>Esc</kbd></td>
                    <td>Close modal or cancel operation</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AccessibilityDemo',
  data() {
    return {
      formData: {
        name: '',
        email: '',
        message: '',
        agree: false
      },
      errors: {},
      isSubmitting: false,
      feedback: {
        type: '',
        message: ''
      },
      statusMessage: ''
    }
  },
  computed: {
    feedbackIcon() {
      const icons = {
        success: 'fas fa-check-circle me-2',
        warning: 'fas fa-exclamation-triangle me-2',
        error: 'fas fa-times-circle me-2',
        info: 'fas fa-info-circle me-2'
      }
      return icons[this.feedback.type] || ''
    }
  },
  methods: {
    validateForm() {
      this.errors = {}
      
      if (!this.formData.name.trim()) {
        this.errors.name = 'Name is required'
      }
      
      if (!this.formData.email.trim()) {
        this.errors.email = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(this.formData.email)) {
        this.errors.email = 'Please enter a valid email address'
      }
      
      if (!this.formData.agree) {
        this.errors.agree = 'You must agree to the Terms of Service to continue'
      }
      
      return Object.keys(this.errors).length === 0
    },
    
    async submitForm() {
      if (!this.validateForm()) {
        this.statusMessage = 'Form validation failed, please check error messages'
        return
      }
      
      this.isSubmitting = true
      this.statusMessage = 'Submitting form...'
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        this.showFeedback('success', 'Form submitted successfully!')
        this.statusMessage = 'Form has been successfully submitted'
        
        // Reset form
        this.formData = {
          name: '',
          email: '',
          message: '',
          agree: false
        }
      } catch (error) {
        this.showFeedback('error', 'Submission failed, please try again')
        this.statusMessage = 'Form submission failed'
      } finally {
        this.isSubmitting = false
      }
    },
    
    showFeedback(type, message) {
      const messages = {
        success: message || 'Operation completed successfully!',
        warning: message || 'Please note: This is a warning message.',
        error: message || 'Error occurred: Operation could not be completed.',
        info: message || 'Information: This is an informational message.'
      }
      
      this.feedback = {
        type,
        message: messages[type]
      }
      
      this.statusMessage = `Displayed ${type} type feedback message`
      
      // Auto-clear feedback after 3 seconds
      setTimeout(() => {
        this.feedback = { type: '', message: '' }
      }, 3000)
    }
  }
}
</script>

<style scoped>
.accessibility-demo-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.required-field::after {
  content: " *";
  color: #dc3545;
  font-weight: bold;
}

.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-2px);
}

kbd {
  background-color: #f8f9fa;
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 2px 4px;
  font-size: 0.875em;
}

.btn:focus-visible {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

.form-control:focus {
  border-color: #0066cc;
  box-shadow: 0 0 0 0.25rem rgba(0, 102, 204, 0.25);
}

.form-check-input:focus {
  box-shadow: 0 0 0 0.25rem rgba(0, 102, 204, 0.25);
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .card {
    border: 2px solid #333;
  }
  
  .btn {
    border-width: 2px;
    font-weight: bold;
  }
}

/* 减少动画 */
@media (prefers-reduced-motion: reduce) {
  .card {
    transition: none;
  }
}
</style>

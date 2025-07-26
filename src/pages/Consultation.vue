<template>
  <div class="consultation">
    <div class="container py-5">
      <h1 class="text-center mb-5">Health Consultation</h1>
      
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title mb-4">Request a Consultation</h5>
              
              <form @submit.prevent="submitConsultation">
                <div class="mb-3">
                  <label for="topic" class="form-label">Consultation Topic</label>
                  <select v-model="consultation.topic" id="topic" class="form-select" required>
                    <option value="">Select a topic</option>
                    <option value="general">General Health</option>
                    <option value="mental">Mental Health</option>
                    <option value="nutrition">Nutrition</option>
                    <option value="fitness">Fitness</option>
                  </select>
                </div>

                <div class="mb-3">
                  <label for="preferredLanguage" class="form-label">Preferred Language</label>
                  <select v-model="consultation.language" id="preferredLanguage" class="form-select" required>
                    <option value="">Select a language</option>
                    <option value="english">English</option>
                    <option value="chinese">Chinese</option>
                  </select>
                </div>

                <div class="mb-3">
                  <label for="description" class="form-label">Description</label>
                  <div class="position-relative">
                    <textarea
                      v-model="consultation.description"
                      id="description"
                      class="form-control"
                      rows="5"
                      required
                      placeholder="Please describe your health concerns..."
                      maxlength="500"
                      @input="updateCharCount"
                    ></textarea>
                    <div class="char-counter" :class="{ 'text-danger': remainingChars < 50 }">
                      {{ remainingChars }} characters remaining
                    </div>
                  </div>
                  <small class="text-muted">
                    Limit your description to 500 characters. Be clear and concise about your symptoms or concerns.
                  </small>
                </div>

                <button 
                  type="submit" 
                  class="btn btn-primary w-100"
                  :disabled="!isDescriptionValid"
                >
                  Submit Request
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      consultation: {
        topic: '',
        language: '',
        description: ''
      },
      maxLength: 500,
      remainingChars: 500
    }
  },
  computed: {
    isDescriptionValid() {
      const length = this.consultation.description.trim().length;
      return length > 0 && length <= this.maxLength;
    }
  },
  methods: {
    updateCharCount() {
      this.remainingChars = this.maxLength - this.consultation.description.length;
    },
    submitConsultation() {
      if (!this.isDescriptionValid) {
        return;
      }
      // Here you would typically make an API call to submit the consultation request
      console.log('Consultation request:', this.consultation)
      alert('Your consultation request has been submitted successfully!')
      this.consultation = {
        topic: '',
        language: '',
        description: ''
      }
      this.remainingChars = this.maxLength;
    }
  }
}
</script>

<style scoped>
.consultation {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.card {
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-control:focus,
.form-select:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 0.2rem rgba(52, 152, 219, 0.25);
}

.char-counter {
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 0.875rem;
  color: #6c757d;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 8px;
  border-radius: 4px;
}

textarea {
  padding-bottom: 2.5rem !important;
}
</style>

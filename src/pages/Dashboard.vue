<template>
  <div class="dashboard">
    <div class="container py-5">
      <h1 class="text-center mb-5">Welcome to HealthyPathway</h1>
      
      <div class="row g-4">
        <!-- Find a Doctor -->
        <div class="col-md-6 col-lg-3">
          <router-link to="/doctor-rating" class="text-decoration-none">
            <div class="card h-100 feature-card">
              <div class="card-body text-center">
                <i class="bi bi-person-badge fs-1 mb-3"></i>
                <h3 class="card-title">Find a Doctor</h3>
                <p class="card-text">Search for GPs who speak your language and accept new patients</p>
              </div>
            </div>
          </router-link>
        </div>

        <!-- Multilingual Resources -->
        <div class="col-md-6 col-lg-3">
          <router-link to="/health-articles" class="text-decoration-none">
            <div class="card h-100 feature-card">
              <div class="card-body text-center">
                <i class="bi bi-translate fs-1 mb-3"></i>
                <h3 class="card-title">Multilingual Resources</h3>
                <p class="card-text">Access health information in multiple languages</p>
              </div>
            </div>
          </router-link>
        </div>

        <!-- Health Consultation -->
        <div class="col-md-6 col-lg-3">
          <router-link to="/consultation" class="text-decoration-none">
            <div class="card h-100 feature-card">
              <div class="card-body text-center">
                <i class="bi bi-chat-dots fs-1 mb-3"></i>
                <h3 class="card-title">Health Consultation</h3>
                <p class="card-text">Get professional health advice and consultation</p>
              </div>
            </div>
          </router-link>
        </div>

        <!-- Health Map -->
        <div class="col-md-6 col-lg-3">
          <router-link to="/health-map" class="text-decoration-none">
            <div class="card h-100 feature-card">
              <div class="card-body text-center">
                <i class="bi bi-geo-alt fs-1 mb-3"></i>
                <h3 class="card-title">Health Facilities Map</h3>
                <p class="card-text">Find nearby medical facilities with navigation</p>
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Second row -->
      <div class="row g-4 mt-4">
        <!-- Home -->
        <div class="col-md-6 col-lg-3">
          <router-link to="/home" class="text-decoration-none">
            <div class="card h-100 feature-card">
              <div class="card-body text-center">
                <i class="bi bi-house fs-1 mb-3"></i>
                <h3 class="card-title">Home</h3>
                <p class="card-text">Return to homepage and explore more features</p>
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Admin Panel (Only visible for admin users) -->
      <div v-if="userRole === 'admin'" class="mt-5">
        <div class="card admin-card">
          <div class="card-body">
            <h3 class="card-title">
              <i class="bi bi-shield-lock me-2"></i>
              Admin Controls
            </h3>
            <div class="row mt-4">
              <div class="col-md-6">
                <router-link to="/admin/resources" class="btn btn-primary w-100 mb-3">
                  Manage Resources
                </router-link>
              </div>
              <div class="col-md-6">
                <router-link to="/admin/ratings" class="btn btn-primary w-100 mb-3">
                  View Ratings Overview
                </router-link>
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
  data() {
    return {
      userRole: ''
    }
  },
  mounted() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if (userInfo && userInfo.role) {
      this.userRole = userInfo.role
    } else {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.dashboard {
  background-color: #f8f9fa;
  min-height: 100vh;
}

h1 {
  color: #2c3e50;
  font-weight: 600;
}

.feature-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: none;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.card-title {
  color: #2c3e50;
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.card-text {
  color: #6c757d;
}

.admin-card {
  background-color: #f1f5f9;
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.bi {
  color: #3498db;
}

.btn-primary {
  background-color: #3498db;
  border: none;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
}

.btn-primary:hover {
  background-color: #2980b9;
}
</style>

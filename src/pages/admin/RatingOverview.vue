<template>
  <div class="rating-overview">
    <div class="container py-5">
      <h1 class="text-center mb-5">Ratings Overview</h1>
      
      <div class="row g-4">
        <!-- Summary Cards -->
        <div class="col-md-4">
          <div class="card">
            <div class="card-body text-center">
              <h3 class="card-title">Average Rating</h3>
              <p class="display-4 text-primary">4.5</p>
              <p class="text-muted">Across all doctors</p>
            </div>
          </div>
        </div>
        
        <div class="col-md-4">
          <div class="card">
            <div class="card-body text-center">
              <h3 class="card-title">Total Ratings</h3>
              <p class="display-4 text-primary">1,234</p>
              <p class="text-muted">From all users</p>
            </div>
          </div>
        </div>
        
        <div class="col-md-4">
          <div class="card">
            <div class="card-body text-center">
              <h3 class="card-title">Active Doctors</h3>
              <p class="display-4 text-primary">48</p>
              <p class="text-muted">Currently listed</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Ratings Table -->
      <div class="card mt-5">
        <div class="card-body">
          <h3 class="card-title mb-4">Doctor Ratings</h3>
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Specialty</th>
                  <th>Total Ratings</th>
                  <th>Average Rating</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="doctor in doctors" :key="doctor.id">
                  <td>{{ doctor.name }}</td>
                  <td>{{ doctor.specialty }}</td>
                  <td>{{ doctor.totalRatings }}</td>
                  <td>
                    <div class="d-flex align-items-center">
                      {{ doctor.averageRating }}
                      <div class="progress ms-2" style="width: 100px; height: 8px;">
                        <div 
                          class="progress-bar bg-primary" 
                          :style="{ width: (doctor.averageRating / 5 * 100) + '%' }"
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span :class="['badge', doctor.active ? 'bg-success' : 'bg-secondary']">
                      {{ doctor.active ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
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
      doctors: [
        {
          id: 1,
          name: 'Dr. Zhang',
          specialty: 'General Practitioner',
          totalRatings: 128,
          averageRating: 4.5,
          active: true
        },
        {
          id: 2,
          name: 'Dr. Chen',
          specialty: 'Pediatrician',
          totalRatings: 256,
          averageRating: 4.8,
          active: true
        },
        {
          id: 3,
          name: 'Dr. Smith',
          specialty: 'Cardiologist',
          totalRatings: 182,
          averageRating: 4.6,
          active: true
        }
      ]
    }
  }
}
</script>

<style scoped>
.rating-overview {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.card {
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.progress {
  background-color: #e9ecef;
  border-radius: 4px;
}

.table th {
  border-top: none;
}

.display-4 {
  font-size: 2.5rem;
  font-weight: 600;
}
</style>

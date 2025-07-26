<template>
  <div class="admin-dashboard">
    <div class="container py-5">
      <h1 class="text-center mb-5">Admin Dashboard</h1>
      
      <!-- Statistics Cards -->
      <div class="row g-4 mb-5">
        <div class="col-md-4">
          <div class="card stat-card">
            <div class="card-body">
              <h3 class="card-title mb-3">Total Users</h3>
              <div class="d-flex align-items-center">
                <i class="bi bi-people fs-1 me-3 text-primary"></i>
                <div>
                  <h2 class="mb-0">1,234</h2>
                  <small class="text-muted">Active users</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-4">
          <div class="card stat-card">
            <div class="card-body">
              <h3 class="card-title mb-3">Resources</h3>
              <div class="d-flex align-items-center">
                <i class="bi bi-file-text fs-1 me-3 text-success"></i>
                <div>
                  <h2 class="mb-0">56</h2>
                  <small class="text-muted">Published articles</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-4">
          <div class="card stat-card">
            <div class="card-body">
              <h3 class="card-title mb-3">Doctor Ratings</h3>
              <div class="d-flex align-items-center">
                <i class="bi bi-star fs-1 me-3 text-warning"></i>
                <div>
                  <h2 class="mb-0">4.5</h2>
                  <small class="text-muted">Average rating</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="row mb-5">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <h3 class="card-title mb-4">Quick Actions</h3>
              <div class="row g-3">
                <div class="col-md-3">
                  <router-link to="/admin/resources" class="btn btn-primary w-100">
                    <i class="bi bi-file-earmark-plus me-2"></i>
                    Manage Resources
                  </router-link>
                </div>
                <div class="col-md-3">
                  <router-link to="/admin/ratings" class="btn btn-primary w-100">
                    <i class="bi bi-star-half me-2"></i>
                    View Ratings
                  </router-link>
                </div>
                <div class="col-md-3">
                  <router-link to="/admin/users" class="btn btn-primary w-100">
                    <i class="bi bi-people me-2"></i>
                    Manage Users
                  </router-link>
                </div>
                <div class="col-md-3">
                  <router-link to="/admin/settings" class="btn btn-primary w-100">
                    <i class="bi bi-gear me-2"></i>
                    Settings
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="card">
        <div class="card-body">
          <h3 class="card-title mb-4">Recent Activity</h3>
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Action</th>
                  <th>User</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(activity, index) in recentActivities" :key="index">
                  <td>{{ activity.time }}</td>
                  <td>{{ activity.action }}</td>
                  <td>{{ activity.user }}</td>
                  <td>{{ activity.details }}</td>
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
      recentActivities: [
        {
          time: '2 minutes ago',
          action: 'Resource Added',
          user: 'Admin',
          details: 'Added new article: "Mental Health Guide"'
        },
        {
          time: '15 minutes ago',
          action: 'Rating Review',
          user: 'System',
          details: 'New rating for Dr. Zhang'
        },
        {
          time: '1 hour ago',
          action: 'User Registration',
          user: 'System',
          details: 'New user registered'
        }
      ]
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.card {
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.stat-card {
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.card-title {
  color: #2c3e50;
  font-size: 1.1rem;
}

.btn-primary {
  background-color: #3498db;
  border: none;
  padding: 0.75rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}

.table th {
  border-top: none;
  color: #2c3e50;
}

.bi {
  vertical-align: middle;
}
</style>

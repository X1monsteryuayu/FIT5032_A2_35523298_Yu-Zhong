<template>
  <div class="settings">
    <div class="container py-5">
      <h1 class="text-center mb-5">System Settings</h1>

      <div class="row">
        <div class="col-md-3">
          <!-- Settings Navigation -->
          <div class="card mb-4">
            <div class="list-group list-group-flush">
              <button 
                v-for="(section, index) in sections" 
                :key="index"
                class="list-group-item list-group-item-action"
                :class="{ active: currentSection === section.id }"
                @click="currentSection = section.id"
              >
                <i :class="section.icon"></i>
                {{ section.name }}
              </button>
            </div>
          </div>
        </div>

        <div class="col-md-9">
          <!-- General Settings -->
          <div v-if="currentSection === 'general'" class="card">
            <div class="card-body">
              <h3 class="card-title mb-4">General Settings</h3>
              <form @submit.prevent="saveGeneralSettings">
                <div class="mb-3">
                  <label class="form-label">Site Name</label>
                  <input type="text" v-model="settings.general.siteName" class="form-control" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Site Description</label>
                  <textarea v-model="settings.general.description" class="form-control" rows="3"></textarea>
                </div>
                <div class="mb-3">
                  <label class="form-label">Maintenance Mode</label>
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" v-model="settings.general.maintenanceMode" />
                    <label class="form-check-label">Enable maintenance mode</label>
                  </div>
                </div>
                <button type="submit" class="btn btn-primary">Save Changes</button>
              </form>
            </div>
          </div>

          <!-- Security Settings -->
          <div v-if="currentSection === 'security'" class="card">
            <div class="card-body">
              <h3 class="card-title mb-4">Security Settings</h3>
              <form @submit.prevent="saveSecuritySettings">
                <div class="mb-3">
                  <label class="form-label">Password Policy</label>
                  <div class="form-check mb-2">
                    <input class="form-check-input" type="checkbox" v-model="settings.security.requireUppercase" />
                    <label class="form-check-label">Require uppercase letters</label>
                  </div>
                  <div class="form-check mb-2">
                    <input class="form-check-input" type="checkbox" v-model="settings.security.requireNumbers" />
                    <label class="form-check-label">Require numbers</label>
                  </div>
                  <div class="form-check mb-2">
                    <input class="form-check-input" type="checkbox" v-model="settings.security.requireSpecialChars" />
                    <label class="form-check-label">Require special characters</label>
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Minimum Password Length</label>
                  <input type="number" v-model="settings.security.minPasswordLength" class="form-control" min="6" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Session Timeout (minutes)</label>
                  <input type="number" v-model="settings.security.sessionTimeout" class="form-control" min="5" />
                </div>
                <button type="submit" class="btn btn-primary">Save Changes</button>
              </form>
            </div>
          </div>

          <!-- Email Settings -->
          <div v-if="currentSection === 'email'" class="card">
            <div class="card-body">
              <h3 class="card-title mb-4">Email Settings</h3>
              <form @submit.prevent="saveEmailSettings">
                <div class="mb-3">
                  <label class="form-label">SMTP Host</label>
                  <input type="text" v-model="settings.email.smtpHost" class="form-control" />
                </div>
                <div class="mb-3">
                  <label class="form-label">SMTP Port</label>
                  <input type="number" v-model="settings.email.smtpPort" class="form-control" />
                </div>
                <div class="mb-3">
                  <label class="form-label">SMTP Username</label>
                  <input type="text" v-model="settings.email.smtpUsername" class="form-control" />
                </div>
                <div class="mb-3">
                  <label class="form-label">SMTP Password</label>
                  <input type="password" v-model="settings.email.smtpPassword" class="form-control" />
                </div>
                <div class="mb-3">
                  <label class="form-label">From Email</label>
                  <input type="email" v-model="settings.email.fromEmail" class="form-control" />
                </div>
                <button type="submit" class="btn btn-primary">Save Changes</button>
              </form>
            </div>
          </div>

          <!-- Backup Settings -->
          <div v-if="currentSection === 'backup'" class="card">
            <div class="card-body">
              <h3 class="card-title mb-4">Backup Settings</h3>
              <form @submit.prevent="saveBackupSettings">
                <div class="mb-3">
                  <label class="form-label">Auto Backup</label>
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" v-model="settings.backup.autoBackup" />
                    <label class="form-check-label">Enable automatic backups</label>
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Backup Frequency</label>
                  <select v-model="settings.backup.frequency" class="form-select">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">Retention Period (days)</label>
                  <input type="number" v-model="settings.backup.retention" class="form-control" min="1" />
                </div>
                <button type="submit" class="btn btn-primary">Save Changes</button>
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
      currentSection: 'general',
      sections: [
        { id: 'general', name: 'General', icon: 'bi bi-gear me-2' },
        { id: 'security', name: 'Security', icon: 'bi bi-shield-lock me-2' },
        { id: 'email', name: 'Email', icon: 'bi bi-envelope me-2' },
        { id: 'backup', name: 'Backup', icon: 'bi bi-cloud-upload me-2' }
      ],
      settings: {
        general: {
          siteName: 'HealthyPathway',
          description: 'A platform for connecting migrants with healthcare resources',
          maintenanceMode: false
        },
        security: {
          requireUppercase: true,
          requireNumbers: true,
          requireSpecialChars: true,
          minPasswordLength: 8,
          sessionTimeout: 30
        },
        email: {
          smtpHost: 'smtp.example.com',
          smtpPort: 587,
          smtpUsername: '',
          smtpPassword: '',
          fromEmail: 'noreply@healthypathway.com'
        },
        backup: {
          autoBackup: true,
          frequency: 'daily',
          retention: 30
        }
      }
    }
  },
  methods: {
    saveGeneralSettings() {
      // 在实际应用中，这里应该调用API来保存设置
      alert('General settings saved successfully!');
    },
    saveSecuritySettings() {
      // 在实际应用中，这里应该调用API来保存设置
      alert('Security settings saved successfully!');
    },
    saveEmailSettings() {
      // 在实际应用中，这里应该调用API来保存设置
      alert('Email settings saved successfully!');
    },
    saveBackupSettings() {
      // 在实际应用中，这里应该调用API来保存设置
      alert('Backup settings saved successfully!');
    }
  }
}
</script>

<style scoped>
.settings {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.card {
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.list-group-item {
  border: none;
  padding: 1rem 1.25rem;
}

.list-group-item.active {
  background-color: #3498db;
  border-color: #3498db;
}

.list-group-item:hover:not(.active) {
  background-color: #f8f9fa;
}

.form-label {
  font-weight: 500;
  color: #2c3e50;
}

.btn-primary {
  background-color: #3498db;
  border: none;
}

.btn-primary:hover {
  background-color: #2980b9;
}
</style>

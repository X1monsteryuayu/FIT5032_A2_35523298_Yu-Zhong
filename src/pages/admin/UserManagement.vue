<template>
  <div class="user-management">
    <div class="container py-5">
      <h1 class="text-center mb-5">User Management</h1>
      
      <!-- Statistics Cards -->
      <div class="row g-4 mb-5">
        <div class="col-md-4">
          <div class="card    updateUserRole(user) {
      if (user.role === 'admin' && user.id === this.currentUser?.email) {
        alert('不能更改自己的管理员角色！');
        // 恢复原始角色
        user.role = 'admin';
        return;
      }

      if (updateUserRole(user.email, user.role)) {
        alert('用户角色更新成功！');
        this.loadUsers(); // 重新加载用户列表
      } else {
        alert('更新用户角色失败');
      }
    },
    toggleUserStatus(user) {
      if (user.role === 'admin') {
        alert('不能禁用管理员账户！');
        return;
      }

      const newStatus = !user.active;
      if (updateUserStatus(user.email, newStatus)) {
        user.active = newStatus;
        alert(newStatus ? '用户已启用' : '用户已禁用');
      } else {
        alert('更新用户状态失败');
      }
    },
    async deleteUser(id) {
      const user = this.users.find(u => u.id === id);
      if (!user) return;

      if (user.role === 'admin') {
        alert('不能删除管理员账户！');
        return;
      }

      if (confirm('确定要删除此用户吗？')) {
        if (deleteUser(user.email)) {
          this.users = this.users.filter(u => u.id !== id);
          alert('用户删除成功！');
          this.loadUsers(); // 重新加载用户列表
        } else {
          alert('删除用户失败');
        }
      }
    }ard">
            <div class="card-body">
              <h3 class="card-title">Total Users</h3>
              <div class="d-flex align-items-center">
                <i class="bi bi-people fs-1 me-3 text-primary"></i>
                <div>
                  <h2 class="mb-0">{{ statistics.total }}</h2>
                  <small class="text-muted">注册用户总数</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-4">
          <div class="card stat-card">
            <div class="card-body">
              <h3 class="card-title">Active Users</h3>
              <div class="d-flex align-items-center">
                <i class="bi bi-person-check fs-1 me-3 text-success"></i>
                <div>
                  <h2 class="mb-0">{{ statistics.active }}</h2>
                  <small class="text-muted">当前活跃用户</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-4">
          <div class="card stat-card">
            <div class="card-body">
              <h3 class="card-title">New Users</h3>
              <div class="d-flex align-items-center">
                <i class="bi bi-person-plus fs-1 me-3 text-info"></i>
                <div>
                  <h2 class="mb-0">{{ statistics.new }}</h2>
                  <small class="text-muted">本月新增</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- User List -->
      <div class="card">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="card-title mb-0">User List</h3>
            <div class="search-box">
              <input 
                type="text" 
                class="form-control" 
                v-model="searchQuery"
                placeholder="Search users..."
              />
            </div>
          </div>

          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in filteredUsers" :key="user.id">
                  <td>{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                  <td>
                    <select 
                      v-model="user.role" 
                      class="form-select form-select-sm" 
                      @change="updateUserRole(user)"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <span 
                      :class="['badge', user.active ? 'bg-success' : 'bg-secondary']"
                      style="cursor: pointer"
                      @click="toggleUserStatus(user)"
                    >
                      {{ user.active ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td>{{ user.joinedDate }}</td>
                  <td>
                    <button class="btn btn-sm btn-outline-primary me-2" @click="viewUserDetails(user)">
                      <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" @click="deleteUser(user.id)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- User Details Modal -->
    <div class="modal fade" :class="{ 'show d-block': showModal }" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">User Details</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body" v-if="selectedUser">
            <div class="row">
              <div class="col-md-6">
                <h6>Basic Information</h6>
                <table class="table">
                  <tr>
                    <th>Name:</th>
                    <td>{{ selectedUser.name }}</td>
                  </tr>
                  <tr>
                    <th>Email:</th>
                    <td>{{ selectedUser.email }}</td>
                  </tr>
                  <tr>
                    <th>Role:</th>
                    <td>{{ selectedUser.role }}</td>
                  </tr>
                  <tr>
                    <th>Status:</th>
                    <td>{{ selectedUser.active ? 'Active' : 'Inactive' }}</td>
                  </tr>
                  <tr>
                    <th>Joined:</th>
                    <td>{{ selectedUser.joinedDate }}</td>
                  </tr>
                </table>
              </div>
              <div class="col-md-6">
                <h6>Activity Summary</h6>
                <table class="table">
                  <tr>
                    <th>Last Login:</th>
                    <td>{{ selectedUser.lastLogin }}</td>
                  </tr>
                  <tr>
                    <th>Total Ratings:</th>
                    <td>{{ selectedUser.totalRatings }}</td>
                  </tr>
                  <tr>
                    <th>Comments:</th>
                    <td>{{ selectedUser.totalComments }}</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" v-if="showModal"></div>
  </div>
</template>

<script>
import { getAllUsers, updateUserStatus, updateUserRole, deleteUser } from '../../utils/userManager';

export default {
  created() {
    this.loadUsers();
  },
  data() {
    return {
      searchQuery: '',
      showModal: false,
      selectedUser: null,
      users: [],
      statistics: {
        total: 0,
        active: 0,
        new: 0
      }
    }
  },
  computed: {
    filteredUsers() {
      const query = this.searchQuery.toLowerCase();
      return this.users.filter(user => 
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
      );
    }
  },
  methods: {
    loadUsers() {
      this.users = getAllUsers();
      // 更新统计数据
      this.updateStatistics();
    },
    updateStatistics() {
      const total = this.users.length;
      const active = this.users.filter(u => u.active).length;
      const newThisMonth = this.users.filter(u => {
        const joinDate = new Date(u.joinedDate);
        const now = new Date();
        return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
      }).length;

      this.statistics = {
        total,
        active,
        new: newThisMonth
      };
    },
    updateUserRole(user) {
      // 更新用户角色
      try {
        const userData = JSON.parse(localStorage.getItem(user.email));
        if (userData) {
          userData.role = user.role;
          localStorage.setItem(user.email, JSON.stringify(userData));
          alert('用户角色更新成功！');
        }
      } catch (e) {
        console.error('Error updating user role:', e);
        alert('更新用户角色失败');
      }
    },
    toggleUserStatus(user) {
      if (user.role === 'admin') {
        alert('不能禁用管理员账户！');
        return;
      }
      
      user.active = !user.active;
      try {
        const userData = JSON.parse(localStorage.getItem(user.email));
        if (userData) {
          userData.active = user.active;
          localStorage.setItem(user.email, JSON.stringify(userData));
          alert(user.active ? '用户已启用' : '用户已禁用');
        }
      } catch (e) {
        console.error('Error updating user status:', e);
        alert('更新用户状态失败');
      }
    },
    viewUserDetails(user) {
      this.selectedUser = { ...user };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedUser = null;
    },
    deleteUser(id) {
      if (confirm('Are you sure you want to delete this user?')) {
        // 在实际应用中，这里应该调用API来删除用户
        this.users = this.users.filter(user => user.id !== id);
        alert('User deleted successfully!');
      }
    }
  }
}
</script>

<style scoped>
.user-management {
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

.search-box {
  max-width: 300px;
}

.form-select-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  border-radius: 0.2rem;
}

.modal {
  background-color: rgba(0, 0, 0, 0.5);
}

.table th {
  font-weight: 600;
  color: #2c3e50;
}
</style>

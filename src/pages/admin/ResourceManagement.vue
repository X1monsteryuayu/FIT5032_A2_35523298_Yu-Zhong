<template>
  <div class="resource-management">
    <div class="container py-5">
      <h1 class="text-center mb-5">Resource Management</h1>
      
      <div class="row justify-content-end mb-4">
        <div class="col-auto">
          <button class="btn btn-primary" @click="openAddModal">
            <i class="bi bi-plus-lg me-2"></i>Add New Resource
          </button>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Language</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="resource in resources" :key="resource.id">
                  <td>{{ resource.title }}</td>
                  <td>{{ resource.language }}</td>
                  <td>{{ resource.category }}</td>
                  <td>
                    <span 
                      :class="['badge', resource.active ? 'bg-success' : 'bg-secondary']"
                      style="cursor: pointer"
                      @click="toggleStatus(resource)"
                    >
                      {{ resource.active ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-outline-primary me-2" @click="openEditModal(resource)">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" @click="deleteResource(resource.id)">
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

    <!-- Resource Modal (Add/Edit) -->
    <div class="modal fade" :class="{ 'show d-block': showModal }" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? 'Edit Resource' : 'Add New Resource' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveResource">
              <div class="mb-3">
                <label class="form-label">Title</label>
                <input 
                  type="text" 
                  v-model="currentResource.title" 
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Language</label>
                <select v-model="currentResource.language" class="form-select" required>
                  <option value="">Select Language</option>
                  <option value="English">English</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Spanish">Spanish</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Category</label>
                <select v-model="currentResource.category" class="form-select" required>
                  <option value="">Select Category</option>
                  <option value="Mental Health">Mental Health</option>
                  <option value="Physical Health">Physical Health</option>
                  <option value="Nutrition">Nutrition</option>
                  <option value="Exercise">Exercise</option>
                  <option value="Family Health">Family Health</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Content</label>
                <textarea 
                  v-model="currentResource.content" 
                  class="form-control"
                  rows="5"
                  required
                ></textarea>
              </div>
              <div class="form-check mb-3">
                <input 
                  type="checkbox" 
                  v-model="currentResource.active" 
                  class="form-check-input" 
                  id="activeStatus"
                />
                <label class="form-check-label" for="activeStatus">Active</label>
              </div>
              <div class="text-end">
                <button type="button" class="btn btn-secondary me-2" @click="closeModal">Cancel</button>
                <button type="submit" class="btn btn-primary">{{ isEditing ? 'Update' : 'Create' }}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" v-if="showModal"></div>
  </div>
</template>

<script>
export default {
  created() {
    // 从 localStorage 加载资源
    const savedResources = localStorage.getItem('healthyPathwayResources');
    if (savedResources) {
      this.resources = JSON.parse(savedResources);
    } else {
      // 初始化默认资源
      this.resources = [
        {
          id: 1,
          title: "Mental Health Guide",
          language: "English",
          category: "Mental Health",
          content: "A comprehensive guide to maintaining mental health...",
          active: true
        },
        {
          id: 2,
          title: "心理健康指南",
          language: "Chinese",
          category: "Mental Health",
          content: "保持心理健康的综合指南...",
          active: true
        }
      ];
      // 保存到 localStorage
      this.saveToLocalStorage();
    }
  },
  data() {
    return {
      showModal: false,
      isEditing: false,
      resources: [],
      currentResource: {
        id: null,
        title: '',
        language: '',
        category: '',
        content: '',
        active: true
      },
      defaultResource: {
        id: null,
        title: '',
        language: '',
        category: '',
        content: '',
        active: true
      }
    }
  },
  methods: {
    openAddModal() {
      this.isEditing = false;
      this.currentResource = { ...this.defaultResource };
      this.showModal = true;
    },
    openEditModal(resource) {
      this.isEditing = true;
      this.currentResource = { ...resource };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.currentResource = { ...this.defaultResource };
    },
    toggleStatus(resource) {
      resource.active = !resource.active;
      // 在实际应用中，这里应该调用API来更新状态
    },
    saveToLocalStorage() {
      localStorage.setItem('healthyPathwayResources', JSON.stringify(this.resources));
    },
    saveResource() {
      if (this.isEditing) {
        // 更新现有资源
        const index = this.resources.findIndex(r => r.id === this.currentResource.id);
        if (index !== -1) {
          this.resources[index] = { ...this.currentResource };
        }
      } else {
        // 添加新资源
        const newResource = {
          ...this.currentResource,
          id: Date.now() // 使用时间戳作为临时ID
        };
        this.resources.push(newResource);
      }
      // 保存到 localStorage
      this.saveToLocalStorage();
      this.closeModal();
      // 显示成功消息
      alert(this.isEditing ? 'Resource updated successfully!' : 'Resource created successfully!');
    },
    toggleStatus(resource) {
      resource.active = !resource.active;
      // 保存到 localStorage
      this.saveToLocalStorage();
    },
    async deleteResource(id) {
      if (confirm('Are you sure you want to delete this resource?')) {
        this.resources = this.resources.filter(r => r.id !== id);
        // 保存到 localStorage
        this.saveToLocalStorage();
        alert('Resource deleted successfully!');
      }
    }
  }
}
</script>

<style scoped>
.resource-management {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.card {
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.table th {
  border-top: none;
}
</style>

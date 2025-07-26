<template>
  <div class="resources">
    <div class="container py-5">
      <h1 class="text-center mb-5">Multilingual Health Resources</h1>
      
      <!-- Filters -->
      <div class="row mb-4">
        <div class="col-md-4">
          <select v-model="selectedLanguage" class="form-select">
            <option value="">All Languages</option>
            <option v-for="lang in availableLanguages" :key="lang" :value="lang">
              {{ lang }}
            </option>
          </select>
        </div>
        <div class="col-md-4">
          <select v-model="selectedCategory" class="form-select">
            <option value="">All Categories</option>
            <option v-for="category in availableCategories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
        <div class="col-md-4">
          <input 
            type="text" 
            v-model="searchQuery" 
            class="form-control" 
            placeholder="Search resources..."
          />
        </div>
      </div>

      <!-- Resources Grid -->
      <div class="row g-4">
        <div class="col-md-6 col-lg-4" v-for="resource in filteredResources" :key="resource.id">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">{{ resource.title }}</h5>
              <p class="card-text">{{ resource.content }}</p>
              <div class="mt-3">
                <span class="badge bg-primary me-2">{{ resource.language }}</span>
                <span class="badge bg-secondary">{{ resource.category }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Results Message -->
      <div v-if="filteredResources.length === 0" class="text-center mt-5">
        <p>No resources found matching your criteria.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      resources: [],
      selectedLanguage: '',
      selectedCategory: '',
      searchQuery: ''
    }
  },
  computed: {
    availableLanguages() {
      return [...new Set(this.resources.map(r => r.language))];
    },
    availableCategories() {
      return [...new Set(this.resources.map(r => r.category))];
    },
    filteredResources() {
      return this.resources.filter(resource => {
        if (!resource.active) return false;
        
        const matchLanguage = !this.selectedLanguage || resource.language === this.selectedLanguage;
        const matchCategory = !this.selectedCategory || resource.category === this.selectedCategory;
        const matchSearch = !this.searchQuery || 
          resource.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          resource.content.toLowerCase().includes(this.searchQuery.toLowerCase());
        
        return matchLanguage && matchCategory && matchSearch;
      });
    }
  },
  created() {
    // 从 localStorage 加载资源
    const savedResources = localStorage.getItem('healthyPathwayResources');
    if (savedResources) {
      this.resources = JSON.parse(savedResources);
    }
  }
}
</script>

<style scoped>
.resources {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.card {
  transition: transform 0.3s ease;
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card:hover {
  transform: translateY(-5px);
}
</style>

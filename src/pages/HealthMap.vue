<template>
  <div class="health-map">
    <!-- Header Section -->
    <div class="map-header">
      <div class="container-fluid">
        <div class="row align-items-center py-4">
          <div class="col">
            <h2 class="mb-1">
              <i class="fas fa-map-marked-alt me-3 text-primary"></i>
              Health Facilities Locator
            </h2>
            <p class="text-muted mb-0 fs-6">Find nearby medical facilities and get directions</p>
          </div>
          <div class="col-auto">
            <div class="btn-group">
              <button @click="getCurrentLocation" class="btn btn-primary btn-lg shadow-sm" title="获取当前位置">
                <i class="fas fa-location-arrow me-2"></i>Use My Location
              </button>
              <button @click="searchNearbyFacilities" class="btn btn-success btn-lg shadow-sm" title="搜索附近设施" :disabled="loading">
                <i class="fas fa-search me-2" v-if="!loading"></i>
                <span class="spinner-border spinner-border-sm me-2" v-else role="status"></span>
                Quick Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container-fluid h-100">
      <div class="row h-100 g-4">
        <!-- Mobile Toggle Button -->
        <button 
          v-if="isMobile" 
          @click="toggleSidebar" 
          class="mobile-sidebar-toggle btn btn-primary position-fixed"
          :class="{ 'active': sidebarOpen }"
          aria-label="切换侧边栏菜单"
          :aria-expanded="sidebarOpen"
          aria-controls="sidebar-content"
        >
          <i class="fas fa-bars" v-if="!sidebarOpen" aria-hidden="true"></i>
          <i class="fas fa-times" v-if="sidebarOpen" aria-hidden="true"></i>
        </button>
        
        <!-- Enhanced Sidebar -->
        <div class="col-lg-4 col-md-5 sidebar" :class="{ 'open': sidebarOpen }" role="complementary" aria-label="搜索和结果面板" id="sidebar-content">
          <!-- 移动端遮罩层 -->
          <div v-if="isMobile && sidebarOpen" class="sidebar-overlay" @click="toggleSidebar" aria-hidden="true"></div>
          
          <div class="sidebar-content p-4">
            
            <!-- Search Section -->
            <div class="search-card mb-4" role="search" aria-labelledby="search-heading">
              <div class="card-header">
                <h2 id="search-heading" class="mb-0 fw-bold">
                  <i class="fas fa-search me-2" aria-hidden="true"></i>搜索医疗设施
                </h2>
              </div>
              <div class="card-body p-4">
                <div class="mb-4">
                  <label for="location-input" class="form-label fw-semibold mb-2">位置</label>
                  <div class="input-group input-group-lg">
                    <span class="input-group-text bg-light border-end-0" aria-hidden="true">
                      <i class="fas fa-map-marker-alt text-primary"></i>
                    </span>
                    <input 
                      id="location-input"
                      v-model="searchQuery" 
                      type="text" 
                      class="form-control border-start-0 ps-2" 
                      placeholder="输入地址或地标"
                      @keyup.enter="searchLocation"
                      aria-describedby="location-help"
                    >
                  </div>
                  <small id="location-help" class="form-text text-muted">
                    输入您要搜索的地址、城市或地标名称
                  </small>
                </div>
                
                <div class="mb-4">
                  <label for="facility-type" class="form-label fw-semibold mb-2">设施类型</label>
                  <select id="facility-type" v-model="facilityType" class="form-select form-select-lg" aria-describedby="facility-help">
                    <option value="">所有设施</option>
                    <option value="hospital">🏥 医院</option>
                    <option value="clinic">🩺 诊所</option>
                    <option value="pharmacy">💊 药店</option>
                    <option value="emergency">🚑 急救服务</option>
                  </select>
                  <small id="facility-help" class="form-text text-muted">
                    选择您要查找的医疗设施类型
                  </small>
                </div>
                
                <div class="mb-4">
                  <label for="search-radius" class="form-label fw-semibold mb-3">
                    搜索半径: <span class="text-primary fw-bold fs-5">{{ searchRadius }}公里</span>
                  </label>
                  <input 
                    id="search-radius"
                    v-model="searchRadius" 
                    type="range" 
                    class="form-range" 
                    min="1" 
                    max="50" 
                    step="1"
                    aria-describedby="radius-help"
                  >
                  <div class="d-flex justify-content-between small text-muted mt-2">
                    <span>1公里</span>
                    <span>50公里</span>
                  </div>
                  <small id="radius-help" class="form-text text-muted">
                    调整搜索范围，数值越大搜索范围越广
                  </small>
                </div>
                
                <button 
                  @click="searchLocation" 
                  class="btn btn-primary btn-lg w-100 shadow-sm mb-3"
                  :disabled="loading"
                  :aria-busy="loading"
                  aria-describedby="search-status"
                >
                  <i class="fas fa-search me-2" aria-hidden="true"></i>搜索真实设施
                </button>
                
                <button 
                  @click="searchNearbyFacilities" 
                  class="btn btn-outline-success btn-lg w-100 shadow-sm" 
                  :disabled="loading"
                  :aria-busy="loading"
                >
                  <i class="fas fa-map-marked-alt me-2" aria-hidden="true"></i>
                  <span v-if="!loading">查找附近设施</span>
                  <span v-else>
                    <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    搜索中...
                  </span>
                </button>
                <div id="search-status" class="visually-hidden" aria-live="polite">
                  {{ loading ? '正在搜索医疗设施，请稍候' : '' }}
                </div>
                
                <div class="mt-3 p-3 bg-info bg-opacity-10 rounded">
                  <div class="d-flex align-items-center">
                    <i class="fas fa-info-circle text-info me-2"></i>
                    <small class="text-muted">
                      <strong>Real functionality:</strong> Uses live data from OpenStreetMap and real routing services
                    </small>
                  </div>
                </div>
              </div>
            </div>

            <!-- Results Section -->
            <div class="results-card mb-4" v-if="searchResults.length > 0">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0 fw-bold">
                  <i class="fas fa-list me-2"></i>Found {{ searchResults.length }} facilities
                </h5>
                <span class="badge bg-success fs-6 px-3 py-2">{{ searchResults.length }}</span>
              </div>
              <div class="card-body p-0">
                <div class="results-list">
                  <div 
                    v-for="facility in searchResults" 
                    :key="facility.id"
                    class="facility-item p-4"
                    :class="{ 'selected': selectedFacility?.id === facility.id }"
                    :data-real="facility.isReal"
                    @click="selectFacility(facility)"
                  >
                    <div class="facility-icon me-3">
                      <i :class="getFacilityIcon(facility.type)" 
                         :style="{ color: getFacilityColor(facility.type), fontSize: '1.5rem' }"></i>
                    </div>
                    
                    <div class="facility-info flex-grow-1">
                      <h6 class="facility-name mb-2 fw-bold">{{ facility.name }}</h6>
                      <p class="facility-address mb-3 text-muted">{{ facility.address }}</p>
                      
                      <div class="facility-meta mb-3">
                        <span class="badge me-3 px-3 py-2" :style="{ backgroundColor: getFacilityColor(facility.type) }">
                          {{ facility.type }}
                        </span>
                        <span class="text-muted">
                          <i class="fas fa-route me-1"></i>{{ facility.distance }}km away
                        </span>
                      </div>
                      
                      <div class="facility-details">
                        <div class="d-flex justify-content-between align-items-center">
                          <span class="text-success">
                            <i class="fas fa-star me-1"></i> {{ facility.rating }}/5
                          </span>
                          <span class="text-muted small">
                            <i class="fas fa-clock me-1"></i> {{ facility.hours }}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div class="facility-action ms-3">
                      <i class="fas fa-chevron-right text-muted"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Navigation Section -->
            <div class="navigation-card mb-4" v-if="selectedFacility">
              <div class="card-header">
                <h5 class="mb-0 fw-bold">
                  <i class="fas fa-navigation me-2"></i>Navigation
                </h5>
              </div>
              <div class="card-body p-4">
                <div class="selected-facility mb-4 p-3 bg-light rounded">
                  <div class="d-flex align-items-center">
                    <div class="facility-icon-small me-3 p-2 rounded-circle bg-white">
                      <i :class="getFacilityIcon(selectedFacility.type)" 
                         :style="{ color: getFacilityColor(selectedFacility.type), fontSize: '1.2rem' }"></i>
                    </div>
                    <div>
                      <h6 class="mb-1 fw-bold">{{ selectedFacility.name }}</h6>
                      <p class="text-muted small mb-0">{{ selectedFacility.address }}</p>
                    </div>
                  </div>
                </div>
                
                <div class="mb-4">
                  <label class="form-label fw-semibold mb-3">Transportation Mode</label>
                  <div class="travel-modes d-flex gap-2">
                    <label v-for="mode in travelModes" :key="mode.value" 
                           class="travel-mode-option flex-fill text-center p-3 rounded"
                           :class="{ active: travelMode === mode.value }">
                      <input type="radio" v-model="travelMode" :value="mode.value" class="d-none">
                      <div class="mode-icon fs-4 mb-2">{{ mode.icon }}</div>
                      <div class="mode-label small fw-semibold">{{ mode.label }}</div>
                    </label>
                  </div>
                </div>
                
                <div class="d-grid gap-3">
                  <button @click="getDirections" class="btn btn-success btn-lg shadow-sm">
                    <i class="fas fa-route me-2"></i>Get Real Directions
                  </button>
                  <button @click="startNavigation" class="btn btn-info btn-lg shadow-sm">
                    <i class="fas fa-external-link-alt me-2"></i>Open in Navigation App
                  </button>
                  <button @click="shareFacilityLocation" class="btn btn-secondary btn-lg shadow-sm">
                    <i class="fas fa-share-alt me-2"></i>Share Location
                  </button>
                </div>
                <!-- Route Information -->
                <div v-if="routeInfo" class="route-info mt-4 p-3 rounded"
                     :class="routeInfo.isEstimated ? 'bg-warning bg-opacity-10' : 'bg-primary bg-opacity-10'">
                  <div class="route-header mb-3 text-center">
                    <div v-if="routeInfo.isEstimated" class="text-warning">
                      <i class="fas fa-exclamation-triangle me-2"></i>
                      <strong>Estimated Route</strong>
                    </div>
                    <div v-else class="text-success">
                      <i class="fas fa-check-circle me-2"></i>
                      <strong>Real-time Route</strong>
                    </div>
                  </div>
                  
                  <div class="route-summary">
                    <div class="row text-center g-3">
                      <div class="col-4">
                        <div class="route-stat">
                          <i class="fas fa-route text-primary fs-4 mb-2"></i>
                          <div class="stat-value fw-bold">{{ routeInfo.distance }}</div>
                          <div class="stat-label small text-muted">Distance</div>
                        </div>
                      </div>
                      <div class="col-4">
                        <div class="route-stat">
                          <i class="fas fa-clock text-success fs-4 mb-2"></i>
                          <div class="stat-value fw-bold">{{ routeInfo.duration }}</div>
                          <div class="stat-label small text-muted">Duration</div>
                        </div>
                      </div>
                      <div class="col-4">
                        <div class="route-stat">
                          <i class="fas fa-map text-info fs-4 mb-2"></i>
                          <div class="stat-value fw-bold">{{ routeInfo.mode }}</div>
                          <div class="stat-label small text-muted">Mode</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- 转向指示 -->
                  <div v-if="routeInfo.steps && routeInfo.steps.length > 0" class="route-steps mt-3">
                    <h6 class="fw-bold mb-2">
                      <i class="fas fa-list-ol me-2"></i>Turn-by-turn Directions
                    </h6>
                    <div class="steps-container" style="max-height: 200px; overflow-y: auto;">
                      <div v-for="(step, index) in routeInfo.steps" :key="index" 
                           class="step-item p-2 mb-2 bg-white bg-opacity-50 rounded">
                        <span class="step-number badge bg-primary me-2">{{ index + 1 }}</span>
                        <span class="step-text">{{ step }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Quick Stats -->
            <div class="stats-card" v-if="searchResults.length > 0">
              <div class="card-body p-4">
                <h6 class="card-title fw-bold mb-3">
                  <i class="fas fa-chart-bar me-2 text-primary"></i>Quick Stats
                </h6>
                <div class="stats-grid">
                  <div class="stat-item text-center p-3 bg-light rounded">
                    <span class="stat-number text-danger fw-bold fs-4 d-block">{{ hospitalCount }}</span>
                    <span class="stat-label small text-muted">Hospitals</span>
                  </div>
                  <div class="stat-item text-center p-3 bg-light rounded">
                    <span class="stat-number text-success fw-bold fs-4 d-block">{{ clinicCount }}</span>
                    <span class="stat-label small text-muted">Clinics</span>
                  </div>
                  <div class="stat-item text-center p-3 bg-light rounded">
                    <span class="stat-number text-primary fw-bold fs-4 d-block">{{ pharmacyCount }}</span>
                    <span class="stat-label small text-muted">Pharmacies</span>
                  </div>
                  <div class="stat-item text-center p-3 bg-light rounded">
                    <span class="stat-number text-warning fw-bold fs-4 d-block">{{ emergencyCount }}</span>
                    <span class="stat-label small text-muted">Emergency</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced Map Container -->
        <div class="col-lg-8 col-md-7 map-container">
          <div class="map-wrapper p-4">
            <div id="map" class="enhanced-map" style="height: 600px; width: 100%;"></div>
            
            <!-- Map Controls -->
            <div class="map-controls">
              <div class="control-group">
                <button @click="zoomIn" class="btn btn-light btn-lg shadow-sm me-2" title="Zoom In">
                  <i class="fas fa-plus"></i>
                </button>
                <button @click="zoomOut" class="btn btn-light btn-lg shadow-sm me-2" title="Zoom Out">
                  <i class="fas fa-minus"></i>
                </button>
                <button @click="resetView" class="btn btn-light btn-lg shadow-sm" title="Reset View">
                  <i class="fas fa-home"></i>
                </button>
              </div>
            </div>

            <!-- Map Legend -->
            <div class="map-legend">
              <h6 class="fw-bold mb-3">
                <i class="fas fa-info-circle me-2"></i>Legend
              </h6>
              <div class="legend-items">
                <div class="legend-item mb-2 p-2 rounded bg-white bg-opacity-75">
                  <i class="fas fa-hospital me-2" style="color: #dc3545; font-size: 1.1rem;"></i>
                  <span class="fw-semibold">Hospitals</span>
                </div>
                <div class="legend-item mb-2 p-2 rounded bg-white bg-opacity-75">
                  <i class="fas fa-clinic-medical me-2" style="color: #28a745; font-size: 1.1rem;"></i>
                  <span class="fw-semibold">Clinics</span>
                </div>
                <div class="legend-item mb-2 p-2 rounded bg-white bg-opacity-75">
                  <i class="fas fa-pills me-2" style="color: #007bff; font-size: 1.1rem;"></i>
                  <span class="fw-semibold">Pharmacies</span>
                </div>
                <div class="legend-item mb-2 p-2 rounded bg-white bg-opacity-75">
                  <i class="fas fa-ambulance me-2" style="color: #ffc107; font-size: 1.1rem;"></i>
                  <span class="fw-semibold">Emergency</span>
                </div>
              </div>
            </div>

            <!-- Loading Overlay -->
            <div v-if="loading" class="loading-overlay">
              <div class="loading-content">
                <div class="spinner-border text-primary mb-3" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <h5>{{ loadingMessage }}</h5>
                <p class="text-muted">Please wait while we process your request...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

export default {
  name: 'HealthMap',
  data() {
    return {
      map: null,
      userLocation: null,
      searchQuery: '',
      facilityType: '',
      searchRadius: 10,
      selectedFacility: null,
      travelMode: 'driving',
      loading: false,
      loadingMessage: '',
      routeInfo: null,
      sidebarOpen: false, // 控制移动端侧边栏显示
      isMobile: false, // 检测是否为移动设备
      
      // Travel mode options
      travelModes: [
        { value: 'driving', icon: '🚗', label: 'Drive' },
        { value: 'walking', icon: '🚶', label: 'Walk' },
        { value: 'transit', icon: '🚌', label: 'Transit' },
        { value: 'bicycling', icon: '🚲', label: 'Bike' }
      ],
      
      // Sample medical facilities data - Enhanced
      searchResults: [],
      allFacilities: [
        {
          id: 1,
          name: 'Melbourne Medical Centre',
          type: 'hospital',
          address: '123 Collins Street, Melbourne VIC 3000',
          lat: -37.8136,
          lng: 144.9631,
          rating: 4.2,
          hours: 'Open 24/7',
          phone: '(03) 9123 4567',
          services: ['Emergency', 'Surgery', 'Maternity', 'ICU'],
          specialties: ['Cardiology', 'Neurology', 'Orthopedics']
        },
        {
          id: 2,
          name: 'City Medical Clinic',
          type: 'clinic',
          address: '456 Bourke Street, Melbourne VIC 3000',
          lat: -37.8143,
          lng: 144.9612,
          rating: 4.5,
          hours: '8:00 AM - 6:00 PM',
          phone: '(03) 9234 5678',
          services: ['General Practice', 'Vaccinations', 'Health Checks', 'Minor Surgery'],
          specialties: ['Family Medicine', 'Preventive Care']
        },
        {
          id: 3,
          name: 'HealthPlus Pharmacy',
          type: 'pharmacy',
          address: '789 Swanston Street, Melbourne VIC 3000',
          lat: -37.8156,
          lng: 144.9672,
          rating: 4.0,
          hours: '9:00 AM - 9:00 PM',
          phone: '(03) 9345 6789',
          services: ['Prescriptions', 'Health Products', 'Consultation', 'Flu Shots'],
          specialties: ['Medication Management', 'Health Screening']
        },
        {
          id: 4,
          name: 'Royal Melbourne Hospital',
          type: 'hospital',
          address: 'Grattan Street, Parkville VIC 3050',
          lat: -37.7986,
          lng: 144.9559,
          rating: 4.3,
          hours: 'Open 24/7',
          phone: '(03) 9342 7000',
          services: ['Emergency', 'Specialist Care', 'Research', 'Trauma Center'],
          specialties: ['Cancer Treatment', 'Heart Surgery', 'Emergency Medicine']
        },
        {
          id: 5,
          name: 'Emergency Medical Services',
          type: 'emergency',
          address: 'Elizabeth Street, Melbourne VIC 3000',
          lat: -37.8125,
          lng: 144.9627,
          rating: 4.1,
          hours: 'Open 24/7',
          phone: '000',
          services: ['Emergency Response', 'Ambulance', 'Paramedic Care', 'Life Support'],
          specialties: ['Emergency Medicine', 'Critical Care Transport']
        },
        {
          id: 6,
          name: 'Southbank Family Clinic',
          type: 'clinic',
          address: '321 Southbank Blvd, Southbank VIC 3006',
          lat: -37.8225,
          lng: 144.9631,
          rating: 4.4,
          hours: '7:00 AM - 7:00 PM',
          phone: '(03) 9876 5432',
          services: ['General Practice', 'Pediatrics', 'Women\'s Health', 'Mental Health'],
          specialties: ['Family Medicine', 'Child Care', 'Preventive Medicine']
        },
        {
          id: 7,
          name: 'Carlton Pharmacy Plus',
          type: 'pharmacy',
          address: '654 Lygon Street, Carlton VIC 3053',
          lat: -37.8014,
          lng: 144.9669,
          rating: 4.2,
          hours: '8:30 AM - 8:00 PM',
          phone: '(03) 9347 8901',
          services: ['Prescriptions', 'Compounding', 'Health Advice', 'Medical Equipment'],
          specialties: ['Custom Medications', 'Diabetes Care']
        }
      ],
      
      markers: [],
      userMarker: null,
      routeLayer: null,
      directionsRenderer: null
    }
  },

  computed: {
    hospitalCount() {
      return this.searchResults.filter(f => f.type === 'hospital').length
    },
    clinicCount() {
      return this.searchResults.filter(f => f.type === 'clinic').length
    },
    pharmacyCount() {
      return this.searchResults.filter(f => f.type === 'pharmacy').length
    },
    emergencyCount() {
      return this.searchResults.filter(f => f.type === 'emergency').length
    }
  },
  
  mounted() {
    this.initializeMap()
    this.getCurrentLocation()
  },

  methods: {
    // 检测移动设备
    checkMobileDevice() {
      this.isMobile = window.innerWidth <= 768
    },
    
    // 处理窗口大小变化
    handleResize() {
      this.checkMobileDevice()
      if (this.map) {
        setTimeout(() => {
          this.map.invalidateSize()
        }, 100)
      }
    },
    
    // 切换侧边栏显示
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },
    
    // Initialize the map with Leaflet
    initializeMap() {
      this.loading = true
      this.loadingMessage = 'Loading interactive map...'
      
      // Wait for DOM to be ready
      this.$nextTick(() => {
        try {
          // Initialize Leaflet map centered on Melbourne
          this.map = L.map('map').setView([-37.8136, 144.9631], 13)
          
          // Add OpenStreetMap tiles
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
          }).addTo(this.map)
          
          // Handle window resize to invalidate map size
          window.addEventListener('resize', () => {
            if (this.map) {
              setTimeout(() => {
                this.map.invalidateSize()
              }, 100)
            }
          })
          
          // Add all facility markers to the map
          this.addFacilityMarkers()
          
          this.loading = false
          this.loadingMessage = ''
        } catch (error) {
          console.error('Error initializing map:', error)
          this.loading = false
          this.loadingMessage = 'Failed to load map'
        }
      })
    },

    // Add facility markers to the map
    addFacilityMarkers() {
      // Clear existing markers
      this.clearMarkers()
      
      this.allFacilities.forEach(facility => {
        // Create custom icon based on facility type
        const icon = this.createCustomIcon(facility.type)
        
        // Create marker
        const marker = L.marker([facility.lat, facility.lng], { icon })
          .addTo(this.map)
          .bindPopup(`
            <div class="facility-popup">
              <h6><i class="${this.getFacilityIcon(facility.type)}"></i> ${facility.name}</h6>
              <p class="mb-1">${facility.address}</p>
              <div class="d-flex justify-content-between align-items-center">
                <span class="badge" style="background-color: ${this.getFacilityColor(facility.type)}">${facility.type}</span>
                <span class="text-muted small">★ ${facility.rating}/5</span>
              </div>
              <p class="mb-1"><i class="fas fa-clock"></i> ${facility.hours}</p>
              <button class="btn btn-primary btn-sm mt-2" onclick="window.selectFacilityFromMap(${facility.id})">
                Select Facility
              </button>
            </div>
          `)
        
        // Store marker reference
        this.markers.push(marker)
        
        // Add click event
        marker.on('click', () => {
          this.selectFacility(facility)
        })
      })
    },

    // Create custom icons for different facility types
    createCustomIcon(type) {
      const color = this.getFacilityColor(type)
      const iconClass = this.getFacilityIcon(type)
      
      return L.divIcon({
        className: 'custom-marker',
        html: `
          <div class="marker-pin" style="background-color: ${color};">
            <i class="${iconClass}" style="color: white;"></i>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
      })
    },

    // Clear all markers from map
    clearMarkers() {
      this.markers.forEach(marker => {
        this.map.removeLayer(marker)
      })
      this.markers = []
    },

    // Enhanced facility color mapping
    getFacilityColor(type) {
      const colors = {
        hospital: '#dc3545',     // Red
        clinic: '#28a745',       // Green  
        pharmacy: '#007bff',     // Blue
        emergency: '#ffc107'     // Yellow
      }
      return colors[type] || '#6c757d'
    },
    
    // 更新获取当前位置功能
    getCurrentLocation() {
      this.loading = true
      this.loadingMessage = 'Getting your location...'
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            this.userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
            
            if (this.map) {
              // 添加用户位置标记
              const userIcon = L.divIcon({
                className: 'user-location-marker',
                html: '<div class="user-marker-pulse"></div><div class="user-marker-dot"></div>',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
              })
              
              // 移除之前的用户位置标记
              if (this.userMarker) {
                this.map.removeLayer(this.userMarker)
              }
              
              this.userMarker = L.marker([this.userLocation.lat, this.userLocation.lng], { icon: userIcon })
                .addTo(this.map)
                .bindPopup('Your Current Location')
              
              // 将地图中心设置为用户位置
              this.map.setView([this.userLocation.lat, this.userLocation.lng], 15)
            }
            
            this.loading = false
            // 搜索附近的真实医疗设施
            await this.searchRealMedicalFacilities()
          },
          (error) => {
            console.error('Geolocation error:', error)
            // 回退到墨尔本市中心
            this.userLocation = { lat: -37.8136, lng: 144.9631 }
            this.loading = false
            this.searchNearbyFacilities() // 回退到示例数据
            
            let errorMessage = 'Unable to get your location. '
            switch(error.code) {
              case error.PERMISSION_DENIED:
                errorMessage += 'Location access denied by user.'
                break
              case error.POSITION_UNAVAILABLE:
                errorMessage += 'Location information unavailable.'
                break
              case error.TIMEOUT:
                errorMessage += 'Location request timed out.'
                break
              default:
                errorMessage += 'Unknown location error.'
                break
            }
            alert(errorMessage + ' Using Melbourne CBD as default location.')
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5分钟缓存
          }
        )
      } else {
        // 地理位置不支持时回退到墨尔本CBD
        this.userLocation = { lat: -37.8136, lng: 144.9631 }
        this.loading = false
        this.searchNearbyFacilities()
        alert('Geolocation not supported by this browser. Using Melbourne CBD as default location.')
      }
    },
    
    // 搜索附近设施（改进版，使用真实API数据）
    async searchNearbyFacilities() {
      try {
        this.loading = true
        this.loadingMessage = '正在搜索附近设施...'
        this.clearMarkers()
        
        const center = this.userLocation || { lat: -37.8136, lng: 144.9631 }
        const radiusMeters = this.searchRadius * 1000 // 转换为米
        
        // 构建 Overpass API 查询 - 搜索真实的医疗设施
        let query = `[out:json][timeout:25];
        (
          node["amenity"~"^(hospital|clinic|doctors|dentist|pharmacy|veterinary)$"](around:${radiusMeters},${center.lat},${center.lng});
          way["amenity"~"^(hospital|clinic|doctors|dentist|pharmacy|veterinary)$"](around:${radiusMeters},${center.lat},${center.lng});
          relation["amenity"~"^(hospital|clinic|doctors|dentist|pharmacy|veterinary)$"](around:${radiusMeters},${center.lat},${center.lng});
        );
        out center;`
        
        // 如果选择了特定设施类型，添加过滤
        if (this.facilityType) {
          const facilityMap = {
            'hospital': 'hospital',
            'clinic': 'clinic|doctors',
            'pharmacy': 'pharmacy',
            'emergency': 'hospital' // 紧急服务通常在医院
          }
          
          const osmAmenity = facilityMap[this.facilityType] || this.facilityType
          query = `[out:json][timeout:25];
          (
            node["amenity"~"^(${osmAmenity})$"](around:${radiusMeters},${center.lat},${center.lng});
            way["amenity"~"^(${osmAmenity})$"](around:${radiusMeters},${center.lat},${center.lng});
            relation["amenity"~"^(${osmAmenity})$"](around:${radiusMeters},${center.lat},${center.lng});
          );
          out center;`
        }
        
        const response = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
          body: 'data=' + encodeURIComponent(query)
        })
        
        if (!response.ok) {
          throw new Error('API请求失败')
        }
        
        const data = await response.json()
        
        // 处理返回的真实数据
        this.searchResults = data.elements
          .filter(element => element.tags && element.tags.name) // 只显示有名称的设施
          .map(element => {
            // 确定坐标 - 处理不同类型的 OSM 元素
            let facilityLat, facilityLng
            if (element.lat && element.lon) {
              facilityLat = element.lat
              facilityLng = element.lon
            } else if (element.center) {
              facilityLat = element.center.lat
              facilityLng = element.center.lon
            } else {
              return null
            }
            
            // 计算距离
            const distance = this.calculateDistance(center.lat, center.lng, facilityLat, facilityLng)
            
            // 映射 OSM amenity 到我们的类型
            let facilityType = 'clinic' // 默认类型
            const amenity = element.tags.amenity
            if (amenity === 'hospital') facilityType = 'hospital'
            else if (amenity === 'pharmacy') facilityType = 'pharmacy'
            else if (amenity === 'clinic' || amenity === 'doctors') facilityType = 'clinic'
            else if (amenity === 'dentist') facilityType = 'clinic'
            else if (amenity === 'veterinary') facilityType = 'clinic'
            
            return {
              id: element.id,
              name: element.tags.name || '未命名设施',
              type: facilityType,
              address: this.formatAddress(element.tags),
              lat: facilityLat,
              lng: facilityLng,
              distance: distance.toFixed(1),
              rating: '4.' + Math.floor(Math.random() * 5), // 模拟评分
              hours: element.tags.opening_hours || '营业时间未知',
              phone: element.tags.phone || '电话未知',
              website: element.tags.website || null,
              services: this.getServicesForType(facilityType),
              specialties: ['一般护理'],
              isReal: true // 标记为真实数据
            }
          })
          .filter(facility => facility !== null)
          .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
          .slice(0, 20) // 限制为前20个结果
        
        // 更新地图标记
        if (this.map) {
          this.addRealFacilityMarkers()
        }
        
        console.log(`找到 ${this.searchResults.length} 个真实医疗设施`)
        
      } catch (error) {
        console.error('搜索设施失败:', error)
        
        // 回退到示例数据
        const center = this.userLocation || { lat: -37.8136, lng: 144.9631 }
        
        // 按类型过滤设施并计算距离
        let filteredFacilities = this.allFacilities
        
        if (this.facilityType) {
          filteredFacilities = filteredFacilities.filter(f => f.type === this.facilityType)
        }
        
        // 计算距离并按半径过滤
        this.searchResults = filteredFacilities
          .map(facility => {
            const distance = this.calculateDistance(
              center.lat, center.lng,
              facility.lat, facility.lng
            )
            return { ...facility, distance: distance.toFixed(1) }
          })
          .filter(facility => facility.distance <= this.searchRadius)
          .sort((a, b) => a.distance - b.distance)
        
        // 更新地图标记
        if (this.map) {
          this.addFacilityMarkers()
        }
        
        console.log('使用示例数据作为回退')
      } finally {
        this.loading = false
      }
    },
    
    // 实际搜索地理位置功能 - 使用 Nominatim API
    async searchLocation() {
      if (!this.searchQuery.trim()) {
        this.searchNearbyFacilities()
        return
      }
      
      this.loading = true
      this.loadingMessage = 'Searching location...'
      
      try {
        // 使用 OpenStreetMap Nominatim 地理编码服务
        const encodedQuery = encodeURIComponent(this.searchQuery + ', Melbourne, Australia')
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&limit=1&countrycodes=au`
        )
        
        if (!response.ok) {
          throw new Error('Search service unavailable')
        }
        
        const data = await response.json()
        
        if (data && data.length > 0) {
          const result = data[0]
          this.userLocation = {
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon)
          }
          
          // 更新地图视图到搜索结果
          if (this.map) {
            this.map.setView([this.userLocation.lat, this.userLocation.lng], 14)
            
            // 添加搜索结果标记
            const searchIcon = L.divIcon({
              className: 'search-result-marker',
              html: '<div class="search-pin"><i class="fas fa-search"></i></div>',
              iconSize: [25, 25],
              iconAnchor: [12, 25]
            })
            
            L.marker([this.userLocation.lat, this.userLocation.lng], { icon: searchIcon })
              .addTo(this.map)
              .bindPopup(`<b>Search Result:</b><br>${result.display_name}`)
              .openPopup()
          }
          
          // 搜索附近的真实医疗设施
          await this.searchRealMedicalFacilities()
          
        } else {
          throw new Error('Location not found')
        }
        
      } catch (error) {
        console.error('Geocoding error:', error)
        alert('Unable to find location. Please try a different search term.')
        // 回退到默认位置
        this.userLocation = { lat: -37.8136, lng: 144.9631 }
        this.searchNearbyFacilities()
      }
      
      this.loading = false
    },
    
    // 实际搜索真实医疗设施 - 使用 Overpass API
    async searchRealMedicalFacilities() {
      if (!this.userLocation) return
      
      this.loading = true
      this.loadingMessage = 'Finding real medical facilities...'
      
      try {
        const { lat, lng } = this.userLocation
        const radiusMeters = this.searchRadius * 1000 // 转换为米
        
        // 构建 Overpass API 查询 - 搜索真实的医疗设施
        let query = `[out:json][timeout:25];
        (
          node["amenity"~"^(hospital|clinic|doctors|dentist|pharmacy|veterinary)$"](around:${radiusMeters},${lat},${lng});
          way["amenity"~"^(hospital|clinic|doctors|dentist|pharmacy|veterinary)$"](around:${radiusMeters},${lat},${lng});
          relation["amenity"~"^(hospital|clinic|doctors|dentist|pharmacy|veterinary)$"](around:${radiusMeters},${lat},${lng});
        );
        out center;`
        
        // 如果选择了特定设施类型，添加过滤
        if (this.facilityType) {
          const facilityMap = {
            'hospital': 'hospital',
            'clinic': 'clinic|doctors',
            'pharmacy': 'pharmacy',
            'emergency': 'hospital' // 紧急服务通常在医院
          }
          
          const osmAmenity = facilityMap[this.facilityType] || this.facilityType
          query = `[out:json][timeout:25];
          (
            node["amenity"~"^(${osmAmenity})$"](around:${radiusMeters},${lat},${lng});
            way["amenity"~"^(${osmAmenity})$"](around:${radiusMeters},${lat},${lng});
            relation["amenity"~"^(${osmAmenity})$"](around:${radiusMeters},${lat},${lng});
          );
          out center;`
        }
        
        const response = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
          body: 'data=' + encodeURIComponent(query)
        })
        
        if (!response.ok) {
          throw new Error('Overpass API request failed')
        }
        
        const data = await response.json()
        
        // 处理返回的真实数据
        this.searchResults = data.elements
          .filter(element => element.tags && element.tags.name) // 只显示有名称的设施
          .map(element => {
            // 确定坐标 - 处理不同类型的 OSM 元素
            let facilityLat, facilityLng
            if (element.lat && element.lon) {
              facilityLat = element.lat
              facilityLng = element.lon
            } else if (element.center) {
              facilityLat = element.center.lat
              facilityLng = element.center.lon
            } else {
              return null
            }
            
            // 计算距离
            const distance = this.calculateDistance(lat, lng, facilityLat, facilityLng)
            
            // 映射 OSM amenity 到我们的类型
            let facilityType = 'clinic' // 默认类型
            const amenity = element.tags.amenity
            if (amenity === 'hospital') facilityType = 'hospital'
            else if (amenity === 'pharmacy') facilityType = 'pharmacy'
            else if (amenity === 'clinic' || amenity === 'doctors') facilityType = 'clinic'
            else if (amenity === 'dentist') facilityType = 'clinic'
            else if (amenity === 'veterinary') facilityType = 'clinic'
            
            return {
              id: element.id,
              name: element.tags.name || 'Unnamed Facility',
              type: facilityType,
              address: this.formatAddress(element.tags),
              lat: facilityLat,
              lng: facilityLng,
              distance: distance.toFixed(1),
              rating: '4.' + Math.floor(Math.random() * 5), // 模拟评分
              hours: element.tags.opening_hours || 'Hours not available',
              phone: element.tags.phone || 'Phone not available',
              website: element.tags.website || null,
              services: this.getServicesForType(facilityType),
              specialties: ['General Care'],
              isReal: true // 标记为真实数据
            }
          })
          .filter(facility => facility !== null)
          .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
          .slice(0, 20) // 限制为前20个结果
        
        // 更新地图标记
        if (this.map) {
          this.addRealFacilityMarkers()
        }
        
        console.log(`Found ${this.searchResults.length} real medical facilities`)
        
      } catch (error) {
        console.error('Error searching real facilities:', error)
        // 回退到示例数据
        this.searchNearbyFacilities()
        alert('Unable to load real facility data. Showing sample facilities instead.')
      }
      
      this.loading = false
    },
    
    // 格式化地址信息
    formatAddress(tags) {
      const parts = []
      if (tags['addr:housenumber']) parts.push(tags['addr:housenumber'])
      if (tags['addr:street']) parts.push(tags['addr:street'])
      if (tags['addr:suburb']) parts.push(tags['addr:suburb'])
      if (tags['addr:city']) parts.push(tags['addr:city'])
      if (tags['addr:postcode']) parts.push(tags['addr:postcode'])
      
      if (parts.length > 0) {
        return parts.join(' ')
      }
      
      // 如果没有详细地址，使用其他可用信息
      return tags.address || 'Address not available'
    },
    
    // 为设施类型获取服务
    getServicesForType(type) {
      const serviceMap = {
        hospital: ['Emergency Care', 'Surgery', 'Inpatient Care', 'Specialist Consultations'],
        clinic: ['General Practice', 'Consultations', 'Health Checks', 'Vaccinations'],
        pharmacy: ['Prescriptions', 'Medications', 'Health Products', 'Consultations'],
        emergency: ['Emergency Response', 'Urgent Care', '24/7 Service']
      }
      return serviceMap[type] || ['General Medical Services']
    },
    
    // 添加真实设施标记到地图
    addRealFacilityMarkers() {
      // 清除现有标记
      this.clearMarkers()
      
      this.searchResults.forEach(facility => {
        // 创建自定义图标
        const icon = this.createCustomIcon(facility.type)
        
        // 创建标记
        const marker = L.marker([facility.lat, facility.lng], { icon })
          .addTo(this.map)
          .bindPopup(`
            <div class="facility-popup">
              <h6><i class="${this.getFacilityIcon(facility.type)}"></i> ${facility.name}</h6>
              <p class="mb-1">${facility.address}</p>
              <div class="d-flex justify-content-between align-items-center">
                <span class="badge" style="background-color: ${this.getFacilityColor(facility.type)}">${facility.type}</span>
                <span class="text-muted small">★ ${facility.rating}/5</span>
              </div>
              <p class="mb-1"><i class="fas fa-route"></i> ${facility.distance}km away</p>
              <p class="mb-1"><i class="fas fa-clock"></i> ${facility.hours}</p>
              ${facility.phone !== 'Phone not available' ? `<p class="mb-1"><i class="fas fa-phone"></i> ${facility.phone}</p>` : ''}
              ${facility.website ? `<p class="mb-1"><a href="${facility.website}" target="_blank"><i class="fas fa-globe"></i> Website</a></p>` : ''}
              <div class="mt-2">
                <button class="btn btn-primary btn-sm me-2" onclick="window.selectFacilityFromMap(${facility.id})">
                  Select
                </button>
                <button class="btn btn-success btn-sm" onclick="window.getDirectionsFromMap(${facility.id})">
                  Directions
                </button>
              </div>
            </div>
          `)
        
        // 存储标记引用
        this.markers.push(marker)
        
        // 添加点击事件
        marker.on('click', () => {
          this.selectFacility(facility)
        })
      })
    },
    
    // Select a facility
    selectFacility(facility) {
      this.selectedFacility = facility
      
      if (this.map) {
        // Center map on selected facility
        this.map.setView([facility.lat, facility.lng], 16)
        
        // Open the popup for this facility
        this.markers.forEach(marker => {
          const markerFacility = this.allFacilities.find(f => 
            f.lat === marker.getLatLng().lat && f.lng === marker.getLatLng().lng
          )
          if (markerFacility && markerFacility.id === facility.id) {
            marker.openPopup()
          }
        })
      }
      
      // Clear previous directions
      this.routeInfo = null
    },
    
    // 真实路线规划功能 - 使用 OSRM API
    async getDirections() {
      if (!this.selectedFacility) {
        alert('Please select a facility first!')
        return
      }
      
      if (!this.userLocation) {
        alert('Unable to get your location. Please enable location services.')
        return
      }
      
      this.loading = true
      this.loadingMessage = 'Calculating real route...'
      
      try {
        const start = `${this.userLocation.lng},${this.userLocation.lat}`
        const end = `${this.selectedFacility.lng},${this.selectedFacility.lat}`
        
        // 映射出行方式到 OSRM 配置文件
        const profileMap = {
          'driving': 'driving',
          'walking': 'foot',
          'bicycling': 'bike'
        }
        const profile = profileMap[this.travelMode] || 'driving'
        
        // 使用 OSRM (Open Source Routing Machine) API 计算真实路线
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/${profile}/${start};${end}?overview=full&geometries=geojson&steps=true`
        )
        
        if (!response.ok) {
          throw new Error('Routing service unavailable')
        }
        
        const data = await response.json()
        
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0]
          
          // 提取路线信息
          const distanceKm = (route.distance / 1000).toFixed(1)
          const durationMin = Math.round(route.duration / 60)
          
          // 提取转向指示
          const steps = route.legs[0].steps.map(step => {
            const instruction = step.maneuver.instruction || 'Continue'
            const distance = (step.distance / 1000).toFixed(1)
            return `${instruction} (${distance}km)`
          }).slice(0, 8) // 限制步骤数量
          
          this.routeInfo = {
            distance: `${distanceKm}km`,
            duration: `${durationMin} min`,
            mode: this.travelMode,
            steps: steps,
            geometry: route.geometry // 保存几何信息用于绘制路线
          }
          
          // 在地图上绘制路线
          this.drawRouteOnMap(route.geometry)
          
          console.log('Real route calculated successfully')
          
        } else {
          throw new Error('No route found')
        }
        
      } catch (error) {
        console.error('Error calculating route:', error)
        
        // 回退到估算路线
        const distance = parseFloat(this.selectedFacility.distance)
        let duration
        
        switch (this.travelMode) {
          case 'walking':
            duration = Math.round(distance * 12) // 12分钟/公里
            break
          case 'bicycling':
            duration = Math.round(distance * 4) // 4分钟/公里
            break
          case 'transit':
            duration = Math.round(distance * 6) // 6分钟/公里
            break
          default: // driving
            duration = Math.round(distance * 3) // 3分钟/公里
        }
        
        this.routeInfo = {
          distance: `${distance}km`,
          duration: `${duration} min`,
          mode: this.travelMode,
          steps: [
            'Route calculation failed - showing estimated directions',
            `Head towards ${this.selectedFacility.name}`,
            `Travel approximately ${distance}km`,
            `Arrive at destination`
          ],
          isEstimated: true
        }
        
        alert('Unable to calculate exact route. Showing estimated directions.')
      }
      
      this.loading = false
    },
    
    // 在地图上绘制路线
    drawRouteOnMap(geometry) {
      // 移除之前的路线
      if (this.routeLayer) {
        this.map.removeLayer(this.routeLayer)
      }
      
      // 绘制新路线
      this.routeLayer = L.geoJSON(geometry, {
        style: {
          color: '#3388ff',
          weight: 5,
          opacity: 0.8,
          dashArray: '10, 5'
        }
      }).addTo(this.map)
      
      // 调整地图视图以包含整条路线
      const bounds = this.routeLayer.getBounds()
      this.map.fitBounds(bounds, { padding: [20, 20] })
    },
    
    // Start navigation (opens in external app)
    startNavigation() {
      if (!this.selectedFacility) {
        alert('Please select a facility first.')
        return
      }
      
      const destination = `${this.selectedFacility.lat},${this.selectedFacility.lng}`
      const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=${this.travelMode}`
      
      window.open(url, '_blank')
    },
    
    // Helper methods
    getTravelMode() {
      return this.travelMode || 'driving'
    },
    
    getFacilityIcon(type) {
      const icons = {
        hospital: 'fas fa-hospital',
        clinic: 'fas fa-clinic-medical',
        pharmacy: 'fas fa-pills',
        emergency: 'fas fa-ambulance'
      }
      return icons[type] || 'fas fa-map-marker-alt'
    },
    
    calculateDistance(lat1, lng1, lat2, lng2) {
      const R = 6371 // Earth's radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180
      const dLng = (lng2 - lng1) * Math.PI / 180
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
      return R * c
    },
    
    // Map control methods
    zoomIn() {
      if (this.map) {
        this.map.zoomIn()
      }
    },
    
    zoomOut() {
      if (this.map) {
        this.map.zoomOut()
      }
    },
    
    resetView() {
      if (this.map) {
        const center = this.userLocation || { lat: -37.8136, lng: 144.9631 }
        this.map.setView([center.lat, center.lng], 13)
      }
    },

    // 全局函数设置 - 为地图弹窗按钮提供支持
    setupGlobalFunctions() {
      window.selectFacilityFromMap = (facilityId) => {
        const facility = this.searchResults.find(f => f.id === facilityId) || 
                         this.allFacilities.find(f => f.id === facilityId)
        if (facility) {
          this.selectFacility(facility)
        }
      }
      
      // 新增：从地图直接获取导航功能
      window.getDirectionsFromMap = (facilityId) => {
        const facility = this.searchResults.find(f => f.id === facilityId) || 
                         this.allFacilities.find(f => f.id === facilityId)
        if (facility) {
          this.selectFacility(facility)
          // 延迟执行获取路线，确保设施已选中
          setTimeout(() => {
            this.getDirections()
          }, 100)
        }
      }
    },
    
    // 改进的启动导航功能
    startNavigation() {
      if (!this.selectedFacility) {
        alert('Please select a facility first.')
        return
      }
      
      const destination = `${this.selectedFacility.lat},${this.selectedFacility.lng}`
      const facilityName = encodeURIComponent(this.selectedFacility.name)
      
      // 检测用户设备并提供相应的导航选项
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      
      if (isMobile) {
        // 移动设备：提供多个导航应用选项
        const options = [
          {
            name: 'Google Maps',
            url: `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=${this.travelMode}`
          },
          {
            name: 'Apple Maps',
            url: `http://maps.apple.com/?daddr=${destination}&t=m`
          },
          {
            name: 'Waze',
            url: `https://waze.com/ul?ll=${destination}&navigate=yes`
          }
        ]
        
        // 创建选择对话框
        const choice = confirm(`Open navigation in external app?\n\nClick OK for Google Maps\nClick Cancel to choose from other options`)
        
        if (choice) {
          window.open(options[0].url, '_blank')
        } else {
          // 显示所有选项
          let message = 'Choose your navigation app:\n\n'
          options.forEach((option, index) => {
            message += `${index + 1}. ${option.name}\n`
          })
          
          const selection = prompt(message + '\nEnter number (1-3):')
          const selectedIndex = parseInt(selection) - 1
          
          if (selectedIndex >= 0 && selectedIndex < options.length) {
            window.open(options[selectedIndex].url, '_blank')
          }
        }
      } else {
        // 桌面设备：直接打开 Google Maps
        const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=${this.travelMode}`
        window.open(url, '_blank')
      }
    },
    
    // 新增：分享位置功能
    shareFacilityLocation() {
      if (!this.selectedFacility) {
        alert('Please select a facility first.')
        return
      }
      
      const shareText = `Check out this medical facility: ${this.selectedFacility.name}\nAddress: ${this.selectedFacility.address}\nDistance: ${this.selectedFacility.distance}km away`
      const shareUrl = `https://www.google.com/maps/search/?api=1&query=${this.selectedFacility.lat},${this.selectedFacility.lng}`
      
      if (navigator.share) {
        // 使用原生分享API（移动设备）
        navigator.share({
          title: this.selectedFacility.name,
          text: shareText,
          url: shareUrl
        }).catch(console.error)
      } else {
        // 回退到复制到剪贴板
        const fullText = `${shareText}\nLocation: ${shareUrl}`
        
        if (navigator.clipboard) {
          navigator.clipboard.writeText(fullText).then(() => {
            alert('Facility information copied to clipboard!')
          }).catch(() => {
            this.fallbackCopyToClipboard(fullText)
          })
        } else {
          this.fallbackCopyToClipboard(fullText)
        }
      }
    },
    
    // 回退复制功能
    fallbackCopyToClipboard(text) {
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
        alert('Facility information copied to clipboard!')
      } catch (err) {
        alert('Unable to copy to clipboard. Please copy manually:\n\n' + text)
      }
      document.body.removeChild(textArea)
    }
  },

  mounted() {
    this.setupGlobalFunctions()
    this.checkMobileDevice()
    this.initializeMap()
    this.getCurrentLocation()
    
    // 初始化时显示示例设施（等待位置获取后再搜索真实设施）
    setTimeout(() => {
      this.searchNearbyFacilities()
    }, 2000) // 给获取位置留出时间
    
    // 监听窗口大小变化
    window.addEventListener('resize', this.handleResize)
  },

  beforeUnmount() {
    // 清理地图实例和事件监听器
    if (this.map) {
      this.map.remove()
    }
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>

<style scoped>
.health-map {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
}

.health-map::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23ffffff" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  pointer-events: none;
}

.sidebar {
  height: 100vh;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 4px 0 30px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 1;
}

.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

.map-header {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 2;
}

.map-container {
  height: 100vh;
  position: relative;
}

.map-wrapper {
  height: 100%;
  padding: 1rem;
}

/* Leaflet Map Styles */
.enhanced-map {
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Custom Marker Styles */
.custom-marker {
  background: transparent;
  border: none;
}

.marker-pin {
  width: 30px;
  height: 30px;
  border-radius: 50% 50% 50% 0;
  position: relative;
  transform: rotate(-45deg);
  border: 2px solid white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.marker-pin i {
  transform: rotate(45deg);
  font-size: 14px;
}

/* User Location Marker */
.user-location-marker {
  position: relative;
}

.user-marker-pulse {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.3);
  animation: pulse 2s infinite;
  position: absolute;
  top: 0;
  left: 0;
}

.user-marker-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #3b82f6;
  border: 2px solid white;
  position: absolute;
  top: 5px;
  left: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  70% {
    transform: scale(2);
    opacity: 0;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
}

/* Facility Popup Styles */
.facility-popup {
  min-width: 250px;
}

.facility-popup h6 {
  margin: 0 0 8px 0;
  color: #333;
  font-weight: 600;
}

.facility-popup .badge {
  font-size: 0.75em;
  padding: 4px 8px;
}

.facility-popup .btn {
  width: 100%;
  margin-top: 8px;
}

/* Enhanced Card Styles */
.search-card, .results-card, .navigation-card, .stats-card {
  border: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.search-card:hover, .results-card:hover, .navigation-card:hover, .stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 15px 15px 0 0 !important;
  border: none;
  padding: 1rem;
}

.card-header h5 {
  margin: 0;
  font-weight: 600;
}

.card-body {
  padding: 1.5rem;
}

/* Map Container Styles */
#map {
  height: 100%;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: relative;
  background: linear-gradient(45deg, #e3f2fd 0%, #bbdefb 100%);
}

/* Enhanced Demo Map Styles */
.enhanced-demo-map {
  width: 100%;
  height: 100%;
  position: relative;
  background: linear-gradient(45deg, #e8f5e8 0%, #f0f8ff 100%);
  overflow: hidden;
}

.enhanced-map-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 500px;
  width: 90%;
  z-index: 1;
}

.overlay-header {
  margin-bottom: 1rem;
}

.overlay-header h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.status-indicator.online {
  color: #4CAF50;
  font-size: 0.9rem;
}

.map-stats {
  display: flex;
  justify-content: space-around;
  margin: 1rem 0;
}

.stat {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
}

.stat-label {
  font-size: 0.8rem;
  color: #666;
}

.facility-breakdown {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin: 1rem 0;
}

.breakdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.demo-note {
  display: block;
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(33, 150, 243, 0.1);
  border-radius: 10px;
  color: #1976d2;
  border-left: 4px solid #2196f3;
}

/* Search Result Marker */
.search-result-marker {
  background: transparent;
  border: none;
}

.search-pin {
  width: 25px;
  height: 25px;
  background: #28a745;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-pin i {
  transform: rotate(45deg);
  color: white;
  font-size: 12px;
}

/* Route Steps Styling */
.route-steps {
  max-height: 250px;
  overflow-y: auto;
}

.route-steps::-webkit-scrollbar {
  width: 4px;
}

.route-steps::-webkit-scrollbar-track {
  background: transparent;
}

.route-steps::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

.step-item {
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.step-item:hover {
  border-left-color: #007bff;
  background: rgba(0, 123, 255, 0.1) !important;
}

.step-number {
  font-size: 0.7rem;
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.step-text {
  font-size: 0.85rem;
  line-height: 1.3;
}

/* Loading Animation Improvements */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.loading-content {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  max-width: 300px;
}

/* Enhanced Button Styles */
.btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.3s ease;
  border: none;
  position: relative;
  overflow: hidden;
}

.btn-lg::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn-lg:hover::before {
  width: 300px;
  height: 300px;
}

.btn-lg:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* Real Data Indicator */
.facility-item[data-real="true"] {
  border-left: 4px solid #28a745;
}

.facility-item[data-real="true"]::after {
  content: 'REAL';
  position: absolute;
  top: 8px;
  right: 8px;
  background: #28a745;
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.6rem;
  font-weight: bold;
}

/* Route Line Animation */
.leaflet-interactive {
  animation: routeAnimation 2s ease-in-out;
}

@keyframes routeAnimation {
  0% {
    stroke-dashoffset: 100%;
  }
  100% {
    stroke-dashoffset: 0%;
  }
}

/* Facility Items */
.facility-item {
  display: flex;
  align-items: center;
  border: 1px solid #e0e0e0;
  border-radius: 15px;
  padding: 1rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
  background: white;
}

.facility-item:hover {
  border-color: #667eea;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
}

.facility-item.selected {
  border-color: #4CAF50;
  background: linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%);
  box-shadow: 0 4px 20px rgba(76, 175, 80, 0.2);
}

.facility-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin-right: 1rem;
  flex-shrink: 0;
}

.facility-icon-small {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.facility-info {
  flex: 1;
}

.facility-name {
  margin: 0;
  font-weight: 600;
  color: #333;
}

.facility-address {
  margin: 0.25rem 0;
  color: #666;
  font-size: 0.9rem;
}

.facility-meta {
  margin: 0.5rem 0;
}

.facility-action {
  color: #ccc;
  font-size: 1.2rem;
}

/* Travel Modes */
.travel-modes {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.travel-mode-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.travel-mode-option:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.travel-mode-option.active {
  border-color: #4CAF50;
  background: linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%);
}

.mode-icon {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.mode-label {
  font-size: 0.8rem;
  font-weight: 500;
}

/* Route Info */
.route-info {
  background: linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%);
  border-radius: 15px;
  padding: 1rem;
  border: 1px solid #e3f2fd;
}

.route-stat {
  text-align: center;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: bold;
  color: #667eea;
}

.stat-label {
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.25rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.stat-item {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  display: block;
}

.stat-label {
  font-size: 0.85rem;
  opacity: 0.9;
  margin-top: 0.25rem;
}

/* Map Controls */
.map-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 0.75rem;
  border-radius: 15px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.control-group .btn {
  width: 45px;
  height: 45px;
  border-radius: 12px;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  color: #667eea;
  font-size: 1.1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-group .btn:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.map-legend {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  padding: 1.5rem;
  border-radius: 15px;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-width: 200px;
}

.legend-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.legend-item:hover {
  background: rgba(102, 126, 234, 0.1);
  transform: translateX(4px);
}

/* Loading Overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100;
  border-radius: 15px;
  backdrop-filter: blur(5px);
}

.loading-content {
  text-align: center;
}

/* Button Styles */
.btn {
  border-radius: 20px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.btn-success {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
}

.btn-info {
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
}

.btn-outline-secondary {
  border: 2px solid #e0e0e0;
  color: #666;
  background: white;
}

.btn-outline-secondary:hover {
  background: #f8f9fa;
  border-color: #667eea;
  color: #667eea;
}

/* Badge Styles */
.badge {
  border-radius: 15px;
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
}

/* User Location Marker */
.user-location-marker {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
}

.user-marker-dot {
  width: 12px;
  height: 12px;
  background: #4285f4;
  border: 3px solid white;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.user-marker-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  border: 2px solid rgba(66, 133, 244, 0.3);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

/* Service Tags */
.service-tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.85rem;
  border: 1px solid #bbdefb;
}

.service-tag.more {
  background: #f5f5f5;
  color: #666;
  border-color: #ddd;
}

.services-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .health-map {
    min-height: 100vh;
  }
  
  .sidebar {
    height: auto;
    max-height: 50vh;
    order: 2;
  }
  
  .map-container {
    height: 50vh;
    order: 1;
  }
  
  .map-wrapper {
    padding: 1rem !important;
  }
  
  .enhanced-map {
    height: 400px !important;
    border-radius: 15px;
  }
  
  .travel-modes {
    grid-template-columns: repeat(4, 1fr) !important;
    gap: 0.5rem;
  }
  
  .travel-mode-option {
    padding: 0.75rem 0.5rem !important;
  }
  
  .mode-icon {
    font-size: 1.2rem !important;
  }
  
  .mode-label {
    font-size: 0.7rem !important;
  }
  
  .stats-grid {
    grid-template-columns: repeat(4, 1fr) !important;
    gap: 0.5rem;
  }
  
  .stat-item {
    padding: 1rem 0.5rem !important;
  }
  
  .stat-number {
    font-size: 1.5rem !important;
  }
  
  .stat-label {
    font-size: 0.7rem !important;
  }
  
  .map-controls {
    top: 10px;
    right: 10px;
  }
  
  .control-group {
    padding: 0.5rem;
  }
  
  .control-group .btn {
    width: 40px !important;
    height: 40px !important;
    font-size: 1rem !important;
  }
  
  .map-legend {
    bottom: 10px;
    left: 10px;
    padding: 1rem;
    max-width: 150px;
  }
}

@media (max-width: 576px) {
  .map-header .container-fluid .row {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .enhanced-map {
    height: 300px !important;
  }
  
  .sidebar-content {
    padding: 1rem !important;
  }
  
  .search-card .card-body,
  .navigation-card .card-body,
  .stats-card .card-body {
    padding: 1.5rem !important;
  }
  
  .facility-item {
    padding: 1rem !important;
  }
}

@media (max-width: 480px) {
  .sidebar {
    position: fixed;
    left: -100%;
    top: 0;
    width: 90%;
    z-index: 1000;
    transition: left 0.3s ease;
  }
  
  .sidebar.open {
    left: 0;
  }
  
  .map-container {
    width: 100%;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

/* Mobile Sidebar Toggle Button */
.mobile-sidebar-toggle {
  top: 20px;
  left: 20px;
  z-index: 1001;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: none;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  border: none;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.mobile-sidebar-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.mobile-sidebar-toggle.active {
  background-color: #dc3545 !important;
  border-color: #dc3545 !important;
}

/* Mobile responsive styles - 修复响应式布局 */
@media (max-width: 768px) {
  .mobile-sidebar-toggle {
    display: flex !important;
  }
  
  .sidebar {
    position: fixed;
    left: -100%;
    top: 0;
    width: 85%;
    height: 100vh;
    z-index: 1000;
    transition: left 0.3s ease;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(20px);
    box-shadow: 4px 0 30px rgba(0, 0, 0, 0.15);
  }
  
  .sidebar.open {
    left: 0;
  }
  
  .map-container {
    width: 100% !important;
    height: 100vh !important;
  }
  
  .col-lg-4, .col-md-5 {
    flex: none;
    width: auto;
  }
  
  .col-lg-8, .col-md-7 {
    flex: none;
    width: 100%;
  }
}

/* 确保桌面版本侧边栏始终可见 */
@media (min-width: 769px) {
  .mobile-sidebar-toggle {
    display: none !important;
  }
  
  .sidebar {
    position: relative !important;
    left: 0 !important;
    width: 100% !important;
    height: 100vh !important;
    z-index: 1 !important;
  }
  
  .col-lg-4, .col-md-5 {
    flex: 0 0 33.333333% !important;
    max-width: 33.333333% !important;
  }
  
  .col-lg-8, .col-md-7 {
    flex: 0 0 66.666667% !important;
    max-width: 66.666667% !important;
  }
}

/* Sidebar overlay for mobile */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.sidebar-overlay.show {
  opacity: 1;
  visibility: visible;
}
</style>

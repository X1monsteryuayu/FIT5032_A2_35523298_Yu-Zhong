<template>
  <div class="health-map">
    <!-- Header Section -->
    <div class="map-header">
      <div class="container-fluid">
        <div class="row align-items-center py-3">
          <div class="col">
            <h2 class="mb-0">
              <i class="fas fa-map-marked-alt me-2 text-primary"></i>
              Health Facilities Locator
            </h2>
            <p class="text-muted mb-0">Find nearby medical facilities and get directions</p>
          </div>
          <div class="col-auto">
            <button @click="getCurrentLocation" class="btn btn-primary">
              <i class="fas fa-location-arrow me-2"></i>Use My Location
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container-fluid h-100">
      <div class="row h-100">
        <!-- Enhanced Sidebar -->
        <div class="col-lg-4 col-md-5 sidebar">
          <div class="sidebar-content">
            
            <!-- Search Section -->
            <div class="search-card">
              <div class="card-header">
                <h5 class="mb-0">
                  <i class="fas fa-search me-2"></i>Search Medical Facilities
                </h5>
              </div>
              <div class="card-body">
                <div class="mb-3">
                  <label class="form-label">Location</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="fas fa-map-marker-alt"></i>
                    </span>
                    <input 
                      v-model="searchQuery" 
                      type="text" 
                      class="form-control" 
                      placeholder="Enter address or landmark"
                      @keyup.enter="searchLocation"
                    >
                  </div>
                </div>
                
                <div class="mb-3">
                  <label class="form-label">Facility Type</label>
                  <select v-model="facilityType" class="form-select">
                    <option value="">All Facilities</option>
                    <option value="hospital">🏥 Hospitals</option>
                    <option value="clinic">🩺 Clinics</option>
                    <option value="pharmacy">💊 Pharmacies</option>
                    <option value="emergency">🚑 Emergency Services</option>
                  </select>
                </div>
                
                <div class="mb-3">
                  <label class="form-label">
                    Search Radius: <span class="text-primary fw-bold">{{ searchRadius }}km</span>
                  </label>
                  <input 
                    v-model="searchRadius" 
                    type="range" 
                    class="form-range" 
                    min="1" 
                    max="50" 
                    step="1"
                  >
                  <div class="d-flex justify-content-between small text-muted">
                    <span>1km</span>
                    <span>50km</span>
                  </div>
                </div>
                
                <button @click="searchLocation" class="btn btn-primary w-100">
                  <i class="fas fa-search me-2"></i>Search Facilities
                </button>
              </div>
            </div>

            <!-- Results Section -->
            <div class="results-card mt-4" v-if="searchResults.length > 0">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">
                  <i class="fas fa-list me-2"></i>Found {{ searchResults.length }} facilities
                </h5>
                <span class="badge bg-success">{{ searchResults.length }}</span>
              </div>
              <div class="card-body p-0">
                <div class="results-list">
                  <div 
                    v-for="facility in searchResults" 
                    :key="facility.id"
                    class="facility-item"
                    :class="{ 'selected': selectedFacility?.id === facility.id }"
                    @click="selectFacility(facility)"
                  >
                    <div class="facility-icon">
                      <i :class="getFacilityIcon(facility.type)" 
                         :style="{ color: getFacilityColor(facility.type) }"></i>
                    </div>
                    
                    <div class="facility-info">
                      <h6 class="facility-name">{{ facility.name }}</h6>
                      <p class="facility-address">{{ facility.address }}</p>
                      
                      <div class="facility-meta">
                        <span class="badge me-2" :style="{ backgroundColor: getFacilityColor(facility.type) }">
                          {{ facility.type }}
                        </span>
                        <span class="text-muted small">
                          <i class="fas fa-route me-1"></i>{{ facility.distance }}km
                        </span>
                      </div>
                      
                      <div class="facility-details mt-2">
                        <div class="d-flex justify-content-between">
                          <span class="text-success small">
                            <i class="fas fa-star"></i> {{ facility.rating }}/5
                          </span>
                          <span class="text-muted small">
                            <i class="fas fa-clock"></i> {{ facility.hours }}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div class="facility-action">
                      <i class="fas fa-chevron-right"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Navigation Section -->
            <div class="navigation-card mt-4" v-if="selectedFacility">
              <div class="card-header">
                <h5 class="mb-0">
                  <i class="fas fa-navigation me-2"></i>Navigation
                </h5>
              </div>
              <div class="card-body">
                <div class="selected-facility mb-3">
                  <div class="d-flex align-items-center">
                    <div class="facility-icon-small me-3">
                      <i :class="getFacilityIcon(selectedFacility.type)" 
                         :style="{ color: getFacilityColor(selectedFacility.type) }"></i>
                    </div>
                    <div>
                      <h6 class="mb-1">{{ selectedFacility.name }}</h6>
                      <p class="text-muted small mb-0">{{ selectedFacility.address }}</p>
                    </div>
                  </div>
                </div>
                
                <div class="mb-3">
                  <label class="form-label">Transportation Mode</label>
                  <div class="travel-modes">
                    <label v-for="mode in travelModes" :key="mode.value" 
                           class="travel-mode-option"
                           :class="{ active: travelMode === mode.value }">
                      <input type="radio" v-model="travelMode" :value="mode.value" class="d-none">
                      <span class="mode-icon">{{ mode.icon }}</span>
                      <span class="mode-label">{{ mode.label }}</span>
                    </label>
                  </div>
                </div>
                
                <div class="d-grid gap-2">
                  <button @click="getDirections" class="btn btn-success">
                    <i class="fas fa-route me-2"></i>Get Directions
                  </button>
                  <button @click="startNavigation" class="btn btn-info">
                    <i class="fas fa-external-link-alt me-2"></i>Open in Maps
                  </button>
                </div>
                
                <!-- Route Information -->
                <div v-if="routeInfo" class="route-info mt-3">
                  <div class="route-summary">
                    <div class="row text-center">
                      <div class="col-4">
                        <div class="route-stat">
                          <i class="fas fa-route text-primary"></i>
                          <div class="stat-value">{{ routeInfo.distance }}</div>
                          <div class="stat-label">Distance</div>
                        </div>
                      </div>
                      <div class="col-4">
                        <div class="route-stat">
                          <i class="fas fa-clock text-success"></i>
                          <div class="stat-value">{{ routeInfo.duration }}</div>
                          <div class="stat-label">Duration</div>
                        </div>
                      </div>
                      <div class="col-4">
                        <div class="route-stat">
                          <i class="fas fa-map text-info"></i>
                          <div class="stat-value">{{ travelMode }}</div>
                          <div class="stat-label">Mode</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Quick Stats -->
            <div class="stats-card mt-4" v-if="searchResults.length > 0">
              <div class="card-body">
                <h6 class="card-title">Quick Stats</h6>
                <div class="stats-grid">
                  <div class="stat-item">
                    <span class="stat-number">{{ hospitalCount }}</span>
                    <span class="stat-label">Hospitals</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-number">{{ clinicCount }}</span>
                    <span class="stat-label">Clinics</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-number">{{ pharmacyCount }}</span>
                    <span class="stat-label">Pharmacies</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-number">{{ emergencyCount }}</span>
                    <span class="stat-label">Emergency</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced Map Container -->
        <div class="col-lg-8 col-md-7 map-container">
          <div class="map-wrapper">
            <div id="map" class="enhanced-map"></div>
            
            <!-- Map Controls -->
            <div class="map-controls">
              <div class="control-group">
                <button @click="zoomIn" class="btn btn-light btn-sm" title="Zoom In">
                  <i class="fas fa-plus"></i>
                </button>
                <button @click="zoomOut" class="btn btn-light btn-sm" title="Zoom Out">
                  <i class="fas fa-minus"></i>
                </button>
                <button @click="resetView" class="btn btn-light btn-sm" title="Reset View">
                  <i class="fas fa-home"></i>
                </button>
              </div>
            </div>

            <!-- Map Legend -->
            <div class="map-legend">
              <h6>Legend</h6>
              <div class="legend-items">
                <div class="legend-item">
                  <i class="fas fa-hospital" style="color: #dc3545"></i>
                  <span>Hospitals</span>
                </div>
                <div class="legend-item">
                  <i class="fas fa-clinic-medical" style="color: #28a745"></i>
                  <span>Clinics</span>
                </div>
                <div class="legend-item">
                  <i class="fas fa-pills" style="color: #007bff"></i>
                  <span>Pharmacies</span>
                </div>
                <div class="legend-item">
                  <i class="fas fa-ambulance" style="color: #ffc107"></i>
                  <span>Emergency</span>
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
    // Initialize the map (enhanced demo version)
    initializeMap() {
      this.loading = true
      this.loadingMessage = 'Loading interactive map...'
      
      // Simulate map loading
      setTimeout(() => {
        // Create enhanced demo map interface
        const mapElement = document.getElementById('map')
        mapElement.innerHTML = `
          <div class="enhanced-demo-map">
            <div class="map-background"></div>
            <div class="map-grid"></div>
            
            <!-- Animated markers for facilities -->
            <div class="map-markers">
              ${this.createDemoMarkers()}
            </div>
            
            <!-- User location indicator -->
            <div class="user-location-marker">
              <div class="user-marker-pulse"></div>
              <div class="user-marker-dot"></div>
            </div>
            
            <!-- Map overlay with info -->
            <div class="enhanced-map-overlay">
              <div class="overlay-header">
                <h4><i class="fas fa-map-marked-alt me-2"></i>Interactive Health Facilities Map</h4>
                <span class="status-indicator online">
                  <i class="fas fa-circle"></i> Live Data
                </span>
              </div>
              <div class="overlay-content">
                <p>Melbourne CBD & Surrounding Areas</p>
                <div class="map-stats">
                  <div class="stat">
                    <span class="stat-number">${this.allFacilities.length}</span>
                    <span class="stat-label">Total Facilities</span>
                  </div>
                  <div class="stat">
                    <span class="stat-number">${this.searchRadius}km</span>
                    <span class="stat-label">Search Radius</span>
                  </div>
                </div>
                <small class="demo-note">
                  <i class="fas fa-info-circle"></i>
                  Interactive demo - In production, this would display a real Google Maps interface with live facility data
                </small>
              </div>
            </div>
          </div>
        `
        this.loading = false
        this.searchNearbyFacilities()
      }, 1500)
    },

    // Create demo markers for the map
    createDemoMarkers() {
      return this.allFacilities.map((facility, index) => {
        const color = this.getFacilityColor(facility.type)
        const icon = this.getFacilityIcon(facility.type)
        const top = 20 + (index * 15) % 60
        const left = 15 + (index * 20) % 70
        
        return `
          <div class="demo-marker" 
               style="top: ${top}%; left: ${left}%; --marker-color: ${color};"
               data-facility-id="${facility.id}">
            <div class="marker-icon">
              <i class="${icon}"></i>
            </div>
            <div class="marker-tooltip">
              <strong>${facility.name}</strong><br>
              <small>${facility.type} • ${facility.rating}/5</small>
            </div>
          </div>
        `
      }).join('')
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
    
    // Get user's current location (demo version)
    getCurrentLocation() {
      this.loading = true
      this.loadingMessage = 'Getting your location...'
      
      // Simulate getting location
      setTimeout(() => {
        // Use Melbourne CBD as demo location
        this.userLocation = {
          lat: -37.8136,
          lng: 144.9631
        }
        
        this.loading = false
        this.searchNearbyFacilities()
      }, 500)
    },
    
    // Search for location (demo version)
    searchLocation() {
      if (!this.searchQuery.trim()) {
        this.searchNearbyFacilities()
        return
      }
      
      this.loading = true
      this.loadingMessage = 'Searching location...'
      
      // Simulate geocoding
      setTimeout(() => {
        // For demo, just use a random nearby location
        this.userLocation = {
          lat: -37.8136 + (Math.random() - 0.5) * 0.01,
          lng: 144.9631 + (Math.random() - 0.5) * 0.01
        }
        
        this.searchNearbyFacilities()
        this.loading = false
      }, 1000)
    },
    
    // Search nearby facilities
    searchNearbyFacilities() {
      this.clearMarkers()
      
      const center = this.userLocation || { lat: -37.8136, lng: 144.9631 }
      
      // Filter facilities by type and calculate distances
      let filteredFacilities = this.allFacilities
      
      if (this.facilityType) {
        filteredFacilities = filteredFacilities.filter(f => f.type === this.facilityType)
      }
      
      // Calculate distances and filter by radius
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
      
      // Add markers to map
      this.addMarkersToMap()
    },
    
    // Add markers to map (enhanced demo version)
    addMarkersToMap() {
      // Update the map overlay with current search results
      const mapElement = document.getElementById('map')
      const overlay = mapElement.querySelector('.enhanced-map-overlay .overlay-content')
      if (overlay) {
        const statsHtml = `
          <div class="map-stats">
            <div class="stat">
              <span class="stat-number">${this.searchResults.length}</span>
              <span class="stat-label">Found Facilities</span>
            </div>
            <div class="stat">
              <span class="stat-number">${this.searchRadius}km</span>
              <span class="stat-label">Search Radius</span>
            </div>
          </div>
          <div class="facility-breakdown">
            <div class="breakdown-item">
              <i class="fas fa-hospital" style="color: #dc3545"></i>
              <span>${this.hospitalCount} Hospitals</span>
            </div>
            <div class="breakdown-item">
              <i class="fas fa-clinic-medical" style="color: #28a745"></i>
              <span>${this.clinicCount} Clinics</span>
            </div>
            <div class="breakdown-item">
              <i class="fas fa-pills" style="color: #007bff"></i>
              <span>${this.pharmacyCount} Pharmacies</span>
            </div>
            <div class="breakdown-item">
              <i class="fas fa-ambulance" style="color: #ffc107"></i>
              <span>${this.emergencyCount} Emergency</span>
            </div>
          </div>
        `
        
        overlay.innerHTML = `
          <p>Melbourne CBD & Surrounding Areas</p>
          ${statsHtml}
          <small class="demo-note">
            <i class="fas fa-info-circle"></i>
            Interactive demo - Click facilities in the sidebar to view details
          </small>
        `
      }

      // Add click handlers to demo markers
      setTimeout(() => {
        const markers = document.querySelectorAll('.demo-marker')
        markers.forEach(marker => {
          marker.addEventListener('click', (e) => {
            const facilityId = parseInt(e.currentTarget.dataset.facilityId)
            const facility = this.allFacilities.find(f => f.id === facilityId)
            if (facility && this.searchResults.includes(facility)) {
              this.selectFacility(facility)
            }
          })
        })
      }, 100)
    },
    
    // Clear all markers (demo version)
    clearMarkers() {
      // In demo mode, just reset the overlay
      this.addMarkersToMap()
    },
    
    // Select a facility (enhanced version)
    selectFacility(facility) {
      this.selectedFacility = facility
      
      // Update map overlay with selected facility info
      const mapElement = document.getElementById('map')
      const overlay = mapElement.querySelector('.enhanced-map-overlay .overlay-content')
      if (overlay) {
        overlay.innerHTML = `
          <div class="selected-facility-info">
            <div class="facility-header">
              <div class="facility-icon-large">
                <i class="${this.getFacilityIcon(facility.type)}" 
                   style="color: ${this.getFacilityColor(facility.type)}"></i>
              </div>
              <div class="facility-details">
                <h5>${facility.name}</h5>
                <p class="text-muted">${facility.address}</p>
                <div class="facility-badges">
                  <span class="badge" style="background-color: ${this.getFacilityColor(facility.type)}">
                    ${facility.type}
                  </span>
                  <span class="badge bg-success">
                    <i class="fas fa-star"></i> ${facility.rating}/5
                  </span>
                </div>
              </div>
            </div>
            
            <div class="facility-info-grid">
              <div class="info-item">
                <i class="fas fa-clock text-primary"></i>
                <span>${facility.hours}</span>
              </div>
              <div class="info-item">
                <i class="fas fa-phone text-success"></i>
                <span>${facility.phone}</span>
              </div>
              <div class="info-item">
                <i class="fas fa-route text-info"></i>
                <span>${facility.distance}km away</span>
              </div>
            </div>
            
            <div class="services-preview">
              <strong>Services:</strong>
              <div class="services-tags">
                ${facility.services.slice(0, 3).map(service => 
                  `<span class="service-tag">${service}</span>`
                ).join('')}
                ${facility.services.length > 3 ? 
                  `<span class="service-tag more">+${facility.services.length - 3} more</span>` : ''
                }
              </div>
            </div>
          </div>
          
          <small class="demo-note">
            <i class="fas fa-info-circle"></i>
            Use the navigation panel to get directions to this facility
          </small>
        `
      }
      
      // Highlight selected marker
      const markers = document.querySelectorAll('.demo-marker')
      markers.forEach(marker => {
        marker.classList.remove('selected')
        if (parseInt(marker.dataset.facilityId) === facility.id) {
          marker.classList.add('selected')
        }
      })
      
      // Clear previous directions
      this.routeInfo = null
    },
    
    // Get directions (enhanced demo version)
    getDirections() {
      if (!this.selectedFacility) {
        alert('Please select a facility first!')
        return
      }
      
      this.loading = true
      this.loadingMessage = 'Calculating route...'
      
      // Simulate route calculation with enhanced details
      setTimeout(() => {
        const distance = Math.round(parseFloat(this.selectedFacility.distance) * 10) / 10
        let duration
        
        switch (this.travelMode) {
          case 'walking':
            duration = Math.round(distance * 12) // 12 minutes per km
            break
          case 'bicycling':
            duration = Math.round(distance * 4) // 4 minutes per km
            break
          case 'transit':
            duration = Math.round(distance * 6) // 6 minutes per km
            break
          default: // driving
            duration = Math.round(distance * 3) // 3 minutes per km
        }
        
        this.routeInfo = {
          distance: `${distance}km`,
          duration: `${duration} min`,
          mode: this.travelMode,
          steps: [
            'Head north on current street',
            `Turn right towards ${this.selectedFacility.address.split(',')[0]}`,
            `Continue straight for ${(distance * 0.7).toFixed(1)}km`,
            `Arrive at ${this.selectedFacility.name}`
          ]
        }
        
        this.loading = false
      }, 1000)
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
    
    // Map control methods (demo version)
    zoomIn() {
      const overlay = document.querySelector('.enhanced-map-overlay')
      if (overlay) {
        const info = document.createElement('div')
        info.className = 'zoom-info'
        info.innerHTML = '<small>Zoom In activated</small>'
        overlay.appendChild(info)
        setTimeout(() => info.remove(), 2000)
      }
    },
    
    zoomOut() {
      const overlay = document.querySelector('.enhanced-map-overlay')
      if (overlay) {
        const info = document.createElement('div')
        info.className = 'zoom-info'
        info.innerHTML = '<small>Zoom Out activated</small>'
        overlay.appendChild(info)
        setTimeout(() => info.remove(), 2000)
      }
    },
    
    resetView() {
      this.initializeMap()
      this.searchNearbyFacilities()
    }
  }
}
</script>

<style scoped>
.health-map {
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.sidebar {
  height: 100vh;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 2px 0 20px rgba(0, 0, 0, 0.1);
}

.sidebar-content {
  padding: 1rem;
}

.map-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.map-container {
  height: 100vh;
  position: relative;
}

.map-wrapper {
  height: 100%;
  padding: 1rem;
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

/* Demo Markers */
.demo-marker {
  position: absolute;
  width: 30px;
  height: 30px;
  background: var(--marker-color, #ff4444);
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
  z-index: 2;
}

.demo-marker:hover {
  transform: rotate(-45deg) scale(1.1);
}

.demo-marker.selected {
  background: #4CAF50 !important;
  transform: rotate(-45deg) scale(1.2);
  z-index: 3;
}

.marker-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
  color: white;
  font-size: 0.8rem;
}

.marker-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.5rem;
  border-radius: 5px;
  font-size: 0.7rem;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.demo-marker:hover .marker-tooltip {
  opacity: 1;
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
  z-index: 10;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.map-legend {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  padding: 1rem;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  z-index: 10;
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
  gap: 0.5rem;
  font-size: 0.9rem;
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
  
  .facility-breakdown {
    grid-template-columns: 1fr;
  }
  
  .travel-modes {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .map-stats {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>

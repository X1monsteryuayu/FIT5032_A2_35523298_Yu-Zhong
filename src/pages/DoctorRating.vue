<template>
  <div class="doctor-rating">
    <div class="container">
      <h1 class="text-center mb-5">Find a Doctor</h1>

      <!-- Search & Filters -->
      <div class="search-filter mb-4">
        <div class="row g-3">
          <div class="col-md-6">
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-search"></i>
              </span>
              <input 
                type="text" 
                class="form-control" 
                v-model="searchQuery"
                placeholder="Search by name or specialty..."
                @input="filterDoctors"
              >
            </div>
          </div>
          <div class="col-md-3">
            <select class="form-select" v-model="selectedSpecialty" @change="filterDoctors">
              <option value="">All Specialties</option>
              <option v-for="specialty in specialties" :key="specialty" :value="specialty">
                {{ specialty }}
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <select class="form-select" v-model="selectedLanguage" @change="filterDoctors">
              <option value="">All Languages</option>
              <option v-for="lang in languages" :key="lang" :value="lang">
                {{ lang }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Doctor List -->
      <div class="row">
        <div v-for="doctor in filteredDoctors" :key="doctor.id" class="col-md-6 mb-4">
          <RatingCard 
            :doctor="doctor"
            :can-rate="isLoggedIn"
            @rate="handleRating"
          />
        </div>
      </div>

      <div v-if="filteredDoctors.length === 0" class="text-center my-5">
        <p>No matching doctors found.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import RatingCard from '../components/RatingCard.vue'

const router = useRouter()
const doctors = ref([
  {
    id: 1,
    name: 'Dr. Zhang',
    specialty: 'General Practitioner',
    averageRating: 4.5,
    totalRatings: 128,
    languages: ['Chinese', 'English'],
    description: '20 years of experience in family medicine and chronic disease management.'
  },
  {
    id: 2,
    name: 'Dr. Chen',
    specialty: 'Pediatrician',
    averageRating: 4.8,
    totalRatings: 256,
    languages: ['Chinese', 'English', 'Cantonese'],
    description: 'Experienced pediatrician specializing in child health and vaccination.'
  },
  {
    id: 3,
    name: 'Dr. Smith',
    specialty: 'Cardiologist',
    averageRating: 4.6,
    totalRatings: 182,
    languages: ['English', 'Spanish'],
    description: 'Cardiovascular expert focused on heart disease prevention and treatment.'
  },
  {
    id: 4,
    name: 'Dr. Li',
    specialty: 'Physician',
    averageRating: 4.7,
    totalRatings: 145,
    languages: ['Chinese', 'English'],
    description: 'Internal medicine specialist handling common diseases and chronic care.'
  }
])


const searchQuery = ref('')
const selectedSpecialty = ref('')
const selectedLanguage = ref('')
const isLoggedIn = ref(false)

onMounted(() => {
  const userInfo = localStorage.getItem('userInfo')
  isLoggedIn.value = !!userInfo
})

const specialties = computed(() => Array.from(new Set(doctors.value.map(d => d.specialty))))
const languages = computed(() => {
  const s = new Set()
  doctors.value.forEach(d => d.languages.forEach(l => s.add(l)))
  return [...s]
})

const filteredDoctors = computed(() => {
  return doctors.value.filter(d => {
    const matchSearch = !searchQuery.value || d.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || d.specialty.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchSpecialty = !selectedSpecialty.value || d.specialty === selectedSpecialty.value
    const matchLang = !selectedLanguage.value || d.languages.includes(selectedLanguage.value)
    return matchSearch && matchSpecialty && matchLang
  })
})

const filterDoctors = () => {}

const handleRating = ({ doctorId, rating }) => {
  const userInfo = localStorage.getItem('userInfo')
  if (!userInfo) {
    router.push({ path: '/login', query: { redirect: '/doctor-rating' } })
    return
  }
  const doctor = doctors.value.find(d => d.id === doctorId)
  if (doctor) {
    const newTotal = doctor.totalRatings + 1
    const newAvg = (doctor.averageRating * doctor.totalRatings + rating) / newTotal
    doctor.totalRatings = newTotal
    doctor.averageRating = newAvg

    // 本地保存评分
    const localRatings = JSON.parse(localStorage.getItem('doctorRatings') || '{}')
    localRatings[doctorId] = { averageRating: doctor.averageRating, totalRatings: doctor.totalRatings }
    localStorage.setItem('doctorRatings', JSON.stringify(localRatings))
    alert('Thanks for your rating!')
  }
}
</script>

<style scoped>
.doctor-rating {
  padding: 2rem 0;
}

.search-filter {
  background: white;
  padding: 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

@media (max-width: 767.98px) {
  .search-filter {
    padding: 1rem;
  }
}
</style>

<!-- <template>
  <div class="rating-card">
    <div class="rating-header">
      <h3>{{ doctor.name }}</h3>
      <p class="specialty">{{ doctor.specialty }}</p>
      <div class="languages">
        <span class="badge bg-info me-1" v-for="lang in doctor.languages" :key="lang">
          {{ lang }}
        </span>
      </div>
    </div>
    
    <div class="rating-body">
      <p class="description">{{ doctor.description }}</p>
      <div class="current-rating">
        <span class="stars">
          <i v-for="n in 5" :key="n" 
             class="bi" 
             :class="n <= averageRating ? 'bi-star-fill' : 'bi-star'"
             :style="{ color: n <= averageRating ? '#ffc107' : '#6c757d' }">
          </i>
        </span>
        <span class="rating-text">{{ averageRating.toFixed(1) }}/5.0</span>
      </div>
      
      <div v-if="canRate" class="rating-input">
        <p class="mb-2">为这位医生评分:</p>
        <div class="stars-input">
          <i v-for="n in 5" :key="n"
             class="bi"
             :class="n <= tempRating ? 'bi-star-fill' : 'bi-star'"
             @mouseover="tempRating = n"
             @mouseleave="tempRating = userRating"
             @click="setRating(n)"
             :style="{ color: n <= tempRating ? '#ffc107' : '#6c757d' }">
          </i>
        </div>
      </div>
      
      <div class="rating-stats">
        <p>总评分数: {{ totalRatings }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  doctor: Object,
  canRate: Boolean
})
const emit = defineEmits(['rate'])

const userRating = ref(0)
const tempRating = ref(0)
const totalRatings = ref(props.doctor.totalRatings)
const averageRating = computed(() => props.doctor.averageRating)

onMounted(() => {
  const saved = JSON.parse(localStorage.getItem('doctorRatings') || '{}')
  if (saved[props.doctor.id]) {
    props.doctor.totalRatings = saved[props.doctor.id].totalRatings
    props.doctor.averageRating = saved[props.doctor.id].averageRating
  }
})

const setRating = (rating) => {
  userRating.value = rating
  emit('rate', { doctorId: props.doctor.id, rating })
}
</script>

<style scoped>
.rating-card {
  background: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

.rating-header h3 {
  margin: 0;
  color: var(--primary-color);
}

.specialty {
  color: var(--secondary-color);
  margin-top: 0.5rem;
}

.rating-body {
  margin-top: 1.5rem;
}

.current-rating {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.stars {
  display: inline-flex;
  margin-right: 1rem;
}

.stars i {
  margin-right: 0.25rem;
  cursor: pointer;
}

.rating-text {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--secondary-color);
}

.rating-input {
  margin: 1rem 0;
  padding: 1rem 0;
  border-top: 1px solid #eee;
}

.stars-input i {
  cursor: pointer;
  font-size: 1.5rem;
  margin-right: 0.5rem;
}

.rating-stats {
  margin-top: 1rem;
  color: var(--secondary-color);
}

.languages {
  margin-top: 0.5rem;
}

.languages .badge {
  font-size: 0.8rem;
  padding: 0.3rem 0.6rem;
}

.description {
  color: var(--text-color);
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}
</style> -->

<template>
  <div class="container d-flex justify-content-center">
    <div class="rating-card w-100" style="max-width: 600px;">
      <div class="rating-header text-center mb-3">
        <h3>{{ doctor.name }}</h3>
        <p class="specialty">{{ doctor.specialty }}</p>
        <div class="languages mt-2">
          <span class="badge bg-info me-1" v-for="lang in doctor.languages" :key="lang">
            {{ lang }}
          </span>
        </div>
      </div>

      <div class="rating-body">
        <p class="description text-center">{{ doctor.description }}</p>

        <div class="current-rating text-center mb-3">
          <span class="stars">
            <i v-for="n in 5" :key="n"
               class="bi"
               :class="n <= averageRating ? 'bi-star-fill' : 'bi-star'"
               :style="{ color: n <= averageRating ? '#ffc107' : '#6c757d' }">
            </i>
          </span>
          <span class="rating-text">{{ averageRating.toFixed(1) }}/5.0</span>
        </div>

        <div v-if="canRate" class="rating-input text-center">
          <p class="mb-2">Rate this doctor:</p>
          <div class="stars-input">
            <i v-for="n in 5" :key="n"
               class="bi"
               :class="n <= tempRating ? 'bi-star-fill' : 'bi-star'"
               @mouseover="tempRating = n"
               @mouseleave="tempRating = userRating"
               @click="setRating(n)"
               :style="{ color: n <= tempRating ? '#ffc107' : '#6c757d' }">
            </i>
          </div>
          <p v-if="userRating > 0" class="text-success mt-2">Thank you for rating!</p>
        </div>

        <div class="rating-stats text-center mt-3">
          <p>Total Ratings: {{ totalRatings }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  doctor: Object,
  canRate: Boolean
})

const emit = defineEmits(['rate'])

const userRating = ref(0)
const tempRating = ref(0)
const totalRatings = ref(props.doctor.totalRatings || 0)
const averageRating = computed(() => props.doctor.averageRating || 0)

onMounted(() => {
  const saved = JSON.parse(localStorage.getItem('doctorRatings') || '{}')
  if (saved[props.doctor.id]) {
    props.doctor.totalRatings = saved[props.doctor.id].totalRatings
    props.doctor.averageRating = saved[props.doctor.id].averageRating
    userRating.value = saved[props.doctor.id].userRating || 0
    tempRating.value = userRating.value
  }
})

const setRating = (rating) => {
  userRating.value = rating

  const saved = JSON.parse(localStorage.getItem('doctorRatings') || '{}')
  const doctorId = props.doctor.id

  if (!saved[doctorId]) {
    saved[doctorId] = {
      totalRatings: 1,
      averageRating: rating,
      userRating: rating
    }
  } else {
    const prevTotal = saved[doctorId].totalRatings
    const prevAvg = saved[doctorId].averageRating
    const newTotal = prevTotal + 1
    const newAvg = (prevAvg * prevTotal + rating) / newTotal

    saved[doctorId] = {
      totalRatings: newTotal,
      averageRating: newAvg,
      userRating: rating
    }
  }

  localStorage.setItem('doctorRatings', JSON.stringify(saved))

  props.doctor.totalRatings = saved[doctorId].totalRatings
  props.doctor.averageRating = saved[doctorId].averageRating

  emit('rate', { doctorId, rating })
}
</script>

<style scoped>
.rating-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.rating-header h3 {
  margin: 0;
  color: #007bff;
}

.specialty {
  color: #6c757d;
  margin-top: 0.3rem;
}

.current-rating .stars,
.stars-input {
  display: inline-flex;
}

.stars i,
.stars-input i {
  margin-right: 0.25rem;
  font-size: 1.5rem;
  cursor: pointer;
}

.rating-text {
  margin-left: 0.5rem;
  font-weight: bold;
  color: #6c757d;
}

.description {
  font-size: 0.95rem;
  color: #333;
  margin-bottom: 1rem;
}

.rating-stats {
  font-size: 0.9rem;
  color: #6c757d;
}

.languages .badge {
  font-size: 0.8rem;
  padding: 0.3rem 0.6rem;
}
</style>

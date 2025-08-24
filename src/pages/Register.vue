<template>
  <div class="container mt-5">
    <h2 class="mb-4">Register for Healthy Pathway</h2>
    <form @submit.prevent="register">
      <div v-if="authStore.error" class="alert alert-danger">
        {{ authStore.error }}
      </div>

      <!-- Full Name -->
      <div class="mb-3">
        <label for="name" class="form-label">Full Name</label>
        <input type="text" id="name" class="form-control" v-model="name" required />
        <div v-if="name.length > 0 && name.length < 3" class="text-danger">Name must be at least 3 characters</div>
      </div>

      <!-- Email -->
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email" id="email" class="form-control" v-model="email" required />
        <div v-if="email && !isValidEmail(email)" class="text-danger">Please enter a valid email address</div>
      </div>

      <!-- Password -->
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input :type="showPassword ? 'text' : 'password'" id="password" class="form-control" v-model="password" required />
        <div class="progress">
          <div
            class="progress-bar"
            :class="getPasswordStrengthClass"
            role="progressbar"
            :style="{ width: passwordStrengthPercent + '%' }"
          >
            {{ passwordStrengthLabel }}
          </div>
        </div>
        <div class="form-check mt-1">
          <input class="form-check-input" type="checkbox" id="showPassword" v-model="showPassword" />
          <label class="form-check-label" for="showPassword">Show Password</label>
        </div>
        <div v-if="password && !isValidPassword(password)" class="text-danger">
          Password must contain uppercase, lowercase, number, and be at least 8 characters
        </div>
      </div>

      <!-- Confirm Password -->
      <div class="mb-3">
        <label for="confirmPassword" class="form-label">Confirm Password</label>
        <input :type="showConfirm ? 'text' : 'password'" id="confirmPassword" class="form-control" v-model="confirmPassword" required />
        <div class="form-check mt-1">
          <input class="form-check-input" type="checkbox" id="showConfirm" v-model="showConfirm" />
          <label class="form-check-label" for="showConfirm">Show</label>
        </div>
        <div v-if="confirmPassword && confirmPassword !== password" class="text-danger">Passwords do not match</div>
      </div>

      <!-- Age -->
      <div class="mb-3">
        <label for="age" class="form-label">Age</label>
        <input type="number" id="age" class="form-control" v-model="age" required />
        <div v-if="age && (age < 1 || age > 100)" class="text-danger">Age must be between 1 and 100</div>
      </div>

      <!-- Role -->
      <div class="mb-3">
        <label for="role" class="form-label">Role</label>
        <select id="role" class="form-select" v-model="role" required>
          <option value="">Select role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <!-- Language -->
      <div class="mb-3">
        <label for="language" class="form-label">Preferred Language (Optional)</label>
        <input type="text" id="language" class="form-control" v-model="language" />
      </div>

      <!-- Submit -->
      <button 
        class="btn btn-primary" 
        type="submit"
        :disabled="authStore.loading"
      >
        {{ authStore.loading ? 'Registering...' : 'Register' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store'
import { updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'

const router = useRouter()
const authStore = useAuthStore()
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const age = ref('')
const role = ref('')
const language = ref('')
const showPassword = ref(false)
const showConfirm = ref(false)

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const isValidPassword = (password) => {
  return /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && password.length >= 8
}

const passwordStrengthPercent = computed(() => {
  let strength = 0
  if (password.value.length >= 8) strength += 25
  if (/[A-Z]/.test(password.value)) strength += 25
  if (/[a-z]/.test(password.value)) strength += 25
  if (/[0-9]/.test(password.value)) strength += 25
  return strength
})

const passwordStrengthLabel = computed(() => {
  const percent = passwordStrengthPercent.value
  if (percent <= 25) return 'Weak'
  if (percent <= 50) return 'Medium'
  if (percent <= 75) return 'Strong'
  return 'Very Strong'
})

const getPasswordStrengthClass = computed(() => {
  const percent = passwordStrengthPercent.value
  if (percent <= 25) return 'bg-danger'
  if (percent <= 50) return 'bg-warning'
  if (percent <= 75) return 'bg-info'
  return 'bg-success'
})

const register = async () => {
  // 验证所有字段
  if (!name.value || name.value.length < 3) {
    alert('请输入有效的姓名（至少3个字符）')
    return
  }
  if (!isValidEmail(email.value)) {
    alert('请输入有效的邮箱地址')
    return
  }
  if (!isValidPassword(password.value)) {
    alert('密码强度不够，请确保包含大小写字母和数字，且长度至少为8位')
    return
  }
  if (password.value !== confirmPassword.value) {
    alert('两次输入的密码不一致')
    return
  }
  if (age.value < 1 || age.value > 100) {
    alert('年龄必须在1到100岁之间')
    return
  }
  if (!role.value) {
    alert('请选择用户角色')
    return
  }

  try {
    // 使用Firebase Authentication注册用户
    const userCredential = await authStore.register(email.value, password.value)
    const user = userCredential

    // 更新用户资料
    await updateProfile(user, {
      displayName: name.value
    })

    // 将用户信息保存到Firestore
    await setDoc(doc(db, 'users', user.uid), {
      name: name.value,
      email: email.value,
      age: parseInt(age.value),
      role: role.value,
      language: language.value || 'en',
      registeredAt: new Date().toISOString()
    })

    alert('注册成功！')
    router.push('/dashboard')
  } catch (error) {
    console.error('Registration failed:', error)
    // 错误会通过store显示
  }
}
</script>

<style scoped>
.container {
  max-width: 500px;
}
</style>

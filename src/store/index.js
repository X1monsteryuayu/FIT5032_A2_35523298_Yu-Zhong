import { defineStore } from 'pinia'
import { auth } from '@/firebase/config'
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    initialized: false  // 添加初始化标志
  }),
  
  actions: {
    setUser(user) {
      console.log('设置用户状态:', user)
      this.user = user
      this.isAuthenticated = !!user
      console.log('认证状态更新:', {
        user: this.user,
        isAuthenticated: this.isAuthenticated
      })
    },
    
    setLoading(loading) {
      this.loading = loading
    },
    
    setError(error) {
      this.error = error
    },
    
    initializeAuth() {
      // 如果已经初始化过，直接返回当前用户
      if (this.initialized) {
        console.log('认证已初始化，返回当前用户:', !!this.user);
        return Promise.resolve(this.user);
      }
      
      return new Promise((resolve) => {
        console.log('开始初始化Firebase认证状态...');
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          console.log('Firebase认证状态变化:', !!user);
          
          // 只在第一次初始化时设置用户状态
          if (!this.initialized) {
            this.setUser(user);
            this.initialized = true;
            resolve(user);
          }
          
          // 取消监听器，避免后续干扰
          unsubscribe();
        });
      });
    },
    
    async login(email, password) {
      try {
        this.setLoading(true)
        this.setError(null)
        console.log('开始Firebase登录:', email)
        
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        console.log('Firebase登录成功:', userCredential.user)
        
        // 直接设置用户状态，不依赖onAuthStateChanged
        this.setUser(userCredential.user)
        this.initialized = true
        
        return userCredential.user
      } catch (error) {
        console.error('Firebase登录错误:', error)
        
        // 如果是配置错误，提供更友好的错误信息
        if (error.code === 'auth/configuration-not-found') {
          this.setError('Firebase Authentication未配置。请确保在Firebase控制台中启用了Authentication服务。')
        } else if (error.code === 'auth/user-not-found') {
          this.setError('用户不存在，请先注册。')
        } else if (error.code === 'auth/wrong-password') {
          this.setError('密码错误。')
        } else if (error.code === 'auth/invalid-email') {
          this.setError('邮箱格式不正确。')
        } else {
          this.setError(error.message)
        }
        throw error
      } finally {
        this.setLoading(false)
      }
    },
    
    async register(email, password) {
      try {
        this.setLoading(true)
        this.setError(null)
        console.log('开始Firebase注册:', email)
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        console.log('Firebase注册成功:', userCredential.user)
        
        this.setUser(userCredential.user)
        return userCredential.user
      } catch (error) {
        console.error('Firebase注册错误:', error)
        
        // 如果是配置错误，提供更友好的错误信息
        if (error.code === 'auth/configuration-not-found') {
          this.setError('Firebase Authentication未配置。请确保在Firebase控制台中启用了Authentication服务。')
        } else if (error.code === 'auth/email-already-in-use') {
          this.setError('该邮箱已被注册，请使用其他邮箱或直接登录。')
        } else if (error.code === 'auth/weak-password') {
          this.setError('密码太弱，请使用至少6位字符。')
        } else if (error.code === 'auth/invalid-email') {
          this.setError('邮箱格式不正确。')
        } else {
          this.setError(error.message)
        }
        throw error
      } finally {
        this.setLoading(false)
      }
    },
    
    async logout() {
      try {
        await signOut(auth)
        this.setUser(null)
      } catch (error) {
        this.setError(error.message)
        throw error
      }
    }
  },
  
  getters: {
    getCurrentUser: (state) => state.user,
    getIsAuthenticated: (state) => {
      const isAuth = state.isAuthenticated && !!state.user;
      console.log('检查认证状态:', {
        isAuthenticated: state.isAuthenticated,
        hasUser: !!state.user,
        result: isAuth
      });
      return isAuth;
    }
  }
})

export const useAppStore = defineStore('app', {
  state: () => ({
    isOnline: navigator.onLine,
    offlineData: JSON.parse(localStorage.getItem('offlineData')) || [],
    doctors: [],
    appointments: []
  }),
  
  actions: {
    setOnlineStatus(status) {
      this.isOnline = status
      if (status && this.offlineData.length > 0) {
        this.syncOfflineData()
      }
    },
    
    addOfflineData(data) {
      this.offlineData.push({
        ...data,
        timestamp: Date.now()
      })
      localStorage.setItem('offlineData', JSON.stringify(this.offlineData))
    },
    
    async syncOfflineData() {
      try {
        console.log('同步离线数据:', this.offlineData)
        this.offlineData = []
        localStorage.removeItem('offlineData')
      } catch (error) {
        console.error('同步离线数据失败:', error)
      }
    },
    
    // 生成模拟医生数据
    generateDoctors() {
      const specialties = ['内科', '外科', '儿科', '妇科', '骨科', '眼科', '皮肤科', '心理科']
      const hospitals = ['北京协和医院', '上海华山医院', '广州中山医院', '深圳人民医院']
      const names = ['张医生', '李医生', '王医生', '刘医生', '陈医生', '杨医生', '赵医生', '孙医生']
      
      this.doctors = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: names[Math.floor(Math.random() * names.length)] + (i + 1),
        specialty: specialties[Math.floor(Math.random() * specialties.length)],
        hospital: hospitals[Math.floor(Math.random() * hospitals.length)],
        rating: (Math.random() * 2 + 3).toFixed(1),
        experience: Math.floor(Math.random() * 20) + 5
      }))
    },
    
    // 生成模拟预约数据
    generateAppointments() {
      this.appointments = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        doctorName: '张医生' + (i + 1),
        date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        time: ['09:00', '10:00', '14:00', '15:00'][Math.floor(Math.random() * 4)],
        status: ['已预约', '已完成', '已取消'][Math.floor(Math.random() * 3)],
        type: '门诊'
      }))
    }
  }
})


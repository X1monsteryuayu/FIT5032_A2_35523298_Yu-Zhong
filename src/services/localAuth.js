// 简单的本地认证服务
class LocalAuthService {
  constructor() {
    this.users = JSON.parse(localStorage.getItem('localUsers') || '{}')
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')
    this.listeners = []
  }

  // 模拟Firebase的onAuthStateChanged
  onAuthStateChanged(callback) {
    this.listeners.push(callback)
    setTimeout(() => callback(this.currentUser), 0)
    
    return () => {
      const index = this.listeners.indexOf(callback)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  // 通知所有监听器
  notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentUser))
  }

  // 注册新用户
  async register(email, password, additionalData = {}) {
    if (this.users[email]) {
      throw new Error('用户已存在')
    }

    const user = {
      uid: 'local_' + Date.now(),
      email,
      displayName: additionalData.displayName || null,
      emailVerified: true,
      createdAt: new Date().toISOString(),
      ...additionalData
    }

    this.users[email] = {
      password,
      user
    }

    localStorage.setItem('localUsers', JSON.stringify(this.users))
    
    this.currentUser = user
    localStorage.setItem('currentUser', JSON.stringify(user))
    
    this.notifyListeners()
    return { user }
  }

  // 用户登录
  async login(email, password) {
    const userData = this.users[email]
    
    if (!userData || userData.password !== password) {
      throw new Error('邮箱或密码错误')
    }

    this.currentUser = userData.user
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser))
    
    this.notifyListeners()
    return { user: this.currentUser }
  }

  // 用户登出
  async logout() {
    this.currentUser = null
    localStorage.removeItem('currentUser')
    this.notifyListeners()
  }

  // 更新用户信息
  async updateProfile(user, profile) {
    if (profile.displayName !== undefined) {
      user.displayName = profile.displayName
      
      // 更新存储的用户信息
      const userData = this.users[user.email]
      if (userData) {
        userData.user.displayName = profile.displayName
        this.users[user.email] = userData
        localStorage.setItem('localUsers', JSON.stringify(this.users))
      }
      
      this.currentUser = user
      localStorage.setItem('currentUser', JSON.stringify(user))
    }
  }

  // 获取当前用户
  getCurrentUser() {
    return this.currentUser
  }
}

export const localAuth = new LocalAuthService()

// 导出认证方法
export const signInWithEmailAndPassword = async (auth, email, password) => {
  return await localAuth.login(email, password)
}

export const createUserWithEmailAndPassword = async (auth, email, password) => {
  return await localAuth.register(email, password)
}

export const signOut = async (auth) => {
  return await localAuth.logout()
}

export const onAuthStateChanged = (auth, callback) => {
  return localAuth.onAuthStateChanged(callback)
}

export const updateProfile = async (user, profile) => {
  return await localAuth.updateProfile(user, profile)
}

console.log('使用本地认证服务')

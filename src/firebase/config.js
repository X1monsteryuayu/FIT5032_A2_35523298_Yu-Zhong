import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'
import { getStorage, connectStorageEmulator } from 'firebase/storage'

// Firebase 配置
const firebaseConfig = {
  apiKey: "AIzaSyBVe5MCasOxhuTVAO5mTdRGaw2FBBgdc94",
  authDomain: "a3-yu-zhong.firebaseapp.com",
  projectId: "a3-yu-zhong",
  storageBucket: "a3-yu-zhong.firebasestorage.app",
  messagingSenderId: "739795054099",
  appId: "1:739795054099:web:1e84da0b5c35a8510019e6"
}

// 初始化 Firebase
const app = initializeApp(firebaseConfig)

// 初始化服务
export const auth = getAuth(app)
export const db = getFirestore(app)
export const functions = getFunctions(app)
export const storage = getStorage(app)

// 设置Authentication语言为中文
auth.languageCode = 'zh-CN'

// 开发环境配置（可选）
if (process.env.NODE_ENV === 'development') {
  // 如果需要使用Firebase模拟器，可以取消注释下面的代码
  // try {
  //   connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
  //   connectFirestoreEmulator(db, 'localhost', 8080)
  //   connectFunctionsEmulator(functions, 'localhost', 5001)
  //   connectStorageEmulator(storage, 'localhost', 9199)
  // } catch (error) {
  //   console.log('Firebase emulator connection failed:', error)
  // }
}

console.log('Firebase initialized with project:', firebaseConfig.projectId)

export default app

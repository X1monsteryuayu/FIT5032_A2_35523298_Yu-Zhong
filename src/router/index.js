import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store';
import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import Dashboard from '../pages/Dashboard.vue';
import HealthArticles from '../pages/HealthArticles.vue';
import DoctorRating from '../pages/DoctorRating.vue';
import AdminPanel from '../pages/AdminPanel.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/home', redirect: '/' },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { 
    path: '/health-articles', 
    name: 'HealthArticles', 
    component: HealthArticles,
    meta: { requiresAuth: false }
  },
  { 
    path: '/admin/dashboard', 
    name: 'AdminDashboard', 
    component: () => import('../pages/admin/Dashboard.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  { 
    path: '/doctor-rating', 
    name: 'DoctorRating', 
    component: DoctorRating,
    meta: { 
      requiresAuth: false,
      requiresAuthForActions: true  // 只有登录用户才能评分
    }
  },
  { 
    path: '/resources', 
    name: 'Resources', 
    component: () => import('../pages/Resources.vue'),
    meta: { 
      requiresAuth: false,
      requiresAuthForActions: true
    }
  },
  { 
    path: '/consultation', 
    name: 'Consultation', 
    component: () => import('../pages/Consultation.vue'),
    meta: { requiresAuth: true }
  },
  { 
    path: '/contact', 
    name: 'Contact', 
    component: () => import('../pages/Contact.vue')
  },
  { 
    path: '/email-demo', 
    name: 'EmailDemo', 
    component: () => import('../pages/EmailDemo.vue')
  },
  { 
    path: '/doctors', 
    name: 'DoctorList', 
    component: () => import('../pages/DoctorList.vue')
  },
  { 
    path: '/appointments', 
    name: 'AppointmentHistory', 
    component: () => import('../pages/AppointmentHistory.vue'),
    meta: { requiresAuth: true }
  },
  { 
    path: '/admin/resources', 
    name: 'AdminResources', 
    component: () => import('../pages/admin/ResourceManagement.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  { 
    path: '/admin/ratings', 
    name: 'AdminRatings', 
    component: () => import('../pages/admin/RatingOverview.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/users',
    name: 'UserManagement',
    component: () => import('../pages/admin/UserManagement.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/settings',
    name: 'Settings',
    component: () => import('../pages/admin/Settings.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  { path: '/admin', name: 'AdminPanel', component: AdminPanel, meta: { requiresAuth: true, requiresAdmin: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  console.log('路由守卫检查:', {
    to: to.path,
    isAuthenticated: isAuthenticated,
    requiresAuth: to.meta.requiresAuth
  });

  // 如果用户已认证，但尝试访问登录页，则重定向到仪表板
  if (isAuthenticated && to.path === '/login') {
    console.log('用户已认证，重定向到仪表板');
    next({ path: '/dashboard' });
    return;
  }

  // 检查是否需要认证的路由
  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log('需要认证的路由，重定向到登录页');
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
    return;
  }

  console.log('允许访问:', to.path);
  next();
});

export default router;

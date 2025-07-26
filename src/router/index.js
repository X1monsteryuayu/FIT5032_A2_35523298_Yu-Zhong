import { createRouter, createWebHistory } from 'vue-router';
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
  const userInfo = localStorage.getItem('userInfo');
  const isAuthenticated = !!userInfo;
  const userRole = userInfo ? JSON.parse(userInfo).role : null;

  // Check for admin routes
  if (to.meta.requiresAdmin && userRole !== 'admin') {
    next('/dashboard');
    return;
  }

  // Check for protected routes
  if (to.meta.requiresAuth === true && !isAuthenticated) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
    return;
  }

  // Allow access to public routes
  next();
});

export default router;

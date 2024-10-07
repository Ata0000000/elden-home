import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AboutView from '../views/AboutView.vue';
import LoginView from '../views/LoginView.vue';
import AccessDeniedView from '../views/DeniedView.vue';
import RatingView from '../views/RatingView.vue';
import AdminView from '../views/AdminView.vue';
import FirebaseSigninView from '@/views/FirebaseSigninView.vue';
import FirebaseRegisterView from '@/views/FirebaseRegisterView.vue'
import AdminEmailView from '@/views/AdminEmailView.vue';
const routes = [
  {
    path: '/admin-email',
    name: 'AdminEmail',
    component: AdminEmailView,
    beforeEnter: (to, from, next) => {
      const isAdmin = localStorage.getItem('isAdmin') === 'true';
      if (isAdmin) {
        next();
      } else {
        next('/access-denied');
      }
    }
  },
  {
    path: '/FireRegister',
    name: 'FireRegister',
    component: FirebaseRegisterView
  },
  {
    path: '/FireLogin',
    name:'FireLogin',
    component:FirebaseSigninView
  },
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/rating',
    name: 'Rating',
    component: RatingView,
    key: (route) => route.fullPath
  },

  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
    beforeEnter: (to, from, next) => {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const currentUser = users.find(user => user.username === localStorage.getItem('username'));
      
      if (currentUser && currentUser.isAdmin) {
        next();
      } else {
        next('/access-denied'); // 如果不是管理员，重定向到拒绝访问页面
      }
    }
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
   
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/access-denied',
    name: 'AccessDenied',
    component: AccessDeniedView
  },
  {
    path: '/interactive-tables',
    name: 'InteractiveTables',
    component: InteractiveTables
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});


router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (to.name === 'About' && !isAuthenticated) {
    next('/login');  // 如果未登录，跳转到登录页面
  } else {
    next();  // 允许导航到目标页面
  }
});

  

export default router;
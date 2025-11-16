import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue';
import { isAuthenticated } from '@/services/authApi';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
      component: () => import('@/views/LoginPage.vue'),
      meta: {guestOnly: true}
  },
  {
    path: '/register',
    component: () => import ('@/views/RegisterPage.vue'),
    meta: {guestOnly: true}
  },

  {
    path: '/tabs/',
    component: TabsPage,
    meta: {requiresAuth: true},
    children: [
      {
        path: '',
        redirect: '/tabs/home'
      },
      {
        path: 'home',
        component: () => import('@/views/LandingPage.vue')
      },
      {
        path: 'myfridge',
        component: () => import('@/views/MyFridgePage.vue')
      },
      {
        path: 'settings',
        component: () => import('@/views/SettingsPage.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
    const loggedIn = isAuthenticated();
    if (to.meta.requiresAuth && !loggedIn) {
        next('/login');
    } else if (to.meta.guestOnly && loggedIn) {
        next('/tabs/home');
    } else {
        next();
    }
});

export default router

import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue';
import { isAuthenticated, getUserPlan } from '@/services/authApi';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/home'
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
        path:'/home',
        component: () => import ('@/views/DisconnectedHomePage.vue'),
        meta: {guestOnly: true}
    },
    {
        path:'/pricing',
        component: () => import ('@/views/PricingPage.vue'),
        meta: {guestOnly: true}
    },
    {
        path:'/dashboard',
        component: () => import ('@/views/DashboardPage.vue'),
        meta: {requiresAuth: true, role: 'ADMIN'}
    },
    {
        path: '/legal',
        component: () => import ('@/views/LegalPage.vue'),
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
            path: 'landing',
            component: () => import('@/views/LandingPage.vue')
        },
        {
            path: 'myfridge',
            component: () => import('@/views/MyFridgePage.vue')
        },
        {
            path: 'settings',
            component: () => import('@/views/SettingsPage.vue')
        },
        {
            path: 'home',
            component: () => import('@/views/ConnectedHomePage.vue')
        },

        {
            path:'favorites',
            component: () => import('@/views/FavoritesPage.vue')
        },
        {
            path:'recipes',
            component:() => import('@/views/RecipesPage.vue')
        },
        {
            path:'shopping',
            component: () => import('@/views/ShoppingPage.vue')
        },
        {
            path:'pricing',
            component:() => import('@/views/PricingPage.vue')
        },
        ]
    }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
    const loggedIn = isAuthenticated();
    const userRole = getUserPlan();

    if (to.meta.requiresAuth && !loggedIn) {
        return next('/login');
    }

    if (to.meta.requiresAuth && !loggedIn) {
        if (userRole === 'ADMIN') {
            return next('/dashboard')
        }
        return next('/tabs/home')
    }

    if (loggedIn) {
        if (userRole === 'ADMIN') {
            if(to.path !== '/dashboard') {
                return next('/dashboard');
            }
        }
        else {
            if(to.meta.role === 'ADMIN' || to.path === '/dashboard') {
                return next('/tabs/home');
            }
        }
    }
    next()
});

export default router

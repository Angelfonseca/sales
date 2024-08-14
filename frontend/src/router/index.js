import { createRouter, createWebHistory } from 'vue-router';
import { useRouter } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    
    {
      path: '/',
      name: 'home',
      component: HomeView, 
    },
    {
      path: '/login',
      name: 'login',
      component:() => import ('../views/LoginView.vue') ,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'), 
    },
    {
      path: '/rents',
      name: 'rents',
      component: () => import('../views/RentsView.vue'), 
    },
    {
      path: '/adding',
      name: 'adding',
      component: () => import('../views/AddingDress.vue'),
    },
    {
      path: '/selling',
      name: 'selling',
      component: () => import('../views/SellView.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
    },
    {
      path: '/jewelry',
      name: 'jewelry',
      component: () => import('../views/JewerlyView.vue'),
    }
  ],
});
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (token) {
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = tokenData.exp * 1000;
    if (Date.now() > expirationTime) {
      localStorage.removeItem('token');
      if (to.path !== '/login') {
        return next('/login');
      }
    }
  }
  next();
});
export function Logged() {
  const router = useRouter();
  const isAuth = window.localStorage.getItem('token');

  if (!isAuth) {
    router.push('/');
  };
}
export default router;


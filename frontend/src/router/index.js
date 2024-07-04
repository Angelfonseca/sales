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
  ],
});
export function Logged() {
  const router = useRouter();
  const isAuth = window.localStorage.getItem('credit-token');

  if (!isAuth) {
    router.push('/');
  };
}
export default router;


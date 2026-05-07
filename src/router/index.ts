// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/login.vue'
import Register from '../views/register.vue'
import Home from '../views/home.vue'
import Jour from '../views/jour.vue'
import Picture from '../views/picture.vue'
import My from '../views/my.vue'
import MapView from '../views/map.vue'
import Mytravel from '../components/jour/mytravel.vue'
import Sanya from '../components/picture/sanya.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login, name: 'Login' },
    { path: '/register', component: Register, name: 'Register' },
    { path: '/home', component: Home, name: 'Home', meta: { requiresAuth: true } },
    { path: '/jour', component: Jour, name: 'Jour', meta: { requiresAuth: true } },
    { path: '/picture', component: Picture, name: 'Picture', meta: { requiresAuth: true } },
    { path: '/my', component: My, name: 'My', meta: { requiresAuth: true } },
    { path: '/map', component: MapView, name: 'Map', meta: { requiresAuth: true } },
    { path: '/mytravel', component: Mytravel, name: 'MyTravel', meta: { requiresAuth: true } },
    { path: '/picture/sanya', component: Sanya, name: 'Sanya', meta: { requiresAuth: true } },
  ]
})

router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    return '/login'
  }
})

export default router

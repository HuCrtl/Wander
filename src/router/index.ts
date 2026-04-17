// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/login.vue'
import Home from '../views/home.vue'
import Jour from '../views/jour.vue'
import Picture from '../views/picture.vue'
import My from '../views/my.vue'
import Mytravel from '../components/jour/mytravel.vue'
import Sanya from '../components/picture/sanya.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login, name: 'Login' },
    { path: '/home', component: Home, name: 'Home' },
    { path: '/jour', component: Jour, name: 'Jour' },
    { path: '/picture', component: Picture, name: 'Picture' },
    { path: '/my', component: My, name: 'My' },
    { path: '/mytravel', component: Mytravel, name: 'MyTravel' },
    { path: '/picture/sanya', component: Sanya, name: 'Sanya' },
  ]
})

export default router
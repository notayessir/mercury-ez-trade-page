import { createRouter, createWebHistory } from 'vue-router'


import Trade from '../components/Trade.vue'
import Account from '../components/Account.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    
    {
      path: '/',
      name: 'Trade',
      component: Trade
    },
    {
      path: '/account',
      name: 'account',
      component: Account
    }
   
  ]
})

export default router

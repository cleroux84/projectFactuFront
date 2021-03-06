import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import CustomerList from "../components/CustomerList";
import UserHome from "../components/UserHome";
import BillList from "../components/BillList";
import {authGuard} from "../auth/authGuard";
import Profile from "../components/Profile";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: UserHome
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    beforeEnter: authGuard
  },

  {
    path: '/customerList',
    name: 'CustomerList',
    component: CustomerList,
    beforeEnter: authGuard
  },
  {
    path: '/billList',
    name: 'BillList',
    component: BillList,
    beforeEnter: authGuard
  },

  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})



export default router

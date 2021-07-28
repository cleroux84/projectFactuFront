import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import CustomerList from "../components/CustomerList";
// import BillList from "../components/BillList";
import UserHome from "../components/UserHome";
import BillList from "../components/BillList";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: UserHome
  },
  {
    path: '/customerList',
    name: 'CustomerList',
    component: CustomerList
  },
  {
    path: '/billList',
    name: 'BillList',
    component: BillList
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
  routes
})



export default router

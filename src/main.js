import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
// import axios from 'axios'
// import VueAxios from 'vue-axios'
import './plugins/axios'

Vue.config.productionTip = false

// Vue.use(VueAxios, axios)
// const ax = axios.create({
//   baseURL: 'http://localhost:9000',
// });

// Alter defaults after instance has been created
// instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;
export const bus = new Vue();
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

// export default ax;
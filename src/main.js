import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import './plugins/axios'
import { domain, clientId, audience } from "../auth_config.json";
import { Auth0Plugin } from "./auth";

Vue.use(Auth0Plugin, {
  domain,
  clientId,
  audience,
  onRedirectCallback: appState => {
    router.push(
        appState && appState.targetUrl
            ? appState.targetUrl
            : window.location.pathname
    );
  }
});

Vue.config.productionTip = false

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
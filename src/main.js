import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import './plugins/axios'
import { domain, clientId, audience } from "../auth_config.json";
import {Auth0Plugin/*, getInstance*/} from "./auth";
import VuetifYConfirm from "vuetify-confirm";

Vue.use(VuetifYConfirm, {
  vuetify,
  buttonTrueText: 'Valider',
  buttonFalseText: 'Annuler',
  buttonTrueColor: 'white',
  buttonFalseColor: 'red',
  buttonTrueFlat: false,
  buttonFalseFlat: true,
  color: 'red',
  title: 'Attention',
  width: 500,
  property: '$confirm'
})

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

// https://community.auth0.com/t/the-prototype-this-auth-in-vue-main-js-always-null/31993/3
//  const instance = getInstance();

// instance.$watch("loading", async loading => {
//   if (!loading && instance.isAuthenticated) {
//     const token = await instance.getTokenSilently();
//     console.log(token);
//   }
// });

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
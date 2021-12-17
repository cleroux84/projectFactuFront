import axios from "axios";
import Vue from 'vue'


export let config = {
    baseURL: 'http://localhost:9000'
    // baseURL: 'https://hidden-sierra-81724.herokuapp.com/'
}

export const _axios = axios.create(config);

Plugin.install =function(Vue) {
    Vue.axios = _axios;
    window.axios = _axios;
    Object.defineProperties(Vue.prototype, {
        axios: {
            get() {
                return _axios;
            }
        },
        $axios: {
            get() {
                return _axios;
            }
        },
    });
};

Vue.use(Plugin)

export default Plugin;

// _axios.interceptors.request.use(async (config) => {
//     const token = await this.$auth.getTokenSilently();
//     config.headers['Authorization'] = `Bearer ${token}`;
//     return config;
// }, (error) => {
//     return Promise.reject(error);
// });

// _axios.interceptors.request.use(
//     function(config) {
//         let csrfToken = Vue.$cookies.get("PLAY_CSRF_TOKEN");
//         let jwt = Vue.ls.get("jwt")
//         let headers = {}
//
//         if(jwt !== null && jwt !== undefined && jwt !== "")
//             headers['`Bearer ${accessToken}`'] = jwt
//         else
//             headers['Csrf-Token'] = csrfToken;
//         config.headers = headers
//         return config;
//     },
//     function(error) {
//         return Promise.reject(error)
//     }
// )


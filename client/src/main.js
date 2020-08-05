import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueCookies from "vue-cookies";
import axios from "axios";
Vue.config.productionTip = false;
Vue.use(VueCookies);

// Add a request interceptor
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers.authorization = token;
  return config;
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

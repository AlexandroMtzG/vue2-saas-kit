import Vue from "vue";
import App from "./App.vue";
import "./assets/css/index.css";
import "./registerServiceWorker";
import router from "./router";
import store from "@/store";
import i18n from "@/locale/i18n";
import "@/plugins/logging";
import "@/plugins/directives";

Vue.config.productionTip = false;
new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

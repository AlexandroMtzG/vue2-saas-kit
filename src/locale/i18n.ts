import Vue from "vue";
import VueI18n from "vue-i18n";
import en from "./en-US.json";
import es from "./es-MX.json";

Vue.use(VueI18n);

const locale = localStorage.getItem("locale") ?? process.env.VUE_APP_LANGUAGE?.toString();
export default new VueI18n({
  locale,
  fallbackLocale: locale,
  messages: {
    en,
    es,
  },
  silentFallbackWarn: true,
});

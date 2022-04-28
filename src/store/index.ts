import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";
import createLogger from "vuex/dist/logger";
import createPersistedState from "vuex-persistedstate";

// Modules
import { theme } from "./modules/themeState";
import { pricing } from "./modules/pricingState";
import { auth } from "./modules/authState";
import { app } from "./modules/appState";
import { account } from "./modules/accountState";
import { tenant } from "./modules/tenantState";
import { RootState } from "./types";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

const store: StoreOptions<RootState> = {
  modules: {
    account,
    auth,
    tenant,
    pricing,
    theme,
    app,
  },
  strict: debug,
  plugins: debug ? [createLogger(), createPersistedState()] : [createPersistedState()],
};

export default new Vuex.Store<RootState>(store);

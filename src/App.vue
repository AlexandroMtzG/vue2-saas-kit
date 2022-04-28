<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import store from "./store";
import { Theme } from "./application/enums/shared/Theme";

@Component({
  metaInfo: {
    titleTemplate: "%s | Vue2 SaasFrontend"
  },
})
export default class App extends Vue {
  mounted() {
    const htmlClasses = document.querySelector("html")?.classList;
    if (this.currentTheme === 0) {
      htmlClasses?.remove("dark");
    } else {
      htmlClasses?.add("dark");
    }
  }
  get currentTheme(): Theme {
    return store.state?.theme?.theme ?? Theme.LIGHT;
  }
}
</script>

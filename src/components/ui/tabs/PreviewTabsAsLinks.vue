<template>
  <div class="space-y-2 w-full">
    <Tabs
      class="w-full sm:w-auto"
      :tabs="[{ name: 'Home', routePath: '/' },
      { name: 'Components', routePath: currentRoute }]"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Tabs from "./Tabs.vue";

@Component({
  components: {
    Tabs
  },
})
export default class PreviewTabsAsLinks extends Vue {
  get currentRoute() {
    return this.$route.path;
  }
}
</script>
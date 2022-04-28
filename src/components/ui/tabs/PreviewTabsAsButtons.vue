<!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
<template>
  <div class="space-y-2 w-full">
    <Tabs
      :asLinks="false"
      @selected="selectedTab"
      class="w-full sm:w-auto"
      :tabs="[{ name: 'Tab 1' }, { name: 'Tab 2' }, { name: 'Tab 3' }]"
    />
    <div class="p-2 bg-gray-100 border border-gray-300">
      <div v-if="currentTab === 0">Tab 1 Content...</div>
      <div v-if="currentTab === 1">Tab 2 Content...</div>
      <div v-if="currentTab === 2">Tab 3 Content...</div>
    </div>
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
export default class PreviewTabsAsButtons extends Vue {
  currentTab = 0;
  selectedTab(idx) {
    this.currentTab = idx;
  }
}
</script>
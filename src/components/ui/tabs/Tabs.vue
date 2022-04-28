<template>
  <div>
    <div class="sm:hidden">
      <label for="tabs" class="sr-only">{{ $t("app.shared.tabs.select") }}</label>
      <select
        id="tabs"
        name="tabs"
        class="block w-full focus:ring-theme-500 focus:border-theme-500 border-gray-300 rounded-sm"
        @change="selectTab(Number($event.target.value))"
      >
        <option
          v-for="(tab, idx) in tabs"
          :key="tab.name"
          :selected="isCurrent(idx)"
          :value="idx"
        >{{ tab.name }}</option>
      </select>
    </div>
    <div class="hidden sm:block">
      <nav class="flex space-x-4" aria-label="Tabs" v-if="asLinks">
        <router-link
          v-for="(tab, idx) in tabs"
          :key="tab.name"
          :to="getRoute(tab)"
          class="truncate border"
          :class="[isCurrent(idx) ? 'bg-theme-100 text-theme-700 border border-theme-200' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50', 'px-3 py-2 font-medium text-sm rounded-sm border-transparent']"
          :aria-current="isCurrent(idx) ? 'page' : undefined"
        >{{ tab.name }}</router-link>
      </nav>
      <nav v-else class="flex space-x-4" aria-label="Tabs">
        <button
          type="button"
          v-for="(tab, idx) in tabs"
          :key="idx"
          @click="selectTab(idx)"
          class="truncate border"
          :class="[isCurrent(idx) ? 'bg-theme-100 text-theme-700 border border-theme-200' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50', 'px-3 py-2 font-medium text-sm rounded-sm border-transparent']"
        >{{ tab.name }}</button>
      </nav>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";

export interface TabItem {
  name: any;
  routeName?: string;
  routePath?: string;
  routeParams?: any;
}

@Component({})
export default class Tabs extends Vue {
  @Prop({}) tabs!: TabItem[];
  @Prop({ default: true }) asLinks!: boolean;
  selected = 0;
  selectTab(idx) {
    const tab = this.tabs[idx];
    if (this.asLinks) {
      if (tab?.routeName) {
        this.$router.push({ name: tab.routeName, params: tab.routeParams });
      } else if (tab?.routePath) {
        this.$router.push(tab.routePath);
      }
    } else {
      this.selected = idx;
      this.$emit("selected", idx);
    }
  }
  isCurrent(idx: number) {
    return this.currentTab === this.tabs[idx];
  }
  getRoute(tab: TabItem) {
    return tab.routePath ??
    {
      name: tab.routeName,
      params: tab.routeParams,
    }
  }
  get currentTab() {
    if (this.asLinks) {
      return this.tabs.find((element) =>
        (element.routeName && this.$route.name === element.routeName)
        || (element.routePath && this.$route.path === element.routePath));
    } else {
      return this.tabs[this.selected]
    }
  }
}
</script>

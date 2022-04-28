<template>
  <div class="space-y-2 w-full">
    <Breadcrumb
      class="w-full"
      home="/"
      :menu="[{ title: $t('shared.home'), routePath: '/' },
      { title: $t('admin.components.title'), routePath: currentRoute },
      { title: 'Breadcrumbs' }]"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Breadcrumb from "./Breadcrumb.vue";

@Component({
  components: {
    Breadcrumb
  },
})
export default class PreviewBreadcrumbs extends Vue {
  get currentRoute() {
    return this.$route.path;
  }
}
</script>
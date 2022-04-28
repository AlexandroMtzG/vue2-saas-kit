<template>
  <AppLayout layout="admin"></AppLayout>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import AppLayout from "@/components/app/AppLayout.vue";
import i18n from '@/locale/i18n';

@Component({
  metaInfo: {
    title: i18n.t('app.sidebar.admin').toString(),
    titleTemplate: "%s | Vue2 SaasFrontend"
  },
  components: {
    AppLayout
  }
})
export default class AppIndex extends Vue {
}
</script>
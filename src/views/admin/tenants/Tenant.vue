<template>
  <div>
    <Breadcrumb
      home="/admin"
      :menu="[{ title: $t('models.tenant.plural'), routePath: '/admin/tenants' }]"
    ></Breadcrumb>
    <div class="bg-white shadow-sm border-b border-gray-300 w-full py-3 px-8 h-13">
      <div class="mx-auto max-w-5xl xl:max-w-7xl flex items-center justify-between">
        <Tabs :asLinks="false" :tabs="tabs" @selected="selectedTab" class="flex-grow" />
      </div>
    </div>
    <div>
      <TenantProfile v-if="selected === 0" :id="id" />
      <TenantSubscription v-if="selected === 1" :id="id" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Breadcrumb from "@/components/ui/breadcrumbs/Breadcrumb.vue";
import Tabs, { TabItem } from "@/components/ui/tabs/Tabs.vue"
import TenantProfile from "@/components/core/tenants/TenantProfile.vue"
import TenantSubscription from "@/components/core/tenants/TenantSubscription.vue"
import i18n from '@/locale/i18n';

@Component({
  metaInfo: {
    title: i18n.t("models.tenant.object").toString(),
  },
  components: {
    Breadcrumb,
    Tabs,
    TenantProfile,
    TenantSubscription
  },
})
export default class Tenant extends Vue {
  tabs: TabItem[] = [];
  selected = 0;
  id = "";
  created() {
    this.id = this.$route.params.id;
  }
  mounted() {
    this.tabs = [
      {
        name: this.$t("admin.tenants.profile.title"),
      },
      {
        name: this.$t("admin.tenants.subscription.title"),
      },
    ];
  }
  selectedTab(idx) {
    this.selected = idx;
  }
}
</script>

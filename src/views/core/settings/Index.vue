<template>
  <div>
    <div class="bg-white shadow-sm border-b border-gray-300 w-full py-2">
      <div
        class="mx-auto max-w-5xl xl:max-w-7xl flex space-x-3 items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <Tabs :tabs="tabs" class="flex-grow" />
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Tabs, { TabItem } from "@/components/ui/tabs/Tabs.vue"
import i18n from '@/locale/i18n';

@Component({
  metaInfo: {
    title: i18n.t("app.navbar.settings").toString()
  },
  components: {
    Tabs,
  },
})
export default class Contracts extends Vue {
  tabs: TabItem[] = [];
  mounted() {
    if (this.$route.name?.toString() === "settings") {
      this.$router.push("/app/settings/profile");
    }
    this.tabs = [
      {
        name: this.$t("settings.profile.profileTitle"),
        routePath: "/app/settings/profile",
      },
      {
        name: this.$t("models.workspace.plural"),
        routePath: "/app/settings/workspaces",
      },
      {
        name: this.$t("settings.members.title"),
        routePath: "/app/settings/members",
      },
      {
        name: this.$t("settings.subscription.title"),
        routePath: "/app/settings/subscription",
      },
      {
        name: this.$t("settings.tenant.title"),
        routePath: "/app/settings/tenant",
      },
    ];
  }
}
</script>

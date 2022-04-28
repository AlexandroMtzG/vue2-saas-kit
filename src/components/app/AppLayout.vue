<template>
  <div>
    <StackedLayout v-if="currentLayout === 1" :layout="layout" @addTenant="addingTenant = true">
      <div>
        <router-view :key="currentWorkspaceId"></router-view>
      </div>
    </StackedLayout>
    <SidebarLayout v-else :layout="layout" @addTenant="addingTenant = true">
      <div>
        <router-view :key="currentWorkspaceId"></router-view>
      </div>
    </SidebarLayout>

    <TenantNew v-if="addingTenant" @close="addingTenant = false" />
    <NewLink ref="newLink" :as-provider="false" :select-type="false" />
    <ErrorModal ref="errorModal" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import SidebarLayout from "@/components/layouts/SidebarLayout.vue";
import StackedLayout from "@/components/layouts/StackedLayout.vue";
import store from "@/store";
import { ApplicationLayout } from "@/application/enums/shared/ApplicationLayout";
import tinyEventBus from "@/plugins/tinyEventBus";
import services from '@/services';
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import TenantNew from "@/components/core/settings/tenant/TenantNew.vue";
import NewLink from "@/components/app/links/pending/NewLink.vue";

@Component({
  components: {
    SidebarLayout,
    StackedLayout,
    TenantNew,
    NewLink,
    ErrorModal
  },
})
export default class AppLayout extends Vue {
  @Prop({}) layout!: string;
  $refs!: {
    newLink: NewLink;
    errorModal: ErrorModal;
  }
  addingTenant = false;

  mounted() {
    services.tenants.getAll();
    services.workspaces.getAllWorkspaces(true)
      .then((response) => {
        if (response.length === 0) {
          this.$refs.errorModal.show(this.$t("app.workspaces.errors.noWorkspaces"), this.$t("app.workspaces.errors.addAtLeastOneWorkspace"))
          this.$router.push("/app/settings/workspaces")
        }
      });

    tinyEventBus().emitter.on("view-pending-invitations", () => {
      this.$router.push("/app/links/pending");
    });
    tinyEventBus().emitter.on("new-provider", () => {
      this.$refs.newLink.show(false, false);
    });
    tinyEventBus().emitter.on("new-client", () => {
      this.$refs.newLink.show(true, false);
    });
    tinyEventBus().emitter.on("new-link", () => {
      this.$refs.newLink.show(true, true);
    });
  }
  beforeDestroy() {
    tinyEventBus().emitter.off("view-pending-invitations");
    tinyEventBus().emitter.off("view-pending-links");
    tinyEventBus().emitter.off("view-links-information");
    tinyEventBus().emitter.off("new-provider");
    tinyEventBus().emitter.off("new-client");
    tinyEventBus().emitter.off("new-link");
  }
  get currentWorkspaceId(): string {
    return store.state.tenant.currentWorkspace?.id ?? "";
  }
  get currentLayout(): ApplicationLayout {
    return store.state.app.layout;
  }
}
</script>

<template>
  <div>
    <div class="py-4 space-y-2 mx-auto max-w-5xl xl:max-w-7xl px-4 sm:px-6 lg:px-8">
      <Loading v-if="loading" />
      <div v-else>
        <div>
          <div class="space-y-2">
            <div class="flex justify-between">
              <div class="flex items-center justify-between w-full space-x-2">
                <div class="relative flex items-center w-full flex-grow">
                  <div
                    class="focus-within:z-10 absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    ref="inputSearch"
                    type="text"
                    name="buscador"
                    id="buscador"
                    class="w-full focus:ring-theme-500 focus:border-theme-500 block rounded-md pl-10 sm:text-sm border-gray-300"
                    :placeholder="$t('shared.searchDot')"
                    v-model="searchInput"
                  />
                </div>

                <router-link
                  to="/app/settings/workspaces/new"
                  class="inline-flex space-x-2 items-center px-2 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-theme-600 hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>

                  <div>{{ $t("shared.new") }}</div>
                </router-link>
              </div>
            </div>
            <div>
              <WorkspacesListAndTable :items="filteredItems" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <ErrorModal ref="errorModal" />
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import { WorkspaceDto } from "@/application/dtos/core/workspaces/WorkspaceDto";
import store from "@/store";
import tinyEventBus from "@/plugins/tinyEventBus";
import services from "@/services";
import Loading from "@/components/ui/loaders/Loading.vue";
// import WarningBanner from "@/components/ui/banners/WarningBanner.vue";
import WorkspacesListAndTable from "@/components/core/workspaces/WorkspacesListAndTable.vue";
import i18n from '@/locale/i18n';

@Component({
  metaInfo: {
    title: i18n.t("models.workspace.plural").toString()
  },
  components: {
    ErrorModal,
    Loading,
    // WarningBanner,
    WorkspacesListAndTable
  },
})
export default class WorkspacesList extends Vue {
  $refs!: {
    errorModal: ErrorModal;
  };
  loading = false;
  searchInput = "";
  mounted() {
    tinyEventBus().emitter.on("workspace-deleted", () => this.reload());
    tinyEventBus().emitter.on("workspace-added", () => this.reload());
    tinyEventBus().emitter.on("workspace-saved", () => this.reload());

    services.tenants.getFeatures();
    this.reload();
  }
  beforeDestroy() {
    tinyEventBus().emitter.off("workspace-deleted");
    tinyEventBus().emitter.off("workspace-added");
    tinyEventBus().emitter.off("workspace-saved");
  }
  async reload() {
    // this.items = [];
    this.loading = true;
    services.workspaces
      .getAllWorkspaces(true)
      .catch((error) => {
        this.$refs.errorModal.show(this.$t("shared.error"), this.$t(error));
      })
      .finally(() => {
        this.loading = false;
      });
  }
  get workspaces() {
    return store.state.tenant.workspaces;
  }
  get filteredItems(): WorkspaceDto[] {
    if (!this.workspaces) {
      return [];
    }
    return this.workspaces.filter((f) => f.id?.toUpperCase().includes(this.searchInput.toUpperCase()) || f.name?.toString().toUpperCase().includes(this.searchInput.toUpperCase()));
  }
}
</script>

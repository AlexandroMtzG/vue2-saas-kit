<template>
  <div>
    <div>
      <div
        v-if="withCurrentPlan"
        class="space-y-2 sm:space-y-0 sm:flex items-center sm:space-x-2 justify-between"
      >
        <h3 class="leading-5 text-gray-900 truncate">
          <span v-if="loading" class="leading-5">{{ $t("shared.loading") }}...</span>
          <span v-else-if="currentProduct">
            {{ $t("settings.subscription.current") }}
            <router-link
              to="/app/settings/subscription"
              class="leading-5 font-bold hover:underline hover:text-theme-600"
            >{{ $t(currentProduct.subscriptionProduct.title) }}</router-link>
          </span>
          <span
            v-else-if="!loading"
            class="ml-1 text-sm leading-5 font-bold text-gray-500"
          >({{ $t("settings.subscription.noActivePlan") }})</span>
        </h3>
      </div>
      <dl
        class="grid gap-5"
        :class="[
          cols,
          {
            'mt-2 ': withCurrentPlan,
          },
        ]"
      >
        <div
          class="bg-white px-4 py-5 border border-gray-300 shadow-md rounded-lg overflow-hidden sm:p-6"
          :class="{
            'bg-rose-50 border-rose-300 hover:bg-rose-100 cursor-pointer': billableStatus(maxLinksRemaining) === 0,
            'bg-yellow-50 border-yellow-300 hover:bg-yellow-100 cursor-pointer': billableStatus(maxLinksRemaining) === 1,
            'bg-white': billableStatus(maxLinksRemaining) === 2,
            'bg-teal-50 border-teal-300 hover:bg-teal-100 cursor-pointer': billableStatus(maxLinksRemaining) === 3,
          }"
        >
          <dt class="text-sm font-medium text-gray-500 truncate">{{ $t("models.link.plural") }}</dt>
          <dd class="mt-1 text-xl font-semibold text-gray-900">
            <span v-if="loading">...</span>
            <span v-else>
              <span v-if="links">{{ links }}</span>
              <span v-else>0</span>
              /
              <span v-if="currentProduct">{{ currentProduct.maxLinks }}</span>
              <span v-else class="text-gray-500">0</span>
            </span>
          </dd>
        </div>

        <router-link
          to="/app/contracts/pending"
          class="bg-white px-4 py-5 border border-gray-300 shadow-md rounded-lg overflow-hidden sm:p-6 hover:bg-gray-50"
          :class="{
            'bg-rose-50 border-rose-300 hover:bg-rose-100 cursor-pointer': billableStatus(maxDocumentsRemaining) === 0,
            'bg-yellow-50 border-yellow-300 hover:bg-yellow-100 cursor-pointer': billableStatus(maxDocumentsRemaining) === 1,
            'bg-white': billableStatus(maxDocumentsRemaining) === 2,
            'bg-teal-50 border-teal-300 hover:bg-teal-100 cursor-pointer': billableStatus(maxDocumentsRemaining) === 3,
          }"
        >
          <dt class="text-sm font-medium text-gray-500 truncate">{{ $t("models.contract.plural") }}</dt>
          <dd class="mt-1 text-xl font-semibold text-gray-900">
            <span v-if="loading">...</span>
            <span v-else>
              <span v-if="usage && usage.contracts">{{ usage.contracts }}</span>
              <span v-else>0</span>
              /
              <span v-if="currentProduct">{{ currentProduct.monthlyContracts }}</span>
              <span v-else class="text-gray-500">0</span>
            </span>
          </dd>
        </router-link>

        <router-link
          to="/app/settings/workspaces"
          class="bg-white px-4 py-5 border border-gray-300 shadow-md rounded-lg overflow-hidden sm:p-6 hover:bg-gray-50"
          :class="{
            'bg-rose-50 border-rose-300 hover:bg-rose-100 cursor-pointer': billableStatus(maxWorkspacesRemaining) === 0,
            'bg-yellow-50 border-yellow-300 hover:bg-yellow-100 cursor-pointer': billableStatus(maxWorkspacesRemaining) === 1,
            'bg-white': billableStatus(maxWorkspacesRemaining) === 2,
            'bg-teal-50 border-teal-300 hover:bg-teal-100 cursor-pointer': billableStatus(maxWorkspacesRemaining) === 3,
          }"
        >
          <dt class="text-sm font-medium text-gray-500 truncate">{{ $t("models.workspace.plural") }}</dt>
          <dd class="mt-1 text-xl font-semibold text-gray-900">
            <span v-if="loading">...</span>
            <span v-else>
              <span v-if="usage">{{ workspaces.length }}</span>
              <span v-else>0</span>
              /
              <span v-if="currentProduct">{{ currentProduct.maxWorkspaces }}</span>
              <span v-else class="text-gray-500">0</span>
            </span>
          </dd>
        </router-link>
        <router-link
          to="/app/settings/members"
          class="bg-white px-4 py-5 border border-gray-300 shadow-md rounded-lg overflow-hidden sm:p-6 hover:bg-gray-50"
          :class="{
            'bg-rose-50 border-rose-300 hover:bg-rose-100 cursor-pointer': billableStatus(maxUsersRemaining) === 0,
            'bg-yellow-50 border-yellow-300 hover:bg-yellow-100 cursor-pointer': billableStatus(maxUsersRemaining) === 1,
            'bg-white': billableStatus(maxUsersRemaining) === 2,
            'bg-teal-50 border-teal-300 hover:bg-teal-100 cursor-pointer': billableStatus(maxUsersRemaining) === 3,
          }"
        >
          <dt class="text-sm font-medium text-gray-500 truncate">{{ $t("models.user.plural") }}</dt>
          <dd class="mt-1 text-xl font-semibold text-gray-900">
            <span v-if="loading">...</span>
            <span v-else>
              <span v-if="usage">{{ users.length }}</span>
              <span v-else>0</span>
              /
              <span v-if="currentProduct">{{ currentProduct.maxUsers }}</span>
              <span v-else class="text-gray-500">0</span>
            </span>
          </dd>
        </router-link>
      </dl>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import store from "@/store";
import services from "@/services";
import { TenantProductDto } from "@/application/dtos/core/tenants/TenantProductDto";
import { SubscriptionGetCurrentResponse } from "@/application/contracts/core/subscriptions/SubscriptionGetCurrentResponse";
import { WorkspaceDto } from "@/application/dtos/core/workspaces/WorkspaceDto";
import { TenantUserDto } from "@/application/dtos/core/tenants/TenantUserDto";
import tinyEventBus from "@/plugins/tinyEventBus";
import { Prop, Component } from "vue-property-decorator";
import { AppUsageSummaryDto } from "@/application/dtos/app/usage/AppUsageSummaryDto";

@Component({})
export default class MySubscriptionProducts extends Vue {
  @Prop({ default: false }) withCurrentPlan!: boolean;
  @Prop({ default: "grid-cols-2 sm:grid-cols-2 xl:grid-cols-4" })
  cols!: boolean;
  loading = false;
  subscription: SubscriptionGetCurrentResponse | null = null;
  workspaces: WorkspaceDto[] = [];
  users: TenantUserDto[] = [];
  mounted() {
    tinyEventBus().emitter.on("updated-plan", () => {
      this.reload();
    });
    this.reload();
  }
  beforeDestroy() {
    tinyEventBus().emitter.off("updated-plan");
  }
  reload() {
    this.loading = true;

    const promises: any[] = [];

    const loadDashboard = services.subscriptionManager.getCurrentSubscription().then((response) => {
      this.subscription = response;
    });
    const loadWorkspaces = services.workspaces.getAllWorkspaces(false).then((response) => {
      this.workspaces = response;
    });
    const loadUsers = services.tenantUsers.getAll().then((response) => {
      this.users = response;
    });
    promises.push(loadDashboard);
    promises.push(loadWorkspaces);
    // promises.push(loadFeatures);
    promises.push(loadUsers);

    this.loading = true;
    Promise.all(promises).finally(() => {
      this.loading = false;
    });
  }
  billableStatus(max: number): number {
    if (this.loading) {
      return 2;
    }
    if (!this.currentProduct) {
      return 0;
    }
    if (max === 0) {
      return 1;
    }
    if (max > 0) {
      return 2;
    }
    return 0;
  }
  get links(): number {
    return store.state.app.usage.providers + store.state.app.usage.clients;
  }
  get currentProduct(): TenantProductDto | undefined {
    if (this.subscription?.myProducts && this.subscription?.myProducts.length > 0) {
      return this.subscription?.myProducts[0];
    }
    return undefined;
  }
  get maxLinksRemaining() {
    if (!this.currentProduct || !this.usage) {
      return 1;
    }
    const links = this.usage.providers + this.usage.clients;
    const remaining = this.currentProduct.maxLinks - links;
    return remaining;
  }
  get maxDocumentsRemaining() {
    if (!this.currentProduct || !this.usage) {
      return 1;
    }
    return this.currentProduct.monthlyContracts - this.usage.contracts;
  }
  get maxWorkspacesRemaining() {
    if (!this.currentProduct || !this.usage) {
      return 1;
    }
    return this.currentProduct.maxWorkspaces - this.workspaces.length;
  }
  get maxUsersRemaining() {
    if (!this.currentProduct || !this.usage) {
      return 1;
    }
    return this.currentProduct.maxUsers - this.users.length;
  }
  get usage(): AppUsageSummaryDto {
    return store.state.app.usage;
  }
}
</script>

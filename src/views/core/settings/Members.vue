<template>
  <div>
    <div class="py-4 space-y-2 mx-auto max-w-5xl xl:max-w-7xl px-4 sm:px-6 lg:px-8">
      <Loading v-if="loading" />
      <div v-else>
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
                to="/app/settings/members/new"
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
            <MembersListAndTable :items="sortedItems" />

            <div v-if="!loading && maxUsersReached">
              <WarningBannner
                :title="$t('app.subscription.errors.limitReached')"
                :text="$t('app.subscription.errors.limitReachedUsers', [maxUsers])"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <ErrorModal ref="errorModal" />
    <ConfirmModal ref="confirmAcceptUser" @yes="yesAcceptUser" />
    <ConfirmModal ref="confirmUpgrade" @yes="yesUpdateSubscription" />
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import ConfirmModal from "@/components/ui/modals/ConfirmModal.vue";
import { Prop } from "vue-property-decorator";
import { TenantUserDto } from "@/application/dtos/core/tenants/TenantUserDto";
import { TenantJoinSettingsDto } from "@/application/dtos/core/tenants/TenantJoinSettingsDto";
import { TenantUserRole } from "@/application/enums/core/tenants/TenantUserRole";
import { TenantUserStatus } from "@/application/enums/core/tenants/TenantUserStatus";
import i18n from "@/locale/i18n";
import tinyEventBus from "@/plugins/tinyEventBus";
import store from "@/store";
import WarningBannner from "@/components/ui/banners/WarningBanner.vue";
import services from "@/services";
import { UserType } from "@/application/enums/core/users/UserType";
import Loading from "@/components/ui/loaders/Loading.vue";
import MembersListAndTable from "@/components/core/settings/members/MembersListAndTable.vue";

@Component({
  metaInfo: {
    title: i18n.t("settings.members.title").toString()
  },
  components: {
    ConfirmModal,
    ErrorModal,
    WarningBannner,
    Loading,
    MembersListAndTable
  },
})
export default class Members extends Vue {
  $refs!: {
    confirmAcceptUser: ConfirmModal;
    errorModal: ErrorModal;
    confirmUpgrade: ConfirmModal;
  };
  @Prop({ default: "Miembros" }) readonly title!: string;
  loading = false;
  searchInput = "";

  items = [] as TenantUserDto[];
  tenantJoinSettings: any = {};
  enableLink = false;
  enablePublicUrl = false;
  requireAcceptance = false;
  acceptedUser!: TenantUserDto;
  acceptUserEmail = "";
  created() {
    this.acceptUserEmail = this.$route.query.au?.toString() ?? "";
  }
  mounted() {
    tinyEventBus().emitter.on("user-added", () => this.reload());
    tinyEventBus().emitter.on("user-saved", () => this.reload());
    tinyEventBus().emitter.on("user-deleted", () => this.reload());

    this.reload();
  }
  beforeDestroy() {
    tinyEventBus().emitter.off("user-deleted");
    tinyEventBus().emitter.off("user-added");
    tinyEventBus().emitter.off("user-saved");
  }
  async reload() {
    this.loading = true;
    const promises: any[] = [];
    promises.push(services.tenants.getFeatures());
    promises.push(services.tenantUserInvitations.getInvitationSettings().then((response: TenantJoinSettingsDto) => {
      this.tenantJoinSettings = response;
      this.enableLink = this.tenantJoinSettings.linkActive;
      this.enablePublicUrl = this.tenantJoinSettings.publicUrl;
      this.requireAcceptance = this.tenantJoinSettings.requireAcceptance;
    }));
    promises.push(services.tenantUsers
      .getAll()
      .then((response: TenantUserDto[]) => {
        this.items = [];
        response.forEach((element) => {
          this.items.push(element);
        });

        if (this.acceptUserEmail) {
          const user = this.items.find((f) => f.email === this.acceptUserEmail);
          if (user && user.status === TenantUserStatus.PENDING_ACCEPTANCE) {
            this.acceptUser(user, true);
          }
        }
      })
      .catch((error) => {
        this.$refs.errorModal.show(this.$t("shared.error"), this.$t(error));
      }));

    Promise.all(promises).finally(() => {
      this.loading = false;
    })
  }
  // saved(data) {
  //   const idx = this.items.findIndex((f) => f.id === data.id);
  //   this.items[idx] = data;
  // }
  // deleted(data) {
  //   this.items = this.items.filter((f) => f.id !== data.id);
  // }
  yesUpdateSubscription() {
    this.$router.push("/app/settings/subscription");
  }
  yesAcceptUser() {
    if (this.isOwnerOrAdmin && this.acceptedUser) {
      services.tenantUserInvitations
        .acceptUser(this.acceptedUser)
        .then(() => {
          this.reload();
        })
        .catch((error) => {
          this.$refs.errorModal.show(this.$t("shared.error"), this.$t(error));
        });
    }
  }
  acceptUser(item: TenantUserDto, accept: boolean) {
    item.accepted = accept;
    this.acceptedUser = item;
    this.$refs.confirmAcceptUser.show(this.$t("shared.accept?", [item.email]).toString(), this.$t("shared.accept").toString(), this.$t("shared.cancel").toString());
  }
  get isOwnerOrAdmin(): boolean {
    return this.currentRole === TenantUserRole.OWNER || this.currentRole === TenantUserRole.ADMIN;
  }
  get currentRole(): TenantUserRole {
    return store.state.tenant.current?.currentUser.role ?? TenantUserRole.GUEST;
  }
  get maxUsers(): number {
    if (store.state.account.user?.type === UserType.Admin) {
      return 0;
    }
    return store.state.app.features.maxUsers;
  }
  get maxUsersReached() {
    return this.maxUsers > 0 && store.state.tenant.members.length >= this.maxUsers;
  }
  get filteredItems(): TenantUserDto[] {
    if (!this.items) {
      return [];
    }
    const items = this.items.filter((f) => f.firstName?.toString().toUpperCase().includes(this.searchInput.toUpperCase()) || f.lastName?.toString().toUpperCase().includes(this.searchInput.toUpperCase()) || f.email?.toString().toUpperCase().includes(this.searchInput.toUpperCase()) || f.phone?.toString().toUpperCase().includes(this.searchInput.toUpperCase()));

    return items;
  }
  get sortedItems() {
    if (!this.items) {
      return [];
    }
    const items = this.filteredItems.sort((x, y) => {
      return x.role > y.role ? -1 : 1;
    });
    return items.sort((x, y) => {
      return x.role > y.role ? 1 : -1;
    });
  }
}
</script>

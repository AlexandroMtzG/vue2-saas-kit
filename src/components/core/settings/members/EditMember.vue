<template>
  <div>
    <div>
      <div @keypress.esc="close" class="fixed inset-0 overflow-y-auto">
        <div
          class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        >
          <transition
            enter-active-class="ease-out duration-300"
            enter-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="ease-in"
            leave-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <div class="fixed inset-0 transition-opacity" aria-hidden="true">
              <div class="absolute inset-0 bg-gray-800 opacity-75"></div>
            </div>
          </transition>

          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>
          <transition
            enter-active-class="ease-out duration-300"
            enter-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="ease-in duration-200"
            leave-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              class="inline-block align-bottom bg-white rounded-sm px-4 pt-5 pb-4 text-left overflow-visible shadow-xl transform transition-all my-8 sm:align-middle w-full sm:p-6"
              :class="maxSize"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div class="just absolute top-0 right-0 -mt-4 pr-4">
                <button
                  @click="close"
                  type="button"
                  class="p-1 bg-white hover:bg-gray-200 border border-gray-200 rounded-full text-gray-600 justify-center flex items-center hover:text-gray-500 focus:outline-none"
                >
                  <span class="sr-only">{{ $t("shared.close") }}</span>
                  <svg
                    class="h-5 w-5 text-gray-700"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div class="mt-3 space-y-3">
                <div class="flex items-center justify-between">
                  <h4 class="text-lg font-medium">{{ $t("settings.members.actions.edit") }}</h4>
                </div>
                <Loading v-if="loading" />
                <div v-else-if="!item">{{ $t("shared.notFound") }}</div>
                <form v-else-if="item" @submit.prevent="save" class="space-y-4">
                  <div class="grid grid-cols-2 gap-2">
                    <!-- Email -->
                    <div class="col-span-2">
                      <label
                        for="email"
                        class="block text-xs font-medium text-gray-700 truncate"
                      >{{ $t("models.user.email") }}</label>
                      <div class="mt-1 flex rounded-md shadow-sm w-full">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          autocomplete="off"
                          disabled
                          v-model="email"
                          @input="email = $event.target.value.toLowerCase()"
                          class="w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300"
                          :class="{
                            'bg-gray-100 cursor-not-allowed': true,
                          }"
                        />
                      </div>
                    </div>
                    <!-- Email: End -->

                    <!-- User First Name -->
                    <div>
                      <label
                        for="first-name"
                        class="block text-xs font-medium text-gray-700 truncate"
                      >{{ $t("models.user.firstName") }}</label>
                      <div class="mt-1 flex rounded-md shadow-sm w-full">
                        <input
                          type="text"
                          id="first-name"
                          name="first-name"
                          autocomplete="off"
                          disabled
                          v-model="firstName"
                          class="w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300"
                          :class="{
                            'bg-gray-100 cursor-not-allowed': true,
                          }"
                        />
                      </div>
                    </div>
                    <!-- User First Name: End -->

                    <!-- User Last Name -->
                    <div>
                      <label
                        for="last-name"
                        class="block text-xs font-medium text-gray-700 truncate"
                      >{{ $t("models.user.lastName") }}</label>
                      <div class="mt-1 flex rounded-md shadow-sm w-full">
                        <input
                          type="text"
                          id="last-name"
                          name="last-name"
                          autocomplete="off"
                          disabled
                          v-model="lastName"
                          class="w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300"
                          :class="{
                            'bg-gray-100 cursor-not-allowed': true,
                          }"
                        />
                      </div>
                    </div>
                    <!-- User Last Name: End -->

                    <!-- User Role -->
                    <div class="col-span-2">
                      <label
                        for="last-name"
                        class="block text-xs font-medium text-gray-700 truncate"
                      >{{ $t("models.user.role") }}</label>
                      <div class="mt-1 rounded-md shadow-sm w-full">
                        <fieldset>
                          <legend class="sr-only">{{ $t("models.user.role") }}</legend>
                          <div class="bg-white rounded-md -space-y-px">
                            <label
                              v-for="(option, idxRole) in roleOptions"
                              :key="idxRole"
                              class="rounded-tl-md rounded-tr-md relative border py-2 px-4 flex cursor-pointer focus:outline-none"
                              :class="{
                                'bg-theme-50 border-theme-200 z-10': role === option.value,
                                'border-gray-200': role !== option.value,
                                'rounded-tl-md rounded-tr-md': idxRole === 0,
                                'rounded-bl-md rounded-br-md': idxRole === roleOptions.length - 1,
                              }"
                            >
                              <input
                                type="radio"
                                name="tenant-user-role"
                                class="h-4 w-4 mt-3 cursor-pointer text-theme-600 border-gray-300 focus:ring-theme-500"
                                aria-labelledby="tenant-user-role-0-label"
                                aria-describedby="tenant-user-role-0-description"
                                :value="option.value"
                                :checked="role === option.value"
                                @change="changedRole"
                              />
                              <div class="ml-3 flex flex-col">
                                <span
                                  id="tenant-user-role-0-label"
                                  class="block text-sm font-medium"
                                  :class="{
                                    'text-theme-900': role === option.value,
                                    'text-gray-900': role !== option.value,
                                  }"
                                >{{ option.name }}</span>

                                <span
                                  id="tenant-user-role-0-description"
                                  class="block text-sm"
                                  :class="{
                                    'text-theme-700': role === option.value,
                                    'text-gray-500': role !== option.value,
                                  }"
                                >{{ option.description }}</span>
                              </div>
                            </label>
                          </div>
                        </fieldset>
                      </div>
                    </div>
                    <!-- User Role: End -->

                    <!-- User Workspaces -->
                    <div class="col-span-2">
                      <label
                        for="description"
                        class="block text-xs font-medium text-gray-700 truncate"
                      >{{ $t("models.workspace.plural") }}</label>
                      <div class="mt-2 rounded-md w-full space-y-2">
                        <input
                          type="text"
                          id="description"
                          autocomplete="off"
                          disabled
                          v-model="currentWorkspacesDescription"
                          class="bg-gray-100 cursor-not-allowed w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300"
                        />
                        <button
                          type="button"
                          @click="selectUserWorkspaces"
                          class="flex items-center space-x-1 text-xs text-theme-600"
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
                          <span
                            class="uppercase font-medium"
                          >{{ $t("app.workspaces.actions.selectUserWorkspaces") }}</span>
                        </button>
                      </div>
                    </div>
                    <!-- User Workspaces: End -->
                  </div>

                  <div class="flex items-center justify-between mt-4">
                    <div v-if="loading" class="text-theme-700 text-sm">
                      <div v-if="loading">{{ $t("shared.loading") }}...</div>
                    </div>
                    <div v-else>
                      <button
                        :disabled="loading"
                        :class="{
                          'bg-gray-100 cursor-not-allowed': loading,
                        }"
                        type="button"
                        @click="remove"
                        class="inline-flex items-center px-3 py-2 border space-x-2 border-gray-300 shadow-sm sm:text-sm font-medium sm:rounded-md text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                      >
                        <div>{{ $t("shared.delete") }}</div>
                      </button>
                    </div>

                    <div class="flex items-center space-x-2">
                      <button
                        :disabled="loading"
                        :class="{
                          'bg-gray-100 cursor-not-allowed': loading,
                        }"
                        type="button"
                        @click="close"
                        class="inline-flex items-center px-3 py-2 border space-x-2 border-gray-300 shadow-sm sm:text-sm font-medium sm:rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                      >
                        <div>{{ $t("shared.cancel") }}</div>
                      </button>
                      <button
                        :disabled="loading"
                        :class="{
                          'opacity-50 cursor-not-allowed': loading,
                        }"
                        type="submit"
                        class="inline-flex items-center px-3 py-2 border space-x-2 border-transparent shadow-sm sm:text-sm font-medium sm:rounded-md text-white bg-theme-600 hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                      >
                        <div>{{ $t("shared.save") }}</div>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <ConfirmModal ref="confirmRemove" @yes="yesRemove" />
    <ErrorModal ref="errorModal" />
    <SuccessModal ref="successModal" @closed="close" />
    <select-workspaces ref="selectWorkspaces" @selected="selectedWorkspaces"></select-workspaces>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import services from "@/services";
import { TenantUserRole } from "@/application/enums/core/tenants/TenantUserRole";
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import SuccessModal from "@/components/ui/modals/SuccessModal.vue";
import { WorkspaceDto } from "@/application/dtos/core/workspaces/WorkspaceDto";
import SelectWorkspaces from "@/components/core/workspaces/SelectWorkspaces.vue";
import tinyEventBus from "@/plugins/tinyEventBus";
import store from "@/store";
import ConfirmModal from "@/components/ui/modals/ConfirmModal.vue";
import { TenantUserDto } from "@/application/dtos/core/tenants/TenantUserDto";
import Loading from "@/components/ui/loaders/Loading.vue";
import i18n from "@/locale/i18n";

@Component({
  components: {
    ErrorModal,
    SuccessModal,
    SelectWorkspaces,
    ConfirmModal,
    Loading,
  },
})
export default class EditMember extends Vue {
  @Prop({ default: "sm:max-w-lg" }) maxSize!: string;
  $refs!: {
    errorModal: ErrorModal;
    successModal: SuccessModal;
    selectWorkspaces: SelectWorkspaces;
    confirmRemove: ConfirmModal;
  };
  id = "";
  item: TenantUserDto | null = null;
  loading = false;
  email = "";
  firstName = "";
  lastName = "";
  phone = "";
  role: TenantUserRole = TenantUserRole.MEMBER;
  roleOptions = [
    {
      value: 0,
      name: i18n.t("settings.profile.roles.OWNER"),
      description: i18n.t("settings.profile.permissions.OWNER"),
    },
    {
      value: 1,
      name: i18n.t("settings.profile.roles.ADMIN"),
      description: i18n.t("settings.profile.permissions.ADMIN"),
    },
    {
      value: 2,
      name: i18n.t("settings.profile.roles.MEMBER"),
      description: i18n.t("settings.profile.permissions.MEMBER"),
    },
    {
      value: 3,
      name: i18n.t("settings.profile.roles.GUEST"),
      description: i18n.t("settings.profile.permissions.GUEST"),
    },
  ];
  workspaces: WorkspaceDto[] = [];
  created() {
    this.id = this.$route.params.id;
  }
  mounted() {
    this.loading = true;
    services.tenantUsers
      .get(this.id)
      .then((response) => {
        this.item = response;
        this.email = response.email;
        this.firstName = response.firstName;
        this.lastName = response.lastName;
        this.role = response.role;
        this.phone = response.phone;
        this.workspaces = [];
        response.user?.workspaces?.forEach((element) => {
          if (element.workspace) {
            this.workspaces.push(element.workspace);
          }
        });
      })
      .catch((error) => {
        this.$refs.errorModal.show(this.$t("shared.error"), this.$t(error));
      })
      .finally(() => {
        this.loading = false;
      });
  }
  close() {
    this.$router.push("/app/settings/members");
  }
  save() {
    if (this.workspaces.length === 0) {
      this.$refs.errorModal.show(this.$t("shared.error"), this.$t("account.tenant.members.errors.atLeastOneWorkspace"));
      return;
    }
    this.loading = true;
    services.tenantUsers
      .update(this.id, {
        phone: this.phone,
        role: this.role,
        workspaces: this.workspaces,
      })
      .then(() => {
        tinyEventBus().emitter.emit("user-saved", this.item);
        this.$refs.successModal.show(this.$t("shared.updated"));
      })
      .catch((error) => {
        this.$refs.errorModal.show(this.$t("shared.error"), this.$t(error));
      })
      .finally(() => {
        this.loading = false;
      });
  }
  remove() {
    this.$refs.confirmRemove.show(this.$t("shared.confirmDelete"), this.$t("shared.delete"), this.$t("shared.cancel"));
  }
  yesRemove() {
    if (this.currentRole === TenantUserRole.MEMBER || this.currentRole === TenantUserRole.GUEST) {
      this.$refs.errorModal.show(this.$t("account.tenant.onlyAdmin"));
    } else {
      this.loading = true;
      services.tenantUsers
        .delete(this.id)
        .then(() => {
          tinyEventBus().emitter.emit("user-deleted", this.item);
          this.$router.push("/app/settings/members");
        })
        .catch((error) => {
          this.$refs.errorModal.show(this.$t("shared.error"), this.$t(error));
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
  selectUserWorkspaces() {
    this.$refs.selectWorkspaces.show(this.workspaces.map((f) => f.id));
  }
  selectedWorkspaces(items: WorkspaceDto[]) {
    this.workspaces = items;
  }
  changedRole(e) {
    const role: TenantUserRole = Number(e.target.value);
    this.role = role;
  }
  get currentRole(): TenantUserRole {
    return store.state.tenant.current?.currentUser.role ?? TenantUserRole.GUEST;
  }
  get currentWorkspacesDescription() {
    if (this.workspaces.length === 0) {
      return this.$t("app.workspaces.seletAtLeastOne");
    }
    return this.workspaces.map((f) => f.name).join(", ");
  }
}
</script>

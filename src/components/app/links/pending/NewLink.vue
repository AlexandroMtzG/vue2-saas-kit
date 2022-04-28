<template>
  <div>
    <div @keypress.esc="close">
      <div v-if="showing" class="fixed z-50 inset-0 overflow-y-auto">
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
              class="max-w-lg inline-block align-bottom bg-white rounded-sm px-4 pt-5 pb-4 text-left overflow-visible shadow-xl transform transition-all my-8 sm:align-middle w-full sm:p-6"
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
              <div class="mt-3 space-y-4">
                <h3 class="font-bold text-lg pb-2 border-b border-gray-100">
                  <span v-if="imProvider">{{ $t("app.links.newClient") }}</span>
                  <span v-else>{{ $t("app.links.newProvider") }}</span>
                </h3>
                <div>
                  <div class="mx-auto">
                    <div class="md:col-span-2 space-y-4">
                      <div>
                        <Loading v-if="loading" />
                        <div v-else-if="maxLinksReached">
                          <WarningBanner
                            redirect="/app/settings/subscription"
                            :title="$t('app.subscription.errors.limitReached')"
                            :text="$t('app.subscription.errors.limitReachedLinks', [maxLinks])"
                          />
                        </div>
                        <div v-else class="bg-white rounded space-y-3">
                          <form @submit.prevent="linkUserWorkspace" class="space-y-4">
                            <div
                              v-if="selectType"
                              class="col-span-2 relative flex items-start select-none cursor-pointer"
                            >
                              <div class="flex items-center h-5 cursor-pointer">
                                <input
                                  id="imProvider"
                                  v-model="imProvider"
                                  aria-describedby="imProvider-description"
                                  name="imProvider"
                                  type="checkbox"
                                  class="cursor-pointer focus:ring-theme-500 h-4 w-4 text-theme-600 border-gray-300 rounded"
                                />
                              </div>
                              <div class="ml-3 text-sm">
                                <label
                                  for="imProvider"
                                  class="font-medium text-gray-700 cursor-pointer"
                                >{{ $t("app.links.imTheProvider") }}</label>
                              </div>
                            </div>
                            <div class="sm:col-span-6 grid grid-cols-2 gap-2">
                              <div>
                                <label
                                  for="email"
                                  class="block text-xs font-medium text-gray-700 truncate"
                                >{{ $t("account.shared.email") }}</label>
                                <div class="mt-1 flex rounded-md shadow-sm w-full">
                                  <input
                                    type="email"
                                    name="email"
                                    ref="inputEmail"
                                    id="email"
                                    autocomplete="off"
                                    required
                                    v-model="email"
                                    @input="email = $event.target.value.toLowerCase()"
                                    class="w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300"
                                  />
                                </div>
                              </div>
                              <div>
                                <label
                                  for="workspaceName"
                                  class="block text-xs font-medium text-gray-700 truncate"
                                >{{ $t("models.workspace.object") }}</label>
                                <div class="mt-1 flex rounded-md shadow-sm w-full">
                                  <input
                                    type="text"
                                    name="workspaceName"
                                    id="workspaceName"
                                    autocomplete="off"
                                    required
                                    v-model="workspaceName"
                                    class="w-full flex-1 focus:ring-theme-500 focus:border-theme-500 block min-w-0 rounded-md sm:text-sm border-gray-300"
                                  />
                                </div>
                              </div>
                            </div>

                            <div class="flex items-center justify-between mt-4">
                              <div class="text-theme-700 text-sm">
                                <div v-if="loadingSearching">{{ $t("shared.searching") }}...</div>
                                <div v-else-if="loadingLinking">{{ $t("shared.creating") }}...</div>
                              </div>

                              <button
                                :disabled="loadingSearching || loadingLinking"
                                :class="{
                                  'bg-gray-100 cursor-not-allowed': loadingSearching || loadingLinking,
                                }"
                                type="submit"
                                class="inline-flex items-center px-3 py-2 border space-x-2 border-gray-300 shadow-sm sm:text-sm font-medium sm:rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  class="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                  />
                                </svg>

                                <div>{{ $t("shared.search") }}</div>
                              </button>
                            </div>
                          </form>
                          <div v-if="workspace">
                            <div
                              class="py-5 px-4 bg-theme-100 w-full border border-theme-200 shadow-sm"
                            >
                              <div class="flex items-center justify-between space-x-1">
                                <div class="flex items-center space-x-2 text-theme-800 truncate">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-9 w-9"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                    />
                                  </svg>
                                  <div class="truncate">
                                    <p
                                      class="text-base font-medium"
                                    >{{ $t("app.links.accountFound") }}</p>
                                    <p class="text-xs truncate">{{ workspaceName }}</p>
                                  </div>
                                </div>
                                <div>
                                  <button
                                    ref="buttonCreate"
                                    type="button"
                                    @click="createLink"
                                    class="ml-1 h-8 inline-flex items-center px-4 py-5 text-base leading-5 font-medium rounded-sm text-white bg-theme-800 hover:bg-theme-700 focus:outline-shadow active:bg-theme-900 transition duration-150 ease-in-out"
                                  >{{ $t("app.links.link", [email]) }}</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
    <ConfirmModal ref="confirmCreateLinkModal" @yes="confirmCreateLink" />
    <ConfirmModal ref="confirmInviteNewUserModal" @yes="confirmInviteNewUser" />
    <SuccessModal ref="successModal" @closed="createdLink" class="z-50 relative" />
    <ErrorModal class="z-50 relative" ref="errorModal" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import services from "@/services";
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import { WorkspaceDto } from "@/application/dtos/core/workspaces/WorkspaceDto";
import SuccessModal from "@/components/ui/modals/SuccessModal.vue";
import store from "@/store";
import { LinkDto } from "@/application/dtos/core/links/LinkDto";
import WarningBanner from "@/components/ui/banners/WarningBanner.vue";
import ConfirmModal from "@/components/ui/modals/ConfirmModal.vue";
import tinyEventBus from "@/plugins/tinyEventBus";
import { AppUsageType } from "@/application/enums/app/usages/AppUsageType";
import Loading from "@/components/ui/loaders/Loading.vue";

@Component({
  components: {
    ErrorModal,
    ConfirmModal,
    SuccessModal,
    WarningBanner,
    Loading
  },
})
export default class NewLink extends Vue {
  $refs!: {
    inputEmail: HTMLInputElement;
    errorModal: ErrorModal;
    confirmCreateLinkModal: ConfirmModal;
    confirmInviteNewUserModal: ConfirmModal;
    successModal: SuccessModal;
  };
  selectType = true;
  asProvider = true;
  imProvider = false;
  loading = false;
  showing = false;
  loadingSearching = false;
  loadingLinking = false;
  email = "";
  workspaceName = "";
  workspace: WorkspaceDto | null = null;
  linkCreated: LinkDto | null = null;
  error = "";
  mounted() {
    this.imProvider = this.asProvider;
  }
  show(asProvider: boolean, selectType: boolean) {
    this.asProvider = asProvider;
    this.selectType = selectType;
    this.workspace = null;
    this.email = "";
    this.workspaceName = "";

    this.showing = true;
    this.$nextTick(() => {
      this.$refs.inputEmail.focus();
      this.$refs.inputEmail.select();
    });
    this.reload();
  }
  reload() {
    this.loading = true;
    const promises: any[] = []
    promises.push(services.tenants.getCurrentUsage(AppUsageType.ALL));
    promises.push(services.tenants.getFeatures());

    Promise.all(promises).finally(() => {
      this.loading = false;
      this.$nextTick(() => {
        if (this.$refs.inputEmail) {
          this.$refs.inputEmail.focus();
          this.$refs.inputEmail.select();
        }
      });
    })
  }
  close() {
    this.showing = false;
  }
  linkUserWorkspace() {
    if (!this.email || this.email.trim() === "" || !this.workspaceName || this.workspaceName.trim() === "") {
      this.$refs.errorModal.show(this.$t("shared.missingFields"));
      return;
    }
    this.error = "";
    this.loadingSearching = true;
    this.workspace = null;
    services.links
      .searchUser(this.email)
      .then(() => {
        this.searchWorkspace();
      })
      .catch(() => {
        this.$refs.confirmInviteNewUserModal.show(this.$t("app.links.accountNotFound"), this.$t("shared.invite"), this.$t("shared.cancel"), this.$t("app.links.invitation.userNotRegistered", [this.email]));
        this.loadingSearching = false;
      });
  }
  searchWorkspace() {
    services.links
      .searchMember(this.email, this.workspaceName)
      .then(() => {
        this.createLink();
      })
      .catch(() => {
        this.$refs.errorModal.show(this.$t("shared.error"), this.$t("app.links.invitation.notFound", [this.email, this.workspaceName]));
      })
      .finally(() => {
        this.loadingSearching = false;
      });
  }
  createLink() {
    const confirmText = this.workspace?.id ? this.$t("app.links.link") : this.$t("shared.invite");
    const inviteText = this.workspace?.id ? "" : this.$t("app.links.invitation.invite");
    if (this.imProvider) {
      this.$refs.confirmCreateLinkModal?.show(this.$t("app.clients.new.add"), confirmText, this.$t("shared.cancel"), inviteText);
    } else {
      this.$refs.confirmCreateLinkModal?.show(this.$t("app.providers.new.add"), confirmText, this.$t("shared.cancel"), inviteText);
    }
  }
  confirmInviteNewUser() {
    this.loadingLinking = true;
    services.links
      .createInvitation({
        email: this.email,
        workspaceName: this.workspaceName,
        message: "",
        inviteeIsProvider: !this.imProvider,
      })
      .then(() => {
        this.$refs.successModal.show(this.$t("app.links.pending.invitationSent"), this.$t("app.links.pending.invitationSentDescription", [this.email]));
      })
      .catch((error) => {
        this.$refs.errorModal.show(this.$t("shared.error"), this.$t(error));
      })
      .finally(() => {
        this.loadingLinking = false;
      });
  }
  confirmCreateLink() {
    this.loadingLinking = true;
    services.links
      .create({
        email: this.email,
        workspaceName: this.workspaceName,
        asProvider: !this.imProvider,
        // permissions: this.permissions
      })
      .then((response) => {
        this.linkCreated = response;
        this.$refs.successModal.show(this.$t("app.links.pending.invitationSent"), this.$t("app.links.invited", [this.email, this.imProvider ? this.$t("models.client.object") : this.$t("models.provider.object"), this.currentWorkspace.name]));
        services.tenants.getCurrentUsage(AppUsageType.PENDING_INVITATIONS);
      })
      .catch((error) => {
        this.$refs.errorModal.show(this.$t("shared.error"), this.$t(error));
      })
      .finally(() => {
        this.loadingLinking = false;
      });
  }
  createdLink() {
    tinyEventBus().emitter.emit("reload-links");
    this.$emit("created", this.linkCreated);
    this.close();
  }

  get maxLinks(): number {
    return store.state.app.features.maxLinks;
  }
  get maxLinksReached() {
    return this.maxLinks > 0 && store.state.app.usage.providers + store.state.app.usage.clients >= this.maxLinks;
  }
  get currentWorkspace(): WorkspaceDto {
    return store.state.tenant.currentWorkspace ?? ({} as WorkspaceDto);
  }
}
</script>

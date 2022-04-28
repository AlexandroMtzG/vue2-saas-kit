<template>
  <div>
    <div class="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div v-if="tenant && (tenant.logo || tenant.logoDarkmode)">
          <router-link to="/">
            <img alt="Logo" :src="tenant.logo" class="mx-auto h-16 w-auto" />
          </router-link>
        </div>
        <Logo v-else class="mx-auto h-12 w-auto" />
      </div>
      <div v-if="loading"></div>
      <div
        v-else-if="!invitation || !invitation.user"
        class="text-red-500 text-center"
      >{{ $t("shared.invalidInvitation") }}</div>
      <div v-if="invitation && invitation.user">
        <h2
          class="mt-6 text-center text-lg font-extrabold text-coolGray-800 dark:text-blueGray-200"
        >
          {{ $t("shared.hi") }}
          {{ invitation.user.firstName ? invitation.user.firstName : invitation.user.email }}, {{ $t("account.invitation.youWereInvited") }}
          {{ invitation.tenant.name }}
        </h2>
        <p class="mt-2 text-center text-sm leading-5 text-gray-500 max-w">
          {{ $t("account.register.alreadyRegistered") }}
          <span
            class="font-medium text-theme-500 hover:text-theme-400 focus:outline-none focus:underline transition ease-in-out duration-150"
          >
            <router-link to="/login">{{ $t("account.register.clickHereToLogin") }}</router-link>
          </span>
        </p>

        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div class="py-8 px-4 sm:rounded-sm sm:px-10">
            <form @submit.prevent="accept" class="sm:w-96">
              <div>
                <label
                  for="email"
                  class="block text-sm font-medium leading-5"
                >{{ $t("account.shared.email") }}</label>
                <div class="mt-1 rounded-sm shadow-sm">
                  <input
                    disabled
                    v-model="user.email"
                    id="email"
                    type="email"
                    required
                    class="bg-gray-100 dark:bg-blueGray-800 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-coolGray-800 dark:text-blueGray-200 rounded-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                  />
                </div>
              </div>
              <div v-if="requirePassword" class="mt-6">
                <label
                  for="password"
                  class="block text-sm font-medium leading-5"
                >{{ $t("account.shared.password") }}</label>
                <div class="mt-1 rounded-sm shadow-sm">
                  <input
                    v-model="user.password"
                    id="password"
                    type="password"
                    required
                    class="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-coolGray-800 dark:text-blueGray-200 rounded-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                  />
                </div>
              </div>
              <div v-if="requirePassword" class="mt-6">
                <label
                  for="confirmPassword"
                  class="block text-sm font-medium leading-5"
                >{{ $t("account.register.confirmPassword") }}</label>
                <div class="mt-1 rounded-sm shadow-sm">
                  <input
                    v-model="user.passwordConfirm"
                    id="confirmPassword"
                    type="password"
                    required
                    class="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-coolGray-800 dark:text-blueGray-200 rounded-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                  />
                </div>
              </div>

              <div class="mt-6">
                <span class="block w-full rounded-sm shadow-sm">
                  <LoadingButton
                    class="w-full block"
                    type="submit"
                    ref="loadingButton"
                  >{{ $t("account.invitation.button") }}</LoadingButton>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <ErrorModal ref="errorModal" />
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import Logo from "@/components/front/Logo.vue";
import LoadingButton from "@/components/ui/buttons/LoadingButton.vue";
import services from "@/services";
import { TenantUserDto } from "@/application/dtos/core/tenants/TenantUserDto";
import { UserVerifyRequest } from '@/application/contracts/core/users/UserVerifyRequest';
import { TenantDto } from '@/application/dtos/core/tenants/TenantDto';
import { TenantInvitationResponse } from '@/application/contracts/core/tenants/TenantInvitationResponse';
import i18n from '@/locale/i18n';

@Component({
  metaInfo: {
    title: i18n.t("account.invitation.title").toString(),
  },
  components: {
    ErrorModal,
    Logo,
    LoadingButton
  }
})
export default class Invitation extends Vue {
  $refs!: {
    loadingButton: LoadingButton;
    errorModal: ErrorModal;
  };
  loading = false;
  requirePassword = true;
  user = {} as UserVerifyRequest;
  invitation: TenantUserDto | null = null;
  tenant = {} as TenantDto;
  created() {
    this.user.token = this.$route.query.i ? this.$route.query.i.toString() : "";
    this.user.email = this.$route.query.e ? this.$route.query.e.toString() : "";
  }
  mounted() {
    if (this.$route.query.i) {
      this.loading = true;
      services.tenantUserInvitations
        .getInvitation(this.$route.query.i.toString())
        .then((response: TenantInvitationResponse) => {
          this.invitation = response.invitation;
          this.tenant = response.tenant;
          this.requirePassword = response.requiresVerify;
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
  accept() {
    if (this.user.password !== this.user.passwordConfirm) {
      this.$refs.errorModal.show(this.$t("api.errors.passwordMismatch"));
      return;
    }

    this.$refs.loadingButton.start();
    services.tenantUserInvitations.acceptInvitation(this.$route.query.i?.toString() ?? "", this.user).catch((error) => {
      this.$refs.errorModal.show(this.$t("shared.error"), this.$t(error));
      if (this.$refs.loadingButton) {
        this.$refs.loadingButton.stop();
      }
    });
  }
}
</script>
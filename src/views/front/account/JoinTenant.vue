<template>
  <div>
    <div class="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div v-if="tenant && (tenant.logo || tenant.logoDarkmode)">
          <router-link to="/">
            <img alt="Logo" :src="tenant.logo" class="mx-auto h-12 w-auto" />
          </router-link>
        </div>
        <Logo v-else class="mx-auto h-12 w-auto" />
      </div>

      <div v-if="requested">
        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div class="max-w-md w-full mx-auto rounded-sm px-8 pt-6 pb-8 mb-4 mt-8">
            <h2
              class="mt-6 text-center text-3xl leading-9 font-bold"
            >{{ $t("account.invitation.successTitle") }}</h2>
            <div class="my-4 leading-tight">
              <p
                class="mt-2 text-center text-sm leading-5 max-w"
              >{{ $t("account.invitation.successText") }}</p>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div v-if="loading">
          <!-- {{ $t("shared.loading") }} -->
        </div>
        <div
          v-else-if="!tenant"
          class="text-red-500 text-center"
        >{{ $t("shared.invalidInvitation") }}</div>
        <div v-if="tenant && tenant.name">
          <div v-if="emailDisabled && email">
            <p class="mt-2 text-center text-sm leading-5">
              <button
                @click="logout"
                class="font-medium text-theme-500 hover:text-theme-400 focus:outline-none focus:underline transition ease-in-out duration-150"
              >{{ $t("account.invitation.anotherEmail") }}</button>
            </p>
          </div>
          <div class="mt-6 text-center text-lg leading-9 font-bold">
            <div v-if="accepted">
              {{ $t("account.invitation.acceptedUser", [tenant.name]) }}
              <p class="font-normal text-base">{{ $t("account.forgot.enterPassword") }}</p>
            </div>
            <div v-else>
              <h2
                class="mt-6 text-center text-lg font-extrabold text-coolGray-800 dark:text-blueGray-200"
              >
                {{ $t("account.invitation.requestAccess") }}
                {{ tenant.name }}
              </h2>
              <p class="mt-2 text-center text-sm leading-5 text-gray-500 max-w">
                {{ $t("account.register.alreadyRegistered") }}
                <span
                  class="font-medium text-theme-500 hover:text-theme-400 focus:outline-none focus:underline transition ease-in-out duration-150"
                >
                  <router-link to="/login">{{ $t("account.register.clickHereToLogin") }}</router-link>
                </span>
              </p>
            </div>
          </div>

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
                      :disabled="emailDisabled"
                      v-model="user.email"
                      id="email"
                      type="email"
                      required
                      class="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-coolGray-800 dark:text-blueGray-200 rounded-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                      :class="{
                        'cursor-not-allowed bg-gray-100': emailDisabled,
                      }"
                    />
                  </div>
                </div>
                <div>
                  <div class="mt-6">
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
                  <div class="mt-6" v-if="!emailDisabled">
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
                </div>

                <div class="mt-6">
                  <span class="block w-full rounded-sm shadow-sm">
                    <LoadingButton class="w-full block" type="submit" ref="loadingButton">
                      <span v-if="accepted">{{ $t("shared.enter") }}</span>
                      <span v-else>{{ $t("shared.request") }}</span>
                    </LoadingButton>
                  </span>
                </div>
              </form>
            </div>
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
import LoadingButton from "@/components/ui/buttons/LoadingButton.vue";
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import Logo from "@/components/front/Logo.vue";
import store from "@/store";
import services from "@/services";
import { TenantDto } from '@/application/dtos/core/tenants/TenantDto';
import { UserVerifyRequest } from '@/application/contracts/core/users/UserVerifyRequest';
import i18n from '@/locale/i18n';

@Component({
  metaInfo: {
    title: i18n.t("account.join.title").toString(),
  },
  components: {
    ErrorModal,
    Logo,
    LoadingButton,
  },
})
export default class JoinTenant extends Vue {
  $refs!: {
    loadingButton: LoadingButton;
    errorModal: ErrorModal;
  };
  loading = false;
  user = {} as UserVerifyRequest;
  emailDisabled = false;
  tenant = {} as TenantDto;
  requested = false;
  accepted = false;
  created() {
    this.user.token = this.$route.params.tenant ?? "";
    this.user.email = this.email;
    if (!this.email) {
      this.user.email = this.$route.query.e?.toString() ?? "";
      this.accepted = this.$route.query.a === "true";
      if (this.user.email && this.user.email !== "") {
        this.emailDisabled = true;
      }
    } else {
      this.emailDisabled = true;
    }
  }
  mounted() {
    if (this.$route.params.tenant) {
      this.loading = true;
      services.tenantUserInvitations
        .getInviteURL(this.$route.params.tenant)
        .then((response: TenantDto) => {
          this.tenant = response;
        })
        .catch((error) => {
          if (error.status === 404) {
            this.$refs.errorModal.show(this.$t("shared.invalidInvitation"));
          }
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
  accept() {
    if (!this.emailDisabled && this.user.password !== this.user.passwordConfirm) {
      this.$refs.errorModal.show(this.$t("account.login.errors.passwordMissmatch"));
      return;
    }
    this.$refs.loadingButton.start();
    services.tenantUserInvitations
      .requestAccess(this.$route.params.tenant, this.user)
      .then(() => {
        this.requested = true;
      })
      .catch((error) => {
        this.$refs.errorModal.show(this.$t("shared.error"), this.$t(error));
      })
      .finally(() => {
        if (this.$refs.loadingButton) {
          this.$refs.loadingButton.stop();
        }
      });
  }
  logout() {
    store.commit("auth/logout");
    this.emailDisabled = false;
    this.user.email = "";
  }
  get email() {
    return store.state.account.user?.email ?? "";
  }
}
</script>

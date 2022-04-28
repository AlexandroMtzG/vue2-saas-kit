<template>
  <div>
    <div class="min-h-screen flex flex-col justify-center py-12 px-6 lg:px-8">
      <Logo class="mx-auto h-12 w-auto" />
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2
          class="mt-6 text-center text-lg font-extrabold text-coolGray-800 dark:text-blueGray-200"
        >{{ $t("account.verify.title") }}</h2>
        <p class="mt-2 text-center text-sm leading-5 text-gray-500 max-w">
          {{ $t("account.register.alreadyRegistered") }}
          <span
            class="font-medium text-theme-500 hover:text-theme-400 focus:outline-none focus:underline transition ease-in-out duration-150"
          >
            <router-link to="/login">{{ $t("account.register.clickHereToLogin") }}</router-link>
          </span>
        </p>
        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div class="sm:rounded-sm sm:px-10">
            <form @submit.prevent="verify">
              <div>
                <label
                  for="email"
                  class="block text-sm font-medium leading-5 text-gray-900 dark:text-blueGray-300"
                >{{ $t("account.shared.email") }}</label>
                <div class="mt-1 rounded-sm shadow-sm">
                  <input
                    disabled
                    :class="{
                      'bg-gray-100 dark:bg-blueGray-800 cursor-not-allowed': true
                    }"
                    v-model="user.email"
                    id="email"
                    type="email"
                    required
                    class="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-coolGray-800 dark:text-blueGray-200 rounded-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                  />
                </div>
              </div>
              <div v-if="requireName" class="mt-6">
                <label
                  for="firstName"
                  class="block text-sm font-medium leading-5 text-gray-900 dark:text-blueGray-300"
                >{{ $t("account.register.firstName") }}</label>
                <div class="mt-1 rounded-sm shadow-sm">
                  <input
                    v-model="user.firstName"
                    id="firstName"
                    type="text"
                    required
                    class="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-coolGray-800 dark:text-blueGray-200 rounded-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                  />
                </div>
              </div>
              <div v-if="requireName" class="mt-6">
                <label
                  for="lastName"
                  class="block text-sm font-medium leading-5 text-gray-900 dark:text-blueGray-300"
                >{{ $t("account.register.lastName") }}</label>
                <div class="mt-1 rounded-sm shadow-sm">
                  <input
                    v-model="user.lastName"
                    id="lastName"
                    type="text"
                    required
                    class="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-coolGray-800 dark:text-blueGray-200 rounded-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                  />
                </div>
              </div>
              <div v-if="requirePassword" class="mt-6">
                <label
                  for="password"
                  class="block text-sm font-medium leading-5 text-gray-900 dark:text-blueGray-300"
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
                  class="block text-sm font-medium leading-5 text-gray-900 dark:text-blueGray-300"
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
                  >{{ $t("account.verify.button") }}</LoadingButton>
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
import Logo from "@/components/front/Logo.vue";
import LoadingButton from "@/components/ui/buttons/LoadingButton.vue";
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import services from "@/services";
import { UserVerifyRequest } from '@/application/contracts/core/users/UserVerifyRequest';
import i18n from '@/locale/i18n';

@Component({
  metaInfo: {
    title: i18n.t("account.verify.title").toString(),
  },
  components: {
    Logo,
    LoadingButton,
    ErrorModal
  }
})
export default class Verify extends Vue {
  $refs!: {
    loadingButton: LoadingButton;
    errorModal: ErrorModal;
  };
  requireName = false;
  requirePassword = true;
  user = {} as UserVerifyRequest;
  created() {
    this.user.email = this.$route.query.e ? this.$route.query.e.toString() : "";
    this.user.token = this.$route.query.t ? this.$route.query.t.toString() : "";
  }
  verify() {
    if (this.user.password !== this.user.passwordConfirm) {
      this.$refs.errorModal.show(
        this.$t("account.login.errors.passwordMissmatch")
      );
      return;
    }

    this.$refs.loadingButton.start();
    services.authentication
      .verify(this.user)
      .catch(error => {
        this.$refs.errorModal.show(this.$t("shared.error"), this.$t(error));
      })
      .finally(() => {
        if (this.$refs.loadingButton) {
          this.$refs.loadingButton.stop();
        }
      });
  }
}
</script>
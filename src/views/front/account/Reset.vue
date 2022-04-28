<template>
  <div>
    <div class="min-h-screen flex flex-col justify-center py-12 px-6 lg:px-8">
      <Logo class="mx-auto h-12 w-auto" />
      <div>
        <h2
          class="mt-6 text-center text-md leading-9 font-bold text-gray-900 dark:text-blueGray-300"
        >{{ $t("account.newPassword.title") }}</h2>
        <p class="mt-2 text-center text-sm leading-5 text-gray-900 dark:text-blueGray-300 max-w">
          {{ $t("account.forgot.rememberedPassword") }}
          <span
            class="font-medium text-theme-500 hover:text-theme-400 focus:outline-none focus:underline transition ease-in-out duration-150"
          >
            <router-link to="/login">
              {{
              $t("account.register.clickHereToLogin")
              }}
            </router-link>
          </span>
        </p>
        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div class="max-w-md w-full mx-auto rounded-sm px-8 pt-6 pb-8 mb-4 mt-8">
            <form @submit.prevent="reset">
              <div>
                <label
                  for="email"
                  class="block text-sm font-medium leading-5 text-gray-900 dark:text-blueGray-300"
                >{{ $t("account.shared.email") }}</label>
                <div class="mt-1 rounded-sm shadow-sm">
                  <input
                    disabled
                    v-model="user.email"
                    id="email"
                    type="email"
                    required
                    class="bg-gray-100 cursor-not-allowed appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-coolGray-800 dark:text-blueGray-200 rounded-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                    :class="{
                      'bg-gray-100 dark:bg-blueGray-800 cursor-not-allowed': true
                    }"
                  />
                </div>
              </div>
              <div class="mt-6">
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
              <div class="mt-6">
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
                    ref="loadingButton"
                    type="submit"
                    class="relative block w-full py-2 px-3 border border-transparent rounded-sm text-white font-semibold bg-gray-800 hover:bg-gray-700 focus:bg-gray-900 focus:outline-shadow sm:text-sm sm:leading-5"
                  >{{ $t("account.newPassword.button") }}</LoadingButton>
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
import services from "@/services";
import { UserVerifyRequest } from '@/application/contracts/core/users/UserVerifyRequest';
import LoadingButton from '../../../components/ui/buttons/LoadingButton.vue';
import i18n from '@/locale/i18n';

@Component({
  metaInfo: {
    title: i18n.t("account.reset.title").toString(),
  },
  components: {
    ErrorModal,
    Logo,
    LoadingButton
  },
})
export default class Verify extends Vue {
  $refs!: {
    loadingButton: LoadingButton;
    errorModal: ErrorModal;
  };
  loading = false;
  user = {} as UserVerifyRequest;
  created() {
    this.user.email = this.$route.query.e ? this.$route.query.e.toString() : "";
    this.user.token = this.$route.query.t ? this.$route.query.t.toString() : "";
  }
  reset() {
    this.loading = true;
    if (this.user.password !== this.user.passwordConfirm) {
      return;
    }
    this.$refs.loadingButton.start();
    services.authentication.verify(this.user).catch(error => {
      this.$refs.errorModal.show(this.$t("shared.error"), this.$t(error));
    }).finally(() => {
      this.$refs.loadingButton.stop();
    });
  }
}
</script>
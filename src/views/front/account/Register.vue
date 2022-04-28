<template>
  <div>
    <div class="min-h-screen flex flex-col justify-center py-12 px-6 lg:px-8">
      <Logo class="mx-auto h-12 w-auto" />
      <div v-if="!registered">
        <h2
          class="mt-6 text-center text-lg leading-9 font-bold text-coolGray-800 dark:text-blueGray-200"
        >{{ $t("account.register.title") }}</h2>
        <p
          class="mt-2 text-center text-sm leading-5 text-coolGray-800 dark:text-blueGray-200 max-w"
        >
          {{ $t("account.register.alreadyRegistered") }}
          <a
            class="font-medium text-theme-500 hover:text-theme-400 focus:outline-none focus:underline transition ease-in-out duration-150"
          >
            <router-link to="/login">{{ $t("account.register.clickHereToLogin") }}</router-link>
          </a>
        </p>

        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div class="py-0 px-0 sm:rounded-sm sm:px-10">
            <form @submit.prevent="tryRegister()" class="space-y-6">
              <!-- Workspace -->
              <div>
                <label class="block text-sm font-medium">{{ $t("account.register.organization") }}</label>

                <div class="mt-1 rounded-md shadow-sm -space-y-px">
                  <div>
                    <label for="company" class="sr-only">{{ $t("models.workspace.object") }}</label>
                    <input
                      id="company"
                      v-model="user.workspaceName"
                      type="text"
                      name="company"
                      required
                      :disabled="!workspaceNameEnabled"
                      :placeholder="$t('models.workspace.name')"
                      :class="{
                        'bg-gray-100 dark:bg-blueGray-800 cursor-not-allowed': !workspaceNameEnabled,
                      }"
                      class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-coolGray-800 dark:text-blueGray-200 focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
              <!-- Workspace: End  -->

              <!-- Personal Info -->
              <div>
                <legend class="block text-sm font-medium">{{ $t("account.register.personalInfo") }}</legend>
                <div class="mt-1 rounded-sm shadow-sm -space-y-px">
                  <div class="flex">
                    <div class="w-1/2">
                      <label for="first-name" class="sr-only">{{ $t("models.user.firstName") }}</label>
                      <input
                        v-model="user.firstName"
                        ref="inputFirstName"
                        type="text"
                        name="first-name"
                        id="first-name"
                        required
                        class="appearance-none rounded-none rounded-tl-md relative block w-full px-3 py-2 border border-r-0 border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-coolGray-800 dark:text-blueGray-200 focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                        :placeholder="$t('account.register.firstName')"
                      />
                    </div>
                    <div class="w-1/2">
                      <label for="last-name" class="sr-only">{{ $t("models.user.lastName") }}</label>
                      <input
                        v-model="user.lastName"
                        type="text"
                        name="last-name"
                        id="last-name"
                        required
                        class="appearance-none rounded-none rounded-tr-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-coolGray-800 dark:text-blueGray-200 focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                        :placeholder="$t('account.register.lastName')"
                      />
                    </div>
                  </div>
                  <div>
                    <label for="email" class="sr-only">{{ $t("models.user.email") }}</label>
                    <input
                      v-model="user.email"
                      type="text"
                      name="email"
                      id="email"
                      required
                      :placeholder="$t('account.shared.email')"
                      :disabled="!emailEnabled"
                      :class="{
                        'bg-gray-100 dark:bg-blueGray-800 cursor-not-allowed': !emailEnabled,
                      }"
                      class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-coolGray-800 dark:text-blueGray-200 focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                    />
                  </div>
                  <input
                    v-model="user.password"
                    id="password"
                    type="password"
                    autocomplete="off"
                    required
                    :placeholder="$t('account.register.password')"
                    class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-coolGray-800 dark:text-blueGray-200 focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                  />
                  <input
                    v-model="user.confirmPassword"
                    id="confirmPassword"
                    type="password"
                    autocomplete="off"
                    required
                    :placeholder="$t('account.register.confirmPassword')"
                    class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-coolGray-800 dark:text-blueGray-200 rounded-b-md focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                  />
                </div>
              </div>
              <!-- Personal Info: End -->

              <Plans />

              <div class="mt-2 flex items-center space-x-3">
                <button
                  aria-label="accept-terms-and-conditions"
                  type="button"
                  class="relative inline-flex flex-shrink-0 h-5 w-9 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-theme-500"
                  @click="toggleAcceptTerms"
                  role="switch"
                  aria-checked="false"
                  :class="{
                    'bg-gray-200 dark:bg-gray-700': !acceptTermsAndConditions,
                    'bg-theme-600 dark:bg-theme-400': acceptTermsAndConditions,
                  }"
                >
                  <span class="sr-only">{{ $t("app.workspaces.types.PUBLIC") }}</span>
                  <span
                    class="translate-x-0 pointer-events-none relative inline-block h-4 w-4 rounded-full bg-white dark:bg-gray-900 shadow transform ring-0 transition ease-in-out duration-200"
                    :class="{
                      'translate-x-4': acceptTermsAndConditions,
                      'translate-x-0': !acceptTermsAndConditions,
                    }"
                  >
                    <!-- Enabled: "opacity-0 ease-out duration-100", Not Enabled: "opacity-100 ease-in duration-200" -->
                    <span
                      class="opacity-100 ease-in duration-200 absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
                      aria-hidden="true"
                      :class="{
                        'hidden opacity-0 ease-out duration-100': acceptTermsAndConditions,
                        'opacity-100 ease-in duration-200': !acceptTermsAndConditions,
                      }"
                    >
                      <svg class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                        <path
                          d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                    <!-- Enabled: "opacity-100 ease-in duration-200", Not Enabled: "opacity-0 ease-out duration-100" -->
                    <span
                      class="opacity-0 ease-out duration-100 absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
                      aria-hidden="true"
                      :class="{
                        'opacity-100 ease-in duration-200': acceptTermsAndConditions,
                        'hidden opacity-0 ease-out duration-100': !acceptTermsAndConditions,
                      }"
                    >
                      <svg
                        class="h-3 w-3 text-theme-600 dark:text-theme-400"
                        fill="currentColor"
                        viewBox="0 0 12 12"
                      >
                        <path
                          d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z"
                        />
                      </svg>
                    </span>
                  </span>
                </button>
                <span class="flex-grow flex flex-col">
                  <span
                    class="text-sm font-normal dark:bg-gray-900 text-coolGray-800 dark:text-blueGray-200"
                    id="accept-terms-and-conditions"
                  >{{ $t("account.register.acceptTerms") }}</span>
                </span>
              </div>

              <div v-show="!loading" class="mt-3">
                <span class="block w-full rounded-sm shadow-sm">
                  <LoadingButton class="w-full block" type="submit" ref="loadingButton">
                    <span
                      v-if="selectedPrice && selectedPrice.price === 0"
                    >{{ $t("pricing.signUpFree") }}</span>
                    <span
                      v-else-if="selectedPrice && selectedPrice.trialDays > 0"
                    >{{ $t("account.register.startTrial", [selectedPrice.trialDays]) }}</span>
                    <span v-else-if="!getButtonText">{{ $t("settings.subscription.plans.select") }}</span>
                    <span v-else>{{ getButtonText }}</span>
                  </LoadingButton>
                </span>
              </div>

              <p
                class="mt-3 py-2 text-gray-500 text-sm border-t border-gray-200 dark:border-gray-700"
              >
                {{ $t("account.register.bySigningUp") }}
                <a
                  target="_blank"
                  href="/terms-and-conditions"
                  class="text-theme-500 underline"
                >{{ $t("account.register.termsAndConditions") }}</a>
                {{ $t("account.register.andOur") }}
                <a
                  target="_blank"
                  href="/privacy-policy"
                  class="text-theme-500 underline"
                >{{ $t("account.register.privacyPolicy") }}</a>.
              </p>
            </form>
          </div>
        </div>
      </div>
      <div v-else class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div
          class="bg-blueGray-50 dark:bg-blueGray-800 max-w-sm w-full mx-auto rounded-sm px-8 pt-6 pb-8 mb-4 mt-8"
        >
          <h2
            class="mt-6 text-center text-3xl leading-9 font-bold text-coolGray-800 dark:text-blueGray-200"
          >{{ $t("account.register.successTitle") }}</h2>
          <div class="my-4 leading-tight">
            <p
              class="mt-2 text-center text-sm leading-5 text-coolGray-800 dark:text-blueGray-200 max-w"
            >{{ $t("account.register.successText") }}</p>
          </div>
        </div>
      </div>
    </div>
    <Modal ref="modalInvitation">
      <div
        class="space-y-6 text-gray-900"
        v-if="linkInvitation && linkInvitation.createdByUser && linkInvitation.createdByWorkspace"
      >
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-theme-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-theme-600"
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
        </div>
        <div class="mt-3 text-center sm:mt-5">
          <h3 class="text-lg leading-6 font-medium" id="modal-title">
            {{ $t("app.links.invitation.toBe") }}
            <span
              v-if="linkInvitation.inviteeIsProvider"
              class="font-bold text-theme-600"
            >{{ $t("models.provider.object") }}</span>
            <span v-else class="font-bold text-theme-600">{{ $t("models.client.object") }}</span>
          </h3>
          <div class="mt-4 text-left">
            <p class="font-normal text-base">
              {{ linkInvitation.createdByUser.firstName }}
              <span
                class="italic text-gray-600"
              >({{ linkInvitation.createdByUser.email }})</span>
              {{ $t("app.links.invitation.hasInvitedYou") }}
              <span
                class="font-bold"
              >{{ linkInvitation.createdByWorkspace.name }}</span>
              {{ $t("app.links.invitation.andYourCompany") }}
              <span
                class="font-bold"
              >{{ linkInvitation.workspaceName }}</span>
              <span
                v-if="linkInvitation.inviteeIsProvider"
              >{{ " " }} {{ $t("app.links.invitation.reasonAsProvider") }}.</span>
              <span v-else>{{ " " }} {{ $t("app.links.invitation.reasonAsClient") }}.</span>
            </p>
          </div>
          <div
            v-if="linkInvitation.message"
            class="mt-4 text-left bg-gray-50 border border-gray-300 py-2 px-2"
          >
            <p class="font-normal text-base text-gray-600">
              <span
                class="font-medium"
              >{{ $t("app.links.invitation.message") }} {{ linkInvitation.createdByUser.firstName }}</span>
              :
              {{ linkInvitation.message }}
            </p>
          </div>
        </div>
      </div>
      <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
        <button
          type="button"
          ref="buttonAcceptInvitation"
          @click="acceptInvitation"
          class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-theme-600 text-base font-medium text-white hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500 sm:col-start-2 sm:text-sm"
        >{{ $t("shared.accept") }}</button>
        <button
          @click="rejectInvitation"
          type="button"
          class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500 sm:mt-0 sm:col-start-1 sm:text-sm"
        >{{ $t("shared.reject") }}</button>
      </div>
    </Modal>
    <Modal ref="cardModal">
      <div>
        <form @submit.prevent="pay">
          <card
            ref="card"
            class="stripe-card w-full mt-5 mb-5"
            :class="cardCompleted ? 'border-1 border-green-100' : ''"
            :stripe="stripeKey"
            :options="stripeOptions"
            @change="cardCompleted = $event.complete"
          />

          <LoadingButton
            type="submit"
            class="w-full"
            ref="payButton"
            :disabled="!cardCompleted"
          >{{ getButtonText }}</LoadingButton>
        </form>
      </div>
    </Modal>
    <ConfirmModal ref="confirmModalRegister" @yes="confirmedRegister" />
    <ErrorModal ref="errorModal" />
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";
// @ts-ignore
import { Card, createToken } from "vue-stripe-elements-plus";
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import Plans from "@/components/ui/radios/PlansRadioButtons.vue"
import Logo from "@/components/front/Logo.vue";
import LoadingButton from "@/components/ui/buttons/LoadingButton.vue";
import Modal from "@/components/ui/modals/Modal.vue";
import store from "@/store";
import { LinkStatus } from "@/application/enums/core/links/LinkStatus";
import { LinkInvitationDto } from "@/application/dtos/core/links/LinkInvitationDto";
import services from "@/services";
import ConfirmModal from "@/components/ui/modals/ConfirmModal.vue";
import NumberUtils from '@/utils/shared/NumberUtils';
import { UserRegisterRequest } from '@/application/contracts/core/users/UserRegisterRequest';
import { SubscriptionCouponDto } from '@/application/dtos/core/subscriptions/SubscriptionCouponDto';
import { SubscriptionBillingPeriod } from '@/application/enums/core/subscriptions/SubscriptionBillingPeriod';
import { SubscriptionProductDto } from '@/application/dtos/core/subscriptions/SubscriptionProductDto';
import { SubscriptionPriceDto } from '@/application/dtos/core/subscriptions/SubscriptionPriceDto';
import i18n from '@/locale/i18n';

@Component({
  metaInfo: {
    title: i18n.t("account.register.title").toString(),
  },
  components: {
    ErrorModal,
    Modal,
    Card,
    Plans,
    Logo,
    LoadingButton,
    ConfirmModal,
  }
})
export default class Register extends Vue {
  $refs!: {
    inputFirstName: HTMLInputElement;
    loadingButton: LoadingButton;
    payButton: LoadingButton;
    modalInvitation: Modal;
    errorModal: ErrorModal;
    cardModal: Modal;
    buttonAcceptInvitation: HTMLButtonElement;
    confirmModalRegister: ConfirmModal;
  };
  loading = false;
  user = {} as UserRegisterRequest;
  email = "";
  // verifyToken: string = "";
  stripeKey = "";
  stripeOptions: any = {};
  cardCompleted = false;
  registered = false;
  haveCoupon = false;
  couponCode = "";
  couponDescription = "";
  coupon: SubscriptionCouponDto | null = null;
  linkInvitation: LinkInvitationDto | null = null;
  linkInvitationAccepted = false;

  emailEnabled = true;
  workspaceNameEnabled = true;

  acceptTermsAndConditions = false;

  created() {
    if (this.$route.query.e) {
      this.user.email = this.$route.query.e.toString();
    }

    this.stripeKey = process.env.VUE_APP_SUBSCRIPTION_PUBLIC_KEY?.toString() ?? "";
    this.stripeOptions = {
      showCardHolderName: true,
      hidePostalCode: false,
      iconStyle: "solid",
      elements: {
        locale: this.$i18n.locale,
      },
    };
  }
  mounted() {
    this.loading = true;
    services.subscriptionProducts
      .getProducts()
      .then(() => {
        if (this.$route.query.p) {
          const product = this.products.find((f) => f.tier === Number(this.$route.query.p));
          if (product) {
            store.commit("pricing/setSelected", {
              product,
              billingPeriod: store.state.pricing.billingPeriod,
            });
          }
        }
        if (!this.selectedProduct) {
          store.commit("pricing/setBillingPeriod", SubscriptionBillingPeriod.MONTHLY);
          store.commit("pricing/setCurrency", "usd");
          store.commit("pricng/select", {
            product: this.products[0],
            billingPeriod: store.state.pricing.billingPeriod,
          });
        }

        if (this.$route.params.coupon) {
          this.haveCoupon = true;
          this.couponCode = this.$route.params.coupon;
          this.searchCoupon(false);
        } else if (this.$route.query.coupon) {
          this.haveCoupon = true;
          this.couponCode = this.$route.query.coupon.toString();
          this.searchCoupon(false);
        }
        if (this.$route.query.i) {
          services.links.getInvitation(this.$route.query.i.toString()).then((response) => {
            this.linkInvitation = response;
            this.loadLinkInvitation();
          });
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
  loadLinkInvitation() {
    if (this.linkInvitation) {
      if (this.linkInvitation.status === LinkStatus.PENDING) {
        this.$refs.modalInvitation.show();
        this.$nextTick(() => {
          this.$refs.buttonAcceptInvitation.focus();
        });
      }
    }
  }
  rejectInvitation() {
    this.$refs.modalInvitation.close();
    services.links.rejectInvitation(this.linkInvitation?.id);
    this.linkInvitation = null;
  }
  acceptInvitation() {
    this.$refs.modalInvitation.close();
    this.linkInvitationAccepted = true;
    this.user.joinedByLinkInvitation = this.linkInvitation?.id;
    this.emailEnabled = false;
    this.workspaceNameEnabled = false;
    this.user.email = this.linkInvitation?.email ?? "";
    this.user.workspaceName = this.linkInvitation?.workspaceName ?? "";
    this.$nextTick(() => {
      if (this.$refs.inputFirstName) {
        this.$refs.inputFirstName.focus();
        this.$refs.inputFirstName.select();
      }
    });
  }
  searchCoupon(showError) {
    if (!this.selectedPrice) {
      return "";
    }
    if (!this.couponCode) {
      return;
    }
    services.subscriptionManager
      .getCoupon(this.couponCode, this.selectedPrice.currency)
      .then((response: SubscriptionCouponDto) => {
        this.coupon = response;
        if (this.coupon && this.coupon.name) {
          this.couponDescription = this.coupon.name.toString();
        }
      })
      .catch((error) => {
        this.couponDescription = this.$t("account.register.invalidCoupon").toString();
        if (showError) {
          this.$refs.errorModal.show(this.$t("shared.error"), this.$t(error));
        }
      });
  }
  tryRegister() {
    this.email = this.user.email;
    if (!this.selectedPrice) {
      this.$refs.errorModal.show(this.$t("shared.error"), this.$t("settings.subscription.plans.select"));
      return;
    }
    if (this.user.password != this.user.confirmPassword) {
      this.$refs.errorModal.show(this.$t("shared.error"), this.$t("api.errors.passwordMismatch"));
      return;
    }
    if (!this.acceptTermsAndConditions) {
      this.$refs.errorModal.show(this.$t("shared.error"), this.$t("account.register.errors.acceptTermsAndConditions"));
      return;
    }
    if (this.selectedPrice.trialDays === 0 && this.selectedPrice.price > 0) {
      this.$refs.cardModal.show();
    } else {
      this.$refs.confirmModalRegister.show(this.$t("account.register.prompts.register.title"), this.$t("shared.confirm"), this.$t("shared.back"), this.$t("account.register.prompts.register.description", [
        this.$t(this.selectedProduct?.title ?? "")
      ]));
    }
  }
  confirmedRegister() {
    this.register();
  }
  pay() {
    this.$refs.payButton.start();
    createToken()
      .then((data) => {
        if (data.error) {
          this.$refs.errorModal.show(this.$t("shared.error"), data.error.message);
        } else {
          this.register(data.token.id);
        }
      })
      .catch((error) => {
        this.$refs.errorModal.show(this.$t("shared.error"), error);
      })
      .finally(() => {
        this.$refs.payButton.stop();
        this.$refs.cardModal.close();
      });
  }
  register(cardToken = "") {
    if (!this.selectedPrice) {
      this.$refs.errorModal.show(this.$t("shared.error"), this.$t("account.register.errors.priceNotSelected"));
      return;
    } else if (this.selectedPrice && !this.selectedPrice.id) {
      this.$refs.errorModal.show(this.$t("shared.error"), this.$t("account.register.errors.priceNotInDatabase"));
      return;
    }
    this.user.selectedSubscription = {
      subscriptionPriceId: this.selectedPrice.id ?? "",
      subscriptionCardToken: cardToken,
      subscriptionCoupon: this.couponCode,
    };
    this.$refs.loadingButton.start();
    services.authentication
      .register(this.user)
      .then(() => {
        this.registered = true;
      })
      .catch((error) => {
        this.$refs.errorModal.show(this.$t("shared.error"), error);
      })
      .finally(() => {
        if (this.$refs.loadingButton) {
          this.$refs.loadingButton.stop();
        }
      });
  }
  toggleAcceptTerms() {
    this.acceptTermsAndConditions = !this.acceptTermsAndConditions
  }
  get products(): SubscriptionProductDto[] {
    return store.state.pricing.products;
  }
  get getButtonText(): string {
    if (!this.selectedPrice) {
      return "";
    }
    return (this.selectedPrice.billingPeriod === SubscriptionBillingPeriod.ONCE ? this.$t("pricing.pay") : this.$t("pricing.subscribe")) + " " + this.priceDescription;
  }
  get selectedPrice(): SubscriptionPriceDto | undefined {
    return this.selectedProduct?.prices.find((f) => f.billingPeriod === store.state.pricing.billingPeriod && f.currency === store.state.pricing.currency) ?? this.selectedProduct?.prices.filter((f) => f.currency === store.state.pricing.currency)[0];
  }
  get billingPeriod(): string {
    if (!this.selectedPrice) {
      return "";
    }
    if (this.selectedPrice.billingPeriod === SubscriptionBillingPeriod.ONCE) {
      return this.$t("pricing.once").toString();
    } else {
      return "/ " + this.$t("pricing." + SubscriptionBillingPeriod[this.selectedPrice.billingPeriod] + "Short");
    }
  }
  get discountedPrice(): number {
    if (!this.selectedPrice) {
      return 0;
    }
    let price = this.selectedPrice.price;
    if (this.coupon) {
      if (this.coupon.amountOff && this.selectedPrice.currency === this.coupon.currency) {
        price = price - this.coupon.amountOff / 100;
      } else if (this.coupon.percentOff) {
        price = Number((price * ((100 - this.coupon.percentOff) / 100)).toFixed(2));
      }
    }
    return price;
  }
  get priceDescription(): string {
    if (!this.selectedPrice) {
      return "";
    }
    return "$" + NumberUtils.intFormat(this.discountedPrice) + " " + this.selectedPrice.currency + " " + this.billingPeriod;
  }
  get selectedProduct(): SubscriptionProductDto | null {
    return store.state.pricing.selectedProduct;
  }
}
</script>

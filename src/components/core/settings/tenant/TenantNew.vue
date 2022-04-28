<template>
  <div>
    <div class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <div class="fixed inset-0 overflow-hidden">
      <div class="absolute inset-0 overflow-hidden">
        <section class="absolute inset-y-0 pl-16 max-w-full right-0 flex">
          <div class="w-screen max-w-md">
            <div class="h-full divide-y divide-gray-200 flex flex-col bg-white shadow-2xl">
              <div class="flex-1 h-0 overflow-y-auto bg-white text-gray-600">
                <header
                  class="space-y-1 py-6 px-4 bg-gray-100 sm:px-6 shadow-inner border-b border-gray-200"
                >
                  <div class="flex items-center justify-between space-x-3">
                    <h2
                      class="text-lg leading-7 font-medium text-gray-800"
                    >{{ $t("settings.tenant.create") }}</h2>
                    <div class="h-7 flex items-center">
                      <button
                        @click="close"
                        aria-label="Close panel"
                        class="text-gray-500 hover:text-gray-800 transition ease-in-out duration-150"
                      >
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div>
                    <p
                      class="text-sm leading-5 text-gray-500"
                    >{{ $t("settings.tenant.createDescription") }}</p>
                  </div>
                </header>
                <div class="flex-1 flex flex-col justify-between">
                  <div class="px-4 divide-y divide-gray-200 sm:px-6">
                    <div class="space-y-3 pt-6 pb-5">
                      <div>
                        <label
                          class="block text-sm font-medium"
                        >{{ $t("account.register.organization") }}</label>

                        <div class="mt-1 rounded-md shadow-sm -space-y-px">
                          <div>
                            <label for="company" class="sr-only">{{ $t("models.workspace.name") }}</label>
                            <input
                              v-model="name"
                              type="text"
                              name="company"
                              id="company"
                              :placeholder="$t('models.workspace.name')"
                              required
                              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:bg-gray-900 text-coolGray-800 dark:text-blueGray-200 focus:outline-none focus:ring-theme-500 focus:border-theme-500 focus:z-10 sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <CurrencyToggle class="w-full flex justify-center" theme="light" />
                      </div>
                      <div class="space-y-1">
                        <PlansRadioButtons ref="plans" />
                      </div>
                    </div>

                    <div class="space-y-4 pt-4 pb-6 text-right text-gray-700">
                      <div class="text-sm leading-5 right-0">
                        <span class="inline-flex rounded-sm shadow-sm">
                          <ButtonSecondary @click="close">{{ $t("shared.cancel") }}</ButtonSecondary>
                        </span>
                        <span class="inline-flex rounded-sm shadow-sm ml-2">
                          <ButtonPrimary @click="createTenant">{{ $t("shared.create") }}</ButtonPrimary>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
    <Modal ref="cardModal">
      <div>
        <card
          ref="card"
          class="stripe-card w-full mt-5 mb-5"
          :class="complete ? 'border-1 border-green-100' : ''"
          :stripe="stripeKey"
          :options="stripeOptions"
          @change="complete = $event.complete"
        />

        <button
          class="block w-full py-2 px-3 border border-transparent rounded-sm text-white font-semibold bg-gray-800 hover:bg-gray-700 focus:bg-gray-900 focus:outline-shadow sm:text-sm sm:leading-5"
          @click="pay"
          :disabled="!complete"
        >{{ getButtonText }}</button>
      </div>
    </Modal>
    <ErrorModal ref="errorModal" />
    <ConfirmModal ref="confirmModal" @yes="tryRegister" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import ConfirmModal from "@/components/ui/modals/ConfirmModal.vue";
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import Modal from "@/components/ui/modals/Modal.vue";
import PlansRadioButtons from "@/components/ui/radios/PlansRadioButtons.vue"
// @ts-ignore
import { Card, createToken } from "vue-stripe-elements-plus";
import CurrencyToggle from "@/components/ui/toggles/CurrencyToggle.vue";
import { SubscriptionProductDto } from "@/application/dtos/core/subscriptions/SubscriptionProductDto";
import { SubscriptionPriceDto } from "@/application/dtos/core/subscriptions/SubscriptionPriceDto";
import { TenantCreateRequest } from "@/application/contracts/core/tenants/TenantCreateRequest";
import { SubscriptionBillingPeriod } from "@/application/enums/core/subscriptions/SubscriptionBillingPeriod";
import store from "@/store";
import services from "@/services";
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary.vue";
import ButtonSecondary from "@/components/ui/buttons/ButtonSecondary.vue";

@Component({
  components: {
    ErrorModal,
    Modal,
    ConfirmModal,
    PlansRadioButtons,
    Card,
    CurrencyToggle,
    ButtonPrimary,
    ButtonSecondary
  },
})
export default class TenantNew extends Vue {
  $refs!: {
    errorModal: ErrorModal;
    cardModal: Modal;
    confirmModal: ConfirmModal;
  };
  name = "";
  stripeKey = "";
  stripeOptions: any = {};
  complete = false;
  created() {
    this.stripeKey = process.env.VUE_APP_SUBSCRIPTION_PUBLIC_KEY?.toString() ?? "";
    this.stripeOptions = {
      showCardHolderName: true,
      hidePostalCode: false,
      iconStyle: "solid",
      elements: {
        locale: this.$i18n.locale,
      },
    };
    if (!this.selectedProduct) {
      store.commit("pricing/setSelected", {
        product: store.state.pricing.products[0],
        billingPeriod: SubscriptionBillingPeriod.MONTHLY,
      });
    }
  }
  mounted() {
    services.subscriptionProducts.getProducts();
  }
  close() {
    this.$emit("close");
  }
  createTenant() {
    if (!this.selectedPrice || this.name === "") {
      this.$refs.errorModal.show(this.$t("shared.missingFields"));
    } else {
      this.$refs.confirmModal.show(this.$t("settings.tenant.createConfirm"));
    }
  }
  tryRegister() {
    if (this.selectedPrice?.trialDays === 0 && this.selectedPrice?.price > 0) {
      this.$refs.cardModal.show();
    } else {
      this.register();
    }
  }
  pay() {
    createToken()
      .then((data) => {
        if (data.error) {
          this.$refs.errorModal.show(data.error.message);
        } else {
          this.register(data.token.id);
        }
      })
      .catch((error) => {
        this.$refs.errorModal.show(this.$t("shared.error"), this.$t(error));
      })
      .finally(() => {
        this.$refs.cardModal.close();
      });
  }
  register(stripeCardToken = "") {
    const tenantCreateRequest: TenantCreateRequest = {
      name: this.name,
      selectedSubscription: {
        subscriptionPriceId: this.selectedPrice?.id ?? "",
        subscriptionCardToken: stripeCardToken,
        subscriptionCoupon: "",
      },
    };
    services.tenants
      .create(tenantCreateRequest)
      .then(() => {
        this.name = "";
        this.$emit("close");
      })
      .catch((error) => {
        this.$refs.errorModal.show(this.$t("shared.error"), this.$t(error));
      });
  }
  get selectedProduct() {
    return store.state.pricing.selectedProduct as SubscriptionProductDto;
  }
  get getButtonText(): string {
    if (this.selectedPrice) {
      return (
        (this.selectedPrice.billingPeriod === SubscriptionBillingPeriod.ONCE ? this.$t("pricing.pay") : this.$t("pricing.subscribe")) +
        " " +
        this.priceDescription
      );
    }
    return "";
  }
  get selectedPrice(): SubscriptionPriceDto | undefined {
    if (this.selectedProduct) {
      return this.selectedProduct.prices.find((f) => f.billingPeriod === store.state.pricing.billingPeriod) ?? this.selectedProduct.prices[0];
    }
    return undefined;
  }
  get billingPeriod(): string {
    if (this.selectedPrice) {
      if (this.selectedPrice?.billingPeriod === SubscriptionBillingPeriod.ONCE) {
        return this.$t("pricing.once").toString();
      } else {
        return "/ " + this.$t("pricing." + SubscriptionBillingPeriod[this.selectedPrice.billingPeriod] + "Short");
      }
    }
    return "";
  }
  get priceDescription() {
    return "$" + this.selectedPrice?.price + " " + this.billingPeriod;
  }
}
</script>

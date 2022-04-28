<template>
  <div>
    <form @submit.prevent method="POST">
      <div class="shadow sm:rounded-sm">
        <div class="px-4 py-5 bg-white sm:p-6 space-y-2">
          <div class="flex items-center space-x-2 justify-between">
            <h3 class="leading-5 font-medium text-gray-900">{{ $t("shared.upgrade") }}</h3>
          </div>
          <div class="grid grid-cols-6 gap-2">
            <PlansRadioButtons
              :plansLabel="false"
              :showCurrent="true"
              ref="plans"
              class="-mt-6 col-span-6"
            />
          </div>
        </div>
        <div class="px-4 py-3 sm:px-6 flex items-center space-x-2 justify-end">
          <ButtonSecondary @click="openDropdown">
            <span>{{ !editing ? $t("shared.change") : $t("shared.cancel") }}</span>
          </ButtonSecondary>
          <LoadingButton
            v-if="editing"
            @click="updateSubscription"
            :disabled="selectingCurrentTenantProduct"
            :class="{
              ' opacity-50 cursor-not-allowed': selectingCurrentTenantProduct
            }"
            ref="loadingButton"
          >{{ $t("shared.upgrade") }}</LoadingButton>
        </div>
      </div>
    </form>

    <SuccessModal ref="successModal" />
    <ErrorModal ref="errorModal" />
    <ConfirmModal ref="confirmModal" @yes="yesUpdate" />
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";
import LoadingButton from "@/components/ui/buttons/LoadingButton.vue";
import PlansRadioButtons from "@/components/ui/radios/PlansRadioButtons.vue"
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import SuccessModal from "@/components/ui/modals/SuccessModal.vue";
import ConfirmModal from "@/components/ui/modals/ConfirmModal.vue";
import { SubscriptionCardDto } from "@/application/dtos/core/subscriptions/SubscriptionCardDto";
import { SubscriptionBillingPeriod } from "@/application/enums/core/subscriptions/SubscriptionBillingPeriod";
import store from "@/store";
import tinyEventBus from "@/plugins/tinyEventBus";
import services from "@/services";
import TenantUtils from "@/utils/store/TenantUtils";
import ButtonSecondary from "@/components/ui/buttons/ButtonSecondary.vue";

@Component({
  components: {
    PlansRadioButtons,
    ErrorModal,
    SuccessModal,
    ConfirmModal,
    LoadingButton,
    ButtonSecondary
  }
})
export default class MySubscriptionPlan extends Vue {
  $refs!: {
    errorModal: ErrorModal;
    successModal: SuccessModal;
    confirmModal: ConfirmModal;
    loadingButton: LoadingButton;
    plans: PlansRadioButtons;
  };
  editing = false;
  subscriptionCard!: SubscriptionCardDto;
  updateSubscription() {
    if (
      !this.selectedPrice ||
      !this.selectedProduct
    ) {
      this.$refs.errorModal.show(
        this.$t("shared.error"),
        this.$t("settings.subscription.errors.selectPlan")
      );
      return;
    }
    if (
      this.selectedPrice.trialDays === 0 &&
      this.selectedPrice.price > 0 &&
      !this.subscriptionCard
    ) {
      this.$refs.errorModal.show(this.$t("settings.tenant.payment.notSet"));
      return;
    }
    if (this.selectingCurrentTenantProduct) {
      this.$refs.errorModal.show(
        this.$t("settings.subscription.alreadySubscribed")
      );
      return;
    }

    this.$refs.confirmModal.show(
      this.$t("shared.updateSubscriptionTo", [
        this.$t(this.selectedProduct.title)
      ]).toString(),
      this.$t("shared.confirm").toString(),
      this.$t("shared.back").toString(),
      this.priceDescription
    );
  }
  yesUpdate() {
    if (!this.selectedPrice) {
      return;
    }
    this.$refs.loadingButton.start();
    services.subscriptionManager
      .updateSubscription({
        subscriptionPriceId: this.selectedPrice.id
      })
      .then(() => {
        services.subscriptionManager.getCurrentSubscription();
        services.tenants.getFeatures();
        this.$refs.successModal.show(
          this.$t("shared.updated"),
          this.$t("settings.subscription.updated")
        );
        tinyEventBus().emitter.emit("updated-plan");
        this.editing = false;
      })
      .catch(error => {
        this.$refs.errorModal.show(this.$t("shared.error"), this.$t(error));
      })
      .finally(() => {
        if (this.$refs.loadingButton) {
          this.$refs.loadingButton.stop();
        }
      });
  }
  openDropdown() {
    this.editing = !this.editing;
  }
  get selectedProduct() {
    return store.state.pricing.selectedProduct;
  }
  get selectedPrice() {
    return this.selectedProduct?.prices.find(
      f => f.billingPeriod === store.state.pricing.billingPeriod
    );
  }
  get activeTenantProducts() {
    return TenantUtils.activeProducts();
  }
  get selectingCurrentTenantProduct() {
    if (this.selectedPrice && this.activeTenantProducts.length > 0) {
      return this.selectedPrice.id === this.activeTenantProducts[0].id;
    }
    return false;
  }
  get priceDescription(): string {
    if (!this.selectedPrice) {
      return "";
    }
    const price = this.selectedPrice.price;
    const currency = this.selectedPrice.currency;
    const period =
      "/" +
      this.$t(
        "pricing." +
        SubscriptionBillingPeriod[this.selectedPrice.billingPeriod] +
        "Short"
      );
    // const feature = this.selectedProduct?.features[0].value;
    return `${price} ${currency}${period}.`;
  }
}
</script>

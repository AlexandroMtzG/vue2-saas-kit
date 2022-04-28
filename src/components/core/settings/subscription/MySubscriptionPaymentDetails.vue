<template>
  <div>
    <form @submit.prevent>
      <div class="shadow overflow-hidden sm:rounded-sm">
        <div class="px-4 py-5 bg-white sm:p-6">
          <div class="grid grid-cols-6 gap-2">
            <div class="col-span-6 sm:col-span-6 w-full">
              <span
                id="listbox-label"
                class="flex justify-between leading-5 font-medium text-gray-900 mb-4"
              >{{ $t("settings.tenant.payment.title") }}</span>
              <div class="text-gray-600 text-sm font-semibold" v-if="subscriptionCard && !editing">
                <span class="uppercase">{{ subscriptionCard.brand }}</span>
                <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
                {{ $t("settings.tenant.payment.ending") }} **** {{ subscriptionCardLast4 }} - {{ subscriptionCardExpDesc }}
              </div>
              <div v-else>
                <div v-if="editing" id="card-element">
                  <card
                    ref="card"
                    class="stripe-card w-full"
                    :class="complete ? 'border-1 border-green-100' : ''"
                    :stripe="stripeKey"
                    :options="stripeOptions"
                    @change="complete = $event.complete"
                  />
                </div>
                <div v-else class="text-red-500 text-sm">{{ $t("settings.tenant.payment.notSet") }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <ButtonSecondary @click="editing = !editing">
            <span>{{ !editing ? $t("shared.edit") : $t("shared.cancel") }}</span>
          </ButtonSecondary>

          <LoadingButton
            class="w-auto ml-3 py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-sm text-white bg-gray-800 shadow-sm hover:bg-gray-700 active:bg-gray-900 transition duration-150 ease-in-out"
            @click="updatePaymentDetails"
            v-if="editing"
            ref="loadingButton"
          >{{ $t("shared.save") }}</LoadingButton>
        </div>
      </div>
    </form>

    <SuccessModal ref="successModal" />
    <ErrorModal ref="errorModal" />
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import SuccessModal from "@/components/ui/modals/SuccessModal.vue";
import LoadingButton from "@/components/ui/buttons/LoadingButton.vue";
// @ts-ignore
import { Card, createToken } from "vue-stripe-elements-plus";
import i18n from "@/locale/i18n";
import services from "@/services";
import TenantUtils from '@/utils/store/TenantUtils';
import ButtonSecondary from "@/components/ui/buttons/ButtonSecondary.vue";

@Component({
  components: {
    LoadingButton,
    SuccessModal,
    ErrorModal,
    Card,
    ButtonSecondary
  },
})
export default class MySubscriptionPaymentDetails extends Vue {
  $refs!: {
    successModal: SuccessModal;
    errorModal: ErrorModal;
    loadingButton: LoadingButton;
  };
  editing = false;
  stripeKey!: string;
  stripeOptions!: any;
  complete = false;
  created() {
    this.stripeKey = process.env.VUE_APP_SUBSCRIPTION_PUBLIC_KEY ?? "";
    this.stripeOptions = {
      showCardHolderName: true,
      hidePostalCode: false,
      iconStyle: "solid",
      elements: {
        locale: i18n.locale,
      },
    };
  }
  updatePaymentDetails() {
    this.$refs.loadingButton.start();
    createToken()
      .then((data) => {
        if (data.error) {
          this.$refs.errorModal.show(data.error.message);
          if (this.$refs.loadingButton) {
            this.$refs.loadingButton.stop();
          }
        } else {
          if (data.token.id && data.token.id !== "") {
            this.updateCardToken(data.token.id);
          }
        }
      })
      .catch((error) => {
        this.$refs.errorModal.show(this.$t("shared.error"), this.$t(error));
      })
      .finally(() => {
        if (this.$refs.loadingButton) {
          this.$refs.loadingButton.stop();
        }
        this.editing = false;
      });
  }
  updateCardToken(token: string) {
    services.subscriptionManager
      .updateCardToken(token)
      .then(() => {
        services.subscriptionManager.getCurrentSubscription();
        this.$refs.successModal.show(this.$t("shared.updated"), this.$t("settings.tenant.payment.updated"));
      })
      .catch((error) => {
        this.$refs.errorModal.show(this.$t("shared.error"), this.$t(error));
      })
      .finally(() => {
        if (this.$refs.loadingButton) {
          this.$refs.loadingButton.stop();
        }
        this.editing = false;
      });
  }
  get subscriptionCard() {
    return TenantUtils.defaultSubscriptionCard();
  }
  get subscriptionCardLast4() {
    return this.subscriptionCard?.lastFourDigits;
  }
  get subscriptionCardExpDesc() {
    return ("0" + this.subscriptionCard?.expiryMonth).slice(-2) + " / " + this.subscriptionCard?.expiryYear;
  }
}
</script>

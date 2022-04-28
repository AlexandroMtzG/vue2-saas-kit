<template>
  <div>
    <Loading v-if="loading" />
    <span v-else>
      <fieldset>
        <legend class="text-sm font-medium flex items-center justify-between w-full">
          <div>
            <span v-if="plansLabel">{{ $t("shared.plan") }}</span>
          </div>
          <div class="flex items-center justify-center space-x-2">
            <button
              type="button"
              @click.prevent="selectMonthly"
              class="text-gray-500 text-sm font-normal focus:outline-none"
            >{{ getBillingPeriodName(3) }}</button>
            <button
              type="button"
              class="relative rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
              @click.prevent="toggleBillingPeriod"
            >
              <div class="w-8 h-4 transition bg-theme-500 rounded-full shadow-md outline-none"></div>
              <div
                class="absolute inline-flex items-center justify-center w-2 h-2 transition-all duration-200 ease-in-out transform bg-white rounded-full shadow-sm top-1 left-1"
                :class="{
                  'translate-x-0': billingPeriod == 3,
                  'translate-x-4': billingPeriod === 4,
                }"
              ></div>
            </button>
            <button
              type="button"
              @click.prevent="selectYearly"
              class="flex items-center space-x-1 text-gray-500 text-sm font-normal focus:outline-none"
            >
              <div>{{ getBillingPeriodName(4) }}</div>
              <div
                v-if="getYearlyDiscount()"
                class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-teal-100 text-teal-800"
              >{{ getYearlyDiscount() }}</div>
            </button>
          </div>
        </legend>

        <div class="mt-2 relative bg-white rounded-md -space-y-px">
          <div v-if="!loading && products.length === 0">
            <WarningBanner
              redirect="/admin/pricing"
              :title="$t('shared.error')"
              :text="$t('admin.pricing.noPricesInDatabase')"
            />
          </div>
          <!-- Checked: "bg-theme-50 border-theme-200 z-10", Not Checked: "border-gray-200" -->
          <label
            class="relative border p-4 flex flex-col cursor-pointer sm:pl-4 sm:pr-6 sm:grid sm:grid-cols-3 focus:outline-none"
            v-for="(product, index) in products"
            :key="index"
            :class="{
              'rounded-b-md': index === products.length - 1,
              'bg-theme-50 border-theme-200 z-10 ': isSelected(product),
              'border-gray-200': !isSelected(product),
            }"
          >
            <div class="flex items-center text-sm">
              <input
                type="radio"
                name="pricing-plan"
                :value="product.title"
                :checked="isSelected(product)"
                class="h-4 w-4 text-theme-600 border-gray-300 focus:ring-theme-500"
                aria-labelledby="pricing-plans-0-label"
                aria-describedby="pricing-plans-0-description-0 pricing-plans-0-description-1"
                @change="changedProduct"
              />
              <!-- Checked: "text-theme-900", Not Checked: "text-gray-900" -->
              <span
                id="pricing-plans-0-label"
                class="ml-3 font-medium"
                :class="{
                  'text-theme-900': isSelected(product),
                  'text-gray-900': !isSelected(product),
                }"
              >{{ $t(product.title) }}</span>
              <span
                v-if="showCurrent && activeProduct && activeProduct.subscriptionProduct.title === product.title"
                class="ml-2 font-extrabold truncate"
              >({{ $t("shared.current") }})</span>
            </div>
            <p
              id="pricing-plans-0-description-0"
              class="ml-6 pl-1 text-sm sm:ml-0 sm:pl-0 sm:text-center"
            >
              <!-- Checked: "text-theme-900", Not Checked: "text-gray-900" -->
              <span class="font-medium">
                <span
                  class="font-medium tracking-tight"
                  :class="{
                    'text-theme-900': isSelected(product),
                    'text-gray-900': !isSelected(product),
                  }"
                >{{ intFormat(getPriceAmount(product)) }}</span>
                <span
                  class="text-gray-500 font-normal"
                  v-if="billingPeriod === 3"
                >/ {{ $t("pricing.MONTHLYShort") }}</span>
                <span class="text-gray-500" v-else>/ {{ $t("pricing.YEARLYShort") }}</span>
              </span>
            </p>
            <!-- Checked: "text-theme-700", Not Checked: "text-gray-500" -->
            <p
              id="pricing-plans-0-description-1"
              class="ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-right"
              :class="{
                'text-theme-700': isSelected(product),
                'text-gray-500': !isSelected(product),
              }"
            >
              <span>{{ $t(product.features[0].key, [product.features[0].value]) }}</span>
            </p>
          </label>
        </div>
      </fieldset>
    </span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { SubscriptionProductDto } from "@/application/dtos/core/subscriptions/SubscriptionProductDto";
import { SubscriptionPriceDto } from "@/application/dtos/core/subscriptions/SubscriptionPriceDto";
import { SubscriptionBillingPeriod } from "@/application/enums/core/subscriptions/SubscriptionBillingPeriod";
import { Prop } from "vue-property-decorator";
import store from "@/store";
import services from "@/services";
import NumberUtils from "@/utils/shared/NumberUtils";
import TenantUtils from "@/utils/store/TenantUtils";
import Loading from "@/components/ui/loaders/Loading.vue";
import WarningBanner from "../banners/WarningBanner.vue";

@Component({
  components: {
    Loading,
    WarningBanner
  },
})
export default class PlansRadioButtons extends Vue {
  @Prop({ default: true }) plansLabel!: boolean;
  @Prop({ default: false }) showCurrent!: boolean;

  loading = false;
  created() {
    if (store.state.pricing.products.length === 0) {
      services.subscriptionProducts.getProducts().then(() => {
        this.loadCurrent();
      });
    }
  }
  mounted() {
    this.loading = true;
    services.subscriptionProducts
      .getProducts()
      .then(() => {
        this.loadCurrent();
        if (!store.state.auth.authenticated) {
          this.selectProductIfNotSelected();
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
  loadCurrent() {
    if (this.activeProduct) {
      store.commit("pricing/setSelected", {
        billingPeriod: this.activeProduct.subscriptionPrice.billingPeriod,
        product: this.activeProduct.subscriptionProduct,
      });
    }
  }
  getPrice(product: SubscriptionProductDto): SubscriptionPriceDto | undefined {
    const prices = product.prices.find((f) => (f.billingPeriod === store.state.pricing.billingPeriod || f.billingPeriod === SubscriptionBillingPeriod.ONCE) && f.currency === store.state.pricing.currency && f.active);
    return prices;
  }
  getPriceAmount(product): string {
    return NumberUtils.intFormat(this.getPrice(product)?.price ?? 0);
  }
  changedProduct(e) {
    const product = this.products.find((f) => f.title === e.target.value);
    if (product) {
      store.commit("pricing/setSelected", {
        product,
        billingPeriod: store.state.pricing.billingPeriod,
      });
    }
  }
  selectMonthly() {
    store.commit("pricing/setBillingPeriod", SubscriptionBillingPeriod.MONTHLY);
  }
  selectYearly() {
    store.commit("pricing/setBillingPeriod", SubscriptionBillingPeriod.YEARLY);
  }
  toggleBillingPeriod() {
    if (store.state.pricing.billingPeriod === SubscriptionBillingPeriod.MONTHLY) {
      this.selectYearly();
    } else {
      this.selectMonthly();
    }
  }
  selectProductIfNotSelected() {
    if (this.products.length > 0) {
      if (!this.products.find((f) => f.id === this.selectedProduct?.id)) {
        store.commit("pricing/setSelected", {
          billingPeriod: this.products[0].prices[0].billingPeriod,
          product: this.products[0],
        });
      }
    }
  }
  getBillingPeriodName(billingPeriod: SubscriptionBillingPeriod) {
    return this.$t("pricing." + SubscriptionBillingPeriod[billingPeriod]);
  }
  getYearlyDiscount(): string | undefined {
    const priceYearly = this.getPriceWithInterval(SubscriptionBillingPeriod.YEARLY);
    const priceMonthly = this.getPriceWithInterval(SubscriptionBillingPeriod.MONTHLY);
    if (priceYearly && priceMonthly) {
      const discount = 100 - (priceYearly.price * 100) / (priceMonthly.price * 12);
      if (discount !== 0) {
        return "-" + discount.toFixed(0) + "%";
      }
    }

    return undefined;
  }
  getPriceWithInterval(billingPeriod: SubscriptionBillingPeriod): SubscriptionPriceDto | undefined {
    let price: SubscriptionPriceDto | undefined;
    if (this.products && this.products.length > 0) {
      this.products.forEach((product) => {
        const prices = product.prices.find((f) => f.billingPeriod === billingPeriod && f.currency === store.state.pricing.currency && f.price > 0);
        if (prices) {
          price = prices;
        }
      });
    }
    return price;
  }
  isSelected(product: SubscriptionProductDto) {
    return this.selectedProduct && product.title === this.selectedProduct.title
  }
  intFormat(value) {
    return NumberUtils.intFormat(value)
  }
  get billingPeriod() {
    return store.state.pricing.billingPeriod;
  }
  get activeProduct() {
    return TenantUtils.activeProduct();
  }
  get selectedProduct(): SubscriptionProductDto | null {
    return store.state.pricing.selectedProduct;
  }
  get products() {
    const products = (store.state.pricing.products as SubscriptionProductDto[])
      ?.filter((f) => f.active && !f.contactUs)
      .sort((x, y) => {
        return x.tier > y.tier ? 1 : -1;
      });
    return products;
  }
}
</script>

<template>
  <div>
    <div v-if="currencies && currencies.length > 1" class="w-full flex justify-center mb-0">
      <div class="flex justify-center items-center rounded-md">
        <a
          v-for="(currency, idx) in currencies"
          :key="idx"
          @click.prevent="changeCurrency(currency)"
          class="border border-blueGray-200 dark:border-gray-700 uppercase flex justify-center w-36 sm:w-32"
          :class="[
            selectedCurrency !== currency
              ? 'text-xs p-2 cursor-pointer bg-gray-50 dark:bg-gray-700 '
              : 'text-xs p-2 cursor-pointer bg-white dark:bg-gray-900 border shadow-md border-blueGray-300 dark:border-gray-600',
            idx === 0
              ? 'rounded-l-md border-r-none'
              : 'rounded-r-md border-l-none'
          ]"
        >{{ currency }}</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import { SubscriptionProductDto } from "@/application/dtos/core/subscriptions/SubscriptionProductDto";
import Vue from "vue";
import store from "@/store";

@Component
export default class BillingPeriodToggle extends Vue {
  changeCurrency(currency) {
    store.commit("pricing/setCurrency", currency);
    this.$emit("selected");
  }
  get products(): SubscriptionProductDto[] {
    return store.state.pricing.products as SubscriptionProductDto[];
  }
  get selectedCurrency() {
    return store.state.pricing.currency;
  }
  get currencies() {
    const allCurrencies: string[] = [];
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    this.products.forEach(element => {
      element.prices.forEach(price => {
        allCurrencies.push(price.currency.toLowerCase());
      });
    });
    return allCurrencies.filter(onlyUnique);
  }
}
</script>

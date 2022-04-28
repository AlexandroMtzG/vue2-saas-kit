<template>
  <div>
    <div class="pt-2 space-y-2 mx-auto px-4 sm:px-6 lg:px-8">
      <Loading v-if="loading" />
      <div v-else-if="item && item.id">
        <div class="flex flex-col">
          <div class="overflow-x-auto">
            <div class="py-2 align-middle inline-block min-w-full">
              <div class="shadow overflow-hidden border border-gray-200 sm:rounded-lg">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th
                        v-for="(header, idx) in headers"
                        :key="idx"
                        scope="col"
                        class="text-xs px-3 py-2 text-left font-medium text-gray-500 tracking-wider select-none truncate"
                      >
                        <div class="flex items-center space-x-1 text-gray-500">
                          <div>{{ header.title }}</div>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="(item, idx) in products" :key="idx">
                      <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                        <span
                          v-if="item.subscriptionPrice && item.subscriptionPrice.subscriptionProduct"
                        >{{ $t(item.subscriptionPrice.subscriptionProduct.title) }}</span>
                      </td>
                      <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                        <span
                          v-if="item.subscriptionPrice"
                        >{{ item.subscriptionPrice.price }}{{ priceBillingPeriod(item.subscriptionPrice) }}</span>
                      </td>
                      <td
                        class="px-3 py-2 whitespace-nowrap text-sm text-gray-600"
                      >{{ dateYMD(item.startDate) }}</td>
                      <td
                        class="px-3 py-2 whitespace-nowrap text-sm text-gray-600"
                      >{{ dateYMD(item.endDate) }}</td>
                      <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                        <span
                          v-if="item.trialEnds"
                        >{{ $t("settings.subscription.trial.ends") }} {{ dateAgo(item.trialEnds) }}</span>
                      </td>
                      <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                        <span v-if="item.active">{{ $t("shared.active") }}</span>
                        <span v-else>{{ $t("shared.inactive") }}</span>
                      </td>
                      <td
                        class="px-3 py-2 whitespace-nowrap text-sm text-gray-600"
                      >{{ item.maxWorkspaces }}</td>
                      <td
                        class="px-3 py-2 whitespace-nowrap text-sm text-gray-600"
                      >{{ item.maxUsers }}</td>
                      <td
                        class="px-3 py-2 whitespace-nowrap text-sm text-gray-600"
                      >{{ item.maxLinks }}</td>
                      <td
                        class="px-3 py-2 whitespace-nowrap text-sm text-gray-600"
                      >{{ item.monthlyContracts }}</td>
                      <td
                        class="px-3 py-2 whitespace-nowrap text-sm text-gray-600"
                      >{{ item.maxStorage / 1024 }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import services from "@/services";
import { TenantDto } from "@/application/dtos/core/tenants/TenantDto";
import { TenantProductDto } from "@/application/dtos/core/tenants/TenantProductDto";
import { SubscriptionPriceDto } from "@/application/dtos/core/subscriptions/SubscriptionPriceDto";
import { SubscriptionBillingPeriod } from "@/application/enums/core/subscriptions/SubscriptionBillingPeriod";
import DateUtils from "@/utils/shared/DateUtils";
import Loading from "@/components/ui/loaders/Loading.vue";
import i18n from '@/locale/i18n';
import { Prop } from "vue-property-decorator";

@Component({
  components: {
    Loading,
  },
})
export default class TenantSubscription extends Vue {
  @Prop({}) id!: string;
  loading = false;
  openOptions = false;

  item: TenantDto = {} as TenantDto;
  products: TenantProductDto[] = [];

  headers = [
    {
      title: i18n.t("app.tenants.subscription.plan"),
    },
    {
      title: i18n.t("app.tenants.subscription.price"),
    },
    {
      title: i18n.t("app.tenants.subscription.starts"),
    },
    {
      title: i18n.t("app.tenants.subscription.ends"),
    },
    {
      title: i18n.t("app.tenants.subscription.isTrial"),
    },
    {
      title: i18n.t("app.tenants.subscription.status"),
    },
    {
      title: i18n.t("app.tenants.subscription.workspaces"),
    },
    {
      title: i18n.t("app.tenants.subscription.members"),
    },
    {
      title: i18n.t("app.tenants.subscription.links"),
    },
    {
      title: i18n.t("models.contract.plural"),
    },
    {
      title: i18n.t("app.tenants.subscription.storage"),
    },
  ];
  mounted() {
    this.reload();
  }
  reload() {
    this.closeOptions();
    const promises: any[] = [
      services.tenants.get(this.id).then((response) => {
        this.item = response;
      }),
      services.tenants.adminGetProducts(this.id).then((response) => {
        this.products = response;
      }),
    ];

    this.loading = true;
    Promise.all(promises).finally(() => {
      this.loading = false;
    });
  }
  closeOptions() {
    this.openOptions = false;
  }
  priceBillingPeriod(price: SubscriptionPriceDto): string {
    if (price.billingPeriod === SubscriptionBillingPeriod.ONCE) {
      return this.$t("pricing.once").toString();
    } else {
      return "/" + this.$t("pricing." + SubscriptionBillingPeriod[price.billingPeriod] + "Short");
    }
  }
  dateAgo(value: Date) {
    return DateUtils.dateAgo(value);
  }
  dateYMD(value: Date | undefined) {
    return DateUtils.dateYMD(value);
  }
}
</script>

<template>
  <div>
    <div class="bg-white shadow-sm border-b border-gray-300 w-full py-2">
      <div
        class="mx-auto max-w-5xl xl:max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 space-x-2"
      >
        <h1 class="flex-1 font-bold flex items-center truncate">{{ $t("models.contract.plural") }}</h1>
        <div class="flex items-center">
          <ButtonPrimary to="/app/contract/new">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="hidden lg:block">{{ $t("app.contracts.new.title") }}</span>
            <span class="lg:hidden">{{ $t("shared.new") }}</span>
          </ButtonPrimary>
        </div>
      </div>
    </div>
    <div class="bg-white border-b border-gray-300 w-full py-2">
      <div
        class="mx-auto max-w-5xl xl:max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 space-x-2"
      >
        <Tabs :tabs="tabs" paramName="status" class="flex-grow" />
      </div>
    </div>
    <div class="pt-2 space-y-2 max-w-5xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ContractsList :filter="filter" :key="filter" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Watch } from "vue-property-decorator";
import Tabs, { TabItem } from "@/components/ui/tabs/Tabs.vue"
import ContractsList from "@/components/app/contracts/ContractsList.vue";
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary.vue";
import { ContractStatusFilter } from '@/application/contracts/app/contracts/ContractStatusFilter';
import i18n from "@/locale/i18n";

@Component({
  metaInfo: {
    title: i18n.t("models.contract.plural").toString()
  },
  components: {
    Tabs,
    ContractsList,
    ButtonPrimary,
  },
})
export default class Contracts extends Vue {
  tabs: TabItem[] = [];
  filter: ContractStatusFilter = ContractStatusFilter.ALL;
  created() {
    this.changeContractsStatus();
  }
  mounted() {
    this.tabs = [
      {
        name: this.$t("shared.all"),
        routePath: "/app/contracts/all"
      },
      {
        name: this.$t("app.contracts.pending.title"),
        routePath: "/app/contracts/pending"
      },
      {
        name: this.$t("app.contracts.signed.title"),
        routePath: "/app/contracts/signed"
      },
      {
        name: this.$t("app.contracts.archived.title"),
        routePath: "/app/contracts/archived"
      },
    ];
    this.changeContractsStatus();
  }
  @Watch("$route.path")
  changeContractsStatus() {
    if (!this.$route.params.status) {
      this.$router.push({ path: "/app/contracts/pending" });
    } else {
      switch (this.$route.params.status) {
        case "pending":
          this.filter = ContractStatusFilter.PENDING;
          break;
        case "signed":
          this.filter = ContractStatusFilter.SIGNED;
          break;
        case "archived":
          this.filter = ContractStatusFilter.ARCHIVED;
          break;
        case "all":
          this.filter = ContractStatusFilter.ALL;
          break;
        default:
          this.$router.push({ path: "/app/contracts/pending" });
          break;
      }
    }
  }
}
</script>

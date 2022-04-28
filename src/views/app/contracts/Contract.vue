<template>
  <div>
    <Breadcrumb
      :menu="[{
        title: $t('app.contracts.title'), routePath: '/app/contracts/pending'
      }]"
    ></Breadcrumb>
    <div class="pt-2 space-y-2 mx-auto px-4 sm:px-6 lg:px-8">
      <ContractDetails :id="id" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Breadcrumb from "@/components/ui/breadcrumbs/Breadcrumb.vue";
import ContractDetails from "@/components/app/contracts/ContractDetails.vue";
import i18n from '@/locale/i18n';

@Component({
  metaInfo: {
    title: i18n.t("models.contract.object").toString()
  },
  components: {
    Breadcrumb,
    ContractDetails,
  },
})
export default class Contracts extends Vue {
  id = "";
  selected = 0;
  created() {
    this.id = this.$route.params.id;
  }
  selectedTab(tab) {
    this.selected = tab;
  }
}
</script>

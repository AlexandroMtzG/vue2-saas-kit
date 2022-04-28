<template>
  <!-- Core -->
  <IconAdmin v-if="icon === 0" />
  <IconTenants v-else-if="icon === 1" />
  <IconUsers v-else-if="icon === 2" />
  <IconPricing v-else-if="icon === 3" />
  <IconEmails v-else-if="icon === 4" />
  <IconNavigation v-else-if="icon === 5" />
  <IconComponents v-else-if="icon === 6" />
  <IconApp v-else-if="icon === 7" />
  <IconDashboard v-else-if="icon === 8" />
  <IconSettings v-else-if="icon === 9" />

  <!-- App -->
  <IconLinks v-else-if="icon === 10" />
  <IconProviders v-else-if="icon === 11" />
  <IconClients v-else-if="icon === 12" />
  <IconContracts v-else-if="icon === 13" />
  <IconEmployees v-else-if="icon === 14" />
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { SvgIcon } from '@/application/enums/shared/SvgIcon';
import { Prop } from 'vue-property-decorator';

import IconAdmin from "./IconAdmin.vue";
import IconTenants from "./IconTenants.vue";
import IconUsers from "./IconUsers.vue";
import IconPricing from "./IconPricing.vue";
import IconNavigation from "./IconNavigation.vue";
import IconComponents from "./IconComponents.vue";

import IconApp from "./IconApp.vue";
import IconDashboard from "./IconDashboard.vue";
import IconSettings from "./IconSettings.vue";
import IconLinks from "./IconLinks.vue";
import IconProviders from "./IconProviders.vue";
import IconClients from "./IconClients.vue";
import IconContracts from "./IconContracts.vue";
import IconEmployees from "./IconEmployees.vue";
import IconEmails from "./IconEmails.vue";

@Component({
  components: {
    IconDashboard,
    IconTenants,
    IconUsers,
    IconPricing,
    IconNavigation,
    IconComponents,
    IconApp,
    IconAdmin,
    IconSettings,
    IconLinks,
    IconProviders,
    IconClients,
    IconContracts,
    IconEmployees,
    IconEmails
  }
})
export default class SidebarIcon extends Vue {
  @Prop({}) icon!: SvgIcon;
}
</script>

<style>
</style>
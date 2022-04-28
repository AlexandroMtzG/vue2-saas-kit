<template>
  <router-link
    to="/app/employees"
    class="px-4 py-5 border shadow-md rounded-lg overflow-hidden sm:p-6 bg-white border-gray-300 hover:bg-gray-50"
  >
    <div>
      <dt class="text-sm font-medium text-gray-500 truncate">{{ $t("models.employee.plural") }}</dt>
      <dd v-if="loading" class="mt-1 text-xl font-semibold text-gray-900">...</dd>
      <dd v-else class="mt-1 text-gray-900 truncate">
        <span class="text-xl font-semibold">{{ employees }}</span>
      </dd>
    </div>
  </router-link>
</template>

<script lang="ts">
import Vue from "vue";
import services from "@/services";
import { AppUsageType } from "@/application/enums/app/usages/AppUsageType";
import store from "@/store";
import Component from 'vue-class-component';

@Component({})
export default class Providers extends Vue {
  loading = false;
  mounted() {
    this.loading = true;
    services.tenants.getCurrentUsage(AppUsageType.EMPLOYEES).finally(() => {
      this.loading = false;
    });
  }
  get employees() {
    return store.state.app.usage.employees;
  }
}
</script>

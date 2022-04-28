<template>
  <div>
    <Breadcrumb
      :menu="[
        {
          title: $t('models.employee.plural'),
          routePath: '/app/employees'
        },
        {
          title: $t('shared.new')
        }
      ]"
    ></Breadcrumb>
    <div class="bg-white shadow-sm border-b border-gray-300 w-full py-2">
      <div
        class="mx-auto max-w-5xl xl:max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 space-x-2"
      >
        <h2
          class="flex-1 font-bold flex items-center truncate"
        >{{ $t("app.employees.new.multiple") }}</h2>
      </div>
    </div>
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6">
      <AddEmployees />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Breadcrumb from "@/components/ui/breadcrumbs/Breadcrumb.vue";
import AddEmployees from "@/components/app/employees/AddEmployees.vue";
import i18n from '@/locale/i18n';

@Component({
  metaInfo: {
    title: i18n.t("app.employees.new.multiple").toString()
  },
  components: {
    Breadcrumb,
    AddEmployees
  }
})
export default class NewEmployee extends Vue {
}
</script>

<template>
  <div>
    <Breadcrumb :menu="[{ title: $t('models.employee.plural'), routePath: '/app/employees' }]"></Breadcrumb>
    <EmployeeProfile :id="id" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Breadcrumb from "@/components/ui/breadcrumbs/Breadcrumb.vue";
import EmployeeProfile from "@/components/app/employees/EmployeeProfile.vue";
import i18n from "@/locale/i18n";

@Component({
  metaInfo: {
    title: i18n.t("models.employee.object").toString()
  },
  components: {
    Breadcrumb,
    EmployeeProfile
  },
})
export default class Employee extends Vue {
  id = "";
  created() {
    this.id = this.$route.params.id;
  }
}
</script>

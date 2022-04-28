<template>
  <div>
    <Breadcrumb :menu="[{ title: $t('models.link.plural'), routePath: '/app/links/all' }]"></Breadcrumb>
    <LinkProfile :id="id" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Breadcrumb from "@/components/ui/breadcrumbs/Breadcrumb.vue";
import LinkProfile from "@/components/app/links/all/LinkProfile.vue"
import i18n from '@/locale/i18n';

@Component({
  metaInfo: {
    title: i18n.t("models.link.object").toString(),
  },
  components: {
    Breadcrumb,
    LinkProfile
  },
})
export default class Link extends Vue {
  id = "";
  created() {
    this.id = this.$route.params.id;
  }
}
</script>

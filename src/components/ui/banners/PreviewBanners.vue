<template>
  <div class="space-y-2 w-full">
    <InfoBanner
      title="InfoBanner"
      text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut..."
    />
    <WarningBanner
      title="WarningBanner"
      text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut..."
    />
    <WarningBanner
      title="WarningBanner with Redirect"
      text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut..."
      redirect="https://saasfrontends.com"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import InfoBanner from "./InfoBanner.vue";
import WarningBanner from "./WarningBanner.vue";

@Component({
  components: {
    InfoBanner,
    WarningBanner
  },
})
export default class PreviewBanners extends Vue {

}
</script>
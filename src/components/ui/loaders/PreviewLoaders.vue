<template>
  <div class="space-y-2 w-full">
    <Loading />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Loading from "./Loading.vue";

@Component({
  components: {
    Loading
  },
})
export default class PreviewLoaders extends Vue {

}
</script>
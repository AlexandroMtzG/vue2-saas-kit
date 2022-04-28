<!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
<template>
  <div>
    <ButtonPrimary @click="increment(1)">Counter: {{ counter }}</ButtonPrimary>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary.vue";

@Component({
  components: {
    ButtonPrimary
  }
})
export default class SampleComponents extends Vue {
  counter = 0;
  mounted() {
    console.log("mounted")
  }
  increment(i: number) {
    this.counter += i;
  }
}
</script>

<!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
<template>
  <div class="space-y-2 w-full">
    <div
      class="max-w-3xl mx-auto space-y-4 flex flex-col items-center justify-center sm:space-y-0 sm:space-x-4 sm:flex-row sm:items-end sm:justify-center"
    >
      <ButtonPrimary @click="alert('Clicked primary button')">Primary</ButtonPrimary>
      <ButtonSecondary @click="alert('Clicked secondary button')">Secondary</ButtonSecondary>
      <ButtonTertiary @click="alert('Clicked tertiary button')">Tertiary</ButtonTertiary>
      <LoadingButton ref="loadingButton" @click="startLoading()">Loading</LoadingButton>
    </div>
    <div
      class="max-w-3xl mx-auto space-y-4 flex flex-col items-center justify-center sm:space-y-0 sm:space-x-4 sm:flex-row sm:items-end sm:justify-center"
    >
      <ButtonPrimary :disabled="true">Primary</ButtonPrimary>
      <ButtonSecondary :disabled="true">Secondary</ButtonSecondary>
      <ButtonTertiary :disabled="true">Tertiary</ButtonTertiary>
      <LoadingButton :disabled="true">Loading</LoadingButton>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import ButtonPrimary from './ButtonPrimary.vue'
import ButtonSecondary from './ButtonSecondary.vue'
import ButtonTertiary from './ButtonTertiary.vue'
import LoadingButton from './LoadingButton.vue'

@Component({
  components: {
    ButtonPrimary,
    ButtonSecondary,
    ButtonTertiary,
    LoadingButton
  }
})
export default class PreviewButtons extends Vue {
  $refs!: {
    loadingButton: LoadingButton;
  }
  startLoading() {
    if (this.$refs.loadingButton) {
      this.$refs.loadingButton?.start()
      setTimeout(() => {
        this.$refs.loadingButton?.stop()
      }, 2000)
    }
  }
  alert(message) {
    window.alert(message)
  }
}
</script>
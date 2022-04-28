<!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
<template>
  <div class="space-y-2 w-full">
    <div
      class="max-w-3xl mx-auto space-y-4 flex flex-col items-center justify-center sm:space-y-0 sm:space-x-4 sm:flex-row sm:items-end sm:justify-center"
    >
      <ButtonSecondary @click="showSuccessModal()">Success Modal</ButtonSecondary>
      <ButtonSecondary @click="showErrorModal()">Error Modal</ButtonSecondary>
      <ButtonSecondary @click="showConfirmModal()">Confirm Modal</ButtonSecondary>
      <ButtonSecondary @click="showEmptyModal()">Empty Modal</ButtonSecondary>
    </div>
    <SuccessModal ref="successModal" />
    <ErrorModal ref="errorModal" />
    <ConfirmModal ref="confirmModal" @yes="alert('confirmed')" @no="alert('canceled')" />
    <Modal ref="emptyModal">Your content here...</Modal>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import ButtonSecondary from "../buttons/ButtonSecondary.vue";
import SuccessModal from "./SuccessModal.vue";
import ErrorModal from "./ErrorModal.vue";
import ConfirmModal from "./ConfirmModal.vue";
import Modal from "./Modal.vue";

@Component({
  components: {
    ButtonSecondary,
    SuccessModal,
    ErrorModal,
    ConfirmModal,
    Modal
  }
})
export default class PreviewModals extends Vue {
  $refs!: {
    successModal: SuccessModal;
    errorModal: ErrorModal;
    confirmModal: ConfirmModal;
    emptyModal: Modal;
  }
  showSuccessModal() {
    this.$refs.successModal.show('Title', 'Description...');
  }
  showErrorModal() {
    this.$refs.errorModal.show('Title', 'Description...');
  }
  showConfirmModal() {
    this.$refs.confirmModal.show('Title', 'Confirm', 'Cancel', 'Description...');
  }
  showEmptyModal() {
    this.$refs.emptyModal.show();
  }
  alert(message) {
    window.alert(message)
  }
}
</script>
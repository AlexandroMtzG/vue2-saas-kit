<template>
  <div class="space-y-2 w-full">
    <PdfViewer :file="samplePdf" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import PdfViewer from "./PdfViewer.vue";
import FakePdfBase64 from "./FakePdfBase64";

@Component({
  components: {
    PdfViewer
  },
})
export default class PreviewPdfViewers extends Vue {
  samplePdf = FakePdfBase64;
}
</script>
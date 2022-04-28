<template>
  <div class="space-y-2 w-full">
    <UploadDocument :multiple="true" @droppedFiles="droppedDocuments" @dropped="droppedDocument" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import UploadDocument from "./UploadDocument.vue";

@Component({
  components: {
    UploadDocument
  },
})
export default class PreviewUploadersDocument extends Vue {
  showDocumentUpload = true;
  droppedDocuments(files) {
    window.alert(`@droppedDocuments ${files.length} files: ` + files.map(f => f.base64.substr(0, 30) + '...'));
  }
  droppedDocument(base64, file) {
    window.alert(`@droppedDocument: base64 [${base64.substr(0, 30)}...], file [name (${file.name}), size (${file.size})]`);
  }
}
</script>
<template>
  <div class="overflow-hidden border border-gray-300 rounded-md items-center">
    <div class="p-4 flex justify-between items-center">
      <div class="origin-top-left left-0 top-0 mt-1 ml-1 flex items-center space-x-2">
        <span class="relative z-0 inline-flex shadow-sm rounded-md">
          <button
            type="button"
            @click="prevPage"
            :class="{
              'cursor-not-allowed  bg-gray-50': currentPage === 1,
              'hover:bg-gray-50': currentPage !== 1,
            }"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 focus:z-10 focus:outline-none focus:ring-1 focus:ring-theme-500 focus:border-theme-500"
          >
            <span class="sr-only">{{ $t("shared.previous") }}</span>
            <!-- Heroicon name: solid/chevron-left -->
            <svg
              class="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
          <span
            class="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 select-none"
          >{{ currentPage }} / {{ pageCount }}</span>
          <button
            type="button"
            @click="nextPage"
            :class="{
              'cursor-not-allowed bg-gray-50': currentPage === pageCount,
              'hover:bg-gray-50': currentPage !== pageCount,
            }"
            :disabled="currentPage === pageCount"
            class="-ml-px relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-theme-500 focus:border-theme-500"
          >
            <span class="sr-only">{{ $t("shared.next") }}</span>
            <!-- Heroicon name: solid/chevron-right -->
            <svg
              class="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </span>
      </div>
      <div class="flex items-center space-x-2">
        <button
          type="button"
          class="origin-top-right right-0 top-0 mt-1 mr-0 text-gray-600 hover:bg-gray-50 inline-flex items-center px-1.5 py-1.5 border-gray-300 text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-theme-500"
          @click="downloadPdf"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        </button>
        <button
          v-if="editing"
          type="button"
          class="origin-top-right right-0 top-0 mt-1 mr-0 text-gray-600 hover:bg-gray-50 inline-flex items-center px-1.5 py-1.5 border-gray-300 text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-theme-500"
          @click="$emit('removeFile')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
    <div class="py-4 mx-auto text-center flex items-center justify-center">
      <Pdf
        @num-pages="pageCount = $event"
        @page-loaded="currentPage = $event"
        :src="file"
        :page="currentPage"
      ></Pdf>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import Pdf from "vue-pdf";

@Component({
  components: {
    Pdf
  }
})
export default class PdfViewer extends Vue {
  @Prop({ default: "" }) file!: any;
  @Prop({ default: "" }) fileName!: string;
  @Prop({ default: false }) editing!: boolean;
  pdfDoc = '';
  pdfPages = 0;
  pdfScale = 0.49;
  currentPage = 1;
  pageCount = 0;

  nextPage() {
    this.currentPage += 1;
  }
  prevPage() {
    this.currentPage -= 1;
  }
  downloadPdf() {
    const downloadLink = document.createElement("a");
    const name = (this.fileName ?? "document") + ".pdf";
    downloadLink.href = this.file;
    downloadLink.download = name;
    downloadLink.click();
  }
}
</script>
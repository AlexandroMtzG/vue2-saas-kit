<template>
  <div
    class="text-gray-600 overflow-hidden drop text-center flex border-2 border-dashed border-gray-300 rounded-md items-center"
    :class="getClasses"
    @dragover.prevent="dragOver"
    @dragleave.prevent="dragLeave"
    @drop.prevent="drop($event)"
  >
    <div v-if="loading" class="mx-auto font-medium text-base">{{ $t("shared.loading") }}...</div>
    <div v-else>
      <h1 class="mx-auto font-bold text-lg text-theme-500">
        <slot name="title"></slot>
      </h1>
      <div class="manual">
        <div class="space-y-1 text-center">
          <slot name="icon"></slot>
          <div class="flex text-sm text-gray-600">
            <label
              for="uploadmyfile"
              class="relative cursor-pointer rounded-md font-medium text-theme-600 hover:text-theme-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-theme-500"
            >
              <span></span>
              <label for="uploadmyfile">
                <p
                  class="font-semibold text-sm underline cursor-pointer hover:text-theme-500"
                >{{ $t("app.shared.buttons.uploadDocument") }}</p>
              </label>
              <input
                type="file"
                id="uploadmyfile"
                :accept="accept"
                capture="camera"
                :multiple="multiple"
                @change="requestUploadFile"
              />
            </label>
            <p class="pl-1 lowercase">{{ $t("shared.or") }} {{ $t("shared.dragAndDrop") }}</p>
          </div>
          <p class="text-xs text-gray-500">{{ description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import imageCompression from "browser-image-compression";
import { FileBase64 } from "@/application/dtos/shared/FileBase64";

@Component({})
export default class UploadDocument extends Vue {
  @Prop({ default: ".pdf", type: String })
  accept!: string;
  @Prop({ default: false, type: Boolean })
  multiple!: boolean;
  @Prop({ default: "", type: String })
  description!: boolean;
  @Prop({ default: 0, type: Number })
  imageStyle!: number;

  isDragging = false;
  loading = false;

  dragOver() {
    if (!this.loading) {
      this.isDragging = true;
    }
  }
  dragLeave() {
    this.isDragging = false;
  }
  async compressFile(imageFile: File): Promise<any> {
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1920 / 2,
      useWebWorker: true,
    };
    try {
      const file = await imageCompression(imageFile, options);
      return Promise.resolve(file);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async compressFileNotImage(imageFile: File): Promise<any> {
    return Promise.resolve(imageFile);
  }
  async drop(e) {
    let files: any[] = [...e.dataTransfer.files];
    const newImagesPromises: any[] = [];
    await files.forEach((element: File) => {
      if (element.type.includes("image")) {
        newImagesPromises.push(this.compressFile(element));
      } else {
        newImagesPromises.push(this.compressFileNotImage(element));
      }
    });
    files = await Promise.all(newImagesPromises);
    const filesArray: FileBase64[] = [];
    const promises: any[] = [];

    files.forEach((file) => {
      const promise = this.getBase64(file);
      promises.push(promise);
      promise
        .then((response) => {
          filesArray.push({
            file,
            base64: response,
          });
          this.$emit("dropped", response, file);
        })
        .catch((e) => {
          console.error(e);
        });
    });
    await Promise.all(promises).then(() => {
      this.$emit("droppedFiles", filesArray, files);
    });
    this.isDragging = false;
  }
  requestUploadFile() {
    const src = this.$el.querySelector("#uploadmyfile");
    this.drop({ dataTransfer: src });
  }
  getBase64(file) {
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.onload = (ev) => {
        resolve(ev?.target?.result);
      };
      reader.readAsDataURL(file);
    });
  }
  get getClasses() {
    return this.isDragging && !this.loading ? "bg-theme-200 border-2 border-dashed border-theme-800" : "";
  }
}
</script>

<style scoped>
.drop {
  align-items: center;
  justify-content: center;
  padding: 1rem;
  transition: background-color 0.2s ease-in-out;
}

#uploadmyfile {
  display: none;
}
</style>

<template>
  <div>
    <SlideOver @close="close" :title="$t('shared.upload') + ' ' + title">
      <template v-slot:content>
        <PictureInput
          ref="pictureInput"
          width="600"
          height="600"
          margin="16"
          accept="image/jpeg, image/png, image/jpg, image/ico"
          size="10"
          button-class="btn"
          :customStrings="{
            tap: $t('app.shared.pictureInput.tap'),
            change: $t('app.shared.pictureInput.tap'),
            remove: $t('app.shared.pictureInput.remove'),
            select: $t('app.shared.pictureInput.select'),
            selected: $t('app.shared.pictureInput.selected'),
            fileSize: $t('app.shared.pictureInput.fileSize'),
            fileType: $t('app.shared.pictureInput.fileType'),
            aspect: $t('app.shared.pictureInput.aspect'),
            upload: $t('app.shared.pictureInput.upload'),
            drag: $t('app.shared.pictureInput.drag')
          }"
          @change="onChange"
        />
      </template>
    </SlideOver>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import SlideOver from "../slideOvers/SlideOver.vue";
import { Prop } from "vue-property-decorator";
// @ts-ignore
import PictureInput from "vue-picture-input";

@Component({
  components: {
    PictureInput,
    SlideOver
  }
})
export default class UploadImage extends Vue {
  @Prop() title!: string;
  @Prop() image!: string;
  mounted() {
    // @ts-ignore
    this.$refs.pictureInput.image = this.image;
  }
  onChange() {
    if (this.loadedImage) {
      this.$emit("loaded", this.loadedImage);
    }
  }
  close() {
    this.$emit("close");
  }
  get loadedImage() {
    // @ts-ignore
    return this.$refs.pictureInput.image;
  }
}
</script>
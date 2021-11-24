<template>
  <v-dialog width="600" hide-overlay v-model="crpDialog" persistent>
    <v-card class="pb-4">
      <div ref="cropperDialog" style="padding: 16px 16px 0 16px">
        <v-row>
          <v-col>
            <vue-cropper
              ref="cropper"
              :aspect-ratio="
                typeData === 'cover'
                  ? 4
                  : typeData === 'rectangle'
                  ? 16 / 9
                  : typeData === 'avatar'
                  ? 1
                  : 0
              "
              :src="imgSrc"
              :view-mode="3"
              :autoCropArea="1"
              center
              preview=".preview"
            />
          </v-col>
        </v-row>
      </div>
      <v-card-actions dir="ltr">
        <v-btn
          small
          depressed
          color="primary"
          dark
          @click="cropImage"
          class="mr-4 ml-2"
        >
          تایید
        </v-btn>
        <v-btn small color="primary" text @click="closeCropDialog">لغو</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Watch,
  Prop,
  PropSync,
  Ref
} from "vue-property-decorator";

//@ts-ignore
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";

import { urlToFile } from "../../helpers/functionality";

@Component({
  components: {
    VueCropper
  }
})
export default class ImageCropper extends Vue {
  private imgSrc: string = "";
  private imgName: string = "";
  private imgType: string = "";

  @PropSync("cropperDialog", { default: false })
  public crpDialog!: boolean;

  @Prop({ type: File })
  public readonly imageFile!: File;

  @PropSync("type")
  public typeData!: string;

  @Ref("cropper")
  // eslint-disable-next-line
  private cropper: any;

  @Ref("cropperDialog")
  private cropperDialogRef!: HTMLDivElement;

  @Watch("crpDialog")
  private async valueChange(value: boolean) {
    if (value && this.imageFile) {
      this.imgName = this.imageFile.name;
      this.imgType = this.imageFile.type;
      this.imgSrc = URL.createObjectURL(this.imageFile);

      if (this.cropper) {
        this.cropper.replace(this.imgSrc);
      }
    } else {
    }
  }

  public async cropImage() {
    const cropImg = this.cropper.getCroppedCanvas().toDataURL();

    urlToFile(cropImg, this.imgName, this.imgType).then(result => {
      this.$emit("uploadFile", result);
    });
  }

  public closeCropDialog() {
    this.$emit("closeCropper");
  }
}
</script>
<style lang="scss">
.crop-container {
  scroll-behavior: smooth;
}
</style>

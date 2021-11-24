<template>
  <div>
    <input
      id="file"
      ref="file"
      type="file"
      style="display: none"
      @change="handleFileImport"
    />
    <ImageCropper
      :viewMode="2"
      :type="typeData"
      :imageFile="imgFile"
      @uploadFile="uploadFile"
      :cropperDialog="crpToggle"
      @closeCropper="closeCropper"
    />
    <Snackbar />
  </div>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  PropSync,
  Ref,
  Watch,
  Prop,
} from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";

import GeneralModule from "~/store/general/index";

import ImageCropper from "./ImageCropper.vue";
import Snackbar from "~/components/common/Snackbar.vue";

@Component({
  components: {
    ImageCropper,
    Snackbar,
  },
})
export default class Uploader extends Vue {
  private generalModule = getModule(GeneralModule, this.$store);

  private imgFile: File | null = null;
  private crpToggle: boolean = false;
  private fileData!: any;

  @Ref("file")
  private fileRef!: HTMLInputElement;

  @PropSync("open", { default: false })
  private openDialog!: boolean;

  @PropSync("type")
  public typeData!: string;

  @Watch("openDialog")
  private valueChange(value: boolean) {
    if (value) {
      this.fileRef.click();
    }
  }

  public handleFileImport() {
    if (this.fileRef && this.fileRef.files) {
      const file = this.fileRef.files[0];

      if (this.typeData !== "file" && !file.type.includes("image")) {
        this.generalModule.toggleSnackbar(true);
        this.generalModule.setSnackbarColor("error");
        this.generalModule.setSnackbarText(
          "فرمت تصویر انتخاب شده صحیح نمیباشد"
        );
        return;
      }
      if (file.size >= 10.097e6) {
        this.generalModule.toggleSnackbar(true);
        this.generalModule.setSnackbarColor("error");
        this.generalModule.setSnackbarText(
          "حجم فایل انتخاب شده باید حداکثر 10مگابایت باشد"
        );
        return;
      }

      if (file.type.includes("image")) {
        this.imgFile = file;
        this.crpToggle = true;
      } else {
        this.fileData = file;
        this.clearFile();
      }
    } else {
      this.generalModule.toggleSnackbar(true);
      this.generalModule.setSnackbarColor("error");
      this.generalModule.setSnackbarText("لطفا تصویر را انتخاب نمایید");
      this.clearFile();
    }
  }

  public async uploadFile(file: any) {
    this.closeCropper();
    this.fileData = file;

    try {
    } catch (error) {
    } finally {
      this.clearFile();
    }
  }

  public closeCropper() {
    this.crpToggle = false;
  }
  private clearFile() {
    this.$emit("uploadFinish", this.fileData);
    if (this.fileRef) this.fileRef.value = "";
  }
}
</script>

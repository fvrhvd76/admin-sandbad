<template>
  <v-dialog v-model="dialogProp" max-width="500px" persistent>
    <v-card dir="rtl" class="pa-4">
      <v-card-text>
        <div>
          آیا از عملیات <span class="primary--text">{{ title }}</span> مطمئنید؟
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="close"> لغو </v-btn>
        <v-btn depressed color="primary" dark @click="ok"> تایید </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Prop, PropSync, Vue } from "nuxt-property-decorator";

@Component({})
export default class ConfirmModal extends Vue {
  @PropSync("dialog") dialogProp!: boolean;
  @Prop() title!: string;

  private close() {
    this.$emit("closeDialog");
  }

  private ok() {
    this.$emit("ok");
  }
}
</script>

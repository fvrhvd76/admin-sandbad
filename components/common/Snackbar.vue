<template>
  <div>
    <v-snackbar
      :value="snackbar"
      :color="color"
      elevation="0"
      :timeout="3000"
      @input="close"
    >
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator";
import { getModule } from "vuex-module-decorators";

import GeneralModule from "~/store/general/index";

@Component({})
export default class Snackbar extends Vue {
  private generalModule = getModule(GeneralModule, this.$store);

  private close() {
    this.generalModule.toggleSnackbar(false);
  }

  private get color() {
    return this.generalModule.snackbarColor;
  }

  private get snackbar() {
    return this.generalModule.snackbarStatus;
  }

  private get text() {
    return this.generalModule.snackbarText;
  }
}
</script>

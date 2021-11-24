<template>
  <div class="full-height d-flex justify-center align-center">
    <v-card class="pa-8">
      <v-row justify="center" align="center">
        <v-col cols="12" class="d-flex justify-center align-center">
          <v-icon color="error" x-large>mdi-alert</v-icon>
        </v-col>
        <v-col
          cols="12"
          class="d-flex justify-center align-center font-weight-black"
        >
          <p>شما اجازه دسترسی به این صفحه را ندارید.</p>
        </v-col>
        <v-col cols="12" class="d-flex justify-center align-center">
          <v-btn color="primary" @click="goBack">بازگشت به صفحه قبل</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";
import { getModule } from "vuex-module-decorators";

import GeneralModule from "~/store/general/index";
@Component({})
export default class Index extends Vue {
  private generalModule = getModule(GeneralModule, this.$store);
  private goBack() {
    return this.$router.go(-2);
  }
}
</script>

<style lang="scss" scoped></style>

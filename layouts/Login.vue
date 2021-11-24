<template>
  <v-app>
    <nuxt />
  </v-app>
</template>
<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";
@Component({})
export default class Login extends Vue {
  [x: string]: any;
  private browserTheme: string = "";
  mounted() {
    if (window.matchMedia("prefers-color-scheme: dark").matches) {
      this.browserTheme = "dark";
    } else {
      this.browserTheme = "light";
    }
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        this.browserTheme = e.matches ? "dark" : "light";
      });
    if (this.browserTheme === "light") {
      this.$vuetify.theme.dark = false;
    } else if (this.browserTheme === "dark") {
      this.$vuetify.theme.dark = true;
    }
  }
}
</script>
<style>
</style>

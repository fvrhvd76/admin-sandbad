<template>
  <div
    style="
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      z-index: 1000;
    "
    class="white"
  >
    <div
      class="full-height bgLight d-flex flex-column justify-center align-center"
    >
      <div
        :style="
          $vuetify.breakpoint.mdAndUp
            ? { 'max-width': '45%' }
            : $vuetify.breakpoint.smAndUp
            ? { 'max-width': '70%' }
            : { 'max-width': '85%' }
        "
        class="text-center"
      >
        <v-img
          :src="errorType == '500' ? '/images/500.png' : '/images/404.png'"
          height="auto"
        />
        <div
          v-if="errorType == '404'"
          :class="
            $vuetify.breakpoint.mdAndUp
              ? 'not-found-text-large'
              : $vuetify.breakpoint.smAndUp
              ? 'not-found-text-medium'
              : 'not-found-text-small'
          "
        >
          متاسفانه صفحه مورد نظر پیدا نشد
        </div>
        <v-btn
          dark
          depressed
          color="primary"
          class="btn-border mt-8"
          @click="goToDashboardPage"
          >بازگشت به صفحه اصلی</v-btn
        >
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator";
@Component({})
export default class Error extends Vue {
  [x: string]: any;
  @Prop() errorType!: string;

  private goToDashboardPage() {
    this.$router.push({ name: "index" });
  }
}
</script>
<style lang="scss">
.not-found-text-large {
  font-size: 30px;
}
.not-found-text-medium {
  font-size: 25px;
}
.not-found-text-small {
  font-size: 18px;
}
</style>

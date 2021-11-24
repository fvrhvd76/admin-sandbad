<template>
  <div
    :class="
      $vuetify.breakpoint.xs || $vuetify.breakpoint.sm
        ? 'mr-2 relative-position flex-column pb-2 py-1 pl-4 d-flex'
        : 'mr-2 relative-position pb-2 py-1 pl-4 d-flex'
    "
    style="width:100%; height:100%;"
  >
    <div
      @click="goToPay"
      class="select mt-1 ml-1 rounded-lg d-flex flex-column justify-center align-center"
      :style="
        $vuetify.breakpoint.xs || $vuetify.breakpoint.sm
          ? 'width:100%; height:50%; background-color:white'
          : 'width:50%; height:100%; background-color:white'
      "
    >
      <div class="border">
        <v-icon class="icon" size="100">mdi-format-list-numbered-rtl</v-icon>
      </div>
      <h1 class="text font-weight-black">پی</h1>
      <p class="text">لیست تمامی سفرهای مربوط به پی</p>
    </div>
    <div
      @click="goToPeyk"
      class="select mt-1 rounded-lg d-flex flex-column justify-center align-center"
      :style="
        $vuetify.breakpoint.xs || $vuetify.breakpoint.sm
          ? 'width:100%; height:50%; background-color:white'
          : 'width:50%; height:100%; background-color:white'
      "
    >
      <div class="border">
        <v-icon class="icon" size="100">mdi-format-list-numbered-rtl</v-icon>
      </div>
      <h1 class="text font-weight-black">پیک</h1>
      <p class="text">لیست تمامی سفرهای مربوط به پیک</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({ components: {} })
export default class Index extends Vue {
  private goToPay() {
    this.$router.push({
      name: "transmissions-pay-list"
    });
  }
  private goToPeyk() {
    this.$router.push({
      name: "transmissions-peyk-list"
    });
  }
}
</script>

<style scoped lang="scss">
.border {
  border-color: gray;
  border-radius: 10%;
  border-style: solid;
  border-width: 3px;
  padding: 15px;
  .icon {
    color: gray;
  }
}
.text {
  margin-top: 10px;
  color: gray;
}
:hover.select {
  cursor: pointer;
  background-image: linear-gradient(to right, #fcb224, #f48c3a) !important;
  .text {
    color: white;
  }
  .icon {
    color: white;
  }
  .border {
    border-color: white;
  }
}
</style>

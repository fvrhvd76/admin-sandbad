<template>
  <div class="full-width full-height">
    <div
      :class="
        $vuetify.breakpoint.xs || $vuetify.breakpoint.sm
          ? 'mr-2 relative-position flex-column py-1 pl-4 d-flex'
          : 'mr-2 relative-position pb-2 py-1 pl-4 d-flex'
      "
      :style="
        $vuetify.breakpoint.xs || $vuetify.breakpoint.sm
          ? 'width:100%; height:75%;'
          : 'width:100%; height:50%;'
      "
    >
      <div
        @click="goToCouriersTickets"
        class="pa-4 select mt-1 ml-1 rounded-lg d-flex flex-column justify-center align-center"
        :style="
          $vuetify.breakpoint.xs || $vuetify.breakpoint.sm
            ? 'width:100%; height:50%; background-color:white'
            : 'width:50%; height:100%; background-color:white'
        "
      >
        <div class="border">
          <v-icon class="icon" size="100">mdi-truck</v-icon>
        </div>
        <h1 class="text font-weight-black">سفیران</h1>
        <p class="text">لیست تیکت های سفیران</p>
      </div>
      <div
        @click="goToSendersTickets"
        class="pa-4 select mt-1 rounded-lg d-flex flex-column justify-center align-center"
        :style="
          $vuetify.breakpoint.xs || $vuetify.breakpoint.sm
            ? 'width:100%; height:50%; background-color:white'
            : 'width:50%; height:100%; background-color:white'
        "
      >
        <div class="border">
          <v-icon class="icon" size="100">mdi-package</v-icon>
        </div>
        <h1 class="text font-weight-black">فرستنده</h1>
        <p class="text">لیست تیکت های فرستنده ها</p>
      </div>
    </div>
    <div
      :class="
        $vuetify.breakpoint.xs || $vuetify.breakpoint.sm
          ? 'mr-2 relative-position flex-column py-1 pl-4 d-flex'
          : 'mr-2 relative-position pb-2 py-1 pl-4 d-flex'
      "
      :style="
        $vuetify.breakpoint.xs || $vuetify.breakpoint.sm
          ? 'width:100%; height:75%;'
          : 'width:100%; height:50%;'
      "
    >
      <div
        @click="goToBuyersTickets"
        class="pa-4 select mb-1 ml-1 rounded-lg d-flex flex-column justify-center align-center"
        :style="
          $vuetify.breakpoint.xs || $vuetify.breakpoint.sm
            ? 'width:100%; height:50%; background-color:white'
            : 'width:50%; height:100%; background-color:white'
        "
      >
        <div class="border">
          <v-icon class="icon" size="100">mdi-truck</v-icon>
        </div>
        <h1 class="text font-weight-black">خریدار</h1>
        <p class="text">لیست تیکت های سفیران</p>
      </div>
      <div
        @click="goToSellersTickets"
        class="pa-4 select mt-1 rounded-lg d-flex flex-column justify-center align-center"
        :style="
          $vuetify.breakpoint.xs || $vuetify.breakpoint.sm
            ? 'width:100%; height:50%; background-color:white'
            : 'width:50%; height:100%; background-color:white'
        "
      >
        <div class="border">
          <v-icon class="icon" size="100">mdi-package</v-icon>
        </div>
        <h1 class="text font-weight-black">فروشنده</h1>
        <p class="text">لیست تیکت های فرستنده ها</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({ components: {} })
export default class Index extends Vue {
  private goToCouriersTickets() {
    this.$router.push({
      name: "tickets-list-courier"
    });
  }
  private goToSendersTickets() {
    this.$router.push({
      name: "tickets-list-sender"
    });
  }
  private goToBuyersTickets() {
    this.$router.push({
      name: "tickets-list-buyer"
    });
  }
  private goToSellersTickets() {
    this.$router.push({
      name: "tickets-list-seller"
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

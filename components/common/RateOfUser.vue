<template>
  <div class="Rate">
    <div  class="star"><div :style="StarWidth1" class="value" /></div>
    <div style="height:25px; width:25px" class="star"><div :style="StarWidth2" class="value" /></div>
    <div style="height:30px; width:30px" class="star"><div :style="StarWidth3" class="value" /></div>
    <div style="height:25px; width:25px" class="star"><div :style="StarWidth4" class="value" /></div>
    <div class="star"><div :style="StarWidth5" class="value" /></div>
  </div>
</template>

<script lang="ts">
import { Component, PropSync, Vue } from "nuxt-property-decorator";

@Component({})
export default class RateOfUser extends Vue {
  @PropSync("rate") UserRate!: number;

  private get StarWidth1() {
    if (this.UserRate >= 1) {
      return `width:100%`;
    } else {
      let x = this.UserRate * 100;
      return `width:${x}%`;
    }
  }
  private get StarWidth2() {
    if (this.UserRate >= 2) {
      return `width:100%`;
    } else if (this.UserRate <= 1) {
      return {};
    } else {
      let x = (this.UserRate-1) * 100;
      return `width:${x}%`;
    }
  }
  private get StarWidth3() {
    if (this.UserRate >= 3) {
      return `width:100%`;
    } else if (this.UserRate <= 2) {
      return {};
    } else {
      let x = (this.UserRate-2) * 100;
      return `width:${x}%`;
    }
  }
  private get StarWidth4() {
    if (this.UserRate >= 4) {
      return `width:100%`;
    } else if (this.UserRate <= 3) {
      return {};
    } else {
      let x = (this.UserRate-3) * 100;
      return `width:${x}%`;
    }
  }
  private get StarWidth5() {
    if (this.UserRate >= 5) {
      return `width:100%`;
    } else if (this.UserRate <= 4) {
      return {};
    } else {
      let x = (this.UserRate-4) * 100;
      return `width:${x}%`;
    }
  }
}
</script>

<style lang="scss">
.Rate {
  display: flex;
  justify-content: center;
  align-items: center;
  .star {
    width: 20px;
    height: 20px;
    -webkit-clip-path: polygon(
      50% 0%,
      61% 35%,
      98% 35%,
      68% 57%,
      79% 91%,
      50% 70%,
      21% 91%,
      32% 57%,
      2% 35%,
      39% 35%
    );
    clip-path: polygon(
      50% 0%,
      61% 35%,
      98% 35%,
      68% 57%,
      79% 91%,
      50% 70%,
      21% 91%,
      32% 57%,
      2% 35%,
      39% 35%
    );
    background-color: #f48b3a65;
    .value {
      background-color: #F48C3A;
      height: 100%;
      width: 0%;
    }
  }
}
</style>

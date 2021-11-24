<template>
  <v-overlay
    opacity="0.1"
    class="d-flex flex-row justify-center alin-center"
    style="position: absolute; top: 0; bottom: 0; left: 0; right: 0"
  >
    <v-progress-circular
      :size="45"
      color="primary"
      indeterminate
    ></v-progress-circular>
  </v-overlay>
</template>
<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";

@Component({})
export default class Loading extends Vue {}
</script>
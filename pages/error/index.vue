<template>
  <div class="relative-position full-height">
    <Error />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator";
import Error from "~/components/common/Error.vue";
@Component({ components: { Error } })
export default class Index extends Vue {
  [x: string]: any;
  public layout() {
    return "Login";
  }
}
</script>

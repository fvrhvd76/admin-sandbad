<template>
  <div class="error-dialog">
    <v-dialog
      v-model="dialogProp"
      fullscreen
      persistent
      class="relative-position"
    >
      <Error dir="rtl" :errorType="errorType" />
    </v-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Prop, PropSync, Vue } from "nuxt-property-decorator";
import Error from "~/components/common/Error.vue";

@Component({ components: { Error } })
export default class ErrorModal extends Vue {
  [x: string]: any;
  @Prop() errorType!: string;
  @PropSync("dialog") dialogProp!: boolean;
}
</script>
<template>
  <v-card style="width: 100% !important" color="primary">
    <v-list-item three-line>
      <v-list-item-content>
        <p class="white--text font-10">{{ title }}</p>
        <v-progress-circular
          size="30"
          color="primary"
          indeterminate
          v-if="loadingProp"
        />
        <p
          class="white--text font-20"
          style="margin-bottom: 0"
          v-else-if="
            !loadingProp &&
            type !== 'online-couriers' &&
            type !== 'transactions'
          "
        >
          {{ count }}
        </p>
        <div
          class="d-flex flex-row justify-start align-center"
          style="margin-bottom: 0"
          v-else-if="!loadingProp && type === 'online-couriers'"
        >
          <div
            class="d-flex flex-row justify-start align-center white--text font-12 ml-4"
          >
            در دسترس :
            <span class="font-20 white--text">{{ count.available }}</span>
          </div>
          <div
            class="d-flex flex-row justify-start align-center white--text font-12"
          >
            مشغول : <span class="font-20 white--text">{{ count.working }}</span>
          </div>
        </div>
        <div
          class="d-flex flex-row justify-space-between align-center"
          style="margin-bottom: 0"
          v-else-if="!loadingProp && type === 'transactions'"
        >
          <div class="d-flex flex-row justify-start align-center">
            <div
              class="d-flex flex-row justify-start align-center white--text font-12 ml-4"
            >
              موفق :
              <span class="font-20 white--text">{{ count.successful }}</span>
            </div>
            <div
              class="d-flex flex-row justify-start align-center white--text font-12"
            >
              ناموفق :
              <span class="font-20 white--text">{{ count.unsuccessful }}</span>
            </div>
          </div>
        </div>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>
<script lang="ts">
import { Component, Prop, PropSync, Vue } from "nuxt-property-decorator";

@Component({ components: {} })
export default class DataCard extends Vue {
  @Prop() count!: any;
  @Prop() title!: string;
  @Prop() type!: string;
  @PropSync("loading") loadingProp!: boolean;
}
</script>
<style lang="scss">
.more-btn {
  &.v-btn {
    .v-btn__content {
      color: primary !important;
    }
  }
}
</style>

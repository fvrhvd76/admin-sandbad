<template>
  <div class="full-height py-8 px-4">
    <v-data-table
      :items="topPlans"
      @click:row="handleClick"
      :headers="plansHeaders"
      :loader-height="0"
      :loading="loading"
      hide-default-footer
      class="elevation-1"
      disable-pagination
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>پراستفاده ترین پلن ها</v-toolbar-title>
        </v-toolbar>
      </template>

      <template #[`item.num`]="{ item }">
        <span> {{ topPlans.indexOf(item) + 1 }}</span>
      </template>

      <template #[`item.id`]="{ item }">
        {{ item.id ? item.id : "-" }}
      </template>

      <template #[`item.create_date`]="{ item }">
        <span>{{ item.create_date | jalaliConvert }}</span>
      </template>

      <template #[`item.is_active`]="{ item }">
        <v-chip :color="item.is_active ? 'success' : 'error'">{{
          item.is_active ? "فعال" : "غیر فعال"
        }}</v-chip>
      </template>

      <template #[`body.append`]>
        <div
          v-if="topPlans.length > 0"
          v-intersect.quiet="infiniteScrolling"
        ></div>
      </template>
      <template #no-data>
        <div class="d-flex flex-column justify-center align-center my-4">
          <div
            class="empty-table-icon d-flex flex-row justify-center align-center"
          >
            <v-img src="/icons/empty-table.svg" max-width="68.33" />
          </div>
          <div class="py-2">داده ای وجود ندارد</div>
        </div>
      </template>

      <template #loading>
        <v-progress-circular
          size="60"
          color="primary"
          class="my-4"
          indeterminate
        />
      </template>
    </v-data-table>
    <Snackbar />
    <ErrorModal :dialog="showErrorData" :errorType="errorType" />
  </div>
</template>

<script lang="ts">
import GeneralModule from "~/store/general/index";
import { getModule } from "vuex-module-decorators";

import { Component, Vue } from "nuxt-property-decorator";

import { TopPlansModel } from "~/models/api/top-plans.model";
import { TopSendersModel } from "~/models/api/top-senders.model";
import { TopCouriersModel } from "~/models/api/top-couriers.model";

import { TopPlansResponseModel } from "~/models/api/response/top-plans-response.model";

import ErrorModal from "~/components/modals/ErrorModal.vue";
import Snackbar from "~/components/common/Snackbar.vue";

import {
  delay,
  jalaliConvert,
  jalaliConvertWithTime,
} from "~/helpers/functionality";

@Component({
  middleware: ["permission"],
  components: {
    ErrorModal,
    Snackbar
  },
  filters: { jalaliConvert, jalaliConvertWithTime }
})
export default class index extends Vue {
  [x: string]: any;
  private generalModule = getModule(GeneralModule, this.$store);

  //main request variables
  private loading: boolean = false;
  private showError: boolean = false;
  private errorType: string = "";
  private itemsCurrentPage: number = 0;
  private itemsPerPage: number = 25;
  private itemEnd: boolean = false;
  private startDate: string = "";
  private endDate: string = "";
  private topPlans: TopPlansModel[] = [];
  private topSenders: TopSendersModel[] = [];
  private topCouriers: TopCouriersModel[] = [];

  private plansHeaders = [
    { text: "ردیف", value: "num", align: "start", sortable: false },
    {
      text: "شناسه",
      value: "id",
      align: "start",
      sortable: false
    },
    {
      text: "مبلغ",
      value: "amount",
      align: "start",
      sortable: false
    },
    {
      text: "تاریخ ساخت",
      value: "create_date",
      align: "start",
      sortable: false
    },
    {
      text: "وضعیت",
      value: "is_active",
      align: "start",
      sortable: false
    }
  ];

  //lifecycles
  private mounted() {
    this.getTopPlans();
  }

  private async getTopPlans() {
    try {
      this.loading = true;
      await this.$axios
        .$get(`/admins/best-plans/`, {
          params: {
            limit: this.itemsPerPage,
            offset: this.itemsCurrentPage,
            ...(this.startDate && this.endDate
              ? { start_date: this.startDate, end_date: this.endDate }
              : {})
          },
          headers: {
            Authorization: this.$auth.getToken("local"),
            Accept: "application/json; version=1.0;"
          }
        })
        .then((response: TopPlansResponseModel) => {
          if (response && response.result && response.result.length > 0) {
            this.topPlans = this.topPlans.concat(response.result);
          }

          if (response.next === null) {
            this.itemsEnd = true;
          }
        });
    } catch (e : any) {
      if (e.response.status === 404 || e.response.status === 500) {
        this.showErrorPage(e.response.status);
      } else {
        this.generalModule.toggleSnackbar(true);
        this.generalModule.setSnackbarColor("error");
        this.generalModule.setSnackbarText(e.response.data.detail);
      }
    } finally {
      await delay(500);
      this.loading = false;
    }
  }

  //sender page function
  private goToCourierPage(id: number) {
    this.$router.push({
      name: "courier-id",
      params: { id: id ? id?.toString() : "" }
    });
  }
  //sender page function
  private goToSenderPage(id: number) {
    this.$router.push({
      name: "sender-id",
      params: { id: id ? id?.toString() : "" }
    });
  }

  //error dialog
  private showErrorPage(error: string) {
    this.showError = true;
    this.errorType = error;
  }
  private get showErrorData() {
    return this.showError;
  }
  private handleClick(e: any) {
    this.$router.push({
      name: "wallet-plans"
    });
  }
}
</script>

<style scoped>
.v-data-table {
  cursor: pointer;
}
</style>

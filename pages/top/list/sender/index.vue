<template>
  <div class="full-height py-8 px-4">
    <v-data-table
      @click:row="handleClick"
      :items="topSenders"
      :headers="sendersHeaders"
      :loader-height="0"
      :loading="loading"
      hide-default-footer
      class="elevation-1"
      disable-pagination
    >
      <template #top>
        <v-toolbar style="cursor:auto" flat>
          <v-toolbar-title>برترین فرستندگان</v-toolbar-title>
          <!--           <v-select
            dense
            outlined
            hide-details
            v-model="order"
            color="primary"
            @input="doOrder"
            item-text="name"
            item-value="value"
            :items="orderList"
            item-color="primary"
            label="فیلتر بر اساس"
          >
          </v-select> -->
          <v-spacer />
          <v-btn
            fab
            depressed
            small
            color="primary"
            dark
            @click="FilterDialog = true"
          >
            <v-icon>mdi-tune</v-icon>
          </v-btn>
        </v-toolbar>
      </template>

      <template #[`item.num`]="{ item }">
        <span> {{ topSenders.indexOf(item) + 1 }}</span>
      </template>

      <template #[`item.user.profile_picture`]="{ item }">
        <v-avatar size="70" class="my-2" color="grey lighten-2">
          <v-img
            :src="$axios.defaults.baseURL + item.user.profile_picture"
            v-if="item.user.profile_picture"
          >
            <template #placeholder>
              <v-row class="full-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="primary"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
          <v-icon v-else> mdi-account </v-icon>
        </v-avatar>
      </template>

      <template #[`item.id`]="{ item }">
        {{ item.id ? item.id : "-" }}
      </template>

      <template #[`item.user.is_male`]="{ item }">
        <span>{{ item.user.is_male ? "مرد" : "زن" }}</span>
      </template>

      <template #[`item.date_joined`]="{ item }">
        <span>{{ item.date_joined | jalaliConvert }}</span>
      </template>

      <template #[`item.birth_date`]="{ item }">
        <span>{{
          item.birth_date ? item.birth_date.replace(/-/g, "/") : "-"
        }}</span>
      </template>

      <template #[`item.is_banned`]="{ item }">
        <v-chip :color="item.is_banned ? '#FFCDD2' : '#C8E6C9'">{{
          item.is_banned ? "مسدود" : "عادی"
        }}</v-chip>
      </template>

      <template #[`body.append`]> </template>
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
    <FilterModal
      :dialog="FilterDialog"
      :mode="filterMode"
      @closeDialog="closeFilterDialog"
      @confirm="filter"
      @allResult="showAllResult"
    />
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

import FilterModal from "~/components/modals/FilterModal.vue";
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
    FilterModal,
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

  //tables headers
  private sendersHeaders = [
    { text: "ردیف", value: "num", align: "start", sortable: false },
    {
      text: "تصویر",
      value: "user.profile_picture",
      align: "start",
      sortable: false
    },
    {
      text: "شناسه",
      value: "id",
      align: "start",
      sortable: false
    },
    {
      text: " نام و نام خانوادگی",
      value: "user.full_name",
      align: "start",
      sortable: false
    },
    {
      text: "جنسیت",
      value: "user.is_male",
      align: "start",
      sortable: false
    },
    {
      text: "تاریخ عضویت",
      value: "date_joined",
      align: "start",
      sortable: false
    },
    {
      text: "تاریخ تولد",
      value: "birth_date",
      align: "start",
      sortable: false
    },
    {
      text: "وضعیت",
      value: "is_banned",
      align: "start",
      sortable: false
    }
  ];

  //filter dialog variables
  private FilterDialog: boolean = false;
  private filterMode: string = "time";
  private ordering: number = 1;
  private switch1: boolean = false;
  private switch2: boolean = false;
  private switch3: boolean = false;
  private switch4: boolean = false;
  private switch5: boolean = false;
  private switch6: boolean = false;
  private switch7: boolean = false;
  private switch8: boolean = false;

  //lifecycles
  private mounted() {
    this.getTopSenders();
  }

  //get request functions
  private async getTopSenders() {
    try {
      this.loading = true;
      await this.$axios
        .$get(`/admins/best-senders/`, {
          params: {
            ...(this.startDate && this.endDate
              ? { start_date: this.startDate, end_date: this.endDate }
              : {})
          },
          headers: {
            Authorization: this.$auth.getToken("local"),
            Accept: "application/json; version=1.0;"
          }
        })
        .then((response: TopSendersModel) => {
          this.topSenders = this.topSenders.concat(response);
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

 //filter dialog functions
  private closeFilterDialog() {
    this.FilterDialog = false;
  }
  private filter(
    sort: number,
    start: string,
    end: string,
    switch1Value: boolean,
    switch2Value: boolean,
    switch3Value: boolean,
    switch4Value: boolean,
    switch5Value: boolean,
    switch6Value: boolean,
    switch7Value: boolean,
    switch8Value: boolean
  ) {
    this.itemsCurrentPage = 0;
    this.itemsEnd = false;
    this.topSenders = [];
    this.FilterDialog = false;
    this.ordering = sort;
    this.startDate = start;
    this.endDate = end;
    this.switch1 = switch1Value;
    this.switch2 = switch2Value;
    this.switch3 = switch3Value;
    this.switch4 = switch4Value;
    this.switch5 = switch5Value;
    this.switch6 = switch6Value;
    this.switch7 = switch7Value;
    this.switch8 = switch8Value;
    this.getTopSenders();
  }

  private showAllResult() {
    this.topSenders = [];
    this.FilterDialog = false;
    this.startDate = "";
    this.endDate = "";
    this.switch1 = false;
    this.switch2 = false;
    this.switch3 = false;
    this.switch4 = false;
    this.switch5 = false;
    this.switch6 = false;
    this.switch7 = false;
    this.switch8 = false;
    this.getTopSenders();
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
      name: "user-id",
      params: { id: e.user.id ? e.user.id?.toString() : "" }
    });
  }
}
</script>

<style scoped>
.v-data-table {
  cursor: pointer;
}
</style>

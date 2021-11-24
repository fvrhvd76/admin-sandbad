<template>
  <div class="full-height py-8 px-4">
    <v-data-table
      @click:row="handleClick"
      :items="factors"
      :headers="headers"
      :loader-height="0"
      :loading="loading"
      hide-default-footer
      class="elevation-1 pointer"
      disable-pagination
    >
      <template #top>
        <v-toolbar style="cursor:auto" flat>
          <v-toolbar-title>فاکتورها</v-toolbar-title>
          <v-spacer />
          <v-text-field
            dense
            outlined
            style="margin-right:400px !important"
            class="mx-4 rounded-xl"
            hide-details
            label="جستجو"
            color="primary"
            v-model="search"
            autocomplete="off"
            append-icon="mdi-magnify"
            @keypress.enter="doSearch"
          >
            <template #append>
              <v-icon @click="doSearch()">mdi-magnify</v-icon>
              <v-expand-x-transition
                ><v-icon @click="clearSearch()" v-show="search"
                  >mdi-close</v-icon
                ></v-expand-x-transition
              >
            </template>
          </v-text-field>
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
      <template v-slot:[`item.profile_picture`]="{ item }">
        <v-avatar size="70" class="my-2" color="grey lighten-2">
          <v-img
            :src="$axios.defaults.baseURL + item.profile_picture"
            v-if="item.profile_picture"
          >
            <template v-slot:placeholder>
              <v-row class="full-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="primary"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
          <v-icon v-else>
            mdi-account
          </v-icon>
        </v-avatar>
      </template>
      <template #[`item.num`]="{ item }">
        <span> {{ factors.indexOf(item) + 1 }}</span>
      </template>
      <template #[`item.factor_code`]="{ item }">
        {{ item.factor_code ? item.factor_code : "-" }}
      </template>
      <template #[`item.test_time`]="{ item }">
        <p v-if="item.test_time">
          {{ item.test_time | jalaliConvertWithTime }}
        </p>
        <p v-else>-</p>
      </template>
      <template #[`item.date_created`]="{ item }">
        {{ item.date_created | jalaliConvert }}
      </template>
      <template #[`item.seller.full_name`]="{ item }">
        {{ item.seller && item.seller.full_name ? item.seller.full_name : "-" }}
      </template>
      <template #[`item.buyer.full_name`]="{ item }">
        {{ item.buyer && item.buyer.full_name ? item.buyer.full_name : "-" }}
      </template>
      <template v-slot:[`item.status`]="{ item }">
        <v-chip color="primary" small>{{ item.status | factorStatus }}</v-chip>
      </template>
      <template v-slot:[`item.final_price`]="{ item }">
        <span class="text-bold">{{ item.final_price.toLocaleString() }}</span>
      </template>
      <template v-slot:[`item.who_paid`]="{ item }">
        <span>{{
          item.who_paid === "buyer"
            ? "خریدار"
            : item.who_paid === "seller"
            ? "فروشنده"
            : "-"
        }}</span>
      </template>
      <template #[`body.append`]>
        <div
          v-if="factors.length > 0"
          v-intersect.quiet="infiniteScrolling"
        ></div>
      </template>
      <template v-slot:no-data>
        <div class="d-flex flex-column justify-center align-center my-4">
          <div
            class="empty-table-icon d-flex flex-row justify-center align-center"
          >
            <v-img src="/icons/empty-table.svg" max-width="68.33" />
          </div>
          <div class="py-2">داده ای وجود ندارد</div>
        </div></template
      >
      <template v-slot:loading>
        <v-progress-circular
          size="60"
          color="primary"
          class="my-4"
          indeterminate
        />
      </template>
    </v-data-table>
    <FilterModal
      :numOfRadioBtn="3"
      :sort1="'شناسه'"
      :sort2="'مبلغ'"
      :sort3="'تاریخ'"
      :numOfSwitches="2"
      :switch1="'پرداخت فروشنده'"
      :switch2="'پرداخت خریدار'"
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
import { getModule } from "vuex-module-decorators";
import GeneralModule from "~/store/general/index";

import { Vue, Component } from "vue-property-decorator";

import { FactorModel } from "~/models/api/factor.model";

import FilterModal from "~/components/modals/FilterModal.vue";
import Snackbar from "~/components/common/Snackbar.vue";
import ErrorModal from "~/components/modals/ErrorModal.vue";

import {
  delay,
  jalaliConvert,
  jalaliConvertWithTime,
  factorStatus
} from "~/helpers/functionality";

@Component({
  middleware: ["permission"],
  components: { FilterModal, Snackbar, ErrorModal },
  filters: {
    jalaliConvert,
    jalaliConvertWithTime,
    factorStatus
  }
})
export default class Index extends Vue {
  [x: string]: any;
  private generalModule = getModule(GeneralModule, this.$store);

  //filter dialog variables
  private FilterDialog: boolean = false;
  private filterMode: string = "sort+time+switch";
  private ordering: number = 1;
  private switch1: boolean = false;
  private switch2: boolean = false;

  private headers = [
    {
      text: "ردیف",
      value: "num",
      align: "start",
      sortable: false
    },

    {
      text: "کد فاکتور",
      value: "factor_code",
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
      text: "زمان تست",
      value: "test_time",
      align: "start",
      sortable: false
    },
    {
      text: "تاریخ ساخت",
      value: "date_created",
      align: "start",
      sortable: false
    },
    {
      text: "فروشنده",
      value: "seller.full_name",
      align: "start",
      sortable: false
    },
    {
      text: "خریدار",
      value: "buyer.full_name",
      align: "start",
      sortable: false
    },
    {
      text: "پرداخت کننده",
      value: "who_paid",
      align: "start",
      sortable: false
    },
    {
      text: "وضعیت",
      value: "status",
      align: "start",
      sortable: false
    },
    {
      text: "مبلغ(تومان)",
      value: "final_price",
      align: "start",
      sortable: false
    }
  ];
  private loading: boolean = false;
  private factors: FactorModel[] = [];
  private itemsCurrentPage: number = 0;
  private itemsPerPage: number = 25;
  private itemsEnd: boolean = false;
  private search: string = "";

  private showError: boolean = false;
  private errorType: string = "";

  private mounted() {
    this.getAllFactors();
  }
  //ToDo status
  private async getAllFactors() {
    try {
      this.loading = true;
      await this.$axios
        .$get(`/admins/factors/`, {
          params: {
            limit: this.itemsPerPage,
            offset: this.itemsCurrentPage,
            ordering:
              this.ordering == 1
                ? "id"
                : this.ordering == 2
                ? "final_price"
                : this.ordering == 3
                ? "date_created"
                : this.ordering == 4
                ? "estimated_time"
                : "id",
            ...(this.search ? { search: this.search } : {}),
            ...(this.startDate && this.endDate
              ? { start_date: this.startDate, end_date: this.endDate }
              : {}),
            ...(this.switch1 == true ? { who_paid: "seller" } : {}),
            ...(this.switch2 == true ? { who_paid: "buyer" } : {})
          },
          headers: {
            Authorization: this.$auth.getToken("local"),
            Accept: "application/json; version=1.0;"
          }
        })
        .then((response: any) => {
          if (response && response.result && response.result.length > 0) {
            this.factors = this.factors.concat(response.result);
          }

          if (response.next === null) {
            this.itemsEnd = true;
          }
        });
    } catch (e: any) {
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

  private async infiniteScrolling(entries: any) {
    if (!this.itemsEnd && entries[0].intersectionRatio > 0) {
      this.itemsCurrentPage = this.itemsCurrentPage + this.itemsPerPage;
      await this.getAllFactors();
    }
  }

  private goToCourierPage(id: number) {
    this.$router.push({
      name: "courier-id",
      params: { id: id ? id?.toString() : "" }
    });
  }

  private showErrorPage(error: string) {
    this.showError = true;
    this.errorType = error;
  }

  private get showErrorData() {
    return this.showError;
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
    this.factors = [];
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
    this.getAllFactors();
  }

  private showAllResult() {
    this.factors = [];
    this.FilterDialog = false;
    this.startDate = "";
    this.endDate = "";
    this.acceptedfactors = false;
    this.avaiblableCouries = false;
    this.getAllFactors();
  }

  //search bar functions
  private doSearch() {
    this.isSearch = true;
    this.factors = [];
    this.itemsCurrentPage = 0;
    this.itemsEnd = false;
    this.getAllFactors();
  }
  private clearSearch() {
    if (!this.isSearch) {
      this.search = "";
      this.isSearch = false;
    } else {
      this.search = "";
      this.factors = [];
      this.getAllFactors();
      this.isSearch = false;
    }
  }
  private handleClick(e: any) {
    this.$router.push({
      name: "factor-id",
      params: { id: e.id ? e.id?.toString() : "" }
    });
  }
}
</script>

<template>
  <div class="full-height py-8 px-4">
    <v-data-table
      :items="transmission"
      :headers="headers"
      :loader-height="0"
      :loading="loading"
      hide-default-footer
      class="elevation-1 pointer"
      disable-pagination
    >
      <template #top>
        <v-toolbar style="cursor:auto" flat>
          <v-toolbar-title>سفرهای پیک</v-toolbar-title>
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
        <span> {{ transmission.indexOf(item) + 1 }}</span>
      </template>
      <template v-slot:[`item.id`]="{ item }">
        {{ item.id ? item.id : "-" }}
      </template>
      <template v-slot:[`item.courier_cost`]="{ item }">
        {{ item.courier_cost ? item.courier_cost.toLocaleString() : "-" }}
      </template>
      <template v-slot:[`item.date`]="{ item }">
        {{ item.date | jalaliConvertWithTime }}
      </template>
      <template v-slot:[`item.transfer_time`]="{ item }">
        {{ item.transfer_time | timeConvertor }}
      </template>
      <template v-slot:[`item.status`]="{ item }">
        <v-chip
          :color="
            item.is_canceled
              ? 'error'
              : item.is_done
              ? 'success'
              : item.is_paid
              ? 'info'
              : item.is_scored
              ? 'primary'
              : ''
          "
          >{{
            item.is_canceled
              ? "لغو شده"
              : item.is_done
              ? "انجام شده"
              : item.is_paid
              ? "پرداخت شده"
              : item.is_scored
              ? "امتیاز  داده شده"
              : "نامشخص"
          }}</v-chip
        >
      </template>
      <template #[`body.append`]>
        <div
          v-if="transmission.length > 0"
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
    <Snackbar />
    <ErrorModal :dialog="showErrorData" :errorType="errorType" />
  </div>
</template>

<script lang="ts">
import { getModule } from "vuex-module-decorators";
import GeneralModule from "~/store/general/index";

import { Vue, Component } from "vue-property-decorator";

import { TransmissionModel } from "~/models/api/transmission.model";

import Snackbar from "~/components/common/Snackbar.vue";
import ErrorModal from "~/components/modals/ErrorModal.vue";

import {
  delay,
  jalaliConvert,
  timeConvertor,
  jalaliConvertWithTime
} from "~/helpers/functionality";

@Component({
  middleware: ["permission"],
  components: { Snackbar, ErrorModal },
  filters: {
    jalaliConvert,
    timeConvertor,
    jalaliConvertWithTime
  }
})
export default class Index extends Vue {
  [x: string]: any;
  private generalModule = getModule(GeneralModule, this.$store);

  private headers = [
    {
      text: "ردیف",
      value: "num",
      align: "start",
      sortable: false
    },

    {
      text: "هزینه سفیر(تومان)",
      value: "courier_cost",
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
      text: "کمیسیون(تومان)",
      value: "commission",
      align: "start",
      sortable: false
    },
    {
      text: "زمان سفر",
      value: "transfer_time",
      align: "start",
      sortable: false
    },

    {
      text: "تاریخ",
      value: "date",
      align: "start",
      sortable: false
    },
    {
      text: "وضعیت سفر",
      value: "status",
      align: "start",
      sortable: false
    }
  ];
  private loading: boolean = false;
  private transmission: TransmissionModel[] = [];
  private itemsCurrentPage: number = 0;
  private itemsPerPage: number = 25;
  private itemsEnd: boolean = false;
  private search: string = "";
  private order: string = "";
  private showError: boolean = false;
  private errorType: string = "";

  private mounted() {
    this.getAllTransmission();
  }

  private async getAllTransmission() {
    try {
      this.loading = true;
      await this.$axios
        .$get(`/admins/transmission/`, {
          params: {
            limit: this.itemsPerPage,
            offset: this.itemsCurrentPage,
            created_for: "pay"
          },
          headers: {
            Authorization: this.$auth.getToken("local"),
            Accept: "application/json; version=1.0;"
          }
        })
        .then((response: any) => {
          if (response && response.result && response.result.length > 0) {
            this.transmission = this.transmission.concat(response.result);
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
  private async infiniteScrolling(entries: any) {
    if (!this.itemsEnd && entries[0].intersectionRatio > 0) {
      this.itemsCurrentPage = this.itemsCurrentPage + this.itemsPerPage;
      await this.getAllTransmission();
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

  //search bar functions
  private doSearch() {
    this.isSearch = true;
    this.transmission = [];
    this.allDiscountCode = [];
    this.itemsCurrentPage = 0;
    this.getAllTransmission();
  }
  private clearSearch() {
    if (!this.isSearch) {
      this.search = "";
      this.isSearch = false;
    } else {
      this.search = "";
      this.transmission = [];
      this.getAllTransmission();
      this.isSearch = false;
    }
  }
  private handleClick(e: any) {
    this.$router.push({
      name: "onePay-id",
      params: { id: e.id ? e.id?.toString() : "" }
    });
  }
}
</script>

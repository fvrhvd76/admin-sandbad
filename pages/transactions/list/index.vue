<template>
  <div class="full-height py-8 px-4 transaction">
    <v-data-table
      :items="transactions"
      @click:row="handleClick"
      :headers="headers"
      :loader-height="0"
      :loading="loading"
      hide-default-footer
      class="elevation-1"
      disable-pagination
    >
      <template #top>
        <v-toolbar style="cursor:auto" flat>
          <v-toolbar-title>لیست تراکنش ها</v-toolbar-title>
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
            @input="doSearch"
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

      <template #[`item.num`]="{ item }">
        <span> {{ transactions.indexOf(item) + 1 }}</span>
      </template>
      <template #[`item.id`]="{ item }">
        <span>{{ item.id ? item.id : "-" }}</span>
      </template>
      <template #[`item.userfull_name`]="{ item }">
        <span>{{ item.full_name ? item.full_name : "-" }}</span>
      </template>
      <template #[`item.full_name`]="{ item }">
        <span>{{ item.full_name ? item.full_name : "-" }}</span>
      </template>
      <template #[`item.amount`]="{ item }">
        <span dir="ltr">{{ item.amount.toLocaleString() }}</span>
      </template>
      <template #[`item.date`]="{item}">
        <span>{{ item.date | jalaliConvertWithTime }}</span>
      </template>
      <template #[`item.deposit_code`]="{item}">
        <span>{{ item.deposit_code ? item.deposit_code : "-" }}</span>
      </template>
      <template #[`item.is_deposit`]="{item}">
        <span>{{ item.is_deposit ? "واریز وجه" : "برداشت وجه" }}</span>
      </template>
      <template #[`item.selectedBank`]="{item}">
        <span>{{ item.selectedBank ? item.selectedBank : "-" }}</span>
      </template>
      <template #[`item.is_successful`]="{item}">
        <v-chip
          color="#C8E6C9"
          v-if="item.is_successful"
          class="success--text font-weight-black"
          >موفق</v-chip
        >
        <v-chip color="#FFCDD2" v-else class="error--text font-weight-black"
          >ناموفق</v-chip
        >
      </template>
      <template #[`body.append`]>
        <div
          v-if="transactions.length > 0"
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

    <FilterModal
      :numOfRadioBtn="2"
      :sort1="'نام کاربر'"
      :sort2="'مبلغ'"
      :numOfSwitches="4"
      :switch1="'واریز'"
      :switch2="'برداشت'"
      :switch3="'موفق'"
      :switch4="'ناموفق'"
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

import { Vue, Component } from "nuxt-property-decorator";

import { UserTransactionModel } from "~/models/api/user-transaction.model";

import { UserTransactiosResponseModel } from "~/models/api/response/users-transactions-response.model";

import FilterModal from "~/components/modals/FilterModal.vue";
import ErrorModal from "~/components/modals/ErrorModal.vue";
import Snackbar from "~/components/common/Snackbar.vue";

//@ts-ignore
import moment from "moment-jalaali";

//@ts-ignore
import JsonExcel from "vue-json-excel";

import {
  delay,
  jalaliConvert,
  jalaliConvertWithTime
} from "~/helpers/functionality";

@Component({
  middleware: ["permission"],
  components: {
    FilterModal,
    ErrorModal,
    Snackbar,
    downloadExcel: JsonExcel
  },
  filters: { jalaliConvert, jalaliConvertWithTime }
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
  private switch3: boolean = false;
  private switch4: boolean = false;
  private switch5: boolean = false;
  private switch6: boolean = false;
  private switch7: boolean = false;
  private switch8: boolean = false;

  //data tables header
  private headers = [
    {
      text: "ردیف",
      value: "num",
      align: "start",
      sortable: false
    },
    {
      text: "نام کاربر",
      value: "user.full_name",
      align: "start",
      sortable: false
    },
    {
      text: "تاریخ  و ساعت",
      value: "date",
      align: "start",
      sortable: false
    },
    {
      text: "مبلغ تراکنش",
      value: "amount",
      align: "start",
      sortable: false
    },
    {
      text: "کد تایید بانک",
      value: "deposit_code",
      align: "start",
      sortable: false
    },
    {
      text: "نوع عملیات",
      value: "is_deposit",
      align: "start",
      sortable: false
    },
    {
      text: "وضعیت",
      value: "is_successful",
      align: "start",
      sortable: false
    }
  ];

  //main request variables
  private loading: boolean = false;
  private transactions: UserTransactionModel[] = [];
  private showError: boolean = false;
  private errorType: string = "";
  private transactionsCurrentPage: number = 0;
  private transactionsPerPage: number = 25;
  private transactionsEnd: boolean = false;
  private startDate: string = "";
  private endDate: string = "";

  //search bar variables
  private search: string = "";
  private isSearch: boolean = false;

  //sort bar variables
  private sorterList = [
    { name: "بیشترین مبلغ تراکنش", value: "-amount" },
    { name: "کمترین مبلغ تراکنش", value: "amount" }
  ];
  private sorter: string = "";

  //lifecycles
  private mounted() {
    this.getAllTransactions();
  }

  //main request function
  private async getAllTransactions() {
    try {
      this.loading = true;
      await this.$axios
        .$get(`/admins/transactions/`, {
          params: {
            limit: this.transactionsPerPage,
            offset: this.transactionsCurrentPage,
            ordering:
              this.ordering == 1
                ? "full_name"
                : this.ordering == 2
                ? "amount"
                : this.ordering == 3
                ? ""
                : this.ordering == 3
                ? ""
                : "",
            ...(this.search ? { search: this.search } : {}),
            ...(this.startDate && this.endDate
              ? { start_date: this.startDate, end_date: this.endDate }
              : {}),
            ...(this.switch1 && !this.switch2 ? { is_deposit: true } : {}),
            ...(this.switch2 && !this.switch1 ? { is_deposit: false } : {}),
            ...(this.switch3 && !this.switch4 ? { is_successful: true } : {}),
            ...(this.switch4 && !this.switch3 ? { is_successful: false } : {})
          },
          headers: {
            Authorization: this.$auth.getToken("local"),
            Accept: "application/json; version=1.0;"
          }
        })
        .then((response: UserTransactiosResponseModel) => {
          if (response && response.result && response.result.length > 0) {
            this.transactions = this.transactions.concat(response.result);
          }

          if (response.next === null) {
            this.transactionsEnd = true;
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

  //search bar functions
  private doSearch() {
    this.isSearch = true;
    this.transactions = [];
    this.allDiscountCode = [];
    this.transactionsCurrentPage = 0;
    this.getAllTransactions();
  }
  private clearSearch() {
    if (!this.isSearch) {
      this.search = "";
      this.isSearch = false;
    } else {
      this.search = "";
      this.transactions = [];
      this.getAllTransactions();
      this.isSearch = false;
    }
  }

  //sort bar functions
  private async doSort() {
    this.transactionsCurrentPage = 0;
    this.transactions = [];
    await this.getAllTransactions();
  }
  private async clearSort() {
    this.transactionsCurrentPage = 0;
    this.transactions = [];
    this.sorter = "";
    await this.getAllTransactions();
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
    this.transactionsCurrentPage = 0;
    this.itemsEnd = false;
    this.transactions = [];
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
    this.getAllTransactions();
  }

  private showAllResult() {
    this.transactions = [];
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
    this.getAllTransactions();
  }

  //error dialog
  private showErrorPage(error: string) {
    this.showError = true;
    this.errorType = error;
  }
  private get showErrorData() {
    return this.showError;
  }

  //infinite scroll
  private async infiniteScrolling(entries: any) {
    if (!this.transactionsEnd && entries[0].intersectionRatio > 0) {
      this.transactionsCurrentPage =
        this.transactionsCurrentPage + this.transactionsPerPage;
      await this.getAllTransactions();
    }
  }

  //export
  private get excelFile() {
    let excelFileFormat: {
      num?: number;
      id?: number;
      amount: number;
      date?: string;
      deposit_code?: string;
      is_deposit?: boolean;
      is_successful: boolean;
      full_name: string;
      user_id: number;
    }[] = [];
    for (let i = 0; i < this.transactions.length; i++) {
      let is_deposit = this.transactions[i].is_deposit
        ? "واریز وجه"
        : "برداشت وجه";
      let is_successful = this.transactions[i].is_successful
        ? "موفق"
        : "ناموفق";
      let deposit_code = this.transactions[i].deposit_code
        ? this.transactions[i].deposit_code
        : "-";
      excelFileFormat = excelFileFormat.concat({
        //@ts-ignore
        ردیف: i + 1,
        شناسه: this.transactions[i].id,
        "نام کامل": this.transactions[i].user?.full_name,
        "شناسه کاربر": this.transactions[i].user?.id,
        تاریخ: moment(this.transactions[i].date).format(
          "jYYYY/jMM/jDD - HH:mm"
        ),
        "کد پرداخت": deposit_code,

        "مبلغ (تومان)": this.transactions[i].amount?.toLocaleString(
          //@ts-ignore
          this.transactions[i].amount
        ),
        "نوع عملیات": is_deposit,
        وضعیت: is_successful
      });
    }
    return excelFileFormat;
  }
  private handleClick(e: any) {
    this.$router.push({
      name: "user-id",
      params: { id: e.user.id ? e.user.id?.toString() : "" }
    });
  }
}
</script>

<style scoped lang="scss">
.transaction {
  .v-input--switch {
    &.v-input--selection-controls {
      margin-top: 0;
      padding-top: 0;
    }
    &.v-input--switch--inset {
      .v-input--switch__track {
        color: "#4caf50" !important;
        opacity: 1 !important;
        border-radius: 7px;
      }
      .v-input--switch__thumb {
        border-radius: 7px;
      }
      &.v-input--is-dirty {
        .v-input--switch__track {
          color: "#ff5252" !important;
          opacity: 1 !important;
          border-radius: 7px;
        }
        .v-input--switch__thumb {
          color: white;
        }
      }
    }
  }
}
.v-data-table {
  cursor: pointer;
}
</style>

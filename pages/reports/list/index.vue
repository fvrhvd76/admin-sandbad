<template>
  <div class="full-height py-8 px-4">
    <v-row>
      <v-col cols="12" md="4" lg="4" xl="4">
        <DataCard
          v-if="reports[5]"
          :count="reports[5].value"
          :title="'سفیران در حال کار'"
        />
      </v-col>
      <v-col cols="12" md="4" lg="4" xl="4">
        <DataCard
          v-if="reports[9]"
          :count="reports[9].value"
          :title="'سفرهای در حال انجام'"
        />
      </v-col>
      <v-col cols="12" md="4" lg="4" xl="4">
        <DataCard
          v-if="reports[11]"
          :count="reports[11].value"
          :title="'تیکت های امروز'"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6" lg="6" xl="3">
        <v-card min-height="300" class="pa-2" height="100%">
          <div
            class="
              primary--text
              font-weight-bold
              full-width
              d-flex
              justify-center
              align-center
              my-2
            "
          >
            تراکنش ها
          </div>
          <v-divider></v-divider>
          <apexchart
            v-if="
              this.reports[0] &&
              this.reports[0].value + this.reports[1].value !== 0
            "
            type="pie"
            :options="chartOptions"
            :series="series"
          ></apexchart>
          <div
            v-else
            class="d-flex justify-center align-center full-height full-width"
          >
            داده ای وجود ندارد.
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="6" xl="3">
        <v-card min-height="300" class="pa-2" height="100%">
          <div
            class="
              primary--text
              font-weight-bold
              full-width
              d-flex
              justify-center
              align-center
              my-2
            "
          >
            سفیران آماده به کار
          </div>
          <v-divider></v-divider>
          <apexchart
            v-if="
              this.reports[2] &&
              this.reports[2].value +
                this.reports[3].value +
                this.reports[4].value !==
                0
            "
            type="pie"
            :options="chartOptions2"
            :series="series2"
          ></apexchart>
          <div
            v-else
            class="d-flex justify-center align-center full-height full-width"
          >
            داده ای وجود ندارد.
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="6" xl="3">
        <v-card min-height="300" class="pa-2" height="100%">
          <div
            class="
              primary--text
              font-weight-bold
              full-width
              d-flex
              justify-center
              align-center
              my-2
            "
          >
            کاربران جدید
          </div>
          <v-divider></v-divider>
          <apexchart
            v-if="
              (this.reports[6] && this.reports[6].value !== 0) ||
              (this.reports[7] && this.reports[7].value !== 0) ||
              (this.reports[8] && this.reports[8].value !== 0)
            "
            type="pie"
            :options="chartOptions3"
            :series="series3"
          ></apexchart>
          <div
            v-else
            class="d-flex justify-center align-center full-height full-width"
          >
            داده ای وجود ندارد.
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" lg="6" xl="3">
        <v-card min-height="300" class="pa-2" height="100%">
          <div
            class="
              primary--text
              font-weight-bold
              full-width
              d-flex
              justify-center
              align-center
              my-2
            "
          >
            تیکت های امروز
          </div>
          <v-divider></v-divider>
          <apexchart
            v-if="
              (this.reports[10] && this.reports[10].value !== 0) ||
              (this.reports[11] && this.reports[11].value !== 0)
            "
            type="pie"
            :options="chartOptions4"
            :series="series4"
          ></apexchart>
          <div
            v-else
            class="d-flex justify-center align-center full-height full-width"
          >
            داده ای وجود ندارد.
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-card class="mt-4">
      <v-data-table
        :items="reports"
        :headers="headers"
        :loader-height="0"
        :loading="loading"
        hide-default-footer
        class="elevation-0"
        disable-pagination
      >
        <template #top>
          <v-toolbar flat>
            <v-toolbar-title>لیست</v-toolbar-title>
          </v-toolbar>
        </template>

        <template #[`item.num`]="{ item }">
          <span> {{ reports.indexOf(item) + 1 }}</span>
        </template>
        <template #[`item.value`]="{ item }">
          <span>{{ item.value }}</span>
        </template>
        <template #[`item.description`]="{ item }">
          <span>{{ item.description ? item.description : "-" }}</span>
        </template>
        <template #no-data>
          <div class="d-flex flex-column justify-center align-center my-4">
            <div
              class="
                empty-table-icon
                d-flex
                flex-row
                justify-center
                align-center
              "
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
        <template #footer>
          <download-excel
            class="btn btn-default"
            :data="excelFile"
            worksheet="SandBad reports"
            name="sandBad-reports.xls"
          >
            <div class="d-flex justify-end align-center pa-2">
              <v-btn
                class="d-flex justify-center align-center ma-4"
                color="success"
                ><v-icon>mdi-microsoft-excel</v-icon>
                <p class="mt-4 mr-2">دریافت خروجی اکسل</p></v-btn
              >
            </div>
          </download-excel>
        </template>
      </v-data-table>
    </v-card>
    <Snackbar />
    <ErrorModal :dialog="showErrorData" :errorType="errorType" />
  </div>
</template>

<script lang="ts">
import GeneralModule from "~/store/general/index";
import { getModule } from "vuex-module-decorators";

import { Component, Vue } from "nuxt-property-decorator";

import { ReportModel } from "~/models/api/report.model";
//@ts-ignore
import JsonExcel from "vue-json-excel";
import DataCard from "~/components/common/DataCard.vue";
import VueApexCharts from "vue-apexcharts";
import FilterModal from "~/components/modals/FilterModal.vue";
import ErrorModal from "~/components/modals/ErrorModal.vue";
import Snackbar from "~/components/common/Snackbar.vue";

import { delay } from "~/helpers/functionality";

@Component({
  middleware: ["permission"],
  components: {
    FilterModal,
    apexchart: VueApexCharts,
    ErrorModal,
    Snackbar,
    DataCard,
    downloadExcel: JsonExcel,
  },
})
export default class index extends Vue {
  [x: string]: any;
  private generalModule = getModule(GeneralModule, this.$store);

  //data tables header
  private headers = [
    {
      text: "ردیف",
      value: "num",
      align: "center",
      sortable: false,
    },
    {
      text: "نام فیلد",
      value: "name",
      align: "start",
      sortable: false,
    },
    {
      text: "توضیحات ",
      value: "description",
      align: "start",
      sortable: false,
    },
    {
      text: "تعداد ",
      value: "value",
      align: "start",
      sortable: false,
    },
  ];

  //main GET request variables
  private loading: boolean = false;
  private showError: boolean = false;
  private errorType: string = "";
  private reports: ReportModel[] = [];

  //error functions
  private get showErrorData() {
    return this.showError;
  }
  private showErrorPage(error: string) {
    this.showError = true;
    this.errorType = error;
  }

  private series: any[] = [];
  private chartOptions = {
    chart: {
      type: "pie",
    },
    fill: {
      colors: ["#f48c3a", "#f6a161"],
    },
    labels: ["تراکنش ها موفق", "تراکنش ها نا موفق"],
    theme: {
      monochrome: {
        enabled: true,
      },
    },
    legend: {
      show: false,
    },
  };

  private series2: any[] = [];
  private chartOptions2 = {
    chart: {
      type: "pie",
    },
    fill: {
      colors: ["#f48c3a", "#f6a161", "#f7ad75"],
    },
    labels: ["موتور سیکلت", "وانت بار", "اتومبیل"],
    theme: {
      monochrome: {
        enabled: true,
      },
    },
    legend: {
      show: false,
    },
  };

  private series3: any[] = [];
  private chartOptions3 = {
    chart: {
      type: "pie",
    },
    fill: {
      colors: ["#f48c3a", "#f6a161", "#f7ad75"],
    },
    labels: ["سفیران (تایید شده)", "سفیران (تایید نشده)", "فرستنده ها"],
    theme: {
      monochrome: {
        enabled: true,
      },
    },
    legend: {
      show: false,
    },
  };

  private series4: any[] = [];
  private chartOptions4 = {
    chart: {
      type: "pie",
    },
    fill: {
      colors: ["#f48c3a", "#f6a161"],
    },
    labels: ["تیکت های دریافت شده", "تیکت های پاسخ داده شده"],
    theme: {
      monochrome: {
        enabled: true,
      },
    },
    legend: {
      show: false,
    },
  };

  private async mounted() {
    await this.getReports();
    this.series = [this.reports[0].value, this.reports[1].value];
    this.series2 = [
      this.reports[2].value,
      this.reports[3].value,
      this.reports[4].value,
    ];
    this.series3 = [
      this.reports[6].value,
      this.reports[7].value,
      this.reports[8].value,
    ];
    this.series4 = [this.reports[11].value, this.reports[10].value];
  }

  //main GET request function
  private async getReports() {
    try {
      this.loading = true;
      await this.$axios
        .$get(`/admins/reports/`, {
          headers: {
            Authorization: this.$auth.getToken("local"),
            Accept: "application/json; version=1.0;",
          },
        })
        .then((response: ReportModel) => {
          this.reports = this.reports.concat(response);
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
  private get excelFile() {
    let excelFileFormat: {
      num?: number;
      name?: string;
      value?: number;
      description?: string;
    }[] = [];
    for (let i = 0; i < this.reports.length; i++) {
      excelFileFormat = excelFileFormat.concat({
        //@ts-ignore
        ردیف: i + 1,
        "نام فیلد": this.reports[i].name,
        تعداد: this.reports[i].value,
        توضیحات: this.reports[i].description,
      });
    }
    return excelFileFormat;
  }
}
</script>

<style scoped lang="scss">
.full-height {
  height: 100%;
}
</style>

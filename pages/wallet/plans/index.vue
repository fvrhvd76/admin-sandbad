<template>
  <div>
    <v-card class="pa-4">
      <div class="text-bold gery--text">ساخت پلن جدید</div>
      <v-divider class="my-4" />
      <v-row justify="center" class="ma-0">
        <v-col cols="12" md="12" lg="12" sm="12">
          <p>{{ rules }}</p>
        </v-col>
        <v-col cols="12" md="8" lg="8" sm="8">
          <v-text-field
            @keypress="onlyNumber"
            label="مبلغ پلن"
            outlined
            color="primary"
            dense
            v-model="planAmount"
            @keydown.enter="createFinancialPlans"
          >
            <template #append>
              <p class="pt-2">تومان</p>
            </template>
          </v-text-field>
        </v-col>
        <v-col class="mt-1" cols="12" md="4" lg="4" sm="4">
          <v-btn dense color="primary" text @click="clearFields" class="ml-4">
            پاک کردن
          </v-btn>
          <v-btn
            dense
            depressed
            color="primary"
            @click="createFinancialPlans"
            :disabled="planAmount === null || planAmount === ''"
          >
            ذخیره
          </v-btn>
        </v-col>
      </v-row>
      <v-divider class="my-4" />
      <v-data-table
        :items="FinancialPlans"
        :loader-height="0"
        hide-default-footer
        :headers="planListHeader"
        :loading="loading"
        class="elevation-1 mb-8"
        disable-pagination
      >
        <template #top>
          <v-toolbar flat class="pa-2">
            <v-toolbar-title>لیست تراکنش ها</v-toolbar-title>
            <v-spacer />
            <v-icon large @click="refreshData">mdi-refresh</v-icon>
          </v-toolbar>
        </template>
        <template #[`item.done`]="{ item }">
          <div v-if="item.done" title="پاسخ داده شده">
            <v-icon color="success">mdi-email-check</v-icon>
          </div>
          <div v-else title="پاسخ داده نشده">
            <v-icon color="error">mdi-email-open</v-icon>
          </div>
        </template>
        <template #[`item.num`]="{ item }">
          <span> {{ FinancialPlans.indexOf(item) + 1 }}</span>
        </template>
        <template #[`item.id`]="{ item }">
          <span> {{ item.id ? item.id : '-' }}</span>
        </template>
        <template #[`item.created_date`]="{ item }">
          <span> {{ item.created_date | jalaliConvert }}</span>
        </template>
        <template #[`item.amount`]="{ item }">
          <span> {{ item.amount .toLocaleString() }}</span>
        </template>
        <template #[`item.count_used`]="{ item }">
          <span> {{ item.count_used .toLocaleString() }}</span>
        </template>
        <template #[`item.is_active`]="{ item }">
          <v-chip v-if="item.is_active" color="success">فعال</v-chip>
          <v-chip v-else color="error">غیر فعال</v-chip>
        </template>
        <template #[`item.action`]="{ item }">
          <v-icon
            color="success"
            v-if="item.is_active"
            @click="
              changeStatusFinancialPlan(item.id, FinancialPlans.indexOf(item))
            "
            >mdi-check-circle</v-icon
          >
          <v-icon
            color="error"
            v-else
            @click="
              changeStatusFinancialPlan(item.id, FinancialPlans.indexOf(item))
            "
            >mdi-close-circle</v-icon
          >
          <v-icon @click="deleteFinancialPlan(item.id)"
            >mdi-delete-circle</v-icon
          >
        </template>
        <template #[`body.append`]>
          <div
            v-if="FinancialPlans.length > 0"
            v-intersect.quiet="infiniteScrolling"
          ></div>
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
      </v-data-table>
    </v-card>
    <Snackbar />
    <ErrorModal :dialog="showErrorData" :errorType="errorType" />
  </div>
</template>

<script lang="ts">
import GeneralModule from '~/store/general/index'
import { getModule } from 'vuex-module-decorators'
import { Vue, Component } from 'vue-property-decorator'

import { FinancialResponseModel } from '~/models/api/response/financial-response.model'

import { FinancialModel } from '~/models/api/financial.model'

import Snackbar from '~/components/common/Snackbar.vue'
import ErrorModal from '~/components/modals/ErrorModal.vue'
import MessageModal from '~/components/modals/MessageModal.vue'

import { jalaliConvert, delay } from '~/helpers/functionality'

@Component({
  middleware: ['permission'],

  components: {
    Snackbar,
    ErrorModal,
  },
  filters: {
    jalaliConvert,
  },
})
export default class index extends Vue {
  [x: string]: any
  private generalModule = getModule(GeneralModule, this.$store)

  private showError: boolean = false
  private errorType: string = ''
  private financialPlansCurrentPage: number = 0
  private financialPlansPerPage: number = 25
  private financialPlansEnd: boolean = false
  private planListHeader = [
    {
      text: 'ردیف',
      value: 'num',
      align: 'start',
      sortable: false,
    },
    {
      text: 'شناسه',
      value: 'id',
      align: 'start',
      sortable: false,
    },
    {
      text: 'تاریخ ساخت',
      value: 'created_date',
      align: 'start',
      sortable: false,
    },
    {
      text: 'مبلغ',
      value: 'amount',
      align: 'start',
      sortable: false,
    },
    {
      text: 'تعداد دفعات خریداری شده',
      value: 'count_used',
      align: 'start',
      sortable: false,
    },
    {
      text: 'وضعیت',
      value: 'is_active',
      align: 'start',
      sortable: false,
    },
    {
      text: '',
      value: 'action',
      align: 'start',
      sortable: false,
    },
  ]
  private status = [
    { name: 'فعال', value: true },
    { name: 'غیر فعال', value: false },
  ]

  //main function variables
  private planAmount: number | any = null
  private loading: boolean = false
  private FinancialPlans: FinancialModel[] = []

  //validation functions
  private onlyNumber($event: any) {
    let keyCode = $event.keyCode ? $event.keyCode : $event.which
    if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
      $event.preventDefault()
    }
  }
  private get rules() {
    if (this.planAmount === null || this.planAmount === '') {
      return 'مبلغ صحیح را وارد کنید:'
    }
  }

  //lifecycle
  private mounted() {
    this.getFinancialPlans()
  }

  //main function
  private async getFinancialPlans() {
    try {
      this.loading = true
      await this.$axios
        .$get(`admins/financial-plan/`, {
          params: {
            limit: this.financialPlansPerPage,
            offset: this.financialPlansCurrentPage,
          },
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then((response: FinancialResponseModel) => {
          if (response && response.result && response.result.length > 0) {
            this.FinancialPlans = this.FinancialPlans.concat(response.result)
          }
          if (response.next === null) {
            this.financialPlansEnd = true
          }
        })
    } catch (e: any) {
      if (e.response.status === 404 || e.response.status === 500) {
        this.showErrorPage(e.response.status)
      } else {
        this.generalModule.toggleSnackbar(true)
        this.generalModule.setSnackbarColor('error')
        this.generalModule.setSnackbarText(e.response.data.detail)
      }
    } finally {
      await delay(500)
      this.loading = false
    }
  }

  //create functions
  private async createFinancialPlans() {
    try {
      const data = {
        amount: this.planAmount,
      }
      this.loading = true
      await this.$axios
        .$post(`/admins/financial-plan/`, data, {
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then(() => {
          this.FinancialPlans = []
          this.getFinancialPlans()
        })
    } catch (e: any) {
      if (e.response.status === 404 || e.response.status === 500) {
        this.showErrorPage(e.response.status)
      } else {
        this.generalModule.toggleSnackbar(true)
        this.generalModule.setSnackbarColor('error')
        this.generalModule.setSnackbarText(e.response.data.detail)
      }
    } finally {
      this.planAmount = ''
      await delay(500)
      this.loading = false
    }
  }

  private clearFields() {
    this.planAmount = ''
  }

  //refresh Data
  private refreshData() {
    this.FinancialPlans = []
    this.financialPlansCurrentPage = 0
    this.getFinancialPlans()
  }

  //delete FinancialPlans request
  private async deleteFinancialPlan(id: number) {
    try {
      await this.$axios
        .$delete(`/admins/financial-plan/${id}/`, {
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then((response) => {
          this.FinancialPlans = this.FinancialPlans.filter(
            (item) => item.id !== id
          )
        })
    } catch (e: any) {
      if (e.response.status === 404 || e.response.status === 500) {
        this.showErrorPage(e.response.status)
      } else {
        this.generalModule.toggleSnackbar(true)
        this.generalModule.setSnackbarColor('error')
        this.generalModule.setSnackbarText(e.response.data.detail)
      }
    } finally {
      await delay(500)
      this.accountSaveLoading = false
    }
  }

  //change status action
  private async changeStatusFinancialPlan(id: number, index: number) {
    this.FinancialPlans[index].is_active = !this.FinancialPlans[index].is_active
    try {
      this.$axios.$patch(`admins/financial-plan/${id}/`, {
        headers: {
          Authorization: this.$auth.getToken('local'),
          Accept: 'application/json; version=1.0;',
        },
      }) /*
        .then(() => {
          this.getFinancialPlans();
        }); */
    } catch (e: any) {
      if (e.response.status === 404 || e.response.status === 500) {
        this.showErrorPage(e.response.status)
      } else {
        this.generalModule.toggleSnackbar(true)
        this.generalModule.setSnackbarColor('error')
        this.generalModule.setSnackbarText(e.response.data.detail)
      }
    } finally {
      this.planAmount = ''
      await delay(500)
      this.loading = false
    }
  }

  //error dialog
  private showErrorPage(error: string) {
    this.showError = true
    this.errorType = error
  }
  private get showErrorData() {
    return this.showError
  }
  //infinite scroll
  private async infiniteScrolling(entries: any) {
    if (!this.financialPlansEnd && entries[0].intersectionRatio > 0) {
      this.financialPlansCurrentPage =
        this.financialPlansCurrentPage + this.financialPlansPerPage
      await this.getFinancialPlans()
    }
  }
}
</script>

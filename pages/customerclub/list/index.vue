<template>
  <div class="full-height py-8 px-4">
    <v-card width="100%">
      <v-data-table
        :items="allDiscountCode"
        :headers="headers"
        :loader-height="0"
        :loading="loading"
        hide-default-footer
        class="elevation-1"
        disable-pagination
      >
        <template #top>
          <v-toolbar style="cursor: auto" flat>
            <v-toolbar-title>دسته های کد تخفیف</v-toolbar-title>
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
            <v-text-field
              dense
              outlined
              style="margin-right: 400px !important"
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

        <template #[`item.num`]="{ item }">
          <span> {{ allDiscountCode.indexOf(item) + 1 }}</span>
        </template>

        <template #[`item.picture`]="{ item }">
          <v-avatar size="70" class="my-2" color="grey lighten-2">
            <v-img
              :src="$axios.defaults.baseURL + item.picture"
              v-if="item.picture"
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
            <v-icon v-else> mdi-image </v-icon>
          </v-avatar>
        </template>

        <template #[`item.title`]="{ item }">
          {{ item.title ? item.title : '-' }}
        </template>

        <template #[`item.id`]="{ item }">
          {{ item.id ? item.id : '-' }}
        </template>

        <template #[`item.audience`]="{ item }">
          <span>{{
            item.audience === 'sender'
              ? 'فرستنده'
              : item.audience === 'seller'
              ? 'فروشنده'
              : item.audience === 'courier'
              ? 'سفیر'
              : item.audience === 'buyer'
              ? 'خریدار'
              : 'همه'
          }}</span>
        </template>

        <template #[`item.discount_code`]="{ item }">
          <span>{{ item.discount_code ? item.discount_code : '-' }}</span>
        </template>

        <template #[`item.discount_amount`]="{ item }">
          <span>{{
            item.discount_amount
              ? item.discount_amount.toLocaleString(item.discount_amount)
              : '-'
          }}</span>
        </template>

        <template #[`item.discount_percent`]="{ item }">
          <span>{{
            item.discount_percent ? item.discount_percent + '%' : '-'
          }}</span>
        </template>

        <template #[`item.coins`]="{ item }">
          <span>{{ item.coins ? item.coins : '-' }}</span>
        </template>

        <template #[`item.limit`]="{ item }">
          <span>{{ item.limit ? item.limit : '-' }}</span>
        </template>

        <template #[`item.used_number`]="{ item }">
          <span>{{ item.used_number ? item.used_number : '-' }}</span>
        </template>

        <template #[`item.is_active`]="{ item }">
          <span>{{ item.is_active ? 'فعال' : 'غیرفعال' }}</span>
        </template>
        <template #[`item.is_internal`]="{ item }">
          <span>{{ item.is_internal ? 'داخلی' : 'خارجی' }}</span>
        </template>

        <template #[`item.end_date`]="{ item }">
          <span>{{ item.end_date | jalaliConvert }}</span>
        </template>

        <template #[`item.actions`]="{ item }">
          <v-btn
            fab
            x-small
            depressed
            color="primary"
            @click="goToEditPage(item.id)"
            class="ml-1"
          >
            <v-icon> mdi-pencil </v-icon>
          </v-btn>
          <v-btn
            fab
            x-small
            depressed
            color="primary"
            v-if="!item.discount_code"
            @click="goToDiscountCodesPage(item.id)"
            class="ml-1"
          >
            <v-icon> mdi-format-list-bulleted </v-icon>
          </v-btn>
          <v-btn
            fab
            x-small
            depressed
            color="primary"
            @click="openConfirmModal(item.id)"
          >
            <v-icon> mdi-delete </v-icon>
          </v-btn>
        </template>

        <template #[`body.append`]>
          <div
            v-if="allDiscountCode.length > 0"
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
    <FilterModal
      :numOfRadioBtn="4"
      :sort1="'عنوان'"
      :sort2="'امتیاز'"
      :sort3="'مصرف'"
      :sort4="'تاریخ '"
      :numOfSwitches="8"
      :switch1="'فعال'"
      :switch2="'غیر فعال'"
      :switch3="'داخلی'"
      :switch4="'خارجی'"
      :switch5="'خریدار'"
      :switch6="'سفیر'"
      :switch7="'فروشنده'"
      :switch8="'فرستنده'"
      :dialog="FilterDialog"
      :mode="filterMode"
      @closeDialog="closeFilterDialog"
      @confirm="filter"
      @allResult="showAllResult"
    />
    <ConfirmModal
      @ok="selectDiscountForDelete"
      :dialog="confirmDialog"
      :title="'کد تخفیف'"
      @closeDialog="closeConfirmDialog"
    />
    <Snackbar />
    <ErrorModal :dialog="showErrorData" :errorType="errorType" />
  </div>
</template>

<script lang="ts">
import GeneralModule from '~/store/general/index'
import { getModule } from 'vuex-module-decorators'

import { Component, Vue } from 'nuxt-property-decorator'

import { AllDiscountCodeResponseModel } from '~/models/api/response/all-dicount-code-response.model'

import { AllDiscountCodeModel } from '~/models/api/all-discount-code.model'

import ConfirmModal from '~/components/modals/ConfirmModal.vue'
import FilterModal from '~/components/modals/FilterModal.vue'
import ErrorModal from '~/components/modals/ErrorModal.vue'
import Snackbar from '~/components/common/Snackbar.vue'

import { delay, jalaliConvert } from '~/helpers/functionality'

@Component({
  middleware: ['permission'],
  components: {
    FilterModal,
    ErrorModal,
    Snackbar,
    ConfirmModal,
  },
  filters: { jalaliConvert },
})
export default class index extends Vue {
  [x: string]: any
  private generalModule = getModule(GeneralModule, this.$store)

  //confirm modal
  private id: number = 0
  private confirmDialog: boolean = false
  private openConfirmModal(id: number) {
    this.id = id
    this.confirmDialog = true
  }
  private closeConfirmDialog() {
    this.confirmDialog = false
  }

  //data tables header
  private headers = [
    {
      text: 'ردیف',
      value: 'num',
      align: 'start',
      sortable: false,
    },
    {
      text: 'تصویر',
      value: 'picture',
      align: 'start',
      sortable: false,
    },
    {
      text: 'عنوان',
      value: 'title',
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
      text: 'کاربران هدف',
      value: 'audience',
      align: 'start',
      sortable: false,
    },
    {
      text: 'کد تخفیف',
      value: 'discount_code',
      align: 'start',
      sortable: false,
    },
    {
      text: 'مبلغ تخفیف',
      value: 'discount_amount',
      align: 'start',
      sortable: false,
    },
    {
      text: 'درصد تخفیف',
      value: 'discount_percent',
      align: 'start',
      sortable: false,
    },

    {
      text: 'امتیاز',
      value: 'coins',
      align: 'start',
      sortable: false,
    },
    {
      text: 'محدودیت(نفر)',
      value: 'limit',
      align: 'start',
      sortable: false,
    },
    {
      text: 'تعداد استفاده شده',
      value: 'used_number',
      align: 'center',
      sortable: false,
    },
    {
      text: 'وضعیت انتشار',
      value: 'is_active',
      align: 'start',
      sortable: false,
    },
    {
      text: 'نوع',
      value: 'is_internal',
      align: 'start',
      sortable: false,
    },
    {
      text: 'تاریخ انقضاء',
      value: 'end_date',
      align: 'start',
      sortable: false,
    },
    {
      text: '',
      value: 'actions',
      align: 'start',
      sortable: false,
    },
  ]

  //search bar variables
  private search: string = ''
  private isSearch: boolean = false

  //sort bar variables
  private sorterList = [
    { name: 'عنوان', value: 'title' },
    { name: 'شناسه', value: 'id' },
    { name: 'امتیاز', value: 'coins' },
    { name: 'تعداد استفاده شده', value: 'used_number' },
    { name: 'تاریخ انقضاء', value: 'end_date' },
  ]
  private sorter: string = ''

  //filter dialog variables
  private FilterDialog: boolean = false
  private filterMode: string = 'sort+time+switch'
  private ordering: number = 1
  private switch1: boolean = false
  private switch2: boolean = false
  private switch3: boolean = false
  private switch4: boolean = false
  private switch5: boolean = false
  private switch6: boolean = false
  private switch7: boolean = false
  private switch8: boolean = false

  //main request variables
  private loading: boolean = false
  private showError: boolean = false
  private errorType: string = ''
  private itemsCurrentPage: number = 0
  private itemsPerPage: number = 25
  private itemsEnd: boolean = false
  private startDate: string = ''
  private endDate: string = ''
  private allDiscountCode: AllDiscountCodeModel[] = []

  //error functions
  private get showErrorData() {
    return this.showError
  }
  private showErrorPage(error: string) {
    this.showError = true
    this.errorType = error
  }
  //filter dialog functions
  private closeFilterDialog() {
    this.FilterDialog = false
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
    this.itemsCurrentPage = 0
    this.itemsEnd = false
    this.allDiscountCode = []
    this.FilterDialog = false
    this.ordering = sort
    this.startDate = start
    this.endDate = end
    this.switch1 = switch1Value
    this.switch2 = switch2Value
    this.switch3 = switch3Value
    this.switch4 = switch4Value
    this.switch5 = switch5Value
    this.switch6 = switch6Value
    this.switch7 = switch7Value
    this.switch8 = switch8Value
    this.getAllDiscountCode()
  }

  private showAllResult() {
    this.allDiscountCode = []
    this.FilterDialog = false
    this.startDate = ''
    this.endDate = ''
    this.switch1 = false
    this.switch2 = false
    this.switch3 = false
    this.switch4 = false
    this.switch5 = false
    this.switch6 = false
    this.switch7 = false
    this.switch8 = false
    this.getAllDiscountCode()
  }

  //search bar functions
  private doSearch() {
    this.isSearch = true
    this.allDiscountCode = []
    this.itemsCurrentPage = 0
    this.itemsEnd = false
    this.getAllDiscountCode()
  }
  private clearSearch() {
    if (!this.isSearch) {
      this.search = ''
      this.isSearch = false
    } else {
      this.search = ''
      this.allDiscountCode = []
      this.getAllDiscountCode()
      this.isSearch = false
    }
  }

  //sort bar functions
  private async doSort() {
    this.allDiscountCode = []
    await this.getAllDiscountCode()
  }
  private async clearSort() {
    this.allDiscountCode = []
    this.sorter = ''
    await this.getAllDiscountCode()
  }

  //infinite scroll
  private async infiniteScrolling(entries: any) {
    if (!this.itemsEnd && entries[0].intersectionRatio > 0) {
      this.itemsCurrentPage = this.itemsCurrentPage + this.itemsPerPage
      await this.getAllDiscountCode()
    }
  }

  //main request function
  private async getAllDiscountCode() {
    try {
      this.loading = true
      await this.$axios
        .$get(`/admins/discount-code/category/`, {
          params: {
            limit: this.itemsPerPage,
            offset: this.itemsCurrentPage,
            ...(this.search ? { search: this.search } : {}),
            ordering:
              this.ordering == 1
                ? 'title'
                : this.ordering == 2
                ? 'coins'
                : this.ordering == 3
                ? 'used_number'
                : this.ordering == 4
                ? 'end_date'
                : '',
            // ...(this.switch8
            //   ? { audience: "sender" }
            //   : this.switch6
            //   ? { audience: "courier" }
            //   : this.switch8
            //   ? { audience: "seller" }
            //   : this.switch8
            //   ? { audience: "buyer" }
            //   : this.switch8
            //   ? { audience: "all" }
            //   : {}),
            ...(this.switch1 && !this.switch2 ? { is_active: true } : {}),
            ...(this.switch2 && !this.switch1 ? { is_active: false } : {}),
            ...(this.switch3 && !this.switch4 ? { is_internal: true } : {}),
            ...(this.switch4 && !this.switch3 ? { is_internal: false } : {}),
            ...(this.startDate && this.endDate
              ? { start_date: this.startDate, end_date: this.endDate }
              : {}),
          },
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then((response: AllDiscountCodeResponseModel) => {
          if (response && response.result && response.result.length > 0) {
            this.allDiscountCode = this.allDiscountCode.concat(response.result)
          }

          if (response.next === null) {
            this.itemsEnd = true
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

  //Delete Request
  private async selectDiscountForDelete() {
    try {
      this.loading = true
      await this.$axios
        .$delete(`/admins/discount-code/category/${this.id}/`, {
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then(() => {
          this.allDiscountCode = this.allDiscountCode.filter(
            (item) => item.id !== this.id
          )
          this.generalModule.toggleSnackbar(true)
          this.generalModule.setSnackbarColor('success')
          this.generalModule.setSnackbarText('دسته موفقیت حذف شد')
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
      this.confirmDialog = false
    }
  }

  //lifecycle
  private mounted() {
    this.getAllDiscountCode()
  }

  //actions functions
  private goToEditPage(id: number) {
    this.$router.push({
      name: 'category-id',
      params: { id: id ? id?.toString() : '' },
    })
  }
  private goToDiscountCodesPage(id: number) {
    this.$router.push({
      name: 'discountcodes-id',
      params: { id: id ? id?.toString() : '' },
    })
  }
}
</script>

<style scoped lang="scss">
.full-height {
  height: 100%;
}
</style>

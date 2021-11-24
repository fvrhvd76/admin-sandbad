<template>
  <div class="full-height py-8 px-4">
    <v-data-table
      @click:row="handleClick"
      :items="users"
      :headers="headers"
      :loader-height="0"
      :loading="loading"
      hide-default-footer
      class="elevation-1 pointer"
      disable-pagination
    >
      <template #top>
        <v-toolbar style="cursor: auto" flat>
          <v-toolbar-title>کاربران</v-toolbar-title>
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
            @input="doSearch()"
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
          <v-icon v-else> mdi-account </v-icon>
        </v-avatar>
      </template>
      <template #[`item.num`]="{ item }">
        <span> {{ users.indexOf(item) + 1 }}</span>
      </template>
      <template #[`item.full_name`]="{ item }">
        <span> {{ item.full_name ? item.full_name : '-' }}</span>
      </template>
      <template v-slot:[`item.is_male`]="{ item }">
        {{ item.is_male == true ? 'مرد' : item.is_male == false ? 'زن' : '-' }}
      </template>
      <template v-slot:[`item.phone_number`]="{ item }">
        {{ item.phone_number ? item.phone_number : '-' }}
      </template>
      <template v-slot:[`item.date_joined`]="{ item }">
        {{ item.date_joined | jalaliConvert }}
      </template>
      <template v-slot:[`item.birth_date`]="{ item }">
        {{ item.birth_date ? item.birth_date.replace(/-/g, '/') : '-' }}
      </template>
      <template v-slot:[`item.is_authenticated`]="{ item }">
        <v-chip :color="item.is_authenticated ? '#C8E6C9' : '#FFCDD2'">{{
          item.is_authenticated ? 'عادی' : 'مسدود'
        }}</v-chip>
      </template>
      <template #[`body.append`]>
        <div
          v-if="users.length > 0"
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
      :numOfRadioBtn="2"
      :sort1="'نام'"
      :sort2="'تاریخ عضویت'"
      :numOfSwitches="4"
      :switch1="'سفیر'"
      :switch2="'فرستنده'"
      :switch3="'خریدار'"
      :switch4="'فروشنده'"
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
import { getModule } from 'vuex-module-decorators'
import GeneralModule from '~/store/general/index'

import { Vue, Component } from 'vue-property-decorator'

import { UserModel } from '~/models/api/user.model'

import { UsersResponseModel } from '~/models/api/response/users-response.model'

import FilterModal from '~/components/modals/FilterModal.vue'
import Snackbar from '~/components/common/Snackbar.vue'
import ErrorModal from '~/components/modals/ErrorModal.vue'

import { delay, jalaliConvert } from '~/helpers/functionality'

@Component({
  middleware: ['permission'],
  components: { FilterModal, Snackbar, ErrorModal },
  filters: {
    jalaliConvert,
  },
})
export default class Index extends Vue {
  [x: string]: any
  private generalModule = getModule(GeneralModule, this.$store)

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

  //params variables
  private acceptedUsers: boolean = false
  private avaiblableCouries: boolean = false

  private headers = [
    {
      text: 'ردیف',
      value: 'num',
      align: 'start',
      sortable: false,
    },

    {
      text: 'تصویر',
      value: 'profile_picture',
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
      text: 'نام و نام خانوادگی',
      value: 'full_name',
      align: 'start',
      sortable: false,
    },
    {
      text: 'شماره تماس',
      value: 'phone_number',
      align: 'start',
      sortable: false,
    },
    {
      text: 'جنسیت',
      value: 'is_male',
      align: 'start',
      sortable: false,
    },
    {
      text: 'تاریخ عضویت',
      value: 'date_joined',
      align: 'start',
      sortable: false,
    },
    {
      text: 'تاریخ تولد',
      value: 'birth_date',
      align: 'start',
      sortable: false,
    },
    {
      text: 'وضعیت',
      value: 'is_authenticated',
      align: 'start',
      sortable: false,
    },
  ]
  private loading: boolean = false
  private users: UserModel[] = []
  private itemsCurrentPage: number = 0
  private itemsPerPage: number = 25
  private itemsEnd: boolean = false
  private search: string = ''
  private order: string = ''
  private orderList = [
    { name: 'احراز هویت شده', value: 'accepted' },
    { name: 'فعال', value: 'is_available' },
  ]
  private showError: boolean = false
  private errorType: string = ''

  private mounted() {
    this.getAllUsers()
  }

  private async getAllUsers() {
    try {
      this.loading = true
      await this.$axios
        .$get(`/admins/users/`, {
          params: {
            limit: this.itemsPerPage,
            offset: this.itemsCurrentPage,
            ordering:
              this.ordering == 1
                ? 'full_name'
                : this.ordering == 2
                ? 'date_joined'
                : this.ordering == 3
                ? ''
                : this.ordering == 3
                ? ''
                : '',
            ...(this.search ? { search: this.search } : {}),
            ...(this.startDate && this.endDate
              ? { start_date: this.startDate, end_date: this.endDate }
              : {}),
            ...(this.switch1 == true ? { is_courier: true } : {}),
            ...(this.switch2 == true ? { is_sender: true } : {}),
            ...(this.switch3 == true ? { is_buyer: true } : {}),
            ...(this.switch4 == true ? { is_seller: true } : {}),
            ...(this.switch5 == true ? {} : {}),
            ...(this.switch6 == true ? {} : {}),
          },
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then((response: UsersResponseModel) => {
          if (response && response.result && response.result.length > 0) {
            this.users = this.users.concat(response.result)
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

  private async infiniteScrolling(entries: any) {
    if (!this.itemsEnd && entries[0].intersectionRatio > 0) {
      this.itemsCurrentPage = this.itemsCurrentPage + this.itemsPerPage
      await this.getAllUsers()
    }
  }

  private goToCourierPage(id: number) {
    this.$router.push({
      name: 'courier-id',
      params: { id: id ? id?.toString() : '' },
    })
  }

  private showErrorPage(error: string) {
    this.showError = true
    this.errorType = error
  }

  private get showErrorData() {
    return this.showError
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
    this.users = []
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
    this.getAllUsers()
  }

  private showAllResult() {
    this.users = []
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
    this.getAllUsers()
  }

  //search bar functions
  private doSearch() {
    this.isSearch = true
    this.users = []
    this.allDiscountCode = []
    this.itemsCurrentPage = 0
    this.getAllUsers()
  }
  private clearSearch() {
    if (!this.isSearch) {
      this.search = ''
      this.isSearch = false
    } else {
      this.search = ''
      this.users = []
      this.getAllUsers()
      this.isSearch = false
    }
  }
  private handleClick(e: any) {
    this.$router.push({
      name: 'user-id',
      params: { id: e.id ? e.id?.toString() : '' },
    })
  }
}
</script>

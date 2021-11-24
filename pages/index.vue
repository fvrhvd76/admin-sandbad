<template>
  <div class="py-8 px-4">
    <p class="mt-4">سلام، وقت بخیر</p>
    <h1>{{ generalModule.AdminName }}</h1>
    <v-row justify="center" class="py-4">
      <v-col md="4" lg="4" xl="2" xs="6" sm="6" cols="12">
        <DataCard
          :count="todayUsersCount"
          :title="'کاربران امروز'"
          :loading="todayUsersLoading"
        />
      </v-col>
      <v-col md="4" lg="4" xl="2" xs="6" sm="6" cols="12">
        <DataCard
          :count="todayCouriersCount"
          :title="'سفیران امروز'"
          :loading="todayCouriersLoading"
        />
      </v-col>
      <v-col md="4" lg="4" xl="2" xs="6" sm="6" cols="12">
        <DataCard
          :count="liveTransmissionsCount"
          :title="'سفر‌های در حال انجام امروز'"
          :loading="liveTransmissionsLoading"
        />
      </v-col>
      <v-col md="4" lg="4" xl="2" xs="6" sm="6" cols="12">
        <DataCard
          :count="onlineCouriersCount"
          :title="'سفیران آنلاین امروز'"
          :type="'online-couriers'"
          :loading="onlineCouriersLoading"
        />
      </v-col>
      <v-col md="4" lg="4" xl="2" xs="6" sm="6" cols="12">
        <DataCard
          :count="todayExportedfactorsCount"
          :title="'‎‎فاکتورهای صادر شده‏ ی امروز‎‌'"
          :loading="todayExportedfactorsLoading"
        />
      </v-col>
      <v-col md="4" lg="4" xl="2" xs="6" sm="6" cols="12">
        <DataCard
          :count="todayTransactionsCount"
          :title="'تراکنش‌های امروز'"
          :type="'transactions'"
          :loading="todayTransactionsLoading"
        />
      </v-col>
    </v-row>
    <v-card class="px-4 py-2">
      <v-row class="d-flex justify-center">
        <v-col cols="12" sm="6" md="6" lg="6" class="d-flex justify-start">
          <p class="font-weight-bold pt-4">
            از تاریخ {{ start_date | jalaliConvert }} تا تاریخ
            {{ end_date | jalaliConvert }}
          </p>
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="6" class="d-flex justify-end">
          <v-btn
            small
            fab
            class="ma-2"
            depressed
            color="primary"
            dark
            @click="FilterDialog = true"
          >
            <v-icon>mdi-tune</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="12" md="12" lg="12" sm="12">
          <apexchart
            :height="$vuetify.breakpoint.mdAndUp ? '700' : '400'"
            :options="chartOption"
            :series="series"
          ></apexchart>
        </v-col>
      </v-row>
    </v-card>
    <v-card class="my-8">
      <v-data-table
        @click:row="handleClick"
        :items="newUsers"
        :loader-height="0"
        hide-default-footer
        :items-per-page="10"
        :headers="usersHeader"
        :loading="usersLoading"
        class="elevation-1 mb-8 pointer"
      >
        <template v-slot:top>
          <v-toolbar style="cursor: auto" flat>
            <v-toolbar-title>کاربران جدید</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
        </template>

        <template v-slot:[`item.id`]="{ item }">
          <span>{{
            newUsers
              .map((x) => {
                return x.id
              })
              .indexOf(item.id) + 1
          }}</span>
        </template>
        <template v-slot:[`item.profile_picture`]="{ item }">
          <v-avatar size="50" class="my-2" color="grey lighten-2">
            <v-img
              v-if="item.profile_picture"
              :src="$axios.defaults.baseURL + item.profile_picture"
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
            <v-icon v-else>mdi-account</v-icon>
          </v-avatar>
        </template>
        <template v-slot:[`item.full_name`]="{ item }">
          {{ item.full_name ? item.full_name : '-' }}
        </template>
        <template v-slot:[`item.date_joined`]="{ item }">
          {{ item.date_joined | jalaliConvert }}
        </template>
        <template v-slot:[`item.role`]="{ item }">
          <v-chip small color="primary">خریدار</v-chip>
          <v-chip v-if="item.is_seller" small color="primary">فروشنده</v-chip>
          <v-chip v-if="item.is_sender" small color="primary">فرستنده</v-chip>
          <v-chip v-if="item.is_courier" small color="primary">سفیر</v-chip>
        </template>
        <template v-slot:no-data>
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
        <template v-slot:loading>
          <v-progress-circular
            size="60"
            color="primary"
            class="my-4"
            indeterminate
          />
        </template>
      </v-data-table>
    </v-card>
    <v-card>
      <v-data-table
        @click:row="handleClickFactor"
        :items="newFactors"
        :loader-height="0"
        hide-default-footer
        :items-per-page="10"
        class="elevation-1 mb-8 pointer"
        :headers="factorsHeader"
        :loading="factorsLoading"
      >
        <template v-slot:top>
          <v-toolbar style="cursor: auto" flat>
            <v-toolbar-title>آخرین فاکتور های صادر شده</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
        </template>

        <template v-slot:[`item.id`]="{ item }">
          <span>{{
            newFactors
              .map((x) => {
                return x.id
              })
              .indexOf(item.id) + 1
          }}</span>
        </template>
        <template v-slot:[`item.buyer`]="{ item }">
          {{ item.buyer && item.buyer.full_name ? item.buyer.full_name : '-' }}
        </template>
        <template v-slot:[`item.seller`]="{ item }">
          {{
            item.seller && item.seller.full_name ? item.seller.full_name : '-'
          }}
        </template>
        <template v-slot:[`item.date_created`]="{ item }">
          {{ item.date_created | jalaliConvert }}
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <v-chip color="primary" small>{{
            item.status | factorStatus
          }}</v-chip>
        </template>
        <template v-slot:[`item.final_price`]="{ item }">
          <span class="text-bold">{{
            item.final_price ? item.final_price.toLocaleString() : 0
          }}</span>
        </template>
        <template v-slot:no-data>
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
        <template v-slot:loading>
          <v-progress-circular
            size="60"
            color="primary"
            class="my-4"
            indeterminate
          />
        </template>
      </v-data-table>
    </v-card>
    <v-card class="px-4 py-2">
      <h3 class="ma-2">موقعیت سفیران</h3>
      <client-only>
        <l-map
          :zoom="zoom"
          :center="center"
          :style="
            $vuetify.breakpoint.xs
              ? 'diplay:flex; height:30em; width:100%'
              : 'diplay:flex; height:70em; width:100%'
          "
        >
          <l-tile-layer :url="url" :center="center" />
          <l-marker
            v-for="couriersLocation in couriersLocations"
            :key="couriersLocation.courier.id"
            @click="goToCourierPage(couriersLocation.courier.id)"
            :lat-lng="[couriersLocation.latitude, couriersLocation.longitude]"
            ><l-icon
              :icon-size="[20, 30]"
              :icon-url="
                couriersLocation.courier.vehicle_type === 'car'
                  ? '/icons/map/car.png'
                  : couriersLocation.courier.vehicle_type === 'truck'
                  ? '/icons/map/truck.png'
                  : couriersLocation.courier.vehicle_type === 'motorcycle'
                  ? '/icons/map/bike.png'
                  : '/icons/map/question.png'
              "
            ></l-icon
          ></l-marker>
        </l-map>
      </client-only>
    </v-card>
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
//@ts-ignore
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import { Component, Vue } from 'nuxt-property-decorator'
import { getModule } from 'vuex-module-decorators'

import GeneralModule from '~/store/general/index'
import { delay, jalaliConvert, factorStatus } from '~/helpers/functionality'
import { UserModel } from '~/models/api/user.model'
import { FactorModel } from '~/models/api/factor.model'
import { UsersResponseModel } from '~/models/api/response/users-response.model'
import { FactorsResponseModel } from '~/models/api/response/factors-response.model'
import { CourierLocationModel } from '~/models/api/courier-location.model'

import FilterModal from '~/components/modals/FilterModal.vue'
import VueApexCharts from 'vue-apexcharts'
import Snackbar from '~/components/common/Snackbar.vue'
import ErrorModal from '~/components/modals/ErrorModal.vue'
import DataCard from '~/components/common/DataCard.vue'

import { LMap, LTileLayer, LMarker, LIcon } from 'vue2-leaflet'
//@ts-ignore
import moment from 'moment-jalaali'
//@ts-ignore
import { Icon } from 'leaflet'

type D = Icon.Default & {
  _getIconUrl?: string
}

delete (Icon.Default.prototype as D)._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

@Component({
  components: {
    Snackbar,
    ErrorModal,
    DataCard,
    apexchart: VueApexCharts,
    FilterModal,
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
  },
  filters: { jalaliConvert, factorStatus },
})
export default class Index extends Vue {
  [x: string]: any

  private couriersLocations: CourierLocationModel[] = []

  private zoom = 15
  private center = [35.685117, 51.389472]

  private errorCallback(e: any) {
    if (e.code == 1) {
      this.generalModule.toggleSnackbar(true)
      this.generalModule.setSnackbarColor('error')
      this.generalModule.setSnackbarText(
        'شما امکان دریافت موقعیت فعلی را ندارید'
      )
    } else if (e.code == 2) {
      this.generalModule.toggleSnackbar(true)
      this.generalModule.setSnackbarColor('error')
      this.generalModule.setSnackbarText('موقعیت یاب شما در دسترس نیست.')
    } else {
      this.generalModule.toggleSnackbar(true)
      this.generalModule.setSnackbarColor('error')
      this.generalModule.setSnackbarText('خطا در دریافت موقعیت فعلی')
    }
  }
  private url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

  private generalModule = getModule(GeneralModule, this.$store)
  private todayUsersCount: number = 0
  private todayUsersLoading: boolean = false
  private todayCouriersCount: number = 0
  private todayCouriersLoading: boolean = false
  private liveTransmissionsCount: number = 0
  private liveTransmissionsLoading: boolean = false
  private onlineCouriersCount: number = 0
  private onlineCouriersLoading: boolean = false
  private todayExportedfactorsCount: number = 0
  private todayExportedfactorsLoading: boolean = false
  private todayTransactionsCount: number = 0
  private todayTransactionsLoading: boolean = false
  private newUsers: UserModel[] = []
  private usersLoading: boolean = false
  private xss: string[] = []

  //filter dialog variables
  private FilterDialog: boolean = false
  private filterMode: string = 'time'

  private target: string = 'commission'
  private usersHeader = [
    {
      text: 'ردیف',
      value: 'id',
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
      text: 'نام و نام خانوادگی',
      value: 'full_name',
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
      text: 'نقش',
      value: 'role',
      align: 'start',
      sortable: false,
    },
  ]
  private newFactors: FactorModel[] = []
  private factorsLoading: boolean = false
  private factorsHeader = [
    {
      text: 'ردیف',
      align: 'start',
      sortable: false,
      value: 'id',
    },
    {
      text: 'شماره فاکتور',
      align: 'start',
      sortable: false,
      value: 'factor_code',
    },
    {
      text: 'خریدار',
      align: 'start',
      sortable: false,
      value: 'buyer',
    },
    {
      text: 'فروشنده',
      align: 'start',
      sortable: false,
      value: 'seller',
    },
    { text: 'وضعیت', align: 'start', sortable: false, value: 'status' },
    {
      text: 'تاریخ ثبت سفارش',
      align: 'start',
      sortable: false,
      value: 'date_created',
    },
    {
      text: 'هزینه نهایی (تومان)',
      align: 'start',
      sortable: false,
      value: 'final_price',
    },
  ]
  private series: { name: string; data: number[] }[] = []
  private chartOption = {
    chart: {
      type: 'line',
      toolbar: {
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: false,
          reset: true,
        },
      },
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {},
    stroke: {},
    title: {},
    grid: {},
    xaxis: { categories: [], labels: {} },
  }

  private showError: boolean = false
  private errorType: string = ''

  private charMode: boolean = false

  private async mounted() {
    this.getTodaysNewUsers()
    this.getTodaysNewCouriers()
    this.getTodaysLiveTransmissions()
    this.getOnlineCouriers()
    this.getTodaysExportedFactors()
    this.geTodaysTransactions()
    this.getNewUsersList()
    this.getLastCreatedFactorsList()
    this.getCouriersLocations()
    await this.updateChart()
    await this.dateChanger()
    this.chartOption = {
      chart: {
        type: 'line',
        toolbar: {
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: false,
            reset: true,
          },
        },
        zoom: {
          enabled: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      xaxis: {
        //@ts-ignore
        categories: this.xss,
        labels: {
          show: true,
          rotate: 0,
          rotateAlways: false,
          hideOverlappingLabels: true,
          showDuplicates: false,
          trim: false,
          minHeight: 50,
          maxHeight: 50,
        },
      },
    }
  }

  private async getCouriersLocations() {
    try {
      this.todayCouriersLoading = true
      await this.$axios
        .$get(`/admins/locations/`, {
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then((response: CourierLocationModel) => {
          this.couriersLocations = this.couriersLocations.concat(response)
        })
    } catch (e: any) {
      // if (e.response.status === 404 || e.response.status === 500) {
      // this.showErrorPage(e.response.status);
      // } else {
      this.generalModule.toggleSnackbar(true)
      this.generalModule.setSnackbarColor('error')
      this.generalModule.setSnackbarText(e.response.data.detail)
      // }
    } finally {
      delay(500)
      this.todayCouriersLoading = false
    }
  }

  private async updateChart() {
    try {
      this.todayCouriersLoading = true
      await this.$axios
        .$get(`/admins/charts/`, {
          params: {
            target: this.target,
            start_date: this.start_date,
            end_date: this.end_date,
          },
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then(
          (response: {
            date: string[]
            commission: number[]
            amount: number[]
            done_tr: number[]
            cancel_tr: number[]
          }) => {
            return [
              (this.series = this.series.concat(
                {
                  name: 'کمیسیون (میلیون تومان)',
                  data: response.commission,
                },
                {
                  name: 'شارژ کیف پول (میلیون تومان)',
                  data: response.amount,
                },
                {
                  name: 'سفرهای انجام شده',
                  data: response.done_tr,
                },
                {
                  name: 'سفرهای لغو شده',
                  data: response.cancel_tr,
                }
              )),
              (this.xss = this.xss.concat(response.date)),
            ]
          }
        )
    } catch (e: any) {
      if (e.response.status === 404 || e.response.status === 500) {
        this.showErrorPage(e.response.status)
      } else {
        this.generalModule.toggleSnackbar(true)
        this.generalModule.setSnackbarColor('error')
        this.generalModule.setSnackbarText(e.response.data.detail)
      }
    } finally {
      delay(500)
      this.todayCouriersLoading = false
    }
  }

  private dateChanger() {
    for (let i = 0; i < this.xss.length; i++) {
      this.xss[i] = moment(this.xss[i]).format('jMM/jDD')
    }
  }

  private async getTodaysNewUsers() {
    try {
      this.todayUsersLoading = true
      await this.$axios
        .$get(`/admins/today-user-joined/`, {
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then((response: { count: number }) => {
          this.todayUsersCount = response.count
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
      this.todayUsersLoading = false
    }
  }

  private end_date: string = this.thisMonth
  private start_date: string = this.previousMouth

  private async getTodaysNewCouriers() {
    try {
      this.todayCouriersLoading = true
      await this.$axios
        .$get(`/admins/today-courier/`, {
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then((response: { count: number }) => {
          this.todayCouriersCount = response.count
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
      this.todayCouriersLoading = false
    }
  }

  private async getTodaysLiveTransmissions() {
    try {
      this.liveTransmissionsLoading = true
      await this.$axios
        .$get(`/admins/live-transmissions/`, {
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then((response: { count: number }) => {
          this.liveTransmissionsCount = response.count
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
      this.liveTransmissionsLoading = false
    }
  }

  private async getOnlineCouriers() {
    try {
      this.onlineCouriersLoading = true
      await this.$axios
        .$get(`/admins/online-couriers/`, {
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then((response: any) => {
          this.onlineCouriersCount = response
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
      this.onlineCouriersLoading = false
    }
  }

  private async getTodaysExportedFactors() {
    try {
      this.todayExportedfactorsLoading = true
      await this.$axios
        .$get(
          `${this.$axios.defaults.baseURL}/admins/today-exported-factors/`,
          {
            headers: {
              Authorization: this.$auth.getToken('local'),
              Accept: 'application/json; version=1.0;',
            },
          }
        )
        .then((response: { count: number }) => {
          this.todayExportedfactorsCount = response.count
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
      this.todayExportedfactorsLoading = false
    }
  }

  private async geTodaysTransactions() {
    try {
      this.todayTransactionsLoading = true
      await this.$axios
        .$get(`/admins/today-transactions/`, {
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then((response: any) => {
          this.todayTransactionsCount = response
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
      this.todayTransactionsLoading = false
    }
  }

  private async getNewUsersList() {
    try {
      this.usersLoading = true
      await this.$axios
        .$get(
          `${this.$axios.defaults.baseURL}/admins/users/?limit=10&offset=0&ordering=-date_joined`,
          {
            headers: {
              Authorization: this.$auth.getToken('local'),
              Accept: 'application/json; version=1.0;',
            },
          }
        )
        .then((response: UsersResponseModel) => {
          if (response && response.result) {
            this.newUsers = response.result
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
      this.usersLoading = false
    }
  }

  private async getLastCreatedFactorsList() {
    try {
      this.factorsLoading = true
      await this.$axios
        .$get(`/admins/factors/?limit=10&offset=0&ordering=-date_created`, {
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then((response: FactorsResponseModel) => {
          if (response && response.result) {
            this.newFactors = response.result
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
      this.factorsLoading = false
    }
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
  private filter(sort: number, start: string, end: string) {
    if (start === '' || end === '') {
      this.FilterDialog = false
    } else {
      this.itemsCurrentPage = 0
      this.series = []
      this.chartOption.xaxis.categories = []
      this.FilterDialog = false
      this.start_date = start
      this.end_date = end
      this.updateChart()
    }
  }
  private showAllResult() {
    this.series = []
    this.chartOption.xaxis.categories = []
    this.FilterDialog = false
    this.start_date = this.previousMouth
    this.end_date = this.thisMonth

    this.updateChart()
  }
  private get thisMonth() {
    const today = new Date()
    const date =
      today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
    this.todayDate = date
    return this.todayDate
  }
  private get previousMouth() {
    const today = new Date()
    const date =
      today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate()
    this.todayDate = date
    return this.todayDate
  }
  private goToCourierPage(id: number) {
    this.$router.push({
      name: 'courier-id',
      params: { id: id ? id?.toString() : '' },
    })
  }
  private get adminFullName() {
    let name = localStorage.getItem('first_name')
    let last_name = localStorage.getItem('last_name')
    let admin_full_name = name + ' ' + last_name
    admin_full_name = admin_full_name.replace(/null/g, '')
    if (admin_full_name === ' ') {
      return 'ادمین سند باد'
    } else {
      return admin_full_name
    }
  }
  private handleClick(e: any, type: string) {
    this.$router.push({
      name: 'user-id',
      params: { id: e.id ? e.id?.toString() : '' },
    })
  }
  private handleClickFactor(e: any, type: string) {
    this.$router.push({
      name: 'user-id',
      params: { id: e.seller.id ? e.seller.id?.toString() : '' },
    })
  }
}
</script>

<style lang="scss">
.apexcharts-toolbar {
  z-index: 1 !important;
}

.apexcharts-tooltip.apexcharts-theme-light {
  width: 200px;
  border-radius: 0%;
  .apexcharts-tooltip-title {
    background-color: rgba(83, 152, 255, 0.418) !important;
  }
  .apexcharts-tooltip-marker {
    margin-left: 5px;
    border-radius: 0% !important;
  }
  .apexcharts-legend-series {
    margin-right: 10% !important;
    .apexcharts-legend-marker {
      .element.style {
        margin: 0, 0, 0, 200px !important;
      }
    }
  }
}
.vue2leaflet-map.leaflet-container.leaflet-touch.leaflet-fade-anim.leaflet-grab.leaflet-touch-drag.leaflet-touch-zoom {
  z-index: 0 !important;
}
</style>

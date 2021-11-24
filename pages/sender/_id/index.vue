<template>
  <div class="full-height py-8 px-16 sender">
    <v-card min-height="100%" outlined class="rounded pa-4">
      <div>
        <div class="mb-2 font-weight-black primary--text">اطلاعات فرستنده</div>
        <v-divider></v-divider>
        <div class="d-flex flex-row justify-start align-center">
          <v-row>
            <v-col class="mb-2 d-flex align-center justify-start" cols="12">
              <p class="mt-2">وضعیت:</p>
              <v-switch
                @change="senderStatus"
                class="mr-2 mt-3"
                :label="!senderDetail.is_banned ? 'عادی' : 'مسدود'"
                color="error"
                v-model="senderDetail.is_banned"
              ></v-switch>
            </v-col>
            <v-col cols="12">
              <div class="mb-2 font-weight-black primary--text">
                آدرس های منتخب
              </div>
              <v-divider></v-divider>
              <v-row justify="center" class="ma-0">
                <v-col
                  v-for="location in senderLocationDetail"
                  :key="location.id"
                  md="12"
                  lg="12"
                  sm="12"
                  cols="12"
                >
                  <v-card elevation="0" outlined class="px-4 py-4">
                    <div
                      class="
                        d-flex
                        justify-space-between
                        mb-2
                        text-bold
                        primary--text
                      "
                    >
                      <p>{{ location.title }}</p>
                      <p>شناسه: {{ location.id }}</p>
                    </div>
                    <v-divider />
                    <div class="my-2">
                      {{ location.address }}
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12">
              <div class="mb-2 font-weight-bold primary--text">
                تاریخچه سفرها
              </div>
              <v-divider class="my-4" />
              <v-data-table
                :items="transmission"
                :loader-height="0"
                hide-default-footer
                :headers="transmissionHeader"
                :loading="loading"
                class="elevation-0 mb-8"
                disable-pagination
              >
                <template #[`item.num`]="{ item }">
                  <span> {{ transmission.indexOf(item) + 1 }}</span>
                </template>
                <template #[`item.sender_name`]="{ item }">
                  <span>{{ item.sender_name ? item.sender_name : '-' }}</span>
                </template>
                <template #[`item.date`]="{ item }">
                  <span>{{ item.date | jalaliConvertWithTime }}</span>
                </template>
                <template #[`item.final_price`]="{ item }">
                  <span>{{
                    item.final_price ? item.final_price.toLocaleString() : '-'
                  }}</span>
                </template>
                <template #[`item.sender_location`]="{ item }">
                  <span :title="item.sender_location" v-if="!more[item.id]">
                    {{ item.sender_location.substring(0, 20) }}</span
                  >
                  <span
                    class="moretext"
                    v-if="item.sender_location.length > 20 && !more[item.id]"
                    @click="fillMore(item.id)"
                  >
                    ...</span
                  >
                  <span v-if="more[item.id]">{{ item.sender_location }}</span>
                </template>
                <template #[`item.status`]="{ item }">
                  <v-chip
                    small
                    color="error"
                    class="white--text font-weight-black"
                    v-if="item.status === 'canceled'"
                  >
                    لغو شده
                  </v-chip>
                  <v-chip
                    small
                    color="success"
                    class="white--text font-weight-black"
                    v-else-if="item.status === 'done'"
                  >
                    دریافت شده
                  </v-chip>
                  <v-chip
                    small
                    color="primary"
                    class="white--text font-weight-black"
                    v-else-if="item.status === 'ready'"
                  >
                    آماده
                  </v-chip>
                  <v-chip
                    small
                    color="primary"
                    class="white--text font-weight-black"
                    v-else-if="item.status === 'searching'"
                  >
                    در حال جستوجو
                  </v-chip>
                  <v-chip
                    small
                    color="primary"
                    class="white--text font-weight-black"
                    v-else-if="item.status === 'delivered'"
                  >
                    دریافت شده
                  </v-chip>
                  <v-chip
                    small
                    color="primary"
                    class="white--text font-weight-black"
                    v-else-if="item.status === 'accepted'"
                  >
                    دریافت سفیر
                  </v-chip>
                  <v-chip
                    small
                    color="primary"
                    class="white--text font-weight-black"
                    v-else-if="item.status === 'removed'"
                  >
                    حذف شده
                  </v-chip>
                  <v-chip
                    small
                    color="primary"
                    class="white--text font-weight-black"
                    v-else
                  >
                    نامشخص
                  </v-chip>
                </template>
                <template #[`body.append`]>
                  <div
                    v-if="transmission.length > 0"
                    v-intersect.quiet="infiniteScrollingTransmission"
                  ></div>
                </template>
                <template #no-data>
                  <div
                    class="d-flex flex-column justify-center align-center my-4"
                  >
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
            </v-col>
          </v-row>
        </div>
      </div>
    </v-card>
    <Snackbar />
    <ErrorModal :dialog="showErrorData" :errorType="errorType" />
  </div>
</template>

<script lang="ts">
import GeneralModule from '~/store/general/index'
import { getModule } from 'vuex-module-decorators'

import { Vue, Component, Watch } from 'vue-property-decorator'

import { TransmissionModel } from '~/models/api/transmission.model'
import { SenderLocationModel } from '~/models/api/sender-locations.model'

import { TransmissionResponseModel } from '~/models/api/response/transmission-response.model'

import DataCard from '~/components/common/DataCard.vue'
import MessageDialog from '~/components/modals/MessageModal.vue'
import Snackbar from '~/components/common/Snackbar.vue'
import ErrorModal from '~/components/modals/ErrorModal.vue'
import Uploader from '~/components/common/Uploader.vue'

import {
  jalaliConvert,
  jalaliConvertWithTime,
  delay,
} from '~/helpers/functionality'
import { SenderModel } from '~/models/api/sender.model'

@Component({
  middleware: ['permission'],
  components: {
    DataCard,
    MessageDialog,
    Snackbar,
    ErrorModal,
    Uploader,
  },
  filters: { jalaliConvert, jalaliConvertWithTime },
})
export default class Index extends Vue {
  [x: string]: any
  private generalModule = getModule(GeneralModule, this.$store)

  //sender info
  private transmission: TransmissionModel[] = []
  private loading: boolean = false
  private itemsCurrentPage: number = 0
  private itemsPerPage: number = 25
  private itemsEnd: boolean = false
  private senderDetail: SenderModel = {}
  private more: boolean[] = []
  private errorType: string = ''
  private transmissionHeader = [
    {
      text: 'ردیف',
      value: 'num',
      align: 'start',
      sortable: false,
    },
    {
      text: 'کد سفر',
      value: 'id',
      align: 'start',
      sortable: false,
    },
    {
      text: 'تاریخ سفر',
      value: 'date',
      align: 'start',
      sortable: false,
    },
    {
      text: ' نام سفیر',
      value: 'courier_name',
      align: 'start',
      sortable: false,
    },
    {
      text: 'مبدا سفر',
      value: 'sender_location',
      align: 'start',
      sortable: false,
    },
    {
      text: 'تعداد مقصد ',
      value: 'destination_count',
      align: 'start',
      sortable: false,
    },
    {
      text: 'مبلغ(تومان) ',
      value: 'final_price',
      align: 'start',
      sortable: false,
    },
    {
      text: 'وضعیت سفر',
      value: 'status',
      align: 'start',
      sortable: false,
    },
  ]
  private senderLocationDetail: SenderLocationModel[] = []
  private mounted() {
    this.getSenderData()
    this.getSenderLocationsDetail()
    this.getTransmissionDetail()
  }

  private async senderStatus() {
    let data = new FormData()
    //@ts-ignore
    data.append('is_banned', this.senderDetail.is_banned)
    await this.$axios
      .put(`/admins/senders/${this.$route.params.id}/`, data, {
        headers: {
          Authorization: this.$auth.getToken('local'),
          Accept: 'application/json; version=1.0;',
        },
      })
      .then((res: any) => {
        this.generalModule.toggleSnackbar(true)
        this.generalModule.setSnackbarColor('success')
        this.generalModule.setSnackbarText('وضعیت کاربر با موفقیت تغییر یافت')
      })
      .catch((e: any) => {
        this.generalModule.toggleSnackbar(true)
        this.generalModule.setSnackbarColor('error')
        this.generalModule.setSnackbarText(e.response.data.detail)
      })
  }

  private async getSenderData() {
    try {
      this.loading = true
      await this.$axios
        .$get(`/admins/senders/${this.$route.params.id}/`, {
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then((response: any) => {
          this.senderDetail = response
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

  private async getTransmissionDetail() {
    try {
      this.loading = true
      await this.$axios
        .$get(`/admins/send-order/`, {
          params: {
            limit: this.itemsPerPage,
            offset: this.itemsCurrentPage,
            sender_id: this.$route.params.id,
          },
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then((response: TransmissionResponseModel) => {
          if (response.result) {
            this.transmission = this.transmission.concat(response.result)
            if (response.next === null) {
              this.itemsEnd = true
            }
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
  private async getSenderLocationsDetail() {
    try {
      this.loading = true
      await this.$axios
        .$get(`admins/starred-locations/?user_id=${this.$route.params.id}`, {
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then((response: SenderLocationModel) => {
          this.senderLocationDetail = this.senderLocationDetail.concat(response)
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

  private async infiniteScrollingTransmission(entries: any, value: number) {
    if (!this.itemsEnd && entries[0].intersectionRatio > 0) {
      this.itemsCurrentPage = this.itemsCurrentPage + this.itemsPerPage
      await this.getTransmissionDetail()
    }
  }
  private fillMore(v: number) {
    for (let index = 0; index < this.transmission.length; index++) {
      this.more = new Array(index).fill(false)
    }
    this.more[v] = true
    return this.more
  }
  //error page
  private showErrorPage(error: string) {
    this.showError = true
    this.errorType = error
  }
  private get showErrorData() {
    return this.showError
  }

  private async getTransmissionDetails(id: number) {
    try {
      this.loading = true
      await this.$axios
        .$get(`${this.$axios.defaults.baseURL}/admins/send-order/${id}/`, {
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then((response: any) => {
          this.senderTransmissionDetails = response
          if (response.receiver_location) {
            this.receiverLocations = this.receiverLocations.concat(
              response.receiver_location
            )
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
}
</script>

<style scoped lang="scss">
.moretext {
  cursor: pointer;
}
.sender {
  .v-input--switch {
    &.v-input--selection-controls {
      margin-top: 0;
      padding-top: 0;
    }
    & .theme--light .v-input--switch--inset {
      .v-input--switch__track {
        color: '#4caf50' !important;
        opacity: 1 !important;
        border-radius: 7px;
      }
      .v-input--switch__thumb {
        border-radius: 7px;
      }
      &.v-input--is-dirty {
        .v-input--switch__track {
          color: '#ff5252' !important;
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
.theme--light.v-input--switch .v-input--switch__track {
  color: #4caf50;
}
</style>

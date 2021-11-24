<template>
  <div class="px-4 py-8">
    <v-row class="ma-0" justify="center">
      <v-col
        cols="12"
        lg="8"
        xl="6"
        style="border: 1px solid #e8e8e8; background-color: white"
        class="rounded-10"
      >
        <v-form ref="form" class="pa-4 full-width">
          <v-row class="ma-0">
            <v-col cols="12" class="font-20"
              >ویرایش دسته کد جدید باشگاه مشتریان</v-col
            >
            <v-col cols="12" class="text-center">
              <v-btn
                fab
                outlined
                color="primary"
                @click="upload"
                v-if="!imageUrl"
                style="width: 100px; height: 100px"
                ><v-icon large>mdi-camera</v-icon></v-btn
              >
              <div
                class="d-flex flex-column justify-center align-center"
                v-else
              >
                <v-hover v-slot="{ hover }">
                  <v-avatar size="100" class="mb-4">
                    <v-img :src="imageUrl" @click="upload">
                      <template v-slot:placeholder>
                        <v-row
                          class="full-height ma-0"
                          align="center"
                          justify="center"
                        >
                          <v-progress-circular
                            indeterminate
                            color="primary"
                          ></v-progress-circular>
                        </v-row>
                      </template>
                      <v-expand-transition>
                        <v-overlay
                          absolute
                          v-if="hover"
                          class="
                            d-flex
                            transition-fast-in-fast-out
                            v-card--reveal
                          "
                        >
                          <v-icon color="white">mdi-pencil</v-icon>
                        </v-overlay>
                      </v-expand-transition>
                    </v-img>
                  </v-avatar>
                </v-hover>
              </div>
            </v-col>
            <v-col cols="12" md="4" lg="4" xl="4">
              <v-text-field
                dense
                outlined
                label="عنوان"
                color="primary"
                v-model="discountCategory.title"
                autocomplete="off"
                :rules="[(v) => !!v || 'عنوان الزامی است']"
              />
            </v-col>
            <v-col cols="12" md="4" lg="4" xl="4">
              <v-select
                dense
                outlined
                hide-details
                v-model="typeDiscount"
                :menu-props="{ offsetY: true }"
                color="primary"
                item-text="name"
                item-value="value"
                :items="typeDiscountList"
                item-color="primary"
                label="نوع تخفیف"
              />
            </v-col>
            <v-col cols="12" md="4" lg="4" xl="4">
              <v-select
                dense
                outlined
                hide-details
                v-model="discountCategory.audience"
                :menu-props="{ offsetY: true }"
                color="primary"
                item-text="name"
                item-value="value"
                :items="targetList"
                item-color="primary"
                label="مخاطب دسته"
              />
            </v-col>
            <v-col cols="12" md="4" lg="4" xl="4">
              <v-text-field
                dense
                outlined
                label="مبلغ تخفیف"
                @keypress="onlyNumber"
                color="primary"
                v-model="discountCategory.discount_amount"
                autocomplete="off"
                :disabled="
                  !typeDiscount || discountCategory.discount_percent !== ''
                "
                :rules="[(v) => !!v || 'مبلغ یا درصد تخفیف الزامی است']"
              />
            </v-col>
            <v-col cols="12" md="4" lg="4" xl="4">
              <v-text-field
                dense
                outlined
                @keypress="onlyNumber"
                label="درصد تخفیف"
                maxLength="2"
                color="primary"
                :disabled="
                  !typeDiscount || discountCategory.discount_amount !== ''
                "
                v-model="discountCategory.discount_percent"
                append-icon="mdi-percent"
                autocomplete="off"
                :rules="[(v) => !!v || 'مبلغ یا درصد تخفیف الزامی است']"
              />
            </v-col>
            <v-col cols="12" md="4" lg="4" xl="4">
              <v-text-field
                dense
                outlined
                @keypress="onlyNumber"
                label="امتیاز"
                color="primary"
                v-model="discountCategory.coins"
                autocomplete="off"
                :rules="[(v) => !!v || 'امتیاز زا وارد کنید']"
              />
            </v-col>
            <v-col cols="12" md="6" lg="6" xl="6">
              <v-select
                dense
                outlined
                hide-details
                v-model="discountCategory.is_active"
                :menu-props="{ offsetY: true }"
                color="primary"
                item-text="name"
                item-value="value"
                :items="statusList"
                item-color="primary"
                label="وضعیت انتشار"
              />
            </v-col>
            <v-col cols="12" md="6" lg="6" xl="6">
              <v-text-field
                dense
                outlined
                label="تعداد"
                color="primary"
                v-model="discountCategory.limit"
                autocomplete="off"
              />
            </v-col>
            <v-col cols="12" md="3" lg="3" xl="3">
              <v-text-field
                label="از تاریخ"
                :value="discountCategory.start_date | jalaliConvertWithTime"
                id="FirstdatePicker"
                outlined
                color="primary"
                dense
                readonly
              />
              <date-picker
                v-model="discountCategory.start_date"
                format="YYYY-MM-DD"
                element="FirstdatePicker"
                display-format="jYYYY/jMM/jDD"
                color="#F48C3A"
                auto-submit
              />
            </v-col>
            <v-col cols="12" md="3" lg="3" xl="3">
              <v-text-field
                label="تا تاریخ"
                :value="discountCategory.end_date | jalaliConvertWithTime"
                id="datePickerSecond"
                outlined
                color="primary"
                dense
                readonly
              />

              <date-picker
                v-model="discountCategory.end_date"
                format="YYYY-MM-DD"
                element="datePickerSecond"
                display-format="jYYYY/jMM/jDD"
                color="#F48C3A"
                auto-submit
              />
            </v-col>
            <v-col cols="12" md="3" lg="3" xl="3">
              <v-select
                dense
                outlined
                hide-details
                v-model="discountCategory.is_internal"
                :menu-props="{ offsetY: true }"
                color="primary"
                item-text="name"
                item-value="value"
                :items="internalList"
                item-color="primary"
                label="داخلی/خارجی"
              />
            </v-col>
            <v-col cols="12" md="3" lg="3" xl="3">
              <v-select
                dense
                outlined
                hide-details
                v-model="discountCategory.is_general"
                :menu-props="{ offsetY: true }"
                color="primary"
                item-text="name"
                item-value="value"
                :items="generalList"
                item-color="primary"
                label="عمومی/جزئی"
              />
            </v-col>
            <v-col cols="12" md="12" lg="12" xl="12">
              <v-textarea
                outlined
                auto-grow
                v-model="discountCategory.description"
                label="توضیحات دسته را وارد کنید..."
              />
            </v-col>
            <v-row class="px-4 mt-4" justify="end" align="center">
              <v-btn
                depressed
                color="primary"
                :loading="loading"
                @click="editCategory"
                :disabled="formValidation"
              >
                ویرایش
              </v-btn>
            </v-row>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
    <FilterModal
      :dialog="FilterDialog"
      :mode="filterMode"
      @closeDialog="closeFilterDialog"
      @confirm="filter"
      @allResult="showAllResult"
    />
    <Uploader
      :open.sync="openUploader"
      @uploadFinish="uploadFinish"
      :type="'avatar'"
    />
    <Snackbar />
    <ErrorModal :dialog="showErrorData" :errorType="errorType" />
  </div>
</template>

<script lang="ts">
import GeneralModule from '~/store/general/index'
import { getModule } from 'vuex-module-decorators'

import { Component, Vue } from 'nuxt-property-decorator'

import { CategoryModel } from '~/models/api/category.model'

import VuePersianDatetimePicker from "vue-persian-datetime-picker";
import FilterModal from '~/components/modals/FilterModal.vue'
import Uploader from '~/components/common/Uploader.vue'
import ErrorModal from '~/components/modals/ErrorModal.vue'
import Snackbar from '~/components/common/Snackbar.vue'

import {
  jalaliConvert,
  delay,
  jalaliConvertWithTime,
} from '~/helpers/functionality'

@Component({
  middleware: ['permission'],
  components: {
    FilterModal,
    ErrorModal,
    Uploader,
    Snackbar,
    datePicker:VuePersianDatetimePicker,
  },
  filters: {
    jalaliConvert,
    jalaliConvertWithTime,
  },
})
export default class index extends Vue {
  [x: string]: any
  private generalModule = getModule(GeneralModule, this.$store)

  private discountCategory: CategoryModel = {}

  //inputs and v-select
  private category: CategoryModel = {}
  private typeDiscountList = [
    { name: 'کد تخفیف', value: true },
    { name: 'محصول', value: false },
  ]
  private targetList = [
    { name: 'همه', value: 'all' },
    { name: 'فرستنده', value: 'sender' },
    { name: 'سفیر', value: 'courier' },
    { name: 'خریدار', value: 'buyer' },
    { name: 'فروشنده', value: 'seller' },
  ]
  private statusList = [
    { name: 'فعال', value: true },
    { name: 'غیرفعال', value: false },
  ]
  private internalList = [
    { name: 'داخلی', value: true },
    { name: 'غیرداخلی', value: false },
  ]
  private is_limitList = [
    { name: 'محدود', value: false },
    { name: 'نامحدود', value: true },
  ]
  private generalList = [
    { name: 'عمومی', value: true },
    { name: 'جزئی', value: false },
  ]
  private typeDiscount: boolean = true
  private is_limit: boolean = true
  //uploader
  private openUploader: boolean = false
  private imageSrc = ''
  private imageUrl = ''

  //filter dialog variables
  private FilterDialog: boolean = false
  private filterMode: string = 'time'
  private startDate: string = ''
  private endDate: string = ''

  //main request variables
  private loading: boolean = false
  private showError: boolean = false
  private errorType: string = ''

  //error functions
  private get showErrorData() {
    return this.showError
  }
  private showErrorPage(error: string) {
    this.showError = true
    this.errorType = error
  }
  //current date
  private get currentDate() {
    const today = new Date()
    const date =
      today.getFullYear() +
      '-' +
      (today.getMonth() + 1) +
      '-' +
      (today.getDate() + 1)
    this.todayDate = date
    return this.todayDate
  }

  private get startTimeData() {
    return this.startTime ? jalaliConvert(this.startTime) : this.startTime
  }
  private get endTimeData() {
    return this.endTime ? jalaliConvert(this.endTime) : this.endTime
  }
  private get startIsEmpty() {
    return this.startTime === ''
  }

  //filter dialog functions
  private closeFilterDialog() {
    this.FilterDialog = false
  }
  private filter(start: string, end: string) {
    if (start === '' || end === '') {
      this.FilterDialog = false
    } else {
      this.FilterDialog = false
      this.startDate = start
      this.endDate = end
    }
  }
  private showAllResult() {
    if (this.startDate === '') {
      this.FilterDialog = false
    } else {
      this.senders = []
      this.FilterDialog = false
      this.startDate = ''
      this.endDate = ''
    }
  }

  //uploader
  private upload() {
    if (this.openUploader) {
      this.openUploader = false
      this.$nextTick(() => {
        this.openUploader = true
      })
    } else {
      this.openUploader = !this.openUploader
    }
  }
  private uploadFinish(file: any) {
    this.imageSrc = file
    this.imageUrl = URL.createObjectURL(file)
    this.openUploader = false
  }

  //lifecycles
  private async mounted() {
    this.getCategoryDetail()
  }

  //GET request
  private async getCategoryDetail() {
    try {
      this.loading = true
      await this.$axios
        .$get(`/admins/discount-code/category/${this.$route.params.id}/`, {
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then((response: CategoryModel) => {
          this.discountCategory = response
          //@ts-ignore
          this.startDate = response.start_date
          //@ts-ignore
          this.endDate = response.end_date
          //@ts-ignore
          this.imageUrl = response.picture
            ? this.$axios.defaults.baseURL + response.picture
            : ''
        })
    } catch {
    } finally {
      this.loading = false
    }
  }

  //PUT request
  private async editCategory() {
    try {
      this.loading = true
      let formData = new FormData()
      if (this.imageSrc) {
        formData.append('picture', this.imageSrc)
      }
      //@ts-ignore
      formData.append('title', this.discountCategory.title)
      //@ts-ignore
      formData.append('description', this.discountCategory.description)
      //@ts-ignore
      formData.append(
        'discount_percent',
        //@ts-ignore
        this.typeDiscount
          ? '100'
          : this.discountCategory.discount_amount
          ? this.discountCategory.discount_amount
          : this.discountCategory.discount_percent
      )
      //@ts-ignore
      formData.append('start_date', this.discountCategory.start_date)
      //@ts-ignore
      formData.append('end_date', this.discountCategory.end_date)
      //@ts-ignore
      formData.append('is_active', this.discountCategory.is_active)
      //@ts-ignore
      formData.append('is_general', this.discountCategory.is_general)
      //@ts-ignore
      formData.append('is_internal', this.discountCategory.is_internal)
      if (this.discountCategory.limit) {
        //@ts-ignore
        formData.append('limit', this.discountCategory.limit)
      }
      //@ts-ignore
      formData.append('has_limit', this.discountCategory.limit ? true : false)
      //@ts-ignore
      formData.append('is_internal', this.discountCategory.is_internal)
      //@ts-ignore
      formData.append('coins', this.discountCategory.coins)
      await this.$axios
        .$put(
          `/admins/discount-code/category/${this.$route.params.id}/`,
          formData,
          {
            headers: {
              Authorization: this.$auth.getToken('local'),
              Accept: 'application/json; version=1.0;',
            },
          }
        )
        .then(() => {
          this.generalModule.toggleSnackbar(true)
          this.generalModule.setSnackbarColor('success')
          this.generalModule.setSnackbarText('اطلاعات با موفقیت ویرایش شد')
          this.$router.push({ name: 'customerclub-list' })
        })
    } catch (e: any) {
      if (e.response.status === 404 || e.response.status === 500) {
        this.showErrorPage(e.response.status)
      } else {
        this.generalModule.toggleSnackbar(true)
        this.generalModule.setSnackbarColor('error')
        this.generalModule.setSnackbarText('اطلاعات وارد شده را بررسی کنید')
      }
    } finally {
      await delay(500)
      this.loading = false
    }
  }

  //validation
  /* private get formValidation() {
    if (
      !this.discountCategory.title ||
      !this.discountCategory.audience ||
      !this.discountCategory.coins ||
      !this.discountCategory.is_active ||
      !this.discountCategory.is_internal ||
      !this.discountCategory.is_general ||
      !this.discountCategory.limit
    ) {
      return true;
    } else if (
      this.typeDiscount &&
      !this.discountCategory.discount_amount &&
      !this.discountCategory.discount_percent
    ) {
      return true;
    } else {
      return false;
    }
  } */

  private get dateValue() {
    let start = this.startDate ? jalaliConvert(this.startDate) : ''
    let end = this.endDate ? jalaliConvert(this.endDate) : ''
    let value = this.endDate ? start + ' ' + ' تا ' + ' ' + end : ''
    return value
  }
  private onlyNumber($event: any) {
    let keyCode = $event.keyCode ? $event.keyCode : $event.which
    if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
      $event.preventDefault()
    }
  }

  private addToArray(v: string, i: number) {
    if (v.length === 6) {
      i += 1

      this.codes[i] = { discount_code: '' }
    }
  }
}
</script>

<style scoped lang="scss">
.full-height {
  height: 100%;
}
</style>

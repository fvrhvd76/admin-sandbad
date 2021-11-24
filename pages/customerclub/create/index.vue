<template>
  <div class="full-height py-8 px-4">
    <v-card min-height="100%">
    <v-row class="ma-0" justify="center">
      <v-col
        cols="12"
      >
        <v-form ref="form" class="pa-4 full-width">
          <v-row class="ma-0">
            <v-col cols="12" class="font-20"
              >ساخت دسته کد جدید باشگاه مشتریان</v-col
            >
            <v-col cols="12" class="text-center">
              <v-btn
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
                  <v-avatar tile size="100" class="mb-4">
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
                          class="d-flex transition-fast-in-fast-out v-card--reveal"
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
                v-model="category.title"
                autocomplete="off"
                :rules="[v => !!v || 'عنوان الزامی است']"
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
                v-model="category.audience"
                :menu-props="{ offsetY: true }"
                color="primary"
                item-text="name"
                item-value="value"
                :items="targetList"
                item-color="primary"
                label="مخاطب دسته"
                :rules="[v => !!v || 'کاربر هدف خود را انتخاب کنید']"
              />
            </v-col>
            <v-col cols="12" md="4" lg="4" xl="4">
              <v-text-field
                dense
                outlined
                label="مبلغ تخفیف"
                @keypress="onlyNumber"
                color="primary"
                v-model="category.discount_amount"
                autocomplete="off"
                :disabled="
                  !typeDiscount ||
                    (category.discount_percent !== undefined &&
                      category.discount_percent !== '')
                "
                :rules="[v => !!v || 'مبلغ یا درصد تخفیف را وارد کنید']"
              />
            </v-col>
            <v-col cols="12" md="4" lg="4" xl="4">
              <v-text-field
                dense
                outlined
                @keypress="onlyNumber"
                label="درصد تخفیف"
                color="primary"
                :disabled="
                  !typeDiscount ||
                    (category.discount_amount !== undefined &&
                      category.discount_amount !== '')
                "
                v-model="category.discount_percent"
                autocomplete="off"
                :rules="[v => !!v || 'مبلغ یا درصد تخفیف را وارد کنید']"
              />
            </v-col>
            <v-col cols="12" md="4" lg="4" xl="4">
              <v-text-field
                dense
                outlined
                @keypress="onlyNumber"
                label="امتیاز"
                color="primary"
                v-model="category.coins"
                autocomplete="off"
                :rules="[v => !!v || 'امتیاز مورد نیاز را وارد کنید']"
              />
            </v-col>
            <v-col cols="12" md="4" lg="4" xl="4">
              <v-select
                dense
                outlined
                hide-details
                v-model="category.is_active"
                :menu-props="{ offsetY: true }"
                color="primary"
                item-text="name"
                item-value="value"
                :items="statusList"
                item-color="primary"
                label="وضعیت انتشار"
                :rules="[v => !!v || 'وضعیت را وارد کنید']"
              />
            </v-col>
            <v-col cols="12" md="4" lg="4" xl="4">
              <v-select
                dense
                outlined
                hide-details
                v-model="is_limit"
                :menu-props="{ offsetY: true }"
                color="primary"
                item-text="name"
                item-value="value"
                :items="is_limitList"
                item-color="primary"
                label="محدود/نامحدود"
              />
            </v-col>
            <v-col cols="12" md="4" lg="4" xl="4">
              <v-text-field
                dense
                outlined
                label="تعداد"
                color="primary"
                v-model="category.limit"
                autocomplete="off"
                :disabled="is_limit"
                :rules="[v => !!v || 'تعداد محدودیت کد خود را تعیین کنید']"
              />
            </v-col>
            <v-col cols="12" md="3" lg="3" xl="3">
              <v-text-field
                label="از تاریخ"
                :value="startTimeData"
                id="FirstdatePicker"
                outlined
                color="primary"
                dense
                readonly
              />
              <date-picker
                v-model="startTime"
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
                :value="endTimeData"
                id="datePickerSecond"
                outlined
                color="primary"
                dense
                :disabled="startIsEmpty"
                readonly
              />

              <date-picker
                v-model="endTime"
                format="YYYY-MM-DD"
                element="datePickerSecond"
                display-format="jYYYY/jMM/jDD"
                color="#F48C3A"
                :disabled="startIsEmpty"
                auto-submit
              />
            </v-col>
            <v-col cols="12" md="3" lg="3" xl="3">
              <v-select
                dense
                outlined
                hide-details
                v-model="category.is_internal"
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
                v-model="category.is_general"
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
                dense
                outlined
                label="توضیحات"
                auto-grow
                color="primary"
                v-model="category.description"
                autocomplete="off"
              />
            </v-col>
            <v-col cols="12" sm="12" md="12" lg="12">
              وارد کردن دستی کد
              <v-divider />
            </v-col>
            <v-col cols="12" sm="12" md="12" lg="12">
              <v-row>
                <v-col cols="12" sm="6" md="6" lg="6"
                  ><div @click="manualAdd = true">
                    <v-text-field
                      dense
                      outlined
                      label="کد تخفیف"
                      color="primary"
                      v-model="category.discount_code"
                      autocomplete="off"
                      autofocus
                      :disabled="!manualAdd"
                    />
                  </div>
                </v-col>
                <v-col
                  @click="manualAdd = false"
                  cols="12"
                  sm="6"
                  md="6"
                  lg="6"
                >
                  <v-file-input
                    :disabled="manualAdd"
                    outlined
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    dense
                    label="فایل اکسل را وارد کنید..."
                    v-model="excelFile"
                  >
                  </v-file-input
                ></v-col>
              </v-row>
            </v-col>
            <v-row class=" px-4 mt-4" justify="end" align="center">
              <v-btn
                depressed
                color="primary"
                :loading="loading"
                @click="createNewCategory"
                :disabled="formValidation"
              >
                ایجاد دسته جدید
              </v-btn>
            </v-row>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
    </v-card>
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
import GeneralModule from "~/store/general/index";
import { getModule } from "vuex-module-decorators";

import VuePersianDatetimePicker from "vue-persian-datetime-picker";
import { Component, Vue } from "nuxt-property-decorator";

import { CategoryModel } from "~/models/api/category.model";

import FilterModal from "~/components/modals/FilterModal.vue";
import Uploader from "~/components/common/Uploader.vue";
import ErrorModal from "~/components/modals/ErrorModal.vue";
import Snackbar from "~/components/common/Snackbar.vue";

import {
  jalaliConvert,
  delay,
  jalaliConvertWithTime
} from "~/helpers/functionality";

@Component({
  middleware: ["permission"],
  components: {
    datePicker: VuePersianDatetimePicker,
    ErrorModal,
    Uploader,
    Snackbar
  },
  filters: {
    jalaliConvert,
    jalaliConvertWithTime
  }
})
export default class index extends Vue {
  [x: string]: any;
  private generalModule = getModule(GeneralModule, this.$store);
  private excelFile: any = null;
  private manualAdd: boolean = false;
  private startTime: string = "";
  private endTime: string = "";

  //current date
  private get currentDate() {
    const today = new Date();
    const date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      (today.getDate() + 1);
    this.todayDate = date;
    return this.todayDate;
  }

  private get startTimeData() {
    return this.startTime ? jalaliConvert(this.startTime) : this.startTime;
  }
  private get endTimeData() {
    return this.endTime ? jalaliConvert(this.endTime) : this.endTime;
  }
  private get startIsEmpty() {
    return this.startTime === "";
  }

  //inputs and v-select
  private uploader(excelFile: string) {
    if (excelFile) {
    }
  }

  private category: CategoryModel = {};
  private typeDiscountList = [
    { name: "کد تخفیف", value: true },
    { name: "محصول", value: false }
  ];
  private targetList = [
    { name: "همه", value: "all" },
    { name: "فرستنده", value: "sender" },
    { name: "سفیر", value: "courier" },
    { name: "خریدار", value: "buyer" },
    { name: "فروشنده", value: "seller" }
  ];
  private statusList = [
    { name: "فعال", value: true },
    { name: "غیرفعال", value: false }
  ];
  private internalList = [
    { name: "داخلی", value: true },
    { name: "غیرداخلی", value: false }
  ];
  private is_limitList = [
    { name: "محدود", value: false },
    { name: "نامحدود", value: true }
  ];
  private generalList = [
    { name: "عمومی", value: true },
    { name: "جزئی", value: false }
  ];
  private typeDiscount: boolean = true;
  private is_limit: boolean = true;
  //uploader
  private openUploader: boolean = false;
  private imageSrc = "";
  private imageUrl = "";

  //main request variables
  private loading: boolean = false;
  private showError: boolean = false;
  private errorType: string = "";

  //error functions
  private get showErrorData() {
    return this.showError;
  }
  private showErrorPage(error: string) {
    this.showError = true;
    this.errorType = error;
  }

  //uploader
  private upload() {
    if (this.openUploader) {
      this.openUploader = false;
      this.$nextTick(() => {
        this.openUploader = true;
      });
    } else {
      this.openUploader = !this.openUploader;
    }
  }
  private uploadFinish(file: any) {
    this.imageSrc = file;
    this.imageUrl = URL.createObjectURL(file);
    this.openUploader = false;
  }

  //POST request
  private async createNewCategory() {
    try {
      let formData = new FormData();
      // if (this.imageSrc) {
      formData.append("picture", this.imageSrc);
      // }
      //@ts-ignore
      formData.append("audience", this.category.audience);
      //@ts-ignore
      formData.append("title", this.category.title);
      //@ts-ignore
      formData.append("description", this.category.description);
      //@ts-ignore
      formData.append("coins", this.category.coins);
      //@ts-ignore
      if (this.category.discount_percent) {
        //@ts-ignore
        formData.append("discount_percent", this.category.discount_percent);
      }
      if (!this.typeDiscount) {
        formData.append("discount_percent", "100");
      }
      if (this.category.discount_amount) {
        //@ts-ignore
        formData.append("discount_amount", this.category.discount_amount);
      }
      if (this.category.discount_code) {
        //@ts-ignore
        formData.append("discount_code", this.category.discount_code);
      } else {
        formData.append("file", this.excelFile);
      }
      if (!this.is_limit) {
        //@ts-ignore
        formData.append("limit", this.category.limit);
      }
      //@ts-ignore
      formData.append("is_active", this.category.is_active);
      //@ts-ignore
      formData.append("is_internal", this.category.is_internal);
      //@ts-ignore
      formData.append("is_general", this.category.is_general);
      //@ts-ignore
      formData.append("start_date", this.startTime);
      //@ts-ignore
      formData.append("end_date", this.endTime);

      this.loading = true;

      await this.$axios
        .$post(`/admins/discount-code/category/`, formData, {
          headers: {
            Authorization: this.$auth.getToken("local"),
            Accept: "application/json; version=1.2;"
          }
        })
        .then(() => {
          this.generalModule.toggleSnackbar(true);
          this.generalModule.setSnackbarColor("success");
          this.generalModule.setSnackbarText("دسته جدید با موفقیت اضافه شد");
          this.$router.push({ name: "customerclub-list" });
        });
    } catch (e: any) {
      if (e.response.status === 404 || e.response.status === 500) {
        this.showErrorPage(e.response.status);
      } else {
        this.generalModule.toggleSnackbar(true);
        this.generalModule.setSnackbarColor("error");
        this.generalModule.setSnackbarText("اطلاعات وارد شده را بررسی کنید");
      }
    } finally {
      await delay(500);
      this.loading = false;
    }
  }

  //validation
  private get formValidation() {
    if (
      !this.category.title ||
      !this.category.audience ||
      !this.category.coins ||
      this.category.is_active === undefined ||
      this.category.is_internal === undefined ||
      this.category.is_general === undefined
    ) {
      return true;
    } else if (this.is_limit && this.category.limit) {
      return true;
    } else if (
      this.typeDiscount &&
      !this.category.discount_amount &&
      !this.category.discount_percent
    ) {
      return true;
    } else {
      return false;
    }
  }

  private get dateValue() {
    let start = this.startDate ? jalaliConvert(this.startDate) : "";
    let end = this.endDate ? jalaliConvert(this.endDate) : "";
    let value = this.endDate ? start + " " + " تا " + " " + end : "";
    return value;
  }
  private onlyNumber($event: any) {
    let keyCode = $event.keyCode ? $event.keyCode : $event.which;
    if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
      $event.preventDefault();
    }
  }
}
</script>

<style scoped lang="scss">
.full-height {
  height: 100%;
}
</style>

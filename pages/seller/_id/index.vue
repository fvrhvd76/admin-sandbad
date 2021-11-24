<template>
  <div class="ma-4">
    <v-row>
      <v-col cols="12" sm="12" md="12" lg="4" xl="4">
        <DataCard :count="sellerDetails.income_sum" :title="'درآمد'" />
      </v-col>
      <v-col cols="12" sm="12" md="12" lg="4" xl="4">
        <DataCard :count="sellerDetails.score_count" :title="'تعداد امتیاز'" />
      </v-col>
      <v-col cols="12" sm="12" md="12" lg="4" xl="4">
        <DataCard :count="sellerDetails.sold_count" :title="'تعداد فروش'" />
      </v-col>
      <v-col cols="12">
        <v-card height="100%" outlined class="rounded pa-4">
          <v-form v-if="editStore">
            <div class="mb-2 font-weight-bold primary--text">
              ویرایش اطلاعات فروشگاه
            </div>
            <v-divider class="mb-4" />
            <v-row>
              <v-col class="d-flex align-center justify-start">
                وضعیت اکانت:<v-switch
                  class="pr-2 mb-5"
                  dense
                  inset
                  color="error"
                  hide-details
                  v-model="sellerDetails.is_banned"
                  :label="!sellerDetails.is_banned ? 'عادی' : 'مسدود'"
                ></v-switch>
              </v-col>
              <v-col
                cols="12"
                class="d-flex flex-column justify-center align-center"
              >
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
              <v-col cols="4">
                <v-text-field
                  dense
                  label="نام فروشگاه "
                  outlined
                  v-model="sellerDetails.shop_name"
                  autofocus
                  autocomplete="off"
                />
              </v-col>
              <v-col cols="4">
                <v-text-field
                  dense
                  label="کد پستی"
                  maxLength="10"
                  outlined
                  :rules="postcodeRules"
                  @keypress="onlyNumber"
                  v-model="sellerDetails.post_code"
                  autocomplete="off"
                />
              </v-col>
              <v-col cols="4">
                <v-text-field
                  dense
                  label="تلفن ثابت"
                  @keypress="onlyNumber"
                  maxLength="11"
                  outlined
                  v-model="sellerDetails.fixed_phone"
                  autocomplete="off"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  dense
                  label="شماره جواز کسب"
                  outlined
                  v-model="sellerDetails.business_license_number"
                  autocomplete="off"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  dense
                  label="آدرس"
                  outlined
                  v-model="sellerDetails.address"
                  autocomplete="off"
                />
              </v-col>

              <v-col class="d-flex justify-end align-center" cols="12">
                <v-btn
                  depressed
                  small
                  text
                  width="10%"
                  @click="editStore = false"
                  color="primary"
                  class="ml-2"
                  >لغو</v-btn
                >
                <v-btn
                  depressed
                  small
                  :disabled="formValidation"
                  @click="updateSellerDetail"
                  color="primary"
                  >ثبت اطلاعات فروشگاه</v-btn
                >
              </v-col>
            </v-row>
          </v-form>
          <div v-else>
            <div class="mb-2 font-weight-bold primary--text">
              اطلاعات فروشگاه
            </div>
            <v-divider class="mb-4" />
            <div>
              <div class="d-flex flex-row justify-space-between align-center">
                <div class="d-flex">
                  وضعیت اکانت:<v-chip
                    small
                    class="mx-2"
                    :color="sellerDetails.is_banned ? 'error' : 'success'"
                    >{{ sellerDetails.is_banned ? "مسدود" : "عادی" }}</v-chip
                  >
                </div>
              </div>
              <v-row class="ma-0">
                <v-col cols="12" class="text-center">
                  <div class="d-flex flex-column justify-center align-center">
                    <v-avatar
                      tile
                      size="100"
                      class="mb-4"
                      color="grey lighten-2"
                    >
                      <v-img :src="imageUrl" v-if="imageUrl">
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
                      </v-img>
                      <v-icon v-else color="grey">mdi-account</v-icon>
                    </v-avatar>
                  </div>
                </v-col>
                <v-col cols="12" md="3" lg="3" xl="3">
                  <div class="mb-4 text-bold primary--text">نام فروشگاه:</div>
                  <div>
                    {{
                      sellerDetails.shop_name ? sellerDetails.shop_name : "-"
                    }}
                  </div>
                </v-col>
                <v-col cols="12" md="3" lg="3" xl="3">
                  <div class="mb-4 text-bold primary--text">کدپستی:</div>
                  <div>
                    {{
                      sellerDetails.post_code ? sellerDetails.post_code : "-"
                    }}
                  </div>
                </v-col>
                <v-col cols="12" md="3" lg="3" xl="3">
                  <div class="mb-4 text-bold primary--text">تلفن ثابت:</div>
                  <div>
                    {{
                      sellerDetails.fixed_phone
                        ? sellerDetails.fixed_phone
                        : "-"
                    }}
                  </div>
                </v-col>
                <v-col cols="12" md="3" lg="3" xl="3">
                  <div class="mb-4 text-bold primary--text">شماره جواز:</div>
                  <div>
                    {{
                      sellerDetails.business_license_number
                        ? sellerDetails.business_license_number
                        : "-"
                    }}
                  </div>
                </v-col>
                <v-col cols="12">
                  <div class="mb-4 text-bold primary--text">آدرس:</div>
                  <div>
                    {{ sellerDetails.address ? sellerDetails.address : "-" }}
                  </div>
                </v-col>
              </v-row>
            </div>
            <div class="mt-10 d-flex justify-end align-center">
              <v-btn @click="editStore = true" depressed small color="primary"
                >ویرایش</v-btn
              >
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-data-table
            :items="sales"
            @click:row="goToFactorPage"
            :headers="headers"
            :loader-height="0"
            :loading="loading"
            hide-default-footer
            class="elevation-0 mx-4 pointer"
            disable-pagination
          >
            <template #top>
              <v-toolbar style="cursor: auto" flat>
                <v-toolbar-title>لیست فروش</v-toolbar-title>
              </v-toolbar>
            </template>
            <template #[`item.num`]="{ item }">
              <span> {{ sales.indexOf(item) + 1 }}</span>
            </template>
            <template v-slot:[`item.buyer.full_name`]="{ item }">
              {{ item.buyer.full_name ? item.buyer.full_name : "-" }}
            </template>
            <template v-slot:[`item.phone_number`]="{ item }">
              {{ item.phone_number ? item.phone_number : "-" }}
            </template>
            <template v-slot:[`item.factor_code`]="{ item }">
              {{ item.factor_code ? item.factor_code : "-" }}
            </template>
            <template v-slot:[`item.date_created`]="{ item }">
              {{ item.date_created | jalaliConvert }}
            </template>
            <template v-slot:[`item.status`]="{ item }">
              <v-chip color="primary"> {{ item.status | factorStatus }}</v-chip>
            </template>
            <template v-slot:[`item.final_price`]="{ item }">
              {{ item.final_price ? item.final_price.toLocaleString() : 0 }}
            </template>
            <template #[`body.append`]>
              <div
                v-if="sales.length > 0"
                v-intersect.quiet="infiniteScrolling"
              ></div>
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
        </v-card>
      </v-col>
    </v-row>
    <Snackbar />
    <ErrorModal :dialog="showErrorData" :errorType="errorType" />
    <Uploader
      :open.sync="openUploader"
      @uploadFinish="uploadFinish"
      :type="'avatar'"
    />
  </div>
</template>
<script lang="ts">
import GeneralModule from "~/store/general/index";
import { getModule } from "vuex-module-decorators";
import { Vue, Component, Watch } from "vue-property-decorator";

import { CourierModel } from "~/models/api/courier.model";
import { documentModel } from "~/models/api/document.model";

import { CourierVehicleResponseModel } from "~/models/api/response/courier-vehicle-response.model";
import { SaleModel } from "~/models/api/sale.model";

import RateOfUser from "~/components/common/RateOfUser.vue";
import MessageDialog from "~/components/modals/MessageModal.vue";
import Uploader from "~/components/common/Uploader.vue";
import Snackbar from "~/components/common/Snackbar.vue";
import ErrorModal from "~/components/modals/ErrorModal.vue";
import VuePersianDatetimePicker from "vue-persian-datetime-picker";
import DataCard from "~/components/common/DataCard.vue";
import ChangableText from "~/components/common/ChangableText.vue";

import {
  jalaliConvert,
  jalaliConvertWithTime,
  factorStatus,
  delay,
} from "~/helpers/functionality";
import { FactorModel } from "~/models/api/factor.model";

@Component({
  middleware: ["permission"],
  components: {
    RateOfUser,
    ChangableText,
    MessageDialog,
    Snackbar,
    Uploader,
    ErrorModal,
    datePicker: VuePersianDatetimePicker,
    DataCard,
  },
  filters: {
    jalaliConvert,
    jalaliConvertWithTime,
    factorStatus,
  },
})
export default class Index extends Vue {
  [x: string]: any;
  private generalModule = getModule(GeneralModule, this.$store);

  //courier info
  //store
  private editStore: boolean = false;
  private sellerDetails: CourierModel = {
    courier_data: {
      commission_sum: 0,
      income_sum: 0,
      score_count: 0,
      score_mean: 0,
    },
  };
  private sales: FactorModel[] = [];
  private loading: boolean = false;
  private itemsCurrentPage: number = 0;
  private itemsPerPage: number = 25;
  private itemsEnd: boolean = false;
  private openUploader: boolean = false;
  private imageSrc = "";
  private imageUrl = "";
  //docs
  private value: number = 0;
  private picUrl: string | undefined | boolean = "";
  private document: documentModel = {};
  private dialog: boolean = false;
  //error page
  private showError: boolean = false;
  private errorType: string = "";

  private mounted() {
    this.getSellerDetail();
    this.getSales();
  }

  //saller Details Tab
  private async getSellerDetail() {
    try {
      this.vehicleLoading = true;
      await this.$axios
        .$get(`/admins/sellers/${this.$route.params.id}/`, {
          headers: {
            Authorization: this.$auth.getToken("local"),
            Accept: "application/json; version=1.0;",
          },
        })
        .then((response: any) => {
          this.sellerDetails = response;
          //@ts-ignore
          this.imageUrl = response.shop_picture
            ? this.$axios.defaults.baseURL + response.shop_picture
            : "";
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
      this.vehicleLoading = false;
    }
  }

  private async getSales() {
    try {
      this.vehicleLoading = true;
      await this.$axios
        .$get(`/admins/factors/`, {
          params: {
            user_id: this.$route.params.id,
            offset: this.itemsCurrentPage,
            limit: this.itemsPerPage,
          },
          headers: {
            Authorization: this.$auth.getToken("local"),
            Accept: "application/json; version=1.0;",
          },
        })
        .then((response: any) => {
          this.sales = this.sales.concat(response.result);
          if (!response.next) {
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
      this.vehicleLoading = false;
    }
  }

  private onlyNumber($event: any) {
    let keyCode = $event.keyCode ? $event.keyCode : $event.which;
    if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
      $event.preventDefault();
    }
  }
  private async updateSellerDetail() {
    try {
      this.sellerDetails.accepted = !this.sellerDetails.accepted;
      this.loading = true;
      const formData = new FormData();
      if (this.imageSrc) {
        //@ts-ignore
        await formData.append("shop_picture", this.imageSrc);
      }
      //@ts-ignore
      await formData.append("shop_name", this.sellerDetails.shop_name);
      await formData.append(
        "business_license_number",
        //@ts-ignore
        this.sellerDetails.business_license_number
      );
      //@ts-ignore
      await formData.append("address", this.sellerDetails.address);
      //@ts-ignore
      await formData.append("fixed_phone", this.sellerDetails.fixed_phone);
      //@ts-ignore
      await formData.append("post_code", this.sellerDetails.post_code);
      //@ts-ignore
      await formData.append("is_banned", this.sellerDetails.is_banned);
      await this.$axios
        .$put(
          `${this.$axios.defaults.baseURL}/admins/sellers/${this.$route.params.id}/`,
          formData,
          {
            headers: {
              Authorization: this.$auth.getToken("local"),
              Accept: "application/json; version=1.0;",
            },
          }
        )
        .then(() => {
          this.generalModule.toggleSnackbar(true);
          this.generalModule.setSnackbarColor("success");
          this.generalModule.setSnackbarText(
            "اطلاعات فروشگاه با موفقیت ویرایش شد"
          );
          this.editStore = false;
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

  private get formValidation() {
    // return (
    //   !this.sellerDetails.full_name ||
    //   !this.sellerDetails.phone_number ||
    //   !this.sellerDetails.national_code ||
    //   (this.sellerDetails.national_code &&
    //     this.sellerDetails.national_code.length < 10) ||
    //   (this.sellerDetails.email &&
    //     this.sellerDetails.email.length > 0 &&
    //     !/.+@.+\..+/.test(this.sellerDetails.email))
    // );
    return (
      !!this.sellerDetails.post_code && this.sellerDetails.post_code.length < 10
    );
  }
  private headers = [
    {
      text: "ردیف",
      value: "num",
      align: "start",
      sortable: false,
    },
    {
      text: "نام خریدار",
      value: "buyer.full_name",
      align: "start",
      sortable: false,
    },
    {
      text: "کد فاکتور",
      value: "factor_code",
      align: "start",
      sortable: false,
    },
    {
      text: "تاریخ",
      value: "date_created",
      align: "start",
      sortable: false,
    },
    {
      text: "وضعیت",
      value: "status",
      align: "start",
      sortable: false,
    },
    {
      text: "مبلغ نهایی(تومان)",
      value: "final_price",
      align: "start",
      sortable: false,
    },
  ];
  private async infiniteScrolling(entries: any) {
    if (!this.itemsEnd && entries[0].intersectionRatio > 0) {
      this.itemsCurrentPage = this.itemsCurrentPage + this.itemsPerPage;
      await this.getSales();
    }
  }
  //error page
  private showErrorPage(error: string) {
    this.showError = true;
    this.errorType = error;
  }
  private get showErrorData() {
    return this.showError;
  }
  private get postcodeRules() {
    return [
      (val: string) =>
        !val ||
        val.toString().length >= 10 ||
        val.toString().length === 0 ||
        "کد پستی باید 10 رقم باشد",
    ];
  }
  private goToFactorPage(e: any) {
    this.$router.push({
      name: "factor-id",
      params: { id: e.id ? e.id?.toString() : "" },
    });
  }
}
</script>
<style scoped lang="scss">
.moretext {
  cursor: pointer;
}
.courier {
  .v-input--switch {
    &.v-input--selection-controls {
      margin-top: 0;
      padding-top: 0;
    }
    & .theme--light .v-input--switch--inset {
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
.theme--light.v-input--switch .v-input--switch__track {
  color: #4caf50;
}
.imagesloading {
  height: 100%;
}
.full {
  position: absolute;
  width: 100%;
  height: 100%;
}
.bordersuccess {
  border-style: solid;
  border-color: #4caf50;
  height: 100%;
}
.bordererror {
  border-style: solid;
  border-color: #ff5252;
  height: 100%;
}
//  .v-application .success--text {
//   color: #4caf50 !important;
//   background-color: white;
//   caret-color: #4caf50 !important;
//   width: 0.75em;
//   height: 0.75em;
//   border-radius: 100%;
// }
// .v-application .error--text {
//   color: #ff5252 !important;
//   background-color: white;
//   caret-color: #ff5252 !important;
//   width: 0.75em;
//   height: 0.75em;
//   border-radius: 100%;
// }
.statusOfOnlineCourier {
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  border-style: solid;
  border-color: #4caf50;
  border-width: 0.2em;
  height: 7em;
  width: 7em;
  margin: 0.4em;
}
.statusOfOfflineCourier {
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  border-style: solid;
  border-color: #ff5252;
  border-width: 0.2em;
  height: 7em;
  width: 7em;
  margin: 0.4em;
}
.v-avatar {
  position: relative;
  top: 0.5em;
}
</style>

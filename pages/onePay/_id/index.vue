<template>
  <div class="py-8 px-4">
    <v-card
      v-if="transmission && transmission.id"
      outlined
      class="rounded pa-4"
    >
      <div class="mb-2 font-weight-black primary--text">
        اطلاعات سفر
      </div>
      <v-divider></v-divider>
      <v-row class="mt-2">
        <v-col class="mb-2 d-flex align-center justify-start" cols="12">
          <p class="mt-4">وضعیت:</p>
          <v-chip small class="mr-2" color="primary">{{
            transmission | transmissionStatus
          }}</v-chip>
        </v-col>
        <v-col cols="4">
          <div class="mb-2 primary--text font-weight-bold">
            هزینه سفیر:
          </div>
          <p class="mt-2">
            {{
              transmission && transmission.courier_cost
                ? transmission.courier_cost
                : "-"
            }}
          </p>
        </v-col>
        <v-col cols="4">
          <div class="mb-2 primary--text font-weight-bold">
            کمسیون:
          </div>
          <p class="mt-2">
            {{
              transmission && transmission.commission
                ? transmission.commission
                : "-"
            }}
          </p>
        </v-col>
        <v-col cols="4">
          <div class="mb-2 primary--text font-weight-bold">
            زمان سفر:
          </div>
          <p class="mt-2">
            {{
              transmission && transmission.transfer_time
                ? transmission.transfer_time
                : "-"
            }}
          </p>
        </v-col>
      </v-row>
    </v-card>
    <v-col class="ma-0 pa-0 mt-2 pb-0" cols="12">
      <v-card elevation="0" outlined class="rounded pt-2 px-4">
        <div class="d-flex align-center">
          <div class="mb-2 font-weight-black primary--text">
            اطلاعات سفر
          </div>
          <v-spacer></v-spacer>
          <v-icon
            v-if="transDivShow"
            class="mt-0 pt-0 mb-2"
            @click="transDivShow = !transDivShow"
            >mdi-menu-up</v-icon
          >
          <v-icon
            v-else
            class="mt-0 pt-0 mb-2"
            @click="transDivShow = !transDivShow"
            >mdi-menu-down</v-icon
          >
        </div>
      </v-card></v-col
    >
    <v-expand-transition>
      <v-row class="mx-0 mt-0 pa-0" v-if="transDivShow">
        <v-col class="pa-0 mt-2" cols="12" md="6" lg="6" xl="6">
          <v-card
            height="100%"
            v-if="
              transmission &&
                transmission.courier &&
                transmission.courier.vehicle &&
                transmission.courier.vehicle.color
            "
            outlined
            class="rounded pa-4 ml-2"
          >
            <div class="mb-2 font-weight-black primary--text">
              اطلاعات وسیله نقلیه
            </div>
            <v-divider></v-divider>
            <v-row class="mt-2">
              <v-col
                class="d-flex flex-column align-center justify-center"
                cols="4"
              >
                <div class="mb-2 primary--text font-weight-bold">
                  نام:
                </div>
                <p class="mt-2 mr-2">
                  {{
                    seller &&
                    seller.transmission &&
                    transmission.courier &&
                    transmission.courier.vehicle &&
                    transmission.courier.vehicle.name
                      ? transmission.courier.vehicle.name
                      : "-"
                  }}
                </p>
              </v-col>
              <v-col
                class="d-flex flex-column align-center justify-center"
                cols="4"
              >
                <div class="mb-2 primary--text font-weight-bold">
                  نوع:
                </div>
                <p class="mt-2 mr-2">
                  {{
                    seller &&
                    seller.transmission &&
                    transmission.courier &&
                    transmission.courier.vehicle &&
                    transmission.courier.vehicle.type
                      ? transmission.courier.vehicle.type
                      : "-"
                  }}
                </p>
              </v-col>
              <v-col
                class="d-flex flex-column align-center justify-center"
                cols="4"
              >
                <div class="mb-2 primary--text font-weight-bold">
                  رنگ:
                </div>
                <p class="mt-2 mr-2">
                  {{
                    seller &&
                    seller.transmission &&
                    transmission.courier &&
                    transmission.courier.vehicle &&
                    transmission.courier.vehicle.color
                      ? transmission.courier.vehicle.color
                      : "-"
                  }}
                </p>
              </v-col>
              <v-col
                class="d-flex flex-column align-center justify-center"
                cols="4"
              >
                <div class="mb-2 primary--text font-weight-bold">
                  پلاک:
                </div>
                <p class="mt-2 mr-2">
                  {{
                    seller &&
                    seller.transmission &&
                    transmission.courier &&
                    transmission.courier.vehicle &&
                    transmission.courier.vehicle.pelak
                      ? transmission.courier.vehicle.pelak
                      : "-"
                  }}
                </p>
              </v-col>
              <v-col
                class="d-flex flex-column align-center justify-center"
                cols="4"
              >
                <div class="mb-2 primary--text font-weight-bold">
                  سال ساخت:
                </div>
                <p class="mt-2 mr-2">
                  {{
                    seller &&
                    seller.transmission &&
                    transmission.courier &&
                    transmission.courier.vehicle &&
                    transmission.courier.vehicle.year
                      ? transmission.courier.vehicle.year
                      : "-"
                  }}
                </p>
              </v-col>
              <v-col
                class="d-flex flex-column align-center justify-center"
                cols="4"
              >
                <div class="mb-2 primary--text font-weight-bold">
                  طرح ترافیک:
                </div>
                <p class="mt-2 mr-2">
                  {{
                    seller &&
                    seller.transmission &&
                    transmission.courier &&
                    transmission.courier.vehicle &&
                    transmission.courier.vehicle.have_traffic_plan
                      ? "دارد"
                      : "ندارد"
                  }}
                </p>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col class="pa-0 mt-2" cols="12" md="6" lg="6" xl="6">
          <v-card
            v-if="
              transmission &&
                transmission.courier &&
                transmission.courier.user &&
                transmission.courier.user.id
            "
            @click="goToUserPage(transmission.courier.user.id)"
            outlined
            class="rounded pa-4"
          >
            <div class="mb-2 font-weight-black primary--text">
              اطلاعات سفیر سفر
            </div>
            <v-divider></v-divider>
            <v-row class="mt-2">
              <v-col class="pb-0 d-flex justify-center align-center" cols="12">
                <v-badge
                  bordered
                  bottom
                  :color="
                    transmission &&
                    transmission.courier &&
                    transmission.courier.is_available
                      ? 'success'
                      : 'error'
                  "
                  offset-x="25"
                  offset-y="20"
                >
                  <v-avatar size="100" color="grey lighten-2">
                    <v-img
                      v-if="
                        seller &&
                          seller.courier &&
                          seller.courier.user &&
                          seller.courier.user.profile_picture
                      "
                      :src="
                        seller &&
                        seller.courier &&
                        seller.courier.user &&
                        seller.courier.user.profile_picture
                          ? seller.profile_picture
                          : ''
                      "
                      ><template v-slot:placeholder>
                        <v-row
                          class="full-height ma-0"
                          align="center"
                          justify="center"
                        >
                          <v-progress-circular
                            indeterminate
                            color="primary"
                          ></v-progress-circular>
                        </v-row> </template
                    ></v-img>
                    <v-icon color="grey" v-else>mdi-account</v-icon>
                  </v-avatar>
                </v-badge>
              </v-col>
              <v-col class="pt-0 d-flex justify-center align-center" cols="12">
                <div class="mb-2 primary--text font-weight-bold">
                  نام کامل:
                </div>
                <p class="mt-2 mr-2">
                  {{
                    seller &&
                    seller.transmission &&
                    transmission.courier &&
                    transmission.courier.user &&
                    transmission.courier.users.full_name
                      ? transmission.courier.user.full_name
                      : "-"
                  }}
                </p>
              </v-col>
              <v-col
                class="d-flex flex-column align-center justify-center"
                cols="4"
              >
                <div class="mb-2 primary--text font-weight-bold">
                  جنسیت:
                </div>
                <p class="mt-2">
                  {{
                    seller &&
                    seller.transmission &&
                    transmission.courier &&
                    transmission.courier.user &&
                    transmission.courier.user.is_male === true
                      ? "مرد"
                      : seller &&
                        seller.transmission &&
                        transmission.courier &&
                        transmission.courier.user &&
                        transmission.courier.user.is_male === false
                      ? "زن"
                      : "-"
                  }}
                </p>
              </v-col>
              <v-col
                class="d-flex flex-column align-center justify-center"
                cols="4"
              >
                <div class="mb-2 primary--text font-weight-bold">
                  شماره تماس:
                </div>
                <p class="mt-2">
                  {{
                    seller &&
                    seller.transmission &&
                    transmission.courier &&
                    transmission.courier.user &&
                    transmission.courier.user.phone_number
                      ? transmission.courier.user.phone_number
                      : "-"
                  }}
                </p>
              </v-col>
              <v-col
                class="d-flex flex-column align-center justify-center"
                cols="4"
              >
                <div class="mb-2 primary--text font-weight-bold">
                  تاریخ عضویت:
                </div>
                <p
                  v-if="
                    seller &&
                      seller.transmission &&
                      transmission.courier &&
                      transmission.courier.user &&
                      transmission.courier.user.date_joined
                  "
                  class="mt-2"
                >
                  {{ transmission.courier.user.date_joined | jalaliConvert }}
                </p>
                <span v-else>-</span>
              </v-col>
              <v-col
                class="d-flex flex-column align-center justify-center"
                cols="4"
              >
                <div class="mb-2 primary--text font-weight-bold">
                  تعداد سفرها:
                </div>
                <p class="mt-2">
                  {{
                    transmission &&
                    transmission.courier &&
                    transmission.courier.transmission_count
                      ? transmission.courier.transmission_count
                      : "-"
                  }}
                </p>
              </v-col>
              <v-col
                class="d-flex flex-column align-center justify-center"
                cols="4"
              >
                <div class="mb-2 primary--text font-weight-bold">
                  مسافت طی شده:
                </div>
                <p class="mt-2">
                  {{
                    transmission &&
                    transmission.courier &&
                    transmission.courier.distance_moved
                      ? transmission.courier.distance_moved
                      : "-"
                  }}
                </p>
              </v-col>
              <v-col
                class="d-flex flex-column align-center justify-center"
                cols="4"
              >
                <div class="mb-2 primary--text font-weight-bold">
                  زمان سفر:
                </div>
                <p class="mt-2">
                  {{
                    transmission &&
                    transmission.courier &&
                    transmission.courier.transmission_time
                      ? transmission.courier.transmission_time
                      : "-"
                  }}
                </p>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-expand-transition>
    <Snackbar />
    <ErrorModal :dialog="showErrorData" :errorType="errorType" />
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
import Snackbar from "~/components/common/Snackbar.vue";
import ErrorModal from "~/components/modals/ErrorModal.vue";
import VuePersianDatetimePicker from "vue-persian-datetime-picker";
import DataCard from "~/components/common/DataCard.vue";
import ChangableText from "~/components/common/ChangableText.vue";

import {
  jalaliConvert,
  jalaliConvertWithTime,
  transmissionStatus,
  delay
} from "~/helpers/functionality";
import { TransmissionModel } from "~/models/api/transmission.model";

@Component({
  middleware: ["permission"],
  components: {
    RateOfUser,
    ChangableText,
    MessageDialog,
    Snackbar,
    ErrorModal,
    datePicker: VuePersianDatetimePicker,
    DataCard
  },
  filters: {
    jalaliConvert,
    jalaliConvertWithTime,
    transmissionStatus
  }
})
export default class Index extends Vue {
  [x: string]: any;
  private generalModule = getModule(GeneralModule, this.$store);

  //courier info
  //store
  private editTransmission: boolean = false;
  private transmission: TransmissionModel = {};
  private loading: boolean = false;
  private transDivShow: boolean = false;

  //error page
  private showError: boolean = false;
  private errorType: string = "";

  private mounted() {
    this.getTransmissionDetail();
  }

  //transmission Details Tab
  private async getTransmissionDetail() {
    try {
      this.vehicleLoading = true;
      await this.$axios
        .$get(`/admins/transmission/${this.$route.params.id}/`, {
          headers: {
            Authorization: this.$auth.getToken("local"),
            Accept: "application/json; version=1.0;"
          },
          params: {
            created_for: "pay"
          }
        })
        .then((response: any) => {
          this.transmission = response;
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

  //error page
  private showErrorPage(error: string) {
    this.showError = true;
    this.errorType = error;
  }
  private get showErrorData() {
    return this.showError;
  }
  private goToUserPage(e: any) {
    this.$router.push({
      name: "user-id",
      params: { id: e.id ? e.id?.toString() : "" }
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
</style>

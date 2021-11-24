<template>
  <!-- ToDoList -->
  <!-- form Validation -->
  <!-- transmission list -->
  <!-- details transmissions -->
  <div class="px-1 full-height courier overflow-y-auto">
    <v-tabs v-model="tab" align-with-title grow show-arrows>
      <v-tabs-slider color="primary"></v-tabs-slider>
      <v-tab v-for="item in tabItems" :key="item">
        {{ item }}
      </v-tab>
    </v-tabs>
    <v-divider class="mb-4" />
    <v-tabs-items style="height: 94%; background: transparent" v-model="tab">
      <v-tab-item key="اطلاعات سفیر">
        <v-row>
          <v-col md="4" lg="2" xl="2" sm="6" cols="12">
            <DataCard
              :count="
                courierDetails.courier_data.commission_sum.toLocaleString() +
                  ' ' +
                  'تومان'
              "
              :title="'کمیسیون'"
            />
          </v-col>
          <v-col md="4" lg="2" xl="2" sm="6" cols="12">
            <DataCard
              :count="
                courierDetails.courier_data.income_sum.toLocaleString() +
                  ' ' +
                  'تومان'
              "
              :title="'درآمد'"
            />
          </v-col>
          <v-col md="4" lg="2" xl="2" sm="6" cols="12">
            <DataCard
              :count="courierDetails.courier_data.score_count"
              :title="'تعداد امتیاز'"
            />
          </v-col>
          <v-col md="4" lg="2" xl="2" sm="6" cols="12">
            <DataCard
              :count="courierDistance + ' ' + 'کیلومتر'"
              :title="'مسافت طی شده'"
            />
          </v-col>
          <v-col md="4" lg="2" xl="2" sm="6" cols="12">
            <DataCard
              :count="courierDetails.transmission_count"
              :title="'سغرهای انجام شده'"
            />
          </v-col>
          <v-col md="4" lg="2" xl="2" sm="6" cols="12">
            <DataCard
              v-if="courierDetails.transmission_time"
              :count="courierDetails.transmission_time | timeConvertor"
              :title="'مجموع ساعات طی شده حین سفرها'"
            />
          </v-col>
          <v-col cols="12" xl="6" lg="6" md="6">
            <v-card height="100%" outlined class="rounded pa-4">
              <div class="mb-2 font-weight-bold primary--text">
                اطلاعات فردی
              </div>
              <v-divider class="mb-4" />
              <v-row>
                <p
                  class="
                    primary--text
                    font-weight-black
                    mb-0
                    mt-2
                    d-flex
                    align-center
                    justify-center
                  "
                  style="width: 100%"
                >
                  امتیاز سفیر
                </p>
                <v-col cols="12" justify="center">
                  <v-rating
                    readonly
                    dir="ltr"
                    class="d-flex justify-center"
                    background-color="#ff9700"
                    color="#ff9700"
                    :value="courierDetails.courier_data.score_mean"
                  ></v-rating>
                </v-col>
                <v-col
                  v-if="editCourier"
                  class="d-flex align-center justify-start"
                  cols="12"
                  md="12"
                  lg="6"
                  xl="6"
                >
                  وضعیت کاربر:<v-switch
                    class="pr-2"
                    dense
                    inset
                    color="error"
                    hide-details
                    v-model="courierDetails.is_banned"
                    :label="!courierDetails.is_banned ? 'عادی' : 'مسدود'"
                  ></v-switch>
                </v-col>
                <v-col
                  cols="12"
                  md="12"
                  lg="6"
                  xl="6"
                  v-else
                  class="d-flex align-center justify-start"
                >
                  وضعیت کاربر:
                  <v-chip
                    class="mx-2"
                    dark
                    :color="!courierDetails.is_banned ? 'green' : 'red'"
                  >
                    {{ !courierDetails.is_banned ? "عادی" : "مسدود" }}
                  </v-chip>
                </v-col>
                <v-col
                  cols="12"
                  md="12"
                  lg="6"
                  xl="6"
                  v-if="editCourier"
                  :class="
                    $vuetify.breakpoint.mdAndUp
                      ? 'd-flex align-center justify-end'
                      : 'd-flex align-center justify-start'
                  "
                >
                  وضعیت سفر:<v-switch
                    class="pr-2"
                    dense
                    inset
                    color="success"
                    hide-details
                    v-model="courierDetails.is_available"
                    :label="courierDetails.is_available ? 'فعال' : 'غیرفعال'"
                  ></v-switch>
                </v-col>
                <v-col
                  cols="12"
                  md="12"
                  lg="6"
                  xl="6"
                  v-else
                  :class="
                    $vuetify.breakpoint.mdAndUp
                      ? 'd-flex align-center justify-end'
                      : 'd-flex align-center justify-start'
                  "
                >
                  وضعیت سفر:
                  <v-chip
                    class="mx-2"
                    dark
                    :color="courierDetails.is_available ? 'green' : 'red'"
                  >
                    {{ courierDetails.is_available ? "فعال" : "غیرفعال" }}
                  </v-chip>
                </v-col>
                <v-col
                  cols="12"
                  md="12"
                  lg="6"
                  xl="6"
                  v-if="editCourier"
                  class="d-flex align-center justify-start"
                >
                  وضعیت احراز هویت:<v-switch
                    class="pr-2"
                    dense
                    inset
                    color="success"
                    hide-details
                    v-model="courierDetails.accepted"
                    :label="
                      !courierDetails.accepted ? 'تایید نشده' : 'تایید شده'
                    "
                  ></v-switch>
                </v-col>
                <v-col
                  cols="12"
                  md="12"
                  lg="6"
                  xl="6"
                  v-else
                  class="d-flex align-center justify-start"
                >
                  وضعیت احراز هویت:
                  <v-chip
                    class="mx-2"
                    dark
                    :color="courierDetails.accepted ? 'green' : 'red'"
                  >
                    {{ !courierDetails.accepted ? "تایید نشده" : "تایید شده" }}
                  </v-chip>
                </v-col>
                <v-col v-if="editCourier" class="mt-4" cols="12">
                  <v-text-field
                    dense
                    outlined
                    label="آدرس"
                    v-model="courierDetails.address"
                  ></v-text-field>
                </v-col>
                <v-col v-else class="mt-4" cols="12">
                  <div
                    class="
                      primary--text
                      font-weight-bold
                      d-flex
                      justify-start
                      align-center
                    "
                  >
                    آدرس:
                  </div>
                  {{ courierDetails.address ? courierDetails.address : "-" }}
                </v-col>
              </v-row>
              <div class="mt-10 d-flex justify-end align-center">
                <v-btn
                  v-if="!editCourier"
                  @click="editCourier = true"
                  depressed
                  small
                  color="primary"
                  >ویرایش</v-btn
                >
                <v-btn
                  v-if="editCourier"
                  depressed
                  small
                  text
                  width="10%"
                  @click="cancelEdit"
                  color="primary"
                  class="ml-2"
                  >لغو</v-btn
                >
                <v-btn
                  v-if="editCourier"
                  depressed
                  small
                  @click="updateCourier"
                  color="primary"
                  >ثبت اطلاعات
                </v-btn>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" xl="6" lg="6" md="6">
            <v-card height="100%" outlined class="rounded pa-4">
              <v-form v-if="editVehicle">
                <div class="mb-2 font-weight-bold primary--text">
                  ویرایش اطلاعات خودرو
                </div>
                <v-divider class="mb-4" />
                <v-row>
                  <v-col class="d-flex justify-start align-center" cols="12">
                    <p class="mt-3">وضعیت طرح ترافیک:</p>
                    <v-switch
                      class="mt-3 mr-2"
                      color="primary"
                      v-model="vehicleDetail.have_traffic_plan"
                      :label="
                        vehicleDetail.have_traffic_plan ? 'دارد' : 'ندارد'
                      "
                    ></v-switch>
                  </v-col>
                  <v-col cols="12" md="6" xl="4" lg="4">
                    <v-text-field
                      dense
                      label="رنگ وسیله"
                      outlined
                      v-model="vehicleDetail.color"
                      autocomplete="off"
                    />
                  </v-col>
                  <v-col cols="12" md="6" xl="4" lg="4">
                    <v-text-field
                      dense
                      label="نام وسیله"
                      outlined
                      v-model="vehicleDetail.name"
                      autocomplete="off"
                    />
                  </v-col>
                  <v-col cols="12" md="6" xl="4" lg="4">
                    <v-select
                      dense
                      outlined
                      hide-details
                      v-model="vehicleDetail.type"
                      :menu-props="{ offsetY: true }"
                      color="primary"
                      item-text="name"
                      item-value="value"
                      :items="typeList"
                      item-color="primary"
                      label="نوع خودرو"
                    />
                  </v-col>
                  <v-col cols="12" md="6" xl="4" lg="4">
                    <v-text-field
                      dense
                      label="شماره پلاک"
                      outlined
                      v-model="vehicleDetail.pelak"
                      autocomplete="off"
                    />
                  </v-col>
                  <v-col cols="12" md="6" xl="4" lg="4">
                    <v-text-field
                      dense
                      label="سال تولید"
                      outlined
                      v-model="vehicleDetail.year"
                      autocomplete="off"
                    />
                  </v-col>
                  <v-col class="d-flex justify-end align-center" cols="12">
                    <v-btn
                      depressed
                      small
                      text
                      width="10%"
                      @click="cancelEditVehicle"
                      color="primary"
                      class="ml-2"
                      >لغو</v-btn
                    >
                    <v-btn
                      depressed
                      small
                      @click="updateCourierVehicle"
                      color="primary"
                      >ثبت اطلاعات خودرو</v-btn
                    >
                  </v-col>
                </v-row>
              </v-form>
              <div
                class="d-flex flex-column justify-space-between full-height"
                v-else
              >
                <div>
                  <div class="mb-2 font-weight-bold primary--text">
                    اطلاعات خودرو
                  </div>
                  <v-divider class="mb-4" />
                  <v-row>
                    <v-col cols="12" md="3" lg="3" xl="3">
                      <div class="mb-4 text-bold primary--text">
                        نوع وسیله نقلیه:
                      </div>
                      <div>
                        {{
                          vehicleDetail.type === "car"
                            ? "وانت"
                            : vehicleDetail.type === "truck"
                            ? "کامیون"
                            : vehicleDetail.type === "motorcycle"
                            ? "موتور"
                            : "-"
                        }}
                      </div>
                    </v-col>
                    <v-col cols="12" md="3" lg="3" xl="3">
                      <div class="mb-4 text-bold primary--text">
                        نام وسیله نقلیه:
                      </div>
                      <div>
                        {{ vehicleDetail.name ? vehicleDetail.name : "-" }}
                      </div>
                    </v-col>
                    <v-col cols="12" md="3" lg="3" xl="3">
                      <div class="mb-4 text-bold primary--text">
                        رنگ وسیله نقلیه:
                      </div>
                      <div>
                        {{ vehicleDetail.color ? vehicleDetail.color : "-" }}
                      </div>
                    </v-col>
                    <v-col cols="12" md="3" lg="3" xl="3">
                      <div class="mb-4 text-bold primary--text">
                        شماره پلاک:
                      </div>
                      <div>
                        {{ vehicleDetail.pelak ? plate : "-" }}
                      </div>
                    </v-col>
                    <v-col cols="12" md="3" lg="4" xl="4">
                      <div class="mb-4 text-bold primary--text">
                        سال ساخت وسیله نقلیه:
                      </div>
                      <div>
                        {{ vehicleDetail.year ? vehicleDetail.year : "-" }}
                      </div>
                    </v-col>
                    <v-col cols="12" md="3" lg="3" xl="3">
                      <div class="mb-4 text-bold primary--text">
                        طرح ترافیک:
                      </div>
                      <div>
                        <v-chip
                          small
                          class="mx-2"
                          :dark="!vehicleDetail.have_traffic_plan"
                          :color="
                            !vehicleDetail.have_traffic_plan
                              ? '#FFCDD2'
                              : '#C8E6C9'
                          "
                          >{{
                            !vehicleDetail.have_traffic_plan ? "ندارد" : "دارد"
                          }}</v-chip
                        >
                      </div>
                    </v-col>
                  </v-row>
                </div>
                <div class="d-flex justify-end align-end">
                  <v-btn
                    @click="editVehicle = true"
                    depressed
                    small
                    color="primary"
                    >ویرایش</v-btn
                  >
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card height="350px" style="overflow:scroll">
              <v-data-table
                :items="transmissionsList"
                :headers="headers"
                :loader-height="0"
                :loading="loading"
                hide-default-footer
                class="elevation-0 mx-4 pointer"
                disable-pagination
              >
                <template #top>
                  <v-toolbar style="cursor:auto" flat>
                    <v-toolbar-title>لیست سفرها</v-toolbar-title>
                  </v-toolbar>
                </template>
                <template v-slot:[`item.profile_picture`]="{ item }">
                  <v-avatar size="70" class="my-2" color="grey lighten-2">
                    <v-img
                      :src="$axios.defaults.baseURL + item.profile_picture"
                      v-if="item.profile_picture"
                    >
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
                    <v-icon v-else>
                      mdi-account
                    </v-icon>
                  </v-avatar>
                </template>
                <template #[`item.num`]="{ item }">
                  <span> {{ transmissionsList.indexOf(item) + 1 }}</span>
                </template>
                <template v-slot:[`item.id`]="{ item }">
                  {{ item.id ? item.id : "-" }}
                </template>
                <template v-slot:[`item.courier_cost`]="{ item }">
                  {{
                    item.courier_cost ? item.courier_cost.toLocaleString() : "-"
                  }}
                </template>
                <template v-slot:[`item.date`]="{ item }">
                  {{ item.date | jalaliConvertWithTime }}
                </template>
                <template v-slot:[`item.transfer_time`]="{ item }">
                  {{ item.transfer_time | timeConvertor }}
                </template>
                <template v-slot:[`item.status`]="{ item }">
                  <v-chip
                    :color="
                      item.is_canceled
                        ? 'error'
                        : item.is_done
                        ? 'success'
                        : item.is_paid
                        ? 'info'
                        : item.is_scored
                        ? 'primary'
                        : ''
                    "
                    >{{
                      item.is_canceled
                        ? "لغو شده"
                        : item.is_done
                        ? "انجام شده"
                        : item.is_paid
                        ? "پرداخت شده"
                        : item.is_scored
                        ? "امتیاز  داده شده"
                        : "نامشخص"
                    }}</v-chip
                  >
                </template>
                <template #[`body.append`]>
                  <div
                    v-if="transmission.length > 0"
                    v-intersect.quiet="infiniteScrolling"
                  ></div>
                </template>
                <template v-slot:no-data>
                  <div
                    class="d-flex flex-column justify-center align-center my-4"
                  >
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
            </v-card>
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item key="احراز هویت">
        <v-card outlined class="pa-4">
          <v-row>
            <v-col cols="12" lg="6" md="6" sm="6">
              <div v-if="!loading" class="mb-4 text-bold primary--text">
                {{
                  document.birth_certificate
                    ? "شناسنامه"
                    : document.national_card
                    ? "کارت ملی"
                    : document.card_service
                    ? "کارت پایان خدمت"
                    : document.passport
                    ? "پاسپورت"
                    : "تصویر اطلاعات فردی ثبت نشده است"
                }}
              </div>
              <div v-else class="mb-4 text-bold primary--text">
                لطفا صبر کنید ...
              </div>
              <div>
                <v-img
                  class="rounded-lg"
                  :aspect-ratio="4 / 3"
                  :src="doc1Pic ? $axios.defaults.baseURL + doc1Pic : ''"
                  max-width="20rem"
                  max-height="15rem"
                  @click="docpic(1)"
                >
                  <template #placeholder>
                    <v-row
                      class="imagesloading"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        v-if="loading"
                        indeterminate
                        color="primary"
                      ></v-progress-circular>
                    </v-row>
                  </template>
                  <template>
                    <div
                      v-if="document.is_accepted1 && doc1Pic"
                      class="pa-2 bordersuccess"
                      align="end"
                      justify="end"
                    >
                      <v-icon color="success" x-large>mdi-check-circle</v-icon>
                    </div>
                    <div
                      v-if="!document.is_accepted1 && doc1Pic"
                      class="pa-2 bordererror"
                      align="end"
                      justify="end"
                    >
                      <v-icon color="error" x-large>mdi-close-circle</v-icon>
                    </div>
                    <div
                      class="
                        pa-2
                        imagesloading
                        d-flex
                        align-center
                        justify-center
                      "
                    >
                      <div
                        class="full red"
                        style="background-color: #d3d3d3; opacity: 0.5"
                      ></div>
                      <v-icon v-if="!doc1Pic && !loading"
                        >mdi-image-remove</v-icon
                      >
                    </div>
                  </template>
                </v-img>
              </div>
            </v-col>
            <v-col cols="12" lg="6" md="6" sm="6">
              <div v-if="!loading" class="mb-4 text-bold primary--text">
                {{
                  document.vehicle_card
                    ? "کارت خودرو"
                    : document.green_card
                    ? "برگ سبز"
                    : document.shopping_card
                    ? "کاغذ خرید"
                    : document.agreement
                    ? "توافق نامه"
                    : "تصویر اطلاعات خودرو ثبت نشده است"
                }}
              </div>
              <div v-else class="mb-4 text-bold primary--text">
                لطفا صبر کنید ...
              </div>
              <div>
                <v-img
                  class="rounded-lg"
                  :aspect-ratio="4 / 3"
                  :src="doc2Pic ? $axios.defaults.baseURL + doc2Pic : ''"
                  max-width="20rem"
                  max-height="15rem"
                  @click="docpic(2)"
                >
                  <template #placeholder>
                    <v-row
                      class="imagesloading"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        v-if="loading"
                        indeterminate
                        color="primary"
                      ></v-progress-circular>
                    </v-row>
                  </template>

                  <template>
                    <div
                      v-if="document.is_accepted2 && doc2Pic"
                      class="pa-2 bordersuccess"
                      align="end"
                      justify="end"
                    >
                      <v-icon color="success" x-large>mdi-check-circle</v-icon>
                    </div>
                    <div
                      v-if="!document.is_accepted2 && doc2Pic"
                      class="pa-2 bordererror"
                      align="end"
                      justify="end"
                    >
                      <v-icon color="error" x-large>mdi-close-circle</v-icon>
                    </div>
                    <div
                      class="
                        pa-2
                        imagesloading
                        d-flex
                        align-center
                        justify-center
                      "
                    >
                      <div
                        class="full"
                        style="background-color: #d3d3d3; opacity: 0.5"
                      ></div>
                      <v-icon v-if="!doc2Pic && !loading"
                        >mdi-image-remove</v-icon
                      >
                    </div>
                  </template>
                </v-img>
              </div>
            </v-col>
            <v-col cols="12" lg="6" md="6" sm="6">
              <div v-if="!loading" class="mb-4 text-bold primary--text">
                {{
                  document.bill_picture
                    ? "تصویر قبض"
                    : document.lease
                    ? "اجاره نامه"
                    : document.property_document
                    ? "سند ملک"
                    : "تصویر اطلاعات ضمانتی ثبت نشده است"
                }}
              </div>
              <div v-else class="mb-4 text-bold primary--text">
                لطفا صبر کنید ...
              </div>
              <div>
                <v-img
                  class="rounded-lg"
                  :aspect-ratio="4 / 3"
                  :src="doc3Pic ? $axios.defaults.baseURL + doc3Pic : ''"
                  max-width="20rem"
                  max-height="15rem"
                  @click="docpic(3)"
                >
                  <template v-slot:placeholder>
                    <v-row
                      class="imagesloading"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        v-if="loading"
                        indeterminate
                        color="primary"
                      ></v-progress-circular>
                    </v-row>
                  </template>

                  <template>
                    <div
                      v-if="document.is_accepted3 && doc3Pic"
                      class="pa-2 bordersuccess"
                      align="end"
                      justify="end"
                    >
                      <v-icon color="success" x-large>mdi-check-circle</v-icon>
                    </div>
                    <div
                      v-if="!document.is_accepted3 && doc3Pic"
                      class="pa-2 bordererror"
                      align="end"
                      justify="end"
                    >
                      <v-icon color="error" x-large>mdi-close-circle</v-icon>
                    </div>
                    <div
                      class="
                        pa-2
                        imagesloading
                        d-flex
                        align-center
                        justify-center
                      "
                    >
                      <div
                        class="full"
                        style="background-color: #d3d3d3; opacity: 0.5"
                      ></div>
                      <v-icon v-if="!doc3Pic && !loading"
                        >mdi-image-remove</v-icon
                      >
                    </div>
                  </template>
                </v-img>
              </div>
            </v-col>
            <v-col cols="12" lg="6" md="6" sm="6">
              <div v-if="!loading" class="mb-4 text-bold primary--text">
                {{
                  document.vehicle_policy
                    ? "بیمه نامه"
                    : "تصویر بیمه نامه ثبت نشده است"
                }}
              </div>
              <div v-else class="mb-4 text-bold primary--text">
                لطفا صبر کنید ...
              </div>
              <div>
                <v-img
                  class="rounded-lg"
                  :aspect-ratio="4 / 3"
                  :src="
                    document.vehicle_policy
                      ? $axios.defaults.baseURL + document.vehicle_policy
                      : ''
                  "
                  max-width="20rem"
                  max-height="15rem"
                  @click="docpic(4)"
                >
                  <template #placeholder>
                    <v-row
                      class="imagesloading"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        v-if="loading"
                        indeterminate
                        color="primary"
                      ></v-progress-circular>
                    </v-row>
                  </template>
                  <template>
                    <div
                      v-if="document.is_accepted4 && document.vehicle_policy"
                      class="pa-2 bordersuccess"
                      align="end"
                      justify="end"
                    >
                      <v-icon color="success" x-large>mdi-check-circle</v-icon>
                    </div>
                    <div
                      v-if="!document.is_accepted4 && document.vehicle_policy"
                      class="pa-2 bordererror"
                      align="end"
                      justify="end"
                    >
                      <v-icon color="error" x-large>mdi-close-circle</v-icon>
                    </div>
                    <div
                      class="
                        pa-2
                        imagesloading
                        d-flex
                        align-center
                        justify-center
                      "
                    >
                      <div
                        class="full"
                        style="background-color: #d3d3d3; opacity: 0.5"
                      ></div>
                      <v-icon v-if="!document.vehicle_policy && !loading"
                        >mdi-image-remove</v-icon
                      >
                    </div>
                  </template>
                </v-img>
              </div>
            </v-col>
            <v-col cols="12" lg="6" md="6" sm="6">
              <div v-if="!loading" class="mb-4 text-bold primary--text">
                {{
                  document.certificates
                    ? "گواهی نامه"
                    : "تصویر گواهی نامه ثبت نشده است"
                }}
              </div>
              <div v-else class="mb-4 text-bold primary--text">
                لطفا صبر کنید ...
              </div>
              <div>
                <v-img
                  class="rounded-lg"
                  :aspect-ratio="4 / 3"
                  :src="
                    document.certificates
                      ? $axios.defaults.baseURL + document.certificates
                      : ''
                  "
                  max-width="20rem"
                  max-height="15rem"
                  @click="docpic(5)"
                >
                  <template #placeholder>
                    <v-row
                      class="imagesloading"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        v-if="loading"
                        indeterminate
                        color="primary"
                      ></v-progress-circular>
                    </v-row>
                  </template>

                  <template>
                    <div
                      v-if="document.is_accepted5 && document.certificates"
                      class="pa-2 bordersuccess"
                      align="end"
                      justify="end"
                    >
                      <v-icon color="success" x-large>mdi-check-circle</v-icon>
                    </div>
                    <div
                      v-if="!document.is_accepted5 && document.certificates"
                      class="pa-2 bordererror"
                      align="end"
                      justify="end"
                    >
                      <v-icon color="error" x-large>mdi-close-circle</v-icon>
                    </div>
                    <div
                      class="
                        pa-2
                        imagesloading
                        d-flex
                        align-center
                        justify-center
                      "
                    >
                      <div
                        class="full"
                        style="background-color: #d3d3d3; opacity: 0.5"
                      ></div>
                      <v-icon v-if="!document.certificates && !loading"
                        >mdi-image-remove</v-icon
                      >
                    </div>
                  </template>
                </v-img>
              </div>
            </v-col>
            <v-col cols="12" lg="6" md="6" sm="6">
              <div v-if="!loading" class="mb-4 text-bold primary--text">
                {{
                  document.promissory_note ? "سفته" : "تصویر سفته ثبت نشده است"
                }}
              </div>
              <div v-else class="mb-4 text-bold primary--text">
                لطفا صبر کنید ...
              </div>
              <div>
                <v-img
                  class="rounded-lg"
                  :aspect-ratio="4 / 3"
                  :src="
                    document.promissory_note
                      ? $axios.defaults.baseURL + document.promissory_note
                      : ''
                  "
                  max-width="20rem"
                  max-height="15rem"
                  @click="docpic(6)"
                >
                  <template #placeholder>
                    <v-row
                      class="imagesloading"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        v-if="loading"
                        indeterminate
                        color="primary"
                      ></v-progress-circular>
                    </v-row>
                  </template>

                  <template>
                    <div
                      v-if="document.is_accepted6 && document.promissory_note"
                      class="pa-2 bordersuccess"
                      align="end"
                      justify="end"
                    >
                      <v-icon color="success" x-large>mdi-check-circle</v-icon>
                    </div>
                    <div
                      v-if="!document.is_accepted6 && document.promissory_note"
                      class="pa-2 bordererror"
                      align="end"
                      justify="end"
                    >
                      <v-icon color="error" x-large>mdi-close-circle</v-icon>
                    </div>
                    <div
                      class="
                        pa-2
                        imagesloading
                        d-flex
                        align-center
                        justify-center
                      "
                    >
                      <div
                        class="full"
                        style="background-color: #d3d3d3; opacity: 0.5"
                      ></div>
                      <v-icon v-if="!document.promissory_note && !loading"
                        >mdi-image-remove</v-icon
                      >
                    </div>
                  </template>
                </v-img>
              </div>
            </v-col>
          </v-row>
          <v-dialog v-model="dialog" width="80%" elevation="0">
            <v-card>
              <v-img width="100%" :src="$axios.defaults.baseURL + picUrl"
                ><template #placeholder>
                  <v-row class="imagesloading" align="center" justify="center">
                    <v-progress-circular
                      indeterminate
                      color="primary"
                    ></v-progress-circular>
                  </v-row> </template
              ></v-img>
              <v-banner fixed>
                <v-btn @click="acceptDoc" color="primary">پذیرش</v-btn>
                <v-btn @click="rejectDoc" color="primary" text>رد</v-btn>
              </v-banner>
            </v-card>
          </v-dialog>
        </v-card>
      </v-tab-item>
    </v-tabs-items>

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

import { transmissionsModel } from "~/models/api/response/transmissionsModel";
import { transmissionsListModel } from "~/models/api/response/transmissionsListModel";
import { CourierVehicleResponseModel } from "~/models/api/response/courier-vehicle-response.model";

import { TransmissionModel } from "~/models/api/transmission.model";

import MessageDialog from "~/components/modals/MessageModal.vue";
import Snackbar from "~/components/common/Snackbar.vue";
import ErrorModal from "~/components/modals/ErrorModal.vue";
import VuePersianDatetimePicker from "vue-persian-datetime-picker";
import DataCard from "~/components/common/DataCard.vue";
import ChangableText from "~/components/common/ChangableText.vue";

import {
  jalaliConvert,
  jalaliConvertWithTime,
  delay,
  timeConvertor
} from "~/helpers/functionality";

@Component({
  middleware: ["permission"],
  components: {
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
    timeConvertor
  }
})
export default class Index extends Vue {
  [x: string]: any;
  private generalModule = getModule(GeneralModule, this.$store);
  private tab: any = "";
  @Watch("tab")
  private valueChange(value: number) {
    if (value === 1) {
      this.getDocuments();
    }
  }
  private tabItems = ["اطلاعات خودرو", "احراز هویت"];

  //courier info
  //vehicle
  private editCourier: boolean = false;
  private letterOfPlate: string | undefined = "";
  private n1Plate: string | undefined = "";
  private n2Plate: string | undefined = "";
  private n3Plate: string | undefined = "";
  private editVehicle: boolean = false;
  private transmissionsList: transmissionsModel[] = [];
  private itemsEnd: boolean = false;
  private itemsPerPage: number = 25;
  private itemsCurrentPage: number = 0;
  private courierDetails: CourierModel = {
    courier_data: {
      commission_sum: 0,
      income_sum: 0,
      score_count: 0,
      score_mean: 0
    }
  };
  private vehicleDetail: CourierVehicleResponseModel = {};
  private transmission: TransmissionModel[] = [];
  private loading: boolean = false;
  private typeList = [
    { name: "کامیون", value: "truck" },
    { name: "اتومبیل", value: "car" },
    { name: "موتور", value: "motorcycle" }
  ];

  //docs
  private value: number = 0;
  private picUrl: string | undefined | boolean = "";
  private document: documentModel = {};
  private dialog: boolean = false;
  //error page
  private showError: boolean = false;
  private errorType: string = "";
  private editCourierLoading: boolean = false;
  private headers = [
    {
      text: "ردیف",
      value: "num",
      align: "start",
      sortable: false
    },

    {
      text: "هزینه سفیر(تومان)",
      value: "courier_cost",
      align: "start",
      sortable: false
    },
    {
      text: "شناسه",
      value: "id",
      align: "start",
      sortable: false
    },
    {
      text: "کمیسیون(تومان)",
      value: "commission",
      align: "start",
      sortable: false
    },
    {
      text: "زمان سفر",
      value: "transfer_time",
      align: "start",
      sortable: false
    },

    {
      text: "تاریخ",
      value: "date",
      align: "start",
      sortable: false
    },
    {
      text: "وضعیت سفر",
      value: "status",
      align: "start",
      sortable: false
    }
  ];

  private mounted() {
    this.getTransmissionsHistory();
    this.getVehicleDetail();
    this.getTransmissionsList();
  }

  //Vehicle Details Tab
  private async getVehicleDetail() {
    try {
      this.vehicleLoading = true;
      await this.$axios
        .$get(`/admins/couriers/${this.$route.params.id}/`, {
          headers: {
            Authorization: this.$auth.getToken("local"),
            Accept: "application/json; version=1.0;"
          }
        })
        .then((response: any) => {
          this.vehicleDetail = response.vehicle;
          this.courierDetails = response;
        });
    } catch (e: any) {
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
  private async getTransmissionsList() {
    await this.$axios
      .$get(
        `/admins/couriers/${this.$route.params.id}/transmission/?limit=${this.itemsPerPage}&offset=${this.itemsCurrentPage}`,
        {
          headers: {
            Authorization: this.$auth.getToken("local"),
            Accept: "application/json; version=1.0;"
          }
        }
      )
      .then((response: transmissionsListModel) => {
        this.transmissionsList = this.transmissionsList.concat(response.result);
        if (!response.next) {
          this.itemsEnd = true;
        }
      })
      .catch((e: any) => {
        if (e.response.status === 404 || e.response.status === 500) {
          this.showErrorPage(e.response.status);
        } else {
          this.generalModule.toggleSnackbar(true);
          this.generalModule.setSnackbarColor("error");
          this.generalModule.setSnackbarText(e.response.data.detail);
        }
      })
      .finally(async () => {
        await delay(500);
        this.vehicleLoading = false;
      });
  }
  private async infiniteScrolling(entries: any) {
    if (!this.itemsEnd && entries[0].intersectionRatio > 0) {
      this.itemsCurrentPage = this.itemsCurrentPage + this.itemsPerPage;
      await this.getTransmissionsList();
    }
  }
  private async updateCourier() {
    const formData = new FormData();
    //@ts-ignore
    await formData.append("address", this.courierDetails.address);
    //@ts-ignore
    await formData.append("accepted", this.courierDetails.accepted);
    //@ts-ignore
    await formData.append("is_banned", this.courierDetails.is_banned);
    //@ts-ignore
    await formData.append("is_available", this.courierDetails.is_available);

    this.editCourierLoading = true;
    await this.$axios
      .$put(`/admins/couriers/${this.$route.params.id}/`, formData, {
        headers: {
          Authorization: this.$auth.getToken("local"),
          Accept: "application/json; version=1.0;"
        }
      })
      .then(() => {
        this.generalModule.toggleSnackbar(true);
        this.generalModule.setSnackbarColor("success");
        this.generalModule.setSnackbarText("اطلاعات سفیر با موفقیت ویرایش شد");
        this.editCourierLoading = false;
        this.editCourier = false;
        this.getVehicleDetail();
      })
      .catch((e: any) => {
        if (e.response.status === 404 || e.response.status === 500) {
          this.showErrorPage(e.response.status);
        } else {
          this.generalModule.toggleSnackbar(true);
          this.generalModule.setSnackbarColor("error");
          this.generalModule.setSnackbarText(e.response.data.detail);
        }
      })
      .finally(async () => {
        await delay(500);
        this.editCourierLoading = false;
      });
  }
  private async updateCourierVehicle() {
    try {
      this.loading = true;
      const formData = new FormData();
      //@ts-ignore
      await formData.append("name", this.vehicleDetail.name);
      //@ts-ignore
      await formData.append("type", this.vehicleDetail.type);
      //@ts-ignore
      await formData.append("color", this.vehicleDetail.color);
      //@ts-ignore
      await formData.append("pelak", this.vehicleDetail.pelak);
      //@ts-ignore
      await formData.append("year", this.vehicleDetail.year);
      await formData.append(
        "have_traffic_plan",
        //@ts-ignore
        this.vehicleDetail.have_traffic_plan
      );
      //@ts-ignore

      await this.$axios
        .$put(`/admins/courier-vehicle/${this.$route.params.id}/`, formData, {
          headers: {
            Authorization: this.$auth.getToken("local"),
            Accept: "application/json; version=1.0;"
          }
        })
        .then(() => {
          this.generalModule.toggleSnackbar(true);
          this.generalModule.setSnackbarColor("success");
          this.generalModule.setSnackbarText(
            "اطلاعات سفیر با موفقیت ویرایش شد"
          );
          this.editVehicle = false;
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

  private cancelEditVehicle() {
    this.editVehicle = false;
    this.getVehicleDetail();
  }
  private cancelEdit() {
    this.editCourier = false;
    this.getVehicleDetail();
  }
  //docs tabs
  private async getDocuments() {
    try {
      this.loading = true;
      await this.$axios
        .$get(`admins/courier-documents/${this.$route.params.id}/`, {
          headers: {
            Authorization: this.$auth.getToken("local"),
            Accept: "application/json; version=1.0;"
          }
        })
        .then((response: documentModel) => {
          this.document = response;
        });
    } catch (e: any) {
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

  private docpic(v: number) {
    if (v === 1 && this.doc1Pic) {
      this.picUrl = this.doc1Pic;
      this.value = 1;
      this.dialog = true;
    } else if (v === 2 && this.doc2Pic) {
      this.picUrl = this.doc2Pic;
      this.value = 2;
      this.dialog = true;
    } else if (v === 3 && this.doc3Pic) {
      this.picUrl = this.doc3Pic;
      this.value = 3;
      this.dialog = true;
    } else if (v === 4 && this.document.vehicle_policy) {
      this.picUrl = this.document.vehicle_policy;
      this.value = 4;
      this.dialog = true;
    } else if (v === 5 && this.document.certificates) {
      this.picUrl = this.document.certificates;
      this.value = 5;
      this.dialog = true;
    } else if (v === 6 && this.document.promissory_note) {
      this.picUrl = this.document.promissory_note;
      this.value = 6;
      this.dialog = true;
    }
  }
  private async acceptDoc() {
    if (this.value === 1) {
      this.document.is_accepted1 = true;
    } else if (this.value === 2) {
      this.document.is_accepted2 = true;
    } else if (this.value === 3) {
      this.document.is_accepted3 = true;
    } else if (this.value === 4) {
      this.document.is_accepted4 = true;
    } else if (this.value === 5) {
      this.document.is_accepted5 = true;
    } else if (this.value === 6) {
      this.document.is_accepted6 = true;
    }
    this.dialog = false;
    try {
      this.editMode = false;
      this.loadingProp = true;
      let formData = new FormData();
      //@ts-ignore
      formData.append("is_accepted1", this.document.is_accepted1);
      //@ts-ignore
      formData.append("is_accepted2", this.document.is_accepted2);
      //@ts-ignore
      formData.append("is_accepted3", this.document.is_accepted3);
      //@ts-ignore
      formData.append("is_accepted4", this.document.is_accepted4);
      //@ts-ignore
      formData.append("is_accepted5", this.document.is_accepted5);
      //@ts-ignore
      formData.append("is_accepted6", this.document.is_accepted6);
      await this.$axios
        .$put(`admins/courier-documents/${this.$route.params.id}/`, formData, {
          headers: {
            Authorization: this.$auth.getToken("local"),
            Accept: "application/json; version=1.0;"
          }
        })
        .then(() => {
          this.generalModule.toggleSnackbar(true);
          this.generalModule.setSnackbarColor("success");
          this.generalModule.setSnackbarText(
            "اطلاعات سفیر با موفقیت ویرایش شد"
          );
          this.dialog = false;
        });
    } catch (e: any) {
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
  private async rejectDoc() {
    if (this.value === 1) {
      this.document.is_accepted1 = false;
    } else if (this.value === 2) {
      this.document.is_accepted2 = false;
    } else if (this.value === 3) {
      this.document.is_accepted3 = false;
    } else if (this.value === 4) {
      this.document.is_accepted4 = false;
    } else if (this.value === 5) {
      this.document.is_accepted5 = false;
    } else if (this.value === 6) {
      this.document.is_accepted6 = false;
    }
    this.dialog = false;
    try {
      this.editMode = false;
      this.loadingProp = true;
      let formData = new FormData();
      //@ts-ignore
      formData.append("is_accepted1", this.document.is_accepted1);
      //@ts-ignore
      formData.append("is_accepted2", this.document.is_accepted2);
      //@ts-ignore
      formData.append("is_accepted3", this.document.is_accepted3);
      //@ts-ignore
      formData.append("is_accepted4", this.document.is_accepted4);
      //@ts-ignore
      formData.append("is_accepted5", this.document.is_accepted5);
      //@ts-ignore
      formData.append("is_accepted6", this.document.is_accepted6);
      await this.$axios
        .$put(`admins/courier-documents/${this.$route.params.id}/`, formData, {
          headers: {
            Authorization: this.$auth.getToken("local"),
            Accept: "application/json; version=1.0;"
          }
        })
        .then(() => {
          this.generalModule.toggleSnackbar(true);
          this.generalModule.setSnackbarColor("success");
          this.generalModule.setSnackbarText(
            "اطلاعات سفیر با موفقیت ویرایش شد"
          );
          this.dialog = false;
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

  //transmission tab
  private async getTransmissionsHistory() {
    try {
      this.loading = true;
      await this.$axios
        .$get(`/admins/courier-transmission-count/${this.$route.params.id}/`, {
          headers: {
            Authorization: this.$auth.getToken("local"),
            Accept: "application/json; version=1.0;"
          }
        })
        .then((response: any) => {
          this.transmission = this.transmission.concat(response.result);
        });
    } catch (e: any) {
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
  //error page
  private showErrorPage(error: string) {
    this.showError = true;
    this.errorType = error;
  }
  private get doc1Pic() {
    if (this.document.birth_certificate !== null) {
      return this.document.birth_certificate;
    } else if (this.document.national_card !== null) {
      return this.document.national_card;
    } else if (this.document.card_service !== null) {
      return this.document.card_service;
    } else if (this.document.passport !== null) {
      return this.document.passport;
    } else {
      return false;
    }
  }
  private get doc2Pic() {
    if (this.document.vehicle_card !== null) {
      return this.document.vehicle_card;
    } else if (this.document.green_card !== null) {
      return this.document.green_card;
    } else if (this.document.shopping_card !== null) {
      return this.document.shopping_card;
    } else if (this.document.agreement !== null) {
      return this.document.agreement;
    } else {
      return false;
    }
  }
  private get doc3Pic() {
    if (this.document.bill_picture !== null) {
      return this.document.bill_picture;
    } else if (this.document.lease !== null) {
      return this.document.lease;
    } else if (this.document.property_document !== null) {
      return this.document.property_document;
    } else {
      return false;
    }
  }

  private get courierDistance() {
    let distance =
      Math.round(
        (Number(this.courierDetails.distance_moved) + Number.EPSILON) * 100
      ) / 100;
    return distance;
  }
  private get plate() {
    if (this.vehicleDetail.pelak) {
      this.letterOfPlate = this.vehicleDetail.pelak.charAt(7);
      this.n1Plate = this.vehicleDetail.pelak?.slice(0, 2);
      this.n2Plate = this.vehicleDetail.pelak?.slice(2, 5);
      this.n3Plate = this.vehicleDetail.pelak?.slice(5, 7);
      return (
        this.n3Plate +
        " " +
        "|" +
        " " +
        this.n2Plate +
        " " +
        this.letterOfPlate +
        " " +
        this.n1Plate
      );
    }
  }
  private onlyNumber($event: any) {
    let keyCode = $event.keyCode ? $event.keyCode : $event.which;
    if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
      $event.preventDefault();
    }
  }

  private get showErrorData() {
    return this.showError;
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

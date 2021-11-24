<template>
  <div class="full-height py-8 px-4 sender">
    <v-col cols="12">
      <v-card outlined class="rounded pa-4">
        <div class="d-flex align-center">
          <div class="mb-2 font-weight-black primary--text">
            <span v-if="!editFactor"> اطلاعات فاکتور </span>
            <span v-else>ویرایش اطلاعات فاکتور</span>
          </div>
          <v-spacer></v-spacer>
          <v-icon
            v-if="factorDivShow"
            class="mt-0 pt-0 mb-2"
            @click="factorDivShow = !factorDivShow"
            >mdi-menu-up</v-icon
          >
          <v-icon
            v-else
            class="mt-0 pt-0 mb-2"
            @click="factorDivShow = !factorDivShow"
            >mdi-menu-down</v-icon
          >
        </div>
        <v-divider v-if="factorDivShow"></v-divider>
        <v-expand-transition>
          <div v-if="factorDivShow">
            <v-form class="mt-8" v-if="editFactor">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    dense
                    label="توضیحات"
                    hide-details
                    outlined
                    v-model="factor.description"
                    autofocus
                    autocomplete="off"
                  />
                </v-col>
                <v-col cols="12" md="4" lg="4" xl="4">
                  <v-text-field
                    dense
                    hide-details
                    label="مبلغ نهایی(تومان)"
                    outlined
                    v-model="factor.final_price"
                    autocomplete="off"
                  />
                </v-col>
                <v-col cols="12" md="4" lg="4" xl="4">
                  <v-select
                    dense
                    outlined
                    hide-details
                    v-model="factor.status"
                    :menu-props="{ offsetY: true }"
                    color="primary"
                    item-text="name"
                    item-value="value"
                    :items="statusList"
                    item-color="primary"
                    label="وضعیت"
                  />
                </v-col>
                <v-col cols="12" md="4" lg="4" xl="4">
                  <v-select
                    dense
                    outlined
                    hide-details
                    v-model="factor.who_paid"
                    :menu-props="{ offsetY: true }"
                    color="primary"
                    item-text="name"
                    item-value="value"
                    :items="who_paidList"
                    item-color="primary"
                    label="پرداخت کننده"
                  />
                </v-col>
                <v-col cols="12" md="4" lg="4" xl="4">
                  <v-select
                    dense
                    outlined
                    hide-details
                    v-model="factor.has_test_time"
                    :menu-props="{ offsetY: true }"
                    color="primary"
                    item-text="name"
                    item-value="value"
                    :items="trueFalseList"
                    item-color="primary"
                    label="امکان مرجوع"
                  />
                </v-col>
                <!-- <v-col cols="12" md="4" lg="4" xl="4">
                  <v-select
                    dense
                    outlined
                    hide-details
                    v-model="factor.test_time_expired"
                    :menu-props="{ offsetY: true }"
                    color="primary"
                    item-text="name"
                    item-value="value"
                    :items="trueFalseList"
                    item-color="primary"
                    label=" زمان برای تست"
                  />
                </v-col> -->
                <v-col cols="12" md="4" lg="4" xl="4">
                  <v-text-field
                    v-if="factor.has_test_time"
                    label="زمان تست"
                    :value="factor.test_time | jalaliConvertWithTime"
                    id="datePicker"
                    outlined
                    color="primary"
                    dense
                    :disabled="!factor.has_test_time"
                    readonly
                  />
                  <date-picker
                    v-model="factor.test_time"
                    format="YYYY-MM-DD HH:mm"
                    type="datetime"
                    element="datePicker"
                    display-format="jYYYY/jMM/jDD HH:mm"
                    color="#F48C3A"
                    auto-submit
                  />
                </v-col>
                <v-col
                  class="d-flex justify-end align-center"
                  cols="12"
                  md="12"
                  lg="12"
                  xl="12"
                >
                  <v-btn
                    depressed
                    small
                    text
                    width="10%"
                    @click="close"
                    color="primary"
                    class="ml-2"
                    >لغو</v-btn
                  >
                  <v-btn
                    depressed
                    small
                    @click="editFactorDetails()"
                    color="primary"
                    >ویرایش</v-btn
                  >
                </v-col>
              </v-row>
            </v-form>
            <div v-else class="d-flex flex-row justify-start align-center">
              <v-row>
                <v-col class="mb-2 d-flex align-center justify-start" cols="12">
                  <p class="mt-4">وضعیت:</p>
                  <v-chip small class="mr-2" color="primary">{{
                    factor.status | factorStatus
                  }}</v-chip>
                  <v-spacer></v-spacer>
                  <div class="primary--text font-weight-bold">
                    شناسه: {{ factor.id }}
                  </div>
                </v-col>
                <v-col
                  :class="
                    $vuetify.breakpoint.mdAndUp
                      ? ''
                      : 'd-flex flex-column justify-center align-center'
                  "
                  cols="12"
                  md="4"
                  lg="3"
                  xl="3"
                >
                  <div class="mb-2 primary--text font-weight-bold">
                    شناسه فاکتور:
                  </div>
                  <p>{{ factor.factor_code ? factor.factor_code : '-' }}</p>
                </v-col>
                <v-col
                  :class="
                    $vuetify.breakpoint.mdAndUp
                      ? ''
                      : 'd-flex flex-column justify-center align-center'
                  "
                  cols="12"
                  md="4"
                  lg="3"
                  xl="3"
                >
                  <div class="mb-2 primary--text font-weight-bold">
                    توضیحات:
                  </div>
                  <p>{{ factor.description ? factor.description : '-' }}</p>
                </v-col>
                <v-col
                  :class="
                    $vuetify.breakpoint.mdAndUp
                      ? ''
                      : 'd-flex flex-column justify-center align-center'
                  "
                  cols="12"
                  md="4"
                  lg="3"
                  xl="3"
                >
                  <div class="mb-2 primary--text font-weight-bold">
                    مهلت تست:
                  </div>
                  <p
                    :class="
                      factor.has_test_time
                        ? 'font-weight-bold success--text'
                        : 'font-weight-bold error--text'
                    "
                  >
                    {{ factor.has_test_time ? 'دارد' : 'ندارد' }}
                  </p>
                </v-col>
                <v-col
                  :class="
                    $vuetify.breakpoint.mdAndUp
                      ? ''
                      : 'd-flex flex-column justify-center align-center'
                  "
                  cols="12"
                  md="4"
                  lg="3"
                  xl="3"
                >
                  <div class="mb-2 primary--text font-weight-bold">
                    زمان تست:
                  </div>
                  <p
                    :class="
                      factor.test_time_expired ? 'error--text' : 'success--text'
                    "
                    v-if="factor.test_time"
                  >
                    {{ factor.test_time | jalaliConvertWithTime }}
                  </p>
                  <span v-else>-</span>
                </v-col>
                <v-col
                  :class="
                    $vuetify.breakpoint.mdAndUp
                      ? ''
                      : 'd-flex flex-column justify-center align-center'
                  "
                  cols="12"
                  md="4"
                  lg="3"
                  xl="3"
                >
                  <div class="mb-2 primary--text font-weight-bold">مبلغ:</div>
                  <p v-if="factor.price">
                    {{ factor.price.toLocaleString() + " تومان" }}
                  </p>
                  <p v-else>0</p> </v-col
                ><v-col
                  :class="
                    $vuetify.breakpoint.mdAndUp
                      ? ''
                      : 'd-flex flex-column justify-center align-center'
                  "
                  cols="12"
                  md="4"
                  lg="3"
                  xl="3"
                >
                  <div class="mb-2 primary--text font-weight-bold">
                    مبلغ نهایی:
                  </div>
                  <p v-if="factor.final_price">
                    {{ factor.final_price.toLocaleString() + " تومان"}}
                  </p>
                  <p v-else>0</p> </v-col
                ><v-col
                  :class="
                    $vuetify.breakpoint.mdAndUp
                      ? ''
                      : 'd-flex flex-column justify-center align-center'
                  "
                  cols="12"
                  md="4"
                  lg="3"
                  xl="3"
                >
                  <div class="mb-2 primary--text font-weight-bold">
                    تعداد ارسال:
                  </div>
                  <p>
                    {{ factor.send_count ? factor.send_count : '-' }}
                  </p> </v-col
                ><v-col
                  :class="
                    $vuetify.breakpoint.mdAndUp
                      ? ''
                      : 'd-flex flex-column justify-center align-center'
                  "
                  cols="12"
                  md="4"
                  lg="3"
                  xl="3"
                >
                  <div class="mb-2 primary--text font-weight-bold">تاریخ:</div>
                  <p>{{ factor.timestamp | jalaliConvertWithTime }}</p>
                </v-col>
                <v-col class="d-flex justify-end align-center" cols="12">
                  <v-btn
                    depressed
                    small
                    @click="editFactor = true"
                    color="primary"
                    >ویرایش</v-btn
                  >
                </v-col>
              </v-row>
            </div>
          </div>
        </v-expand-transition>
      </v-card>
    </v-col>
    <v-col class="ma-0 pb-0 mb-4" cols="12">
      <v-card elevation="0" outlined class="rounded pt-2 px-4">
        <div class="d-flex align-center">
          <div class="mb-2 font-weight-black primary--text">اجناس فاکتور</div>
          <v-spacer></v-spacer>
          <v-icon
            v-if="itemsDivShow"
            class="mt-0 pt-0 mb-2"
            @click="itemsDivShow = !itemsDivShow"
            >mdi-menu-up</v-icon
          >
          <v-icon
            v-else
            class="mt-0 pt-0 mb-2"
            @click="itemsDivShow = !itemsDivShow"
            >mdi-menu-down</v-icon
          >
        </div>
      </v-card></v-col
    >
    <v-expand-transition>
      <v-card outlined class="mx-3 mb-6" elevation="0" v-if="itemsDivShow">
        <v-data-table
          :items="items"
          :headers="headers"
          :loader-height="0"
          :loading="loading"
          hide-default-footer
          class="elevation-0 pointer"
          disable-pagination
        >
          <template #[`item.picture`]="{ item }">
            <v-carousel
              cycle
              :show-arrows="false"
              hide-delimiter-background
              hide-delimiters
              height="100%"
            >
              <v-carousel-item
                style="width: 100px; height: 100px"
                v-if="item.picture1"
              >
                <v-img
                  :src="$axios.defaults.baseURL + item.picture1"
                  contain
                  width="100%"
                  height="auto"
                  class="pa-2"
                ></v-img>
              </v-carousel-item>
              <v-carousel-item
                style="width: 100px; height: 100px"
                v-if="item.picture2"
              >
                <v-img
                  :src="$axios.defaults.baseURL + item.picture2"
                  contain
                  width="100%"
                  height="auto"
                  class="pa-2"
                ></v-img>
              </v-carousel-item>
              <v-carousel-item
                style="width: 100px; height: 100px"
                v-if="item.picture3"
              >
                <v-img
                  :src="$axios.defaults.baseURL + item.picture3"
                  contain
                  width="100%"
                  height="auto"
                  class="pa-2"
                ></v-img>
              </v-carousel-item>
              <v-carousel-item
                style="width: 100px; height: 100px"
                v-if="item.picture4"
              >
                <v-img
                  :src="$axios.defaults.baseURL + item.picture4"
                  contain
                  width="100%"
                  height="auto"
                  class="pa-2"
                ></v-img>
              </v-carousel-item>
              <v-carousel-item
                style="width: 100px; height: 100px"
                v-if="item.picture5"
              >
                <v-img
                  :src="$axios.defaults.baseURL + item.picture5"
                  contain
                  width="100%"
                  height="auto"
                  class="pa-2"
                ></v-img>
              </v-carousel-item>
              <v-sheet
                class="d-flex justify-center align-center"
                style="width: 150px; height: 120px"
                v-if="!item.picture1"
                color="grey lighten-4"
              >
                <v-icon color="grey darken-4">mdi-image-off</v-icon>
              </v-sheet>
            </v-carousel>
          </template>
          <template #[`item.num`]="{ item }">
            <span> {{ items.indexOf(item) + 1 }}</span>
          </template>
          <template #[`item.name`]="{ item }">
            {{ item.name ? item.name : '-' }}
          </template>
          <template #[`item.number`]="{ item }">
            {{ item.number ? item.number : '-' }}
            <span v-if="!item.count_type == 'number'">کیلو</span>
            <span v-else>عدد</span>
          </template>
          <template #[`item.barcode`]="{ item }">
            {{ item.barcode ? item.barcode : '-' }}
          </template>
          <template #[`item.price`]="{ item }">
            {{ item.price ? item.price.toLocaleString() : '-' }}
          </template>
          <template #[`item.discount`]="{ item }">
            {{ item.discount ? item.discount + '%' : '-' }}
          </template>
          <template #[`item.date_added`]="{ item }">
            {{ item.date_added | jalaliConvertWithTime }}
          </template>
          <template #[`item.description`]="{ item }">
            {{
              item.description ? item.description.substring(0, 20) + '...' : '-'
            }}
          </template>
          <!-- <template #[`item.actions`]="{ item }">
            <v-btn
              color="primary"
              @click="editItemsDialog = true"
              class="ml-4"
              x-small
              fab
              depressed
            >
              <v-icon> mdi-pencil </v-icon>
            </v-btn>
            <v-btn
              color="primary"
              @click="openConfirmModal(item.id)"
              fab
              depressed
              x-small
            >
              <v-icon> mdi-delete </v-icon>
            </v-btn>
          </template> -->
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
    </v-expand-transition>
    <v-row class="px-3">
      <v-col cols="12" md="6" lg="6" xl="6">
        <v-card
          @click="goToUserPage(factor.seller.id)"
          outlined
          class="rounded pa-4"
        >
          <div class="d-flex">
            <div class="mb-2 font-weight-black primary--text">
              اطلاعات فروشنده
            </div>
            <v-spacer />
            <div class="font-weight-bold" v-if="factor.who_paid === 'seller'">
              پرداخت کننده
            </div>
          </div>
          <v-divider></v-divider>
          <v-row class="mt-2">
            <v-col class="pb-0 d-flex justify-center align-center" cols="12">
              <v-avatar size="100" color="grey lighten-2">
                <v-img
                  v-if="factor.seller && factor.seller.profile_picture"
                  :src="
                    factor.seller && factor.seller.profile_picture
                      ? $axios.defaults.baseURL + factor.seller.profile_picture
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
            </v-col>
            <v-col
              class="pt-0 mt-2 d-flex flex-column justify-center align-center"
              cols="12"
            >
              <div class="mb-2 primary--text font-weight-bold">نام کامل:</div>
              <p class="mt-2 mr-2">
                {{
                  factor.seller && factor.seller.full_name
                    ? factor.seller.full_name
                    : '-'
                }}
              </p>
            </v-col>
            <v-col
              class="d-flex flex-column align-center justify-center"
              cols="4"
            >
              <div class="mb-2 primary--text font-weight-bold">جنسیت:</div>
              <p class="mt-2">
                {{
                  factor.seller && factor.seller.is_male === true
                    ? 'مرد'
                    : factor.seller && factor.seller.is_male === false
                    ? 'زن'
                    : '-'
                }}
              </p>
            </v-col>
            <v-col
              class="d-flex flex-column align-center justify-center"
              cols="4"
            >
              <div class="mb-2 primary--text font-weight-bold">شماره تماس:</div>
              <p class="mt-2">
                {{
                  factor.seller && factor.seller.phone_number
                    ? factor.seller.phone_number
                    : '-'
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
              <p v-if="factor.seller && factor.seller.date_joined" class="mt-2">
                {{ factor.seller.date_joined | jalaliConvert }}
              </p>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="6" xl="6">
        <v-card
          @click="goToUserPage(factor.buyer.id)"
          outlined
          class="rounded pa-4"
        >
          <div class="d-flex">
            <div class="mb-2 font-weight-black primary--text">
              اطلاعات خریدار
            </div>
            <v-spacer />
            <div class="font-weight-bold" v-if="factor.who_paid === 'buyer'">
              پرداخت کننده
            </div>
          </div>
          <v-divider></v-divider>
          <v-row class="mt-2">
            <v-col class="pb-0 d-flex justify-center align-center" cols="12">
              <v-avatar size="100" color="grey lighten-2">
                <v-img
                  v-if="factor.buyer && factor.buyer.profile_picture"
                  :src="
                    factor.buyer && factor.buyer.profile_picture
                      ? $axios.defaults.baseURL + factor.buyer.profile_picture
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
            </v-col>
            <v-col
              class="pt-0 mt-2 d-flex flex-column justify-center align-center"
              cols="12"
            >
              <div class="mb-2 primary--text font-weight-bold">نام کامل:</div>
              <p class="mt-2 mr-2">
                {{
                  factor.buyer && factor.buyer.full_name
                    ? factor.buyer.full_name
                    : '-'
                }}
              </p>
            </v-col>
            <v-col
              class="d-flex flex-column align-center justify-center"
              cols="4"
            >
              <div class="mb-2 primary--text font-weight-bold">جنسیت:</div>
              <p class="mt-2">
                {{
                  factor.buyer && factor.buyer.is_male === true
                    ? 'مرد'
                    : factor.buyer && factor.buyer.is_male === false
                    ? 'زن'
                    : '-'
                }}
              </p>
            </v-col>
            <v-col
              class="d-flex flex-column align-center justify-center"
              cols="4"
            >
              <div class="mb-2 primary--text font-weight-bold">شماره تماس:</div>
              <p class="mt-2">
                {{
                  factor.buyer && factor.buyer.phone_number
                    ? factor.buyer.phone_number
                    : '-'
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
              <p v-if="factor.buyer && factor.buyer.date_joined" class="mt-2">
                {{ factor.buyer.date_joined | jalaliConvert }}
              </p>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col v-if="factor.transmission" class="ma-0 pb-0" cols="12">
        <v-card elevation="0" outlined class="rounded pt-2 px-4">
          <div class="d-flex align-center">
            <div class="mb-2 font-weight-black primary--text">اطلاعات سفر</div>
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
        <v-row class="mx-0 mt-0" v-if="transDivShow">
          <v-col cols="12" md="6" lg="6" xl="6">
            <v-card
              v-if="factor.transmission && factor.transmission.id"
              @click="goToTransmissionPage(factor.transmission.id)"
              outlined
              class="rounded pa-4"
            >
              <div class="mb-2 font-weight-black primary--text">
                اطلاعات سفر
              </div>
              <v-divider></v-divider>
              <v-row class="mt-2">
                <v-col cols="4">
                  <div class="mb-2 primary--text font-weight-bold">
                    هزینه سفیر(تومان):
                  </div>
                  <p class="mt-2">
                    {{
                      factor.transmission && factor.transmission.courier_cost
                        ? factor.transmission.courier_cost
                        : '-'
                    }}
                  </p>
                </v-col>
                <v-col cols="4">
                  <div class="mb-2 primary--text font-weight-bold">کمسیون:</div>
                  <p class="mt-2">
                    {{
                      factor.transmission && factor.transmission.commission
                        ? factor.transmission.commission
                        : '-'
                    }}
                  </p>
                </v-col>
                <v-col cols="4">
                  <div class="mb-2 primary--text font-weight-bold">
                    زمان سفر:
                  </div>
                  <p
                    v-if="
                      factor.transmission && factor.transmission.transfer_time
                    "
                    class="mt-2"
                  >
                    {{ factor.transmission.transfer_time | timeConvertor }}
                  </p>
                </v-col>
              </v-row>
            </v-card>
            <v-card
              v-if="
                factor.transmission &&
                factor.transmission.courier &&
                factor.transmission.courier.vehicle &&
                factor.transmission.courier.vehicle.color
              "
              @click="goToTransmissionPage(factor.transmission.id)"
              outlined
              class="rounded pa-4 mt-3"
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
                  <div class="mb-2 primary--text font-weight-bold">نام:</div>
                  <p class="mt-2 mr-2">
                    {{
                      factor.seller &&
                      factor.seller.transmission &&
                      factor.transmission.courier &&
                      factor.transmission.courier.vehicle &&
                      factor.transmission.courier.vehicle.name
                        ? factor.transmission.courier.vehicle.name
                        : '-'
                    }}
                  </p>
                </v-col>
                <v-col
                  class="d-flex flex-column align-center justify-center"
                  cols="4"
                >
                  <div class="mb-2 primary--text font-weight-bold">نوع:</div>
                  <p class="mt-2 mr-2">
                    {{
                      factor.seller &&
                      factor.seller.transmission &&
                      factor.transmission.courier &&
                      factor.transmission.courier.vehicle &&
                      factor.transmission.courier.vehicle.type
                        ? factor.transmission.courier.vehicle.type
                        : '-'
                    }}
                  </p>
                </v-col>
                <v-col
                  class="d-flex flex-column align-center justify-center"
                  cols="4"
                >
                  <div class="mb-2 primary--text font-weight-bold">رنگ:</div>
                  <p class="mt-2 mr-2">
                    {{
                      factor.seller &&
                      factor.seller.transmission &&
                      factor.transmission.courier &&
                      factor.transmission.courier.vehicle &&
                      factor.transmission.courier.vehicle.color
                        ? factor.transmission.courier.vehicle.color
                        : '-'
                    }}
                  </p>
                </v-col>
                <v-col
                  class="d-flex flex-column align-center justify-center"
                  cols="4"
                >
                  <div class="mb-2 primary--text font-weight-bold">پلاک:</div>
                  <p class="mt-2 mr-2">
                    {{
                      factor.seller &&
                      factor.seller.transmission &&
                      factor.transmission.courier &&
                      factor.transmission.courier.vehicle &&
                      factor.transmission.courier.vehicle.pelak
                        ? factor.transmission.courier.vehicle.pelak
                        : '-'
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
                      factor.seller &&
                      factor.seller.transmission &&
                      factor.transmission.courier &&
                      factor.transmission.courier.vehicle &&
                      factor.transmission.courier.vehicle.year
                        ? factor.transmission.courier.vehicle.year
                        : '-'
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
                      factor.seller &&
                      factor.seller.transmission &&
                      factor.transmission.courier &&
                      factor.transmission.courier.vehicle &&
                      factor.transmission.courier.vehicle.have_traffic_plan
                        ? 'دارد'
                        : 'ندارد'
                    }}
                  </p>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col cols="12" md="6" lg="6" xl="6">
            <v-card
              v-if="
                factor.transmission &&
                factor.transmission.courier &&
                factor.transmission.courier.user &&
                factor.transmission.courier.user.id
              "
              @click="goToUserPage(factor.transmission.courier.user.id)"
              outlined
              class="rounded pa-4"
            >
              <div class="mb-2 font-weight-black primary--text">
                اطلاعات سفیر سفر
              </div>
              <v-divider></v-divider>
              <v-row class="mt-2">
                <v-col
                  class="pb-0 d-flex justify-center align-center"
                  cols="12"
                >
                  <v-badge
                    bordered
                    bottom
                    :color="
                      factor.transmission &&
                      factor.transmission.courier &&
                      factor.transmission.courier.is_available
                        ? 'success'
                        : 'error'
                    "
                    offset-x="25"
                    offset-y="20"
                  >
                    <v-avatar size="100" color="grey lighten-2">
                      <v-img
                        v-if="
                          factor.seller &&
                          factor.seller.courier &&
                          factor.seller.courier.user &&
                          factor.seller.courier.user.profile_picture
                        "
                        :src="
                          factor.seller &&
                          factor.seller.courier &&
                          factor.seller.courier.user &&
                          factor.seller.courier.user.profile_picture
                            ? factor.seller.profile_picture
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
                <v-col
                  class="pt-0 d-flex justify-center align-center"
                  cols="12"
                >
                  <div class="mb-2 primary--text font-weight-bold">
                    نام کامل:
                  </div>
                  <p class="mt-2 mr-2">
                    {{
                      factor.seller &&
                      factor.seller.transmission &&
                      factor.transmission.courier &&
                      factor.transmission.courier.user &&
                      factor.transmission.courier.users.full_name
                        ? factor.transmission.courier.user.full_name
                        : '-'
                    }}
                  </p>
                </v-col>
                <v-col
                  class="d-flex flex-column align-center justify-center"
                  cols="4"
                >
                  <div class="mb-2 primary--text font-weight-bold">جنسیت:</div>
                  <p class="mt-2">
                    {{
                      factor.seller &&
                      factor.seller.transmission &&
                      factor.transmission.courier &&
                      factor.transmission.courier.user &&
                      factor.transmission.courier.user.is_male === true
                        ? 'مرد'
                        : factor.seller &&
                          factor.seller.transmission &&
                          factor.transmission.courier &&
                          factor.transmission.courier.user &&
                          factor.transmission.courier.user.is_male === false
                        ? 'زن'
                        : '-'
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
                      factor.seller &&
                      factor.seller.transmission &&
                      factor.transmission.courier &&
                      factor.transmission.courier.user &&
                      factor.transmission.courier.user.phone_number
                        ? factor.transmission.courier.user.phone_number
                        : '-'
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
                      factor.seller &&
                      factor.seller.transmission &&
                      factor.transmission.courier &&
                      factor.transmission.courier.user &&
                      factor.transmission.courier.user.date_joined
                    "
                    class="mt-2"
                  >
                    {{
                      factor.transmission.courier.user.date_joined
                        | jalaliConvert
                    }}
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
                      factor.transmission &&
                      factor.transmission.courier &&
                      factor.transmission.courier.transmission_count
                        ? factor.transmission.courier.transmission_count
                        : '-'
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
                      factor.transmission &&
                      factor.transmission.courier &&
                      factor.transmission.courier.distance_moved
                        ? Math.round(
                            factor.transmission.courier.distance_moved
                          ) / 1000 + ' کیلومتر'
                        : '-'
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
                  <p
                    v-if="
                      factor.transmission &&
                      factor.transmission.courier &&
                      factor.transmission.courier.transmission_time
                    "
                    class="mt-2"
                  >
                    {{
                      factor.transmission.courier.transmission_time
                        | timeConvertor
                    }}
                  </p>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-expand-transition>
      <v-col v-if="factor.return_transmission" class="ma-0 pb-0" cols="12">
        <v-card elevation="0" outlined class="rounded pt-2 px-4">
          <div class="d-flex align-center">
            <div class="mb-2 font-weight-black primary--text">
              اطلاعات سفر بازگشت
            </div>
            <v-spacer></v-spacer>
            <v-icon
              v-if="transBackDivShow"
              class="mt-0 pt-0 mb-2"
              @click="transBackDivShow = !transBackDivShow"
              >mdi-menu-up</v-icon
            >
            <v-icon
              v-else
              class="mt-0 pt-0 mb-2"
              @click="transBackDivShow = !transBackDivShow"
              >mdi-menu-down</v-icon
            >
          </div>
        </v-card></v-col
      >
      <v-expand-transition>
        <v-row class="mx-0 mt-0" v-if="transBackDivShow">
          <v-col cols="12" md="6" lg="6" xl="6">
            <v-card
              v-if="factor.return_transmission && factor.return_transmission.id"
              @click="goToTransmissionPage(factor.transmission.id)"
              outlined
              class="rounded pa-4"
            >
              <div class="mb-2 font-weight-black primary--text">
                اطلاعات سفر بازگشت
              </div>
              <v-divider></v-divider>
              <v-row class="mt-2">
                <v-col cols="4">
                  <div class="mb-2 primary--text font-weight-bold">
                    هزینه سفیر (تومان):
                  </div>
                  <p class="mt-2">
                    {{
                      factor.return_transmission &&
                      factor.return_transmission.courier_cost
                        ? factor.return_transmission.courier_cost
                        : '-'
                    }}
                  </p>
                </v-col>
                <v-col cols="4">
                  <div class="mb-2 primary--text font-weight-bold">کمسیون:</div>
                  <p class="mt-2">
                    {{
                      factor.return_transmission &&
                      factor.return_transmission.commission
                        ? factor.return_transmission.commission
                        : '-'
                    }}
                  </p>
                </v-col>
                <v-col cols="4">
                  <div class="mb-2 primary--text font-weight-bold">
                    زمان سفر:
                  </div>
                  <p
                    v-if="
                      factor.return_transmission &&
                      factor.return_transmission.transfer_time
                    "
                    class="mt-2"
                  >
                    {{
                      factor.return_transmission.transfer_time | timeConvertor
                    }}
                  </p>
                </v-col>
              </v-row>
            </v-card>
            <v-card
              v-if="
                factor.return_transmission &&
                factor.return_transmission.courier &&
                factor.return_transmission.courier.vehicle &&
                factor.return_transmission.courier.vehicle.color
              "
              @click="goToTransmissionPage(factor.return_transmission.id)"
              outlined
              class="rounded pa-4 mt-3"
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
                  <div class="mb-2 primary--text font-weight-bold">نام:</div>
                  <p class="mt-2 mr-2">
                    {{
                      factor.seller &&
                      factor.seller.return_transmission &&
                      factor.return_transmission.courier &&
                      factor.return_transmission.courier.vehicle &&
                      factor.return_transmission.courier.vehicle.name
                        ? factor.return_transmission.courier.vehicle.name
                        : '-'
                    }}
                  </p>
                </v-col>
                <v-col
                  class="d-flex flex-column align-center justify-center"
                  cols="4"
                >
                  <div class="mb-2 primary--text font-weight-bold">نوع:</div>
                  <p class="mt-2 mr-2">
                    {{
                      factor.seller &&
                      factor.seller.return_transmission &&
                      factor.return_transmission.courier &&
                      factor.return_transmission.courier.vehicle &&
                      factor.return_transmission.courier.vehicle.type
                        ? factor.return_transmission.courier.vehicle.type
                        : '-'
                    }}
                  </p>
                </v-col>
                <v-col
                  class="d-flex flex-column align-center justify-center"
                  cols="4"
                >
                  <div class="mb-2 primary--text font-weight-bold">رنگ:</div>
                  <p class="mt-2 mr-2">
                    {{
                      factor.seller &&
                      factor.seller.return_transmission &&
                      factor.return_transmission.courier &&
                      factor.return_transmission.courier.vehicle &&
                      factor.return_transmission.courier.vehicle.color
                        ? factor.return_transmission.courier.vehicle.color
                        : '-'
                    }}
                  </p>
                </v-col>
                <v-col
                  class="d-flex flex-column align-center justify-center"
                  cols="4"
                >
                  <div class="mb-2 primary--text font-weight-bold">پلاک:</div>
                  <p class="mt-2 mr-2">
                    {{
                      factor.seller &&
                      factor.seller.return_transmission &&
                      factor.return_transmission.courier &&
                      factor.return_transmission.courier.vehicle &&
                      factor.return_transmission.courier.vehicle.pelak
                        ? factor.return_transmission.courier.vehicle.pelak
                        : '-'
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
                      factor.seller &&
                      factor.seller.return_transmission &&
                      factor.return_transmission.courier &&
                      factor.return_transmission.courier.vehicle &&
                      factor.return_transmission.courier.vehicle.year
                        ? factor.return_transmission.courier.vehicle.year
                        : '-'
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
                      factor.seller &&
                      factor.seller.return_transmission &&
                      factor.return_transmission.courier &&
                      factor.return_transmission.courier.vehicle &&
                      factor.return_transmission.courier.vehicle
                        .have_traffic_plan
                        ? 'دارد'
                        : 'ندارد'
                    }}
                  </p>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col cols="12" md="6" lg="6" xl="6">
            <v-card
              v-if="
                factor.return_transmission &&
                factor.return_transmission.courier &&
                factor.return_transmission.courier.user &&
                factor.return_transmission.courier.user.id
              "
              @click="goToUserPage(factor.return_transmission.courier.user.id)"
              outlined
              class="rounded pa-4"
            >
              <div class="mb-2 font-weight-black primary--text">
                اطلاعات سفیر سفر بازگشت
              </div>
              <v-divider></v-divider>
              <v-row class="mt-2">
                <v-col
                  class="pb-0 d-flex justify-center align-center"
                  cols="12"
                >
                  <v-badge
                    bordered
                    bottom
                    :color="
                      factor.return_transmission &&
                      factor.return_transmission.courier &&
                      factor.return_transmission.courier.is_available
                        ? 'success'
                        : 'error'
                    "
                    offset-x="25"
                    offset-y="20"
                  >
                    <v-avatar size="100" color="grey lighten-2">
                      <v-img
                        v-if="
                          factor.seller &&
                          factor.seller.courier &&
                          factor.seller.courier.user &&
                          factor.seller.courier.user.profile_picture
                        "
                        :src="
                          factor.seller &&
                          factor.seller.courier &&
                          factor.seller.courier.user &&
                          factor.seller.courier.user.profile_picture
                            ? factor.seller.profile_picture
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
                <v-col
                  class="pt-0 d-flex justify-center align-center"
                  cols="12"
                >
                  <div class="mb-2 primary--text font-weight-bold">
                    نام کامل:
                  </div>
                  <p class="mt-2 mr-2">
                    {{
                      factor.seller &&
                      factor.seller.return_transmission &&
                      factor.return_transmission.courier &&
                      factor.return_transmission.courier.user &&
                      factor.return_transmission.courier.users.full_name
                        ? factor.return_transmission.courier.user.full_name
                        : '-'
                    }}
                  </p>
                </v-col>
                <v-col
                  class="d-flex flex-column align-center justify-center"
                  cols="4"
                >
                  <div class="mb-2 primary--text font-weight-bold">جنسیت:</div>
                  <p class="mt-2">
                    {{
                      factor.seller &&
                      factor.seller.return_transmission &&
                      factor.return_transmission.courier &&
                      factor.return_transmission.courier.user &&
                      factor.return_transmission.courier.user.is_male === true
                        ? 'مرد'
                        : factor.seller &&
                          factor.seller.return_transmission &&
                          factor.return_transmission.courier &&
                          factor.return_transmission.courier.user &&
                          factor.return_transmission.courier.user.is_male ===
                            false
                        ? 'زن'
                        : '-'
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
                      factor.seller &&
                      factor.seller.return_transmission &&
                      factor.return_transmission.courier &&
                      factor.return_transmission.courier.user &&
                      factor.return_transmission.courier.user.phone_number
                        ? factor.return_transmission.courier.user.phone_number
                        : '-'
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
                      factor.seller &&
                      factor.seller.return_transmission &&
                      factor.return_transmission.courier &&
                      factor.return_transmission.courier.user &&
                      factor.return_transmission.courier.user.date_joined
                    "
                    class="mt-2"
                  >
                    {{
                      factor.return_transmission.courier.user.date_joined
                        | jalaliConvert
                    }}
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
                      factor.return_transmission &&
                      factor.return_transmission.courier &&
                      factor.return_transmission.courier
                        .return_transmission_count
                        ? factor.return_transmission.courier
                            .return_transmission_count
                        : '-'
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
                      factor.return_transmission &&
                      factor.return_transmission.courier &&
                      factor.return_transmission.courier.distance_moved
                        ? factor.return_transmission.courier.distance_moved
                        : '-'
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
                  <p
                    v-if="
                      factor.return_transmission &&
                      factor.return_transmission.courier &&
                      factor.return_transmission.courier
                        .return_transmission_time
                    "
                    class="mt-2"
                  >
                    {{
                      factor.return_transmission.courier
                        .return_transmission_time | timeConvertor
                    }}
                  </p>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-expand-transition>
    </v-row>
    <Snackbar /><ConfirmModal
      @ok="deleteItem"
      :dialog="confirmDialog"
      :title="'اجناس'"
      @closeDialog="closeConfirmDialog"
    />
    <ErrorModal :dialog="showErrorData" :errorType="errorType" />
  </div>
</template>

<script lang="ts">
import GeneralModule from '~/store/general/index'
import { getModule } from 'vuex-module-decorators'

import { Vue, Component, Watch } from 'vue-property-decorator'

import { FactorModel } from '~/models/api/factor.model'
import { FactorItemModel } from '~/models/api/factor-item.model'

import VuePersianDatetimePicker from 'vue-persian-datetime-picker'

import ConfirmModal from '~/components/modals/ConfirmModal.vue'
import Snackbar from '~/components/common/Snackbar.vue'
import ErrorModal from '~/components/modals/ErrorModal.vue'

import {
  jalaliConvert,
  jalaliConvertWithTime,
  delay,
  factorStatus,
  timeConvertor,
} from '~/helpers/functionality'

@Component({
  middleware: ['permission'],
  components: {
    Snackbar,
    ConfirmModal,
    ErrorModal,
    datePicker: VuePersianDatetimePicker,
  },
  filters: {
    jalaliConvert,
    jalaliConvertWithTime,
    factorStatus,
    timeConvertor,
  },
})
export default class Index extends Vue {
  @Watch('factor.final_price')
  private formatPrice(value: string) {
    if (value && value.length > 0) {
      this.factor.final_price = value
        .toString()
        //@ts-ignore
        .replace(/[\u0660-\u0669]/g, function (c) {
          return c.charCodeAt(0) - 0x0660
        })
        //@ts-ignore
        .replace(/[\u06f0-\u06f9]/g, function (c) {
          return c.charCodeAt(0) - 0x06f0
        })
      let persianNumbers = [
        /۰/g,
        /۱/g,
        /۲/g,
        /۳/g,
        /۴/g,
        /۵/g,
        /۶/g,
        /۷/g,
        /۸/g,
        /۹/g,
      ]
      if (typeof value === 'string') {
        for (var i = 0; i < 10; i++) {
          value = value.replace(persianNumbers[i], i.toString())
        }
      }
      if (Number(value.replace(/[^0-9.-]+/g, '')) > 0) {
        this.factor.final_price = Number(value.replace(/[^0-9.-]+/g, ''))
          .toLocaleString()
          .toString()
      } else {
        if (+this.factor.final_price == 0) {
          return this.factor.final_price
        } else this.factor.final_price = ''
      }
    }
  }
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
  //sender info
  private factorDivShow: boolean = true
  private items: FactorItemModel[] = []
  private transDivShow: boolean = false
  private itemsDivShow: boolean = false
  private transBackDivShow: boolean = false
  private editFactor: boolean = false
  private loading: boolean = false
  private factor: FactorModel = {}
  private beforeEditfactor: FactorModel = {}
  private errorType: string = ''
  private item: FactorItemModel = {}
  private editItemsDialog: boolean = false
  private who_paidList = [
    { name: 'خریدار', value: 'buyer' },
    { name: 'فروشنده', value: 'seller' },
  ]
  private trueFalseList = [
    { name: 'دارد', value: true },
    { name: 'ندارد', value: false },
  ]

  private statusList = [
    { name: 'آماده‌ی پرداخت', value: 'created' },
    { name: 'پرداخت شده', value: 'paid' },
    { name: 'آماده', value: 'ready' },
    { name: 'درحال جستجو', value: 'searching' },
    { name: 'پذیرش سفیر', value: 'accepted' },
    { name: 'رسیدن به مبدا', value: 'arrived' },
    { name: 'دریافت مرسوله', value: 'received' },
    { name: 'در مسیر مقصد', value: 'sending' },
    { name: 'رسیدن به مقصد', value: 'reached' },
    { name: 'تحویل مرسوله', value: 'delivered' },
    { name: 'تایید دریافت کالا', value: 'verified' },
    { name: 'شکست خورده', value: 'failed' },
    { name: 'در حال تست', value: 'testing' },
    { name: 'در حال مرجوع کالا', value: 'returned' },
    { name: 'پذیرش سفیر مرجوعی', value: 'rtrnd_accepted' },
    { name: 'رسیدن به مرجوع کننده', value: 'rtrnd_arrived' },
    { name: 'دریافت مرجوعی', value: 'rtrnd_received' },
    { name: 'رسیدن به فروشنده', value: 'rtrnd_reached' },
    { name: 'تحویل مرجوعی', value: 'rtrnd_delivered' },
    { name: 'تایید دریافت مرجوعی', value: 'rtrnd_verified' },
    { name: 'پایان سفارش', value: 'done' },
  ]

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
      text: 'شناسه',
      value: 'id',
      align: 'start',
      sortable: false,
    },
    {
      text: 'نام کالا',
      value: 'name',
      align: 'start',
      sortable: false,
    },
    {
      text: 'تعداد',
      value: 'number',
      align: 'start',
      sortable: false,
    },
    {
      text: 'کد کالا',
      value: 'barcode',
      align: 'start',
      sortable: false,
    },
    {
      text: 'مبلغ',
      value: 'price',
      align: 'start',
      sortable: false,
    },
    {
      text: 'تخفیف',
      value: 'discount',
      align: 'start',
      sortable: false,
    },
    ,
    {
      text: 'تاریخ',
      value: 'date_added',
      align: 'start',
      sortable: false,
    },
    {
      text: 'توضیحات',
      value: 'description',
      align: 'start',
      sortable: false,
    },
  ]

  private mounted() {
    this.getSenderData()
  }

  private async getSenderData() {
    try {
      this.loading = true
      await this.$axios
        .$get(`/admins/factors/${this.$route.params.id}/`, {
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then((response: any) => {
          this.factor = { ...response }
          this.beforeEditfactor = { ...response }
          this.items = this.items.concat(response.items)
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

  //error page
  private showErrorPage(error: string) {
    this.showError = true
    this.errorType = error
  }
  private get showErrorData() {
    return this.showError
  }
  private goToUserPage(id: number) {
    this.$router.push({
      name: 'user-id',
      params: { id: id ? id?.toString() : '' },
    })
  }
  private goToTransmissionPage(id: number) {
    this.$router.push({
      name: 'transmission-id',
      params: { id: id ? id?.toString() : '' },
    })
  }

  private async deleteItem(id: number) {
    try {
      await this.$axios
        .$delete(`/admins/${id}/`, {
          headers: {
            Authorization: this.$auth.getToken('local'),
          },
        })
        .then(() => {
          this.items = this.items.filter((item) => item.id !== id)
          this.generalModule.toggleSnackbar(true)
          this.generalModule.setSnackbarColor('success')
          this.generalModule.setSnackbarText('ادمین با موفقیت حذف شد')
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
      this.confirmDialog = false
    }
  }
  private close() {
    this.editFactor = false
    this.factor = { ...this.beforeEditfactor }
  }
  private async editFactorDetails() {
    this.factor.final_price = this.factor.final_price
      ?.toString()
      .replaceAll(',', '')
    try {
      this.loading = true
      const data = {
        description: this.factor.description,
        status: this.factor.status,
        has_test_time: this.factor.has_test_time,
        // test_time_expired: this.factor.test_time_expired,
        ...(this.factor.has_test_time
          ? { test_time: this.factor.test_time }
          : {}),
        final_price: this.factor.final_price,
        who_paid: this.factor.who_paid,
      }
      await this.$axios
        .$put(`/admins/factors/${this.$route.params.id}/`, data, {
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then(() => {
          this.generalModule.toggleSnackbar(true)
          this.generalModule.setSnackbarColor('success')
          this.generalModule.setSnackbarText('کد با موفقیت ویرایش شد')
          this.editFactor = false
          this.beforeEditfactor = { ...this.factor }
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

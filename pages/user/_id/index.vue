<template>
  <div style="height: 100%" class="pa-1 courier">
    <v-tabs v-model="tab" align-with-title grow show-arrows>
      <v-tabs-slider color="primary"></v-tabs-slider>
      <v-tab v-for="item in tabItems" :key="item">
        {{ item }}
      </v-tab>
    </v-tabs>
    <v-divider class="mb-4" />
    <v-tabs-items style="height: 94%" v-model="tab">
      <v-tab-item key="اطلاعات کاربر">
        <v-card
          height="100%"
          style="border: none"
          outlined
          class="rounded pa-4"
        >
          <div class="mb-2 font-weight-bold primary--text">اطلاعات فردی</div>
          <v-divider class="mb-4" />
          <v-form ref="form" class="pa-4 full-width" v-if="editMode">
            <div class="d-flex flex-row justify-space-between align-center">
              <v-row>
                <v-col class="d-flex align-center justify-start">
                  وضعیت اکانت:<v-switch
                    class="pr-2"
                    dense
                    inset
                    color="success"
                    hide-details
                    v-model="userDetail.is_authenticated"
                    :label="userDetail.is_authenticated ? 'عادی' : 'مسدود'"
                  ></v-switch>
                </v-col>
              </v-row>
            </div>
            <v-row class="ma-0">
              <v-col
                cols="12"
                class="d-flex flex-column justify-center align-center"
              >
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
              <v-col cols="12" sm="" md="3" lg="3" xl="3">
                <v-text-field
                  dense
                  outlined
                  label="نام و نام‌خانوادگی"
                  color="primary"
                  v-model="userDetail.full_name"
                  autocomplete="off"
                  :rules="[(v) => !!v || 'نام و نام‌خانوادگی الزامی میباشد']"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="3" lg="3" xl="3">
                <v-text-field
                  dense
                  outlined
                  maxLength="11"
                  color="primary"
                  autocomplete="off"
                  label="شماره تماس"
                  :rules="phoneRules"
                  @keypress="onlyNumber"
                  v-model="userDetail.phone_number"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="3" lg="3" xl="3">
                <v-text-field
                  dense
                  outlined
                  label="ایمیل"
                  color="primary"
                  autocomplete="off"
                  :rules="emailRules"
                  v-model="userDetail.email"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="3" lg="3" xl="3">
                <v-text-field
                  dense
                  outlined
                  label="کدملی"
                  maxLength="10"
                  color="primary"
                  autocomplete="off"
                  @keypress="onlyNumber"
                  :rules="nationalCodeRules"
                  v-model="userDetail.national_code"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="3" lg="3" xl="3">
                <v-select
                  dense
                  outlined
                  label="جنسیت"
                  color="primary"
                  :items="genders"
                  v-model="gender"
                  item-text="name"
                  item-value="value"
                  item-color="primary"
                >
                </v-select>
              </v-col>
              <v-col cols="12" md="3" lg="3" xl="3">
                <v-text-field
                  dense
                  outlined
                  hide-details
                  class="mb-8"
                  autocomplete="off"
                  id="my-date-picker"
                  placeholder="تاریخ تولد"
                  v-model="userDetail.birth_date"
                >
                  <template #append>
                    <v-icon>mdi-calendar</v-icon>
                  </template>
                </v-text-field>

                <date-picker
                  color="#F37021"
                  view="year"
                  :clearable="true"
                  format="jYYYY-jMM-jDD"
                  :element="'my-date-picker'"
                  inputFormat="jYYYY-jMM-jDD"
                  v-model="userDetail.birth_date"
                />
              </v-col>
              <v-col cols="12" md="6" lg="6" xl="6">
                <v-text-field
                  dense
                  outlined
                  label="آدرس"
                  maxLength="511"
                  color="primary"
                  autocomplete="off"
                  v-model="userDetail.address"
                >
                </v-text-field>
              </v-col>

              <v-col
                class="d-flex justify-start align-center"
                cols="12"
                md="12"
                lg="12"
                xl="12"
              >
                <div class="ml-4">نقش های کاربر:</div>
                <v-checkbox
                  class="ml-4"
                  v-model="userDetail.is_courier"
                  label="سفیر"
                ></v-checkbox>
                <v-checkbox
                  class="ml-4"
                  v-model="userDetail.is_seller"
                  label="فروشنده"
                ></v-checkbox>
                <v-checkbox
                  class="ml-4"
                  v-model="userDetail.is_sender"
                  label="فرستنده"
                ></v-checkbox>
              </v-col>
              <div class="d-flex flex-row justify-end full-width">
                <v-btn color="grey" class="ml-4" text @click="close">
                  لغو
                </v-btn>
                <v-btn
                  depressed
                  color="primary"
                  :loading="loading"
                  @click="updateCourier"
                  :disabled="formValidation"
                >
                  ثبت تغییرات
                </v-btn>
              </div>
            </v-row>
          </v-form>
          <div v-else>
            <div class="d-flex flex-row justify-space-between align-center">
              <div class="d-flex">
                وضعیت اکانت:<v-chip
                  small
                  class="mx-2"
                  :color="userDetail.is_authenticated ? 'success' : 'error'"
                  >{{ userDetail.is_authenticated ? 'عادی' : 'مسدود' }}</v-chip
                >
              </div>
            </div>
            <v-row class="ma-0">
              <v-col cols="12" class="text-center">
                <div class="d-flex flex-column justify-center align-center">
                  <v-avatar size="100" class="mb-4" color="grey lighten-2">
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
                <div class="mb-4 text-bold primary--text">
                  نام و نام خانوادگی:
                </div>
                <div>
                  {{ userDetail.full_name ? userDetail.full_name : '-' }}
                </div>
              </v-col>
              <v-col cols="12" md="3" lg="3" xl="3">
                <div class="mb-4 text-bold primary--text">جنسیت:</div>
                <div>
                  {{
                    userDetail.is_male == true
                      ? 'مرد'
                      : userDetail.is_male == false
                      ? 'زن'
                      : '-'
                  }}
                </div>
              </v-col>
              <v-col cols="12" md="3" lg="3" xl="3">
                <div class="mb-4 text-bold primary--text">شماره تماس:</div>
                <div>
                  {{ userDetail.phone_number ? userDetail.phone_number : '-' }}
                </div>
              </v-col>
              <v-col cols="12" md="3" lg="3" xl="3">
                <div class="mb-4 text-bold primary--text">ایمیل:</div>
                <div>
                  {{ userDetail.email ? userDetail.email : '-' }}
                </div>
              </v-col>
              <v-col cols="12" md="3" lg="3" xl="3">
                <div class="mb-4 text-bold primary--text">کدملی:</div>
                <div>
                  {{
                    userDetail.national_code ? userDetail.national_code : '-'
                  }}
                </div>
              </v-col>
              <v-col cols="12" md="3" lg="3" xl="3">
                <div class="mb-4 text-bold primary--text">تاریخ تولد:</div>
                <div>
                  {{ userDetail.birth_date ? userDetail.birth_date : '-' }}
                </div>
              </v-col>
              <v-col cols="12" md="6" lg="6" xl="6">
                <div class="mb-4 text-bold primary--text">آدرس:</div>
                <div>
                  {{ userDetail.address ? userDetail.address : '-' }}
                </div>
              </v-col>
              <div class="d-flex flex-row justify-end px-4 full-width mt-4">
                <v-btn depressed color="primary" @click="editMode = true">
                  ویرایش
                </v-btn>
              </div>
            </v-row>
          </div>
          <div class="mb-2 font-weight-bold primary--text">نقش های کاربر</div>
          <v-divider class="mb-4" />
          <v-row>
            <v-col
              v-for="(item, index) in roles.filter(
                (item) => item.title !== 'خریدار'
              )"
              :key="index"
              :cols="
                12 / roles.filter((item) => item.title !== 'خریدار').length
              "
            >
              <v-btn
                @click="goToSelectedRolePage(item.title)"
                height="50px"
                block
                depressed
                color="primary"
                >{{ item.title }}</v-btn
              >
            </v-col>
          </v-row>
        </v-card>
      </v-tab-item>
      <v-tab-item key="اطلاعات مالی">
        <v-card outlined class="rounded pa-4">
          <div class="mb-2 font-weight-bold primary--text">اطلاعات کیف پول</div>
          <v-divider class="mb-4" />
          <v-row justify="center" class="ma-0">
            <v-col cols="12" md="3" lg="3" sm="3">
              <ChangableText
                class="mb-4"
                :loading="loading"
                :subject="'موجودی کیف پول'"
                :valueOfCard="walletDetail.total_amount"
                :unit="'تومان'"
                :type="'total_amount'"
              />
            </v-col>
            <v-col cols="12" md="3" lg="3" sm="3">
              <ChangableText
                class="mb-4"
                :loading="loading"
                :subject="'تعداد سکه'"
                :valueOfCard="walletDetail.coin"
                :type="'coin'"
              />
            </v-col>
            <v-col cols="12" md="3" lg="3" sm="3">
              <ChangableText
                class="mb-4"
                :loading="loading"
                :subject="'مبلغ برداشت شده'"
                :unit="'تومان'"
                :valueOfCard="walletDetail.amount_withdrawn"
                :type="'amount_withdrawn'"
              />
            </v-col>
            <v-col cols="12" md="3" lg="3" sm="3">
              <ChangableText
                class="mb-4"
                :loading="loading"
                :subject="'موجودی قابل برداشت'"
                :unit="'تومان'"
                :valueOfCard="walletDetail.can_withdraw_amount"
                :type="'can_withdraw_amount'"
              />
            </v-col>
          </v-row>
          <div class="mb-2 font-weight-bold primary--text">اطلاعات حساب</div>
          <v-divider class="mb-4" />
          <div class="white pa-4 rounded-10 mb-4">
            <div
              class="d-flex flex-row justify-center align-center"
              v-if="accountLoading"
            >
              <v-progress-circular
                indeterminate
                size="60"
                color="primary"
              ></v-progress-circular>
            </div>
            <div v-if="!accountLoading">
              <template v-if="accounts.length > 0">
                <v-row
                  justify="start"
                  align="end"
                  :key="index"
                  v-for="(item, index) in accounts"
                >
                  <v-col cols="5">
                    <div class="mb-4 text-bold primary--text">شماره شبا:</div>
                    <div class="mt-2">
                      <span class="text-bold primary--text">IR - </span
                      >{{
                        item.sheba_number
                          ? item.sheba_number.substring(
                              item.sheba_number.length - 24
                            )
                          : '-'
                      }}
                    </div>
                  </v-col>
                  <v-col cols="2"
                    ><div class="text-bold primary--text">به نام:</div>
                    <div class="mt-2">
                      {{ item.owner_name ? item.owner_name : '-' }}
                    </div>
                  </v-col>
                  <v-col cols="3"
                    ><div class="text-bold primary--text">تاریخ ثبت:</div>
                    <div class="mt-2">
                      {{ item.date | jalaliConvert }}
                    </div>
                  </v-col>
                  <v-col
                    cols="2"
                    align-self="center"
                    v-if="index === accounts.length - 1"
                  >
                    <div
                      class="pointer d-flex flex-row align-center pt-4"
                      @click="deleteAccount(item.id, index)"
                    >
                      <v-icon color="info" small>mdi-delete</v-icon>
                      <span class="mx-2 info--text">حذف حساب</span>
                    </div>
                  </v-col>
                </v-row>
              </template>
              <v-row v-else align="center" justify="center">
                هنوز حسابی ثبت نشده است
              </v-row>
            </div>
          </div>
          <div class="mb-2 font-weight-bold primary--text">تاریخچه تراکنش</div>
          <v-divider class="mb-4" />
          <v-data-table
            :items="transactions"
            :loader-height="0"
            hide-default-footer
            :headers="transactionsHeader"
            :loading="loading"
            class="elevation-0 mb-8"
            disable-pagination
          >
            <template #[`item.num`]="{ item }">
              <span> {{ transactions.indexOf(item) + 1 }}</span>
            </template>
            <template #[`item.id`]="{ item }">
              <span>{{ item.id ? item.id : '-' }}</span>
            </template>
            <template #[`item.userfull_name`]="{ item }">
              <span>{{ item.full_name ? item.full_name : '-' }}</span>
            </template>
            <template #[`item.full_name`]="{ item }">
              <span>{{ item.full_name ? item.full_name : '-' }}</span>
            </template>
            <template #[`item.amount`]="{ item }">
              <span dir="ltr">{{ item.amount.toLocaleString() }}</span>
            </template>
            <template #[`item.date`]="{ item }">
              <span>{{ item.date | jalaliConvertWithTime }}</span>
            </template>
            <template #[`item.deposit_code`]="{ item }">
              <span>{{ item.deposit_code ? item.deposit_code : '-' }}</span>
            </template>
            <template #[`item.is_deposit`]="{ item }">
              <span>{{ item.is_deposit ? 'واریز وجه' : 'برداشت وجه' }}</span>
            </template>
            <template #[`item.selectedBank`]="{ item }">
              <span>{{ item.selectedBank ? item.selectedBank : '-' }}</span>
            </template>
            <template #[`item.is_successful`]="{ item }">
              <v-chip
                color="#C8E6C9"
                v-if="item.is_successful"
                class="success--text font-weight-black"
                >موفق</v-chip
              >
              <v-chip
                color="#FFCDD2"
                v-else
                class="error--text font-weight-black"
                >ناموفق</v-chip
              >
            </template>
            <template #[`body.append`]>
              <div
                v-if="transactions.length > 0"
                v-intersect.quiet="infiniteScrollingTransactions"
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
      </v-tab-item>
      <v-tab-item key="باشگاه مشتریان">
        <v-card outlined class="rounded px-4 py-16">
          <v-row justify="center" class="px-xl-8 px-lg-16">
            <v-col cols="12" md="3" lg="3" xl="3">
              <DataCard
                :loading="loading"
                :title="'مجموع امتیازات فعلی'"
                :count="
                  cutomerClub.coin ? cutomerClub.coin.toLocaleString() : 0
                "
              /> </v-col
            ><v-col cols="12" md="3" lg="3" xl="3">
              <DataCard
                :loading="loading"
                :title="'مجموع امتیازات استفاده شده'"
                :count="
                  cutomerClub.count_used_coin
                    ? cutomerClub.count_used_coin.toLocaleString()
                    : 0
                "
              />
            </v-col>
            <v-col cols="12" md="3" lg="3" xl="3">
              <DataCard
                :loading="loading"
                :title="'تعداد آفرهای استفاده شده'"
                :count="
                  cutomerClub.used_coin
                    ? cutomerClub.used_coin.toLocaleString()
                    : 0
                "
              />
            </v-col>
          </v-row>
        </v-card>
      </v-tab-item>
      <v-tab-item style="height: 100%" key="پشتیبانی">
        <v-card
          height="100%"
          outlined
          class="rounded pa-4"
          elevation="0"
          style="border: none"
        >
          <div class="font-weight-bold primary--text d-flex">
            <p class="mt-1">تیکت های کاربر</p>
            <v-spacer />
            <v-btn
              v-if="tableMode"
              @click="backStep"
              x-small
              fab
              color="primary"
              depressed
            >
              <v-icon x-small>mdi-arrow-left</v-icon>
            </v-btn>
          </div>

          <v-divider class="mb-2" />
          <v-data-table
            v-if="tableMode"
            :items="tickets"
            :loader-height="0"
            hide-default-footer
            :headers="userTicket"
            :loading="loading"
            class="elevation-0 mb-8"
            disable-pagination
          >
            <template #[`item.done`]="{ item }">
              <div v-if="item.done" title="پاسخ داده شده">
                <v-icon color="success">mdi-email-open</v-icon>
              </div>
              <div v-else title="پاسخ داده نشده">
                <v-icon color="info">mdi-email</v-icon>
              </div>
            </template>
            <template #[`item.num`]="{ item }">
              <span> {{ tickets.indexOf(item) + 1 }}</span>
            </template>
            <template #[`item.timestamp`]="{ item }">
              <span> {{ item.timestamp | jalaliConvertWithTime }}</span>
            </template>
            <template #[`item.subject`]="{ item }">
              <span :title="item.subject" v-if="!more[item.id]">
                {{ item.subject.substring(0, 20) }}</span
              >
              <span
                class="moretext"
                v-if="item.subject.length > 20 && !more[item.id]"
                @click="fillMore(item.id)"
              >
                ...</span
              >
              <span v-if="more[item.id]">{{ item.subject }}</span>
            </template>
            <template #[`item.actions`]="{ item }">
              <v-btn
                icon
                color="error"
                @click="getTicketMessages(item.id, tickets.indexOf(item))"
              >
                <v-icon> mdi-eye </v-icon>
              </v-btn>
            </template>
            <template #[`body.append`]>
              <div
                v-if="tickets.length > 0"
                v-intersect.quiet="infiniteScrollingTickets"
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
          <div
            style="height: 100%"
            class="d-flex justify-start align-center"
            v-else
          >
            <v-row style="height: 100%">
              <v-col
                v-for="(item, index) in roles"
                :style="
                  roles.length == 1
                    ? 'height:100%; width:100%'
                    : roles.length == 2
                    ? 'height:100%; width:100%'
                    : roles.length == 3
                    ? 'height:50%; width:100%'
                    : 'height:50%; width:100%'
                "
                :cols="roles.length == 1 ? 12 : 6"
                :key="index"
              >
                <div
                  @click="getTickets('sender')"
                  v-if="item.title == 'فرستنده'"
                  class="
                    select
                    mt-1
                    ml-1
                    rounded-lg
                    d-flex
                    flex-column
                    justify-center
                    align-center
                  "
                  style="width: 100%; height: 100%; background-color: white"
                >
                  <div class="border">
                    <v-icon class="icon" size="100">mdi-package</v-icon>
                  </div>
                  <h1 class="text font-weight-black">فرستنده</h1>
                </div>
                <div
                  @click="getTickets('seller')"
                  v-if="item.title == 'فروشنده'"
                  class="
                    select
                    mt-1
                    ml-1
                    rounded-lg
                    d-flex
                    flex-column
                    justify-center
                    align-center
                  "
                  style="width: 100%; height: 100%; background-color: white"
                >
                  <div class="border">
                    <v-icon class="icon" size="100">mdi-store</v-icon>
                  </div>
                  <h1 class="text font-weight-black">فروشنده</h1>
                </div>
                <div
                  @click="getTickets('courier')"
                  v-if="item.title == 'سفیر'"
                  class="
                    select
                    mt-1
                    ml-1
                    rounded-lg
                    d-flex
                    flex-column
                    justify-center
                    align-center
                  "
                  style="width: 100%; height: 100%; background-color: white"
                >
                  <div class="border">
                    <v-icon class="icon" size="100">mdi-truck</v-icon>
                  </div>
                  <h1 class="text font-weight-black">سفیر</h1>
                </div>
                <div
                  @click="getTickets('buyer')"
                  v-if="item.title == 'خریدار'"
                  class="
                    select
                    mt-1
                    ml-1
                    rounded-lg
                    d-flex
                    flex-column
                    justify-center
                    align-center
                  "
                  style="width: 100%; height: 100%; background-color: white"
                >
                  <div class="border">
                    <v-icon class="icon" size="100">mdi-account</v-icon>
                  </div>
                  <h1 class="text font-weight-black">خریدار</h1>
                </div>
              </v-col>
            </v-row>
          </div>
        </v-card>
        <MessageDialog
          :dialog="MessageDialog"
          :userPicture="userDetail.profile_picture"
          :userName="userDetail.full_name"
          :messageType="type"
          :messagePriority="priority"
          :message="ticketMessages"
          :loading="loading"
          @closeDialog="closeMessageDialog"
          @send="sendMessage"
        />
      </v-tab-item>
    </v-tabs-items>

    <Snackbar />
    <Uploader
      :open.sync="openUploader"
      @uploadFinish="uploadFinish"
      :type="'avatar'"
    />
    <ErrorModal :dialog="showErrorData" :errorType="errorType" />
  </div>
</template>
<script lang="ts">
import GeneralModule from '~/store/general/index'
import { getModule } from 'vuex-module-decorators'
import { Vue, Component, Watch } from 'vue-property-decorator'

import { UserModel } from '~/models/api/user.model'
import { documentModel } from '~/models/api/document.model'
import { TicketModel } from '~/models/api/ticket.model'
import { MessageModel } from '~/models/api/message-model'
import { CustomerClubModel } from '~/models/api/customer-club-model'
import { TransactionModel } from '~/models/api/transaction.model'

import { CourierVehicleResponseModel } from '~/models/api/response/courier-vehicle-response.model'
import { TransmissionHistoryResponseModel } from '~/models/api/response/transmission-history-response.model'
import { AccountResponseModel } from '~/models/api/response/account-response.model'
import { WalletResponseModel } from '~/models/api/response/wallet-response.model'
import { TicketResponseModel } from '~/models/api/response/ticket-response.model'

import MessageDialog from '~/components/modals/MessageModal.vue'
import Snackbar from '~/components/common/Snackbar.vue'
import Uploader from '~/components/common/Uploader.vue'
import ErrorModal from '~/components/modals/ErrorModal.vue'
import VuePersianDatetimePicker from 'vue-persian-datetime-picker'
import DataCard from '~/components/common/DataCard.vue'
import ChangableText from '~/components/common/ChangableText.vue'

import {
  jalaliConvert,
  jalaliConvertWithTime,
  delay,
} from '~/helpers/functionality'
import MessageModal from '~/components/modals/MessageModal.vue'

@Component({
  middleware: ['permission'],
  components: {
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
  },
})
export default class Index extends Vue {
  [x: string]: any
  private generalModule = getModule(GeneralModule, this.$store)
  @Watch('tab')
  private valueChange(value: number) {
    if (value === 1) {
      this.itemsCurrentPage = 0
      this.itemsPerPage = 25
      this.itemsEnd = false
      this.transactions = []
      this.getTransactionsDetail()
      this.getAccountsDetail()
      this.getWalletDetail()
    } else if (value === 2) {
      this.getCustomerClub()
    }
  }
  private tabItems = [
    'اطلاعات کاربر',
    'اطلاعات مالی',
    'باشگاه مشتریان',
    'پشتیبانی',
  ]
  private itemsCurrentPage: number = 0
  private itemsPerPage: number = 25
  private itemsEnd: boolean = false
  //user info
  private userDetail: UserModel = {}
  private edituserDetail: UserModel = {}
  private editMode: boolean = false
  private value: number = 0
  private roles: { title: string }[] = []
  private openUploader: boolean = false
  private imageSrc = ''
  private imageUrl = ''
  private genders = [
    { name: 'مرد', value: true },
    { name: 'زن', value: false },
  ]
  private gender: boolean = false
  private birthdate: string = ''
  private get accountOwnerNameRules() {
    return [(val: string) => !!val || 'نام الزامی است']
  }

  private get shebaNumberRules() {
    return [
      (val: string) => !!val || 'شماره شبا الزامی است',
      (val: string) =>
        (val && val.length >= 22) || 'شماره شبا باید 22 رقم باشد',
    ]
  }

  //wallet info
  private accountLoading: boolean = false
  private accounts: AccountResponseModel[] = []
  private accountOwnerName: string = ''
  private shebaNumber: string = ''
  private addMode: boolean = false
  private accountSaveLoading: boolean = false
  private accountsEditMode: boolean = false
  private walletDetail: {
    income_sum?: number
    coin?: number
    commission_sum?: number
    is_deposit_sum?: number
  } = {}

  //ticket
  private tickets: TicketModel[] = []
  private priority: string | null | undefined = null
  private type: string | null | undefined = null
  private ticketMessages: MessageModel[] = []
  private tableMode: boolean = false

  //customer club
  private tab: any = ''
  private cutomerClub: CustomerClubModel = {}

  private loading: boolean = false
  private showError: boolean = false
  private errorType: string = ''
  private document: documentModel = {}

  private userTicket = [
    {
      text: 'ردیف',
      value: 'num',
      align: 'start',
      sortable: false,
    },
    {
      text: 'شماره تیکت',
      value: 'id',
      align: 'start',
      sortable: false,
    },
    {
      text: 'تاریخ آخرین تغییر تیکت',
      value: 'timestamp',
      align: 'start',
      sortable: false,
    },
    {
      text: 'موضوع',
      value: 'subject',
      align: 'start',
      sortable: false,
    },
    {
      text: 'وضعیت',
      value: 'done',
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

  private transactions: TransactionModel[] = []
  private transactionsHeader = [
    {
      text: 'ردیف',
      value: 'num',
      align: 'start',
      sortable: false,
    },
    {
      text: 'نام کاربر',
      value: 'user.full_name',
      align: 'start',
      sortable: false,
    },
    {
      text: 'شناسه کاربر ',
      value: 'user.id',
      align: 'start',
      sortable: false,
    },
    {
      text: 'تاریخ  و ساعت',
      value: 'date',
      align: 'start',
      sortable: false,
    },
    {
      text: 'مبلغ تراکنش(تومان)',
      value: 'amount',
      align: 'start',
      sortable: false,
    },
    {
      text: 'کد تایید بانک',
      value: 'deposit_code',
      align: 'start',
      sortable: false,
    },
    {
      text: 'نوع عملیات',
      value: 'is_deposit',
      align: 'start',
      sortable: false,
    },
    {
      text: 'وضعیت',
      value: 'is_successful',
      align: 'start',
      sortable: false,
    },
  ]

  private MessageDialog: boolean = false
  private dialog: boolean = false
  private more: boolean[] = []
  private typeTicket: string = ''

  private async mounted() {
    await this.getUserData()
    this.userRoles()
  }

  //user info
  private async getUserData() {
    try {
      this.loading = true
      await this.$axios
        .$get(`/admins/users/${this.$route.params.id}/`, {
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then((response: UserModel) => {
          this.userDetail = { ...response }
          this.edituserDetail = { ...response }
          //@ts-ignore
          this.imageUrl = response.profile_picture
            ? this.$axios.defaults.baseURL + response.profile_picture
            : ''
          this.gender = response.is_male ? true : false
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

  private async updateCourier() {
    try {
      this.loading = true
      const formData = new FormData()
      if (this.imageSrc) {
        //@ts-ignore
        await formData.append('profile_picture', this.imageSrc)
      }
      //@ts-ignore
      await formData.append('full_name', this.userDetail.full_name)
      //@ts-ignore
      await formData.append('is_courier', this.userDetail.is_courier)
      //@ts-ignore
      await formData.append('is_seller', this.userDetail.is_seller)
      //@ts-ignore
      await formData.append('is_sender', this.userDetail.is_sender)
      //@ts-ignore
      await formData.append('is_male', this.gender)
      //@ts-ignore
      await formData.append('email', this.userDetail.email)
      //@ts-ignore
      await formData.append('national_code', this.userDetail.national_code)
      //@ts-ignore
      await formData.append('phone_number', this.userDetail.phone_number)
      if (this.userDetail.address) {
        await formData.append('address', this.userDetail.address)
      }
      //@ts-ignore
      await formData.append('birth_date', this.userDetail.birth_date)
      await formData.append(
        'is_authenticated',
        //@ts-ignore
        this.userDetail.is_authenticated
      )
      await this.$axios
        .$put(
          `${this.$axios.defaults.baseURL}/admins/users/${this.$route.params.id}/`,
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
          this.generalModule.setSnackbarText(
            'اطلاعات کاربر با موفقیت ویرایش شد'
          )
          this.editMode = false
          this.edituserDetail = { ...this.userDetail }
        })
    } catch (e: any) {
      if (e.response.status === 404 || e.response.status === 500) {
        this.showErrorPage(e.response.status)
      } else {
        for (const [key, value] of Object.entries(e.response.data)) {
          //@ts-ignore
          for (let index = 0; index < value.length; index++) {
            this.generalModule.toggleSnackbar(true)
            this.generalModule.setSnackbarColor('error')
            //@ts-ignore
            this.generalModule.setSnackbarText(value[index])
          }
        }
      }
    } finally {
      await delay(500)
      this.loading = false
    }
  }

  private userRoles() {
    if (this.userDetail.is_courier) {
      this.roles.push({ title: 'سفیر' })
    }
    if (this.userDetail.is_seller) {
      this.roles.push({ title: 'فروشنده' })
    }
    if (this.userDetail.is_sender) {
      this.roles.push({ title: 'فرستنده' })
    }
    this.roles.push({ title: 'خریدار' })
  }
  private goToSelectedRolePage(title: string) {
    let id: String = this.$route.params.id
    if (title === 'سفیر') {
      this.$router.push({
        name: 'courier-id',
        params: { id: id ? id?.toString() : '' },
      })
    }
    if (title === 'فرستنده') {
      this.$router.push({
        name: 'sender-id',
        params: { id: id ? id?.toString() : '' },
      })
    }
    if (title === 'خریدار') {
      this.$router.push({
        name: 'buyer-id',
        params: { id: id ? id?.toString() : '' },
      })
    }
    if (title === 'فروشنده') {
      this.$router.push({
        name: 'seller-id',
        params: { id: id ? id?.toString() : '' },
      })
    }
  }
  private close() {
    this.editMode = false
    this.userDetail = { ...this.edituserDetail }
  }

  private get formValidation() {
    return (
      !this.userDetail.full_name ||
      !this.userDetail.phone_number ||
      !this.userDetail.national_code ||
      (this.userDetail.national_code &&
        this.userDetail.national_code.length < 10) ||
      (this.userDetail.email &&
        this.userDetail.email.length > 0 &&
        !/.+@.+\..+/.test(this.userDetail.email))
    )
  }

  private get phoneRules() {
    return [
      (val: string) =>
        !val ||
        val.toString().length >= 11 ||
        val.toString().length === 0 ||
        'شماره تماس باید 11 رقم باشد',
    ]
  }

  private get emailRules() {
    return [
      (val: string) =>
        !val ||
        /.+@.+\..+/.test(val) ||
        val.length === 0 ||
        'فرمت ایمیل صحیح نیست',
    ]
  }

  private get nationalCodeRules() {
    if (this.userDetail.national_code) {
      return [
        (val: string) => !!val || 'کد ملی الزامی میباشد',
        (val: string) =>
          val.toString().length >= 10 || 'کد ملی باید 10 رقم باشد',
      ]
    }
  }

  private onlyNumber($event: any) {
    let keyCode = $event.keyCode ? $event.keyCode : $event.which
    if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
      $event.preventDefault()
    }
  }

  //Wallet Details Tab
  private async getWalletDetail() {
    try {
      this.loading = true
      await this.$axios
        .$get(
          `${this.$axios.defaults.baseURL}/admins/wallet/${this.$route.params.id}/`,
          {
            headers: {
              Authorization: this.$auth.getToken('local'),
              Accept: 'application/json; version=1.0;',
            },
          }
        )
        .then((response: WalletResponseModel) => {
          this.walletDetail = response
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
  private async getAccountsDetail() {
    try {
      this.loading = true
      await this.$axios
        .$get(
          `${this.$axios.defaults.baseURL}/user/accounts/${this.$route.params.id}/`,
          {
            headers: {
              Authorization: this.$auth.getToken('local'),
              Accept: 'application/json; version=1.0;',
            },
          }
        )
        .then((response: AccountResponseModel[]) => {
          if (response && response.length > 0) {
            this.accounts = response
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
  private async deleteAccount(id: number, index: number) {
    try {
      await this.$axios
        .$delete(`/admins/accounts/${id}/`, {
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then(() => {
          this.accounts.splice(index, 1)
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
    }
  }
  private async getTransactionsDetail() {
    try {
      this.loading = true
      await this.$axios
        .$get(`admins/transactions/${this.$route.params.id}/`, {
          params: {
            limit: this.itemsPerPage,
            offset: this.itemsCurrentPage,
          },
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then((response: any) => {
          if (response.result) {
            this.transactions = this.transactions.concat(response.result)
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

  //customer club
  private async getCustomerClub() {
    try {
      this.loading = true
      await this.$axios
        .$get(`/admins/customer-club/?courier_id=${this.$route.params.id} `, {
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then((response: CustomerClubModel) => {
          this.cutomerClub = response
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

  //Support

  private closeMessageDialog() {
    this.MessageDialog = false
    this.ticketMessages = []
  }
  private confirmMessageDialog() {
    this.MessageDialog = false
  }
  private fillMore(v: number) {
    for (let index = 0; index < this.tickets.length; index++) {
      this.more = new Array(index).fill(false)
    }
    this.more[v] = true
    return this.more
  }

  private async getTicketMessages(id: number, index: number) {
    this.MessageDialog = true
    try {
      this.loading = true
      await this.$axios
        .$get(`/admins/ticket/${id}/?q=${this.typeTicket}`, {
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then((response: TicketModel) => {
          if (response.message) {
            this.ticketMessages = this.ticketMessages.concat(response.message)
          }
        })
      this.loading = false
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
      this.ticketMessagesDetail(index)
    }
  }

  private async sendMessage(text: string, ticket_id: number, file: any) {
    try {
      let data = new FormData()
      data.append('ticket_id', ticket_id.toString())
      data.append('text', text)
      data.append('file1', file)
      await this.$axios.$post(`/admins/ticket/?q=${this.typeTicket}`, data, {
        headers: {
          Authorization: this.$auth.getToken('local'),
          Accept: 'application/json; version=1.0;',
        },
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
      this.accountSaveLoading = false
    }
  }
  private async getTickets(type: string) {
    this.typeTicket = type
    try {
      this.loading = true
      await this.$axios
        .$get(`/admins/ticket/`, {
          params: {
            q: type,
            user_id: this.$route.params.id,
            limit: this.itemsPerPage,
            offset: this.itemsCurrentPage,
          },
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then((response: TicketResponseModel) => {
          if (response.result) {
            this.tickets = this.tickets.concat(response.result)
          }
          if (response.next === null) {
            this.ticketsEnd = true
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
      this.tableMode = true
    }
  }

  private ticketMessagesDetail(index: number) {
    this.priority = this.tickets[index].priority
    this.type = this.tickets[index].type
  }

  private showErrorPage(error: string) {
    this.showError = true
    this.errorType = error
  }

  private get showErrorData() {
    return this.showError
  }
  private get separateDistance() {
    return this.transmissionHistory.total_distance
      ? this.transmissionHistory.total_distance.toLocaleString()
      : '-'
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

  //infinite scroll
  private async infiniteScrollingTickets(entries: any, value: number) {
    if (!this.ticketsEnd && entries[0].intersectionRatio > 0) {
      this.ticketsCurrentPage = this.ticketsCurrentPage + this.ticketsPerPage
      await this.getTicketDetail()
    }
  }
  private async infiniteScrollingTransactions(entries: any, value: number) {
    if (!this.itemsEnd && entries[0].intersectionRatio > 0) {
      this.itemsCurrentPage = this.itemsCurrentPage + this.itemsPerPage
      await this.getTransactionsDetail()
    }
  }

  private backStep() {
    this.tickets = []
    this.itemsCurrentPage = 0
    this.itemsEnd = false
    this.tableMode = false
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
.v-avatar {
  position: relative;
  top: 0.5em;
}
.border {
  border-color: gray;
  border-radius: 10%;
  border-style: solid;
  border-width: 3px;
  padding: 15px;
  .icon {
    color: gray;
  }
}
.text {
  margin-top: 10px;
  color: gray;
}
:hover.select {
  cursor: pointer;
  background-image: linear-gradient(to right, #fcb224, #f48c3a) !important;
  .text {
    color: white;
  }
  .icon {
    color: white;
  }
  .border {
    border-color: white;
  }
}
</style>

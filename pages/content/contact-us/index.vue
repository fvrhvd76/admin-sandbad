<template>
  <div class="full-height py-8 px-4">
    <v-card min-height="100%" class="ma-1 mb-2 pa-2">
      <div class="text-bold gery--text">راه های ارتباطی</div>
      <v-divider class="mt-2 mb-4" />
      <v-row justify="center" class="ma-0">
        <v-col class="py-0" cols="12" md="6" lg="6" xl="6">
          <v-text-field
            label="آدرس اکانت"
            full-width
            class="mb-2"
            outlined
            color="primary"
            dense
            hide-details
            v-model="account_nameSocials"
          />
        </v-col>
        <v-col class="ma-0 py-0" cols="12" md="6" lg="6" xl="6">
          <v-select
            dense
            outlined
            hide-details
            v-model="titleSocials"
            :menu-props="{ offsetY: true }"
            color="primary"
            item-text="name"
            class="py-0 mb-2"
            item-value="value"
            :items="titleSocialsList"
            item-color="primary"
            label="عنوان"
          />
        </v-col>
        <v-col class="py-0" cols="12">
          <v-text-field
            label="توضیحات"
            outlined
            color="primary"
            dense
            v-model="descriptionSocials"
          />
        </v-col>
        <v-col
          class="py-0 mt-1 d-flex justify-end"
          cols="12"
          md="12"
          lg="12"
          sm="12"
        >
          <v-btn dense color="primary" text @click="clearFields1" class="ml-4">
            پاک کردن
          </v-btn>
          <v-btn
            dense
            depressed
            color="primary"
            @click="setSocial()"
            :disabled="
              !account_nameSocials || !descriptionSocials || !titleSocials
            "
          >
            ارسال
          </v-btn>
        </v-col>
        <v-col class="mb-8" cols="12">
          <v-data-table
            :items="socials"
            :headers="headersSocials"
            :loader-height="0"
            :loading="loading"
            hide-default-footer
            class="elevation-0 pointer"
            disable-pagination
          >
            <template #top>
              <v-toolbar style="cursor: auto" flat>
                <v-toolbar-title>لیست اکانت ها</v-toolbar-title>
              </v-toolbar>
            </template>
            <template #[`item.num`]="{ item }">
              <span> {{ socials.indexOf(item) + 1 }}</span>
            </template>
            <template v-slot:[`item.account_name`]="{ item }">
              <span :title="item.account_name">
                {{
                  item.account_name
                    ? item.account_name.length > 10
                      ? item.account_name.substring(0, 10) + '...'
                      : item.account_name
                    : '-'
                }}</span
              >
            </template>
            <template v-slot:[`item.title`]="{ item }">
              {{ item.title ? item.title : '-' }}
            </template>
            <template v-slot:[`item.description`]="{ item }">
              {{ item.description ? item.description : '-' }}
            </template>
            <template v-slot:[`item.date`]="{ item }">
              {{ item.date | jalaliConvert }}
            </template>
            <template #[`item.actions`]="{ item }">
              <v-btn
                color="primary"
                @click="deleteSocial(item.id)"
                fab
                depressed
                x-small
              >
                <v-icon> mdi-delete </v-icon>
              </v-btn>
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
          <!-- <v-dialog width="60%" v-model="editSocialModal">
            <v-card dir="rtl" class="pa-4">
              <div class="mb-2 primary--text font-weight-black">
                ویرایش اطلاعات
              </div>
              <v-divider class="mb-4"></v-divider>
              <v-row>
                <v-col cols="12" md="6" lg="6" xl="6">
                  <v-text-field
                    dense
                    label="شناسه کاربری"
                    outlined
                    v-model="socials[id].account_nameSocials"
                    autofocus
                    hide-details
                    autocomplete="off"
                  />
                </v-col>
                <v-col cols="12" md="6" lg="6" xl="6">
                  <v-select
                    dense
                    outlined
                    hide-details
                    v-model="socials[id].titleSocials"
                    :menu-props="{ offsetY: true }"
                    color="primary"
                    item-text="name"
                    class="py-0"
                    item-value="value"
                    :items="titleSocialsList"
                    item-color="primary"
                    label="عنوان"
                  />
                </v-col>
                <v-col cols="12" md="12" lg="12" xl="12">
                  <v-text-field
                    dense
                    label="توضیحات"
                    outlined
                    v-model="socials[id].description"
                    autofocus
                    autocomplete="off"
                  />
                </v-col>
              </v-row>
              <div>
                <v-col
                  class=" py-0 mt-1 d-flex justify-end"
                  cols="12"
                  md="12"
                  lg="12"
                  sm="12"
                >
                  <v-btn
                    dense
                    color="primary"
                    text
                    @click="editSocialModal = false"
                    class="ml-4"
                  >
                    لغو
                  </v-btn>
                  <v-btn dense depressed color="primary" @click="editSocial()">
                    ذخیره
                  </v-btn>
                </v-col>
              </div>
            </v-card>
          </v-dialog> -->
        </v-col>
      </v-row>
      <div class="text-bold gery--text">اطلاعات تماس</div>
      <v-divider class="mt-2 mb-4" />
      <v-row justify="center" class="ma-0">
        <v-col class="py-0" cols="12" md="6" lg="6">
          <v-text-field
            label="عنوان"
            class="mb-2"
            outlined
            color="primary"
            hide-details
            dense
            v-model="titleContact"
          />
        </v-col>
        <v-col class="py-0" cols="12" md="6" lg="6">
          <v-text-field
            label="شماره تماس"
            class="mb-2"
            outlined
            maxLength="11"
            hide-details
            color="primary"
            @keypress="onlyNumber"
            dense
            v-model="PhoneNumberContact"
          />
        </v-col>
        <v-col class="py-0" cols="12" md="12" lg="12" sm="12">
          <v-text-field
            label="توضیحات"
            outlined
            color="primary"
            dense
            v-model="descriptionContact"
          />
        </v-col>
        <v-col
          class="py-0 mt-1 d-flex justify-end"
          cols="12"
          md="12"
          lg="12"
          sm="12"
        >
          <v-btn dense color="primary" text @click="clearFields2" class="ml-4">
            پاک کردن
          </v-btn>
          <v-btn
            dense
            depressed
            color="primary"
            @click="setContact()"
            :disabled="
              !descriptionContact || !titleContact || !PhoneNumberContact
            "
          >
            ارسال
          </v-btn>
        </v-col>
        <v-col cols="12">
          <v-data-table
            :items="contact"
            :headers="headersContact"
            :loader-height="0"
            :loading="loading"
            hide-default-footer
            class="elevation-0 pointer"
            disable-pagination
          >
            <template #top>
              <v-toolbar style="cursor: auto" flat>
                <v-toolbar-title>لیست شماره تماس ها</v-toolbar-title>
              </v-toolbar>
            </template>
            <template #[`item.num`]="{ item }">
              <span> {{ contact.indexOf(item) + 1 }}</span>
            </template>
            <template v-slot:[`item.title`]="{ item }">
              {{ item.title ? item.title : '-' }}
            </template>
            <template v-slot:[`item.phone_number`]="{ item }">
              {{ item.phone_number ? item.phone_number : '-' }}
            </template>
            <template v-slot:[`item.description`]="{ item }">
              {{ item.description ? item.description : '-' }}
            </template>
            <template v-slot:[`item.date`]="{ item }">
              {{ item.date | jalaliConvert }}
            </template>
            <template #[`item.actions`]="{ item }">
              <v-btn
                color="primary"
                @click="deleteContact(item.id)"
                fab
                depressed
                x-small
              >
                <v-icon> mdi-delete </v-icon>
              </v-btn>
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
          <!-- <v-dialog width="60%" v-model="editSocialModal">
            <v-card dir="rtl" class="pa-4">
              <div class="mb-2 primary--text font-weight-black">
                ویرایش اطلاعات
              </div>
              <v-divider class="mb-4"></v-divider>
              <v-row>
                <v-col cols="12" md="6" lg="6" xl="6">
                  <v-text-field
                    dense
                    label="شناسه کاربری"
                    outlined
                    v-model="contact[id].PhoneNumberContact"
                    autofocus
                    hide-details
                    autocomplete="off"
                  />
                </v-col>
                <v-col cols="12" md="6" lg="6" xl="6">
                  <v-select
                    dense
                    outlined
                    hide-details
                    v-model="contact[id].titleSocials"
                    :menu-props="{ offsetY: true }"
                    color="primary"
                    item-text="name"
                    class="py-0"
                    item-value="value"
                    :items="titleSocialsList"
                    item-color="primary"
                    label="عنوان"
                  />
                </v-col>
                <v-col cols="12" md="12" lg="12" xl="12">
                  <v-text-field
                    dense
                    label="توضیحات"
                    outlined
                    v-model="contact[id].description"
                    autofocus
                    autocomplete="off"
                  />
                </v-col>
              </v-row>
              <div>
                <v-col
                  class=" py-0 mt-1 d-flex justify-end"
                  cols="12"
                  md="12"
                  lg="12"
                  sm="12"
                >
                  <v-btn
                    dense
                    color="primary"
                    text
                    @click="editContactModal = false"
                    class="ml-4"
                  >
                    لغو
                  </v-btn>
                  <v-btn dense depressed color="primary" @click="editContact()">
                    ذخیره
                  </v-btn>
                </v-col>
              </div>
            </v-card>
          </v-dialog> -->
        </v-col>
      </v-row>
      <div class="text-bold gery--text">درباره سند باد</div>
      <v-divider class="mt-2 mb-4" />
      <v-row justify="center" class="ma-0" v-if="aboutEditMode">
        <v-col class="py-0" cols="12">
          <v-textarea
            :label="about.description ? 'توضیحات' : 'لطفا توضیحات را وارد کنید'"
            outlined
            color="primary"
            dense
            v-model="about.description"
          />
        </v-col>
        <v-col class="py-0 mt-1 d-flex justify-end" cols="12">
          <v-btn dense color="primary" text @click="clearFields3" class="ml-4">
            لغو
          </v-btn>
          <v-btn
            dense
            depressed
            color="primary"
            @click="setAbout()"
            :disabled="!about.description"
          >
            ارسال
          </v-btn>
        </v-col>
      </v-row>
      <v-row justify="center" class="ma-0" v-else>
        <v-col class="py-0 mb-8" cols="12">
          {{ about.description ? about.description : '-' }}
        </v-col>
        <v-col class="py-0 mt-1 d-flex justify-end" cols="12">
          <v-btn dense depressed color="primary" @click="aboutEditMode = true">
            ویرایش
          </v-btn>
        </v-col>
      </v-row>
      <div class="text-bold gery--text">آدرس</div>
      <v-divider class="mt-2 mb-4" />
      <v-row justify="center" class="ma-0">
        <v-col class="py-0" cols="12" md="6" lg="6">
          <v-text-field
            label="آدرس"
            class="mb-2"
            outlined
            color="primary"
            hide-details
            dense
            v-model="address"
          />
        </v-col>
        <v-col class="py-0" cols="12" md="6" lg="6">
          <v-text-field
            label="لینک گوگل مپ"
            class="mb-2"
            outlined
            hide-details
            color="primary"
            dense
            v-model="link"
          />
        </v-col>
        <v-col
          class="py-0 mt-1 d-flex justify-end"
          cols="12"
          md="12"
          lg="12"
          sm="12"
        >
          <v-btn dense color="primary" text @click="clearFields4" class="ml-4">
            پاک کردن
          </v-btn>
          <v-btn
            dense
            depressed
            color="primary"
            @click="setAddress()"
            :disabled="!address || !link"
          >
            ارسال
          </v-btn>
        </v-col>
        <v-col cols="12">
          <v-data-table
            :items="addresses"
            :headers="headersAddresses"
            :loader-height="0"
            :loading="loading"
            hide-default-footer
            class="elevation-0 pointer"
            disable-pagination
          >
            <template #top>
              <v-toolbar style="cursor: auto" flat>
                <v-toolbar-title>لیست آدرس ها</v-toolbar-title>
              </v-toolbar>
            </template>
            <template #[`item.index`]="{ item }">
              <span> {{ contact.indexOf(item) + 2 }}</span>
            </template>

            <template v-slot:[`item.address`]="{ item }">
              {{
                item.address
                  ? item.address.length > 10
                    ? item.address.substring(0, 10)
                    : item.address
                  : '-'
              }}
            </template>
            <template v-slot:[`item.link`]="{ item }">
              <a
                v-if="item.link"
                :href="item.link"
                class="black--text"
                dir="ltr"
                target="_blank"
              >
                {{
                  item.link.length > 80
                    ? item.link.substring(0, 80) + '...'
                    : item.link
                }}
              </a>
              <span v-else>-</span>
            </template>
            <template v-slot:[`item.date`]="{ item }">
              {{ item.date | jalaliConvert }}
            </template>
            <template #[`item.actions`]="{ item }">
              <v-btn
                color="primary"
                @click="deleteAddress(item.id)"
                fab
                depressed
                x-small
              >
                <v-icon> mdi-delete </v-icon>
              </v-btn>
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
          <!-- <v-dialog width="60%" v-model="editSocialModal">
            <v-card dir="rtl" class="pa-4">
              <div class="mb-2 primary--text font-weight-black">
                ویرایش اطلاعات
              </div>
              <v-divider class="mb-4"></v-divider>
              <v-row>
                <v-col cols="12" md="6" lg="6" xl="6">
                  <v-text-field
                    dense
                    label="شناسه کاربری"
                    outlined
                    v-model="contact[id].PhoneNumberContact"
                    autofocus
                    hide-details
                    autocomplete="off"
                  />
                </v-col>
                <v-col cols="12" md="6" lg="6" xl="6">
                  <v-select
                    dense
                    outlined
                    hide-details
                    v-model="contact[id].titleSocials"
                    :menu-props="{ offsetY: true }"
                    color="primary"
                    item-text="name"
                    class="py-0"
                    item-value="value"
                    :items="titleSocialsList"
                    item-color="primary"
                    label="عنوان"
                  />
                </v-col>
                <v-col cols="12" md="12" lg="12" xl="12">
                  <v-text-field
                    dense
                    label="توضیحات"
                    outlined
                    v-model="contact[id].description"
                    autofocus
                    autocomplete="off"
                  />
                </v-col>
              </v-row>
              <div>
                <v-col
                  class=" py-0 mt-1 d-flex justify-end"
                  cols="12"
                  md="12"
                  lg="12"
                  sm="12"
                >
                  <v-btn
                    dense
                    color="primary"
                    text
                    @click="editContactModal = false"
                    class="ml-4"
                  >
                    لغو
                  </v-btn>
                  <v-btn dense depressed color="primary" @click="editContact()">
                    ذخیره
                  </v-btn>
                </v-col>
              </div>
            </v-card>
          </v-dialog> -->
        </v-col>
      </v-row>
    </v-card>
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

import { Component, Vue, Watch } from 'nuxt-property-decorator'

import FilterModal from '~/components/modals/FilterModal.vue'
import ErrorModal from '~/components/modals/ErrorModal.vue'
import Snackbar from '~/components/common/Snackbar.vue'
import Uploader from '~/components/common/Uploader.vue'

import { delay, jalaliConvert } from '~/helpers/functionality'

@Component({
  middleware: ['permission'],
  components: {
    FilterModal,
    ErrorModal,
    Snackbar,
    Uploader,
  },
  filters: { jalaliConvert },
})
export default class index extends Vue {
  [x: string]: any
  private generalModule = getModule(GeneralModule, this.$store)
  private id: number = 0
  //first
  private openUploader: boolean = false
  private imageSrc = ''
  private imageUrl = ''
  private account_nameSocials: string = ''
  private descriptionSocials: string = ''
  private aboutNotChanged: boolean = true
  private socials: {
    id?: number
    account_name?: string
    title?: string
    description?: string
    date?: string
  }[] = []
  private headersSocials = [
    {
      text: 'ردیف',
      value: 'num',
      align: 'start',
      sortable: false,
    },

    {
      text: 'آدرس اکانت',
      value: 'account_name',
      align: 'start',
      sortable: false,
    },
    {
      text: 'عنوان',
      value: 'title',
      align: 'start',
      sortable: false,
    },

    {
      text: 'تاریخ ایجاد',
      value: 'date',
      align: 'start',
      sortable: false,
    },
    {
      text: 'توضیحات',
      value: 'description',
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
  private headersAddresses = [
    {
      text: 'ردیف',
      value: 'index',
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
      text: 'عنوان',
      value: 'address',
      align: 'start',
      sortable: false,
    },
    {
      text: 'لینک',
      value: 'link',
      align: 'end',
      sortable: false,
    },
    {
      text: '',
      value: 'actions',
      align: 'start',
      sortable: false,
    },
  ]
  private titleSocialsList = [
    { name: 'یوتیوب', value: 'youtube' },
    { name: 'واتساپ', value: 'whatsapp' },
    { name: 'اینستاگرام', value: 'instagram' },
    { name: 'توییتر', value: 'twitter' },
    { name: 'ردیت', value: 'reddit ' },
    { name: 'لینکدین', value: 'linkedin' },
    { name: 'پینترست', value: 'pinterest' },
    { name: 'تلگرام', value: 'telegram' },
  ]
  private titleSocials: string = ''
  private editSocialModal: boolean = false

  //second
  private PhoneNumberContact: string = ''
  private titleContact: string = ''
  private descriptionContact: string = ''
  private contact: {
    id?: number
    phone_number?: string
    title?: string
    description?: string
    date?: string
  }[] = []
  private headersContact = [
    {
      text: 'ردیف',
      value: 'num',
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
      text: 'عنوان',
      value: 'title',
      align: 'start',
      sortable: false,
    },
    {
      text: 'َشماره',
      value: 'phone_number',
      align: 'start',
      sortable: false,
    },

    {
      text: 'تاریخ ایجاد',
      value: 'date',
      align: 'start',
      sortable: false,
    },
    {
      text: 'توضیحات',
      value: 'description',
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
  private editContactModal: boolean = false
  //third
  private description: string = ''
  private about: {
    id?: number
    description?: string
    date?: string
  } = {}
  private address: string = ''
  private link: string = ''
  private addresses: { id?: number; address?: string; link?: string }[] = []
  //main request variables
  private loading: boolean = false
  private showError: boolean = false
  private errorType: string = ''
  private aboutEditMode: boolean = false

  //clear
  private clearFields1() {
    this.account_nameSocials = ''
    this.descriptionSocials = ''
    this.titleSocials = ''
  }
  private clearFields2() {
    this.titleContact = ''
    this.PhoneNumberContact = ''
    this.descriptionContact = ''
  }

  private clearFields3() {
    this.about.description = ''
    this.aboutEditMode = false
  }
  private clearFields4() {
    this.address = ''
    this.link = ''
  }
  private mounted() {
    this.getSocialList()
    this.getAddressList()
    this.getContactList()
    this.getAbout()
  }

  //get request
  private async getSocialList() {
    try {
      this.loading = true
      await this.$axios
        .$get(`/contact-us/social-media/`, {
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then((response: any) => {
          this.socials = response
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
  //post request
  private async setSocial() {
    try {
      const formData = new FormData()
      await formData.append('account_name', this.account_nameSocials)
      await formData.append('title', this.titleSocials)
      await formData.append('description', this.descriptionSocials)
      this.loading = true
      await this.$axios
        .$post(`/contact-us/social-media/`, formData, {
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then((response: any) => {
          this.generalModule.toggleSnackbar(true)
          this.generalModule.setSnackbarColor('success')
          this.generalModule.setSnackbarText('اطلاعات با موفقیت ذخیره شد')
          this.socials = this.socials.concat({
            account_name: this.account_nameSocials,
            title: this.titleSocials,
            description: this.descriptionSocials,
            id: response.id,
          })
          this.account_nameSocials = ''
          this.titleSocials = ''
          this.descriptionSocials = ''
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

  private async deleteSocial(id: number) {
    try {
      this.loading = true
      await this.$axios
        .$delete(`contact-us/social-media/${id}/`, {
          headers: {
            Authorization: this.$auth.getToken('local'),
          },
        })
        .then(() => {
          this.socials = this.socials.filter((item) => item.id !== id)
          this.generalModule.toggleSnackbar(true)
          this.generalModule.setSnackbarColor('success')
          this.generalModule.setSnackbarText('اطلاعات با موفقیت حذف شد')
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

  //get request
  private async getContactList() {
    try {
      this.loading = true
      await this.$axios
        .$get(`/contact-us/phone-numbers/`, {
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then((response: any) => {
          this.contact = response
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
  //post request
  private async setContact() {
    try {
      const formData = new FormData()
      await formData.append('phone_number', this.PhoneNumberContact)
      await formData.append('title', this.titleContact)
      await formData.append('description', this.descriptionContact)
      this.loading = true
      await this.$axios
        .$post(`/contact-us/phone-numbers/`, formData, {
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then((response: any) => {
          this.generalModule.toggleSnackbar(true)
          this.generalModule.setSnackbarColor('success')
          this.generalModule.setSnackbarText('اطلاعات با موفقیت ذخیره شد')
          this.contact = this.contact.concat({
            phone_number: this.PhoneNumberContact,
            title: this.titleContact,
            description: this.descriptionContact,
            id: response.id,
          })
          this.PhoneNumberContact = ''
          this.titleContact = ''
          this.descriptionContact = ''
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

  private async getAddressList() {
    try {
      this.loading = true
      await this.$axios
        .$get(`/contact-us/address/`, {
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then((response: any) => {
          this.addresses = response
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

  private async setAddress() {
    try {
      const formData = new FormData()
      await formData.append('address', this.address)
      await formData.append('link', this.link)
      this.loading = true
      await this.$axios
        .$post(`/contact-us/address/`, formData, {
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then((response: any) => {
          this.generalModule.toggleSnackbar(true)
          this.generalModule.setSnackbarColor('success')
          this.generalModule.setSnackbarText('اطلاعات با موفقیت ذخیره شد')
          this.addresses = this.addresses.concat({
            address: this.address,
            link: this.link,
            id: response.id,
          })
          this.address = ''
          this.link = ''
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
  private async deleteAddress(id: number) {
    try {
      this.loading = true
      await this.$axios
        .$delete(`/contact-us/address/${id}/`, {
          headers: {
            Authorization: this.$auth.getToken('local'),
          },
        })
        .then(() => {
          this.addresses = this.addresses.filter((item) => item.id !== id)
          this.generalModule.toggleSnackbar(true)
          this.generalModule.setSnackbarColor('success')
          this.generalModule.setSnackbarText('اطلاعات با موفقیت حذف شد')
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

  private async deleteContact(id: number) {
    try {
      this.loading = true
      await this.$axios
        .$delete(`contact-us/phone-numbers/${id}/`, {
          headers: {
            Authorization: this.$auth.getToken('local'),
          },
        })
        .then(() => {
          this.contact = this.contact.filter((item) => item.id !== id)
          this.generalModule.toggleSnackbar(true)
          this.generalModule.setSnackbarColor('success')
          this.generalModule.setSnackbarText('اطلاعات با موفقیت حذف شد')
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

  //get request
  private async getAbout() {
    try {
      this.loading = true
      await this.$axios
        .$get(`/contact-us/sandbad-info/`, {
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then((response: any) => {
          this.about = response
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
  private onlyNumber($event: any) {
    let keyCode = $event.keyCode ? $event.keyCode : $event.which
    if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
      $event.preventDefault()
    }
  }
  //post request
  private async setAbout() {
    try {
      const formData = new FormData()
      await formData.append(
        'description',
        this.about.description ? this.about.description : ''
      )
      this.loading = true
      await this.$axios
        .$patch(`/contact-us/sandbad-info/`, formData, {
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then(() => {
          this.generalModule.toggleSnackbar(true)
          this.generalModule.setSnackbarColor('success')
          this.generalModule.setSnackbarText('اطلاعات با موفقیت ذخیره شد')
          this.about.description = this.description
          this.aboutEditMode = false
          this.description = ''
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

  private async deleteAbout() {
    try {
      this.loading = true
      await this.$axios
        .$delete(`contact-us/sandbad-info/`, {
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then(() => {
          this.about.description = ''
          this.generalModule.toggleSnackbar(true)
          this.generalModule.setSnackbarColor('success')
          this.generalModule.setSnackbarText('اطلاعات با موفقیت حذف شد')
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

  //error functions
  private get showErrorData() {
    return this.showError
  }
  private showErrorPage(error: string) {
    this.showError = true
    this.errorType = error
  }
}
</script>

<style lang="scss">
.full-height {
  height: 92%;
}
</style>

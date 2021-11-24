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
            <v-col cols="12" class="font-20">ویرایش اطلاعات ادمین</v-col>
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
                label="نام"
                color="primary"
                v-model="adminDetail.first_name"
                autocomplete="off"
                :rules="[(v) => !!v || 'نام الزامی میباشد']"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="4" lg="4" xl="4">
              <v-text-field
                dense
                outlined
                label="نام‌خانوادگی"
                color="primary"
                v-model="adminDetail.last_name"
                autocomplete="off"
                :rules="[(v) => !!v || 'نام‌خانوادگی الزامی میباشد']"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="4" lg="4" xl="4">
              <v-text-field
                dense
                outlined
                color="primary"
                label="نام‌کاربری"
                v-model="adminDetail.username"
                autocomplete="off"
                :rules="[(v) => !!v || 'نام‌کاربری الزامی میباشد']"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6" lg="6" xl="6">
              <v-text-field
                dense
                outlined
                maxLength="11"
                color="primary"
                autocomplete="off"
                label="شماره تماس"
                :rules="phoneRules"
                v-model="adminDetail.phone_number"
                @keypress="onlyNumber"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6" lg="6" xl="6">
              <v-text-field
                dense
                outlined
                label="ایمیل"
                color="primary"
                v-model="adminDetail.email"
                autocomplete="off"
                :rules="emailRules"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <v-divider></v-divider>
            </v-col>
            <v-col cols="12">
              <v-checkbox
                v-model="changePass"
                label="تغییر رمز عبور"
                color="info"
                class="ma-0"
                hide-details
                @change="clearPasswords()"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="6" lg="6" xl="6">
              <v-text-field
                dense
                outlined
                color="primary"
                :disabled="!changePass"
                label="رمز عبور"
                v-model="password"
                :rules="passwordRules"
                autocomplete="new-password"
                :type="passwordShow ? 'text' : 'password'"
                @click:append="passwordShow = !passwordShow"
                :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6" lg="6" xl="6">
              <v-text-field
                dense
                outlined
                color="primary"
                autocomplete="new-password"
                :rules="confirmPassword != password ? confirmPasswordRules : {}"
                :disabled="!changePass"
                label="تایید رمز عبور"
                v-model="confirmPassword"
                :type="confirmPasswordShow ? 'text' : 'password'"
                @click:append="confirmPasswordShow = !confirmPasswordShow"
                :append-icon="confirmPasswordShow ? 'mdi-eye' : 'mdi-eye-off'"
              >
              </v-text-field>
            </v-col>
            <v-col
              cols="12"
              :class="
                $vuetify.breakpoint.xsOnly
                  ? 'd-flex flex-row justify-center px-4 full-width mt-4'
                  : 'd-flex flex-row justify-end px-4 full-width mt-4'
              "
            >
              <v-btn
                :width="$vuetify.breakpoint.xsOnly ? '20%' : ''"
                color="grey"
                class="ml-4"
                text
                @click="close"
                style="font-size: 60%"
              >
                لغو
              </v-btn>
              <v-btn
                :width="$vuetify.breakpoint.xsOnly ? '80%' : ''"
                depressed
                color="primary"
                :loading="loading"
                @click="updateAdmin"
                :disabled="formValidation"
                style="font-size: 60%"
              >
                ویرایش
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>

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
import { Vue, Component } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'

import GeneralModule from '~/store/general/index'

import Snackbar from '~/components/common/Snackbar.vue'
import Uploader from '~/components/common/Uploader.vue'
import ErrorModal from '~/components/modals/ErrorModal.vue'
import { delay } from '~/helpers/functionality'
import { AdminModel } from '~/models/api/admin.model'

@Component({
  middleware: ['permission'],
  components: {
    Snackbar,
    Uploader,
    ErrorModal,
  },
})
export default class Index extends Vue {
  [x: string]: any
  private generalModule = getModule(GeneralModule, this.$store)

  private adminDetail: AdminModel = {}
  private openUploader: boolean = false
  private imageSrc = ''
  private imageUrl = ''
  private changePass: boolean = false
  private password: string = ''
  private confirmPassword: string = ''
  private passwordShow: boolean = false
  private confirmPasswordShow: boolean = false
  private loading: boolean = false
  private showError: boolean = false
  private errorType: string = ''
  private id: string = ''
  private mounted() {
    this.id = this.$route.params.id
    this.getAdminData()
  }

  private async getAdminData() {
    try {
      this.loading = true
      await this.$axios
        .$get(`/admins/${this.id}/`, {
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then((response: AdminModel) => {
          let email: string | null = localStorage.getItem('email')
          if (email === response.email) {
            localStorage.setItem(
              'username', //@ts-ignore
              response.username
            )
            localStorage.setItem(
              'last_name', //@ts-ignore
              response.last_name
            )
            localStorage.setItem(
              'first_name', //@ts-ignore
              response.first_name
            )
            localStorage.setItem(
              'image', //@ts-ignore
              response.image
            )
            localStorage.setItem(
              'phone_number', //@ts-ignore
              response.phone_number
            )
            localStorage.setItem(
              'email', //@ts-ignore
              response.email
            )
          }
          this.adminDetail = response
          //@ts-ignore
          this.imageUrl = response.image
            ? this.$axios.defaults.baseURL + response.image
            : ''
        })
    } catch (e: any) {
      this.generalModule.toggleSnackbar(true)
      this.generalModule.setSnackbarColor('error')
      this.generalModule.setSnackbarText(e.response.data.detail)
    } finally {
      await delay(500)
      this.loading = false
    }
  }

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

  private async updateAdmin() {
    try {
      let id = this.$route.params.id
      this.loading = true
      const formData = new FormData()
      if (this.imageSrc) {
        //@ts-ignore
        await formData.append('image', this.imageSrc)
      }
      //@ts-ignore
      await formData.append('first_name', this.adminDetail.first_name)
      //@ts-ignore
      await formData.append('last_name', this.adminDetail.last_name)
      //@ts-ignore
      await formData.append('username', this.adminDetail.username)
      //@ts-ignore
      await formData.append('phone_number', this.adminDetail.phone_number)
      //@ts-ignore
      await formData.append('email', this.adminDetail.email)
      if (this.changePass) {
        //@ts-ignore
        await formData.append('password', this.password)
      }
      await this.$axios
        .$put(
          `${this.$axios.defaults.baseURL}/admins/${this.$route.params.id}/`,
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
            'اطلاعات ادمین با موفقیت ویرایش شد'
          )
          this.$router.push({ name: 'admins-list' })
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
      await this.getAdminData()
    }
  }

  private close() {
    this.$router.push({ name: 'admins-list' })
  }

  private get formValidation() {
    return (
      !this.adminDetail.first_name ||
      !this.adminDetail.last_name ||
      !this.adminDetail.username ||
      !this.adminDetail.phone_number ||
      !this.adminDetail.email ||
      (this.adminDetail.email.length > 0 &&
        !/.+@.+\..+/.test(this.adminDetail.email)) ||
      (this.changePass &&
        this.password &&
        !/^(?!.*?example)(?=\D*\d)[^a-z]*[a-z].*$/i.test(this.password)) ||
      this.confirmPassword !== this.password
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

  private get passwordRules() {
    return [
      (val: string) => !!val || 'پسورد الزامی است',
      (val: string) =>
        (val && val.length > 0 && val.length >= 8) ||
        'پسورد باید حداقل 8 کاراکتر باشد',
      (val: string) =>
        (val && val.length > 0 && val !== this.userName) ||
        'نام کاربری و پسورد نباید یکسان باشند',
      (val: string) =>
        (val &&
          val.length > 0 &&
          !!val.match(/^(?!.*?example)(?=\D*\d)[^a-z]*[a-z].*$/i)) ||
        'پسورد باید حداقل شامل یک حرف باشد',
    ]
  }

  private get confirmPasswordRules() {
    return [
      (val: string) => !!val || 'تایید پسورد الزامی است',
      (val: string) =>
        (!!val && val.length > 0 && val.length >= 8) ||
        'پسورد باید حداقل 8 کاراکتر باشد',
      (val: string) =>
        (!!val && val.length > 0 && val !== this.userName) ||
        'نام کاربری و پسورد نباید یکسان باشند',
      (val: string) =>
        (!!val &&
          val.length > 0 &&
          !!val.match(/^(?!.*?example)(?=\D*\d)[^a-z]*[a-z].*$/i)) ||
        'پسورد باید حداقل شامل یک حرف باشد',
      (val: string) =>
        val == this.password || 'رمز عبور و تایید رمز عبور باید یکسان باشند',
    ]
  }

  private onlyNumber($event: any) {
    let keyCode = $event.keyCode ? $event.keyCode : $event.which
    if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
      $event.preventDefault()
    }
  }

  private showErrorPage(error: string) {
    this.showError = true
    this.errorType = error
  }
  private clearPasswords() {
    this.password = ''
    this.confirmPassword = ''
  }
  private get showErrorData() {
    return this.showError
  }
}
</script>

<template>
  <div class="full-height py-8 px-4">
    <v-card class="ma-1 mb-2 pa-4">
      <div class="text-bold gery--text">ارسال پیام</div>
      <v-divider class="mt-2 mb-4" />
      <v-row justify="center" class="ma-0">
        <v-col
          class="mb-2 py-0 d-flex justify-space-between"
          cols="12"
          md="12"
          lg="12"
          sm="12"
        >
          <v-select
            dense
            outlined
            hide-details
            v-model="userRole1"
            :menu-props="{ offsetY: true }"
            color="primary"
            item-text="name"
            item-value="value"
            :items="userRoleList1"
            item-color="primary"
            label="انتخاب نقش کاربر"
          ></v-select>
        </v-col>
        <v-col class="py-0" cols="12" md="12" lg="12" sm="12">
          <v-textarea
            label="پیام خود را وارد کنید..."
            outlined
            color="primary"
            dense
            v-model="messageText1"
          />
        </v-col>
        <v-col
          :class="
            $vuetify.breakpoint.mdAndUp
              ? 'py-0 mt-1 d-flex justify-end'
              : 'py-0 mt-1 d-flex flex-column justify-center align-center'
          "
          cols="12"
          md="12"
          lg="12"
          sm="12"
        >
          <v-btn
            :block="!$vuetify.breakpoint.mdAndUp"
            dense
            color="primary"
            text
            @click="clearFields1"
            :class="$vuetify.breakpoint.mdAndUp ? 'ml-4' : 'my-1'"
          >
            پاک کردن
          </v-btn>
          <v-btn
            :block="!$vuetify.breakpoint.mdAndUp"
            :class="$vuetify.breakpoint.mdAndUp ? 'mr-2' : 'my-1'"
            dense
            depressed
            color="primary"
            @click="openConfirmModal('sms')"
            :disabled="isEmpty1"
          >
            ارسال پیامک
          </v-btn>
          <v-btn
            :block="!$vuetify.breakpoint.mdAndUp"
            :class="$vuetify.breakpoint.mdAndUp ? 'mr-2' : 'my-1'"
            dense
            depressed
            color="primary"
            @click="openConfirmModal('pushe')"
            :disabled="isEmpty1"
          >
            ارسال نوتیفیکیشن
          </v-btn>
          <v-btn
            :block="!$vuetify.breakpoint.mdAndUp"
            dense
            depressed
            :class="$vuetify.breakpoint.mdAndUp ? 'mr-2' : 'my-1'"
            color="primary"
            @click="openConfirmModal('email')"
            :disabled="isEmpty1"
          >
            ارسال ایمیل
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
    <Snackbar />
    <Uploader
      :open.sync="openUploader"
      @uploadFinish="uploadFinish"
      :type="'avatar'"
    />
    <ConfirmModal
      @ok="sendMessage"
      :dialog="confirmDialog"
      :title="'ارسال پیام'"
      @closeDialog="closeConfirmDialog"
    />
    <ErrorModal :dialog="showErrorData" :errorType="errorType" />
  </div>
</template>

<script lang="ts">
import GeneralModule from '~/store/general/index'
import { getModule } from 'vuex-module-decorators'

import { Component, Vue } from 'nuxt-property-decorator'

import ConfirmModal from '~/components/modals/ConfirmModal.vue'
import FilterModal from '~/components/modals/FilterModal.vue'
import ErrorModal from '~/components/modals/ErrorModal.vue'
import Snackbar from '~/components/common/Snackbar.vue'
import Uploader from '~/components/common/Uploader.vue'

import { delay } from '~/helpers/functionality'

@Component({
  middleware: ['permission'],
  components: {
    FilterModal,
    ErrorModal,
    Snackbar,
    Uploader,
    ConfirmModal,
  },
})
export default class index extends Vue {
  [x: string]: any
  private generalModule = getModule(GeneralModule, this.$store)
  //confirm modal
  private type: string = ''
  private confirmDialog: boolean = false
  private openConfirmModal(type: string) {
    this.type = type
    this.confirmDialog = true
  }
  private closeConfirmDialog() {
    this.confirmDialog = false
  }

  //change table  target variables
  private platformList1 = [
    { name: 'هر دو', value: 'both' },
    { name: 'اندروید', value: 'android' },
    { name: 'IOS', value: 'ios' },
  ]
  private platform1: string = ''

  private userRoleList1 = [
    { name: 'همه', value: 'all' },
    { name: 'فرستنده ها', value: 'sender' },
    { name: 'فروشندگان', value: 'seller' },
    { name: 'سفیران', value: 'courier' },
  ]
  private userRole1: string = ''

  //change table an target variables
  private platformList2 = [
    { name: 'هر دو', value: 'both' },
    { name: 'اندروید', value: 'android' },
    { name: 'IOS', value: 'ios' },
  ]
  private platform2: string = ''

  private userRoleList2 = [
    { name: 'همه', value: 'all' },
    { name: 'فرستنده ها', value: 'sender' },
    { name: 'فروشندگان', value: 'seller' },
    { name: 'سفیران', value: 'courier' },
  ]
  private userRole2: string = ''

  //main request variables
  private loading: boolean = false
  private showError: boolean = false
  private errorType: string = ''
  private messageText1: string = ''
  private messageText2: string = ''
  private openUploader: boolean = false
  private imageSrc = ''
  private imageUrl = ''

  //clear
  private clearFields1() {
    this.platform1 = ''
    this.messageText1 = ''
    this.userRole1 = ''
  }
  private clearFields2() {
    this.platform2 = ''
    this.messageText2 = ''
    this.userRole2 = ''
    this.imageSrc = ''
    this.imageUrl = ''
  }

  //post request
  private async sendMessage(target: string) {
    try {
      const formData = new FormData()
      await formData.append('role', this.userRole1)
      await formData.append('message', this.messageText1)
      await formData.append('message_type', this.type)
      this.loading = true
      await this.$axios
        .$post(`/admins/send-notification/`, formData, {
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then(() => {
          this.generalModule.toggleSnackbar(true)
          this.generalModule.setSnackbarColor('success')
          this.generalModule.setSnackbarText('پیام ارسال شد')
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
      this.confirmDialog = false
    }
  }
  //error functions
  private get showErrorData() {
    return this.showError
  }
  private showErrorPage(error: string) {
    this.showError = true
    this.errorType = error
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

  private get isEmpty1() {
    if (this.messageText1 === '' || this.userRole1 === '') {
      return true
    } else {
      return false
    }
  }
}
</script>

<style lang="scss">
.full-height {
  height: 100%;
}
</style>

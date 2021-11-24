<template>
  <v-dialog v-model="dialogProp" max-width="800" persistent>
    <v-card dir="rtl">
      <div class="pa-4">
        <v-card-title>
          <span>تعیین دسترسی‌ها</span>
        </v-card-title>

        <v-card-text>
          <v-radio-group
            v-model="role"
            row
            dense
            hide-details
            @change="setPermissions"
          >
            <v-radio label="مدیر ارشد" value="1"></v-radio>
            <v-radio label="مدیر میانی" value="2"></v-radio>
            <v-radio label="اپراتور پشتیبانی" value="3"></v-radio>
            <v-radio label="حسابدار" value="4"></v-radio>
          </v-radio-group>
          <v-divider class="my-4" />
          <v-row class="ma-0" justify="start">
            <v-col
              cols="4"
              :key="index"
              v-for="(item, index) in permissionOptions"
            >
              <v-checkbox
                dense
                hide-details
                v-model="item.value"
                :label="item.faTitle"
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="d-flex flex-row justify-end">
          <v-btn color="grey" text class="ml-4" @click="close"> لغو </v-btn>
          <v-btn depressed color="primary" @click="save" :loading="loading">
            ذخیره
          </v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, PropSync, Vue, Watch } from 'nuxt-property-decorator'
import { getModule } from 'vuex-module-decorators'

import GeneralModule from '~/store/general/index'
import { delay } from '~/helpers/functionality'
import { AdminModel } from '~/models/api/admin.model'

@Component({ components: {} })
export default class PermissionsModal extends Vue {
  [x: string]: any
  @PropSync('dialog') dialogProp!: boolean
  @PropSync('data') adminDataProp!: AdminModel
  @Watch('dialogProp')
  private valueChange(value: boolean) {
    if (value) {
      this.permissionOptions[0].value =
        this.adminDataProp.permissions?.manage_admins || false
      this.permissionOptions[1].value =
        this.adminDataProp.permissions?.manage_users || false
      this.permissionOptions[2].value =
        this.adminDataProp.permissions?.manage_financial || false
      this.permissionOptions[3].value =
        this.adminDataProp.permissions?.manage_supporters || false
      this.permissionOptions[4].value =
        this.adminDataProp.permissions?.manage_discounts || false
      this.permissionOptions[5].value =
        this.adminDataProp.permissions?.send_message || false
      this.permissionOptions[6].value =
        this.adminDataProp.permissions?.view_reports || false
      this.permissionOptions[7].value =
        this.adminDataProp.permissions?.manage_tickets || false
      this.permissionOptions[8].value =
        this.adminDataProp.permissions?.manage_contents || false
      this.permissionOptions[9].value =
        this.adminDataProp.permissions?.manage_transmissions || false
      this.permissionOptions[10].value =
        this.adminDataProp.permissions?.manage_factors || false
    }
  }
  private generalModule = getModule(GeneralModule, this.$store)
  private role: string = '0'
  private permissionOptions = [
    { faTitle: 'مدیریت مدیران', enTitle: 'manage_admins', value: false },
    { faTitle: 'مدیریت کاربران', enTitle: 'manage_users', value: false },
    { faTitle: 'مدیریت مالی', enTitle: 'manage_financial', value: false },
    {
      faTitle: 'مشاهده برترین ها',
      enTitle: 'manage_supporters',
      value: false,
    },
    { faTitle: 'مدیریت باشگاه مشتریان', enTitle: 'manage_discounts', value: false },
    { faTitle: 'ارسال پیام', enTitle: 'send_message', value: false },
    { faTitle: 'مشاهده گزارشات', enTitle: 'view_reports', value: false },
    { faTitle: 'مدیریت تیکت', enTitle: 'manage_tickets', value: false },
    { faTitle: 'مدیریت محتوا', enTitle: 'manage_contents', value: false },
    { faTitle: 'مدیریت سفرها', enTitle: 'manage_transmissions', value: false },
    {
      faTitle: 'مدیریت فاکتورها',
      enTitle: 'manage_factors',
      value: false,
    },
  ]
  private loading: boolean = false

  private setPermissions() {
    if (this.role === '1') {
      this.permissionOptions.forEach((item) => {
        item.value = true
      })
    } else if (this.role === '2') {
      this.permissionOptions.forEach((item, index) => {
        if (index === 0 || index == 6) {
          item.value = false
        } else {
          item.value = true
        }
      })
    } else if (this.role === '3') {
      this.permissionOptions.forEach((item, index) => {
        if (
          index == 1 ||
          index == 3 ||
          index == 5 ||
          index == 7 ||
          index == 8 ||
          index == 9
        ) {
          item.value = true
        } else {
          item.value = false
        }
      })
    } else {
      this.permissionOptions.forEach((item, index) => {
        if (index == 2 || index == 6) {
          item.value = true
        } else {
          item.value = false
        }
      })
    }
  }

  private async save() {
    try {
      this.loading = true
      const data = {
        manage_admins: this.permissionOptions[0].value,
        manage_users: this.permissionOptions[1].value,
        manage_financial: this.permissionOptions[2].value,
        manage_supporters: this.permissionOptions[3].value,
        manage_discounts: this.permissionOptions[4].value,
        send_message: this.permissionOptions[5].value,
        view_reports: this.permissionOptions[6].value,
        manage_tickets: this.permissionOptions[7].value,
        manage_contents: this.permissionOptions[8].value,
        manage_transmissions: this.permissionOptions[9].value,
        manage_factors: this.permissionOptions[10].value,
      }

      await this.$axios
        .$put(
          `${this.$axios.defaults.baseURL}/admins/set-permission/${this.adminDataProp.id}/`,
          data,
          {
            headers: {
              Authorization: this.$auth.getToken("local")
            }
          }
        )
        .then(() => {
          this.generalModule.toggleSnackbar(true);
          this.generalModule.setSnackbarColor("success");
          this.generalModule.setSnackbarText("دسترسی ها با موفقیت تنظیم شدند");
          this.$emit("setPermissions");
        });
      // prettier-ignore
    } catch (e: any) {
      if (e.response.status === 404 || e.response.status === 500) {
        this.$emit('showErrorPage', e.response.status)
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

  private close() {
    this.permissionOptions.forEach((item) => {
      item.value = true
    })
    this.role = '1'
    this.$emit('closeDialog')
  }
}
</script>

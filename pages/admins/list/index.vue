<template>
  <div class="py-8 px-4">
    <v-data-table
      :items="admins"
      :headers="headers"
      :loader-height="0"
      :loading="loading"
      hide-default-footer
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>ادمین‌ها</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            dark
            depressed
            color="primary"
            @click="goToCreateAdminPage"
          >
            <span class="font-16"> افزودن ادمین </span> <v-icon class="mr-2">mdi-plus</v-icon>
          </v-btn>
        </v-toolbar>
      </template>
      <template #[`item.num`]="{ item }">
        <span> {{ admins.indexOf(item) + 1 }}</span>
      </template>
      <template v-slot:[`item.name`]="{ item }">
        {{
          !item.first_name && !item.last_name
            ? '-'
            : item.first_name + ' ' + item.last_name
        }}
      </template>
      <template v-slot:[`item.image`]="{ item }">
        <v-avatar size="70" class="my-2" color="white">
          <v-img :src="$axios.defaults.baseURL + item.image" v-if="item.image">
            <template v-slot:placeholder>
              <v-row class="full-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="primary"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
          <img
            v-else
            src="~/static/default-admins/Male.png"
            style="width: 57%; height: 90%; border-radius: 0"
            class="mt-4"
          />
        </v-avatar>
      </template>
      <template v-slot:[`item.phone_number`]="{ item }">
        {{ item.phone_number ? item.phone_number : '-' }}
      </template>
      <template v-slot:[`item.email`]="{ item }">
        {{ item.email ? item.email : '-' }}
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          small
          text
          class="ml-4"
          outlined
          @click="setAdminsPermission(item)"
        >
          تعیین سطوح دسترسی
        </v-btn>
        <v-btn icon color="grey" @click="selectAdminForEdit(item)" class="ml-4">
          <v-icon> mdi-pencil </v-icon>
        </v-btn>
        <v-btn icon color="error" @click="selectAdminForDelete(item)">
          <v-icon> mdi-delete </v-icon>
        </v-btn>
      </template>
      <template #[`body.append`]>
        <div
          v-if="admins.length > 0"
          v-intersect.quiet="infiniteScrolling"
        ></div>
      </template>
      <template v-slot:no-data>
        <div class="d-flex flex-column justify-center align-center my-4">
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
    <Snackbar />
    <ErrorModal :dialog="showErrorData" :errorType="errorType" />
    <ConfirmModal
      @ok="deleteAdmin"
      :dialog="confirmDialog"
      :title="
        selectedAdmin.first_name && selectedAdmin.last_name
          ? 'حذف کاربر' +
            selectedAdmin.first_name +
            ' ' +
            selectedAdmin.last_name
          : 'حذف کاربر' + selectedAdmin.username
      "
      @closeDialog="closeConfirmDialog"
    />
    <PermissionsModal
      :data="selectedAdminData"
      :dialog="permissionDialog"
      @showErrorPage="showErrorPage"
      @setPermissions="setPermissions"
      @closeDialog="closePermissionDialog"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'

import GeneralModule from '~/store/general/index'
import { delay, jalaliConvert } from '~/helpers/functionality'
import { AdminModel } from '~/models/api/admin.model'
import { AdminsResponseModel } from '~/models/api/response/admins-response.model'

import ErrorModal from '~/components/modals/ErrorModal.vue'
import Snackbar from '~/components/common/Snackbar.vue'
import ConfirmModal from '~/components/modals/ConfirmModal.vue'
import PermissionsModal from '~/components/modals/PermissionsModal.vue'

@Component({
  middleware: ['permission'],
  components: { Snackbar, ErrorModal, ConfirmModal, PermissionsModal },
  filters: {
    jalaliConvert,
  },
})
export default class Index extends Vue {
  [x: string]: any
  private generalModule = getModule(GeneralModule, this.$store)

  private headers = [
    {
      text: 'ردیف',
      value: 'num',
      align: 'start',
      sortable: false,
    },

    {
      text: 'تصویر',
      value: 'image',
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
      text: 'نام کاربری',
      value: 'username',
      align: 'start',
      sortable: false,
    },
    {
      text: 'نام و نام خانوادگی',
      value: 'name',
      align: 'start',
      sortable: false,
    },
    {
      text: 'شماره تماس',
      value: 'phone_number',
      align: 'start',
      sortable: false,
    },
    {
      text: 'ایمیل',
      value: 'email',
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
  private loading: boolean = false
  private admins: AdminModel[] = []
  private adminsCurrentPage: number = 0
  private adminsPerPage: number = 25
  private adminsEnd: boolean = false
  private selectedAdmin: AdminModel = {}
  private selectedAdminIndex: number = -1
  private confirmDialog: boolean = false
  private permissionDialog: boolean = false
  private showError: boolean = false
  private errorType: string = ''

  private mounted() {
    this.getAllAdmins()
  }

  private async getAllAdmins() {
    try {
      this.loading = true
      await this.$axios
        .$get(
          `${this.$axios.defaults.baseURL}/admins/?limit=${this.adminsPerPage}&offset=${this.adminsCurrentPage}`,
          {
            headers: {
              Authorization: this.$auth.getToken('local'),
              Accept: 'application/json; version=1.0;',
            },
          }
        )
        .then((response: AdminsResponseModel) => {
          if (response && response.result && response.result.length > 0) {
            this.admins = this.admins.concat(response.result)
          }

          if (response.next === null) {
            this.adminsEnd = true
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

  private goToCreateAdminPage() {
    this.$router.push({ name: 'admins-create' })
  }

  // private searchByCategory() {
  //   this.adminsEnd = false;
  //   this.admins = [];
  //   this.adminsCurrentPage = 0;
  //   this.getAlladmins();
  // }

  private async infiniteScrolling(entries: any) {
    if (!this.adminsEnd && entries[0].intersectionRatio > 0) {
      this.adminsCurrentPage = this.adminsCurrentPage + this.adminsPerPage
      await this.getAllAdmins()
    }
  }

  private setAdminsPermission(item: AdminModel) {
    this.selectedAdmin = item
    this.permissionDialog = true
  }

  private setPermissions() {
    this.permissionDialog = false
    this.adminsCurrentPage = 0
    this.adminsEnd = false
    this.admins = []
    this.getAllAdmins()
  }

  private closePermissionDialog() {
    this.permissionDialog = false
  }

  private selectAdminForEdit(item: AdminModel) {
    this.$router.push({
      name: 'admin-id',
      params: { id: item.id ? item.id?.toString() : '' },
    })
  }

  private selectAdminForDelete(item: any) {
    this.confirmDialog = true
    this.selectedAdmin = item
  }

  private async deleteAdmin() {
    try {
      this.loading = true
      await this.$axios
        .$delete(
          `${this.$axios.defaults.baseURL}/admins/${this.selectedAdmin.id}/`,
          {
            headers: {
              Authorization: this.$auth.getToken('local'),
            },
          }
        )
        .then(() => {
          this.confirmDialog = false
          this.admins.filter((item: AdminModel, index) => {
            if (item.id === this.selectedAdmin.id) {
              this.selectedAdminIndex = index
            }
            return this.selectedAdminIndex
          })[0]
          this.admins.splice(this.selectedAdminIndex, 1)
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
      this.loading = false
    }
  }

  private closeConfirmDialog() {
    this.confirmDialog = false
  }

  private showErrorPage(error: string) {
    this.showError = true
    this.errorType = error
  }

  private get showErrorData() {
    return this.showError
  }

  private get selectedAdminData() {
    return this.selectedAdmin
  }
}
</script>

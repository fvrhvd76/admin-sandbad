<template>
  <div class="d-flex align-start justify-start full-height pa-2">
    <v-card class="pa-2" width="100%">
      <p class="ma-2 font-20">لیست کدهای این دسته</p>
      <v-divider class="mb-4" />
      <v-row>
        <v-col
          v-for="(code, index) in codes"
          :key="code.id"
          cols="6"
          class="d-flex"
        >
          <v-col cols="1" class="d-flex justify-center align-start">
            <h3 class="font-weight-black mt-3">{{ index + 1 }}-</h3>
          </v-col>
          <v-col cols="4" class="d-flex justify-start align-start">
            <h3 class="font-weight-black mt-2 primary--text">
              شناسه {{ code.id }} :
            </h3>
          </v-col>
          <v-col cols="4" class="d-flex justify-center align-center">
            <h3>{{ codes[index].discount_code }}</h3>
          </v-col>
          <!--           <v-col cols="2" class="d-flex justify-center align-start mt-1">
            <v-icon color="error" v-if="is_used" small>mdi-close-circle</v-icon>
            <v-icon color="success" v-if="is_used" small
              >mdi-close-circle</v-icon
            >
          </v-col> -->
        </v-col>
        <!-- <v-col cols="6" class="d-flex">
          <v-col cols="1" class="d-flex justify-center align-start">
            <h3 class="font-weight-black mt-3">{{ codes.length + 1 }}-</h3>
          </v-col>
          <v-col cols="5">
            <h3 class="font-weight-black mt-2 primary--text">
              اضافه کردن کد جدید:
            </h3>
          </v-col>
          <v-col cols="4" class="d-flex justify-center align-center">
            <v-text-field
              outlined
              dense
              label="کد تخفیف"
              v-model="newCode"
              @input="editMode = true"
            />
          </v-col>
          <v-col cols="2" class="d-flex justify-space-between align-start mt-1">
            <v-icon
              :disabled="!editMode || !newCode"
              @click="addCode()"
              title="اضافه کردن"
              color="info"
              large
              >mdi-plus</v-icon
            >
          </v-col>
        </v-col> -->
      </v-row>
    </v-card>
    <Snackbar />
    <ErrorModal :dialog="showErrorData" :errorType="errorType" />
  </div>
</template>

<script lang="ts">
import GeneralModule from '~/store/general/index'
import { getModule } from 'vuex-module-decorators'

import { Component, Vue } from 'nuxt-property-decorator'

import { CodeModel } from '~/models/api/code.model'

import { CodeResponseModel } from '~/models/api/response/code-response.model'

import FilterModal from '~/components/modals/FilterModal.vue'
import ErrorModal from '~/components/modals/ErrorModal.vue'
import Snackbar from '~/components/common/Snackbar.vue'

import { delay } from '~/helpers/functionality'

@Component({
  middleware: ['permission'],
  components: {
    FilterModal,
    ErrorModal,
    Snackbar,
  },
})
export default class index extends Vue {
  [x: string]: any
  private generalModule = getModule(GeneralModule, this.$store)

  //main request variables
  private loading: boolean = false
  private showError: boolean = false
  private errorType: string = ''
  private itemsCurrentPage: number = 0
  private itemsPerPage: number = 25
  private itemsEnd: boolean = false
  private codes: CodeModel[] = []
  private newCode: string = ''
  private editMode: boolean = false

  private addCode() {
    //add new discount code
  }

  //error functions
  private get showErrorData() {
    return this.showError
  }
  private showErrorPage(error: string) {
    this.showError = true
    this.errorType = error
  }

  //show more
  private async showMore() {
    if (!this.itemsEnd) {
      this.itemsCurrentPage = this.itemsCurrentPage + this.itemsPerPage
      await this.getCodesData()
    }
  }

  private mounted() {
    this.getCodesData()
  }

  //GET method
  private async getCodesData() {
    try {
      this.loading = true
      await this.$axios
        .$get(`admins/discount-code/`, {
          params: {
            offset: this.itemsCurrentPage,
            limit: this.itemsPerPage,
            category_id: this.$route.params.id,
          },
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.2;',
          },
        })
        .then((response: CodeResponseModel) => {
          if (response.result) {
            this.codes = this.codes.concat(response.result)
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

  //PUT request
  private async editCode(id: number, index: number) {
    try {
      this.loading = true
      const data = {
        discount_code: this.codes[index].discount_code,
      }
      await this.$axios
        .$put(
          `${this.$axios.defaults.baseURL}/admins/discount-code/${id}/?category_id=${this.$route.params.id}`,
          data,
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
          this.generalModule.setSnackbarText('کد با موفقیت ویرایش شد')
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

  private async deleteCode(id: number, index: number) {
    try {
      this.loading = true
      await this.$axios
        .$delete(
          `/admins//discount-code/${id}/?category_id=${this.$route.params.id}`,
          {
            headers: {
              Authorization: this.$auth.getToken('local'),
            },
          }
        )
        .then(() => {
          this.codes.splice(index, 1)
          this.generalModule.toggleSnackbar(true)
          this.generalModule.setSnackbarColor('success')
          this.generalModule.setSnackbarText('کد با موفقیت حذف شد')
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
.full-height {
  height: 100%;
}
.full-width {
  width: 100%;
}
</style>

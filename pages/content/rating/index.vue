<template>
  <div class="full-height py-8 px-4">
    <v-card min-height="100%" class="ma-1 mb-2 pa-3">
      <div class="text-bold primary--text">فرم نظرخواهی سفیر</div>
      <v-divider class="mt-2 mb-4" />
      <v-row justify="center" class="ma-0">
        <v-col class="py-0 mt-2" cols="12" md="8" lg="8">
          <v-text-field
            label="متن نظرخواهی"
            outlined
            color="primary"
            dense
            v-model="description"
          />
        </v-col>
        <v-col
          class="ma-0 mb-2 py-0 d-flex justify-center align-center"
          cols="12"
          md="2"
          lg="2"
          xl="2"
        >
          وضعیت:
          <v-switch
            class="mr-4"
            inset
            :label="is_positive ? 'مثبت' : 'منفی'"
            v-model="is_positive"
            color="green"
          />
        </v-col>
        <v-col
          class="py-0 mb-2 d-flex justify-end align-center"
          cols="12"
          md="2"
          lg="2"
          xl="2"
        >
          <v-btn dense color="primary" text @click="clearFields1" class="ml-4">
            پاک کردن
          </v-btn>
          <v-btn
            dense
            depressed
            color="primary"
            @click="setScore()"
            :disabled="!description"
          >
            ارسال
          </v-btn>
        </v-col>
        <v-col cols="12">
          <v-row>
            <v-col cols="12" md="6" lg="6" xl="6">
              <div class="success--text font-weight-bold mb-4">نقاط قوت:</div>
              <div
                v-for="(item, index) in scores"
                :key="index"
                class="d-flex align-center full-width my-1"
              >
                <div v-if="item.is_positive">
                  {{ item.description }}
                </div>
                <v-spacer></v-spacer>
                <div class="d-flex align-center">
                  <v-btn
                    fab
                    class="ml-2"
                    x-small
                    dense
                    depressed
                    v-if="item.is_positive"
                    color="primary"
                    @click="edit(item.id)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    fab
                    x-small
                    dense
                    text
                    depressed
                    v-if="item.is_positive"
                    color="primary"
                    @click="openConfirmModal(item.id)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="6" lg="6" xl="6">
              <div class="error--text font-weight-bold mb-4">نقاط ضعف:</div>
              <div
                v-for="(item, index) in scores"
                :key="index"
                class="d-flex align-center full-width my-1"
              >
                <div v-if="!item.is_positive">
                  {{ item.description }}
                </div>
                <v-spacer></v-spacer>
                <div class="d-flex align-center">
                  <v-btn
                    fab
                    class="ml-2"
                    x-small
                    dense
                    depressed
                    v-if="!item.is_positive"
                    color="primary"
                    @click="edit(item.id)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    fab
                    x-small
                    dense
                    text
                    depressed
                    v-if="!item.is_positive"
                    color="primary"
                    @click="openConfirmModal(item.id)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </div>
              </div>
            </v-col>
          </v-row>
          <v-dialog width="60%" v-model="editModal">
            <v-card dir="rtl" class="pa-4">
              <div class="mb-2 primary--text font-weight-black">
                ویرایش اطلاعات
              </div>
              <v-divider class="mb-4"></v-divider>
              <v-row>
                <v-col cols="12" md="8" lg="8" xl="8">
                  <v-text-field
                    dense
                    label="متن نظرخواهی"
                    outlined
                    v-model="description"
                    autofocus
                    hide-details
                    autocomplete="off"
                  />
                </v-col>
                <v-col
                  class="ma-0 mb-2 py-0 d-flex justify-center align-center"
                  cols="12"
                  md="4"
                  lg="4"
                  xl="4"
                >
                  وضعیت:
                  <v-switch
                    class="mr-4"
                    inset
                    :label="is_positive ? 'مثبت' : 'منفی'"
                    v-model="is_positive"
                    color="green"
                  />
                </v-col>
              </v-row>
              <div>
                <v-col
                  class="py-0 mt-4 d-flex justify-end"
                  cols="12"
                  md="12"
                  lg="12"
                  sm="12"
                >
                  <v-btn dense color="primary" text @click="close" class="ml-4">
                    لغو
                  </v-btn>
                  <v-btn dense depressed color="primary" @click="editIt()">
                    ذخیره
                  </v-btn>
                </v-col>
              </div>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </v-card>
    <Snackbar />
    <ConfirmModal
      @ok="deleteScore"
      :dialog="confirmDialog"
      :title="'نظرخواهی'"
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

import { delay } from '~/helpers/functionality'

@Component({
  middleware: ['permission'],
  components: {
    FilterModal,
    ErrorModal,
    ConfirmModal,
    Snackbar,
  },
})
export default class index extends Vue {
  [x: string]: any

  //confirm modal
  private id1: number = 0
  private confirmDialog: boolean = false
  private openConfirmModal(id: number) {
    this.id1 = id
    this.confirmDialog = true
  }
  private closeConfirmDialog() {
    this.confirmDialog = false
  }
  private generalModule = getModule(GeneralModule, this.$store)
  private id: number = 0
  private editModal: boolean = false
  private is_positive: boolean = true
  private description: string = ''
  private scores: {
    id?: number
    is_positive?: boolean
    description?: string
  }[] = []

  //main request variables
  private loading: boolean = false
  private showError: boolean = false
  private errorType: string = ''

  //clear
  private clearFields1() {
    this.description = ''
    this.is_positive = true
  }

  private mounted() {
    this.getScoresList()
  }

  //get request
  private async getScoresList() {
    try {
      this.loading = true
      await this.$axios
        .$get(`admins/score-options/`, {
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then((response: any) => {
          this.scores = response
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
  private async setScore() {
    try {
      const formData = new FormData()
      await formData.append('description', this.description)
      await formData.append('is_positive', this.is_positive.toString())
      this.loading = true
      await this.$axios
        .$post(`admins/score-options/`, formData, {
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then(() => {
          this.generalModule.toggleSnackbar(true)
          this.generalModule.setSnackbarColor('success')
          this.generalModule.setSnackbarText('اطلاعات با موفقیت ذخیره شد')
          this.scores = this.scores.concat({
            description: this.description,
            is_positive: this.is_positive,
          })
          this.description = ''
          this.is_positive = true
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
  private async editIt() {
    try {
      this.loading = true
      const data = {
        description: this.description,
        is_positive: this.is_positive,
      }
      await this.$axios
        .$put(`admins/score-options/${this.id}/`, data, {
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then(() => {
          this.generalModule.toggleSnackbar(true)
          this.generalModule.setSnackbarColor('success')
          this.generalModule.setSnackbarText('فیلد با موفقیت ویرایش شد')
          let index = this.scores.findIndex((item) => item.id === this.id)
          this.scores[index].description = this.description
          this.scores[index].is_positive = this.is_positive
          this.description = ''
          this.is_positive = true
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
      this.editModal = false
      this.loading = false
    }
  }
  private async deleteScore() {
    try {
      this.loading = true
      await this.$axios
        .$delete(`admins/score-options/${this.id1}`, {
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then(() => {
          this.scores = this.scores.filter((item) => item.id !== this.id1)
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
  private edit(id: number) {
    let score = this.scores.filter((item) => item.id === id)
    //@ts-ignore
    this.description = score[0].description
    //@ts-ignore
    this.is_positive = score[0].is_positive
    this.id = id
    this.editModal = true
  }
  private close() {
    this.is_positive = true
    this.description = ''
    this.editModal = false
  }
}
</script>

<style lang="scss">
.full-height {
  height: 92%;
}
</style>

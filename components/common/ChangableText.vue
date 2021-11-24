<template>
  <v-card style="width: 100% !important" color="primary">
    <v-list-item three-line>
      <v-list-item-content class="card ma-0 pa-0">
        <div class="d-flex">
          <p class="white--text pt-4">{{ subject }}</p>
          <v-spacer />
          <v-icon v-if="type" color="white font-14" @click="edit"
            >mdi-pencil</v-icon
          >
        </div>
        <v-divider color="white" />
        <v-progress-circular
          size="30"
          color="primary"
          indeterminate
          v-if="loadingProp"
        />
        <div v-else class="d-flex justify-space-between white--text">
          <p class="mt-2">
            {{ valueOfCard.toLocaleString() }}
          </p>
          <p class="mt-2 ml-2">{{ unit }}</p>
        </div>
        <transition name="bounce">
          <v-card v-if="editMode" class="editCard">
            <v-text-field
              outlined
              v-model="editedValue"
              autofocus
              autocomplete="off"
              @keypress="onlyNumber"
            />
            <div class="d-flex justify-center">
              <v-btn
                dense
                color="primary"
                text
                @click="editMode = false"
                class="ml-4"
              >
                لغو
              </v-btn>
              <v-btn dense depressed color="primary" @click="openConfirm">
                ذخیره
              </v-btn>
              <v-dialog v-model="confirmDialogModal" width="500px">
                <v-card
                  class="pa-4 d-flex flex-column justify-center align-end"
                >
                  . لطفا اگر از تغیرات خود اطمینان دارید کلمه زیر را وارد کنید
                  <div
                    class="
                      preventCopy
                      font-weight-black
                      full-width
                      d-flex
                      my-4
                      font-20
                      justify-center
                      align-center
                      primary--text
                    "
                    style="
                      border-style: solid;
                      border-size: 2em;
                      padding: 1%;
                      background-color: #fff3e0;
                    "
                  >
                    {{ captcha }}
                  </div>
                  <div class="full-width d-flex -justify-center align-center">
                    <v-text-field
                      full-width
                      class="mb-2"
                      dense
                      hide-details
                      outlined
                      maxlength="5"
                      v-model="confirmChanges"
                      @input="isItSame"
                    />
                  </div>
                  <div class="mt-4 full-width">
                    <v-btn
                      width="200px mr-2"
                      color="primary"
                      depressed
                      :disabled="!isItSame()"
                      @click="confirmChangableText(type, editedValue)"
                    >
                      تایید
                    </v-btn>
                    <v-btn
                      width="100px "
                      color="primary"
                      depressed
                      text
                      @click="confirmDialogModal = false"
                    >
                      لغو
                    </v-btn>
                  </div>
                </v-card>
              </v-dialog>
            </div>
          </v-card>
        </transition>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script lang="ts">
import { getModule } from 'vuex-module-decorators'
import GeneralModule from '~/store/general/index'
import { Component, Prop, PropSync, Vue } from 'nuxt-property-decorator'
import { delay } from '~/helpers/functionality'

@Component({ components: {}, filters: {} })
export default class ChangableText extends Vue {
  [x: string]: any
  private generalModule = getModule(GeneralModule, this.$store)
  @Prop() subject!: string
  @Prop() valueOfCard!: any
  @Prop() type!: string
  @Prop() unit!: string
  @PropSync('loading') loadingProp!: boolean
  private editMode: boolean = false
  private editedValue: number = 0
  private confirmDialogModal: boolean = false
  private confirmChanges: string = ''
  private captcha: string | null = null

  private confirmDialog() {
    this.$emit('confirm')
    this.editMode = false
  }

  private async confirmChangableText(type: string, editedValue: any) {
    try {
      this.editMode = false
      this.loadingProp = true
      let formData = new FormData()
      formData.append(type, editedValue)
      await this.$axios
        .$put(`/admins/wallet/${this.$route.params.id}/`, formData, {
          headers: {
            Authorization: this.$auth.getToken('local'),
            Accept: 'application/json; version=1.0;',
          },
        })
        .then(() => {
          this.generalModule.toggleSnackbar(true)
          this.generalModule.setSnackbarColor('success')
          this.generalModule.setSnackbarText('اطلاعات با موفقیت ویرایش شد')
          this.valueOfCard = editedValue
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
      this.confirmDialogModal = false
    }
  }
  private edit() {
    this.editedValue = this.valueOfCard
    this.editMode = true
  }
  //validation functions
  private onlyNumber($event: any) {
    let keyCode = $event.keyCode ? $event.keyCode : $event.which
    if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
      $event.preventDefault()
    }
  }
  private isItSame() {
    if (this.confirmChanges === this.captcha) {
      return true
    } else return false
  }
  private makeStr(length: number) {
    var result = ''
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var charactersLength = characters.length
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    this.captcha = result
  }
  private openConfirm() {
    this.makeStr(5)
    this.confirmDialogModal = true
  }
}
</script>

<style scoped lang="scss">
.card {
  justify-content: center;

  .editCard {
    z-index: 1;
    position: absolute;
    top: 6em;
    padding: 1em;
    align-content: center;
  }
}

.bounce-enter-active {
  animation: bounce-in 0.3s;
}
.bounce-leave-active {
  animation: bounce-in 0.3s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0.6);
  }
  100% {
    transform: scale(1);
  }
}
.preventCopy {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
}
</style>

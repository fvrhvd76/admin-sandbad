<template>
  <v-dialog v-model="dialogIsOpen" width="80%" persistent>
    <v-card width="100%" height="100%" dir="rtl" color="#EEEEEE" class="pa-4">
      <v-row>
        <v-col class="d-flex justify-start align-center mr-2" cols="12">
          <v-avatar color="orange" class="ml-4" size="62">
            <img
              v-if="userPicture"
              :src="$axios.defaults.baseURL + userPicture"
            />
            <v-icon v-else>mdi-account</v-icon>
          </v-avatar>
          <span v-if="userName">{{ userName }}</span>
          <span v-else>بدون نام</span>
          <v-spacer></v-spacer>
          <v-icon class="d-flex align-start pl-2" fab @click="closeDialog"
            >mdi-close</v-icon
          >
        </v-col>
        <v-col
          v-if="$vuetify.breakpoint.mdAndUp"
          class="d-flex justify-start align-center pr-8"
          cols="12"
          md="6"
          lg="6"
          xl="6"
        >
          نوع پیام :
          <span class="mr-2" v-if="messageType">{{
            messageType === 'financial'
              ? 'مالی'
              : messageType === 'medium'
              ? 'متوسط'
              : 'پایین'
          }}</span>
          <span class="mr-2" v-else>نامشخص</span>
        </v-col>
        <v-col
          v-if="$vuetify.breakpoint.mdAndUp"
          class="d-flex justify-start align-center pr-8"
          cols="12"
          md="6"
          lg="6"
          xl="6"
        >
          اولویت :
          <span class="mr-2" v-if="messagePriority">{{
            messagePriority === 'high'
              ? 'بالا'
              : messagePriority === 'medium'
              ? 'متوسط'
              : 'پایین'
          }}</span>
          <span class="mr-2" v-else>نامشخص</span>
        </v-col>
        <v-col cols="12">
          <v-card
            height="400"
            outlined
            class="scroll rounded-lg overflow-y-auto overflow-x-hidden pa-4"
          >
            <div v-if="!loadingProp && !messageArray[0]" class="test">
              پیامی ارسال نشده است.
            </div>
            <div v-for="(message, index) in messageArray" :key="index">
              <div v-if="!message.is_response" class="d-flex justify-end my-2">
                <v-card
                  max-width="300"
                  min-width="150"
                  flat
                  outlined
                  color="#E0E0E0"
                  class="pa-4 textboxuser"
                >
                  <v-row
                    :dir="message.is_response ? 'rtl' : 'ltr'"
                    class="py-4"
                    align="center"
                    justify="center"
                  >
                    <v-col
                      cols="6"
                      class="d-flex justify-start align-center"
                      v-if="message.file1 && imageFormat1(index)"
                    >
                      <a
                        :href="$axios.defaults.baseURL + message.file1"
                        target="_blank"
                        class="test"
                      >
                        <v-img
                          :aspect-ratio="1"
                          height="5em"
                          width="5em"
                          :src="$axios.defaults.baseURL + message.file1"
                        >
                          <template #placeholder>
                            <v-row class="test" align="center" justify="center">
                              <v-progress-circular
                                indeterminate
                                color="primary"
                              ></v-progress-circular>
                            </v-row>
                          </template>
                        </v-img>
                      </a>
                    </v-col>

                    <v-col
                      cols="6"
                      class="d-flex justify-start align-center"
                      v-if="message.file2 && imageFormat2(index)"
                    >
                      <a
                        :href="$axios.defaults.baseURL + message.file2"
                        target="_blank"
                      >
                        <v-img
                          :aspect-ratio="1"
                          height="5em"
                          width="5em"
                          :src="$axios.defaults.baseURL + message.file2"
                        >
                          <template #placeholder>
                            <v-row class="test" align="center" justify="center">
                              <v-progress-circular
                                indeterminate
                                color="primary"
                              ></v-progress-circular>
                            </v-row>
                          </template>
                        </v-img>
                      </a>
                    </v-col>
                    <v-col
                      cols="6"
                      class="d-flex justify-start align-center"
                      v-if="message.file3 && imageFormat3(index)"
                    >
                      <a
                        :href="$axios.defaults.baseURL + message.file3"
                        target="_blank"
                      >
                        <v-img
                          :aspect-ratio="1"
                          height="5em"
                          width="5em"
                          :src="$axios.defaults.baseURL + message.file3"
                        >
                          <template #placeholder>
                            <v-row class="test" align="center" justify="center">
                              <v-progress-circular
                                indeterminate
                                color="primary"
                              ></v-progress-circular>
                            </v-row>
                          </template>
                        </v-img>
                      </a>
                    </v-col>
                    <v-col
                      cols="6"
                      class="d-flex justify-start align-center"
                      v-if="message.file4 && imageFormat4(index)"
                    >
                      <a
                        :href="$axios.defaults.baseURL + message.file4"
                        target="_blank"
                        class="test"
                      >
                        <v-img
                          :aspect-ratio="1"
                          height="5em"
                          width="5em"
                          :src="$axios.defaults.baseURL + message.file4"
                        >
                          <template #placeholder>
                            <v-row class="test" align="center" justify="center">
                              <v-progress-circular
                                indeterminate
                                color="primary"
                              ></v-progress-circular>
                            </v-row>
                          </template>
                        </v-img>
                      </a>
                    </v-col>
                    <v-col
                      cols="6"
                      class="d-flex justify-start align-center"
                      v-if="message.file5 && imageFormat5(index)"
                    >
                      <a
                        :href="$axios.defaults.baseURL + message.file5"
                        target="_blank"
                        class="test"
                      >
                        <v-img
                          :aspect-ratio="1"
                          height="5em"
                          width="5em"
                          :src="$axios.defaults.baseURL + message.file5"
                        >
                          <template #placeholder>
                            <v-row class="test" align="center" justify="center">
                              <v-progress-circular
                                indeterminate
                                color="primary"
                              ></v-progress-circular>
                            </v-row>
                          </template>
                        </v-img>
                      </a>
                    </v-col>
                  </v-row>
                  <v-row
                    :dir="message.is_response ? 'rtl' : 'ltr'"
                    v-if="message.file1 && !imageFormat1(index)"
                    align="center"
                  >
                    <v-col cols="12" sm="2" md="2" lg="2">
                      <a :href="message.file1" download class="textdecor">
                        <v-icon large>mdi-file</v-icon>
                      </a>
                    </v-col>
                    <v-col
                      class="d-flex align-center"
                      cols="12"
                      sm="10"
                      md="10"
                      lg="10"
                    >
                      <a :href="message.file1" download class="textdecor">
                        <p v-if="message.file1" class="pt-5">
                          {{
                            decodeURI(message.file1.split('/').pop()).substring(
                              0,
                              20
                            )
                          }}...
                        </p>
                      </a>
                    </v-col>
                  </v-row>
                  <v-row
                    :dir="message.is_response ? 'rtl' : 'ltr'"
                    v-if="message.file2 && !imageFormat2(index)"
                    align="center"
                  >
                    <v-col cols="12" sm="2" md="2" lg="2">
                      <a :href="message.file2" download class="textdecor">
                        <v-icon large>mdi-file</v-icon>
                      </a>
                    </v-col>
                    <v-col
                      class="d-flex align-center"
                      cols="12"
                      sm="10"
                      md="10"
                      lg="10"
                    >
                      <a :href="message.file2" download class="textdecor">
                        <p v-if="message.file2" class="pt-5">
                          {{
                            decodeURI(message.file2.split('/').pop()).substring(
                              0,
                              20
                            )
                          }}...
                        </p>
                      </a>
                    </v-col>
                  </v-row>
                  <v-row
                    :dir="message.is_response ? 'rtl' : 'ltr'"
                    v-if="message.file3 && !imageFormat3(index)"
                    align="center"
                  >
                    <v-col cols="12" sm="2" md="2" lg="2">
                      <a :href="message.file3" download class="textdecor">
                        <v-icon large>mdi-file</v-icon>
                      </a>
                    </v-col>
                    <v-col
                      class="d-flex align-center"
                      cols="12"
                      sm="10"
                      md="10"
                      lg="10"
                    >
                      <a :href="message.file3" download class="textdecor">
                        <p v-if="message.file3" class="pt-5">
                          {{
                            decodeURI(message.file3.split('/').pop()).substring(
                              0,
                              20
                            )
                          }}...
                        </p>
                      </a>
                    </v-col>
                  </v-row>
                  <v-row
                    :dir="message.is_response ? 'rtl' : 'ltr'"
                    v-if="message.file4 && !imageFormat4(index)"
                    align="center"
                  >
                    <v-col cols="12" sm="2" md="2" lg="2">
                      <a :href="message.file4" download class="textdecor">
                        <v-icon large>mdi-file</v-icon>
                      </a>
                    </v-col>
                    <v-col
                      class="d-flex align-center"
                      cols="12"
                      sm="10"
                      md="10"
                      lg="10"
                    >
                      <a :href="message.file4" download class="textdecor">
                        <p v-if="message.file4" class="pt-5">
                          {{
                            decodeURI(message.file4.split('/').pop()).substring(
                              0,
                              20
                            )
                          }}...
                        </p>
                      </a>
                    </v-col>
                  </v-row>
                  <v-row
                    :dir="message.is_response ? 'rtl' : 'ltr'"
                    v-if="message.file5 && !imageFormat5(index)"
                    align="center"
                  >
                    <v-col cols="12" sm="2" md="2" lg="2">
                      <a :href="message.file5" download class="textdecor">
                        <v-icon large>mdi-file</v-icon>
                      </a>
                    </v-col>
                    <v-col
                      class="d-flex align-center"
                      cols="12"
                      sm="10"
                      md="10"
                      lg="10"
                    >
                      <a :href="message.file5" download class="textdecor">
                        <p v-if="message.file5" class="pt-5">
                          {{
                            decodeURI(message.file5.split('/').pop()).substring(
                              0,
                              20
                            )
                          }}...
                        </p>
                      </a>
                    </v-col>
                  </v-row>
                  <v-divider v-if="message.file1" />
                  <p class="pt-4">{{ message.text }}</p>
                  <v-row align="end">
                    <v-col
                      class="d-flex justify-start"
                      cols="12"
                      sm="12"
                      md="12"
                      lg="12"
                    >
                      <p class="text-caption mb-0">
                        {{ message.date.substring(0, 10) | jalaliConvert }}
                      </p>
                    </v-col>
                  </v-row>
                </v-card>
                <v-avatar size="50" class="mr-4" color="orange">
                  <img
                    v-if="userPicture"
                    :src="$axios.defaults.baseURL + userPicture"
                    style="width: 100%; height: 100%"
                  />
                  <v-icon style="width: 100%; height: 100%" v-else
                    >mdi-account</v-icon
                  >
                </v-avatar>
              </div>
              <div v-else class="d-flex justify-start my-2">
                <v-avatar
                  size="50"
                  class="d-flex justify-center align-start ml-4"
                  ><img
                    src="~/static/images/logo.png"
                    alt="sandbad admin"
                    style="width: 100%"
                /></v-avatar>
                <v-card
                  flat
                  max-width="300"
                  min-width="150"
                  color="primary"
                  class="pa-4 textboxadmin"
                >
                  <v-row v-if="message.file1">
                    <v-col cols="12" sm="2" md="2" lg="2">
                      <a
                        :href="$axios.defaults.baseURL + message.file1"
                        download
                        target="_blank"
                        class="textdecor"
                      >
                        <v-icon>mdi-file</v-icon>
                      </a>
                    </v-col>
                    <v-col
                      class="d-flex align-center"
                      cols="12"
                      sm="10"
                      md="10"
                      lg="10"
                    >
                      <a
                        :href="$axios.defaults.baseURL + message.file1"
                        download
                        class="textdecor"
                      >
                        <p
                          style="
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                          "
                          class="full-width"
                          v-if="message.file1"
                        >
                          <!-- {{
                            decodeURI(message.file1.split('/').pop()).substring(
                              0,
                              20
                            )
                          }}... -->
                        </p>
                      </a>
                    </v-col>
                  </v-row>
                  <p class="mt-1">{{ message.text }}</p>
                  <v-row align="end">
                    <v-col
                      class="d-flex justify-end"
                      cols="12"
                      sm="12"
                      md="12"
                      lg="12"
                    >
                      <p class="text-caption mb-0">
                        {{ message.date | jalaliConvert }}
                      </p>
                    </v-col>
                  </v-row>
                </v-card>
              </div>
            </div>
            <div class="test" v-if="loadingProp">
              <v-progress-circular
                indeterminate
                size="60"
                color="primary"
              ></v-progress-circular>
            </div>
          </v-card>
          <v-row class="px-3 pb-2 pt-4" align="end">
            <v-text-field
              background-color="white"
              hide-details
              outlined
              placeholder="پیام خود را وارد کنید..."
              class="rounded-lg"
              flat
              v-model="messageText"
              @keydown.enter="sendMessage"
            >
              <template #append>
                <!-- <v-file-input
                  class="ma-0 pa-0 d-flex justify-center align-center"
                  style="height: 10px"
                  v-model="inputFile"
                  accept="image/*, .pdf"
                  label="File input"
                  hide-input
                /> -->
                <v-icon
                  class="send-icon mr-2"
                  dark
                  elevation="0"
                  color="primary"
                  @click="sendMessage"
                >
                  mdi-send
                </v-icon>
              </template>
            </v-text-field>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, PropSync, Prop, Component } from 'nuxt-property-decorator'
import { getModule } from 'vuex-module-decorators'
import GeneralModule from '~/store/general/index'
import { jalaliConvert } from '~/helpers/functionality'
import { MessageModel } from '~/models/api/message-model'

@Component({
  filters: { jalaliConvert },
})
export default class MessageModal extends Vue {
  private generalModule = getModule(GeneralModule, this.$store)
  private inputFile: any = []
  private messageText: string = ''
  @Prop() userPicture!: string
  @Prop() userName!: string
  @Prop() messageType!: string
  @Prop() messagePriority!: string
  @PropSync('message') messageArray!: MessageModel[]
  @PropSync('loading') loadingProp!: boolean
  @PropSync('dialog') dialogIsOpen!: boolean

  private closeDialog() {
    this.$emit('closeDialog')
  }
  private confirmDialog() {
    this.$emit('confirm')
  }
  private scrollToEnd() {
    var container = document.querySelector('.scroll')
    if (container) {
      var scrollHeight = container.scrollHeight
      container.scrollTop = scrollHeight
    }
  }
  private sendMessage() {
    if (this.messageText.length === 0) {
      this.generalModule.toggleSnackbar(true)
      this.generalModule.setSnackbarColor('error')
      this.generalModule.setSnackbarText('متن پیام نمیتواند خالی باشد')
    } else {
      var today: any = new Date()
      var dd = String(today.getDate()).padStart(2, '0')
      var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
      var yyyy = today.getFullYear()
      today = mm + '-' + dd + '-' + yyyy

      let data = {
        is_response: true,
        text: this.messageText,
        ticket_id: this.messageArray[0].ticket_id,
        file1: this.inputFile,
        file2: '',
        file3: '',
        file4: '',
        file5: '',
        date: today,
        unread: false,
      }
      
      this.$emit(
        'send',
        this.messageText,
        this.messageArray[0].ticket_id,
        this.inputFile
      )
      this.messageArray.push(data)
      this.messageText = ''
    }
  }
  private mounted() {
    this.scrollToEnd()
  }
  private updated() {
    this.scrollToEnd()
  }

  private imageFormat1(id: number) {
    if (this.messageArray[id].file1) {
      let formatFile = this.messageArray[id].file1.split('.').pop()
      if (
        formatFile === 'png' ||
        formatFile === 'jpg' ||
        formatFile === 'jpeg'
      ) {
        return true
      } else {
        return false
      }
    }
  }
  private imageFormat2(id: number) {
    if (this.messageArray[id].file2) {
      let formatFile = this.messageArray[id].file2.split('.').pop()
      if (
        formatFile === 'png' ||
        formatFile === 'jpg' ||
        formatFile === 'jpeg'
      ) {
        return true
      } else {
        return false
      }
    }
  }
  private imageFormat3(id: number) {
    if (this.messageArray[id].file3) {
      let formatFile = this.messageArray[id].file3.split('.').pop()
      if (
        formatFile === 'png' ||
        formatFile === 'jpg' ||
        formatFile === 'jpeg'
      ) {
        return true
      } else {
        return false
      }
    }
  }
  private imageFormat4(id: number) {
    if (this.messageArray[id].file4) {
      let formatFile = this.messageArray[id].file4.split('.').pop()
      if (
        formatFile === 'png' ||
        formatFile === 'jpg' ||
        formatFile === 'jpeg'
      ) {
        return true
      } else {
        return false
      }
    }
  }
  private imageFormat5(id: number) {
    if (this.messageArray[id].file5) {
      let formatFile = this.messageArray[id].file5.split('.').pop()
      if (
        formatFile === 'png' ||
        formatFile === 'jpg' ||
        formatFile === 'jpeg'
      ) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.textboxadmin {
  margin-top: 2%;
  -webkit-clip-path: polygon(
    0% 0%,
    100% 0,
    96% 7%,
    96% 100%,
    39% 100%,
    0 100%,
    0% 75%
  );
  clip-path: polygon(0% 0%, 100% 0, 96% 7%, 96% 100%, 39% 100%, 0 100%, 0% 75%);
}
.textboxuser {
  margin-top: 2%;
  -webkit-clip-path: polygon(
    0% 0%,
    100% 0%,
    100% 75%,
    100% 100%,
    75% 100%,
    4% 100%,
    4% 9%
  );
  clip-path: polygon(
    0% 0%,
    100% 0%,
    100% 75%,
    100% 100%,
    75% 100%,
    4% 100%,
    4% 9%
  );
}
.send-icon {
  transform: rotate(180deg);
}
.border {
  border-color: black;
  border-width: thin;
}
.test {
  height: 100%;
  display: flex;
  position: relative;
  place-content: center;
  align-items: center;
}
.textdecor {
  text-decoration: none;
  color: rgb(30, 30, 30);
}
</style>

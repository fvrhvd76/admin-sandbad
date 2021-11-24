<template>
  <v-app>
    <v-navigation-drawer
      app
      fixed
      v-model="drawer"
      :right="$vuetify.rtl"
      width="400"
      class="hiddenscroll"
    >
      <p dir="ltr" class="mt-4 ml-2">
        <v-icon class="mr-2" color="primary">mdi-calendar-clock</v-icon
        >{{ time | jalaliConvertWithTime }}
      </p>
      <div class="d-flex flex-column justify-center align-center mt-4">
        <v-progress-circular
          size="90"
          color="primary"
          indeterminate
          v-if="dataLoading"
        />

        <v-avatar
          v-else
          :size="$vuetify.breakpoint.lg ? '80' : '100'"
          style="
            border-style: solid;
            border-color: #ff9933;
            border-width: 5px;
            background-color: transparent;
          "
        >
          <img :src="$axios.defaults.baseURL + admin.image" />
          <!-- <img
            v-else
            src="~/static/default-admins/Male.png"
            style="width: 57%; height: 90%; border-radius: 0"
            class="mt-4"
          /> -->
        </v-avatar>

        <p class="mt-2 mb-1">{{ adminFullName() }}</p>
        <v-btn
          depressed
          @click="goToAdminEdit()"
          color="#F1F4FD"
          class="rounded-xl"
          style="width: 30%"
          >پروفایل</v-btn
        >
      </div>
      <v-list>
        <!-- <v-list-item>
          <v-list-item-content>
            <v-list-item-title
              class="primary--text d-flex flex-row justify-space-between align-center"
            >
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item> -->
        <v-row class="mb-12" justify="center" align="center">
          <v-col
            :class="
              !$vuetify.breakpoint.xs
                ? 'd-flex align-center justify-center mt-2'
                : 'd-flex align-center justify-center mt-6'
            "
            cols="6"
          >
            <v-btn depressed active-class="active" class="noactive" link to="/">
              <div class="d-flex flex-column mt-6">
                <v-icon :size="$vuetify.breakpoint.lg ? '22' : '35'"
                  >mdi-view-dashboard</v-icon
                >
                <p class="mt-2">داشبورد</p>
              </div>
            </v-btn>
          </v-col>
          <v-col
            v-if="menuOptions.manage_admins"
            :class="
              !$vuetify.breakpoint.xs
                ? 'd-flex align-center justify-center mt-2'
                : 'd-flex align-center justify-center mt-6'
            "
            cols="6"
          >
            <v-btn
              depressed
              active-class="active"
              class="noactive"
              link
              to="/admins/list"
            >
              <div class="d-flex flex-column mt-6">
                <v-icon :size="$vuetify.breakpoint.lg ? '22' : '35'"
                  >mdi-account-tie</v-icon
                >
                <p class="mt-2">مدیران</p>
              </div>
            </v-btn>
          </v-col>
          <v-col
            v-if="menuOptions.manage_users"
            :class="
              !$vuetify.breakpoint.xs
                ? 'd-flex align-center justify-center mt-2'
                : 'd-flex align-center justify-center mt-6'
            "
            cols="6"
          >
            <v-btn
              depressed
              active-class="active"
              class="noactive"
              link
              to="/users/list"
            >
              <div class="d-flex flex-column mt-6">
                <v-icon :size="$vuetify.breakpoint.lg ? '22' : '35'"
                  >mdi-account</v-icon
                >
                <p class="mt-2">کاربران</p>
              </div>
            </v-btn>
          </v-col>
          <v-col
            v-if="menuOptions.manage_financial"
            :class="
              !$vuetify.breakpoint.xs
                ? 'd-flex align-center justify-center mt-2'
                : 'd-flex align-center justify-center mt-6'
            "
            cols="6"
          >
            <v-btn
              depressed
              active-class="active"
              class="noactive"
              link
              to="/transactions/list"
            >
              <div class="d-flex flex-column mt-6">
                <v-icon :size="$vuetify.breakpoint.lg ? '22' : '35'"
                  >mdi-cash-multiple</v-icon
                >
                <p class="mt-2">مالی</p>
              </div>
            </v-btn> </v-col
          ><v-col
            v-if="menuOptions.manage_users"
            :class="
              !$vuetify.breakpoint.xs
                ? 'd-flex align-center justify-center mt-2'
                : 'd-flex align-center justify-center mt-6'
            "
            cols="6"
          >
            <v-btn
              depressed
              active-class="active"
              class="noactive"
              link
              to="/top/"
            >
              <div class="d-flex flex-column mt-6">
                <v-icon :size="$vuetify.breakpoint.lg ? '22' : '35'"
                  >mdi-arrow-up-bold</v-icon
                >
                <p class="mt-2">ترین ها</p>
              </div>
            </v-btn>
          </v-col>
          <v-col
            v-if="menuOptions.manage_discounts"
            :class="
              !$vuetify.breakpoint.xs
                ? 'd-flex align-center justify-center mt-2'
                : 'd-flex align-center justify-center mt-6'
            "
            cols="6"
          >
            <v-btn
              depressed
              active-class="active"
              class="noactive"
              link
              to="/customerclub"
            >
              <div class="d-flex flex-column mt-6">
                <v-icon :size="$vuetify.breakpoint.lg ? '22' : '35'"
                  >mdi-sale</v-icon
                >
                <p class="mt-2">تخفیف</p>
              </div>
            </v-btn> </v-col
          ><v-col
            v-if="menuOptions.send_message"
            :class="
              !$vuetify.breakpoint.xs
                ? 'd-flex align-center justify-center mt-2'
                : 'd-flex align-center justify-center mt-6'
            "
            cols="6"
          >
            <v-btn
              depressed
              active-class="active"
              class="noactive"
              link
              to="/message/create"
            >
              <div class="d-flex flex-column mt-6">
                <v-icon :size="$vuetify.breakpoint.lg ? '22' : '35'"
                  >mdi-bell-ring</v-icon
                >
                <p class="mt-2">پیام ها</p>
              </div>
            </v-btn>
          </v-col>
          <v-col
            v-if="menuOptions.view_reports"
            :class="
              !$vuetify.breakpoint.xs
                ? 'd-flex align-center justify-center mt-2'
                : 'd-flex align-center justify-center mt-6'
            "
            cols="6"
          >
            <v-btn
              depressed
              active-class="active"
              class="noactive"
              link
              to="/reports/list"
            >
              <div class="d-flex flex-column mt-6">
                <v-icon :size="$vuetify.breakpoint.lg ? '22' : '35'"
                  >mdi-clipboard-text-multiple</v-icon
                >
                <p class="mt-2">گزارشات</p>
              </div>
            </v-btn> </v-col
          ><v-col
            v-if="menuOptions.manage_tickets"
            :class="
              !$vuetify.breakpoint.xs
                ? 'd-flex align-center justify-center mt-2'
                : 'd-flex align-center justify-center mt-6'
            "
            cols="6"
          >
            <v-btn
              depressed
              active-class="active"
              class="noactive"
              link
              to="/tickets"
            >
              <div class="d-flex flex-column mt-6">
                <v-icon :size="$vuetify.breakpoint.lg ? '22' : '35'"
                  >mdi-ticket-account</v-icon
                >
                <p class="mt-2">تیکت ها</p>
              </div>
            </v-btn>
          </v-col>
          <v-col
            v-if="menuOptions.manage_contents"
            :class="
              !$vuetify.breakpoint.xs
                ? 'd-flex align-center justify-center mt-2'
                : 'd-flex align-center justify-center mt-6'
            "
            cols="6"
          >
            <v-btn
              depressed
              active-class="active"
              class="noactive"
              link
              to="/content"
            >
              <div class="d-flex flex-column mt-6">
                <v-icon :size="$vuetify.breakpoint.lg ? '22' : '35'"
                  >mdi-semantic-web</v-icon
                >
                <p class="mt-2">مدیریت</p>
              </div>
            </v-btn>
          </v-col>
          <v-col
            v-if="menuOptions.manage_transmissions"
            :class="
              !$vuetify.breakpoint.xs
                ? 'd-flex align-center justify-center mt-2 '
                : 'd-flex align-center justify-center mt-6'
            "
            cols="6"
          >
            <v-btn
              depressed
              active-class="active"
              class="noactive"
              link
              to="/transmissions"
            >
              <div class="d-flex flex-column mt-6">
                <v-icon :size="$vuetify.breakpoint.lg ? '22' : '35'"
                  >mdi-train-car</v-icon
                >
                <p class="mt-2">سفرها</p>
              </div>
            </v-btn>
          </v-col>
          <v-col
            v-if="menuOptions.manage_factors"
            :class="
              !$vuetify.breakpoint.xs
                ? 'd-flex align-center justify-center mt-2 '
                : 'd-flex align-center justify-center mt-6'
            "
            cols="6"
          >
            <v-btn
              depressed
              active-class="active"
              class="noactive"
              link
              to="/factors/list"
            >
              <div class="d-flex flex-column mt-6">
                <v-icon :size="$vuetify.breakpoint.lg ? '22' : '35'"
                  >mdi-clipboard-list-outline</v-icon
                >
                <p class="mt-2">فاکتورها</p>
              </div>
            </v-btn>
          </v-col>
          <!-- <v-col
            v-if="menuOptions.manage_settings"
            :class="
              !$vuetify.breakpoint.xs
                ? 'd-flex align-center justify-center mt-2 '
                : 'd-flex align-center justify-center mt-6 '
            "
            cols="6"
          >
            <v-btn
              depressed
              active-class="active"
              class="noactive"
              link
              to="/setting/app"
            >
              <div class="d-flex flex-column mt-6">
                <v-icon :size="$vuetify.breakpoint.lg ? '22' : '35'"
                  >mdi-cellphone-cog</v-icon
                >
                <p class="mt-2">تنظیمات</p>
              </div>
            </v-btn>
          </v-col> -->
        </v-row>
        <v-list-item
          style="
            position: fixed;
            bottom: 0;
            width: 100%;
            background-color: #f48c3a;
          "
          @click="logout()"
          color="primary"
        >
          <v-list-item-content>
            <v-list-item-title style="color: white"> خروج </v-list-item-title>
          </v-list-item-content>
          <v-list-item-icon>
            <v-icon color="white">mdi-arrow-collapse-left</v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-btn
      depressed
      color="white"
      small
      class="ma-4"
      fab
      style="position: fixed; z-index: 6; opacity: 0.7"
    >
      <v-icon color="black" v-if="!drawer" @click.stop="drawer = true"
        >mdi-menu</v-icon
      >
      <v-icon color="black" v-else @click.stop="drawer = false"
        >mdi-chevron-right</v-icon
      >
    </v-btn>
    <v-main style="background-color: #f1f4fd">
      <nuxt />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'nuxt-property-decorator'
import { getModule } from 'vuex-module-decorators'
import { delay } from '~/helpers/functionality'
import GeneralModule from '~/store/general/index'

import { jalaliConvertWithTime } from '~/helpers/functionality'

@Component({
  filters: {
    jalaliConvertWithTime,
  },
})
export default class Default extends Vue {
  [x: string]: any

  private generalModule = getModule(GeneralModule, this.$store)
  private drawer: boolean = true
  private fixed: boolean = false
  private theme: string = 'light'
  private browserTheme: string = ''
  private title: string = 'سندباد'
  private platform: string = ''
  private loading: boolean = false
  private menuOptions: any = {}
  private time: string = ''
  private admin: any = {}
  private image: string | null = localStorage.getItem('image')
  private dataLoading: boolean = false

  @Watch('$route.name')
  private getData() {
    this.adminFullName()
  }

  private async mounted() {
    await this.getPermissions()
    this.menuOptions = this.generalModule.permissions
    try {
      this.dataLoading = true
      await this.$axios
        .$get('admins/profile/', {
          headers: {
            Authorization: this.$auth.getToken('local'),
          },
        })
        .then((response: any) => {
          localStorage.setItem('username', response.username)
          localStorage.setItem('image', response.image)
          localStorage.setItem('first_name', response.first_name)
          localStorage.setItem('last_name', response.last_name)
          localStorage.setItem('phone_number', response.phone_number)
          localStorage.setItem('email', response.email)
          this.generalModule.setAdminName(
            response.first_name + ' ' + response.last_name
          )
          this.admin = {
            username: response.username,
            image: response.image,
            first_name: response.first_name,
            last_name: response.last_name,
            phone_number: response.phone_number,
            email: response.email,
          }
        })
    } catch (e: any) {
      this.generalModule.toggleSnackbar(true)
      this.generalModule.setSnackbarColor('error')
      this.generalModule.setSnackbarText('اطلاعات ادمین دریافت نشد.')
    } finally {
      await delay(500)
      this.dataLoading = false
    }
    if (window.matchMedia('prefers-color-scheme: dark').matches) {
      this.browserTheme = 'dark'
    } else {
      this.browserTheme = 'light'
    }
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        this.browserTheme = e.matches ? 'dark' : 'light'
      })
    if (!window.localStorage.getItem('isInstalled')) {
      localStorage.setItem('isInstalled', 'false')
    }
    if (navigator.userAgent.indexOf('Android') !== -1) {
      this.platform = 'android'
    } else if (navigator.userAgent.indexOf('like Mac') !== -1) {
      this.platform = 'ios'
    } else {
      this.platform = navigator.platform
    }

    if (window.innerWidth <= 1264) {
      this.drawer = false
    } else {
      this.drawer = true
    }
    setInterval(this.updateTime, 1000)
  }

  private async getPermissions() {
    try {
      this.dataLoading = true
      await this.$axios
        .$get('admins/permissions/', {
          headers: {
            Authorization: this.$auth.getToken('local'),
          },
        })
        .then((response: any) => {
          this.generalModule.setPermissions(response)
        })
    } catch (e: any) {
      this.generalModule.toggleSnackbar(true)
      this.generalModule.setSnackbarColor('error')
      this.generalModule.setSnackbarText(e.response.data.detail)
    } finally {
      await delay(500)
      this.dataLoading = false
    }
  }

  private adminFullName() {
    let name = localStorage.getItem('first_name')
    let last_name = localStorage.getItem('last_name')
    let admin_full_name = name + ' ' + last_name
    admin_full_name = admin_full_name.replace(/null/g, '')
    if (admin_full_name === ' ') {
      return 'ادمین سند باد'
    } else {
      return admin_full_name
    }
  }

  private goToAdminEdit(id: number) {
    this.$router.push({
      name: 'my-account',
    })
  }
  private toggleTheme() {
    if (this.theme === 'light') {
      this.$vuetify.theme.dark = true
      this.theme = 'dark'
    } else if (this.theme === 'dark') {
      if (this.browserTheme === 'light') {
        this.$vuetify.theme.dark = false
      } else {
        this.$vuetify.theme.dark = true
      }
      this.theme = 'auto'
    } else if (this.theme === 'auto') {
      this.$vuetify.theme.dark = false
      this.theme = 'light'
    }
  }

  private updateTime() {
    var cd = new Date()
    this.time = cd.toString()
  }

  private async logout() {
    await this.$auth.logout()
    localStorage.clear()
  }
}
</script>
<style scoped lang="scss">
#app > div > nav > div.v-navigation-drawer__border {
  display: none;
}
.v-navigation-drawer__content {
  overflow: auto;
  white-space: nowrap;
  scrollbar-width: thin;
  scrollbar-color: #4db6ac;
  background-color: transparent;
}

.v-navigation-drawer__content::-webkit-scrollbar-thumb {
  background-color: #4db6ac;
  border-radius: 0px !important;
}

.v-navigation-drawer__content::-webkit-scrollbar {
  width: 0px;
}

.v-navigation-drawer__content::-webkit-scrollbar-track {
  background: transparent;
}

.active {
  color: transparent;
  width: 80px !important;
  height: 80px !important;
  border-radius: 10%;
  box-shadow: 0px 8px 10px 2px rgba(214, 141, 64, 0.5);
  background-image: linear-gradient(to right, #fcb224, #f48c3a);
  .mdi:before,
  .mdi-set {
    color: white !important;
  }
  p {
    color: white !important;
    font-weight: bold;
  }
}
.noactive {
  width: 80px !important;
  height: 80px !important;
  background-color: white !important;
  .mdi,
  .mdi-set {
    color: #70747a !important;
  }
  p {
    color: #70747a;
    font-weight: bold;
  }
}
</style>

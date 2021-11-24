<template>
  <div
    class="d-flex justify-center align-center"
    style="position: relative; width: 100%; height: 100%; overflow: hidden"
  >
    <!-- <img
      v-if="!$vuetify.breakpoint.xs && !$vuetify.breakpoint.sm"
      src="~/static/images/login-back.png"
      style="position:absolute; z-index:0; width:100%; height:100%;"
      alt="back-ground"
    /> -->
    <v-card
      v-if="!$vuetify.breakpoint.xs && !$vuetify.breakpoint.sm"
      width="90%"
      height="95%"
      color="white"
      class="d-flex"
      style="overflow: hidden"
      elevation="10"
    >
      <div
        class="py-8 d-flex flex-column align-center justify-center"
        style="
          width: 35%;
          height: 100%;
          background-image: linear-gradient(to right, #fcb224, #f48c3a);
          border-radius: 0;
        "
      >
        <img src="~/static/logo.svg" alt="sandbad" style="width: 20%" />
        <div
          class="text-font-h4 mb-4 font-weight-bold text-black"
          style="font-size: 20px"
        >
          سند باد
        </div>
        <div>اطلاعات خود را وارد کنید.</div>
        <v-form style="position: relative; height: 100%; width: 80%">
          <v-text-field
            outlined
            color="white"
            class="mt-8"
            maxLength="63"
            autocomplete="off"
            label="نام کاربری"
            name="loginUsername"
            :rules="usernameRules"
            v-model="login.username"
            @keypress.enter="userLogin"
          ></v-text-field>
          <v-text-field
            outlined
            color="white"
            class="mb-2"
            label="پسورد"
            maxLength="127"
            autocomplete="off"
            name="loginPassword"
            :rules="passwordRules"
            v-model="login.password"
            :type="passwordShow ? 'text' : 'password'"
            @click:append="passwordShow = !passwordShow"
            @keypress.enter="userLogin"
            :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
          ></v-text-field>
          <v-btn
            block
            large
            depressed
            class="py-2"
            color="#E86B34"
            @click="userLogin"
            :loading="loading"
            :dark="!formValidation"
            :disabled="formValidation"
            style="position: absolute; bottom: 0"
            >ورود
          </v-btn>
        </v-form>
      </div>
      <div
        style="width: 65%; height: 100%; border-radius: 0"
        class="d-flex flex-column justify-center align-center"
      >
        <img
          class="mr-12 mb-6"
          src="~/static/images/laptop.png"
          alt="laptop"
          width="80%"
        />
        <p class="mt-2" style="color: black; font-size: 40px">
          به پنل ادمین
          <span style="color: #ff9933; font-weight: bold">سندباد</span> خوش
          آمدید
        </p>
      </div>
    </v-card>
    <div
      v-else
      class="py-8 d-flex flex-column align-center justify-center"
      style="
        width: 100%;
        height: 100%;
        background-image: linear-gradient(to right, #fcb224, #f48c3a);
        border-radius: 0;
      "
    >
      <img src="~/static/logo.svg" alt="sandbad" style="width: 20%" />
      <div class="text-font-h4 mb-4 text-black">سند باد</div>
      <div>اطلاعات خود را وارد کنید.</div>
      <v-form style="position: relative; height: 100%; width: 80%">
        <v-text-field
          outlined
          color="white"
          class="mt-8"
          maxLength="63"
          autocomplete="off"
          label="نام کاربری"
          name="loginUsername"
          :rules="usernameRules"
          v-model="login.username"
          @keypress.enter="userLogin"
        ></v-text-field>
        <v-text-field
          outlined
          color="white"
          class="mb-2"
          label="پسورد"
          maxLength="127"
          autocomplete="off"
          name="loginPassword"
          :rules="passwordRules"
          v-model="login.password"
          :type="passwordShow ? 'text' : 'password'"
          @click:append="passwordShow = !passwordShow"
          @keypress.enter="userLogin"
          :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
        ></v-text-field>
        <v-btn
          block
          large
          depressed
          class="py-2"
          color="#E86B34"
          @click="userLogin"
          :loading="loading"
          :dark="!formValidation"
          :disabled="formValidation"
          style="position: absolute; bottom: 0"
          >ورود
        </v-btn>
      </v-form>
    </div>
    <Snackbar />
  </div>

</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";
import { getModule } from "vuex-module-decorators";

import GeneralModule from "~/store/general/index";
import { delay } from "~/helpers/functionality";
import { loginModel } from "~/models/auth/login.model";

import Snackbar from "~/components/common/Snackbar.vue";

@Component({ components: { Snackbar } })
export default class Index extends Vue {
  [x: string]: any;
  private generalModule = getModule(GeneralModule, this.$store);
  private login: loginModel = {};
  private passwordShow: boolean = false;
  private valid: boolean = false;
  private loading: boolean = false;
  public layout() {
    return "Login";
  }

  private mounted() {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      this.$vuetify.theme.dark = true;
    } else {
      this.$vuetify.theme.dark = false;
    }
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        e.matches
          ? (this.$vuetify.theme.dark = true)
          : (this.$vuetify.theme.dark = false);
      });
  }

  private beforeDestroy() {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .removeEventListener("change", (e) => {
        e.matches
          ? (this.$vuetify.theme.dark = true)
          : (this.$vuetify.theme.dark = false);
      });
  }

  private async userLogin() {
    try {
      this.loading = true;

      await this.$auth
        .loginWith("local", {
          data: this.login,
        })
        .then(async (res: any) => {
            await delay(500);
            this.$auth.setUser(this.login);
          this.loading = false;
        
        });
    } catch (e : any) {
      this.generalModule.toggleSnackbar(true);
      this.generalModule.setSnackbarColor("error");
      this.generalModule.setSnackbarText("اطلاعات نادرست است");
    } finally {
      this.loading = false;
     
    }
  }

  private get usernameRules() {
    return [
      (val: string) => !!val || "نام کاربری الزامی است",
      (val: string) =>
        (val && val.length > 0 && val.length >= 3) ||
        "نام کاربری باید حداقل 3 کاراکتر باشد",
      (val: string) =>
        /^[0-9A-Za-z_.-]+$/.test(val) ||
        "تنها حروف بزرگ،کوچک،اعداد و _ برای نام کاربری مجاز است",
    ];
  }

  private get passwordRules() {
    return [
      (val: string) => !!val || "پسورد الزامی است",
      (val: string) =>
        (val && val.length > 0 && val.length >= 8) ||
        "پسورد باید حداقل 8 کاراکتر باشد",
      (val: string) =>
        (val &&
          val.length > 0 &&
          !!val.match(/^(?!.*?example)(?=\D*\d)[^a-z]*[a-z].*$/i)) ||
        "پسورد باید حداقل شامل یک حرف باشد"
    ];
  }

  private get formValidation() {
    return (
      !this.login.username ||
      this.login.username.length < 3 ||
      !/^[0-9A-Za-z_.-]+$/.test(this.login.username) ||
      !this.login.password ||
      this.login.password.length < 8 ||
      this.login.password === this.login.username ||
      !/^(?!.*?example)(?=\D*\d)[^a-z]*[a-z].*$/i.test(this.login.password)
    );
  }
}
</script>

<style lang="scss" scoped>
.full {
  width: 100%;
  height: 100%;
}
</style>

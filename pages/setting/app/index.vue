<template>
  <div class="full-height py-8 px-4">
    <v-card height="100%" class=" pa-4">
      <div class="text-bold gery--text">تنظیم اخطار آپدیت</div>
      <v-divider class="mt-2 mb-4" />
      <v-row>
        <v-col cols="12" md="6" sm="6" lg="6">
          <v-select
            dense
            outlined
            hide-details
            v-model="platform"
            :menu-props="{ offsetY: true }"
            color="primary"
            item-text="name"
            item-value="value"
            :items="platformList"
            item-color="primary"
            label="انتخاب پلتفرم"
          />
        </v-col>
        <v-col cols="12" md="6" sm="6" lg="6">
          <v-select
            dense
            outlined
            hide-details
            v-model="type"
            :menu-props="{ offsetY: true }"
            color="primary"
            item-text="name"
            item-value="value"
            :items="typeList"
            item-color="primary"
            label="نوع آپدیت"
          />
        </v-col>
        <v-col cols="12" md="6" sm="6" lg="6">
          <v-text-field
            label="کد نسخه را وارد کنید..."
            outlined
            color="primary"
            dense
            v-model="verCode"
            @keydown.enter="sendMessage"
          />
        </v-col>
        <v-col cols="12" md="6" sm="6" lg="6"
          ><v-text-field
            label="نسخه را وارد کنید..."
            outlined
            color="primary"
            dense
            v-model="ver"
            @keydown.enter="sendMessage"
          />
        </v-col>
        <v-col
          class=" py-0 d-flex justify-end mb-2"
          cols="12"
          md="12"
          lg="12"
          sm="12"
        >
          <v-btn dense color="primary" text @click="clearFields" class="ml-4">
            پاک کردن
          </v-btn>
          <v-btn
            dense
            depressed
            color="primary"
            @click="sendMessage"
            :disabled="
              ver === '' || platform === '' || type === '' || verCode === ''
            "
          >
            ارسال
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
    <Snackbar />
    <ErrorModal :dialog="showErrorData" :errorType="errorType" />
  </div>
</template>

<script lang="ts">
import GeneralModule from "~/store/general/index";
import { getModule } from "vuex-module-decorators";

import { Component, Vue } from "nuxt-property-decorator";

import FilterModal from "~/components/modals/FilterModal.vue";
import ErrorModal from "~/components/modals/ErrorModal.vue";
import Snackbar from "~/components/common/Snackbar.vue";

import { delay } from "~/helpers/functionality";

@Component({
  middleware: ["permission"],
  components: {
    FilterModal,
    ErrorModal,
    Snackbar
  },
  filters: { delay }
})
export default class index extends Vue {
  [x: string]: any;
  private generalModule = getModule(GeneralModule, this.$store);

  //change table an target variables
  private platformList = [
    { name: "هردو", value: "both" },
    { name: "اندروید", value: "android" },
    { name: "IOS", value: "ios" }
  ];
  private platform: string = "";

  private typeList = [
    { name: "اختیاری", value: "soft" },
    { name: "اجباری", value: "force" }
  ];
  private type: string = "";

  //main request variables
  private loading: boolean = false;
  private showError: boolean = false;
  private errorType: string = "";
  private ver: string = "";
  private verCode: string = "";

  //clear
  private clearFields() {
    this.platform = "";
    this.type = "";
    this.ver = "";
    this.verCode = "";
  }

  //post request
  private async sendMessage() {
    try {
      const data = {};
      this.loading = true;
      await this.$axios.$post(``, data, {
        headers: {
          Authorization: this.$auth.getToken("local"),
          Accept: "application/json; version=1.0;"
        }
      });
    } catch (e : any) {
      if (e.response.status === 404 || e.response.status === 500) {
        this.showErrorPage(e.response.status);
      } else {
        this.generalModule.toggleSnackbar(true);
        this.generalModule.setSnackbarColor("error");
        this.generalModule.setSnackbarText("اطلاعات وارد شده را بررسی کنید");
      }
    } finally {
      this.planAmount = "";
      await delay(500);
      this.loading = false;
    }
  }
  //error functions
  private get showErrorData() {
    return this.showError;
  }
  private showErrorPage(error: string) {
    this.showError = true;
    this.errorType = error;
  }
}
</script>

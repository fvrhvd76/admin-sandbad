<template>
  <v-dialog v-model="dialogIsOpen" width="500" persistent>
    <v-card dir="rtl" class="pa-6">
      <div
        v-if="
          filterMode === 'sort+time+switch' ||
            filterMode === 'sort' ||
            filterMode === 'sort+time' ||
            filterMode === 'sort+switch'
        "
      >
        <p class="mb-0">
          <span>مرتب سازی بر اساس </span>
        </p>
        <div class="d-flex flex-row justify-space-between align-center">
          <v-radio-group v-model="sort" row>
            <v-radio
              v-if="numOfRadioBtn >= 1"
              :label="sort1"
              color="primary"
              value="1"
            ></v-radio>
            <v-radio
              v-if="numOfRadioBtn >= 2"
              :label="sort2"
              color="primary"
              value="2"
            ></v-radio>
            <v-radio
              v-if="numOfRadioBtn >= 3"
              :label="sort3"
              color="primary"
              value="3"
            ></v-radio>
            <v-radio
              v-if="numOfRadioBtn >= 4"
              :label="sort4"
              color="primary"
              value="4"
            ></v-radio>
          </v-radio-group>
        </div>
      </div>
      <v-divider
        class="mb-4"
        v-if="
          filterMode === 'sort+time+switch' ||
            filterMode === 'sort+time' ||
            filterMode === 'sort+switch'
        "
      />
      <div
        v-if="
          filterMode === 'sort+time+switch' ||
            filterMode === 'time' ||
            filterMode === 'sort+time' ||
            filterMode === 'time+switch'
        "
      >
        <p class="md-4">
          <span>تعیین بازه زمان </span>
        </p>
        <div class="d-flex flex-row justify-space-between align-center">
          <v-text-field
            class="ml-2"
            label="از تاریخ"
            :value="startTimeData"
            id="FirstdatePicker"
            outlined
            color="primary"
            dense
            readonly
          />
          <v-text-field
            label="تا تاریخ"
            class="mr-2"
            :value="endTimeData"
            id="datePickerSecond"
            outlined
            color="primary"
            dense
            :disabled="startIsEmpty"
            readonly
          />
          <date-picker
            v-model="startTime"
            format="YYYY-MM-DD"
            element="FirstdatePicker"
            display-format="jYYYY/jMM/jDD"
            :max="endTime === '' ? todayDate : endTime"
            color="#F48C3A"
            auto-submit
          />
          <date-picker
            v-model="endTime"
            format="YYYY-MM-DD"
            element="datePickerSecond"
            display-format="jYYYY/jMM/jDD"
            :min="startTime"
            :max="currentDate"
            color="#F48C3A"
            :disabled="startIsEmpty"
            auto-submit
          />
        </div>
      </div>
      <v-divider
        v-if="filterMode === 'sort+time+switch' || filterMode === 'time+switch'"
      />
      <v-row
        class="mb-4"
        v-if="
          filterMode === 'sort+time+switch' ||
            filterMode === 'time+switch' ||
            filterMode === 'switch' ||
            filterMode === 'sort+switch'
        "
      >
        <v-col
          cols="12"
          sm="12"
          md="12"
          lg="12"
          class="d-flex align-center justify-start mt-2 pb-0"
        >
          <p class="mt-2">
            <span>تعیین وضعیت </span>
          </p>
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="6"
          lg="6"
          v-if="numOfSwitches >= 1"
          class="d-flex align-center justify-start pt-0"
        >
          <v-col cols="5">
            <p class="pt-4 ml-2">{{ switch1 }}</p>
          </v-col>
          <v-switch color="primary" v-model="switch1Value" inset />
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="6"
          lg="6"
          v-if="numOfSwitches >= 2"
          class="d-flex align-center justify-start pt-0"
        >
          <v-col cols="5">
            <p class="pt-4 ml-2">{{ switch2 }}</p>
          </v-col>
          <v-switch color="primary" v-model="switch2Value" inset />
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="6"
          lg="6"
          v-if="numOfSwitches >= 3"
          class="d-flex align-center justify-start pt-0"
        >
          <v-col cols="5">
            <p class="pt-4 ml-2">{{ switch3 }}</p>
          </v-col>
          <v-switch color="primary" v-model="switch3Value" inset />
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="6"
          lg="6"
          v-if="numOfSwitches >= 4"
          class="d-flex align-center justify-start pt-0"
        >
          <v-col cols="5">
            <p class="pt-4 ml-2">{{ switch4 }}</p>
          </v-col>
          <v-switch color="primary" v-model="switch4Value" inset />
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="6"
          lg="6"
          v-if="numOfSwitches >= 5"
          class="d-flex align-center justify-start pt-0"
        >
          <v-col cols="5">
            <p class="pt-4 ml-2">{{ switch5 }}</p>
          </v-col>
          <v-switch color="primary" v-model="switch5Value" inset />
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="6"
          lg="6"
          v-if="numOfSwitches >= 6"
          class="d-flex align-center justify-start pt-0"
        >
          <v-col cols="5">
            <p class="pt-4 ml-2">{{ switch6 }}</p>
          </v-col>
          <v-switch color="primary" v-model="switch6Value" inset />
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="6"
          lg="6"
          v-if="numOfSwitches >= 6"
          class="d-flex align-center justify-start pt-0"
        >
          <v-col cols="5">
            <p class="pt-4 ml-2">{{ switch7 }}</p>
          </v-col>
          <v-switch color="primary" v-model="switch7Value" inset />
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="6"
          lg="6"
          v-if="numOfSwitches >= 6"
          class="d-flex align-center justify-start pt-0"
        >
          <v-col cols="5">
            <p class="pt-4 ml-2">{{ switch8 }}</p>
          </v-col>
          <v-switch color="primary" v-model="switch8Value" inset />
        </v-col>
      </v-row>
      <div class="d-flex flex-row justify-end align-center mt-2">
        <v-btn dense color="primary" text @click="allResult"
          >نمایش پیش فرض</v-btn
        >
        <v-btn dense color="primary" text @click="closeDialog" class="ml-4">
          لغو
        </v-btn>
        <v-btn dense depressed color="primary" @click="confirmDialog">
          ذخیره
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import VuePersianDatetimePicker from "vue-persian-datetime-picker";
import { jalaliConvert } from "~/helpers/functionality";
import { Vue, PropSync, Component, Prop } from "nuxt-property-decorator";

@Component({
  components: {
    datePicker: VuePersianDatetimePicker
  },
  filters: { jalaliConvert }
})
export default class FilterModal extends Vue {
  private startTime: string = "";
  private endTime: string = "";
  private todayDate: string = "";
  private sort: string = "1";
  @Prop() numOfRadioBtn!: number;
  @Prop() sort1!: string;
  @Prop() sort2!: string;
  @Prop() sort3!: string;
  @Prop() sort4!: string;
  @Prop() numOfSwitches!: number;
  @Prop() switch1!: string;
  @Prop() switch2!: string;
  @Prop() switch3!: string;
  @Prop() switch4!: string;
  @Prop() switch5!: string;
  @Prop() switch6!: string;
  @Prop() switch7!: string;
  @Prop() switch8!: string;
  private switch1Value: boolean = false;
  private switch2Value: boolean = false;
  private switch3Value: boolean = false;
  private switch4Value: boolean = false;
  private switch5Value: boolean = false;
  private switch6Value: boolean = false;
  private switch7Value: boolean = false;
  private switch8Value: boolean = false;
  @PropSync("dialog") dialogIsOpen!: boolean;
  @PropSync("mode") filterMode!: string;

  private closeDialog() {
    this.$emit("closeDialog");
  }
  private confirmDialog() {
    this.$emit(
      "confirm",
      this.sort,
      this.startTime,
      this.endTime,
      this.switch1Value,
      this.switch2Value,
      this.switch3Value,
      this.switch4Value,
      this.switch5Value,
      this.switch6Value,
      this.switch7Value,
      this.switch8Value
    );
  }

  //disable button if user didnt set startTime
  private get isEmpty() {
    return this.startTime === "" || this.endTime === "";
  }
  private get startIsEmpty() {
    return this.startTime === "";
  }

  //current date
  private get currentDate() {
    const today = new Date();
    const date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      (today.getDate() + 1);
    this.todayDate = date;
    return this.todayDate;
  }
  private get startTimeData() {
    return this.startTime ? jalaliConvert(this.startTime) : this.startTime;
  }
  private get endTimeData() {
    return this.endTime ? jalaliConvert(this.endTime) : this.endTime;
  }
  private allResult() {
    this.startTime = "";
    this.endTime = "";
    this.sort = "1";
    this.switch1Value = false;
    this.switch2Value = false;
    this.switch3Value = false;
    this.switch4Value = false;
    this.switch5Value = false;
    this.switch6Value = false;
    this.switch7Value = false;
    this.switch8Value = false;
    this.$emit("default");
    this.confirmDialog()
  }
}
</script>

<style lang="scss">
.v-input--selection-controls__input + .v-label {
  padding-left: 10px;
}
</style>

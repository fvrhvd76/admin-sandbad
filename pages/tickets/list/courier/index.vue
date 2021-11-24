<template>
  <div class="full-height py-8 px-4">
    <v-card outlined class="rounded pa-4">
      <div class="text-bold gery--text">اطلاعات پشتیبانی</div>
      <v-divider class="my-4" />
      <v-row justify="center" class="ma-0">
        <v-col md="3" lg="3" xl="3" cols="12">
          <DataCard
            :loading="loading"
            :title="'تعدا کل تیکت های فروشندگان'"
            :count="ticketsInfo.seller_ticket_count"
          />
        </v-col>
        <v-col md="3" lg="3" xl="3" cols="12">
          <DataCard
            :loading="loading"
            :title="'تعدا کل تیکت های سفیران'"
            :count="ticketsInfo.courier_ticket_count"
          />
        </v-col>
        <v-col md="3" lg="3" xl="3" cols="12">
          <DataCard
            :loading="loading"
            :title="'تعدا کل تیکت های خریدار'"
            :count="ticketsInfo.buyers_ticket_count"
          />
        </v-col>
        <v-col md="3" lg="3" xl="3" cols="12">
          <DataCard
            :loading="loading"
            :title="'تعدا کل تیکت های فرستنده ها'"
            :count="ticketsInfo.sender_ticket_count"
          />
        </v-col>
      </v-row>
      <div class="text-bold gery--text">تیکت های سفیران</div>
      <v-divider class="my-4" />
      <v-data-table
        :items="tickets"
        :loader-height="0"
        hide-default-footer
        :headers="userTicket"
        :loading="loading"
        class="elevation-0 mb-8"
        disable-pagination
      >
        <template #[`item.done`]="{ item }">
          <div v-if="item.done" title="پاسخ داده شده">
            <v-icon color="success">mdi-email-check</v-icon>
          </div>
          <div v-else title="پاسخ داده نشده">
            <v-icon color="info">mdi-email</v-icon>
          </div>
        </template>
        <template #[`item.num`]="{ item }">
          <span> {{ tickets.indexOf(item) + 1 }}</span>
        </template>
        <template #[`item.timestamp`]="{ item }">
          <span> {{ item.timestamp | jalaliConvertWithTime }}</span>
        </template>
        <template #[`item.subject`]="{ item }">
          <span :title="item.subject" v-if="!more[item.id]">
            {{ item.subject.substring(0, 20) }}</span
          >
          <span
            class="moretext"
            v-if="item.subject.length > 20 && !more[item.id]"
            @click="fillMore(item.id)"
          >
            ...</span
          >
          <span v-if="more[item.id]">{{ item.subject }}</span>
        </template>
        <template #[`item.actions`]="{item}">
          <v-btn
            icon
            color="error"
            @click="getTicketMessages(item.id, tickets.indexOf(item))"
          >
            <v-icon> mdi-eye </v-icon>
          </v-btn>
        </template>
        <template #[`body.append`]>
          <div
            v-if="tickets.length > 0"
            v-intersect.quiet="infiniteScrollingTickets"
          ></div>
        </template>
        <template #no-data>
          <div class="d-flex flex-column justify-center align-center my-4">
            <div
              class="empty-table-icon d-flex flex-row justify-center align-center"
            >
              <v-img src="/icons/empty-table.svg" max-width="68.33" />
            </div>
            <div class="py-2">داده ای وجود ندارد</div>
          </div>
        </template>
        <template #loading>
          <v-progress-circular
            size="60"
            color="primary"
            class="my-4"
            indeterminate
          />
        </template>
      </v-data-table>
    </v-card>
    <MessageDialog
      :dialog="MessageDialog"
      :userPicture="userPic"
      :userName="userFullName"
      :messageType="messageType"
      :messagePriority="messagePriority"
      :message="ticketMessages"
      :loading="loading"
      @closeDialog="closeMessageDialog"
      @send="sendMessage"
    />
    <Snackbar />
    <ErrorModal :dialog="showErrorData" :errorType="errorType" />
  </div>
</template>

<script lang="ts">
import GeneralModule from "~/store/general/index";
import { getModule } from "vuex-module-decorators";

import { Component, Vue } from "nuxt-property-decorator";

import { TicketModel } from "~/models/api/ticket.model";
import { MessageModel } from "~/models/api/message-model";

import { TicketResponseModel } from "~/models/api/response/ticket-response.model";

import MessageDialog from "~/components/modals/MessageModal.vue";
import FilterModal from "~/components/modals/FilterModal.vue";
import ErrorModal from "~/components/modals/ErrorModal.vue";
import Snackbar from "~/components/common/Snackbar.vue";
import DataCard from "~/components/common/DataCard.vue";

import {
  delay,
  jalaliConvert,
  jalaliConvertWithTime
} from "~/helpers/functionality";

@Component({
  middleware: ["permission"],
  components: {
    FilterModal,
    ErrorModal,
    Snackbar,
    DataCard,
    MessageDialog
  },
  filters: {
    jalaliConvert,
    jalaliConvertWithTime
  }
})
export default class index extends Vue {
  [x: string]: any;
  private generalModule = getModule(GeneralModule, this.$store);

  //message dialog variables
  private MessageDialog: boolean = false;
  private type: string | null | undefined = null;
  private ticketMessages: MessageModel[] = [];
  private more: boolean[] = [];

  private userTicket = [
    {
      text: "ردیف",
      value: "num",
      align: "start",
      sortable: false
    },
    {
      text: "شماره تیکت",
      value: "id",
      align: "start",
      sortable: false
    },
    {
      text: "تاریخ آخرین تغییر تیکت",
      value: "timestamp",
      align: "start",
      sortable: false
    },
    {
      text: "موضوع",
      value: "subject",
      align: "start",
      sortable: false
    },
    {
      text: "وضعیت",
      value: "done",
      align: "start",
      sortable: false
    },
    {
      text: "",
      value: "actions",
      align: "start",
      sortable: false
    }
  ];

  //main request variables
  private loading: boolean = false;
  private showError: boolean = false;
  private errorType: string = "";
  private userPic: any = "";
  private messageType: any = "";
  private userFullName: any = "";
  private messagePriority: any = "";
  private target: string = "courier";
  private ticketsCurrentPage: number = 0;
  private ticketsPerPage: number = 25;
  private ticketsEnd: boolean = false;
  private tickets: TicketModel[] = [];
  private ticketsInfo: {
    buyers_ticket_count?: number;
    courier_ticket_count?: number;
    seller_ticket_count?: number;
    sender_ticket_count?: number;
  } = {};
  //error functions
  private get showErrorData() {
    return this.showError;
  }
  private showErrorPage(error: string) {
    this.showError = true;
    this.errorType = error;
  }

  private mounted() {
    this.getTickesInfo();
    this.getTicketDetail();
  }

  //Get Ticket Detail
  private async getTicketDetail() {
    try {
      this.loading = true;
      await this.$axios
        .$get(`/admins/ticket/`, {
          params: {
            q: 'courier',
            limit: this.ticketsPerPage,
            offset: this.ticketsCurrentPage
          },
          headers: {
            Authorization: this.$auth.getToken("local"),
            Accept: "application/json; version=1.0;"
          }
        })
        .then((response: TicketResponseModel) => {
          if (response.result) {
            this.tickets = this.tickets.concat(response.result);
          }
          if (response.next === null) {
            this.ticketsEnd = true;
          }
        });
    } catch (e : any) {
      if (e.response.status === 404 || e.response.status === 500) {
        this.showErrorPage(e.response.status);
      } else {
        this.generalModule.toggleSnackbar(true);
        this.generalModule.setSnackbarColor("error");
        this.generalModule.setSnackbarText(e.response.data.detail);
      }
    } finally {
      await delay(500);
      this.loading = false;
    }
  }

  private async getTickesInfo() {
    try {
      this.loading = true;
      await this.$axios
        .$get(`/admins/ticket-count/`, {
          headers: {
            Authorization: this.$auth.getToken("local"),
            Accept: "application/json; version=1.0;"
          }
        })
        .then(
          (response: {
            buyers_ticket_count: number;
            courier_ticket_count: number;
            seller_ticket_count: number;
            sender_ticket_count: number;
          }) => {
            this.ticketsInfo = response;
          }
        );
    } catch (e : any) {
      if (e.response.status === 404 || e.response.status === 500) {
        this.showErrorPage(e.response.status);
      } else {
        this.generalModule.toggleSnackbar(true);
        this.generalModule.setSnackbarColor("error");
        this.generalModule.setSnackbarText(e.response.data.detail);
      }
    } finally {
      await delay(500);
      this.loading = false;
    }
  }

  //message modal functions
  private closeMessageDialog() {
    this.MessageDialog = false;
    this.ticketMessages = [];
  }
  private confirmMessageDialog() {
    this.MessageDialog = false;
  }
  private async sendMessage(text: string, ticket_id: number, file: string) {
    try {
      let data = new FormData();
      //@ts-ignore
      data.append("ticket_id", ticket_id);
      data.append("text", text);
      data.append("file1", file);
      await this.$axios.$post(`/admins/ticket/?q=courier`, data, {
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
        this.generalModule.setSnackbarText(e.response.data.detail);
      }
    } finally {
      await delay(500);
      this.accountSaveLoading = false;
    }
  }
  private fillMore(v: number) {
    for (let index = 0; index < this.tickets.length; index++) {
      this.more = new Array(index).fill(false);
    }
    this.more[v] = true;
    return this.more;
  }

  private async getTicketMessages(id: number, index: number) {
    this.MessageDialog = true;
    try {
      this.loading = true;
      await this.$axios
        .$get(`/admins/ticket/${id}/?q=courier`, {
          headers: {
            Authorization: this.$auth.getToken("local"),
            Accept: "application/json; version=1.0;"
          }
        })
        .then((response: TicketModel) => {
          if (response.message) {
            this.ticketMessages = this.ticketMessages.concat(response.message);
          }
        });
      this.loading = false;
    } catch (e : any) {
      if (e.response.status === 404 || e.response.status === 500) {
        this.showErrorPage(e.response.status);
      } else {
        this.generalModule.toggleSnackbar(true);
        this.generalModule.setSnackbarColor("error");
        this.generalModule.setSnackbarText(e.response.data.detail);
      }
    } finally {
      await delay(500);
      this.ticketMessagesDetail(index);
    }
  }

  //infinite scroll
  private async infiniteScrollingTickets(entries: any, value: number) {
    if (!this.ticketsEnd && entries[0].intersectionRatio > 0) {
      this.ticketsCurrentPage = this.ticketsCurrentPage + this.ticketsPerPage;
      await this.getTicketDetail();
    }
  }

  private ticketMessagesDetail(index: number) {
    this.messagePriority = this.tickets[index].priority;
    this.messageType = this.tickets[index].type;
    this.userPic = this.tickets[index].user?.profile_picture;
    this.userFullName = this.tickets[index].user?.full_name;
  }
}
</script>

<style scoped lang="scss">
.full-height {
  height: 100%;
}
.moretext {
  cursor: pointer;
}
</style>

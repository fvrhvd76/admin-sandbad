import { MessageModel } from "~/models/api/message-model";

export interface TicketModel {
  courier_id?: number;
  sender_id?: string;

  done?: boolean;
  id?: number;
  priority?: string;
  subject?: string;
  timestamp?: string;
  transmission_id?: number;
  type?: string;

  user?: {
    full_name: string;
    profile_picture: string;
  };

  message?: MessageModel[];
}

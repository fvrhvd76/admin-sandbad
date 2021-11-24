import { ReceiverLocationsModel } from "~/models/api/receiver-locations.model";
export interface SenderTransmissionDetailsModel {
  id?: number;
  destination_count?: number;
  will_return?: boolean;
  status?: string;
  final_price?: number;
  cost?: number;
  wait_time?: number;
  commission?: number;
  discount?: number;
  date?: string;
  pay_by?: string;
  distance?: number;
  estimated_time?: number;
  transfer_time?: number;
  discount_code?: string;
  courier?: {
    id?: number;
    full_name?: string;
    is_male?: boolean;
    national_code?: string;
    phone_number?: string;
    transmission_count?: number;
    vehicle?: {
      type: string;
      name: string;
      color: string;
      pelak: string;
    };
  };

  sender_location?: {
    id?: number;
    latitude?: string;
    longitude?: string;
    address?: string;
  };
  receiver_location?: ReceiverLocationsModel[];
}

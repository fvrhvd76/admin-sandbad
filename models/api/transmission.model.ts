export interface TransmissionModel {
  id?: number;
  date?: string;
  start_time?: string;
  end_time?: string;
  sender_location?: boolean;
  receiver_location?: { address?: string; address_detail?: string };
  cost?: number;
  courier_cost?: number
  discount?: number;
  status?: string
  commission?: number
  is_paid?: string
  is_scored?: string
  score?: number
  transfer_time?: number
  courier?: {
    is_available: boolean,
    transmission_count: number,
    distance_moved: number,
    transmission_time: number,
    user?: {
      id: number,
      full_name: string,
      profile_picture: string,
      is_male: boolean,
      phone_number: number,
      date_joined: string
    },
    vehicle?: {
      id: number,
      name: string,
      type: string,
      color: string,
      pelak: string,
      year: string,
      have_traffic_plan: boolean
    }
  };
  is_arrived?: boolean
  is_received?: boolean
  is_reached?: boolean
  is_delivered?: boolean
  is_done?: boolean
  is_canceled?: boolean
  date_accepted?: string
  date_arrived?: string
  date_received?: string
  date_reached?: string
  date_delivered?: string
  date_done?: string
  date_canceled?: string
}

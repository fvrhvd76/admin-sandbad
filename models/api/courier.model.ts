export interface CourierModel {
  transmission_time?: string;
  is_banned?: boolean;
  transmission_count?: string;
  is_available?: boolean;
  distance_moved?: number;
  date_accepted?: string;
  courier_data: {
    commission_sum: number
    income_sum: number
    score_count: number
    score_mean: number
  };
  address?: string;
  accepted?: boolean;
  post_code?: string;
}

export interface CourierLocationModel {
  latitude?: string;
  longitude?: string;
  last_online?: string;
  courier?: {
    id: number;
    is_available: number;
    full_name: number;
    vehicle_type?: string;
  };
}

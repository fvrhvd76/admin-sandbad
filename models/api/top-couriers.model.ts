export interface TopCouriersModel {
  birth_date?: string;
  id?: number;
  is_banned?: boolean;
  transmission_count?: number;
  user?: {
    full_name?: string;
    is_male?: boolean;
    profile_picture?: string;
  };
}

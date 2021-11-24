export interface CategoryModel {
  id?: number;
  picture?: string;
  audience?: string;
  title?: string;
  description?: string;
  coins?: number;
  discount_amount?: number;
  discount_percent?: number;
  discount_code?: number;
  limit?: number;
  used_number?: number;
  is_active?: boolean;
  is_internal?: boolean;
  is_general?: boolean;
  start_date?: string;
  end_date?: string;
}

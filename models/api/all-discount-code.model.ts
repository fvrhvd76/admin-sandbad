export interface AllDiscountCodeModel {
  id?: number;
  title?: string;
  audience?: string;
  discount_code?: string;
  discount_amount?: number;
  discount_percent?: number;
  coins?: number;
  limit?: number;
  used_number?: number;
  picture?: string;
  is_active?: boolean;
  is_internal?: boolean;
  start_date?: string;
  end_date?: string;
}

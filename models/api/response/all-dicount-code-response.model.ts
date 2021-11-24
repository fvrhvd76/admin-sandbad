import { AllDiscountCodeModel } from "~/models/api/all-discount-code.model";

export interface AllDiscountCodeResponseModel {
  count?: number;
  previous?: string;
  next?: string;
  result?: AllDiscountCodeModel[];
}

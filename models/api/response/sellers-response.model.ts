import { SellerModel } from "~/models/api/sellers.model";

export interface SellersResponseModel {
  count?: number;
  previous?: string;
  next?: string;
  result: SellerModel[];
}

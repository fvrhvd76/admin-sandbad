import { SenderLocationModel } from "~/models/api/sender-locations.model";

export interface SenderModel {
  address?: SenderLocationModel[]
  is_banned?: boolean
  orders_count?: number
}

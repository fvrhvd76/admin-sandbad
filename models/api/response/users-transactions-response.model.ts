import { UserTransactionModel } from "~/models/api/user-transaction.model";

export interface UserTransactiosResponseModel {
  count?: number;
  previous?: string;
  next?: string;
  result?: UserTransactionModel[];
}

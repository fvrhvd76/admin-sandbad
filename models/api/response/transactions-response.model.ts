import { TransactionModel } from '~/models/api/transaction.model';

export interface TransactionResponseModel {
    id?: number
    count?: number;
    previous?: string;
    next?: string;
    result?: TransactionModel[]
}
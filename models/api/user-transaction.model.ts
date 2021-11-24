export interface UserTransactionModel {
    id?:number;
    date?:string;
    deposit_code?:string;
    is_deposit?:boolean;
    amount?:number;
    is_successful?:boolean;
    user?:{
        id:number;
        full_name:string;
    }
}
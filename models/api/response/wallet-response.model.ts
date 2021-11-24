export interface WalletResponseModel {
    coin?: number
    total_amount?: number
    can_withdraw_amount?: number
    amount_withdrawn?: number
    courier_data?:{
        income_sum:number;
        commission_sum:number;
        is_deposit_sum:number;
    }
}
export interface TransactionModel {
    id?: number
    is_successful?: boolean
    date?: string
    amount?: number
    deposit_code?: number
    user: {
        id: string,
        full_name: string,
        phone_number: string,
        is_seller: boolean,
        is_sender: boolean
    }
}
import { FactorItemModel } from "~/models/api/factor-item.model";
export interface FactorModel {
    id?: number
    date_created?: string
    description?: string
    send_count?: number
    test_time?: string
    factor_code?: string
    status?: string
    price?: number
    final_price?: number | string
    has_test_time?: boolean
    test_time_expired?: boolean
    who_paid?: string
    base_courier_cost?: number
    distance?: number
    return_distance?: number
    estimated_time?: number
    return_estimated_time?: number
    return_cost?: number
    timestamp?: string
    seller_id?: string
    user_id?: string
    seller?: {
        id: number
        full_name: string
        profile_picture: string
        is_male: boolean
        phone_number: string
        date_joined: string
    }
    buyer?: {
        id: number
        full_name: string
        profile_picture: string
        is_male: boolean
        phone_number: string
        date_joined: string
    }
    items?: FactorItemModel
}
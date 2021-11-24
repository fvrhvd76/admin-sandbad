import { CourierModel } from '../courier.model';
export interface CouriersResponseModel {
    count?: number
    previous?: string
    next?: string
    result?: CourierModel[]
}
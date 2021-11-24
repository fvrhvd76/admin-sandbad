import { AdminModel } from './../admin.model';
export interface AdminsResponseModel{
    count?: number
    previous?: string
    next?: string
    result?: AdminModel[]
}
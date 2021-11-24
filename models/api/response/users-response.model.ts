import { UserModel } from "../user.model";

export interface UsersResponseModel{
    count?: number
    previous?: string
    next?: string
    result?: UserModel[]
}
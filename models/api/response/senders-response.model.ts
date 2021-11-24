import { SenderModel } from '~/models/api/sender.model';

export interface SendersResponseModel{
    count?: number
    previous?: string
    next?: string
    result?: SenderModel[]
}
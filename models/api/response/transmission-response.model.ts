import { TransmissionModel } from '~/models/api/transmission.model'

export interface TransmissionResponseModel{
    count?:number;
    next?:string;
    previous?:string;
    result?:TransmissionModel[]
}
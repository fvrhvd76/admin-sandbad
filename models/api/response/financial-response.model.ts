import { FinancialModel } from '~/models/api/financial.model'

export interface FinancialResponseModel{
    count?:number;
    next?:string
    previous?:string
    result?:FinancialModel[]
}
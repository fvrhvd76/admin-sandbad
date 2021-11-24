import { FactorModel } from './../factor.model';
export interface FactorsResponseModel {
    count?: number
    previous?: string
    next?: string
    result?: FactorModel[]
}
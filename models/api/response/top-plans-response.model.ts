import { TopPlansModel } from '~/models/api/top-plans.model'

export interface TopPlansResponseModel{
    count?:number
    previous?:string
    next?:string
    result?:TopPlansModel[]
}
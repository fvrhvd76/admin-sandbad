import { transmissionsModel } from "./transmissionsModel";

export interface transmissionsListModel {
  count: number
  previous: string
  next: string
  result: transmissionsModel[]
}
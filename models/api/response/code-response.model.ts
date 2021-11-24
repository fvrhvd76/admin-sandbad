import { CodeModel } from "~/models/api/code.model";

export interface CodeResponseModel {
  count?: number;
  next?: string;
  previous?: string;
  result?: CodeModel[];
}

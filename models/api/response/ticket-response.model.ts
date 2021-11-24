import { TicketModel } from '~/models/api/ticket.model'

export interface TicketResponseModel{
    count?: number;
    previous?: string;
    next?: string;
    result?: TicketModel[]
}
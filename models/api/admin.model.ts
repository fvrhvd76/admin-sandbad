export interface AdminModel {
    id?: number
    username?: string
    first_name?: string
    last_name?: string
    email?: string
    phone_number?: string
    image?: string
    permissions?: {
        manage_admins: false,
        manage_users: false,
        manage_financial: false,
        manage_supporters: false,
        manage_discounts: false,
        send_message: false,
        view_reports: false,
        manage_tickets: false,
        manage_contents: false,
        manage_transmissions: false,
        manage_factors: false,
    }
}
export interface Tickets {
    TicketsId: string
    NamaPengaju: string
    NamaKepadaRole: string
    Subject: string
    Message: string
    Status: string
}

export interface TicketsDetail {
    TicketsId: string
    UserId: string
    NamaUser: string
    RoleId: string
    NamaRole: string
    KepadaRoleId: string
    NamaKepadaRole: string
    Subject: string
    Message: string
    Status: string
    CreatedAt: Date
    UpdatedAt: Date
    File: {
        TicketsFileId: string
        NamaFile: string
        NamaDokumen: string
    }[]
}

export interface TicketFile {
    TicketsFileId: string
    TicketsId: string
    NamaFile: string
    NamaDokumen: string
    CreatedAt: Date
    UpdatedAt: Date
}
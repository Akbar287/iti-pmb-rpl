import { Pagination } from '@/types/Pagination'
import { Tickets, TicketsDetail, TicketFile } from '@/types/TicketsTypes'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// ==================== TICKETS ====================

// GET - Get ticket by ID (detail)
async function getTicketById(id: string): Promise<TicketsDetail> {
    const res = await fetch(`${BASE_URL}/api/protected/tickets?id=${id}`)

    if (!res.ok) {
        throw new Error('Failed to get ticket data')
    }

    return await res.json()
}

// GET - Get tickets with pagination and filters
async function getTicketsPagination(
    page: number,
    limit: number,
    search: string = '',
    userId: string = '',
    roleId: string = '',
    status: string = ''
): Promise<Pagination<Tickets[]>> {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    })

    if (search) params.append('search', search)
    if (userId) params.append('userId', userId)
    if (roleId) params.append('roleId', roleId)
    if (status) params.append('status', status)

    const res = await fetch(`${BASE_URL}/api/protected/tickets?${params.toString()}`)

    if (!res.ok) {
        throw new Error('Failed to get tickets data')
    }

    return await res.json()
}

// POST - Create new ticket
async function createTicket(data: {
    UserId: string
    RoleId: string
    KepadaRoleId: string
    Subject: string
    Message: string
}): Promise<Tickets> {
    const res = await fetch(`${BASE_URL}/api/protected/tickets`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    if (!res.ok) {
        throw new Error('Failed to create ticket')
    }

    return await res.json()
}

// PUT - Update ticket
async function updateTicket(data: {
    TicketsId: string
    UserId: string
    RoleId: string
    KepadaRoleId: string
    Subject: string
    Message: string
    Status: string
}): Promise<Tickets> {
    const res = await fetch(`${BASE_URL}/api/protected/tickets`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    if (!res.ok) {
        throw new Error('Failed to update ticket')
    }

    return await res.json()
}

// DELETE - Delete ticket
async function deleteTicket(id: string): Promise<null> {
    const res = await fetch(`${BASE_URL}/api/protected/tickets?id=${id}`, {
        method: 'DELETE',
    })

    if (!res.ok) {
        throw new Error('Failed to delete ticket')
    }

    return await res.json()
}

// ==================== TICKET FILES ====================

// GET - Get file by ID (single)
async function getTicketFileById(id: string): Promise<TicketFile> {
    const res = await fetch(`${BASE_URL}/api/protected/tickets/file?id=${id}`)

    if (!res.ok) {
        throw new Error('Failed to get ticket file')
    }

    return await res.json()
}

// GET - Get file download URL
function getTicketFileDownloadUrl(id: string): string {
    return `${BASE_URL}/api/protected/tickets/file?id=${id}&download=true`
}

// GET - Get all files by TicketsId (many)
async function getTicketFilesByTicketsId(ticketsId: string): Promise<TicketFile[]> {
    const res = await fetch(`${BASE_URL}/api/protected/tickets/file?ticketsId=${ticketsId}`)

    if (!res.ok) {
        throw new Error('Failed to get ticket files')
    }

    return await res.json()
}

// POST - Upload file to ticket
async function uploadTicketFile(ticketsId: string, file: File): Promise<TicketFile> {
    const formData = new FormData()
    formData.append('ticketsId', ticketsId)
    formData.append('file', file)

    const res = await fetch(`${BASE_URL}/api/protected/tickets/file`, {
        method: 'POST',
        body: formData,
    })

    if (!res.ok) {
        throw new Error('Failed to upload ticket file')
    }

    return await res.json()
}

// DELETE - Delete ticket file
async function deleteTicketFile(id: string): Promise<{ status: string; message: string }> {
    const res = await fetch(`${BASE_URL}/api/protected/tickets/file?id=${id}`, {
        method: 'DELETE',
    })

    if (!res.ok) {
        throw new Error('Failed to delete ticket file')
    }

    return await res.json()
}

export {
    // Tickets
    getTicketById,
    getTicketsPagination,
    createTicket,
    updateTicket,
    deleteTicket,
    // Ticket Files
    getTicketFileById,
    getTicketFileDownloadUrl,
    getTicketFilesByTicketsId,
    uploadTicketFile,
    deleteTicketFile,
}

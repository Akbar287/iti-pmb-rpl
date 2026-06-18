export interface NotifikasiItem {
    id: string
    tipe: 'status' | 'ticket'
    judul: string
    pesan: string
    url: string
    createdAt: string
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

export async function getNotifikasi(): Promise<NotifikasiItem[]> {
    const res = await fetch(`${BASE_URL}/api/protected/notifikasi`, {
        credentials: 'include',
    })
    if (!res.ok) throw new Error('Failed to fetch notifikasi')
    const json = await res.json()
    return Array.isArray(json.data) ? json.data : []
}

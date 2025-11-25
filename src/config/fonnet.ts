import { FonnteClient } from 'fonnte-wa'

const apiKey = process.env.NEXT_FONNTE_TOKEN

if (!apiKey) {
    throw new Error('FONNTE_API_KEY belum di-set di .env')
}

export const fonnteClient = new FonnteClient({
    apiKey,
    // baseUrl: 'https://api.fonnte.com', // kalau mau override
    // timeout: 30000,
})

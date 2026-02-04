import { FonnteClient } from 'fonnte-wa'

let client: FonnteClient | null = null

export function getFonnteClient() {
    const apiKey = process.env.NEXT_FONNTE_TOKEN

    if (!apiKey) {
        throw new Error('FONNTE_API_KEY belum di-set')
    }

    if (!client) {
        client = new FonnteClient({ apiKey })
    }

    return client
}

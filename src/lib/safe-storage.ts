const isClient = typeof window !== 'undefined'

export const safeStorage = {
    getItem: (key: string): string | null => {
        if (!isClient) return null
        return localStorage.getItem(key)
    },
    setItem: (key: string, value: string): void => {
        if (!isClient) return
        localStorage.setItem(key, value)
    },
    removeItem: (key: string): void => {
        if (!isClient) return
        localStorage.removeItem(key)
    },
}

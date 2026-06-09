export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const g = globalThis as typeof globalThis & {
            localStorage?: Storage
            sessionStorage?: Storage
        }

        // Node.js v25 exposes localStorage as a global but its SQLite backend
        // may fail to initialize, leaving getItem/setItem as non-functions.
        // Replace it with a safe no-op so SSR never throws.
        const noopStorage: Storage = {
            getItem: () => null,
            setItem: () => undefined,
            removeItem: () => undefined,
            clear: () => undefined,
            key: () => null,
            length: 0,
        }

        if (
            typeof g.localStorage !== 'undefined' &&
            typeof g.localStorage?.getItem !== 'function'
        ) {
            g.localStorage = noopStorage
        }

        if (
            typeof g.sessionStorage !== 'undefined' &&
            typeof g.sessionStorage?.getItem !== 'function'
        ) {
            g.sessionStorage = noopStorage
        }
    }
}

import HomePage from './(no-auth)/home/page'
import MainPage from './(auth)/main/page'
import { getSession } from '@/provider/api'

export default async function Home() {
    const session = await getSession()

    return session != null ? <MainPage /> : <HomePage />
}

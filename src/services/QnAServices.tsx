import { QuestionAndAsk } from "@/types/QuestionAndAskTypes"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

async function getQnAMasterData(
    page: number,
    limit: number,
    search: string
) {
    const res = await fetch(`${BASE_URL}/api/protected/qna?page=${page}&limit=${limit}&search=${search}`)

    if (!res.ok) {
        throw new Error('Failed to get QnA data')
    }

    const data = await res.json()
    return data
}

async function getQnAMasterDataById(id: string) {
    const res = await fetch(`${BASE_URL}/api/protected/qna?id=${id}`)

    if (!res.ok) {
        throw new Error('Failed to get QnA data')
    }

    const data = await res.json()
    return data
}

async function createQnAMasterData(data: QuestionAndAsk) {
    const res = await fetch(`${BASE_URL}/api/protected/qna`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    if (!res.ok) {
        throw new Error('Failed to create QnA data')
    }

    const response = await res.json()
    return response
}

async function updateQnAMasterData(data: QuestionAndAsk) {
    const res = await fetch(`${BASE_URL}/api/protected/qna`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    if (!res.ok) {
        throw new Error('Failed to update QnA data')
    }

    const response = await res.json()
    return response
}

async function deleteQnAMasterData(id: string) {
    const res = await fetch(`${BASE_URL}/api/protected/qna?id=${id}`, {
        method: 'DELETE',
    })

    if (!res.ok) {
        throw new Error('Failed to delete QnA data')
    }

    const response = await res.json()
    return response
}

export {
    getQnAMasterData,
    getQnAMasterDataById,
    createQnAMasterData,
    updateQnAMasterData,
    deleteQnAMasterData
}

import {
    RequestCreateUserType,
    UserResponseByIdType,
    UserResponsesType,
} from '@/types/ManajemenUser'
import { Pagination } from '@/types/Pagination'
import { UserTable } from '@/types/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getUserPagination(
    page: number,
    limit: number,
    search: string
): Promise<Pagination<UserResponseByIdType[]>> {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search,
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-data/pengguna?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch user')
    return res.json()
}

export async function getUserId(UserId: string): Promise<UserResponsesType> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-data/pengguna?UserId=${UserId}`
    )
    if (!res.ok) throw new Error('Failed to fetch user')
    return res.json()
}

export async function setAssignRoleIntoUser(
    data: UserTable
): Promise<UserTable> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-data/pengguna?jenis=assign-role`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to assing role into user')
    }
    return res.json()
}

export async function setUser(
    data: RequestCreateUserType
): Promise<UserResponsesType> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-data/pengguna?jenis=set-user`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to create user')
    }
    return res.json()
}

export async function updateUser(
    UserId: string,
    data: RequestCreateUserType
): Promise<UserResponsesType> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-data/pengguna?UserId=${UserId}&jenis=update-user`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) {
        throw new Error('Failed to update user')
    }
    return res.json()
}

export async function resetPassword(UserId: string): Promise<void> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-data/pengguna?UserId=${UserId}&jenis=ubah-password`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    if (!res.ok) {
        throw new Error('Failed to update password user')
    }
    return res.json()
}

export async function deleteUser(id: string): Promise<void> {
    const res = await fetch(
        `${BASE_URL}/api/protected/manajemen-data/pengguna?id=${id}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    if (!res.ok) {
        throw new Error('Failed to delete user')
    }
    return res.json()
}

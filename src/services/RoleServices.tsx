import { Role } from '@/generated/prisma'
import { Pagination } from '@/types/Pagination'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const getRolesPagination = async (
    page: number,
    limit: number,
    search?: string,
): Promise<Pagination<Role[]>> => {
    const url = `${BASE_URL}/api/protected/role?page=${page}&limit=${limit}&search=${search}`
    const res = await fetch(url)
    if (!res.ok) {
        throw new Error('Failed to fetch roles')
    }
    return res.json()
}

export const getRoleById = async (id: string): Promise<Role> => {
    const url = `${BASE_URL}/api/protected/role?id=${id}`
    const res = await fetch(url)
    if (!res.ok) {
        throw new Error('Failed to fetch role')
    }
    return res.json()
}

export const createRole = async (role: Role): Promise<Role> => {
    const url = `${BASE_URL}/api/protected/role`
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(role),
    })
    if (!res.ok) {
        throw new Error('Failed to create role')
    }
    return res.json()
}

export const updateRole = async (role: Role): Promise<Role> => {
    const url = `${BASE_URL}/api/protected/role`
    const res = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(role),
    })
    if (!res.ok) {
        throw new Error('Failed to update role')
    }
    return res.json()
}

export const deleteRole = async (id: string): Promise<Role> => {
    const url = `${BASE_URL}/api/protected/role?id=${id}`
    const res = await fetch(url, {
        method: 'DELETE',
    })
    if (!res.ok) {
        throw new Error('Failed to delete role')
    }
    return res.json()
}
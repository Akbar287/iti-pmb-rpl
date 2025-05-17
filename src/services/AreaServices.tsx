import {
    Country,
    Desa,
    Kabupaten,
    Kecamatan,
    Provinsi,
} from '@/generated/prisma'
import { Pagination } from '@/types/Pagination'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Country
export async function getCountryPagination(
    page: number,
    limit: number,
    search: string
): Promise<Pagination<Country[]>> {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search,
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/area/country?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to fetch country')
    return res.json()
}

export async function getCountry(): Promise<Country[]> {
    const res = await fetch(`${BASE_URL}/api/protected/area/country`)
    if (!res.ok) throw new Error('Failed to fetch country')
    return res.json()
}

export async function getCountryId(countryId: string): Promise<Country> {
    const res = await fetch(
        `${BASE_URL}/api/protected/area/country?id=${countryId}`
    )
    if (!res.ok) throw new Error('Failed to fetch country')
    return res.json()
}

export async function setCountry(data: Country): Promise<Country> {
    const res = await fetch(`${BASE_URL}/api/protected/area/country`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        throw new Error('Failed to create country')
    }
    return res.json()
}

export async function updateCountry(data: Country): Promise<Country> {
    const res = await fetch(`${BASE_URL}/api/protected/area/country`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        throw new Error('Failed to update country')
    }
    return res.json()
}

export async function deleteCountry(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/protected/area/country?id=${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    if (!res.ok) {
        throw new Error('Failed to delete country')
    }
    return res.json()
}

// End Country

// Provinsi
export async function getProvinsiPagination(
    page: number,
    limit: number,
    search: string,
    countryId?: string
): Promise<Pagination<Provinsi[]>> {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search,
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/area/provinsi?${params.toString()}${
            countryId ? '&countryId=' + countryId : ''
        } `
    )
    if (!res.ok) throw new Error('Failed to fetch provinsi')
    return res.json()
}

export async function getProvinsi(): Promise<Provinsi[]> {
    const res = await fetch(`${BASE_URL}/api/protected/area/provinsi`)
    if (!res.ok) throw new Error('Failed to fetch provinsi')
    return res.json()
}

export async function getProvinsiId(provinsiId: string): Promise<Provinsi> {
    const res = await fetch(
        `${BASE_URL}/api/protected/area/provinsi?id=${provinsiId}`
    )
    if (!res.ok) throw new Error('Failed to fetch provinsi')
    return res.json()
}

export async function getProvinsiByCountryId(
    countryId: string
): Promise<Provinsi[]> {
    const res = await fetch(
        `${BASE_URL}/api/protected/area/provinsi?countryId=${countryId}`
    )
    if (!res.ok) throw new Error('Failed to fetch provinsi')

    return res.json()
}

export async function setProvinsi(data: Provinsi): Promise<Provinsi> {
    const res = await fetch(`${BASE_URL}/api/protected/area/provinsi`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        throw new Error('Failed to create provinsi')
    }
    return res.json()
}

export async function updateProvinsi(data: Provinsi): Promise<Provinsi> {
    const res = await fetch(`${BASE_URL}/api/protected/area/provinsi`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        throw new Error('Failed to update provinsi')
    }
    return res.json()
}

export async function deleteProvinsi(id: string): Promise<void> {
    const res = await fetch(
        `${BASE_URL}/api/protected/area/provinsi?id=${id}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    if (!res.ok) {
        throw new Error('Failed to delete provinsi')
    }
    return res.json()
}
// End Provinsi

// Kabupaten
export async function getKabupatenPagination(
    page: number,
    limit: number,
    search: string,
    provinsiId?: string
): Promise<Pagination<Kabupaten[]>> {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search,
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/area/kabupaten?${params.toString()}${
            provinsiId ? '&provinsiId=' + provinsiId : ''
        } `
    )
    if (!res.ok) throw new Error('Failed to fetch kabupaten')
    return res.json()
}

export async function getKabupaten(): Promise<Kabupaten[]> {
    const res = await fetch(`${BASE_URL}/api/protected/area/kabupaten`)
    if (!res.ok) throw new Error('Failed to fetch kabupaten')
    return res.json()
}

export async function getKabupatenId(kabupatenId: string): Promise<Kabupaten> {
    const res = await fetch(
        `${BASE_URL}/api/protected/area/kabupaten?id=${kabupatenId}`
    )
    if (!res.ok) throw new Error('Failed to fetch kabupaten')
    return res.json()
}

export async function getKabupatenByProvinsiId(
    provinsiId: string
): Promise<Kabupaten[]> {
    const res = await fetch(
        `${BASE_URL}/api/protected/area/kabupaten?provinsiId=${provinsiId}`
    )
    if (!res.ok) throw new Error('Failed to fetch kabupaten')
    return res.json()
}

export async function setKabupaten(data: Kabupaten): Promise<Kabupaten> {
    const res = await fetch(`${BASE_URL}/api/protected/area/kabupaten`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        throw new Error('Failed to create kabupaten')
    }
    return res.json()
}

export async function updateKabupaten(data: Kabupaten): Promise<Kabupaten> {
    const res = await fetch(`${BASE_URL}/api/protected/area/kabupaten`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        throw new Error('Failed to update kabupaten')
    }
    return res.json()
}

export async function deleteKabupaten(id: string): Promise<void> {
    const res = await fetch(
        `${BASE_URL}/api/protected/area/kabupaten?id=${id}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    if (!res.ok) {
        throw new Error('Failed to delete kabupaten')
    }
    return res.json()
}
// End Kabupaten

// Kecamatan
export async function getKecamatanPagination(
    page: number,
    limit: number,
    search: string,
    kabupatenId?: string
): Promise<Pagination<Kecamatan[]>> {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search,
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/area/kecamatan?${params.toString()}${
            kabupatenId ? '&kabupatenId=' + kabupatenId : ''
        } `
    )
    if (!res.ok) throw new Error('Failed to fetch kecamatan')
    return res.json()
}

export async function getKecamatan(): Promise<Kecamatan[]> {
    const res = await fetch(`${BASE_URL}/api/protected/area/kecamatan`)
    if (!res.ok) throw new Error('Failed to fetch kecamatan')
    return res.json()
}

export async function getKecamatanId(kecamatanId: string): Promise<Kecamatan> {
    const res = await fetch(
        `${BASE_URL}/api/protected/area/kecamatan?id=${kecamatanId}`
    )
    if (!res.ok) throw new Error('Failed to fetch kecamatan')
    return res.json()
}

export async function getKecamatanByKabupatenId(
    kabupatenId: string
): Promise<Kecamatan[]> {
    const res = await fetch(
        `${BASE_URL}/api/protected/area/kecamatan?kabupatenId=${kabupatenId}`
    )
    if (!res.ok) throw new Error('Failed to fetch kecamatan')
    return res.json()
}

export async function setKecamatan(data: Kecamatan): Promise<Kecamatan> {
    const res = await fetch(`${BASE_URL}/api/protected/area/kecamatan`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        throw new Error('Failed to create kecamatan')
    }
    return res.json()
}

export async function updateKecamatan(data: Kecamatan): Promise<Kecamatan> {
    const res = await fetch(`${BASE_URL}/api/protected/area/kecamatan`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        throw new Error('Failed to update kecamatan')
    }
    return res.json()
}

export async function deleteKecamatan(id: string): Promise<void> {
    const res = await fetch(
        `${BASE_URL}/api/protected/area/kecamatan?id=${id}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
    if (!res.ok) {
        throw new Error('Failed to delete kecamatan')
    }
    return res.json()
}
// End Kecamatan

// Desa
export async function getDesaPagination(
    page: number,
    limit: number,
    search: string,
    kecamatanId?: string
): Promise<Pagination<Desa[]>> {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search,
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/area/desa?${params.toString()}${
            kecamatanId ? '&kecamatanId=' + kecamatanId : ''
        } `
    )
    if (!res.ok) throw new Error('Failed to fetch desa')
    return res.json()
}

export async function getDesa(): Promise<Desa[]> {
    const res = await fetch(`${BASE_URL}/api/protected/area/desa`)
    if (!res.ok) throw new Error('Failed to fetch desa')
    return res.json()
}

export async function getDesaId(desaId: string): Promise<Desa> {
    const res = await fetch(`${BASE_URL}/api/protected/area/desa?id=${desaId}`)
    if (!res.ok) throw new Error('Failed to fetch desa')
    return res.json()
}

export async function getDesaByKecamatanId(
    kecamatanId: string
): Promise<Desa[]> {
    const res = await fetch(
        `${BASE_URL}/api/protected/area/desa?kecamatanId=${kecamatanId}`
    )
    if (!res.ok) throw new Error('Failed to fetch desa')
    return res.json()
}

export async function setDesa(data: Desa): Promise<Desa> {
    const res = await fetch(`${BASE_URL}/api/protected/area/desa`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        throw new Error('Failed to create desa')
    }
    return res.json()
}

export async function updateDesa(data: Desa): Promise<Desa> {
    const res = await fetch(`${BASE_URL}/api/protected/area/desa`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        throw new Error('Failed to update desa')
    }
    return res.json()
}

export async function deleteDesa(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/protected/area/desa?id=${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    if (!res.ok) {
        throw new Error('Failed to delete desa')
    }
    return res.json()
}
// End Desa

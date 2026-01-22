import { EkuivalenCheckType, UpdateEkuivalenCheckType } from "@/types/EkuivalenCheck"


const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getEkuivalenCheckForMahasiswa(
    PendaftaranId: string
): Promise<EkuivalenCheckType> {
    const res = await fetch(
        `${BASE_URL}/api/protected/ekuivalen-check?PendaftaranId=${PendaftaranId}`
    )
    if (!res.ok) throw new Error('Failed to fetch ekuivalen-check')
    return res.json()
}

export async function createOrUpdateEkuivalenCheck(
    data: UpdateEkuivalenCheckType
): Promise<void> {
    const res = await fetch(
        `${BASE_URL}/api/protected/asessment/ekuivalen-check`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
    )
    if (!res.ok) throw new Error('Failed to create/update ekuivalen-check')
    return res.json()
}

export async function deleteEkuivalenCheck(
    TranskripNilaiId: string,
    MataKuliahMahasiswaId: string
): Promise<void> {
    const res = await fetch(
        `${BASE_URL}/api/protected/asessment/ekuivalen-check?TranskripNilaiId=${TranskripNilaiId}&MataKuliahMahasiswaId=${MataKuliahMahasiswaId}`,
        {
            method: 'DELETE',
        }
    )
    if (!res.ok) throw new Error('Failed to delete ekuivalen-check')
    return res.json()
}
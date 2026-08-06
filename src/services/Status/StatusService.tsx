const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function setStatusPengisianDataDiri(
    PendaftaranId: string
): Promise<{
    status: string
    data: any
    message: string
}> {
    const params = new URLSearchParams({
        p: String(PendaftaranId),
        j: String('pdd'),
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/status?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to change status')
    return res.json()
}

export async function setStatusAsessmenMandiri(PendaftaranId: string): Promise<{
    status: string
    data: any
    message: string
}> {
    const params = new URLSearchParams({
        p: String(PendaftaranId),
        j: String('am'),
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/status?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to change status')
    return res.json()
}
// New
export async function setStatusPenunjukanAsesor(
    PendaftaranId: string
): Promise<{
    status: string
    data: any
    message: string
}> {
    const params = new URLSearchParams({
        p: String(PendaftaranId),
        j: String('pa'),
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/status?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to change status')
    return res.json()
}
export async function setStatusPersetujuanPenunjukanAsesor(
    PendaftaranId: string
): Promise<{
    status: string
    data: any
    message: string
}> {
    const params = new URLSearchParams({
        p: String(PendaftaranId),
        j: String('ppa'),
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/status?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to change status')
    return res.json()
}
export async function setStatusAsessmenOlehAsesor(
    PendaftaranId: string
): Promise<{
    status: string
    data: any
    message: string
}> {
    const params = new URLSearchParams({
        p: String(PendaftaranId),
        j: String('aoa'),
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/status?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to change status')
    return res.json()
}
// end New
export async function setStatusRekapitulasiAsessmen(
    PendaftaranId: string
): Promise<{
    status: string
    data: any
    message: string
}> {
    const params = new URLSearchParams({
        p: String(PendaftaranId),
        j: String('ra'),
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/status?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to change status')
    return res.json()
}
export async function setStatusSanggahan(PendaftaranId: string): Promise<{
    status: string
    data: any
    message: string
}> {
    const params = new URLSearchParams({
        p: String(PendaftaranId),
        j: String('s'),
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/status?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to change status')
    return res.json()
}
export async function setStatusHasilFinalAsessmen(
    PendaftaranId: string
): Promise<{
    status: string
    data: any
    message: string
}> {
    const params = new URLSearchParams({
        p: String(PendaftaranId),
        j: String('hfa'),
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/status?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to change status')
    return res.json()
}
// NEw
//End New
export async function setStatusPenerbitanSKAsessmen(
    PendaftaranId: string
): Promise<{
    status: string
    data: any
    message: string
}> {
    const params = new URLSearchParams({
        p: String(PendaftaranId),
        j: String('psa'),
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/status?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to change status')
    return res.json()
}
export async function setStatusPersetujuanSkAsessmen(
    PendaftaranId: string
): Promise<{
    status: string
    data: any
    message: string
}> {
    const params = new URLSearchParams({
        p: String(PendaftaranId),
        j: String('pska'),
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/status?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to change status')
    return res.json()
}
export async function setStatusPenandatangananSk(
    PendaftaranId: string
): Promise<{
    status: string
    data: any
    message: string
}> {
    const params = new URLSearchParams({
        p: String(PendaftaranId),
        j: String('pts'),
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/status?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to change status')
    return res.json()
}
export async function setStatusSinkronisasiHasilAsessmen(
    PendaftaranId: string
): Promise<{
    status: string
    data: any
    message: string
}> {
    const params = new URLSearchParams({
        p: String(PendaftaranId),
        j: String('sha'),
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/status?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to change status')
    return res.json()
}
export async function setStatusSelesai(
    PendaftaranId: string
): Promise<{
    status: string
    data: any
    message: string
}> {
    const params = new URLSearchParams({
        p: String(PendaftaranId),
        j: String('done'),
    })
    const res = await fetch(
        `${BASE_URL}/api/protected/status?${params.toString()}`
    )
    if (!res.ok) throw new Error('Failed to change status')
    return res.json()
}

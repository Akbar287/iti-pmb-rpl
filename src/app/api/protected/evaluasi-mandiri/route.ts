import {
    MataKuliahMahasiswa,
    StatusMataKuliahMahasiswa,
} from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import {
    CreateMataKuliahMahasiswaTypes,
    DaftarUlangProdiType,
} from '@/types/DaftarUlangProdi'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/evaluasi-mandiri')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const id = c.req.query('id')

    const pilihMataKuliah = await prisma.mataKuliahMahasiswa.findMany({
        select: {
            MataKuliahMahasiswaId: true,
            PendaftaranId: true,
            MataKuliahId: true,
            Rpl: true,
            StatusMataKuliahMahasiswa: true,
            Keterangan: true,
            _count: {
                select: {
                    EvaluasiDiri: true,
                },
            },
        },
        where: {
            PendaftaranId: id,
        },
    })

    let temp = 0
    pilihMataKuliah.forEach((pm) => {
        temp += pm._count.EvaluasiDiri
    })

    const data = await prisma.daftarUlang.findFirst({
        where: {
            PendaftaranId: id,
        },
        select: {
            DaftarUlangId: true,
            PendaftaranId: true,
            Nim: true,
            JenjangKkniDituju: true,
            KipK: true,
            Aktif: true,
            MengisiBiodata: true,
            Finalisasi: true,
            TanggalDaftar: true,
            TanggalDaftarUlang: true,
            CreatedAt: true,
            UpdatedAt: true,
            ProgramStudi: {
                select: {
                    ProgramStudiId: true,
                    UniversityId: true,
                    Nama: true,
                    Jenjang: true,
                    Akreditasi: true,
                    MataKuliah: {
                        select: {
                            MataKuliahId: true,
                            ProgramStudiId: true,
                            Kode: true,
                            Nama: true,
                            Sks: true,
                            Semester: true,
                            Silabus: true,
                            MataKuliahMahasiswa: {
                                select: {
                                    MataKuliahMahasiswaId: true,
                                    PendaftaranId: true,
                                    MataKuliahId: true,
                                    Rpl: true,
                                    StatusMataKuliahMahasiswa: true,
                                    Keterangan: true,
                                    CreatedAt: true,
                                    UpdatedAt: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    })

    const res: DaftarUlangProdiType = {
        DaftarUlangId: data?.DaftarUlangId || '',
        PendaftaranId: data?.PendaftaranId || '',
        Nim: data?.Nim || '',
        PilihMataKuliah: pilihMataKuliah.length,
        EvaluasiDiriMataKuliah: temp || 0,
        JenjangKkniDituju: data?.JenjangKkniDituju || '',
        KipK: data?.KipK || false,
        Aktif: data?.Aktif || false,
        MengisiBiodata: data?.MengisiBiodata || false,
        Finalisasi: data?.Finalisasi || false,
        TanggalDaftar: data?.TanggalDaftar || null,
        TanggalDaftarUlang: data?.TanggalDaftarUlang || null,
        CreatedAt: data?.CreatedAt || null,
        UpdatedAt: data?.UpdatedAt || null,
        ProgramStudiId: data?.ProgramStudi.ProgramStudiId || '',
        UniversityId: data?.ProgramStudi.UniversityId || '',
        Nama: data?.ProgramStudi.Nama || '',
        Jenjang: data?.ProgramStudi.Jenjang || '',
        Akreditasi: data?.ProgramStudi.Akreditasi || '',
        MataKuliahMahasiswa: pilihMataKuliah || [],
        MataKuliah:
            data?.ProgramStudi.MataKuliah.map((mk) => ({
                MataKuliahId: mk.MataKuliahId,
                ProgramStudiId: mk.ProgramStudiId,
                Kode: mk.Kode,
                Nama: mk.Nama,
                Sks: mk.Sks,
                Semester: mk.Semester,
                Silabus: mk.Silabus,
            })) || [],
    }

    return c.json(res)
})

app.post('/', async (c) => {
    const body: CreateMataKuliahMahasiswaTypes = await c.req.json()
    const id = c.req.query('id')

    if (!id) {
        return c.json({ error: 'PendaftaranId is required' }, 400)
    }

    const mk = await prisma.daftarUlang.findFirst({
        select: {
            ProgramStudi: {
                select: {
                    MataKuliah: {
                        select: {
                            MataKuliahId: true,
                        },
                    },
                },
            },
        },
        where: {
            PendaftaranId: id,
        },
    })

    // Jika MK RPL Saja (hanya mk RPL maka gunakan yang bawah ini)
    const allMkRplInDb = await prisma.mataKuliahMahasiswa.findMany({
        where: {
            PendaftaranId: id,
        },
        select: {
            MataKuliahMahasiswaId: true,
            MataKuliahId: true,
        },
    })

    const temp: string[] = []

    allMkRplInDb.forEach((itemX) => {
        const isInY = body.some(
            (itemY) => itemY.MataKuliahId === itemX.MataKuliahId
        )
        if (!isInY) {
            temp.push(itemX.MataKuliahMahasiswaId)
        }
    })

    await Promise.all(
        temp.map((t) =>
            prisma.mataKuliahMahasiswa.delete({
                where: {
                    MataKuliahMahasiswaId: t,
                },
            })
        )
    )

    const allMataKuliah = mk?.ProgramStudi.MataKuliah ?? []

    for (const b of body) {
        const match = allMataKuliah.find(
            (a) => a.MataKuliahId === b.MataKuliahId
        )
        if (!match) continue

        await prisma.mataKuliahMahasiswa.upsert({
            where: {
                PendaftaranId_MataKuliahId: {
                    PendaftaranId: id,
                    MataKuliahId: b.MataKuliahId,
                },
            },
            update: {
                Rpl: true,
                Keterangan: b.Keterangan,
                StatusMataKuliahMahasiswa: StatusMataKuliahMahasiswa.DRAFT,
                UpdatedAt: new Date(),
            },
            create: {
                PendaftaranId: id,
                MataKuliahId: b.MataKuliahId,
                Rpl: true,
                Keterangan: b.Keterangan,
                StatusMataKuliahMahasiswa: StatusMataKuliahMahasiswa.DRAFT,
                CreatedAt: new Date(),
                UpdatedAt: new Date(),
            },
        })
    }

    // Jika Semua MK (Tidak hanya RPL maka gunakan yang bawah)
    // const bodyMap = new Map(
    //     body.map((item) => [item.MataKuliahId, item.Keterangan])
    // )

    // const allMataKuliah = mk?.ProgramStudi.MataKuliah ?? []
    // for (const mk1 of allMataKuliah) {
    //     const keterangan = bodyMap.get(mk1.MataKuliahId)
    //     const isRpl = bodyMap.has(mk1.MataKuliahId)

    //     await prisma.mataKuliahMahasiswa.upsert({
    //         where: {
    //             PendaftaranId_MataKuliahId: {
    //                 PendaftaranId: id,
    //                 MataKuliahId: mk1.MataKuliahId,
    //             },
    //         },
    //         create: {
    //             PendaftaranId: id,
    //             MataKuliahId: mk1.MataKuliahId,
    //             Rpl: isRpl,
    //             Keterangan: isRpl ? keterangan : null,
    //             StatusMataKuliahMahasiswa: StatusMataKuliahMahasiswa.DRAFT,
    //             CreatedAt: new Date(),
    //             UpdatedAt: new Date(),
    //         },
    //         update: {
    //             Rpl: isRpl,
    //             Keterangan: isRpl ? keterangan : null,
    //             StatusMataKuliahMahasiswa: StatusMataKuliahMahasiswa.DRAFT,
    //             UpdatedAt: new Date(),
    //         },
    //     })
    // }

    const response = await prisma.mataKuliahMahasiswa.findMany({
        where: {
            PendaftaranId: id,
        },
    })

    return c.json(response, 200)
})

export const GET = handle(app)
export const POST = handle(app)

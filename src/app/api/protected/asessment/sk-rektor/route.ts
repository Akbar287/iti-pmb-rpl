import { JenisSkAsessmen, Prisma, SkRektor } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { bacaBerkas, berkasAda, simpanBerkas } from '@/lib/storage'
import { withApiAuth } from '@/middlewares/api-auth'
import { getSession } from '@/provider/api'
import { ResponseSkRektorAsessmenType } from '@/types/FinalAsessmen'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import mime from 'mime'
import { v4 as uuidv4 } from 'uuid'
import { cookies } from 'next/headers'

// Tahap-tahap yang masih menjadi tanggung jawab / pantauan Akademik pada menu
// Sk. Rektor: menyiapkan & merevisi SK, memantau persetujuan dan tanda tangan,
// lalu mempublikasikan SK yang sudah ditandatangani Rektor.
const STATUS_SK_AKADEMIK = [
    'Penerbitan SK Asessmen',
    'Persetujuan SK Asessmen',
    'Penandatanganan SK',
    'Sinkronisasi Hasil Asessmen',
    'Selesai',
]

const app = new Hono().basePath('/api/protected/asessment/sk-rektor')
const BASE_URL = process.env.BACKEND_API_BASE_URL

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const session = await getSession()
    const jenis = c.req.query('jenis')
    const isMahasiswa = c.req.query('_m')
    const isAsesor = c.req.query('_a')
    const isAkademik = c.req.query('_k')

    if (session) {
        if (jenis === '_f') {
            const filename = c.req.query('_f')
            if (!filename) {
                return c.json(
                    { data: [], status: 'error', message: 'file is required' },
                    { status: 400 }
                )
            }

            try {
                const fileRecord = await prisma.skRektor.findFirst({
                    where: { NamaFile: filename },
                    select: {
                        PathFile: true,
                        NamaDokumen: true,
                    },
                })

                if (
                    !fileRecord ||
                    !(await berkasAda(fileRecord.PathFile))
                ) {
                    return c.json(
                        {
                            data: [],
                            status: 'error',
                            message: 'file not found in storage',
                        },
                        { status: 404 }
                    )
                }

                const contentType =
                    mime.getType(fileRecord.NamaDokumen || filename) ||
                    'application/octet-stream'

                return c.body(await bacaBerkas(fileRecord.PathFile), 200, {
                    'Content-Type': contentType,
                    'Content-Disposition': `inline; filename="${filename}"`,
                })
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'error'
                return c.json(
                    { data: [], status: 'error', message: errorMessage },
                    { status: 500 }
                )
            }
        }
        if (jenis === 'get-sk-rektor') {
            const page = parseInt(c.req.query('page') || '1', 10)
            const limit = parseInt(c.req.query('limit') || '10', 10)
            const search = c.req.query('search') || ''
            if (isMahasiswa) {
                let where: Prisma.PendaftaranWhereInput = search
                    ? {
                        AND: [
                            {
                                Mahasiswa: { UserId: session.user.id }
                            },
                            {
                                // Mahasiswa hanya melihat berkasnya di menu ini
                                // setelah SK dipublikasikan Akademik; sebelum
                                // itu berkas ada di menu Hasil Asessmen.
                                SkRektorMahasiswa: {
                                    some: { SkRektor: { Dipublikasikan: true } },
                                },
                            },
                            {
                                OR: [
                                    {
                                        DaftarUlang: {
                                            some: {
                                                Nim: {
                                                    contains: search,
                                                    mode: 'insensitive',
                                                },
                                            },
                                        },
                                    },
                                    {
                                        KodePendaftar: {
                                            contains: search,
                                            mode: 'insensitive',
                                        },
                                    },
                                    {
                                        Mahasiswa: {
                                            User: {
                                                OR: [
                                                    {
                                                        NomorHp: {
                                                            contains: search,
                                                            mode: 'insensitive',
                                                        },
                                                        Nama: {
                                                            contains: search,
                                                            mode: 'insensitive',
                                                        },
                                                        Email: {
                                                            contains: search,
                                                            mode: 'insensitive',
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                    },
                                ],
                            },
                        ],
                    }
                    : {
                        AND: [
                            {
                                Mahasiswa: { UserId: session.user.id }
                            },
                            {
                                // Mahasiswa hanya melihat berkasnya di menu ini
                                // setelah SK dipublikasikan Akademik; sebelum
                                // itu berkas ada di menu Hasil Asessmen.
                                SkRektorMahasiswa: {
                                    some: { SkRektor: { Dipublikasikan: true } },
                                },
                            },
                        ],
                    }
                const [data, total] = await Promise.all([
                    prisma.pendaftaran.findMany({
                        where,
                        distinct: ['PendaftaranId'],
                        skip: (page - 1) * limit,
                        take: limit,
                        orderBy: { KodePendaftar: 'asc' },
                        select: {
                            PendaftaranId: true,
                            KodePendaftar: true,
                            DaftarUlang: {
                                select: {
                                    Nim: true,
                                    ProgramStudi: {
                                        select: {
                                            Nama: true,
                                        },
                                    },
                                },
                            },
                            SkRektorMahasiswa: {
                                // Mahasiswa & asesor hanya melihat SK yang sudah dipublikasikan Akademik.
                                where: { SkRektor: { Dipublikasikan: true } },
                                select: {
                                    SkRektor: {
                                        select: {
                                            SkRektorId: true,
                                            JenisSkAsessmen: true,
                                            NamaFile: true,
                                            NamaDokumen: true,
                                            NomorSk: true,
                                        },
                                    },
                                },
                            },
                            StatusMahasiswaAssesmentHistory: {
                                select: {
                                    Aktif: true,
                                    StatusMahasiswaAssesment: {
                                        select: {
                                            NamaStatus: true,
                                        },
                                    },
                                },
                            },
                            Mahasiswa: {
                                select: {
                                    User: {
                                        select: {
                                            Nama: true,
                                            Email: true,
                                            NomorHp: true,
                                        },
                                    },
                                },
                            },
                        },
                    }),
                    prisma.pendaftaran.count({
                        where,
                    }),
                ])

                const response: ResponseSkRektorAsessmenType[] =
                    data?.map((am) => ({
                        Nama: am.Mahasiswa.User.Nama,
                        Email: am.Mahasiswa.User.Email,
                        Status: am.StatusMahasiswaAssesmentHistory.find(x => x.Aktif) ? am.StatusMahasiswaAssesmentHistory.find(x => x.Aktif)?.StatusMahasiswaAssesment.NamaStatus ?? '' : '',
                        NomorHp: am.Mahasiswa.User.NomorHp ?? '',
                        ProgramStudi: am.DaftarUlang.length === 0 ? '' : am.DaftarUlang[0].ProgramStudi.Nama ?? '',
                        NomorSk: am.SkRektorMahasiswa.length > 0 ? am.SkRektorMahasiswa[0].SkRektor.NomorSk ?? '' : '',
                        PendaftaranId: am.PendaftaranId,
                        KodePendaftar: am.KodePendaftar,
                        Nim:
                            am.DaftarUlang.length === 0
                                ? ''
                                : am.DaftarUlang[0].Nim ?? '',
                        SkRektor: am.SkRektorMahasiswa.length > 0 ? true : false,
                        DaftarSk: am.SkRektorMahasiswa.filter(
                            (x) => x.SkRektor.JenisSkAsessmen !== null
                        ).map((x) => ({
                            SkRektorId: x.SkRektor.SkRektorId,
                            JenisSkAsessmen: x.SkRektor.JenisSkAsessmen!,
                            NomorSk: x.SkRektor.NomorSk,
                            NamaFile: x.SkRektor.NamaFile,
                            NamaDokumen: x.SkRektor.NamaDokumen,
                        })),
                        NamaFile:
                            am.SkRektorMahasiswa.length > 0
                                ? am.SkRektorMahasiswa[0].SkRektor.NamaFile ?? ''
                                : '',
                    })) ?? []

                return c.json<{
                    data: ResponseSkRektorAsessmenType[]
                    page: number
                    limit: number
                    totalElement: number
                    totalPage: number
                    isFirst: boolean
                    isLast: boolean
                    hasNext: boolean
                    hasPrevious: boolean
                }>({
                    page: page,
                    limit: limit,
                    data: response,
                    totalElement: total,
                    totalPage: Math.ceil(total / limit),
                    isFirst: page === 1,
                    isLast:
                        page === Math.ceil(total / limit) ||
                        Math.ceil(total / limit) === 0,
                    hasNext: page < Math.ceil(total / limit),
                    hasPrevious: page > 1,
                })
            } else if (isAsesor) {
                let where: Prisma.AssesorMahasiswaWhereInput = search
                    ? {
                        AND: [
                            {
                                Asesor: {
                                    UserId: session.user.id
                                },
                            },
                            {
                                Pendaftaran: {
                                    OR: [
                                        {
                                            StatusMahasiswaAssesmentHistory: {
                                                some: {
                                                    Aktif: true,
                                                    StatusMahasiswaAssesment: {
                                                        NamaStatus: "Sinkronisasi Hasil Asessmen",
                                                    },
                                                },
                                            },
                                        },
                                        {
                                            StatusMahasiswaAssesmentHistory: {
                                                some: {
                                                    Aktif: true,
                                                    StatusMahasiswaAssesment: {
                                                        NamaStatus: "Selesai",
                                                    },
                                                },
                                            },
                                        },
                                    ]
                                }
                            },
                            {
                                Pendaftaran: {
                                    OR: [
                                        {
                                            Mahasiswa: {
                                                User: {
                                                    Nama: {
                                                        contains: search,
                                                        mode: 'insensitive',
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            KodePendaftar: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                        {
                                            DaftarUlang: {
                                                some: {
                                                    OR: [
                                                        {
                                                            Nim: {
                                                                contains: search,
                                                                mode: 'insensitive',
                                                            },
                                                        }, {
                                                            ProgramStudi: {
                                                                Nama: {
                                                                    contains: search,
                                                                    mode: 'insensitive',
                                                                },
                                                            },
                                                        }
                                                    ]
                                                },
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    } : {
                        AND: [
                            {
                                Asesor: {
                                    UserId: session.user.id
                                },
                            },
                            {
                                Pendaftaran: {
                                    OR: [
                                        {
                                            StatusMahasiswaAssesmentHistory: {
                                                some: {
                                                    Aktif: true,
                                                    StatusMahasiswaAssesment: {
                                                        NamaStatus: "Sinkronisasi Hasil Asessmen",
                                                    },
                                                },
                                            },
                                        },
                                        {
                                            StatusMahasiswaAssesmentHistory: {
                                                some: {
                                                    Aktif: true,
                                                    StatusMahasiswaAssesment: {
                                                        NamaStatus: "Selesai",
                                                    },
                                                },
                                            },
                                        },
                                    ]
                                }
                            },
                        ],
                    }
                const [data, total] = await Promise.all([
                    prisma.assesorMahasiswa.findMany({
                        distinct: ['PendaftaranId'],
                        where,
                        skip: (page - 1) * limit,
                        take: limit,
                        orderBy: { Pendaftaran: { KodePendaftar: 'asc' } },
                        select: {
                            PendaftaranId: true,
                            Pendaftaran: {
                                select: {
                                    KodePendaftar: true,
                                    SkRektorMahasiswa: {
                                        // Mahasiswa & asesor hanya melihat SK yang sudah dipublikasikan Akademik.
                                        where: { SkRektor: { Dipublikasikan: true } },
                                        select: {
                                            SkRektor: {
                                                select: {
                                                    SkRektorId: true,
                                                    JenisSkAsessmen: true,
                                                    NamaFile: true,
                                                    NamaDokumen: true,
                                                    NomorSk: true,
                                                },
                                            },
                                        },
                                    },
                                    StatusMahasiswaAssesmentHistory: {
                                        select: {
                                            Aktif: true,
                                            StatusMahasiswaAssesment: {
                                                select: {
                                                    NamaStatus: true,
                                                },
                                            },
                                        },
                                    },
                                    DaftarUlang: {
                                        select: {
                                            Nim: true,
                                            ProgramStudi: {
                                                select: {
                                                    Nama: true,
                                                },
                                            }
                                        },
                                    },
                                    Mahasiswa: {
                                        select: {
                                            User: {
                                                select: {
                                                    Nama: true,
                                                    Email: true,
                                                    NomorHp: true,
                                                },
                                            },
                                        },
                                    },
                                }
                            },
                        },
                    }),
                    prisma.assesorMahasiswa.count({
                        where,
                    }),
                ])

                const response: ResponseSkRektorAsessmenType[] =
                    data?.map((am) => ({
                        Nama: am.Pendaftaran.Mahasiswa.User.Nama,
                        Status: am.Pendaftaran.StatusMahasiswaAssesmentHistory.find(x => x.Aktif) ? am.Pendaftaran.StatusMahasiswaAssesmentHistory.find(x => x.Aktif)?.StatusMahasiswaAssesment.NamaStatus ?? '' : '',
                        Email: am.Pendaftaran.Mahasiswa.User.Email,
                        ProgramStudi: am.Pendaftaran.DaftarUlang.length === 0 ? '' : am.Pendaftaran.DaftarUlang[0].ProgramStudi.Nama ?? '',
                        NomorSk: am.Pendaftaran.SkRektorMahasiswa.length > 0 ? am.Pendaftaran.SkRektorMahasiswa[0].SkRektor.NomorSk ?? '' : '',
                        NamaFile: am.Pendaftaran.SkRektorMahasiswa.length > 0 ? am.Pendaftaran.SkRektorMahasiswa[0].SkRektor.NamaFile ?? '' : '',
                        DaftarSk: am.Pendaftaran.SkRektorMahasiswa.filter(
                            (x) => x.SkRektor.JenisSkAsessmen !== null
                        ).map((x) => ({
                            SkRektorId: x.SkRektor.SkRektorId,
                            JenisSkAsessmen: x.SkRektor.JenisSkAsessmen!,
                            NomorSk: x.SkRektor.NomorSk,
                            NamaFile: x.SkRektor.NamaFile,
                            NamaDokumen: x.SkRektor.NamaDokumen,
                        })),
                        NomorHp: am.Pendaftaran.Mahasiswa.User.NomorHp ?? '',
                        PendaftaranId: am.PendaftaranId,
                        KodePendaftar: am.Pendaftaran.KodePendaftar,
                        Nim: am.Pendaftaran.DaftarUlang.length === 0 ? '' : am.Pendaftaran.DaftarUlang[0].Nim ?? '',
                        SkRektor: am.Pendaftaran.SkRektorMahasiswa.length > 0 ? true : false,
                    })) ?? []

                return c.json<{
                    data: ResponseSkRektorAsessmenType[]
                    page: number
                    limit: number
                    totalElement: number
                    totalPage: number
                    isFirst: boolean
                    isLast: boolean
                    hasNext: boolean
                    hasPrevious: boolean
                }>({
                    page: page,
                    limit: limit,
                    data: response,
                    totalElement: total,
                    totalPage: Math.ceil(total / limit),
                    isFirst: page === 1,
                    isLast:
                        page === Math.ceil(total / limit) ||
                        Math.ceil(total / limit) === 0,
                    hasNext: page < Math.ceil(total / limit),
                    hasPrevious: page > 1,
                })
            } else if (isAkademik) {
                let where: Prisma.AssesorMahasiswaWhereInput = search
                    ? {
                        AND: [
                            {
                                Pendaftaran: {
                                    OR: [
                                        {
                                            StatusMahasiswaAssesmentHistory: {
                                                some: {
                                                    Aktif: true,
                                                    StatusMahasiswaAssesment: {
                                                        NamaStatus: {
                                                            in: STATUS_SK_AKADEMIK,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    ]
                                }
                            },
                            {
                                Pendaftaran: {
                                    OR: [
                                        {
                                            Mahasiswa: {
                                                User: {
                                                    Nama: {
                                                        contains: search,
                                                        mode: 'insensitive',
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            KodePendaftar: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                        {
                                            DaftarUlang: {
                                                some: {
                                                    Nim: {
                                                        contains: search,
                                                        mode: 'insensitive',
                                                    },
                                                    ProgramStudi: {
                                                        Nama: {
                                                            contains: search,
                                                            mode: 'insensitive',
                                                        }
                                                    },
                                                },
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    } : {
                        AND: [
                            {
                                Pendaftaran: {
                                    OR: [
                                        {
                                            StatusMahasiswaAssesmentHistory: {
                                                some: {
                                                    Aktif: true,
                                                    StatusMahasiswaAssesment: {
                                                        NamaStatus: {
                                                            in: STATUS_SK_AKADEMIK,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    ]
                                }
                            },
                        ],
                    }
                const [data, total] = await Promise.all([
                    prisma.assesorMahasiswa.findMany({
                        distinct: ['PendaftaranId'],
                        where,
                        skip: (page - 1) * limit,
                        take: limit,
                        orderBy: { Pendaftaran: { KodePendaftar: 'asc' } },
                        select: {
                            PendaftaranId: true,
                            Pendaftaran: {
                                select: {
                                    KodePendaftar: true,
                                    SkRektorMahasiswa: {
                                        select: {
                                            SkRektor: {
                                                select: {
                                                    SkRektorId: true,
                                                    JenisSkAsessmen: true,
                                                    NamaFile: true,
                                                    NamaDokumen: true,
                                                    NomorSk: true,
                                                    Ditandatangani: true,
                                                    Dipublikasikan: true,
                                                },
                                            },
                                        },
                                    },
                                    StatusMahasiswaAssesmentHistory: {
                                        select: {
                                            Aktif: true,
                                            StatusMahasiswaAssesment: {
                                                select: {
                                                    NamaStatus: true,
                                                },
                                            },
                                        },
                                    },
                                    DaftarUlang: {
                                        select: {
                                            Nim: true,
                                            ProgramStudi: {
                                                select: {
                                                    Nama: true,
                                                },
                                            }
                                        },
                                    },
                                    Mahasiswa: {
                                        select: {
                                            User: {
                                                select: {
                                                    Nama: true,
                                                    Email: true,
                                                    NomorHp: true,
                                                },
                                            },
                                        },
                                    },
                                }
                            },
                        },
                    }),
                    prisma.assesorMahasiswa.count({
                        where,
                    }),
                ])

                const response: ResponseSkRektorAsessmenType[] =
                    data?.map((am) => ({
                        Nama: am.Pendaftaran.Mahasiswa.User.Nama,
                        Email: am.Pendaftaran.Mahasiswa.User.Email,
                        Status: am.Pendaftaran.StatusMahasiswaAssesmentHistory.find(x => x.Aktif) ? am.Pendaftaran.StatusMahasiswaAssesmentHistory.find(x => x.Aktif)?.StatusMahasiswaAssesment.NamaStatus ?? '' : '',
                        ProgramStudi: am.Pendaftaran.DaftarUlang.length === 0 ? '' : am.Pendaftaran.DaftarUlang[0].ProgramStudi.Nama ?? '',
                        NomorSk: am.Pendaftaran.SkRektorMahasiswa.length > 0 ? am.Pendaftaran.SkRektorMahasiswa[0].SkRektor.NomorSk ?? '' : '',
                        NamaFile: am.Pendaftaran.SkRektorMahasiswa.length > 0 ? am.Pendaftaran.SkRektorMahasiswa[0].SkRektor.NamaFile ?? '' : '',
                        DaftarSk: am.Pendaftaran.SkRektorMahasiswa.filter(
                            (x) => x.SkRektor.JenisSkAsessmen !== null
                        ).map((x) => ({
                            SkRektorId: x.SkRektor.SkRektorId,
                            JenisSkAsessmen: x.SkRektor.JenisSkAsessmen!,
                            NomorSk: x.SkRektor.NomorSk,
                            NamaFile: x.SkRektor.NamaFile,
                            NamaDokumen: x.SkRektor.NamaDokumen,
                        })),
                        NomorHp: am.Pendaftaran.Mahasiswa.User.NomorHp ?? '',
                        PendaftaranId: am.PendaftaranId,
                        KodePendaftar: am.Pendaftaran.KodePendaftar,
                        Nim: am.Pendaftaran.DaftarUlang.length === 0 ? '' : am.Pendaftaran.DaftarUlang[0].Nim ?? '',
                        SkRektor: am.Pendaftaran.SkRektorMahasiswa.length > 0 ? true : false,
                        SiapDipublikasikan:
                            am.Pendaftaran.SkRektorMahasiswa.length > 0 &&
                            am.Pendaftaran.SkRektorMahasiswa.every(
                                (x) => x.SkRektor.Ditandatangani
                            ),
                        Dipublikasikan:
                            am.Pendaftaran.SkRektorMahasiswa.length > 0 &&
                            am.Pendaftaran.SkRektorMahasiswa.every(
                                (x) => x.SkRektor.Dipublikasikan
                            ),
                    })) ?? []

                return c.json<{
                    data: ResponseSkRektorAsessmenType[]
                    page: number
                    limit: number
                    totalElement: number
                    totalPage: number
                    isFirst: boolean
                    isLast: boolean
                    hasNext: boolean
                    hasPrevious: boolean
                }>({
                    page: page,
                    limit: limit,
                    data: response,
                    totalElement: total,
                    totalPage: Math.ceil(total / limit),
                    isFirst: page === 1,
                    isLast:
                        page === Math.ceil(total / limit) ||
                        Math.ceil(total / limit) === 0,
                    hasNext: page < Math.ceil(total / limit),
                    hasPrevious: page > 1,
                })
            } else {
                let where: Prisma.PendaftaranWhereInput = search
                    ? {
                        AND: [
                            {
                                OR: [
                                    {
                                        StatusMahasiswaAssesmentHistory: {
                                            some: {
                                                Aktif: true,
                                                StatusMahasiswaAssesment: {
                                                    NamaStatus: "Sinkronisasi Hasil Asessmen",
                                                },
                                            },
                                        },
                                    },
                                    {
                                        StatusMahasiswaAssesmentHistory: {
                                            some: {
                                                Aktif: true,
                                                StatusMahasiswaAssesment: {
                                                    NamaStatus: "Selesai",
                                                },
                                            },
                                        },
                                    },
                                ]
                            },
                            {
                                OR: [
                                    {
                                        DaftarUlang: {
                                            some: {
                                                Nim: {
                                                    contains: search,
                                                    mode: 'insensitive',
                                                },
                                                ProgramStudi: {
                                                    Nama: {
                                                        contains: search,
                                                        mode: 'insensitive',
                                                    }
                                                }
                                            },
                                        },
                                    },
                                    {
                                        KodePendaftar: {
                                            contains: search,
                                            mode: 'insensitive',
                                        },
                                    },
                                    {
                                        Mahasiswa: {
                                            User: {
                                                OR: [
                                                    {
                                                        NomorHp: {
                                                            contains: search,
                                                            mode: 'insensitive',
                                                        },
                                                        Nama: {
                                                            contains: search,
                                                            mode: 'insensitive',
                                                        },
                                                        Email: {
                                                            contains: search,
                                                            mode: 'insensitive',
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                    },
                                ],
                            },
                        ],
                    }
                    : {
                        AND: [
                            {
                                OR: [
                                    {
                                        StatusMahasiswaAssesmentHistory: {
                                            some: {
                                                Aktif: true,
                                                StatusMahasiswaAssesment: {
                                                    NamaStatus: "Sinkronisasi Hasil Asessmen",
                                                },
                                            },
                                        },
                                    },
                                    {
                                        StatusMahasiswaAssesmentHistory: {
                                            some: {
                                                Aktif: true,
                                                StatusMahasiswaAssesment: {
                                                    NamaStatus: "Selesai",
                                                },
                                            },
                                        },
                                    },
                                ]
                            },
                        ],
                    }

                const [data, total] = await Promise.all([
                    prisma.pendaftaran.findMany({
                        where,
                        skip: (page - 1) * limit,
                        take: limit,
                        orderBy: { KodePendaftar: 'asc' },
                        select: {
                            PendaftaranId: true,
                            KodePendaftar: true,
                            SkRektorMahasiswa: {
                                select: {
                                    SkRektor: {
                                        select: {
                                            SkRektorId: true,
                                            JenisSkAsessmen: true,
                                            NamaFile: true,
                                            NamaDokumen: true,
                                            NomorSk: true,
                                            Ditandatangani: true,
                                            Dipublikasikan: true,
                                        },
                                    },
                                },
                            },
                            StatusMahasiswaAssesmentHistory: {
                                select: {
                                    Aktif: true,
                                    StatusMahasiswaAssesment: {
                                        select: {
                                            NamaStatus: true,
                                        },
                                    },
                                },
                            },
                            DaftarUlang: {
                                select: {
                                    Nim: true,
                                    ProgramStudi: {
                                        select: {
                                            Nama: true,
                                        },
                                    },
                                },
                            },
                            Mahasiswa: {
                                select: {
                                    User: {
                                        select: {
                                            Nama: true,
                                            Email: true,
                                            NomorHp: true,
                                        },
                                    },
                                },
                            },
                        },
                    }),
                    prisma.pendaftaran.count({
                        where,
                    }),
                ])

                const response: ResponseSkRektorAsessmenType[] =
                    data?.map((am) => ({
                        Nama: am.Mahasiswa.User.Nama,
                        Email: am.Mahasiswa.User.Email,
                        NomorHp: am.Mahasiswa.User.NomorHp ?? '',
                        ProgramStudi: am.DaftarUlang.length === 0 ? '' : am.DaftarUlang[0].ProgramStudi.Nama,
                        PendaftaranId: am.PendaftaranId,
                        NomorSk: am.SkRektorMahasiswa.length === 0 ? '' : am.SkRektorMahasiswa[0].SkRektor.NomorSk,
                        KodePendaftar: am.KodePendaftar,
                        Nim:
                            am.DaftarUlang.length === 0
                                ? ''
                                : am.DaftarUlang[0].Nim ?? '',
                        SkRektor: am.SkRektorMahasiswa.length > 0 ? true : false,
                        DaftarSk: am.SkRektorMahasiswa.filter(
                            (x) => x.SkRektor.JenisSkAsessmen !== null
                        ).map((x) => ({
                            SkRektorId: x.SkRektor.SkRektorId,
                            JenisSkAsessmen: x.SkRektor.JenisSkAsessmen!,
                            NomorSk: x.SkRektor.NomorSk,
                            NamaFile: x.SkRektor.NamaFile,
                            NamaDokumen: x.SkRektor.NamaDokumen,
                        })),
                        SiapDipublikasikan:
                            am.SkRektorMahasiswa.length > 0 &&
                            am.SkRektorMahasiswa.every(
                                (x) => x.SkRektor.Ditandatangani
                            ),
                        Dipublikasikan:
                            am.SkRektorMahasiswa.length > 0 &&
                            am.SkRektorMahasiswa.every(
                                (x) => x.SkRektor.Dipublikasikan
                            ),
                        NamaFile:
                            am.SkRektorMahasiswa.length > 0
                                ? am.SkRektorMahasiswa[0].SkRektor.NamaFile ?? ''
                                : '',
                        Status: am.StatusMahasiswaAssesmentHistory.find(x => x.Aktif) ? am.StatusMahasiswaAssesmentHistory.find(x => x.Aktif)?.StatusMahasiswaAssesment.NamaStatus ?? '' : ''
                    })) ?? []

                return c.json<{
                    data: ResponseSkRektorAsessmenType[]
                    page: number
                    limit: number
                    totalElement: number
                    totalPage: number
                    isFirst: boolean
                    isLast: boolean
                    hasNext: boolean
                    hasPrevious: boolean
                }>({
                    page: page,
                    limit: limit,
                    data: response,
                    totalElement: total,
                    totalPage: Math.ceil(total / limit),
                    isFirst: page === 1,
                    isLast:
                        page === Math.ceil(total / limit) ||
                        Math.ceil(total / limit) === 0,
                    hasNext: page < Math.ceil(total / limit),
                    hasPrevious: page > 1,
                })
            }
        }
        if (jenis === 'wa') {
            const PendaftaranId = c.req.query('PendaftaranId') ?? ''
            if (!PendaftaranId) c.json(null)

            const pendaftaran = await prisma.pendaftaran.findFirst({
                where: {
                    PendaftaranId: PendaftaranId
                },
                select: {
                    KodePendaftar: true,
                    Mahasiswa: {
                        select: {
                            User: {
                                select: {
                                    Nama: true,
                                    NomorWa: true
                                }
                            }
                        }
                    }
                }
            })


            if (!pendaftaran) c.json(null)

            const cookieHeader = (await cookies()).toString();

            const target = pendaftaran?.Mahasiswa.User.NomorWa ?? "";
            if (!target) return;

            const params = new URLSearchParams({
                target: String(target),
                message: `Halo ${pendaftaran?.Mahasiswa.User.Nama}, Surat Keputusan Hasil Asessmen RPL kamu terbit. Silakan cek melalui Sistem Informasi RPL Terpadu. Terima Kasih.`,
                jenis: "sendWaText",
            });

            await fetch(`${BASE_URL}/api/protected/whatsapp?${params.toString()}`, {
                method: "POST",
                headers: {
                    cookie: cookieHeader,
                    "Content-Type": "application/json",
                },
            });

            return c.json({
                status: 'success',
                message: 'message mwa has been sent',
                data: [],
            })
        }

        return c.json(
            {
                status: 'error',
                message: 'Query Salah',
                data: [],
            },
            404
        )
    }

    return c.json(
        {
            status: 'error',
            message: 'Data tidak ditemukan',
            data: [],
        },
        404
    )
})

app.post('/', async (c) => {
    const jenisAksi = c.req.query('jenis')

    // Penerbitan SK hasil asesmen dari template. Akademik memilih jenis SK
    // (Perolehan SKS / Transfer SKS) mengikuti mata kuliah yang diajukan
    // mahasiswa; satu mahasiswa bisa memerlukan salah satu atau keduanya.
    if (jenisAksi === 'terbitkan') {
        const body: {
            PendaftaranId: string
            JenisSkAsessmen: JenisSkAsessmen
            NamaSk: string
            NomorSk: string
            TahunSk: string
        } = await c.req.json()

        if (!body.PendaftaranId) {
            return c.json(
                { status: 'error', message: 'PendaftaranId perlu diisi', data: [] },
                { status: 400 }
            )
        }
        if (
            body.JenisSkAsessmen !== 'PEROLEHAN_SKS' &&
            body.JenisSkAsessmen !== 'TRANSFER_SKS'
        ) {
            return c.json(
                { status: 'error', message: 'Jenis SK tidak dikenal', data: [] },
                { status: 400 }
            )
        }
        if (!body.NomorSk || !body.NamaSk || !body.TahunSk) {
            return c.json(
                {
                    status: 'error',
                    message: 'Nama, Nomor, dan Tahun SK perlu diisi',
                    data: [],
                },
                { status: 400 }
            )
        }

        // Jenis SK yang diterbitkan sepenuhnya keputusan Akademik: boleh salah
        // satu, boleh keduanya. Jumlah mata kuliah per jenis hanya dipakai
        // sebagai informasi di layar, bukan sebagai pembatas.

        const skLama = await prisma.skRektorMahasiswa.findFirst({
            where: {
                PendaftaranId: body.PendaftaranId,
                SkRektor: { JenisSkAsessmen: body.JenisSkAsessmen },
            },
            select: {
                SkRektor: {
                    select: {
                        SkRektorId: true,
                        Disetujui: true,
                        Ditandatangani: true,
                    },
                },
            },
        })

        if (skLama?.SkRektor.Ditandatangani) {
            return c.json(
                {
                    status: 'error',
                    message: 'SK ini sudah ditandatangani dan tidak dapat diterbitkan ulang',
                    data: [],
                },
                { status: 409 }
            )
        }

        const tipeSk = await prisma.tipeSkRektor.findFirst({
            where: { Nama: 'RPL' },
            select: { TipeSkRektorId: true },
        })

        if (!tipeSk) {
            return c.json(
                {
                    status: 'error',
                    message: "Tipe SK Rektor 'RPL' belum tersedia",
                    data: [],
                },
                { status: 400 }
            )
        }

        // Render SK dari template lewat endpoint generate-pdf agar isinya
        // selalu mengikuti data asesmen yang tersimpan.
        const cookieHeader = (await cookies()).toString()
        const params = new URLSearchParams({
            _id: body.PendaftaranId,
            _t: 'sk',
            _n: body.NomorSk,
            _j:
                body.JenisSkAsessmen === 'TRANSFER_SKS'
                    ? 'TRANSFER KREDIT'
                    : 'PEROLEHAN KREDIT',
        })

        const pdfRes = await fetch(
            `${BASE_URL}/api/protected/generate-pdf?${params.toString()}`,
            { headers: { cookie: cookieHeader } }
        )

        if (!pdfRes.ok) {
            return c.json(
                {
                    status: 'error',
                    message: 'Gagal merender SK dari template',
                    data: [],
                },
                { status: 502 }
            )
        }

        const buffer = Buffer.from(new Uint8Array(await pdfRes.arrayBuffer()))
        const filename = `${uuidv4()}.pdf`
        const namaDokumen = `${body.NamaSk}.pdf`

        // SK hasil asesmen mengikuti folder mahasiswa pemiliknya.
        const pemilik = await prisma.pendaftaran.findFirst({
            where: { PendaftaranId: body.PendaftaranId },
            select: { Mahasiswa: { select: { UserId: true } } },
        })

        const pathFile = await simpanBerkas(
            pemilik?.Mahasiswa.UserId ?? null,
            'sk',
            filename,
            buffer
        )

        const sk = await prisma.$transaction(async (tx) => {
            if (skLama) {
                return tx.skRektor.update({
                    where: { SkRektorId: skLama.SkRektor.SkRektorId },
                    data: {
                        NamaSk: body.NamaSk,
                        NomorSk: body.NomorSk,
                        TahunSk: parseInt(body.TahunSk, 10),
                        NamaFile: filename,
                        NamaDokumen: namaDokumen,
                        PathFile: pathFile,
                        // Penerbitan ulang membatalkan persetujuan sebelumnya.
                        Disetujui: false,
                        DisetujuiPada: null,
                        DisetujuiOleh: null,
                        UpdatedAt: new Date(),
                    },
                })
            }

            const dibuat = await tx.skRektor.create({
                data: {
                    TipeSkRektorId: tipeSk.TipeSkRektorId,
                    JenisSkAsessmen: body.JenisSkAsessmen,
                    NamaSk: body.NamaSk,
                    NomorSk: body.NomorSk,
                    TahunSk: parseInt(body.TahunSk, 10),
                    NamaFile: filename,
                    NamaDokumen: namaDokumen,
                    PathFile: pathFile,
                    Disetujui: false,
                    CreatedAt: new Date(),
                    UpdatedAt: new Date(),
                },
            })

            await tx.skRektorMahasiswa.create({
                data: {
                    SkRektorId: dibuat.SkRektorId,
                    PendaftaranId: body.PendaftaranId,
                },
            })

            return dibuat
        })

        return c.json({
            status: 'success',
            message: 'SK berhasil diterbitkan dari template',
            data: {
                SkRektorId: sk.SkRektorId,
                JenisSkAsessmen: sk.JenisSkAsessmen,
                NamaSk: sk.NamaSk,
                NomorSk: sk.NomorSk,
                TahunSk: sk.TahunSk,
                NamaFile: sk.NamaFile,
                NamaDokumen: sk.NamaDokumen,
                Disetujui: sk.Disetujui,
                Catatan: sk.Catatan ?? '',
            },
        })
    }

    // Publikasi SK ke mahasiswa. SK yang sudah ditandatangani Rektor baru
    // terlihat mahasiswa setelah Akademik mempublikasikannya; sebelum itu
    // berkas ditahan.
    if (jenisAksi === 'publikasi') {
        const body: { PendaftaranId: string; Publikasikan: boolean } =
            await c.req.json()

        if (!body.PendaftaranId) {
            return c.json(
                { status: 'error', message: 'PendaftaranId perlu diisi', data: [] },
                { status: 400 }
            )
        }

        const skMahasiswa = await prisma.skRektorMahasiswa.findMany({
            where: {
                PendaftaranId: body.PendaftaranId,
                SkRektor: { JenisSkAsessmen: { not: null } },
            },
            select: {
                SkRektor: {
                    select: { SkRektorId: true, Ditandatangani: true },
                },
            },
        })

        if (skMahasiswa.length === 0) {
            return c.json(
                {
                    status: 'error',
                    message: 'Belum ada SK hasil asesmen untuk pendaftaran ini',
                    data: [],
                },
                { status: 404 }
            )
        }

        const belumDitandatangani = skMahasiswa.filter(
            (x) => !x.SkRektor.Ditandatangani
        )

        if (body.Publikasikan && belumDitandatangani.length > 0) {
            return c.json(
                {
                    status: 'error',
                    message: `Masih ada ${belumDitandatangani.length} SK yang belum ditandatangani Rektor`,
                    data: [],
                },
                { status: 409 }
            )
        }

        await prisma.skRektor.updateMany({
            where: {
                SkRektorId: {
                    in: skMahasiswa.map((x) => x.SkRektor.SkRektorId),
                },
            },
            data: {
                Dipublikasikan: body.Publikasikan,
                DipublikasikanPada: body.Publikasikan ? new Date() : null,
                UpdatedAt: new Date(),
            },
        })

        // Mahasiswa hanya dikabari ketika SK benar-benar dipublikasikan.
        if (body.Publikasikan) {
            const cookieHeader = (await cookies()).toString()
            const mhs = await prisma.pendaftaran.findFirst({
                where: { PendaftaranId: body.PendaftaranId },
                select: {
                    Mahasiswa: {
                        select: { User: { select: { Nama: true, NomorWa: true } } },
                    },
                },
            })

            const target = mhs?.Mahasiswa.User.NomorWa ?? ''
            if (target) {
                const params = new URLSearchParams({
                    target: String(target),
                    message: `Halo, ${mhs?.Mahasiswa.User.Nama}. SK Penetapan Hasil Asessmen anda sudah diterbitkan dan dapat diunduh melalui Sistem Informasi RPL Terpadu ITI. Terima Kasih.`,
                    jenis: 'sendWaText',
                })

                await fetch(
                    `${BASE_URL}/api/protected/whatsapp?${params.toString()}`,
                    {
                        method: 'POST',
                        headers: {
                            cookie: cookieHeader,
                            'Content-Type': 'application/json',
                        },
                    }
                ).catch(() => undefined)
            }
        }

        return c.json({
            status: 'success',
            message: body.Publikasikan
                ? 'SK dipublikasikan ke mahasiswa'
                : 'Publikasi SK ditahan',
            data: { Dipublikasikan: body.Publikasikan },
        })
    }

    return c.json(
        {
            status: 'error',
            message:
                'Unggah SK manual tidak lagi didukung. Terbitkan SK dari template.',
            data: [],
        },
        { status: 400 }
    )
})

export const GET = handle(app)
export const POST = handle(app)

import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { prisma } from '@/lib/prisma'
import { SettingKegiatanTypes } from '@/types/WebsiteTypes'

const app = new Hono().basePath('/api/img')

app.get('/', async (c) => {
    let tipe = c.req.query('_t') as string | undefined
    const id = c.req.query('_id') as string | undefined

    if (tipe !== undefined) {
        const jenis: string = tipe || ''

        if (id != undefined) {
            if (!tipe) {
                return c.json(
                    { data: [], status: 'error', message: 'file is required' },
                    { status: 400 }
                )
            }

            if (jenis.match('_m')) {
                const data = await prisma.settingMainPage.findFirst({
                    where: {
                        SettingMainPageId: id,
                    },
                    select: {
                        BackgroundFileUtama: true,
                    },
                })

                if (data === null || data.BackgroundFileUtama == null) {
                    return c.json(
                        {
                            data: [],
                            status: 'error',
                            message: 'file is required',
                        },
                        { status: 400 }
                    )
                }

                return c.body(data.BackgroundFileUtama, 200, {
                    'Content-Type': 'image/png',
                    'Content-Length': String(data.BackgroundFileUtama.length),
                })
            } else if (jenis.match('_s')) {
                const data = await prisma.settingMainPage.findFirst({
                    where: {
                        SettingMainPageId: id,
                    },
                    select: {
                        SelayangPandangBackgroundFile: true,
                    },
                })

                if (
                    data === null ||
                    data.SelayangPandangBackgroundFile == null
                ) {
                    return c.json(
                        {
                            data: [],
                            status: 'error',
                            message: 'file is required',
                        },
                        { status: 400 }
                    )
                }

                return c.body(data.SelayangPandangBackgroundFile, 200, {
                    'Content-Type': 'image/png',
                    'Content-Length': String(
                        data.SelayangPandangBackgroundFile.length
                    ),
                })
            } else if (jenis.match('_c')) {
                const data = await prisma.settingCommunity.findFirst({
                    where: {
                        SettingCommunityId: id,
                    },
                    select: {
                        Gambar: true,
                    },
                })

                if (data === null || data.Gambar == null) {
                    return c.json(
                        {
                            data: [],
                            status: 'error',
                            message: 'file is required',
                        },
                        { status: 400 }
                    )
                }

                return c.body(data.Gambar, 200, {
                    'Content-Type': 'image/png',
                    'Content-Length': String(data.Gambar.length),
                })
            } else if (jenis.match('_b')) {
                const data = await prisma.settingBerita.findFirst({
                    where: {
                        SettingBeritaId: id,
                    },
                    select: {
                        Gambar: true,
                    },
                })

                if (data === null || data.Gambar == null) {
                    return c.json(
                        {
                            data: [],
                            status: 'error',
                            message: 'file is required',
                        },
                        { status: 400 }
                    )
                }

                return c.body(data.Gambar, 200, {
                    'Content-Type': 'image/png',
                    'Content-Length': String(data.Gambar.length),
                })
            } else if (jenis.match('_t')) {
                const data = await prisma.settingTestimony.findFirst({
                    where: {
                        SettingTestimonyId: id,
                    },
                    select: {
                        Foto: true,
                    },
                })

                if (data === null || data.Foto == null) {
                    return c.json(
                        {
                            data: [],
                            status: 'error',
                            message: 'file is required',
                        },
                        { status: 400 }
                    )
                }

                return c.body(data.Foto, 200, {
                    'Content-Type': 'image/png',
                    'Content-Length': String(data.Foto.length),
                })
            } else {
                return c.json(
                    { data: [], status: 'error', message: 'file is required' },
                    { status: 400 }
                )
            }
        } else {
            if (jenis.match('_k')) {
                const m = Number(c.req.query('_cm') ?? new Date().getUTCMonth())
                const y = Number(
                    c.req.query('_cy') ?? new Date().getUTCFullYear()
                )

                const start = new Date(Date.UTC(y, m, 1, 0, 0, 0, 0))
                const end = new Date(
                    Date.UTC(m === 11 ? y + 1 : y, (m + 1) % 12, 1)
                )

                const data = await prisma.settingKegiatan.findMany({
                    where: {
                        OR: [
                            {
                                AND: [
                                    { WaktuSelesai: { not: null } },
                                    { WaktuMulai: { lt: end } },
                                    { WaktuSelesai: { gte: start } },
                                ],
                            },

                            {
                                AND: [
                                    { WaktuSelesai: null },
                                    { WaktuMulai: { gte: start, lt: end } },
                                ],
                            },
                        ],
                    },

                    select: {
                        Nama: true,
                        SettingMainPageId: true,
                        JenisKegiatanId: true,
                        SettingKegiatanId: true,
                        Lokasi: true,
                        Deskripsi: true,
                        WaktuMulai: true,
                        WaktuSelesai: true,
                        JenisKegiatan: {
                            select: {
                                Nama: true,
                                Color: true,
                            },
                        },
                    },
                    orderBy: { WaktuMulai: 'asc' },
                })

                const res: SettingKegiatanTypes[] = data.map((x) => ({
                    Nama: x.Nama,
                    SettingMainPageId: x.SettingMainPageId,
                    JenisKegiatanId: x.JenisKegiatanId,
                    SettingKegiatanId: x.SettingKegiatanId,
                    Lokasi: x.Lokasi,
                    Deskripsi: x.Deskripsi,
                    WaktuMulai: x.WaktuMulai,
                    WaktuSelesai: x.WaktuSelesai,
                    NamaJenis: x.JenisKegiatan.Nama,
                    Color: x.JenisKegiatan.Color,
                }))

                return c.json(res)
            } else {
                return c.json(
                    { data: [], status: 'error', message: 'file is required' },
                    { status: 400 }
                )
            }
        }
    } else {
        return c.json(
            { data: [], status: 'error', message: 'file is required' },
            { status: 400 }
        )
    }
})

export const GET = handle(app)

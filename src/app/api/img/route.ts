import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { prisma } from '@/lib/prisma'

const app = new Hono().basePath('/api/img')

app.get('/', async (c) => {
    let tipe = c.req.query('_t') as string | undefined
    const id = c.req.query('_id') as string | undefined

    if (tipe !== undefined && id !== undefined) {
        const jenis: string = tipe || ''
        
        if (!tipe) {
            return c.json(
                { data: [], status: 'error', message: 'file is required' },
                { status: 400 }
            )
        }

        if(jenis.match('_m')) {
            const data = await prisma.settingMainPage.findFirst({
                where: {
                    SettingMainPageId: id
                }, select: {
                    BackgroundFileUtama: true,
                }
            })

            if(data === null || data.BackgroundFileUtama == null) {
                return c.json(
                    { data: [], status: 'error', message: 'file is required' },
                    { status: 400 }
                )   
            }

            return c.body(data.BackgroundFileUtama, 200, {
                'Content-Type': 'image/png',
                'Content-Length': String(data.BackgroundFileUtama.length),
            })
        }
        else if(jenis.match('_s')) {
            const data = await prisma.settingMainPage.findFirst({
                where: {
                    SettingMainPageId: id
                }, select: {
                    SelayangPandangBackgroundFile: true
                }
            })

            if(data === null || data.SelayangPandangBackgroundFile == null) {
                return c.json(
                    { data: [], status: 'error', message: 'file is required' },
                    { status: 400 }
                )   
            }

            return c.body(data.SelayangPandangBackgroundFile, 200, {
                'Content-Type': 'image/png',
                'Content-Length': String(data.SelayangPandangBackgroundFile.length),
            })
        }
        else if(jenis.match('_c')) {
            const data = await prisma.settingCommunity.findFirst({
                where: {
                    SettingCommunityId: id
                }, select: {
                    Gambar: true
                }
            })

            if(data === null || data.Gambar == null) {
                return c.json(
                    { data: [], status: 'error', message: 'file is required' },
                    { status: 400 }
                )   
            }

            return c.body(data.Gambar, 200, {
                'Content-Type': 'image/png',
                'Content-Length': String(data.Gambar.length),
            })
        }
        else if(jenis.match('_b')) {
            const data = await prisma.settingBerita.findFirst({
                where: {
                    SettingBeritaId: id
                }, select: {
                    Gambar: true
                }
            })

            if(data === null || data.Gambar == null) {
                return c.json(
                    { data: [], status: 'error', message: 'file is required' },
                    { status: 400 }
                )   
            }

            return c.body(data.Gambar, 200, {
                'Content-Type': 'image/png',
                'Content-Length': String(data.Gambar.length),
            })
        }
        else if(jenis.match('_t')) {
            const data = await prisma.settingTestimony.findFirst({
                where: {
                    SettingTestimonyId: id
                }, select: {
                    Foto: true
                }
            })

            if(data === null || data.Foto == null) {
                return c.json(
                    { data: [], status: 'error', message: 'file is required' },
                    { status: 400 }
                )   
            }

            return c.body(data.Foto, 200, {
                'Content-Type': 'image/png',
                'Content-Length': String(data.Foto.length),
            })
        }
        else {
            return c.json(
                { data: [], status: 'error', message: 'file is required' },
                { status: 400 }
            )   
        }
    }
})

export const GET = handle(app)
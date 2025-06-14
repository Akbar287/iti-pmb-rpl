import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { prisma } from '@/lib/prisma'

const app = new Hono().basePath('/api/protected/status')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const jenis = c.req.query('j')
    const pendaftaranId = c.req.query('p')

    if (!jenis) return c.json({status: 'error', data: [], message: 'param j is not define'}, 400)
    if (!pendaftaranId) return c.json({status: 'error', data: [], message: 'param p is not define'}, 400)

    const pendaftaran = await prisma.pendaftaran.findFirst({
        where: { PendaftaranId: pendaftaranId },
    })

    if (pendaftaran && jenis) {
        const statusByJenis: Record<string, string[]> = {
            pdd: ['Pengisian Data Diri'],
            am: ['Pengisian Data Diri', 'Asessmen Mandiri'],
            pa: [
                'Pengisian Data Diri',
                'Asessmen Mandiri',
                'Penunjukan Asesor',
            ],
            aoa: [
                'Pengisian Data Diri',
                'Asessmen Mandiri',
                'Penunjukan Asesor',
                'Asessmen Oleh Asesor',
            ],
            s: [
                'Pengisian Data Diri',
                'Asessmen Mandiri',
                'Penunjukan Asesor',
                'Asessmen Oleh Asesor',
                'Sanggahan',
            ],
            hfa: [
                'Pengisian Data Diri',
                'Asessmen Mandiri',
                'Penunjukan Asesor',
                'Asessmen Oleh Asesor',
                'Sanggahan',
                'Hasil Final Asessmen',
            ],
            psa: [
                'Pengisian Data Diri',
                'Asessmen Mandiri',
                'Penunjukan Asesor',
                'Asessmen Oleh Asesor',
                'Sanggahan',
                'Hasil Final Asessmen',
                'Penerbitan SK Asessmen',
            ],
        }

        const selected = {
            add: statusByJenis[jenis!] || [],
        }

        const orderedStatus = [
            'Pengisian Data Diri',
            'Asessmen Mandiri',
            'Penunjukan Asesor',
            'Asessmen Oleh Asesor',
            'Sanggahan',
            'Hasil Final Asessmen',
            'Penerbitan SK Asessmen',
        ]

        const lastStatus = selected.add[selected.add.length - 1]
        const maxAllowedIndex = orderedStatus.indexOf(lastStatus)

        const statusAll = await prisma.statusMahasiswaAssesment.findMany({
            select: {
                StatusMahasiswaAssesmentId: true,
                NamaStatus: true,
            },
        })

        const statusNow =
            await prisma.statusMahasiswaAssesmentHistory.findMany({
                select: {
                    StatusMahasiswaAssesmentHistoryId: true,
                    StatusMahasiswaAssesmentId: true,
                    Aktif: true,
                    StatusMahasiswaAssesment: {
                        select: { NamaStatus: true },
                    },
                },
                where: { PendaftaranId: pendaftaranId },
            })

        const currentStatusSet = new Set(
            statusNow.map((s) => s.StatusMahasiswaAssesment.NamaStatus)
        )

        const newData = statusAll
            .filter((x) => selected.add.includes(x.NamaStatus))
            .filter((x) => !currentStatusSet.has(x.NamaStatus))
            .map((x) => ({
                StatusMahasiswaAssesmentId: x.StatusMahasiswaAssesmentId,
                PendaftaranId: pendaftaranId!,
                Tanggal: new Date(),
                Keterangan: '',
                Aktif: x.NamaStatus === lastStatus,
            }))
        const updateToInactive = []
        const toDelete = []

        for (const s of statusNow) {
            const nama = s.StatusMahasiswaAssesment.NamaStatus
            const index = orderedStatus.indexOf(nama)

            if (index > maxAllowedIndex) {
                toDelete.push(s.StatusMahasiswaAssesmentHistoryId)
            } else if (nama !== lastStatus && s.Aktif) {
                updateToInactive.push(
                    prisma.statusMahasiswaAssesmentHistory.update({
                        where: {
                            StatusMahasiswaAssesmentHistoryId:
                                s.StatusMahasiswaAssesmentHistoryId,
                        },
                        data: { Aktif: false },
                    })
                )
            } else if (nama === lastStatus && !s.Aktif) {
                updateToInactive.push(
                    prisma.statusMahasiswaAssesmentHistory.update({
                        where: {
                            StatusMahasiswaAssesmentHistoryId:
                                s.StatusMahasiswaAssesmentHistoryId,
                        },
                        data: { Aktif: true },
                    })
                )
            }
        }

        if (newData.length > 0) {
            await prisma.statusMahasiswaAssesmentHistory.createMany({
                data: newData,
            })
        }

        if (updateToInactive.length > 0) {
            await Promise.all(updateToInactive)
        }

        if (toDelete.length > 0) {
            await prisma.statusMahasiswaAssesmentHistory.deleteMany({
                where: {
                    StatusMahasiswaAssesmentHistoryId: { in: toDelete },
                },
            })
        }

        return c.json({
            status: 'success', 
            data: [],
            message: 'success'
        }, 200)
    }
    return c.json({
            status: 'error', 
            data: [],
            message: 'mhs not found'
        }, 200)
})

export const GET = handle(app)

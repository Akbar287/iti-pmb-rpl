import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { EkuivalenCheckType } from '@/types/EkuivalenCheck'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/ekuivalen-check')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const pendaftaranId = c.req.query('PendaftaranId')

    console.log(pendaftaranId)

    if (!pendaftaranId) {
        return c.json({
            message: 'Pendaftaran ID is required',
        }, 400)
    }

    const data = await prisma.pendaftaran.findFirst({
        where: {
            PendaftaranId: pendaftaranId,
        },
        select: {
            MataKuliahMahasiswa: {
                select: {
                    MataKuliahMahasiswaId: true,
                    MataKuliahId: true,
                    Rpl: true,
                    StatusMataKuliahMahasiswa: true,
                    Keterangan: true,
                    MataKuliah: {
                        select: {
                            ProgramStudi: {
                                select: {
                                    ProgramStudiId: true,
                                    Nama: true,
                                }
                            },
                            MataKuliahId: true,
                            Nama: true,
                            Sks: true,
                            Semester: true,
                            Silabus: true,
                        }
                    }
                }
            },
            transkripNilais: {
                select: {
                    TranskripNilaiId: true,
                    PendaftaranId: true,
                    KodeMataKuliah: true,
                    NamaMataKuliah: true,
                    Sks: true,
                    Nilai: true,
                    CreatedAt: true,
                    UpdatedAt: true,
                }
            }
        },
    })


    const responses: EkuivalenCheckType = {
        MataKuliahMahasiswa: !data ? [] : data.MataKuliahMahasiswa.filter(item => item.Keterangan === 'Transfer_SKS').map(item => ({
            MataKuliahMahasiswaId: item.MataKuliahMahasiswaId,
            PendaftaranId: pendaftaranId,
            MataKuliahId: item.MataKuliahId,
            Rpl: item.Rpl,
            StatusMataKuliahMahasiswa: item.StatusMataKuliahMahasiswa,
            Keterangan: item.Keterangan,
            MataKuliah: {
                MataKuliahId: item.MataKuliah.MataKuliahId,
                Nama: item.MataKuliah.Nama,
                ProgramStudiId: item.MataKuliah.ProgramStudi.ProgramStudiId,
                NamaProgramStudi: item.MataKuliah.ProgramStudi.Nama,
                Sks: item.MataKuliah.Sks,
                Semester: item.MataKuliah.Semester,
                Silabus: item.MataKuliah.Silabus,
            }
        })),
        TranskripNilai: !data ? [] : data.transkripNilais.map(item => ({
            TranskripNilaiId: item.TranskripNilaiId,
            PendaftaranId: item.PendaftaranId,
            KodeMataKuliah: item.KodeMataKuliah,
            NamaMataKuliah: item.NamaMataKuliah,
            Sks: item.Sks,
            Nilai: item.Nilai,
            CreatedAt: item.CreatedAt,
            UpdatedAt: item.UpdatedAt,
        })),
    }

    return c.json(responses, 200)
})


export const GET = handle(app)
export const POST = handle(app)

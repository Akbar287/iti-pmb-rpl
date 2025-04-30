import { EvaluasiDiri, ProfiensiPengetahuan } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import {
    MataKuliahMahasiswaCapaianPembelajaranTypes,
    RequestSetEvaluasiDiri,
    ResponseSetEvaluasiDiri,
} from '@/types/DaftarUlangProdi'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/evaluasi-mandiri/evaluasi')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const PendaftaranId = c.req.query('PendaftaranId')
    const EvaluasiDiriId = c.req.query('EvaluasiDiriId')

    if (PendaftaranId !== null && EvaluasiDiriId === null) {
        const data = await prisma.pendaftaran.findFirst({
            where: {
                PendaftaranId: PendaftaranId,
            },
            select: {
                MataKuliahMahasiswa: {
                    select: {
                        MataKuliahMahasiswaId: true,
                        PendaftaranId: true,
                        MataKuliahId: true,
                        Rpl: true,
                        StatusMataKuliahMahasiswa: true,
                        Keterangan: true,
                        MataKuliah: {
                            select: {
                                Kode: true,
                                Nama: true,
                                Sks: true,
                                ProgramStudiId: true,
                                Semester: true,
                                Silabus: true,
                                CapaianPembelajaran: {
                                    select: {
                                        CapaianPembelajaranId: true,
                                        MataKuliahId: true,
                                        Nama: true,
                                        Urutan: true,
                                        Active: true,
                                        EvaluasiDiri: {
                                            select: {
                                                EvaluasiDiriId: true,
                                                MataKuliahMahasiswaId: true,
                                                CapaianPembelajaranId: true,
                                                ProfiensiPengetahuan: true,
                                                TanggalPengesahan: true,
                                                CreatedAt: true,
                                                UpdatedAt: true,
                                                BuktiFormEvaluasiDiri: {
                                                    select: {
                                                        BuktiForm: {
                                                            select: {
                                                                BuktiFormId:
                                                                    true,
                                                                PendaftaranId:
                                                                    true,
                                                                JenisDokumenId:
                                                                    true,
                                                                NamaFile: true,
                                                                NamaDokumen:
                                                                    true,
                                                                JenisDokumen: {
                                                                    select: {
                                                                        Jenis: true,
                                                                        NomorDokumen:
                                                                            true,
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        })

        const response: MataKuliahMahasiswaCapaianPembelajaranTypes = (
            data?.MataKuliahMahasiswa ?? []
        ).map((dkm) => ({
            MataKuliahMahasiswaId: dkm.MataKuliahMahasiswaId,
            PendaftaranId: dkm.PendaftaranId,
            MataKuliahId: dkm.MataKuliahId,
            Rpl: dkm.Rpl,
            StatusMataKuliahMahasiswa: dkm.StatusMataKuliahMahasiswa,
            Keterangan: dkm.Keterangan,
            ProgramStudiId: dkm.MataKuliah.ProgramStudiId,
            Kode: dkm.MataKuliah.Kode,
            Nama: dkm.MataKuliah.Nama,
            Sks: dkm.MataKuliah.Sks,
            Semester: dkm.MataKuliah.Semester,
            Silabus: dkm.MataKuliah.Silabus,
            CapaianPembelajaran:
                dkm.MataKuliah.CapaianPembelajaran.length == 0
                    ? []
                    : dkm.MataKuliah.CapaianPembelajaran.map((cp) => ({
                          CapaianPembelajaranId: cp.CapaianPembelajaranId,
                          MataKuliahId: cp.MataKuliahId,
                          Nama: cp.Nama,
                          Urutan: cp.Urutan,
                          Active: cp.Active,
                          EvaluasiDiri:
                              cp.EvaluasiDiri.length === 0
                                  ? null
                                  : {
                                        EvaluasiDiriId:
                                            cp?.EvaluasiDiri[0].EvaluasiDiriId,
                                        MataKuliahMahasiswaId:
                                            cp?.EvaluasiDiri[0]
                                                .MataKuliahMahasiswaId,
                                        ProfiensiPengetahuan:
                                            cp?.EvaluasiDiri[0]
                                                .ProfiensiPengetahuan,
                                        TanggalPengesahan:
                                            cp?.EvaluasiDiri[0]
                                                .TanggalPengesahan,
                                        CreatedAt:
                                            cp?.EvaluasiDiri[0].CreatedAt,
                                        UpdatedAt:
                                            cp?.EvaluasiDiri[0].UpdatedAt,
                                        BuktiForm:
                                            cp?.EvaluasiDiri[0]
                                                .BuktiFormEvaluasiDiri.length ==
                                            0
                                                ? []
                                                : cp?.EvaluasiDiri[0].BuktiFormEvaluasiDiri.map(
                                                      (bf) => ({
                                                          Jenis: bf.BuktiForm
                                                              .JenisDokumen
                                                              .Jenis,
                                                          NomorDokumen:
                                                              bf.BuktiForm
                                                                  .JenisDokumen
                                                                  .NomorDokumen,
                                                          BuktiFormId:
                                                              bf.BuktiForm
                                                                  .BuktiFormId,
                                                          PendaftaranId:
                                                              bf.BuktiForm
                                                                  .PendaftaranId,
                                                          JenisDokumenId:
                                                              bf.BuktiForm
                                                                  .JenisDokumenId,
                                                          NamaFile:
                                                              bf.BuktiForm
                                                                  .NamaFile,
                                                          NamaDokumen:
                                                              bf.BuktiForm
                                                                  .NamaDokumen,
                                                      })
                                                  ),
                                    },
                      })),
        }))
        return c.json(response)
    }
    if (PendaftaranId !== null && EvaluasiDiriId === null) {
        const data = await prisma.evaluasiDiri.findFirst({
            where: {
                EvaluasiDiriId: EvaluasiDiriId,
            },
        })

        const response: EvaluasiDiri = {
            EvaluasiDiriId: data?.EvaluasiDiriId ?? '',
            MataKuliahMahasiswaId: data?.MataKuliahMahasiswaId ?? '',
            CapaianPembelajaranId: data?.CapaianPembelajaranId ?? '',
            ProfiensiPengetahuan:
                data?.ProfiensiPengetahuan ?? ProfiensiPengetahuan.TIDAK_PERNAH,
            TanggalPengesahan: data?.TanggalPengesahan ?? null,
            CreatedAt: data?.CreatedAt ?? null,
            UpdatedAt: data?.UpdatedAt ?? null,
        }
        return c.json(response)
    }

    return c.json([])
})

app.post('/', async (c) => {
    const body: RequestSetEvaluasiDiri = await c.req.json()

    const data = await prisma.$transaction(async (tx) => {
        const evaluasi = await tx.evaluasiDiri.upsert({
            where: {
                MataKuliahMahasiswaId_CapaianPembelajaranId: {
                    MataKuliahMahasiswaId: body.MataKuliahMahasiswaId,
                    CapaianPembelajaranId: body.CapaianPembelajaranId,
                },
            },
            update: {
                ProfiensiPengetahuan: body.ProfiensiPengetahuan,
                UpdatedAt: new Date(),
            },
            create: {
                MataKuliahMahasiswaId: body.MataKuliahMahasiswaId,
                CapaianPembelajaranId: body.CapaianPembelajaranId,
                ProfiensiPengetahuan: body.ProfiensiPengetahuan,
                TanggalPengesahan: null,
                CreatedAt: new Date(),
                UpdatedAt: new Date(),
            },
        })

        await tx.buktiFormEvaluasiDiri.deleteMany({
            where: {
                EvaluasiDiriId: evaluasi.EvaluasiDiriId,
            },
        })

        if (body.BuktiForm.length > 0) {
            await tx.buktiFormEvaluasiDiri.createMany({
                data: body.BuktiForm.map((buktiFormId) => ({
                    BuktiFormId: buktiFormId,
                    EvaluasiDiriId: evaluasi.EvaluasiDiriId,
                })),
            })
        }

        return evaluasi
    });

    const buktiForm = await prisma.buktiFormEvaluasiDiri.findMany({
        where: {
            EvaluasiDiriId: data.EvaluasiDiriId,
        },
        select: {
            BuktiForm: {
                select: {
                    JenisDokumen: {
                        select: {
                            NomorDokumen: true,
                            Jenis: true,
                            JenisDokumenId: true,
                        }
                    },
                    BuktiFormId: true,
                    PendaftaranId: true,
                    NamaFile: true,
                    NamaDokumen: true,
                }
            }
        }
    })

    const response : ResponseSetEvaluasiDiri = {
        EvaluasiDiriId: data.EvaluasiDiriId,
        MataKuliahMahasiswaId: data.MataKuliahMahasiswaId,
        ProfiensiPengetahuan: data.ProfiensiPengetahuan,
        TanggalPengesahan: data.TanggalPengesahan,
        CreatedAt: data.CreatedAt,
        UpdatedAt: data.UpdatedAt,
        BuktiForm: buktiForm?.map(bf => ({
            Jenis: bf.BuktiForm.JenisDokumen.Jenis,
            NomorDokumen: bf.BuktiForm.JenisDokumen.NomorDokumen,
            BuktiFormId: bf.BuktiForm.BuktiFormId,
            PendaftaranId: bf.BuktiForm.PendaftaranId,
            JenisDokumenId: bf.BuktiForm.JenisDokumen.JenisDokumenId,
            NamaFile: bf.BuktiForm.NamaFile,
            NamaDokumen: bf.BuktiForm.NamaDokumen
        }))
    }

    return c.json(response, 200)
})

export const GET = handle(app)
export const POST = handle(app)
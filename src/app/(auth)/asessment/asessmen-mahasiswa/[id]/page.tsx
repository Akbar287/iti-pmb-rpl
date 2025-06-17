import AsessmentIdComponent from '@/components/asessment/AsessmentIdComponent'
import { SidebarProvider } from '@/components/ui/sidebar'
import { prisma } from '@/lib/prisma'
import { AsessmenAsesorTypes } from '@/types/AsessmentTypes'
import React from 'react'

export default async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params

    const data = await prisma.pendaftaran.findFirst({
        where: {
            PendaftaranId: id,
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
                                            HasilAssesmen: {
                                                select: {
                                                    HasilAssesmenId: true,
                                                    Valid: true,
                                                    Autentik: true,
                                                    Terkini: true,
                                                    Memadai: true,
                                                    Assesmen: true,
                                                    Nilai: true,
                                                    TanggalAssesmen: true,
                                                },
                                            },
                                            BuktiFormEvaluasiDiri: {
                                                select: {
                                                    BuktiForm: {
                                                        select: {
                                                            BuktiFormId: true,
                                                            PendaftaranId: true,
                                                            JenisDokumenId:
                                                                true,
                                                            NamaFile: true,
                                                            NamaDokumen: true,
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

    const dataServer: AsessmenAsesorTypes = (data?.MataKuliahMahasiswa ?? [])
        .sort((a, b) => a.MataKuliah.Kode.localeCompare(b.MataKuliah.Kode))
        .map((dkm) => ({
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
                                        HasilAsessment: {
                                            HasilAssesmenId:
                                                cp.EvaluasiDiri[0].HasilAssesmen
                                                    .length === 0
                                                    ? ''
                                                    : cp.EvaluasiDiri[0]
                                                          .HasilAssesmen[0]
                                                          .HasilAssesmenId ??
                                                      '',
                                            Valid:
                                                cp.EvaluasiDiri[0].HasilAssesmen
                                                    .length === 0
                                                    ? false
                                                    : cp?.EvaluasiDiri[0]
                                                          .HasilAssesmen[0]
                                                          .Valid ?? false,
                                            Autentik:
                                                cp.EvaluasiDiri[0].HasilAssesmen
                                                    .length === 0
                                                    ? false
                                                    : cp?.EvaluasiDiri[0]
                                                          .HasilAssesmen[0]
                                                          .Autentik ?? false,
                                            Terkini:
                                                cp.EvaluasiDiri[0].HasilAssesmen
                                                    .length === 0
                                                    ? false
                                                    : cp?.EvaluasiDiri[0]
                                                          .HasilAssesmen[0]
                                                          .Terkini ?? false,
                                            Memadai:
                                                cp.EvaluasiDiri[0].HasilAssesmen
                                                    .length === 0
                                                    ? false
                                                    : cp?.EvaluasiDiri[0]
                                                          .HasilAssesmen[0]
                                                          .Memadai ?? false,
                                            Assesmen:
                                                cp.EvaluasiDiri[0].HasilAssesmen
                                                    .length === 0
                                                    ? ''
                                                    : cp?.EvaluasiDiri[0]
                                                          .HasilAssesmen[0]
                                                          .Assesmen ?? '',
                                            Nilai:
                                                cp.EvaluasiDiri[0].HasilAssesmen
                                                    .length === 0
                                                    ? 0
                                                    : cp?.EvaluasiDiri[0]
                                                          .HasilAssesmen[0]
                                                          .Nilai ?? 0,
                                            TanggalAssesmen:
                                                cp.EvaluasiDiri[0].HasilAssesmen
                                                    .length === 0
                                                    ? new Date()
                                                    : cp?.EvaluasiDiri[0]
                                                          .HasilAssesmen[0]
                                                          .TanggalAssesmen ??
                                                      new Date(),
                                        },
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

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Asessmen Mahasiswa</h1>
            <SidebarProvider
                style={
                    {
                        '--sidebar-width': '350px',
                    } as React.CSSProperties
                }
            >
                <AsessmentIdComponent dataServer={dataServer} />
            </SidebarProvider>
        </div>
    )
}

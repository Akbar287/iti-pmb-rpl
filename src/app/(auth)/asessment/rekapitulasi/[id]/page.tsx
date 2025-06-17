import RekapitulasiIdComponent from '@/components/rekapitulasi/RekapitulasiIdComponent'
import { SidebarProvider } from '@/components/ui/sidebar'
import { prisma } from '@/lib/prisma'
import { SkorAsessmenTypes } from '@/types/AsessmentTypes'
import React from 'react'

export default async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    const data = await prisma.pendaftaran.findFirst({
        select: {
            PendaftaranId: true,
            KodePendaftar: true,
            DaftarUlang: {
                select: {
                    ProgramStudi: {
                        select: {
                            ProgramStudiId: true,
                            Nama: true,
                            UniversityId: true,
                            Jenjang: true,
                            Akreditasi: true,
                        },
                    },
                },
            },
            MataKuliahMahasiswa: {
                select: {
                    MataKuliahMahasiswaId: true,
                    Rpl: true,
                    Keterangan: true,
                    StatusMataKuliahMahasiswa: true,
                    MataKuliah: {
                        select: {
                            Kode: true,
                            Nama: true,
                            Sks: true,
                            Semester: true,
                            Silabus: true,
                        },
                    },
                    SkorAssesmen: {
                        select: {
                            SkorAssesmenId: true,
                            MataKuliahMahasiswaId: true,
                            Portofolio: true,
                            Tulis: true,
                            Wawancara: true,
                            Demo: true,
                            Diakui: true,
                            SkorRataRata: true,
                            NilaiHuruf: true,
                        },
                    },
                },
            },
        },
        where: { PendaftaranId: id },
    })

    const dataServer: SkorAsessmenTypes = {
        PendaftaranId: data?.PendaftaranId ?? '',
        KodePendaftar: data?.KodePendaftar ?? '',
        ProgramStudi: {
            ProgramStudiId:
                data?.DaftarUlang[0].ProgramStudi.ProgramStudiId ?? '',
            Nama: data?.DaftarUlang[0].ProgramStudi.Nama ?? '',
            UniversityId: data?.DaftarUlang[0].ProgramStudi.UniversityId ?? '',
            Jenjang: data?.DaftarUlang[0].ProgramStudi.Jenjang ?? '',
            Akreditasi: data?.DaftarUlang[0].ProgramStudi.Akreditasi ?? '',
            MataKuliahMahasiswa: (data?.MataKuliahMahasiswa ?? []).map(
                (mkm) => ({
                    MataKuliahMahasiswaId: mkm.MataKuliahMahasiswaId,
                    Rpl: mkm.Rpl ? 'true' : 'false',
                    Keterangan: mkm.Keterangan ?? '',
                    StatusMataKuliahMahasiswa:
                        mkm.StatusMataKuliahMahasiswa ?? '',
                    MataKuliah: {
                        Kode: mkm.MataKuliah.Kode,
                        Nama: mkm.MataKuliah.Nama,
                        Sks: mkm.MataKuliah.Sks,
                        Semester: mkm.MataKuliah.Semester,
                        Silabus: mkm.MataKuliah.Silabus,
                    },
                    SkorAsessmen: {
                        SkorAssesmenId:
                            mkm.SkorAssesmen.length === 0
                                ? ''
                                : mkm.SkorAssesmen[0].SkorAssesmenId ?? '',
                        MataKuliahMahasiswaId:
                            mkm.SkorAssesmen.length === 0
                                ? ''
                                : mkm.SkorAssesmen[0].MataKuliahMahasiswaId ??
                                  '',
                        Portofolio:
                            mkm.SkorAssesmen.length === 0
                                ? 0
                                : mkm.SkorAssesmen[0].Portofolio ?? 0,
                        Tulis:
                            mkm.SkorAssesmen.length === 0
                                ? 0
                                : mkm.SkorAssesmen[0].Tulis ?? 0,
                        Wawancara:
                            mkm.SkorAssesmen.length === 0
                                ? 0
                                : mkm.SkorAssesmen[0].Wawancara ?? 0,
                        Demo:
                            mkm.SkorAssesmen.length === 0
                                ? 0
                                : mkm.SkorAssesmen[0].Demo ?? 0,
                        Diakui:
                            mkm.SkorAssesmen.length === 0
                                ? false
                                : mkm.SkorAssesmen[0].Diakui ?? false,
                        SkorRataRata:
                            mkm.SkorAssesmen.length === 0
                                ? 0
                                : mkm.SkorAssesmen[0].SkorRataRata ?? 0,
                        NilaiHuruf:
                            mkm.SkorAssesmen.length === 0
                                ? ''
                                : mkm.SkorAssesmen[0].NilaiHuruf ?? '',
                    },
                })
            ),
        },
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">
                Rekapitulasi Asessmen Mahasiswa Detail
            </h1>
            <SidebarProvider
                style={
                    {
                        '--sidebar-width': '350px',
                    } as React.CSSProperties
                }
            >
                <RekapitulasiIdComponent dataServer={dataServer} />
            </SidebarProvider>
        </div>
    )
}

import EkuivalentCheckComponent from '@/components/asessment/EkuivalentCheckComponent'
import { SidebarProvider } from '@/components/ui/sidebar'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/provider/api'
import { EkuivalenCheckAsessmenType } from '@/types/EkuivalenCheck'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    const session = await getSession();

    const nama = session?.user?.name || '';

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
                    transkripNilaiRelations: {
                        select: {
                            Nilai: true,
                            Diakui: true,
                            Catatan: true,
                            TranskripNilai: {
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
                        }
                    },
                    MataKuliah: {
                        select: {
                            Kode: true,
                            Nama: true,
                            Sks: true,
                            ProgramStudiId: true,
                            Semester: true,
                            Silabus: true,
                            ProgramStudi: {
                                select: {
                                    ProgramStudiId: true,
                                    Nama: true,
                                }
                            },
                            CapaianPembelajaran: {
                                select: {
                                    CapaianPembelajaranId: true,
                                    MataKuliahId: true,
                                    Nama: true,
                                    Urutan: true,
                                    Active: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    })

    const transkripNilai = await prisma.transkripNilai.findMany({
        where: {
            PendaftaranId: id
        },
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
    })

    const jenisDokumen = await prisma.jenisDokumen.findFirst({
        select: {
            JenisDokumenId: true,
            Jenis: true,
            NomorDokumen: true,
        }, where: {
            Jenis: 'Ijazah dan Transkrip Nilai'
        }
    })

    const buktiFormServer = await prisma.buktiForm.findFirst({
        where: {
            JenisDokumenId: jenisDokumen?.JenisDokumenId,
            PendaftaranId: id
        },
        select: {
            BuktiFormId: true,
            PendaftaranId: true,
            NamaFile: true,
            NamaDokumen: true,
            CreatedAt: true,
            UpdatedAt: true,
        }
    })


    const dataServer: EkuivalenCheckAsessmenType = {
        MataKuliahMahasiswa: data?.MataKuliahMahasiswa
            .sort((a, b) => a.MataKuliah.Kode.localeCompare(b.MataKuliah.Kode))
            .filter(x => x.Keterangan === 'Transfer_SKS').map(item => ({
                MataKuliahMahasiswaId: item.MataKuliahMahasiswaId,
                PendaftaranId: item.PendaftaranId,
                MataKuliahId: item.MataKuliahId,
                Rpl: item.Rpl,
                StatusMataKuliahMahasiswa: item.StatusMataKuliahMahasiswa,
                Keterangan: item.Keterangan,
                TranskripNilai: {
                    NilaiAsessment: item.transkripNilaiRelations.length > 0 ? item.transkripNilaiRelations[0].Nilai : '',
                    Diakui: item.transkripNilaiRelations.length > 0 ? item.transkripNilaiRelations[0].Diakui : false,
                    Catatan: item.transkripNilaiRelations.length > 0 ? item.transkripNilaiRelations[0].Catatan ?? '' : '',
                    TranskripNilaiId: item.transkripNilaiRelations.length > 0 ? item.transkripNilaiRelations[0].TranskripNilai.TranskripNilaiId : '',
                    PendaftaranId: item.transkripNilaiRelations.length > 0 ? item.transkripNilaiRelations[0].TranskripNilai.PendaftaranId : '',
                    KodeMataKuliah: item.transkripNilaiRelations.length > 0 ? item.transkripNilaiRelations[0].TranskripNilai.KodeMataKuliah : '',
                    NamaMataKuliah: item.transkripNilaiRelations.length > 0 ? item.transkripNilaiRelations[0].TranskripNilai.NamaMataKuliah : '',
                    Sks: item.transkripNilaiRelations.length > 0 ? item.transkripNilaiRelations[0].TranskripNilai.Sks : 0,
                    Nilai: item.transkripNilaiRelations.length > 0 ? item.transkripNilaiRelations[0].TranskripNilai.Nilai : '',
                    CreatedAt: item.transkripNilaiRelations.length > 0 ? item.transkripNilaiRelations[0].TranskripNilai.CreatedAt : new Date(),
                    UpdatedAt: item.transkripNilaiRelations.length > 0 ? item.transkripNilaiRelations[0].TranskripNilai.UpdatedAt : new Date(),
                },
                MataKuliah: {
                    MataKuliahId: item.MataKuliahId,
                    ProgramStudiId: item.MataKuliah.ProgramStudiId,
                    NamaProgramStudi: item.MataKuliah.ProgramStudi.Nama,
                    Nama: item.MataKuliah.Nama,
                    Sks: item.MataKuliah.Sks,
                    Semester: item.MataKuliah.Semester,
                    Silabus: item.MataKuliah.Silabus,
                    CapaianPembelajaran: item.MataKuliah.CapaianPembelajaran.map(capaian => ({
                        CapaianPembelajaranId: capaian.CapaianPembelajaranId,
                        MataKuliahId: capaian.MataKuliahId,
                        Nama: capaian.Nama,
                        Urutan: capaian.Urutan,
                        Active: capaian.Active
                    }))
                }
            })) ?? [],
        TranskripNilai: transkripNilai,
        BuktiFormEvaluasiDiri: {
            BuktiFormId: buktiFormServer?.BuktiFormId ?? '',
            PendaftaranId: buktiFormServer?.PendaftaranId ?? '',
            NamaFile: buktiFormServer?.NamaFile ?? '',
            NamaDokumen: buktiFormServer?.NamaDokumen ?? '',
            JenisDokumen: {
                Jenis: jenisDokumen?.Jenis ?? '',
                NomorDokumen: jenisDokumen?.NomorDokumen ?? 0
            }
        },
    }

    return (
        <div className="p-6">
            <Link
                href={`/asessment/asessmen-mahasiswa/ekuivalent-check?id=${id}`}
                className="inline-flex items-center mb-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Petunjuk
            </Link>
            <h1 className="text-2xl font-bold mb-4">Asessmen Mahasiswa</h1>
            <SidebarProvider
                style={
                    {
                        '--sidebar-width': '350px',
                    } as React.CSSProperties
                }
            >
                <EkuivalentCheckComponent nama={nama} dataServer={dataServer} />
            </SidebarProvider>
        </div>
    )
}

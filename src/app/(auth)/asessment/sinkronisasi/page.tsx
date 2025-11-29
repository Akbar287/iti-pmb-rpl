import SinkronisasiComponent from '@/components/asessment/SinkronisasiComponent'
import React from 'react'
import { prisma } from '@/lib/prisma'
import { ResponseSkRektorAsessmenType } from '@/types/FinalAsessmen';

const Page = async () => {

    const sinkronisasiData = await prisma.assesorMahasiswa.findMany({
        distinct: ['PendaftaranId'],
        where: {
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
                ]
            }
        },
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
                                    NamaFile: true,
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
    });

    const data: ResponseSkRektorAsessmenType[] = sinkronisasiData?.map((am) => ({
            Nama: am.Pendaftaran.Mahasiswa.User.Nama,
            Email: am.Pendaftaran.Mahasiswa.User.Email,
            Status: am.Pendaftaran.StatusMahasiswaAssesmentHistory.find(x => x.Aktif) ? am.Pendaftaran.StatusMahasiswaAssesmentHistory.find(x => x.Aktif)?.StatusMahasiswaAssesment.NamaStatus ?? '' : '',
            ProgramStudi: am.Pendaftaran.DaftarUlang.length === 0 ? '' : am.Pendaftaran.DaftarUlang[0].ProgramStudi.Nama ?? '',
            NomorSk: am.Pendaftaran.SkRektorMahasiswa.length > 0 ? am.Pendaftaran.SkRektorMahasiswa[0].SkRektor.NomorSk ?? '' : '',
            NamaFile: am.Pendaftaran.SkRektorMahasiswa.length > 0 ? am.Pendaftaran.SkRektorMahasiswa[0].SkRektor.NamaFile ?? '' : '',
            NomorHp: am.Pendaftaran.Mahasiswa.User.NomorHp ?? '',
            PendaftaranId: am.PendaftaranId,
            KodePendaftar: am.Pendaftaran.KodePendaftar,
            Nim: am.Pendaftaran.DaftarUlang.length === 0 ? '' : am.Pendaftaran.DaftarUlang[0].Nim ?? '',
            SkRektor: am.Pendaftaran.SkRektorMahasiswa.length > 0 ? true : false,
        })) ?? []

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Sinkronisasi Hasil</h1>
            <SinkronisasiComponent dataServer={data} />
        </div>
    )
}

export default Page

import TambahSkRektorAsesorComponent from '@/components/asesor/TambahSkRektorAsesorComponent'
import React from 'react'
import { prisma } from '@/lib/prisma'
import { string } from 'zod'

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params

    let dataParsing: {
        PendaftaranId: string;
        NamaProgramStudi: string;
        NamaMahasiswa: string
        NamaAsesorPertama: string;
        NamaAsesorKedua: string;
        NamaFile: string;
        NamaDokumen: string;
        SkRektorId: string;
        NamaSk: string;
        TahunSk: string;
        NomorSk: string;
        Catatan: string
    } = {
        PendaftaranId: "",
        NamaProgramStudi: "",
        NamaMahasiswa: "",
        NamaAsesorPertama: "",
        NamaAsesorKedua: "",
        NamaFile: "",
        NamaDokumen: "",
        SkRektorId: "",
        NamaSk: "",
        TahunSk: "",
        NomorSk: "",
        Catatan: "",
    }
    const dataPendaftaran = await prisma.pendaftaran.findFirst({
        where: {
            PendaftaranId: id,
        },
        select: {
            DaftarUlang: {
                select: {
                    ProgramStudi: {
                        select: {
                            Nama: true
                        }
                    }
                }
            },
            PendaftaranId: true,
            Mahasiswa: {
                select: {
                    User: {
                        select: {
                            Nama: true,
                        }
                    }
                }
            },
            AssesorMahasiswa: {
                select: {
                    Asesor: {
                        select: {
                            AsesorId: true,
                            User: {
                                select: {
                                    Nama: true
                                }
                            }
                        }
                    },
                    Urutan: true,
                    Confirmation: true,
                    SkRektorAssesor: {
                        select: {
                            SkRektor: {
                                select: {
                                    SkRektorId: true,
                                    NamaSk: true,
                                    TahunSk: true,
                                    NomorSk: true,
                                    NamaFile: true,
                                    NamaDokumen: true,
                                    Catatan: true
                                }
                            }
                        }
                    }
                }
            }
        },
    });

    if (dataPendaftaran == null) {
        const dataSk = await prisma.skRektor.findFirst({
            where: {
                SkRektorId: id,
            },
            select: {
                NamaFile: true,
                NamaDokumen: true,
                SkRektorId: true,
                NamaSk: true,
                TahunSk: true,
                NomorSk: true,
                Catatan: true,
                SkRektorAssesor: {
                    select: {
                        AssesorMahasiswa: {
                            select: {
                                Pendaftaran: {
                                    select: {
                                        DaftarUlang: {
                                            select: {
                                                ProgramStudi: {
                                                    select: {
                                                        Nama: true
                                                    }
                                                }
                                            }
                                        },
                                        PendaftaranId: true,
                                        Mahasiswa: {
                                            select: {
                                                User: {
                                                    select: {
                                                        Nama: true,
                                                    }
                                                }
                                            }
                                        },
                                        AssesorMahasiswa: {
                                            select: {
                                                Asesor: {
                                                    select: {
                                                        AsesorId: true,
                                                        User: {
                                                            select: {
                                                                Nama: true
                                                            }
                                                        }
                                                    }
                                                },
                                                Urutan: true,
                                                Confirmation: true,
                                                SkRektorAssesor: {
                                                    select: {
                                                        SkRektor: {
                                                            select: {
                                                                SkRektorId: true,
                                                                NamaSk: true,
                                                                TahunSk: true,
                                                                NomorSk: true,
                                                                NamaFile: true,
                                                                NamaDokumen: true,
                                                                Catatan: true
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
        });

        if (dataSk) {
            let r = dataSk.SkRektorAssesor[0].AssesorMahasiswa.Pendaftaran.AssesorMahasiswa;
            dataParsing = {
                PendaftaranId: dataSk.SkRektorAssesor[0].AssesorMahasiswa.Pendaftaran.PendaftaranId,
                NamaProgramStudi: dataSk.SkRektorAssesor[0].AssesorMahasiswa.Pendaftaran.DaftarUlang[0].ProgramStudi.Nama,
                NamaAsesorPertama: r.find(x => x.Urutan === 1) ? r.find(x => x.Urutan === 1)?.Asesor.User.Nama ?? '' : '',
                NamaAsesorKedua: r.find(x => x.Urutan === 2) ? r.find(x => x.Urutan === 2)?.Asesor.User.Nama ?? '' : '',
                NamaMahasiswa: dataSk.SkRektorAssesor[0].AssesorMahasiswa.Pendaftaran.Mahasiswa.User.Nama,
                NamaFile: dataSk.NamaFile,
                NamaDokumen: dataSk.NamaDokumen,
                SkRektorId: dataSk.SkRektorId,
                NamaSk: dataSk.NamaSk,
                TahunSk: dataSk.TahunSk.toString(),
                NomorSk: dataSk.NomorSk,
                Catatan: dataSk.Catatan ?? '',
            }
        }
    } else {
        dataParsing = {
            PendaftaranId: dataPendaftaran.PendaftaranId,
            NamaProgramStudi: dataPendaftaran.DaftarUlang[0].ProgramStudi.Nama,
            NamaAsesorPertama: dataPendaftaran.AssesorMahasiswa.find(x => x.Urutan === 1) ? dataPendaftaran.AssesorMahasiswa.find(x => x.Urutan === 1)?.Asesor.User.Nama ?? '' : '',
            NamaAsesorKedua: dataPendaftaran.AssesorMahasiswa.find(x => x.Urutan === 2) ? dataPendaftaran.AssesorMahasiswa.find(x => x.Urutan === 2)?.Asesor.User.Nama ?? '' : '',
            NamaMahasiswa: dataPendaftaran.Mahasiswa.User.Nama,
            NamaFile: dataPendaftaran.AssesorMahasiswa[0].SkRektorAssesor[0].SkRektor.NamaFile,
            NamaDokumen: dataPendaftaran.AssesorMahasiswa[0].SkRektorAssesor[0].SkRektor.NamaDokumen,
            SkRektorId: dataPendaftaran.AssesorMahasiswa[0].SkRektorAssesor[0].SkRektor.SkRektorId,
            NamaSk: dataPendaftaran.AssesorMahasiswa[0].SkRektorAssesor[0].SkRektor.NamaSk,
            TahunSk: dataPendaftaran.AssesorMahasiswa[0].SkRektorAssesor[0].SkRektor.TahunSk.toString(),
            NomorSk: dataPendaftaran.AssesorMahasiswa[0].SkRektorAssesor[0].SkRektor.NomorSk,
            Catatan: dataPendaftaran.AssesorMahasiswa[0].SkRektorAssesor[0].SkRektor.Catatan ?? '',
        }
    }
    const status = await prisma.pendaftaran.findFirst({
        where: { PendaftaranId: dataParsing.PendaftaranId }, select: {
            StatusMahasiswaAssesmentHistory: {
                select: {
                    Aktif: true,
                    StatusMahasiswaAssesment: {
                        select: {
                            Urutan: true,
                            NamaStatus: true
                        }
                    }
                }
            }
        },
    })

    let dataStatus: {
        NamaStatus: string; Urutan: number; Aktif: boolean
    }[] = []
    if (status) {
        dataStatus = status.StatusMahasiswaAssesmentHistory.map(x => ({
            NamaStatus: x.StatusMahasiswaAssesment.NamaStatus,
            Urutan: x.StatusMahasiswaAssesment.Urutan,
            Aktif: x.Aktif
        })).sort((a, b) => a.Urutan - b.Urutan)
    }

    console.dir(dataStatus)

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Upload SK</h1>
            <TambahSkRektorAsesorComponent status={dataStatus} dataServer={dataParsing} />
        </div>
    )
}

export default Page

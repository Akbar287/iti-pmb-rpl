import HasilAsessmenIdComponent from '@/components/hasil-asessmen/HasilAsessmenIdComponent'
import RekapitulasiIdComponent from '@/components/rekapitulasi/RekapitulasiIdComponent'
import { prisma } from '@/lib/prisma'
import { ResponseFinalAsessmenAsesorDetailType } from '@/types/FinalAsessmen'
import React from 'react'

export default async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    const data = await prisma.pendaftaran.findFirst({
        select: {
            PendaftaranId: true,
            KodePendaftar: true,
            JalurPendaftaran: true,
            Periode: true,
            NoUjian: true,
            Gelombang: true,
            SistemKuliah: true,
            Mahasiswa: {
                select: {
                    User: {
                        select: {
                            Nama: true,
                            Email: true,
                            NomorHp: true,
                            Agama: true,
                            TanggalLahir: true,
                            TempatLahir: true,
                        },
                    },
                },
            },
            AssesorMahasiswa: {
                select: {
                    AssesorMahasiswaId: true,
                    Urutan: true,
                    Confirmation: true,
                    Asesor: {
                        select: {
                            User: {
                                select: { Nama: true },
                            },
                        },
                    },
                },
            },
            DaftarUlang: {
                select: {
                    Nim: true,
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
                            MataKuliahId: true,
                            Kode: true,
                            Nama: true,
                            Sks: true,
                            Semester: true,
                            Silabus: true,
                            CapaianPembelajaran: {
                                select: {
                                    CapaianPembelajaranId: true,
                                    Nama: true,
                                    Urutan: true,
                                    EvaluasiDiri: {
                                        select: {
                                            EvaluasiDiriId: true,
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
                                                    Nilai: true,
                                                    Assesmen: true,
                                                    TanggalAssesmen: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
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

    const dataServer: ResponseFinalAsessmenAsesorDetailType = {
        Nama: data?.Mahasiswa.User.Nama ?? '',
        Email: data?.Mahasiswa.User.Email ?? '',
        NomorHp: data?.Mahasiswa.User.NomorHp ?? '',
        Agama: data?.Mahasiswa.User.Agama ?? '',
        Nim:
            data?.DaftarUlang.length === 0
                ? ''
                : data?.DaftarUlang[0].Nim ?? '',
        TanggalLahir: data?.Mahasiswa.User.TanggalLahir ?? null,
        TempatLahir: data?.Mahasiswa.User.TempatLahir ?? '',
        PendaftaranId: data?.PendaftaranId ?? '',
        KodePendaftar: data?.KodePendaftar ?? '',
        JalurPendaftaran: data?.JalurPendaftaran ?? '',
        Periode: data?.Periode ?? '',
        NoUjian: data?.NoUjian ?? '',
        Gelombang: data?.Gelombang ?? '',
        SistemKuliah: data?.SistemKuliah ?? '',
        AssesorMahasiswa: (data?.AssesorMahasiswa ?? []).map((am) => ({
            AssesorMahasiswaId: am.AssesorMahasiswaId ?? '',
            Nama: am.Asesor.User.Nama ?? '',
            Urutan: am.Urutan ?? 0,
            Confirmation: am.Confirmation ?? false,
        })),
        ProgramStudi: {
            ProgramStudiId:
                data?.DaftarUlang[0].ProgramStudi.ProgramStudiId ?? '',
            Nama: data?.DaftarUlang[0].ProgramStudi.Nama ?? '',
            UniversityId: data?.DaftarUlang[0].ProgramStudi.UniversityId ?? '',
            Jenjang: data?.DaftarUlang[0].ProgramStudi.Jenjang ?? '',
            Akreditasi: data?.DaftarUlang[0].ProgramStudi.Akreditasi ?? '',
        },
        MataKuliahMahasiswa: (data?.MataKuliahMahasiswa ?? []).map((mkm) => ({
            MataKuliahMahasiswaId: mkm.MataKuliahMahasiswaId,
            Rpl: !!mkm.Rpl,
            Keterangan: mkm.Keterangan ?? null,
            StatusMataKuliahMahasiswa: mkm.StatusMataKuliahMahasiswa ?? null,
            MataKuliah: {
                MataKuliahId: mkm.MataKuliah.MataKuliahId,
                Kode: mkm.MataKuliah.Kode,
                Nama: mkm.MataKuliah.Nama,
                Sks: mkm.MataKuliah.Sks,
                Semester: mkm.MataKuliah.Semester,
                Silabus: mkm.MataKuliah.Silabus,
                CapaianPembelajaran: mkm.MataKuliah.CapaianPembelajaran.map(
                    (cp) => ({
                        CapaianPembelajaranId: cp.CapaianPembelajaranId,
                        Nama: cp.Nama,
                        Urutan: cp.Urutan,
                        EvaluasiDiri: {
                            EvaluasiDiriId:
                                cp.EvaluasiDiri.length === 0
                                    ? ''
                                    : cp.EvaluasiDiri[0].EvaluasiDiriId ?? '',
                            ProfiensiPengetahuan:
                                cp.EvaluasiDiri.length === 0
                                    ? ('' as any)
                                    : cp.EvaluasiDiri[0].ProfiensiPengetahuan ??
                                      ('' as any),
                            TanggalPengesahan:
                                cp.EvaluasiDiri.length === 0
                                    ? null
                                    : cp.EvaluasiDiri[0].TanggalPengesahan
                                    ? new Date(
                                          cp.EvaluasiDiri[0].TanggalPengesahan
                                      )
                                    : null,
                            CreatedAt:
                                cp.EvaluasiDiri.length === 0
                                    ? null
                                    : cp.EvaluasiDiri[0].CreatedAt
                                    ? new Date(cp.EvaluasiDiri[0].CreatedAt)
                                    : null,
                            UpdatedAt:
                                cp.EvaluasiDiri.length === 0
                                    ? null
                                    : cp.EvaluasiDiri[0].UpdatedAt
                                    ? new Date(cp.EvaluasiDiri[0].UpdatedAt)
                                    : null,
                            HasilAsessment: {
                                HasilAssesmenId:
                                    cp.EvaluasiDiri.length === 0
                                        ? ''
                                        : cp.EvaluasiDiri[0].HasilAssesmen
                                              .length === 0
                                        ? ''
                                        : cp.EvaluasiDiri[0].HasilAssesmen[0]
                                              .HasilAssesmenId ?? '',
                                Valid:
                                    cp.EvaluasiDiri.length === 0
                                        ? false
                                        : cp.EvaluasiDiri[0].HasilAssesmen
                                              .length === 0
                                        ? false
                                        : cp.EvaluasiDiri[0].HasilAssesmen[0]
                                              .Valid ?? false,
                                Autentik:
                                    cp.EvaluasiDiri.length === 0
                                        ? false
                                        : cp.EvaluasiDiri[0].HasilAssesmen
                                              .length === 0
                                        ? false
                                        : cp.EvaluasiDiri[0].HasilAssesmen[0]
                                              .Autentik ?? false,
                                Terkini:
                                    cp.EvaluasiDiri.length === 0
                                        ? false
                                        : cp.EvaluasiDiri[0].HasilAssesmen
                                              .length === 0
                                        ? false
                                        : cp.EvaluasiDiri[0].HasilAssesmen[0]
                                              .Terkini ?? false,
                                Memadai:
                                    cp.EvaluasiDiri.length === 0
                                        ? false
                                        : cp.EvaluasiDiri[0].HasilAssesmen
                                              .length === 0
                                        ? false
                                        : cp.EvaluasiDiri[0].HasilAssesmen[0]
                                              .Memadai ?? false,
                                Assesmen:
                                    cp.EvaluasiDiri.length === 0
                                        ? ''
                                        : cp.EvaluasiDiri[0].HasilAssesmen
                                              .length === 0
                                        ? ''
                                        : cp.EvaluasiDiri[0].HasilAssesmen[0]
                                              .Assesmen ?? '',
                                Nilai:
                                    cp.EvaluasiDiri.length === 0
                                        ? 0
                                        : cp.EvaluasiDiri[0].HasilAssesmen
                                              .length === 0
                                        ? 0
                                        : cp.EvaluasiDiri[0].HasilAssesmen[0]
                                              .Nilai ?? 0,
                                TanggalAssesmen:
                                    cp.EvaluasiDiri.length === 0
                                        ? null
                                        : cp.EvaluasiDiri[0].HasilAssesmen
                                              .length === 0
                                        ? null
                                        : cp.EvaluasiDiri[0].HasilAssesmen[0]
                                              .TanggalAssesmen
                                        ? new Date(
                                              cp.EvaluasiDiri[0].HasilAssesmen[0].TanggalAssesmen
                                          )
                                        : null,
                            },
                        },
                    })
                ),
            },
            SkorAssesmen: {
                SkorAssesmenId:
                    mkm.SkorAssesmen.length === 0
                        ? ''
                        : mkm.SkorAssesmen[0].SkorAssesmenId ?? '',
                MataKuliahMahasiswaId:
                    mkm.SkorAssesmen.length === 0
                        ? ''
                        : mkm.SkorAssesmen[0].MataKuliahMahasiswaId ?? '',
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
        })),
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">
                Detail Hasil Final Asessmen Mahasiswa
            </h1>
            <HasilAsessmenIdComponent dataServer={dataServer} />
        </div>
    )
}

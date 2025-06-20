import SanggahanIdComponent from '@/components/sanggahan/SanggahanIdComponent'
import { prisma } from '@/lib/prisma'
import { SanggahanAsessmenTypes } from '@/types/AsessmentTypes'
import React from 'react'

export default async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    const data = await prisma.pendaftaran.findFirst({
        select: {
            PendaftaranId: true,
            KodePendaftar: true,
            NoUjian: true,
            Periode: true,
            Gelombang: true,
            SistemKuliah: true,
            JalurPendaftaran: true,
            StatusMahasiswaAssesmentHistory: {
                select: {
                    StatusMahasiswaAssesmentId: true,
                    Tanggal: true,
                },
            },
            Mahasiswa: {
                select: {
                    User: { select: { Nama: true, NomorHp: true } },
                },
            },
            SanggahanAssesmen: {
                select: {
                    SanggahanAssesmenId: true,
                    PendaftaranId: true,
                    ProsesBanding: true,
                    DiskusiBanding: true,
                    CreatedAt: true,
                    UpdatedAt: true,
                    SanggahanAssesmenMk: {
                        select: {
                            SanggahanAssesmenMkId: true,
                            SanggahanAssesmenId: true,
                            MataKuliahMahasiswaId: true,
                            Keterangan: true,
                            CreatedAt: true,
                            UpdatedAt: true,
                        },
                    },
                    SanggahanAssesmenPihak: {
                        select: {
                            SanggahanAssesmenPihakId: true,
                            SanggahanAssesmenId: true,
                            NamaPihak: true,
                            JabatanPihak: true,
                            InstansiPihak: true,
                            CreatedAt: true,
                            UpdatedAt: true,
                        },
                    },
                },
            },
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

    const status = await prisma.statusMahasiswaAssesment.findFirst({
        select: { StatusMahasiswaAssesmentId: true },
        where: { NamaStatus: 'Asessmen Oleh Asesor' },
    })

    const dataServer: SanggahanAsessmenTypes = {
        PendaftaranId: data?.PendaftaranId ?? '',
        KodePendaftar: data?.KodePendaftar ?? '',
        Nama: data?.Mahasiswa.User.Nama ?? '',
        NomorHp: data?.Mahasiswa.User.NomorHp ?? '',
        TanggalAsessmen: data?.StatusMahasiswaAssesmentHistory.find(
            (x) =>
                x.StatusMahasiswaAssesmentId ===
                status?.StatusMahasiswaAssesmentId
        )
            ? data?.StatusMahasiswaAssesmentHistory.find(
                  (x) =>
                      x.StatusMahasiswaAssesmentId ===
                      status?.StatusMahasiswaAssesmentId
              )?.Tanggal ?? new Date()
            : new Date(),
        NoUjian: data?.NoUjian ?? '',
        Periode: data?.Periode ?? '',
        Gelombang: data?.Gelombang ?? '',
        SistemKuliah: data?.SistemKuliah ?? '',
        JalurPendaftaran: data?.JalurPendaftaran ?? '',
        SanggahanAssesmen: {
            SanggahanAssesmenId:
                data?.SanggahanAssesmen === undefined
                    ? ''
                    : data?.SanggahanAssesmen.length > 0
                    ? data.SanggahanAssesmen[0].SanggahanAssesmenId ?? ''
                    : '',
            PendaftaranId:
                data?.SanggahanAssesmen === undefined
                    ? ''
                    : data?.SanggahanAssesmen.length > 0
                    ? data.SanggahanAssesmen[0].PendaftaranId ?? ''
                    : '',
            ProsesBanding:
                data?.SanggahanAssesmen === undefined
                    ? false
                    : data?.SanggahanAssesmen.length > 0
                    ? data.SanggahanAssesmen[0].ProsesBanding ?? false
                    : false,
            DiskusiBanding:
                data?.SanggahanAssesmen === undefined
                    ? false
                    : data?.SanggahanAssesmen.length > 0
                    ? data.SanggahanAssesmen[0].DiskusiBanding ?? false
                    : false,
            CreatedAt:
                data?.SanggahanAssesmen === undefined
                    ? null
                    : data?.SanggahanAssesmen.length > 0
                    ? data.SanggahanAssesmen[0].CreatedAt ?? null
                    : null,
            UpdatedAt:
                data?.SanggahanAssesmen === undefined
                    ? null
                    : data?.SanggahanAssesmen.length > 0
                    ? data.SanggahanAssesmen[0].UpdatedAt ?? null
                    : null,
            SanggahanAssesmenMk: !data?.SanggahanAssesmen
                ? []
                : data?.SanggahanAssesmen.length === 0
                ? []
                : data?.SanggahanAssesmen[0].SanggahanAssesmenMk.length === 0
                ? []
                : data?.SanggahanAssesmen[0].SanggahanAssesmenMk.map((sa) => ({
                      SanggahanAssesmenMkId: sa.SanggahanAssesmenMkId ?? '',
                      SanggahanAssesmenId: sa.SanggahanAssesmenId ?? '',
                      MataKuliahMahasiswaId: sa.MataKuliahMahasiswaId ?? '',
                      Keterangan: sa.Keterangan ?? null,
                      CreatedAt: sa.CreatedAt ?? null,
                      UpdatedAt: sa.UpdatedAt ?? null,
                  })),
            SanggahanAssesmenPihak: !data?.SanggahanAssesmen
                ? []
                : data?.SanggahanAssesmen.length === 0
                ? []
                : data?.SanggahanAssesmen[0].SanggahanAssesmenPihak.length === 0
                ? []
                : data?.SanggahanAssesmen[0].SanggahanAssesmenPihak.map(
                      (sam) => ({
                          SanggahanAssesmenPihakId:
                              sam.SanggahanAssesmenPihakId,
                          SanggahanAssesmenId: sam.SanggahanAssesmenId,
                          NamaPihak: sam.NamaPihak,
                          JabatanPihak: sam.JabatanPihak ?? null,
                          InstansiPihak: sam.InstansiPihak ?? null,
                          CreatedAt: sam.CreatedAt ?? null,
                          UpdatedAt: sam.UpdatedAt ?? null,
                      })
                  ),
        },
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
                Sanggahan Asessmen Mahasiswa
            </h1>
            <SanggahanIdComponent dataServer={dataServer} />
        </div>
    )
}

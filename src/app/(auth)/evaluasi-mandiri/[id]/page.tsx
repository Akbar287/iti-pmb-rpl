import EvaluasiMandiriId from '@/components/evaluasi-mandiri/EvaluasiMandiriId'
import { SidebarProvider } from '@/components/ui/sidebar'
import { prisma } from '@/lib/prisma'
import { MataKuliahMahasiswaCapaianPembelajaranTypes } from '@/types/DaftarUlangProdi'

interface PageProps {
    params: {
        id: string
    }
}

const Page = async ({ params }: PageProps) => {
    const id = params.id
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

    const dataServer: MataKuliahMahasiswaCapaianPembelajaranTypes = (
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
                                        cp?.EvaluasiDiri[0].TanggalPengesahan,
                                    CreatedAt: cp?.EvaluasiDiri[0].CreatedAt,
                                    UpdatedAt: cp?.EvaluasiDiri[0].UpdatedAt,
                                    BuktiForm:
                                        cp?.EvaluasiDiri[0]
                                            .BuktiFormEvaluasiDiri.length == 0
                                            ? []
                                            : cp?.EvaluasiDiri[0].BuktiFormEvaluasiDiri.map(
                                                  (bf) => ({
                                                      Jenis: bf.BuktiForm
                                                          .JenisDokumen.Jenis,
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
                                                          bf.BuktiForm.NamaFile,
                                                      NamaDokumen:
                                                          bf.BuktiForm
                                                              .NamaDokumen,
                                                  })
                                              ),
                                },
                  })),
    }))

    const buktiFormServer = await prisma.buktiForm.findMany({
        where: {
            PendaftaranId: id,
        },
        orderBy: {
            JenisDokumen: {
                NomorDokumen: 'asc',
            },
        },
        select: {
            BuktiFormId: true,
            NamaDokumen: true,
            NamaFile: true,
            JenisDokumen: {
                select: {
                    Jenis: true,
                    JenisDokumenId: true,
                    NomorDokumen: true,
                },
            },
        },
    })

    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': '350px',
                } as React.CSSProperties
            }
        >
            <EvaluasiMandiriId
                buktiFormServer={buktiFormServer}
                dataServer={dataServer}
            />
        </SidebarProvider>
    )
}

export default Page

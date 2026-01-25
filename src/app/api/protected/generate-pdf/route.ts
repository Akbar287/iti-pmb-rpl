import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { renderToStream } from '@react-pdf/renderer'
import { GenerateSkPdf } from '@/components/generate-pdf/GenerateSkPdf'
import { prisma } from '@/lib/prisma'
import { GenerateSkType } from '@/types/GeneratePdfTypes'
import { Jenjang } from '@/generated/prisma'
import { isGenerateSk } from '@/config/checkGenerateSkStats'

const app = new Hono().basePath('/api/protected/generate-pdf')

app.use('*', withApiAuth)

app.get('/', async (c) => {

    const PendaftaranId = c.req.query('_id') || ''
    const type = c.req.query('_t') || ''

    if (!PendaftaranId || !type) {
        return c.json({ error: 'Missing parameters' }, 400)
    }

    if (type === 'sk') {
        const NomorSk = c.req.query('_n') || ''
        const JenisSk = c.req.query('_j') || ''

        const response = await prisma.pendaftaran.findFirst({
            where: {
                PendaftaranId: PendaftaranId
            },
            select: {
                Periode: true,
                StatusMahasiswaAssesmentHistory: {
                    select: {
                        Aktif: true,
                        StatusMahasiswaAssesment: {
                            select: {
                                StatusMahasiswaAssesmentId: true,
                                NamaStatus: true
                            }
                        }
                    }
                },
                DaftarUlang: {
                    select: {
                        JenjangKkniDituju: true,
                        ProgramStudi: {
                            select: {
                                MataKuliah: {
                                    select: {
                                        MataKuliahId: true,
                                        Kode: true,
                                        Nama: true,
                                        Sks: true,
                                        Semester: true,
                                    }
                                },
                                ProgramStudiId: true,
                                Nama: true,
                                Jenjang: true,
                                Akreditasi: true,
                                University: {
                                    select: {
                                        Alamat: {
                                            select: {
                                                Alamat: true,
                                                KodePos: true,
                                            }
                                        },
                                        UniversityId: true,
                                        Nama: true,
                                        UniversitySosialMedia: {
                                            select: {
                                                UniversitySosialMediaId: true,
                                                Nama: true,
                                                Username: true,
                                                Icon: true
                                            }
                                        },
                                        UniversityJabatan: {
                                            select: {
                                                UniversityJabatanId: true,
                                                Nama: true,
                                                UniversityJabatanOrang: {
                                                    select: {
                                                        Nama: true,
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
                PendaftaranId: true,
                InstitusiLama: {
                    select: {
                        InstitusiLamaId: true,
                        Jenjang: true,
                        NamaInstitusi: true,
                        Jurusan: true,
                        Nisn: true
                    }
                },
                MataKuliahMahasiswa: {
                    select: {
                        transkripNilaiRelations: {
                            select: {
                                Nilai: true,
                                Diakui: true,
                                TranskripNilai: {
                                    select: {
                                        TranskripNilaiId: true,
                                        KodeMataKuliah: true,
                                        NamaMataKuliah: true,
                                        Sks: true,
                                        Nilai: true,
                                    }
                                }
                            }
                        },
                        MataKuliahMahasiswaId: true,
                        Rpl: true,
                        Keterangan: true,
                        StatusMataKuliahMahasiswa: true,
                        SkorAssesmen: {
                            select: {
                                SkorAssesmenId: true,
                                Diakui: true,
                                NilaiHuruf: true
                            }
                        },
                        MataKuliah: {
                            select: {
                                Kode: true,
                                Nama: true,
                                Sks: true,
                                Semester: true,
                                Silabus: true,
                            }
                        },
                    }
                },
                Mahasiswa: {
                    select: {
                        User: {
                            select: {
                                Nama: true,
                                TempatLahir: true,
                                TanggalLahir: true
                            }
                        }
                    }
                }
            }
        })

        if (!response) {
            return c.json({ error: 'Pendaftaran not found' }, 404)
        }

        let check = response.StatusMahasiswaAssesmentHistory.find(x => x.Aktif);
        if (isGenerateSk(check?.StatusMahasiswaAssesment.NamaStatus ?? '')) {
            const data: GenerateSkType = {
                PendaftaranId: response?.PendaftaranId || '',
                Nama: response?.Mahasiswa?.User?.Nama || '',
                Periode: response?.Periode || '',
                TempatLahir: response?.Mahasiswa?.User?.TempatLahir || '',
                TanggalLahir: response?.Mahasiswa?.User?.TanggalLahir || new Date(),
                ProgramStudi: {
                    ProgramStudiId: response ? response.DaftarUlang.length > 0 ? response?.DaftarUlang[0].ProgramStudi.ProgramStudiId : '' : '',
                    Nama: response ? response.DaftarUlang.length > 0 ? response?.DaftarUlang[0].ProgramStudi.Nama : '' : '',
                },
                Universitas: {
                    UniversityId: response ? response.DaftarUlang.length > 0 ? response?.DaftarUlang[0].ProgramStudi.University.UniversityId : '' : '',
                    Logo: '',
                    Alamat: response ? response.DaftarUlang.length > 0 ? response?.DaftarUlang[0].ProgramStudi.University.Alamat.Alamat : '' : '',
                    KodePos: response ? response.DaftarUlang.length > 0 ? response?.DaftarUlang[0].ProgramStudi.University.Alamat.KodePos : '' : '',
                    Nama: response ? response.DaftarUlang.length > 0 ? response?.DaftarUlang[0].ProgramStudi.University.Nama : '' : '',
                    UniversitySocialMedia: response ? response.DaftarUlang.length > 0 ? response?.DaftarUlang[0].ProgramStudi.University.UniversitySosialMedia.map(sm => ({
                        UniversitySocialMediaId: sm.UniversitySosialMediaId || '',
                        Nama: sm.Nama || '',
                        Username: sm.Username || '',
                        Icon: sm.Icon || ''
                    })) : [] : [],
                    UniversityJabatan: response ? response.DaftarUlang.length > 0 ? response?.DaftarUlang[0].ProgramStudi.University.UniversityJabatan.map(item => ({
                        UniversityJabatanId: item.UniversityJabatanId || '',
                        NamaJabatan: item.Nama || '',
                        Nama: item.UniversityJabatanOrang.length > 0 ? item.UniversityJabatanOrang[0].Nama : ''
                    })) : [] : []
                },
                InstitusiLama: {
                    InstitusiLamaId: response ? response.InstitusiLama.length > 0 ? response?.InstitusiLama[0].InstitusiLamaId : '' : '',
                    Jenjang: response ? response.InstitusiLama.length > 0 ? response?.InstitusiLama[0].Jenjang : Jenjang.S1 : Jenjang.S1,
                    NamaInstitusi: response ? response.InstitusiLama.length > 0 ? response?.InstitusiLama[0].NamaInstitusi : '' : '',
                    Jurusan: response ? response.InstitusiLama.length > 0 ? response?.InstitusiLama[0].Jurusan : '' : '',
                    Nisn: response ? response.InstitusiLama.length > 0 ? response?.InstitusiLama[0].Nisn : '' : ''
                },
                MataKuliah: response ? response.DaftarUlang.length > 0 ? response.DaftarUlang[0].ProgramStudi.MataKuliah.map(mk => ({
                    MataKuliahId: mk.MataKuliahId || '',
                    Kode: mk.Kode || '',
                    Nama: mk.Nama || '',
                    Sks: mk.Sks || 0,
                    Semester: mk.Semester || '',
                })) : [] : [],
                MataKuliahMahasiswa: response ? response.MataKuliahMahasiswa.map(mkm => ({
                    MataKuliahMahasiswaId: mkm.MataKuliahMahasiswaId,
                    Rpl: mkm.Rpl || false,
                    Keterangan: mkm.Keterangan || '',
                    StatusMataKuliahMahasiswa: mkm.StatusMataKuliahMahasiswa || '',
                    MataKuliah: {
                        Kode: mkm.MataKuliah.Kode,
                        Nama: mkm.MataKuliah.Nama,
                        Sks: mkm.MataKuliah.Sks,
                        Semester: mkm.MataKuliah.Semester,
                        Silabus: mkm.MataKuliah.Silabus,
                    },
                    TranskripNilai: {
                        TranskripNilaiId: mkm.transkripNilaiRelations.length > 0 ? mkm.transkripNilaiRelations[0].TranskripNilai.TranskripNilaiId : '',
                        Diakui: mkm.transkripNilaiRelations.length > 0 ? mkm.transkripNilaiRelations[0].Diakui : false,
                        Sks: mkm.transkripNilaiRelations.length > 0 ? mkm.transkripNilaiRelations[0].TranskripNilai.Sks : 0,
                        NilaiAsessmen: mkm.transkripNilaiRelations.length > 0 ? mkm.transkripNilaiRelations[0].Nilai : '',
                    },
                    SkorAsessmen: {
                        SkorAssesmenId: mkm.SkorAssesmen.length > 0 ? mkm.SkorAssesmen[0].SkorAssesmenId : '',
                        Diakui: mkm.SkorAssesmen.length > 0 ? mkm.SkorAssesmen[0].Diakui : false,
                        NilaiHuruf: mkm.SkorAssesmen.length > 0 ? mkm.SkorAssesmen[0].NilaiHuruf : null,
                    }
                })) : []
            }

            console.dir(data, { depth: null })
            const stream = await renderToStream(GenerateSkPdf({ data, NomorSk, JenisSk }));

            return c.body(stream as unknown as ReadableStream, 200, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="form-07-${data.Nama}.pdf"`,
            });
        } else {
            return c.json({ error: 'Invalid status' }, 400)
        }
    } else if (type === 'rekapitulasi') {
        // const stream = await renderToStream(GenerateSkPdf({ data: {} as GenerateSkType }));

        // return c.body(stream as unknown as ReadableStream, 200, {
        //     'Content-Type': 'application/pdf',
        //     'Content-Disposition': `attachment; filename="invoice.pdf"`,
        // });

        return c.json(null, 200)
    } else {
        return c.json({ error: 'Invalid type' }, 400)
    }
})

export const GET = handle(app)

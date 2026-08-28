import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { GenerateSkPdf } from '@/components/generate-pdf/GenerateSkPdf'
import { GenerateFormAsessmen } from '@/components/generate-pdf/GenerateFormAsessmen'
import { GenerateBeritaAcara } from '@/components/generate-pdf/GenerateBeritaAcara'
import { prisma } from '@/lib/prisma'
import { GenerateBeritaAcaraType, GenerateFormAsessmenType, GenerateRekapitulasiType, GenerateSkType } from '@/types/GeneratePdfTypes'
import { Jenjang } from '@/generated/prisma'
import { isGenerateBeritaAcara, isGenerateEvaluasiMandiri, isGenerateRekapitulasi, isGenerateSk } from '@/config/checkGenerateSkStats'
import { GenerateRekapitulasiPdf } from '@/components/generate-pdf/GenerateRekapitulasiPdf'
import { renderPdfToStream } from '@/lib/pdf-renderer'
import { bacaBerkas, berkasAda } from '@/lib/storage'

/**
 * Membaca berkas tanda tangan dari /storage lalu mengubahnya menjadi data URI
 * agar dapat digambar @react-pdf/renderer. Mengembalikan null bila belum ada.
 */
async function tandaTanganDataUri(pathFile: string | null): Promise<string | null> {
    if (!pathFile || !(await berkasAda(pathFile))) return null
    const isi = await bacaBerkas(pathFile)
    return 'data:image/png;base64,' + Buffer.from(isi).toString('base64')
}
import {
    cloneDefaultFormAssessmentTemplate,
    FORM_ASSESSMENT_TEMPLATE_TYPE,
    normalizeFormAssessmentTemplate,
} from '@/lib/form-assessment-template'
import {
    cloneDefaultRekapitulasiTemplate,
    normalizeRekapitulasiTemplate,
    REKAPITULASI_TEMPLATE_TYPE,
} from '@/lib/rekapitulasi-template'
import {
    BERITA_ACARA_TEMPLATE_TYPE,
    cloneDefaultBeritaAcaraTemplate,
    normalizeBeritaAcaraTemplate,
} from '@/lib/berita-acara-template'
import {
    cloneDefaultSkHasilTemplate,
    LEGACY_SK_HASIL_TEMPLATE_TYPE,
    normalizeSkHasilTemplate,
    resolveSkHasilTemplateVariant,
    SK_HASIL_TEMPLATE_TYPES,
} from '@/lib/sk-hasil-template'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

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

            const templateVariant = resolveSkHasilTemplateVariant(JenisSk)
            const savedTemplate = await prisma.documentTemplate.findUnique({
                where: { Type: SK_HASIL_TEMPLATE_TYPES[templateVariant] },
                select: { Content: true },
            })
            const legacyTemplate =
                !savedTemplate && templateVariant === 'perolehan'
                    ? await prisma.documentTemplate.findUnique({
                          where: { Type: LEGACY_SK_HASIL_TEMPLATE_TYPE },
                          select: { Content: true },
                      })
                    : null
            const portraitTemplate =
                normalizeSkHasilTemplate(
                    (savedTemplate ?? legacyTemplate)?.Content
                ) ?? cloneDefaultSkHasilTemplate(templateVariant)
            const stream = await renderPdfToStream(
                GenerateSkPdf({
                    data,
                    NomorSk,
                    JenisSk,
                    portraitTemplate,
                })
            );

            return c.body(stream as unknown as ReadableStream, 200, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="form-07-${data.Nama}.pdf"`,
            });
        } else {
            return c.json({ error: 'Invalid status' }, 400)
        }
    } else if (type === 'form_asessmen') {
        const response = await prisma.pendaftaran.findFirst({
            where: {
                PendaftaranId
            },
            select: {
                PendaftaranId: true,
                KodePendaftar: true,
                Periode: true,
                TandaTanganPath: true,
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
                AssesorMahasiswa: {
                    select: {
                        Urutan: true,
                        TandaTanganPath: true,
                        Asesor: {
                            select: {
                                AsesorId: true,
                                User: { select: { Nama: true } }
                            }
                        }
                    }
                },
                Mahasiswa: {
                    select: {
                        User: {
                            select: {
                                Nama: true,
                                TempatLahir: true,
                                TanggalLahir: true,
                                NomorHp: true,
                                Email: true,
                                Alamat: {
                                    select: { Alamat: true, KodePos: true }
                                }
                            }
                        }
                    }
                },
                DaftarUlang: {
                    select: {
                        ProgramStudi: {
                            select: {
                                ProgramStudiId: true,
                                Nama: true,
                                University: {
                                    select: {
                                        UniversityId: true,
                                        Nama: true,
                                        Alamat: { select: { Alamat: true, KodePos: true } },
                                        UniversitySosialMedia: {
                                            select: {
                                                UniversitySosialMediaId: true,
                                                Nama: true,
                                                Username: true,
                                                Icon: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                MataKuliahMahasiswa: {
                    where: { Rpl: true },
                    select: {
                        MataKuliahMahasiswaId: true,
                        Keterangan: true,
                        MataKuliah: {
                            select: {
                                Kode: true,
                                Nama: true,
                                Silabus: true,
                                CapaianPembelajaran: {
                                    where: { Active: true, DeletedAt: null },
                                    orderBy: { Urutan: 'asc' },
                                    select: {
                                        CapaianPembelajaranId: true,
                                        Nama: true,
                                        Urutan: true
                                    }
                                }
                            }
                        },
                        SkorAssesmen: {
                            select: { Diakui: true, NilaiHuruf: true }
                        },
                        transkripNilaiRelations: {
                            select: {
                                Nilai: true,
                                Diakui: true
                            }
                        },
                        EvaluasiDiri: {
                            select: {
                                CapaianPembelajaranId: true,
                                ProfiensiPengetahuan: true,
                                TanggalPengesahan: true,
                                HasilAssesmen: {
                                    select: {
                                        Valid: true,
                                        Autentik: true,
                                        Terkini: true,
                                        Memadai: true,
                                        Nilai: true,
                                        Assesmen: true
                                    }
                                },
                                BuktiFormEvaluasiDiri: {
                                    select: {
                                        BuktiForm: {
                                            select: {
                                                NamaDokumen: true,
                                                JenisDokumen: {
                                                    select: { NomorDokumen: true, Jenis: true }
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
        })

        const transkripNilaiBukti = await prisma.jenisDokumen.findFirst({
            where: { Jenis: 'Ijazah dan Transkrip Nilai' }, select: {
                NomorDokumen: true,
                Jenis: true,
                BuktiForm: {
                    where: {
                        PendaftaranId: PendaftaranId
                    },
                    select: {
                        BuktiFormId: true,
                        NamaDokumen: true,
                    }
                }
            }
        })

        if (!response || !transkripNilaiBukti) {
            return c.json({ error: 'Data not found' }, 404)
        }

        const check = response.StatusMahasiswaAssesmentHistory.find(x => x.Aktif);
        const currentStatus = check?.StatusMahasiswaAssesment.NamaStatus ?? ''

        if (!isGenerateEvaluasiMandiri(currentStatus)) {
            return c.json({
                error: 'Invalid status',
                message: 'Status pendaftaran belum dapat generate formulir evaluasi diri',
                currentStatus: currentStatus || '-'
            }, 400)
        }

        const programStudi = response.DaftarUlang[0]?.ProgramStudi
        const universitas = programStudi?.University
        const user = response.Mahasiswa.User

        // Tanda tangan mahasiswa dibaca dari /storage lalu disematkan sebagai
        // data URI supaya @react-pdf/renderer dapat menggambarnya.
        const tandaTangan = await tandaTanganDataUri(response.TandaTanganPath)

        const data: GenerateFormAsessmenType = {
            PendaftaranId: response.PendaftaranId,
            TandaTanganMahasiswa: tandaTangan,
            KodePendaftar: response.KodePendaftar || '',
            Periode: response.Periode || '',
            Nama: user.Nama || '',
            TempatLahir: user.TempatLahir || '',
            TanggalLahir: user.TanggalLahir ?? null,
            Alamat: user.Alamat?.Alamat || '',
            NomorHp: user.NomorHp || '-',
            Email: user.Email || '',
            ProgramStudi: {
                ProgramStudiId: programStudi?.ProgramStudiId || '',
                Nama: programStudi?.Nama || '',
            },
            Universitas: {
                UniversityId: universitas?.UniversityId || '',
                Logo: '',
                Alamat: universitas?.Alamat?.Alamat || '',
                KodePos: universitas?.Alamat?.KodePos || '',
                Nama: universitas?.Nama || '',
                UniversitySocialMedia: universitas?.UniversitySosialMedia.map(sm => ({
                    UniversitySocialMediaId: sm.UniversitySosialMediaId || '',
                    Nama: sm.Nama || '',
                    Username: sm.Username || '',
                    Icon: sm.Icon || ''
                })) || [],
            },
            Asesor: await Promise.all(
                response.AssesorMahasiswa.map(async a => ({
                    AsesorId: a.Asesor.AsesorId,
                    Nama: a.Asesor.User.Nama || '',
                    Urutan: a.Urutan,
                    TandaTangan: await tandaTanganDataUri(a.TandaTanganPath),
                }))
            ),
            MataKuliah: response.MataKuliahMahasiswa.map(mkm => {
                const skor = mkm.SkorAssesmen[0]
                const diakui = mkm.Keterangan === 'Transfer_SKS' ? mkm.transkripNilaiRelations.length == 0 ? false : mkm.transkripNilaiRelations[0].Diakui : skor?.Diakui ?? false
                const nilaiHuruf = mkm.Keterangan === 'Transfer_SKS' ? mkm.transkripNilaiRelations.length == 0 ? '' : mkm.transkripNilaiRelations[0].Nilai : skor?.NilaiHuruf ?? ''
                // Index evaluasi diri per capaian untuk join cepat.
                const evaluasiByCapaian = new Map(
                    mkm.EvaluasiDiri.map(ed => [ed.CapaianPembelajaranId, ed])
                )
                const tanggalPengesahan = mkm.EvaluasiDiri
                    .map(ed => ed.TanggalPengesahan)
                    .filter((t): t is Date => !!t)
                    .sort((a, b) => b.getTime() - a.getTime())[0] ?? null

                return {
                    MataKuliahMahasiswaId: mkm.MataKuliahMahasiswaId,
                    Kode: mkm.MataKuliah.Kode || '',
                    Nama: mkm.MataKuliah.Nama || '',
                    Deskripsi: mkm.MataKuliah.Silabus || '',
                    Diakui: diakui,
                    NilaiHuruf: nilaiHuruf,
                    SumberPengakuan: mkm.Keterangan === 'Transfer_SKS' ? 'transkrip' : 'porto',
                    TanggalPengesahan: tanggalPengesahan,
                    CapaianPembelajaran: mkm.MataKuliah.CapaianPembelajaran.map(cp => {
                        const ed = evaluasiByCapaian.get(cp.CapaianPembelajaranId)
                        const hasil = ed?.HasilAssesmen[0]
                        const bukti = (ed?.BuktiFormEvaluasiDiri ?? []).map(b => ({
                            NomorDokumen: b.BuktiForm.JenisDokumen.NomorDokumen ?? 0,
                            Jenis: b.BuktiForm.JenisDokumen.Jenis || '',
                            NamaDokumen: b.BuktiForm.NamaDokumen || '',
                        }))
                        return {
                            CapaianPembelajaranId: cp.CapaianPembelajaranId,
                            Nama: cp.Nama || '',
                            Urutan: cp.Urutan,
                            Profiensi: ed?.ProfiensiPengetahuan ?? null,
                            Dinilai: !!hasil,
                            Valid: hasil?.Valid ?? false,
                            Autentik: hasil?.Autentik ?? false,
                            Terkini: hasil?.Terkini ?? false,
                            Memadai: hasil?.Memadai ?? false,
                            Nilai: hasil ? hasil.Nilai : null,
                            AsesmenLanjut: hasil?.Assesmen ?? '',
                            Bukti: mkm.Keterangan === 'Transfer_SKS' ? [
                                {
                                    NomorDokumen: transkripNilaiBukti.NomorDokumen,
                                    Jenis: transkripNilaiBukti.Jenis ?? '',
                                    NamaDokumen: transkripNilaiBukti?.BuktiForm[0].NamaDokumen ?? '',
                                }
                            ] : bukti,
                        }
                    })
                }
            })
        }

        try {
            const savedTemplate = await prisma.documentTemplate.findUnique({
                where: { Type: FORM_ASSESSMENT_TEMPLATE_TYPE },
                select: { Content: true },
            })
            const portraitTemplate =
                normalizeFormAssessmentTemplate(savedTemplate?.Content) ??
                cloneDefaultFormAssessmentTemplate()
            const stream = await renderPdfToStream(
                GenerateFormAsessmen({ data, portraitTemplate })
            );

            return c.body(stream as unknown as ReadableStream, 200, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="form-03-${data.Nama}.pdf"`,
            });
        } catch (error) {
            console.error('[generate-pdf][form_asessmen]', error)
            return c.json({
                error: 'Failed to generate formulir evaluasi diri PDF',
                message: error instanceof Error ? error.message : 'Unknown render error'
            }, 500)
        }
    } else if (type === 'berita_acara') {
        const response = await prisma.pendaftaran.findFirst({
            where: { PendaftaranId },
            select: {
                PendaftaranId: true,
                StatusMahasiswaAssesmentHistory: {
                    select: {
                        Aktif: true,
                        StatusMahasiswaAssesment: { select: { NamaStatus: true } }
                    }
                },
                AssesorMahasiswa: {
                    select: {
                        Urutan: true,
                        TandaTanganPath: true,
                        Asesor: { select: { User: { select: { Nama: true } } } }
                    }
                },
                Mahasiswa: { select: { User: { select: { Nama: true } } } },
                DaftarUlang: {
                    select: {
                        ProgramStudi: {
                            select: {
                                ProgramStudiId: true,
                                Nama: true,
                                MataKuliah: { select: { Sks: true } },
                                University: {
                                    select: {
                                        UniversityId: true,
                                        Nama: true,
                                        Alamat: { select: { Alamat: true, KodePos: true } },
                                        UniversityJabatan: {
                                            select: {
                                                Nama: true,
                                                UniversityJabatanOrang: { select: { Nama: true } }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                MataKuliahMahasiswa: {
                    where: { Rpl: true },
                    select: {
                        Keterangan: true,
                        MataKuliah: { select: { Sks: true } },
                        SkorAssesmen: { select: { Diakui: true } },
                        transkripNilaiRelations: { select: { Diakui: true } }
                    }
                }
            }
        })

        if (!response) {
            return c.json({ error: 'Pendaftaran not found' }, 404)
        }

        const check = response.StatusMahasiswaAssesmentHistory.find(x => x.Aktif)
        const currentStatus = check?.StatusMahasiswaAssesment.NamaStatus ?? ''

        if (!isGenerateBeritaAcara(currentStatus)) {
            return c.json({
                error: 'Invalid status',
                message: 'Status pendaftaran belum dapat generate berita acara',
                currentStatus: currentStatus || '-'
            }, 400)
        }

        const programStudi = response.DaftarUlang[0]?.ProgramStudi
        const universitas = programStudi?.University

        // Total SKS prodi & SKS yang diakui (transfer → transkrip, porto → skor)
        const totalSksProdi = (programStudi?.MataKuliah ?? []).reduce((acc, mk) => acc + (mk.Sks ?? 0), 0)
        const sksDiakui = response.MataKuliahMahasiswa.reduce((acc, mkm) => {
            const diakui = mkm.Keterangan === 'Transfer_SKS'
                ? (mkm.transkripNilaiRelations[0]?.Diakui ?? false)
                : (mkm.SkorAssesmen[0]?.Diakui ?? false)
            return diakui ? acc + (mkm.MataKuliah.Sks ?? 0) : acc
        }, 0)
        const sksHarusDiambil = Math.max(totalSksProdi - sksDiakui, 0)

        // Cari pejabat berdasarkan kata kunci nama jabatan.
        const jabatan = universitas?.UniversityJabatan ?? []
        const findJabatan = (keywords: string[]) => {
            const found = jabatan.find(j =>
                keywords.some(k => (j.Nama ?? '').toLowerCase().includes(k))
            )
            return found?.UniversityJabatanOrang[0]?.Nama ?? ''
        }

        const now = new Date()
        const tahun = now.getFullYear()

        const data: GenerateBeritaAcaraType = {
            PendaftaranId: response.PendaftaranId,
            Nama: response.Mahasiswa.User.Nama || '',
            TanggalRapat: now,
            TahunAkademik: `${tahun}/${tahun + 1}`,
            Semester: 'Ganjil',
            ProgramStudi: {
                ProgramStudiId: programStudi?.ProgramStudiId || '',
                Nama: programStudi?.Nama || '',
            },
            Universitas: {
                UniversityId: universitas?.UniversityId || '',
                Nama: universitas?.Nama || '',
                Alamat: universitas?.Alamat?.Alamat || '',
                KodePos: universitas?.Alamat?.KodePos || '',
            },
            SksDiakui: sksDiakui,
            SksHarusDiambil: sksHarusDiambil,
            Penilai: await Promise.all(
                response.AssesorMahasiswa.map(async a => ({
                    Nama: a.Asesor.User.Nama || '',
                    Urutan: a.Urutan,
                    TandaTangan: await tandaTanganDataUri(a.TandaTanganPath),
                }))
            ),
            Kaprodi: findJabatan(['program studi', 'kaprodi', 'ketua program']),
            KetuaKomite: findJabatan(['komite']),
        }

        try {
            const savedTemplate = await prisma.documentTemplate.findUnique({
                where: { Type: BERITA_ACARA_TEMPLATE_TYPE },
                select: { Content: true },
            })
            const template =
                normalizeBeritaAcaraTemplate(savedTemplate?.Content) ??
                cloneDefaultBeritaAcaraTemplate()
            const stream = await renderPdfToStream(
                GenerateBeritaAcara({ data, template })
            );

            return c.body(stream as unknown as ReadableStream, 200, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="berita-acara-${data.Nama}.pdf"`,
            });
        } catch (error) {
            console.error('[generate-pdf][berita_acara]', error)
            return c.json({
                error: 'Failed to generate berita acara PDF',
                message: error instanceof Error ? error.message : 'Unknown render error'
            }, 500)
        }
    } else if (type === 'rekapitulasi') {
        const response = await prisma.pendaftaran.findFirst({
            where: {
                PendaftaranId
            },
            select: {
                TandaTanganPath: true,
                AssesorMahasiswa: {
                    select: {
                        Urutan: true,
                        Confirmation: true,
                        TandaTanganPath: true,
                        Asesor: {
                            select: {
                                AsesorId: true,
                                User: {
                                    select: {
                                        Nama: true
                                    }
                                }
                            }
                        }
                    }
                },
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
                Mahasiswa: {
                    select: {
                        User: {
                            select: {
                                Nama: true,
                                NomorHp: true,
                                Email: true,
                                Alamat: {
                                    select: {
                                        Alamat: true,
                                        KodePos: true
                                    }
                                }
                            }
                        }
                    }
                },
                InstitusiLama: {
                    select: {
                        InstitusiLamaId: true,
                        Jenjang: true,
                        JenisInstitusi: true,
                        NamaInstitusi: true,
                        Jurusan: true,
                        Nisn: true,
                    }
                },
                PendaftaranId: true,
                KodePendaftar: true,
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
                        transkripNilaiRelations: {
                            select: {
                                Diakui: true,
                                Nilai: true,
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
                                Ai: true
                            },
                        },
                    },
                },
            }
        });

        if (!response) {
            return c.json({ error: 'Pendaftaran not found' }, 404)
        }

        let check = response.StatusMahasiswaAssesmentHistory.find(x => x.Aktif);
        const currentStatus = check?.StatusMahasiswaAssesment.NamaStatus ?? ''

        if (isGenerateRekapitulasi(currentStatus)) {
            const daftarUlang = response.DaftarUlang[0]
            const programStudi = daftarUlang?.ProgramStudi
            const universitas = programStudi?.University
            const institusiLama = response.InstitusiLama[0]
            const user = response.Mahasiswa.User

            const data: GenerateRekapitulasiType = {
                PendaftaranId: response.PendaftaranId,
                Nama: user.Nama || '',
                Alamat: user.Alamat?.Alamat || '',
                KodePos: user.Alamat?.KodePos || '',
                NomorHp: user.NomorHp || '-',
                Email: user.Email || '',
                TandaTanganMahasiswa: await tandaTanganDataUri(
                    response.TandaTanganPath
                ),
                Asesor: await Promise.all(
                    response.AssesorMahasiswa.map(async a => ({
                        AsesorId: a.Asesor.AsesorId,
                        Nama: a.Asesor.User.Nama || '',
                        Urutan: a.Urutan,
                        TandaTangan: await tandaTanganDataUri(a.TandaTanganPath),
                    }))
                ),
                ProgramStudi: {
                    ProgramStudiId: programStudi?.ProgramStudiId || '',
                    Nama: programStudi?.Nama || '',
                },
                Universitas: {
                    UniversityId: universitas?.UniversityId || '',
                    Logo: '',
                    Alamat: universitas?.Alamat?.Alamat || '',
                    KodePos: universitas?.Alamat?.KodePos || '',
                    Nama: universitas?.Nama || '',
                    UniversitySocialMedia: universitas?.UniversitySosialMedia.map(sm => ({
                        UniversitySocialMediaId: sm.UniversitySosialMediaId || '',
                        Nama: sm.Nama || '',
                        Username: sm.Username || '',
                        Icon: sm.Icon || ''
                    })) || [],
                    UniversityJabatan: universitas?.UniversityJabatan.map(item => ({
                        UniversityJabatanId: item.UniversityJabatanId || '',
                        NamaJabatan: item.Nama || '',
                        Nama: item.UniversityJabatanOrang.length > 0 ? item.UniversityJabatanOrang[0].Nama : ''
                    })) || []
                },
                InstitusiLama: {
                    InstitusiLamaId: institusiLama?.InstitusiLamaId || '',
                    Jenjang: institusiLama?.Jenjang || Jenjang.S1,
                    NamaInstitusi: institusiLama?.NamaInstitusi || '',
                    Jurusan: institusiLama?.Jurusan || '',
                    Nisn: institusiLama?.Nisn || '',
                    JenjangKKNIDituju: daftarUlang?.JenjangKkniDituju || ''
                },
                MataKuliah: programStudi?.MataKuliah.map(mk => ({
                    MataKuliahId: mk.MataKuliahId || '',
                    Kode: mk.Kode || '',
                    Nama: mk.Nama || '',
                    Sks: mk.Sks || 0,
                    Semester: mk.Semester || '',
                })) || [],
                MataKuliahMahasiswa: response.MataKuliahMahasiswa.map(mkm => ({
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
                        Nilai: mkm.transkripNilaiRelations.length > 0 ? mkm.transkripNilaiRelations[0].TranskripNilai.Nilai : '',
                        NilaiAsessmen: mkm.transkripNilaiRelations.length > 0 ? mkm.transkripNilaiRelations[0].Nilai : '',
                    },
                    SkorAsessmen: {
                        SkorAssesmenId: mkm.SkorAssesmen.length > 0 ? mkm.SkorAssesmen[0].SkorAssesmenId : '',
                        Portofolio: mkm.SkorAssesmen.length > 0 ? mkm.SkorAssesmen[0].Portofolio : 0,
                        Tulis: mkm.SkorAssesmen.length > 0 ? mkm.SkorAssesmen[0].Tulis : 0,
                        Wawancara: mkm.SkorAssesmen.length > 0 ? mkm.SkorAssesmen[0].Wawancara : 0,
                        Demo: mkm.SkorAssesmen.length > 0 ? mkm.SkorAssesmen[0].Demo : 0,
                        SkorRataRata: mkm.SkorAssesmen.length > 0 ? mkm.SkorAssesmen[0].SkorRataRata : 0,
                        Diakui: mkm.SkorAssesmen.length > 0 ? mkm.SkorAssesmen[0].Diakui : false,
                        NilaiHuruf: mkm.SkorAssesmen.length > 0 ? mkm.SkorAssesmen[0].NilaiHuruf ?? '' : '',
                    }
                })),
            }

            try {
                const savedTemplate = await prisma.documentTemplate.findUnique({
                    where: { Type: REKAPITULASI_TEMPLATE_TYPE },
                    select: { Content: true },
                })
                const template =
                    normalizeRekapitulasiTemplate(savedTemplate?.Content) ??
                    cloneDefaultRekapitulasiTemplate()
                const stream = await renderPdfToStream(
                    GenerateRekapitulasiPdf({ data, template })
                );

                return c.body(stream as unknown as ReadableStream, 200, {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': `attachment; filename="form-05-${data.Nama}.pdf"`,
                });
            } catch (error) {
                console.error('[generate-pdf][rekapitulasi]', error)
                return c.json({
                    error: 'Failed to generate rekapitulasi PDF',
                    message: error instanceof Error ? error.message : 'Unknown render error'
                }, 500)
            }
        } else {
            return c.json({
                error: 'Invalid status',
                message: 'Status pendaftaran belum dapat generate rekapitulasi PDF',
                currentStatus: currentStatus || '-'
            }, 400)
        }
    } else {
        return c.json({ error: 'Invalid type' }, 400)
    }
})

export const GET = handle(app)

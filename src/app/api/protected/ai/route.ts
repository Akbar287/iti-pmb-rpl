import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { streamText, CoreMessage, gateway } from "ai";
import { handle } from 'hono/vercel'
import { prisma } from "@/lib/prisma"
import { ProfiensiPengetahuan } from '@/generated/prisma';
import { AiAsessmenCp, AiAsessmenRekapitulasi } from '@/config/ai';

const app = new Hono().basePath('/api/protected/ai')

// Asessmen Rekapitulasi
export type JustifikasiMataKuliahType = {
    Portofolio: number
    Tulis: number
    Wawancara: number
    Demo: number
    SkorRataRata: number
    Diakui: boolean
    NilaiHuruf: string | null
    SkorAssesmenAi: {
        Portofolio: string
        Tulis: string
        Wawancara: string
        Demo: string
        SkorRataRata: string
        Diakui: string
        NilaiHuruf: string
    }[]
    MataKuliahMahasiswa: {
        MataKuliah: {
            Nama: string
        } | null

        EvaluasiDiri: {
            CapaianPembelajaran: {
                Nama: string
            }
            ProfiensiPengetahuan: string
            HasilAssesmen: {
                Valid: boolean
                Autentik: boolean
                Terkini: boolean
                Memadai: boolean
                Assesmen: string | null
                Nilai: number

                HasilAssesmenAi: {
                    Valid: string
                    Autentik: string
                    Terkini: string
                    Memadai: string
                    Assesmen: string
                    Nilai: string
                }[]
            }[]
        }[]
    }
}

// Asessmen CP
type QwenDocResult = {
    summary: string
    numbers?: any[]
    transcript_details?: any
}

type justifikasiType = {
    EvaluasiDiri: {
        BuktiFormEvaluasiDiri: {
            BuktiForm: {
                BuktiFormPages: {
                    Result: string | null;
                }[];
                NamaDokumen: string;
            };
        }[];
        CapaianPembelajaran: {
            Nama: string;
            MataKuliah: {
                Nama: string;
                Kode: string;
                Sks: number;
            };
        };
        ProfiensiPengetahuan: ProfiensiPengetahuan;
    };
    HasilAssesmenAi: {
        Valid: string;
        Autentik: string;
        Terkini: string;
        Memadai: string;
        Assesmen: string;
        Nilai: string;
    }[];
    Valid: boolean;
    Autentik: boolean;
    Terkini: boolean;
    Memadai: boolean;
    Assesmen: string | null;
    Nilai: number;
} | null
// End Assessmen CP

export const runtime = 'nodejs'

app.use('*', withApiAuth)

// AI Asessmen CP -> Asessor
app.post('/', async (c) => {
    const HasilAsessmentId = c.req.query('_h')
    const SkorAsessmentId = c.req.query('_s')
    if (HasilAsessmentId) {
        const body = await c.req.json()
        const messages = (body.messages ?? []) as { role: string; content: string }[]

        const justifikasi = await prisma.hasilAssesmen.findFirst({
            where: {
                HasilAssesmenId: HasilAsessmentId
            },
            select: {
                Valid: true,
                Autentik: true,
                Terkini: true,
                Memadai: true,
                Assesmen: true,
                Nilai: true,
                HasilAssesmenAi: {
                    select: {
                        Valid: true,
                        Autentik: true,
                        Terkini: true,
                        Memadai: true,
                        Assesmen: true,
                        Nilai: true,
                    }
                },
                EvaluasiDiri: {
                    select: {
                        BuktiFormEvaluasiDiri: {
                            select: {
                                BuktiForm: {
                                    select: {
                                        NamaDokumen: true,
                                        BuktiFormPages: {
                                            select: {
                                                Result: true
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        ProfiensiPengetahuan: true,
                        CapaianPembelajaran: {
                            select: {
                                MataKuliah: {
                                    select: {
                                        Kode: true,
                                        Nama: true,
                                        Sks: true,
                                    }
                                },
                                Nama: true,
                            }
                        }
                    }
                }
            }
        })

        if (!justifikasi) return c.json(null)

        const contextText = buildAssessmentContext(justifikasi)

        const systemMessage: CoreMessage = {
            role: 'system',
            content: `
    Kamu adalah AI asisten asesmen RPL di Sistem Informasi RPL Terpadu ITI.
    
    Tugasmu:
    - Menjawab pertanyaan asesor berdasarkan data asesmen yang diberikan di bawah.
    - Jangan berhalusinasi nilai baru. Kalau tidak ada di data, katakan tidak tahu.
    - Gunakan bahasa Indonesia yang jelas dan profesional.
    - Jika asesor bertanya "kenapa valid/autentik/..." jelaskan dengan merujuk ke bukti dan ringkasan.
    
    Berikut data asesmen dan bukti dukung:
    
    ${contextText}
    `.trim(),
        }

        const aiMessages: CoreMessage[] = [
            systemMessage,
            ...messages.map((m) => ({
                role: m.role as 'user' | 'assistant' | 'system',
                content: m.content,
            })),
        ]

        const result = await streamText({
            model: gateway(AiAsessmenCp ? AiAsessmenCp :'groq/gpt-oss-20b'),
            temperature: 0,
            topK: 20,
            topP: 0.8,
            maxOutputTokens: 300,
            presencePenalty: 0,
            frequencyPenalty: 0,
            messages: aiMessages,
        })

        const encoder = new TextEncoder()

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of result.textStream) {
                        controller.enqueue(encoder.encode(chunk))
                    }
                    controller.close()
                } catch (err) {
                    console.error('stream error', err)
                    controller.error(err)
                }
            },
        })

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                // optional jika di-host sendiri:
                // 'Transfer-Encoding': 'chunked',
            },
        })

    } else if (SkorAsessmentId) {
        const body = await c.req.json()
        const messages = (body.messages ?? []) as { role: string; content: string }[]

        const justifikasi = await prisma.skorAssesmen.findFirst({
            where: {
                SkorAssesmenId: SkorAsessmentId
            },
            select: {
                Portofolio: true,
                Tulis: true,
                Wawancara: true,
                Demo: true,
                SkorRataRata: true,
                Diakui: true,
                NilaiHuruf: true,
                SkorAssesmenAi: {
                    select: {
                        Portofolio: true,
                        Tulis: true,
                        Wawancara: true,
                        Demo: true,
                        SkorRataRata: true,
                        Diakui: true,
                        NilaiHuruf: true,
                    }
                },
                MataKuliahMahasiswa: {
                    select: {
                        MataKuliah: {
                            select: {
                                Nama: true
                            }
                        },
                        EvaluasiDiri: {
                            select: {
                                CapaianPembelajaran: {
                                    select: {
                                        Nama: true
                                    }
                                },
                                ProfiensiPengetahuan: true,
                                HasilAssesmen: {
                                    select: {
                                        Valid: true,
                                        Autentik: true,
                                        Terkini: true,
                                        Memadai: true,
                                        Assesmen: true,
                                        Nilai: true,
                                        HasilAssesmenAi: {
                                            select: {
                                                Valid: true,
                                                Autentik: true,
                                                Terkini: true,
                                                Memadai: true,
                                                Assesmen: true,
                                                Nilai: true,
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
        if (!justifikasi) return c.json(null)

        const contextText = buildMataKuliahSkorContext(justifikasi)

        const systemMessage: CoreMessage = {
            role: 'system',
            content: `
Kamu adalah AI asisten asesmen RPL untuk penilaian per mata kuliah.

Tugasmu:
- Menjawab pertanyaan asesor berdasarkan data skor asesmen mata kuliah dan rekap Capaian Pembelajaran yang diberikan.
- Tidak mengubah angka atau status yang sudah tersimpan, kecuali diminta memberi rekomendasi.
- Menggunakan bahasa Indonesia yang jelas, sopan, dan profesional.

Berikut data yang harus kamu gunakan:

${contextText}
`.trim(),
        }

        const aiMessages: CoreMessage[] = [
            systemMessage,
            ...messages.map((m) => ({
                role: m.role as 'user' | 'assistant' | 'system',
                content: m.content,
            })),
        ]

        const result = await streamText({
            model: gateway(AiAsessmenRekapitulasi ? AiAsessmenRekapitulasi : 'groq/gpt-oss-20b'),
            temperature: 0,
            topP: 0.9,
            messages: aiMessages,
        })

        const encoder = new TextEncoder()

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of result.textStream) {
                        controller.enqueue(encoder.encode(chunk))
                    }
                    controller.close()
                } catch (err) {
                    console.error('stream error', err)
                    controller.error(err)
                }
            },
        })

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
            },
        })
    } else {
        const body = await c.req.json()
        const messages = (body.messages ?? []) as { role: string; content: string }[]
        const aiMessages: CoreMessage[] = [
            ...messages.map((m) => ({
                role: m.role as 'user' | 'assistant' | 'system',
                content: m.content,
            })),
        ]

        const result = await streamText({
            model: gateway('groq/gpt-oss-20b'),
            temperature: 0,
            topK: 20,
            topP: 0.8,
            maxOutputTokens: 300,
            presencePenalty: 0,
            frequencyPenalty: 0,
            messages: aiMessages,
        })

        const encoder = new TextEncoder()

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of result.textStream) {
                        controller.enqueue(encoder.encode(chunk))
                    }
                    controller.close()
                } catch (err) {
                    console.error('stream error', err)
                    controller.error(err)
                }
            },
        })

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
            },
        })
    }

})

export const POST = handle(app)

// AI Asessmen CP -> Asessor
function buildBuktiSection(
    buktiForms: {
        BuktiForm: {
            NamaDokumen: string
            BuktiFormPages: { Result: string | null }[]
        }
    }[],
): string {
    if (!buktiForms || buktiForms.length === 0) {
        return '- Tidak ada bukti dukung yang terkait.'
    }

    return buktiForms
        .map((bf, idx) => {
            const nama = bf.BuktiForm.NamaDokumen
            const firstResult = bf.BuktiForm.BuktiFormPages[0]?.Result
            let parsed: QwenDocResult | null = null
            if (firstResult) {
                try {
                    parsed = JSON.parse(firstResult)
                } catch {
                    // kalau JSON rusak, abaikan saja
                }
            }
            const summary = parsed?.summary ?? '(ringkasan tidak tersedia / parsing gagal)'

            return `Bukti ${idx + 1}: ${nama}; Ringkasan AI Qwen: ${summary}`
        })
        .join('\n\n')
}
function buildAssessmentContext(j: NonNullable<justifikasiType>): string {
    const evalDiri = j.EvaluasiDiri
    const capaian = evalDiri.CapaianPembelajaran
    const mk = capaian.MataKuliah
    const ai = j.HasilAssesmenAi?.[0]

    const buktiText = buildBuktiSection(evalDiri.BuktiFormEvaluasiDiri)

    return `
KONTEKS DATA ASESMEN (JANGAN DIUBAH ANGKANYA):

1. Info Mata Kuliah & Capaian Pembelajaran
- Mata Kuliah : ${mk.Kode} - ${mk.Nama} (SKS: ${mk.Sks})
- Capaian Pembelajaran (CPL) : ${capaian.Nama}
- Profisiensi yang dipilih mahasiswa : ${evalDiri.ProfiensiPengetahuan}

2. Keputusan Asesmen Utama (tabel HasilAssesmen)
- Valid     : ${j.Valid}
- Autentik  : ${j.Autentik}
- Terkini   : ${j.Terkini}
- Memadai   : ${j.Memadai}
- Nilai Akhir (0-100) : ${j.Nilai}
- Ringkasan Asesmen   : ${j.Assesmen ?? '-'}

3. Justifikasi Detil Asesmen (tabel HasilAssesmenAi)
${ai
            ? `- Valid    : ${ai.Valid}
- Autentik : ${ai.Autentik}
- Terkini  : ${ai.Terkini}
- Memadai  : ${ai.Memadai}
- Asesmen  : ${ai.Assesmen}
- Nilai    : ${ai.Nilai}`
            : '- (belum ada justifikasi AI yang tersimpan)'}

4. Ringkasan Bukti Dukung (tabel BuktiForm + BuktiFormPages.Result/Qwen)
${buktiText}

PETUNJUK UNTUK MODEL:
- Anggap seluruh data di atas sebagai "ground truth" sistem.
- Jangan mengubah nilai angka (Valid/Autentik/Terkini/Memadai/Nilai) kecuali asesor secara eksplisit meminta usulan revisi.
- Jika menjelaskan, selalu rujuk pada data di atas (misalnya: sebut nama dokumen, ringkasan Qwen, alasan valid/autentik, dsb.).
- Jawaban kamu harus menjelaskan untuk asesor manusia, bukan mengeluarkan JSON baru.
`.trim()
}
// End AI Asessmen CP -> Asessor

// AI Asessmen Rekapitulasi -> Asessor
function buildCplSection(
    evaluasiList: {
        CapaianPembelajaran: { Nama: string }
        ProfiensiPengetahuan: string
        HasilAssesmen: {
            Valid: boolean
            Autentik: boolean
            Terkini: boolean
            Memadai: boolean
            Assesmen: string | null
            Nilai: number
            HasilAssesmenAi: {
                Valid: string
                Autentik: string
                Terkini: string
                Memadai: string
                Assesmen: string
                Nilai: string
            }[]
        }[]
    }[],
): string {
    if (!evaluasiList || evaluasiList.length === 0) {
        return '- Belum ada data asesmen per capaian pembelajaran.'
    }

    return evaluasiList
        .map((ev, idx) => {
            const cplNama = ev.CapaianPembelajaran.Nama
            const prof = ev.ProfiensiPengetahuan

            const hasil = ev.HasilAssesmen[0] // relasi 1:1 tapi di Prisma array
            if (!hasil) {
                return `${idx + 1}. CPL: ${cplNama}
   - Profisiensi Mahasiswa : ${prof}
   - Belum ada keputusan asesmen.`
            }

            const ai = hasil.HasilAssesmenAi?.[0]

            return `${idx + 1}. CPL: ${cplNama}
   - Profisiensi Mahasiswa : ${prof}
   - Keputusan Asesmen:
     • Valid     : ${hasil.Valid}
     • Autentik  : ${hasil.Autentik}
     • Terkini   : ${hasil.Terkini}
     • Memadai   : ${hasil.Memadai}
     • Nilai CPL : ${hasil.Nilai}
     • Ringkasan : ${hasil.Assesmen ?? '-'}
   - Justifikasi AI (jika ada):
     • Valid     : ${ai?.Valid ?? '-'}
     • Autentik  : ${ai?.Autentik ?? '-'}
     • Terkini   : ${ai?.Terkini ?? '-'}
     • Memadai   : ${ai?.Memadai ?? '-'}
     • Asesmen   : ${ai?.Assesmen ?? '-'}
     • Nilai     : ${ai?.Nilai ?? '-'}`
        })
        .join('\n\n')
}
function buildMataKuliahSkorContext(
    j: NonNullable<JustifikasiMataKuliahType>,
): string {
    const mkm = j.MataKuliahMahasiswa
    const mkName = mkm?.MataKuliah?.Nama ?? '(Nama mata kuliah tidak tersedia)'
    const ai = j.SkorAssesmenAi?.[0]

    const cplSection = buildCplSection(mkm.EvaluasiDiri)

    return `
KONTEKS DATA SKOR ASESMEN PER MATA KULIAH (JANGAN DIUBAH ANGKANYA):

1. Informasi Mata Kuliah
- Nama Mata Kuliah : ${mkName}

2. Rekap Skor Asesmen (tabel SkorAssesmen)
- Portofolio      : ${j.Portofolio}
- Tes Tulis       : ${j.Tulis}
- Wawancara       : ${j.Wawancara}
- Demonstrasi     : ${j.Demo}
- Skor Rata-rata  : ${j.SkorRataRata}
- Diakui          : ${j.Diakui}
- Nilai Huruf     : ${j.NilaiHuruf ?? '-'}

3. Justifikasi Skor (tabel SkorAssesmenAi)
${ai
            ? `- Portofolio      : ${ai.Portofolio}
- Tes Tulis       : ${ai.Tulis}
- Wawancara       : ${ai.Wawancara}
- Demonstrasi     : ${ai.Demo}
- Skor Rata-rata  : ${ai.SkorRataRata}
- Diakui          : ${ai.Diakui}
- Nilai Huruf     : ${ai.NilaiHuruf}`
            : '- (Belum ada justifikasi AI yang tersimpan untuk skor asesmen ini)'
        }

4. Rekap Per Capaian Pembelajaran (CPL) di Mata Kuliah ini
${cplSection}

PETUNJUK UNTUK MODEL:
- Gunakan data di atas sebagai dasar menjawab pertanyaan asesor tentang asesmen MATA KULIAH ini.
- Jangan mengubah angka skor (Portofolio/Tulis/Wawancara/Demo/SkorRataRata) dan keputusan Diakui/NilaiHuruf, kecuali asesor secara eksplisit meminta rekomendasi revisi.
- Jika asesor bertanya tentang Capaian Pembelajaran tertentu, jelaskan berdasarkan bagian "Rekap Per Capaian Pembelajaran".
- Jika asesor meminta penjelasan kenapa Nilai Huruf/Diakui seperti itu, rujuk baik ke skor total maupun rekap Capaian Pembelajaran dan justifikasi AI yang sudah ada.
- Jawab dengan bahasa Indonesia yang jelas dan profesional, bukan dalam format JSON, kecuali diminta sebaliknya.
`.trim()
}
// End AI Asessmen Rekapitulasi -> Asessor
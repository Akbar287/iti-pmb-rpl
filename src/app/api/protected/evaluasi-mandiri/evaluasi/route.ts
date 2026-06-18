import { EvaluasiDiri, ProfiensiPengetahuan } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { AssessmentResult } from '@/types/AiAsessmen'
import {
    MataKuliahMahasiswaCapaianPembelajaranTypes,
    RequestSetEvaluasiDiri,
    ResponseSetEvaluasiDiri,
} from '@/types/DaftarUlangProdi'
import { QwenDocResult } from '@/types/qwen'
import { streamText, gateway } from 'ai'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { normalizeJson } from "@/lib/NormalizedAiResult"
import { AiJustifikasiOcr } from '@/config/ai'
import { randomUUID } from 'crypto'
import {
    createAiTokenUsage,
} from '@/lib/ai-token-usage'

const app = new Hono<{ Variables: { token: { id?: string } } }>().basePath('/api/protected/evaluasi-mandiri/evaluasi')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const PendaftaranId = c.req.query('PendaftaranId')
    const EvaluasiDiriId = c.req.query('EvaluasiDiriId')

    if (PendaftaranId !== null && EvaluasiDiriId === null) {
        const data = await prisma.pendaftaran.findFirst({
            where: {
                PendaftaranId: PendaftaranId,
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
                                                                BuktiFormId:
                                                                    true,
                                                                PendaftaranId:
                                                                    true,
                                                                JenisDokumenId:
                                                                    true,
                                                                NamaFile: true,
                                                                NamaDokumen:
                                                                    true,
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

        const response: MataKuliahMahasiswaCapaianPembelajaranTypes = (
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
                                        cp?.EvaluasiDiri[0]
                                            .TanggalPengesahan,
                                    CreatedAt:
                                        cp?.EvaluasiDiri[0].CreatedAt,
                                    UpdatedAt:
                                        cp?.EvaluasiDiri[0].UpdatedAt,
                                    BuktiForm:
                                        cp?.EvaluasiDiri[0]
                                            .BuktiFormEvaluasiDiri.length ==
                                            0
                                            ? []
                                            : cp?.EvaluasiDiri[0].BuktiFormEvaluasiDiri.map(
                                                (bf) => ({
                                                    Jenis: bf.BuktiForm
                                                        .JenisDokumen
                                                        .Jenis,
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
                                                        bf.BuktiForm
                                                            .NamaFile,
                                                    NamaDokumen:
                                                        bf.BuktiForm
                                                            .NamaDokumen,
                                                })
                                            ),
                                },
                    })),
        }))
        return c.json(response)
    }
    if (PendaftaranId !== null && EvaluasiDiriId === null) {
        const data = await prisma.evaluasiDiri.findFirst({
            where: {
                EvaluasiDiriId: EvaluasiDiriId,
            },
        })

        const response: EvaluasiDiri = {
            EvaluasiDiriId: data?.EvaluasiDiriId ?? '',
            MataKuliahMahasiswaId: data?.MataKuliahMahasiswaId ?? '',
            CapaianPembelajaranId: data?.CapaianPembelajaranId ?? '',
            ProfiensiPengetahuan:
                data?.ProfiensiPengetahuan ?? ProfiensiPengetahuan.TIDAK_PERNAH,
            TanggalPengesahan: data?.TanggalPengesahan ?? null,
            CreatedAt: data?.CreatedAt ?? null,
            UpdatedAt: data?.UpdatedAt ?? null,
        }
        return c.json(response)
    }

    return c.json([])
})

app.post('/', async (c) => {
    const body: RequestSetEvaluasiDiri = await c.req.json()
    const token = c.get('token') as { id?: string } | undefined
    const userId = token?.id ?? null
    const requestId = c.req.header('x-request-id') ?? randomUUID()

    const all = await prisma.capaianPembelajaran.findFirst({
        where: { CapaianPembelajaranId: body.CapaianPembelajaranId },
        select: {
            Nama: true,
            MataKuliah: {
                select: {
                    Nama: true
                }
            },
        }
    })
    if (!all) return c.json({ status: 404, message: 'Moh' })

    const nama = await prisma.pendaftaran.findFirst({ where: { PendaftaranId: body.PendaftaranId }, select: { Mahasiswa: { select: { User: { select: { Nama: true } } } } } })
    if (!nama) return c.json({ status: 404, message: 'Moh' })

    const data = await prisma.$transaction(async (tx) => {
        const evaluasi = await tx.evaluasiDiri.upsert({
            where: {
                MataKuliahMahasiswaId_CapaianPembelajaranId: {
                    MataKuliahMahasiswaId: body.MataKuliahMahasiswaId,
                    CapaianPembelajaranId: body.CapaianPembelajaranId,
                },
            },
            update: {
                ProfiensiPengetahuan: body.ProfiensiPengetahuan,
                UpdatedAt: new Date(),
            },
            create: {
                MataKuliahMahasiswaId: body.MataKuliahMahasiswaId,
                CapaianPembelajaranId: body.CapaianPembelajaranId,
                ProfiensiPengetahuan: body.ProfiensiPengetahuan,
                TanggalPengesahan: null,
                CreatedAt: new Date(),
                UpdatedAt: new Date(),
            },
            select: {
                EvaluasiDiriId: true,
                MataKuliahMahasiswaId: true,
                ProfiensiPengetahuan: true,
                TanggalPengesahan: true,
                CreatedAt: true,
                UpdatedAt: true,
                HasilAssesmen: {
                    select: {
                        HasilAssesmenId: true
                    }
                }
            }
        })

        await tx.buktiFormEvaluasiDiri.deleteMany({
            where: {
                EvaluasiDiriId: evaluasi.EvaluasiDiriId,
            },
        })

        if (body.BuktiForm.length > 0) {
            await tx.buktiFormEvaluasiDiri.createMany({
                data: body.BuktiForm.map((buktiFormId) => ({
                    BuktiFormId: buktiFormId,
                    EvaluasiDiriId: evaluasi.EvaluasiDiriId,
                })),
            })
        }

        return evaluasi
    });

    const buktiForm = await prisma.buktiFormEvaluasiDiri.findMany({
        where: {
            EvaluasiDiriId: data.EvaluasiDiriId,
        },
        select: {
            BuktiForm: {
                select: {
                    JenisDokumen: {
                        select: {
                            NomorDokumen: true,
                            Jenis: true,
                            JenisDokumenId: true,
                        }
                    },
                    BuktiFormPages: {
                        select: {
                            Result: true
                        }
                    },
                    BuktiFormId: true,
                    PendaftaranId: true,
                    NamaFile: true,
                    NamaDokumen: true,
                }
            }
        }
    })

    const response: ResponseSetEvaluasiDiri = {
        EvaluasiDiriId: data.EvaluasiDiriId,
        MataKuliahMahasiswaId: data.MataKuliahMahasiswaId,
        ProfiensiPengetahuan: data.ProfiensiPengetahuan,
        TanggalPengesahan: data.TanggalPengesahan,
        CreatedAt: data.CreatedAt,
        UpdatedAt: data.UpdatedAt,
        BuktiForm: buktiForm?.map(bf => ({
            Jenis: bf.BuktiForm.JenisDokumen.Jenis,
            NomorDokumen: bf.BuktiForm.JenisDokumen.NomorDokumen,
            BuktiFormId: bf.BuktiForm.BuktiFormId,
            PendaftaranId: bf.BuktiForm.PendaftaranId,
            JenisDokumenId: bf.BuktiForm.JenisDokumen.JenisDokumenId,
            NamaFile: bf.BuktiForm.NamaFile,
            NamaDokumen: bf.BuktiForm.NamaDokumen
        }))
    }

    let temp: {
        nama: string;
        summary: string;
        numbers: {
            value: string;
            type: string;
            label: string;
            context: string;
            page_index: number;
            page_hint: string;
            document_hint: string;
            confidence: number;
        }[];
        transcript_details: {
            exists: boolean;
            courses: {
                course_name: string;
                course_code: string;
                semester: string;
                sks: string;
                grade_letter: string;
                grade_numeric: string;
                context: string;
            }[];
            gpa: {
                ip_per_semester: any[];
                ipk_final: string;
            };
        };
    }[] = []
    buktiForm.forEach(x => x.BuktiForm.BuktiFormPages.forEach(y => {
        let r = y.Result
        if (r) {
            let s: QwenDocResult = normalizeJson<QwenDocResult>(r)
            temp.push({
                nama: x.BuktiForm.JenisDokumen.Jenis,
                summary: s.summary,
                numbers: s.numbers,
                transcript_details: {
                    exists: s.transcript_details.exists,
                    courses: s.transcript_details.courses,
                    gpa: s.transcript_details.gpa
                }
            })
        }
    }))

    const prompt = buildAssessmentPrompt({
        nama: nama.Mahasiswa.User.Nama,
        mata_kuliah: all.MataKuliah.Nama,
        cpl: all.Nama,
        profisiensi: body.ProfiensiPengetahuan,
        dokumen: temp,
    })
    const modelSlug = AiJustifikasiOcr ? AiJustifikasiOcr : "gpt-oss:20b"
    const startedAt = Date.now()

    const result = await streamText({
        model: gateway(modelSlug),
        temperature: 0,
        topP: 0.9,
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: prompt,
                    },
                ],
            },
        ],
    });

    let fullText = ""
    try {
        for await (const chunk of result.textStream) {
            fullText += chunk;
        }
    } catch (err) {
        await createAiTokenUsage({
            userId,
            feature: 'AI_JUSTIFIKASI_OCR',
            featureGroup: 'AI_ASESSMEN',
            page: '/evaluasi-mandiri/evaluasi',
            route: '/api/protected/evaluasi-mandiri/evaluasi',
            method: 'POST',
            requestId,
            referenceType: 'EvaluasiDiri',
            referenceId: data.EvaluasiDiriId,
            modelSlug,
            temperature: 0,
            topP: 0.9,
            promptCharCount: prompt.length,
            completionCharCount: fullText.length,
            promptMessageCount: 1,
            completionMessageCount: fullText ? 1 : 0,
            durationMs: Date.now() - startedAt,
            status: 'ERROR',
            errorMessage: err instanceof Error ? err.message : String(err),
            metadata: {
                pendaftaranId: body.PendaftaranId,
                mataKuliahMahasiswaId: body.MataKuliahMahasiswaId,
                capaianPembelajaranId: body.CapaianPembelajaranId,
                jumlahDokumen: temp.length,
            },
        })
        throw err
    }

    let usage = null
    try {
        usage = await result.totalUsage
    } catch (usageError) {
        console.error('AI usage read error', usageError)
    }

    await createAiTokenUsage({
        userId,
        feature: 'AI_JUSTIFIKASI_OCR',
        featureGroup: 'AI_ASESSMEN',
        page: '/evaluasi-mandiri/evaluasi',
        route: '/api/protected/evaluasi-mandiri/evaluasi',
        method: 'POST',
        requestId,
        referenceType: 'EvaluasiDiri',
        referenceId: data.EvaluasiDiriId,
        modelSlug,
        temperature: 0,
        topP: 0.9,
        usage,
        promptCharCount: prompt.length,
        completionCharCount: fullText.length,
        promptMessageCount: 1,
        completionMessageCount: fullText ? 1 : 0,
        durationMs: Date.now() - startedAt,
        metadata: {
            pendaftaranId: body.PendaftaranId,
            mataKuliahMahasiswaId: body.MataKuliahMahasiswaId,
            capaianPembelajaranId: body.CapaianPembelajaranId,
            jumlahDokumen: temp.length,
        },
    })

    const saveAsessmen: AssessmentResult = normalizeJson<AssessmentResult>(fullText);

    await prisma.$transaction(async (tx) => {
        await tx.hasilAssesmen.deleteMany({
            where: {
                EvaluasiDiriId: data.EvaluasiDiriId,
            },
        });

        const ha = await tx.hasilAssesmen.create({
            data: {
                EvaluasiDiriId: data.EvaluasiDiriId,
                Valid: saveAsessmen.valid,
                Autentik: saveAsessmen.autentik,
                Terkini: saveAsessmen.terkini,
                Memadai: saveAsessmen.memadai,
                Assesmen: saveAsessmen.penilaian_assesmen,
                Nilai: saveAsessmen.nilai,
                TanggalAssesmen: new Date(),
                CreatedAt: new Date(),
                UpdatedAt: new Date(),
                Ai: true,
            },
        });

        await tx.hasilAssesmenAi.create({
            data: {
                HasilAssesmenId: ha.HasilAssesmenId,
                Valid: saveAsessmen.justifikasi.valid,
                Autentik: saveAsessmen.justifikasi.autentik,
                Terkini: saveAsessmen.justifikasi.terkini,
                Memadai: saveAsessmen.justifikasi.memadai,
                Nilai: saveAsessmen.justifikasi.nilai,
                Assesmen: "",
            },
        });
    });


    return c.json(response, 200)
})

export const GET = handle(app)
export const POST = handle(app)

function buildAssessmentPrompt(input: {
    nama: string;
    mata_kuliah: string;
    cpl: string;
    profisiensi: string;
    dokumen: {
        nama: string;
        summary: string;
        numbers: {
            value: string;
            type: string;
            label: string;
            context: string;
            page_index: number;
            page_hint: string;
            document_hint: string;
            confidence: number;
        }[];
        transcript_details: {
            exists: boolean;
            courses: {
                course_name: string;
                course_code: string;
                semester: string;
                sks: string;
                grade_letter: string;
                grade_numeric: string;
                context: string;
            }[];
            gpa: {
                ip_per_semester: any[];
                ipk_final: string;
            };
        };
    }[];
}): string {
    const buktiText = input.dokumen
        .map((b, idx) => {
            const importantNumbers = b.numbers
                .filter((n) => n.confidence >= 0.85)
                .slice(0, 30);

            const angkaText =
                importantNumbers.length === 0
                    ? "(tidak ada angka penting dengan confidence tinggi yang terdeteksi)"
                    : importantNumbers
                        .map(
                            (n) =>
                                `- [${n.type}] value="${n.value}", label="${n.label}", context="${n.context}"`
                        )
                        .join("\n");

            let transcriptText = "(tidak ada detail transkrip spesifik untuk dokumen ini)";
            if (b.transcript_details && b.transcript_details.exists) {
                const td = b.transcript_details;
                const courses = td.courses.slice(0, 20);

                const coursesText =
                    courses.length === 0
                        ? "(tidak ada mata kuliah terdeteksi)"
                        : courses
                            .map(
                                (c, i) =>
                                    `${i + 1}. ${c.course_code} ${c.course_name}, SKS=${c.sks}, Nilai=${c.grade_letter} (${c.grade_numeric}), context="${c.context}"`
                            )
                            .join("\n");

                const truncatedNote =
                    td.courses.length > courses.length
                        ? `\n(terdapat ${td.courses.length - courses.length} mata kuliah tambahan yang tidak ditampilkan di sini untuk menghemat konteks)`
                        : "";

                transcriptText = `
[Transkrip Akademik]
- IPK final (jika relevan): ${td.gpa?.ipk_final ?? "-"}
- Daftar mata kuliah (maksimal 20 baris ditampilkan):
${coursesText}${truncatedNote}
`.trim();
            }

            return `
[Bukti ${idx + 1}]
- NamaDokumen: ${b.nama}

Ringkasan Dokumen (hasil AI OCR):
${b.summary}

Angka-angka penting (hasil ekstraksi AI OCR, sudah difilter confidence tinggi dan dibatasi jumlahnya):
${angkaText}

Detail Transkrip / Riwayat Akademik (jika relevan):
${transcriptText}
`.trim();
        })
        .join("\n\n");

    return `
Konteks:
Kamu adalah asesor RPL pada Sistem Informasi RPL Terpadu. Tugasmu adalah menilai kesesuaian antara:
1) pernyataan profisiensi mahasiswa, dan
2) dokumen bukti dukung (yang sudah diringkas oleh AI sebelumnya).

Data self-assessment:

- Nama Mahasiswa             : ${input.nama}
- Nama Mata Kuliah           : ${input.mata_kuliah}
- Nama Capaian Pembelajaran  : ${input.cpl}
- Profisiensi yang dipilih   : ${input.profisiensi} (TIDAK PERNAH / BAIK / BAIK SEKALI)

Daftar bukti dukung dan hasil analisis AI OCR:

${buktiText}

Berdasarkan data di atas, hasilkan penilaian dengan format JSON PERSIS seperti ini:
{
  "valid": true/false,
  "autentik": true/false,
  "terkini": true/false,
  "memadai": true/false,
  "penilaian_assesmen": "kalimat penjelasan singkat 3–5 kalimat",
  "nilai": 0-100
  "justifikasi": {
    "valid": "jelaskan mengapa bukti dinilai valid/tidak",
    "autentik": "jelaskan autentisitas bukti",
    "terkini": "jelaskan relevansi waktu bukti",
    "memadai": "jelaskan kecukupan bukti",
    "nilai": "jelaskan penilaian yang didapat",
  }
}
IMPORTANT:
- gunakan penalaran minimum.
- jangan tampilkan langkah berpikir.
- langsung keluarkan JSON valid.
`.trim();

}

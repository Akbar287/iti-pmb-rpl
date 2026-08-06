import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import mime from 'mime'
import {
    bacaBerkas,
    berkasAda,
    hapusBerkas,
    simpanBerkas,
} from '@/lib/storage'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '@/lib/prisma'
import { BuktiFormTypes } from '@/types/BuktiFormUploadDokumenTypes'
import { streamText, gateway } from 'ai'
import { AiOcr, maksimalPagesAiOcr } from '@/config/ai'
import { randomUUID } from 'crypto'
import { createAiTokenUsage } from '@/lib/ai-token-usage'

const app = new Hono<{ Variables: { token: { id?: string } } }>().basePath('/api/protected/upload-dokumen')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const BuktiFormId = c.req.query('BuktiFormId')

    const PendaftaranId = c.req.query('PendaftaranId')

    const filename = c.req.query('file')

    if (BuktiFormId === undefined && PendaftaranId !== undefined && filename === undefined) {
        const data = await prisma.buktiForm.findMany({
            select: {
                BuktiFormId: true,
                PendaftaranId: true,
                NamaFile: true,
                NamaDokumen: true,
                CreatedAt: true,
                UpdatedAt: true,
                JenisDokumen: {
                    select: {
                        JenisDokumenId: true,
                        Jenis: true,
                        NomorDokumen: true,
                        Keterangan: true,
                    }
                }
            },
            where: {
                PendaftaranId: PendaftaranId
            },
            orderBy: {
                JenisDokumen: {
                    NomorDokumen: 'asc'
                }
            }
        });

        const res = data.map(d => ({
            JenisDokumenId: d?.JenisDokumen.JenisDokumenId ?? '',
            Jenis: d?.JenisDokumen.Jenis ?? '',
            NomorDokumen: d?.JenisDokumen.NomorDokumen ?? 0,
            Keterangan: d?.JenisDokumen.Keterangan ?? '',
            BuktiFormId: d?.BuktiFormId ?? '',
            PendaftaranId: d?.PendaftaranId ?? '',
            NamaFile: d?.NamaFile ?? '',
            NamaDokumen: d?.NamaDokumen ?? '',
            CreatedAt: d?.CreatedAt ?? null,
            UpdatedAt: d?.UpdatedAt ?? null,
        }))

        return c.json(
            { data: res, status: 'success', message: 'data has been get' },
            { status: 200 }
        )
    }
    if (BuktiFormId !== undefined && PendaftaranId === undefined && filename === undefined) {
        const data = await prisma.buktiForm.findFirst({
            select: {
                BuktiFormId: true,
                PendaftaranId: true,
                NamaFile: true,
                NamaDokumen: true,
                CreatedAt: true,
                UpdatedAt: true,
                JenisDokumen: {
                    select: {
                        JenisDokumenId: true,
                        Jenis: true,
                        NomorDokumen: true,
                        Keterangan: true,
                    }
                }
            },
            where: {
                BuktiFormId: BuktiFormId
            }
        });

        const res: BuktiFormTypes = {
            JenisDokumenId: data?.JenisDokumen.JenisDokumenId ?? '',
            Jenis: data?.JenisDokumen.Jenis ?? '',
            NomorDokumen: data?.JenisDokumen.NomorDokumen ?? 0,
            Keterangan: data?.JenisDokumen.Keterangan ?? '',
            BuktiFormId: data?.BuktiFormId ?? '',
            PendaftaranId: data?.PendaftaranId ?? '',
            NamaFile: data?.NamaFile ?? '',
            NamaDokumen: data?.NamaDokumen ?? '',
            CreatedAt: data?.CreatedAt ?? null,
            UpdatedAt: data?.UpdatedAt ?? null,
        }

        return c.json(
            { data: res, status: 'success', message: 'data has been get' },
            { status: 200 }
        )
    }
    if (BuktiFormId === undefined && PendaftaranId === undefined) {
        if (!filename) {
            return c.json(
                { data: [], status: 'error', message: 'file is required' },
                { status: 400 }
            )
        }
        const fileRecord = await prisma.buktiForm.findFirst({
            where: {
                NamaFile: filename,
            },
            select: {
                PathFile: true,
                NamaFile: true,
                NamaDokumen: true,
            }
        })

        if (!fileRecord) {
            return c.json(
                { data: [], status: 'error', message: 'file is required' },
                { status: 400 }
            )
        }
        try {
            if (!(await berkasAda(fileRecord.PathFile))) {
                return c.json(
                    { data: [], status: 'error', message: 'file not found in storage' },
                    { status: 404 }
                )
            }

            const isiBerkas = await bacaBerkas(fileRecord.PathFile)

            const contentType =
                mime.getType(fileRecord.NamaDokumen || filename) ||
                'application/octet-stream'

            return c.body(isiBerkas, 200, {
                'Content-Type': contentType,
                'Content-Disposition': `inline; filename="${filename}"`,
            })
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'error'
            return c.json(
                { data: [], status: 'error', message: errorMessage },
                { status: 500 }
            )
        }
    }
})
app.post('/', async (c) => {
    const body = await c.req.parseBody()
    const token = c.get('token') as { id?: string } | undefined
    const userId = token?.id ?? null
    const requestId = c.req.header('x-request-id') ?? randomUUID()

    const file = body.files
    const JenisDokumenId = body.JenisDokumenId
    const PendaftaranId = body.PendaftaranId

    if (!file || !(file instanceof File)) {
        return c.json(
            { status: 'error', message: 'File is required', data: [] },
            { status: 400 }
        )
    }
    if (!JenisDokumenId || typeof JenisDokumenId !== 'string') {
        return c.json(
            { status: 'error', message: 'Jenis Dokumen Perlu diisi', data: [] },
            { status: 400 }
        )
    }
    const jenisDokumen = await prisma.jenisDokumen.findFirst({
        where: { JenisDokumenId: JenisDokumenId },
        select: { Jenis: true },
    })
    if (!jenisDokumen) {
        return c.json(
            { status: 'error', message: 'Jenis Dokumen tidak ditemukan', data: [] },
            { status: 400 }
        )
    }

    if (!PendaftaranId) {
        return c.json(
            { status: 'error', message: 'Id Pendaftaran Perlu diisi', data: [] },
            { status: 400 }
        )
    }

    const MAX_SIZE_MB = 10
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        return c.json(
            {
                status: 'error',
                message: 'Ukuran file melebihi 10MB',
                data: [],
            },
            { status: 400 }
        )
    }

    const allowedMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    const allowedExtensions = ['pdf', 'doc', 'docx']

    const fileExt = mime.getExtension(file.type) || ''
    if (
        !allowedMimeTypes.includes(file.type) ||
        !allowedExtensions.includes(fileExt)
    ) {
        return c.json(
            {
                status: 'error',
                message:
                    'Format file tidak valid. Hanya PDF dan Word (doc/docx) yang diperbolehkan.',
                data: [],
            },
            { status: 400 }
        )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const originalFileName = file.name
    const filename = `${uuidv4()}.${fileExt}`

    // Berkas mahasiswa disimpan di <storage>/<userId>/dokumen/, basis data
    // hanya memegang path-nya.
    const pemilik = await prisma.pendaftaran.findFirst({
        where: { PendaftaranId: PendaftaranId as string },
        select: { Mahasiswa: { select: { UserId: true } } },
    })

    if (!pemilik) {
        return c.json(
            { status: 'error', message: 'Pendaftaran tidak ditemukan', data: [] },
            { status: 400 }
        )
    }

    const pathFile = await simpanBerkas(
        pemilik.Mahasiswa.UserId,
        'dokumen',
        filename,
        buffer
    )

    const buktiFormSelect = {
        JenisDokumenId: true,
        BuktiFormId: true,
        PendaftaranId: true,
        NamaFile: true,
        NamaDokumen: true,
        CreatedAt: true,
        UpdatedAt: true,
        JenisDokumen: {
            select: {
                Jenis: true,
                NomorDokumen: true,
                Keterangan: true,
            }
        }
    } as const

    // Satu pendaftar hanya boleh memiliki 1 BuktiForm per JenisDokumen.
    // Bila sudah ada, unggahan berikutnya MENIMPA (update) baris yang sama —
    // bukan membuat baris baru — sehingga relasi tetap 1 dokumen : 1 buktiForm.
    const existing = await prisma.buktiForm.findFirst({
        where: {
            PendaftaranId: PendaftaranId as string,
            JenisDokumenId: JenisDokumenId as string,
        },
        select: { BuktiFormId: true },
    })

    let data
    if (existing) {
        // Buang hasil OCR halaman lama agar tidak menumpuk dari unggahan sebelumnya.
        await prisma.buktiFormPages.deleteMany({
            where: { BuktiFormId: existing.BuktiFormId },
        })

        data = await prisma.buktiForm.update({
            where: { BuktiFormId: existing.BuktiFormId },
            data: {
                NamaFile: filename,
                PathFile: pathFile,
                NamaDokumen: originalFileName,
                UpdatedAt: new Date(),
            },
            select: buktiFormSelect,
        })
    } else {
        data = await prisma.buktiForm.create({
            data: {
                JenisDokumenId: JenisDokumenId as string,
                PendaftaranId: PendaftaranId as string,
                NamaFile: filename,
                PathFile: pathFile,
                NamaDokumen: originalFileName,
                CreatedAt: new Date(),
                UpdatedAt: new Date(),
            },
            select: buktiFormSelect,
        })
    }


    const isTranskripNilai = jenisDokumen.Jenis.trim().toLowerCase().includes('transkrip');

    const basePrompt = `Kamu adalah asisten AI untuk Sistem Informasi Rekognisi Pembelajaran Lampau (RPL) Terpadu.

Tugas utama kamu:
1. Melakukan OCR (membaca teks) dari dokumen visual (gambar halaman PDF).
2. Mendeteksi dan mengekstrak SEMUA nilai dan angka yang muncul di dokumen, sekecil apa pun.
3. Menghubungkan setiap nilai/angka dengan konteksnya (label, jenis dokumen, dan posisi pada halaman).
4. Mengembalikan hasil dalam format JSON yang rapi dan konsisten, tanpa berhalusinasi.

Jenis dokumen yang mungkin kamu terima: ${jenisDokumen.Jenis}

Jenis angka yang harus kamu tangkap (tidak terbatas pada ini):
- NIM, NIS, nomor ijazah, nomor sertifikat, nomor registrasi
- SKS, IP, IPK, nilai angka (misalnya: 75, 3.50, 4.00, 85, 90)
- Nilai huruf (misalnya: A, B+, C) tetapi jika mungkin hubungkan dengan angka
- Tahun dan tanggal (misalnya: 2019, 17-08-2020, 01/01/2022)
- Lama pengalaman kerja (misalnya: 3 tahun, 24 bulan, 120 jam)
- Jumlah jam pelatihan atau jam kompetensi
- Nomor anggota asosiasi, nomor lisensi, nomor keanggotaan
- Nomor halaman, nomor dokumen, nomor lampiran
- Angka lain yang relevan (persentase, skor, rating, level, dsb.)

Aturan penting:
- Jangan mengarang nilai atau angka yang tidak terlihat di dokumen.
- Jika teks tidak terbaca dengan jelas, tuliskan nilai sebagai string apa adanya dan tandai "confidence" lebih rendah.
- Jika kamu ragu tentang jenis angka, tetap masukkan tetapi beri "type": "unknown".
- Utamakan akurasi OCR angka dan titik/koma desimal (contoh: 3.50 vs 3,50).
`;

    const transkripInstructions = `
**INSTRUKSI KHUSUS UNTUK TRANSKRIP NILAI:**
SANGAT PENTING: Dokumen ini adalah TRANSKRIP NILAI akademik. Kamu WAJIB mengekstrak SETIAP BARIS mata kuliah yang ada di dokumen, TANPA TERKECUALI.

Langkah yang harus kamu lakukan:
1. Identifikasi SEMUA tabel mata kuliah di dokumen (bisa ada di kolom kiri dan kanan).
2. Baca SETIAP BARIS dari Semester 1 hingga semester terakhir.
3. Ekstrak SETIAP mata kuliah dengan lengkap: Kode, Nama Mata Kuliah, SKS, dan Nilai.
4. Jangan lewatkan satu baris pun. Transkrip biasanya memiliki 40-60 mata kuliah.
5. Perhatikan format tabel yang mungkin ada di 2 kolom (kiri dan kanan).

JANGAN HANYA MENGEKSTRAK SEBAGIAN! Ekstrak SEMUA dari baris pertama sampai terakhir.
`;

    const jsonStructure = `
Struktur output WAJIB dalam JSON dengan format:

{
  "summary": "ringkasan singkat isi dokumen dalam 3–5 kalimat.",
  "numbers": [
    {
      "value": "string persis seperti di dokumen, misalnya '3.50' atau '2019'",
      "type": "misalnya: 'IPK', 'nilai_mata_kuliah', 'SKS', 'tahun', 'tanggal', 'nomor_sertifikat', 'NIM', 'jam_pelatihan', 'lama_pengalaman', 'nomor_anggota', 'unknown'",
      "label": "teks label terdekat di sekitar angka, misalnya 'IPK', 'Total SKS', 'No. Sertifikat', 'NIM', 'Tanggal Lahir'",
      "context": "cuplikan teks di sekitar angka tersebut (maks 20–30 kata) untuk membantu verifikasi manusia",
      "page_index": 0,
      "page_hint": "misalnya: 'Transkrip Nilai halaman 1', 'Ijazah', 'Logbook halaman 3'",
      "document_hint": "misalnya: 'Transkrip Nilai', 'Ijazah', 'Sertifikat Kompetensi', 'Logbook', 'Penilaian kinerja'",
      "confidence": 0.0-1.0
    }
  ],
  "transcript_details": {
    "exists": true,
    "total_courses_extracted": 0,
    "courses": [
      {
        "course_name": "nama mata kuliah LENGKAP",
        "course_code": "kode mata kuliah (contoh: B300001, MK101)",
        "semester": "Semester 1, Semester 2, dst",
        "sks": "jumlah SKS (angka)",
        "grade_letter": "nilai huruf (A, B+, B, C+, C, D, E)",
        "grade_numeric": "nilai angka jika ada"
      }
    ],
    "gpa": {
      "ip_per_semester": [
        {
          "label": "IP Semester 1",
          "value": "3.45"
        }
      ],
      "ipk_final": "nilai IPK kumulatif"
    },
    "total_sks": "total SKS keseluruhan"
  }
}

Jika ada lebih dari satu halaman, anggap semua gambar yang diberikan adalah bagian dari SATU dokumen PDF yang sama. Gunakan indeks halaman (0,1,2,...) untuk mengisi field "page_index".

Jawab HANYA dengan JSON valid tanpa penjelasan tambahan di luar JSON.
`;

    const prompt = isTranskripNilai
        ? basePrompt + transkripInstructions + jsonStructure
        : basePrompt + jsonStructure;

    const pdfBs64 = Buffer.from(buffer).toString('base64');
    const modelSlug = AiOcr ? AiOcr : "alibaba/qwen3-vl-instruct"
    const startedAt = Date.now()

    const result = await streamText({
        model: gateway(modelSlug),
        topP: 0.9,
        temperature: 0,
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: prompt,
                    },
                    {
                        type: 'file',
                        mediaType: 'application/pdf',
                        data: pdfBs64
                    }
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
            feature: 'AI_OCR',
            featureGroup: 'OCR',
            page: '/upload-dokumen',
            route: '/api/protected/upload-dokumen',
            method: 'POST',
            requestId,
            referenceType: 'BuktiForm',
            referenceId: data.BuktiFormId,
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
                pendaftaranId: PendaftaranId,
                jenisDokumen: jenisDokumen.Jenis,
                isTranskripNilai,
                originalFileName,
                fileExt,
                fileSize: file.size,
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
        feature: 'AI_OCR',
        featureGroup: 'OCR',
        page: '/upload-dokumen',
        route: '/api/protected/upload-dokumen',
        method: 'POST',
        requestId,
        referenceType: 'BuktiForm',
        referenceId: data.BuktiFormId,
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
            pendaftaranId: PendaftaranId,
            jenisDokumen: jenisDokumen.Jenis,
            isTranskripNilai,
            originalFileName,
            fileExt,
            fileSize: file.size,
        },
    })

    await prisma.buktiFormPages.create({
        data: {
            BuktiFormId: data.BuktiFormId,
            Prompt: prompt,
            Result: fullText,
            Think: '',
        },
    });

    const jenisLower = jenisDokumen.Jenis.trim().toLowerCase();

    if (jenisLower.includes('transkrip nilai') || jenisLower.includes('transkrip')) {
        try {
            let jsonStart = fullText.indexOf('{');
            let jsonEnd = fullText.lastIndexOf('}');

            if (jsonStart !== -1 && jsonEnd !== -1) {
                const jsonStr = fullText.substring(jsonStart, jsonEnd + 1);
                const parsedResult = JSON.parse(jsonStr);

                const transcriptDetails = parsedResult.transcript_details;
                const courses = transcriptDetails?.courses || [];

                if (courses.length > 0) {
                    await prisma.transkripNilai.deleteMany({
                        where: {
                            PendaftaranId: PendaftaranId as string,
                        },
                    });

                    let insertedCount = 0;
                    for (const course of courses) {
                        const kodeMataKuliah = course.course_code || '-';
                        const namaMataKuliah = course.course_name || '';

                        let sks = 0;
                        if (course.sks) {
                            const sksString = String(course.sks);
                            const sksMatch = sksString.match(/[\d.]+/);
                            if (sksMatch) {
                                sks = parseFloat(sksMatch[0]) || 0;
                            }
                        }

                        const nilai = course.grade_letter || course.grade_numeric || '-';

                        if (namaMataKuliah && namaMataKuliah.trim() !== '') {
                            await prisma.transkripNilai.create({
                                data: {
                                    PendaftaranId: PendaftaranId as string,
                                    KodeMataKuliah: kodeMataKuliah,
                                    NamaMataKuliah: namaMataKuliah,
                                    Sks: sks,
                                    Nilai: nilai,
                                    CreatedAt: new Date(),
                                    UpdatedAt: new Date(),
                                },
                            });
                            insertedCount++;
                        }
                    }
                } else {
                }
            } else {
            }
        } catch (parseError) {
            console.error('Error parsing transcript data:', parseError);
        }
    }

    return c.json({
        status: 'success',
        message: 'File uploaded successfully',
        data: {
            JenisDokumenId: data.JenisDokumenId,
            Jenis: data.JenisDokumen.Jenis,
            NomorDokumen: data.JenisDokumen.NomorDokumen,
            BuktiFormId: data.BuktiFormId,
            Keterangan: data.JenisDokumen.Keterangan,
            PendaftaranId: data.PendaftaranId,
            NamaFile: data.NamaFile,
            NamaDokumen: data.NamaDokumen,
            CreatedAt: data.CreatedAt,
            UpdatedAt: data.UpdatedAt,
        },
    })
})

app.delete('/', async (c) => {
    const id = c.req.query('id')

    const data = await prisma.buktiForm.findFirst({
        where: {
            BuktiFormId: id,
        },
    })

    await prisma.buktiForm.delete({
        where: {
            BuktiFormId: id,
        },
    })

    // Berkas fisik ikut dibuang agar tidak menumpuk di penyimpanan.
    if (data?.PathFile) {
        await hapusBerkas(data.PathFile)
    }

    if (data) {
        const jenisDokumen = await prisma.jenisDokumen.findFirst({
            where: {
                JenisDokumenId: data.JenisDokumenId,
            },
        })

        if (jenisDokumen?.Jenis.toLowerCase().includes('transkrip nilai')) {
            await prisma.transkripNilai.deleteMany({
                where: {
                    PendaftaranId: data.PendaftaranId,
                },
            });
        }
    }

    return c.json({
        status: 'ok',
        message: 'success delete a file',
        data: []
    })
})

export const GET = handle(app)
export const POST = handle(app)
export const DELETE = handle(app)

import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import mime from 'mime'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '@/lib/prisma'
import { BuktiFormTypes } from '@/types/BuktiFormUploadDokumenTypes'
import { streamText, gateway } from 'ai'
import { ollama } from 'ollama-ai-provider-v2'
import { pdfToBase64Images } from '@/lib/pdfToBase64Images'

const app = new Hono().basePath('/api/protected/upload-dokumen')

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
                FileData: true,
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
            if (!fileRecord || !fileRecord.FileData) {
                return c.json(
                    { data: [], status: 'error', message: 'file not found in DB' },
                    { status: 404 }
                )
            }

            const contentType =
                mime.getType(fileRecord.NamaDokumen || filename) ||
                'application/octet-stream'

            return c.body(fileRecord.FileData, 200, {
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

    const data = await prisma.buktiForm.create({
        data: {
            JenisDokumenId: JenisDokumenId as string,
            PendaftaranId: PendaftaranId as string,
            NamaFile: filename,
            FileData: buffer,
            NamaDokumen: originalFileName,
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
        },
        select: {
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
        }
    });


    // AI Get Info From Doc
    const prompt = `Kamu adalah asisten AI untuk Sistem Informasi Rekognisi Pembelajaran Lampau (RPL) Terpadu.

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
    "exists": true/false,
    "courses": [
      {
        "course_name": "nama mata kuliah",
        "course_code": "kode jika ada",
        "semester": "misalnya 'Semester 1' atau '2021/2022 Ganjil'",
        "sks": "jumlah SKS jika ada",
        "grade_letter": "nilai huruf (A, B+, dst) jika ada",
        "grade_numeric": "nilai angka jika ada",
        "context": "baris tabel tempat mata kuliah muncul"
      }
    ],
    "gpa": {
      "ip_per_semester": [
        {
          "label": "IP Semester 1",
          "value": "3.45"
        }
      ],
      "ipk_final": "3.50"
    }
  }
}

Jika ada lebih dari satu halaman, anggap semua gambar yang diberikan adalah bagian dari SATU dokumen PDF yang sama. Gunakan indeks halaman (0,1,2,...) untuk mengisi field "page_index".

Jawab HANYA dengan JSON valid tanpa penjelasan tambahan di luar JSON.
`;
    const imagesBase64 = await pdfToBase64Images(buffer);
    const limitedImages = imagesBase64.slice(0, 5);
    const result = await streamText({
        model: gateway('alibaba/qwen3-vl-instruct'),
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: `${prompt}`,
                    },
                    ...limitedImages.map((img) => ({
                        type: "image" as const,
                        image: img,
                    })),
                ],
            },
        ],
    });

    let fullText = ""
    for await (const chunk of result.textStream) {
        fullText += chunk;
    }
    await prisma.buktiFormPages.create({
        data: {
            BuktiFormId: data.BuktiFormId,
            Prompt: prompt,
            Result: fullText,
            Think: '',
        },
    });

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

    await prisma.buktiForm.delete({
        where: {
            BuktiFormId: id,
        },
    })


    return c.json({
        status: 'ok',
        message: 'success delete a file',
        data: []
    })
})

export const GET = handle(app)
export const POST = handle(app)
export const DELETE = handle(app)

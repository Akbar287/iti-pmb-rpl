import { JenisSkAsessmen, Prisma, SkRektor } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import {
    bacaBerkas,
    berkasAda,
    hapusBerkas,
    simpanBerkas,
    simpanBerkasDiPath,
} from '@/lib/storage'
import { createHash } from 'node:crypto'
import { withApiAuth } from '@/middlewares/api-auth'
import {
    cariTemplateRpl,
    KODE_TEMPLATE_RPL,
    NAMA_TEMPLATE_RPL,
    STATUS_PERLU_REVISI,
    sisuratApi,
    type FieldTemplate,
    type StatusSurat,
    type TemplateSurat,
} from '@/lib/sisurat-api'
import { stempelQrSisurat } from '@/lib/sk-stempel-qr'
import { diktumBakuSk } from '@/lib/diktum-sk-rpl'
import { getSession } from '@/provider/api'
import { ResponseSkRektorAsessmenType } from '@/types/FinalAsessmen'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import mime from 'mime'
import { v4 as uuidv4 } from 'uuid'
import { cookies } from 'next/headers'

// Tahap-tahap yang masih menjadi tanggung jawab / pantauan Akademik pada menu
// Sk. Rektor: menyiapkan SK, mendorongnya ke Sisurat, memantau prosesnya di
// sana, lalu mempublikasikan SK yang sudah bernomor resmi.
/**
 * Begitu SK final dari Sisurat diterima, berkas langsung masuk menu Sk. Rektor
 * walaupun status pendaftarannya belum sempat dimajukan Akademik — di situlah
 * SK dipublikasikan ke mahasiswa.
 */
const ADA_SK_BERTANDA_TANGAN: Prisma.PendaftaranWhereInput = {
    SkRektorMahasiswa: { some: { SkRektor: { Ditandatangani: true } } },
}

const STATUS_SK_AKADEMIK = [
    'Penerbitan SK Asessmen',
    'Proses SK di Sisurat',
    'Sinkronisasi Hasil Asessmen',
    'Selesai',
]

/**
 * Menyusun `fieldValues` untuk template SK RPL di Sisurat.
 *
 * Nilai identitas diambil dari basis data supaya tidak bergantung pada ketikan
 * Akademik; butir "Menimbang/Mengingat/Memperhatikan/Menetapkan" boleh disunting
 * dari antarmuka. Placeholder bertipe LIST wajib dikirim sebagai JSON array yang
 * di-stringify (doc/integrasi-rpl-sisurat.md §5).
 */
type ButirSk = {
    Perihal?: string
    Semester?: string
    TanggalAsesmen?: string
    Menimbang?: string[]
    Mengingat?: string[]
    Memperhatikan?: string[]
    Menetapkan?: string[]
}

function bersihkanButir(daftar: string[] | undefined, cadangan: string[]) {
    const isi = (daftar ?? [])
        .map((x) => String(x).trim())
        .filter((x) => x.length > 0)
    return isi.length > 0 ? isi : cadangan
}

async function dataSuratRpl(
    pendaftaranId: string,
    jenis: JenisSkAsessmen
) {
    const p = await prisma.pendaftaran.findFirst({
        where: { PendaftaranId: pendaftaranId },
        select: {
            Periode: true,
            Mahasiswa: {
                select: { UserId: true, User: { select: { Nama: true } } },
            },
            DaftarUlang: {
                select: {
                    ProgramStudi: {
                        select: {
                            Nama: true,
                            University: {
                                select: {
                                    UniversityJabatan: {
                                        select: {
                                            Nama: true,
                                            UniversityJabatanOrang: {
                                                select: { Nama: true },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            MataKuliahMahasiswa: {
                where: { Rpl: true },
                select: {
                    Keterangan: true,
                    MataKuliah: { select: { Sks: true } },
                    SkorAssesmen: { select: { Diakui: true } },
                    transkripNilaiRelations: { select: { Diakui: true } },
                },
            },
        },
    })

    const keterangan = jenis === 'TRANSFER_SKS' ? 'Transfer_SKS' : 'Perolehan_SKS'
    const sksDiakui = (p?.MataKuliahMahasiswa ?? [])
        .filter((mkm) => mkm.Keterangan === keterangan)
        .reduce((acc, mkm) => {
            const diakui =
                mkm.Keterangan === 'Transfer_SKS'
                    ? (mkm.transkripNilaiRelations[0]?.Diakui ?? false)
                    : (mkm.SkorAssesmen[0]?.Diakui ?? false)
            return diakui ? acc + (mkm.MataKuliah.Sks ?? 0) : acc
        }, 0)

    // "Wakil Rektor" sengaja dikecualikan agar tidak tertukar dengan Rektor.
    const jabatan =
        p?.DaftarUlang[0]?.ProgramStudi.University.UniversityJabatan ?? []
    const rektor =
        jabatan.find((j) => (j.Nama ?? '').trim().toLowerCase() === 'rektor') ??
        jabatan.find(
            (j) =>
                (j.Nama ?? '').toLowerCase().includes('rektor') &&
                !(j.Nama ?? '').toLowerCase().includes('wakil')
        )

    return {
        UserId: p?.Mahasiswa.UserId ?? null,
        Nama: p?.Mahasiswa.User.Nama ?? '',
        ProgramStudi: p?.DaftarUlang[0]?.ProgramStudi.Nama ?? '',
        Periode: p?.Periode ?? '',
        SksDiakui: sksDiakui,
        NamaRektor: rektor?.UniversityJabatanOrang[0]?.Nama ?? '',
    }
}

/** Tanggal ISO menjadi format Indonesia untuk butir Memperhatikan. */
function tanggalIndonesia(iso: string): string {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Jakarta',
    })
}

function susunFieldValues(
    info: Awaited<ReturnType<typeof dataSuratRpl>>,
    jenis: JenisSkAsessmen,
    butir: ButirSk,
    tanggalSurat: string,
    placeholders: string[],
    fields?: FieldTemplate[] | null
) {
    const tahun = new Date(tanggalSurat).getFullYear()
    const semester =
        butir.Semester?.trim() ||
        (info.Periode ? info.Periode : `Ganjil ${tahun}/${tahun + 1}`)

    // Butir baku mengikuti SK yang berlaku di ITI (doc/sk_rpl_perolehan.pdf dan
    // doc/sk_rpl_transfer.pdf); dipakai bila Akademik tidak menyunting butirnya.
    const baku = diktumBakuSk(jenis, {
        Nama: info.Nama,
        ProgramStudi: info.ProgramStudi,
        Semester: semester,
        TanggalPenilaian: tanggalIndonesia(
            butir.TanggalAsesmen?.trim() || tanggalSurat
        ),
    })

    const nilai: Record<string, string> = {
        'letter.date': tanggalSurat,
        'student.name': info.Nama,
        'student.program_studi': info.ProgramStudi,
        'academic.semester': semester,
        'rpl.assessment_date': butir.TanggalAsesmen?.trim() || tanggalSurat,
        'decree.place': process.env.SISURAT_TEMPAT_PENETAPAN ?? 'Tangerang Selatan',
        'signer.name': info.NamaRektor.trim(),
        'signer.jabatan': 'Rektor',
        'decree.considering': JSON.stringify(
            bersihkanButir(butir.Menimbang, baku.Menimbang)
        ),
        'decree.observing': JSON.stringify(
            bersihkanButir(butir.Mengingat, baku.Mengingat)
        ),
        'decree.paying_attention': JSON.stringify(
            bersihkanButir(butir.Memperhatikan, baku.Memperhatikan)
        ),
        'decree.stipulating': JSON.stringify(
            bersihkanButir(butir.Menetapkan, baku.Menetapkan)
        ),
    }

    // `letter.number` diisi Sisurat pada tahap ADMINISTRATION — tidak boleh
    // dikirim dari sini.
    delete nilai['letter.number']

    // Daftar `placeholders` hanya memuat token {{...}} pada badan surat; kunci
    // blok LIST (Menimbang/Mengingat/Memperhatikan/Menetapkan) tersimpan pada
    // properti SourceKey sehingga tidak ikut terdaftar
    // (integrasi-rpl-sisurat §6.3). Karena itu isian TIDAK disaring memakai
    // daftar itu — kalau disaring, seluruh diktum justru hilang. `fields`
    // dipakai bila tersedia, sebab di sana kunci LIST ikut disebut.
    // Kunci yang diisi Sisurat sendiri. Selama `fields` belum tersedia dari
    // API, dua kunci ini dipatok manual: `letter.number` terbit pada tahap
    // penomoran, dan `letter.date` diambil Sisurat dari `tanggalSurat`.
    const diisiSisurat = new Set(
        (fields ?? [])
            .filter((f) => f.diisiSisurat)
            .map((f) => f.key)
            .concat('letter.number', 'letter.date')
    )

    const terkirim = Object.fromEntries(
        Object.entries(nilai).filter(([k]) => !diisiSisurat.has(k))
    )

    // Yang dilaporkan sebagai belum terisi: kunci wajib menurut `fields`, atau
    // — bila `fields` belum tersedia — placeholder badan surat yang tak terisi.
    const wajib = fields?.length
        ? fields
            .filter((f) => f.required && !f.diisiSisurat)
            .map((f) => f.key)
        : placeholders.filter((k) => !diisiSisurat.has(k))
    const belumTerisi = wajib.filter((k) => !(k in terkirim))

    return { fieldValues: terkirim, belumTerisi }
}

const app = new Hono().basePath('/api/protected/asessment/sk-rektor')
const BASE_URL = process.env.BACKEND_API_BASE_URL

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const session = await getSession()
    const jenis = c.req.query('jenis')
    const isMahasiswa = c.req.query('_m')
    const isAsesor = c.req.query('_a')
    const isAkademik = c.req.query('_k')

    if (session) {
        if (jenis === '_f') {
            const filename = c.req.query('_f')
            if (!filename) {
                return c.json(
                    { data: [], status: 'error', message: 'file is required' },
                    { status: 400 }
                )
            }

            try {
                // Satu SK punya dua berkas: lampiran hasil asesmen (NamaFile)
                // dan SK final dari Sisurat (NamaFileFinal). Keduanya dilayani
                // dari endpoint yang sama, dibedakan lewat nama berkasnya.
                const sumber = await prisma.skRektor.findFirst({
                    where: {
                        OR: [
                            { NamaFile: filename },
                            { NamaFileFinal: filename },
                        ],
                    },
                    select: {
                        PathFile: true,
                        NamaFile: true,
                        PathFileFinal: true,
                        NamaFileFinal: true,
                        NamaDokumen: true,
                    },
                })

                const fileRecord = sumber
                    ? {
                        PathFile:
                            sumber.NamaFileFinal === filename
                                ? (sumber.PathFileFinal ?? '')
                                : sumber.PathFile,
                        NamaDokumen: sumber.NamaDokumen,
                    }
                    : null

                if (
                    !fileRecord ||
                    !fileRecord.PathFile ||
                    !(await berkasAda(fileRecord.PathFile))
                ) {
                    return c.json(
                        {
                            data: [],
                            status: 'error',
                            message: 'file not found in storage',
                        },
                        { status: 404 }
                    )
                }

                const contentType =
                    mime.getType(fileRecord.NamaDokumen || filename) ||
                    'application/octet-stream'

                return c.body(await bacaBerkas(fileRecord.PathFile), 200, {
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
        // Daftar template Sisurat untuk formulir inisialisasi.
        if (jenis === 'template-sisurat') {
            try {
                const daftar = await sisuratApi.templates()
                return c.json({
                    status: 'success',
                    message: 'Daftar template dimuat',
                    data: daftar,
                    // Template SK RPL per skema, hasil pencocokan kode/nama —
                    // supaya antarmuka tidak mengulang aturan yang sama.
                    rpl: {
                        PEROLEHAN_SKS: cariTemplateRpl(daftar, 'PEROLEHAN_SKS'),
                        TRANSFER_SKS: cariTemplateRpl(daftar, 'TRANSFER_SKS'),
                    },
                })
            } catch (error) {
                const message = error instanceof Error ? error.message : 'error'
                return c.json(
                    { status: 'error', message, data: [] },
                    { status: 502 }
                )
            }
        }
        if (jenis === 'get-sk-rektor') {
            const page = parseInt(c.req.query('page') || '1', 10)
            const limit = parseInt(c.req.query('limit') || '10', 10)
            const search = c.req.query('search') || ''
            if (isMahasiswa) {
                let where: Prisma.PendaftaranWhereInput = search
                    ? {
                        AND: [
                            {
                                Mahasiswa: { UserId: session.user.id }
                            },
                            {
                                // Mahasiswa hanya melihat berkasnya di menu ini
                                // setelah SK dipublikasikan Akademik; sebelum
                                // itu berkas ada di menu Hasil Asessmen.
                                SkRektorMahasiswa: {
                                    some: { SkRektor: { Dipublikasikan: true } },
                                },
                            },
                            {
                                OR: [
                                    {
                                        DaftarUlang: {
                                            some: {
                                                Nim: {
                                                    contains: search,
                                                    mode: 'insensitive',
                                                },
                                            },
                                        },
                                    },
                                    {
                                        KodePendaftar: {
                                            contains: search,
                                            mode: 'insensitive',
                                        },
                                    },
                                    {
                                        Mahasiswa: {
                                            User: {
                                                OR: [
                                                    {
                                                        NomorHp: {
                                                            contains: search,
                                                            mode: 'insensitive',
                                                        },
                                                        Nama: {
                                                            contains: search,
                                                            mode: 'insensitive',
                                                        },
                                                        Email: {
                                                            contains: search,
                                                            mode: 'insensitive',
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                    },
                                ],
                            },
                        ],
                    }
                    : {
                        AND: [
                            {
                                Mahasiswa: { UserId: session.user.id }
                            },
                            {
                                // Mahasiswa hanya melihat berkasnya di menu ini
                                // setelah SK dipublikasikan Akademik; sebelum
                                // itu berkas ada di menu Hasil Asessmen.
                                SkRektorMahasiswa: {
                                    some: { SkRektor: { Dipublikasikan: true } },
                                },
                            },
                        ],
                    }
                const [data, total] = await Promise.all([
                    prisma.pendaftaran.findMany({
                        where,
                        distinct: ['PendaftaranId'],
                        skip: (page - 1) * limit,
                        take: limit,
                        orderBy: { KodePendaftar: 'asc' },
                        select: {
                            PendaftaranId: true,
                            KodePendaftar: true,
                            DaftarUlang: {
                                select: {
                                    Nim: true,
                                    ProgramStudi: {
                                        select: {
                                            Nama: true,
                                        },
                                    },
                                },
                            },
                            SkRektorMahasiswa: {
                                // Mahasiswa & asesor hanya melihat SK yang sudah dipublikasikan Akademik.
                                where: { SkRektor: { Dipublikasikan: true } },
                                select: {
                                    SkRektor: {
                                        select: {
                                            SkRektorId: true,
                                            JenisSkAsessmen: true,
                                            NamaFile: true,
                                            NamaFileFinal: true,
                                            NamaDokumen: true,
                                            NomorSk: true,
                                        },
                                    },
                                },
                            },
                            StatusMahasiswaAssesmentHistory: {
                                select: {
                                    Aktif: true,
                                    StatusMahasiswaAssesment: {
                                        select: {
                                            NamaStatus: true,
                                        },
                                    },
                                },
                            },
                            Mahasiswa: {
                                select: {
                                    User: {
                                        select: {
                                            Nama: true,
                                            Email: true,
                                            NomorHp: true,
                                        },
                                    },
                                },
                            },
                        },
                    }),
                    prisma.pendaftaran.count({
                        where,
                    }),
                ])

                const response: ResponseSkRektorAsessmenType[] =
                    data?.map((am) => ({
                        Nama: am.Mahasiswa.User.Nama,
                        Email: am.Mahasiswa.User.Email,
                        Status: am.StatusMahasiswaAssesmentHistory.find(x => x.Aktif) ? am.StatusMahasiswaAssesmentHistory.find(x => x.Aktif)?.StatusMahasiswaAssesment.NamaStatus ?? '' : '',
                        NomorHp: am.Mahasiswa.User.NomorHp ?? '',
                        ProgramStudi: am.DaftarUlang.length === 0 ? '' : am.DaftarUlang[0].ProgramStudi.Nama ?? '',
                        NomorSk: am.SkRektorMahasiswa.length > 0 ? am.SkRektorMahasiswa[0].SkRektor.NomorSk ?? '' : '',
                        PendaftaranId: am.PendaftaranId,
                        KodePendaftar: am.KodePendaftar,
                        Nim:
                            am.DaftarUlang.length === 0
                                ? ''
                                : am.DaftarUlang[0].Nim ?? '',
                        SkRektor: am.SkRektorMahasiswa.length > 0 ? true : false,
                        DaftarSk: am.SkRektorMahasiswa.filter(
                            (x) => x.SkRektor.JenisSkAsessmen !== null
                        ).map((x) => ({
                            SkRektorId: x.SkRektor.SkRektorId,
                            JenisSkAsessmen: x.SkRektor.JenisSkAsessmen!,
                            NomorSk: x.SkRektor.NomorSk,
                            // Yang diunduh adalah SK final dari Sisurat bila
                            // sudah diterima; lampiran hanya jadi cadangan.
                            NamaFile:
                                x.SkRektor.NamaFileFinal || x.SkRektor.NamaFile,
                            NamaDokumen: x.SkRektor.NamaDokumen,
                        })),
                        NamaFile:
                            am.SkRektorMahasiswa.length > 0
                                ? (am.SkRektorMahasiswa[0].SkRektor
                                    .NamaFileFinal ||
                                    am.SkRektorMahasiswa[0].SkRektor.NamaFile) ??
                                ''
                                : '',
                    })) ?? []

                return c.json<{
                    data: ResponseSkRektorAsessmenType[]
                    page: number
                    limit: number
                    totalElement: number
                    totalPage: number
                    isFirst: boolean
                    isLast: boolean
                    hasNext: boolean
                    hasPrevious: boolean
                }>({
                    page: page,
                    limit: limit,
                    data: response,
                    totalElement: total,
                    totalPage: Math.ceil(total / limit),
                    isFirst: page === 1,
                    isLast:
                        page === Math.ceil(total / limit) ||
                        Math.ceil(total / limit) === 0,
                    hasNext: page < Math.ceil(total / limit),
                    hasPrevious: page > 1,
                })
            } else if (isAsesor) {
                let where: Prisma.AssesorMahasiswaWhereInput = search
                    ? {
                        AND: [
                            {
                                Asesor: {
                                    UserId: session.user.id
                                },
                            },
                            {
                                Pendaftaran: {
                                    OR: [
                                        {
                                            StatusMahasiswaAssesmentHistory: {
                                                some: {
                                                    Aktif: true,
                                                    StatusMahasiswaAssesment: {
                                                        NamaStatus: "Sinkronisasi Hasil Asessmen",
                                                    },
                                                },
                                            },
                                        },
                                        {
                                            StatusMahasiswaAssesmentHistory: {
                                                some: {
                                                    Aktif: true,
                                                    StatusMahasiswaAssesment: {
                                                        NamaStatus: "Selesai",
                                                    },
                                                },
                                            },
                                        },
                                    ]
                                }
                            },
                            {
                                Pendaftaran: {
                                    OR: [
                                        {
                                            Mahasiswa: {
                                                User: {
                                                    Nama: {
                                                        contains: search,
                                                        mode: 'insensitive',
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            KodePendaftar: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                        {
                                            DaftarUlang: {
                                                some: {
                                                    OR: [
                                                        {
                                                            Nim: {
                                                                contains: search,
                                                                mode: 'insensitive',
                                                            },
                                                        }, {
                                                            ProgramStudi: {
                                                                Nama: {
                                                                    contains: search,
                                                                    mode: 'insensitive',
                                                                },
                                                            },
                                                        }
                                                    ]
                                                },
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    } : {
                        AND: [
                            {
                                Asesor: {
                                    UserId: session.user.id
                                },
                            },
                            {
                                Pendaftaran: {
                                    OR: [
                                        {
                                            StatusMahasiswaAssesmentHistory: {
                                                some: {
                                                    Aktif: true,
                                                    StatusMahasiswaAssesment: {
                                                        NamaStatus: "Sinkronisasi Hasil Asessmen",
                                                    },
                                                },
                                            },
                                        },
                                        {
                                            StatusMahasiswaAssesmentHistory: {
                                                some: {
                                                    Aktif: true,
                                                    StatusMahasiswaAssesment: {
                                                        NamaStatus: "Selesai",
                                                    },
                                                },
                                            },
                                        },
                                    ]
                                }
                            },
                        ],
                    }
                const [data, total] = await Promise.all([
                    prisma.assesorMahasiswa.findMany({
                        distinct: ['PendaftaranId'],
                        where,
                        skip: (page - 1) * limit,
                        take: limit,
                        orderBy: { Pendaftaran: { KodePendaftar: 'asc' } },
                        select: {
                            PendaftaranId: true,
                            Pendaftaran: {
                                select: {
                                    KodePendaftar: true,
                                    SkRektorMahasiswa: {
                                        // Mahasiswa & asesor hanya melihat SK yang sudah dipublikasikan Akademik.
                                        where: { SkRektor: { Dipublikasikan: true } },
                                        select: {
                                            SkRektor: {
                                                select: {
                                                    SkRektorId: true,
                                                    JenisSkAsessmen: true,
                                                    NamaFile: true,
                                                    NamaFileFinal: true,
                                                    NamaDokumen: true,
                                                    NomorSk: true,
                                                },
                                            },
                                        },
                                    },
                                    StatusMahasiswaAssesmentHistory: {
                                        select: {
                                            Aktif: true,
                                            StatusMahasiswaAssesment: {
                                                select: {
                                                    NamaStatus: true,
                                                },
                                            },
                                        },
                                    },
                                    DaftarUlang: {
                                        select: {
                                            Nim: true,
                                            ProgramStudi: {
                                                select: {
                                                    Nama: true,
                                                },
                                            }
                                        },
                                    },
                                    Mahasiswa: {
                                        select: {
                                            User: {
                                                select: {
                                                    Nama: true,
                                                    Email: true,
                                                    NomorHp: true,
                                                },
                                            },
                                        },
                                    },
                                }
                            },
                        },
                    }),
                    prisma.assesorMahasiswa.count({
                        where,
                    }),
                ])

                const response: ResponseSkRektorAsessmenType[] =
                    data?.map((am) => ({
                        Nama: am.Pendaftaran.Mahasiswa.User.Nama,
                        Status: am.Pendaftaran.StatusMahasiswaAssesmentHistory.find(x => x.Aktif) ? am.Pendaftaran.StatusMahasiswaAssesmentHistory.find(x => x.Aktif)?.StatusMahasiswaAssesment.NamaStatus ?? '' : '',
                        Email: am.Pendaftaran.Mahasiswa.User.Email,
                        ProgramStudi: am.Pendaftaran.DaftarUlang.length === 0 ? '' : am.Pendaftaran.DaftarUlang[0].ProgramStudi.Nama ?? '',
                        NomorSk: am.Pendaftaran.SkRektorMahasiswa.length > 0 ? am.Pendaftaran.SkRektorMahasiswa[0].SkRektor.NomorSk ?? '' : '',
                        NamaFile: am.Pendaftaran.SkRektorMahasiswa.length > 0 ? (am.Pendaftaran.SkRektorMahasiswa[0].SkRektor.NamaFileFinal || am.Pendaftaran.SkRektorMahasiswa[0].SkRektor.NamaFile) ?? '' : '',
                        DaftarSk: am.Pendaftaran.SkRektorMahasiswa.filter(
                            (x) => x.SkRektor.JenisSkAsessmen !== null
                        ).map((x) => ({
                            SkRektorId: x.SkRektor.SkRektorId,
                            JenisSkAsessmen: x.SkRektor.JenisSkAsessmen!,
                            NomorSk: x.SkRektor.NomorSk,
                            // Yang diunduh adalah SK final dari Sisurat bila
                            // sudah diterima; lampiran hanya jadi cadangan.
                            NamaFile:
                                x.SkRektor.NamaFileFinal || x.SkRektor.NamaFile,
                            NamaDokumen: x.SkRektor.NamaDokumen,
                        })),
                        NomorHp: am.Pendaftaran.Mahasiswa.User.NomorHp ?? '',
                        PendaftaranId: am.PendaftaranId,
                        KodePendaftar: am.Pendaftaran.KodePendaftar,
                        Nim: am.Pendaftaran.DaftarUlang.length === 0 ? '' : am.Pendaftaran.DaftarUlang[0].Nim ?? '',
                        SkRektor: am.Pendaftaran.SkRektorMahasiswa.length > 0 ? true : false,
                    })) ?? []

                return c.json<{
                    data: ResponseSkRektorAsessmenType[]
                    page: number
                    limit: number
                    totalElement: number
                    totalPage: number
                    isFirst: boolean
                    isLast: boolean
                    hasNext: boolean
                    hasPrevious: boolean
                }>({
                    page: page,
                    limit: limit,
                    data: response,
                    totalElement: total,
                    totalPage: Math.ceil(total / limit),
                    isFirst: page === 1,
                    isLast:
                        page === Math.ceil(total / limit) ||
                        Math.ceil(total / limit) === 0,
                    hasNext: page < Math.ceil(total / limit),
                    hasPrevious: page > 1,
                })
            } else if (isAkademik) {
                let where: Prisma.AssesorMahasiswaWhereInput = search
                    ? {
                        AND: [
                            {
                                Pendaftaran: {
                                    OR: [
                                        {
                                            StatusMahasiswaAssesmentHistory: {
                                                some: {
                                                    Aktif: true,
                                                    StatusMahasiswaAssesment: {
                                                        NamaStatus: {
                                                            in: STATUS_SK_AKADEMIK,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                        ADA_SK_BERTANDA_TANGAN,
                                    ]
                                }
                            },
                            {
                                Pendaftaran: {
                                    OR: [
                                        {
                                            Mahasiswa: {
                                                User: {
                                                    Nama: {
                                                        contains: search,
                                                        mode: 'insensitive',
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            KodePendaftar: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                        {
                                            DaftarUlang: {
                                                some: {
                                                    Nim: {
                                                        contains: search,
                                                        mode: 'insensitive',
                                                    },
                                                    ProgramStudi: {
                                                        Nama: {
                                                            contains: search,
                                                            mode: 'insensitive',
                                                        }
                                                    },
                                                },
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    } : {
                        AND: [
                            {
                                Pendaftaran: {
                                    OR: [
                                        {
                                            StatusMahasiswaAssesmentHistory: {
                                                some: {
                                                    Aktif: true,
                                                    StatusMahasiswaAssesment: {
                                                        NamaStatus: {
                                                            in: STATUS_SK_AKADEMIK,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                        ADA_SK_BERTANDA_TANGAN,
                                    ]
                                }
                            },
                        ],
                    }
                const [data, total] = await Promise.all([
                    prisma.assesorMahasiswa.findMany({
                        distinct: ['PendaftaranId'],
                        where,
                        skip: (page - 1) * limit,
                        take: limit,
                        orderBy: { Pendaftaran: { KodePendaftar: 'asc' } },
                        select: {
                            PendaftaranId: true,
                            Pendaftaran: {
                                select: {
                                    KodePendaftar: true,
                                    SkRektorMahasiswa: {
                                        select: {
                                            SkRektor: {
                                                select: {
                                                    SkRektorId: true,
                                                    JenisSkAsessmen: true,
                                                    NamaFile: true,
                                                    NamaFileFinal: true,
                                                    NamaDokumen: true,
                                                    NomorSk: true,
                                                    Dipublikasikan: true,
                                                    Ditandatangani: true,
                                                    SisuratLetterId: true,
                                                    SisuratStatus: true,
                                                },
                                            },
                                        },
                                    },
                                    StatusMahasiswaAssesmentHistory: {
                                        select: {
                                            Aktif: true,
                                            StatusMahasiswaAssesment: {
                                                select: {
                                                    NamaStatus: true,
                                                },
                                            },
                                        },
                                    },
                                    DaftarUlang: {
                                        select: {
                                            Nim: true,
                                            ProgramStudi: {
                                                select: {
                                                    Nama: true,
                                                },
                                            }
                                        },
                                    },
                                    Mahasiswa: {
                                        select: {
                                            User: {
                                                select: {
                                                    Nama: true,
                                                    Email: true,
                                                    NomorHp: true,
                                                },
                                            },
                                        },
                                    },
                                }
                            },
                        },
                    }),
                    prisma.assesorMahasiswa.count({
                        where,
                    }),
                ])

                const response: ResponseSkRektorAsessmenType[] =
                    data?.map((am) => ({
                        Nama: am.Pendaftaran.Mahasiswa.User.Nama,
                        Email: am.Pendaftaran.Mahasiswa.User.Email,
                        Status: am.Pendaftaran.StatusMahasiswaAssesmentHistory.find(x => x.Aktif) ? am.Pendaftaran.StatusMahasiswaAssesmentHistory.find(x => x.Aktif)?.StatusMahasiswaAssesment.NamaStatus ?? '' : '',
                        ProgramStudi: am.Pendaftaran.DaftarUlang.length === 0 ? '' : am.Pendaftaran.DaftarUlang[0].ProgramStudi.Nama ?? '',
                        NomorSk: am.Pendaftaran.SkRektorMahasiswa.length > 0 ? am.Pendaftaran.SkRektorMahasiswa[0].SkRektor.NomorSk ?? '' : '',
                        NamaFile: am.Pendaftaran.SkRektorMahasiswa.length > 0 ? (am.Pendaftaran.SkRektorMahasiswa[0].SkRektor.NamaFileFinal || am.Pendaftaran.SkRektorMahasiswa[0].SkRektor.NamaFile) ?? '' : '',
                        DaftarSk: am.Pendaftaran.SkRektorMahasiswa.filter(
                            (x) => x.SkRektor.JenisSkAsessmen !== null
                        ).map((x) => ({
                            SkRektorId: x.SkRektor.SkRektorId,
                            JenisSkAsessmen: x.SkRektor.JenisSkAsessmen!,
                            NomorSk: x.SkRektor.NomorSk,
                            // Yang diunduh adalah SK final dari Sisurat bila
                            // sudah diterima; lampiran hanya jadi cadangan.
                            NamaFile:
                                x.SkRektor.NamaFileFinal || x.SkRektor.NamaFile,
                            NamaDokumen: x.SkRektor.NamaDokumen,
                        })),
                        NomorHp: am.Pendaftaran.Mahasiswa.User.NomorHp ?? '',
                        PendaftaranId: am.PendaftaranId,
                        KodePendaftar: am.Pendaftaran.KodePendaftar,
                        Nim: am.Pendaftaran.DaftarUlang.length === 0 ? '' : am.Pendaftaran.DaftarUlang[0].Nim ?? '',
                        SkRektor: am.Pendaftaran.SkRektorMahasiswa.length > 0 ? true : false,
                        // Nomor surat terbit lebih dulu daripada tanda tangan,
                        // jadi yang menentukan siap-publikasi adalah tanda
                        // tangan QR dari Sisurat (integrasi-rpl-sisurat §7).
                        SiapDipublikasikan:
                            am.Pendaftaran.SkRektorMahasiswa.length > 0 &&
                            am.Pendaftaran.SkRektorMahasiswa.every(
                                (x) => x.SkRektor.Ditandatangani
                            ),
                        SisuratStatus:
                            am.Pendaftaran.SkRektorMahasiswa[0]?.SkRektor
                                .SisuratStatus ?? '',
                        Dipublikasikan:
                            am.Pendaftaran.SkRektorMahasiswa.length > 0 &&
                            am.Pendaftaran.SkRektorMahasiswa.every(
                                (x) => x.SkRektor.Dipublikasikan
                            ),
                    })) ?? []

                return c.json<{
                    data: ResponseSkRektorAsessmenType[]
                    page: number
                    limit: number
                    totalElement: number
                    totalPage: number
                    isFirst: boolean
                    isLast: boolean
                    hasNext: boolean
                    hasPrevious: boolean
                }>({
                    page: page,
                    limit: limit,
                    data: response,
                    totalElement: total,
                    totalPage: Math.ceil(total / limit),
                    isFirst: page === 1,
                    isLast:
                        page === Math.ceil(total / limit) ||
                        Math.ceil(total / limit) === 0,
                    hasNext: page < Math.ceil(total / limit),
                    hasPrevious: page > 1,
                })
            } else {
                let where: Prisma.PendaftaranWhereInput = search
                    ? {
                        AND: [
                            {
                                OR: [
                                    {
                                        StatusMahasiswaAssesmentHistory: {
                                            some: {
                                                Aktif: true,
                                                StatusMahasiswaAssesment: {
                                                    NamaStatus: "Sinkronisasi Hasil Asessmen",
                                                },
                                            },
                                        },
                                    },
                                    {
                                        StatusMahasiswaAssesmentHistory: {
                                            some: {
                                                Aktif: true,
                                                StatusMahasiswaAssesment: {
                                                    NamaStatus: "Selesai",
                                                },
                                            },
                                        },
                                    },
                                ]
                            },
                            {
                                OR: [
                                    {
                                        DaftarUlang: {
                                            some: {
                                                Nim: {
                                                    contains: search,
                                                    mode: 'insensitive',
                                                },
                                                ProgramStudi: {
                                                    Nama: {
                                                        contains: search,
                                                        mode: 'insensitive',
                                                    }
                                                }
                                            },
                                        },
                                    },
                                    {
                                        KodePendaftar: {
                                            contains: search,
                                            mode: 'insensitive',
                                        },
                                    },
                                    {
                                        Mahasiswa: {
                                            User: {
                                                OR: [
                                                    {
                                                        NomorHp: {
                                                            contains: search,
                                                            mode: 'insensitive',
                                                        },
                                                        Nama: {
                                                            contains: search,
                                                            mode: 'insensitive',
                                                        },
                                                        Email: {
                                                            contains: search,
                                                            mode: 'insensitive',
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                    },
                                ],
                            },
                        ],
                    }
                    : {
                        AND: [
                            {
                                OR: [
                                    {
                                        StatusMahasiswaAssesmentHistory: {
                                            some: {
                                                Aktif: true,
                                                StatusMahasiswaAssesment: {
                                                    NamaStatus: "Sinkronisasi Hasil Asessmen",
                                                },
                                            },
                                        },
                                    },
                                    {
                                        StatusMahasiswaAssesmentHistory: {
                                            some: {
                                                Aktif: true,
                                                StatusMahasiswaAssesment: {
                                                    NamaStatus: "Selesai",
                                                },
                                            },
                                        },
                                    },
                                ]
                            },
                        ],
                    }

                const [data, total] = await Promise.all([
                    prisma.pendaftaran.findMany({
                        where,
                        skip: (page - 1) * limit,
                        take: limit,
                        orderBy: { KodePendaftar: 'asc' },
                        select: {
                            PendaftaranId: true,
                            KodePendaftar: true,
                            SkRektorMahasiswa: {
                                select: {
                                    SkRektor: {
                                        select: {
                                            SkRektorId: true,
                                            JenisSkAsessmen: true,
                                            NamaFile: true,
                                            NamaFileFinal: true,
                                            NamaDokumen: true,
                                            NomorSk: true,
                                            Ditandatangani: true,
                                            Dipublikasikan: true,
                                        },
                                    },
                                },
                            },
                            StatusMahasiswaAssesmentHistory: {
                                select: {
                                    Aktif: true,
                                    StatusMahasiswaAssesment: {
                                        select: {
                                            NamaStatus: true,
                                        },
                                    },
                                },
                            },
                            DaftarUlang: {
                                select: {
                                    Nim: true,
                                    ProgramStudi: {
                                        select: {
                                            Nama: true,
                                        },
                                    },
                                },
                            },
                            Mahasiswa: {
                                select: {
                                    User: {
                                        select: {
                                            Nama: true,
                                            Email: true,
                                            NomorHp: true,
                                        },
                                    },
                                },
                            },
                        },
                    }),
                    prisma.pendaftaran.count({
                        where,
                    }),
                ])

                const response: ResponseSkRektorAsessmenType[] =
                    data?.map((am) => ({
                        Nama: am.Mahasiswa.User.Nama,
                        Email: am.Mahasiswa.User.Email,
                        NomorHp: am.Mahasiswa.User.NomorHp ?? '',
                        ProgramStudi: am.DaftarUlang.length === 0 ? '' : am.DaftarUlang[0].ProgramStudi.Nama,
                        PendaftaranId: am.PendaftaranId,
                        NomorSk: am.SkRektorMahasiswa.length === 0 ? '' : am.SkRektorMahasiswa[0].SkRektor.NomorSk,
                        KodePendaftar: am.KodePendaftar,
                        Nim:
                            am.DaftarUlang.length === 0
                                ? ''
                                : am.DaftarUlang[0].Nim ?? '',
                        SkRektor: am.SkRektorMahasiswa.length > 0 ? true : false,
                        DaftarSk: am.SkRektorMahasiswa.filter(
                            (x) => x.SkRektor.JenisSkAsessmen !== null
                        ).map((x) => ({
                            SkRektorId: x.SkRektor.SkRektorId,
                            JenisSkAsessmen: x.SkRektor.JenisSkAsessmen!,
                            NomorSk: x.SkRektor.NomorSk,
                            // Yang diunduh adalah SK final dari Sisurat bila
                            // sudah diterima; lampiran hanya jadi cadangan.
                            NamaFile:
                                x.SkRektor.NamaFileFinal || x.SkRektor.NamaFile,
                            NamaDokumen: x.SkRektor.NamaDokumen,
                        })),
                        SiapDipublikasikan:
                            am.SkRektorMahasiswa.length > 0 &&
                            am.SkRektorMahasiswa.every(
                                (x) => x.SkRektor.Ditandatangani
                            ),
                        Dipublikasikan:
                            am.SkRektorMahasiswa.length > 0 &&
                            am.SkRektorMahasiswa.every(
                                (x) => x.SkRektor.Dipublikasikan
                            ),
                        NamaFile:
                            am.SkRektorMahasiswa.length > 0
                                ? (am.SkRektorMahasiswa[0].SkRektor
                                    .NamaFileFinal ||
                                    am.SkRektorMahasiswa[0].SkRektor.NamaFile) ??
                                ''
                                : '',
                        Status: am.StatusMahasiswaAssesmentHistory.find(x => x.Aktif) ? am.StatusMahasiswaAssesmentHistory.find(x => x.Aktif)?.StatusMahasiswaAssesment.NamaStatus ?? '' : ''
                    })) ?? []

                return c.json<{
                    data: ResponseSkRektorAsessmenType[]
                    page: number
                    limit: number
                    totalElement: number
                    totalPage: number
                    isFirst: boolean
                    isLast: boolean
                    hasNext: boolean
                    hasPrevious: boolean
                }>({
                    page: page,
                    limit: limit,
                    data: response,
                    totalElement: total,
                    totalPage: Math.ceil(total / limit),
                    isFirst: page === 1,
                    isLast:
                        page === Math.ceil(total / limit) ||
                        Math.ceil(total / limit) === 0,
                    hasNext: page < Math.ceil(total / limit),
                    hasPrevious: page > 1,
                })
            }
        }
        if (jenis === 'wa') {
            const PendaftaranId = c.req.query('PendaftaranId') ?? ''
            if (!PendaftaranId) c.json(null)

            const pendaftaran = await prisma.pendaftaran.findFirst({
                where: {
                    PendaftaranId: PendaftaranId
                },
                select: {
                    KodePendaftar: true,
                    Mahasiswa: {
                        select: {
                            User: {
                                select: {
                                    Nama: true,
                                    NomorWa: true
                                }
                            }
                        }
                    }
                }
            })


            if (!pendaftaran) c.json(null)

            const cookieHeader = (await cookies()).toString();

            const target = pendaftaran?.Mahasiswa.User.NomorWa ?? "";
            if (!target) return;

            const params = new URLSearchParams({
                target: String(target),
                message: `Halo ${pendaftaran?.Mahasiswa.User.Nama}, Surat Keputusan Hasil Asessmen RPL kamu terbit. Silakan cek melalui Sistem Informasi RPL Terpadu. Terima Kasih.`,
                jenis: "sendWaText",
            });

            await fetch(`${BASE_URL}/api/protected/whatsapp?${params.toString()}`, {
                method: "POST",
                headers: {
                    cookie: cookieHeader,
                    "Content-Type": "application/json",
                },
            });

            return c.json({
                status: 'success',
                message: 'message mwa has been sent',
                data: [],
            })
        }

        return c.json(
            {
                status: 'error',
                message: 'Query Salah',
                data: [],
            },
            404
        )
    }

    return c.json(
        {
            status: 'error',
            message: 'Data tidak ditemukan',
            data: [],
        },
        404
    )
})

app.post('/', async (c) => {
    const jenisAksi = c.req.query('jenis')

    // Penerbitan SK hasil asesmen dari template. Akademik memilih jenis SK
    // (Perolehan SKS / Transfer SKS) mengikuti mata kuliah yang diajukan
    // mahasiswa; satu mahasiswa bisa memerlukan salah satu atau keduanya.
    // Inisialisasi SK ke Sisurat. Aplikasi ini tidak lagi "membuat" SK resmi —
    // Akademik hanya mendorong inisialisasi, lalu persetujuan Wakil Rektor dan
    // tanda tangan Rektor berjalan di Sisurat. Berkas hasil render kita ikut
    // dikirim sebagai lampiran sekaligus dipakai sebagai arsip yang nanti
    // dipublikasikan ke mahasiswa.
    if (jenisAksi === 'kirim-sisurat') {
        const body: {
            PendaftaranId: string
            JenisSkAsessmen: JenisSkAsessmen
            NamaSk: string
            TahunSk: string
            /** Diisi hanya bila Akademik memilih template secara manual. */
            templateVersionId?: string
        } & ButirSk = await c.req.json()

        if (!body.PendaftaranId) {
            return c.json(
                { status: 'error', message: 'PendaftaranId perlu diisi', data: [] },
                { status: 400 }
            )
        }
        if (
            body.JenisSkAsessmen !== 'PEROLEHAN_SKS' &&
            body.JenisSkAsessmen !== 'TRANSFER_SKS'
        ) {
            return c.json(
                { status: 'error', message: 'Jenis SK tidak dikenal', data: [] },
                { status: 400 }
            )
        }
        // Template dicocokkan lewat kode yang stabil atau nama "SK Hasil
        // Asesmen RPL"; `templateVersionId` tidak pernah disimpan di kode karena
        // berganti setiap template diterbitkan ulang. Akademik tetap dapat
        // menunjuk template lain secara manual bila keduanya tidak ketemu.
        const kodeTemplate = KODE_TEMPLATE_RPL[body.JenisSkAsessmen]
        let template: TemplateSurat | null | undefined
        let peringatanTemplate = ''
        try {
            const daftarTemplate = await sisuratApi.templates()

            if (body.templateVersionId) {
                template = daftarTemplate.find(
                    (t) => t.templateVersionId === body.templateVersionId
                )
                if (!template) {
                    return c.json(
                        {
                            status: 'error',
                            message:
                                'Template yang dipilih tidak ada pada daftar template Sisurat',
                            data: [],
                        },
                        { status: 409 }
                    )
                }
                peringatanTemplate = `Template dipilih manual: ${template.nama}`
            } else {
                template = cariTemplateRpl(
                    daftarTemplate,
                    body.JenisSkAsessmen
                )
                if (template && template.kode !== kodeTemplate) {
                    peringatanTemplate = `Template dicocokkan lewat nama "${template.nama}", bukan kode ${kodeTemplate}`
                }
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'error'
            return c.json(
                {
                    status: 'error',
                    message: 'Gagal memuat template dari Sisurat: ' + message,
                    data: [],
                },
                { status: 502 }
            )
        }

        if (!template) {
            return c.json(
                {
                    status: 'error',
                    message: `Template ${kodeTemplate} maupun "${NAMA_TEMPLATE_RPL}" tidak ada di Sisurat. Minta admin Sisurat menerbitkannya, atau pilih template lain secara manual.`,
                    data: [],
                },
                { status: 409 }
            )
        }

        const info = await dataSuratRpl(body.PendaftaranId, body.JenisSkAsessmen)

        const perihal =
            body.Perihal?.trim() ||
            `${body.NamaSk} a.n. ${info.Nama || 'mahasiswa RPL'} Institut Teknologi Indonesia`

        if (perihal.length < 3) {
            return c.json(
                {
                    status: 'error',
                    message: 'Perihal minimal 3 karakter',
                    data: [],
                },
                { status: 400 }
            )
        }
        if (!body.NamaSk || !body.TahunSk) {
            return c.json(
                {
                    status: 'error',
                    message: 'Nama dan Tahun SK perlu diisi',
                    data: [],
                },
                { status: 400 }
            )
        }

        const skLama = await prisma.skRektorMahasiswa.findFirst({
            where: {
                PendaftaranId: body.PendaftaranId,
                SkRektor: { JenisSkAsessmen: body.JenisSkAsessmen },
            },
            select: {
                SkRektor: {
                    select: { SkRektorId: true, SisuratLetterId: true },
                },
            },
        })

        // Deret surat di Sisurat tidak dapat dibatalkan, jadi satu SK hanya
        // boleh diinisialisasi sekali.
        if (skLama?.SkRektor.SisuratLetterId) {
            return c.json(
                {
                    status: 'error',
                    message:
                        'SK ini sudah diinisialisasi ke Sisurat. Pantau statusnya lewat tombol Perbarui Status.',
                    data: [],
                },
                { status: 409 }
            )
        }

        const tipeSk = await prisma.tipeSkRektor.findFirst({
            where: { Nama: 'RPL' },
            select: { TipeSkRektorId: true },
        })

        if (!tipeSk) {
            return c.json(
                {
                    status: 'error',
                    message: "Tipe SK Rektor 'RPL' belum tersedia",
                    data: [],
                },
                { status: 400 }
            )
        }

        if (!info.NamaRektor) {
            return c.json(
                {
                    status: 'error',
                    message:
                        'Nama Rektor belum terdaftar pada data jabatan universitas — lengkapi lebih dulu karena dipakai sebagai signer.name di Sisurat',
                    data: [],
                },
                { status: 400 }
            )
        }

        const tanggalSurat = new Date().toISOString().slice(0, 10)
        const { fieldValues, belumTerisi } = susunFieldValues(
            info,
            body.JenisSkAsessmen,
            body,
            tanggalSurat,
            template.placeholders ?? [],
            template.fields
        )

        // Lampiran dirender dari template internal supaya isinya tetap mengikuti
        // data asesmen yang tersimpan.
        const cookieHeader = (await cookies()).toString()
        const params = new URLSearchParams({
            _id: body.PendaftaranId,
            _t: 'sk',
            _n: '(menunggu nomor Sisurat)',
            _j:
                body.JenisSkAsessmen === 'TRANSFER_SKS'
                    ? 'TRANSFER KREDIT'
                    : 'PEROLEHAN KREDIT',
        })

        const pdfRes = await fetch(
            `${BASE_URL}/api/protected/generate-pdf?${params.toString()}`,
            { headers: { cookie: cookieHeader } }
        )

        if (!pdfRes.ok) {
            return c.json(
                {
                    status: 'error',
                    message: 'Gagal merender lampiran SK dari template',
                    data: [],
                },
                { status: 502 }
            )
        }

        const buffer = Buffer.from(new Uint8Array(await pdfRes.arrayBuffer()))
        const filename = `${uuidv4()}.pdf`
        const namaDokumen = `${body.NamaSk}.pdf`

        const pathFile = await simpanBerkas(
            info.UserId,
            'sk',
            filename,
            buffer
        )

        // Dorong inisialisasi ke Sisurat sebelum menyimpan, supaya tidak ada
        // baris SK yang mengaku terkirim padahal gagal.
        let surat
        try {
            surat = await sisuratApi.inisialisasiSurat(
                {
                    templateVersionId: template.templateVersionId,
                    perihal,
                    fieldValues,
                    tanggalSurat,
                    externalReference: `RPL-${body.PendaftaranId}-${body.JenisSkAsessmen}`,
                },
                [{ namaFile: namaDokumen, data: buffer }]
            )
        } catch (error) {
            const message = error instanceof Error ? error.message : 'error'
            return c.json(
                {
                    status: 'error',
                    message: 'Gagal menginisialisasi surat di Sisurat: ' + message,
                    data: [],
                },
                { status: 502 }
            )
        }

        const sk = await prisma.$transaction(async (tx) => {
            const isi = {
                NamaSk: body.NamaSk,
                TahunSk: parseInt(body.TahunSk, 10),
                NamaFile: filename,
                NamaDokumen: namaDokumen,
                PathFile: pathFile,
                SisuratLetterId: surat.letterId,
                SisuratStatus: surat.status,
                SisuratStepKey: surat.currentStepKey,
                SisuratDiajukanPada: new Date(),
                UpdatedAt: new Date(),
            }

            if (skLama) {
                return tx.skRektor.update({
                    where: { SkRektorId: skLama.SkRektor.SkRektorId },
                    data: isi,
                })
            }

            const dibuat = await tx.skRektor.create({
                data: {
                    ...isi,
                    TipeSkRektorId: tipeSk.TipeSkRektorId,
                    JenisSkAsessmen: body.JenisSkAsessmen,
                    // Nomor resmi baru ada setelah tahap administrasi Sisurat.
                    NomorSk: '',
                    Disetujui: false,
                    CreatedAt: new Date(),
                },
            })

            await tx.skRektorMahasiswa.create({
                data: {
                    SkRektorId: dibuat.SkRektorId,
                    PendaftaranId: body.PendaftaranId,
                },
            })

            return dibuat
        })

        return c.json({
            status: 'success',
            message: 'SK diinisialisasi ke Sisurat dan masuk ke alurnya',
            data: {
                SkRektorId: sk.SkRektorId,
                JenisSkAsessmen: sk.JenisSkAsessmen,
                NamaSk: sk.NamaSk,
                NomorSk: sk.NomorSk,
                TahunSk: sk.TahunSk,
                NamaFile: sk.NamaFile,
                NamaDokumen: sk.NamaDokumen,
                SisuratLetterId: surat.letterId,
                SisuratStatus: surat.status,
                SisuratStepKey: surat.currentStepKey,
                Template: `${template.nama} (${kodeTemplate} v${template.versionNumber})`,
                Warnings: [
                    ...(surat.warnings ?? []),
                    ...(peringatanTemplate ? [peringatanTemplate] : []),
                    ...(belumTerisi.length > 0
                        ? [
                            `Placeholder template belum terisi: ${belumTerisi.join(', ')}`,
                        ]
                        : []),
                ],
            },
        })
    }

    // Tarik status terbaru surat dari Sisurat. Tidak ada webhook, jadi status
    // ditarik dari sini (doc/integrasi-rpl-sisurat.md §8).
    //
    // Nomor surat terbit pada tahap ADMINISTRATION, sedangkan tanda tangan QR
    // baru ada setelah SIGNING. Begitu dokumen final tersedia di Sisurat,
    // berkasnya diunduh dan disimpan di sini — itulah SK yang diunduh
    // mahasiswa (lihat doc/panduan-sisurat-kirim-sk-terbit.md).
    if (jenisAksi === 'perbarui-status') {
        const body: { PendaftaranId: string } = await c.req.json()

        const daftar = await prisma.skRektorMahasiswa.findMany({
            where: {
                PendaftaranId: body.PendaftaranId,
                SkRektor: { SisuratLetterId: { not: null } },
            },
            select: {
                Pendaftaran: {
                    select: { Mahasiswa: { select: { UserId: true } } },
                },
                SkRektor: {
                    select: {
                        SkRektorId: true,
                        SisuratLetterId: true,
                        JenisSkAsessmen: true,
                        NamaSk: true,
                        PathFile: true,
                        PathFileFinal: true,
                        NamaFileFinal: true,
                        Ditandatangani: true,
                    },
                },
            },
        })

        if (daftar.length === 0) {
            return c.json(
                {
                    status: 'error',
                    message: 'Belum ada SK yang diinisialisasi ke Sisurat',
                    data: [],
                },
                { status: 404 }
            )
        }

        // Pemilik berkas menentukan folder penyimpanan SK final.
        const pemilik = new Map(
            daftar.map((d) => [
                d.SkRektor.SkRektorId,
                d.Pendaftaran.Mahasiswa.UserId,
            ])
        )

        const hasil: {
            SkRektorId: string
            JenisSkAsessmen: JenisSkAsessmen | null
            SisuratStatus: string
            SisuratStepKey: string | null
            NomorSk: string
            Ditandatangani: boolean
            PerluRevisi: boolean
            Catatan: string
        }[] = []
        const galat: string[] = []

        for (const d of daftar) {
            const sk = d.SkRektor
            try {
                const st: StatusSurat = await sisuratApi.statusSurat(
                    sk.SisuratLetterId as string
                )

                const nomor = st.nomorSurat ?? ''
                const keputusan = st.lastDecision
                const perluRevisi =
                    STATUS_PERLU_REVISI.includes(st.status) ||
                    (keputusan?.decision
                        ? STATUS_PERLU_REVISI.includes(keputusan.decision)
                        : false)
                const catatan = perluRevisi ? (keputusan?.note ?? '') : ''

                const data: Prisma.SkRektorUpdateInput = {
                    SisuratStatus: st.status,
                    SisuratStepKey: st.currentStepKey,
                    UpdatedAt: new Date(),
                    ...(nomor
                        ? {
                            NomorSk: nomor,
                            NomorSuratSisurat: nomor,
                            NomorSuratPada: st.nomorSuratTerbitPada
                                ? new Date(st.nomorSuratTerbitPada)
                                : new Date(),
                        }
                        : {}),
                    // Catatan lama dibersihkan ketika surat kembali berjalan
                    // normal, supaya tidak menempel setelah dikirim ulang.
                    Catatan: catatan,
                }

                let ditandatangani = sk.Ditandatangani

                // Berkas SK final diambil dari Sisurat — bukan dirender ulang
                // di sini — karena dokumen resminya (kop, nomor, QR, seluruh
                // penanda tangan) hanya ada di sana. Diunduh sekali, saat
                // dokumen finalnya pertama kali tersedia.
                if (st.dokumenFinal && !sk.NamaFileFinal) {
                    try {
                        const dok = await sisuratApi.unduhDokumenFinal(
                            sk.SisuratLetterId as string
                        )

                        if (!dok) {
                            galat.push(
                                `${sk.NamaSk}: dokumen final belum dapat diunduh dari Sisurat, coba perbarui lagi`
                            )
                        } else {
                            const isi = Buffer.from(dok.data)

                            // Checksum dari Sisurat dipakai memastikan unduhan
                            // tidak terpotong sebelum berkasnya disimpan.
                            const sidik = createHash('sha256')
                                .update(isi)
                                .digest('hex')

                            if (
                                st.dokumenFinal.checksum &&
                                st.dokumenFinal.checksum.toLowerCase() !== sidik
                            ) {
                                galat.push(
                                    `${sk.NamaSk}: checksum dokumen final tidak cocok, unduhan diabaikan`
                                )
                            } else {
                                const namaFileFinal = `${uuidv4()}.pdf`
                                const pathFinal = await simpanBerkas(
                                    pemilik.get(sk.SkRektorId) ?? null,
                                    'sk-final',
                                    namaFileFinal,
                                    isi
                                )

                                if (sk.PathFileFinal) {
                                    await hapusBerkas(sk.PathFileFinal).catch(
                                        () => { }
                                    )
                                }

                                const ttd = st.signature
                                data.PathFileFinal = pathFinal
                                data.NamaFileFinal = namaFileFinal
                                data.SkFinalDiterimaPada = new Date()
                                data.Ditandatangani = true
                                data.TandaTanganPada = ttd?.signedAt
                                    ? new Date(ttd.signedAt)
                                    : new Date()
                                data.TandaTanganOleh = ttd?.officialName ?? null
                                data.QrVerifyUrl = ttd?.verifyUrl ?? null
                                data.QrOfficialNama = ttd?.officialName ?? null
                                data.QrOfficialJabatan =
                                    ttd?.officialPosition ?? null
                                ditandatangani = true
                            }
                        }
                    } catch (error) {
                        galat.push(
                            `${sk.NamaSk}: ${error instanceof Error ? error.message : 'gagal mengunduh dokumen final'}`
                        )
                    }
                }

                await prisma.skRektor.update({
                    where: { SkRektorId: sk.SkRektorId },
                    data,
                })

                hasil.push({
                    SkRektorId: sk.SkRektorId,
                    JenisSkAsessmen: sk.JenisSkAsessmen,
                    SisuratStatus: st.status,
                    SisuratStepKey: st.currentStepKey,
                    NomorSk: nomor,
                    Ditandatangani: ditandatangani,
                    PerluRevisi: perluRevisi,
                    Catatan: catatan,
                })
            } catch (error) {
                // Satu surat bermasalah tidak boleh menghentikan pembaruan SK
                // lainnya pada pendaftaran yang sama.
                const message = error instanceof Error ? error.message : 'error'
                galat.push(`${sk.NamaSk}: ${message}`)
            }
        }

        const semuaDitandatangani =
            hasil.length === daftar.length &&
            hasil.every((x) => x.Ditandatangani)
        const adaPerluRevisi = hasil.some((x) => x.PerluRevisi)

        return c.json({
            status: 'success',
            message: adaPerluRevisi
                ? 'Ada SK yang diminta diperbaiki oleh Sisurat'
                : semuaDitandatangani
                    ? 'Seluruh SK sudah ditandatangani dan siap dipublikasikan'
                    : 'Status surat diperbarui dari Sisurat',
            data: {
                Daftar: hasil,
                SemuaDitandatangani: semuaDitandatangani,
                AdaPerluRevisi: adaPerluRevisi,
                Galat: galat,
            },
        })
    }

    // Pratinjau surat dirender Sisurat sendiri (integrasi-rpl-sisurat §6.4),
    // supaya yang dilihat Akademik persis sama dengan surat yang nanti terbit.
    // Tidak membuat surat apa pun.
    if (jenisAksi === 'pratinjau-sisurat') {
        const body: {
            PendaftaranId: string
            JenisSkAsessmen: JenisSkAsessmen
            templateVersionId?: string
        } & ButirSk = await c.req.json()

        let template: TemplateSurat | null | undefined
        try {
            const daftar = await sisuratApi.templates()
            template = body.templateVersionId
                ? daftar.find(
                    (t) => t.templateVersionId === body.templateVersionId
                )
                : cariTemplateRpl(daftar, body.JenisSkAsessmen)
        } catch (error) {
            const message = error instanceof Error ? error.message : 'error'
            return c.json(
                {
                    status: 'error',
                    message: 'Gagal memuat template dari Sisurat: ' + message,
                    data: [],
                },
                { status: 502 }
            )
        }

        if (!template) {
            return c.json(
                {
                    status: 'error',
                    message: `Template ${KODE_TEMPLATE_RPL[body.JenisSkAsessmen]} maupun "${NAMA_TEMPLATE_RPL}" tidak ada di Sisurat`,
                    data: [],
                },
                { status: 409 }
            )
        }

        const info = await dataSuratRpl(body.PendaftaranId, body.JenisSkAsessmen)
        const tanggalSurat = new Date().toISOString().slice(0, 10)
        const { fieldValues } = susunFieldValues(
            info,
            body.JenisSkAsessmen,
            body,
            tanggalSurat,
            template.placeholders ?? [],
            template.fields
        )

        try {
            const pratinjau = await sisuratApi.pratinjauSurat(
                template.templateVersionId,
                { fieldValues, tanggalSurat }
            )

            if (!pratinjau) {
                return c.json(
                    {
                        status: 'error',
                        message:
                            'Sisurat pada server ini belum menyediakan pratinjau surat (POST /templates/{id}/preview). Isian tetap dapat dikirim.',
                        data: [],
                    },
                    { status: 501 }
                )
            }

            return c.json({
                status: 'success',
                message: 'Pratinjau dibuat',
                data: {
                    Html: pratinjau.html,
                    BelumTerisi: pratinjau.unfilled ?? [],
                    Template: `${pratinjau.nama ?? template.nama}${pratinjau.kode ? ` (${pratinjau.kode})` : ''}`,
                },
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'error'
            return c.json(
                {
                    status: 'error',
                    message: 'Gagal membuat pratinjau di Sisurat: ' + message,
                    data: [],
                },
                { status: 502 }
            )
        }
    }

    // Membuka kembali SK yang ditolak / diminta revisi Sisurat supaya dapat
    // diinisialisasi ulang. Sengaja manual: Sisurat tidak menolak inisialisasi
    // kedua dengan externalReference yang sama, jadi idempotensi ada di sini.
    if (jenisAksi === 'reset-sisurat') {
        const body: { SkRektorId: string; Paksa?: boolean } = await c.req.json()

        const sk = await prisma.skRektor.findFirst({
            where: { SkRektorId: body.SkRektorId },
            select: {
                SkRektorId: true,
                SisuratStatus: true,
                SisuratLetterId: true,
                NomorSk: true,
                Catatan: true,
                Ditandatangani: true,
                SkRektorMahasiswa: { select: { PendaftaranId: true }, take: 1 },
            },
        })

        const milik = sk?.SkRektorMahasiswa[0]

        if (!sk) {
            return c.json(
                { status: 'error', message: 'SK tidak ditemukan', data: [] },
                { status: 404 }
            )
        }

        if (sk.Ditandatangani) {
            return c.json(
                {
                    status: 'error',
                    message: 'SK sudah ditandatangani — tidak dapat diinisialisasi ulang',
                    data: [],
                },
                { status: 409 }
            )
        }

        const ditolak =
            !!sk.SisuratStatus && STATUS_PERLU_REVISI.includes(sk.SisuratStatus)

        // SK yang ditolak Sisurat boleh langsung dibuka. SK yang masih berjalan
        // hanya boleh dibatalkan dengan penegasan, karena suratnya sudah ada di
        // Sisurat: mengirim ulang akan membuat surat kedua, dan bila sudah
        // bernomor, satu nomor deret terpakai sia-sia.
        if (!ditolak && !body.Paksa) {
            return c.json(
                {
                    status: 'error',
                    message:
                        'SK masih berjalan di alur Sisurat. Batalkan dari Sisurat lebih dulu, atau ulangi dengan penegasan bila surat di sana memang akan ditinggalkan.',
                    data: [],
                },
                { status: 409 }
            )
        }

        // Jejak surat yang ditinggalkan dicatat ke log server, bukan ke kolom
        // Catatan: kolom itu tampil di antarmuka sebagai "Catatan dari Sisurat"
        // dan hanya untuk alasan penolakan dari penyetuju. Menumpuk jejak
        // internal di sana membuat Akademik membaca pesan yang bukan untuknya.
        if (sk.SisuratLetterId) {
            console.warn(
                `[sk-rektor] pengiriman dibatalkan — SkRektor ${sk.SkRektorId}, surat Sisurat ${sk.SisuratLetterId}${sk.NomorSk ? ` (nomor ${sk.NomorSk})` : ''}, ${ditolak ? 'setelah ditolak' : 'saat masih berjalan'}`
            )
        }

        await prisma.skRektor.update({
            where: { SkRektorId: sk.SkRektorId },
            data: {
                SisuratLetterId: null,
                SisuratStatus: null,
                SisuratStepKey: null,
                SisuratDiajukanPada: null,
                NomorSk: '',
                NomorSuratSisurat: null,
                NomorSuratPada: null,
                // Catatan penolakan lama tidak lagi berlaku untuk surat baru.
                Catatan: '',
                UpdatedAt: new Date(),
            },
        })

        // Bila tidak ada lagi SK yang tertaut Sisurat, berkas kembali menjadi
        // pekerjaan Akademik — antarmuka memundurkan statusnya agar kartu
        // penerbitan terbuka lagi.
        const masihTerkirim = await prisma.skRektorMahasiswa.count({
            where: {
                PendaftaranId: milik?.PendaftaranId ?? '__tidak-ada__',
                SkRektor: { SisuratLetterId: { not: null } },
            },
        })

        return c.json({
            status: 'success',
            message: ditolak
                ? 'SK dibuka kembali dan dapat dikirim ulang ke Sisurat'
                : `Pengiriman dibatalkan. Surat ${sk.SisuratLetterId} tetap ada di Sisurat — batalkan juga di sana agar tidak berganda.`,
            data: {
                SkRektorId: sk.SkRektorId,
                LetterIdDitinggalkan: sk.SisuratLetterId,
                PendaftaranId: milik?.PendaftaranId ?? null,
                TidakAdaLagiTerkirim: masihTerkirim === 0,
            },
        })
    }

    // Publikasi SK ke mahasiswa. SK yang sudah ditandatangani Rektor baru
    // terlihat mahasiswa setelah Akademik mempublikasikannya; sebelum itu
    // berkas ditahan.
    if (jenisAksi === 'publikasi') {
        const body: { PendaftaranId: string; Publikasikan: boolean } =
            await c.req.json()

        if (!body.PendaftaranId) {
            return c.json(
                { status: 'error', message: 'PendaftaranId perlu diisi', data: [] },
                { status: 400 }
            )
        }

        const skMahasiswa = await prisma.skRektorMahasiswa.findMany({
            where: {
                PendaftaranId: body.PendaftaranId,
                SkRektor: { JenisSkAsessmen: { not: null } },
            },
            select: {
                SkRektor: {
                    select: {
                        SkRektorId: true,
                        NomorSk: true,
                        Ditandatangani: true,
                    },
                },
            },
        })

        if (skMahasiswa.length === 0) {
            return c.json(
                {
                    status: 'error',
                    message: 'Belum ada SK hasil asesmen untuk pendaftaran ini',
                    data: [],
                },
                { status: 404 }
            )
        }

        // Nomor surat BUKAN tanda selesai — di Sisurat nomor terbit pada tahap
        // ADMINISTRATION, satu tahap sebelum SIGNING. Syarat publikasi adalah
        // tanda tangan QR sudah ada (doc/integrasi-rpl-sisurat.md §7).
        const belumTtd = skMahasiswa.filter((x) => !x.SkRektor.Ditandatangani)

        if (body.Publikasikan && belumTtd.length > 0) {
            return c.json(
                {
                    status: 'error',
                    message: `Masih ada ${belumTtd.length} SK yang belum ditandatangani di Sisurat`,
                    data: [],
                },
                { status: 409 }
            )
        }

        await prisma.skRektor.updateMany({
            where: {
                SkRektorId: {
                    in: skMahasiswa.map((x) => x.SkRektor.SkRektorId),
                },
            },
            data: {
                Dipublikasikan: body.Publikasikan,
                DipublikasikanPada: body.Publikasikan ? new Date() : null,
                UpdatedAt: new Date(),
            },
        })

        // Mahasiswa hanya dikabari ketika SK benar-benar dipublikasikan.
        if (body.Publikasikan) {
            const cookieHeader = (await cookies()).toString()
            const mhs = await prisma.pendaftaran.findFirst({
                where: { PendaftaranId: body.PendaftaranId },
                select: {
                    Mahasiswa: {
                        select: { User: { select: { Nama: true, NomorWa: true } } },
                    },
                },
            })

            const target = mhs?.Mahasiswa.User.NomorWa ?? ''
            if (target) {
                const params = new URLSearchParams({
                    target: String(target),
                    message: `Halo, ${mhs?.Mahasiswa.User.Nama}. SK Penetapan Hasil Asessmen anda sudah diterbitkan dan dapat diunduh melalui Sistem Informasi RPL Terpadu ITI. Terima Kasih.`,
                    jenis: 'sendWaText',
                })

                await fetch(
                    `${BASE_URL}/api/protected/whatsapp?${params.toString()}`,
                    {
                        method: 'POST',
                        headers: {
                            cookie: cookieHeader,
                            'Content-Type': 'application/json',
                        },
                    }
                ).catch(() => undefined)
            }
        }

        // Publikasi menutup tahap SK: berkas naik ke Sinkronisasi Hasil
        // Asessmen. Bila publikasinya ditahan kembali, berkas turun lagi ke
        // tahap pemantauan Sisurat. Dijalankan di sini supaya berlaku sama dari
        // halaman daftar maupun halaman detail.
        const statusTujuan = body.Publikasikan ? 'sha' : 'pss'
        const namaStatus = body.Publikasikan
            ? 'Sinkronisasi Hasil Asessmen'
            : 'Proses SK di Sisurat'

        const kukiStatus = (await cookies()).toString()
        const resStatus = await fetch(
            `${BASE_URL}/api/protected/status?p=${encodeURIComponent(body.PendaftaranId)}&j=${statusTujuan}`,
            { headers: { cookie: kukiStatus } }
        ).catch(() => null)

        const statusBerubah = !!resStatus?.ok

        return c.json({
            status: 'success',
            message: body.Publikasikan
                ? statusBerubah
                    ? 'SK dipublikasikan ke mahasiswa dan berkas naik ke Sinkronisasi Hasil Asessmen'
                    : 'SK dipublikasikan ke mahasiswa, tetapi status berkas gagal dimajukan'
                : 'Publikasi SK ditahan',
            data: {
                Dipublikasikan: body.Publikasikan,
                Status: statusBerubah ? namaStatus : null,
            },
        })
    }

    return c.json(
        {
            status: 'error',
            message:
                'Unggah SK manual tidak lagi didukung. Terbitkan SK dari template.',
            data: [],
        },
        { status: 400 }
    )
})

export const GET = handle(app)
export const POST = handle(app)

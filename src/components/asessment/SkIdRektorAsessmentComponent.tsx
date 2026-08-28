'use client'
import React from 'react'
import { safeStorage } from '@/lib/safe-storage'
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../ui/card'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableRow,
} from '../ui/table'
import { Badge } from '../ui/badge'
import { ResponseFinalAsessmenAsesorDetailType } from '@/types/FinalAsessmen'
import {
    getFileSkAsessmenBlobByNamafile,
    kirimSkKeSisurat,
    perbaruiStatusSisurat,
    getTemplateSisurat,
    resetSkSisurat,
    setPublikasiSkAsessmen,
    type DaftarTemplateSisurat,
} from '@/services/Asessment/SkRektorAsessmenService'
import { toast } from 'sonner'
import Swal from '@/lib/swal'
import { Button } from '../ui/button'
import {
    CheckCircle2Icon,
    CloudUploadIcon,
    RefreshCwIcon,
    ScanEyeIcon,
    TimerIcon,
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select'
import { Input } from '../ui/input'
import {
    setStatusPenerbitanSKAsessmen,
    setStatusProsesSkSisurat,
} from '@/services/Status/StatusService'
import { formatDateToIndonesian } from '@/lib/utils'
import { pratinjauSkSisurat } from '@/services/Asessment/SkRektorAsessmenService'
import EditorButirSk, {
    butirTerkirim,
    penandaButir,
    type GayaNomor,
} from './EditorButirSk'
import { diktumBakuSk } from '@/lib/diktum-sk-rpl'
import { Label } from '../ui/label'

export type JenisSkAsessmenType = 'PEROLEHAN_SKS' | 'TRANSFER_SKS'

/** Empat diktum SK yang isinya disusun Akademik. */
type KunciDiktum = 'Menimbang' | 'Mengingat' | 'Memperhatikan' | 'Menetapkan'

export type SkAsessmenItem = {
    SkRektorId: string
    JenisSkAsessmen: JenisSkAsessmenType
    NamaSk: string
    NomorSk: string
    TahunSk: string
    NamaFile: string
    /** Berkas SK final dari Sisurat; kosong bila belum dikirim balik. */
    NamaFileFinal?: string | null
    NamaDokumen: string
    Disetujui: boolean
    Ditandatangani: boolean
    Dipublikasikan?: boolean
    Catatan: string
    /** Identitas surat di Sisurat; kosong bila belum diinisialisasi ke sana. */
    SisuratLetterId?: string | null
    SisuratStatus?: string | null
}

/**
 * Kode template SK RPL di Sisurat. Server yang mencocokkannya; di sini hanya
 * dipakai untuk menampilkan template mana yang terpakai.
 */
const KODE_TEMPLATE: Record<JenisSkAsessmenType, string> = {
    PEROLEHAN_SKS: 'TPL-SK-RPL-PEROLEHAN',
    TRANSFER_SKS: 'TPL-SK-RPL-TRANSFER',
}

/** Status Sisurat yang menuntut perbaikan dari Akademik. */
const STATUS_PERLU_REVISI = ['REJECTED', 'REVISION_REQUESTED', 'CANCELLED']

/** Alur WF-SK-RPL: 6 tahap, tanpa peninjauan unit maupun distribusi. */
const LABEL_STATUS_SISURAT: Record<string, string> = {
    SUBMITTED: 'Masuk alur Sisurat',
    PENDING_VICE_RECTOR_APPROVALS: 'Menunggu Wakil Rektor A',
    PENDING_RECTOR_APPROVAL: 'Menunggu Rektor',
    PENDING_ADMINISTRATION: 'Menunggu penomoran Tata Usaha',
    PENDING_SIGNATURE: 'Bernomor, menunggu tanda tangan',
    COMPLETED: 'Selesai & diarsipkan',
    REVISION_REQUESTED: 'Diminta perbaikan',
    REJECTED: 'Ditolak',
    CANCELLED: 'Dibatalkan',
}

const LABEL_JENIS_SK: Record<JenisSkAsessmenType, string> = {
    PEROLEHAN_SKS: 'SK Perolehan SKS',
    TRANSFER_SKS: 'SK Transfer SKS',
}

/**
 * Kedua jenis SK selalu ditawarkan; Akademik yang memutuskan menerbitkan salah
 * satu atau keduanya sesuai kebutuhan mahasiswa.
 */
export const SEMUA_JENIS_SK: JenisSkAsessmenType[] = [
    'PEROLEHAN_SKS',
    'TRANSFER_SKS',
]

const SkIdRektorAsessmentComponent = ({
    dataServer,
    stats,
    skAsessmen,
}: {
    dataServer: ResponseFinalAsessmenAsesorDetailType
    stats: { StatusMahasiswaAssesmentId: string; NamaStatus: string }
    skAsessmen: SkAsessmenItem[]
}) => {
    const [statusServer, setStatusServer] = React.useState<{ StatusMahasiswaAssesmentId: string; NamaStatus: string }>({
        StatusMahasiswaAssesmentId: stats.StatusMahasiswaAssesmentId, NamaStatus: stats.NamaStatus
    })
    const [role, setRole] = React.useState<{
        GuardName: string
        Icon: string
        Name: string
        RoleId: string
    } | null>(null)
    const [loading, setLoading] = React.useState<boolean>(false)
    // Satu pratinjau per SK: berkasnya adalah PDF final dari Sisurat begitu
    // surat terbit, menggantikan lampiran yang dirender aplikasi ini.
    const [pratinjauSk, setPratinjauSk] = React.useState<
        Record<string, string>
    >({})
    const [daftarSk, setDaftarSk] =
        React.useState<SkAsessmenItem[]>(skAsessmen)

    React.useEffect(() => {
        if (!role) {
            const rolelogin = safeStorage.getItem('pmb.iti.role')
            if (rolelogin) {
                let temp = JSON.parse(rolelogin)
                setRole(temp)
            }
        }
    }, [])

    // Berkas tiap SK dimuat sebagai blob supaya dapat ditampilkan langsung di
    // halaman, tanpa perlu menekan tombol satu per satu.
    React.useEffect(() => {
        let batal = false
        Promise.all(
            daftarSk
                .map((x) => ({ sk: x, berkas: x.NamaFileFinal || x.NamaFile }))
                .filter((x) => !!x.berkas)
                .map(async ({ sk, berkas }) => {
                    try {
                        return [
                            sk.SkRektorId,
                            await getFileSkAsessmenBlobByNamafile(berkas),
                        ] as const
                    } catch {
                        return null
                    }
                })
        ).then((hasil) => {
            if (batal) return
            setPratinjauSk(
                Object.fromEntries(hasil.filter((x) => x !== null))
            )
        })
        return () => {
            batal = true
        }
    }, [daftarSk])


    // Setelah didorong ke Sisurat, persetujuan Wakil Rektor A, persetujuan
    // Rektor, penomoran, dan tanda tangan berjalan di sana. Aplikasi hanya
    // menandai bahwa berkas sedang diproses lalu menarik statusnya.
    const adaSkDikirim = daftarSk.some((x) => !!x.SisuratLetterId)
    // Nomor surat terbit satu tahap sebelum tanda tangan, jadi yang menentukan
    // boleh-tidaknya publikasi adalah tanda tangan QR dari Sisurat.
    const semuaDitandatangani =
        daftarSk.length > 0 && daftarSk.every((x) => x.Ditandatangani)
    const adaPerluRevisi = daftarSk.some(
        (x) => !!x.SisuratStatus && STATUS_PERLU_REVISI.includes(x.SisuratStatus)
    )
    const sudahDipublikasikan =
        daftarSk.length > 0 && daftarSk.every((x) => x.Dipublikasikan)

    const lanjutkanKeSisurat = async () => {
        setLoading(true)
        try {
            await setStatusProsesSkSisurat(dataServer.PendaftaranId)
            toast('Berkas ditandai sedang diproses di Sisurat')
            setStatusServer({
                StatusMahasiswaAssesmentId:
                    statusServer.StatusMahasiswaAssesmentId,
                NamaStatus: 'Proses SK di Sisurat',
            })
        } catch (err) {
            toast(
                err instanceof Error
                    ? err.message
                    : 'Gagal memperbarui status pendaftaran'
            )
        } finally {
            setLoading(false)
        }
    }

    // Sisurat tidak mengirim notifikasi balik, jadi status ditarik manual.
    const perbaruiStatus = async () => {
        setLoading(true)
        try {
            const res = await perbaruiStatusSisurat(dataServer.PendaftaranId)
            toast(res.message)
            res.data.Galat.forEach((g) => toast(g))
            setDaftarSk((prev) =>
                prev.map((x) => {
                    const terbaru = res.data.Daftar.find(
                        (d) => d.SkRektorId === x.SkRektorId
                    )
                    return terbaru
                        ? {
                            ...x,
                            SisuratStatus: terbaru.SisuratStatus,
                            NomorSk: terbaru.NomorSk,
                            Ditandatangani: terbaru.Ditandatangani,
                            Catatan: terbaru.Catatan || x.Catatan,
                        }
                        : x
                })
            )

            // SK yang ditolak Sisurat mengembalikan berkas ke tangan Akademik.
            if (res.data.AdaPerluRevisi) {
                await setStatusPenerbitanSKAsessmen(dataServer.PendaftaranId)
                setStatusServer({
                    StatusMahasiswaAssesmentId:
                        statusServer.StatusMahasiswaAssesmentId,
                    NamaStatus: 'Penerbitan SK Asessmen',
                })
            }
        } catch (err) {
            toast(
                err instanceof Error
                    ? err.message
                    : 'Gagal memperbarui status dari Sisurat'
            )
        } finally {
            setLoading(false)
        }
    }

    // SK yang sudah bernomor resmi baru terlihat mahasiswa setelah
    // dipublikasikan Akademik; bisa ditahan kembali bila perlu.
    const ubahPublikasi = async (publikasikan: boolean) => {
        setLoading(true)
        try {
            const res = await setPublikasiSkAsessmen(
                dataServer.PendaftaranId,
                publikasikan
            )
            toast(res.message)
            setDaftarSk((prev) =>
                prev.map((x) => ({ ...x, Dipublikasikan: publikasikan }))
            )
            if (res.data.Status) {
                setStatusServer({
                    StatusMahasiswaAssesmentId:
                        statusServer.StatusMahasiswaAssesmentId,
                    NamaStatus: res.data.Status,
                })
            }
        } catch (err) {
            toast(
                err instanceof Error
                    ? err.message
                    : 'Gagal mengubah publikasi SK'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="grid grid-cols-1 gap-3">
            <div className="">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Informasi Pendaftaran Mahasiswa</CardTitle>
                        <CardDescription>
                            Informasi Umum mengenai Jalur Masuk Pendaftaran
                            Mahasiswa
                        </CardDescription>
                        <CardAction></CardAction>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-3">
                            <Table>
                                <TableCaption>Informasi Profil</TableCaption>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Nama</TableCell>
                                        <TableCell>{dataServer.Nama}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Tempat Lahir</TableCell>
                                        <TableCell>
                                            {dataServer.TempatLahir}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Tanggal Lahir</TableCell>
                                        <TableCell>
                                            {dataServer.TanggalLahir
                                                ? formatDateToIndonesian(
                                                    dataServer.TanggalLahir.toString()
                                                )
                                                : '-'}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Email</TableCell>
                                        <TableCell>
                                            {dataServer.Email}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Agama</TableCell>
                                        <TableCell>
                                            {dataServer.Agama}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Nomor HP</TableCell>
                                        <TableCell>
                                            {dataServer.NomorHp}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <Table>
                                <TableCaption>Asesor</TableCaption>
                                <TableBody>
                                    {dataServer.AssesorMahasiswa.map((am) => (
                                        <React.Fragment key={am.Urutan}>
                                            <TableRow>
                                                <TableCell>
                                                    Nama Asesor {am.Urutan}
                                                </TableCell>
                                                <TableCell>{am.Nama}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Urutan</TableCell>
                                                <TableCell>
                                                    {am.Urutan}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    Konfirmasi
                                                </TableCell>
                                                <TableCell>
                                                    {am.Confirmation ? (
                                                        <Badge
                                                            variant={'default'}
                                                        >
                                                            Ya
                                                        </Badge>
                                                    ) : (
                                                        <Badge
                                                            variant={'default'}
                                                        >
                                                            Tidak
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        </React.Fragment>
                                    ))}
                                </TableBody>
                            </Table>
                            <Table>
                                <TableCaption>Jalur Masuk</TableCaption>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Jalur Masuk</TableCell>
                                        <TableCell>
                                            {dataServer.JalurPendaftaran}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Kode Pendaftaran</TableCell>
                                        <TableCell>
                                            {dataServer.KodePendaftar}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>No. Ujian</TableCell>
                                        <TableCell>
                                            {dataServer.NoUjian}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>NIM</TableCell>
                                        <TableCell>{dataServer.Nim}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Gelombang</TableCell>
                                        <TableCell>
                                            {dataServer.Gelombang}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <Table>
                                <TableCaption>
                                    Informasi Program Studi
                                </TableCaption>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            Nama Program Studi
                                        </TableCell>
                                        <TableCell>
                                            {dataServer.ProgramStudi.Nama}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Jenjang</TableCell>
                                        <TableCell>
                                            {dataServer.ProgramStudi.Jenjang}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Akreditasi</TableCell>
                                        <TableCell>
                                            {dataServer.ProgramStudi.Akreditasi}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Sistem Kuliah</TableCell>
                                        <TableCell>
                                            {dataServer.SistemKuliah}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Periode</TableCell>
                                        <TableCell>
                                            {dataServer.Periode}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
            {daftarSk.length > 0 && (
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Dokumen SK</CardTitle>
                            <CardDescription>
                                Berkas yang sudah ditandatangani adalah SK final
                                dari Sisurat — itulah yang diunduh mahasiswa.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-6">
                                {daftarSk.map((x) => (
                                    <div key={x.SkRektorId}>
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <span className="font-semibold">
                                                {LABEL_JENIS_SK[x.JenisSkAsessmen]}
                                            </span>
                                            {x.NamaFileFinal ? (
                                                <Badge className="bg-green-600">
                                                    SK final dari Sisurat —{' '}
                                                    {x.NomorSk || 'tanpa nomor'}
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary">
                                                    Lampiran hasil asesmen —
                                                    SK final dari Sisurat belum
                                                    diterima
                                                </Badge>
                                            )}
                                        </div>
                                        {pratinjauSk[x.SkRektorId] ? (
                                            <iframe
                                                src={pratinjauSk[x.SkRektorId]}
                                                title={`Dokumen ${LABEL_JENIS_SK[x.JenisSkAsessmen]}`}
                                                width="100%"
                                                height="500px"
                                                className="border rounded"
                                            />
                                        ) : (
                                            <p className="text-sm text-muted-foreground">
                                                Berkas belum dapat dimuat.
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
            {role?.Name.match('Akademik') && (
                <div className="grid grid-cols-1 gap-3">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Status & Publikasi SK</CardTitle>
                            <CardDescription>
                                Penyusunan dan pengiriman SK dilakukan di menu
                                Hasil Asessmen. Halaman ini untuk memantau
                                prosesnya di Sisurat, membaca SK final yang
                                sudah terbit, lalu mempublikasikannya ke
                                mahasiswa.
                            </CardDescription>
                            <CardAction></CardAction>
                        </CardHeader>
                        <CardContent>
                            {adaSkDikirim && (
                                <div className="p-4 mt-5 border rounded-lg bg-muted/40">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div>
                                            <h4 className="font-semibold">
                                                Status di Sisurat
                                            </h4>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Nomor surat terbit pada tahap
                                                penomoran, tanda tangan QR pada
                                                tahap sesudahnya. SK baru boleh
                                                dipublikasikan setelah
                                                ditandatangani.
                                            </p>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            disabled={loading}
                                            onClick={() => perbaruiStatus()}
                                        >
                                            {loading ? (
                                                <React.Fragment>
                                                    <TimerIcon /> Loading
                                                </React.Fragment>
                                            ) : (
                                                <React.Fragment>
                                                    <RefreshCwIcon /> Perbarui
                                                    Status
                                                </React.Fragment>
                                            )}
                                        </Button>
                                    </div>
                                    <Table className="mt-3">
                                        <TableBody>
                                            {daftarSk
                                                .filter(
                                                    (x) => !!x.SisuratLetterId
                                                )
                                                .map((x) => (
                                                    <TableRow key={x.SkRektorId}>
                                                        <TableCell>
                                                            {
                                                                LABEL_JENIS_SK[
                                                                x
                                                                    .JenisSkAsessmen
                                                                ]
                                                            }
                                                        </TableCell>
                                                        <TableCell className="font-mono text-xs">
                                                            {x.SisuratLetterId}
                                                        </TableCell>
                                                        <TableCell>
                                                            {LABEL_STATUS_SISURAT[
                                                                x.SisuratStatus ??
                                                                ''
                                                            ] ??
                                                                x.SisuratStatus ??
                                                                '-'}
                                                        </TableCell>
                                                        <TableCell>
                                                            {x.NomorSk !== '' ? (
                                                                <Badge variant="outline">
                                                                    {x.NomorSk}
                                                                </Badge>
                                                            ) : (
                                                                <Badge variant="secondary">
                                                                    Belum
                                                                    bernomor
                                                                </Badge>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {x.Ditandatangani ? (
                                                                <Badge className="bg-green-600">
                                                                    Ditandatangani
                                                                </Badge>
                                                            ) : (
                                                                <Badge variant="secondary">
                                                                    Belum
                                                                    ditandatangani
                                                                </Badge>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}

                            {semuaDitandatangani && (
                                <div className="p-4 mt-5 border rounded-lg bg-primary/5 border-primary/20">
                                    <h4 className="font-semibold">
                                        Publikasi ke Mahasiswa
                                    </h4>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Seluruh SK sudah bernomor dan
                                        ditandatangani di Sisurat; QR verifikasi
                                        sudah ditempel pada berkas.
                                        {sudahDipublikasikan
                                            ? ' SK sudah dapat diunduh mahasiswa.'
                                            : ' SK masih ditahan dan belum terlihat mahasiswa.'}
                                    </p>
                                    <div className="flex flex-wrap gap-3 mt-3">
                                        <Button
                                            type="button"
                                            disabled={loading}
                                            variant={
                                                sudahDipublikasikan
                                                    ? 'outline'
                                                    : 'default'
                                            }
                                            onClick={() =>
                                                ubahPublikasi(
                                                    !sudahDipublikasikan
                                                )
                                            }
                                        >
                                            {loading ? (
                                                <React.Fragment>
                                                    <TimerIcon /> Loading
                                                </React.Fragment>
                                            ) : sudahDipublikasikan ? (
                                                <React.Fragment>
                                                    <CloudUploadIcon /> Tahan
                                                    Publikasi
                                                </React.Fragment>
                                            ) : (
                                                <React.Fragment>
                                                    <CloudUploadIcon />{' '}
                                                    Publikasikan ke Mahasiswa
                                                </React.Fragment>
                                            )}
                                        </Button>
                                        <Badge
                                            className={
                                                sudahDipublikasikan
                                                    ? 'bg-green-600'
                                                    : ''
                                            }
                                            variant={
                                                sudahDipublikasikan
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                        >
                                            {sudahDipublikasikan
                                                ? 'Dipublikasikan'
                                                : 'Ditahan'}
                                        </Badge>
                                    </div>
                                </div>
                            )}

                            {adaPerluRevisi && (
                                <Alert variant="destructive" className="mt-5">
                                    <AlertTitle>
                                        Sisurat meminta perbaikan
                                    </AlertTitle>
                                    <AlertDescription>
                                        Baca catatan pada kartu SK terkait,
                                        perbaiki isinya, lalu tekan{' '}
                                        <b>Perbaiki &amp; Kirim Ulang</b> untuk
                                        menginisialisasi surat baru di Sisurat.
                                    </AlertDescription>
                                </Alert>
                            )}

                            {!adaPerluRevisi &&
                                statusServer.NamaStatus ===
                                'Proses SK di Sisurat' && (
                                    <Alert className="mt-5">
                                        <CheckCircle2Icon className="w-4 h-4" />
                                        <AlertTitle>
                                            Sedang Diproses di Sisurat
                                        </AlertTitle>
                                        <AlertDescription>
                                            Persetujuan Wakil Rektor A,
                                            persetujuan Rektor, penomoran, dan
                                            tanda tangan QR dikerjakan di
                                            Sisurat. Aplikasi ini menunggu tanda
                                            tangan terbit sebelum SK dapat
                                            dipublikasikan ke mahasiswa.
                                        </AlertDescription>
                                    </Alert>
                                )}

                            <div className="flex justify-center w-full my-5 gap-5">
                                {statusServer.NamaStatus ===
                                    'Penerbitan SK Asessmen' && (
                                        <Button
                                            type="button"
                                            onClick={() => lanjutkanKeSisurat()}
                                            disabled={loading || !adaSkDikirim}
                                            title={
                                                adaSkDikirim
                                                    ? ''
                                                    : 'Kirim minimal satu SK ke Sisurat lebih dulu'
                                            }
                                            className="w-full transition-all duration-100 cursor-pointer hover:scale-110 active:scale-90 lg:w-1/3 md:w-1/2"
                                        >
                                            {loading ? (
                                                <React.Fragment>
                                                    <TimerIcon /> Loading
                                                </React.Fragment>
                                            ) : (
                                                <React.Fragment>
                                                    <CloudUploadIcon /> Tandai
                                                    Diproses di Sisurat
                                                </React.Fragment>
                                            )}
                                        </Button>
                                    )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}

export default SkIdRektorAsessmentComponent

export function KartuPenerbitanSk({
    jenis,
    PendaftaranId,
    namaMahasiswa,
    programStudi,
    periode,
    sk,
    terkunci,
    jumlahMk,
    template,
    memuatTemplate,
    galatTemplate,
    onMuatUlangTemplate,
    onTerbit,
    onReset,
}: {
    jenis: JenisSkAsessmenType
    PendaftaranId: string
    /** Dipakai menyusun butir baku diktum sesuai SK yang berlaku. */
    namaMahasiswa: string
    programStudi: string
    /** Periode pendaftaran; dipakai sebagai semester bawaan pada diktum. */
    periode?: string
    sk?: SkAsessmenItem
    terkunci: boolean
    /** Jumlah mata kuliah mahasiswa berjenis ini — sekadar informasi. */
    jumlahMk?: number
    /** Daftar template Sisurat beserta hasil pencocokan template SK RPL. */
    template: DaftarTemplateSisurat
    /** Sedang menarik daftar template dari Sisurat. */
    memuatTemplate?: boolean
    /** Pesan galat saat menarik template; kosong bila berhasil. */
    galatTemplate?: string | null
    /** Mencoba menarik ulang daftar template. */
    onMuatUlangTemplate?: () => void
    onTerbit: (item: SkAsessmenItem) => void
    /** `bersih` = tidak ada lagi SK pendaftaran ini yang tertaut Sisurat. */
    onReset?: (SkRektorId: string, bersih: boolean) => void
}) {
    const [loading, setLoading] = React.useState<boolean>(false)
    const [preview, setPreview] = React.useState<string | null>(null)

    // Nilai awal semester dan tanggal penilaian dipakai bersama oleh formulir
    // dan butir baku, supaya keduanya konsisten sejak kartu dibuka.
    const tahunIni = new Date().getFullYear()
    const semesterAwal = periode?.trim() || `Ganjil ${tahunIni}/${tahunIni + 1}`
    const tanggalAwal = new Date().toISOString().slice(0, 10)

    const [form, setForm] = React.useState<{
        NamaSk: string
        TahunSk: string
        Perihal: string
        Semester: string
        TanggalAsesmen: string
    }>({
        NamaSk: sk?.NamaSk ?? LABEL_JENIS_SK[jenis],
        TahunSk: sk?.TahunSk ?? String(new Date().getFullYear()),
        Perihal: `${LABEL_JENIS_SK[jenis]} a.n. ${namaMahasiswa} — Rekognisi Pembelajaran Lampau`,
        Semester: semesterAwal,
        TanggalAsesmen: tanggalAwal,
    })

    // Diktum SK disusun sebagai daftar butir yang dapat ditambah, dihapus, dan
    // diurutkan. Isi awalnya mengikuti SK yang berlaku di ITI (lihat
    // src/lib/diktum-sk-rpl.ts); butir kosong berarti "pakai butir baku server".
    const susunBaku = React.useCallback(
        (semester: string, tanggalAsesmen: string) => {
            const baku = diktumBakuSk(jenis, {
                Nama: namaMahasiswa,
                ProgramStudi: programStudi,
                Semester: semester,
                TanggalPenilaian: tanggalAsesmen
                    ? formatDateToIndonesian(tanggalAsesmen)
                    : '',
            })
            return {
                Menimbang: { butir: baku.Menimbang, gaya: 'tanpa' as GayaNomor },
                Mengingat: { butir: baku.Mengingat, gaya: 'tanpa' as GayaNomor },
                Memperhatikan: {
                    butir: baku.Memperhatikan,
                    gaya: 'tanpa' as GayaNomor,
                },
                Menetapkan: { butir: baku.Menetapkan, gaya: 'tanpa' as GayaNomor },
            }
        },
        [jenis, namaMahasiswa, programStudi]
    )

    const [diktum, setDiktum] = React.useState<
        Record<KunciDiktum, { butir: string[]; gaya: GayaNomor }>
    >(() => susunBaku(semesterAwal, tanggalAwal))

    // Template SK RPL dicocokkan server lewat kode atau nama "SK Hasil Asesmen
    // RPL". Akademik tetap dapat menunjuk template lain bila belum ketemu.
    const [pilihanTemplate, setPilihanTemplate] = React.useState<string>('')
    const templateOtomatis = template.Rpl[jenis]
    const templateRpl =
        template.Daftar.find(
            (t) => t.templateVersionId === pilihanTemplate
        ) ?? templateOtomatis
    const sudahDikirim = !!sk?.SisuratLetterId
    const perluRevisi =
        !!sk?.SisuratStatus && STATUS_PERLU_REVISI.includes(sk.SisuratStatus)

    /** Butir siap kirim beserta penandanya; kosong berarti pakai butir baku. */
    const kirimButir = (kunci: KunciDiktum) =>
        butirTerkirim(diktum[kunci].butir, diktum[kunci].gaya)

    const kirim = async () => {
        if (!form.NamaSk || !form.TahunSk || form.Perihal.trim().length < 3) {
            toast('Nama SK, Tahun SK, dan Perihal perlu diisi')
            return
        }
        setLoading(true)
        try {
            const res = await kirimSkKeSisurat({
                PendaftaranId,
                JenisSkAsessmen: jenis,
                templateVersionId: pilihanTemplate || undefined,
                NamaSk: form.NamaSk,
                TahunSk: form.TahunSk,
                Perihal: form.Perihal,
                Semester: form.Semester,
                TanggalAsesmen: form.TanggalAsesmen,
                Menimbang: kirimButir('Menimbang'),
                Mengingat: kirimButir('Mengingat'),
                Memperhatikan: kirimButir('Memperhatikan'),
                Menetapkan: kirimButir('Menetapkan'),
            })
            onTerbit({
                SkRektorId: res.data.SkRektorId,
                JenisSkAsessmen: jenis,
                NamaSk: res.data.NamaSk,
                NomorSk: res.data.NomorSk,
                TahunSk: String(res.data.TahunSk),
                NamaFile: res.data.NamaFile,
                NamaDokumen: res.data.NamaDokumen,
                Disetujui: false,
                Ditandatangani: false,
                Catatan: '',
                SisuratLetterId: res.data.SisuratLetterId,
                SisuratStatus: res.data.SisuratStatus,
            })
            toast(`${res.message} — ${res.data.Template}`)
            if (res.data.Warnings?.length) {
                toast(`Catatan Sisurat: ${res.data.Warnings.join('; ')}`)
            }
        } catch (err) {
            toast(
                err instanceof Error
                    ? err.message
                    : `Gagal mengirim ${LABEL_JENIS_SK[jenis]} ke Sisurat`
            )
        } finally {
            setLoading(false)
        }
    }

    // Pratinjau dirender Sisurat sendiri supaya persis sama dengan surat yang
    // nanti terbit (integrasi-rpl-sisurat §6.4).
    const [pratinjau, setPratinjau] = React.useState<{
        Html: string
        BelumTerisi: string[]
        Template: string
    } | null>(null)
    const [memuatPratinjau, setMemuatPratinjau] = React.useState<boolean>(false)

    const bukaPratinjau = async () => {
        setMemuatPratinjau(true)
        try {
            const res = await pratinjauSkSisurat({
                PendaftaranId,
                JenisSkAsessmen: jenis,
                templateVersionId:
                    pilihanTemplate ||
                    templateOtomatis?.templateVersionId ||
                    undefined,
                Semester: form.Semester,
                TanggalAsesmen: form.TanggalAsesmen,
                Menimbang: kirimButir('Menimbang'),
                Mengingat: kirimButir('Mengingat'),
                Memperhatikan: kirimButir('Memperhatikan'),
                Menetapkan: kirimButir('Menetapkan'),
            })
            setPratinjau(res.data)
            if (res.data.BelumTerisi.length > 0) {
                toast(
                    `Placeholder wajib belum terisi: ${res.data.BelumTerisi.join(', ')}`
                )
            }
        } catch (err) {
            toast(
                err instanceof Error ? err.message : 'Gagal membuat pratinjau'
            )
        } finally {
            setMemuatPratinjau(false)
        }
    }

    const kirimUlang = async (paksa = false) => {
        if (!sk) return
        setLoading(true)
        try {
            const res = await resetSkSisurat(sk.SkRektorId, paksa)
            toast(res.message)
            onReset?.(sk.SkRektorId, !!res.data.TidakAdaLagiTerkirim)
        } catch (err) {
            toast(
                err instanceof Error ? err.message : 'Gagal membuka kembali SK'
            )
        } finally {
            setLoading(false)
        }
    }

    const lihatSk = async () => {
        if (!sk) return
        try {
            const url = await getFileSkAsessmenBlobByNamafile(sk.NamaFile)
            setPreview(url)
        } catch {
            toast('Gagal membuka dokumen SK')
        }
    }

    const statusBadge = !sk?.SisuratLetterId ? (
        <Badge variant="secondary">Belum dikirim</Badge>
    ) : perluRevisi ? (
        <Badge variant="destructive">Perlu diperbaiki</Badge>
    ) : sk.Ditandatangani ? (
        <Badge className="bg-green-600">Ditandatangani — {sk.NomorSk}</Badge>
    ) : (
        <Badge variant="secondary">
            {LABEL_STATUS_SISURAT[sk.SisuratStatus ?? ''] ??
                sk.SisuratStatus ??
                'Diproses Sisurat'}
        </Badge>
    )

    const isianDiktum: [KunciDiktum, string][] = [
        [
            'Menimbang',
            'Alasan penetapan. Kosongkan seluruhnya untuk memakai butir baku.',
        ],
        ['Mengingat', 'Dasar hukum yang menjadi rujukan.'],
        [
            'Memperhatikan',
            'Kosongkan bila cukup merujuk berita acara asesmen.',
        ],
        ['Menetapkan', 'Diktum penetapan yang diputuskan.'],
    ]

    return (
        <Card className="border-dashed">
            <CardHeader>
                <CardTitle className="flex flex-wrap items-center gap-3">
                    {LABEL_JENIS_SK[jenis]} {statusBadge}
                </CardTitle>
                <CardDescription>
                    Surat disusun dari template{' '}
                    <span className="font-mono text-xs">
                        {templateRpl
                            ? `${KODE_TEMPLATE[jenis]} v${templateRpl.versionNumber}`
                            : KODE_TEMPLATE[jenis]}
                    </span>{' '}
                    di Sisurat. Nama mahasiswa, program studi, jumlah SKS, dan
                    nama Rektor diisi otomatis dari data pendaftaran; nomor surat
                    dan tanda tangan diterbitkan Sisurat.
                    {jumlahMk !== undefined && (
                        <>
                            {' '}
                            Mahasiswa ini punya <b>{jumlahMk}</b> mata kuliah
                            berjenis tersebut
                            {jumlahMk === 0 &&
                                ' — SK tetap boleh diajukan bila memang diperlukan'}
                            .
                        </>
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {sudahDikirim ? (
                    <div className="grid grid-cols-1 gap-2 text-sm">
                        <p className="text-muted-foreground">
                            Surat Sisurat{' '}
                            <span className="font-mono text-xs">
                                {sk?.SisuratLetterId}
                            </span>
                            {sk?.NomorSk
                                ? ` — nomor ${sk.NomorSk}.`
                                : ' — belum bernomor.'}{' '}
                            {sk?.Ditandatangani
                                ? 'Sudah ditandatangani; QR sudah ditempel pada berkas dan SK siap dipublikasikan.'
                                : 'Tekan Perbarui Status untuk menarik perkembangan terbaru dari Sisurat.'}
                        </p>
                    </div>
                ) : (
                    <React.Fragment>
                        {memuatTemplate && (
                            <Alert className="mb-4">
                                <TimerIcon className="w-4 h-4" />
                                <AlertTitle>Memuat template Sisurat…</AlertTitle>
                                <AlertDescription>
                                    Tombol kirim aktif setelah daftar template
                                    berhasil ditarik.
                                </AlertDescription>
                            </Alert>
                        )}

                        {!memuatTemplate && galatTemplate && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertTitle>
                                    Daftar template Sisurat gagal dimuat
                                </AlertTitle>
                                <AlertDescription>
                                    <p>{galatTemplate}</p>
                                    {/* Kekurangan scope bukan salah kredensial —
                                        arahannya berbeda, jadi dibedakan. */}
                                    {/scope|403/i.test(galatTemplate) ? (
                                        <p className="mt-1">
                                            Kredensialnya sudah diterima Sisurat,
                                            tetapi klien API-nya belum diberi izin
                                            menginisialisasi surat. Minta admin
                                            Sisurat menambahkan scope{' '}
                                            <span className="font-mono">
                                                letter.initiate
                                            </span>
                                            , mengikat klien ke service user +
                                            peran pembuat surat, dan memataknya ke
                                            konteks alur{' '}
                                            <span className="font-mono">RPL</span>.
                                        </p>
                                    ) : (
                                        <p className="mt-1">
                                            SK belum dapat dikirim sampai sambungan
                                            ke Sisurat berhasil. Periksa{' '}
                                            <span className="font-mono">
                                                clientId
                                            </span>{' '}
                                            /{' '}
                                            <span className="font-mono">
                                                clientSecret
                                            </span>{' '}
                                            pada environment.
                                        </p>
                                    )}
                                    {onMuatUlangTemplate && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="mt-2"
                                            onClick={onMuatUlangTemplate}
                                        >
                                            <RefreshCwIcon /> Coba Muat Ulang
                                        </Button>
                                    )}
                                </AlertDescription>
                            </Alert>
                        )}

                        {!memuatTemplate &&
                            !galatTemplate &&
                            template.Daftar.length > 0 &&
                            !templateRpl && (
                                <Alert variant="destructive" className="mb-4">
                                    <AlertTitle>
                                        Template SK RPL belum tersedia
                                    </AlertTitle>
                                    <AlertDescription>
                                        Template berkode{' '}
                                        <span className="font-mono">
                                            {KODE_TEMPLATE[jenis]}
                                        </span>{' '}
                                        maupun yang bernama &ldquo;SK Hasil
                                        Asesmen RPL&rdquo; tidak ada di antara{' '}
                                        {template.Daftar.length} template Sisurat.
                                        Minta admin Sisurat menerbitkannya, atau
                                        pilih template lain di bawah ini.
                                    </AlertDescription>
                                </Alert>
                            )}

                        {/* Pemilihan template dari Sisurat. Terisi otomatis
                            dengan template SK RPL; dapat diganti bila perlu. */}
                        {template.Daftar.length > 0 && (
                            <div className="grid gap-2 mb-4">
                                <Label htmlFor={`tpl-${jenis}`}>
                                    Template Sisurat
                                </Label>
                                <Select
                                    value={
                                        pilihanTemplate ||
                                        templateOtomatis?.templateVersionId ||
                                        ''
                                    }
                                    onValueChange={(v) => setPilihanTemplate(v)}
                                    disabled={loading || terkunci}
                                >
                                    <SelectTrigger
                                        id={`tpl-${jenis}`}
                                        className="w-full"
                                    >
                                        <SelectValue placeholder="Pilih template surat" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {template.Daftar.map((t) => (
                                            <SelectItem
                                                key={t.templateVersionId}
                                                value={t.templateVersionId}
                                            >
                                                {t.nama}
                                                {t.kode ? ` — ${t.kode}` : ''} (v
                                                {t.versionNumber})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    {templateOtomatis
                                        ? `Terdeteksi otomatis untuk ${LABEL_JENIS_SK[jenis]}: ${templateOtomatis.nama}.`
                                        : 'Template SK RPL belum terdeteksi; pilih sendiri templatenya.'}
                                    {templateRpl?.fields?.length
                                        ? ` Template ini memerlukan ${templateRpl.fields.length} isian.`
                                        : templateRpl
                                            ? ` Template ini memerlukan ${templateRpl.placeholders.length} placeholder.`
                                            : ''}
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor={`perihal-${jenis}`}>Perihal</Label>
                                <Input
                                    id={`perihal-${jenis}`}
                                    value={form.Perihal}
                                    disabled={loading || terkunci}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            Perihal: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor={`nama-${jenis}`}>
                                    Nama berkas SK
                                </Label>
                                <Input
                                    id={`nama-${jenis}`}
                                    value={form.NamaSk}
                                    disabled={loading || terkunci}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            NamaSk: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor={`tahun-${jenis}`}>Tahun SK</Label>
                                <Input
                                    id={`tahun-${jenis}`}
                                    value={form.TahunSk}
                                    disabled={loading || terkunci}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            TahunSk: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor={`semester-${jenis}`}>
                                    Semester akademik
                                </Label>
                                <Input
                                    id={`semester-${jenis}`}
                                    placeholder="mis. Ganjil 2026/2027"
                                    value={form.Semester}
                                    disabled={loading || terkunci}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            Semester: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor={`tgl-${jenis}`}>
                                    Tanggal asesmen
                                </Label>
                                <Input
                                    id={`tgl-${jenis}`}
                                    type="date"
                                    value={form.TanggalAsesmen}
                                    disabled={loading || terkunci}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            TanggalAsesmen: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
                            <p className="text-sm font-semibold">
                                Diktum Keputusan
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={loading || terkunci}
                                title="Susun ulang seluruh butir mengikuti SK baku, memakai semester dan tanggal asesmen yang terisi sekarang"
                                onClick={() =>
                                    setDiktum(
                                        susunBaku(
                                            form.Semester,
                                            form.TanggalAsesmen
                                        )
                                    )
                                }
                            >
                                <RefreshCwIcon /> Muat Ulang Butir Baku
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 gap-3 mt-2">
                            {isianDiktum.map(([kunci, bantuan]) => (
                                <EditorButirSk
                                    key={kunci}
                                    judul={kunci}
                                    bantuan={bantuan}
                                    butir={diktum[kunci].butir}
                                    gaya={diktum[kunci].gaya}
                                    nonaktif={loading || terkunci}
                                    onUbah={(butir) =>
                                        setDiktum((p) => ({
                                            ...p,
                                            [kunci]: { ...p[kunci], butir },
                                        }))
                                    }
                                    onUbahGaya={(gaya) =>
                                        setDiktum((p) => ({
                                            ...p,
                                            [kunci]: { ...p[kunci], gaya },
                                        }))
                                    }
                                />
                            ))}
                        </div>

                        {/* Pratinjau susunan diktum persis seperti yang dikirim
                            ke Sisurat. Sisurat tidak menyediakan endpoint
                            pratinjau, jadi yang ditampilkan di sini adalah isi
                            fieldValues-nya, bukan hasil render suratnya. */}
                        <div className="p-3 mt-4 border rounded-lg bg-muted/40">
                            <p className="text-sm font-semibold">
                                Pratinjau diktum yang dikirim
                            </p>
                            <p className="mb-2 text-xs text-muted-foreground">
                                Susunan butir ini yang masuk ke{' '}
                                <span className="font-mono">fieldValues</span>{' '}
                                template{' '}
                                <span className="font-mono">
                                    {KODE_TEMPLATE[jenis]}
                                </span>
                                . Badan suratnya sendiri dirender Sisurat.
                            </p>
                            <div className="grid gap-2 text-sm">
                                {isianDiktum.map(([kunci]) => {
                                    const isi = butirTerkirim(
                                        diktum[kunci].butir,
                                        diktum[kunci].gaya
                                    )
                                    return (
                                        <div key={kunci}>
                                            <span className="font-semibold">
                                                {kunci}:
                                            </span>{' '}
                                            {isi.length === 0 ? (
                                                <span className="text-muted-foreground">
                                                    (memakai butir baku)
                                                </span>
                                            ) : (
                                                <ul className="mt-1 ml-4 space-y-0.5">
                                                    {isi.map((b, i) => (
                                                        <li key={i}>
                                                            {diktum[kunci].gaya ===
                                                                'tanpa' && (
                                                                    <span className="mr-1 text-muted-foreground">
                                                                        {penandaButir(
                                                                            'angka',
                                                                            i
                                                                        )}
                                                                    </span>
                                                                )}
                                                            {b}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </React.Fragment>
                )}

                {sk && sk.Catatan !== '' && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertTitle>Catatan dari Sisurat</AlertTitle>
                        <AlertDescription>{sk.Catatan}</AlertDescription>
                    </Alert>
                )}

                <div className="flex flex-wrap gap-3 mt-4">
                    {!sudahDikirim && (
                        <Button
                            type="button"
                            onClick={() => kirim()}
                            disabled={loading || terkunci || !templateRpl}
                            title={
                                terkunci
                                    ? 'Berkas sedang tidak berada di tahap penerbitan SK'
                                    : memuatTemplate
                                        ? 'Menunggu daftar template Sisurat'
                                        : !templateRpl
                                            ? `Template ${KODE_TEMPLATE[jenis]} belum tersedia dari Sisurat`
                                            : ''
                            }
                        >
                            {loading ? (
                                <React.Fragment>
                                    <TimerIcon /> Loading
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <CloudUploadIcon /> Kirim ke Sisurat
                                </React.Fragment>
                            )}
                        </Button>
                    )}
                    {!sudahDikirim && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => bukaPratinjau()}
                            disabled={
                                memuatPratinjau || terkunci || !templateRpl
                            }
                            title={
                                templateRpl
                                    ? 'Sisurat merender pratinjau dari isian saat ini'
                                    : 'Pilih template lebih dulu'
                            }
                        >
                            {memuatPratinjau ? (
                                <React.Fragment>
                                    <TimerIcon /> Memuat
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <ScanEyeIcon /> Pratinjau Surat
                                </React.Fragment>
                            )}
                        </Button>
                    )}
                    {sudahDikirim && perluRevisi && (
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => kirimUlang()}
                            disabled={loading}
                        >
                            <RefreshCwIcon /> Perbaiki & Kirim Ulang
                        </Button>
                    )}
                    {sudahDikirim && !perluRevisi && !sk?.Ditandatangani && (
                        <Button
                            type="button"
                            variant="outline"
                            disabled={loading}
                            onClick={async () => {
                                const konfirmasi = await Swal.fire({
                                    title: 'Batalkan pengiriman?',
                                    html: `Surat <b>${sk?.SisuratLetterId}</b> tetap ada di Sisurat dan <b>tidak ikut terhapus</b>.${sk?.NomorSk ? ` Nomor <b>${sk.NomorSk}</b> yang sudah terbit tidak dapat dipakai ulang.` : ''}<br/><br/>Batalkan juga surat itu di Sisurat agar tidak berganda, lalu kirim ulang dari sini.`,
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonText: 'Ya, batalkan',
                                    cancelButtonText: 'Batal',
                                    confirmButtonColor: '#f45f24',
                                })
                                if (konfirmasi.isConfirmed) kirimUlang(true)
                            }}
                        >
                            <RefreshCwIcon /> Batalkan Pengiriman
                        </Button>
                    )}
                    {sk && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => lihatSk()}
                        >
                            Lihat Dokumen
                        </Button>
                    )}
                </div>

                {pratinjau && (
                    <div className="mt-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-sm font-semibold">
                                Pratinjau dari Sisurat — {pratinjau.Template}
                            </p>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setPratinjau(null)}
                            >
                                Tutup
                            </Button>
                        </div>
                        {pratinjau.BelumTerisi.length > 0 && (
                            <Alert className="mt-2">
                                <AlertTitle>
                                    Placeholder wajib belum terisi
                                </AlertTitle>
                                <AlertDescription>
                                    <span className="font-mono text-xs">
                                        {pratinjau.BelumTerisi.join(', ')}
                                    </span>
                                </AlertDescription>
                            </Alert>
                        )}
                        <iframe
                            srcDoc={pratinjau.Html}
                            title={`Pratinjau ${LABEL_JENIS_SK[jenis]}`}
                            width="100%"
                            height="600px"
                            className="mt-2 bg-white border rounded"
                        />
                    </div>
                )}

                {preview && (
                    <iframe
                        src={preview}
                        title={`Preview ${LABEL_JENIS_SK[jenis]}`}
                        width="100%"
                        height="500px"
                        className="mt-4 border rounded"
                    />
                )}
            </CardContent>
        </Card>
    )
}

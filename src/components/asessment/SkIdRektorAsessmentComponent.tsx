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
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    SkRektorAsessmenSkemaValidasi,
    SkRektorAsessmenSkemaValidasiTipe,
} from '@/validation/SkAsessmenValidation'
import {
    getFileSkAsessmenBlobByNamafile,
    setPublikasiSkAsessmen,
    terbitkanSkAsessmen,
} from '@/services/Asessment/SkRektorAsessmenService'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { CheckCircle2Icon, CloudUploadIcon, PenIcon, TimerIcon } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { setStatusPersetujuanSkAsessmen } from '@/services/Status/StatusService'
import { formatDateToIndonesian } from '@/lib/utils'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'

export type JenisSkAsessmenType = 'PEROLEHAN_SKS' | 'TRANSFER_SKS'

export type SkAsessmenItem = {
    SkRektorId: string
    JenisSkAsessmen: JenisSkAsessmenType
    NamaSk: string
    NomorSk: string
    TahunSk: string
    NamaFile: string
    NamaDokumen: string
    Disetujui: boolean
    Ditandatangani: boolean
    Dipublikasikan?: boolean
    Catatan: string
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
    fileSkRektor,
    stats,
    jumlahMkPerJenis,
    skAsessmen,
}: {
    dataServer: ResponseFinalAsessmenAsesorDetailType
    fileSkRektor: {
        SkRektor: {
            CreatedAt: Date | null
            UpdatedAt: Date | null
            SkRektorId: string
            TipeSkRektorId: string
            NamaSk: string
            TahunSk: number
            NomorSk: string
            NamaFile: string
            NamaDokumen: string
        }
    } | null
    stats: { StatusMahasiswaAssesmentId: string; NamaStatus: string }
    /** Jumlah mata kuliah per jenis — dipakai sebagai keterangan di kartu. */
    jumlahMkPerJenis: Record<JenisSkAsessmenType, number>
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
    const form = useForm<SkRektorAsessmenSkemaValidasiTipe>({
        resolver: zodResolver(SkRektorAsessmenSkemaValidasi),
        defaultValues: {
            data: undefined,
            NamaSk: '',
            TahunSk: '',
            NomorSk: '',
        },
    })
    const [pdfPreview, setPdfPreview] = React.useState<string | null>(null)
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
        if (fileSkRektor) {
            getFileSkAsessmenBlobByNamafile(fileSkRektor.SkRektor.NamaFile)
                .then((res) => {
                    setPdfPreview(res)
                    form.setValue('NamaSk', fileSkRektor.SkRektor.NamaSk)
                    form.setValue(
                        'TahunSk',
                        String(fileSkRektor.SkRektor.TahunSk)
                    )
                    form.setValue('NomorSk', fileSkRektor.SkRektor.NomorSk)
                })
                .catch((err) => { })
        }
    }, [])
    // Seluruh SK yang diterbitkan diajukan ke Wakil Rektor. Setelah disetujui,
    // berkas lanjut ke Rektor untuk ditandatangani.
    const publication = async () => {
        await setStatusPersetujuanSkAsessmen(dataServer.PendaftaranId)
            .then(async () => {
                toast('SK diajukan ke Wakil Rektor untuk disetujui')
                setStatusServer({
                    StatusMahasiswaAssesmentId:
                        statusServer.StatusMahasiswaAssesmentId,
                    NamaStatus: 'Persetujuan SK Asessmen',
                })
            })
            .catch((err) => {
                toast('Gagal mengajukan SK ke Wakil Rektor. Error: ' + err)
            })
    }

    // Cukup satu SK terbit agar berkas dapat diajukan ke Wakil Rektor.
    const adaSkTerbit = daftarSk.length > 0

    const semuaDitandatangani =
        daftarSk.length > 0 && daftarSk.every((x) => x.Ditandatangani)
    const sudahDipublikasikan =
        daftarSk.length > 0 && daftarSk.every((x) => x.Dipublikasikan)

    // SK yang sudah ditandatangani Rektor baru terlihat mahasiswa setelah
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
            {pdfPreview && (
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Dokumen SK</CardTitle>
                            <CardDescription>
                                Dokumen Surat Keputusan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-2 mb-3">
                                <iframe
                                    src={pdfPreview || ''}
                                    title="PDF Preview"
                                    width="100%"
                                    height="500px"
                                    className="border rounded"
                                ></iframe>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
            {role?.Name.match('Akademik') && (
                <div className="grid grid-cols-1 gap-3">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Penerbitan SK Hasil Asessmen</CardTitle>
                            <CardDescription>
                                SK dibuat dari template sesuai jenis mata kuliah
                                yang diajukan mahasiswa. Terbitkan setiap jenis
                                yang diperlukan, lalu ajukan ke Wakil Rektor.
                            </CardDescription>
                            <CardAction></CardAction>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-4">
                                {SEMUA_JENIS_SK.map((jenis) => (
                                    <KartuPenerbitanSk
                                        key={jenis}
                                        jenis={jenis}
                                        PendaftaranId={dataServer.PendaftaranId}
                                        jumlahMk={jumlahMkPerJenis[jenis]}
                                        sk={daftarSk.find(
                                            (x) => x.JenisSkAsessmen === jenis
                                        )}
                                        terkunci={
                                            statusServer.NamaStatus !==
                                            'Penerbitan SK Asessmen'
                                        }
                                        onTerbit={(item) =>
                                            setDaftarSk((prev) => [
                                                ...prev.filter(
                                                    (x) =>
                                                        x.JenisSkAsessmen !==
                                                        item.JenisSkAsessmen
                                                ),
                                                item,
                                            ])
                                        }
                                    />
                                ))}
                            </div>

                            {semuaDitandatangani && (
                                <div className="p-4 mt-5 border rounded-lg bg-primary/5 border-primary/20">
                                    <h4 className="font-semibold">
                                        Publikasi ke Mahasiswa
                                    </h4>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Seluruh SK sudah ditandatangani Rektor.
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

                            {statusServer.NamaStatus ===
                                'Persetujuan SK Asessmen' && (
                                    <Alert className="mt-5">
                                        <CheckCircle2Icon className="w-4 h-4" />
                                        <AlertTitle>
                                            Menunggu Persetujuan Wakil Rektor
                                        </AlertTitle>
                                        <AlertDescription>
                                            SK sudah diajukan. Bila ada SK yang
                                            ditolak, berkas kembali ke tahap
                                            penerbitan untuk direvisi.
                                        </AlertDescription>
                                    </Alert>
                                )}

                            <div className="flex justify-center w-full my-5 gap-5">
                                {statusServer.NamaStatus ===
                                    'Penerbitan SK Asessmen' && (
                                        <Button
                                            type="button"
                                            onClick={() => publication()}
                                            disabled={loading || !adaSkTerbit}
                                            title={
                                                adaSkTerbit
                                                    ? ''
                                                    : 'Terbitkan minimal satu SK lebih dulu'
                                            }
                                            className="w-full transition-all duration-100 cursor-pointer hover:scale-110 active:scale-90 lg:w-1/3 md:w-1/2"
                                        >
                                            {loading ? (
                                                <React.Fragment>
                                                    <TimerIcon /> Loading
                                                </React.Fragment>
                                            ) : (
                                                <React.Fragment>
                                                    <CloudUploadIcon /> Ajukan ke
                                                    Wakil Rektor
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
    sk,
    terkunci,
    jumlahMk,
    onTerbit,
}: {
    jenis: JenisSkAsessmenType
    PendaftaranId: string
    sk?: SkAsessmenItem
    terkunci: boolean
    /** Jumlah mata kuliah mahasiswa berjenis ini — sekadar informasi. */
    jumlahMk?: number
    onTerbit: (item: SkAsessmenItem) => void
}) {
    const [loading, setLoading] = React.useState<boolean>(false)
    const [preview, setPreview] = React.useState<string | null>(null)
    const [formSk, setFormSk] = React.useState<{
        NamaSk: string
        NomorSk: string
        TahunSk: string
    }>({
        NamaSk: sk?.NamaSk ?? LABEL_JENIS_SK[jenis],
        NomorSk: sk?.NomorSk ?? '',
        TahunSk: sk?.TahunSk ?? String(new Date().getFullYear()),
    })

    const terbitkan = async () => {
        if (!formSk.NomorSk || !formSk.NamaSk || !formSk.TahunSk) {
            toast('Nama, Nomor, dan Tahun SK perlu diisi')
            return
        }
        setLoading(true)
        try {
            const res = await terbitkanSkAsessmen(
                PendaftaranId,
                jenis,
                formSk.NamaSk,
                formSk.NomorSk,
                formSk.TahunSk
            )
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
            })
            toast(`${LABEL_JENIS_SK[jenis]} berhasil diterbitkan`)
        } catch (err) {
            toast(
                err instanceof Error
                    ? err.message
                    : `Gagal menerbitkan ${LABEL_JENIS_SK[jenis]}`
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

    const statusBadge = !sk ? (
        <Badge variant="secondary">Belum diterbitkan</Badge>
    ) : sk.Ditandatangani ? (
        <Badge className="bg-green-700">Sudah ditandatangani</Badge>
    ) : sk.Disetujui ? (
        <Badge className="bg-green-600">Disetujui</Badge>
    ) : (
        <Badge variant="secondary">Menunggu persetujuan</Badge>
    )

    return (
        <Card className="border-dashed">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    {LABEL_JENIS_SK[jenis]} {statusBadge}
                </CardTitle>
                <CardDescription>
                    Dirender dari template SK Hasil{' '}
                    {jenis === 'TRANSFER_SKS' ? 'Transfer' : 'Perolehan'} SKS.
                    {jumlahMk !== undefined && (
                        <>
                            {' '}
                            Mahasiswa ini punya <b>{jumlahMk}</b> mata kuliah
                            berjenis tersebut
                            {jumlahMk === 0 &&
                                ' — SK tetap boleh diterbitkan bila memang diperlukan'}
                            .
                        </>
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div className="grid gap-2">
                        <Label htmlFor={`nama-${jenis}`}>Nama SK</Label>
                        <Input
                            id={`nama-${jenis}`}
                            value={formSk.NamaSk}
                            disabled={loading || terkunci}
                            onChange={(e) =>
                                setFormSk({ ...formSk, NamaSk: e.target.value })
                            }
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor={`nomor-${jenis}`}>
                            Nomor SK sementara
                        </Label>
                        <Input
                            id={`nomor-${jenis}`}
                            value={formSk.NomorSk}
                            disabled={loading || terkunci}
                            onChange={(e) =>
                                setFormSk({ ...formSk, NomorSk: e.target.value })
                            }
                        />
                        <p className="text-xs text-muted-foreground">
                            Nomor resmi diterbitkan Sisurat saat Rektor
                            menandatangani, dan akan menggantikan nomor ini.
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor={`tahun-${jenis}`}>Tahun SK</Label>
                        <Input
                            id={`tahun-${jenis}`}
                            value={formSk.TahunSk}
                            disabled={loading || terkunci}
                            onChange={(e) =>
                                setFormSk({ ...formSk, TahunSk: e.target.value })
                            }
                        />
                    </div>
                </div>

                {sk && sk.Catatan !== '' && (
                    <div className="grid grid-cols-1 gap-2 pt-3">
                        <Label htmlFor={`catatan-${jenis}`}>
                            Catatan dari Wakil Rektor
                        </Label>
                        <Textarea
                            readOnly
                            id={`catatan-${jenis}`}
                            value={sk.Catatan}
                        />
                    </div>
                )}

                <div className="flex flex-wrap gap-3 mt-4">
                    <Button
                        type="button"
                        onClick={() => terbitkan()}
                        disabled={loading || terkunci || sk?.Ditandatangani}
                    >
                        {loading ? (
                            <React.Fragment>
                                <TimerIcon /> Loading
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <PenIcon />{' '}
                                {sk ? 'Terbitkan Ulang' : 'Terbitkan SK'}
                            </React.Fragment>
                        )}
                    </Button>
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

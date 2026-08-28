'use client'

import React from 'react'
import SignatureCanvas, {
    type SignatureCanvasRef,
} from '@uiw/react-signature/canvas'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { CheckCircle2Icon, EraserIcon, PenLineIcon, TimerIcon } from 'lucide-react'
import { toast } from 'sonner'
import {
    getStatusTandaTangan,
    simpanTandaTangan,
    urlTandaTangan,
    type StatusTandaTanganMahasiswa,
} from '@/services/TandaTanganMahasiswa/TandaTanganMahasiswaService'
import { formatDateToIndonesian } from '@/lib/utils'

// Varian kanvas dari @uiw/react-signature dipakai (bukan varian SVG) karena
// hasilnya perlu menjadi PNG untuk disematkan ke PDF Form 03. Diimpor langsung,
// bukan lewat next/dynamic, supaya ref-nya tetap sampai ke komponen — tanpa ref
// kanvasnya tidak bisa diekspor.
const TINGGI_KANVAS = 200

export default function KartuTandaTangan({
    PendaftaranId,
    onBerubah,
}: {
    PendaftaranId: string
    /** Dipanggil setiap status tanda tangan berubah, termasuk saat dimuat. */
    onBerubah?: (status: StatusTandaTanganMahasiswa) => void
}) {
    const acuan = React.useRef<SignatureCanvasRef>(null)
    const [status, setStatus] =
        React.useState<StatusTandaTanganMahasiswa | null>(null)
    const [memuat, setMemuat] = React.useState<boolean>(true)
    const [menyimpan, setMenyimpan] = React.useState<boolean>(false)
    const [adaGoresan, setAdaGoresan] = React.useState<boolean>(false)
    const [versi, setVersi] = React.useState<number>(0)
    const [ulangi, setUlangi] = React.useState<boolean>(false)
    // Lebar bitmap kanvas harus sama dengan lebar tampilannya; bila berbeda,
    // goresan tergambar meleset dari posisi kursor. Diukur lewat callback ref
    // supaya pengukuran terjadi tepat saat kotaknya muncul — bukan bergantung
    // pada perubahan state tertentu.
    const [lebar, setLebar] = React.useState<number>(0)
    const pengamat = React.useRef<ResizeObserver | null>(null)
    const wadah = React.useCallback((el: HTMLDivElement | null) => {
        pengamat.current?.disconnect()
        pengamat.current = null
        if (!el) return
        setLebar(Math.floor(el.clientWidth))
        const ro = new ResizeObserver(() =>
            setLebar(Math.floor(el.clientWidth))
        )
        ro.observe(el)
        pengamat.current = ro
    }, [])

    React.useEffect(() => () => pengamat.current?.disconnect(), [])

    const perbarui = React.useCallback(
        (baru: StatusTandaTanganMahasiswa) => {
            setStatus(baru)
            onBerubah?.(baru)
        },
        [onBerubah]
    )

    React.useEffect(() => {
        let batal = false
        setMemuat(true)
        getStatusTandaTangan(PendaftaranId)
            .then((res) => {
                if (batal) return
                perbarui(res)
            })
            .catch(() => {
                if (!batal) toast.error('Gagal memuat status tanda tangan')
            })
            .finally(() => {
                if (!batal) setMemuat(false)
            })
        return () => {
            batal = true
        }
    }, [PendaftaranId, perbarui])

    const bersihkan = () => {
        acuan.current?.clear()
        setAdaGoresan(false)
    }

    const simpan = async () => {
        const kanvas = acuan.current?.canvas
        if (!kanvas || !adaGoresan) {
            toast.error('Bubuhkan tanda tangan Anda lebih dulu')
            return
        }

        setMenyimpan(true)
        try {
            const res = await simpanTandaTangan(
                PendaftaranId,
                kanvas.toDataURL('image/png')
            )
            perbarui(res)
            setVersi((n) => n + 1)
            setUlangi(false)
            setAdaGoresan(false)
            toast.success('Tanda tangan tersimpan')
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : 'Gagal menyimpan tanda tangan'
            )
        } finally {
            setMenyimpan(false)
        }
    }

    const sudah = !!status?.SudahTandaTangan
    const terkunci = !!status && !status.DapatDiubah
    const tampilkanKanvas = !sudah || ulangi

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex flex-wrap items-center gap-3">
                    Tanda Tangan Formulir Evaluasi Diri (Form 03)
                    {sudah ? (
                        <Badge className="bg-green-600">Sudah ditandatangani</Badge>
                    ) : (
                        <Badge variant="secondary">Belum ditandatangani</Badge>
                    )}
                </CardTitle>
                <CardDescription>
                    Bubuhkan tanda tangan Anda di kotak berikut. Tanda tangan ini
                    disematkan pada Form 03 di bagian &ldquo;Tanda Tangan Calon
                    Mahasiswa&rdquo; dan wajib ada sebelum berkas dilanjutkan ke
                    asesor.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {memuat ? (
                    <p className="text-sm text-muted-foreground">Memuat…</p>
                ) : (
                    <React.Fragment>
                        {sudah && !ulangi && (
                            <div className="grid gap-3">
                                <div className="flex items-center justify-center p-3 bg-white border rounded-lg">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={urlTandaTangan(PendaftaranId, versi)}
                                        alt="Tanda tangan Anda"
                                        className="h-24 object-contain"
                                    />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Ditandatangani pada{' '}
                                    {status?.TandaTanganPada
                                        ? formatDateToIndonesian(
                                            status.TandaTanganPada
                                        )
                                        : '-'}
                                    .
                                </p>
                                {!terkunci && (
                                    <div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setUlangi(true)
                                                setAdaGoresan(false)
                                            }}
                                        >
                                            <PenLineIcon /> Ulangi Tanda Tangan
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}

                        {tampilkanKanvas && !terkunci && (
                            <div className="grid gap-3">
                                <div
                                    ref={wadah}
                                    className="relative overflow-hidden bg-white border-2 border-dashed rounded-lg"
                                    style={{ height: TINGGI_KANVAS }}
                                >
                                    {lebar > 0 && (
                                        <SignatureCanvas
                                            ref={acuan}
                                            width={lebar}
                                            height={TINGGI_KANVAS}
                                            options={{ size: 4 }}
                                            onPointer={(titik) => {
                                                if (titik.length > 0)
                                                    setAdaGoresan(true)
                                            }}
                                            style={{
                                                width: lebar,
                                                height: TINGGI_KANVAS,
                                                touchAction: 'none',
                                                cursor: 'crosshair',
                                            }}
                                        />
                                    )}
                                    {!adaGoresan && (
                                        <span className="absolute inset-0 flex items-center justify-center text-sm pointer-events-none text-slate-400">
                                            Tanda tangan di sini
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <Button
                                        type="button"
                                        onClick={() => simpan()}
                                        disabled={menyimpan || !adaGoresan}
                                    >
                                        {menyimpan ? (
                                            <React.Fragment>
                                                <TimerIcon /> Menyimpan
                                            </React.Fragment>
                                        ) : (
                                            <React.Fragment>
                                                <CheckCircle2Icon /> Simpan Tanda
                                                Tangan
                                            </React.Fragment>
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => bersihkan()}
                                        disabled={menyimpan}
                                    >
                                        <EraserIcon /> Hapus
                                    </Button>
                                    {sudah && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => setUlangi(false)}
                                            disabled={menyimpan}
                                        >
                                            Batal
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}

                        {terkunci && (
                            <Alert className="mt-3">
                                <CheckCircle2Icon className="w-4 h-4" />
                                <AlertTitle>Tanda tangan terkunci</AlertTitle>
                                <AlertDescription>
                                    {sudah
                                        ? 'Berkas Anda sudah dilanjutkan ke asesor, sehingga tanda tangan tidak dapat diubah lagi.'
                                        : 'SK Anda sudah diproses, sehingga tanda tangan tidak dapat dibubuhkan lagi. Hubungi Akademik bila Form 03 perlu diperbaiki.'}
                                </AlertDescription>
                            </Alert>
                        )}
                    </React.Fragment>
                )}
            </CardContent>
        </Card>
    )
}

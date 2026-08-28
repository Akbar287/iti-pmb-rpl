'use client'

import React from 'react'
import KanvasTandaTangan from './KanvasTandaTangan'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { CheckCircle2Icon, PenLineIcon } from 'lucide-react'
import { toast } from 'sonner'
import {
    getStatusTandaTanganAsesor,
    simpanTandaTanganAsesor,
    urlTandaTanganAsesor,
    type StatusTandaTanganAsesor,
} from '@/services/TandaTanganAsesor/TandaTanganAsesorService'
import { formatDateToIndonesian } from '@/lib/utils'

/**
 * Pengesahan hasil rekapitulasi oleh Penilai 1 dan Penilai 2.
 *
 * Tiap asesor menandatangani slotnya sendiri; berkas baru dapat dilanjutkan ke
 * tahap sanggahan setelah keduanya menandatangani.
 */
export default function KartuTandaTanganAsesor({
    PendaftaranId,
    onBerubah,
}: {
    PendaftaranId: string
    onBerubah?: (status: StatusTandaTanganAsesor) => void
}) {
    const [status, setStatus] = React.useState<StatusTandaTanganAsesor | null>(
        null
    )
    const [memuat, setMemuat] = React.useState<boolean>(true)
    const [ulangi, setUlangi] = React.useState<boolean>(false)
    const [versi, setVersi] = React.useState<number>(0)

    const perbarui = React.useCallback(
        (baru: StatusTandaTanganAsesor) => {
            setStatus(baru)
            onBerubah?.(baru)
        },
        [onBerubah]
    )

    React.useEffect(() => {
        let batal = false
        setMemuat(true)
        getStatusTandaTanganAsesor(PendaftaranId)
            .then((res) => {
                if (!batal) perbarui(res)
            })
            .catch(() => {
                if (!batal) toast.error('Gagal memuat tanda tangan asesor')
            })
            .finally(() => {
                if (!batal) setMemuat(false)
            })
        return () => {
            batal = true
        }
    }, [PendaftaranId, perbarui])

    const simpan = async (dataUri: string) => {
        try {
            const res = await simpanTandaTanganAsesor(PendaftaranId, dataUri)
            perbarui(res)
            setVersi((n) => n + 1)
            setUlangi(false)
            toast.success('Tanda tangan tersimpan')
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : 'Gagal menyimpan tanda tangan'
            )
        }
    }

    const saya = status?.Daftar.find((d) => d.MilikSaya)
    const bolehTtd = !!status?.UrutanSaya && status.DapatDiubah
    const tampilkanKanvas = bolehTtd && (!saya?.SudahTandaTangan || ulangi)

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex flex-wrap items-center gap-3">
                    Pengesahan Hasil Penilaian
                    {status?.SemuaSudahTandaTangan ? (
                        <Badge className="bg-green-600">
                            Kedua penilai sudah tanda tangan
                        </Badge>
                    ) : (
                        <Badge variant="secondary">Menunggu tanda tangan</Badge>
                    )}
                </CardTitle>
                <CardDescription>
                    Penilai 1 dan Penilai 2 menandatangani hasil rekapitulasi.
                    Tanda tangan ini disematkan pada Form 03 (blok Validasi oleh)
                    dan Form 05 (Pengesahan Hasil Penilaian RPL), dan berkas baru
                    dapat dilanjutkan ke sanggahan setelah keduanya menandatangani.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {memuat ? (
                    <p className="text-sm text-muted-foreground">Memuat…</p>
                ) : !status || status.Daftar.length === 0 ? (
                    <Alert>
                        <AlertTitle>Asesor belum ditunjuk</AlertTitle>
                        <AlertDescription>
                            Belum ada penilai yang ditugaskan pada berkas ini.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <div className="grid gap-4">
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            {status.Daftar.map((d) => (
                                <div
                                    key={d.Urutan}
                                    className="p-3 border rounded-lg"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <span className="font-medium">
                                            Penilai {d.Urutan}
                                            {d.MilikSaya && (
                                                <span className="ml-2 text-xs text-muted-foreground">
                                                    (Anda)
                                                </span>
                                            )}
                                        </span>
                                        {d.SudahTandaTangan ? (
                                            <Badge className="bg-green-600">
                                                Sudah
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary">Belum</Badge>
                                        )}
                                    </div>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {d.Nama}
                                    </p>
                                    {d.SudahTandaTangan && (
                                        <div className="mt-2">
                                            <div className="flex items-center justify-center p-2 bg-white border rounded">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={urlTandaTanganAsesor(
                                                        PendaftaranId,
                                                        d.Urutan,
                                                        versi
                                                    )}
                                                    alt={`Tanda tangan Penilai ${d.Urutan}`}
                                                    className="object-contain h-20"
                                                />
                                            </div>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {d.TandaTanganPada
                                                    ? formatDateToIndonesian(
                                                        d.TandaTanganPada
                                                    )
                                                    : '-'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {tampilkanKanvas && (
                            <div className="grid gap-2">
                                <p className="text-sm font-medium">
                                    Tanda tangan Anda sebagai Penilai{' '}
                                    {status.UrutanSaya}
                                </p>
                                <KanvasTandaTangan
                                    onSimpan={simpan}
                                    onBatal={
                                        saya?.SudahTandaTangan
                                            ? () => setUlangi(false)
                                            : undefined
                                    }
                                />
                            </div>
                        )}

                        {bolehTtd && saya?.SudahTandaTangan && !ulangi && (
                            <div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setUlangi(true)}
                                >
                                    <PenLineIcon /> Ulangi Tanda Tangan Saya
                                </Button>
                            </div>
                        )}

                        {!status.UrutanSaya && (
                            <Alert>
                                <CheckCircle2Icon className="w-4 h-4" />
                                <AlertTitle>Anda memantau saja</AlertTitle>
                                <AlertDescription>
                                    Tanda tangan hanya dapat dibubuhkan oleh
                                    penilai yang ditugaskan pada berkas ini.
                                </AlertDescription>
                            </Alert>
                        )}

                        {status.UrutanSaya && !status.DapatDiubah && (
                            <Alert>
                                <CheckCircle2Icon className="w-4 h-4" />
                                <AlertTitle>Tanda tangan terkunci</AlertTitle>
                                <AlertDescription>
                                    Berkas sudah dilanjutkan ke tahap berikutnya,
                                    sehingga tanda tangan tidak dapat diubah lagi.
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

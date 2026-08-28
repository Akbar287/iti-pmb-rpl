'use client'

import React from 'react'
import SignatureCanvas, {
    type SignatureCanvasRef,
} from '@uiw/react-signature/canvas'
import { Button } from '@/components/ui/button'
import { CheckCircle2Icon, EraserIcon, TimerIcon } from 'lucide-react'
import { toast } from 'sonner'

/**
 * Kotak tanda tangan yang dipakai bersama oleh mahasiswa (Form 03) dan asesor
 * (Form 03 & Form 05).
 *
 * Memakai varian kanvas @uiw/react-signature karena hasilnya perlu menjadi PNG
 * untuk disematkan ke PDF. Diimpor langsung — bukan lewat next/dynamic — supaya
 * ref-nya sampai ke komponen; tanpa ref kanvasnya tidak dapat diekspor.
 */

const TINGGI_KANVAS = 200

export default function KanvasTandaTangan({
    onSimpan,
    labelSimpan = 'Simpan Tanda Tangan',
    onBatal,
    nonaktif,
}: {
    /** Menerima PNG data URI; lempar galat bila penyimpanan gagal. */
    onSimpan: (dataUri: string) => Promise<void>
    labelSimpan?: string
    onBatal?: () => void
    nonaktif?: boolean
}) {
    const acuan = React.useRef<SignatureCanvasRef>(null)
    const [menyimpan, setMenyimpan] = React.useState<boolean>(false)
    const [adaGoresan, setAdaGoresan] = React.useState<boolean>(false)

    // Lebar bitmap kanvas harus sama dengan lebar tampilannya; bila berbeda,
    // goresan tergambar meleset dari posisi kursor. Diukur lewat callback ref
    // supaya pengukuran terjadi tepat saat kotaknya muncul.
    const [lebar, setLebar] = React.useState<number>(0)
    const pengamat = React.useRef<ResizeObserver | null>(null)
    const wadah = React.useCallback((el: HTMLDivElement | null) => {
        pengamat.current?.disconnect()
        pengamat.current = null
        if (!el) return
        setLebar(Math.floor(el.clientWidth))
        const ro = new ResizeObserver(() => setLebar(Math.floor(el.clientWidth)))
        ro.observe(el)
        pengamat.current = ro
    }, [])

    React.useEffect(() => () => pengamat.current?.disconnect(), [])

    const bersihkan = () => {
        acuan.current?.clear()
        setAdaGoresan(false)
    }

    const simpan = async () => {
        const kanvas = acuan.current?.canvas
        if (!kanvas || !adaGoresan) {
            toast.error('Bubuhkan tanda tangan lebih dulu')
            return
        }
        setMenyimpan(true)
        try {
            await onSimpan(kanvas.toDataURL('image/png'))
            setAdaGoresan(false)
        } finally {
            setMenyimpan(false)
        }
    }

    return (
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
                            if (titik.length > 0) setAdaGoresan(true)
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
                    disabled={menyimpan || nonaktif || !adaGoresan}
                >
                    {menyimpan ? (
                        <React.Fragment>
                            <TimerIcon /> Menyimpan
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <CheckCircle2Icon /> {labelSimpan}
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
                {onBatal && (
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onBatal}
                        disabled={menyimpan}
                    >
                        Batal
                    </Button>
                )}
            </div>
        </div>
    )
}

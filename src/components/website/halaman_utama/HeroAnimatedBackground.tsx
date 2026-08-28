'use client'

import React from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

/**
 * Latar animasi halaman utama.
 *
 * Delapan adegan, masing-masing 2,5 detik — satu siklus penuh tepat 20 detik,
 * lalu berulang. Setiap pergantian adegan mengganti **seluruh layar**: langit,
 * aurora, siluet kampus, partikel, panel, sampai pelakunya. Isi tiap adegan
 * mengikuti alur nyata aplikasi RPL ITI: data diri, unggah dokumen, asesmen
 * mandiri, penunjukan asesor, penilaian, rekapitulasi, penerbitan SK lewat
 * Sisurat, lalu publikasi SK.
 *
 * Semua angka ditulis tetap (tanpa Math.random / Date) supaya render di server
 * dan di browser identik — mencegah hydration mismatch.
 */

const mudah = [0.22, 1, 0.36, 1] as const
const DETIK_ADEGAN = 2.5

type IdAdegan =
    | 'daftar'
    | 'unggah'
    | 'mandiri'
    | 'asesor'
    | 'nilai'
    | 'rekap'
    | 'sisurat'
    | 'terbit'

type Adegan = {
    id: IdAdegan
    tahap: string
    judul: string
    aksen: string
    kedua: string
    langit: [string, string, string, string]
}

const ADEGAN: Adegan[] = [
    {
        id: 'daftar',
        tahap: 'Data Diri',
        judul: 'Calon mahasiswa mendaftar dan melengkapi data diri',
        aksen: '#fb923c',
        kedua: '#fbbf24',
        langit: ['#140833', '#3b1663', '#7b2b5e', '#f2621f'],
    },
    {
        id: 'unggah',
        tahap: 'Unggah Dokumen',
        judul: 'Ijazah, transkrip, sertifikat, dan portofolio diunggah',
        aksen: '#38bdf8',
        kedua: '#818cf8',
        langit: ['#04182f', '#0e3a5c', '#155e75', '#38bdf8'],
    },
    {
        id: 'mandiri',
        tahap: 'Asesmen Mandiri',
        judul: 'Mahasiswa menilai sendiri capaian pembelajarannya',
        aksen: '#a78bfa',
        kedua: '#f0abfc',
        langit: ['#170b36', '#3b1d70', '#5b21b6', '#a78bfa'],
    },
    {
        id: 'asesor',
        tahap: 'Penunjukan Asesor',
        judul: 'Kaprodi menunjuk asesor, Wakil Rektor menyetujui',
        aksen: '#f472b6',
        kedua: '#fb7185',
        langit: ['#210a2c', '#4a1246', '#8a1c5a', '#f472b6'],
    },
    {
        id: 'nilai',
        tahap: 'Penilaian Asesor',
        judul: 'Asesor menilai portofolio, tulis, wawancara, dan demo',
        aksen: '#22d3ee',
        kedua: '#5eead4',
        langit: ['#04202b', '#0b4553', '#0f766e', '#22d3ee'],
    },
    {
        id: 'rekap',
        tahap: 'Rekapitulasi',
        judul: 'Rekapitulasi hasil — mahasiswa menerima tanpa sanggahan',
        aksen: '#34d399',
        kedua: '#a3e635',
        langit: ['#052015', '#0b4a30', '#15803d', '#34d399'],
    },
    {
        id: 'sisurat',
        tahap: 'SK di Sisurat',
        judul: 'SK diinisialisasi ke Sisurat: persetujuan, nomor surat, tanda tangan',
        aksen: '#fbbf24',
        kedua: '#fb923c',
        langit: ['#231204', '#5a2a06', '#a16207', '#fbbf24'],
    },
    {
        id: 'terbit',
        tahap: 'SK Terbit',
        judul: 'SK terbit, dipublikasikan — SKS diakui, kuliah lebih cepat',
        aksen: '#f2621f',
        kedua: '#f7a13c',
        langit: ['#1b0b3a', '#4c1d95', '#b4327a', '#f7a13c'],
    },
]

/* ------------------------------------------------------------- utilitas --- */

/** Pencacah angka yang naik halus; dipakai untuk SKS, persen, dan skor. */
function useHitung(target: number, diam: boolean, durasi = 1.6) {
    const [n, setN] = React.useState(0)
    React.useEffect(() => {
        if (diam) {
            setN(target)
            return
        }
        let raf = 0
        let mulai = 0
        const jalan = (t: number) => {
            if (!mulai) mulai = t
            const p = Math.min(1, (t - mulai) / (durasi * 1000))
            setN(Math.round(target * (1 - Math.pow(1 - p, 3))))
            if (p < 1) raf = requestAnimationFrame(jalan)
        }
        raf = requestAnimationFrame(jalan)
        return () => cancelAnimationFrame(raf)
    }, [target, diam, durasi])
    return n
}

const KIRI = { x: 92, y: 372, w: 462, h: 376 }
const KANAN = { x: 886, y: 364, w: 462, h: 376 }

function Panel({
    x,
    y,
    w,
    h,
    judul,
    warna,
    delay = 0,
    diam,
    children,
}: {
    x: number
    y: number
    w: number
    h: number
    judul: string
    warna: string
    delay?: number
    diam: boolean
    children: React.ReactNode
}) {
    return (
        <motion.g
            initial={diam ? false : { opacity: 0, y: 34, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={diam ? undefined : { opacity: 0, y: -24, scale: 0.97 }}
            transition={{ duration: 0.6, ease: mudah, delay }}
        >
            <rect
                x={x}
                y={y}
                width={w}
                height={h}
                rx="22"
                fill="#070c1d"
                opacity="0.84"
            />
            <rect x={x} y={y} width={w} height="46" rx="22" fill={warna} opacity="0.18" />
            <rect x={x} y={y + 24} width={w} height="22" fill={warna} opacity="0.18" />
            <rect
                x={x}
                y={y}
                width={w}
                height={h}
                rx="22"
                fill="none"
                stroke={warna}
                strokeOpacity="0.55"
                strokeWidth="1.6"
            />
            <circle cx={x + 26} cy={y + 23} r="5.5" fill={warna} />
            <text
                x={x + 44}
                y={y + 28}
                fontSize="15.5"
                fontWeight="700"
                fill="#e8eeff"
                letterSpacing="0.6"
            >
                {judul}
            </text>
            <g transform={`translate(${x} ${y + 46})`}>{children}</g>
        </motion.g>
    )
}

/** Baris daftar dengan tanda centang yang muncul berurutan. */
function BarisCentang({
    y,
    teks,
    kanan,
    warna,
    delay,
    diam,
    w = 462,
}: {
    y: number
    teks: string
    kanan?: string
    warna: string
    delay: number
    diam: boolean
    w?: number
}) {
    return (
        <motion.g
            initial={diam ? false : { opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: mudah, delay: diam ? 0 : delay }}
        >
            <rect
                x="26"
                y={y}
                width={w - 52}
                height="38"
                rx="10"
                fill="#0f1730"
                opacity="0.9"
            />
            <motion.rect
                x="26"
                y={y}
                width="4"
                height="38"
                rx="2"
                fill={warna}
                initial={diam ? false : { scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.35, delay: diam ? 0 : delay + 0.1 }}
                style={{ originY: `${y + 19}px` }}
            />
            <text x="46" y={y + 24} fontSize="13.5" fill="#cbd5e1">
                {teks}
            </text>
            {kanan && (
                <text
                    x={w - 42}
                    y={y + 24}
                    textAnchor="end"
                    fontSize="12.5"
                    fontWeight="700"
                    fill={warna}
                >
                    {kanan}
                </text>
            )}
        </motion.g>
    )
}

/** Bar progres horizontal yang terisi. */
function BarProgres({
    x,
    y,
    w,
    persen,
    warna,
    delay,
    diam,
    tinggi = 9,
}: {
    x: number
    y: number
    w: number
    persen: number
    warna: string
    delay: number
    diam: boolean
    tinggi?: number
}) {
    return (
        <g>
            <rect x={x} y={y} width={w} height={tinggi} rx={tinggi / 2} fill="#1e293b" />
            <motion.rect
                x={x}
                y={y}
                height={tinggi}
                rx={tinggi / 2}
                fill={warna}
                initial={diam ? false : { width: 0 }}
                animate={{ width: (w * persen) / 100 }}
                transition={{
                    duration: diam ? 0 : 1.15,
                    ease: mudah,
                    delay: diam ? 0 : delay,
                }}
            />
        </g>
    )
}

function Lencana({
    x,
    y,
    teks,
    warna,
    delay,
    diam,
    lebar = 92,
}: {
    x: number
    y: number
    teks: string
    warna: string
    delay: number
    diam: boolean
    lebar?: number
}) {
    return (
        <motion.g
            initial={diam ? false : { opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: mudah, delay: diam ? 0 : delay }}
        >
            <rect
                x={x}
                y={y}
                width={lebar}
                height="26"
                rx="13"
                fill={warna}
                opacity="0.22"
            />
            <rect
                x={x}
                y={y}
                width={lebar}
                height="26"
                rx="13"
                fill="none"
                stroke={warna}
                strokeOpacity="0.65"
            />
            <text
                x={x + lebar / 2}
                y={y + 17.5}
                textAnchor="middle"
                fontSize="11.5"
                fontWeight="700"
                fill={warna}
            >
                {teks}
            </text>
        </motion.g>
    )
}

function Avatar({
    cx,
    cy,
    r,
    warna,
    kulit = '#f2c79a',
}: {
    cx: number
    cy: number
    r: number
    warna: string
    kulit?: string
}) {
    return (
        <g>
            <circle cx={cx} cy={cy} r={r} fill={warna} opacity="0.25" />
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={warna} strokeWidth="1.6" />
            <circle cx={cx} cy={cy - r * 0.18} r={r * 0.34} fill={kulit} />
            <path
                d={`M${cx - r * 0.55} ${cy + r * 0.72} a${r * 0.55} ${r * 0.5} 0 0 1 ${r * 1.1} 0 z`}
                fill={kulit}
            />
        </g>
    )
}

/** Pola kotak-kotak menyerupai QR pada dokumen SK. */
function PolaQr({ x, y, s = 5 }: { x: number; y: number; s?: number }) {
    const sel: React.ReactNode[] = []
    for (let b = 0; b < 11; b++) {
        for (let k = 0; k < 11; k++) {
            const sudut =
                (b < 3 && k < 3) || (b < 3 && k > 7) || (b > 7 && k < 3)
            const isi = sudut || (b * 5 + k * 3 + ((b * k) % 7)) % 3 !== 0
            if (!isi) continue
            sel.push(
                <rect
                    key={`${b}-${k}`}
                    x={x + k * s}
                    y={y + b * s}
                    width={s}
                    height={s}
                    fill="#0f172a"
                />
            )
        }
    }
    return (
        <g>
            <rect
                x={x - 4}
                y={y - 4}
                width={11 * s + 8}
                height={11 * s + 8}
                fill="#ffffff"
            />
            {sel}
        </g>
    )
}

/** Orang berdiri sederhana; `aksi` menentukan gerak tangannya. */
function OrangBerdiri({
    warna,
    kulit = '#f2c79a',
    aksi,
    diam,
}: {
    warna: string
    kulit?: string
    aksi: 'diam' | 'hp' | 'sorak' | 'tunjuk'
    diam: boolean
}) {
    const tangan =
        aksi === 'sorak'
            ? ['M-20 -56 l-16 -34', 'M20 -56 l16 -34']
            : aksi === 'hp'
                ? ['M-20 -54 l-10 24', 'M20 -54 l-4 24']
                : aksi === 'tunjuk'
                    ? ['M-20 -54 l-12 26', 'M20 -54 l30 -12']
                    : ['M-20 -54 l-10 30', 'M20 -54 l10 30']
    return (
        <motion.g
            animate={diam ? undefined : { y: [0, -5, 0] }}
            transition={
                diam ? undefined : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
            }
        >
            <ellipse cx="0" cy="6" rx="34" ry="8" fill="#000" opacity="0.28" />
            <path d="M-22 -66 q22 -14 44 0 l6 66 h-56 z" fill={warna} />
            <circle cx="0" cy="-86" r="20" fill={kulit} />
            <path d="M-20 -94 q20 -20 40 0 q-20 -10 -40 0 z" fill="#3b2417" />
            {tangan.map((d, i) => (
                <motion.path
                    key={i}
                    d={d}
                    stroke={warna}
                    strokeWidth="11"
                    strokeLinecap="round"
                    fill="none"
                    animate={
                        diam || aksi !== 'sorak'
                            ? undefined
                            : { rotate: i === 0 ? [-6, 8, -6] : [6, -8, 6] }
                    }
                    transition={
                        diam || aksi !== 'sorak'
                            ? undefined
                            : { duration: 1.1, repeat: Infinity, ease: 'easeInOut' }
                    }
                    style={{ originX: '0px', originY: '-56px' }}
                />
            ))}
            <path d="M-14 0 l-4 44" stroke="#1f1147" strokeWidth="12" strokeLinecap="round" />
            <path d="M14 0 l4 44" stroke="#1f1147" strokeWidth="12" strokeLinecap="round" />
            {aksi === 'hp' && (
                <motion.g
                    animate={diam ? undefined : { y: [0, -3, 0] }}
                    transition={diam ? undefined : { duration: 1.6, repeat: Infinity }}
                >
                    <rect x="-26" y="-40" width="20" height="32" rx="4" fill="#0f172a" />
                    <rect x="-24" y="-37" width="16" height="26" rx="2" fill="#38bdf8" opacity="0.8" />
                </motion.g>
            )}
        </motion.g>
    )
}

/** Kartu dokumen; dipakai untuk berkas terbang maupun SK. */
function KartuDokumen({
    l = 84,
    t = 108,
    warna,
    judul,
    qr,
    segel,
}: {
    l?: number
    t?: number
    warna: string
    judul?: string
    qr?: boolean
    segel?: boolean
}) {
    const baris = Math.max(2, Math.floor((t - 46) / 14))
    return (
        <g>
            <rect x={-l / 2} y={-t / 2} width={l} height={t} rx="6" fill="#f8fafc" />
            <rect x={-l / 2} y={-t / 2} width={l} height="16" rx="6" fill={warna} />
            <rect x={-l / 2} y={-t / 2 + 10} width={l} height="6" fill={warna} />
            {judul && (
                <text
                    x="0"
                    y={-t / 2 + 30}
                    textAnchor="middle"
                    fontSize="8"
                    fontWeight="700"
                    fill="#0f172a"
                    letterSpacing="0.8"
                >
                    {judul}
                </text>
            )}
            {Array.from({ length: baris }).map((_, i) => (
                <rect
                    key={i}
                    x={-l / 2 + 12}
                    y={-t / 2 + 40 + i * 12}
                    width={l - 24 - (i % 3) * 12}
                    height="4"
                    rx="2"
                    fill="#cbd5e1"
                />
            ))}
            {qr && <PolaQr x={-l / 2 + 12} y={t / 2 - 42} s={2.6} />}
            {segel && (
                <g transform={`translate(${l / 2 - 26} ${t / 2 - 28})`}>
                    <circle r="16" fill="none" stroke="#f2621f" strokeWidth="2.5" />
                    <circle r="11" fill="#f2621f" opacity="0.2" />
                    <text
                        textAnchor="middle"
                        y="3"
                        fontSize="7"
                        fontWeight="700"
                        fill="#f2621f"
                    >
                        ITI
                    </text>
                </g>
            )}
        </g>
    )
}

/* ---------------------------------------------------------- lapis latar --- */

const BINTANG = [
    [90, 60], [220, 120], [340, 48], [470, 96], [600, 40], [720, 130],
    [860, 62], [980, 110], [1110, 44], [1240, 118], [1360, 70], [160, 190],
    [520, 200], [900, 196], [1300, 210], [60, 260], [1400, 280], [400, 150],
] as const

function Bintang({ diam }: { diam: boolean }) {
    return (
        <g>
            {BINTANG.map(([x, y], i) => (
                <motion.circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={i % 3 === 0 ? 1.9 : 1.2}
                    fill="#fff"
                    opacity={0.5}
                    animate={diam ? undefined : { opacity: [0.15, 0.75, 0.15] }}
                    transition={
                        diam
                            ? undefined
                            : {
                                duration: 2.6 + (i % 5) * 0.7,
                                repeat: Infinity,
                                delay: (i % 7) * 0.4,
                            }
                    }
                />
            ))}
        </g>
    )
}

function Aurora({ adegan, diam }: { adegan: Adegan; diam: boolean }) {
    const bentuk = [
        { cx: 250, cy: 250, rx: 320, ry: 150, warna: adegan.aksen, op: 0.3 },
        { cx: 1180, cy: 210, rx: 300, ry: 140, warna: adegan.kedua, op: 0.26 },
        { cx: 720, cy: 470, rx: 420, ry: 170, warna: adegan.aksen, op: 0.16 },
    ]
    return (
        <g style={{ filter: 'blur(60px)' }}>
            {bentuk.map((b, i) => (
                <motion.ellipse
                    key={`${adegan.id}-${i}`}
                    cx={b.cx}
                    cy={b.cy}
                    rx={b.rx}
                    ry={b.ry}
                    fill={b.warna}
                    initial={diam ? false : { opacity: 0, scale: 0.85 }}
                    animate={
                        diam
                            ? { opacity: b.op }
                            : { opacity: [0, b.op, b.op * 0.7, b.op], scale: [0.85, 1.06, 1] }
                    }
                    exit={diam ? undefined : { opacity: 0 }}
                    transition={{ duration: DETIK_ADEGAN, ease: 'easeInOut' }}
                />
            ))}
        </g>
    )
}

const GEDUNG = [
    [20, 78, 132], [118, 60, 186], [196, 92, 108], [306, 68, 214],
    [392, 80, 146], [488, 56, 96], [1006, 100, 176], [1124, 74, 132],
    [1216, 108, 208], [1342, 78, 154],
] as const

function Siluet({ adegan, diam }: { adegan: Adegan; diam: boolean }) {
    return (
        <g>
            {GEDUNG.map(([x, l, t], i) => (
                <motion.rect
                    key={i}
                    x={x}
                    y={560 - t}
                    width={l}
                    height={t}
                    fill={i % 2 === 0 ? adegan.langit[1] : adegan.langit[0]}
                    animate={{ fill: i % 2 === 0 ? adegan.langit[1] : adegan.langit[0] }}
                    transition={{ duration: 0.9 }}
                    opacity="0.92"
                />
            ))}
            {GEDUNG.map(([x, l, t], i) =>
                Array.from({ length: Math.max(2, Math.floor(t / 46)) }).map((_, b) => (
                    <motion.rect
                        key={`${i}-${b}`}
                        x={x + 12}
                        y={560 - t + 16 + b * 42}
                        width={l - 24}
                        height="9"
                        rx="2"
                        fill={adegan.kedua}
                        animate={{ fill: adegan.kedua }}
                        opacity={(i + b) % 3 === 0 ? 0.5 : 0.2}
                        transition={{ duration: 0.9 }}
                    />
                ))
            )}

            {/* menara ITI */}
            <g>
                <motion.rect
                    x="602"
                    y="322"
                    width="196"
                    height="238"
                    rx="6"
                    fill={adegan.langit[1]}
                    animate={{ fill: adegan.langit[1] }}
                    transition={{ duration: 0.9 }}
                />
                <motion.rect
                    x="602"
                    y="322"
                    width="196"
                    height="26"
                    fill={adegan.aksen}
                    animate={{ fill: adegan.aksen }}
                    transition={{ duration: 0.9 }}
                    opacity="0.85"
                />
                {[0, 1, 2, 3].map((b) => (
                    <motion.rect
                        key={b}
                        x="618"
                        y={362 + b * 46}
                        width="164"
                        height="12"
                        rx="3"
                        fill={adegan.kedua}
                        animate={{ fill: adegan.kedua }}
                        opacity={b % 2 === 0 ? 0.45 : 0.22}
                        transition={{ duration: 0.9 }}
                    />
                ))}
                <text
                    x="700"
                    y="341"
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="800"
                    fill="#fff"
                    letterSpacing="4"
                >
                    ITI
                </text>
            </g>

            {/* jalan + kendaraan */}
            <rect x="0" y="560" width="1440" height="44" fill="#120a26" opacity="0.9" />
            <motion.g
                animate={diam ? undefined : { x: [0, -120] }}
                transition={
                    diam ? undefined : { duration: 2, repeat: Infinity, ease: 'linear' }
                }
                opacity="0.35"
            >
                {Array.from({ length: 14 }).map((_, i) => (
                    <rect key={i} x={i * 120} y="586" width="56" height="3" fill="#fbbf24" />
                ))}
            </motion.g>
            {[
                ['#ef4444', 15, 0, 1],
                ['#38bdf8', 21, 6, -1],
            ].map(([warna, durasi, jeda, arah], i) => {
                const dari = (arah as number) > 0 ? -180 : 1620
                const ke = (arah as number) > 0 ? 1620 : -180
                return (
                    <motion.g
                        key={i}
                        initial={{ x: diam ? 600 : dari }}
                        animate={diam ? undefined : { x: [dari, ke] }}
                        transition={
                            diam
                                ? undefined
                                : {
                                    duration: durasi as number,
                                    repeat: Infinity,
                                    ease: 'linear',
                                    delay: jeda as number,
                                }
                        }
                        opacity="0.85"
                    >
                        <g transform={`translate(0 578) scale(${0.62 * (arah as number)} 0.62)`}>
                            <rect x="0" y="-22" width="92" height="21" rx="7" fill={warna as string} />
                            <rect
                                x="18"
                                y="-32"
                                width="46"
                                height="12"
                                rx="4"
                                fill={warna as string}
                                opacity="0.75"
                            />
                            <circle cx="22" cy="1" r="6" fill="#0f172a" />
                            <circle cx="72" cy="1" r="6" fill="#0f172a" />
                        </g>
                    </motion.g>
                )
            })}
        </g>
    )
}

const PARTIKEL = [
    [70, 13, 0], [210, 16, 1.4], [360, 11, 0.6], [520, 15, 2.1],
    [660, 12, 1.1], [810, 17, 0.3], [950, 12.5, 1.8], [1090, 14, 0.9],
    [1230, 16, 2.4], [1370, 11.5, 1.6],
] as const

function Partikel({ adegan, diam }: { adegan: Adegan; diam: boolean }) {
    if (diam) return null
    return (
        <g opacity="0.55">
            {PARTIKEL.map(([x, durasi, jeda], i) => (
                <motion.g
                    key={`${adegan.id}-${i}`}
                    initial={{ y: 960, opacity: 0 }}
                    animate={{
                        y: [960, -80],
                        x: [x, x + (i % 2 === 0 ? 46 : -46), x],
                        opacity: [0, 0.9, 0.9, 0],
                    }}
                    transition={{
                        duration: durasi,
                        repeat: Infinity,
                        ease: 'linear',
                        delay: jeda,
                        opacity: { duration: durasi, repeat: Infinity, times: [0, 0.12, 0.8, 1] },
                    }}
                >
                    {i % 3 === 0 ? (
                        <g transform="scale(0.85)">
                            <rect x="-8" y="-10" width="16" height="20" rx="2" fill={adegan.kedua} />
                            <rect x="-5" y="-4" width="10" height="2" fill="#0b1024" />
                            <rect x="-5" y="1" width="7" height="2" fill="#0b1024" />
                        </g>
                    ) : i % 3 === 1 ? (
                        <circle r="4" fill={adegan.aksen} />
                    ) : (
                        <path
                            d="M0 -8 l2.6 5.4 5.9 .8 -4.3 4.1 1 5.9 -5.2 -2.8 -5.2 2.8 1 -5.9 -4.3 -4.1 5.9 -.8 z"
                            fill={adegan.kedua}
                            opacity="0.9"
                        />
                    )}
                </motion.g>
            ))}
        </g>
    )
}

/** Sapuan cahaya sekali tiap adegan — menegaskan seluruh layar berganti. */
function Sapuan({ adegan, diam }: { adegan: Adegan; diam: boolean }) {
    if (diam) return null
    return (
        <g transform="rotate(14 720 450)">
            <motion.rect
                key={adegan.id}
                x="0"
                y="-200"
                width="420"
                height="1400"
                fill="url(#sapuan)"
                initial={{ x: -700, opacity: 0 }}
                animate={{ x: [-700, 1700], opacity: [0, 0.5, 0] }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
            />
        </g>
    )
}

function Lantai({ adegan, diam }: { adegan: Adegan; diam: boolean }) {
    return (
        <g>
            <rect x="0" y="604" width="1440" height="296" fill="#07040f" opacity="0.86" />
            <motion.g
                key={adegan.id}
                initial={diam ? false : { opacity: 0 }}
                animate={{ opacity: 0.32 }}
                exit={diam ? undefined : { opacity: 0 }}
                transition={{ duration: 0.8 }}
            >
                {Array.from({ length: 17 }).map((_, i) => (
                    <line
                        key={i}
                        x1={720 + (i - 8) * 60}
                        y1="604"
                        x2={720 + (i - 8) * 240}
                        y2="900"
                        stroke={adegan.aksen}
                        strokeWidth="1"
                        opacity="0.5"
                    />
                ))}
                {[640, 700, 780, 880].map((y, i) => (
                    <line
                        key={i}
                        x1="0"
                        y1={y}
                        x2="1440"
                        y2={y}
                        stroke={adegan.aksen}
                        strokeWidth="1"
                        opacity="0.35"
                    />
                ))}
            </motion.g>
        </g>
    )
}

/* ------------------------------------------------------------- adegan 1 --- */

const BIDANG = [
    ['Nama Lengkap', 'Rizky Ananda Putra'],
    ['NIK', '3671 •••• •••• 0007'],
    ['Tempat, Tanggal Lahir', 'Tangerang, 12 Mei 1996'],
    ['Nomor HP', '0812 •••• 4517'],
] as const

function AdeganDaftar({ adegan, diam }: { adegan: Adegan; diam: boolean }) {
    return (
        <g>
            <Panel {...KIRI} judul="Formulir Data Diri" warna={adegan.aksen} diam={diam}>
                <Avatar cx={62} cy={58} r={34} warna={adegan.aksen} />
                <motion.text
                    x="112"
                    y="46"
                    fontSize="14"
                    fill="#e2e8f0"
                    fontWeight="600"
                    initial={diam ? false : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: diam ? 0 : 0.25 }}
                >
                    Pendaftar Jalur RPL
                </motion.text>
                <text x="112" y="68" fontSize="11.5" fill="#94a3b8">
                    Rekognisi Pembelajaran Lampau
                </text>

                {BIDANG.map(([label, nilai], i) => (
                    <motion.g
                        key={label}
                        initial={diam ? false : { opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.4,
                            ease: mudah,
                            delay: diam ? 0 : 0.35 + i * 0.22,
                        }}
                    >
                        <text x="28" y={118 + i * 52} fontSize="10.5" fill="#7c8db5">
                            {label}
                        </text>
                        <rect
                            x="26"
                            y={124 + i * 52}
                            width="410"
                            height="32"
                            rx="8"
                            fill="#0f1730"
                            stroke={adegan.aksen}
                            strokeOpacity="0.3"
                        />
                        <text x="40" y={145 + i * 52} fontSize="12.5" fill="#dbe4ff">
                            {nilai}
                        </text>
                        {i === 3 && !diam && (
                            <motion.rect
                                x="196"
                                y={130 + i * 52}
                                width="2"
                                height="20"
                                fill={adegan.aksen}
                                animate={{ opacity: [1, 0, 1] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                            />
                        )}
                    </motion.g>
                ))}
            </Panel>

            <Panel
                {...KANAN}
                judul="Program Studi & Gelombang"
                warna={adegan.kedua}
                delay={0.12}
                diam={diam}
            >
                {[
                    ['Teknik Informatika — S1', 'Dipilih'],
                    ['Teknik Industri — S1', ''],
                    ['Teknik Elektro — S1', ''],
                ].map(([teks, kanan], i) => (
                    <BarisCentang
                        key={teks}
                        y={24 + i * 50}
                        teks={teks}
                        kanan={kanan || undefined}
                        warna={i === 0 ? adegan.kedua : '#475569'}
                        delay={0.4 + i * 0.18}
                        diam={diam}
                    />
                ))}
                <text x="28" y="204" fontSize="10.5" fill="#7c8db5">
                    Kelengkapan berkas pendaftaran
                </text>
                <BarProgres
                    x={26}
                    y={214}
                    w={410}
                    persen={64}
                    warna={adegan.aksen}
                    delay={0.8}
                    diam={diam}
                />
                <Lencana
                    x={26}
                    y={244}
                    teks="Gelombang 2026"
                    warna={adegan.kedua}
                    delay={1.1}
                    diam={diam}
                    lebar={130}
                />
                <Lencana
                    x={170}
                    y={244}
                    teks="Jalur RPL"
                    warna={adegan.aksen}
                    delay={1.25}
                    diam={diam}
                    lebar={96}
                />
            </Panel>

            <motion.g
                initial={diam ? false : { opacity: 0, x: 700, y: 900 }}
                animate={{ opacity: 1, x: 700, y: 856 }}
                transition={{ duration: 0.6, ease: mudah, delay: diam ? 0 : 0.2 }}
            >
                <OrangBerdiri warna={adegan.aksen} aksi="hp" diam={diam} />
            </motion.g>
        </g>
    )
}

/* ------------------------------------------------------------- adegan 2 --- */

const BERKAS = [
    ['Ijazah Terakhir', '100%', 100],
    ['Transkrip Nilai', '100%', 100],
    ['Sertifikat Kompetensi', '86%', 86],
    ['SK Pengalaman Kerja', '62%', 62],
] as const

function AdeganUnggah({ adegan, diam }: { adegan: Adegan; diam: boolean }) {
    const persen = useHitung(92, diam, 1.8)
    return (
        <g>
            <Panel {...KIRI} judul="Unggah Dokumen" warna={adegan.aksen} diam={diam}>
                {BERKAS.map(([nama, teks, nilai], i) => (
                    <motion.g
                        key={nama}
                        initial={diam ? false : { opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            duration: 0.4,
                            ease: mudah,
                            delay: diam ? 0 : 0.25 + i * 0.2,
                        }}
                    >
                        <rect
                            x="26"
                            y={22 + i * 74}
                            width="30"
                            height="38"
                            rx="4"
                            fill={adegan.kedua}
                            opacity="0.85"
                        />
                        <text x="68" y={40 + i * 74} fontSize="13" fill="#dbe4ff">
                            {nama}
                        </text>
                        <text
                            x="436"
                            y={40 + i * 74}
                            textAnchor="end"
                            fontSize="11.5"
                            fontWeight="700"
                            fill={(nilai as number) === 100 ? '#34d399' : adegan.aksen}
                        >
                            {(nilai as number) === 100 ? 'Selesai' : teks}
                        </text>
                        <BarProgres
                            x={68}
                            y={50 + i * 74}
                            w={368}
                            persen={nilai as number}
                            warna={(nilai as number) === 100 ? '#34d399' : adegan.aksen}
                            delay={0.35 + i * 0.2}
                            diam={diam}
                            tinggi={7}
                        />
                    </motion.g>
                ))}
            </Panel>

            <Panel
                {...KANAN}
                judul="Penyimpanan Berkas"
                warna={adegan.kedua}
                delay={0.12}
                diam={diam}
            >
                <motion.g
                    initial={
                        diam ? false : { opacity: 0, scale: 0.8, x: 231, y: 96 }
                    }
                    animate={{ opacity: 1, scale: 1, x: 231, y: 96 }}
                    transition={{ duration: 0.6, ease: mudah, delay: diam ? 0 : 0.3 }}
                >
                    <path
                        d="M-70 12 a34 34 0 0 1 8 -66 a44 44 0 0 1 82 -10 a32 32 0 0 1 22 60 z"
                        fill={adegan.kedua}
                        opacity="0.22"
                        stroke={adegan.kedua}
                        strokeWidth="2"
                    />
                    <motion.path
                        d="M0 34 l0 -52 m-18 18 l18 -18 l18 18"
                        stroke={adegan.aksen}
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        animate={diam ? undefined : { y: [8, -6, 8] }}
                        transition={
                            diam
                                ? undefined
                                : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }
                        }
                    />
                </motion.g>
                <text
                    x="231"
                    y="176"
                    textAnchor="middle"
                    fontSize="34"
                    fontWeight="800"
                    fill="#fff"
                >
                    {persen}%
                </text>
                <text x="231" y="198" textAnchor="middle" fontSize="11.5" fill="#94a3b8">
                    berkas tersimpan di storage RPL
                </text>
                <BarProgres
                    x={56}
                    y={216}
                    w={350}
                    persen={92}
                    warna={adegan.aksen}
                    delay={0.4}
                    diam={diam}
                />
                <Lencana
                    x={56}
                    y={246}
                    teks="PDF terverifikasi"
                    warna="#34d399"
                    delay={1.2}
                    diam={diam}
                    lebar={148}
                />
                <Lencana
                    x={216}
                    y={246}
                    teks="Maks. 5 MB"
                    warna={adegan.kedua}
                    delay={1.35}
                    diam={diam}
                    lebar={118}
                />
            </Panel>

            {/* berkas terbang dari mahasiswa ke penyimpanan */}
            {[0, 1, 2].map((i) => (
                <motion.g
                    key={i}
                    initial={{ x: 600, y: 800, opacity: 0, rotate: -12 }}
                    animate={
                        diam
                            ? { x: 900, y: 700, opacity: 1, rotate: 0 }
                            : {
                                x: [600, 800, 1010],
                                y: [800, 640, 700],
                                opacity: [0, 1, 1, 0],
                                rotate: [-14, 6, 14],
                            }
                    }
                    transition={
                        diam
                            ? undefined
                            : {
                                duration: 1.9,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: i * 0.42,
                                opacity: {
                                    duration: 1.9,
                                    repeat: Infinity,
                                    delay: i * 0.42,
                                    times: [0, 0.18, 0.75, 1],
                                },
                            }
                    }
                >
                    <KartuDokumen l={62} t={80} warna={adegan.kedua} />
                </motion.g>
            ))}

            <motion.g
                initial={diam ? false : { opacity: 0, x: 600, y: 906 }}
                animate={{ opacity: 1, x: 600, y: 864 }}
                transition={{ duration: 0.6, ease: mudah, delay: diam ? 0 : 0.2 }}
            >
                <OrangBerdiri warna={adegan.aksen} aksi="tunjuk" diam={diam} />
            </motion.g>
        </g>
    )
}

/* ------------------------------------------------------------- adegan 3 --- */

const MATKUL = [
    ['Algoritma & Pemrograman', '3 SKS'],
    ['Basis Data', '3 SKS'],
    ['Jaringan Komputer', '3 SKS'],
    ['Rekayasa Perangkat Lunak', '3 SKS'],
    ['Manajemen Proyek TI', '2 SKS'],
] as const

function AdeganMandiri({ adegan, diam }: { adegan: Adegan; diam: boolean }) {
    const sks = useHitung(14, diam, 1.5)
    return (
        <g>
            <Panel
                {...KIRI}
                judul="Asesmen Mandiri — Mata Kuliah"
                warna={adegan.aksen}
                diam={diam}
            >
                {MATKUL.map(([nama, sksTeks], i) => (
                    <motion.g
                        key={nama}
                        initial={diam ? false : { opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            duration: 0.35,
                            ease: mudah,
                            delay: diam ? 0 : 0.22 + i * 0.17,
                        }}
                    >
                        <rect
                            x="26"
                            y={18 + i * 56}
                            width="410"
                            height="42"
                            rx="10"
                            fill="#0f1730"
                        />
                        <motion.rect
                            x="38"
                            y={29 + i * 56}
                            width="20"
                            height="20"
                            rx="5"
                            fill={adegan.aksen}
                            initial={diam ? false : { scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                duration: 0.3,
                                ease: mudah,
                                delay: diam ? 0 : 0.4 + i * 0.17,
                            }}
                        />
                        <motion.path
                            d={`M43 ${39 + i * 56} l4 4 l8 -9`}
                            stroke="#0b1024"
                            strokeWidth="2.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                            initial={diam ? false : { pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{
                                duration: 0.25,
                                delay: diam ? 0 : 0.5 + i * 0.17,
                            }}
                        />
                        <text x="72" y={45 + i * 56} fontSize="13" fill="#dbe4ff">
                            {nama}
                        </text>
                        <text
                            x="424"
                            y={45 + i * 56}
                            textAnchor="end"
                            fontSize="11.5"
                            fontWeight="700"
                            fill={adegan.kedua}
                        >
                            {sksTeks}
                        </text>
                    </motion.g>
                ))}
            </Panel>

            <Panel
                {...KANAN}
                judul="Capaian Pembelajaran"
                warna={adegan.kedua}
                delay={0.12}
                diam={diam}
            >
                {[
                    ['Pengetahuan', 88],
                    ['Keterampilan Khusus', 76],
                    ['Keterampilan Umum', 82],
                    ['Sikap', 94],
                ].map(([nama, nilai], i) => (
                    <g key={nama as string}>
                        <text x="28" y={30 + i * 50} fontSize="12" fill="#a5b4d4">
                            {nama}
                        </text>
                        <text
                            x="436"
                            y={30 + i * 50}
                            textAnchor="end"
                            fontSize="11.5"
                            fontWeight="700"
                            fill={adegan.aksen}
                        >
                            {nilai}
                        </text>
                        <BarProgres
                            x={28}
                            y={38 + i * 50}
                            w={408}
                            persen={nilai as number}
                            warna={i % 2 === 0 ? adegan.aksen : adegan.kedua}
                            delay={0.3 + i * 0.16}
                            diam={diam}
                            tinggi={8}
                        />
                    </g>
                ))}
                <text x="28" y="250" fontSize="12" fill="#a5b4d4">
                    Total SKS diajukan
                </text>
                <text
                    x="436"
                    y="256"
                    textAnchor="end"
                    fontSize="30"
                    fontWeight="800"
                    fill="#fff"
                >
                    {sks}
                </text>
            </Panel>

            {/* mahasiswa mengisi di laptop */}
            <motion.g
                initial={diam ? false : { opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: mudah, delay: diam ? 0 : 0.15 }}
            >
                <rect x="606" y="792" width="220" height="12" rx="6" fill="#3b2a63" />
                <rect x="632" y="804" width="12" height="56" fill="#2a1650" />
                <rect x="790" y="804" width="12" height="56" fill="#2a1650" />
                <g transform="translate(716 792)">
                    <g transform="translate(76 0)">
                        <OrangBerdiri warna={adegan.aksen} aksi="diam" diam={diam} />
                    </g>
                </g>
                <g transform="translate(628 700)">
                    <rect x="-6" y="-6" width="152" height="96" rx="7" fill="#111827" />
                    <rect x="0" y="0" width="140" height="84" rx="4" fill="#0b1024" />
                    <text x="12" y="18" fontSize="8" fill={adegan.aksen} letterSpacing="1.2">
                        ASESMEN MANDIRI
                    </text>
                    {[0, 1, 2].map((i) => (
                        <motion.g
                            key={i}
                            initial={diam ? false : { opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: diam ? 0 : 0.5 + i * 0.35 }}
                        >
                            <rect x="12" y={28 + i * 15} width="88" height="6" rx="3" fill="#334155" />
                            <text x="120" y={35 + i * 15} fontSize="9" fill="#34d399">
                                ✓
                            </text>
                        </motion.g>
                    ))}
                    <path d="M-26 92 h192 l14 10 h-220 z" fill="#1f2937" />
                </g>
            </motion.g>
        </g>
    )
}

/* ------------------------------------------------------------- adegan 4 --- */

function AdeganAsesor({ adegan, diam }: { adegan: Adegan; diam: boolean }) {
    return (
        <g>
            <Panel {...KIRI} judul="Berkas Mahasiswa" warna={adegan.aksen} diam={diam}>
                <Avatar cx={66} cy={62} r={38} warna={adegan.aksen} />
                <text x="122" y="52" fontSize="15" fontWeight="700" fill="#e8eeff">
                    Rizky Ananda Putra
                </text>
                <text x="122" y="74" fontSize="12" fill="#94a3b8">
                    Teknik Informatika — 14 SKS diajukan
                </text>
                {[
                    ['Dokumen lengkap', 'Terverifikasi'],
                    ['Asesmen mandiri', 'Selesai'],
                    ['Menunggu', 'Penunjukan Asesor'],
                ].map(([a, b], i) => (
                    <BarisCentang
                        key={a}
                        y={124 + i * 52}
                        teks={a}
                        kanan={b}
                        warna={i === 2 ? adegan.kedua : '#34d399'}
                        delay={0.3 + i * 0.18}
                        diam={diam}
                    />
                ))}
            </Panel>

            <Panel
                {...KANAN}
                judul="Asesor Ditunjuk"
                warna={adegan.kedua}
                delay={0.12}
                diam={diam}
            >
                {[
                    ['Dr. Ir. Andi Prasetyo', 'Asesor 1 — Informatika'],
                    ['Ir. Sri Wahyuni, M.T.', 'Asesor 2 — Informatika'],
                ].map(([nama, peran], i) => (
                    <motion.g
                        key={nama}
                        initial={diam ? false : { opacity: 0, x: 26 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            duration: 0.45,
                            ease: mudah,
                            delay: diam ? 0 : 0.35 + i * 0.25,
                        }}
                    >
                        <rect
                            x="26"
                            y={20 + i * 96}
                            width="410"
                            height="80"
                            rx="14"
                            fill="#0f1730"
                        />
                        <Avatar
                            cx={72}
                            cy={60 + i * 96}
                            r={28}
                            warna={i === 0 ? adegan.kedua : adegan.aksen}
                            kulit={i === 0 ? '#e8b98a' : '#f0c9a0'}
                        />
                        <text x="118" y={54 + i * 96} fontSize="14" fontWeight="700" fill="#e8eeff">
                            {nama}
                        </text>
                        <text x="118" y={74 + i * 96} fontSize="11.5" fill="#94a3b8">
                            {peran}
                        </text>
                        <motion.circle
                            cx={412}
                            cy={60 + i * 96}
                            r="9"
                            fill="#34d399"
                            initial={diam ? false : { scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                duration: 0.35,
                                ease: mudah,
                                delay: diam ? 0 : 0.9 + i * 0.25,
                            }}
                        />
                    </motion.g>
                ))}
                <text x="28" y="238" fontSize="11.5" fill="#94a3b8">
                    Ditunjuk Kaprodi · disetujui Wakil Rektor
                </text>
                <BarProgres
                    x={28}
                    y={250}
                    w={408}
                    persen={100}
                    warna="#34d399"
                    delay={1.1}
                    diam={diam}
                />
            </Panel>

            {/* garis penghubung mahasiswa → asesor */}
            <motion.path
                d="M560 620 C 680 700, 790 700, 880 620"
                stroke={adegan.kedua}
                strokeWidth="2.5"
                strokeDasharray="10 9"
                fill="none"
                initial={diam ? false : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.9 }}
                transition={{ duration: 1, ease: mudah, delay: diam ? 0 : 0.4 }}
            />

            {/* stempel persetujuan */}
            <motion.g
                initial={
                    diam
                        ? false
                        : { scale: 2.4, opacity: 0, rotate: -24, x: 720, y: 760 }
                }
                animate={{ scale: 1, opacity: 1, rotate: -9, x: 720, y: 760 }}
                transition={{ duration: 0.5, ease: mudah, delay: diam ? 0 : 1.15 }}
            >
                <rect
                    x="-118"
                    y="-38"
                    width="236"
                    height="76"
                    rx="10"
                    fill="none"
                    stroke="#34d399"
                    strokeWidth="4"
                />
                <text
                    textAnchor="middle"
                    y="-4"
                    fontSize="26"
                    fontWeight="800"
                    fill="#34d399"
                    letterSpacing="3"
                >
                    DISETUJUI
                </text>
                <text textAnchor="middle" y="20" fontSize="12" fill="#a7f3d0" letterSpacing="1.5">
                    WAKIL REKTOR
                </text>
            </motion.g>
        </g>
    )
}

/* ------------------------------------------------------------- adegan 5 --- */

const KOMPONEN = [
    ['Portofolio', 88, 0],
    ['Tulis', 76, 1],
    ['Wawancara', 82, 2],
    ['Demo', 91, 3],
] as const

function AdeganNilai({ adegan, diam }: { adegan: Adegan; diam: boolean }) {
    const skor = useHitung(84, diam, 1.7)
    return (
        <g>
            <Panel
                {...KIRI}
                judul="Komponen Penilaian"
                warna={adegan.aksen}
                diam={diam}
            >
                {KOMPONEN.map(([nama, nilai, i]) => (
                    <motion.g
                        key={nama as string}
                        initial={diam ? false : { opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.5,
                            ease: mudah,
                            delay: diam ? 0 : 0.25 + (i as number) * 0.15,
                        }}
                    >
                        <rect
                            x={44 + (i as number) * 100}
                            y={40}
                            width="60"
                            height="180"
                            rx="10"
                            fill="#0f1730"
                        />
                        <motion.rect
                            x={44 + (i as number) * 100}
                            width="60"
                            rx="10"
                            fill={(i as number) % 2 === 0 ? adegan.aksen : adegan.kedua}
                            initial={diam ? false : { height: 0, y: 220 }}
                            animate={{
                                height: ((nilai as number) / 100) * 180,
                                y: 40 + 180 - ((nilai as number) / 100) * 180,
                            }}
                            transition={{
                                duration: 0.9,
                                ease: mudah,
                                delay: diam ? 0 : 0.4 + (i as number) * 0.15,
                            }}
                        />
                        <text
                            x={74 + (i as number) * 100}
                            y={244}
                            textAnchor="middle"
                            fontSize="11"
                            fill="#94a3b8"
                        >
                            {nama}
                        </text>
                        <text
                            x={74 + (i as number) * 100}
                            y={268}
                            textAnchor="middle"
                            fontSize="15"
                            fontWeight="800"
                            fill="#fff"
                        >
                            {nilai}
                        </text>
                    </motion.g>
                ))}
            </Panel>

            <Panel
                {...KANAN}
                judul="Hasil per Mata Kuliah"
                warna={adegan.kedua}
                delay={0.12}
                diam={diam}
            >
                {[
                    ['Algoritma & Pemrograman', 'A'],
                    ['Basis Data', 'A-'],
                    ['Jaringan Komputer', 'B+'],
                    ['Rekayasa Perangkat Lunak', 'A'],
                ].map(([nama, huruf], i) => (
                    <BarisCentang
                        key={nama}
                        y={20 + i * 50}
                        teks={nama}
                        kanan={`${huruf} · Diakui`}
                        warna="#34d399"
                        delay={0.3 + i * 0.18}
                        diam={diam}
                    />
                ))}
                <text x="28" y="252" fontSize="12" fill="#a5b4d4">
                    Skor rata-rata
                </text>
                <text
                    x="436"
                    y="258"
                    textAnchor="end"
                    fontSize="30"
                    fontWeight="800"
                    fill={adegan.aksen}
                >
                    {skor}
                </text>
            </Panel>

            {/* asesor menilai */}
            <motion.g
                initial={diam ? false : { opacity: 0, x: 690, y: 900 }}
                animate={{ opacity: 1, x: 690, y: 862 }}
                transition={{ duration: 0.6, ease: mudah, delay: diam ? 0 : 0.2 }}
            >
                <OrangBerdiri warna={adegan.kedua} kulit="#e8b98a" aksi="tunjuk" diam={diam} />
            </motion.g>
            <motion.g
                initial={
                    diam
                        ? false
                        : { opacity: 0, rotate: -10, scale: 0.8, x: 790, y: 700 }
                }
                animate={{ opacity: 1, rotate: 4, scale: 1, x: 790, y: 700 }}
                transition={{ duration: 0.6, ease: mudah, delay: diam ? 0 : 0.55 }}
            >
                <KartuDokumen l={92} t={116} warna={adegan.aksen} judul="LEMBAR NILAI" />
            </motion.g>
        </g>
    )
}

/* ------------------------------------------------------------- adegan 6 --- */

function AdeganRekap({ adegan, diam }: { adegan: Adegan; diam: boolean }) {
    const sks = useHitung(86, diam, 1.8)
    return (
        <g>
            <Panel
                {...KIRI}
                judul="Rekapitulasi Hasil Asesmen"
                warna={adegan.aksen}
                diam={diam}
            >
                <text x="28" y="24" fontSize="10.5" fill="#7c8db5">
                    MATA KULIAH
                </text>
                <text x="330" y="24" fontSize="10.5" fill="#7c8db5">
                    SKS
                </text>
                <text x="436" y="24" textAnchor="end" fontSize="10.5" fill="#7c8db5">
                    STATUS
                </text>
                {[
                    ['Algoritma & Pemrograman', '3'],
                    ['Basis Data', '3'],
                    ['Jaringan Komputer', '3'],
                    ['Rekayasa Perangkat Lunak', '3'],
                    ['Manajemen Proyek TI', '2'],
                ].map(([nama, s], i) => (
                    <motion.g
                        key={nama}
                        initial={diam ? false : { opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.35,
                            ease: mudah,
                            delay: diam ? 0 : 0.22 + i * 0.14,
                        }}
                    >
                        <rect
                            x="26"
                            y={34 + i * 44}
                            width="410"
                            height="36"
                            rx="8"
                            fill={i % 2 === 0 ? '#0f1730' : '#0c1428'}
                        />
                        <text x="40" y={57 + i * 44} fontSize="12.5" fill="#dbe4ff">
                            {nama}
                        </text>
                        <text x="336" y={57 + i * 44} fontSize="12.5" fill={adegan.kedua}>
                            {s}
                        </text>
                        <text
                            x="424"
                            y={57 + i * 44}
                            textAnchor="end"
                            fontSize="11.5"
                            fontWeight="700"
                            fill="#34d399"
                        >
                            Diakui
                        </text>
                    </motion.g>
                ))}
            </Panel>

            <Panel
                {...KANAN}
                judul="Hasil Final & Sanggahan"
                warna={adegan.kedua}
                delay={0.12}
                diam={diam}
            >
                <text x="28" y="34" fontSize="12" fill="#a5b4d4">
                    Total SKS diakui
                </text>
                <text x="28" y="88" fontSize="52" fontWeight="800" fill="#fff">
                    {sks}
                </text>
                <text x="150" y="88" fontSize="16" fill="#94a3b8">
                    dari 144 SKS
                </text>
                <BarProgres
                    x={28}
                    y={104}
                    w={408}
                    persen={60}
                    warna={adegan.aksen}
                    delay={0.4}
                    diam={diam}
                    tinggi={11}
                />

                <text x="28" y="152" fontSize="11.5" fill="#7c8db5">
                    Mahasiswa menanggapi hasil asesmen
                </text>
                <motion.g
                    initial={diam ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: diam ? 0 : 0.6 }}
                >
                    <motion.rect
                        x="28"
                        y="164"
                        width="196"
                        height="44"
                        rx="10"
                        fill="#16a34a"
                        animate={diam ? undefined : { opacity: [1, 0.72, 1] }}
                        transition={diam ? undefined : { duration: 1.2, repeat: Infinity }}
                    />
                    <text
                        x="126"
                        y="192"
                        textAnchor="middle"
                        fontSize="14"
                        fontWeight="700"
                        fill="#fff"
                    >
                        Terima Hasil
                    </text>
                    <rect x="240" y="164" width="196" height="44" rx="10" fill="#131c33" />
                    <text
                        x="338"
                        y="192"
                        textAnchor="middle"
                        fontSize="14"
                        fill="#64748b"
                    >
                        Ajukan Sanggahan
                    </text>
                </motion.g>

                <motion.g
                    initial={diam ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: diam ? 0 : 1.35 }}
                >
                    <text x="28" y="240" fontSize="13" fontWeight="700" fill="#34d399">
                        ✓ Hasil diterima — tanpa sanggahan
                    </text>
                    <text x="28" y="262" fontSize="11.5" fill="#94a3b8">
                        Berkas diteruskan ke Akademik
                    </text>
                </motion.g>

                {/* kursor menekan tombol */}
                {!diam && (
                    <motion.g
                        initial={{ x: 300, y: 250, opacity: 0 }}
                        animate={{ x: [300, 132, 126], y: [250, 200, 194], opacity: [0, 1, 1] }}
                        transition={{ duration: 1.1, ease: mudah, delay: 0.35 }}
                    >
                        <path
                            d="M0 0 l0 18 l5 -5 l4 9 l4 -2 l-4 -9 l7 0 z"
                            fill="#fff"
                            stroke="#0b1024"
                            strokeWidth="1"
                        />
                    </motion.g>
                )}
            </Panel>

            <motion.g
                initial={diam ? false : { opacity: 0, x: 700, y: 900 }}
                animate={{ opacity: 1, x: 700, y: 860 }}
                transition={{ duration: 0.6, ease: mudah, delay: diam ? 0 : 0.2 }}
            >
                <OrangBerdiri warna={adegan.aksen} aksi="diam" diam={diam} />
            </motion.g>
        </g>
    )
}

/* ------------------------------------------------------------- adegan 7 --- */

const SIMPUL = [
    ['Akademik', 'Inisialisasi'],
    ['Wakil Rektor', 'Persetujuan'],
    ['Rektor', 'Persetujuan'],
    ['Tata Usaha', 'Nomor & TTD'],
] as const

function AdeganSisurat({ adegan, diam }: { adegan: Adegan; diam: boolean }) {
    return (
        <g>
            <Panel
                {...KIRI}
                judul="Inisialisasi Surat ke Sisurat"
                warna={adegan.aksen}
                diam={diam}
            >
                {[
                    ['templateVersionId', 'SK-RPL-v3'],
                    ['perihal', 'SK Perolehan SKS'],
                    ['lampiran', 'hasil-asesmen.pdf'],
                    ['externalReference', 'RPL-2026-0142'],
                ].map(([k, v], i) => (
                    <motion.g
                        key={k}
                        initial={diam ? false : { opacity: 0, x: -18 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            duration: 0.35,
                            ease: mudah,
                            delay: diam ? 0 : 0.24 + i * 0.16,
                        }}
                    >
                        <rect x="26" y={22 + i * 50} width="410" height="38" rx="9" fill="#0f1730" />
                        <text x="40" y={46 + i * 50} fontSize="11.5" fill={adegan.kedua}>
                            {k}
                        </text>
                        <text
                            x="424"
                            y={46 + i * 50}
                            textAnchor="end"
                            fontSize="12"
                            fill="#dbe4ff"
                        >
                            {v}
                        </text>
                    </motion.g>
                ))}
                <Lencana
                    x={26}
                    y={230}
                    teks="POST /surat"
                    warna={adegan.aksen}
                    delay={1}
                    diam={diam}
                    lebar={124}
                />
                <Lencana
                    x={162}
                    y={230}
                    teks="201 Created"
                    warna="#34d399"
                    delay={1.15}
                    diam={diam}
                    lebar={124}
                />
            </Panel>

            <Panel
                {...KANAN}
                judul="Status Surat"
                warna={adegan.kedua}
                delay={0.12}
                diam={diam}
            >
                {[
                    ['SUBMITTED', 'Surat masuk alur'],
                    ['WAREK_APPROVAL', 'Disetujui Wakil Rektor A'],
                    ['RECTOR_APPROVAL', 'Disetujui Rektor'],
                    ['SIGNING', 'Bernomor & ditandatangani'],
                ].map(([st, ket], i) => (
                    <motion.g
                        key={st}
                        initial={diam ? false : { opacity: 0.25 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: diam ? 0 : 0.35 + i * 0.35 }}
                    >
                        <circle cx="44" cy={36 + i * 50} r="9" fill={adegan.aksen} />
                        <path
                            d={`M40 ${36 + i * 50} l3 3.4 l6 -7`}
                            stroke="#231204"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            fill="none"
                        />
                        {i < 3 && (
                            <line
                                x1="44"
                                y1={45 + i * 50}
                                x2="44"
                                y2={77 + i * 50}
                                stroke={adegan.aksen}
                                strokeWidth="2"
                                strokeDasharray="4 4"
                                opacity="0.6"
                            />
                        )}
                        <text x="68" y={34 + i * 50} fontSize="12.5" fontWeight="700" fill="#e8eeff">
                            {st}
                        </text>
                        <text x="68" y={50 + i * 50} fontSize="11" fill="#94a3b8">
                            {ket}
                        </text>
                    </motion.g>
                ))}
                <motion.g
                    initial={diam ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: diam ? 0 : 1.7 }}
                >
                    <rect
                        x="28"
                        y="228"
                        width="408"
                        height="52"
                        rx="12"
                        fill={adegan.aksen}
                        opacity="0.18"
                    />
                    <text x="46" y="250" fontSize="11" fill="#fde68a">
                        NOMOR SURAT TERBIT
                    </text>
                    <text x="46" y="270" fontSize="15" fontWeight="800" fill="#fff">
                        421/SK/REK/ITI/VIII/2026
                    </text>
                </motion.g>
            </Panel>

            {/* alur simpul di bawah — dokumen berjalan di belakang simpul */}
            <g>
                <line
                    x1="470"
                    y1="800"
                    x2="971"
                    y2="800"
                    stroke={adegan.aksen}
                    strokeWidth="2"
                    strokeDasharray="8 8"
                    opacity="0.55"
                />
                <motion.g
                    initial={{ x: 470, y: 800, opacity: 0 }}
                    animate={
                        diam
                            ? { x: 971, y: 800, opacity: 1 }
                            : { x: [470, 971], y: 800, opacity: [0, 1, 1, 0] }
                    }
                    transition={
                        diam
                            ? undefined
                            : {
                                duration: 2.2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                opacity: {
                                    duration: 2.2,
                                    repeat: Infinity,
                                    times: [0, 0.12, 0.85, 1],
                                },
                            }
                    }
                >
                    <KartuDokumen l={54} t={68} warna={adegan.kedua} />
                </motion.g>
                {SIMPUL.map(([nama, ket], i) => (
                    <motion.g
                        key={nama}
                        initial={
                            diam
                                ? false
                                : {
                                    opacity: 0,
                                    scale: 0.6,
                                    x: 470 + i * 167,
                                    y: 800,
                                }
                        }
                        animate={{
                            opacity: 1,
                            scale: 1,
                            x: 470 + i * 167,
                            y: 800,
                        }}
                        transition={{
                            duration: 0.4,
                            ease: mudah,
                            delay: diam ? 0 : 0.3 + i * 0.3,
                        }}
                    >
                        <circle r="26" fill="#0b1024" opacity="0.95" />
                        <motion.circle
                            r="24"
                            fill="#0b1024"
                            stroke={adegan.aksen}
                            strokeWidth="2.5"
                            animate={
                                diam
                                    ? undefined
                                    : { scale: [1, 1.16, 1], strokeOpacity: [0.6, 1, 0.6] }
                            }
                            transition={
                                diam
                                    ? undefined
                                    : { duration: 1.2, repeat: Infinity, delay: i * 0.3 }
                            }
                        />
                        <text
                            textAnchor="middle"
                            y="5"
                            fontSize="13"
                            fontWeight="800"
                            fill={adegan.aksen}
                        >
                            {i + 1}
                        </text>
                        <text textAnchor="middle" y="44" fontSize="12.5" fill="#e8eeff">
                            {nama}
                        </text>
                        <text textAnchor="middle" y="60" fontSize="10.5" fill="#94a3b8">
                            {ket}
                        </text>
                    </motion.g>
                ))}
            </g>
        </g>
    )
}

/* ------------------------------------------------------------- adegan 8 --- */

const KONFETI = [
    [-260, -40, '#f2621f'], [-190, 30, '#fbbf24'], [-120, -70, '#34d399'],
    [-60, 20, '#38bdf8'], [40, -60, '#a78bfa'], [110, 10, '#f472b6'],
    [180, -50, '#fbbf24'], [250, 30, '#34d399'], [-300, 60, '#38bdf8'],
    [300, -20, '#f2621f'], [-40, -110, '#f7a13c'], [80, -120, '#a3e635'],
] as const

function AdeganTerbit({ adegan, diam }: { adegan: Adegan; diam: boolean }) {
    const sks = useHitung(86, diam, 1.4)
    return (
        <g>
            <Panel {...KIRI} judul="SK Hasil Asesmen" warna={adegan.aksen} diam={diam}>
                {[
                    ['SK Perolehan SKS', 'Terbit'],
                    ['SK Transfer SKS', 'Terbit'],
                    ['Nomor Surat', '421/SK/REK/2026'],
                    ['Publikasi', 'Dipublikasikan'],
                ].map(([a, b], i) => (
                    <BarisCentang
                        key={a}
                        y={26 + i * 56}
                        teks={a}
                        kanan={b}
                        warna="#34d399"
                        delay={0.25 + i * 0.18}
                        diam={diam}
                    />
                ))}
                <text x="28" y="266" fontSize="11.5" fill="#94a3b8">
                    Dapat diunduh mahasiswa di menu Sk. Rektor
                </text>
            </Panel>

            <Panel
                {...KANAN}
                judul="Rekognisi Diakui"
                warna={adegan.kedua}
                delay={0.12}
                diam={diam}
            >
                <text x="28" y="40" fontSize="12" fill="#a5b4d4">
                    Total SKS diakui
                </text>
                <text x="28" y="104" fontSize="62" fontWeight="800" fill="#fff">
                    {sks}
                </text>
                <text x="176" y="104" fontSize="18" fill={adegan.kedua}>
                    SKS
                </text>
                <BarProgres
                    x={28}
                    y={124}
                    w={408}
                    persen={60}
                    warna={adegan.aksen}
                    delay={0.4}
                    diam={diam}
                    tinggi={12}
                />
                {[
                    ['Masa studi lebih singkat', '±3 semester'],
                    ['Pengalaman kerja dihargai', '8 tahun'],
                ].map(([a, b], i) => (
                    <BarisCentang
                        key={a}
                        y={158 + i * 52}
                        teks={a}
                        kanan={b}
                        warna={adegan.kedua}
                        delay={0.8 + i * 0.2}
                        diam={diam}
                    />
                ))}
                <Lencana
                    x={28}
                    y={266}
                    teks="Institut Teknologi Indonesia"
                    warna={adegan.aksen}
                    delay={1.3}
                    diam={diam}
                    lebar={228}
                />
            </Panel>

            {/* SK besar naik */}
            <motion.g
                initial={
                    diam ? false : { opacity: 0, y: 850, scale: 0.8, x: 720 }
                }
                animate={{ opacity: 1, y: 760, scale: 1, x: 720 }}
                transition={{ duration: 0.8, ease: mudah, delay: diam ? 0 : 0.2 }}
            >
                <motion.g
                    animate={diam ? undefined : { y: [0, -10, 0] }}
                    transition={
                        diam
                            ? undefined
                            : { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }
                    }
                >
                    <ellipse cx="0" cy="112" rx="96" ry="14" fill="#000" opacity="0.35" />
                    <KartuDokumen
                        l={166}
                        t={210}
                        warna={adegan.aksen}
                        judul="SURAT KEPUTUSAN REKTOR"
                        qr
                        segel
                    />
                </motion.g>
                {KONFETI.map(([x, y, warna], i) => (
                    <motion.rect
                        key={i}
                        x={x as number}
                        y={0}
                        width="9"
                        height="14"
                        rx="2"
                        fill={warna as string}
                        initial={diam ? false : { opacity: 0, y: 60, rotate: 0 }}
                        animate={
                            diam
                                ? { opacity: 0.9 }
                                : {
                                    opacity: [0, 1, 1, 0],
                                    y: [(y as number) + 60, y as number, (y as number) - 90],
                                    rotate: [0, 180, 360],
                                }
                        }
                        transition={{
                            duration: 2.2,
                            ease: 'easeOut',
                            delay: diam ? 0 : 0.4 + (i % 6) * 0.12,
                            repeat: diam ? 0 : Infinity,
                        }}
                    />
                ))}
            </motion.g>

            <motion.g
                initial={diam ? false : { opacity: 0, x: 500, y: 900 }}
                animate={{ opacity: 1, x: 500, y: 862 }}
                transition={{ duration: 0.6, ease: mudah, delay: diam ? 0 : 0.35 }}
            >
                <OrangBerdiri warna={adegan.aksen} aksi="sorak" diam={diam} />
            </motion.g>
            <motion.g
                initial={diam ? false : { opacity: 0, x: 950, y: 900 }}
                animate={{ opacity: 1, x: 950, y: 862 }}
                transition={{ duration: 0.6, ease: mudah, delay: diam ? 0 : 0.5 }}
            >
                <OrangBerdiri
                    warna={adegan.kedua}
                    kulit="#e8b98a"
                    aksi="sorak"
                    diam={diam}
                />
            </motion.g>
        </g>
    )
}

/* ------------------------------------------------------------- komponen --- */

function IsiAdegan({ adegan, diam }: { adegan: Adegan; diam: boolean }) {
    switch (adegan.id) {
        case 'daftar':
            return <AdeganDaftar adegan={adegan} diam={diam} />
        case 'unggah':
            return <AdeganUnggah adegan={adegan} diam={diam} />
        case 'mandiri':
            return <AdeganMandiri adegan={adegan} diam={diam} />
        case 'asesor':
            return <AdeganAsesor adegan={adegan} diam={diam} />
        case 'nilai':
            return <AdeganNilai adegan={adegan} diam={diam} />
        case 'rekap':
            return <AdeganRekap adegan={adegan} diam={diam} />
        case 'sisurat':
            return <AdeganSisurat adegan={adegan} diam={diam} />
        case 'terbit':
            return <AdeganTerbit adegan={adegan} diam={diam} />
        default:
            return null
    }
}

export default function HeroAnimatedBackground() {
    const kurangiGerak = useReducedMotion()
    const diam = !!kurangiGerak
    const [tick, setTick] = React.useState(0)

    React.useEffect(() => {
        if (diam) return
        const t = setInterval(() => setTick((n) => n + 1), DETIK_ADEGAN * 1000)
        return () => clearInterval(t)
    }, [diam])

    const indeks = tick % ADEGAN.length
    const siklus = Math.floor(tick / ADEGAN.length)
    const kini = ADEGAN[indeks]

    return (
        <div className="absolute inset-0 overflow-hidden" aria-hidden>
            <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 1440 900"
                preserveAspectRatio="xMidYMid slice"
            >
                <defs>
                    {ADEGAN.map((a) => (
                        <linearGradient
                            key={a.id}
                            id={`langit-${a.id}`}
                            x1="0"
                            y1="0"
                            x2="0.28"
                            y2="1"
                        >
                            <stop offset="0%" stopColor={a.langit[0]} />
                            <stop offset="44%" stopColor={a.langit[1]} />
                            <stop offset="76%" stopColor={a.langit[2]} />
                            <stop offset="100%" stopColor={a.langit[3]} />
                        </linearGradient>
                    ))}
                    <linearGradient id="sapuan" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                        <stop offset="50%" stopColor="#ffffff" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* langit berganti tiap adegan */}
                <rect width="1440" height="900" fill={`url(#langit-${ADEGAN[0].id})`} />
                <AnimatePresence>
                    <motion.rect
                        key={kini.id}
                        width="1440"
                        height="900"
                        fill={`url(#langit-${kini.id})`}
                        initial={diam ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={diam ? undefined : { opacity: 0 }}
                        transition={{ duration: 0.9, ease: 'easeInOut' }}
                    />
                </AnimatePresence>

                <Aurora key={`aurora-${kini.id}`} adegan={kini} diam={diam} />

                <Bintang diam={diam} />
                <Siluet adegan={kini} diam={diam} />
                <Lantai adegan={kini} diam={diam} />
                <Partikel adegan={kini} diam={diam} />

                {/* Komposisi adegan sengaja diturunkan dan diperkecil supaya
                    judul hero di tengah layar tetap terbaca. */}
                <g transform="translate(187 226) scale(0.74)">
                    <AnimatePresence>
                        <motion.g
                            key={kini.id}
                            initial={diam ? false : { opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={diam ? undefined : { opacity: 0 }}
                            transition={{
                                duration: 0.5,
                                ease: 'easeInOut',
                                opacity: { duration: 0.35 },
                            }}
                        >
                            <IsiAdegan adegan={kini} diam={diam} />
                        </motion.g>
                    </AnimatePresence>
                </g>

                <Sapuan adegan={kini} diam={diam} />
            </svg>

            {/* keterangan tahap + penanda siklus 20 detik */}
            <div className="absolute inset-x-0 top-20 flex flex-col items-center gap-2 px-4 sm:top-24">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={kini.id}
                        initial={diam ? false : { opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={diam ? undefined : { opacity: 0, y: -10 }}
                        transition={{ duration: 0.45, ease: 'easeOut' }}
                        className="flex flex-col items-center gap-1"
                    >
                        <span
                            className="text-[11px] font-semibold uppercase tracking-[0.28em]"
                            style={{ color: kini.aksen }}
                        >
                            {`Tahap ${indeks + 1}/${ADEGAN.length} — ${kini.tahap}`}
                        </span>
                        <span className="rounded-full border border-white/15 bg-slate-950/60 px-5 py-2 text-center text-xs text-white/90 backdrop-blur-sm sm:text-sm">
                            {kini.judul}
                        </span>
                    </motion.div>
                </AnimatePresence>

                <div className="flex items-center gap-1.5">
                    {ADEGAN.map((a, idx) => (
                        <span
                            key={a.id}
                            className="h-1.5 rounded-full transition-all duration-500"
                            style={{
                                width: idx === indeks ? 28 : 10,
                                backgroundColor:
                                    idx === indeks
                                        ? kini.aksen
                                        : 'rgba(255,255,255,0.28)',
                            }}
                        />
                    ))}
                </div>

                <div className="h-[3px] w-56 overflow-hidden rounded-full bg-white/15 sm:w-72">
                    <motion.div
                        key={siklus}
                        className="h-full rounded-full"
                        style={{ backgroundColor: kini.aksen }}
                        initial={diam ? false : { width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{
                            duration: diam ? 0 : DETIK_ADEGAN * ADEGAN.length,
                            ease: 'linear',
                        }}
                    />
                </div>
            </div>

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_46%,rgba(6,4,18,0.62))]" />
        </div>
    )
}

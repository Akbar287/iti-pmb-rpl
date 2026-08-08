'use client'

import React from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import LogoIti from '@/assets/images/Logo-ITI-oke-1.png'

/**
 * Latar animasi halaman utama: sebuah "kota kampus" yang hidup — gedung, jalan,
 * kendaraan, orang berjalan, dan dokumen beterbangan — dengan panel adegan yang
 * menceritakan perjalanan calon mahasiswa pada asesmen RPL ITI (8 adegan).
 *
 * Durasi tiap adegan mengikuti naskah aslinya (total 3 menit) lalu dimampatkan
 * SKALA_WAKTU supaya satu putaran ±60 detik. Setel ke 1 untuk persis 3 menit.
 */
const SKALA_WAKTU = 1 / 3

/** Alur ringkas pada strip bawah (Scene 8 naskah). */
const ALUR = [
    'Dokumen Awal',
    'Asesmen Mandiri',
    'Asesmen Asesor',
    'Sanggah',
    'Finalisasi',
    'SK RPL',
]

const mudah = [0.22, 1, 0.36, 1] as const

// Semua nilai acak sengaja ditulis tetap (bukan Math.random) supaya hasil render
// di server dan di browser identik — mencegah hydration mismatch.

/** Gedung latar jauh: x, lebar, tinggi, warna. */
const GEDUNG_JAUH = [
    [40, 90, 190, '#2b1b52'],
    [150, 70, 260, '#33205e'],
    [235, 110, 150, '#2b1b52'],
    [360, 80, 300, '#3a2569'],
    [455, 95, 210, '#2b1b52'],
    [565, 120, 265, '#33205e'],
    [700, 85, 175, '#2b1b52'],
    [800, 100, 320, '#3a2569'],
    [915, 75, 205, '#2b1b52'],
    [1005, 130, 250, '#33205e'],
    [1150, 90, 300, '#2b1b52'],
    [1255, 105, 195, '#3a2569'],
    [1370, 90, 265, '#33205e'],
] as const

/** Gedung tengah berwarna dengan jendela menyala. */
const GEDUNG_TENGAH = [
    [90, 130, 210, '#4c1d95', '#fbbf24'],
    [250, 110, 165, '#9d174d', '#fde68a'],
    [520, 120, 195, '#155e75', '#67e8f9'],
    [980, 115, 180, '#7c2d12', '#fdba74'],
    [1210, 135, 225, '#3730a3', '#a5b4fc'],
] as const

/** Awan: x awal, y, skala, durasi lintasan. */
const AWAN = [
    [-200, 120, 1, 90],
    [200, 220, 0.7, 120],
    [700, 90, 1.3, 70],
    [1100, 190, 0.85, 105],
] as const

/** Orang berjalan: warna baju, y, skala, durasi, jeda, arah. */
const ORANG = [
    ['#f97316', 742, 1, 26, 0, 1],
    ['#22d3ee', 752, 1.15, 32, 4, 1],
    ['#f472b6', 736, 0.85, 22, 9, 1],
    ['#a3e635', 758, 1.25, 36, 2, -1],
    ['#fbbf24', 746, 0.95, 29, 13, -1],
    ['#818cf8', 764, 1.1, 24, 7, 1],
] as const

/** Kendaraan: warna, y, durasi, jeda, arah, panjang. */
const KENDARAAN = [
    ['#ef4444', 824, 14, 0, 1, 96],
    ['#38bdf8', 862, 18, 5, -1, 110],
    ['#facc15', 826, 11, 8, 1, 84],
    ['#34d399', 860, 21, 2, -1, 120],
] as const

/** Dokumen melayang: x, durasi, jeda, putaran, warna aksen. */
const DOKUMEN = [
    [180, 17, 0, -12, '#fbbf24'],
    [420, 21, 4, 9, '#22d3ee'],
    [660, 15, 8, -7, '#f472b6'],
    [920, 24, 2, 14, '#a3e635'],
    [1180, 19, 6, -10, '#fdba74'],
    [1330, 23, 11, 8, '#818cf8'],
] as const

type Adegan = {
    no: number
    durasi: number
    /** Tahap alur yang disorot pada strip bawah (-1 = tidak ada). */
    tahap: number
    judul: string
    render: () => React.ReactNode
}

/* ---------------------------------------------------------------- dunia --- */

function Orang({
    warna,
    y,
    skala,
    durasi,
    jeda,
    arah,
    diam,
}: {
    warna: string
    y: number
    skala: number
    durasi: number
    jeda: number
    arah: number
    diam: boolean
}) {
    const dari = arah > 0 ? -80 : 1520
    const ke = arah > 0 ? 1520 : -80

    return (
        <motion.g
            initial={{ x: diam ? 400 : dari }}
            animate={diam ? { x: 400 } : { x: [dari, ke] }}
            transition={
                diam
                    ? undefined
                    : {
                        duration: durasi,
                        repeat: Infinity,
                        ease: 'linear',
                        delay: jeda,
                    }
            }
        >
            <motion.g
                transform={`translate(0 ${y}) scale(${skala * arah} ${skala})`}
                animate={diam ? undefined : { y: [0, -3, 0] }}
                transition={
                    diam
                        ? undefined
                        : { duration: 0.6, repeat: Infinity, ease: 'easeInOut' }
                }
            >
                {/* kepala */}
                <circle cx="0" cy="-30" r="6" fill="#fcd9b6" />
                {/* badan */}
                <path
                    d="M-6 -24 h12 l2 16 h-16 z"
                    fill={warna}
                    opacity="0.95"
                />
                {/* kaki */}
                <motion.path
                    d="M-4 -8 l-3 10"
                    stroke="#1f1147"
                    strokeWidth="3"
                    strokeLinecap="round"
                    animate={diam ? undefined : { rotate: [14, -14, 14] }}
                    transition={
                        diam
                            ? undefined
                            : {
                                duration: 0.6,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }
                    }
                    style={{ originX: '0px', originY: '-8px' }}
                />
                <motion.path
                    d="M4 -8 l3 10"
                    stroke="#1f1147"
                    strokeWidth="3"
                    strokeLinecap="round"
                    animate={diam ? undefined : { rotate: [-14, 14, -14] }}
                    transition={
                        diam
                            ? undefined
                            : {
                                duration: 0.6,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }
                    }
                    style={{ originX: '0px', originY: '-8px' }}
                />
                {/* tas / map dokumen yang dibawa */}
                <rect
                    x="6"
                    y="-20"
                    width="9"
                    height="12"
                    rx="1.5"
                    fill="#fff"
                    opacity="0.9"
                />
            </motion.g>
        </motion.g>
    )
}

function Kendaraan({
    warna,
    y,
    durasi,
    jeda,
    arah,
    panjang,
    diam,
}: {
    warna: string
    y: number
    durasi: number
    jeda: number
    arah: number
    panjang: number
    diam: boolean
}) {
    const dari = arah > 0 ? -180 : 1620
    const ke = arah > 0 ? 1620 : -180

    return (
        <motion.g
            initial={{ x: diam ? 600 : dari }}
            animate={diam ? { x: 600 } : { x: [dari, ke] }}
            transition={
                diam
                    ? undefined
                    : {
                        duration: durasi,
                        repeat: Infinity,
                        ease: 'linear',
                        delay: jeda,
                    }
            }
        >
            <g transform={`translate(0 ${y}) scale(${arah} 1)`}>
                <rect
                    x="0"
                    y="-22"
                    width={panjang}
                    height="22"
                    rx="7"
                    fill={warna}
                />
                <rect
                    x={panjang * 0.18}
                    y="-34"
                    width={panjang * 0.5}
                    height="14"
                    rx="5"
                    fill={warna}
                    opacity="0.75"
                />
                <rect
                    x={panjang * 0.22}
                    y="-32"
                    width={panjang * 0.42}
                    height="10"
                    rx="3"
                    fill="#bae6fd"
                    opacity="0.85"
                />
                <circle cx={panjang * 0.22} cy="2" r="7" fill="#0f172a" />
                <circle cx={panjang * 0.78} cy="2" r="7" fill="#0f172a" />
                {/* lampu depan */}
                <ellipse
                    cx={panjang + 14}
                    cy="-12"
                    rx="16"
                    ry="6"
                    fill="#fde68a"
                    opacity="0.35"
                />
            </g>
        </motion.g>
    )
}

function DokumenTerbang({
    x,
    durasi,
    jeda,
    putar,
    aksen,
    diam,
}: {
    x: number
    durasi: number
    jeda: number
    putar: number
    aksen: string
    diam: boolean
}) {
    return (
        <motion.g
            initial={{ y: diam ? 300 : 780, opacity: diam ? 0.9 : 0 }}
            animate={
                diam
                    ? { y: 300, opacity: 0.9 }
                    : { y: [780, 120], opacity: [0, 0.95, 0.95, 0] }
            }
            transition={
                diam
                    ? undefined
                    : {
                        duration: durasi,
                        repeat: Infinity,
                        ease: 'linear',
                        delay: jeda,
                        opacity: {
                            duration: durasi,
                            repeat: Infinity,
                            times: [0, 0.15, 0.8, 1],
                            delay: jeda,
                        },
                    }
            }
        >
            <motion.g
                transform={`translate(${x} 0)`}
                animate={diam ? undefined : { rotate: [0, putar, 0] }}
                transition={
                    diam
                        ? undefined
                        : { duration: 5, repeat: Infinity, ease: 'easeInOut' }
                }
            >
                <rect
                    x="-16"
                    y="-22"
                    width="32"
                    height="42"
                    rx="3"
                    fill="#ffffff"
                    opacity="0.92"
                />
                <rect
                    x="-16"
                    y="-22"
                    width="32"
                    height="8"
                    rx="3"
                    fill={aksen}
                />
                <rect x="-11" y="-8" width="22" height="3" rx="1.5" fill="#cbd5e1" />
                <rect x="-11" y="0" width="22" height="3" rx="1.5" fill="#cbd5e1" />
                <rect x="-11" y="8" width="14" height="3" rx="1.5" fill="#cbd5e1" />
            </motion.g>
        </motion.g>
    )
}

/** Deretan jendela menyala pada gedung berwarna. */
function Jendela({
    x,
    y,
    lebar,
    tinggi,
    warna,
    diam,
}: {
    x: number
    y: number
    lebar: number
    tinggi: number
    warna: string
    diam: boolean
}) {
    const kolom = Math.max(2, Math.floor(lebar / 26))
    const baris = Math.max(3, Math.floor(tinggi / 34))
    const kotak: React.ReactNode[] = []

    for (let b = 0; b < baris; b++) {
        for (let k = 0; k < kolom; k++) {
            // Pola menyala/padam tetap, bukan acak.
            const nyala = (b * 7 + k * 3) % 4 !== 0
            const denyut = (b + k) % 5 === 0
            kotak.push(
                <motion.rect
                    key={`${b}-${k}`}
                    x={x + 10 + k * (lebar / kolom)}
                    y={y + 14 + b * (tinggi / baris)}
                    width={Math.max(6, lebar / kolom - 12)}
                    height={Math.max(8, tinggi / baris - 16)}
                    rx="1.5"
                    fill={warna}
                    opacity={nyala ? 0.85 : 0.18}
                    animate={
                        diam || !denyut ? undefined : { opacity: [0.85, 0.2, 0.85] }
                    }
                    transition={
                        diam || !denyut
                            ? undefined
                            : {
                                duration: 3 + ((b + k) % 4),
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }
                    }
                />
            )
        }
    }
    return <React.Fragment>{kotak}</React.Fragment>
}

function LapisanDunia({ diam }: { diam: boolean }) {
    return (
        <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
        >
            <defs>
                <linearGradient id="langit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1b0b3a" />
                    <stop offset="45%" stopColor="#4c1d95" />
                    <stop offset="72%" stopColor="#b4327a" />
                    <stop offset="88%" stopColor="#f2621f" />
                    <stop offset="100%" stopColor="#f7a13c" />
                </linearGradient>
                <radialGradient id="matahari" cx="50%" cy="50%">
                    <stop offset="0%" stopColor="#fff3c4" stopOpacity="0.95" />
                    <stop offset="60%" stopColor="#fbbf24" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="tanah" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#241147" />
                    <stop offset="100%" stopColor="#150a2b" />
                </linearGradient>
            </defs>

            {/* langit */}
            <rect width="1440" height="900" fill="url(#langit)" />

            {/* matahari terbenam */}
            <motion.circle
                cx="1080"
                cy="560"
                r="260"
                fill="url(#matahari)"
                animate={diam ? undefined : { opacity: [0.75, 1, 0.75] }}
                transition={
                    diam
                        ? undefined
                        : { duration: 9, repeat: Infinity, ease: 'easeInOut' }
                }
            />
            <circle cx="1080" cy="560" r="66" fill="#ffd166" opacity="0.9" />

            {/* awan */}
            {AWAN.map(([x, y, skala, durasi], i) => (
                <motion.g
                    key={i}
                    initial={{ x: diam ? x : x }}
                    animate={diam ? undefined : { x: [x, x + 1700] }}
                    transition={
                        diam
                            ? undefined
                            : {
                                duration: durasi,
                                repeat: Infinity,
                                ease: 'linear',
                            }
                    }
                    opacity="0.18"
                >
                    <g transform={`translate(0 ${y}) scale(${skala})`}>
                        <ellipse cx="0" cy="0" rx="60" ry="20" fill="#fff" />
                        <ellipse cx="44" cy="-10" rx="46" ry="24" fill="#fff" />
                        <ellipse cx="-40" cy="-6" rx="38" ry="18" fill="#fff" />
                    </g>
                </motion.g>
            ))}

            {/* siluet gedung jauh */}
            {GEDUNG_JAUH.map(([x, l, t, warna], i) => (
                <rect
                    key={i}
                    x={x}
                    y={700 - t}
                    width={l}
                    height={t}
                    fill={warna}
                    opacity="0.85"
                />
            ))}

            {/* gedung berwarna dengan jendela menyala */}
            {GEDUNG_TENGAH.map(([x, l, t, warna, kaca], i) => (
                <React.Fragment key={i}>
                    <rect
                        x={x}
                        y={700 - t}
                        width={l}
                        height={t}
                        rx="4"
                        fill={warna}
                    />
                    <Jendela
                        x={x}
                        y={700 - t}
                        lebar={l}
                        tinggi={t}
                        warna={kaca}
                        diam={diam}
                    />
                </React.Fragment>
            ))}

            {/* gedung utama ITI */}
            <g>
                <rect x="640" y="400" width="240" height="300" rx="6" fill="#0f766e" />
                <rect x="640" y="400" width="240" height="34" fill="#0d9488" />
                <Jendela
                    x={640}
                    y={434}
                    lebar={240}
                    tinggi={266}
                    warna="#5eead4"
                    diam={diam}
                />
                <rect x="726" y="640" width="68" height="60" rx="4" fill="#134e4a" />
                <motion.rect
                    x="666"
                    y="408"
                    width="188"
                    height="20"
                    rx="4"
                    fill="#f2621f"
                    animate={diam ? undefined : { opacity: [0.75, 1, 0.75] }}
                    transition={
                        diam
                            ? undefined
                            : { duration: 4, repeat: Infinity, ease: 'easeInOut' }
                    }
                />
                <text
                    x="760"
                    y="423"
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="700"
                    fill="#fff"
                    letterSpacing="3"
                >
                    ITI
                </text>
            </g>

            {/* tanah */}
            <rect x="0" y="700" width="1440" height="200" fill="url(#tanah)" />

            {/* trotoar + tiang lampu */}
            <rect x="0" y="700" width="1440" height="78" fill="#2a1650" />
            {[80, 340, 600, 860, 1120, 1380].map((x) => (
                <g key={x}>
                    <rect x={x} y="640" width="5" height="120" fill="#1f1147" />
                    <motion.circle
                        cx={x + 2}
                        cy="636"
                        r="9"
                        fill="#fde68a"
                        animate={diam ? undefined : { opacity: [0.65, 1, 0.65] }}
                        transition={
                            diam
                                ? undefined
                                : {
                                    duration: 3.5,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }
                        }
                    />
                    <ellipse
                        cx={x + 2}
                        cy="700"
                        rx="42"
                        ry="16"
                        fill="#fde68a"
                        opacity="0.08"
                    />
                </g>
            ))}

            {/* orang berjalan di trotoar */}
            {ORANG.map(([warna, y, skala, durasi, jeda, arah], i) => (
                <Orang
                    key={i}
                    warna={warna}
                    y={y}
                    skala={skala}
                    durasi={durasi}
                    jeda={jeda}
                    arah={arah}
                    diam={diam}
                />
            ))}

            {/* jalan raya */}
            <rect x="0" y="778" width="1440" height="122" fill="#160c2e" />
            <rect x="0" y="778" width="1440" height="4" fill="#3b2a63" />
            <motion.g
                animate={diam ? undefined : { x: [0, -120] }}
                transition={
                    diam
                        ? undefined
                        : { duration: 1.6, repeat: Infinity, ease: 'linear' }
                }
            >
                {Array.from({ length: 14 }).map((_, i) => (
                    <rect
                        key={i}
                        x={i * 120}
                        y="836"
                        width="64"
                        height="5"
                        rx="2.5"
                        fill="#fbbf24"
                        opacity="0.5"
                    />
                ))}
            </motion.g>

            {/* kendaraan */}
            {KENDARAAN.map(([warna, y, durasi, jeda, arah, panjang], i) => (
                <Kendaraan
                    key={i}
                    warna={warna}
                    y={y}
                    durasi={durasi}
                    jeda={jeda}
                    arah={arah}
                    panjang={panjang}
                    diam={diam}
                />
            ))}

            {/* dokumen beterbangan */}
            {DOKUMEN.map(([x, durasi, jeda, putar, aksen], i) => (
                <DokumenTerbang
                    key={i}
                    x={x}
                    durasi={durasi}
                    jeda={jeda}
                    putar={putar}
                    aksen={aksen}
                    diam={diam}
                />
            ))}
        </svg>
    )
}

/* -------------------------------------------------------------- adegan --- */

function KartuAdegan({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-[320px] rounded-2xl border border-white/20 bg-slate-950/55 p-4 shadow-2xl shadow-black/50 backdrop-blur-md">
            {children}
        </div>
    )
}

function Baris({
    label,
    tunda,
    diam,
    warna = 'bg-emerald-300',
}: {
    label: string
    tunda: number
    diam: boolean
    warna?: string
}) {
    return (
        <motion.div
            className="flex items-center gap-2"
            initial={diam ? false : { opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: diam ? 0 : tunda, duration: 0.45 }}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${warna}`} />
            <span className="flex-1 text-[11px] text-white/70">{label}</span>
            <motion.span
                className="text-[11px] text-emerald-300"
                initial={diam ? false : { opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: diam ? 0 : tunda + 0.4, duration: 0.3 }}
            >
                ✓
            </motion.span>
        </motion.div>
    )
}

export default function HeroAnimatedBackground() {
    const kurangiGerak = useReducedMotion()
    const diam = !!kurangiGerak
    const [indeks, setIndeks] = React.useState(0)

    const adegan: Adegan[] = React.useMemo(
        () => [
            {
                no: 1,
                durasi: 15,
                tahap: -1,
                judul: 'RPL ITI',
                render: () => (
                    <KartuAdegan>
                        <div className="flex items-center gap-3">
                            <span className="rounded-xl bg-white/90 p-2">
                                <Image
                                    src={LogoIti}
                                    alt=""
                                    aria-hidden
                                    width={64}
                                    height={64}
                                    className="h-8 w-auto object-contain"
                                />
                            </span>
                            <span>
                                <span className="block text-sm font-semibold tracking-[0.3em] text-white">
                                    RPL ITI
                                </span>
                                <span className="block text-[10px] text-white/60">
                                    Rekognisi Pembelajaran Lampau
                                </span>
                            </span>
                        </div>
                    </KartuAdegan>
                ),
            },
            {
                no: 2,
                durasi: 30,
                tahap: 0,
                judul: 'Dokumen Awal',
                render: () => (
                    <KartuAdegan>
                        <p className="mb-3 text-[10px] uppercase tracking-widest text-amber-300">
                            Dokumen Awal
                        </p>
                        <div className="space-y-2">
                            {[
                                'Data diri',
                                'Riwayat pendidikan',
                                'Pengalaman kerja',
                                'Portofolio',
                            ].map((l, i) => (
                                <Baris
                                    key={l}
                                    label={l}
                                    tunda={0.3 + i * 0.5}
                                    diam={diam}
                                />
                            ))}
                        </div>
                        <p className="mt-3 text-[11px] font-medium text-emerald-300">
                            Dokumen Awal Lengkap ✓
                        </p>
                    </KartuAdegan>
                ),
            },
            {
                no: 3,
                durasi: 30,
                tahap: 1,
                judul: 'Asesmen Mandiri',
                render: () => (
                    <KartuAdegan>
                        <p className="mb-3 text-[10px] uppercase tracking-widest text-cyan-300">
                            Asesmen Mandiri
                        </p>
                        <div className="space-y-2">
                            {['Capaian Pembelajaran 1', 'Capaian Pembelajaran 2'].map(
                                (l, i) => (
                                    <Baris
                                        key={l}
                                        label={l}
                                        tunda={0.3 + i * 0.5}
                                        diam={diam}
                                        warna="bg-cyan-300"
                                    />
                                )
                            )}
                        </div>
                        <div className="mt-3 h-1.5 w-full rounded-full bg-white/15">
                            <motion.div
                                className="h-1.5 rounded-full bg-linear-to-r from-cyan-400 to-primary"
                                initial={diam ? false : { width: '0%' }}
                                animate={{ width: '100%' }}
                                transition={{
                                    delay: diam ? 0 : 0.5,
                                    duration: diam ? 0 : 3,
                                    ease: 'linear',
                                }}
                            />
                        </div>
                        <p className="mt-2 text-[11px] text-white/70">
                            100% — Kirim Asesmen
                        </p>
                    </KartuAdegan>
                ),
            },
            {
                no: 4,
                durasi: 35,
                tahap: 2,
                judul: 'Asesmen Asesor',
                render: () => (
                    <KartuAdegan>
                        <p className="mb-3 text-[10px] uppercase tracking-widest text-fuchsia-300">
                            Dashboard Asesor
                        </p>
                        <div className="space-y-2">
                            {[
                                ['Capaian 1', 'Diakui ✓', 'text-emerald-300'],
                                ['Capaian 2', 'Perlu Verifikasi', 'text-amber-300'],
                                ['Capaian 3', 'Diakui ✓', 'text-emerald-300'],
                            ].map(([kiri, kanan, warna], i) => (
                                <motion.div
                                    key={i}
                                    className="flex items-center justify-between rounded-lg border border-white/10 bg-white/6 px-2 py-1.5"
                                    initial={diam ? false : { opacity: 0, x: 12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        delay: diam ? 0 : 0.3 + i * 0.6,
                                        duration: 0.45,
                                    }}
                                >
                                    <span className="text-[10px] text-white/60">
                                        {kiri}
                                    </span>
                                    <span
                                        className={`text-[10px] font-medium ${warna}`}
                                    >
                                        {kanan}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </KartuAdegan>
                ),
            },
            {
                no: 5,
                durasi: 25,
                tahap: 3,
                judul: 'Hasil & Sanggah',
                render: () => (
                    <KartuAdegan>
                        <motion.p
                            className="mb-3 rounded-lg border border-primary/50 bg-primary/20 px-2 py-1.5 text-[11px] text-white"
                            initial={diam ? false : { opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            Hasil Asesmen Tersedia
                        </motion.p>
                        <div className="grid grid-cols-2 gap-2">
                            {['Terima Hasil', 'Ajukan Sanggah'].map((l, i) => (
                                <motion.span
                                    key={l}
                                    className={`rounded-lg border px-2 py-2 text-center text-[10px] ${i === 1
                                        ? 'border-primary bg-primary/25 text-white'
                                        : 'border-white/20 bg-white/6 text-white/60'
                                        }`}
                                    animate={
                                        diam || i !== 1
                                            ? undefined
                                            : { scale: [1, 1.06, 1] }
                                    }
                                    transition={
                                        diam || i !== 1
                                            ? undefined
                                            : {
                                                duration: 1.4,
                                                repeat: Infinity,
                                                ease: 'easeInOut',
                                            }
                                    }
                                >
                                    {l}
                                </motion.span>
                            ))}
                        </div>
                    </KartuAdegan>
                ),
            },
            {
                no: 6,
                durasi: 20,
                tahap: 4,
                judul: 'Finalisasi',
                render: () => (
                    <KartuAdegan>
                        <p className="mb-3 text-[10px] uppercase tracking-widest text-lime-300">
                            Finalisasi
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5">
                            {['Hasil', 'Verifikasi', 'Finalisasi', 'Keputusan'].map(
                                (l, i) => (
                                    <React.Fragment key={l}>
                                        {i > 0 && (
                                            <span className="text-[10px] text-white/25">
                                                →
                                            </span>
                                        )}
                                        <motion.span
                                            className="rounded-full border border-white/20 bg-white/8 px-2 py-1 text-[10px] text-white/75"
                                            initial={
                                                diam
                                                    ? false
                                                    : { opacity: 0, scale: 0.85 }
                                            }
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{
                                                delay: diam ? 0 : 0.25 + i * 0.45,
                                                duration: 0.4,
                                            }}
                                        >
                                            {l}
                                        </motion.span>
                                    </React.Fragment>
                                )
                            )}
                        </div>
                        <p className="mt-3 text-[11px] font-medium text-emerald-300">
                            Asesmen Final ✓
                        </p>
                    </KartuAdegan>
                ),
            },
            {
                no: 7,
                durasi: 15,
                tahap: 5,
                judul: 'SK Terbit',
                render: () => (
                    <KartuAdegan>
                        <motion.div
                            className="rounded-lg bg-white/95 p-3"
                            initial={diam ? false : { opacity: 0, y: 16, rotate: -2 }}
                            animate={{ opacity: 1, y: 0, rotate: 0 }}
                            transition={{ duration: 0.7, ease: mudah }}
                        >
                            <p className="text-center text-[9px] font-bold tracking-widest text-slate-700">
                                SURAT KEPUTUSAN
                            </p>
                            <p className="text-center text-[8px] text-slate-500">
                                Hasil Rekognisi Pembelajaran Lampau
                            </p>
                            <div className="mx-auto mt-2 grid h-8 w-8 grid-cols-3 gap-0.5">
                                {Array.from({ length: 9 }).map((_, i) => (
                                    <span
                                        key={i}
                                        className={`rounded-[1px] ${i % 3 === 1
                                            ? 'bg-slate-300'
                                            : 'bg-slate-800'
                                            }`}
                                    />
                                ))}
                            </div>
                        </motion.div>
                        <p className="mt-3 text-[11px] font-medium text-emerald-300">
                            SK Hasil Keputusan RPL Terbit ✓
                        </p>
                    </KartuAdegan>
                ),
            },
            {
                no: 8,
                durasi: 10,
                tahap: -1,
                judul: 'Penutup',
                render: () => (
                    <KartuAdegan>
                        <div className="flex items-center gap-3">
                            <span className="rounded-xl bg-white/90 p-2">
                                <Image
                                    src={LogoIti}
                                    alt=""
                                    aria-hidden
                                    width={64}
                                    height={64}
                                    className="h-8 w-auto object-contain"
                                />
                            </span>
                            <span className="text-[10px] leading-relaxed text-white/70">
                                Pengalaman Diakui.
                                <br />
                                Kompetensi Dihargai.
                                <br />
                                Pendidikan Dilanjutkan.
                            </span>
                        </div>
                    </KartuAdegan>
                ),
            },
        ],
        [diam]
    )

    React.useEffect(() => {
        if (diam) return
        const ms = adegan[indeks].durasi * SKALA_WAKTU * 1000
        const t = setTimeout(() => setIndeks((i) => (i + 1) % adegan.length), ms)
        return () => clearTimeout(t)
    }, [indeks, adegan, diam])

    const kini = adegan[indeks]

    return (
        <div className="absolute inset-0 overflow-hidden" aria-hidden>
            <LapisanDunia diam={diam} />

            {/* Vignette tipis di tepi — memberi kedalaman tanpa meredam warna.
                Bila teks hero diaktifkan lagi, pekatkan nilai tengahnya agar
                tulisan putih tetap terbaca. */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(10,6,24,0.45))]" />

            {/* Kartu adegan — di sisi kiri bawah agar tidak menutupi judul */}
            <div className="pointer-events-none absolute bottom-32 left-6 hidden lg:block xl:left-16">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={kini.no}
                        initial={diam ? false : { opacity: 0, y: 18, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={diam ? undefined : { opacity: 0, y: -12, scale: 0.98 }}
                        transition={{ duration: 0.7, ease: mudah }}
                    >
                        {kini.render()}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Strip alur */}
            <div className="absolute inset-x-0 bottom-24 hidden justify-center px-4 md:flex">
                <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full border border-white/15 bg-slate-950/40 px-4 py-1.5 backdrop-blur-sm">
                    {ALUR.map((l, i) => (
                        <React.Fragment key={l}>
                            {i > 0 && (
                                <span className="text-[10px] text-white/25">
                                    →
                                </span>
                            )}
                            <span
                                className={`text-[10px] transition-colors duration-700 ${i === kini.tahap
                                    ? 'font-semibold text-primary'
                                    : 'text-white/40'
                                    }`}
                            >
                                {l}
                            </span>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    )
}

'use client'
import {
    getChartAdminRole,
    getChartAkademikRole,
    getChartAsesorRole,
    getChartKaprodiRole,
    getChartMahasiswaRole,
    getChartPmbRole,
    getChartRektorRole,
    getMultiPeriodeChart,
    getPeriodeList,
    MultiPeriodeChart,
} from '@/services/ChartServices'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    ChartAkademikData,
    ChartDataItemAdmin,
    ChartDataItemPmb,
    ChartDataItemRektor,
    ChartKaprodiData,
    ChartMahasiswaData,
    ChartResponseAsesor,
} from '@/types/ChartTypes'
import { Session } from 'next-auth'
import React from 'react'
import { safeStorage } from '@/lib/safe-storage'
import { Skeleton } from '../ui/skeleton'
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Label,
    LabelList,
    Pie,
    PieChart,
    PolarAngleAxis,
    PolarGrid,
    Radar,
    RadarChart,
    XAxis,
    YAxis,
} from 'recharts'
import { Timeline } from '../Timeline'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart'
import { Badge } from '../ui/badge'
import { getInitials } from '@/lib/utils'
import {
    Activity,
    BookOpen,
    CheckCircle2,
    ClipboardList,
    GraduationCap,
    UserCheck,
    Users,
    XCircle,
} from 'lucide-react'

// ─── Shared sub-components ───────────────────────────────────────────────────

function StatCard({
    label,
    value,
    icon: Icon,
    color = 'blue',
}: {
    label: string
    value: string | number
    icon: React.ElementType
    color?: 'blue' | 'green' | 'violet' | 'orange' | 'rose'
}) {
    const bg = {
        blue: 'bg-blue-500/15 text-blue-600 dark:bg-blue-400/20 dark:text-blue-300',
        green: 'bg-green-500/15 text-green-600 dark:bg-green-400/20 dark:text-green-300',
        violet: 'bg-violet-500/15 text-violet-600 dark:bg-violet-400/20 dark:text-violet-300',
        orange: 'bg-orange-500/15 text-orange-600 dark:bg-orange-400/20 dark:text-orange-300',
        rose: 'bg-rose-500/15 text-rose-600 dark:bg-rose-400/20 dark:text-rose-300',
    }[color]

    return (
        <Card className={G}>
            <CardContent className="pt-5 pb-5">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm text-muted-foreground">{label}</p>
                        <p className="text-3xl font-bold mt-1">{value}</p>
                    </div>
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 backdrop-blur-sm ${bg}`}>
                        <Icon className="h-6 w-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function EmptyChart() {
    return (
        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-2">
            <Activity className="h-8 w-8 opacity-30" />
            <p className="text-sm">Tidak ada data</p>
        </div>
    )
}

const PIE_COLORS = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
]

// Palet hingga 8 periode untuk chart perbandingan antar periode.
const MULTI_COLORS = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
    '#6366f1',
    '#ec4899',
    '#14b8a6',
]

// Gabungkan dua array yang dikunci field yang sama (mis. programStudi) menjadi
// satu baris per kunci, supaya bisa ditampilkan sebagai grouped bar chart.
function mergeByKey(
    a: any[],
    aValueKey: string,
    aLabel: string,
    b: any[],
    bValueKey: string,
    bLabel: string,
    keyField = 'programStudi'
): Record<string, any>[] {
    const map = new Map<string, any>()
    a.forEach((x) => {
        map.set(x[keyField], {
            [keyField]: x[keyField],
            [aLabel]: x[aValueKey] ?? 0,
            [bLabel]: 0,
        })
    })
    b.forEach((x) => {
        const cur =
            map.get(x[keyField]) ??
            { [keyField]: x[keyField], [aLabel]: 0, [bLabel]: 0 }
        cur[bLabel] = x[bValueKey] ?? 0
        map.set(x[keyField], cur)
    })
    return Array.from(map.values())
}

// Donut chart ringkas dengan total di tengah — dipakai berulang di banyak role.
function DonutCard({
    title,
    description,
    data,
    config,
    dataKey,
    nameKey,
    centerLabel,
}: {
    title: string
    description: string
    data: any[]
    config: ChartConfig
    dataKey: string
    nameKey: string
    centerLabel?: string
}) {
    const total = data.reduce((s, x) => s + (x[dataKey] ?? 0), 0)
    return (
        <Card className={`${G} flex flex-col`}>
            <CardHeader className="items-center">
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                {data.length > 0 && total > 0 ? (
                    <ChartContainer config={config} className="mx-auto aspect-square max-h-[220px]">
                        <PieChart>
                            <ChartTooltip content={<ChartTooltipContent hideLabel={false} />} />
                            <Pie data={data} dataKey={dataKey} nameKey={nameKey} innerRadius={55} outerRadius={85} strokeWidth={4}>
                                {data.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                                <Label
                                    content={({ viewBox }) => {
                                        if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                                            return (
                                                <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                                    <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-2xl font-bold">{total}</tspan>
                                                    <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 18} className="fill-muted-foreground text-xs">{centerLabel ?? 'Total'}</tspan>
                                                </text>
                                            )
                                        }
                                    }}
                                />
                            </Pie>
                            <ChartLegend content={<ChartLegendContent nameKey={nameKey} />} />
                        </PieChart>
                    </ChartContainer>
                ) : <EmptyChart />}
            </CardContent>
        </Card>
    )
}

// Horizontal bar chart — enak untuk ranking/peringkat per kategori.
function HBarCard({
    title,
    description,
    data,
    config,
    dataKey,
    categoryKey,
    color,
    formatTick = true,
}: {
    title: string
    description: string
    data: any[]
    config: ChartConfig
    dataKey: string
    categoryKey: string
    color: string
    formatTick?: boolean
}) {
    return (
        <Card className={G}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                {data.length > 0 ? (
                    <ChartContainer config={config}>
                        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24 }}>
                            <CartesianGrid horizontal={false} />
                            <XAxis type="number" tickLine={false} axisLine={false} />
                            <YAxis
                                type="category"
                                dataKey={categoryKey}
                                tickLine={false}
                                axisLine={false}
                                width={70}
                                tickFormatter={(v) => (formatTick ? getInitials(String(v)) : String(v))}
                            />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel={false} />} />
                            <Bar dataKey={dataKey} fill={color} radius={5}>
                                <LabelList dataKey={dataKey} position="right" offset={8} className="fill-foreground" fontSize={11} />
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                ) : <EmptyChart />}
            </CardContent>
        </Card>
    )
}

const G = [
    'bg-white/30 backdrop-blur-2xl',
    'border border-white/60',
    'shadow-xl shadow-black/10',
    'dark:bg-white/5 dark:backdrop-blur-2xl',
    'dark:border-white/15',
    'dark:shadow-black/40',
].join(' ')

// ─── Main component ───────────────────────────────────────────────────────────

const Dashboard = ({ session }: { session: Session | null }) => {
    const [role, setRole] = React.useState<{
        GuardName: string
        Icon: string
        Name: string
        RoleId: string
    } | null>(null)
    const [loading, setLoading] = React.useState(false)
    const [dataMhs, setDataMhs] = React.useState<ChartMahasiswaData | null>(null)
    const [dataKaprodi, setDataKaprodi] = React.useState<ChartKaprodiData | null>(null)
    const [dataRektor, setDataRektor] = React.useState<ChartDataItemRektor | null>(null)
    const [dataAkademik, setDataAkademik] = React.useState<ChartAkademikData | null>(null)
    const [dataAsesor, setDataAsesor] = React.useState<ChartResponseAsesor | null>(null)
    const [dataPmb, setDataPmb] = React.useState<ChartDataItemPmb | null>(null)
    const [dataAdmin, setDataAdmin] = React.useState<ChartDataItemAdmin | null>(null)
    // Filter periode (kosong = semua periode). Tidak berlaku untuk Mahasiswa.
    const [periode, setPeriode] = React.useState<string>('')
    const [periodeList, setPeriodeList] = React.useState<string[]>([])
    // Data agregasi lintas periode (independen dari filter periode).
    const [dataMultiPeriode, setDataMultiPeriode] = React.useState<MultiPeriodeChart | null>(null)

    // ── Resolusi role + daftar periode (sekali, saat sesi tersedia) ──────────
    React.useEffect(() => {
        if (role) return
        let roleState: { GuardName: string; Icon: string; Name: string; RoleId: string } | null = null
        const stored = safeStorage.getItem('pmb.iti.role')
        if (stored) {
            try {
                roleState = JSON.parse(stored)
            } catch {
                roleState = null
            }
        }
        if (!roleState && session?.user.roles && session.user.roles.length > 0) {
            const r = session.user.roles[0] as { RoleId: string; Name: string; GuardName?: string }
            roleState = {
                RoleId: r.RoleId,
                Name: r.Name,
                GuardName: r.GuardName ?? '',
                Icon: '',
            }
        }
        if (roleState) {
            setRole(roleState)
            // Mahasiswa tidak memakai filter periode maupun chart antar periode.
            if (!roleState.Name.match('Mahasiswa')) {
                getPeriodeList()
                    .then((list) => setPeriodeList(list))
                    .catch(() => { })
                getMultiPeriodeChart()
                    .then((res) => setDataMultiPeriode(res))
                    .catch(() => { })
            }
        }
    }, [session, role])

    // ── Muat data chart sesuai role + periode terpilih ───────────────────────
    React.useEffect(() => {
        if (!role) return

        setLoading(true)

        if (role.Name.match('Rektor')) {
            getChartRektorRole(role.RoleId, periode)
                .then((res) => setDataRektor(res))
                .catch(() => { })
                .finally(() => setLoading(false))
        } else if (role.Name.match('Kaprodi')) {
            getChartKaprodiRole(role.RoleId, periode)
                .then((res) => setDataKaprodi(res))
                .catch(() => { })
                .finally(() => setLoading(false))
        } else if (role.Name.match('Asesor')) {
            getChartAsesorRole(role.RoleId, periode)
                .then((res) => setDataAsesor(res))
                .catch(() => { })
                .finally(() => setLoading(false))
        } else if (role.Name.match('Mahasiswa')) {
            getChartMahasiswaRole(role.RoleId)
                .then((res) => setDataMhs(res))
                .catch(() => { })
                .finally(() => setLoading(false))
        } else if (role.Name.match('Admin')) {
            getChartAdminRole(role.RoleId, periode)
                .then((res) => setDataAdmin(res))
                .catch(() => { })
                .finally(() => setLoading(false))
        } else if (role.Name.match('PMB')) {
            getChartPmbRole(role.RoleId, periode)
                .then((res) => setDataPmb(res))
                .catch(() => { })
                .finally(() => setLoading(false))
        } else if (role.Name.match('Akademik')) {
            getChartAkademikRole(role.RoleId, periode)
                .then((res) => setDataAkademik(res))
                .catch(() => { })
                .finally(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [role, periode])

    // Filter periode (dirender di atas konten setiap role kecuali Mahasiswa).
    const periodeFilterNode = (
        <div className={`flex items-center justify-end gap-3 ${G} rounded-lg px-4 py-3`}>
            <span className="text-sm font-medium text-muted-foreground">Periode</span>
            <Select
                value={periode || 'ALL'}
                onValueChange={(v) => setPeriode(v === 'ALL' ? '' : v)}
            >
                <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="Semua Periode" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Periode</SelectLabel>
                        <SelectItem value="ALL">Semua Periode</SelectItem>
                        {periodeList.map((p) => (
                            <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )

    // Konfigurasi warna per periode untuk chart perbandingan antar periode.
    const cfgMulti: ChartConfig = Object.fromEntries(
        (dataMultiPeriode?.periods ?? []).map((p, i) => [
            p,
            { label: p, color: MULTI_COLORS[i % MULTI_COLORS.length] },
        ])
    )

    // Section perbandingan antar periode (radar + bar), dirender di bawah konten
    // setiap role kecuali Mahasiswa. Independen dari filter periode.
    const multiPeriodeNode =
        dataMultiPeriode && dataMultiPeriode.periods.length > 0 ? (
            <div className="space-y-4">
                <div className="flex items-center gap-3 pt-2">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Perbandingan Antar Periode
                    </span>
                    <div className="h-px flex-1 bg-border" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Card className={`${G} flex flex-col`}>
                        <CardHeader className="items-center">
                            <CardTitle>Radar Distribusi Status</CardTitle>
                            <CardDescription>Sebaran mahasiswa per status di tiap periode</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ChartContainer config={cfgMulti} className="mx-auto aspect-square max-h-[320px]">
                                <RadarChart data={dataMultiPeriode.rows}>
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="category" tickFormatter={(v) => getInitials(String(v))} />
                                    {dataMultiPeriode.periods.map((p, i) => (
                                        <Radar
                                            key={p}
                                            dataKey={p}
                                            stroke={MULTI_COLORS[i % MULTI_COLORS.length]}
                                            fill={MULTI_COLORS[i % MULTI_COLORS.length]}
                                            fillOpacity={0.05}
                                        />
                                    ))}
                                    <ChartLegend content={<ChartLegendContent />} />
                                </RadarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    <Card className={G}>
                        <CardHeader>
                            <CardTitle>Bar History</CardTitle>
                            <CardDescription>Perbandingan jumlah mahasiswa per status antar periode</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={cfgMulti}>
                                <BarChart data={dataMultiPeriode.rows} margin={{ top: 16 }}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="category" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => getInitials(String(v))} />
                                    <YAxis tickLine={false} axisLine={false} />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                    <ChartLegend content={<ChartLegendContent />} />
                                    {dataMultiPeriode.periods.map((p, i) => (
                                        <Bar key={p} dataKey={p} fill={MULTI_COLORS[i % MULTI_COLORS.length]} radius={2} />
                                    ))}
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Card className={G}>
                        <CardHeader>
                            <CardTitle>Tren Pendaftar per Periode</CardTitle>
                            <CardDescription>Total calon mahasiswa RPL yang mendaftar di tiap periode</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {dataMultiPeriode.trend.length > 0 ? (
                                <ChartContainer config={{ total: { label: 'Pendaftar', color: 'var(--chart-1)' } }}>
                                    <AreaChart data={dataMultiPeriode.trend} margin={{ top: 16, left: 8, right: 8 }}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="periode" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => getInitials(String(v))} />
                                        <YAxis tickLine={false} axisLine={false} />
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                        <Area dataKey="total" type="monotone" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.15}>
                                            <LabelList dataKey="total" position="top" offset={8} className="fill-foreground" fontSize={11} />
                                        </Area>
                                    </AreaChart>
                                </ChartContainer>
                            ) : <EmptyChart />}
                        </CardContent>
                    </Card>

                    <Card className={G}>
                        <CardHeader>
                            <CardTitle>Mahasiswa per Prodi Antar Periode</CardTitle>
                            <CardDescription>Perbandingan intake program studi di tiap periode</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {dataMultiPeriode.prodiRows.length > 0 ? (
                                <ChartContainer config={cfgMulti}>
                                    <BarChart data={dataMultiPeriode.prodiRows} margin={{ top: 16 }}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="category" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => getInitials(String(v))} />
                                        <YAxis tickLine={false} axisLine={false} />
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                        <ChartLegend content={<ChartLegendContent />} />
                                        {dataMultiPeriode.periods.map((p, i) => (
                                            <Bar key={p} dataKey={p} fill={MULTI_COLORS[i % MULTI_COLORS.length]} radius={2} />
                                        ))}
                                    </BarChart>
                                </ChartContainer>
                            ) : <EmptyChart />}
                        </CardContent>
                    </Card>
                </div>
            </div>
        ) : null

    // ── Loading ──────────────────────────────────────────────────────────────
    if (loading || role === null) {
        return (
            <div className="w-full space-y-4">
                {role && !role.Name.match('Mahasiswa') ? periodeFilterNode : null}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-24 w-full rounded-lg" />
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-64 w-full rounded-lg" />
                    <Skeleton className="h-64 w-full rounded-lg" />
                </div>
            </div>
        )
    }

    // ── REKTOR ───────────────────────────────────────────────────────────────
    if (role.Name.match('Rektor')) {
        const prodi = dataRektor?.data[0]?.hasilPerProdi ?? []
        const statusList = dataRektor?.data[1]?.countPerStatusLengkap ?? []
        const mkList = dataRektor?.data[2]?.hasilMK ?? []
        const userList = dataRektor?.data[3]?.totalUserPerRole ?? []
        const asesorPie = (dataRektor?.data[4] ?? []) as { name: string; total: number }[]
        const mhsPie = (dataRektor?.data[5] ?? []) as { name: string; total: number }[]

        const totalMhs = prodi.reduce((s: number, x: any) => s + (x.jumlahMahasiswa ?? 0), 0)
        const totalMK = mkList.reduce((s: number, x: any) => s + (x.jumlahMataKuliah ?? 0), 0)
        const totalUser = userList.reduce((s: number, x: any) => s + (x.jumlahPengguna ?? 0), 0)
        const asesorSK = asesorPie.find((x) => x.name === 'Asesor Sudah SK')?.total ?? 0
        const asesorBelum = asesorPie.find((x) => x.name === 'Asesor Belum SK')?.total ?? 0
        const mhsSK = mhsPie.find((x) => x.name === 'Mahasiswa Sudah SK')?.total ?? 0
        const mhsBelum = mhsPie.find((x) => x.name === 'Mahasiswa Belum SK')?.total ?? 0

        // Aggregasi turunan
        const mhsVsMk = mergeByKey(prodi, 'jumlahMahasiswa', 'Mahasiswa', mkList, 'jumlahMataKuliah', 'Mata Kuliah')
        const skSummary = [
            { status: 'Sudah SK', Asesor: asesorSK, Mahasiswa: mhsSK },
            { status: 'Belum SK', Asesor: asesorBelum, Mahasiswa: mhsBelum },
        ]
        const cfgMhsVsMk: ChartConfig = {
            Mahasiswa: { label: 'Mahasiswa', color: 'var(--chart-1)' },
            'Mata Kuliah': { label: 'Mata Kuliah', color: 'var(--chart-3)' },
        }
        const cfgUserDonut: ChartConfig = { jumlahPengguna: { label: 'Pengguna' } }
        const cfgSkSummary: ChartConfig = {
            Asesor: { label: 'Asesor', color: 'var(--chart-1)' },
            Mahasiswa: { label: 'Mahasiswa', color: 'var(--chart-4)' },
        }

        const cfgProdi: ChartConfig = { jumlahMahasiswa: { label: 'Mahasiswa', color: 'var(--chart-1)' } }
        const cfgStatus: ChartConfig = { jumlah: { label: 'Jumlah', color: 'var(--chart-2)' } }
        const cfgMK: ChartConfig = { jumlahMataKuliah: { label: 'Mata Kuliah', color: 'var(--chart-3)' } }
        const cfgUser: ChartConfig = { jumlahPengguna: { label: 'Pengguna', color: 'var(--chart-4)' } }
        const cfgAsesorPie: ChartConfig = {
            total: { label: 'Jumlah' },
            'Asesor Sudah SK': { label: 'Sudah SK', color: 'var(--chart-1)' },
            'Asesor Belum SK': { label: 'Belum SK', color: 'var(--chart-2)' },
        }
        const cfgMhsPie: ChartConfig = {
            total: { label: 'Jumlah' },
            'Mahasiswa Sudah SK': { label: 'Sudah SK', color: 'var(--chart-1)' },
            'Mahasiswa Belum SK': { label: 'Belum SK', color: 'var(--chart-2)' },
        }

        return (
            <div className="w-full space-y-4">
                {role && !role.Name.match('Mahasiswa') ? periodeFilterNode : null}
                {/* Stat cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard label="Total Mahasiswa" value={totalMhs} icon={Users} color="blue" />
                    <StatCard label="Total Mata Kuliah" value={totalMK} icon={BookOpen} color="green" />
                    <StatCard label="Total Pengguna" value={totalUser} icon={UserCheck} color="violet" />
                    <StatCard label="Asesor Sudah SK" value={asesorSK} icon={ClipboardList} color="orange" />
                </div>

                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className={G}>
                        <CardHeader>
                            <CardTitle>Mahasiswa per Program Studi</CardTitle>
                            <CardDescription>Distribusi jumlah mahasiswa RPL di setiap prodi</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {prodi.length > 0 ? (
                                <ChartContainer config={cfgProdi}>
                                    <BarChart data={prodi} margin={{ top: 16 }}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="programStudi" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => getInitials(v)} />
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                        <Bar dataKey="jumlahMahasiswa" fill="var(--chart-1)" radius={6}>
                                            <LabelList position="top" offset={8} className="fill-foreground" fontSize={11} />
                                        </Bar>
                                    </BarChart>
                                </ChartContainer>
                            ) : <EmptyChart />}
                        </CardContent>
                    </Card>

                    <Card className={G}>
                        <CardHeader>
                            <CardTitle>Mahasiswa per Status Kelengkapan</CardTitle>
                            <CardDescription>Jumlah mahasiswa berdasarkan status pengisian berkas</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {statusList.length > 0 ? (
                                <ChartContainer config={cfgStatus}>
                                    <BarChart data={statusList} margin={{ top: 16 }}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="status" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => getInitials(v)} />
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                        <Bar dataKey="jumlah" fill="var(--chart-2)" radius={6}>
                                            <LabelList position="top" offset={8} className="fill-foreground" fontSize={11} />
                                        </Bar>
                                    </BarChart>
                                </ChartContainer>
                            ) : <EmptyChart />}
                        </CardContent>
                    </Card>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className={G}>
                        <CardHeader>
                            <CardTitle>Mata Kuliah per Program Studi</CardTitle>
                            <CardDescription>Total mata kuliah yang tersedia di setiap prodi</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {mkList.length > 0 ? (
                                <ChartContainer config={cfgMK}>
                                    <BarChart data={mkList} margin={{ top: 16 }}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="programStudi" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => getInitials(v)} />
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                        <Bar dataKey="jumlahMataKuliah" fill="var(--chart-3)" radius={6}>
                                            <LabelList position="top" offset={8} className="fill-foreground" fontSize={11} />
                                        </Bar>
                                    </BarChart>
                                </ChartContainer>
                            ) : <EmptyChart />}
                        </CardContent>
                    </Card>

                    <Card className={G}>
                        <CardHeader>
                            <CardTitle>Pengguna per Role</CardTitle>
                            <CardDescription>Jumlah akun aktif berdasarkan peran dalam sistem</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {userList.length > 0 ? (
                                <ChartContainer config={cfgUser}>
                                    <BarChart data={userList} margin={{ top: 16 }}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="role" tickLine={false} axisLine={false} tickMargin={8} />
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                        <Bar dataKey="jumlahPengguna" fill="var(--chart-4)" radius={6}>
                                            <LabelList position="top" offset={8} className="fill-foreground" fontSize={11} />
                                        </Bar>
                                    </BarChart>
                                </ChartContainer>
                            ) : <EmptyChart />}
                        </CardContent>
                    </Card>
                </div>

                {/* Row 3 — Pie charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className={`${G} flex flex-col`}>
                        <CardHeader className="items-center">
                            <CardTitle>Status SK Asesor</CardTitle>
                            <CardDescription>Perbandingan asesor sudah dan belum menerima SK</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            {asesorPie.length > 0 ? (
                                <ChartContainer config={cfgAsesorPie} className="mx-auto aspect-square max-h-[220px]">
                                    <PieChart>
                                        <ChartTooltip content={<ChartTooltipContent hideLabel={false} />} />
                                        <Pie data={asesorPie} dataKey="total" nameKey="name" label={({ name, percent }) => `${getInitials(name)} ${(percent * 100).toFixed(0)}%`} outerRadius={80}>
                                            {asesorPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                                        </Pie>
                                        <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                                    </PieChart>
                                </ChartContainer>
                            ) : <EmptyChart />}
                        </CardContent>
                    </Card>

                    <Card className={`${G} flex flex-col`}>
                        <CardHeader className="items-center">
                            <CardTitle>Status SK Mahasiswa</CardTitle>
                            <CardDescription>Perbandingan mahasiswa sudah dan belum menerima SK hasil asesmen</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            {mhsPie.length > 0 ? (
                                <ChartContainer config={cfgMhsPie} className="mx-auto aspect-square max-h-[220px]">
                                    <PieChart>
                                        <ChartTooltip content={<ChartTooltipContent hideLabel={false} />} />
                                        <Pie data={mhsPie} dataKey="total" nameKey="name" label={({ name, percent }) => `${getInitials(name)} ${(percent * 100).toFixed(0)}%`} outerRadius={80}>
                                            {mhsPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                                        </Pie>
                                        <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                                    </PieChart>
                                </ChartContainer>
                            ) : <EmptyChart />}
                        </CardContent>
                    </Card>
                </div>

                {/* Row 4 — Komparasi & komposisi */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className={G}>
                        <CardHeader>
                            <CardTitle>Mahasiswa vs Mata Kuliah per Prodi</CardTitle>
                            <CardDescription>Perbandingan beban mahasiswa dan ketersediaan mata kuliah di tiap prodi</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {mhsVsMk.length > 0 ? (
                                <ChartContainer config={cfgMhsVsMk}>
                                    <BarChart data={mhsVsMk} margin={{ top: 16 }}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="programStudi" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => getInitials(v)} />
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                        <ChartLegend content={<ChartLegendContent />} />
                                        <Bar dataKey="Mahasiswa" fill="var(--chart-1)" radius={4} />
                                        <Bar dataKey="Mata Kuliah" fill="var(--chart-3)" radius={4} />
                                    </BarChart>
                                </ChartContainer>
                            ) : <EmptyChart />}
                        </CardContent>
                    </Card>

                    <DonutCard
                        title="Komposisi Pengguna per Role"
                        description="Proporsi akun aktif berdasarkan peran dalam sistem"
                        data={userList}
                        config={cfgUserDonut}
                        dataKey="jumlahPengguna"
                        nameKey="role"
                        centerLabel="Pengguna"
                    />
                </div>

                {/* Row 5 — Ringkasan SK & funnel status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className={G}>
                        <CardHeader>
                            <CardTitle>Ringkasan Status SK</CardTitle>
                            <CardDescription>Perbandingan capaian SK antara asesor dan mahasiswa</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={cfgSkSummary}>
                                <BarChart data={skSummary} margin={{ top: 16 }}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="status" tickLine={false} axisLine={false} tickMargin={8} />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                    <ChartLegend content={<ChartLegendContent />} />
                                    <Bar dataKey="Asesor" fill="var(--chart-1)" radius={4} />
                                    <Bar dataKey="Mahasiswa" fill="var(--chart-4)" radius={4} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    <HBarCard
                        title="Funnel Status Asesmen"
                        description="Jumlah mahasiswa di setiap tahapan proses asesmen"
                        data={statusList}
                        config={{ jumlah: { label: 'Jumlah', color: 'var(--chart-2)' } }}
                        dataKey="jumlah"
                        categoryKey="status"
                        color="var(--chart-2)"
                    />
                </div>
                {multiPeriodeNode}
            </div>
        )
    }

    // ── KAPRODI ──────────────────────────────────────────────────────────────
    if (role.Name.match('Kaprodi')) {
        const chart1 = dataKaprodi?.data[0]?.chart_1 ?? []
        const chart2 = dataKaprodi?.data[1]?.chart_2 ?? []
        const chart3 = dataKaprodi?.data[2]?.chart_3 ?? []
        const chart4 = dataKaprodi?.data[3]?.chart_4 ?? []

        const totalAsesor = chart2.reduce((s: number, x: any) => s + (x.count ?? 0), 0)
        const totalIntake = chart3.reduce((s: number, x: any) => s + (x.count ?? 0), 0)
        const totalMK = chart4.reduce((s: number, x: any) => s + (x.count ?? 0), 0)

        const cfgAsesorBar: ChartConfig = {
            'Asesor Akademik': { label: 'Asesor Akademik', color: 'var(--chart-1)' },
            'Asesor Praktisi': { label: 'Asesor Praktisi', color: 'var(--chart-2)' },
        }
        const cfgAsesorPie: ChartConfig = {
            count: { label: 'Jumlah' },
            'Asesor Akademik': { label: 'Asesor Akademik', color: 'var(--chart-1)' },
            'Asesor Praktisi': { label: 'Asesor Praktisi', color: 'var(--chart-2)' },
        }
        const cfgCount: ChartConfig = { count: { label: 'Jumlah', color: 'var(--chart-1)' } }

        // Aggregasi turunan
        const intakeVsMk = mergeByKey(chart3, 'count', 'Mahasiswa', chart4, 'count', 'Mata Kuliah', 'program_studi')
        const totalAsesorPerProdi = chart1.map((x: any) => ({
            program_studi: x.date,
            total: (x['Asesor Akademik'] ?? 0) + (x['Asesor Praktisi'] ?? 0),
        }))
        const cfgIntakeVsMk: ChartConfig = {
            Mahasiswa: { label: 'Mahasiswa', color: 'var(--chart-1)' },
            'Mata Kuliah': { label: 'Mata Kuliah', color: 'var(--chart-3)' },
        }

        return (
            <div className="w-full space-y-4">
                {role && !role.Name.match('Mahasiswa') ? periodeFilterNode : null}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <StatCard label="Total Asesor" value={totalAsesor} icon={UserCheck} color="blue" />
                    <StatCard label="Mahasiswa Intake" value={totalIntake} icon={Users} color="green" />
                    <StatCard label="Total Mata Kuliah" value={totalMK} icon={BookOpen} color="violet" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className={G}>
                        <CardHeader>
                            <CardTitle>Asesor per Program Studi</CardTitle>
                            <CardDescription>Jumlah asesor akademik dan praktisi di setiap prodi</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {chart1.length > 0 ? (
                                <ChartContainer config={cfgAsesorBar}>
                                    <BarChart data={chart1} margin={{ top: 16 }}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(v) => getInitials(v)} />
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel={false} />} />
                                        <ChartLegend content={<ChartLegendContent />} />
                                        <Bar dataKey="Asesor Akademik" fill="var(--chart-1)" radius={4} />
                                        <Bar dataKey="Asesor Praktisi" fill="var(--chart-2)" radius={4} />
                                    </BarChart>
                                </ChartContainer>
                            ) : <EmptyChart />}
                        </CardContent>
                    </Card>

                    <Card className={`${G} flex flex-col`}>
                        <CardHeader className="items-center">
                            <CardTitle>Komposisi Tipe Asesor</CardTitle>
                            <CardDescription>Proporsi asesor akademik vs asesor praktisi</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            {chart2.length > 0 ? (
                                <ChartContainer config={cfgAsesorPie} className="mx-auto aspect-square max-h-[220px]">
                                    <PieChart>
                                        <ChartTooltip content={<ChartTooltipContent hideLabel={false} />} />
                                        <Pie data={chart2} dataKey="count" nameKey="tipe" label={({ tipe, percent }) => `${getInitials(tipe)} ${(percent * 100).toFixed(0)}%`} outerRadius={80}>
                                            {chart2.map((_: any, i: number) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                                        </Pie>
                                        <ChartLegend content={<ChartLegendContent nameKey="tipe" />} />
                                    </PieChart>
                                </ChartContainer>
                            ) : <EmptyChart />}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className={G}>
                        <CardHeader>
                            <CardTitle>Mahasiswa Intake per Prodi</CardTitle>
                            <CardDescription>Total mahasiswa yang mendaftar RPL per program studi</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {chart3.length > 0 ? (
                                <ChartContainer config={cfgCount}>
                                    <BarChart data={chart3} margin={{ top: 16 }}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="program_studi" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(v) => getInitials(v)} />
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel={false} />} />
                                        <Bar dataKey="count" fill="var(--chart-1)" radius={6}>
                                            <LabelList position="top" offset={8} className="fill-foreground" fontSize={11} />
                                        </Bar>
                                    </BarChart>
                                </ChartContainer>
                            ) : <EmptyChart />}
                        </CardContent>
                    </Card>

                    <Card className={G}>
                        <CardHeader>
                            <CardTitle>Mata Kuliah per Prodi</CardTitle>
                            <CardDescription>Total mata kuliah yang dapat diakui melalui RPL</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {chart4.length > 0 ? (
                                <ChartContainer config={cfgCount}>
                                    <BarChart data={chart4} margin={{ top: 16 }}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="program_studi" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(v) => getInitials(v)} />
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel={false} />} />
                                        <Bar dataKey="count" fill="var(--chart-3)" radius={6}>
                                            <LabelList position="top" offset={8} className="fill-foreground" fontSize={11} />
                                        </Bar>
                                    </BarChart>
                                </ChartContainer>
                            ) : <EmptyChart />}
                        </CardContent>
                    </Card>
                </div>

                {/* Row 3 — Komparasi & ranking */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className={G}>
                        <CardHeader>
                            <CardTitle>Mahasiswa vs Mata Kuliah per Prodi</CardTitle>
                            <CardDescription>Perbandingan jumlah mahasiswa intake dan mata kuliah RPL di tiap prodi</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {intakeVsMk.length > 0 ? (
                                <ChartContainer config={cfgIntakeVsMk}>
                                    <BarChart data={intakeVsMk} margin={{ top: 16 }}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="program_studi" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => getInitials(v)} />
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                        <ChartLegend content={<ChartLegendContent />} />
                                        <Bar dataKey="Mahasiswa" fill="var(--chart-1)" radius={4} />
                                        <Bar dataKey="Mata Kuliah" fill="var(--chart-3)" radius={4} />
                                    </BarChart>
                                </ChartContainer>
                            ) : <EmptyChart />}
                        </CardContent>
                    </Card>

                    <HBarCard
                        title="Total Asesor per Prodi"
                        description="Peringkat program studi berdasarkan jumlah seluruh asesor"
                        data={totalAsesorPerProdi}
                        config={{ total: { label: 'Asesor', color: 'var(--chart-2)' } }}
                        dataKey="total"
                        categoryKey="program_studi"
                        color="var(--chart-2)"
                    />
                </div>
                {multiPeriodeNode}
            </div>
        )
    }

    // ── ASESOR ───────────────────────────────────────────────────────────────
    if (role.Name.match('Asesor')) {
        const chart1 = dataAsesor?.data?.chart1 ?? []
        const chart2 = dataAsesor?.data?.chart2 ?? []

        const totalMhs = chart1.reduce((s: number, x: any) => s + (x.sudahAsses ?? 0) + (x.belumAsses ?? 0), 0)
        const sudah = chart1.reduce((s: number, x: any) => s + (x.sudahAsses ?? 0), 0)
        const belum = chart1.reduce((s: number, x: any) => s + (x.belumAsses ?? 0), 0)

        const cfgAsses: ChartConfig = {
            belumAsses: { label: 'Belum Asesmen', color: 'var(--chart-2)' },
            sudahAsses: { label: 'Sudah Asesmen', color: 'var(--chart-1)' },
        }
        const cfgStatus: ChartConfig = {
            Jumlah: { label: 'Jumlah', color: 'var(--chart-1)' },
        }

        // Aggregasi turunan
        const assesDonut = [
            { name: 'Sudah Asesmen', total: sudah },
            { name: 'Belum Asesmen', total: belum },
        ]
        const progressPerProdi = chart1.map((x: any) => {
            const t = (x.sudahAsses ?? 0) + (x.belumAsses ?? 0)
            return {
                programStudi: x.programStudi,
                persen: t > 0 ? Math.round(((x.sudahAsses ?? 0) / t) * 100) : 0,
            }
        })
        const cfgAssesDonut: ChartConfig = {
            total: { label: 'Jumlah' },
            'Sudah Asesmen': { label: 'Sudah Asesmen', color: 'var(--chart-1)' },
            'Belum Asesmen': { label: 'Belum Asesmen', color: 'var(--chart-2)' },
        }

        return (
            <div className="w-full space-y-4">
                {role && !role.Name.match('Mahasiswa') ? periodeFilterNode : null}
                <div className="grid grid-cols-3 gap-4">
                    <StatCard label="Total Mahasiswa" value={totalMhs} icon={Users} color="blue" />
                    <StatCard label="Sudah Asesmen" value={sudah} icon={CheckCircle2} color="green" />
                    <StatCard label="Belum Asesmen" value={belum} icon={ClipboardList} color="rose" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className={G}>
                        <CardHeader>
                            <CardTitle>Asesmen per Program Studi</CardTitle>
                            <CardDescription>Perbandingan mahasiswa sudah dan belum diasesmen di tiap prodi</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {chart1.length > 0 ? (
                                <ChartContainer config={cfgAsses}>
                                    <BarChart data={chart1} margin={{ top: 16 }}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="programStudi" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => getInitials(v)} />
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                        <ChartLegend content={<ChartLegendContent />} />
                                        <Bar dataKey="sudahAsses" fill="var(--chart-1)" radius={4} />
                                        <Bar dataKey="belumAsses" fill="var(--chart-2)" radius={4} />
                                    </BarChart>
                                </ChartContainer>
                            ) : <EmptyChart />}
                        </CardContent>
                    </Card>

                    <Card className={G}>
                        <CardHeader>
                            <CardTitle>Status Asesmen Mahasiswa</CardTitle>
                            <CardDescription>Distribusi mahasiswa berdasarkan status proses asesmen</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {chart2.length > 0 ? (
                                <ChartContainer config={cfgStatus}>
                                    <BarChart data={chart2} margin={{ top: 16 }}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="Status" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => getInitials(v)} />
                                        <YAxis tickLine={false} axisLine={false} />
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                        <Bar dataKey="Jumlah" fill="var(--chart-1)" radius={6}>
                                            <LabelList position="top" offset={8} className="fill-foreground" fontSize={11} />
                                        </Bar>
                                    </BarChart>
                                </ChartContainer>
                            ) : <EmptyChart />}
                        </CardContent>
                    </Card>
                </div>

                {/* Row 2 — Komposisi & progres */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DonutCard
                        title="Komposisi Asesmen"
                        description="Proporsi mahasiswa yang sudah dan belum diasesmen"
                        data={assesDonut}
                        config={cfgAssesDonut}
                        dataKey="total"
                        nameKey="name"
                        centerLabel="Mahasiswa"
                    />

                    <HBarCard
                        title="Persentase Penyelesaian per Prodi"
                        description="Capaian asesmen (%) di setiap program studi"
                        data={progressPerProdi}
                        config={{ persen: { label: 'Selesai (%)', color: 'var(--chart-1)' } }}
                        dataKey="persen"
                        categoryKey="programStudi"
                        color="var(--chart-1)"
                    />
                </div>
                {multiPeriodeNode}
            </div>
        )
    }

    // ── MAHASISWA ────────────────────────────────────────────────────────────
    if (role.Name.match('Mahasiswa')) {
        const chart1 = dataMhs?.data[0]?.chart1 ?? []
        const chart2 = dataMhs?.data[1]?.chart2 ?? []
        const chart4 = dataMhs?.data[3]?.chart4 ?? []

        const checkFields = [
            { label: 'Pesantren', key: 'Pesantren' },
            { label: 'Institusi Lama', key: 'InstitusiLama' },
            { label: 'Pekerjaan', key: 'PekerjaanMahasiswa' },
            { label: 'Kependudukan', key: 'InformasiKependudukan' },
            { label: 'Orang Tua', key: 'OrangTua' },
            { label: 'Riwayat Pekerjaan', key: 'MahasiswaRiwayatPekerjaan' },
            { label: 'Pendidikan', key: 'MahasiswaPendidikan' },
            { label: 'Organisasi Profesi', key: 'MahasiswaOrganisasiProfesi' },
            { label: 'Piagam', key: 'MahasiswaPiagam' },
            { label: 'Konferensi', key: 'MahasiswaKonferensi' },
            { label: 'Pelatihan Profesional', key: 'MahasiswaPelatihanProfessional' },
        ]

        return (
            <div className="w-full space-y-4">
                {role && !role.Name.match('Mahasiswa') ? periodeFilterNode : null}
                {/* Timeline */}
                {chart4.length > 0 && (
                    <div className="space-y-3">
                        {chart4.map((item: any, i: number) => (
                            <Card key={i} className={G}>
                                <CardContent className="pt-5 pb-5">
                                    <Timeline data={item} />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Kelengkapan Data Diri */}
                    <div className="space-y-3">
                        {chart1.length > 0 ? chart1.map((item: any, idx: number) => {
                            const done = checkFields.filter((f) => (item[f.key] ?? 0) > 0).length
                            const pct = Math.round((done / checkFields.length) * 100)
                            return (
                                <Card key={idx} className={G}>
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-base">Kelengkapan Data Diri</CardTitle>
                                                <CardDescription>{item.KodePendaftar} · {item.ProgramStudi}</CardDescription>
                                            </div>
                                            <Badge variant={pct === 100 ? 'default' : pct >= 50 ? 'secondary' : 'destructive'}>
                                                {pct}% lengkap
                                            </Badge>
                                        </div>
                                        {/* Progress bar */}
                                        <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-primary transition-all"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-1.5">
                                            {checkFields.map((f) => {
                                                const filled = (item[f.key] ?? 0) > 0
                                                return (
                                                    <div key={f.key} className="flex items-center gap-2 text-sm">
                                                        {filled
                                                            ? <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                                                            : <XCircle className="h-4 w-4 shrink-0 text-red-400" />
                                                        }
                                                        <span className={filled ? '' : 'text-muted-foreground'}>{f.label}</span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        }) : (
                            <Card className={G}><CardContent className="pt-6"><EmptyChart /></CardContent></Card>
                        )}
                    </div>

                    {/* Upload Dokumen */}
                    <div className="space-y-3">
                        {chart2.length > 0 ? chart2.map((item: any, idx: number) => {
                            const docs: any[] = item.BuktiForm ?? []
                            const done = docs.filter((d) => (d.Upload ?? 0) > 0).length
                            const pct = docs.length > 0 ? Math.round((done / docs.length) * 100) : 0
                            return (
                                <Card key={idx} className={G}>
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-base">Upload Dokumen</CardTitle>
                                                <CardDescription>{item.KodePendaftar}</CardDescription>
                                            </div>
                                            <Badge variant={pct === 100 ? 'default' : pct >= 50 ? 'secondary' : 'destructive'}>
                                                {pct}% terupload
                                            </Badge>
                                        </div>
                                        <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-primary transition-all"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 gap-1.5">
                                            {docs.map((doc: any, di: number) => {
                                                const uploaded = (doc.Upload ?? 0) > 0
                                                return (
                                                    <div key={di} className="flex items-center gap-2 text-sm">
                                                        {uploaded
                                                            ? <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                                                            : <XCircle className="h-4 w-4 shrink-0 text-red-400" />
                                                        }
                                                        <span className={uploaded ? '' : 'text-muted-foreground'}>{doc.JenisDokumen}</span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        }) : (
                            <Card className={G}><CardContent className="pt-6"><EmptyChart /></CardContent></Card>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    // ── ADMIN ────────────────────────────────────────────────────────────────
    if (role.Name.match('Admin')) {
        const prodi = dataAdmin?.data[0]?.hasilPerProdi ?? []
        const userList = dataAdmin?.data[1]?.totalUserPerRole ?? []

        const totalMhs = prodi.reduce((s: number, x: any) => s + (x.jumlahMahasiswa ?? 0), 0)
        const totalUser = userList.reduce((s: number, x: any) => s + (x.jumlahPengguna ?? 0), 0)
        const totalProdi = prodi.length

        const cfgProdi: ChartConfig = { jumlahMahasiswa: { label: 'Mahasiswa', color: 'var(--chart-1)' } }
        const cfgUser: ChartConfig = { jumlahPengguna: { label: 'Pengguna', color: 'var(--chart-2)' } }

        return (
            <div className="w-full space-y-4">
                {role && !role.Name.match('Mahasiswa') ? periodeFilterNode : null}
                <div className="grid grid-cols-3 gap-4">
                    <StatCard label="Total Mahasiswa" value={totalMhs} icon={Users} color="blue" />
                    <StatCard label="Total Pengguna" value={totalUser} icon={UserCheck} color="green" />
                    <StatCard label="Total Prodi" value={totalProdi} icon={GraduationCap} color="violet" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className={G}>
                        <CardHeader>
                            <CardTitle>Mahasiswa per Program Studi</CardTitle>
                            <CardDescription>Distribusi mahasiswa RPL di setiap program studi</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {prodi.length > 0 ? (
                                <ChartContainer config={cfgProdi}>
                                    <BarChart data={prodi} margin={{ top: 16 }}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="programStudi" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => getInitials(v)} />
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                        <Bar dataKey="jumlahMahasiswa" fill="var(--chart-1)" radius={6}>
                                            <LabelList position="top" offset={8} className="fill-foreground" fontSize={11} />
                                        </Bar>
                                    </BarChart>
                                </ChartContainer>
                            ) : <EmptyChart />}
                        </CardContent>
                    </Card>

                    <Card className={G}>
                        <CardHeader>
                            <CardTitle>Pengguna per Role</CardTitle>
                            <CardDescription>Jumlah akun yang terdaftar di setiap peran sistem</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {userList.length > 0 ? (
                                <ChartContainer config={cfgUser}>
                                    <BarChart data={userList} margin={{ top: 16 }}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="role" tickLine={false} axisLine={false} tickMargin={8} />
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                        <Bar dataKey="jumlahPengguna" fill="var(--chart-2)" radius={6}>
                                            <LabelList position="top" offset={8} className="fill-foreground" fontSize={11} />
                                        </Bar>
                                    </BarChart>
                                </ChartContainer>
                            ) : <EmptyChart />}
                        </CardContent>
                    </Card>
                </div>

                {/* Row 2 — Komposisi */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DonutCard
                        title="Distribusi Mahasiswa per Prodi"
                        description="Proporsi mahasiswa RPL di setiap program studi"
                        data={prodi}
                        config={{ jumlahMahasiswa: { label: 'Mahasiswa' } }}
                        dataKey="jumlahMahasiswa"
                        nameKey="programStudi"
                        centerLabel="Mahasiswa"
                    />

                    <DonutCard
                        title="Komposisi Pengguna per Role"
                        description="Proporsi akun terdaftar berdasarkan peran sistem"
                        data={userList}
                        config={{ jumlahPengguna: { label: 'Pengguna' } }}
                        dataKey="jumlahPengguna"
                        nameKey="role"
                        centerLabel="Pengguna"
                    />
                </div>
                {multiPeriodeNode}
            </div>
        )
    }

    // ── PMB ──────────────────────────────────────────────────────────────────
    if (role.Name.match('PMB')) {
        const prodi = dataPmb?.data[0]?.hasilPerProdi ?? []
        const statusList = dataPmb?.data[1]?.countPerStatusLengkap ?? []
        const mkList = dataPmb?.data[2]?.hasilMK ?? []
        const cpList = dataPmb?.data[3]?.hasilCP ?? []

        const totalMhs = prodi.reduce((s: number, x: any) => s + (x.jumlahMahasiswa ?? 0), 0)
        const totalMK = mkList.reduce((s: number, x: any) => s + (x.jumlahMataKuliah ?? 0), 0)
        const totalCP = cpList.reduce((s: number, x: any) => s + (x.jumlahCapaianPembelajaran ?? 0), 0)

        const cfgProdi: ChartConfig = { jumlahMahasiswa: { label: 'Mahasiswa', color: 'var(--chart-1)' } }
        const cfgStatus: ChartConfig = { jumlah: { label: 'Jumlah', color: 'var(--chart-2)' } }
        const cfgMK: ChartConfig = { jumlahMataKuliah: { label: 'Mata Kuliah', color: 'var(--chart-3)' } }
        const cfgCP: ChartConfig = { jumlahCapaianPembelajaran: { label: 'Capaian Pembelajaran', color: 'var(--chart-4)' } }

        // Aggregasi turunan
        const mkVsCp = mergeByKey(mkList, 'jumlahMataKuliah', 'Mata Kuliah', cpList, 'jumlahCapaianPembelajaran', 'Capaian Pembelajaran')
        const cfgMkVsCp: ChartConfig = {
            'Mata Kuliah': { label: 'Mata Kuliah', color: 'var(--chart-3)' },
            'Capaian Pembelajaran': { label: 'Capaian Pembelajaran', color: 'var(--chart-4)' },
        }

        return (
            <div className="w-full space-y-4">
                {role && !role.Name.match('Mahasiswa') ? periodeFilterNode : null}
                <div className="grid grid-cols-3 gap-4">
                    <StatCard label="Total Mahasiswa" value={totalMhs} icon={Users} color="blue" />
                    <StatCard label="Total Mata Kuliah" value={totalMK} icon={BookOpen} color="green" />
                    <StatCard label="Total Capaian Pembelajaran" value={totalCP} icon={GraduationCap} color="violet" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className={G}>
                        <CardHeader>
                            <CardTitle>Mahasiswa per Program Studi</CardTitle>
                            <CardDescription>Distribusi mahasiswa RPL di setiap program studi</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {prodi.length > 0 ? (
                                <ChartContainer config={cfgProdi}>
                                    <BarChart data={prodi} margin={{ top: 16 }}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="programStudi" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => getInitials(v)} />
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                        <Bar dataKey="jumlahMahasiswa" fill="var(--chart-1)" radius={6}>
                                            <LabelList position="top" offset={8} className="fill-foreground" fontSize={11} />
                                        </Bar>
                                    </BarChart>
                                </ChartContainer>
                            ) : <EmptyChart />}
                        </CardContent>
                    </Card>

                    <Card className={G}>
                        <CardHeader>
                            <CardTitle>Mahasiswa per Status Kelengkapan</CardTitle>
                            <CardDescription>Distribusi berdasarkan kelengkapan pengisian berkas</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {statusList.length > 0 ? (
                                <ChartContainer config={cfgStatus}>
                                    <BarChart data={statusList} margin={{ top: 16 }}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="status" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => getInitials(v)} />
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                        <Bar dataKey="jumlah" fill="var(--chart-2)" radius={6}>
                                            <LabelList position="top" offset={8} className="fill-foreground" fontSize={11} />
                                        </Bar>
                                    </BarChart>
                                </ChartContainer>
                            ) : <EmptyChart />}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className={G}>
                        <CardHeader>
                            <CardTitle>Mata Kuliah per Program Studi</CardTitle>
                            <CardDescription>Jumlah mata kuliah RPL yang tersedia di setiap prodi</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {mkList.length > 0 ? (
                                <ChartContainer config={cfgMK}>
                                    <BarChart data={mkList} margin={{ top: 16 }}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="programStudi" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => getInitials(v)} />
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                        <Bar dataKey="jumlahMataKuliah" fill="var(--chart-3)" radius={6}>
                                            <LabelList position="top" offset={8} className="fill-foreground" fontSize={11} />
                                        </Bar>
                                    </BarChart>
                                </ChartContainer>
                            ) : <EmptyChart />}
                        </CardContent>
                    </Card>

                    <Card className={G}>
                        <CardHeader>
                            <CardTitle>Capaian Pembelajaran per Prodi</CardTitle>
                            <CardDescription>Jumlah capaian pembelajaran yang ditetapkan per program studi</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {cpList.length > 0 ? (
                                <ChartContainer config={cfgCP}>
                                    <BarChart data={cpList} margin={{ top: 16 }}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="programStudi" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => getInitials(v)} />
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                        <Bar dataKey="jumlahCapaianPembelajaran" fill="var(--chart-4)" radius={6}>
                                            <LabelList position="top" offset={8} className="fill-foreground" fontSize={11} />
                                        </Bar>
                                    </BarChart>
                                </ChartContainer>
                            ) : <EmptyChart />}
                        </CardContent>
                    </Card>
                </div>

                {/* Row 3 — Komparasi & komposisi */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className={G}>
                        <CardHeader>
                            <CardTitle>Mata Kuliah vs Capaian Pembelajaran</CardTitle>
                            <CardDescription>Perbandingan jumlah mata kuliah dan capaian pembelajaran per prodi</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {mkVsCp.length > 0 ? (
                                <ChartContainer config={cfgMkVsCp}>
                                    <BarChart data={mkVsCp} margin={{ top: 16 }}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="programStudi" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => getInitials(v)} />
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                        <ChartLegend content={<ChartLegendContent />} />
                                        <Bar dataKey="Mata Kuliah" fill="var(--chart-3)" radius={4} />
                                        <Bar dataKey="Capaian Pembelajaran" fill="var(--chart-4)" radius={4} />
                                    </BarChart>
                                </ChartContainer>
                            ) : <EmptyChart />}
                        </CardContent>
                    </Card>

                    <DonutCard
                        title="Distribusi Mahasiswa per Prodi"
                        description="Proporsi mahasiswa RPL di setiap program studi"
                        data={prodi}
                        config={{ jumlahMahasiswa: { label: 'Mahasiswa' } }}
                        dataKey="jumlahMahasiswa"
                        nameKey="programStudi"
                        centerLabel="Mahasiswa"
                    />
                </div>
                {multiPeriodeNode}
            </div>
        )
    }

    // ── AKADEMIK ─────────────────────────────────────────────────────────────
    if (role.Name.match('Akademik')) {
        const asesorPie = (dataAkademik?.data[0] ?? []) as { name: string; total: number }[]
        const mhsPie = (dataAkademik?.data[1] ?? []) as { name: string; total: number }[]

        const asesorSK = asesorPie.find((x) => x.name === 'Asesor Sudah SK')?.total ?? 0
        const asesorBelum = asesorPie.find((x) => x.name === 'Asesor Belum SK')?.total ?? 0
        const mhsSK = mhsPie.find((x) => x.name === 'Mahasiswa Sudah SK')?.total ?? 0
        const mhsBelum = mhsPie.find((x) => x.name === 'Mahasiswa Belum SK')?.total ?? 0

        const cfgAsesorPie: ChartConfig = {
            total: { label: 'Jumlah' },
            'Asesor Sudah SK': { label: 'Sudah SK', color: 'var(--chart-1)' },
            'Asesor Belum SK': { label: 'Belum SK', color: 'var(--chart-2)' },
        }
        const cfgMhsPie: ChartConfig = {
            total: { label: 'Jumlah' },
            'Mahasiswa Sudah SK': { label: 'Sudah SK', color: 'var(--chart-1)' },
            'Mahasiswa Belum SK': { label: 'Belum SK', color: 'var(--chart-2)' },
        }

        // Aggregasi turunan
        const skSummary = [
            { status: 'Sudah SK', Asesor: asesorSK, Mahasiswa: mhsSK },
            { status: 'Belum SK', Asesor: asesorBelum, Mahasiswa: mhsBelum },
        ]
        const skTotalDonut = [
            { name: 'Total Sudah SK', total: asesorSK + mhsSK },
            { name: 'Total Belum SK', total: asesorBelum + mhsBelum },
        ]
        const cfgSkSummary: ChartConfig = {
            Asesor: { label: 'Asesor', color: 'var(--chart-1)' },
            Mahasiswa: { label: 'Mahasiswa', color: 'var(--chart-4)' },
        }
        const cfgSkTotalDonut: ChartConfig = {
            total: { label: 'Jumlah' },
            'Total Sudah SK': { label: 'Sudah SK', color: 'var(--chart-1)' },
            'Total Belum SK': { label: 'Belum SK', color: 'var(--chart-2)' },
        }

        return (
            <div className="w-full space-y-4">
                {role && !role.Name.match('Mahasiswa') ? periodeFilterNode : null}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard label="Asesor Sudah SK" value={asesorSK} icon={CheckCircle2} color="green" />
                    <StatCard label="Asesor Belum SK" value={asesorBelum} icon={ClipboardList} color="rose" />
                    <StatCard label="Mahasiswa Sudah SK" value={mhsSK} icon={GraduationCap} color="blue" />
                    <StatCard label="Mahasiswa Belum SK" value={mhsBelum} icon={Users} color="orange" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className={`${G} flex flex-col`}>
                        <CardHeader className="items-center">
                            <CardTitle>Status SK Asesor</CardTitle>
                            <CardDescription>Proporsi asesor yang sudah dan belum menerima SK penugasan</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            {asesorPie.length > 0 ? (
                                <ChartContainer config={cfgAsesorPie} className="mx-auto aspect-square max-h-[240px]">
                                    <PieChart>
                                        <ChartTooltip content={<ChartTooltipContent hideLabel={false} />} />
                                        <Pie data={asesorPie} dataKey="total" nameKey="name" outerRadius={90} label={({ name, percent }) => `${getInitials(name)} ${(percent * 100).toFixed(0)}%`}>
                                            {asesorPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                                        </Pie>
                                        <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                                    </PieChart>
                                </ChartContainer>
                            ) : <EmptyChart />}
                        </CardContent>
                    </Card>

                    <Card className={`${G} flex flex-col`}>
                        <CardHeader className="items-center">
                            <CardTitle>Status SK Mahasiswa</CardTitle>
                            <CardDescription>Proporsi mahasiswa yang sudah dan belum menerima SK hasil asesmen</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            {mhsPie.length > 0 ? (
                                <ChartContainer config={cfgMhsPie} className="mx-auto aspect-square max-h-[240px]">
                                    <PieChart>
                                        <ChartTooltip content={<ChartTooltipContent hideLabel={false} />} />
                                        <Pie data={mhsPie} dataKey="total" nameKey="name" outerRadius={90} label={({ name, percent }) => `${getInitials(name)} ${(percent * 100).toFixed(0)}%`}>
                                            {mhsPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                                        </Pie>
                                        <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                                    </PieChart>
                                </ChartContainer>
                            ) : <EmptyChart />}
                        </CardContent>
                    </Card>
                </div>

                {/* Row 2 — Ringkasan agregat */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className={G}>
                        <CardHeader>
                            <CardTitle>Ringkasan Status SK</CardTitle>
                            <CardDescription>Perbandingan capaian SK antara asesor dan mahasiswa</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={cfgSkSummary}>
                                <BarChart data={skSummary} margin={{ top: 16 }}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="status" tickLine={false} axisLine={false} tickMargin={8} />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                    <ChartLegend content={<ChartLegendContent />} />
                                    <Bar dataKey="Asesor" fill="var(--chart-1)" radius={4} />
                                    <Bar dataKey="Mahasiswa" fill="var(--chart-4)" radius={4} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    <DonutCard
                        title="Total Capaian SK"
                        description="Gabungan asesor dan mahasiswa berdasarkan status SK"
                        data={skTotalDonut}
                        config={cfgSkTotalDonut}
                        dataKey="total"
                        nameKey="name"
                        centerLabel="Total"
                    />
                </div>
                {multiPeriodeNode}
            </div>
        )
    }

    return null
}

export default Dashboard

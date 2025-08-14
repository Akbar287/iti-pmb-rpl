'use client'
import {
    getChartAkademikRole,
    getChartAsesorRole,
    getChartKaprodiRole,
    getChartMahasiswaRole,
    getChartPmbRole,
} from '@/services/ChartServices'
import {
    ChartAkademikData,
    ChartDataItemPmb,
    ChartKaprodiData,
    ChartMahasiswaData,
    ChartResponseAsesor,
} from '@/types/ChartTypes'
import { Session } from 'next-auth'
import React from 'react'
import { Skeleton } from '../ui/skeleton'
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    Line,
    LineChart,
    Pie,
    PieChart,
    XAxis,
} from 'recharts'
import { Timeline } from '../Timeline'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
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
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table'
import { Badge } from '../ui/badge'
import { getInitials } from '@/lib/utils'

const Dashboard = ({ session }: { session: Session | null }) => {
    const [role, setRole] = React.useState<{
        GuardName: string
        Icon: string
        Name: string
        RoleId: string
    } | null>(null)
    const [loading, setLoading] = React.useState(false)
    const [dataMhs, setDataMhs] = React.useState<ChartMahasiswaData | null>(
        null
    )
    const [dataKaprodi, setDataKaprodi] =
        React.useState<ChartKaprodiData | null>(null)
    const [dataAkademik, setDataAkademik] =
        React.useState<ChartAkademikData | null>(null)
    const [dataAsesor, setDataAsesor] =
        React.useState<ChartResponseAsesor | null>(null)
    const [dataPmb, setDataPmb] = React.useState<ChartDataItemPmb | null>(null)
    React.useEffect(() => {
        setLoading(true)
        let roleState: {
            GuardName: string
            Icon: string
            Name: string
            RoleId: string
        } | null = role !== null ? role : null
        if (!role) {
            const rolelogin = localStorage.getItem('pmb.iti.role')
            if (rolelogin) {
                let temp = JSON.parse(rolelogin)
                setRole(temp)
                roleState = temp
            }
        }

        if (roleState?.Name.match('Rektor')) {
        } else if (roleState?.Name.match('Kaprodi')) {
            setLoading(true)
            getChartKaprodiRole(roleState.RoleId)
                .then((res) => {
                    setDataKaprodi(res)
                })
                .catch((err) => {})
                .finally(() => setLoading(false))
        } else if (roleState?.Name.match('Asesor')) {
            getChartAsesorRole(roleState.RoleId)
                .then((res) => setDataAsesor(res))
                .catch((err) => {})
                .finally(() => setLoading(false))
        } else if (roleState?.Name.match('Mahasiswa')) {
            getChartMahasiswaRole(roleState.RoleId)
                .then((res) => setDataMhs(res))
                .catch((err) => {})
                .finally(() => setLoading(false))
        } else if (roleState?.Name.match('Admin')) {
        } else if (roleState?.Name.match('PMB')) {
            setLoading(true)
            getChartPmbRole(roleState.RoleId)
                .then((res) => setDataPmb(res))
                .catch((err) => {})
                .finally(() => setLoading(false))
        } else if (roleState?.Name.match('Akademik')) {
            setLoading(true)
            getChartAkademikRole(roleState.RoleId)
                .then((res) => setDataAkademik(res))
                .catch((err) => {})
                .finally(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [])

    if (role !== null && !loading) {
        if (role.Name.match('Rektor')) {
        } else if (role.Name.match('Kaprodi')) {
            const chartConfigKaprodi1 = {
                'Asesor Akademik': {
                    label: 'Asesor Akademik',
                    color: 'var(--chart-1)',
                },
                'Asesor Praktisi': {
                    label: 'Asesor Praktisi',
                    color: 'var(--chart-2)',
                },
            } satisfies ChartConfig

            const chartConfigChart2 = {
                count: {
                    label: 'Jumlah',
                },
                'Asesor Akademik': {
                    label: 'Asesor Akademik',
                    color: 'var(--chart-1)',
                },
                'Asesor Praktisi': {
                    label: 'Asesor Praktisi',
                    color: 'var(--chart-2)',
                },
            } satisfies ChartConfig

            const chartConfigKaprodi3 = {
                count: {
                    label: 'Jumlah',
                    color: 'var(--chart-1)',
                },
            } satisfies ChartConfig

            return (
                <div className="w-full flex flex-col gap-3">
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-3">
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle>Jumlah Asesor</CardTitle>
                                <CardDescription>
                                    Menunjukan Total Asesor per Program Studi.
                                    Ini adalah jumlah program studi yang
                                    memiliki asesor akademik dan asesor
                                    praktisi. satu orang bisa melakukan asesmen
                                    di beberapa program studi.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {dataKaprodi && dataKaprodi.data.length > 0 ? (
                                    <ChartContainer
                                        config={chartConfigKaprodi1}
                                    >
                                        <BarChart
                                            accessibilityLayer
                                            data={dataKaprodi.data[0].chart_1}
                                            margin={{
                                                top: 20,
                                            }}
                                        >
                                            <CartesianGrid vertical={false} />
                                            <XAxis
                                                dataKey="date"
                                                tickLine={false}
                                                tickMargin={10}
                                                axisLine={false}
                                                tickFormatter={(value) =>
                                                    getInitials(value)
                                                }
                                            />
                                            <ChartTooltip
                                                cursor={false}
                                                content={
                                                    <ChartTooltipContent
                                                        hideLabel={false}
                                                    />
                                                }
                                            />
                                            <Bar
                                                dataKey="Asesor Akademik"
                                                fill="var(--chart-1)"
                                                radius={4}
                                            />
                                            <Bar
                                                dataKey="Asesor Praktisi"
                                                fill="var(--chart-2)"
                                                radius={4}
                                            />
                                        </BarChart>
                                    </ChartContainer>
                                ) : (
                                    <div className="w-full justify-center"></div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <div className="flex w-full items-start gap-2 text-sm">
                                    <div className="grid gap-2">
                                        <div className="flex items-center gap-2 leading-none font-medium">
                                            Trending up by 5.2% this month
                                        </div>
                                        <div className="text-muted-foreground flex items-center gap-2 leading-none">
                                            January - June 2024
                                        </div>
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-3">
                        <Card className="flex flex-col">
                            <CardHeader className="items-center pb-0">
                                <CardTitle>Total Asesor</CardTitle>
                                <CardDescription>
                                    Berdasarkan Jenis Asesor Akademik dan Asesor
                                    Praktisi
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 pb-0">
                                {dataKaprodi && dataKaprodi.data.length > 0 ? (
                                    <ChartContainer
                                        config={chartConfigChart2}
                                        className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0"
                                    >
                                        <PieChart>
                                            <ChartTooltip
                                                content={
                                                    <ChartTooltipContent
                                                        hideLabel={false}
                                                    />
                                                }
                                            />
                                            <Pie
                                                data={
                                                    dataKaprodi.data[1].chart_2
                                                }
                                                dataKey="count"
                                                label
                                                nameKey="tipe"
                                            />
                                        </PieChart>
                                    </ChartContainer>
                                ) : (
                                    <div className="w-full">Tidak Ada data</div>
                                )}
                            </CardContent>
                            <CardFooter className="flex-col gap-2 text-sm">
                                <div className="flex items-center gap-2 leading-none font-medium">
                                    Trending up by 5.2% this month
                                </div>
                                <div className="text-muted-foreground leading-none">
                                    Showing total visitors for the last 6 months
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-3">
                        <Card>
                            <CardHeader>
                                <CardTitle>Total Mahasiswa Intake</CardTitle>
                                <CardDescription>
                                    Total Mahasiswa Intake per Program Studi
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {dataKaprodi && dataKaprodi.data.length > 0 ? (
                                    <ChartContainer
                                        config={chartConfigKaprodi3}
                                    >
                                        <BarChart
                                            accessibilityLayer
                                            data={dataKaprodi.data[2].chart_3}
                                            margin={{
                                                top: 20,
                                            }}
                                        >
                                            <CartesianGrid vertical={false} />
                                            <XAxis
                                                dataKey="program_studi"
                                                tickLine={false}
                                                tickMargin={10}
                                                axisLine={false}
                                                tickFormatter={(value) =>
                                                    getInitials(value)
                                                }
                                            />
                                            <ChartTooltip
                                                cursor={false}
                                                content={
                                                    <ChartTooltipContent
                                                        hideLabel={false}
                                                    />
                                                }
                                            />
                                            <Bar
                                                dataKey="count"
                                                fill="var(--chart1)"
                                                radius={8}
                                            >
                                                <LabelList
                                                    position="top"
                                                    offset={12}
                                                    className="fill-foreground"
                                                    fontSize={12}
                                                />
                                            </Bar>
                                        </BarChart>
                                    </ChartContainer>
                                ) : (
                                    <div className="w-full">Tidak ada data</div>
                                )}
                            </CardContent>
                            <CardFooter className="flex-col items-start gap-2 text-sm">
                                <div className="flex gap-2 leading-none font-medium">
                                    Trending up by 5.2% this month
                                </div>
                                <div className="text-muted-foreground leading-none">
                                    Showing total visitors for the last 6 months
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-3">
                        <Card>
                            <CardHeader>
                                <CardTitle>Total Mata Kuliah</CardTitle>
                                <CardDescription>
                                    Total Mata Kuliah per Program Studi
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {dataKaprodi && dataKaprodi.data.length > 0 ? (
                                    <ChartContainer
                                        config={chartConfigKaprodi3}
                                    >
                                        <BarChart
                                            accessibilityLayer
                                            data={dataKaprodi.data[3].chart_4}
                                            margin={{
                                                top: 20,
                                            }}
                                        >
                                            <CartesianGrid vertical={false} />
                                            <XAxis
                                                dataKey="program_studi"
                                                tickLine={false}
                                                tickMargin={10}
                                                axisLine={false}
                                                tickFormatter={(value) =>
                                                    getInitials(value)
                                                }
                                            />
                                            <ChartTooltip
                                                cursor={false}
                                                content={
                                                    <ChartTooltipContent
                                                        hideLabel={false}
                                                    />
                                                }
                                            />
                                            <Bar
                                                dataKey="count"
                                                fill="var(--chart1)"
                                                radius={8}
                                            >
                                                <LabelList
                                                    position="top"
                                                    offset={12}
                                                    className="fill-foreground"
                                                    fontSize={12}
                                                />
                                            </Bar>
                                        </BarChart>
                                    </ChartContainer>
                                ) : (
                                    <div className="w-full">Tidak ada data</div>
                                )}
                            </CardContent>
                            <CardFooter className="flex-col items-start gap-2 text-sm">
                                <div className="flex gap-2 leading-none font-medium">
                                    Trending up by 5.2% this month
                                </div>
                                <div className="text-muted-foreground leading-none">
                                    Showing total visitors for the last 6 months
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            )
        } else if (role.Name.match('Asesor')) {
            const chartConfigAsesor = {
                belumAsses: {
                    label: 'Belum Asses',
                    color: 'var(--chart-1)',
                },
                sudahAsses: {
                    label: 'Sudah Asses',
                    color: 'var(--chart-2)',
                },
            } satisfies ChartConfig
            const chartConfigAsesor2 = {
                Status: {
                    label: 'Status',
                    color: 'var(--chart-1)',
                },
            } satisfies ChartConfig
            return (
                <div className="w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-1 mb-3">
                        <Card>
                            <CardHeader>
                                <CardTitle>Assemen Mahasiswa</CardTitle>
                                <CardDescription>
                                    Perbandingan Jumlah Mahasiswa Sudah dan
                                    Belum Asess
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {dataAsesor &&
                                dataAsesor.data.chart1.length > 0 ? (
                                    <ChartContainer config={chartConfigAsesor}>
                                        <LineChart
                                            accessibilityLayer
                                            data={dataAsesor.data.chart1}
                                            margin={{
                                                left: 12,
                                                right: 12,
                                            }}
                                        >
                                            <CartesianGrid vertical={false} />
                                            <XAxis
                                                dataKey="programStudi"
                                                tickLine={false}
                                                axisLine={false}
                                                tickMargin={8}
                                                tickFormatter={(value) =>
                                                    getInitials(value)
                                                }
                                            />
                                            <ChartTooltip
                                                cursor={false}
                                                content={
                                                    <ChartTooltipContent />
                                                }
                                            />
                                            <Line
                                                dataKey="belumAsses"
                                                type="monotone"
                                                stroke="var(--chart-1)"
                                                strokeWidth={2}
                                                dot={false}
                                            >
                                                <LabelList
                                                    position="top"
                                                    offset={12}
                                                    className="fill-foreground"
                                                    fontSize={12}
                                                />
                                            </Line>
                                            <Line
                                                dataKey="sudahAsses"
                                                type="monotone"
                                                stroke="var(--chart-2)"
                                                strokeWidth={2}
                                                dot={false}
                                            >
                                                <LabelList
                                                    position="top"
                                                    offset={12}
                                                    className="fill-foreground"
                                                    fontSize={12}
                                                />
                                            </Line>
                                        </LineChart>
                                    </ChartContainer>
                                ) : (
                                    <div className="w-full justify-center">
                                        <h1>Tidak ada Data</h1>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <div className="flex w-full items-start gap-2 text-sm">
                                    <div className="grid gap-2">
                                        <div className="flex items-center gap-2 leading-none font-medium">
                                            Trending up by 5.2% this month{' '}
                                            {/* <TrendingUp className="h-4 w-4" /> */}
                                        </div>
                                        <div className="text-muted-foreground flex items-center gap-2 leading-none">
                                            Showing total visitors for the last
                                            6 months
                                        </div>
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-1 mb-3">
                        <Card>
                            <CardHeader>
                                <CardTitle>Status Asessmen Mahasiswa</CardTitle>
                                <CardDescription>
                                    Perbandingan Jumlah Mahasiswa Berdasarkan
                                    Status
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {dataAsesor &&
                                dataAsesor.data.chart2.length > 0 ? (
                                    <ChartContainer config={chartConfigAsesor2}>
                                        <LineChart
                                            accessibilityLayer
                                            data={dataAsesor.data.chart2}
                                            margin={{
                                                left: 12,
                                                right: 12,
                                            }}
                                        >
                                            <CartesianGrid vertical={false} />
                                            <XAxis
                                                dataKey="Status"
                                                tickLine={false}
                                                axisLine={false}
                                                tickMargin={8}
                                                tickFormatter={(value) =>
                                                    getInitials(value)
                                                }
                                            />
                                            <ChartTooltip
                                                cursor={false}
                                                content={
                                                    <ChartTooltipContent />
                                                }
                                            />
                                            <Line
                                                dataKey="Jumlah"
                                                type="monotone"
                                                stroke="var(--color-desktop)"
                                                strokeWidth={2}
                                                dot={false}
                                            >
                                                <LabelList
                                                    position="top"
                                                    offset={12}
                                                    className="fill-foreground"
                                                    fontSize={12}
                                                />
                                            </Line>
                                        </LineChart>
                                    </ChartContainer>
                                ) : (
                                    <div className="w-full justify-center">
                                        <h1>Tidak ada Data</h1>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <div className="flex w-full items-start gap-2 text-sm">
                                    <div className="grid gap-2">
                                        <div className="flex items-center gap-2 leading-none font-medium">
                                            Trending up by 5.2% this month{' '}
                                            {/* <TrendingUp className="h-4 w-4" /> */}
                                        </div>
                                        <div className="text-muted-foreground flex items-center gap-2 leading-none">
                                            Showing total visitors for the last
                                            6 months
                                        </div>
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            )
        } else if (role.Name.match('Mahasiswa')) {
            return (
                <div className="w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-1 mb-3">
                        {dataMhs ? (
                            dataMhs.data[3].chart4.map((item, index) => (
                                <div key={index} className="container mx-auto">
                                    <Timeline
                                        data={item}
                                        className=" mx-auto"
                                    />
                                </div>
                            ))
                        ) : (
                            <Skeleton className="h-32 w-full" />
                        )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 mb-3">
                        <div className="w-full">
                            {dataMhs &&
                                (dataMhs.data[0].chart1.length > 0 ? (
                                    dataMhs.data[0].chart1.map((item, idx) => (
                                        <React.Fragment key={idx}>
                                            <h1 className="text-2xl font-bold mb-4">
                                                Informasi Kode Pendaftaran
                                            </h1>
                                            <p className="mb-4">
                                                Kode: {item.KodePendaftar}{' '}
                                                <br />
                                                Jurusan: {item.ProgramStudi}
                                            </p>
                                            <Table>
                                                <TableCaption>
                                                    Informasi Kelengkapan
                                                </TableCaption>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            Nama
                                                        </TableHead>
                                                        <TableHead>
                                                            Pengisian
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {dataMhs && (
                                                        <React.Fragment>
                                                            <TableRow>
                                                                <TableCell>
                                                                    Pesantren
                                                                </TableCell>
                                                                <TableCell>
                                                                    {item.Pesantren >
                                                                    0 ? (
                                                                        <Badge
                                                                            variant={
                                                                                'secondary'
                                                                            }
                                                                        >
                                                                            Ada
                                                                        </Badge>
                                                                    ) : (
                                                                        <Badge
                                                                            variant={
                                                                                'destructive'
                                                                            }
                                                                        >
                                                                            Tidak
                                                                            Ada
                                                                        </Badge>
                                                                    )}
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>
                                                                    Institusi
                                                                    Lama
                                                                </TableCell>
                                                                <TableCell>
                                                                    {item.InstitusiLama >
                                                                    0 ? (
                                                                        <Badge
                                                                            variant={
                                                                                'secondary'
                                                                            }
                                                                        >
                                                                            Sudah
                                                                            Diisi
                                                                        </Badge>
                                                                    ) : (
                                                                        <Badge
                                                                            variant={
                                                                                'destructive'
                                                                            }
                                                                        >
                                                                            Tidak
                                                                            Ada
                                                                        </Badge>
                                                                    )}
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>
                                                                    Pekerjaan
                                                                    Mahasiswa
                                                                </TableCell>
                                                                <TableCell>
                                                                    {item.PekerjaanMahasiswa >
                                                                    0 ? (
                                                                        <Badge
                                                                            variant={
                                                                                'secondary'
                                                                            }
                                                                        >
                                                                            Ada
                                                                        </Badge>
                                                                    ) : (
                                                                        <Badge
                                                                            variant={
                                                                                'destructive'
                                                                            }
                                                                        >
                                                                            Tidak
                                                                            Ada
                                                                        </Badge>
                                                                    )}
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>
                                                                    Informasi
                                                                    Kependudukan
                                                                </TableCell>
                                                                <TableCell>
                                                                    {item.InformasiKependudukan >
                                                                    0 ? (
                                                                        <Badge
                                                                            variant={
                                                                                'secondary'
                                                                            }
                                                                        >
                                                                            Ada
                                                                        </Badge>
                                                                    ) : (
                                                                        <Badge
                                                                            variant={
                                                                                'destructive'
                                                                            }
                                                                        >
                                                                            Tidak
                                                                            Ada
                                                                        </Badge>
                                                                    )}
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>
                                                                    Orang Tua
                                                                </TableCell>
                                                                <TableCell>
                                                                    {item.OrangTua >
                                                                    0 ? (
                                                                        <Badge
                                                                            variant={
                                                                                'secondary'
                                                                            }
                                                                        >
                                                                            Ada
                                                                        </Badge>
                                                                    ) : (
                                                                        <Badge
                                                                            variant={
                                                                                'destructive'
                                                                            }
                                                                        >
                                                                            Tidak
                                                                            Ada
                                                                        </Badge>
                                                                    )}
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>
                                                                    Mahasiswa
                                                                    Riwayat
                                                                    Pekerjaan
                                                                </TableCell>
                                                                <TableCell>
                                                                    {item.MahasiswaRiwayatPekerjaan >
                                                                    0 ? (
                                                                        <Badge
                                                                            variant={
                                                                                'secondary'
                                                                            }
                                                                        >
                                                                            Ada
                                                                        </Badge>
                                                                    ) : (
                                                                        <Badge
                                                                            variant={
                                                                                'destructive'
                                                                            }
                                                                        >
                                                                            Tidak
                                                                            Ada
                                                                        </Badge>
                                                                    )}
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>
                                                                    Mahasiswa
                                                                    Pendidikan
                                                                </TableCell>
                                                                <TableCell>
                                                                    {item.MahasiswaPendidikan >
                                                                    0 ? (
                                                                        <Badge
                                                                            variant={
                                                                                'secondary'
                                                                            }
                                                                        >
                                                                            Ada
                                                                        </Badge>
                                                                    ) : (
                                                                        <Badge
                                                                            variant={
                                                                                'destructive'
                                                                            }
                                                                        >
                                                                            Tidak
                                                                            Ada
                                                                        </Badge>
                                                                    )}
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>
                                                                    Mahasiswa
                                                                    Organisasi
                                                                    Profesi
                                                                </TableCell>
                                                                <TableCell>
                                                                    {item.MahasiswaOrganisasiProfesi >
                                                                    0 ? (
                                                                        <Badge
                                                                            variant={
                                                                                'secondary'
                                                                            }
                                                                        >
                                                                            Ada
                                                                        </Badge>
                                                                    ) : (
                                                                        <Badge
                                                                            variant={
                                                                                'destructive'
                                                                            }
                                                                        >
                                                                            Tidak
                                                                            Ada
                                                                        </Badge>
                                                                    )}
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>
                                                                    Mahasiswa
                                                                    Piagam
                                                                </TableCell>
                                                                <TableCell>
                                                                    {item.MahasiswaPiagam >
                                                                    0 ? (
                                                                        <Badge
                                                                            variant={
                                                                                'secondary'
                                                                            }
                                                                        >
                                                                            Ada
                                                                        </Badge>
                                                                    ) : (
                                                                        <Badge
                                                                            variant={
                                                                                'destructive'
                                                                            }
                                                                        >
                                                                            Tidak
                                                                            Ada
                                                                        </Badge>
                                                                    )}
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>
                                                                    Mahasiswa
                                                                    Konferensi
                                                                </TableCell>
                                                                <TableCell>
                                                                    {item.MahasiswaKonferensi >
                                                                    0 ? (
                                                                        <Badge
                                                                            variant={
                                                                                'secondary'
                                                                            }
                                                                        >
                                                                            Ada
                                                                        </Badge>
                                                                    ) : (
                                                                        <Badge
                                                                            variant={
                                                                                'destructive'
                                                                            }
                                                                        >
                                                                            Tidak
                                                                            Ada
                                                                        </Badge>
                                                                    )}
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>
                                                                    Mahasiswa
                                                                    Pelatihan
                                                                    Professional
                                                                </TableCell>
                                                                <TableCell>
                                                                    {item.MahasiswaPelatihanProfessional >
                                                                    0 ? (
                                                                        <Badge
                                                                            variant={
                                                                                'secondary'
                                                                            }
                                                                        >
                                                                            Ada
                                                                        </Badge>
                                                                    ) : (
                                                                        <Badge
                                                                            variant={
                                                                                'destructive'
                                                                            }
                                                                        >
                                                                            Tidak
                                                                            Ada
                                                                        </Badge>
                                                                    )}
                                                                </TableCell>
                                                            </TableRow>
                                                        </React.Fragment>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <h1>Tidak Ada Data</h1>
                                ))}
                        </div>
                        <div className="w-full">
                            {dataMhs &&
                                (dataMhs.data[1].chart2.length > 0 ? (
                                    dataMhs.data[1].chart2.map((item, idx) => (
                                        <React.Fragment key={idx}>
                                            <h1 className="text-2xl font-bold mb-4">
                                                Informasi Upload Dokumen
                                            </h1>
                                            <p className="mb-4">
                                                Kode: {item.KodePendaftar}{' '}
                                            </p>
                                            <Table>
                                                <TableCaption>
                                                    Informasi Dokumen
                                                </TableCaption>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            Nama Dokumen
                                                        </TableHead>
                                                        <TableHead>
                                                            Pengisian
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {item.BuktiForm.map(
                                                        (item, idx) => (
                                                            <TableRow key={idx}>
                                                                <TableCell>
                                                                    {
                                                                        item.JenisDokumen
                                                                    }
                                                                </TableCell>
                                                                <TableCell>
                                                                    {item.Upload >
                                                                    0 ? (
                                                                        <Badge
                                                                            variant={
                                                                                'secondary'
                                                                            }
                                                                        >
                                                                            Selesai
                                                                        </Badge>
                                                                    ) : (
                                                                        <Badge
                                                                            variant={
                                                                                'destructive'
                                                                            }
                                                                        >
                                                                            Tidak
                                                                        </Badge>
                                                                    )}
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <h1>Tidak Ada Data</h1>
                                ))}
                        </div>
                    </div>
                </div>
            )
        } else if (role.Name.match('Admin')) {
        } else if (role.Name.match('PMB')) {
            const chartConfigPmb1 = {
                jumlahMahasiswa: {
                    label: 'Jumlah Mahasiswa',
                    color: 'var(--chart-1)',
                },
            } satisfies ChartConfig
            const chartConfigPmb2 = {
                jumlah: {
                    label: 'Jumlah Mahasiswa',
                    color: 'var(--chart-2)',
                },
            } satisfies ChartConfig
            const chartConfigPmb3 = {
                jumlahMataKuliah: {
                    label: 'Jumlah Mata Kuliah',
                    color: 'var(--chart-2)',
                },
            } satisfies ChartConfig
            const chartConfigPmb4 = {
                jumlahCapaianPembelajaran: {
                    label: 'Jumlah Capaian Pembelajaran',
                    color: 'var(--chart-2)',
                },
            } satisfies ChartConfig

            return (
                <div className="w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-1 mb-3">
                        <Card>
                            <CardHeader>
                                <CardTitle>Jumlah Mahasiswa</CardTitle>
                                <CardDescription>
                                    Jumlah Mahasiswa per Program Studi
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {dataPmb && dataPmb.data.length > 0 ? (
                                    <ChartContainer config={chartConfigPmb1}>
                                        <BarChart
                                            accessibilityLayer
                                            data={dataPmb.data[0].hasilPerProdi}
                                        >
                                            <CartesianGrid vertical={false} />
                                            <XAxis
                                                dataKey="programStudi"
                                                tickLine={false}
                                                axisLine={false}
                                                tickMargin={8}
                                                tickFormatter={(value) =>
                                                    getInitials(value)
                                                }
                                            />
                                            <ChartTooltip
                                                cursor={false}
                                                content={
                                                    <ChartTooltipContent />
                                                }
                                            />
                                            <Bar
                                                dataKey="jumlahMahasiswa"
                                                fill="var(--chart-1)"
                                                radius={8}
                                            >
                                                <LabelList
                                                    position="top"
                                                    offset={12}
                                                    className="fill-foreground"
                                                    fontSize={12}
                                                />
                                            </Bar>
                                        </BarChart>
                                    </ChartContainer>
                                ) : (
                                    <div className="w-full justify-center">
                                        <h1>Tidak ada Data</h1>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <div className="flex w-full items-start gap-2 text-sm">
                                    <div className="grid gap-2">
                                        <div className="flex items-center gap-2 leading-none font-medium">
                                            Trending up by 5.2% this month{' '}
                                            {/* <TrendingUp className="h-4 w-4" /> */}
                                        </div>
                                        <div className="text-muted-foreground flex items-center gap-2 leading-none">
                                            Showing total visitors for the last
                                            6 months
                                        </div>
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-1 mb-3">
                        <Card>
                            <CardHeader>
                                <CardTitle>Jumlah Mahasiswa</CardTitle>
                                <CardDescription>
                                    Jumlah Mahasiswa per Status
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {dataPmb && dataPmb.data.length > 0 ? (
                                    <ChartContainer config={chartConfigPmb2}>
                                        <BarChart
                                            accessibilityLayer
                                            data={
                                                dataPmb.data[1]
                                                    .countPerStatusLengkap
                                            }
                                        >
                                            <CartesianGrid vertical={false} />
                                            <XAxis
                                                dataKey="status"
                                                tickLine={false}
                                                axisLine={false}
                                                tickMargin={8}
                                                tickFormatter={(value) =>
                                                    getInitials(value)
                                                }
                                            />
                                            <ChartTooltip
                                                cursor={false}
                                                content={
                                                    <ChartTooltipContent />
                                                }
                                            />
                                            <Bar
                                                dataKey="jumlah"
                                                fill="var(--chart-1)"
                                                radius={8}
                                            >
                                                <LabelList
                                                    position="top"
                                                    offset={12}
                                                    className="fill-foreground"
                                                    fontSize={12}
                                                />
                                            </Bar>
                                        </BarChart>
                                    </ChartContainer>
                                ) : (
                                    <div className="w-full justify-center">
                                        <h1>Tidak ada Data</h1>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <div className="flex w-full items-start gap-2 text-sm">
                                    <div className="grid gap-2">
                                        <div className="flex items-center gap-2 leading-none font-medium">
                                            Trending up by 5.2% this month{' '}
                                            {/* <TrendingUp className="h-4 w-4" /> */}
                                        </div>
                                        <div className="text-muted-foreground flex items-center gap-2 leading-none">
                                            Showing total visitors for the last
                                            6 months
                                        </div>
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-1 mb-3">
                        <Card>
                            <CardHeader>
                                <CardTitle>Jumlah Mata Kuliah</CardTitle>
                                <CardDescription>
                                    Jumlah Mata Kuliah per Program Studi
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {dataPmb && dataPmb.data.length > 0 ? (
                                    <ChartContainer config={chartConfigPmb3}>
                                        <BarChart
                                            accessibilityLayer
                                            data={dataPmb.data[2].hasilMK}
                                        >
                                            <CartesianGrid vertical={false} />
                                            <XAxis
                                                dataKey="programStudi"
                                                tickLine={false}
                                                axisLine={false}
                                                tickMargin={8}
                                                tickFormatter={(value) =>
                                                    getInitials(value)
                                                }
                                            />
                                            <ChartTooltip
                                                cursor={false}
                                                content={
                                                    <ChartTooltipContent />
                                                }
                                            />
                                            <Bar
                                                dataKey="jumlahMataKuliah"
                                                fill="var(--chart-2)"
                                                radius={8}
                                            >
                                                <LabelList
                                                    position="top"
                                                    offset={12}
                                                    className="fill-foreground"
                                                    fontSize={12}
                                                />
                                            </Bar>
                                        </BarChart>
                                    </ChartContainer>
                                ) : (
                                    <div className="w-full justify-center">
                                        <h1>Tidak ada Data</h1>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <div className="flex w-full items-start gap-2 text-sm">
                                    <div className="grid gap-2">
                                        <div className="flex items-center gap-2 leading-none font-medium">
                                            Trending up by 5.2% this month{' '}
                                            {/* <TrendingUp className="h-4 w-4" /> */}
                                        </div>
                                        <div className="text-muted-foreground flex items-center gap-2 leading-none">
                                            Showing total visitors for the last
                                            6 months
                                        </div>
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-1 mb-3">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Jumlah Capaian Pembelajaran
                                </CardTitle>
                                <CardDescription>
                                    Jumlah Capaian Pembelajaran per Program
                                    Studi
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {dataPmb && dataPmb.data.length > 0 ? (
                                    <ChartContainer config={chartConfigPmb4}>
                                        <BarChart
                                            accessibilityLayer
                                            data={dataPmb.data[3].hasilCP}
                                        >
                                            <CartesianGrid vertical={false} />
                                            <XAxis
                                                dataKey="programStudi"
                                                tickLine={false}
                                                axisLine={false}
                                                tickMargin={8}
                                                tickFormatter={(value) =>
                                                    getInitials(value)
                                                }
                                            />
                                            <ChartTooltip
                                                cursor={false}
                                                content={
                                                    <ChartTooltipContent />
                                                }
                                            />
                                            <Bar
                                                dataKey="jumlahCapaianPembelajaran"
                                                fill="var(--chart-2)"
                                                radius={8}
                                            >
                                                <LabelList
                                                    position="top"
                                                    offset={12}
                                                    className="fill-foreground"
                                                    fontSize={12}
                                                />
                                            </Bar>
                                        </BarChart>
                                    </ChartContainer>
                                ) : (
                                    <div className="w-full justify-center">
                                        <h1>Tidak ada Data</h1>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <div className="flex w-full items-start gap-2 text-sm">
                                    <div className="grid gap-2">
                                        <div className="flex items-center gap-2 leading-none font-medium">
                                            Trending up by 5.2% this month{' '}
                                            {/* <TrendingUp className="h-4 w-4" /> */}
                                        </div>
                                        <div className="text-muted-foreground flex items-center gap-2 leading-none">
                                            Showing total visitors for the last
                                            6 months
                                        </div>
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            )
        } else if (role.Name.match('Akademik')) {
            const chartConfigAkademikAsesor = {
                total: {
                    label: 'Jumlah',
                },
                'Asesor Sudah SK': {
                    label: 'Asesor Sudah SK',
                    color: 'var(--chart-1)',
                },
                'Asesor Belum SK': {
                    label: 'Asesor Belum SK',
                    color: 'var(--chart-2)',
                },
            } satisfies ChartConfig
            const chartConfigAkademikMhs = {
                total: {
                    label: 'Jumlah',
                },
                'Mahasiswa Sudah SK': {
                    label: 'Mahasiswa Sudah SK',
                    color: 'var(--chart-1)',
                },
                'Mahasiswa Belum SK': {
                    label: 'Mahasiswa Belum SK',
                    color: 'var(--chart-2)',
                },
            } satisfies ChartConfig

            return (
                <div className="w-full flex gap-2 flex-col md:flex-row">
                    <div className="w-full sm:w-full md:w-1/2">
                        <Card className="flex flex-col">
                            <CardHeader className="items-center pb-0">
                                <CardTitle>Total Asesor</CardTitle>
                                <CardDescription>
                                    Berdasarkan Asesor Sudah di SK dan Belum di
                                    SK
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 pb-0">
                                {dataAkademik &&
                                dataAkademik.data.length > 0 ? (
                                    <ChartContainer
                                        config={chartConfigAkademikAsesor}
                                        className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0"
                                    >
                                        <PieChart>
                                            <ChartTooltip
                                                content={
                                                    <ChartTooltipContent
                                                        hideLabel={false}
                                                    />
                                                }
                                            />
                                            <Pie
                                                data={dataAkademik.data[0]}
                                                dataKey="total"
                                                label
                                                nameKey="name"
                                            />
                                        </PieChart>
                                    </ChartContainer>
                                ) : (
                                    <div className="w-full">Tidak Ada data</div>
                                )}
                            </CardContent>
                            <CardFooter className="flex-col gap-2 text-sm">
                                <div className="flex items-center gap-2 leading-none font-medium">
                                    Trending up by 5.2% this month
                                </div>
                                <div className="text-muted-foreground leading-none">
                                    Showing total visitors for the last 6 months
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                    <div className="w-full sm:w-full md:w-1/2">
                        <Card className="flex flex-col">
                            <CardHeader className="items-center pb-0">
                                <CardTitle>Total Mahasiswa</CardTitle>
                                <CardDescription>
                                    Berdasarkan Mahasiswa yang sudah di SK dan
                                    belum di SK
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 pb-0">
                                {dataAkademik &&
                                dataAkademik.data.length > 0 ? (
                                    <ChartContainer
                                        config={chartConfigAkademikMhs}
                                        className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0"
                                    >
                                        <PieChart>
                                            <ChartTooltip
                                                content={
                                                    <ChartTooltipContent
                                                        hideLabel={false}
                                                    />
                                                }
                                            />
                                            <Pie
                                                data={dataAkademik.data[1]}
                                                dataKey="total"
                                                label
                                                nameKey="name"
                                            />
                                        </PieChart>
                                    </ChartContainer>
                                ) : (
                                    <div className="w-full">Tidak Ada data</div>
                                )}
                            </CardContent>
                            <CardFooter className="flex-col gap-2 text-sm">
                                <div className="flex items-center gap-2 leading-none font-medium">
                                    Trending up by 5.2% this month
                                </div>
                                <div className="text-muted-foreground leading-none">
                                    Showing total visitors for the last 6 months
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            )
        } else {
        }
    } else {
        return (
            <div className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-3">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
            </div>
        )
    }
}

export default Dashboard

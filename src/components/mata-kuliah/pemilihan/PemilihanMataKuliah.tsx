'use client'
import { KeteranganMataKuliah, StatusPerkawinan } from '@/generated/prisma'
import { getEvaluasiMandiri, setMataKuliahMahasiswa } from '@/services/EvaluasiMandiri/EvaluasiMandiriService'
import { CreateMataKuliahMahasiswaTypes, DaftarUlangProdiType } from '@/types/DaftarUlangProdi'
import React from 'react'
import { toast } from 'sonner'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '../../ui/select'
import { Button } from '../../ui/button'
import { PenIcon, TimerIcon } from 'lucide-react'
import { Skeleton } from '../../ui/skeleton'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableRow,
} from '../../ui/table'
import { Checkbox } from '../../ui/checkbox'
import { replaceItemAtIndex } from '@/lib/utils'

export default function PemilihanMataKuliah({
    dataMahasiswa,
}: {
    dataMahasiswa: {
        MahasiswaId: string
        StatusPerkawinan: StatusPerkawinan
        Pendaftaran: {
            PendaftaranId: string
            KodePendaftar: string
            NoUjian: string
            Periode: string
        }[]
    }[]
}) {
    const [selectableMahasiswa, setSelectableMahasiswa] = React.useState<string>('')
    const [form, setForm] = React.useState<CreateMataKuliahMahasiswaTypes>([])
    const [dataDaftarUlang, setDataDaftarUlang] = React.useState<DaftarUlangProdiType | null>(null)
    const [loading, setLoading] = React.useState<boolean>(false)
    const [loadingAwal, setLoadingAwal] = React.useState<boolean>(false)

    const DISABLED_STATUSES = [
        'Penunjukan Asesor',
        'Persetujuan Penunjukan Asesor',
        'Penerbitan SK Penugasan Asesor',
        'Asessmen Oleh Asesor',
        'Rekapitulasi Asessmen',
        'Sanggahan',
        'Hasil Final Asessmen',
        'Persetujuan Hasil Final',
        'Penerbitan SK Asessmen',
        'Sinkronisasi Hasil Asessmen',
        'Selesai',
    ]

    const isFormDisabled = dataDaftarUlang ? DISABLED_STATUSES.includes(dataDaftarUlang.Status) : false

    React.useEffect(() => {
        if (selectableMahasiswa) {
            setLoadingAwal(true)
            getEvaluasiMandiri(selectableMahasiswa)
                .then(async (res) => {
                    await setDataDaftarUlang(res)
                    // Initialize form with existing data
                    const temp = res?.MataKuliahMahasiswa.map((r) => ({
                        MataKuliahId: r.MataKuliahId,
                        Keterangan: r.Keterangan,
                    }))
                    setForm(
                        (temp || []).filter(
                            (item) => item.Keterangan !== null
                        ) as {
                            MataKuliahId: string
                            Keterangan: KeteranganMataKuliah
                        }[]
                    )
                    setLoadingAwal(false)
                })
                .catch((res) => {
                    setLoadingAwal(false)
                })
        }
    }, [selectableMahasiswa])

    const updateMataKuliahMahasiswa = () => {
        setLoading(true)
        setMataKuliahMahasiswa(selectableMahasiswa, form)
            .then((res) => {
                setDataDaftarUlang(
                    dataDaftarUlang
                        ? {
                            ...dataDaftarUlang,
                            MataKuliahMahasiswa: res.map((item) => {
                                const mk = dataDaftarUlang.MataKuliah.find(
                                    (m) => m.MataKuliahId === item.MataKuliahId
                                )
                                return {
                                    MataKuliahMahasiswaId: item.MataKuliahMahasiswaId,
                                    PendaftaranId: item.PendaftaranId,
                                    MataKuliahId: item.MataKuliahId,
                                    Rpl: item.Rpl,
                                    StatusMataKuliahMahasiswa: item.StatusMataKuliahMahasiswa,
                                    Keterangan: item.Keterangan,
                                    MataKuliah: {
                                        Nama: mk?.Nama ?? '',
                                        ProgramStudiId: mk?.ProgramStudiId ?? '',
                                    },
                                }
                            }),
                            PilihMataKuliah: res.length,
                        }
                        : null
                )

                toast('Data Mata Kuliah sudah disimpan')
                setLoading(false)
            })
            .catch((err) => {
                toast('Terjadi Kesalahan')
                setLoading(false)
            })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <h1 className="text-2xl">Pemilihan Mata Kuliah</h1>
                </CardTitle>
                <CardDescription>
                    Pilih mata kuliah yang ingin di-RPL dan tentukan jenis pengakuan SKS
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="my-2 w-full">
                    <h1>Silakan Pilih Nomor Ujian</h1>
                    <Select
                        value={selectableMahasiswa}
                        onValueChange={(e) => {
                            setSelectableMahasiswa(e)
                        }}
                    >
                        <SelectTrigger className="w-1/2">
                            <SelectValue placeholder="Pilih No. Ujian Anda" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Pilih No. Ujian Anda</SelectLabel>
                                {dataMahasiswa.map((m) => (
                                    <SelectItem
                                        key={m.MahasiswaId}
                                        value={m.Pendaftaran[0].PendaftaranId}
                                    >
                                        {m.Pendaftaran[0].NoUjian} -{' '}
                                        {m.Pendaftaran[0].Periode}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    {!selectableMahasiswa ? (
                        <></>
                    ) : loadingAwal || dataDaftarUlang === null ? (
                        <Skeleton className="w-full h-32" />
                    ) : (
                        <>
                            <Table className="my-8">
                                <TableCaption>
                                    Informasi Program Studi
                                </TableCaption>
                                <TableBody>
                                    <TableRow>
                                        <TableHead>
                                            Nama Program Studi
                                        </TableHead>
                                        <TableCell>
                                            {dataDaftarUlang?.Nama}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>NIM</TableHead>
                                        <TableCell>
                                            {dataDaftarUlang?.Nim}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>Akreditasi</TableHead>
                                        <TableCell>
                                            {dataDaftarUlang?.Akreditasi}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>Jenjang</TableHead>
                                        <TableCell>
                                            {dataDaftarUlang?.Jenjang}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>
                                            Jenjang KKNI Dituju
                                        </TableHead>
                                        <TableCell>
                                            {dataDaftarUlang?.JenjangKkniDituju}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>
                                            Jumlah Mata Kuliah Dipilih
                                        </TableHead>
                                        <TableCell>
                                            {dataDaftarUlang?.PilihMataKuliah ?? 0} Mata Kuliah
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                            {/* Form Pemilihan Mata Kuliah */}
                            <div className="mt-8 border rounded-lg p-6">
                                <h2 className="text-lg font-semibold mb-2">Pilih Mata Kuliah yang di RPL</h2>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Pilih mata kuliah dan tentukan jenis pengakuan SKS (Transfer SKS atau Perolehan SKS)
                                </p>
                                <div className="grid grid-cols-1 gap-4 py-4">
                                    {dataDaftarUlang.MataKuliah.map((mk) => (
                                        <div key={mk.MataKuliahId}>
                                            <div className="items-top flex space-x-2">
                                                <Checkbox
                                                    disabled={loading || isFormDisabled}
                                                    id={mk.MataKuliahId}
                                                    checked={form.some(
                                                        (item) =>
                                                            item.MataKuliahId ===
                                                            mk.MataKuliahId
                                                    )}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            setForm([
                                                                ...form,
                                                                {
                                                                    MataKuliahId:
                                                                        mk.MataKuliahId,
                                                                    Keterangan:
                                                                        KeteranganMataKuliah.Transfer_SKS,
                                                                },
                                                            ])
                                                        } else {
                                                            setForm(
                                                                form.filter(
                                                                    (f) =>
                                                                        f.MataKuliahId !==
                                                                        mk.MataKuliahId
                                                                )
                                                            )
                                                        }
                                                    }}
                                                />
                                                <div className="grid gap-1.5 leading-none">
                                                    <label
                                                        htmlFor={mk.MataKuliahId}
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    >
                                                        {mk.Nama}
                                                    </label>
                                                    <p className="text-sm text-muted-foreground">
                                                        Kode ({mk.Kode})
                                                        {mk.Sks &&
                                                            ' - SKS (' + mk.Sks + ')'}
                                                        {mk.Semester &&
                                                            ' - Smt (' +
                                                            mk.Semester +
                                                            ')'}
                                                    </p>
                                                </div>
                                            </div>
                                            {form.some(
                                                (item) =>
                                                    item.MataKuliahId ===
                                                    mk.MataKuliahId
                                            ) && (
                                                    <div className="space-x-2 my-2 ml-6">
                                                        <Select
                                                            disabled={loading || isFormDisabled}
                                                            value={
                                                                form.find(
                                                                    (item) =>
                                                                        item.MataKuliahId ===
                                                                        mk.MataKuliahId
                                                                )?.Keterangan ?? ''
                                                            }
                                                            onValueChange={(value) => {
                                                                setForm(
                                                                    replaceItemAtIndex(
                                                                        form,
                                                                        form.findIndex(
                                                                            (f) =>
                                                                                f.MataKuliahId ===
                                                                                mk.MataKuliahId
                                                                        ),
                                                                        {
                                                                            MataKuliahId:
                                                                                mk.MataKuliahId,
                                                                            Keterangan:
                                                                                value as KeteranganMataKuliah,
                                                                        }
                                                                    )
                                                                )
                                                            }}
                                                        >
                                                            <SelectTrigger className="w-full max-w-xs">
                                                                <SelectValue placeholder="Pilih Status SKS" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    <SelectLabel>
                                                                        Pilih Status SKS
                                                                    </SelectLabel>
                                                                    <SelectItem
                                                                        value={
                                                                            KeteranganMataKuliah.Transfer_SKS
                                                                        }
                                                                    >
                                                                        Transfer SKS
                                                                    </SelectItem>
                                                                    <SelectItem
                                                                        value={
                                                                            KeteranganMataKuliah.Perolehan_SKS
                                                                        }
                                                                    >
                                                                        Perolehan SKS
                                                                    </SelectItem>
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                )}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-end mt-4">
                                    <Button
                                        className="hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer"
                                        variant={'default'}
                                        disabled={loading || isFormDisabled}
                                        type="button"
                                        onClick={() => updateMataKuliahMahasiswa()}
                                    >
                                        {loading ? (
                                            <>
                                                <TimerIcon />
                                                Loading
                                            </>
                                        ) : (
                                            <>
                                                <PenIcon />
                                                Simpan
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

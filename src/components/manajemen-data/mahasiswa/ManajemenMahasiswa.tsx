'use client'
import { cn, replaceItemAtIndex } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table'
import React from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../../ui/dropdown-menu'
import { Button } from '../../ui/button'
import {
    CalendarIcon,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    PenIcon,
    Timer,
} from 'lucide-react'
import Swal from 'sweetalert2'
import { Input } from '../../ui/input'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '../../ui/select'
import { Skeleton } from '../../ui/skeleton'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../../ui/table'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '../../ui/sheet'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../../ui/form'
import {
    Country,
    Desa,
    JenisKelamin,
    JenisOrtu,
    Jenjang,
    Kabupaten,
    Kecamatan,
    Provinsi,
    SistemKuliah,
    StatusPekerjaan,
    StatusPerkawinan,
} from '@/generated/prisma'
import {
    deleteCalonMahasiswa,
    getCalonMahasiswaPagination,
    getKodePendaftarId,
    setCalonMahasiswa,
    updateCalonMahasiswa,
} from '@/services/ManajemenData/CalonMahasiswaServices'
import {
    CalonMahasiswaRplPage,
    CalonMahasiswaRplRequestResponseDTO,
} from '@/types/MahasiswaTypes'
import {
    CalonMahasiswaFormValidation,
    CalonMahasiswaSchemaValidation,
} from '@/validation/CalonMahasiswaFormValidation'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Textarea } from '@/components/ui/textarea'
import {
    getDesaByKecamatanId,
    getKabupatenByProvinsiId,
    getKecamatanByKabupatenId,
    getProvinsiByCountryId,
} from '@/services/AreaServices'

const ManajemenMahasiswaComponent = ({
    countryDataServer,
    universityDataServer,
}: {
    countryDataServer: Country[]
    universityDataServer: {
        Nama: string
        UniversityId: string
        ProgramStudi: {
            Nama: string
            ProgramStudiId: string
            Jenjang: string | null
            Akreditasi: string
        }[]
    }[]
}) => {
    const [dataProvinsi, setDataProvinsi] = React.useState<Provinsi[]>([])
    const [dataKabupaten, setDataKabupaten] = React.useState<Kabupaten[]>([])
    const [dataKecamatan, setDataKecamatan] = React.useState<Kecamatan[]>([])
    const [dataDesa, setDataDesa] = React.useState<Desa[]>([])
    const [dataProvinsiInstitusiLama, setDataProvinsiInstitusiLama] =
        React.useState<Provinsi[]>([])
    const [dataKabupatenInstitusiLama, setDataKabupatenInstitusiLama] =
        React.useState<Kabupaten[]>([])
    const [dataKecamatanInstitusiLama, setDataKecamatanInstitusiLama] =
        React.useState<Kecamatan[]>([])
    const [dataDesaInstitusiLama, setDataDesaInstitusiLama] = React.useState<
        Desa[]
    >([])
    const [dataCalonMahasiswa, setDataCalonMahasiswa] = React.useState<
        CalonMahasiswaRplPage[]
    >([])
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [paginationState, setPaginationState] = React.useState<{
        page: number
        limit: number
        totalElement: number
        totalPage: number
        isFirst: boolean
        isLast: boolean
        hasNext: boolean
        hasPrevious: boolean
    }>({
        page: 1,
        limit: 5,
        totalElement: 0,
        totalPage: 0,
        isFirst: false,
        isLast: false,
        hasNext: false,
        hasPrevious: false,
    })
    const [search, setSearch] = React.useState<string>('')
    const [openDialog, setOpenDialog] = React.useState<boolean>(false)
    const [titleDialog, setTitleDialog] = React.useState<string>('')
    const [loading, setLoading] = React.useState<boolean>(false)
    const form = useForm<CalonMahasiswaFormValidation>({
        resolver: zodResolver(CalonMahasiswaSchemaValidation) as any,
        defaultValues: {
            programStudi: {
                ProgramStudiId: '',
                UniversityId: '',
                NamaProgramStudi: '',
                JenjangProgramStudi: Jenjang.TIDAK_TAMAT_SD,
                AkreditasiProgramStudi: '',
            },
            alamat: {
                AlamatId: '',
                Alamat: '',
                KodePos: '',
                DesaId: '',
                KecamatanId: '',
                KabupatenId: '',
                ProvinsiId: '',
                CountryId: '',
            },
            user: {
                UserId: '',
                Nama: '',
                Email: '',
                TempatLahir: '',
                TanggalLahir: new Date(),
                JenisKelamin: Object.values(JenisKelamin)[0] || '',
                PendidikanTerakhir: Object.values(Jenjang)[0] || '',
                Agama: '',
                Telepon: '',
                NomorWa: '',
                NomorHp: '',
            },
            pendaftaran: {
                PendaftaranId: '',
                MahasiswaId: '',
                KodePendaftar: '',
                NoUjian: '',
                Periode: '',
                Gelombang: '',
                SistemKuliah: Object.values(SistemKuliah)[0] || '',
                JalurPendaftaran: '',
            },
            daftarUlang: {
                DaftarUlangId: '',
                Nim: '',
                JenjangKkniDituju: '',
                KipK: false,
                Aktif: false,
                MengisiBiodata: false,
                Finalisasi: false,
                TanggalDaftar: null,
                TanggalDaftarUlang: null,
            },
            statusPerkawinan: Object.values(StatusPerkawinan)[0] || '',
            orangTua: [],
            informasiKependudukan: {
                InformasiKependudukanId: '',
                NoKk: '',
                NoNik: '',
                Suku: '',
            },
            pekerjaanMahasiswa: [],
            pesantren: {
                PesantrenId: '',
                NamaPesantren: '',
                LamaPesantren: '',
            },
            institusiLama: {
                InstitusiLamaId: '',
                Jenjang: Object.values(Jenjang)[0] || '',
                JenisInstitusi: '',
                NamaInstitusi: '',
                Jurusan: '',
                Nisn: '',
                Npsn: '',
                TahunLulus: new Date().getFullYear(),
                NilaiLulusan: '0',
                AlamatInstitusiLama: {
                    AlamatId: '',
                    Alamat: '',
                    KodePos: '',
                    DesaId: '',
                    KecamatanId: '',
                    KabupatenId: '',
                    ProvinsiId: '',
                    CountryId: '',
                },
            },
        },
    })
    const onSubmit = async (data: CalonMahasiswaFormValidation) => {
        setLoading(true)
        if (titleDialog === 'Ubah Calon Mahasiswa') {
            await updateCalonMahasiswa({
                ProgramStudi: {
                    ProgramStudiId: data.programStudi.ProgramStudiId,
                    UniversityId: data.programStudi.UniversityId,
                    NamaProgramStudi: data.programStudi.NamaProgramStudi,
                    JenjangProgramStudi: data.programStudi.JenjangProgramStudi,
                    AkreditasiProgramStudi:
                        data.programStudi.AkreditasiProgramStudi,
                },
                Alamat: {
                    AlamatId: data.alamat.AlamatId,
                    Alamat: data.alamat.Alamat,
                    KodePos: data.alamat.KodePos,
                    DesaId: data.alamat.DesaId,
                    NamaDesa: selectedData.NamaDesa,
                    KecamatanId: data.alamat.KecamatanId,
                    NamaKecamatan: selectedData.NamaKecamatan,
                    KabupatenId: data.alamat.KabupatenId,
                    NamaKabupaten: selectedData.NamaKabupaten,
                    ProvinsiId: data.alamat.ProvinsiId,
                    NamaProvinsi: selectedData.NamaProvinsi,
                    CountryId: data.alamat.CountryId,
                    NamaCountry: selectedData.NamaCountry,
                },
                User: {
                    UserId: data.user.UserId,
                    Nama: data.user.Nama,
                    Email: data.user.Email,
                    TempatLahir: data.user.TempatLahir,
                    TanggalLahir: data.user.TanggalLahir,
                    JenisKelamin: data.user.JenisKelamin as JenisKelamin,
                    PendidikanTerakhir: data.user.PendidikanTerakhir as Jenjang,
                    Avatar: '',
                    Agama: data.user.Agama,
                    Telepon: data.user.Telepon,
                    NomorWa: data.user.NomorWa,
                    NomorHp: data.user.NomorHp,
                },
                Pendaftaran: {
                    PendaftaranId: data.pendaftaran.PendaftaranId,
                    MahasiswaId: data.pendaftaran.MahasiswaId,
                    KodePendaftar: data.pendaftaran.KodePendaftar,
                    NoUjian: data.pendaftaran.NoUjian,
                    Periode: data.pendaftaran.Periode,
                    Gelombang: data.pendaftaran.Gelombang,
                    SistemKuliah: data.pendaftaran.SistemKuliah as SistemKuliah,
                    JalurPendaftaran: data.pendaftaran.JalurPendaftaran,
                },
                DaftarUlang: {
                    DaftarUlangId: data.daftarUlang.DaftarUlangId,
                    Nim: data.daftarUlang.Nim,
                    JenjangKkniDituju: data.daftarUlang.JenjangKkniDituju,
                    KipK: data.daftarUlang.KipK,
                    Aktif: data.daftarUlang.Aktif,
                    MengisiBiodata: data.daftarUlang.MengisiBiodata,
                    Finalisasi: data.daftarUlang.Finalisasi,
                    TanggalDaftar: data.daftarUlang.TanggalDaftar,
                    TanggalDaftarUlang: data.daftarUlang.TanggalDaftarUlang,
                },
                StatusPerkawinan: data.statusPerkawinan as StatusPerkawinan,
                OrangTua: (data.orangTua ?? []).map((ot) => ({
                    OrangTuaId: ot.OrangTuaId,
                    NamaOrangTua: ot.NamaOrangTua,
                    PekerjaanOrangTua: ot.PekerjaanOrangTua,
                    JenisOrtu: ot.JenisOrtu as JenisOrtu,
                    PenghasilanOrangTua: ot.PenghasilanOrangTua,
                    EmailOrangTua: ot.EmailOrangTua,
                    NomorHpOrangTua: ot.NomorHpOrangTua,
                })),
                InformasiKependudukan: {
                    InformasiKependudukanId:
                        data.informasiKependudukan.InformasiKependudukanId,
                    NoKk: data.informasiKependudukan.NoKk,
                    NoNik: data.informasiKependudukan.NoNik,
                    Suku: data.informasiKependudukan.Suku,
                },
                PekerjaanMahasiswa: (data.pekerjaanMahasiswa ?? []).map(
                    (pm) => ({
                        InstitusiTempatBekerja: pm.InstitusiTempatBekerja,
                        Jabatan: pm.Jabatan,
                        StatusPekerjaan: pm.StatusPekerjaan as StatusPekerjaan,
                    })
                ),
                Pesantren: {
                    PesantrenId: data.pesantren?.PesantrenId ?? '',
                    NamaPesantren: data.pesantren?.NamaPesantren ?? '',
                    LamaPesantren: data.pesantren?.LamaPesantren ?? '',
                },
                InstitusiLama: {
                    InstitusiLamaId: data.institusiLama.InstitusiLamaId,
                    Jenjang: data.institusiLama.Jenjang as Jenjang,
                    JenisInstitusi: data.institusiLama.JenisInstitusi,
                    NamaInstitusi: data.institusiLama.NamaInstitusi,
                    Jurusan: data.institusiLama.Jurusan,
                    Nisn: data.institusiLama.Nisn,
                    Npsn: data.institusiLama.Npsn,
                    TahunLulus: data.institusiLama.TahunLulus,
                    NilaiLulusan: Number(data.institusiLama.NilaiLulusan),
                    AlamatInstitusi: {
                        AlamatId:
                            data.institusiLama.AlamatInstitusiLama?.AlamatId ??
                            '',
                        Alamat:
                            data.institusiLama.AlamatInstitusiLama?.Alamat ??
                            '',
                        KodePos:
                            data.institusiLama.AlamatInstitusiLama?.KodePos ??
                            '',
                        DesaId:
                            data.institusiLama.AlamatInstitusiLama?.DesaId ??
                            '',
                        KecamatanId:
                            data.institusiLama.AlamatInstitusiLama
                                ?.KecamatanId ?? '',
                        KabupatenId:
                            data.institusiLama.AlamatInstitusiLama
                                ?.KabupatenId ?? '',
                        ProvinsiId:
                            data.institusiLama.AlamatInstitusiLama
                                ?.ProvinsiId ?? '',
                        CountryId:
                            data.institusiLama.AlamatInstitusiLama?.CountryId ??
                            '',
                    },
                },
            })
                .then((res) => {
                    toast('Data Calon Mahasiswa berhasil diubah')
                    let idx = dataCalonMahasiswa.findIndex(
                        (r) =>
                            r.KodePendaftar === data.pendaftaran.KodePendaftar
                    )
                    setDataCalonMahasiswa(
                        replaceItemAtIndex(dataCalonMahasiswa, idx, res)
                    )
                    setOpenDialog(false)
                    setLoading(false)
                })
                .catch((err) => {
                    toast('Data Calon Mahasiswa gagal diubah. Error: ' + err)
                    setLoading(false)
                })
        } else {
            await setCalonMahasiswa({
                ProgramStudi: {
                    ProgramStudiId: '',
                    UniversityId: '',
                    NamaProgramStudi: data.programStudi.NamaProgramStudi,
                    JenjangProgramStudi: data.programStudi.JenjangProgramStudi,
                    AkreditasiProgramStudi:
                        data.programStudi.AkreditasiProgramStudi,
                },
                Alamat: {
                    AlamatId: '',
                    Alamat: data.alamat.Alamat,
                    KodePos: data.alamat.KodePos,
                    DesaId: data.alamat.DesaId,
                    NamaDesa: selectedData.NamaDesa,
                    KecamatanId: data.alamat.KecamatanId,
                    NamaKecamatan: selectedData.NamaKecamatan,
                    KabupatenId: data.alamat.KabupatenId,
                    NamaKabupaten: selectedData.NamaKabupaten,
                    ProvinsiId: data.alamat.ProvinsiId,
                    NamaProvinsi: selectedData.NamaProvinsi,
                    CountryId: data.alamat.CountryId,
                    NamaCountry: selectedData.NamaCountry,
                },
                User: {
                    UserId: '',
                    Nama: data.user.Nama,
                    Email: data.user.Email,
                    TempatLahir: data.user.TempatLahir,
                    TanggalLahir: data.user.TanggalLahir,
                    JenisKelamin: data.user.JenisKelamin as JenisKelamin,
                    PendidikanTerakhir: data.user.PendidikanTerakhir as Jenjang,
                    Avatar: '',
                    Agama: data.user.Agama,
                    Telepon: data.user.Telepon,
                    NomorWa: data.user.NomorWa,
                    NomorHp: data.user.NomorHp,
                },
                Pendaftaran: {
                    PendaftaranId: '',
                    MahasiswaId: '',
                    KodePendaftar: data.pendaftaran.KodePendaftar,
                    NoUjian: data.pendaftaran.NoUjian,
                    Periode: data.pendaftaran.Periode,
                    Gelombang: data.pendaftaran.Gelombang,
                    SistemKuliah: data.pendaftaran.SistemKuliah as SistemKuliah,
                    JalurPendaftaran: data.pendaftaran.JalurPendaftaran,
                },
                DaftarUlang: {
                    DaftarUlangId: '',
                    Nim: data.daftarUlang.Nim,
                    JenjangKkniDituju: data.daftarUlang.JenjangKkniDituju,
                    KipK: data.daftarUlang.KipK,
                    Aktif: data.daftarUlang.Aktif,
                    MengisiBiodata: data.daftarUlang.MengisiBiodata,
                    Finalisasi: data.daftarUlang.Finalisasi,
                    TanggalDaftar: data.daftarUlang.TanggalDaftar,
                    TanggalDaftarUlang: data.daftarUlang.TanggalDaftarUlang,
                },
                StatusPerkawinan: data.statusPerkawinan as StatusPerkawinan,
                OrangTua: (data.orangTua ?? []).map((ot) => ({
                    OrangTuaId: '',
                    NamaOrangTua: ot.NamaOrangTua,
                    PekerjaanOrangTua: ot.PekerjaanOrangTua,
                    JenisOrtu: ot.JenisOrtu as JenisOrtu,
                    PenghasilanOrangTua: ot.PenghasilanOrangTua,
                    EmailOrangTua: ot.EmailOrangTua,
                    NomorHpOrangTua: ot.NomorHpOrangTua,
                })),
                InformasiKependudukan: {
                    InformasiKependudukanId: '',
                    NoKk: data.informasiKependudukan.NoKk,
                    NoNik: data.informasiKependudukan.NoNik,
                    Suku: data.informasiKependudukan.Suku,
                },
                PekerjaanMahasiswa: (data.pekerjaanMahasiswa ?? []).map(
                    (pm) => ({
                        InstitusiTempatBekerja: pm.InstitusiTempatBekerja,
                        Jabatan: pm.Jabatan,
                        StatusPekerjaan: pm.StatusPekerjaan as StatusPekerjaan,
                    })
                ),
                Pesantren: {
                    PesantrenId: '',
                    NamaPesantren: data.pesantren?.NamaPesantren ?? '',
                    LamaPesantren: data.pesantren?.LamaPesantren ?? '',
                },
                InstitusiLama: {
                    InstitusiLamaId: '',
                    Jenjang: data.institusiLama.Jenjang as Jenjang,
                    JenisInstitusi: data.institusiLama.JenisInstitusi,
                    NamaInstitusi: data.institusiLama.NamaInstitusi,
                    Jurusan: data.institusiLama.Jurusan,
                    Nisn: data.institusiLama.Nisn,
                    Npsn: data.institusiLama.Npsn,
                    TahunLulus: data.institusiLama.TahunLulus,
                    NilaiLulusan: Number(data.institusiLama.NilaiLulusan),
                    AlamatInstitusi: {
                        AlamatId: '',
                        Alamat:
                            data.institusiLama.AlamatInstitusiLama?.Alamat ??
                            '',
                        KodePos:
                            data.institusiLama.AlamatInstitusiLama?.KodePos ??
                            '',
                        DesaId:
                            data.institusiLama.AlamatInstitusiLama?.DesaId ??
                            '',
                        KecamatanId:
                            data.institusiLama.AlamatInstitusiLama
                                ?.KecamatanId ?? '',
                        KabupatenId:
                            data.institusiLama.AlamatInstitusiLama
                                ?.KabupatenId ?? '',
                        ProvinsiId:
                            data.institusiLama.AlamatInstitusiLama
                                ?.ProvinsiId ?? '',
                        CountryId:
                            data.institusiLama.AlamatInstitusiLama?.CountryId ??
                            '',
                    },
                },
            })
                .then((res) => {
                    toast('Data Calon Mahasiswa berhasil ditambah')
                    setDataCalonMahasiswa([...dataCalonMahasiswa, res])
                    setLoading(false)
                    setOpenDialog(false)
                })
                .catch((err) => {
                    toast('Data Calon Mahasiswa gagal ditambah. Error: ' + err)
                    setLoading(false)
                })
        }
    }
    React.useEffect(() => {
        setLoading(true)
        getCalonMahasiswaPagination(
            paginationState.page,
            paginationState.limit,
            search
        )
            .then((res) => {
                setDataCalonMahasiswa(res.data)
                setLoading(false)
                setPaginationState({
                    page: res.page,
                    limit: res.limit,
                    totalElement: res.totalElement,
                    totalPage: res.totalPage,
                    isFirst: res.isFirst,
                    isLast: res.isLast,
                    hasNext: res.hasNext,
                    hasPrevious: res.hasPrevious,
                })
            })
            .catch((err) => {
                setLoading(false)
            })
    }, [paginationState.page, search, paginationState.limit])
    const [selectedData, setSelectedData] = React.useState({
        UniversityId: '',
        NamaCountry: '',
        NamaProvinsi: '',
        NamaKabupaten: '',
        NamaKecamatan: '',
        NamaDesa: '',
    })
    const buatData = () => {
        form.reset()
        setTitleDialog('Tambah Calon Mahasiswa')
        setOpenDialog(true)
    }
    const ubahData = async (jd: CalonMahasiswaRplPage) => {
        setLoading(true)
        setTitleDialog('Ubah Calon Mahasiswa')
        setOpenDialog(true)
        const res: CalonMahasiswaRplRequestResponseDTO =
            await getKodePendaftarId(jd.KodePendaftar)
        setSelectedData({
            UniversityId: res.ProgramStudi.UniversityId,
            NamaCountry: res.Alamat.NamaCountry,
            NamaProvinsi: res.Alamat.NamaProvinsi,
            NamaKabupaten: res.Alamat.NamaKabupaten,
            NamaKecamatan: res.Alamat.NamaKecamatan,
            NamaDesa: res.Alamat.NamaDesa,
        })
        await getProvinsiByCountryId(res.Alamat?.CountryId)
            .then((res) => {
                setDataProvinsi(res)
            })
            .catch((err) => toast('Terjadi Kesalahan, Error: ' + err))
        await getKabupatenByProvinsiId(res?.Alamat?.ProvinsiId)
            .then((res) => {
                setDataKabupaten(res)
            })
            .catch((err) => toast('Terjadi Kesalahan, Error: ' + err))
        await getKecamatanByKabupatenId(res?.Alamat?.KabupatenId)
            .then((res) => {
                setDataKecamatan(res)
            })
            .catch((err) => toast('Terjadi Kesalahan, Error: ' + err))
        await getDesaByKecamatanId(res?.Alamat?.KecamatanId)
            .then((res) => {
                setDataDesa(res)
            })
            .catch((err) => toast('Terjadi Kesalahan, Error: ' + err))

        if (res.InstitusiLama.AlamatInstitusi) {
            await getProvinsiByCountryId(
                res.InstitusiLama.AlamatInstitusi?.CountryId
            )
                .then((res) => {
                    setDataProvinsiInstitusiLama(res)
                })
                .catch((err) => toast('Terjadi Kesalahan, Error: ' + err))
            await getKabupatenByProvinsiId(
                res?.InstitusiLama.AlamatInstitusi?.ProvinsiId
            )
                .then((res) => {
                    setDataKabupatenInstitusiLama(res)
                })
                .catch((err) => toast('Terjadi Kesalahan, Error: ' + err))
            await getKecamatanByKabupatenId(
                res?.InstitusiLama.AlamatInstitusi?.KabupatenId
            )
                .then((res) => {
                    setDataKecamatanInstitusiLama(res)
                })
                .catch((err) => toast('Terjadi Kesalahan, Error: ' + err))
            await getDesaByKecamatanId(
                res?.InstitusiLama.AlamatInstitusi?.KecamatanId
            )
                .then((res) => {
                    setDataDesaInstitusiLama(res)
                })
                .catch((err) => toast('Terjadi Kesalahan, Error: ' + err))
        }
        form.setValue('alamat', res.Alamat)
        form.setValue('pesantren', res.Pesantren)
        form.setValue('pendaftaran', {
            PendaftaranId: res.Pendaftaran.PendaftaranId,
            MahasiswaId: res.Pendaftaran.MahasiswaId,
            KodePendaftar: res.Pendaftaran.KodePendaftar,
            NoUjian: res.Pendaftaran.NoUjian,
            Periode: res.Pendaftaran.Periode,
            Gelombang: res.Pendaftaran.Gelombang,
            SistemKuliah: res.Pendaftaran.SistemKuliah,
            JalurPendaftaran: res.Pendaftaran.JalurPendaftaran,
        })
        form.setValue('daftarUlang', {
            ...res.DaftarUlang,
            TanggalDaftar:
                res.DaftarUlang.TanggalDaftar !== null
                    ? new Date(res.DaftarUlang.TanggalDaftar)
                    : new Date(),
            TanggalDaftarUlang:
                res.DaftarUlang.TanggalDaftarUlang !== null
                    ? new Date(res.DaftarUlang.TanggalDaftarUlang)
                    : new Date(),
        })
        form.setValue('user', {
            UserId: res.User.UserId,
            Nama: res.User.Nama,
            Email: res.User.Email,
            TempatLahir: res.User.TempatLahir,
            TanggalLahir:
                res.User.TanggalLahir !== null
                    ? new Date(res.User.TanggalLahir)
                    : new Date(),
            JenisKelamin: res.User.JenisKelamin,
            PendidikanTerakhir: res.User.PendidikanTerakhir,
            Agama: res.User.Agama,
            Telepon: res.User.Telepon,
            NomorWa: res.User.NomorWa,
            NomorHp: res.User.NomorHp,
        })
        form.setValue('programStudi', {
            ProgramStudiId: res.ProgramStudi.ProgramStudiId,
            UniversityId: res.ProgramStudi.UniversityId,
            NamaProgramStudi: res.ProgramStudi.NamaProgramStudi,
            JenjangProgramStudi:
                res.ProgramStudi.JenjangProgramStudi || Jenjang.TIDAK_TAMAT_SD,
            AkreditasiProgramStudi: res.ProgramStudi.AkreditasiProgramStudi,
        })
        form.setValue('statusPerkawinan', res.StatusPerkawinan)
        form.setValue('orangTua', res.OrangTua)
        form.setValue('informasiKependudukan', res.InformasiKependudukan)
        form.setValue('pekerjaanMahasiswa', res.PekerjaanMahasiswa)
        form.setValue('institusiLama', {
            ...res.InstitusiLama,
            AlamatInstitusiLama: {
                AlamatId: res.InstitusiLama.AlamatInstitusi.AlamatId,
                Alamat: res.InstitusiLama.AlamatInstitusi.Alamat,
                KodePos: res.InstitusiLama.AlamatInstitusi.KodePos,
                DesaId: res.InstitusiLama.AlamatInstitusi.DesaId,
                KecamatanId: res.InstitusiLama.AlamatInstitusi.KecamatanId,
                KabupatenId: res.InstitusiLama.AlamatInstitusi.KabupatenId,
                ProvinsiId: res.InstitusiLama.AlamatInstitusi.ProvinsiId,
                CountryId: res.InstitusiLama.AlamatInstitusi.CountryId,
            },
            NilaiLulusan: res.InstitusiLama.NilaiLulusan.toString(),
        })
        setLoading(false)
    }
    const hapusData = (jd: CalonMahasiswaRplPage) => {
        Swal.fire({
            title: 'Ingin Hapus ' + jd.Nama + ' ?',
            text: 'Aksi ini tidak dapat di undo',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f45f24',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteCalonMahasiswa(jd.KodePendaftar).then(() => {
                    setDataCalonMahasiswa(
                        dataCalonMahasiswa.filter(
                            (r) => r.KodePendaftar !== jd.KodePendaftar
                        )
                    )
                    Swal.fire({
                        title: 'Terhapus!',
                        text: 'Data sudah dihapus.',
                        icon: 'success',
                    })
                })
            }
        })
    }
    const openWindowUploadExcel = () => {
        Swal.fire({
            title: 'Upload By Excel',
            icon: 'info',
            text: 'Sedang Dibuat...',
        })
    }
    const columns: ColumnDef<CalonMahasiswaRplPage>[] = [
        {
            accessorKey: 'KodePendaftar',
            header: 'Kode Pendaftar',
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.getValue('KodePendaftar')}
                </div>
            ),
        },
        {
            accessorKey: 'Nim',
            header: 'Nim',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('Nim')}</div>
            ),
        },
        {
            accessorKey: 'Nama',
            header: 'Nama',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('Nama')}</div>
            ),
        },
        {
            accessorKey: 'NoUjian',
            header: 'NoUjian',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('NoUjian')}</div>
            ),
        },
        {
            accessorKey: 'Periode',
            header: 'Periode',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('Periode')}</div>
            ),
        },
        {
            accessorKey: 'NamaProdi',
            header: 'Nama Prodi',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('NamaProdi')}</div>
            ),
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }) => {
                const jd = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() =>
                                    navigator.clipboard.writeText(
                                        jd.KodePendaftar
                                    )
                                }
                            >
                                Copy Kode Pendaftar ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => ubahData(jd)}>
                                Ubah Data
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => hapusData(jd)}>
                                Hapus Data
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]
    const table = useReactTable({
        data: dataCalonMahasiswa,
        columns,
        manualPagination: true,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        pageCount: paginationState.totalPage,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            columnFilters,
            columnVisibility,
        },
    })

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Cari Data ..."
                    value={search}
                    onChange={(event) => {
                        setPaginationState({
                            ...paginationState,
                            page: 1,
                        })
                        setSearch(event.target.value)
                    }}
                    className="max-w-sm"
                />
                <div className="w-full justify-end flex">
                    <Button className="mr-2" onClick={() => buatData()}>
                        Tambah
                    </Button>
                    <Button
                        className="mr-2"
                        onClick={() => openWindowUploadExcel()}
                    >
                        Upload Excel
                    </Button>
                    <Select
                        value={String(paginationState.limit)}
                        onValueChange={(value) =>
                            setPaginationState({
                                ...paginationState,
                                limit: Number(value),
                                page: 1,
                            })
                        }
                    >
                        <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Pilih Limit Data" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Pilih Limit Data</SelectLabel>
                                {[5, 10, 20, 50, 75, 100].map((l, idx) => (
                                    <SelectItem value={String(l)} key={idx}>
                                        {l}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {loading ? (
                <div className="space-y-2">
                    {Array.from({ length: paginationState.limit }).map(
                        (_, i) => (
                            <div key={i} className="flex space-x-4">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-[60%]" />
                                    <Skeleton className="h-4 w-[40%]" />
                                </div>
                            </div>
                        )
                    )}
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext()
                                                      )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected() && 'selected'
                                        }
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        Tidak Ada Data.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    Menampilkan{' '}
                    {paginationState.page * paginationState.limit -
                        paginationState.limit +
                        1}{' '}
                    -{' '}
                    {paginationState.totalElement <
                    paginationState.page * paginationState.limit
                        ? paginationState.totalElement
                        : paginationState.page * paginationState.limit}{' '}
                    dari {paginationState.totalElement} Data.
                </div>
                <div className="flex items-center space-x-2 mt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setPaginationState({
                                ...paginationState,
                                page: paginationState.page - 1,
                            })
                        }}
                        disabled={!paginationState.hasPrevious}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>

                    {(() => {
                        const pages = []
                        const { page, totalPage } = paginationState

                        const shouldShowLeftDots = page > 3
                        const shouldShowRightDots = page < totalPage - 2

                        const renderPage = (p: number) => (
                            <Button
                                key={p}
                                variant={p === page ? 'default' : 'outline'}
                                size="sm"
                                onClick={() =>
                                    setPaginationState({
                                        ...paginationState,
                                        page: p,
                                    })
                                }
                            >
                                {p}
                            </Button>
                        )

                        pages.push(renderPage(1))

                        if (shouldShowLeftDots) {
                            pages.push(<span key="left-dots">...</span>)
                        }

                        for (let i = page - 1; i <= page + 1; i++) {
                            if (i > 1 && i < totalPage) {
                                pages.push(renderPage(i))
                            }
                        }

                        if (shouldShowRightDots) {
                            pages.push(<span key="right-dots">...</span>)
                        }

                        if (totalPage > 1) {
                            pages.push(renderPage(totalPage))
                        }

                        return pages
                    })()}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setPaginationState({
                                ...paginationState,
                                page: paginationState.page + 1,
                            })
                        }}
                        disabled={!paginationState.hasNext}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
            <SheetManageData
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                onSubmit={onSubmit}
                loading={loading}
                form={form}
                titleDialog={titleDialog}
                universityDataServer={universityDataServer}
                countryDataServer={countryDataServer}
                dataProvinsi={dataProvinsi}
                setDataProvinsi={setDataProvinsi}
                dataKabupaten={dataKabupaten}
                setDataKabupaten={setDataKabupaten}
                dataKecamatan={dataKecamatan}
                setDataKecamatan={setDataKecamatan}
                dataDesa={dataDesa}
                setDataDesa={setDataDesa}
                selectedData={selectedData}
                setSelectedData={setSelectedData}
                dataProvinsiInstitusiLama={dataProvinsiInstitusiLama}
                setDataProvinsiInstitusiLama={setDataProvinsiInstitusiLama}
                dataKabupatenInstitusiLama={dataKabupatenInstitusiLama}
                setDataKabupatenInstitusiLama={setDataKabupatenInstitusiLama}
                dataKecamatanInstitusiLama={dataKecamatanInstitusiLama}
                setDataKecamatanInstitusiLama={setDataKecamatanInstitusiLama}
                dataDesaInstitusiLama={dataDesaInstitusiLama}
                setDataDesaInstitusiLama={setDataDesaInstitusiLama}
            />
        </div>
    )
}

export default ManajemenMahasiswaComponent

export function SheetManageData({
    openDialog,
    setOpenDialog,
    onSubmit,
    loading,
    form,
    titleDialog,
    universityDataServer,
    countryDataServer,
    dataProvinsi,
    setDataProvinsi,
    dataKabupaten,
    setDataKabupaten,
    dataKecamatan,
    setDataKecamatan,
    dataDesa,
    setDataDesa,
    selectedData,
    setSelectedData,
    dataProvinsiInstitusiLama,
    setDataProvinsiInstitusiLama,
    dataKabupatenInstitusiLama,
    setDataKabupatenInstitusiLama,
    dataKecamatanInstitusiLama,
    setDataKecamatanInstitusiLama,
    dataDesaInstitusiLama,
    setDataDesaInstitusiLama,
}: {
    selectedData: {
        UniversityId: string
        NamaCountry: string
        NamaProvinsi: string
        NamaKabupaten: string
        NamaKecamatan: string
        NamaDesa: string
    }
    setSelectedData: React.Dispatch<
        React.SetStateAction<{
            UniversityId: string
            NamaCountry: string
            NamaProvinsi: string
            NamaKabupaten: string
            NamaKecamatan: string
            NamaDesa: string
        }>
    >
    openDialog: boolean
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
    loading: boolean
    onSubmit: (data: CalonMahasiswaFormValidation) => void
    form: UseFormReturn<CalonMahasiswaFormValidation>
    titleDialog: string
    countryDataServer: Country[]
    dataProvinsi: Provinsi[]
    setDataProvinsi: React.Dispatch<React.SetStateAction<Provinsi[]>>
    dataKabupaten: Kabupaten[]
    setDataKabupaten: React.Dispatch<React.SetStateAction<Kabupaten[]>>
    dataKecamatan: Kecamatan[]
    setDataKecamatan: React.Dispatch<React.SetStateAction<Kecamatan[]>>
    dataDesa: Desa[]
    setDataDesa: React.Dispatch<React.SetStateAction<Desa[]>>
    dataProvinsiInstitusiLama: Provinsi[]
    setDataProvinsiInstitusiLama: React.Dispatch<
        React.SetStateAction<Provinsi[]>
    >
    dataKabupatenInstitusiLama: Kabupaten[]
    setDataKabupatenInstitusiLama: React.Dispatch<
        React.SetStateAction<Kabupaten[]>
    >
    dataKecamatanInstitusiLama: Kecamatan[]
    setDataKecamatanInstitusiLama: React.Dispatch<
        React.SetStateAction<Kecamatan[]>
    >
    dataDesaInstitusiLama: Desa[]
    setDataDesaInstitusiLama: React.Dispatch<React.SetStateAction<Desa[]>>
    universityDataServer: {
        Nama: string
        UniversityId: string
        ProgramStudi: {
            Nama: string
            ProgramStudiId: string
            Jenjang: string | null
            Akreditasi: string
        }[]
    }[]
}) {
    return (
        <div className="grid grid-cols-2 gap-2">
            <Sheet open={openDialog} onOpenChange={setOpenDialog}>
                <SheetContent
                    side="right"
                    className="w-screen h-screen max-w-full overflow-scroll"
                    onEscapeKeyDown={(event) => event.preventDefault()}
                    onPointerDownOutside={(event) => event.preventDefault()}
                >
                    {loading ? (
                        <div className="flex justify-center mt-3 flex-col">
                            <Skeleton className="w-full my-2 h-20" />
                            <Skeleton className="w-full my-2 h-20" />
                            <Skeleton className="w-full my-2 h-20" />
                            <Skeleton className="w-full my-2 h-20" />
                            <Skeleton className="w-full my-2 h-20" />
                        </div>
                    ) : (
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit, (err) => {
                                    console.dir(err)
                                })}
                            >
                                <SheetHeader>
                                    <SheetTitle>{titleDialog}</SheetTitle>
                                    <SheetDescription>
                                        Manage Data untuk{' '}
                                        {form.getValues('user.Nama')}
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="w-full grid grid-cols-1 gap-3 px-4">
                                    <div className="container mx-auto">
                                        <div className="grid grid-cols-1 gap-3">
                                            <h1 className="leading-none font-medium text-lg">
                                                Program Studi
                                            </h1>
                                            <FormField
                                                control={form.control}
                                                name="programStudi.UniversityId"
                                                render={({ field }) => (
                                                    <Select
                                                        disabled={loading}
                                                        value={field.value}
                                                        onValueChange={(
                                                            value
                                                        ) => {
                                                            setSelectedData({
                                                                ...selectedData,
                                                                UniversityId:
                                                                    value,
                                                            })
                                                            field.onChange(
                                                                value
                                                            )
                                                        }}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Pilih Universitas" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                <SelectLabel>
                                                                    Pilih
                                                                    Universitas
                                                                </SelectLabel>
                                                                {universityDataServer.map(
                                                                    (u) => (
                                                                        <SelectItem
                                                                            key={
                                                                                u.UniversityId
                                                                            }
                                                                            value={
                                                                                u.UniversityId
                                                                            }
                                                                        >
                                                                            {
                                                                                u.Nama
                                                                            }
                                                                        </SelectItem>
                                                                    )
                                                                )}
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="programStudi.ProgramStudiId"
                                                render={({ field }) => (
                                                    <Select
                                                        disabled={
                                                            loading ||
                                                            selectedData.UniversityId ===
                                                                ''
                                                        }
                                                        value={field.value}
                                                        onValueChange={(
                                                            value
                                                        ) => {
                                                            {
                                                                let temp =
                                                                    universityDataServer
                                                                        .find(
                                                                            (
                                                                                x
                                                                            ) =>
                                                                                x.UniversityId ===
                                                                                selectedData.UniversityId
                                                                        )
                                                                        ?.ProgramStudi.find(
                                                                            (
                                                                                y
                                                                            ) =>
                                                                                y.ProgramStudiId ===
                                                                                value
                                                                        )
                                                                field.onChange(
                                                                    value
                                                                )
                                                                if (temp) {
                                                                    form.setValue(
                                                                        'programStudi.NamaProgramStudi',
                                                                        temp?.Nama
                                                                    )
                                                                    form.setValue(
                                                                        'programStudi.JenjangProgramStudi',
                                                                        temp?.Jenjang as Jenjang
                                                                    )
                                                                    form.setValue(
                                                                        'programStudi.AkreditasiProgramStudi',
                                                                        temp?.Akreditasi
                                                                    )
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Pilih Program Studi" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                <SelectLabel>
                                                                    Pilih
                                                                    Program
                                                                    Studi
                                                                </SelectLabel>
                                                                {universityDataServer
                                                                    .find(
                                                                        (x) =>
                                                                            x.UniversityId ===
                                                                            selectedData.UniversityId
                                                                    )
                                                                    ?.ProgramStudi.map(
                                                                        (u) => (
                                                                            <SelectItem
                                                                                key={
                                                                                    u.ProgramStudiId
                                                                                }
                                                                                value={
                                                                                    u.ProgramStudiId
                                                                                }
                                                                            >
                                                                                {
                                                                                    u.Nama
                                                                                }
                                                                            </SelectItem>
                                                                        )
                                                                    )}
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                            <h1 className="leading-none font-medium text-lg mt-5">
                                                Informasi Kependudukan
                                            </h1>
                                            <FormField
                                                control={form.control}
                                                name="informasiKependudukan.NoKk"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            No. Kartu keluarga
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            No. Kartu keluarga
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="informasiKependudukan.NoNik"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            No. NIK
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            No. NIK
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="informasiKependudukan.Suku"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Suku
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Suku
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <h1 className="leading-none font-medium text-lg mt-5">
                                                Informasi Mahasiswa
                                            </h1>
                                            <FormField
                                                control={form.control}
                                                name="user.Nama"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Nama
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Nama
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="user.Email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Email
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Email
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="user.TempatLahir"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Tempat Lahir
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Tempat Lahir
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="user.TanggalLahir"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-col">
                                                        <FormLabel>
                                                            Tanggal Lahir
                                                        </FormLabel>
                                                        <Popover>
                                                            <PopoverTrigger
                                                                asChild
                                                            >
                                                                <FormControl>
                                                                    <Button
                                                                        variant={
                                                                            'outline'
                                                                        }
                                                                        className={cn(
                                                                            'w-[240px] pl-3 text-left font-normal',
                                                                            !field.value &&
                                                                                'text-muted-foreground'
                                                                        )}
                                                                    >
                                                                        {field.value instanceof
                                                                        Date ? (
                                                                            format(
                                                                                field.value,
                                                                                'PPP'
                                                                            )
                                                                        ) : (
                                                                            <span>
                                                                                Pilih
                                                                                Tanggal
                                                                            </span>
                                                                        )}
                                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent
                                                                className="w-auto p-0"
                                                                align="start"
                                                            >
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={
                                                                        field.value
                                                                    }
                                                                    onSelect={
                                                                        field.onChange
                                                                    }
                                                                    disabled={(
                                                                        date
                                                                    ) =>
                                                                        date >
                                                                            new Date() ||
                                                                        date <
                                                                            new Date(
                                                                                '1900-01-01'
                                                                            )
                                                                    }
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                        <FormDescription>
                                                            Tanggal Lahir kamu
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="user.JenisKelamin"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Jenis Kelamin
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                disabled={
                                                                    loading
                                                                }
                                                                value={
                                                                    field.value ??
                                                                    ''
                                                                }
                                                                onValueChange={(
                                                                    value
                                                                ) =>
                                                                    field.onChange(
                                                                        value
                                                                    )
                                                                }
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Jenis Kelamin" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectGroup>
                                                                        <SelectLabel>
                                                                            Jenis
                                                                            Kelamin
                                                                        </SelectLabel>
                                                                        <SelectItem value="PRIA">
                                                                            PRIA
                                                                        </SelectItem>
                                                                        <SelectItem value="WANITA">
                                                                            WANITA
                                                                        </SelectItem>
                                                                    </SelectGroup>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Pilih Jenis Kelamin
                                                            Anda.
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="user.PendidikanTerakhir"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Pendidikan Terakhir
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                disabled={
                                                                    loading
                                                                }
                                                                value={
                                                                    field.value
                                                                }
                                                                onValueChange={(
                                                                    value
                                                                ) =>
                                                                    field.onChange(
                                                                        value
                                                                    )
                                                                }
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Jenis Kelamin" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectGroup>
                                                                        <SelectLabel>
                                                                            Pendidikan
                                                                            Terakhir
                                                                        </SelectLabel>
                                                                        <SelectItem value="TIDAK_TAMAT_SD">
                                                                            TIDAK
                                                                            TAMAT
                                                                            SD
                                                                        </SelectItem>
                                                                        <SelectItem value="SD">
                                                                            SD
                                                                        </SelectItem>
                                                                        <SelectItem value="SMP">
                                                                            SMP
                                                                        </SelectItem>
                                                                        <SelectItem value="SMA">
                                                                            SMA
                                                                        </SelectItem>
                                                                        <SelectItem value="D3">
                                                                            D3
                                                                        </SelectItem>
                                                                        <SelectItem value="S1">
                                                                            S1
                                                                        </SelectItem>
                                                                        <SelectItem value="S2">
                                                                            S2
                                                                        </SelectItem>
                                                                        <SelectItem value="S3">
                                                                            S3
                                                                        </SelectItem>
                                                                    </SelectGroup>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Pendidikan Terakhir
                                                            Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="user.Agama"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Agama
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                disabled={
                                                                    loading
                                                                }
                                                                value={
                                                                    field.value
                                                                }
                                                                onValueChange={(
                                                                    value
                                                                ) =>
                                                                    field.onChange(
                                                                        value
                                                                    )
                                                                }
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Agama" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectGroup>
                                                                        <SelectLabel>
                                                                            Agama
                                                                        </SelectLabel>
                                                                        <SelectItem value="Islam">
                                                                            Islam
                                                                        </SelectItem>
                                                                        <SelectItem value="Kristen">
                                                                            Kristen
                                                                        </SelectItem>
                                                                        <SelectItem value="Hindu">
                                                                            Hindu
                                                                        </SelectItem>
                                                                        <SelectItem value="Budha">
                                                                            Budha
                                                                        </SelectItem>
                                                                        <SelectItem value="Konghucu">
                                                                            Konghucu
                                                                        </SelectItem>
                                                                        <SelectItem value="Lainnya">
                                                                            Lainnya
                                                                        </SelectItem>
                                                                        <SelectItem value="Tidak Punya">
                                                                            Tidak
                                                                            Punya
                                                                        </SelectItem>
                                                                    </SelectGroup>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Pilih Agama Anda.
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="statusPerkawinan"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Status Perkawinan
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                disabled={
                                                                    loading
                                                                }
                                                                value={
                                                                    field.value
                                                                }
                                                                onValueChange={(
                                                                    value
                                                                ) =>
                                                                    field.onChange(
                                                                        value
                                                                    )
                                                                }
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Status Perkawinan" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectGroup>
                                                                        <SelectLabel>
                                                                            Agama
                                                                        </SelectLabel>
                                                                        <SelectItem
                                                                            value={
                                                                                StatusPerkawinan.Lajang
                                                                            }
                                                                        >
                                                                            {
                                                                                StatusPerkawinan.Lajang
                                                                            }
                                                                        </SelectItem>
                                                                        <SelectItem
                                                                            value={
                                                                                StatusPerkawinan.Menikah
                                                                            }
                                                                        >
                                                                            {
                                                                                StatusPerkawinan.Menikah
                                                                            }
                                                                        </SelectItem>
                                                                        <SelectItem
                                                                            value={
                                                                                StatusPerkawinan.Cerai
                                                                            }
                                                                        >
                                                                            {
                                                                                StatusPerkawinan.Cerai
                                                                            }
                                                                        </SelectItem>
                                                                    </SelectGroup>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Pilih Status
                                                            Perkawinan Anda.
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="user.NomorHp"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Nomor HP
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Nomor HP
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="user.NomorWa"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Nomor WhatsApp
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Nomor WhatsApp
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="user.Telepon"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Nomor Telepon
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Nomor Telepon
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <h1 className="leading-none font-medium text-lg mt-5">
                                                Alamat Tinggal Mahasiswa
                                            </h1>
                                            <FormField
                                                control={form.control}
                                                name="alamat.CountryId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Negara
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                disabled={
                                                                    loading
                                                                }
                                                                value={
                                                                    field.value ??
                                                                    ''
                                                                }
                                                                onValueChange={(
                                                                    value
                                                                ) => {
                                                                    setDataKabupaten(
                                                                        []
                                                                    )
                                                                    setDataKecamatan(
                                                                        []
                                                                    )
                                                                    setDataDesa(
                                                                        []
                                                                    )
                                                                    let country =
                                                                        countryDataServer.find(
                                                                            (
                                                                                x
                                                                            ) =>
                                                                                x.CountryId ===
                                                                                value
                                                                        )
                                                                    if (
                                                                        country
                                                                    ) {
                                                                        setSelectedData(
                                                                            {
                                                                                ...selectedData,
                                                                                NamaCountry:
                                                                                    country.Nama,
                                                                            }
                                                                        )
                                                                    }
                                                                    field.onChange(
                                                                        value
                                                                    )
                                                                    form.setValue(
                                                                        'alamat.ProvinsiId',
                                                                        ''
                                                                    )
                                                                    form.setValue(
                                                                        'alamat.KabupatenId',
                                                                        ''
                                                                    )
                                                                    form.setValue(
                                                                        'alamat.KecamatanId',
                                                                        ''
                                                                    )
                                                                    form.setValue(
                                                                        'alamat.DesaId',
                                                                        ''
                                                                    )
                                                                    getProvinsiByCountryId(
                                                                        form.watch(
                                                                            'alamat.CountryId'
                                                                        ) || ''
                                                                    ).then(
                                                                        (res) =>
                                                                            setDataProvinsi(
                                                                                res
                                                                            )
                                                                    )
                                                                }}
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Negara" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {countryDataServer.map(
                                                                        (c) => (
                                                                            <SelectItem
                                                                                value={
                                                                                    c.CountryId
                                                                                }
                                                                                key={
                                                                                    c.CountryId
                                                                                }
                                                                            >
                                                                                {
                                                                                    c.Nama
                                                                                }
                                                                            </SelectItem>
                                                                        )
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Pilih Negara Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="alamat.ProvinsiId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Provinsi
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                disabled={
                                                                    loading
                                                                }
                                                                value={
                                                                    field.value ??
                                                                    ''
                                                                }
                                                                onValueChange={(
                                                                    value
                                                                ) => {
                                                                    field.onChange(
                                                                        value
                                                                    )
                                                                    let data =
                                                                        dataProvinsi.find(
                                                                            (
                                                                                x
                                                                            ) =>
                                                                                x.ProvinsiId ===
                                                                                value
                                                                        )
                                                                    if (data) {
                                                                        setSelectedData(
                                                                            {
                                                                                ...selectedData,
                                                                                NamaProvinsi:
                                                                                    data.Nama,
                                                                            }
                                                                        )
                                                                    }
                                                                    setDataKecamatan(
                                                                        []
                                                                    )
                                                                    setDataDesa(
                                                                        []
                                                                    )
                                                                    form.setValue(
                                                                        'alamat.KabupatenId',
                                                                        ''
                                                                    )
                                                                    form.setValue(
                                                                        'alamat.KecamatanId',
                                                                        ''
                                                                    )
                                                                    form.setValue(
                                                                        'alamat.DesaId',
                                                                        ''
                                                                    )
                                                                    getKabupatenByProvinsiId(
                                                                        form.watch(
                                                                            'alamat.ProvinsiId'
                                                                        ) || ''
                                                                    ).then(
                                                                        (res) =>
                                                                            setDataKabupaten(
                                                                                res
                                                                            )
                                                                    )
                                                                }}
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Provinsi" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {dataProvinsi.map(
                                                                        (p) => (
                                                                            <SelectItem
                                                                                value={
                                                                                    p.ProvinsiId
                                                                                }
                                                                                key={
                                                                                    p.ProvinsiId
                                                                                }
                                                                            >
                                                                                {
                                                                                    p.Nama
                                                                                }
                                                                            </SelectItem>
                                                                        )
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Pilih Provinsi Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="alamat.KabupatenId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Kabupaten
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                disabled={
                                                                    loading
                                                                }
                                                                value={
                                                                    field.value ??
                                                                    ''
                                                                }
                                                                onValueChange={(
                                                                    value
                                                                ) => {
                                                                    field.onChange(
                                                                        value
                                                                    )
                                                                    let data =
                                                                        dataKabupaten.find(
                                                                            (
                                                                                x
                                                                            ) =>
                                                                                x.KabupatenId ===
                                                                                value
                                                                        )
                                                                    if (data) {
                                                                        setSelectedData(
                                                                            {
                                                                                ...selectedData,
                                                                                NamaKabupaten:
                                                                                    data.Nama,
                                                                            }
                                                                        )
                                                                    }
                                                                    setDataDesa(
                                                                        []
                                                                    )
                                                                    form.setValue(
                                                                        'alamat.KecamatanId',
                                                                        ''
                                                                    )
                                                                    form.setValue(
                                                                        'alamat.DesaId',
                                                                        ''
                                                                    )
                                                                    getKecamatanByKabupatenId(
                                                                        form.watch(
                                                                            'alamat.KabupatenId'
                                                                        ) || ''
                                                                    ).then(
                                                                        (res) =>
                                                                            setDataKecamatan(
                                                                                res
                                                                            )
                                                                    )
                                                                }}
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Kabupaten" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {dataKabupaten.map(
                                                                        (p) => (
                                                                            <SelectItem
                                                                                value={
                                                                                    p.KabupatenId
                                                                                }
                                                                                key={
                                                                                    p.KabupatenId
                                                                                }
                                                                            >
                                                                                {
                                                                                    p.Nama
                                                                                }
                                                                            </SelectItem>
                                                                        )
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Pilih Kabupaten Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="alamat.KecamatanId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Kecamatan
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                disabled={
                                                                    loading
                                                                }
                                                                value={
                                                                    field.value ??
                                                                    ''
                                                                }
                                                                onValueChange={(
                                                                    value
                                                                ) => {
                                                                    field.onChange(
                                                                        value
                                                                    )
                                                                    let data =
                                                                        dataKecamatan.find(
                                                                            (
                                                                                x
                                                                            ) =>
                                                                                x.KecamatanId ===
                                                                                value
                                                                        )
                                                                    if (data) {
                                                                        setSelectedData(
                                                                            {
                                                                                ...selectedData,
                                                                                NamaKecamatan:
                                                                                    data.Nama,
                                                                            }
                                                                        )
                                                                    }
                                                                    form.setValue(
                                                                        'alamat.DesaId',
                                                                        ''
                                                                    )
                                                                    getDesaByKecamatanId(
                                                                        form.watch(
                                                                            'alamat.KecamatanId'
                                                                        ) || ''
                                                                    ).then(
                                                                        (res) =>
                                                                            setDataDesa(
                                                                                res
                                                                            )
                                                                    )
                                                                }}
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Kecamatan" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {dataKecamatan.map(
                                                                        (p) => (
                                                                            <SelectItem
                                                                                value={
                                                                                    p.KecamatanId
                                                                                }
                                                                                key={
                                                                                    p.KecamatanId
                                                                                }
                                                                            >
                                                                                {
                                                                                    p.Nama
                                                                                }
                                                                            </SelectItem>
                                                                        )
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Pilih Kecamatan Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="alamat.DesaId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Desa
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                disabled={
                                                                    loading
                                                                }
                                                                value={
                                                                    field.value ??
                                                                    ''
                                                                }
                                                                onValueChange={(
                                                                    val
                                                                ) => {
                                                                    let data =
                                                                        dataDesa.find(
                                                                            (
                                                                                x
                                                                            ) =>
                                                                                x.DesaId ===
                                                                                val
                                                                        )
                                                                    if (data) {
                                                                        setSelectedData(
                                                                            {
                                                                                ...selectedData,
                                                                                NamaDesa:
                                                                                    data.Nama,
                                                                            }
                                                                        )
                                                                    }
                                                                    field.onChange(
                                                                        val
                                                                    )
                                                                }}
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Desa" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {dataDesa.map(
                                                                        (p) => (
                                                                            <SelectItem
                                                                                value={
                                                                                    p.DesaId
                                                                                }
                                                                                key={
                                                                                    p.DesaId
                                                                                }
                                                                            >
                                                                                {
                                                                                    p.Nama
                                                                                }
                                                                            </SelectItem>
                                                                        )
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Pilih Desa Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="alamat.Alamat"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Alamat
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                disabled={
                                                                    loading
                                                                }
                                                                {...field}
                                                                placeholder="Alamat Anda."
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Masukan Alamat
                                                            Lengkap Rumah Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="alamat.KodePos"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Kode Pos
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Kode Pos Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <h1 className="leading-none font-medium text-lg mt-5">
                                                Informasi Pesantren
                                            </h1>
                                            <FormField
                                                control={form.control}
                                                name="pesantren.NamaPesantren"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Nama Pesantren
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Nama Pesantren Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="pesantren.LamaPesantren"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Lama Pesantren
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Lama Pesantren Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <h1 className="leading-none font-medium text-lg mt-5">
                                                Informasi Pendaftaran
                                            </h1>
                                            <FormField
                                                control={form.control}
                                                name="pendaftaran.KodePendaftar"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Kode Pendaftar
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Kode Pendaftar Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="pendaftaran.NoUjian"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Nomor Ujian
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Nomor Ujian Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="pendaftaran.Periode"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Periode
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Periode Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="pendaftaran.Periode"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Periode
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Periode Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="pendaftaran.Gelombang"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Gelombang
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Gelombang Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="pendaftaran.JalurPendaftaran"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Jalur Pendaftaran
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Jalur Pendaftaran
                                                            Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="pendaftaran.SistemKuliah"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Sistem Kuliah
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                disabled={
                                                                    loading
                                                                }
                                                                value={
                                                                    field.value ??
                                                                    ''
                                                                }
                                                                onValueChange={
                                                                    field.onChange
                                                                }
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Sistem Kuliah" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem
                                                                        value={
                                                                            SistemKuliah.REGULER
                                                                        }
                                                                    >
                                                                        {
                                                                            SistemKuliah.REGULER
                                                                        }
                                                                    </SelectItem>
                                                                    <SelectItem
                                                                        value={
                                                                            SistemKuliah.RPL
                                                                        }
                                                                    >
                                                                        {
                                                                            SistemKuliah.RPL
                                                                        }
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Pilih Sistem Kuliah
                                                            Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <h1 className="leading-none font-medium text-lg mt-5">
                                                Informasi Daftar Ulang
                                            </h1>
                                            <FormField
                                                control={form.control}
                                                name="daftarUlang.Nim"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            NIM
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            NIM
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="daftarUlang.JenjangKkniDituju"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Jenjang Kkni Dituju
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Jenjang Kkni Dituju
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="daftarUlang.TanggalDaftar"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-col">
                                                        <FormLabel>
                                                            Tanggal Daftar
                                                        </FormLabel>
                                                        <Popover>
                                                            <PopoverTrigger
                                                                asChild
                                                            >
                                                                <FormControl>
                                                                    <Button
                                                                        variant={
                                                                            'outline'
                                                                        }
                                                                        className={cn(
                                                                            'w-[240px] pl-3 text-left font-normal',
                                                                            !field.value &&
                                                                                'text-muted-foreground'
                                                                        )}
                                                                    >
                                                                        {field.value instanceof
                                                                        Date ? (
                                                                            format(
                                                                                field.value,
                                                                                'PPP'
                                                                            )
                                                                        ) : (
                                                                            <span>
                                                                                Pilih
                                                                                Tanggal
                                                                            </span>
                                                                        )}
                                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent
                                                                className="w-auto p-0"
                                                                align="start"
                                                            >
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={
                                                                        field.value ||
                                                                        new Date()
                                                                    }
                                                                    onSelect={
                                                                        field.onChange
                                                                    }
                                                                    disabled={
                                                                        loading
                                                                    }
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                        <FormDescription>
                                                            Tanggal Daftar
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="daftarUlang.TanggalDaftarUlang"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-col">
                                                        <FormLabel>
                                                            Tanggal Daftar Ulang
                                                        </FormLabel>
                                                        <Popover>
                                                            <PopoverTrigger
                                                                asChild
                                                            >
                                                                <FormControl>
                                                                    <Button
                                                                        variant={
                                                                            'outline'
                                                                        }
                                                                        className={cn(
                                                                            'w-[240px] pl-3 text-left font-normal',
                                                                            !field.value &&
                                                                                'text-muted-foreground'
                                                                        )}
                                                                    >
                                                                        {field.value instanceof
                                                                        Date ? (
                                                                            format(
                                                                                field.value,
                                                                                'PPP'
                                                                            )
                                                                        ) : (
                                                                            <span>
                                                                                Pilih
                                                                                Tanggal
                                                                            </span>
                                                                        )}
                                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent
                                                                className="w-auto p-0"
                                                                align="start"
                                                            >
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={
                                                                        field.value ||
                                                                        new Date()
                                                                    }
                                                                    onSelect={
                                                                        field.onChange
                                                                    }
                                                                    disabled={
                                                                        loading
                                                                    }
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                        <FormDescription>
                                                            Tanggal Daftar Ulang
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="daftarUlang.KipK"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            KIP K
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                disabled={
                                                                    loading
                                                                }
                                                                value={
                                                                    field.value
                                                                        ? '1'
                                                                        : '0'
                                                                }
                                                                onValueChange={(
                                                                    value
                                                                ) =>
                                                                    field.onChange(
                                                                        value ===
                                                                            '1'
                                                                    )
                                                                }
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Status KIP K" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="0">
                                                                        Tidak
                                                                        Mengajukan
                                                                        KIP-K
                                                                    </SelectItem>
                                                                    <SelectItem value="1">
                                                                        Mengajukan
                                                                        KIP-K
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Apakah Mengajukan
                                                            KIP-K
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="daftarUlang.Aktif"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Status Keaktifan
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                disabled={
                                                                    loading
                                                                }
                                                                value={
                                                                    field.value
                                                                        ? '1'
                                                                        : '0'
                                                                }
                                                                onValueChange={(
                                                                    value
                                                                ) =>
                                                                    field.onChange(
                                                                        value ===
                                                                            '1'
                                                                    )
                                                                }
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Status Keaktifan" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="0">
                                                                        Tidak
                                                                        Aktif
                                                                    </SelectItem>
                                                                    <SelectItem value="1">
                                                                        Masih
                                                                        Aktif
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Status Keaktifan
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <h1 className="leading-none font-medium text-lg mt-5">
                                                Informasi Asal Sekolah/Institusi
                                            </h1>
                                            <FormField
                                                control={form.control}
                                                name="institusiLama.NamaInstitusi"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Nama
                                                            Sekolah/Institusi
                                                            Sebelumnya
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Nama
                                                            Sekolah/Institusi
                                                            Sebelumnya
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="institusiLama.Jenjang"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Jenjang
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                disabled={
                                                                    loading
                                                                }
                                                                value={
                                                                    field.value
                                                                }
                                                                onValueChange={(
                                                                    value
                                                                ) =>
                                                                    field.onChange(
                                                                        value
                                                                    )
                                                                }
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Jenjang" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectGroup>
                                                                        <SelectLabel>
                                                                            Pilih
                                                                            Jenjang
                                                                        </SelectLabel>
                                                                        <SelectItem
                                                                            value={
                                                                                Jenjang.TIDAK_TAMAT_SD
                                                                            }
                                                                        >
                                                                            {
                                                                                Jenjang.TIDAK_TAMAT_SD
                                                                            }
                                                                        </SelectItem>
                                                                        <SelectItem
                                                                            value={
                                                                                Jenjang.SD
                                                                            }
                                                                        >
                                                                            {
                                                                                Jenjang.SD
                                                                            }
                                                                        </SelectItem>
                                                                        <SelectItem
                                                                            value={
                                                                                Jenjang.SMP
                                                                            }
                                                                        >
                                                                            {
                                                                                Jenjang.SMP
                                                                            }
                                                                        </SelectItem>
                                                                        <SelectItem
                                                                            value={
                                                                                Jenjang.SMA
                                                                            }
                                                                        >
                                                                            {
                                                                                Jenjang.SMA
                                                                            }
                                                                        </SelectItem>
                                                                        <SelectItem
                                                                            value={
                                                                                Jenjang.D3
                                                                            }
                                                                        >
                                                                            {
                                                                                Jenjang.D3
                                                                            }
                                                                        </SelectItem>
                                                                        <SelectItem
                                                                            value={
                                                                                Jenjang.S1
                                                                            }
                                                                        >
                                                                            {
                                                                                Jenjang.S1
                                                                            }
                                                                        </SelectItem>
                                                                        <SelectItem
                                                                            value={
                                                                                Jenjang.S2
                                                                            }
                                                                        >
                                                                            {
                                                                                Jenjang.S2
                                                                            }
                                                                        </SelectItem>
                                                                        <SelectItem
                                                                            value={
                                                                                Jenjang.S3
                                                                            }
                                                                        >
                                                                            {
                                                                                Jenjang.S3
                                                                            }
                                                                        </SelectItem>
                                                                    </SelectGroup>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="institusiLama.JenisInstitusi"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Jenis
                                                            Sekolah/Institusi
                                                            Sebelumnya
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Jenis
                                                            Sekolah/Institusi
                                                            Sebelumnya
                                                            (SMA/SMK/MA/MAK)
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="institusiLama.Jurusan"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Jurusan
                                                            Sekolah/Institusi
                                                            Sebelumnya
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Jurusan
                                                            Sekolah/Institusi
                                                            Sebelumnya
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="institusiLama.Nisn"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Nomor Induk Siswa
                                                            Nasional
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Nomor Induk Siswa
                                                            Nasional
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="institusiLama.Npsn"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Nomor Pokok Sekolah
                                                            Nasional
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Nomor Pokok Sekolah
                                                            Nasional Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="institusiLama.NilaiLulusan"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Nilai Lulusan UN
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                value={
                                                                    field.value
                                                                }
                                                                onChange={(
                                                                    val
                                                                ) =>
                                                                    field.onChange(
                                                                        val
                                                                    )
                                                                }
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Nilai Lulusan UN
                                                            Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="institusiLama.TahunLulus"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Tahun Lulus
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Tahun Lulus Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="institusiLama.AlamatInstitusiLama.CountryId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Negara
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                disabled={
                                                                    loading
                                                                }
                                                                value={
                                                                    field.value ??
                                                                    ''
                                                                }
                                                                onValueChange={(
                                                                    value
                                                                ) => {
                                                                    setDataKabupatenInstitusiLama(
                                                                        []
                                                                    )
                                                                    setDataKecamatanInstitusiLama(
                                                                        []
                                                                    )
                                                                    setDataDesaInstitusiLama(
                                                                        []
                                                                    )
                                                                    field.onChange(
                                                                        value
                                                                    )
                                                                    form.setValue(
                                                                        'institusiLama.AlamatInstitusiLama.ProvinsiId',
                                                                        ''
                                                                    )
                                                                    form.setValue(
                                                                        'institusiLama.AlamatInstitusiLama.KabupatenId',
                                                                        ''
                                                                    )
                                                                    form.setValue(
                                                                        'institusiLama.AlamatInstitusiLama.KecamatanId',
                                                                        ''
                                                                    )
                                                                    form.setValue(
                                                                        'institusiLama.AlamatInstitusiLama.DesaId',
                                                                        ''
                                                                    )
                                                                    getProvinsiByCountryId(
                                                                        form.watch(
                                                                            'institusiLama.AlamatInstitusiLama.CountryId'
                                                                        ) || ''
                                                                    ).then(
                                                                        (res) =>
                                                                            setDataProvinsiInstitusiLama(
                                                                                res
                                                                            )
                                                                    )
                                                                }}
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Negara" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {countryDataServer.map(
                                                                        (c) => (
                                                                            <SelectItem
                                                                                value={
                                                                                    c.CountryId
                                                                                }
                                                                                key={
                                                                                    c.CountryId
                                                                                }
                                                                            >
                                                                                {
                                                                                    c.Nama
                                                                                }
                                                                            </SelectItem>
                                                                        )
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Pilih Negara
                                                            Sekolah/Institusi
                                                            Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="institusiLama.AlamatInstitusiLama.ProvinsiId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Provinsi
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                disabled={
                                                                    loading
                                                                }
                                                                value={
                                                                    field.value ??
                                                                    ''
                                                                }
                                                                onValueChange={(
                                                                    value
                                                                ) => {
                                                                    field.onChange(
                                                                        value
                                                                    )
                                                                    setDataKecamatanInstitusiLama(
                                                                        []
                                                                    )
                                                                    setDataDesaInstitusiLama(
                                                                        []
                                                                    )
                                                                    form.setValue(
                                                                        'institusiLama.AlamatInstitusiLama.KabupatenId',
                                                                        ''
                                                                    )
                                                                    form.setValue(
                                                                        'institusiLama.AlamatInstitusiLama.KecamatanId',
                                                                        ''
                                                                    )
                                                                    form.setValue(
                                                                        'institusiLama.AlamatInstitusiLama.DesaId',
                                                                        ''
                                                                    )
                                                                    getKabupatenByProvinsiId(
                                                                        form.watch(
                                                                            'institusiLama.AlamatInstitusiLama.ProvinsiId'
                                                                        ) || ''
                                                                    ).then(
                                                                        (res) =>
                                                                            setDataKabupatenInstitusiLama(
                                                                                res
                                                                            )
                                                                    )
                                                                }}
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Provinsi" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {dataProvinsiInstitusiLama.map(
                                                                        (p) => (
                                                                            <SelectItem
                                                                                value={
                                                                                    p.ProvinsiId
                                                                                }
                                                                                key={
                                                                                    p.ProvinsiId
                                                                                }
                                                                            >
                                                                                {
                                                                                    p.Nama
                                                                                }
                                                                            </SelectItem>
                                                                        )
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Pilih Provinsi
                                                            Sekolah/Institusi
                                                            Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="institusiLama.AlamatInstitusiLama.KabupatenId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Kabupaten
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                disabled={
                                                                    loading
                                                                }
                                                                value={
                                                                    field.value ??
                                                                    ''
                                                                }
                                                                onValueChange={(
                                                                    value
                                                                ) => {
                                                                    field.onChange(
                                                                        value
                                                                    )
                                                                    setDataDesaInstitusiLama(
                                                                        []
                                                                    )
                                                                    form.setValue(
                                                                        'institusiLama.AlamatInstitusiLama.KecamatanId',
                                                                        ''
                                                                    )
                                                                    form.setValue(
                                                                        'institusiLama.AlamatInstitusiLama.DesaId',
                                                                        ''
                                                                    )
                                                                    getKecamatanByKabupatenId(
                                                                        form.watch(
                                                                            'institusiLama.AlamatInstitusiLama.KabupatenId'
                                                                        ) || ''
                                                                    ).then(
                                                                        (res) =>
                                                                            setDataKecamatanInstitusiLama(
                                                                                res
                                                                            )
                                                                    )
                                                                }}
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Kabupaten" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {dataKabupatenInstitusiLama.map(
                                                                        (p) => (
                                                                            <SelectItem
                                                                                value={
                                                                                    p.KabupatenId
                                                                                }
                                                                                key={
                                                                                    p.KabupatenId
                                                                                }
                                                                            >
                                                                                {
                                                                                    p.Nama
                                                                                }
                                                                            </SelectItem>
                                                                        )
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Pilih Kabupaten
                                                            Sekolah/Institusi
                                                            Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="institusiLama.AlamatInstitusiLama.KecamatanId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Kecamatan
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                disabled={
                                                                    loading
                                                                }
                                                                value={
                                                                    field.value ??
                                                                    ''
                                                                }
                                                                onValueChange={(
                                                                    value
                                                                ) => {
                                                                    field.onChange(
                                                                        value
                                                                    )
                                                                    form.setValue(
                                                                        'institusiLama.AlamatInstitusiLama.DesaId',
                                                                        ''
                                                                    )
                                                                    getDesaByKecamatanId(
                                                                        form.watch(
                                                                            'institusiLama.AlamatInstitusiLama.KecamatanId'
                                                                        ) || ''
                                                                    ).then(
                                                                        (res) =>
                                                                            setDataDesaInstitusiLama(
                                                                                res
                                                                            )
                                                                    )
                                                                }}
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Kecamatan" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {dataKecamatanInstitusiLama.map(
                                                                        (p) => (
                                                                            <SelectItem
                                                                                value={
                                                                                    p.KecamatanId
                                                                                }
                                                                                key={
                                                                                    p.KecamatanId
                                                                                }
                                                                            >
                                                                                {
                                                                                    p.Nama
                                                                                }
                                                                            </SelectItem>
                                                                        )
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Pilih Kecamatan
                                                            Sekolah/Institusi
                                                            Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="institusiLama.AlamatInstitusiLama.DesaId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Desa
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Select
                                                                disabled={
                                                                    loading
                                                                }
                                                                value={
                                                                    field.value ??
                                                                    ''
                                                                }
                                                                onValueChange={(
                                                                    val
                                                                ) => {
                                                                    field.onChange(
                                                                        val
                                                                    )
                                                                }}
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Desa" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {dataDesaInstitusiLama.map(
                                                                        (p) => (
                                                                            <SelectItem
                                                                                value={
                                                                                    p.DesaId
                                                                                }
                                                                                key={
                                                                                    p.DesaId
                                                                                }
                                                                            >
                                                                                {
                                                                                    p.Nama
                                                                                }
                                                                            </SelectItem>
                                                                        )
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Pilih Desa
                                                            Sekolah/Institusi
                                                            Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="institusiLama.AlamatInstitusiLama.Alamat"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Alamat
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                disabled={
                                                                    loading
                                                                }
                                                                {...field}
                                                                placeholder="Alamat Anda."
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Masukan Alamat
                                                            Lengkap
                                                            Sekolah/Institusi
                                                            Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="institusiLama.AlamatInstitusiLama.KodePos"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Kode Pos
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                readOnly={
                                                                    loading
                                                                }
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Kode Pos
                                                            Sekolah/Institusi
                                                            Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <SheetFooter>
                                    <Button type="submit" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <Timer />
                                                Loading
                                            </>
                                        ) : (
                                            <>
                                                <PenIcon /> Simpan
                                            </>
                                        )}
                                    </Button>
                                </SheetFooter>
                            </form>
                        </Form>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}

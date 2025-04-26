'use client'
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { NumericFormat } from 'react-number-format'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '../ui/select'
import { Button } from '../ui/button'
import { PenIcon, PlusCircle, TimerIcon, Trash2 } from 'lucide-react'
import Swal from 'sweetalert2'
import { toast } from 'sonner'
import { replaceItemAtIndex } from '@/lib/utils'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog'
import { Input } from '../ui/input'
import { useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table'
import { Skeleton } from '../ui/skeleton'
import {
    BuktiFormFormValidation,
    BuktiFormSkemaValidation,
} from '@/validation/BuktiFormValidation'
import { BuktiFormTypes } from '@/types/BuktiFormUploadDokumenTypes'
import { JenisDokumen, StatusPerkawinan } from '@/generated/prisma'

const UploadDokumen = ({
    dataMahasiswa,
    jenisDokumen,
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
    jenisDokumen: JenisDokumen[]
}) => {
    const [selectableMahasiswa, setSelectableMahasiswa] =
        React.useState<string>('')
    const [data, setData] = React.useState<BuktiFormTypes[]>([])
    const [loading, setLoading] = React.useState<boolean>(false)
    const [loadingAwal, setLoadingAwal] = React.useState<boolean>(false)
    const [openDialog, setOpenDialog] = React.useState<boolean>(false)
    const [titleDialog, setTitleDialog] = React.useState<string>('')
    const form = useForm<BuktiFormFormValidation>({
        resolver: zodResolver(BuktiFormSkemaValidation),
        defaultValues: {
            BuktiFormId: undefined,
            JenisDokumenId: '',
            NamaFile: undefined,
        },
    })

    React.useEffect(() => {
        setLoadingAwal(true)
        getOrangTuaByPendaftaranId(selectableMahasiswa)
            .then((res) => {
                setData(res)
                setLoadingAwal(false)
            })
            .catch((res) => {
                setLoadingAwal(false)
            })
    }, [selectableMahasiswa])

    const tambahData = () => {
        form.reset()
        setTitleDialog('Tambah Dokumen')
        setOpenDialog(true)
    }

    const hapusData = (e: BuktiFormTypes) => {
        Swal.fire({
            title: 'Ingin Hapus ' + e.NamaFile + ' ?',
            text: 'Aksi ini tidak dapat di undo',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f45f24',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteOrangTua(e.BuktiFormId).then(() => {
                    setData(data.filter((r) => r.BuktiFormId !== e.BuktiFormId))
                    Swal.fire({
                        title: 'Terhapus!',
                        text: 'Data sudah dihapus.',
                        icon: 'success',
                    })
                })
            }
        })
    }

    const onSubmit = async (dataSubmit: BuktiFormFormValidation) => {
        setLoading(true)
        setOrangTua({
            PendaftaranId: selectableMahasiswa,
            OrangTuaId: '',
            Nama: dataSubmit.Nama,
            Pekerjaan:
                dataSubmit.Pekerjaan === undefined
                    ? null
                    : dataSubmit.Pekerjaan,
            JenisOrtu: dataSubmit.JenisOrtu as JenisOrtu,
            NomorHp: dataSubmit.NomorHp,
            Penghasilan: Number(dataSubmit.Penghasilan),
            Email: dataSubmit.Email,
            CreatedAt: null,
            UpdatedAt: null,
        }).then((res) => {
            setData([...data, res])
            toast('Data Orang Tua Disimpan')
            setOpenDialog(false)
            form.reset()
            setLoading(false)
        })
    }

    return <div></div>
}

export default UploadDokumen

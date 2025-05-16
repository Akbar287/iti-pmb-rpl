'use client'

import React from 'react'
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import {
    CalendarIcon,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    PenIcon,
    Timer,
    UserCog2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    getUserId,
    getUserPagination,
    resetPassword,
    setAssignRoleIntoUser,
    updateUser,
    setUser as setUserData,
} from '@/services/ManajemenData/UserService'
import { Skeleton } from '@/components/ui/skeleton'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { cn, replaceItemAtIndex, truncateText } from '@/lib/utils'
import { RolePermission } from '@/types/RoleAndPermission'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { UserTable } from '@/types/types'
import Swal from 'sweetalert2'
import { useForm, UseFormReturn } from 'react-hook-form'
import {
    UserCreateFormValidation,
    UserCreateSkemaValidation,
} from '@/validation/ProfilValidation'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Country,
    Desa,
    JenisKelamin,
    Kabupaten,
    Kecamatan,
    Provinsi,
} from '@/generated/prisma'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import {
    getDesaByKecamatanId,
    getDesaId,
    getKabupatenByProvinsiId,
    getKecamatanByKabupatenId,
    getProvinsiByCountryId,
} from '@/services/AreaServices'
import { Textarea } from '@/components/ui/textarea'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export function UserDataTable({
    roleDataServer,
    countryDataServer,
}: {
    roleDataServer: RolePermission
    countryDataServer: Country[]
}) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [users, setUsers] = React.useState<UserTable[]>([])
    const [selectedUser, setSelectedUser] = React.useState<UserTable>()
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
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
    const [search, setSearch] = React.useState('')
    const [titleDialog, setTitleDialog] = React.useState('')
    const [loading, setLoading] = React.useState<boolean>(false)
    const [countryData, setCountryData] =
        React.useState<Country[]>(countryDataServer)
    const [provinsiData, setProvinsiData] = React.useState<Provinsi[]>([])
    const [kabupatenData, setKabupatenData] = React.useState<Kabupaten[]>([])
    const [kecamatanData, setKecamatanData] = React.useState<Kecamatan[]>([])
    const [desaData, setDesaData] = React.useState<Desa[]>([])
    const [userIdData, setUserIdData] = React.useState<string>('')

    // Assign Role
    const [loadingAssignRole, setLoadingAssignRole] =
        React.useState<boolean>(false)
    const [openDialogAssignRole, setOpenDialogAssignRole] =
        React.useState<boolean>(false)
    const setAssignRole = (user: UserTable) => {
        setSelectedUser(user)
        setOpenDialogAssignRole(true)
    }
    const saveAssignRole = async () => {
        if (selectedUser) {
            setLoadingAssignRole(true)
            await setAssignRoleIntoUser(selectedUser)
                .then((res) => {
                    const idx = users.findIndex(
                        (user) => user.UserId === selectedUser.UserId
                    )
                    if (idx !== -1) {
                        setUsers(replaceItemAtIndex(users, idx, res))
                    }
                    toast('Berhasil Assign Role')
                    setOpenDialogAssignRole(false)
                    setLoadingAssignRole(false)
                })
                .catch((err) => {
                    toast('Gagal Assign Role. Error: ' + err)
                    setLoadingAssignRole(false)
                })
        }
    }
    // End Assign Role

    // Manage Data
    const [openDialogUser, setOpenDialogUser] = React.useState<boolean>(false)
    const createManageData = () => {
        setTitleDialog('Tambah Data Pengguna')
        setOpenDialogUser(true)
        setLoadingAssignRole(true)
        form.reset()
        form.setValue('Avatar', 'default.png')
        setProvinsiData([])
        setKabupatenData([])
        setKecamatanData([])
        setDesaData([])
        setUserIdData('')
        setLoadingAssignRole(false)
    }
    const setManageData = async (user: UserTable) => {
        setOpenDialogUser(true)
        setLoadingAssignRole(true)
        await getUserId(user.UserId)
            .then(async (res) => {
                setSelectedUser(user)
                setTitleDialog('Ubah Data Pengguna')
                setLoadingAssignRole(false)
                if (res !== null) {
                    setUserIdData(res.UserId)
                    if (res.Alamat) {
                        await getProvinsiByCountryId(res.Alamat?.CountryId)
                            .then((res) => {
                                setProvinsiData(res)
                            })
                            .catch((err) =>
                                toast('Terjadi Kesalahan, Error: ' + err)
                            )
                        await getKabupatenByProvinsiId(res?.Alamat?.ProvinsiId)
                            .then((res) => {
                                setKabupatenData(res)
                            })
                            .catch((err) =>
                                toast('Terjadi Kesalahan, Error: ' + err)
                            )
                        await getKecamatanByKabupatenId(
                            res?.Alamat?.KabupatenId
                        )
                            .then((res) => {
                                setKecamatanData(res)
                            })
                            .catch((err) =>
                                toast('Terjadi Kesalahan, Error: ' + err)
                            )
                        await getDesaByKecamatanId(res?.Alamat?.KecamatanId)
                            .then((res) => {
                                setDesaData(res)
                            })
                            .catch((err) =>
                                toast('Terjadi Kesalahan, Error: ' + err)
                            )
                        await getDesaId(res?.Alamat?.DesaId)
                            .then((res) => {})
                            .catch((err) => {})
                        form.setValue('CountryId', res.Alamat.CountryId)
                        form.setValue('ProvinsiId', res.Alamat.ProvinsiId)
                        form.setValue('KabupatenId', res.Alamat.KabupatenId)
                        form.setValue('KecamatanId', res.Alamat.KecamatanId)
                        form.setValue('DesaId', res.Alamat.DesaId)
                        form.setValue('Alamat', res.Alamat.Alamat)
                        form.setValue('KodePos', res.Alamat.KodePos)
                    }
                    form.setValue('Nama', res.Nama || '')
                    form.setValue('Email', res.Email || '')
                    form.setValue('Username', res.Username || '')
                    form.setValue('TempatLahir', res.TempatLahir || '')
                    form.setValue(
                        'TanggalLahir',
                        res.TanggalLahir
                            ? new Date(res.TanggalLahir)
                            : new Date()
                    )
                    form.setValue('JenisKelamin', res.JenisKelamin)
                    form.setValue('PendidikanTerakhir', res.PendidikanTerakhir)
                    form.setValue('Avatar', res.Avatar || 'default.png')
                    form.setValue('Agama', res.Agama || '')
                    form.setValue('Telepon', res.Telepon || '')
                    form.setValue('NomorWa', res.NomorWa || '')
                    form.setValue('NomorHp', res.NomorHp || '')
                }
            })
            .catch((err) => {
                setLoadingAssignRole(false)
                toast('Ada Kesalahan, err: ' + err)
            })
    }

    const form = useForm<UserCreateFormValidation>({
        resolver: zodResolver(UserCreateSkemaValidation),
        defaultValues: {
            CountryId: '',
            ProvinsiId: '',
            KabupatenId: '',
            KecamatanId: '',
            DesaId: '',
            Alamat: '',
            KodePos: '',
            Nama: '',
            Email: '',
            Username: '',
            TempatLahir: undefined,
            TanggalLahir: undefined,
            JenisKelamin: undefined,
            PendidikanTerakhir: undefined,
            Avatar: '',
            Agama: '',
            Telepon: '',
            NomorWa: '',
            NomorHp: '',
        },
    })
    const onSubmit = async (data: UserCreateFormValidation) => {
        setLoading(true)

        if (titleDialog === 'Ubah Data Pengguna' && userIdData !== '') {
            await updateUser(userIdData, {
                Username: form.getValues('Username'),
                Password: form.getValues('Username'),
                Nama: form.getValues('Nama'),
                Email: form.getValues('Email'),
                TempatLahir: form.getValues('TempatLahir'),
                TanggalLahir: form.getValues('TanggalLahir'),
                JenisKelamin:
                    form.getValues('JenisKelamin') || JenisKelamin.PRIA,
                PendidikanTerakhir:
                    form.getValues('PendidikanTerakhir') || 'TIDAK_TAMAT_SD',
                Avatar: form.getValues('Avatar'),
                Agama: form.getValues('Agama'),
                Telepon: form.getValues('Telepon'),
                NomorWa: form.getValues('NomorWa'),
                NomorHp: form.getValues('NomorHp'),
                Alamat: form.getValues('Alamat'),
                KodePos: form.getValues('KodePos'),
                DesaId: form.getValues('DesaId'),
                Role: [],
            })
                .then((res) => {
                    toast('Data Pengguna berhasil diubah')
                    let idx = users.findIndex(
                        (u) => u.Username === form.getValues('Username')
                    )
                    setUsers(
                        replaceItemAtIndex(users, idx, {
                            UserId: res?.UserId || '',
                            Username: res?.Username || '',
                            Nama: res?.Nama || '',
                            Email: res?.Email || '',
                            NomorWa: res?.NomorWa || '',
                            Role: res?.Role
                                ? res.Role.map((r) => r.NamaRole).join(', ')
                                : null,
                        })
                    )
                    setUserIdData('')
                    setOpenDialogUser(false)
                    setLoading(false)
                })
                .catch((err) => {
                    toast('Data Pengguna gagal diubah. Error: ' + err)
                    setLoading(false)
                })
        } else {
            await setUserData({
                Username: form.getValues('Username'),
                Password: form.getValues('Username'),
                Nama: form.getValues('Nama'),
                Email: form.getValues('Email'),
                TempatLahir: form.getValues('TempatLahir'),
                TanggalLahir: form.getValues('TanggalLahir'),
                JenisKelamin:
                    form.getValues('JenisKelamin') || JenisKelamin.PRIA,
                PendidikanTerakhir:
                    form.getValues('PendidikanTerakhir') || 'TIDAK_TAMAT_SD',
                Avatar: form.getValues('Avatar'),
                Agama: form.getValues('Agama'),
                Telepon: form.getValues('Telepon'),
                NomorWa: form.getValues('NomorWa'),
                NomorHp: form.getValues('NomorHp'),
                Alamat: form.getValues('Alamat'),
                KodePos: form.getValues('KodePos'),
                DesaId: form.getValues('DesaId'),
                Role: [],
            })
                .then((res) => {
                    toast('Data Pengguna berhasil ditambah')
                    setUsers([
                        ...users,
                        {
                            UserId: res?.UserId || '',
                            Username: res?.Username || '',
                            Nama: res?.Nama || '',
                            Email: res?.Email || '',
                            NomorWa: res?.NomorWa || '',
                            Role: res?.Role
                                ? res.Role.map((r) => r.NamaRole).join(', ')
                                : null,
                        },
                    ])
                    setLoading(false)
                    setOpenDialogUser(false)
                })
                .catch((err) => {
                    toast('Data Pengguna gagal ditambah. Error: ' + err)
                    setLoading(false)
                })
        }
    }

    const resetPasswordUser = (user: UserTable) => {
        Swal.fire({
            title: 'Reset Password ' + user.Nama + ' ?',
            text: 'Aksi ini tidak dapat di undo',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f45f24',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Reset!',
        }).then((result) => {
            if (result.isConfirmed) {
                resetPassword(user.UserId).then(() => {
                    Swal.fire({
                        title: 'Tereset!',
                        text: 'Password sudah diatur ke Username.',
                        icon: 'success',
                    })
                })
            }
        })
    }

    // End Manage Data

    React.useEffect(() => {
        setLoading(true)
        getUserPagination(paginationState.page, paginationState.limit, search)
            .then((res) => {
                setUsers(
                    res.data.map((d) => ({
                        UserId: d.UserId || '',
                        Username: d.Username || '',
                        Nama: d.Nama || '',
                        Email: d.Email || '',
                        // Avatar: d.Avatar || '',
                        NomorWa: d.NomorWa || '',
                        // NomorHp: d.NomorHp || '',
                        Role: d.Role.map((r) => r.NamaRole).join(', '),
                    }))
                )
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

    const columns: ColumnDef<UserTable>[] = [
        {
            accessorKey: 'Username',
            header: 'Username',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('Username')}</div>
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
            accessorKey: 'Email',
            header: 'Email',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('Email')}</div>
            ),
        },
        {
            accessorKey: 'NomorWa',
            header: 'NomorWa',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('NomorWa')}</div>
            ),
        },
        {
            accessorKey: 'Role',
            header: 'Role',
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.getValue('Role')
                        ? truncateText(row.getValue('Role'), 30)
                        : ''}
                </div>
            ),
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }) => {
                const user = row.original
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
                                    navigator.clipboard.writeText(user.UserId)
                                }
                            >
                                Copy User ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => setManageData(user)}
                            >
                                Manage Data
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setAssignRole(user)}
                            >
                                Assign Role
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => resetPasswordUser(user)}
                            >
                                Reset Password
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    const table = useReactTable({
        data: users,
        columns,
        onSortingChange: setSorting,
        manualPagination: true,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        pageCount: paginationState.totalPage,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter Username"
                    value={search}
                    onChange={(event) => {
                        setPaginationState({ ...paginationState, page: 1 })
                        setSearch(event.target.value)
                    }}
                    className="max-w-sm"
                />
                <div className="w-full justify-end flex">
                    <Button className="mr-2" onClick={() => createManageData()}>
                        Tambah
                    </Button>
                    <Select
                        value={String(paginationState.limit)}
                        onValueChange={(value) =>
                            setPaginationState({
                                ...paginationState,
                                limit: Number(value),
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

                    {Array.from(
                        { length: paginationState.totalPage },
                        (_, i) => i + 1
                    ).map((p) => (
                        <Button
                            key={p}
                            variant={
                                p === paginationState.page
                                    ? 'default'
                                    : 'outline'
                            }
                            size="sm"
                            onClick={() => {
                                if (paginationState.page !== p) {
                                    setPaginationState({
                                        ...paginationState,
                                        page: p,
                                    })
                                }
                            }}
                        >
                            {p}
                        </Button>
                    ))}

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
            <SheetAssignRole
                openDialogUser={openDialogAssignRole}
                setOpenDialogUser={setOpenDialogAssignRole}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                saveAssignRole={saveAssignRole}
                loadingAssignRole={loadingAssignRole}
                roleDataServer={roleDataServer}
            />
            <SheetManageData
                openDialogUser={openDialogUser}
                setOpenDialogUser={setOpenDialogUser}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                loadingAssignRole={loadingAssignRole}
                form={form}
                loading={loading}
                onSubmit={onSubmit}
                countryData={countryData}
                setCountryData={setCountryData}
                provinsiData={provinsiData}
                setProvinsiData={setProvinsiData}
                kabupatenData={kabupatenData}
                setKabupatenData={setKabupatenData}
                kecamatanData={kecamatanData}
                setKecamatanData={setKecamatanData}
                desaData={desaData}
                setDesaData={setDesaData}
                titleDialog={titleDialog}
            />
        </div>
    )
}

export function SheetManageData({
    openDialogUser,
    setOpenDialogUser,
    selectedUser,
    loadingAssignRole,
    onSubmit,
    loading,
    setSelectedUser,
    form,
    countryData,
    setCountryData,
    provinsiData,
    setProvinsiData,
    kabupatenData,
    setKabupatenData,
    kecamatanData,
    setKecamatanData,
    desaData,
    setDesaData,
    titleDialog,
}: {
    openDialogUser: boolean
    setOpenDialogUser: React.Dispatch<React.SetStateAction<boolean>>
    selectedUser: UserTable | undefined
    loadingAssignRole: boolean
    loading: boolean
    onSubmit: (data: UserCreateFormValidation) => void
    form: UseFormReturn<UserCreateFormValidation>
    setSelectedUser: React.Dispatch<React.SetStateAction<UserTable | undefined>>
    countryData: Country[]
    setCountryData: React.Dispatch<React.SetStateAction<Country[]>>
    provinsiData: Provinsi[]
    setProvinsiData: React.Dispatch<React.SetStateAction<Provinsi[]>>
    kabupatenData: Kabupaten[]
    setKabupatenData: React.Dispatch<React.SetStateAction<Kabupaten[]>>
    kecamatanData: Kecamatan[]
    setKecamatanData: React.Dispatch<React.SetStateAction<Kecamatan[]>>
    desaData: Desa[]
    setDesaData: React.Dispatch<React.SetStateAction<Desa[]>>
    titleDialog: string
}) {
    return (
        <div className="grid grid-cols-2 gap-2">
            <Sheet open={openDialogUser} onOpenChange={setOpenDialogUser}>
                <SheetContent
                    side="right"
                    className="w-screen h-screen max-w-full overflow-scroll"
                >
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <SheetHeader>
                                <SheetTitle>{titleDialog}</SheetTitle>
                                <SheetDescription>
                                    Manage Data untuk{' '}
                                    {selectedUser
                                        ? selectedUser.Nama
                                        : 'Nama Pengguna'}
                                </SheetDescription>
                            </SheetHeader>
                            {loadingAssignRole ? (
                                <div className="w-full grid grid-cols-1 gap-3 px-4">
                                    <Skeleton className="w-full h-20" />
                                    <Skeleton className="w-full h-20" />
                                    <Skeleton className="w-full h-20" />
                                    <Skeleton className="w-full h-20" />
                                </div>
                            ) : (
                                <div className="w-full grid grid-cols-1 gap-3 px-4">
                                    <div className="flex w-full justify-center">
                                        <Avatar className="w-1/2 h-40 aspect-square ">
                                            <AvatarImage
                                                src={
                                                    BASE_URL +
                                                    '/api/protected/avatar?avatar=' +
                                                    form.getValues('Avatar')
                                                }
                                                alt={form.getValues('Nama')}
                                            />
                                            <AvatarFallback>
                                                {form.getValues('Nama')}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>

                                    <div className="container mx-auto">
                                        <div className="grid grid-cols-1 gap-3">
                                            <FormField
                                                control={form.control}
                                                name="Nama"
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
                                                            Nama Pengguna
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="Username"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Username
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
                                                            Username anda.
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="Email"
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
                                                            Email aktif anda.
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="TempatLahir"
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
                                                                value={
                                                                    field.value ??
                                                                    ''
                                                                }
                                                                onChange={(e) =>
                                                                    form.setValue(
                                                                        'TempatLahir',
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Masukan Kota Tempat
                                                            Lahir Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="TanggalLahir"
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
                                                name="JenisKelamin"
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
                                                                onValueChange={
                                                                    field.onChange
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
                                                name="PendidikanTerakhir"
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
                                                                onValueChange={
                                                                    field.onChange
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
                                                name="Agama"
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
                                                                onValueChange={
                                                                    field.onChange
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
                                                name="Telepon"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Telepon
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
                                                            Nomor Telepon Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="NomorHp"
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
                                                            Nomor HP Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="NomorWa"
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
                                                            Nomor WhatsApp Anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="CountryId"
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
                                                                    setKabupatenData(
                                                                        []
                                                                    )
                                                                    setKecamatanData(
                                                                        []
                                                                    )
                                                                    setDesaData(
                                                                        []
                                                                    )
                                                                    field.onChange(
                                                                        value
                                                                    )
                                                                    form.setValue(
                                                                        'ProvinsiId',
                                                                        ''
                                                                    )
                                                                    form.setValue(
                                                                        'KabupatenId',
                                                                        ''
                                                                    )
                                                                    form.setValue(
                                                                        'KecamatanId',
                                                                        ''
                                                                    )
                                                                    form.setValue(
                                                                        'DesaId',
                                                                        ''
                                                                    )
                                                                    getProvinsiByCountryId(
                                                                        form.watch(
                                                                            'CountryId'
                                                                        ) || ''
                                                                    ).then(
                                                                        (res) =>
                                                                            setProvinsiData(
                                                                                res
                                                                            )
                                                                    )
                                                                }}
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Negara" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {countryData.map(
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
                                                name="ProvinsiId"
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
                                                                    setKecamatanData(
                                                                        []
                                                                    )
                                                                    setDesaData(
                                                                        []
                                                                    )
                                                                    form.setValue(
                                                                        'KabupatenId',
                                                                        ''
                                                                    )
                                                                    form.setValue(
                                                                        'KecamatanId',
                                                                        ''
                                                                    )
                                                                    form.setValue(
                                                                        'DesaId',
                                                                        ''
                                                                    )
                                                                    getKabupatenByProvinsiId(
                                                                        form.watch(
                                                                            'ProvinsiId'
                                                                        ) || ''
                                                                    ).then(
                                                                        (res) =>
                                                                            setKabupatenData(
                                                                                res
                                                                            )
                                                                    )
                                                                }}
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Provinsi" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {provinsiData.map(
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
                                                name="KabupatenId"
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
                                                                    setDesaData(
                                                                        []
                                                                    )
                                                                    form.setValue(
                                                                        'KecamatanId',
                                                                        ''
                                                                    )
                                                                    form.setValue(
                                                                        'DesaId',
                                                                        ''
                                                                    )
                                                                    getKecamatanByKabupatenId(
                                                                        form.watch(
                                                                            'KabupatenId'
                                                                        ) || ''
                                                                    ).then(
                                                                        (res) =>
                                                                            setKecamatanData(
                                                                                res
                                                                            )
                                                                    )
                                                                }}
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Kabupaten" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {kabupatenData.map(
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
                                                name="KecamatanId"
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
                                                                        'DesaId',
                                                                        ''
                                                                    )
                                                                    getDesaByKecamatanId(
                                                                        form.watch(
                                                                            'KecamatanId'
                                                                        ) || ''
                                                                    ).then(
                                                                        (res) =>
                                                                            setDesaData(
                                                                                res
                                                                            )
                                                                    )
                                                                }}
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Kecamatan" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {kecamatanData.map(
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
                                                name="DesaId"
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
                                                                    field.value ||
                                                                    ''
                                                                }
                                                                onValueChange={
                                                                    field.onChange
                                                                }
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Pilih Desa" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {desaData.map(
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
                                                name="Alamat"
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
                                                name="KodePos"
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
                                        </div>
                                    </div>
                                </div>
                            )}

                            <SheetFooter>
                                <Button
                                    type="submit"
                                    disabled={loadingAssignRole}
                                >
                                    {loadingAssignRole ? (
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
                </SheetContent>
            </Sheet>
        </div>
    )
}
export function SheetAssignRole({
    openDialogUser,
    setOpenDialogUser,
    selectedUser,
    roleDataServer,
    saveAssignRole,
    loadingAssignRole,
    setSelectedUser,
}: {
    openDialogUser: boolean
    setOpenDialogUser: React.Dispatch<React.SetStateAction<boolean>>
    selectedUser: UserTable | undefined
    loadingAssignRole: boolean
    saveAssignRole: () => void
    setSelectedUser: React.Dispatch<React.SetStateAction<UserTable | undefined>>
    roleDataServer: RolePermission
}) {
    return (
        <div className="grid grid-cols-2 gap-2">
            <Sheet open={openDialogUser} onOpenChange={setOpenDialogUser}>
                <SheetContent side={'right'}>
                    <SheetHeader>
                        <SheetTitle>Assign Role</SheetTitle>
                        <SheetDescription>
                            Atur Role untuk{' '}
                            {selectedUser ? selectedUser.Nama : 'Nama Pengguna'}
                        </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-2 px-2 overflow-y-scroll">
                        <Alert>
                            <UserCog2 className="h-4 w-4" />
                            <AlertTitle>Pemberitahuan</AlertTitle>
                            <AlertDescription>
                                User Harus Memiliki Minimal 1 Role
                            </AlertDescription>
                        </Alert>
                        {roleDataServer.map((r) => (
                            <label
                                key={r.RoleId}
                                className={`${
                                    loadingAssignRole && 'cursor-not-allowed'
                                } flex cursor-pointer flex-col rounded-2xl border p-4 shadow transition-all hover:shadow-md ${
                                    selectedUser?.Role?.split(', ').includes(
                                        r.Name
                                    )
                                        ? 'border-primary/50 bg-primary/20 dark:bg-gray-800 dark:border-gray-300 dark:text-gray-100'
                                        : 'border-gray-300'
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    name="cardOption"
                                    disabled={loadingAssignRole}
                                    value={r.RoleId}
                                    checked={selectedUser?.Role?.split(
                                        ', '
                                    ).includes(r.Name)}
                                    onChange={() => {
                                        const res =
                                            selectedUser?.Role?.split(', ')
                                        if (res?.includes(r.Name)) {
                                            if (res.length === 1) {
                                                toast(
                                                    'User Harus Memiliki 1 Role'
                                                )
                                            } else {
                                                const temp =
                                                    selectedUser?.Role?.split(
                                                        ', '
                                                    )
                                                        .filter(
                                                            (role) =>
                                                                role
                                                                    .trim()
                                                                    .toLowerCase() !==
                                                                r.Name.trim().toLowerCase()
                                                        )
                                                        .join(', ')

                                                setSelectedUser({
                                                    ...selectedUser,
                                                    Role: temp || null,
                                                    UserId:
                                                        selectedUser?.UserId ||
                                                        '',
                                                    Username:
                                                        selectedUser?.Username ||
                                                        '',
                                                    Nama:
                                                        selectedUser?.Nama ||
                                                        '',
                                                    Email:
                                                        selectedUser?.Email ||
                                                        '',
                                                    NomorWa:
                                                        selectedUser?.NomorWa ||
                                                        null,
                                                })
                                            }
                                        } else {
                                            const roles = new Set([
                                                ...(selectedUser?.Role?.split(
                                                    ', '
                                                ) ?? []),
                                                r.Name,
                                            ])
                                            const updatedRole =
                                                Array.from(roles).join(', ')

                                            setSelectedUser({
                                                ...selectedUser,
                                                Role: updatedRole,
                                                UserId:
                                                    selectedUser?.UserId || '',
                                                Username:
                                                    selectedUser?.Username ||
                                                    '',
                                                Nama: selectedUser?.Nama || '',
                                                Email:
                                                    selectedUser?.Email || '',
                                                NomorWa:
                                                    selectedUser?.NomorWa ||
                                                    null,
                                            })
                                        }
                                    }}
                                    className="peer hidden"
                                />
                                <div className="text-lg text-center font-medium">
                                    {r.Name}
                                </div>
                            </label>
                        ))}
                    </div>
                    <SheetFooter>
                        <Button
                            type="button"
                            disabled={loadingAssignRole}
                            onClick={() => saveAssignRole()}
                        >
                            {loadingAssignRole ? (
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
                </SheetContent>
            </Sheet>
        </div>
    )
}

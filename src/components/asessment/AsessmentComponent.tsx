'use client'
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
import { toast } from 'sonner'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { Input } from '../ui/input'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '../ui/select'
import { Skeleton } from '../ui/skeleton'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table'
import { getMahasiswaFromAsesor } from '@/services/Asessment/AsessmentMahasiswaService'
import { Badge } from '../ui/badge'
import { ResponseMhsFromAsesorSession } from '@/types/PenunjukanAsesor'

const AsessmentComponent = () => {
    const [dataMahasiswa, setDataMahasiswa] = React.useState<
        ResponseMhsFromAsesorSession[]
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
    const [loading, setLoading] = React.useState<boolean>(false)

    React.useEffect(() => {
        setLoading(true)
        getMahasiswaFromAsesor(
            paginationState.page,
            paginationState.limit,
            search
        )
            .then((res) => {
                setDataMahasiswa(res.data)
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

    const columns: ColumnDef<ResponseMhsFromAsesorSession>[] = [
        {
            accessorKey: 'Nama',
            header: 'Nama',
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue('Nama')}</div>
            ),
        },
        {
            accessorKey: 'NamaProgramStudi',
            header: 'Program Studi',
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.getValue('NamaProgramStudi')}
                </div>
            ),
        },
        {
            accessorKey: 'Urutan',
            header: 'Urutan',
            cell: ({ row }) => (
                <div className="capitalize">
                    Asesor Ke {row.getValue('Urutan')}
                </div>
            ),
        },
        {
            accessorKey: 'Confirmation',
            header: 'Terkonfirmasi',
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.getValue('Confirmation') ? (
                        <Badge>Konfirm</Badge>
                    ) : (
                        <Badge>Tidak</Badge>
                    )}
                </div>
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
                                onClick={() => {
                                    navigator.clipboard.writeText(
                                        jd.PendaftaranId
                                    )
                                    toast(
                                        'Pendaftaran Mahasiswa ID dicopy ke clipboard'
                                    )
                                }}
                            >
                                Copy Pendaftaran Mahasiswa ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {}}>
                                Mulai Asessment
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem onClick={() => hapusData(jd)}>
                                Hapus Data
                            </DropdownMenuItem> */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    const table = useReactTable({
        data: dataMahasiswa,
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
                    onChange={(event) => setSearch(event.target.value)}
                    className="max-w-sm"
                />
                <div className="w-full justify-end flex">
                    {/* <Button className="mr-2" onClick={() => buatData()}>
                        Tambah
                    </Button> */}
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
            {/* <SheetManageData
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                onSubmit={onSubmit}
                loading={loading}
                form={form}
                titleDialog={titleDialog}
            /> */}
        </div>
    )
}

export default AsessmentComponent

// export function SheetManageData({
//     openDialog,
//     setOpenDialog,
//     onSubmit,
//     loading,
//     form,
//     titleDialog,
// }: {
//     openDialog: boolean
//     setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
//     loading: boolean
//     onSubmit: (data: CountryFormValidation) => void
//     form: UseFormReturn<CountryFormValidation>
//     titleDialog: string
// }) {
//     return (
//         <div className="grid grid-cols-2 gap-2">
//             <Sheet open={openDialog} onOpenChange={setOpenDialog}>
//                 <SheetContent
//                     side="right"
//                     className="w-screen h-screen max-w-full overflow-scroll"
//                 >
//                     <Form {...form}>
//                         <form onSubmit={form.handleSubmit(onSubmit)}>
//                             <SheetHeader>
//                                 <SheetTitle>{titleDialog}</SheetTitle>
//                                 <SheetDescription>
//                                     Manage Data untuk {form.getValues('Nama')}
//                                 </SheetDescription>
//                             </SheetHeader>
//                             <div className="w-full grid grid-cols-1 gap-3 px-4">
//                                 <div className="container mx-auto">
//                                     <div className="grid grid-cols-1 gap-3">
//                                         <FormField
//                                             control={form.control}
//                                             name="Nama"
//                                             render={({ field }) => (
//                                                 <FormItem>
//                                                     <FormLabel>Nama</FormLabel>
//                                                     <FormControl>
//                                                         <Input
//                                                             readOnly={loading}
//                                                             {...field}
//                                                         />
//                                                     </FormControl>
//                                                     <FormDescription>
//                                                         Nama
//                                                     </FormDescription>
//                                                     <FormMessage />
//                                                 </FormItem>
//                                             )}
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//                             <SheetFooter>
//                                 <Button type="submit" disabled={loading}>
//                                     {loading ? (
//                                         <>
//                                             <Timer />
//                                             Loading
//                                         </>
//                                     ) : (
//                                         <>
//                                             <PenIcon /> Simpan
//                                         </>
//                                     )}
//                                 </Button>
//                             </SheetFooter>
//                         </form>
//                     </Form>
//                 </SheetContent>
//             </Sheet>
//         </div>
//     )
// }

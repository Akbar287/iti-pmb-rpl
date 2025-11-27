'use client'

import React from 'react'
import { ResponsePenunjukanAsesorForWarek, ResponsePenunjukanAsesorForWarekValue } from '@/types/PenunjukanAsesor'
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, VisibilityState } from '@tanstack/react-table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { ChevronLeft, ChevronRight, MoreHorizontal, PenIcon, Timer } from 'lucide-react'
import { getAsesorMahasiswaWarekPagination, setPersetujuanAsesor } from '@/services/Approval/ApprovalAsesorService'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'
import { Skeleton } from '../ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '../ui/sheet'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { toast } from 'sonner'
import { setStatusPenerbitanSkPenunjukanAsesor, setStatusPenunjukanAsesor, setStatusPersetujuanPenunjukanAsesor } from '@/services/Status/StatusService'
import { Separator } from '../ui/separator'

const PersetujuanAsesorComponent = () => {
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
  const [approval, setApproval] = React.useState<{ approval: boolean; catatan: string }>({ approval: false, catatan: '' })
  const [data, setData] = React.useState<ResponsePenunjukanAsesorForWarek[]>([])
  const [dataSelected, setDataSelected] = React.useState<ResponsePenunjukanAsesorForWarek>(ResponsePenunjukanAsesorForWarekValue)
  const [loading, setLoading] = React.useState<boolean>(false)

  React.useEffect(() => {
    setLoading(true)
    getAsesorMahasiswaWarekPagination(
      paginationState.page,
      paginationState.limit,
      search
    )
      .then((res) => {
        setData(res.data)
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
  }, [
    paginationState.page,
    search,
    paginationState.limit,
  ])

  const sendApproval = async () => {
    await setPersetujuanAsesor(
      dataSelected.PendaftaranId,
      approval.approval,
      approval.catatan
    ).then(async res => {
      toast.success('Approval sudah disimpan')
      setData(data.filter(x => x.PendaftaranId !== dataSelected.PendaftaranId))
      await setStatusPenerbitanSkPenunjukanAsesor(dataSelected.PendaftaranId)
    }).catch(async err => {
      toast.error('Terjadi Kesalahan, periksa koneksi internet')
      await setStatusPenunjukanAsesor(dataSelected.PendaftaranId)
    }).finally(() => {
      setOpenDialog(false)
    })
  }
  const columns: ColumnDef<ResponsePenunjukanAsesorForWarek>[] = [
    {
      accessorKey: 'NamaMahasiswa',
      header: 'Nama Mahasiswa',
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue('NamaMahasiswa')}
        </div>
      ),
    },
    {
      accessorKey: 'NamaAsesorPertama',
      header: 'Nama Asesor 1',
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue('NamaAsesorPertama')}
        </div>
      ),
    },
    {
      accessorKey: 'NamaAsesorKedua',
      header: 'Nama Asesor 2',
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue('NamaAsesorKedua')}
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
                onClick={() =>
                  navigator.clipboard.writeText(
                    jd.KodePendaftar
                  )
                }
              >
                Copy Kode Pendaftar ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setDataSelected({
                    AsesorPertamaId: jd.AsesorPertamaId ?? '',
                    NamaAsesorPertama: jd.NamaAsesorPertama ?? '',
                    BebanAsesorPertama: jd.BebanAsesorPertama ?? '',
                    AsesorKeduaId: jd.AsesorKeduaId ?? '',
                    NamaAsesorKedua: jd.NamaAsesorKedua ?? '',
                    BebanAsesorKedua: jd.BebanAsesorKedua ?? '',
                    PendaftaranId: jd.PendaftaranId ?? '',
                    KodePendaftar: jd.KodePendaftar ?? '',
                    NamaProgramStudi: jd.NamaProgramStudi ?? '',
                    NamaMahasiswa: jd.NamaMahasiswa ?? '',
                    Status: jd.Status ?? '',
                  })
                  setOpenDialog(true)
                }}
              >
                Berikan Approval
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
  const table = useReactTable({
    data: data,
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
          <Select
            value={String(paginationState.limit)}
            disabled={loading}
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
              {table
                .getHeaderGroups()
                .map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(
                      (header) => {
                        return (
                          <TableHead
                            key={header.id}
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                header
                                  .column
                                  .columnDef
                                  .header,
                                header.getContext()
                              )}
                          </TableHead>
                        )
                      }
                    )}
                  </TableRow>
                ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={
                      row.getIsSelected() &&
                      'selected'
                    }
                  >
                    {row
                      .getVisibleCells()
                      .map((cell) => (
                        <TableCell
                          key={cell.id}
                        >
                          {flexRender(
                            cell.column
                              .columnDef
                              .cell,
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
            : paginationState.page *
            paginationState.limit}{' '}
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
                variant={
                  p === page ? 'default' : 'outline'
                }
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
              pages.push(
                <span key="right-dots">...</span>
              )
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
        loading={loading}
        dataSelected={dataSelected}
        setDataSelected={setDataSelected}
        approval={approval}
        setApproval={setApproval}
        sendApproval={sendApproval}
      />
    </div>
  )
}


export function SheetManageData({
  openDialog,
  setOpenDialog,
  loading,
  dataSelected,
  setDataSelected,
  approval,
  setApproval,
  sendApproval
}: {
  openDialog: boolean
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
  loading: boolean
  dataSelected: ResponsePenunjukanAsesorForWarek;
  setDataSelected: React.Dispatch<
    React.SetStateAction<ResponsePenunjukanAsesorForWarek>
  >
  approval: { approval: boolean; catatan: string }
  setApproval: React.Dispatch<
    React.SetStateAction<{ approval: boolean; catatan: string }>
  >
  sendApproval: () => void
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
            <React.Fragment>
              <SheetHeader>
                <SheetTitle>
                  Berikan Approval
                </SheetTitle>
                <SheetDescription>
                  Silakan beri Approval terhadap Penunjukan 2 Asesor berikut.
                </SheetDescription>
              </SheetHeader>
              <div className="w-full grid grid-cols-1 px-4">
                <div className="container mx-auto">
                  <div className="grid grid-cols-1 gap-3">
                    <h5 className="text-center">Informasi Penunjukan Asesor</h5>

                    <div className="grid w-full max-w-sm items-center gap-3">
                      <Label htmlFor="namamahasiswa">Nama Mahasiswa</Label>
                      <Input readOnly type="text" id="namamahasiswa" placeholder="Nama Mahasiswa" value={
                        dataSelected?.NamaMahasiswa ?? ''
                      } />
                    </div>

                    <div className="grid w-full max-w-sm items-center gap-3">
                      <Label htmlFor="namaasesorpertama">Nama Asesor Pertama</Label>
                      <Input readOnly type="text" id="namaasesorpertama" placeholder="Nama Asesor Pertama" value={
                        dataSelected?.NamaAsesorPertama ?? ''
                      } />
                    </div>

                    <div className="grid w-full max-w-sm items-center gap-3">
                      <Label htmlFor="bebanasesorpertama">Beban Asesor Pertama</Label>
                      <Input readOnly type="text" id="bebanasesorpertama" placeholder="Beban Asesor Pertama" value={
                        dataSelected.BebanAsesorPertama ? dataSelected.BebanAsesorPertama + ' Mahasiswa sudah diasses oleh ' + dataSelected?.NamaAsesorPertama: ''
                      } />
                    </div>

                    <div className="grid w-full max-w-sm items-center gap-3">
                      <Label htmlFor="namaasesorKedua">Nama Asesor Kedua</Label>
                      <Input readOnly type="text" id="namaasesorKedua" placeholder="Nama Asesor Kedua" value={
                        dataSelected?.NamaAsesorKedua ?? ''
                      } />
                    </div>

                    <div className="grid w-full max-w-sm items-center gap-3">
                      <Label htmlFor="bebanasesorKedua">Beban Asesor Kedua</Label>
                      <Input readOnly type="text" id="bebanasesorKedua" placeholder="Beban Asesor Kedua" value={ dataSelected.BebanAsesorKedua ? dataSelected.BebanAsesorKedua + ' Mahasiswa sudah diasses oleh ' + dataSelected?.NamaAsesorKedua: ''} />
                    </div>

                    <Separator />
                    <h5 className="text-center">Masukan Approval anda</h5>

                    <label
                      className={`flex cursor-pointer flex-col rounded-2xl border p-4 shadow transition-all hover:shadow-md ${approval.approval
                        ? 'border-primary/50 bg-primary/20 dark:bg-gray-800 dark:border-gray-300 dark:text-gray-100'
                        : 'border-gray-300'
                        }`}
                    >
                      <input
                        type="checkbox"
                        name="cardOption"
                        disabled={loading}
                        // value={approval.approval}
                        checked={approval.approval}
                        onChange={() => setApproval({ ...approval, approval: true })}
                        className="peer hidden"
                      />
                      <div className="text-lg text-center font-medium">Disetujui</div>
                    </label>

                    <label
                      className={`flex cursor-pointer flex-col rounded-2xl border p-4 shadow transition-all hover:shadow-md ${!approval.approval
                        ? 'border-primary/50 bg-primary/20 dark:bg-gray-800 dark:border-gray-300 dark:text-gray-100'
                        : 'border-gray-300'
                        }`}
                    >
                      <input
                        type="checkbox"
                        disabled={loading}
                        name="cardOption"
                        // value={approval.approval}
                        checked={!approval.approval}
                        onChange={() => setApproval({ ...approval, approval: false })}
                        className="peer hidden"
                      />
                      <div className="text-lg text-center font-medium">Tidak Disetujui</div>
                    </label>

                    <div className="grid w-full max-w-sm items-center gap-3">
                      <Label htmlFor="catatan">Catatan</Label>
                      <Textarea id="catatan" disabled={loading} placeholder={approval.approval ? 'Catatan untuk Akademik' : 'Catatan untuk Kaprodi'} value={
                        approval.catatan ?? ''
                      } onChange={(e) => setApproval({ ...approval, catatan: e.target.value })} />
                    </div>
                  </div>
                </div>
              </div>
              <SheetFooter>
                <Button onClick={() => sendApproval()} disabled={loading}>
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
            </React.Fragment>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default PersetujuanAsesorComponent
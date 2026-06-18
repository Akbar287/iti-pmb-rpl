'use client'

import React from 'react'
import {
    ColumnDef,
    ColumnFiltersState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import {
    ChevronLeft,
    ChevronRight,
    Eye,
    Loader2,
    RefreshCw,
    Search,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import {
    AiTokenUsageFilters,
    AiTokenUsageItem,
    AiTokenUsageSummary,
    getAiTokenUsage,
} from '@/services/TokenUsageService'

const defaultSummary: AiTokenUsageSummary = {
    totalRecords: 0,
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
    reasoningTokens: 0,
    cachedInputTokens: 0,
    totalCostUsd: null,
}

const defaultFilters: AiTokenUsageFilters = {
    features: [],
    featureGroups: [],
    statuses: [],
    models: [],
}

export default function TokenUsageComponent() {
    const [data, setData] = React.useState<AiTokenUsageItem[]>([])
    const [summary, setSummary] =
        React.useState<AiTokenUsageSummary>(defaultSummary)
    const [filters, setFilters] =
        React.useState<AiTokenUsageFilters>(defaultFilters)
    const [selectedUsage, setSelectedUsage] =
        React.useState<AiTokenUsageItem | null>(null)
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [loading, setLoading] = React.useState(false)
    const [search, setSearch] = React.useState('')
    const [feature, setFeature] = React.useState('ALL')
    const [featureGroup, setFeatureGroup] = React.useState('ALL')
    const [status, setStatus] = React.useState('ALL')
    const [model, setModel] = React.useState('ALL')
    const [from, setFrom] = React.useState('')
    const [to, setTo] = React.useState('')
    const [paginationState, setPaginationState] = React.useState({
        page: 1,
        limit: 10,
        totalElement: 0,
        totalPage: 0,
        isFirst: true,
        isLast: true,
        hasNext: false,
        hasPrevious: false,
    })

    const fetchData = React.useCallback(async () => {
        setLoading(true)
        try {
            const res = await getAiTokenUsage({
                page: paginationState.page,
                limit: paginationState.limit,
                search,
                feature,
                featureGroup,
                status,
                model,
                from,
                to,
            })

            setData(res.data)
            setSummary(res.summary)
            setFilters(res.filters)
            setPaginationState((prev) => ({
                ...prev,
                page: res.page,
                limit: res.limit,
                totalElement: res.totalElement,
                totalPage: res.totalPage,
                isFirst: res.isFirst,
                isLast: res.isLast,
                hasNext: res.hasNext,
                hasPrevious: res.hasPrevious,
            }))
        } catch (error) {
            console.error('Failed to fetch AI token usage', error)
            setData([])
            setSummary(defaultSummary)
        } finally {
            setLoading(false)
        }
    }, [
        feature,
        featureGroup,
        from,
        model,
        paginationState.limit,
        paginationState.page,
        search,
        status,
        to,
    ])

    React.useEffect(() => {
        fetchData()
    }, [fetchData])

    const resetPageAnd = (callback: () => void) => {
        setPaginationState((prev) => ({ ...prev, page: 1 }))
        callback()
    }

    const columns = React.useMemo<ColumnDef<AiTokenUsageItem>[]>(
        () => [
            {
                accessorKey: 'CreatedAt',
                header: 'Waktu',
                cell: ({ row }) => (
                    <div className="min-w-[140px] text-sm">
                        {formatDateTime(row.original.CreatedAt)}
                    </div>
                ),
            },
            {
                accessorKey: 'Feature',
                header: 'Fitur',
                cell: ({ row }) => (
                    <div className="min-w-[150px]">
                        <Badge variant="outline">{row.original.Feature}</Badge>
                        {row.original.FeatureGroup && (
                            <div className="mt-1 text-xs text-muted-foreground">
                                {row.original.FeatureGroup}
                            </div>
                        )}
                    </div>
                ),
            },
            {
                accessorKey: 'Status',
                header: 'Status',
                cell: ({ row }) => (
                    <Badge
                        variant="outline"
                        className={
                            row.original.Status === 'SUCCESS'
                                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                                : 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300'
                        }
                    >
                        {row.original.Status}
                    </Badge>
                ),
            },
            {
                id: 'User',
                header: 'User',
                cell: ({ row }) => (
                    <div className="min-w-[160px]">
                        <div className="font-medium">
                            {row.original.User?.Nama ?? 'Anonymous'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {row.original.User?.Email ?? row.original.SessionId ?? '-'}
                        </div>
                    </div>
                ),
            },
            {
                accessorKey: 'LlmModelSlug',
                header: 'Model',
                cell: ({ row }) => (
                    <div className="min-w-[180px]">
                        <div className="font-medium">{row.original.LlmModel}</div>
                        <div className="text-xs text-muted-foreground">
                            {row.original.LlmModelSlug}
                        </div>
                    </div>
                ),
            },
            {
                accessorKey: 'InputTokens',
                header: 'Input',
                cell: ({ row }) => (
                    <div className="text-right tabular-nums">
                        {formatNumber(row.original.InputTokens)}
                    </div>
                ),
            },
            {
                accessorKey: 'OutputTokens',
                header: 'Output',
                cell: ({ row }) => (
                    <div className="text-right tabular-nums">
                        {formatNumber(row.original.OutputTokens)}
                    </div>
                ),
            },
            {
                accessorKey: 'TotalTokens',
                header: 'Total',
                cell: ({ row }) => (
                    <div className="text-right font-medium tabular-nums">
                        {formatNumber(row.original.TotalTokens)}
                    </div>
                ),
            },
            {
                accessorKey: 'ReasoningTokens',
                header: 'Reasoning',
                cell: ({ row }) => (
                    <div className="text-right tabular-nums">
                        {formatOptionalNumber(row.original.ReasoningTokens)}
                    </div>
                ),
            },
            {
                accessorKey: 'CachedInputTokens',
                header: 'Cached',
                cell: ({ row }) => (
                    <div className="text-right tabular-nums">
                        {formatOptionalNumber(row.original.CachedInputTokens)}
                    </div>
                ),
            },
            {
                accessorKey: 'DurationMs',
                header: 'Durasi',
                cell: ({ row }) => (
                    <div className="text-right tabular-nums">
                        {formatDuration(row.original.DurationMs)}
                    </div>
                ),
            },
            {
                id: 'Reference',
                header: 'Referensi',
                cell: ({ row }) => (
                    <div className="max-w-[220px] truncate text-sm">
                        {row.original.ReferenceType && row.original.ReferenceId
                            ? `${row.original.ReferenceType}: ${row.original.ReferenceId}`
                            : '-'}
                    </div>
                ),
            },
            {
                accessorKey: 'Route',
                header: 'Route',
                cell: ({ row }) => (
                    <div className="max-w-[260px] truncate text-sm text-muted-foreground">
                        {row.original.Route ?? '-'}
                    </div>
                ),
            },
            {
                id: 'actions',
                header: '',
                enableHiding: false,
                cell: ({ row }) => (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setSelectedUsage(row.original)}
                            >
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">Detail</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Detail usage</TooltipContent>
                    </Tooltip>
                ),
            },
        ],
        []
    )

    const table = useReactTable({
        data,
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

    const startData =
        paginationState.totalElement === 0
            ? 0
            : paginationState.page * paginationState.limit -
            paginationState.limit +
            1
    const endData = Math.min(
        paginationState.page * paginationState.limit,
        paginationState.totalElement
    )

    return (
        <div className="w-full space-y-4">
            <div>
                <h1 className="text-2xl font-semibold">Token Usage</h1>
                <p className="text-sm text-muted-foreground">
                    Monitoring penggunaan token AI berdasarkan fitur, model, user,
                    dan referensi data.
                </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
                <SummaryMetric
                    label="Request"
                    value={formatNumber(summary.totalRecords)}
                />
                <SummaryMetric
                    label="Input Token"
                    value={formatNumber(summary.inputTokens)}
                />
                <SummaryMetric
                    label="Output Token"
                    value={formatNumber(summary.outputTokens)}
                />
                <SummaryMetric
                    label="Total Token"
                    value={formatNumber(summary.totalTokens)}
                />
                <SummaryMetric
                    label="Reasoning"
                    value={formatNumber(summary.reasoningTokens)}
                />
                <SummaryMetric
                    label="Estimasi Cost"
                    value={formatCurrency(summary.totalCostUsd)}
                />
            </div>

            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle>Log Usage AI</CardTitle>
                    <CardDescription>
                        Data token yang dicatat dari setiap pemanggilan model AI.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-3 py-2">
                        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
                            <div className="relative w-full xl:max-w-sm">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari fitur, model, user, route, request id..."
                                    value={search}
                                    onChange={(event) =>
                                        resetPageAnd(() => setSearch(event.target.value))
                                    }
                                    className="pl-9"
                                />
                            </div>

                            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:flex xl:flex-1">
                                <FilterSelect
                                    label="Feature"
                                    value={feature}
                                    options={filters.features}
                                    onChange={(value) =>
                                        resetPageAnd(() => setFeature(value))
                                    }
                                />
                                <FilterSelect
                                    label="Group"
                                    value={featureGroup}
                                    options={filters.featureGroups}
                                    onChange={(value) =>
                                        resetPageAnd(() => setFeatureGroup(value))
                                    }
                                />
                                <FilterSelect
                                    label="Status"
                                    value={status}
                                    options={filters.statuses}
                                    onChange={(value) =>
                                        resetPageAnd(() => setStatus(value))
                                    }
                                />
                                <FilterSelect
                                    label="Model"
                                    value={model}
                                    options={filters.models}
                                    onChange={(value) =>
                                        resetPageAnd(() => setModel(value))
                                    }
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            <div className="grid gap-2 sm:grid-cols-2">
                                <Input
                                    type="date"
                                    value={from}
                                    onChange={(event) =>
                                        resetPageAnd(() => setFrom(event.target.value))
                                    }
                                    className="w-full sm:w-[180px]"
                                />
                                <Input
                                    type="date"
                                    value={to}
                                    onChange={(event) =>
                                        resetPageAnd(() => setTo(event.target.value))
                                    }
                                    className="w-full sm:w-[180px]"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearch('')
                                        setFeature('ALL')
                                        setFeatureGroup('ALL')
                                        setStatus('ALL')
                                        setModel('ALL')
                                        setFrom('')
                                        setTo('')
                                        setPaginationState((prev) => ({
                                            ...prev,
                                            page: 1,
                                        }))
                                    }}
                                >
                                    Reset
                                </Button>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={fetchData}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <RefreshCw className="h-4 w-4" />
                                            )}
                                            <span className="sr-only">Refresh</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Refresh data</TooltipContent>
                                </Tooltip>
                                <Select
                                    value={String(paginationState.limit)}
                                    onValueChange={(value) =>
                                        setPaginationState((prev) => ({
                                            ...prev,
                                            limit: Number(value),
                                            page: 1,
                                        }))
                                    }
                                >
                                    <SelectTrigger className="w-[100px]">
                                        <SelectValue placeholder="Limit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Limit</SelectLabel>
                                            {[10, 20, 50, 75, 100].map((item) => (
                                                <SelectItem
                                                    key={item}
                                                    value={String(item)}
                                                >
                                                    {item}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="mt-4 space-y-3">
                            {Array.from({ length: Math.min(paginationState.limit, 10) }).map(
                                (_, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3"
                                    >
                                        <Skeleton className="h-9 w-9 rounded-md" />
                                        <Skeleton className="h-4 flex-1" />
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-28" />
                                    </div>
                                )
                            )}
                        </div>
                    ) : (
                        <div className="mt-4 rounded-md border">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        {table.getHeaderGroups().map((headerGroup) => (
                                            <TableRow key={headerGroup.id}>
                                                {headerGroup.headers.map((header) => (
                                                    <TableHead
                                                        key={header.id}
                                                        className="whitespace-nowrap"
                                                    >
                                                        {header.isPlaceholder
                                                            ? null
                                                            : flexRender(
                                                                header.column.columnDef
                                                                    .header,
                                                                header.getContext()
                                                            )}
                                                    </TableHead>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableHeader>
                                    <TableBody>
                                        {table.getRowModel().rows.length ? (
                                            table.getRowModel().rows.map((row) => (
                                                <TableRow key={row.id}>
                                                    {row.getVisibleCells().map((cell) => (
                                                        <TableCell
                                                            key={cell.id}
                                                            className="align-top"
                                                        >
                                                            {flexRender(
                                                                cell.column.columnDef
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
                                                    Tidak ada data token usage.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="text-sm text-muted-foreground">
                            Menampilkan {startData} - {endData} dari{' '}
                            {paginationState.totalElement} data.
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    setPaginationState((prev) => ({
                                        ...prev,
                                        page: prev.page - 1,
                                    }))
                                }
                                disabled={!paginationState.hasPrevious}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            {renderPages(paginationState.page, paginationState.totalPage).map(
                                (pageItem) =>
                                    typeof pageItem === 'number' ? (
                                        <Button
                                            key={pageItem}
                                            variant={
                                                pageItem === paginationState.page
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            size="sm"
                                            onClick={() =>
                                                setPaginationState((prev) => ({
                                                    ...prev,
                                                    page: pageItem,
                                                }))
                                            }
                                        >
                                            {pageItem}
                                        </Button>
                                    ) : (
                                        <span
                                            key={pageItem}
                                            className="px-1 text-sm text-muted-foreground"
                                        >
                                            ...
                                        </span>
                                    )
                            )}

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    setPaginationState((prev) => ({
                                        ...prev,
                                        page: prev.page + 1,
                                    }))
                                }
                                disabled={!paginationState.hasNext}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <TokenUsageDetailDialog
                usage={selectedUsage}
                onOpenChange={(open) => {
                    if (!open) setSelectedUsage(null)
                }}
            />
        </div>
    )
}

function FilterSelect({
    label,
    value,
    options,
    onChange,
}: {
    label: string
    value: string
    options: string[]
    onChange: (value: string) => void
}) {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full xl:w-[180px]">
                <SelectValue placeholder={label} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>{label}</SelectLabel>
                    <SelectItem value="ALL">Semua</SelectItem>
                    {options.map((option) => (
                        <SelectItem key={option} value={option}>
                            {option}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-lg border bg-white/60 p-4 shadow-sm dark:bg-slate-900/40">
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="mt-2 text-xl font-semibold tabular-nums">{value}</div>
        </div>
    )
}

function TokenUsageDetailDialog({
    usage,
    onOpenChange,
}: {
    usage: AiTokenUsageItem | null
    onOpenChange: (open: boolean) => void
}) {
    return (
        <Dialog open={Boolean(usage)} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] max-w-6xl overflow-hidden">
                <DialogHeader>
                    <DialogTitle>Detail Token Usage</DialogTitle>
                    <DialogDescription>
                        Informasi lengkap dari satu pemanggilan AI.
                    </DialogDescription>
                </DialogHeader>

                {usage && (
                    <ScrollArea className="h-[72vh] pr-4">
                        <div className="space-y-6">
                            <DetailSection title="Identitas">
                                <DetailItem label="AI Token Usage ID" value={usage.AiTokenUsageId} />
                                <DetailItem label="Request ID" value={usage.RequestId} />
                                <DetailItem label="Session ID" value={usage.SessionId} />
                                <DetailItem label="Status" value={usage.Status} />
                                <DetailItem label="Created At" value={formatDateTime(usage.CreatedAt)} />
                                <DetailItem label="Updated At" value={formatDateTime(usage.UpdatedAt)} />
                            </DetailSection>

                            <DetailSection title="User">
                                <DetailItem label="User ID" value={usage.UserId} />
                                <DetailItem label="Nama" value={usage.User?.Nama ?? 'Anonymous'} />
                                <DetailItem label="Email" value={usage.User?.Email} />
                            </DetailSection>

                            <DetailSection title="Fitur dan Route">
                                <DetailItem label="Feature" value={usage.Feature} />
                                <DetailItem label="Feature Group" value={usage.FeatureGroup} />
                                <DetailItem label="Page" value={usage.Page} />
                                <DetailItem label="Route" value={usage.Route} />
                                <DetailItem label="Method" value={usage.Method} />
                                <DetailItem label="Reference Type" value={usage.ReferenceType} />
                                <DetailItem label="Reference ID" value={usage.ReferenceId} />
                            </DetailSection>

                            <DetailSection title="Model">
                                <DetailItem label="SDK Provider" value={usage.SdkProvider} />
                                <DetailItem label="LLM Provider" value={usage.LlmProvider} />
                                <DetailItem label="LLM Model" value={usage.LlmModel} />
                                <DetailItem label="LLM Model Version" value={usage.LlmModelVersion} />
                                <DetailItem label="LLM Model Slug" value={usage.LlmModelSlug} />
                                <DetailItem label="Temperature" value={usage.Temperature} />
                                <DetailItem label="Top P" value={usage.TopP} />
                                <DetailItem label="Max Output Tokens" value={usage.MaxOutputTokens} />
                            </DetailSection>

                            <DetailSection title="Token dan Performa">
                                <DetailItem label="Input Tokens" value={formatNumber(usage.InputTokens)} />
                                <DetailItem label="Output Tokens" value={formatNumber(usage.OutputTokens)} />
                                <DetailItem label="Total Tokens" value={formatNumber(usage.TotalTokens)} />
                                <DetailItem label="Reasoning Tokens" value={formatOptionalNumber(usage.ReasoningTokens)} />
                                <DetailItem label="Cached Input Tokens" value={formatOptionalNumber(usage.CachedInputTokens)} />
                                <DetailItem label="Prompt Char Count" value={formatOptionalNumber(usage.PromptCharCount)} />
                                <DetailItem label="Completion Char Count" value={formatOptionalNumber(usage.CompletionCharCount)} />
                                <DetailItem label="Prompt Message Count" value={formatOptionalNumber(usage.PromptMessageCount)} />
                                <DetailItem label="Completion Message Count" value={formatOptionalNumber(usage.CompletionMessageCount)} />
                                <DetailItem label="Duration" value={formatDuration(usage.DurationMs)} />
                                <DetailItem label="First Token" value={formatDuration(usage.FirstTokenMs)} />
                                <DetailItem label="Streaming" value={usage.Streaming ? 'Ya' : 'Tidak'} />
                            </DetailSection>

                            <DetailSection title="Biaya">
                                <DetailItem label="Input Cost USD" value={formatCurrency(usage.InputCostUsd)} />
                                <DetailItem label="Output Cost USD" value={formatCurrency(usage.OutputCostUsd)} />
                                <DetailItem label="Total Cost USD" value={formatCurrency(usage.TotalCostUsd)} />
                                <DetailItem label="Currency" value={usage.Currency} />
                                <DetailItem label="Price Source" value={usage.PriceSource} />
                            </DetailSection>

                            <DetailSection title="Error">
                                <DetailItem label="Error Code" value={usage.ErrorCode} />
                                <DetailItem label="Error Message" value={usage.ErrorMessage} className="md:col-span-3" />
                            </DetailSection>

                            <div className="grid gap-4 lg:grid-cols-3">
                                <JsonBlock title="Usage Raw" value={usage.UsageRaw} />
                                <JsonBlock
                                    title="Provider Metadata"
                                    value={usage.ProviderMetadata}
                                />
                                <JsonBlock title="Metadata" value={usage.Metadata} />
                            </div>
                        </div>
                    </ScrollArea>
                )}
            </DialogContent>
        </Dialog>
    )
}

function DetailSection({
    title,
    children,
}: {
    title: string
    children: React.ReactNode
}) {
    return (
        <section className="space-y-3">
            <h3 className="text-sm font-semibold">{title}</h3>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {children}
            </div>
        </section>
    )
}

function DetailItem({
    label,
    value,
    className = '',
}: {
    label: string
    value: React.ReactNode
    className?: string
}) {
    return (
        <div className={`rounded-md border p-3 ${className}`}>
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="mt-1 break-words text-sm">{formatDisplayValue(value)}</div>
        </div>
    )
}

function JsonBlock({ title, value }: { title: string; value: unknown }) {
    return (
        <div className="rounded-md border p-3">
            <div className="mb-2 text-sm font-semibold">{title}</div>
            <pre className="max-h-72 overflow-auto rounded-md bg-slate-950 p-3 text-xs text-slate-100">
                {formatJson(value)}
            </pre>
        </div>
    )
}

function renderPages(currentPage: number, totalPage: number) {
    if (totalPage <= 0) return []
    if (totalPage <= 5) {
        return Array.from({ length: totalPage }, (_, index) => index + 1)
    }

    const pages: Array<number | string> = [1]
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPage - 1, currentPage + 1)

    if (start > 2) pages.push('left-dots')
    for (let page = start; page <= end; page++) pages.push(page)
    if (end < totalPage - 1) pages.push('right-dots')
    pages.push(totalPage)

    return pages
}

function formatNumber(value: number) {
    return new Intl.NumberFormat('id-ID').format(value)
}

function formatOptionalNumber(value: number | null) {
    return value === null || value === undefined ? '-' : formatNumber(value)
}

function formatDateTime(value: string | null) {
    if (!value) return '-'
    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value))
}

function formatDuration(value: number | null) {
    if (value === null || value === undefined) return '-'
    if (value < 1000) return `${value} ms`
    return `${(value / 1000).toFixed(2)} s`
}

function formatCurrency(value: string | null) {
    if (!value) return '-'
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 6,
    }).format(Number(value))
}

function formatDisplayValue(value: React.ReactNode) {
    if (value === null || value === undefined || value === '') return '-'
    return value
}

function formatJson(value: unknown) {
    if (value === null || value === undefined) return '-'
    try {
        return JSON.stringify(value, null, 2)
    } catch {
        return String(value)
    }
}

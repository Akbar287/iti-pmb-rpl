'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {
    AlignCenter,
    AlignJustify,
    AlignLeft,
    AlignRight,
    ArrowDown,
    ArrowUp,
    Braces,
    Copy,
    FilePlus2,
    GripVertical,
    ImageIcon,
    List,
    ListOrdered,
    Loader2,
    Plus,
    RotateCcw,
    Save,
    Space,
    Table2,
    TextCursorInput,
    Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    cloneDefaultFormAssessmentTemplate,
    FORM_ASSESSMENT_PLACEHOLDERS,
    resolveFormAssessmentPlaceholders,
} from '@/lib/form-assessment-template'
import {
    getFormAssessmentTemplate,
    saveFormAssessmentTemplate,
} from '@/services/FormAssessmentTemplateService'
import {
    DocumentTemplatePlacement,
    FormAssessmentPortraitTemplate,
    FormAssessmentTableCellAlign,
    FormAssessmentTemplateBlock,
    FormAssessmentTemplatePage,
    FormAssessmentTextAlign,
} from '@/types/FormAssessmentTemplate'
import { cn } from '@/lib/utils'

const blockNames: Record<FormAssessmentTemplateBlock['type'], string> = {
    text: 'Teks',
    logo: 'Logo',
    spacer: 'Jarak kosong vertikal',
    key_value: 'Data label & nilai',
    list: 'Daftar',
    table: 'Tabel kustom',
}

const blockIcons = {
    text: TextCursorInput,
    logo: ImageIcon,
    spacer: Space,
    key_value: Braces,
    list: List,
    table: Table2,
}

const assessmentSampleValues: Record<string, string> = {
    kode_pendaftar: 'RPL-2026-001',
    periode: '2026/2027',
    nama: 'Nama Calon Mahasiswa',
    tempat_lahir: 'Tangerang',
    tanggal_lahir: '12 Mei 2000',
    tempat_tanggal_lahir: 'Tangerang, 12 Mei 2000',
    alamat: 'Jl. Contoh No. 10, Tangerang Selatan',
    nomor_hp: '0812-3456-7890',
    email: 'calon.mahasiswa@example.com',
    program_studi: 'Teknik Informatika',
    universitas: 'Institut Teknologi Indonesia',
    alamat_universitas: 'Jl. Raya Puspiptek, Tangerang Selatan',
    kode_pos_universitas: '15314',
    asesor_1: 'Nama Asesor Pertama',
    asesor_2: 'Nama Asesor Kedua',
    tanggal_sekarang: '1 Juli 2026',
    bulan_tahun: 'Juli 2026',
    tahun: '2026',
}

const makeId = (prefix: string) =>
    `${prefix}-${typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now()}`

function createBlock(
    type: FormAssessmentTemplateBlock['type']
): FormAssessmentTemplateBlock {
    const id = makeId(type)
    if (type === 'text') {
        return {
            id,
            type,
            content: 'Tulis isi dokumen di sini. Gunakan {nama} untuk data dinamis.',
            fontSize: 12,
            bold: false,
            italic: false,
            uppercase: false,
            align: 'left',
            lineHeight: 1.4,
            marginBottom: 8,
        }
    }
    if (type === 'logo') {
        return {
            id,
            type,
            width: 120,
            height: 120,
            align: 'center',
            marginBottom: 12,
        }
    }
    if (type === 'spacer') {
        return { id, type, height: 30, marginBottom: 0 }
    }
    if (type === 'key_value') {
        return {
            id,
            type,
            rows: [{ label: 'Nama', value: '{nama}' }],
            fontSize: 12,
            labelWidth: 35,
            marginBottom: 10,
        }
    }
    if (type === 'list') {
        return {
            id,
            type,
            items: ['Item pertama', 'Item kedua'],
            ordered: false,
            fontSize: 11,
            lineHeight: 1.3,
            marginBottom: 10,
        }
    }
    return {
        id,
        type: 'table',
        showBorders: true,
        headers: ['Kolom 1', 'Kolom 2', 'Kolom 3'],
        headerAlignments: ['center', 'center', 'center'],
        rows: [
            {
                values: [
                    'Isi kolom pertama',
                    'Isi kolom kedua',
                    'Isi kolom ketiga',
                ],
                alignments: ['left', 'left', 'left'],
            },
        ],
        fontSize: 11,
        columnWidths: [33, 34, 33],
        marginBottom: 10,
    }
}

const cloneTemplate = (template: FormAssessmentPortraitTemplate) =>
    JSON.parse(JSON.stringify(template)) as FormAssessmentPortraitTemplate

function NumberField({
    label,
    value,
    min,
    max,
    step,
    onChange,
}: {
    label: string
    value: number
    min: number
    max: number
    step?: number
    onChange: (value: number) => void
}) {
    return (
        <div className="space-y-1.5">
            <Label>{label}</Label>
            <Input
                type="number"
                value={value}
                min={min}
                max={max}
                step={step}
                onChange={(event) =>
                    onChange(
                        Math.min(
                            Math.max(Number(event.target.value) || min, min),
                            max
                        )
                    )
                }
            />
        </div>
    )
}

function DocumentPreview({
    page,
    sampleValues,
    orientation,
}: {
    page: FormAssessmentTemplatePage | undefined
    sampleValues: Record<string, string>
    orientation: 'portrait' | 'landscape'
}) {
    if (!page) {
        return (
            <div className="flex aspect-210/297 items-center justify-center bg-white text-sm text-slate-400 shadow-xl">
                Pilih halaman untuk melihat preview.
            </div>
        )
    }

    const resolve = (value: string) =>
        resolveFormAssessmentPlaceholders(value, sampleValues)

    return (
        <div
            className={cn(
                'mx-auto origin-top bg-white px-[57px] py-[57px] font-serif text-black shadow-xl',
                orientation === 'portrait'
                    ? 'min-h-[842px] w-[595px] scale-[0.72] xl:scale-[0.78] 2xl:scale-[0.9]'
                    : 'min-h-[595px] w-[842px] scale-[0.52] xl:scale-[0.58] 2xl:scale-[0.68]'
            )}
        >
            {page.blocks.map((block) => {
                if (block.type === 'text') {
                    return (
                        <div
                            key={block.id}
                            style={{
                                fontSize: `${block.fontSize}px`,
                                fontWeight: block.bold ? 700 : 400,
                                fontStyle: block.italic ? 'italic' : 'normal',
                                textTransform: block.uppercase
                                    ? 'uppercase'
                                    : 'none',
                                textAlign: block.align,
                                lineHeight: block.lineHeight,
                                marginBottom: block.marginBottom,
                                whiteSpace: 'pre-wrap',
                            }}
                        >
                            {resolve(block.content)}
                        </div>
                    )
                }
                if (block.type === 'logo') {
                    return (
                        <div
                            key={block.id}
                            className={cn(
                                'flex',
                                block.align === 'left' && 'justify-start',
                                block.align === 'center' && 'justify-center',
                                block.align === 'right' && 'justify-end'
                            )}
                            style={{ marginBottom: block.marginBottom }}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/images/logo.png"
                                alt="Logo institusi"
                                style={{
                                    width: block.width,
                                    height: block.height,
                                    objectFit: 'contain',
                                }}
                            />
                        </div>
                    )
                }
                if (block.type === 'spacer') {
                    return (
                        <div
                            key={block.id}
                            style={{
                                height: block.height,
                                marginBottom: block.marginBottom,
                            }}
                        />
                    )
                }
                if (block.type === 'key_value') {
                    return (
                        <div
                            key={block.id}
                            style={{
                                fontSize: block.fontSize,
                                marginBottom: block.marginBottom,
                            }}
                        >
                            {block.rows.map((row, index) => (
                                <div
                                    key={index}
                                    className="flex gap-1"
                                    style={{ marginBottom: 3 }}
                                >
                                    <strong
                                        style={{ width: `${block.labelWidth}%` }}
                                    >
                                        {resolve(row.label)}
                                    </strong>
                                    <span className="w-[3%]">:</span>
                                    <span
                                        style={{
                                            width: `${97 - block.labelWidth}%`,
                                        }}
                                    >
                                        {resolve(row.value)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )
                }
                if (block.type === 'list') {
                    return (
                        <div
                            key={block.id}
                            style={{
                                fontSize: block.fontSize,
                                lineHeight: block.lineHeight,
                                marginBottom: block.marginBottom,
                            }}
                        >
                            {block.items.map((item, index) => (
                                <div key={index} className="flex gap-1">
                                    <span className="w-5 shrink-0">
                                        {block.ordered ? `${index + 1}.` : '•'}
                                    </span>
                                    <span className="text-justify">
                                        {resolve(item)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )
                }
                return (
                    <table
                        key={block.id}
                        className="w-full border-collapse"
                        style={{
                            fontSize: block.fontSize,
                            marginBottom: block.marginBottom,
                        }}
                    >
                        <thead>
                            <tr>
                                {block.headers.map((header, index) => (
                                    <th
                                        key={index}
                                        className={cn(
                                            'p-1.5 text-center',
                                            block.showBorders &&
                                            'border border-black'
                                        )}
                                        style={{
                                            width: `${block.columnWidths[index]}%`,
                                            textAlign:
                                                block.headerAlignments[index],
                                        }}
                                    >
                                        {resolve(header)}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {block.rows.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.values.map((value, columnIndex) => (
                                        <td
                                            key={columnIndex}
                                            className={cn(
                                                'whitespace-pre-wrap p-1.5',
                                                block.showBorders &&
                                                'border border-black'
                                            )}
                                            style={{
                                                textAlign:
                                                    row.alignments[columnIndex],
                                            }}
                                        >
                                            {resolve(value)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )
            })}
        </div>
    )
}

export interface DocumentTemplateBuilderConfig {
    title: string
    description: string
    sectionLabel: string
    orientation: 'portrait' | 'landscape'
    placeholders: ReadonlyArray<{ key: string; label: string }>
    sampleValues: Record<string, string>
    placementOptions: Array<{
        value: DocumentTemplatePlacement
        label: string
    }>
    load: () => Promise<{
        template: FormAssessmentPortraitTemplate
        updatedAt: string | null
    }>
    save: (
        template: FormAssessmentPortraitTemplate
    ) => Promise<{
        template: FormAssessmentPortraitTemplate
        updatedAt: string | null
    }>
    getDefault: () => FormAssessmentPortraitTemplate
}

export function DocumentTemplateBuilder({
    config,
}: {
    config: DocumentTemplateBuilderConfig
}) {
    const [template, setTemplate] =
        useState<FormAssessmentPortraitTemplate | null>(null)
    const [selectedPageId, setSelectedPageId] = useState('')
    const [selectedBlockId, setSelectedBlockId] = useState('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [dirty, setDirty] = useState(false)
    const [updatedAt, setUpdatedAt] = useState<string | null>(null)

    useEffect(() => {
        let active = true
        config
            .load()
            .then((response) => {
                if (!active) return
                setTemplate(response.template)
                setSelectedPageId(response.template.pages[0]?.id ?? '')
                setSelectedBlockId(
                    response.template.pages[0]?.blocks[0]?.id ?? ''
                )
                setUpdatedAt(response.updatedAt)
            })
            .catch((error) => {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : 'Gagal mengambil template.'
                )
            })
            .finally(() => active && setLoading(false))
        return () => {
            active = false
        }
    }, [config])

    const selectedPage = useMemo(
        () => template?.pages.find((page) => page.id === selectedPageId),
        [template, selectedPageId]
    )
    const selectedBlock = useMemo(
        () =>
            selectedPage?.blocks.find(
                (block) => block.id === selectedBlockId
            ),
        [selectedPage, selectedBlockId]
    )

    const mutateTemplate = (
        mutation: (draft: FormAssessmentPortraitTemplate) => void
    ) => {
        setTemplate((current) => {
            if (!current) return current
            const draft = cloneTemplate(current)
            mutation(draft)
            return draft
        })
        setDirty(true)
    }

    const updatePage = (patch: Partial<FormAssessmentTemplatePage>) => {
        mutateTemplate((draft) => {
            const page = draft.pages.find((item) => item.id === selectedPageId)
            if (page) Object.assign(page, patch)
        })
    }

    const updateBlock = (next: FormAssessmentTemplateBlock) => {
        mutateTemplate((draft) => {
            const page = draft.pages.find((item) => item.id === selectedPageId)
            const index = page?.blocks.findIndex(
                (item) => item.id === selectedBlockId
            )
            if (page && index !== undefined && index >= 0) {
                page.blocks[index] = next
            }
        })
    }

    const addBlock = (type: FormAssessmentTemplateBlock['type']) => {
        const block = createBlock(type)
        mutateTemplate((draft) => {
            const page = draft.pages.find((item) => item.id === selectedPageId)
            page?.blocks.push(block)
        })
        setSelectedBlockId(block.id)
    }

    const moveBlock = (direction: -1 | 1) => {
        mutateTemplate((draft) => {
            const page = draft.pages.find((item) => item.id === selectedPageId)
            if (!page) return
            const index = page.blocks.findIndex(
                (item) => item.id === selectedBlockId
            )
            const destination = index + direction
            if (
                index < 0 ||
                destination < 0 ||
                destination >= page.blocks.length
            )
                return
                    ;[page.blocks[index], page.blocks[destination]] = [
                        page.blocks[destination],
                        page.blocks[index],
                    ]
        })
    }

    const duplicateBlock = () => {
        if (!selectedBlock) return
        const copy = {
            ...cloneTemplate({
                version: 1,
                pages: [
                    {
                        id: 'copy',
                        name: 'copy',
                        placement: 'before_landscape',
                        blocks: [selectedBlock],
                    },
                ],
            }).pages[0].blocks[0],
            id: makeId(selectedBlock.type),
        } as FormAssessmentTemplateBlock
        mutateTemplate((draft) => {
            const page = draft.pages.find((item) => item.id === selectedPageId)
            if (!page) return
            const index = page.blocks.findIndex(
                (item) => item.id === selectedBlockId
            )
            page.blocks.splice(index + 1, 0, copy)
        })
        setSelectedBlockId(copy.id)
    }

    const removeBlock = () => {
        if (!selectedPage || !selectedBlock) return
        const index = selectedPage.blocks.findIndex(
            (item) => item.id === selectedBlock.id
        )
        const nextId =
            selectedPage.blocks[index + 1]?.id ??
            selectedPage.blocks[index - 1]?.id ??
            ''
        mutateTemplate((draft) => {
            const page = draft.pages.find((item) => item.id === selectedPageId)
            if (page) {
                page.blocks = page.blocks.filter(
                    (item) => item.id !== selectedBlock.id
                )
            }
        })
        setSelectedBlockId(nextId)
    }

    const addPage = () => {
        const page: FormAssessmentTemplatePage = {
            id: makeId('page'),
            name: `Halaman ${(template?.pages.length ?? 0) + 1}`,
            placement: config.placementOptions[0].value,
            blocks: [createBlock('text')],
        }
        mutateTemplate((draft) => draft.pages.push(page))
        setSelectedPageId(page.id)
        setSelectedBlockId(page.blocks[0].id)
    }

    const removePage = () => {
        if (!template || template.pages.length <= 1) {
            toast.error('Template harus memiliki minimal satu bagian dokumen.')
            return
        }
        const index = template.pages.findIndex(
            (page) => page.id === selectedPageId
        )
        const nextPage = template.pages[index + 1] ?? template.pages[index - 1]
        mutateTemplate((draft) => {
            draft.pages = draft.pages.filter(
                (page) => page.id !== selectedPageId
            )
        })
        setSelectedPageId(nextPage.id)
        setSelectedBlockId(nextPage.blocks[0]?.id ?? '')
    }

    const handleSave = async () => {
        if (!template) return
        setSaving(true)
        try {
            const response = await config.save(template)
            setTemplate(response.template)
            setUpdatedAt(response.updatedAt)
            setDirty(false)
            toast.success('Template dokumen berhasil disimpan.')
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Gagal menyimpan template.'
            )
        } finally {
            setSaving(false)
        }
    }

    const restoreDefault = () => {
        const defaults = config.getDefault()
        setTemplate(defaults)
        setSelectedPageId(defaults.pages[0].id)
        setSelectedBlockId(defaults.pages[0].blocks[0]?.id ?? '')
        setDirty(true)
        toast.info(
            'Template default dimuat. Klik Simpan agar perubahan diterapkan.'
        )
    }

    const copyPlaceholder = async (key: string) => {
        await navigator.clipboard.writeText(`{${key}}`)
        toast.success(`{${key}} disalin.`)
    }

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="size-7 animate-spin text-primary" />
            </div>
        )
    }

    if (!template) {
        return (
            <Card>
                <CardContent className="py-12 text-center text-sm text-muted-foreground">
                    Template tidak dapat dimuat. Muat ulang halaman untuk mencoba
                    kembali.
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            <Card className="gap-4">
                <CardHeader className="gap-3 md:grid-cols-[1fr_auto]">
                    <div>
                        <CardTitle>{config.title}</CardTitle>
                        <CardDescription className="mt-2">
                            {config.description}
                        </CardDescription>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={restoreDefault}
                            disabled={saving}
                        >
                            <RotateCcw />
                            Muat Default
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={saving || !dirty}
                        >
                            {saving ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <Save />
                            )}
                            Simpan Template
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                    <span>
                        Status: {dirty ? 'Ada perubahan belum disimpan' : 'Tersimpan'}
                    </span>
                    {updatedAt && (
                        <span>
                            Terakhir disimpan:{' '}
                            {new Intl.DateTimeFormat('id-ID', {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                            }).format(new Date(updatedAt))}
                        </span>
                    )}
                </CardContent>
            </Card>

            <div className="grid gap-4 xl:grid-cols-[280px_minmax(380px,1fr)_minmax(440px,0.95fr)]">
                <div className="space-y-4">
                    <Card className="gap-4">
                        <CardHeader className="flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-base">
                                    {config.sectionLabel}
                                </CardTitle>
                            </div>
                            <Button
                                size="icon"
                                variant="outline"
                                onClick={addPage}
                                title="Tambah halaman"
                            >
                                <FilePlus2 />
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {template.pages.map((page) => (
                                <button
                                    key={page.id}
                                    type="button"
                                    onClick={() => {
                                        setSelectedPageId(page.id)
                                        setSelectedBlockId(
                                            page.blocks[0]?.id ?? ''
                                        )
                                    }}
                                    className={cn(
                                        'w-full rounded-lg border p-3 text-left transition-colors',
                                        page.id === selectedPageId
                                            ? 'border-primary bg-primary/10'
                                            : 'hover:bg-muted/60'
                                    )}
                                >
                                    <span className="block text-sm font-medium">
                                        {page.name}
                                    </span>
                                    <span className="mt-1 block text-xs text-muted-foreground">
                                        {config.placementOptions.find(
                                            (option) =>
                                                option.value === page.placement
                                        )?.label ?? page.placement}
                                    </span>
                                </button>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="gap-4">
                        <CardHeader>
                            <CardTitle className="text-base">
                                Placeholder database
                            </CardTitle>
                            <CardDescription>
                                Klik untuk menyalin, lalu tempel pada teks atau
                                nilai.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex max-h-[360px] flex-wrap gap-2 overflow-y-auto">
                            {config.placeholders.map((field) => (
                                <button
                                    key={field.key}
                                    type="button"
                                    title={field.label}
                                    onClick={() => copyPlaceholder(field.key)}
                                    className="rounded-md border bg-background px-2 py-1 font-mono text-xs hover:border-primary hover:bg-primary/5"
                                >
                                    {'{'}
                                    {field.key}
                                    {'}'}
                                </button>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <Card className="min-w-0 gap-4">
                    <CardHeader className="border-b">
                        <div className="grid gap-3 sm:grid-cols-[1fr_190px_auto]">
                            <div className="space-y-1.5">
                                <Label>Nama halaman</Label>
                                <Input
                                    value={selectedPage?.name ?? ''}
                                    onChange={(event) =>
                                        updatePage({ name: event.target.value })
                                    }
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Posisi</Label>
                                <select
                                    className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                                    value={
                                        selectedPage?.placement ??
                                        config.placementOptions[0].value
                                    }
                                    onChange={(event) =>
                                        updatePage({
                                            placement: event.target.value as
                                                DocumentTemplatePlacement,
                                        })
                                    }
                                >
                                    {config.placementOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <Button
                                size="icon"
                                variant="destructive"
                                className="self-end"
                                onClick={removePage}
                                title="Hapus halaman"
                            >
                                <Trash2 />
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div>
                            <Label className="mb-2">Susunan blok</Label>
                            <div className="space-y-2">
                                {selectedPage?.blocks.map((block) => {
                                    const Icon = blockIcons[block.type]
                                    return (
                                        <button
                                            key={block.id}
                                            type="button"
                                            onClick={() =>
                                                setSelectedBlockId(block.id)
                                            }
                                            className={cn(
                                                'flex w-full items-center gap-2 rounded-md border px-3 py-2 text-sm',
                                                block.id === selectedBlockId
                                                    ? 'border-primary bg-primary/10'
                                                    : 'hover:bg-muted/60'
                                            )}
                                        >
                                            <GripVertical className="size-4 text-muted-foreground" />
                                            <Icon className="size-4" />
                                            <span>{blockNames[block.type]}</span>
                                            {block.type === 'text' && (
                                                <span className="min-w-0 flex-1 truncate text-right text-xs text-muted-foreground">
                                                    {block.content}
                                                </span>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 border-b pb-4">
                            {(
                                Object.keys(blockNames) as Array<
                                    FormAssessmentTemplateBlock['type']
                                >
                            ).map((type) => {
                                const Icon = blockIcons[type]
                                return (
                                    <Button
                                        key={type}
                                        size="sm"
                                        variant="outline"
                                        onClick={() => addBlock(type)}
                                    >
                                        <Icon />
                                        {blockNames[type]}
                                    </Button>
                                )
                            })}
                        </div>

                        {selectedBlock ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between gap-2">
                                    <div>
                                        <h3 className="font-medium">
                                            Pengaturan{' '}
                                            {blockNames[selectedBlock.type]}
                                        </h3>
                                        <p className="text-xs text-muted-foreground">
                                            Preview menggunakan data contoh.
                                        </p>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => moveBlock(-1)}
                                            title="Geser ke atas"
                                        >
                                            <ArrowUp />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => moveBlock(1)}
                                            title="Geser ke bawah"
                                        >
                                            <ArrowDown />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={duplicateBlock}
                                            title="Duplikat blok"
                                        >
                                            <Copy />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="destructive"
                                            onClick={removeBlock}
                                            title="Hapus blok"
                                        >
                                            <Trash2 />
                                        </Button>
                                    </div>
                                </div>

                                {selectedBlock.type === 'text' && (
                                    <>
                                        <div className="space-y-1.5">
                                            <Label>Isi teks</Label>
                                            <Textarea
                                                className="min-h-32 font-serif"
                                                value={selectedBlock.content}
                                                onChange={(event) =>
                                                    updateBlock({
                                                        ...selectedBlock,
                                                        content:
                                                            event.target.value,
                                                    })
                                                }
                                                placeholder="Contoh: Nama mahasiswa {nama}"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                            <NumberField
                                                label="Ukuran font"
                                                value={selectedBlock.fontSize}
                                                min={6}
                                                max={36}
                                                onChange={(fontSize) =>
                                                    updateBlock({
                                                        ...selectedBlock,
                                                        fontSize,
                                                    })
                                                }
                                            />
                                            <NumberField
                                                label="Jarak bawah"
                                                value={
                                                    selectedBlock.marginBottom
                                                }
                                                min={0}
                                                max={200}
                                                onChange={(marginBottom) =>
                                                    updateBlock({
                                                        ...selectedBlock,
                                                        marginBottom,
                                                    })
                                                }
                                            />
                                            <NumberField
                                                label="Tinggi baris"
                                                value={selectedBlock.lineHeight}
                                                min={1}
                                                max={3}
                                                step={0.1}
                                                onChange={(lineHeight) =>
                                                    updateBlock({
                                                        ...selectedBlock,
                                                        lineHeight,
                                                    })
                                                }
                                            />
                                            <div className="space-y-1.5">
                                                <Label>Perataan</Label>
                                                <div className="flex">
                                                    {(
                                                        [
                                                            ['left', AlignLeft],
                                                            [
                                                                'center',
                                                                AlignCenter,
                                                            ],
                                                            [
                                                                'right',
                                                                AlignRight,
                                                            ],
                                                            [
                                                                'justify',
                                                                AlignJustify,
                                                            ],
                                                        ] as const
                                                    ).map(([align, Icon]) => (
                                                        <Button
                                                            key={align}
                                                            size="icon"
                                                            variant={
                                                                selectedBlock.align ===
                                                                    align
                                                                    ? 'default'
                                                                    : 'outline'
                                                            }
                                                            className="rounded-none first:rounded-l-md last:rounded-r-md"
                                                            onClick={() =>
                                                                updateBlock({
                                                                    ...selectedBlock,
                                                                    align: align as FormAssessmentTextAlign,
                                                                })
                                                            }
                                                        >
                                                            <Icon />
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm">
                                            {[
                                                ['bold', 'Tebal'],
                                                ['italic', 'Miring'],
                                                ['uppercase', 'Huruf kapital'],
                                            ].map(([field, label]) => (
                                                <label
                                                    key={field}
                                                    className="flex items-center gap-2"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            selectedBlock[
                                                            field as
                                                            | 'bold'
                                                            | 'italic'
                                                            | 'uppercase'
                                                            ]
                                                        }
                                                        onChange={(event) =>
                                                            updateBlock({
                                                                ...selectedBlock,
                                                                [field]:
                                                                    event.target
                                                                        .checked,
                                                            })
                                                        }
                                                    />
                                                    {label}
                                                </label>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {selectedBlock.type === 'logo' && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <NumberField
                                            label="Lebar logo"
                                            value={selectedBlock.width}
                                            min={20}
                                            max={300}
                                            onChange={(width) =>
                                                updateBlock({
                                                    ...selectedBlock,
                                                    width,
                                                })
                                            }
                                        />
                                        <NumberField
                                            label="Tinggi logo"
                                            value={selectedBlock.height}
                                            min={20}
                                            max={300}
                                            onChange={(height) =>
                                                updateBlock({
                                                    ...selectedBlock,
                                                    height,
                                                })
                                            }
                                        />
                                        <NumberField
                                            label="Jarak bawah"
                                            value={selectedBlock.marginBottom}
                                            min={0}
                                            max={200}
                                            onChange={(marginBottom) =>
                                                updateBlock({
                                                    ...selectedBlock,
                                                    marginBottom,
                                                })
                                            }
                                        />
                                        <div className="space-y-1.5">
                                            <Label>Perataan</Label>
                                            <select
                                                className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                                                value={selectedBlock.align}
                                                onChange={(event) =>
                                                    updateBlock({
                                                        ...selectedBlock,
                                                        align: event.target
                                                            .value as
                                                            | 'left'
                                                            | 'center'
                                                            | 'right',
                                                    })
                                                }
                                            >
                                                <option value="left">
                                                    Kiri
                                                </option>
                                                <option value="center">
                                                    Tengah
                                                </option>
                                                <option value="right">
                                                    Kanan
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {selectedBlock.type === 'spacer' && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <NumberField
                                            label="Tinggi jarak"
                                            value={selectedBlock.height}
                                            min={1}
                                            max={300}
                                            onChange={(height) =>
                                                updateBlock({
                                                    ...selectedBlock,
                                                    height,
                                                })
                                            }
                                        />
                                        <NumberField
                                            label="Jarak bawah"
                                            value={selectedBlock.marginBottom}
                                            min={0}
                                            max={200}
                                            onChange={(marginBottom) =>
                                                updateBlock({
                                                    ...selectedBlock,
                                                    marginBottom,
                                                })
                                            }
                                        />
                                    </div>
                                )}

                                {selectedBlock.type === 'list' && (
                                    <>
                                        <div className="space-y-1.5">
                                            <Label>
                                                Item daftar — satu item per baris
                                            </Label>
                                            <Textarea
                                                className="min-h-40"
                                                value={selectedBlock.items.join(
                                                    '\n'
                                                )}
                                                onChange={(event) =>
                                                    updateBlock({
                                                        ...selectedBlock,
                                                        items: event.target.value.split(
                                                            '\n'
                                                        ),
                                                    })
                                                }
                                            />
                                        </div>
                                        <label className="flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={selectedBlock.ordered}
                                                onChange={(event) =>
                                                    updateBlock({
                                                        ...selectedBlock,
                                                        ordered:
                                                            event.target.checked,
                                                    })
                                                }
                                            />
                                            <ListOrdered className="size-4" />
                                            Gunakan nomor urut
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            <NumberField
                                                label="Ukuran font"
                                                value={selectedBlock.fontSize}
                                                min={6}
                                                max={24}
                                                onChange={(fontSize) =>
                                                    updateBlock({
                                                        ...selectedBlock,
                                                        fontSize,
                                                    })
                                                }
                                            />
                                            <NumberField
                                                label="Tinggi baris"
                                                value={selectedBlock.lineHeight}
                                                min={1}
                                                max={3}
                                                step={0.1}
                                                onChange={(lineHeight) =>
                                                    updateBlock({
                                                        ...selectedBlock,
                                                        lineHeight,
                                                    })
                                                }
                                            />
                                            <NumberField
                                                label="Jarak bawah"
                                                value={
                                                    selectedBlock.marginBottom
                                                }
                                                min={0}
                                                max={200}
                                                onChange={(marginBottom) =>
                                                    updateBlock({
                                                        ...selectedBlock,
                                                        marginBottom,
                                                    })
                                                }
                                            />
                                        </div>
                                    </>
                                )}

                                {selectedBlock.type === 'key_value' && (
                                    <>
                                        <div className="space-y-2">
                                            {selectedBlock.rows.map(
                                                (row, index) => (
                                                    <div
                                                        key={index}
                                                        className="grid grid-cols-[1fr_1fr_auto] gap-2"
                                                    >
                                                        <Input
                                                            value={row.label}
                                                            placeholder="Label"
                                                            onChange={(event) => {
                                                                const rows = [
                                                                    ...selectedBlock.rows,
                                                                ]
                                                                rows[index] = {
                                                                    ...row,
                                                                    label: event
                                                                        .target
                                                                        .value,
                                                                }
                                                                updateBlock({
                                                                    ...selectedBlock,
                                                                    rows,
                                                                })
                                                            }}
                                                        />
                                                        <Input
                                                            value={row.value}
                                                            placeholder="{nama}"
                                                            onChange={(event) => {
                                                                const rows = [
                                                                    ...selectedBlock.rows,
                                                                ]
                                                                rows[index] = {
                                                                    ...row,
                                                                    value: event
                                                                        .target
                                                                        .value,
                                                                }
                                                                updateBlock({
                                                                    ...selectedBlock,
                                                                    rows,
                                                                })
                                                            }}
                                                        />
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            onClick={() =>
                                                                updateBlock({
                                                                    ...selectedBlock,
                                                                    rows: selectedBlock.rows.filter(
                                                                        (
                                                                            _,
                                                                            rowIndex
                                                                        ) =>
                                                                            rowIndex !==
                                                                            index
                                                                    ),
                                                                })
                                                            }
                                                        >
                                                            <Trash2 />
                                                        </Button>
                                                    </div>
                                                )
                                            )}
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    updateBlock({
                                                        ...selectedBlock,
                                                        rows: [
                                                            ...selectedBlock.rows,
                                                            {
                                                                label: 'Label',
                                                                value: '{nama}',
                                                            },
                                                        ],
                                                    })
                                                }
                                            >
                                                <Plus /> Tambah baris
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            <NumberField
                                                label="Ukuran font"
                                                value={selectedBlock.fontSize}
                                                min={6}
                                                max={24}
                                                onChange={(fontSize) =>
                                                    updateBlock({
                                                        ...selectedBlock,
                                                        fontSize,
                                                    })
                                                }
                                            />
                                            <NumberField
                                                label="Lebar label (%)"
                                                value={
                                                    selectedBlock.labelWidth
                                                }
                                                min={15}
                                                max={70}
                                                onChange={(labelWidth) =>
                                                    updateBlock({
                                                        ...selectedBlock,
                                                        labelWidth,
                                                    })
                                                }
                                            />
                                            <NumberField
                                                label="Jarak bawah"
                                                value={
                                                    selectedBlock.marginBottom
                                                }
                                                min={0}
                                                max={200}
                                                onChange={(marginBottom) =>
                                                    updateBlock({
                                                        ...selectedBlock,
                                                        marginBottom,
                                                    })
                                                }
                                            />
                                        </div>
                                    </>
                                )}

                                {selectedBlock.type === 'table' &&
                                    Boolean(0) && (
                                        <>
                                            <label className="flex items-center gap-2 rounded-md border p-3 text-sm">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        selectedBlock.showBorders
                                                    }
                                                    onChange={(event) =>
                                                        updateBlock({
                                                            ...selectedBlock,
                                                            showBorders:
                                                                event.target.checked,
                                                        })
                                                    }
                                                />
                                                Tampilkan garis tabel
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {[0, 1].map((index) => (
                                                    <div
                                                        key={index}
                                                        className="space-y-1.5"
                                                    >
                                                        <Label>
                                                            Header kolom {index + 1}
                                                        </Label>
                                                        <Input
                                                            value={
                                                                selectedBlock
                                                                    .headers[index]
                                                            }
                                                            onChange={(event) => {
                                                                const headers = [
                                                                    ...selectedBlock.headers,
                                                                ] as [string, string]
                                                                headers[index] =
                                                                    event.target.value
                                                                updateBlock({
                                                                    ...selectedBlock,
                                                                    headers,
                                                                })
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="space-y-3">
                                                {selectedBlock.rows.map(
                                                    (row, index) => (
                                                        <div
                                                            key={index}
                                                            className="rounded-lg border p-3"
                                                        >
                                                            <div className="mb-2 flex justify-between">
                                                                <Label>
                                                                    Baris {index + 1}
                                                                </Label>
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    onClick={() =>
                                                                        updateBlock({
                                                                            ...selectedBlock,
                                                                            rows: selectedBlock.rows.filter(
                                                                                (
                                                                                    _,
                                                                                    rowIndex
                                                                                ) =>
                                                                                    rowIndex !==
                                                                                    index
                                                                            ),
                                                                        })
                                                                    }
                                                                >
                                                                    <Trash2 />
                                                                </Button>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <Textarea
                                                                    value={
                                                                        row.label ??
                                                                        ''
                                                                    }
                                                                    placeholder="Kolom pertama"
                                                                    onChange={(
                                                                        event
                                                                    ) => {
                                                                        const rows =
                                                                            [
                                                                                ...selectedBlock.rows,
                                                                            ]
                                                                        rows[index] =
                                                                        {
                                                                            ...row,
                                                                            label: event
                                                                                .target
                                                                                .value,
                                                                        }
                                                                        updateBlock({
                                                                            ...selectedBlock,
                                                                            rows,
                                                                        })
                                                                    }}
                                                                />
                                                                <Textarea
                                                                    value={
                                                                        row.value ??
                                                                        ''
                                                                    }
                                                                    placeholder="Kolom kedua"
                                                                    onChange={(
                                                                        event
                                                                    ) => {
                                                                        const rows =
                                                                            [
                                                                                ...selectedBlock.rows,
                                                                            ]
                                                                        rows[index] =
                                                                        {
                                                                            ...row,
                                                                            value: event
                                                                                .target
                                                                                .value,
                                                                        }
                                                                        updateBlock({
                                                                            ...selectedBlock,
                                                                            rows,
                                                                        })
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        updateBlock({
                                                            ...selectedBlock,
                                                            rows: [
                                                                ...selectedBlock.rows,
                                                                {
                                                                    values: [
                                                                        'Kolom pertama',
                                                                        'Kolom kedua',
                                                                    ],
                                                                    alignments: [
                                                                        'left',
                                                                        'left',
                                                                    ],
                                                                    label: 'Kolom pertama',
                                                                    value: 'Kolom kedua',
                                                                },
                                                            ],
                                                        })
                                                    }
                                                >
                                                    <Plus /> Tambah baris
                                                </Button>
                                            </div>
                                            <div className="grid grid-cols-3 gap-3">
                                                <NumberField
                                                    label="Ukuran font"
                                                    value={selectedBlock.fontSize}
                                                    min={6}
                                                    max={24}
                                                    onChange={(fontSize) =>
                                                        updateBlock({
                                                            ...selectedBlock,
                                                            fontSize,
                                                        })
                                                    }
                                                />
                                                <NumberField
                                                    label="Kolom pertama (%)"
                                                    value={
                                                        selectedBlock.firstColumnWidth ??
                                                        50
                                                    }
                                                    min={15}
                                                    max={70}
                                                    onChange={(
                                                        firstColumnWidth
                                                    ) =>
                                                        updateBlock({
                                                            ...selectedBlock,
                                                            firstColumnWidth,
                                                        })
                                                    }
                                                />
                                                <NumberField
                                                    label="Jarak bawah"
                                                    value={
                                                        selectedBlock.marginBottom
                                                    }
                                                    min={0}
                                                    max={200}
                                                    onChange={(marginBottom) =>
                                                        updateBlock({
                                                            ...selectedBlock,
                                                            marginBottom,
                                                        })
                                                    }
                                                />
                                            </div>
                                        </>
                                    )}

                                {selectedBlock.type === 'table' && (
                                    <>
                                        <label className="flex items-center gap-2 rounded-md border p-3 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    selectedBlock.showBorders
                                                }
                                                onChange={(event) =>
                                                    updateBlock({
                                                        ...selectedBlock,
                                                        showBorders:
                                                            event.target.checked,
                                                    })
                                                }
                                            />
                                            Tampilkan garis tabel
                                        </label>
                                        <div
                                            className="grid gap-2"
                                            style={{
                                                gridTemplateColumns: `repeat(${selectedBlock.headers.length}, minmax(130px, 1fr))`,
                                            }}
                                        >
                                            {selectedBlock.headers.map(
                                                (_, index) => (
                                                    <div
                                                        key={index}
                                                        className="space-y-1.5"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <Label>
                                                                Header kolom{' '}
                                                                {index + 1}
                                                            </Label>
                                                            <Button
                                                                type="button"
                                                                size="icon"
                                                                variant="ghost"
                                                                disabled={
                                                                    selectedBlock
                                                                        .headers
                                                                        .length <=
                                                                    1
                                                                }
                                                                onClick={() => {
                                                                    const headers =
                                                                        selectedBlock.headers.filter(
                                                                            (
                                                                                _,
                                                                                columnIndex
                                                                            ) =>
                                                                                columnIndex !==
                                                                                index
                                                                        )
                                                                    const rows =
                                                                        selectedBlock.rows.map(
                                                                            (
                                                                                row
                                                                            ) => ({
                                                                                ...row,
                                                                                values: row.values.filter(
                                                                                    (
                                                                                        _,
                                                                                        columnIndex
                                                                                    ) =>
                                                                                        columnIndex !==
                                                                                        index
                                                                                ),
                                                                                alignments:
                                                                                    row.alignments.filter(
                                                                                        (
                                                                                            _,
                                                                                            columnIndex
                                                                                        ) =>
                                                                                            columnIndex !==
                                                                                            index
                                                                                    ),
                                                                            })
                                                                        )
                                                                    const width =
                                                                        100 /
                                                                        headers.length
                                                                    updateBlock({
                                                                        ...selectedBlock,
                                                                        headers,
                                                                        headerAlignments:
                                                                            selectedBlock.headerAlignments.filter(
                                                                                (
                                                                                    _,
                                                                                    columnIndex
                                                                                ) =>
                                                                                    columnIndex !==
                                                                                    index
                                                                            ),
                                                                        rows,
                                                                        columnWidths:
                                                                            headers.map(
                                                                                () =>
                                                                                    width
                                                                            ),
                                                                    })
                                                                }}
                                                                title="Hapus kolom"
                                                            >
                                                                <Trash2 />
                                                            </Button>
                                                        </div>
                                                        <Input
                                                            value={
                                                                selectedBlock
                                                                    .headers[index]
                                                            }
                                                            onChange={(event) => {
                                                                const headers = [
                                                                    ...selectedBlock.headers,
                                                                ]
                                                                headers[index] =
                                                                    event.target.value
                                                                updateBlock({
                                                                    ...selectedBlock,
                                                                    headers,
                                                                })
                                                            }}
                                                        />
                                                        <select
                                                            className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                                                            value={
                                                                selectedBlock
                                                                    .headerAlignments[
                                                                index
                                                                ]
                                                            }
                                                            onChange={(event) => {
                                                                const headerAlignments =
                                                                    [
                                                                        ...selectedBlock.headerAlignments,
                                                                    ]
                                                                headerAlignments[
                                                                    index
                                                                ] = event.target
                                                                    .value as FormAssessmentTableCellAlign
                                                                updateBlock({
                                                                    ...selectedBlock,
                                                                    headerAlignments,
                                                                })
                                                            }}
                                                        >
                                                            <option value="left">
                                                                Rata kiri
                                                            </option>
                                                            <option value="center">
                                                                Tengah
                                                            </option>
                                                            <option value="right">
                                                                Rata kanan
                                                            </option>
                                                        </select>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            disabled={
                                                selectedBlock.headers.length >=
                                                10
                                            }
                                            onClick={() => {
                                                const columnCount =
                                                    selectedBlock.headers
                                                        .length + 1
                                                const width = 100 / columnCount
                                                updateBlock({
                                                    ...selectedBlock,
                                                    headers: [
                                                        ...selectedBlock.headers,
                                                        `Kolom ${columnCount}`,
                                                    ],
                                                    headerAlignments: [
                                                        ...selectedBlock.headerAlignments,
                                                        'center' as FormAssessmentTableCellAlign,
                                                    ],
                                                    rows: selectedBlock.rows.map(
                                                        (row) => ({
                                                            ...row,
                                                            values: [
                                                                ...row.values,
                                                                '',
                                                            ],
                                                            alignments: [
                                                                ...row.alignments,
                                                                'left' as FormAssessmentTableCellAlign,
                                                            ],
                                                        })
                                                    ),
                                                    columnWidths: Array.from(
                                                        {
                                                            length: columnCount,
                                                        },
                                                        () => width
                                                    ),
                                                })
                                            }}
                                        >
                                            <Plus /> Tambah kolom
                                        </Button>

                                        <div className="space-y-3">
                                            {selectedBlock.rows.map(
                                                (row, rowIndex) => (
                                                    <div
                                                        key={rowIndex}
                                                        className="rounded-lg border p-3"
                                                    >
                                                        <div className="mb-2 flex items-center justify-between">
                                                            <Label>
                                                                Baris{' '}
                                                                {rowIndex + 1}
                                                            </Label>
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                onClick={() =>
                                                                    updateBlock({
                                                                        ...selectedBlock,
                                                                        rows: selectedBlock.rows.filter(
                                                                            (
                                                                                _,
                                                                                index
                                                                            ) =>
                                                                                index !==
                                                                                rowIndex
                                                                        ),
                                                                    })
                                                                }
                                                            >
                                                                <Trash2 />
                                                            </Button>
                                                        </div>
                                                        <div
                                                            className="grid gap-2"
                                                            style={{
                                                                gridTemplateColumns: `repeat(${selectedBlock.headers.length}, minmax(130px, 1fr))`,
                                                            }}
                                                        >
                                                            {row.values.map(
                                                                (
                                                                    _,
                                                                    columnIndex
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            columnIndex
                                                                        }
                                                                        className="space-y-2"
                                                                    >
                                                                        <Textarea
                                                                            value={
                                                                                row
                                                                                    .values[
                                                                                columnIndex
                                                                                ]
                                                                            }
                                                                            placeholder={`Kolom ${columnIndex + 1}`}
                                                                            onChange={(
                                                                                event
                                                                            ) => {
                                                                                const rows =
                                                                                    selectedBlock.rows.map(
                                                                                        (
                                                                                            item
                                                                                        ) => ({
                                                                                            ...item,
                                                                                            values: [
                                                                                                ...item.values,
                                                                                            ],
                                                                                            alignments:
                                                                                                [
                                                                                                    ...item.alignments,
                                                                                                ],
                                                                                        })
                                                                                    )
                                                                                rows[
                                                                                    rowIndex
                                                                                ].values[
                                                                                    columnIndex
                                                                                ] =
                                                                                    event.target.value
                                                                                updateBlock(
                                                                                    {
                                                                                        ...selectedBlock,
                                                                                        rows,
                                                                                    }
                                                                                )
                                                                            }}
                                                                        />
                                                                        <select
                                                                            className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                                                                            value={
                                                                                row
                                                                                    .alignments[
                                                                                columnIndex
                                                                                ]
                                                                            }
                                                                            onChange={(
                                                                                event
                                                                            ) => {
                                                                                const rows =
                                                                                    selectedBlock.rows.map(
                                                                                        (
                                                                                            item
                                                                                        ) => ({
                                                                                            ...item,
                                                                                            values: [
                                                                                                ...item.values,
                                                                                            ],
                                                                                            alignments:
                                                                                                [
                                                                                                    ...item.alignments,
                                                                                                ],
                                                                                        })
                                                                                    )
                                                                                rows[
                                                                                    rowIndex
                                                                                ].alignments[
                                                                                    columnIndex
                                                                                ] =
                                                                                    event
                                                                                        .target
                                                                                        .value as FormAssessmentTableCellAlign
                                                                                updateBlock(
                                                                                    {
                                                                                        ...selectedBlock,
                                                                                        rows,
                                                                                    }
                                                                                )
                                                                            }}
                                                                        >
                                                                            <option value="left">
                                                                                Rata
                                                                                kiri
                                                                            </option>
                                                                            <option value="center">
                                                                                Tengah
                                                                            </option>
                                                                            <option value="right">
                                                                                Rata
                                                                                kanan
                                                                            </option>
                                                                        </select>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    updateBlock({
                                                        ...selectedBlock,
                                                        rows: [
                                                            ...selectedBlock.rows,
                                                            {
                                                                values: Array.from(
                                                                    {
                                                                        length: selectedBlock
                                                                            .headers
                                                                            .length,
                                                                    },
                                                                    (
                                                                        _,
                                                                        index
                                                                    ) =>
                                                                        `Isi kolom ${index + 1}`
                                                                ),
                                                                alignments:
                                                                    Array.from(
                                                                        {
                                                                            length: selectedBlock
                                                                                .headers
                                                                                .length,
                                                                        },
                                                                        () =>
                                                                            'left' as const
                                                                    ),
                                                            },
                                                        ],
                                                    })
                                                }
                                            >
                                                <Plus /> Tambah baris
                                            </Button>
                                        </div>

                                        <div className="grid gap-3 sm:grid-cols-2">
                                            {selectedBlock.columnWidths.map(
                                                (_, index) => (
                                                    <NumberField
                                                        key={index}
                                                        label={`Lebar kolom ${index + 1} (%)`}
                                                        value={Math.round(
                                                            selectedBlock
                                                                .columnWidths[index]
                                                        )}
                                                        min={5}
                                                        max={Math.max(
                                                            5,
                                                            100 -
                                                            5 *
                                                            (selectedBlock
                                                                .columnWidths
                                                                .length -
                                                                1)
                                                        )}
                                                        onChange={(value) => {
                                                            const current = [
                                                                ...selectedBlock.columnWidths,
                                                            ]
                                                            if (
                                                                current.length ===
                                                                1
                                                            ) {
                                                                updateBlock({
                                                                    ...selectedBlock,
                                                                    columnWidths: [
                                                                        100,
                                                                    ],
                                                                })
                                                                return
                                                            }
                                                            const otherIndexes =
                                                                current
                                                                    .map(
                                                                        (
                                                                            _,
                                                                            columnIndex
                                                                        ) =>
                                                                            columnIndex
                                                                    )
                                                                    .filter(
                                                                        (item) =>
                                                                            item !== index
                                                                    )
                                                            const remaining =
                                                                100 - value
                                                            const otherTotal =
                                                                otherIndexes.reduce(
                                                                    (
                                                                        total,
                                                                        columnIndex
                                                                    ) =>
                                                                        total +
                                                                        current[
                                                                        columnIndex
                                                                        ],
                                                                    0
                                                                )
                                                            otherIndexes.forEach(
                                                                (columnIndex) => {
                                                                    current[
                                                                        columnIndex
                                                                    ] =
                                                                        otherTotal >
                                                                            0
                                                                            ? (remaining *
                                                                                current[
                                                                                columnIndex
                                                                                ]) /
                                                                            otherTotal
                                                                            : remaining /
                                                                            otherIndexes.length
                                                                }
                                                            )
                                                            current[index] = value
                                                            updateBlock({
                                                                ...selectedBlock,
                                                                columnWidths:
                                                                    current,
                                                            })
                                                        }}
                                                    />
                                                )
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <NumberField
                                                label="Ukuran font"
                                                value={selectedBlock.fontSize}
                                                min={6}
                                                max={24}
                                                onChange={(fontSize) =>
                                                    updateBlock({
                                                        ...selectedBlock,
                                                        fontSize,
                                                    })
                                                }
                                            />
                                            <NumberField
                                                label="Jarak bawah"
                                                value={
                                                    selectedBlock.marginBottom
                                                }
                                                min={0}
                                                max={200}
                                                onChange={(marginBottom) =>
                                                    updateBlock({
                                                        ...selectedBlock,
                                                        marginBottom,
                                                    })
                                                }
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
                                Tambahkan atau pilih blok untuk mulai mengedit.
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="min-w-0 overflow-hidden gap-4">
                    <CardHeader>
                        <CardTitle className="text-base">Preview A4</CardTitle>
                        <CardDescription>
                            Tampilan cetak final dapat sedikit bergeser mengikuti
                            panjang data asli.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[850px] overflow-auto bg-slate-200 p-6 dark:bg-slate-950">
                        <DocumentPreview
                            page={selectedPage}
                            sampleValues={config.sampleValues}
                            orientation={config.orientation}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

const assessmentBuilderConfig: DocumentTemplateBuilderConfig = {
    title: 'Template Formulir Asesmen',
    description:
        'Atur halaman portrait Form 03. Tabel asesmen landscape tetap menggunakan format sistem.',
    sectionLabel: 'Halaman portrait',
    orientation: 'portrait',
    placeholders: FORM_ASSESSMENT_PLACEHOLDERS,
    sampleValues: assessmentSampleValues,
    placementOptions: [
        { value: 'before_landscape', label: 'Sebelum tabel landscape' },
        { value: 'after_landscape', label: 'Sesudah tabel landscape' },
    ],
    load: getFormAssessmentTemplate,
    save: saveFormAssessmentTemplate,
    getDefault: cloneDefaultFormAssessmentTemplate,
}

export default function FormAsessmenComponents() {
    return <DocumentTemplateBuilder config={assessmentBuilderConfig} />
}

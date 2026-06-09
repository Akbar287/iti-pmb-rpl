import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatusStep {
    StatusId: string
    Status: string
    Urutan: number
    Tanggal: string | null
    Keterangan: string | null
    Aktif: number
}

interface TimelineData {
    PendaftaranId: string
    KodePendaftar: string
    Status: StatusStep[]
}

interface TimelineProps {
    data: TimelineData
    className?: string
}

export function Timeline({ data, className }: TimelineProps) {
    const steps = [...data.Status].sort((a, b) => a.Urutan - b.Urutan)

    // Step dianggap selesai jika Tanggal terisi DAN ada step berikutnya yang aktif
    const currentIndex = steps.findLastIndex((s) => s.Aktif === 1)

    return (
        <div className={cn('w-full', className)}>
            {/* Header */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                    <h2 className="text-lg font-semibold">Status Asesmen</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        {data.KodePendaftar}
                    </p>
                </div>
                {currentIndex >= 0 && (
                    <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-2.5 py-1 rounded-full font-medium">
                        Tahap {currentIndex + 1} / {steps.length}
                    </span>
                )}
            </div>

            {/* Stepper */}
            <ol className="relative">
                {steps.map((step, index) => {
                    const isCompleted = index < currentIndex
                    const isCurrent = index === currentIndex
                    const isPending = index > currentIndex
                    const isLast = index === steps.length - 1

                    return (
                        <li key={step.StatusId} className="flex gap-3 sm:gap-4">
                            {/* Indicator column */}
                            <div className="flex flex-col items-center shrink-0">
                                {/* Circle */}
                                <div
                                    className={cn(
                                        'flex items-center justify-center rounded-full shrink-0 font-semibold text-xs transition-all duration-300',
                                        'w-7 h-7',
                                        isCompleted &&
                                            'bg-green-500 text-white shadow-sm shadow-green-500/30',
                                        isCurrent &&
                                            'bg-blue-500 text-white shadow-md shadow-blue-500/40 ring-4 ring-blue-500/20',
                                        isPending &&
                                            'bg-muted text-muted-foreground border border-border'
                                    )}
                                >
                                    {isCompleted ? (
                                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                                    ) : isCurrent ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        <span>{index + 1}</span>
                                    )}
                                </div>

                                {/* Connector line */}
                                {!isLast && (
                                    <div
                                        className={cn(
                                            'w-px flex-1 my-1 min-h-6 transition-colors duration-500',
                                            isCompleted
                                                ? 'bg-green-400'
                                                : 'bg-border'
                                        )}
                                    />
                                )}
                            </div>

                            {/* Content column */}
                            <div
                                className={cn(
                                    'flex-1 pb-4 min-w-0',
                                    isLast && 'pb-0'
                                )}
                            >
                                <div
                                    className={cn(
                                        'rounded-lg px-3 py-2.5 transition-all duration-300',
                                        isCurrent &&
                                            'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800',
                                        isCompleted &&
                                            'bg-green-50/60 dark:bg-green-900/10',
                                        isPending && 'opacity-50'
                                    )}
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5">
                                        <span
                                            className={cn(
                                                'text-sm font-medium leading-snug',
                                                isCompleted &&
                                                    'text-green-700 dark:text-green-400',
                                                isCurrent &&
                                                    'text-blue-700 dark:text-blue-300',
                                                isPending &&
                                                    'text-foreground/60'
                                            )}
                                        >
                                            {step.Status}
                                        </span>
                                        {step.Tanggal && (
                                            <span className="text-xs text-muted-foreground shrink-0">
                                                {format(
                                                    new Date(step.Tanggal),
                                                    'd MMM yyyy',
                                                    { locale: id }
                                                )}
                                            </span>
                                        )}
                                    </div>
                                    {step.Keterangan && (
                                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                            {step.Keterangan}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ol>
        </div>
    )
}

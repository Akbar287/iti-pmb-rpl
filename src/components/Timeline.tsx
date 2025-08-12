import { format } from 'date-fns'
import {
    Check,
    Clock,
    FileText,
    User,
    Settings,
    MessageSquare,
    CheckCircle,
    Award,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { JSX } from 'react'

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

const getStatusIcon = (
    status: string,
    isCompleted: boolean,
    isCurrent: boolean
) => {
    const iconProps = {
        size: 20,
        className: cn(
            'transition-colors duration-300',
            isCompleted && 'text-white',
            isCurrent && 'text-white',
            !isCompleted && !isCurrent && 'text-gray-500'
        ),
    }

    const statusMap: { [key: string]: JSX.Element } = {
        'Pengisian Data Diri': <FileText {...iconProps} />,
        'Asessmen Mandiri': <User {...iconProps} />,
        'Penunjukan Asesor': <Settings {...iconProps} />,
        'Asessmen Oleh Asesor': <User {...iconProps} />,
        'Rekapitulasi Asessmen': <CheckCircle {...iconProps} />,
        Sanggahan: <MessageSquare {...iconProps} />,
        'Hasil Final Asessmen': <Award {...iconProps} />,
        'Penerbitan SK Asessmen': <Award {...iconProps} />,
    }

    return statusMap[status] || <Clock {...iconProps} />
}

export function Timeline({ data, className }: TimelineProps) {
    const sortedStatuses = data.Status.sort((a, b) => a.Urutan - b.Urutan)
    const currentStepIndex = sortedStatuses.findIndex(
        (step) => step.Aktif === 1
    )

    return (
        <Card
            className={cn(
                'p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800',
                className
            )}
        >
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                    Status Asessmen
                </h2>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Kode: {data.KodePendaftar}</span>
                    <span>•</span>
                    <span>ID: {data.PendaftaranId.slice(0, 8)}...</span>
                </div>
            </div>

            {/* Desktop Timeline */}
            <div className="hidden lg:block">
                <div className="relative">
                    {/* Progress Line */}
                    <div className="absolute top-8 left-8 right-8 h-1 bg-gray-200 dark:bg-gray-700">
                        <div
                            className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-700 ease-out"
                            style={{
                                width:
                                    currentStepIndex >= 0
                                        ? `${
                                              (currentStepIndex /
                                                  (sortedStatuses.length - 1)) *
                                              100
                                          }%`
                                        : '0%',
                            }}
                        />
                    </div>

                    {/* Timeline Steps */}
                    <div className="flex justify-between items-start">
                        {sortedStatuses.map((step, index) => {
                            const isCompleted =
                                step.Tanggal !== null && step.Aktif === 1
                            const isCurrent =
                                step.Aktif === 1 && step.Tanggal == null
                            const isPending = !isCompleted && !isCurrent

                            return (
                                <div
                                    key={step.StatusId}
                                    className="flex flex-col items-center flex-1 relative"
                                >
                                    <div
                                        className={cn(
                                            'w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-500 transform hover:scale-105',
                                            'shadow-lg backdrop-blur-sm z-10 relative',
                                            isCompleted &&
                                                'bg-green-500 border-green-500 shadow-green-500/30',
                                            isCurrent &&
                                                'bg-blue-500 border-blue-500 shadow-blue-500/40 animate-pulse',
                                            isPending &&
                                                'bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                                        )}
                                    >
                                        {isCompleted ? (
                                            <Check
                                                size={24}
                                                className="text-white"
                                            />
                                        ) : (
                                            getStatusIcon(
                                                step.Status,
                                                isCompleted,
                                                isCurrent
                                            )
                                        )}
                                    </div>

                                    {/* Status Content */}
                                    <div className="mt-4 text-center max-w-32">
                                        <h3
                                            className={cn(
                                                'font-semibold text-sm mb-1 transition-colors duration-300',
                                                isCompleted &&
                                                    'text-green-600 dark:text-green-400',
                                                isCurrent &&
                                                    'text-blue-600 dark:text-blue-400',
                                                isPending && 'text-gray-500'
                                            )}
                                        >
                                            {step.Status}
                                        </h3>
                                        {step.Tanggal && (
                                            <p className="text-xs text-muted-foreground">
                                                {format(
                                                    new Date(step.Tanggal),
                                                    'dd/MM/yyyy'
                                                )}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Mobile Timeline */}
            <div className="lg:hidden space-y-4">
                {sortedStatuses.map((step, index) => {
                    const isCompleted = step.Tanggal !== null
                    const isCurrent = step.Aktif === 1
                    const isPending = !isCompleted && !isCurrent
                    const isNotLast = index < sortedStatuses.length - 1

                    return (
                        <div key={step.StatusId} className="relative">
                            <div className="flex items-start gap-4">
                                {/* Status Circle */}
                                <div className="relative flex-shrink-0">
                                    <div
                                        className={cn(
                                            'w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500',
                                            'shadow-md z-10 relative',
                                            isCompleted &&
                                                'bg-green-500 border-green-500',
                                            isCurrent &&
                                                'bg-blue-500 border-blue-500 animate-pulse',
                                            isPending &&
                                                'bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                                        )}
                                    >
                                        {isCompleted ? (
                                            <Check
                                                size={20}
                                                className="text-white"
                                            />
                                        ) : (
                                            getStatusIcon(
                                                step.Status,
                                                isCompleted,
                                                isCurrent
                                            )
                                        )}
                                    </div>

                                    {/* Connector Line */}
                                    {isNotLast && (
                                        <div
                                            className={cn(
                                                'absolute top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-8 transition-colors duration-500',
                                                isCompleted
                                                    ? 'bg-green-500'
                                                    : 'bg-gray-200 dark:bg-gray-700'
                                            )}
                                        />
                                    )}
                                </div>

                                {/* Status Content */}
                                <div className="flex-1 pb-6">
                                    <h3
                                        className={cn(
                                            'font-semibold text-base mb-1 transition-colors duration-300',
                                            isCompleted &&
                                                'text-green-600 dark:text-green-400',
                                            isCurrent &&
                                                'text-blue-600 dark:text-blue-400',
                                            isPending && 'text-gray-500'
                                        )}
                                    >
                                        {step.Status}
                                    </h3>
                                    {step.Tanggal && (
                                        <p className="text-sm text-muted-foreground">
                                            {format(
                                                new Date(step.Tanggal),
                                                'dd MMMM yyyy'
                                            )}
                                        </p>
                                    )}
                                    {step.Keterangan && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {step.Keterangan}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </Card>
    )
}

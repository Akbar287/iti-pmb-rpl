'use client'

import React from 'react'
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Maximize,
    Minimize,
    Minus,
    MoveIcon,
    Plus,
    RotateCcw,
} from 'lucide-react'
import Image from 'next/image'

const Controls = ({ isFullscreen, toggleFullscreen }: { isFullscreen: boolean; toggleFullscreen: () => void }) => {
    const { zoomIn, zoomOut, resetTransform } = useControls()

    return (
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-white/90 dark:bg-gray-800/90 rounded-lg p-2 shadow-lg backdrop-blur-sm">
            <Button
                variant="outline"
                size="icon"
                onClick={() => zoomIn()}
                title="Zoom In"
            >
                <Plus className="h-4 w-4" />
            </Button>
            <Button
                variant="outline"
                size="icon"
                onClick={() => zoomOut()}
                title="Zoom Out"
            >
                <Minus className="h-4 w-4" />
            </Button>
            <Button
                variant="outline"
                size="icon"
                onClick={() => resetTransform()}
                title="Reset"
            >
                <RotateCcw className="h-4 w-4" />
            </Button>
            <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
            <Button
                variant="outline"
                size="icon"
                onClick={toggleFullscreen}
                title={isFullscreen ? 'Keluar Fullscreen' : 'Fullscreen'}
            >
                {isFullscreen ? (
                    <Minimize className="h-4 w-4" />
                ) : (
                    <Maximize className="h-4 w-4" />
                )}
            </Button>
        </div>
    )
}

export default function ProsesBisnisComponent() {
    const [isFullscreen, setIsFullscreen] = React.useState(false)
    const containerRef = React.useRef<HTMLDivElement>(null)

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen()
            setIsFullscreen(true)
        } else {
            document.exitFullscreen()
            setIsFullscreen(false)
        }
    }

    React.useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement)
        }
        document.addEventListener('fullscreenchange', handleFullscreenChange)
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange)
        }
    }, [])

    return (
        <div className="w-full">
            <Card className="bg-gray-50 shadow-md dark:bg-gray-800">
                <CardHeader>
                    <CardTitle>
                        <h1 className="text-2xl">Proses Bisnis RPL Terpadu</h1>
                    </CardTitle>
                    <CardDescription>
                        Diagram alur proses bisnis sistem informasi Rekognisi Pembelajaran Lampau (RPL) Terpadu.
                        Gunakan tombol zoom atau scroll mouse untuk memperbesar. Klik dan geser untuk melihat bagian lain.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Instructions */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <MoveIcon className="h-4 w-4" />
                            <span>Klik & geser untuk melihat</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Plus className="h-4 w-4" />
                            <Minus className="h-4 w-4" />
                            <span>Scroll untuk zoom</span>
                        </div>
                    </div>

                    {/* Diagram Viewer */}
                    <div
                        ref={containerRef}
                        className={`relative rounded-lg border bg-white dark:bg-gray-900 overflow-hidden ${isFullscreen ? 'h-screen' : 'h-[600px]'
                            }`}
                    >
                        <TransformWrapper
                            initialScale={1}
                            minScale={0.5}
                            maxScale={4}
                            centerOnInit
                            wheel={{ step: 0.1 }}
                        >
                            <Controls
                                isFullscreen={isFullscreen}
                                toggleFullscreen={toggleFullscreen}
                            />
                            <TransformComponent
                                wrapperStyle={{
                                    width: '100%',
                                    height: '100%',
                                }}
                                contentStyle={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Image
                                    src="/images/proses-bisnis-rpl.png"
                                    alt="Proses Bisnis RPL Terpadu"
                                    width={1920}
                                    height={1080}
                                    className="max-w-none"
                                    priority
                                    style={{
                                        objectFit: 'contain',
                                    }}
                                />
                            </TransformComponent>
                        </TransformWrapper>
                    </div>

                    {/* Legend */}
                    <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                        <h3 className="font-semibold mb-3">Keterangan Diagram:</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-green-700" />
                                <span>Start Event</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-red-500 border-4 border-red-700" />
                                <span>End Event</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-4 rounded bg-blue-500 border border-blue-700" />
                                <span>Task/Activity</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rotate-45 bg-yellow-400 border border-yellow-600" />
                                <span>Gateway/Decision</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

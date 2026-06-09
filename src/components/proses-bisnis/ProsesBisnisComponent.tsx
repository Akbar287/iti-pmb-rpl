'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
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

const DIAGRAM = `
flowchart TB
    subgraph pmb["PMB"]
        direction LR
        S(["●"])
        n1["1. Entri Data\\nMahasiswa"]
        S --> n1
    end

    subgraph mhs["Mahasiswa"]
        direction LR
        n2a["2a. Pengisian\\nData Diri"]
        n2b["2b. Upload\\nDokumen"]
        n3["3. Asesmen\\nMandiri"]
        gwD{"Disanggah ?"}
        n9a["9a. Sanggahan"]
        n10a["10a. Hasil Final\\nAsesmen"]
        n2a --> n2b --> n3
        gwD -->|T| n10a
        gwD -->|Y| n9a
    end

    subgraph kaprodi["Kepala Program Studi"]
        direction LR
        n4["4. Penunjukan\\nAsesor"]
    end

    subgraph asesor["Asesor"]
        direction LR
        n7["7. Asesmen\\nOleh Asesor"]
        n8["8. Rekapitulasi\\nHasil Asesmen"]
        n9b["9b. Perbaikan\\nAsesmen"]
        n7 --> n8
        n9b --> n8
    end

    subgraph akademik["Akademik"]
        direction LR
        n6["6. Penerbitan SK\\nPenugasan Asesor"]
        n10b["10b. Upload\\nDraft SK Final"]
        n12["12. Penerbitan SK\\nHasil Asesmen"]
        n13["13. Sinkronisasi\\nHasil Asesmen"]
        n14["14. Selesai"]
        E(["●"])
        n12 --> n13 --> n14 --> E
    end

    subgraph wakilrek["Wakil Rektor A"]
        direction LR
        n5["5. Persetujuan\\nPenunjukan Asesor"]
        gw1{"Disetujui ?"}
        n11["11. Persetujuan\\nHasil Asesmen"]
        gw2{"Disetujui ?"}
        n5 --> gw1
        n11 --> gw2
    end

    n1    --> n2a
    n3    --> n4
    n4    --> n5
    gw1   -->|Tidak| n4
    gw1   -->|Ya| n6
    n6    --> n7
    n8    --> gwD
    n9a   --> n9b
    n10a  --> n10b
    n10b  --> n11
    gw2   -->|Ya| n12

    classDef task    fill:#bfdbfe,stroke:#3b82f6,color:#1e3a8a
    classDef gw      fill:#fef08a,stroke:#ca8a04,color:#78350f
    classDef startEv fill:#22c55e,stroke:#15803d,color:#fff
    classDef endEv   fill:#dc2626,stroke:#991b1b,color:#fff

    class S startEv
    class E endEv
    class n1,n2a,n2b,n3,n4,n5,n6,n7,n8,n9a,n9b,n10a,n10b,n11,n12,n13,n14 task
    class gwD,gw1,gw2 gw

    style pmb      fill:#f8fafc,stroke:#94a3b8,color:#1e293b
    style mhs      fill:#f8fafc,stroke:#94a3b8,color:#1e293b
    style kaprodi  fill:#f8fafc,stroke:#94a3b8,color:#1e293b
    style asesor   fill:#f8fafc,stroke:#94a3b8,color:#1e293b
    style akademik fill:#f8fafc,stroke:#94a3b8,color:#1e293b
    style wakilrek fill:#f8fafc,stroke:#94a3b8,color:#1e293b
`

const MIN_SCALE = 0.2
const MAX_SCALE = 4
const ZOOM_STEP = 0.15

export default function ProsesBisnisComponent() {
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [svg, setSvg] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [scale, setScale] = useState(0.8)
    const [translate, setTranslate] = useState({ x: 0, y: 0 })

    const containerRef = useRef<HTMLDivElement>(null)
    const isDragging = useRef(false)
    const lastPos = useRef({ x: 0, y: 0 })

    useEffect(() => {
        let cancelled = false
        import('mermaid').then(({ default: mermaid }) => {
            mermaid.initialize({
                startOnLoad: false,
                theme: 'default',
                flowchart: { curve: 'basis', padding: 20 },
            })
            mermaid
                .render('proses-bisnis-rpl', DIAGRAM)
                .then(({ svg: rendered }) => {
                    if (!cancelled) setSvg(rendered)
                })
                .catch((err) => {
                    if (!cancelled) setError(String(err))
                })
        })
        return () => { cancelled = true }
    }, [])

    const handleWheel = useCallback((e: WheelEvent) => {
        e.preventDefault()
        const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP
        setScale((s) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s + delta)))
    }, [])

    useEffect(() => {
        const container = containerRef.current
        if (!container) return
        container.addEventListener('wheel', handleWheel, { passive: false })
        return () => container.removeEventListener('wheel', handleWheel)
    }, [handleWheel, svg])

    const handleMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true
        lastPos.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current) return
        const dx = e.clientX - lastPos.current.x
        const dy = e.clientY - lastPos.current.y
        lastPos.current = { x: e.clientX, y: e.clientY }
        setTranslate((t) => ({ x: t.x + dx, y: t.y + dy }))
    }

    const stopDrag = () => { isDragging.current = false }

    const zoomIn = () => setScale((s) => Math.min(MAX_SCALE, s + ZOOM_STEP))
    const zoomOut = () => setScale((s) => Math.max(MIN_SCALE, s - ZOOM_STEP))
    const reset = () => { setScale(0.8); setTranslate({ x: 0, y: 0 }) }

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen()
        } else {
            document.exitFullscreen()
        }
    }

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement)
        }
        document.addEventListener('fullscreenchange', handleFullscreenChange)
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }, [])

    return (
        <div className="w-full">
            <Card className="shadow-md">
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
                    <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <MoveIcon className="h-4 w-4" />
                            <span>Klik &amp; geser untuk melihat</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Plus className="h-4 w-4" />
                            <Minus className="h-4 w-4" />
                            <span>Scroll untuk zoom</span>
                        </div>
                    </div>

                    <div
                        ref={containerRef}
                        className={`relative rounded-lg border bg-white dark:bg-gray-900 overflow-hidden select-none ${isFullscreen ? 'h-screen' : 'h-[600px]'
                            }`}
                        style={{ cursor: isDragging.current ? 'grabbing' : 'grab' }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={stopDrag}
                        onMouseLeave={stopDrag}
                    >
                        {/* Controls */}
                        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-white/90 dark:bg-gray-800/90 rounded-lg p-2 shadow-lg backdrop-blur-sm">
                            <Button variant="outline" size="icon" onClick={zoomIn} title="Zoom In">
                                <Plus className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={zoomOut} title="Zoom Out">
                                <Minus className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={reset} title="Reset">
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

                        {/* Content */}
                        {error ? (
                            <div className="flex items-center justify-center h-full text-red-500 p-4">
                                <pre className="text-xs">{error}</pre>
                            </div>
                        ) : !svg ? (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                Memuat diagram...
                            </div>
                        ) : (
                            <div
                                style={{
                                    transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
                                    transformOrigin: 'center center',
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: isDragging.current ? 'none' : 'transform 0.1s ease-out',
                                }}
                            >
                                <div
                                    dangerouslySetInnerHTML={{ __html: svg }}
                                    className="p-6"
                                />
                            </div>
                        )}
                    </div>

                    <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                        <h3 className="font-semibold mb-3">Keterangan Diagram:</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-green-700" />
                                <span>Start / End Event</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-4 rounded bg-blue-500 border border-blue-700" />
                                <span>Proses / Aktivitas</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rotate-45 bg-yellow-400 border border-yellow-600" />
                                <span>Gateway / Keputusan</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-4 rounded bg-purple-500 border border-purple-700" />
                                <span>Dokumen / SK</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

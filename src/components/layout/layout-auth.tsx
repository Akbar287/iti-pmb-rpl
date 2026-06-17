import { Separator } from '@/components/ui/separator'
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar'
import { AppSidebar } from './app-sidebar'
import LayoutBreadcrumb from './layout-breadcrumb'

const LayoutAuth = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="relative min-h-screen">
            {/* ── Fixed gradient background ── */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                {/* Base — light: putih hangat; dark: biru-navy dalam */}
                <div className="absolute inset-0
                    bg-[radial-gradient(ellipse_at_top_right,#c7d2fe,#ede9fe_40%,#f0f9ff)]
                    dark:bg-[radial-gradient(ellipse_at_top_right,#1e1b4b,#0f172a_50%,#020617)]"
                />

                {/* Blob 1 — kanan atas: biru-violet jenuh */}
                <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full
                    bg-[radial-gradient(circle,#818cf8,#a78bfa)]
                    opacity-50 blur-[120px]
                    dark:opacity-30"
                />
                {/* Blob 2 — kiri tengah: cyan-biru */}
                <div className="absolute top-1/3 -left-40 h-[500px] w-[500px] rounded-full
                    bg-[radial-gradient(circle,#38bdf8,#6366f1)]
                    opacity-40 blur-[100px]
                    dark:opacity-20"
                />
                {/* Blob 3 — bawah kanan: rose-violet */}
                <div className="absolute -bottom-40 right-1/4 h-[550px] w-[550px] rounded-full
                    bg-[radial-gradient(circle,#f472b6,#818cf8)]
                    opacity-35 blur-[120px]
                    dark:opacity-20"
                />
                {/* Blob 4 — tengah bawah: emerald aksen */}
                <div className="absolute bottom-1/4 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full
                    bg-[radial-gradient(circle,#34d399,#06b6d4)]
                    opacity-25 blur-[80px]
                    dark:opacity-15"
                />
            </div>

            <SidebarProvider style={{ background: 'transparent' }}>
                <AppSidebar />
                <SidebarInset className="border-white/50
                        bg-white/40 backdrop-blur-2xl
                        shadow-sm shadow-black/5
                        dark:border-white/10 dark:bg-slate-950/40">
                    <header className="sticky top-2 z-20 mx-2 mt-2 flex h-14 shrink-0 items-center gap-2
                        rounded-2xl border border-white/40
                        bg-white/20 backdrop-blur-2xl
                        shadow-lg shadow-black/5
                        dark:border-white/10 dark:bg-slate-950/30">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 h-4 bg-black/20 dark:bg-white/20"
                            />
                            <LayoutBreadcrumb />
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    )
}

export default LayoutAuth

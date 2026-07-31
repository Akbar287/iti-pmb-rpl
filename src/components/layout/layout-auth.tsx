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
                {/* Base — light: krem hangat; dark: cokelat-arang dalam */}
                <div className="absolute inset-0
                    bg-[radial-gradient(ellipse_at_top_right,#ffe4cc,#fff3e6_40%,#fffaf5)]
                    dark:bg-[radial-gradient(ellipse_at_top_right,#3b1a08,#1c1108_50%,#0c0806)]"
                />

                {/* Blob 1 — kanan atas: oranye institut jenuh */}
                <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full
                    bg-[radial-gradient(circle,#ff7a2f,#f2620f)]
                    opacity-50 blur-[120px]
                    dark:opacity-30"
                />
                {/* Blob 2 — kiri tengah: emas-amber */}
                <div className="absolute top-1/3 -left-40 h-[500px] w-[500px] rounded-full
                    bg-[radial-gradient(circle,#f7c948,#d4af37)]
                    opacity-40 blur-[100px]
                    dark:opacity-20"
                />
                {/* Blob 3 — bawah kanan: terakota-oranye */}
                <div className="absolute -bottom-40 right-1/4 h-[550px] w-[550px] rounded-full
                    bg-[radial-gradient(circle,#e8562b,#ff9351)]
                    opacity-35 blur-[120px]
                    dark:opacity-20"
                />
                {/* Blob 4 — tengah bawah: kuning hangat aksen */}
                <div className="absolute bottom-1/4 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full
                    bg-[radial-gradient(circle,#ffc46b,#ff8a3d)]
                    opacity-25 blur-[80px]
                    dark:opacity-15"
                />
            </div>

            <SidebarProvider style={{ background: 'transparent' }}>
                <AppSidebar />
                <SidebarInset className="border-white/50
                        bg-white/40 backdrop-blur-2xl
                        shadow-sm shadow-black/5
                        dark:border-white/10 dark:bg-stone-950/40">
                    <header className="sticky top-2 z-20 mx-2 mt-2 flex h-14 shrink-0 items-center gap-2
                        rounded-2xl border border-white/40
                        bg-white/20 backdrop-blur-2xl
                        shadow-lg shadow-black/5
                        dark:border-white/10 dark:bg-stone-950/30">
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

'use client'
import React from 'react'
import Navbar from '../website/halaman_utama/Navbar'
import Footer from '../website/halaman_utama/Footer'
import { usePathname } from 'next/navigation'

const LayoutNoauth = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname()
    const hideLayoutOn = ['/login', '/register', '/forgot-password']
    const hideLayout = hideLayoutOn.some((path) => pathname.startsWith(path))

    return (
        <div className={`min-h-screen transition-opacity w-full duration-500`}>
            {!hideLayout && <Navbar />}
            <div>{children}</div>
            {!hideLayout && <Footer />}
        </div>
    )
}

export default LayoutNoauth

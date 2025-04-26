'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import NProgress from 'nprogress'

export function RouteProgress() {
  const pathname = usePathname()

  useEffect(() => {
    NProgress.start()
    NProgress.set(0.3)

    const timeout = setTimeout(() => {
      NProgress.done()
    }, 500)

    return () => {
      clearTimeout(timeout)
      NProgress.done()
    }
  }, [pathname])

  return null
}

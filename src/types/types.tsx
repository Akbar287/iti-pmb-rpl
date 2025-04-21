import { type LucideIcon } from 'lucide-react'

export interface MenuStoreProps {
    namaRole: string[]
    title: string
    url: string
    icon: LucideIcon
    items: SubMenuStoreProps[] | null
}

export interface MenuProps {
    title: string
    url: string
    icon: LucideIcon
    items: SubMenuProps[] | null
}

export interface SubMenuStoreProps {
    namaRole: string[]
    title: string
    url: string
}

export interface SubMenuProps {
    title: string
    url: string
}

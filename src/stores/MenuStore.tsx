import { Role } from '@/generated/prisma'
import { MenuProps, MenuStoreProps } from '@/types/types'
import {
    BookTextIcon,
    Database,
    FileArchiveIcon,
    Home,
    SquareTerminal,
    University,
} from 'lucide-react'
import { create } from 'zustand'

type State = {
    allMenu: MenuStoreProps[]
}

type Actions = {
    getMenuByRole: (role: Role) => MenuProps[]
    getAllMenu: () => MenuProps[]
}

const menu: MenuStoreProps[] = [
    {
        namaRole: [
            'Admin',
            'Asesor',
            'Mahasiswa',
            'Rektor',
            'PMB',
            'Akademik',
            'Kaprodi',
        ],
        title: 'Dashboard',
        url: '/',
        icon: Home,
        items: null,
    },
    {
        namaRole: ['Admin', 'Kaprodi', 'PMB'],
        title: 'Manajemen Data',
        url: '/manajemen-data',
        icon: Database,
        items: [
            {
                namaRole: ['Admin', 'PMB', 'Kaprodi'],
                title: 'Pengguna',
                url: '/manajemen-data/pengguna',
            },
            {
                namaRole: ['Admin', 'PMB'],
                title: 'Area',
                url: '/manajemen-data/area',
            },
            {
                namaRole: ['Admin', 'PMB'],
                title: 'Status',
                url: '/manajemen-data/status',
            },
        ],
    },
    {
        namaRole: ['Admin'],
        title: 'Manajemen Institusi',
        url: '/manajemen-institusi',
        icon: University,
        items: [
            {
                namaRole: ['Admin'],
                title: 'Institusi',
                url: '/manajemen-institusi/institusi',
            },
            {
                namaRole: ['Admin'],
                title: 'Jabatan',
                url: '/manajemen-institusi/jabatan',
            },
            {
                namaRole: ['Admin'],
                title: 'Sosial Media',
                url: '/manajemen-institusi/sosial-media',
            },
        ],
    },
    {
        namaRole: ['Admin'],
        title: 'Manajemen Sistem',
        url: '/manajemen-sistem',
        icon: SquareTerminal,
        items: [
            {
                namaRole: ['Admin'],
                title: 'Role',
                url: '/manajemen-sistem/role',
            },
            {
                namaRole: ['Admin'],
                title: 'Permission',
                url: '/manajemen-sistem/permission',
            },
            {
                namaRole: ['Admin'],
                title: 'API Key',
                url: '/manajemen-sistem/api-key',
            },
        ],
    },
    {
        namaRole: ['Admin', 'Kaprodi', 'PMB'],
        title: 'Manajemen Pembelajaran',
        url: '/manajemen-pembelajaran',
        icon: BookTextIcon,
        items: [
            {
                namaRole: ['Admin', 'Kaprodi', 'PMB'],
                title: 'Program Studi',
                url: '/manajemen-pembelajaran/program-studi',
            },
            {
                namaRole: ['Admin', 'Kaprodi', 'PMB'],
                title: 'Mata Kuliah',
                url: '/manajemen-pembelajaran/mata-kuliah',
            },
            {
                namaRole: ['Admin', 'Kaprodi', 'PMB'],
                title: 'Capaian',
                url: '/manajemen-pembelajaran/capaian',
            },
            {
                namaRole: ['Admin', 'Kaprodi', 'PMB'],
                title: 'Jenis Dokumen',
                url: '/manajemen-pembelajaran/jenis-dokumen',
            },
        ],
    },
    {
        namaRole: ['Kaprodi', 'Asesor', 'Akademik'],
        title: 'Asesor',
        url: '/asesor',
        icon: BookTextIcon,
        items: [
            {
                namaRole: ['Kaprodi', 'Asesor', 'Akademik'],
                title: 'Penunjukan Asesor',
                url: '/asesor/penunjukan-asesor',
            },
            {
                namaRole: ['Kaprodi', 'Asesor', 'Akademik'],
                title: 'Sk. Rektor',
                url: '/asesor/sk-rektor',
            },
        ],
    },
    {
        namaRole: ['Mahasiswa'],
        title: 'Kelengkapan Informasi',
        url: '/kelengkapan-informasi',
        icon: BookTextIcon,
        items: [
            {
                namaRole: ['Mahasiswa'],
                title: 'Institusi Lama',
                url: '/kelengkapan-informasi/institusi-lama',
            },
            {
                namaRole: ['Mahasiswa'],
                title: 'Pendidikan',
                url: '/kelengkapan-informasi/pendidikan',
            },
            {
                namaRole: ['Mahasiswa'],
                title: 'Pekerjaan',
                url: '/kelengkapan-informasi/pekerjaan',
            },
            {
                namaRole: ['Mahasiswa'],
                title: 'Organisasi Profesi',
                url: '/kelengkapan-informasi/organisasi-profesi',
            },
            {
                namaRole: ['Mahasiswa'],
                title: 'Orang Tua',
                url: '/kelengkapan-informasi/orang-tua',
            },
            {
                namaRole: ['Mahasiswa'],
                title: 'Pelatihan Profesional',
                url: '/kelengkapan-informasi/pelatihan-profesional',
            },
            {
                namaRole: ['Mahasiswa'],
                title: 'Konferensi Seminar',
                url: '/kelengkapan-informasi/konferensi-seminar',
            },
            {
                namaRole: ['Mahasiswa'],
                title: 'Kejuaraan Piagam',
                url: '/kelengkapan-informasi/kejuaraan-piagam',
            },
            {
                namaRole: ['Mahasiswa'],
                title: 'Pesantren',
                url: '/kelengkapan-informasi/pesantren',
            },
            {
                namaRole: ['Mahasiswa'],
                title: 'Kependudukan',
                url: '/kelengkapan-informasi/informasi-kependudukan',
            },
        ],
    },
    {
        namaRole: ['Mahasiswa'],
        title: 'Upload Dokumen',
        url: '/upload-dokumen',
        icon: FileArchiveIcon,
        items: null,
    },
    {
        namaRole: ['Mahasiswa'],
        title: 'Evaluasi Mandiri',
        url: '/evaluasi-mandiri',
        icon: FileArchiveIcon,
        items: null,
    },
    {
        namaRole: ['Mahasiswa', 'Asesor', 'Akademik'],
        title: 'Asessment',
        url: '/asessment',
        icon: BookTextIcon,
        items: [
            {
                namaRole: ['Mahasiswa', 'Asesor'],
                title: 'Asessmen',
                url: '/asessment/asessmen-mahasiswa',
            },
            {
                namaRole: ['Mahasiswa', 'Asesor'],
                title: 'Sanggahan',
                url: '/asessment/sanggahan-mahasiswa',
            },
            {
                namaRole: ['Mahasiswa', 'Asesor', 'Akademik'],
                title: 'Hasil Asessmen',
                url: '/asessment/hasil-asessmen',
            },
            {
                namaRole: ['Mahasiswa', 'Asesor', 'Akademik'],
                title: 'Sk. Rektor',
                url: '/asessment/sk-rektor',
            },
        ],
    },
]

const useCountStore = create<State & Actions>((set, get) => ({
    allMenu: menu,
    getMenuByRole: (role) =>
        menu
            .filter((m) => m.namaRole.includes(role.Name))
            .map((m) => ({
                title: m.title,
                url: m.url,
                icon: m.icon,
                items:
                    m.items
                        ?.filter((i) => i.namaRole.includes(role.Name))
                        .map((i) => ({
                            title: i.title,
                            url: i.url,
                        })) || null,
            })),
    getAllMenu: () =>
        menu.map((m) => ({
            title: m.title,
            url: m.url,
            icon: m.icon,
            items:
                m.items !== null
                    ? m.items.map((mi) => ({
                          title: mi.title,
                          url: mi.url,
                      }))
                    : null,
        })),
}))

export default useCountStore

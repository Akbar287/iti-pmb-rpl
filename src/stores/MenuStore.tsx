import { Role } from '@/generated/prisma'
import { MenuProps, MenuStoreProps } from '@/types/types'
import {
    AppWindowMac,
    BookTextIcon,
    Database,
    FileArchiveIcon,
    Home,
    SquareTerminal,
    University,
    WholeWordIcon,
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
            'Wakil Rektor',
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
                namaRole: ['Admin'],
                title: 'Status',
                url: '/manajemen-data/status',
            },
            {
                namaRole: ['PMB'],
                title: 'Data Mahasiswa',
                url: '/manajemen-data/mahasiswa',
            },
            {
                namaRole: ['Kaprodi'],
                title: 'Data Asesor',
                url: '/manajemen-data/asesor',
            },
        ],
    },
    {
        namaRole: ['Admin', 'PMB'],
        title: 'Manajemen Area',
        url: '/manajemen-area',
        icon: Database,
        items: [
            {
                namaRole: ['Admin', 'PMB'],
                title: 'Negara',
                url: '/manajemen-area/negara',
            },
            {
                namaRole: ['Admin', 'PMB'],
                title: 'Provinsi',
                url: '/manajemen-area/provinsi',
            },
            {
                namaRole: ['Admin', 'PMB'],
                title: 'Kabupaten',
                url: '/manajemen-area/kabupaten',
            },
            {
                namaRole: ['Admin', 'PMB'],
                title: 'Kecamatan',
                url: '/manajemen-area/kecamatan',
            },
            {
                namaRole: ['Admin', 'PMB'],
                title: 'Desa',
                url: '/manajemen-area/desa',
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
                title: 'Jabatan Orang',
                url: '/manajemen-institusi/jabatan-orang',
            },
            {
                namaRole: ['Admin'],
                title: 'Sosial Media',
                url: '/manajemen-institusi/sosial-media',
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
        namaRole: ['Kaprodi', 'Wakil Rektor'],
        // namaRole: ['Kaprodi', 'Asesor', 'Akademik', 'Wakil Rektor'],
        title: 'Asesor',
        url: '/asesor',
        icon: BookTextIcon,
        items: [
            {
                namaRole: ['Kaprodi', 'Akademik', 'Wakil Rektor'],
                title: 'Penunjukan Asesor',
                url: '/asesor/penunjukan-asesor',
            },
            {
                namaRole: ['Kaprodi', 'Asesor', 'Akademik', 'Wakil Rektor'],
                title: 'Sk. Rektor',
                url: '/asesor/sk-rektor',
            },
        ],
    },
    {
        namaRole: ['Wakil Rektor'],
        title: 'Approval',
        url: '/approval',
        icon: Database,
        items: [
            {
                namaRole: ['Wakil Rektor'],
                title: 'Persetujuan Asesor',
                url: '/approval/asesor',
            },
            {
                namaRole: ['Wakil Rektor'],
                title: 'Persetujuan Hasil',
                url: '/approval/hasil',
            }
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
        title: 'Mata Kuliah',
        url: '/mata-kuliah',
        icon: BookTextIcon,
        items: [
            {
                namaRole: ['Mahasiswa'],
                title: 'Pemilihan',
                url: '/mata-kuliah/pemilihan',
            },
            {
                namaRole: ['Mahasiswa'],
                title: 'Ekuivalen Check',
                url: '/mata-kuliah/ekuivalen-check',
            },
            {
                namaRole: ['Mahasiswa'],
                title: 'Evaluasi Mandiri',
                url: '/mata-kuliah/evaluasi-mandiri',
            },
            {
                namaRole: ['Mahasiswa'],
                title: 'Finalisasi',
                url: '/mata-kuliah/finalisasi',
            },
        ],
    },
    {
        namaRole: ['Admin'],
        title: 'Website',
        url: '/website',
        icon: AppWindowMac,
        items: [
            {
                namaRole: ['Admin'],
                title: 'Homepage',
                url: '/website/homepage',
            },
            {
                namaRole: ['Admin'],
                title: 'Komunitas',
                url: '/website/komunitas',
            },
            {
                namaRole: ['Admin'],
                title: 'Kegiatan',
                url: '/website/kegiatan',
            },
            {
                namaRole: ['Admin'],
                title: 'Berita',
                url: '/website/berita',
            },
            {
                namaRole: ['Admin'],
                title: 'Angka',
                url: '/website/angka',
            },
            {
                namaRole: ['Admin'],
                title: 'Testimoni',
                url: '/website/testimoni',
            },
            {
                namaRole: ['Admin'],
                title: 'Alasan',
                url: '/website/alasan',
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
            {
                namaRole: ['Admin'],
                title: 'Data Q&A',
                url: '/manajemen-sistem/qna',
            },
            {
                namaRole: ['Admin'],
                title: 'Tickets',
                url: '/manajemen-sistem/tickets',
            },
            {
                namaRole: ['Admin'],
                title: 'Token Usage',
                url: '/manajemen-sistem/token-usage',
            },
        ],
    },
    {
        namaRole: ['Admin'],
        title: 'Template Builder',
        url: '/template-builder',
        icon: WholeWordIcon,
        items: [
            {
                namaRole: ['Admin'],
                title: 'Form Asessmen',
                url: '/template-builder/form-asessmen',
            },
            {
                namaRole: ['Admin'],
                title: 'Form Rekapitulasi',
                url: '/template-builder/form-rekapitulasi',
            },
            {
                namaRole: ['Admin'],
                title: 'Form Berita Acara',
                url: '/template-builder/form-berita-acara',
            },
            {
                namaRole: ['Admin'],
                title: 'SK Hasil',
                url: '/template-builder/sk-hasil',
            }
        ],
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
                title: 'Rekapitulasi',
                url: '/asessment/rekapitulasi',
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
            {
                namaRole: ['Akademik'],
                title: 'Sinkronisasi',
                url: '/asessment/sinkronisasi',
            },
            {
                namaRole: ['Akademik'],
                title: 'Selesai',
                url: '/asessment/selesai',
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

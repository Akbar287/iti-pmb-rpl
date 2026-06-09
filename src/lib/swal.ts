import Swal from 'sweetalert2'

// Mixin global agar semua Swal.fire() otomatis pakai glass effect.
// Ganti `import Swal from 'sweetalert2'` dengan `import Swal from '@/lib/swal'`
// di setiap komponen — tidak perlu ubah kode .fire() yang sudah ada.
const swal = Swal.mixin({
    customClass: {
        popup: 'swal-glass',
        backdrop: 'swal-glass-backdrop',
    },
    backdrop: 'rgba(0,0,0,0.3)',
})

export default swal

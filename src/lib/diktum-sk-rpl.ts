/**
 * Butir baku diktum SK Hasil Asesmen RPL.
 *
 * Disalin dari SK yang berlaku di ITI — `doc/sk_rpl_perolehan.pdf` untuk skema
 * Perolehan Kredit dan `doc/sk_rpl_transfer.pdf` untuk skema Transfer Kredit —
 * lalu dijadikan bertemplat pada bagian yang berbeda tiap mahasiswa (nama,
 * program studi, semester, dan tanggal penilaian).
 *
 * Dipakai di dua tempat: server memakainya sebagai isi bawaan `fieldValues`
 * bila Akademik tidak menyunting apa pun, dan antarmuka memakainya untuk
 * mengisi awal editor butir supaya dapat ditambah atau dikurangi.
 */

export type JenisSkRpl = 'PEROLEHAN_SKS' | 'TRANSFER_SKS'

export type DataDiktum = {
    Nama: string
    ProgramStudi: string
    Semester: string
    /** Tanggal penilaian oleh penilai, sudah diformat (mis. "18 Agustus 2026"). */
    TanggalPenilaian: string
}

export type DiktumSk = {
    Menimbang: string[]
    Mengingat: string[]
    Memperhatikan: string[]
    Menetapkan: string[]
}

const isi = (nilai: string, cadangan: string) => {
    const bersih = (nilai ?? '').trim()
    return bersih.length > 0 ? bersih : cadangan
}

/** Dasar hukum yang sama pada kedua skema. */
const MENGINGAT_UMUM_AWAL = [
    'Undang-Undang No. 20 Tahun 2003 tentang Sistem Pendidikan Nasional;',
    'Undang-Undang No. 12 Tahun 2012 tentang Pendidikan Tinggi;',
    'Peraturan Presiden No. 8 Tahun 2012 tentang Kerangka Kualifikasi Nasional Indonesia;',
    'Peraturan Menteri Pendidikan Tinggi, Sains dan Teknologi No. 39 Tahun 2025 tentang Penjaminan Mutu Pendidikan Tinggi;',
]

const MENGINGAT_UMUM_AKHIR = [
    'Peraturan Menteri Pendidikan, Kebudayaan, Riset, dan Teknologi No. 41 Tahun 2021 tentang Rekognisi Pembelajaran Lampau;',
    'Keputusan Dirjen Diktiristek Kemdikbudristek No. 112/B/KPT/2025 tentang Petunjuk Teknis Rekognisi Pembelajaran Lampau pada Perguruan Tinggi yang Menyelenggarakan Pendidikan Akademik;',
    'Keputusan Rektor ITI No. 445/Kept-ITI/XII/2022 tentang Penetapan SOP Pelaksanaan Asesmen Jalur RPL Pendidikan Akademik di Lingkungan Institut Teknologi Indonesia;',
    'Keputusan Rektor No. 665/Kept-ITI/XII/2025 tentang Penetapan Penilai Pengakuan Mata Kuliah Pendidikan Akademik Jalur Rekognisi Pembelajaran Lampau (RPL) Institut Teknologi Indonesia;',
    'Keputusan Rektor No. 318R/Kept-ITI/VIII/2024 tentang Penetapan Tim Pengelola Rekognisi Pembelajaran Lampau (RPL) Pendidikan Akademik Institut Teknologi Indonesia;',
    'Keputusan Rektor No. 319/Kept-ITI/VIII/2024 tentang Penetapan Pedoman Penyelenggaraan Rekognisi Pembelajaran Lampau (RPL) Tipe A pada Pendidikan Akademik Institut Teknologi Indonesia;',
    'Keputusan Rektor No. 320R/Kept-ITI/VIII/2024 tentang Penetapan Dokumen Penilaian Rekognisi Pembelajaran Lampau (RPL) Pendidikan Akademik pada Program Studi di Lingkungan Institut Teknologi Indonesia; dan',
    'Surat Keputusan Yayasan Pengembangan Teknologi Indonesia No. 1/KEPT-PU/YPTI/III/2026 tentang Pengangkatan Rektor Institut Teknologi Indonesia.',
]

/**
 * SK Perolehan Kredit mencantumkan Permendikti No. 10 Tahun 2026 sebagai
 * perubahan atas Permendikti No. 39 Tahun 2025; SK Transfer Kredit tidak.
 */
const MENGINGAT_PEROLEHAN_TAMBAHAN =
    'Peraturan Menteri Pendidikan Tinggi, Sains dan Teknologi Nomor 10 Tahun 2026 tentang Perubahan atas Peraturan Menteri Pendidikan Tinggi, Sains dan Teknologi Nomor 39 Tahun 2025 tentang Penjaminan Mutu Pendidikan Tinggi;'

const MENETAPKAN_UMUM = (prodi: string, penutupButir4: string) => [
    'Hasil penilaian terlampir bersama dengan Keputusan Rektor ini;',
    'Hasil penilaian yang sudah dilaksanakan oleh penilai merupakan pengakuan sks dari capaian pembelajaran yang diperoleh dari pendidikan formal, nonformal, informal dan/atau pengalaman kerja;',
    `Mata kuliah yang wajib ditempuh pada Program Studi ${prodi} ITI terdapat pada kolom 10 dan 11 terlampir${penutupButir4}`,
    'Keputusan ini berlaku terhitung mulai tanggal ditetapkan, dengan ketentuan apabila dikemudian hari terdapat kekeliruan di dalamnya akan diperbaiki sebagaimana semestinya.',
]

/** Butir baku sesuai skema SK; seluruhnya boleh disunting Akademik. */
export function diktumBakuSk(jenis: JenisSkRpl, data: DataDiktum): DiktumSk {
    const nama = isi(data.Nama, '(nama mahasiswa)')
    const prodi = isi(data.ProgramStudi, '(program studi)')
    const semester = isi(data.Semester, '(semester)')
    const tanggal = isi(data.TanggalPenilaian, '(tanggal penilaian)')
    const transfer = jenis === 'TRANSFER_SKS'
    const skema = transfer ? 'Transfer Kredit' : 'Perolehan Kredit'

    const menimbangButir1 = transfer
        ? 'Bahwa untuk memperoleh pengakuan yang layak melalui penyesuaian sub Capaian Pembelajaran Mata Kuliah yang diperoleh dari pendidikan formal sebelumnya;'
        : 'Bahwa untuk memperoleh pengakuan yang layak melalui capaian pembelajaran yang diperoleh dari pendidikan formal, nonformal, informal dan/atau pengalaman kerja;'

    const menimbangButir4 = transfer
        ? `Bahwa berdasarkan hasil check equivalence dari transkrip akademik pendidikan formal sebelumnya dalam rangka penerimaan mahasiswa baru melalui Program Pendidikan Akademik S1 Jalur Rekognisi Pembelajaran Lampau (RPL) Skema Transfer Kredit Program Studi ${prodi} Semester ${semester}; dan`
        : `Bahwa berdasarkan hasil verifikasi dan validasi oleh penilai atas penilaian mandiri mahasiswa dalam rangka penerimaan mahasiswa baru melalui Program Pendidikan Akademik S1 Jalur Rekognisi Pembelajaran Lampau (RPL) Skema Perolehan Kredit Program Studi ${prodi} Semester ${semester}; dan`

    const menetapkanButir1 = transfer
        ? `Hasil penilaian Pendidikan Akademik S1 Jalur Rekognisi Pembelajaran Lampau (RPL) skema Transfer Kredit atas nama ${nama} pada Program Studi ${prodi} Institut Teknologi Indonesia;`
        : `Hasil verifikasi dan validasi atas penilaian mandiri Rekognisi Pembelajaran Lampau (RPL) skema Perolehan Kredit atas nama ${nama} pada Program Pendidikan Akademik S1 Program Studi ${prodi} Institut Teknologi Indonesia;`

    return {
        Menimbang: [
            menimbangButir1,
            'Bahwa untuk mendorong motivasi dan kepercayaan diri untuk terus belajar sepanjang hayat;',
            'Bahwa untuk peningkatan keterjangkauan dan keterjaminan akses memperoleh pendidikan tinggi;',
            menimbangButir4,
            `Bahwa berdasarkan pertimbangan pada butir 1, 2, 3 dan 4 di atas, perlu diterbitkan Keputusan Rektor tentang Penetapan Hasil Penilaian Pendidikan Akademik S1 Jalur Rekognisi Pembelajaran Lampau (RPL) Skema ${skema} Atas Nama ${nama} Program Studi ${prodi} Institut Teknologi Indonesia Semester ${semester}.`,
        ],
        Mengingat: [
            ...MENGINGAT_UMUM_AWAL,
            ...(transfer ? [] : [MENGINGAT_PEROLEHAN_TAMBAHAN]),
            ...MENGINGAT_UMUM_AKHIR,
        ],
        Memperhatikan: [
            `Hasil Penilaian oleh Penilai dari Program Studi ${prodi} Institut Teknologi Indonesia tanggal ${tanggal}.`,
        ],
        Menetapkan: [
            menetapkanButir1,
            ...MENETAPKAN_UMUM(prodi, transfer ? ';' : '; dan'),
        ],
    }
}

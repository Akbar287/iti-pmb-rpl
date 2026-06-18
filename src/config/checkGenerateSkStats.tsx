// Form 07
export function isGenerateSk(namaStatus: string) {
    return [
        'Hasil Asessmen',
        'Hasil Final Asessmen',
        'Persetujuan Hasil Final',
        'SK. Rektor',
        'Penerbitan SK Asessmen',
        'Sinkronisasi Hasil Asessmen',
        'Selesai'
    ].includes(namaStatus)
}

// Form 05
export function isGenerateRekapitulasi(namaStatus: string) {
    return [
        'Rekapitulasi Hasil',
        'Rekapitulasi Asessmen',
        'Sanggahan',
        'Hasil Asessmen',
        'Hasil Final Asessmen',
        'Persetujuan Hasil Final',
        'SK. Rektor',
        'Penerbitan SK Asessmen',
        'Sinkronisasi Hasil Asessmen',
        'Selesai'
    ].includes(namaStatus)
}

// Form 03
export function isGenerateEvaluasiMandiri(namaStatus: string) {
    return [
        'Asessmen Mandiri',
        'Penunjukan Asesor',
        'Asessmen Oleh Asesor',
        'Rekapitulasi Hasil',
        'Rekapitulasi Asessmen',
        'Sanggahan',
        'Hasil Asessmen',
        'Hasil Final Asessmen',
        'Persetujuan Hasil Final',
        'SK. Rektor',
        'Penerbitan SK Asessmen',
        'Sinkronisasi Hasil Asessmen',
        'Selesai'
    ].includes(namaStatus)
}

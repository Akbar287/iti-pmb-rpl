// Form 07
export function isGenerateSk(namaStatus: string) {
    return [
        'Hasil Final Asessmen',
        'Persetujuan Hasil Final',
        'Penerbitan SK Asessmen',
        'Sinkronisasi Hasil Asessmen',
        'Selesai'
    ].includes(namaStatus)
}

// Form 05
export function isGenerateRekapitulasi(namaStatus: string) {
    return [
        'Rekapitulasi Asessmen',
        'Sanggahan',
        'Hasil Final Asessmen',
        'Persetujuan Hasil Final',
        'Penerbitan SK Asessmen',
        'Sinkronisasi Hasil Asessmen',
        'Selesai'
    ].includes(namaStatus)
}

// Form 03
export function isGenerateEvaluasiMandiri(namaStatus: string) {
    return [
        'Asessmen Oleh Asesor',
        'Rekapitulasi Asessmen',
        'Sanggahan',
        'Hasil Final Asessmen',
        'Persetujuan Hasil Final',
        'Penerbitan SK Asessmen',
        'Sinkronisasi Hasil Asessmen',
        'Selesai'
    ].includes(namaStatus)
}
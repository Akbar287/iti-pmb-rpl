-- Setelah rekapitulasi, Penilai 1 dan Penilai 2 menandatangani hasil asesmen
-- sebelum berkas dilanjutkan ke tahap sanggahan. Tanda tangannya disematkan ke
-- Form 03 dan Form 05. Gambarnya disimpan di /storage; di sini hanya path
-- relatif dan waktu penandatanganannya.
ALTER TABLE "assesor_mahasiswa" ADD COLUMN     "tanda_tangan_path" TEXT,
ADD COLUMN     "tanda_tangan_pada" TIMESTAMP(3);

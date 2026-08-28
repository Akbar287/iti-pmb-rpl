-- Mahasiswa menandatangani Formulir Evaluasi Diri (Form 03) sebelum berkasnya
-- dilanjutkan ke penunjukan asesor. Gambar tanda tangannya disimpan di folder
-- /storage per user; di sini hanya path relatif dan waktu penandatanganannya.
ALTER TABLE "pendaftaran" ADD COLUMN     "tanda_tangan_path" TEXT,
ADD COLUMN     "tanda_tangan_pada" TIMESTAMP(3);

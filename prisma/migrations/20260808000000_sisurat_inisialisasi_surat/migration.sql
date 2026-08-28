-- Penerbitan SK kini diinisialisasi ke Sisurat: persetujuan Wakil Rektor dan
-- tanda tangan Rektor berjalan di sistem eksternal itu, bukan di aplikasi ini.
-- Kolom berikut menyimpan jejak surat yang sedang berjalan di sana.
ALTER TABLE "sk_rektor" ADD COLUMN     "sisurat_letter_id" TEXT,
ADD COLUMN     "sisurat_status" TEXT,
ADD COLUMN     "sisurat_step_key" TEXT,
ADD COLUMN     "sisurat_diajukan_pada" TIMESTAMP(3);

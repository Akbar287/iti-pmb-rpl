-- Nomor surat resmi hasil penerbitan Sisurat ITI. Disimpan agar percobaan ulang
-- penandatanganan memakai nomor yang sama, bukan menerbitkan nomor baru
-- (deret Sisurat tidak dapat dibatalkan).
ALTER TABLE "sk_rektor" ADD COLUMN     "nomor_surat_sisurat" TEXT,
ADD COLUMN     "nomor_surat_pada" TIMESTAMP(3);

-- SK yang sudah ditandatangani Rektor tidak otomatis terlihat mahasiswa.
-- Akademik yang memutuskan kapan SK dipublikasikan (atau ditahan dulu).
ALTER TABLE "sk_rektor" ADD COLUMN     "dipublikasikan" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "dipublikasikan_pada" TIMESTAMP(3);

-- SK lama yang sudah sampai tahap sinkronisasi/selesai dianggap sudah terbit
-- ke mahasiswa, agar tidak tiba-tiba hilang dari halaman mereka.
UPDATE "sk_rektor" s
SET "dipublikasikan" = true, "dipublikasikan_pada" = COALESCE(s."updated_at", now())
WHERE EXISTS (
    SELECT 1
      FROM "sk_rektor_mahasiswa" srm
      JOIN "status_mahasiswa_assesment_history" h
        ON h."pendaftaran_id" = srm."pendaftaran_id" AND h."aktif" = true
      JOIN "status_mahasiswa_assesment" st
        ON st."status_mahasiswa_assesment_id" = h."status_mahasiswa_assesment_id"
     WHERE srm."sk_rektor_id" = s."sk_rektor_id"
       AND st."nama_status" IN ('Sinkronisasi Hasil Asessmen', 'Selesai')
);

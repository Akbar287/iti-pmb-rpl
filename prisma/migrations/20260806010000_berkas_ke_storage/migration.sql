-- Berkas milik pengguna tidak lagi disimpan sebagai bytes di basis data,
-- melainkan di folder penyimpanan (/storage) dengan struktur
-- <userId>/<jenis>/<namaFile>. Kolom bytes diganti kolom path.
--
-- PRASYARAT: jalankan `npx tsx scripts/pindah-berkas-ke-storage.ts` lebih dulu
-- agar isi kolom bytes tersalin ke disk. Path di bawah dihitung dengan aturan
-- yang sama persis dengan skrip tersebut.

-- 1) bukti_form → <userId mahasiswa>/dokumen/<nama_file>
ALTER TABLE "bukti_form" ADD COLUMN "path_file" TEXT;

UPDATE "bukti_form" bf
SET "path_file" = m."user_id" || '/dokumen/' || bf."nama_file"
FROM "pendaftaran" p
JOIN "mahasiswa" m ON m."mahasiswa_id" = p."mahasiswa_id"
WHERE p."pendaftaran_id" = bf."pendaftaran_id";

ALTER TABLE "bukti_form" ALTER COLUMN "path_file" SET NOT NULL;
ALTER TABLE "bukti_form" DROP COLUMN "file_data";

-- 2) sk_rektor → <userId mahasiswa>/sk/<nama_file>; SK penugasan asesor yang
--    tidak terikat satu mahasiswa memakai folder bersama sk/
ALTER TABLE "sk_rektor" ADD COLUMN "path_file" TEXT;

UPDATE "sk_rektor" s
SET "path_file" = COALESCE(
    (
        SELECT m."user_id" || '/sk/' || s."nama_file"
        FROM "sk_rektor_mahasiswa" srm
        JOIN "pendaftaran" p ON p."pendaftaran_id" = srm."pendaftaran_id"
        JOIN "mahasiswa" m ON m."mahasiswa_id" = p."mahasiswa_id"
        WHERE srm."sk_rektor_id" = s."sk_rektor_id"
        LIMIT 1
    ),
    'sk/' || s."nama_file"
);

ALTER TABLE "sk_rektor" ALTER COLUMN "path_file" SET NOT NULL;
ALTER TABLE "sk_rektor" DROP COLUMN "file_data";

-- 3) tickets_file → <userId pembuat tiket>/tiket/<nama_file>
ALTER TABLE "tickets_file" ADD COLUMN "path_file" TEXT;

UPDATE "tickets_file" tf
SET "path_file" = t."user_id" || '/tiket/' || tf."nama_file"
FROM "tickets" t
WHERE t."tickets_id" = tf."tickets_id";

ALTER TABLE "tickets_file" ALTER COLUMN "path_file" SET NOT NULL;
ALTER TABLE "tickets_file" DROP COLUMN "file_data";

-- 4) user.avatar: kolom bytea diganti kolom path bertipe teks
ALTER TABLE "user" ADD COLUMN "avatar_path" TEXT;

UPDATE "user"
SET "avatar_path" = "user_id" || '/avatar/avatar.png'
WHERE "avatar" IS NOT NULL;

ALTER TABLE "user" DROP COLUMN "avatar";
ALTER TABLE "user" RENAME COLUMN "avatar_path" TO "avatar";

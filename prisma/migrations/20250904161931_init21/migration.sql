/*
  Warnings:

  - Added the required column `kategori_berita_id` to the `setting_berita` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "jenis_kegiatan" ADD COLUMN     "color" TEXT;

-- AlterTable
ALTER TABLE "setting_berita" ADD COLUMN     "kategori_berita_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "KategoriBerita" (
    "kategori_berita_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "KategoriBerita_pkey" PRIMARY KEY ("kategori_berita_id")
);

-- AddForeignKey
ALTER TABLE "setting_berita" ADD CONSTRAINT "setting_berita_kategori_berita_id_fkey" FOREIGN KEY ("kategori_berita_id") REFERENCES "KategoriBerita"("kategori_berita_id") ON DELETE CASCADE ON UPDATE CASCADE;

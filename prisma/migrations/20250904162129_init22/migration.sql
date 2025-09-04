/*
  Warnings:

  - You are about to drop the `KategoriBerita` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `color` on table `jenis_kegiatan` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "setting_berita" DROP CONSTRAINT "setting_berita_kategori_berita_id_fkey";

-- AlterTable
ALTER TABLE "jenis_kegiatan" ALTER COLUMN "color" SET NOT NULL;

-- DropTable
DROP TABLE "KategoriBerita";

-- CreateTable
CREATE TABLE "kategori_berita" (
    "kategori_berita_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "kategori_berita_pkey" PRIMARY KEY ("kategori_berita_id")
);

-- AddForeignKey
ALTER TABLE "setting_berita" ADD CONSTRAINT "setting_berita_kategori_berita_id_fkey" FOREIGN KEY ("kategori_berita_id") REFERENCES "kategori_berita"("kategori_berita_id") ON DELETE CASCADE ON UPDATE CASCADE;

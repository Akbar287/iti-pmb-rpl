/*
  Warnings:

  - You are about to drop the column `hasil_assesmen_id` on the `skor_assesmen` table. All the data in the column will be lost.
  - Added the required column `mata_kuliah_mahasiswa_id` to the `skor_assesmen` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "skor_assesmen" DROP CONSTRAINT "skor_assesmen_hasil_assesmen_id_fkey";

-- AlterTable
ALTER TABLE "skor_assesmen" DROP COLUMN "hasil_assesmen_id",
ADD COLUMN     "mata_kuliah_mahasiswa_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "skor_assesmen" ADD CONSTRAINT "skor_assesmen_mata_kuliah_mahasiswa_id_fkey" FOREIGN KEY ("mata_kuliah_mahasiswa_id") REFERENCES "mata_kuliah_mahasiswa"("mata_kuliah_mahasiswa_id") ON DELETE CASCADE ON UPDATE CASCADE;

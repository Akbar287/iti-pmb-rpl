/*
  Warnings:

  - You are about to drop the column `daftar_ulang_id` on the `status_mahasiswa_assesment_history` table. All the data in the column will be lost.
  - Added the required column `pendaftaran_id` to the `status_mahasiswa_assesment_history` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "status_mahasiswa_assesment_history" DROP CONSTRAINT "status_mahasiswa_assesment_history_daftar_ulang_id_fkey";

-- AlterTable
ALTER TABLE "status_mahasiswa_assesment_history" DROP COLUMN "daftar_ulang_id",
ADD COLUMN     "pendaftaran_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "status_mahasiswa_assesment_history" ADD CONSTRAINT "status_mahasiswa_assesment_history_pendaftaran_id_fkey" FOREIGN KEY ("pendaftaran_id") REFERENCES "pendaftaran"("pendaftaran_id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `mahasiswa_id` on the `assesor_mahasiswa` table. All the data in the column will be lost.
  - You are about to drop the column `mahasiswa_id` on the `bukti_form` table. All the data in the column will be lost.
  - You are about to drop the column `mahasiswa_id` on the `daftar_ulang` table. All the data in the column will be lost.
  - You are about to drop the column `mahasiswa_id` on the `informasi_kependudukan` table. All the data in the column will be lost.
  - You are about to drop the column `mahasiswa_id` on the `institusi_lama` table. All the data in the column will be lost.
  - You are about to drop the column `mahasiswa_id` on the `mahasiswa_konferensi` table. All the data in the column will be lost.
  - You are about to drop the column `mahasiswa_id` on the `mahasiswa_organisasi_profesi` table. All the data in the column will be lost.
  - You are about to drop the column `mahasiswa_id` on the `mahasiswa_pelatihan_professional` table. All the data in the column will be lost.
  - You are about to drop the column `mahasiswa_id` on the `mahasiswa_pendidikan` table. All the data in the column will be lost.
  - You are about to drop the column `mahasiswa_id` on the `mahasiswa_piagam` table. All the data in the column will be lost.
  - You are about to drop the column `mahasiswa_id` on the `mahasiswa_riwayat_pekerjaan` table. All the data in the column will be lost.
  - You are about to drop the column `mahasiswa_id` on the `mata_kuliah_mahasiswa` table. All the data in the column will be lost.
  - You are about to drop the column `mahasiswa_id` on the `orang_tua` table. All the data in the column will be lost.
  - You are about to drop the column `mahasiswa_id` on the `pekerjaan_mahasiswa` table. All the data in the column will be lost.
  - You are about to drop the column `mahasiswa_id` on the `pesantren` table. All the data in the column will be lost.
  - You are about to drop the column `mahasiswa_id` on the `sanggahan_assesmen` table. All the data in the column will be lost.
  - The primary key for the `sk_rektor_mahasiswa` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `mahasiswa_id` on the `sk_rektor_mahasiswa` table. All the data in the column will be lost.
  - Added the required column `pendaftaran_id` to the `assesor_mahasiswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pendaftaran_id` to the `bukti_form` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pendaftaran_id` to the `daftar_ulang` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pendaftaran_id` to the `informasi_kependudukan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pendaftaran_id` to the `institusi_lama` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pendaftaran_id` to the `mahasiswa_konferensi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pendaftaran_id` to the `mahasiswa_organisasi_profesi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pendaftaran_id` to the `mahasiswa_pelatihan_professional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pendaftaran_id` to the `mahasiswa_pendidikan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pendaftaran_id` to the `mahasiswa_piagam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pendaftaran_id` to the `mahasiswa_riwayat_pekerjaan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pendaftaran_id` to the `mata_kuliah_mahasiswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pendaftaran_id` to the `orang_tua` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pendaftaran_id` to the `pekerjaan_mahasiswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pendaftaran_id` to the `pesantren` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pendaftaran_id` to the `sanggahan_assesmen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pendaftaran_id` to the `sk_rektor_mahasiswa` table without a default value. This is not possible if the table is not empty.
  - Made the column `credential` on table `userlogin` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "assesor_mahasiswa" DROP CONSTRAINT "assesor_mahasiswa_mahasiswa_id_fkey";

-- DropForeignKey
ALTER TABLE "bukti_form" DROP CONSTRAINT "bukti_form_mahasiswa_id_fkey";

-- DropForeignKey
ALTER TABLE "daftar_ulang" DROP CONSTRAINT "daftar_ulang_mahasiswa_id_fkey";

-- DropForeignKey
ALTER TABLE "informasi_kependudukan" DROP CONSTRAINT "informasi_kependudukan_mahasiswa_id_fkey";

-- DropForeignKey
ALTER TABLE "institusi_lama" DROP CONSTRAINT "institusi_lama_mahasiswa_id_fkey";

-- DropForeignKey
ALTER TABLE "mahasiswa_konferensi" DROP CONSTRAINT "mahasiswa_konferensi_mahasiswa_id_fkey";

-- DropForeignKey
ALTER TABLE "mahasiswa_organisasi_profesi" DROP CONSTRAINT "mahasiswa_organisasi_profesi_mahasiswa_id_fkey";

-- DropForeignKey
ALTER TABLE "mahasiswa_pelatihan_professional" DROP CONSTRAINT "mahasiswa_pelatihan_professional_mahasiswa_id_fkey";

-- DropForeignKey
ALTER TABLE "mahasiswa_pendidikan" DROP CONSTRAINT "mahasiswa_pendidikan_mahasiswa_id_fkey";

-- DropForeignKey
ALTER TABLE "mahasiswa_piagam" DROP CONSTRAINT "mahasiswa_piagam_mahasiswa_id_fkey";

-- DropForeignKey
ALTER TABLE "mahasiswa_riwayat_pekerjaan" DROP CONSTRAINT "mahasiswa_riwayat_pekerjaan_mahasiswa_id_fkey";

-- DropForeignKey
ALTER TABLE "mata_kuliah_mahasiswa" DROP CONSTRAINT "mata_kuliah_mahasiswa_mahasiswa_id_fkey";

-- DropForeignKey
ALTER TABLE "orang_tua" DROP CONSTRAINT "orang_tua_mahasiswa_id_fkey";

-- DropForeignKey
ALTER TABLE "pekerjaan_mahasiswa" DROP CONSTRAINT "pekerjaan_mahasiswa_mahasiswa_id_fkey";

-- DropForeignKey
ALTER TABLE "pesantren" DROP CONSTRAINT "pesantren_mahasiswa_id_fkey";

-- DropForeignKey
ALTER TABLE "sanggahan_assesmen" DROP CONSTRAINT "sanggahan_assesmen_mahasiswa_id_fkey";

-- DropForeignKey
ALTER TABLE "sk_rektor_mahasiswa" DROP CONSTRAINT "sk_rektor_mahasiswa_mahasiswa_id_fkey";

-- AlterTable
ALTER TABLE "assesor_mahasiswa" DROP COLUMN "mahasiswa_id",
ADD COLUMN     "pendaftaran_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "bukti_form" DROP COLUMN "mahasiswa_id",
ADD COLUMN     "pendaftaran_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "daftar_ulang" DROP COLUMN "mahasiswa_id",
ADD COLUMN     "pendaftaran_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "informasi_kependudukan" DROP COLUMN "mahasiswa_id",
ADD COLUMN     "pendaftaran_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "institusi_lama" DROP COLUMN "mahasiswa_id",
ADD COLUMN     "pendaftaran_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "mahasiswa_konferensi" DROP COLUMN "mahasiswa_id",
ADD COLUMN     "pendaftaran_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "mahasiswa_organisasi_profesi" DROP COLUMN "mahasiswa_id",
ADD COLUMN     "pendaftaran_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "mahasiswa_pelatihan_professional" DROP COLUMN "mahasiswa_id",
ADD COLUMN     "pendaftaran_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "mahasiswa_pendidikan" DROP COLUMN "mahasiswa_id",
ADD COLUMN     "pendaftaran_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "mahasiswa_piagam" DROP COLUMN "mahasiswa_id",
ADD COLUMN     "pendaftaran_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "mahasiswa_riwayat_pekerjaan" DROP COLUMN "mahasiswa_id",
ADD COLUMN     "pendaftaran_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "mata_kuliah_mahasiswa" DROP COLUMN "mahasiswa_id",
ADD COLUMN     "pendaftaran_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "orang_tua" DROP COLUMN "mahasiswa_id",
ADD COLUMN     "pendaftaran_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "pekerjaan_mahasiswa" DROP COLUMN "mahasiswa_id",
ADD COLUMN     "pendaftaran_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "pesantren" DROP COLUMN "mahasiswa_id",
ADD COLUMN     "pendaftaran_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "sanggahan_assesmen" DROP COLUMN "mahasiswa_id",
ADD COLUMN     "pendaftaran_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "sk_rektor_mahasiswa" DROP CONSTRAINT "sk_rektor_mahasiswa_pkey",
DROP COLUMN "mahasiswa_id",
ADD COLUMN     "pendaftaran_id" TEXT NOT NULL,
ADD CONSTRAINT "sk_rektor_mahasiswa_pkey" PRIMARY KEY ("sk_rektor_id", "pendaftaran_id");

-- AlterTable
ALTER TABLE "userlogin" ALTER COLUMN "credential" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "assesor_mahasiswa" ADD CONSTRAINT "assesor_mahasiswa_pendaftaran_id_fkey" FOREIGN KEY ("pendaftaran_id") REFERENCES "pendaftaran"("pendaftaran_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bukti_form" ADD CONSTRAINT "bukti_form_pendaftaran_id_fkey" FOREIGN KEY ("pendaftaran_id") REFERENCES "pendaftaran"("pendaftaran_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daftar_ulang" ADD CONSTRAINT "daftar_ulang_pendaftaran_id_fkey" FOREIGN KEY ("pendaftaran_id") REFERENCES "pendaftaran"("pendaftaran_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "informasi_kependudukan" ADD CONSTRAINT "informasi_kependudukan_pendaftaran_id_fkey" FOREIGN KEY ("pendaftaran_id") REFERENCES "pendaftaran"("pendaftaran_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institusi_lama" ADD CONSTRAINT "institusi_lama_pendaftaran_id_fkey" FOREIGN KEY ("pendaftaran_id") REFERENCES "pendaftaran"("pendaftaran_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mahasiswa_konferensi" ADD CONSTRAINT "mahasiswa_konferensi_pendaftaran_id_fkey" FOREIGN KEY ("pendaftaran_id") REFERENCES "pendaftaran"("pendaftaran_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mahasiswa_organisasi_profesi" ADD CONSTRAINT "mahasiswa_organisasi_profesi_pendaftaran_id_fkey" FOREIGN KEY ("pendaftaran_id") REFERENCES "pendaftaran"("pendaftaran_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mahasiswa_pelatihan_professional" ADD CONSTRAINT "mahasiswa_pelatihan_professional_pendaftaran_id_fkey" FOREIGN KEY ("pendaftaran_id") REFERENCES "pendaftaran"("pendaftaran_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mahasiswa_pendidikan" ADD CONSTRAINT "mahasiswa_pendidikan_pendaftaran_id_fkey" FOREIGN KEY ("pendaftaran_id") REFERENCES "pendaftaran"("pendaftaran_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mahasiswa_piagam" ADD CONSTRAINT "mahasiswa_piagam_pendaftaran_id_fkey" FOREIGN KEY ("pendaftaran_id") REFERENCES "pendaftaran"("pendaftaran_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mahasiswa_riwayat_pekerjaan" ADD CONSTRAINT "mahasiswa_riwayat_pekerjaan_pendaftaran_id_fkey" FOREIGN KEY ("pendaftaran_id") REFERENCES "pendaftaran"("pendaftaran_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mata_kuliah_mahasiswa" ADD CONSTRAINT "mata_kuliah_mahasiswa_pendaftaran_id_fkey" FOREIGN KEY ("pendaftaran_id") REFERENCES "pendaftaran"("pendaftaran_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orang_tua" ADD CONSTRAINT "orang_tua_pendaftaran_id_fkey" FOREIGN KEY ("pendaftaran_id") REFERENCES "pendaftaran"("pendaftaran_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pekerjaan_mahasiswa" ADD CONSTRAINT "pekerjaan_mahasiswa_pendaftaran_id_fkey" FOREIGN KEY ("pendaftaran_id") REFERENCES "pendaftaran"("pendaftaran_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pesantren" ADD CONSTRAINT "pesantren_pendaftaran_id_fkey" FOREIGN KEY ("pendaftaran_id") REFERENCES "pendaftaran"("pendaftaran_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sanggahan_assesmen" ADD CONSTRAINT "sanggahan_assesmen_pendaftaran_id_fkey" FOREIGN KEY ("pendaftaran_id") REFERENCES "pendaftaran"("pendaftaran_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sk_rektor_mahasiswa" ADD CONSTRAINT "sk_rektor_mahasiswa_pendaftaran_id_fkey" FOREIGN KEY ("pendaftaran_id") REFERENCES "pendaftaran"("pendaftaran_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "StatusMataKuliahMahasiswa" AS ENUM ('DRAFT', 'EVALUASI_MANDIRI', 'DALAM_ASESSMEN', 'DISANGGAH', 'PERLU_DIREVISI', 'SELESAI');

-- AlterTable
ALTER TABLE "mata_kuliah_mahasiswa" ADD COLUMN     "status_mata_kuliah_mahasiswa" "StatusMataKuliahMahasiswa";

-- CreateEnum
CREATE TYPE "JenisSkAsessmen" AS ENUM ('PEROLEHAN_SKS', 'TRANSFER_SKS');

-- AlterTable
ALTER TABLE "sk_rektor" ADD COLUMN     "jenis_sk_asessmen" "JenisSkAsessmen";

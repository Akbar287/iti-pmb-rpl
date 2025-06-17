/*
  Warnings:

  - You are about to drop the column `diakui` on the `hasil_assesmen` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "hasil_assesmen" DROP COLUMN "diakui";

-- AlterTable
ALTER TABLE "skor_assesmen" ADD COLUMN     "diakui" BOOLEAN NOT NULL DEFAULT false;

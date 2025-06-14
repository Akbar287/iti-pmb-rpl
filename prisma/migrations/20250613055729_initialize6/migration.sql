/*
  Warnings:

  - Made the column `aktif` on table `status_mahasiswa_assesment_history` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "status_mahasiswa_assesment_history" ALTER COLUMN "aktif" SET NOT NULL;

/*
  Warnings:

  - Added the required column `tahun` to the `mahasiswa_piagam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "mahasiswa_piagam" ADD COLUMN     "tahun" INTEGER NOT NULL;

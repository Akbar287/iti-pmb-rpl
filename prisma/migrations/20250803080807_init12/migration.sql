/*
  Warnings:

  - Added the required column `file_data` to the `bukti_form` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bukti_form" ADD COLUMN     "file_data" BYTEA NOT NULL;

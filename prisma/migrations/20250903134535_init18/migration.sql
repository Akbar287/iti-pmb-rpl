/*
  Warnings:

  - Made the column `testomoni_deskripsi` on table `setting_main_page` required. This step will fail if there are existing NULL values in that column.
  - Made the column `testomoni_text` on table `setting_main_page` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "setting_main_page" ALTER COLUMN "testomoni_deskripsi" SET NOT NULL,
ALTER COLUMN "testomoni_text" SET NOT NULL;

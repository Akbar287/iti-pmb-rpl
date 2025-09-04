/*
  Warnings:

  - Made the column `icon` on table `setting_why` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "setting_why" ALTER COLUMN "icon" SET NOT NULL;

/*
  Warnings:

  - A unique constraint covering the columns `[pendaftaran_id]` on the table `sanggahan_assesmen` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `file_data` to the `sk_rektor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sk_rektor" ADD COLUMN     "file_data" BYTEA NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "sanggahan_assesmen_pendaftaran_id_key" ON "sanggahan_assesmen"("pendaftaran_id");

/*
  Warnings:

  - A unique constraint covering the columns `[evaluasi_diri_id]` on the table `hasil_assesmen` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "hasil_assesmen_evaluasi_diri_id_key" ON "hasil_assesmen"("evaluasi_diri_id");

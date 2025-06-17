/*
  Warnings:

  - A unique constraint covering the columns `[mata_kuliah_mahasiswa_id]` on the table `skor_assesmen` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "skor_assesmen_mata_kuliah_mahasiswa_id_key" ON "skor_assesmen"("mata_kuliah_mahasiswa_id");

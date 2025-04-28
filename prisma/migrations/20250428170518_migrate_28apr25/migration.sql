/*
  Warnings:

  - A unique constraint covering the columns `[pendaftaran_id,mata_kuliah_id]` on the table `mata_kuliah_mahasiswa` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "mata_kuliah_mahasiswa_pendaftaran_id_mata_kuliah_id_key" ON "mata_kuliah_mahasiswa"("pendaftaran_id", "mata_kuliah_id");

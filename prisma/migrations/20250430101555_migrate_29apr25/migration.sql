/*
  Warnings:

  - A unique constraint covering the columns `[mata_kuliah_mahasiswa_id,capaian_pembelajaran_id]` on the table `evaluasi_diri` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "evaluasi_diri_mata_kuliah_mahasiswa_id_capaian_pembelajaran_key" ON "evaluasi_diri"("mata_kuliah_mahasiswa_id", "capaian_pembelajaran_id");

-- CreateTable
CREATE TABLE "transkrip_nilai" (
    "transkrip_nilai_id" TEXT NOT NULL,
    "pendaftaran_id" TEXT NOT NULL,
    "kode_mata_kuliah" TEXT NOT NULL,
    "nama_mata_kuliah" TEXT NOT NULL,
    "sks" DOUBLE PRECISION NOT NULL,
    "nilai" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transkrip_nilai_pkey" PRIMARY KEY ("transkrip_nilai_id")
);

-- CreateTable
CREATE TABLE "transkrip_nilai_relation" (
    "transkrip_nilai_id" TEXT NOT NULL,
    "mata_kuliah_mahasiswa_id" TEXT NOT NULL,
    "nilai" TEXT NOT NULL,
    "diakui" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "transkrip_nilai_relation_pkey" PRIMARY KEY ("transkrip_nilai_id","mata_kuliah_mahasiswa_id")
);

-- AddForeignKey
ALTER TABLE "transkrip_nilai" ADD CONSTRAINT "transkrip_nilai_pendaftaran_id_fkey" FOREIGN KEY ("pendaftaran_id") REFERENCES "pendaftaran"("pendaftaran_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transkrip_nilai_relation" ADD CONSTRAINT "transkrip_nilai_relation_transkrip_nilai_id_fkey" FOREIGN KEY ("transkrip_nilai_id") REFERENCES "transkrip_nilai"("transkrip_nilai_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transkrip_nilai_relation" ADD CONSTRAINT "transkrip_nilai_relation_mata_kuliah_mahasiswa_id_fkey" FOREIGN KEY ("mata_kuliah_mahasiswa_id") REFERENCES "mata_kuliah_mahasiswa"("mata_kuliah_mahasiswa_id") ON DELETE CASCADE ON UPDATE CASCADE;

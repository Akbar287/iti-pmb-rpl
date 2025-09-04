/*
  Warnings:

  - You are about to drop the `UniversityInformasi` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UniversitySosialMedia` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UniversityInformasi" DROP CONSTRAINT "UniversityInformasi_university_id_fkey";

-- DropForeignKey
ALTER TABLE "UniversitySosialMedia" DROP CONSTRAINT "UniversitySosialMedia_university_id_fkey";

-- DropTable
DROP TABLE "UniversityInformasi";

-- DropTable
DROP TABLE "UniversitySosialMedia";

-- CreateTable
CREATE TABLE "university_sosial_media" (
    "university_sosial_media_id" TEXT NOT NULL,
    "university_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "username" TEXT,
    "icon" TEXT,

    CONSTRAINT "university_sosial_media_pkey" PRIMARY KEY ("university_sosial_media_id")
);

-- CreateTable
CREATE TABLE "university_informasi" (
    "university_informasi_id" TEXT NOT NULL,
    "university_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "informasi" TEXT,

    CONSTRAINT "university_informasi_pkey" PRIMARY KEY ("university_informasi_id")
);

-- AddForeignKey
ALTER TABLE "university_sosial_media" ADD CONSTRAINT "university_sosial_media_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "university"("university_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "university_informasi" ADD CONSTRAINT "university_informasi_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "university"("university_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "mata_kuliah" ALTER COLUMN "semester" DROP NOT NULL;

-- CreateTable
CREATE TABLE "UniversitySosialMedia" (
    "university_sosial_media_id" TEXT NOT NULL,
    "university_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "username" TEXT,
    "icon" TEXT,

    CONSTRAINT "UniversitySosialMedia_pkey" PRIMARY KEY ("university_sosial_media_id")
);

-- CreateTable
CREATE TABLE "UniversityInformasi" (
    "university_informasi_id" TEXT NOT NULL,
    "university_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "informasi" TEXT,

    CONSTRAINT "UniversityInformasi_pkey" PRIMARY KEY ("university_informasi_id")
);

-- AddForeignKey
ALTER TABLE "UniversitySosialMedia" ADD CONSTRAINT "UniversitySosialMedia_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "university"("university_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniversityInformasi" ADD CONSTRAINT "UniversityInformasi_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "university"("university_id") ON DELETE CASCADE ON UPDATE CASCADE;

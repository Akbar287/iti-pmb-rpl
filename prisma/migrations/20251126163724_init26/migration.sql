-- AlterTable
ALTER TABLE "hasil_assesmen" ADD COLUMN     "ai" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "skor_assesmen" ADD COLUMN     "ai" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "hasil_assesmen_ai" (
    "hasil_assesmen_ai_id" TEXT NOT NULL,
    "hasil_assesmen_id" TEXT NOT NULL,
    "valid" TEXT NOT NULL,
    "autentik" TEXT NOT NULL,
    "terkini" TEXT NOT NULL,
    "memadai" TEXT NOT NULL,
    "assesmen" TEXT NOT NULL,
    "nilai" TEXT NOT NULL,

    CONSTRAINT "hasil_assesmen_ai_pkey" PRIMARY KEY ("hasil_assesmen_ai_id")
);

-- CreateTable
CREATE TABLE "skor_assesmen_ai" (
    "skor_assesmen_ai_id" TEXT NOT NULL,
    "skor_assesmen_id" TEXT NOT NULL,
    "portofolio" TEXT NOT NULL,
    "tulis" TEXT NOT NULL,
    "wawancara" TEXT NOT NULL,
    "demo" TEXT NOT NULL,
    "skor_rata_rata" TEXT NOT NULL,
    "diakui" TEXT NOT NULL,
    "nilai_huruf" TEXT NOT NULL,

    CONSTRAINT "skor_assesmen_ai_pkey" PRIMARY KEY ("skor_assesmen_ai_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "hasil_assesmen_ai_hasil_assesmen_id_key" ON "hasil_assesmen_ai"("hasil_assesmen_id");

-- CreateIndex
CREATE UNIQUE INDEX "skor_assesmen_ai_skor_assesmen_id_key" ON "skor_assesmen_ai"("skor_assesmen_id");

-- AddForeignKey
ALTER TABLE "hasil_assesmen_ai" ADD CONSTRAINT "hasil_assesmen_ai_hasil_assesmen_id_fkey" FOREIGN KEY ("hasil_assesmen_id") REFERENCES "hasil_assesmen"("hasil_assesmen_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skor_assesmen_ai" ADD CONSTRAINT "skor_assesmen_ai_skor_assesmen_id_fkey" FOREIGN KEY ("skor_assesmen_id") REFERENCES "skor_assesmen"("skor_assesmen_id") ON DELETE CASCADE ON UPDATE CASCADE;

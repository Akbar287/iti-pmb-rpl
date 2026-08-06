-- SK Penugasan Asesor kini melekat pada asesor (berlaku kontinu), bukan pada
-- penugasan per mahasiswa. Tabel penghubung lama dibangun ulang.

-- DropForeignKey
ALTER TABLE "sk_rektor_assesor" DROP CONSTRAINT IF EXISTS "sk_rektor_assesor_assesor_mahasiswa_id_fkey";

-- DropTable
DROP TABLE IF EXISTS "sk_rektor_assesor";

-- CreateTable
CREATE TABLE "sk_rektor_assesor" (
    "sk_rektor_id" TEXT NOT NULL,
    "asesor_id" TEXT NOT NULL,

    CONSTRAINT "sk_rektor_assesor_pkey" PRIMARY KEY ("sk_rektor_id","asesor_id")
);

-- AddForeignKey
ALTER TABLE "sk_rektor_assesor" ADD CONSTRAINT "sk_rektor_assesor_sk_rektor_id_fkey" FOREIGN KEY ("sk_rektor_id") REFERENCES "sk_rektor"("sk_rektor_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sk_rektor_assesor" ADD CONSTRAINT "sk_rektor_assesor_asesor_id_fkey" FOREIGN KEY ("asesor_id") REFERENCES "asesor"("asesor_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "sk_rektor" ADD COLUMN     "disetujui" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "disetujui_oleh" TEXT,
ADD COLUMN     "disetujui_pada" TIMESTAMP(3);

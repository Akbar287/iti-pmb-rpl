-- AlterTable
ALTER TABLE "sk_rektor" ADD COLUMN     "ditandatangani" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "qr_document_id" INTEGER,
ADD COLUMN     "qr_official_id" INTEGER,
ADD COLUMN     "qr_official_jabatan" TEXT,
ADD COLUMN     "qr_official_nama" TEXT,
ADD COLUMN     "qr_token" TEXT,
ADD COLUMN     "qr_verify_url" TEXT,
ADD COLUMN     "tanda_tangan_oleh" TEXT,
ADD COLUMN     "tanda_tangan_pada" TIMESTAMP(3);

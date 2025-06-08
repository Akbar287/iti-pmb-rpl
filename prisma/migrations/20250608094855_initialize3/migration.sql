/*
  Warnings:

  - Added the required column `tipe_sk_rektor_id` to the `sk_rektor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sk_rektor" ADD COLUMN     "tipe_sk_rektor_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "tipe_sk_rektor" (
    "tipe_sk_rektor_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "tipe_sk_rektor_pkey" PRIMARY KEY ("tipe_sk_rektor_id")
);

-- AddForeignKey
ALTER TABLE "sk_rektor" ADD CONSTRAINT "sk_rektor_tipe_sk_rektor_id_fkey" FOREIGN KEY ("tipe_sk_rektor_id") REFERENCES "tipe_sk_rektor"("tipe_sk_rektor_id") ON DELETE CASCADE ON UPDATE CASCADE;

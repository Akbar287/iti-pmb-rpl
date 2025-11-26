-- CreateTable
CREATE TABLE "bukti_form_pages" (
    "bukti_form_pages_id" TEXT NOT NULL,
    "bukti_form_id" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "result" TEXT,
    "think" TEXT,

    CONSTRAINT "bukti_form_pages_pkey" PRIMARY KEY ("bukti_form_pages_id")
);

-- AddForeignKey
ALTER TABLE "bukti_form_pages" ADD CONSTRAINT "bukti_form_pages_bukti_form_id_fkey" FOREIGN KEY ("bukti_form_id") REFERENCES "bukti_form"("bukti_form_id") ON DELETE CASCADE ON UPDATE CASCADE;

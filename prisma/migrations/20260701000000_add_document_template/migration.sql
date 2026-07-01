-- CreateTable
CREATE TABLE "document_template" (
    "document_template_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_template_pkey" PRIMARY KEY ("document_template_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "document_template_type_key" ON "document_template"("type");

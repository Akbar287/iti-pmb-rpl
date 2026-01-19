-- CreateTable
CREATE TABLE "question_and_ask" (
    "question_and_ask_id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_and_ask_pkey" PRIMARY KEY ("question_and_ask_id")
);

-- CreateTable
CREATE TABLE "tickets" (
    "tickets_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "kepada_role_id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("tickets_id")
);

-- CreateTable
CREATE TABLE "tickets_file" (
    "tickets_file_id" TEXT NOT NULL,
    "tickets_id" TEXT NOT NULL,
    "nama_file" TEXT NOT NULL,
    "file_data" BYTEA NOT NULL,
    "nama_dokumen" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tickets_file_pkey" PRIMARY KEY ("tickets_file_id")
);

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_kepada_role_id_fkey" FOREIGN KEY ("kepada_role_id") REFERENCES "roles"("role_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets_file" ADD CONSTRAINT "tickets_file_tickets_id_fkey" FOREIGN KEY ("tickets_id") REFERENCES "tickets"("tickets_id") ON DELETE CASCADE ON UPDATE CASCADE;

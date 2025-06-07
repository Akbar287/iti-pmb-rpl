-- AddForeignKey
ALTER TABLE "status_mahasiswa_assesment_history" ADD CONSTRAINT "status_mahasiswa_assesment_history_daftar_ulang_id_fkey" FOREIGN KEY ("daftar_ulang_id") REFERENCES "daftar_ulang"("daftar_ulang_id") ON DELETE CASCADE ON UPDATE CASCADE;

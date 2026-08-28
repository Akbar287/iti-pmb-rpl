-- SK final yang dikirim Sisurat disimpan sebagai berkas tersendiri, bukan
-- menimpa lampiran hasil asesmen yang dirender RPL. Keduanya perlu tetap ada:
-- lampiran adalah bahan yang dikirim ke Sisurat, sedangkan SK final adalah
-- dokumen resmi yang diunduh mahasiswa.
ALTER TABLE "sk_rektor" ADD COLUMN     "path_file_final" TEXT,
ADD COLUMN     "nama_file_final" TEXT,
ADD COLUMN     "sk_final_diterima_pada" TIMESTAMP(3);

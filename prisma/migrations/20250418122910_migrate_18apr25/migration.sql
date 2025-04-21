-- CreateEnum
CREATE TYPE "ProfiensiPengetahuan" AS ENUM ('SANGAT_BAIK', 'BAIK', 'TIDAK_PERNAH');

-- CreateEnum
CREATE TYPE "Jenjang" AS ENUM ('TIDAK_TAMAT_SD', 'SD', 'SMP', 'SMA', 'D3', 'S1', 'S2', 'S3');

-- CreateEnum
CREATE TYPE "StatusPerkawinan" AS ENUM ('Lajang', 'Menikah', 'Cerai');

-- CreateEnum
CREATE TYPE "StatusKeikutsertaan" AS ENUM ('Peserta', 'Panitia', 'Pembicara');

-- CreateEnum
CREATE TYPE "KeteranganMataKuliah" AS ENUM ('Transfer_SKS', 'Perolehan_SKS');

-- CreateEnum
CREATE TYPE "JenisKelamin" AS ENUM ('PRIA', 'WANITA');

-- CreateEnum
CREATE TYPE "JenisOrtu" AS ENUM ('AYAH', 'IBU', 'KAKEK', 'NENEK');

-- CreateEnum
CREATE TYPE "StatusPekerjaan" AS ENUM ('PegawaiTetap', 'PegawaiHonorer', 'Pns', 'Lainnya');

-- CreateEnum
CREATE TYPE "SistemKuliah" AS ENUM ('RPL', 'REGULER');

-- CreateTable
CREATE TABLE "alamat" (
    "alamat_id" TEXT NOT NULL,
    "desa_id" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "kode_pos" TEXT NOT NULL,

    CONSTRAINT "alamat_pkey" PRIMARY KEY ("alamat_id")
);

-- CreateTable
CREATE TABLE "asesor" (
    "asesor_id" TEXT NOT NULL,
    "tipe_asesor_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "asesor_pkey" PRIMARY KEY ("asesor_id")
);

-- CreateTable
CREATE TABLE "asesor_akademik" (
    "asesor_akademik_id" TEXT NOT NULL,
    "asesor_id" TEXT NOT NULL,
    "pangkat" TEXT NOT NULL,
    "jabatan_fungsional_akademik" TEXT NOT NULL,
    "nip_nidn" TEXT NOT NULL,
    "nama_perguruan_tinggi" TEXT NOT NULL,
    "alamat_perguruan_tinggi" TEXT,
    "pendidikan_terakhir_bidang_keilmuan" TEXT,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "asesor_akademik_pkey" PRIMARY KEY ("asesor_akademik_id")
);

-- CreateTable
CREATE TABLE "asesor_akademik_keanggotaan_asosiasi" (
    "asesor_akademik_keanggotaan_asosiasi_id" TEXT NOT NULL,
    "asesor_akademik_id" TEXT NOT NULL,
    "nama_asosiasi" TEXT NOT NULL,
    "nomor_keanggotaan" TEXT NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "asesor_akademik_keanggotaan_asosiasi_pkey" PRIMARY KEY ("asesor_akademik_keanggotaan_asosiasi_id")
);

-- CreateTable
CREATE TABLE "asesor_praktisi" (
    "asesor_praktisi_id" TEXT NOT NULL,
    "asesor_id" TEXT NOT NULL,
    "nama_asosiasi" TEXT NOT NULL,
    "nomor_keanggotaan" TEXT NOT NULL,
    "jabatan" TEXT NOT NULL,
    "alamat_kantor" TEXT,
    "nama_instansi" TEXT NOT NULL,
    "jabatan_instansi" TEXT NOT NULL,
    "bidang_keahlian" TEXT NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "asesor_praktisi_pkey" PRIMARY KEY ("asesor_praktisi_id")
);

-- CreateTable
CREATE TABLE "assesor_mahasiswa" (
    "assesor_mahasiswa_id" TEXT NOT NULL,
    "mahasiswa_id" TEXT NOT NULL,
    "asesor_id" TEXT NOT NULL,
    "urutan" INTEGER NOT NULL,
    "confirmation" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "assesor_mahasiswa_pkey" PRIMARY KEY ("assesor_mahasiswa_id")
);

-- CreateTable
CREATE TABLE "bukti_form" (
    "bukti_form_id" TEXT NOT NULL,
    "mahasiswa_id" TEXT NOT NULL,
    "jenis_dokumen_id" TEXT NOT NULL,
    "nama_file" TEXT NOT NULL,
    "nama_dokumen" TEXT NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "bukti_form_pkey" PRIMARY KEY ("bukti_form_id")
);

-- CreateTable
CREATE TABLE "bukti_form_evaluasi_diri" (
    "bukti_form_id" TEXT NOT NULL,
    "evaluasi_diri_id" TEXT NOT NULL,

    CONSTRAINT "bukti_form_evaluasi_diri_pkey" PRIMARY KEY ("bukti_form_id","evaluasi_diri_id")
);

-- CreateTable
CREATE TABLE "capaian_pembelajaran" (
    "capaian_pembelajaran_id" TEXT NOT NULL,
    "mata_kuliah_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "urutan" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "capaian_pembelajaran_pkey" PRIMARY KEY ("capaian_pembelajaran_id")
);

-- CreateTable
CREATE TABLE "country" (
    "country_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "country_pkey" PRIMARY KEY ("country_id")
);

-- CreateTable
CREATE TABLE "daftar_ulang" (
    "daftar_ulang_id" TEXT NOT NULL,
    "mahasiswa_id" TEXT NOT NULL,
    "program_studi_id" TEXT NOT NULL,
    "nim" TEXT,
    "jenjang_kkni_dituju" TEXT,
    "kip_k" BOOLEAN NOT NULL DEFAULT false,
    "aktif" BOOLEAN NOT NULL DEFAULT false,
    "mengisi_biodata" BOOLEAN NOT NULL DEFAULT false,
    "finalisasi" BOOLEAN NOT NULL DEFAULT false,
    "tanggal_daftar" TIMESTAMP(3),
    "tanggal_daftar_ulang" TIMESTAMP(3),
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "daftar_ulang_pkey" PRIMARY KEY ("daftar_ulang_id")
);

-- CreateTable
CREATE TABLE "desa" (
    "desa_id" TEXT NOT NULL,
    "kecamatan_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "desa_pkey" PRIMARY KEY ("desa_id")
);

-- CreateTable
CREATE TABLE "evaluasi_diri" (
    "evaluasi_diri_id" TEXT NOT NULL,
    "mata_kuliah_mahasiswa_id" TEXT NOT NULL,
    "capaian_pembelajaran_id" TEXT NOT NULL,
    "profiensi_pengetahuan" "ProfiensiPengetahuan" NOT NULL DEFAULT 'TIDAK_PERNAH',
    "tanggal_pengesahan" TIMESTAMP(3),
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "evaluasi_diri_pkey" PRIMARY KEY ("evaluasi_diri_id")
);

-- CreateTable
CREATE TABLE "hasil_assesmen" (
    "hasil_assesmen_id" TEXT NOT NULL,
    "evaluasi_diri_id" TEXT NOT NULL,
    "valid" BOOLEAN NOT NULL DEFAULT false,
    "autentik" BOOLEAN NOT NULL DEFAULT false,
    "terkini" BOOLEAN NOT NULL DEFAULT false,
    "memadai" BOOLEAN NOT NULL DEFAULT false,
    "assesmen" TEXT,
    "nilai" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "diakui" BOOLEAN NOT NULL DEFAULT false,
    "tanggal_assesmen" TIMESTAMP(3),
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "hasil_assesmen_pkey" PRIMARY KEY ("hasil_assesmen_id")
);

-- CreateTable
CREATE TABLE "informasi_kependudukan" (
    "informasi_kependudukan_id" TEXT NOT NULL,
    "mahasiswa_id" TEXT NOT NULL,
    "no_kk" TEXT NOT NULL,
    "no_nik" TEXT NOT NULL,
    "suku" TEXT NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "informasi_kependudukan_pkey" PRIMARY KEY ("informasi_kependudukan_id")
);

-- CreateTable
CREATE TABLE "institusi_lama" (
    "institusi_lama_id" TEXT NOT NULL,
    "mahasiswa_id" TEXT NOT NULL,
    "alamat_id" TEXT NOT NULL,
    "jenjang" "Jenjang" NOT NULL DEFAULT 'TIDAK_TAMAT_SD',
    "jenis_institusi" TEXT NOT NULL,
    "nama_institusi" TEXT NOT NULL,
    "jurusan" TEXT NOT NULL,
    "nisn" TEXT NOT NULL,
    "npsn" TEXT NOT NULL,
    "tahun_lulus" INTEGER NOT NULL,
    "nilai_lulusan" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "institusi_lama_pkey" PRIMARY KEY ("institusi_lama_id")
);

-- CreateTable
CREATE TABLE "jenis_dokumen" (
    "jenis_dokumen_id" TEXT NOT NULL,
    "jenis" TEXT NOT NULL,
    "nomor_dokumen" INTEGER NOT NULL,
    "keterangan" TEXT,

    CONSTRAINT "jenis_dokumen_pkey" PRIMARY KEY ("jenis_dokumen_id")
);

-- CreateTable
CREATE TABLE "kabupaten" (
    "kabupaten_id" TEXT NOT NULL,
    "provinsi_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "kabupaten_pkey" PRIMARY KEY ("kabupaten_id")
);

-- CreateTable
CREATE TABLE "kecamatan" (
    "kecamatan_id" TEXT NOT NULL,
    "kabupaten_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "kecamatan_pkey" PRIMARY KEY ("kecamatan_id")
);

-- CreateTable
CREATE TABLE "mahasiswa" (
    "mahasiswa_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status_perkawinan" "StatusPerkawinan" NOT NULL DEFAULT 'Lajang',
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "mahasiswa_pkey" PRIMARY KEY ("mahasiswa_id")
);

-- CreateTable
CREATE TABLE "mahasiswa_konferensi" (
    "mahasiswa_konferensi_id" TEXT NOT NULL,
    "mahasiswa_id" TEXT NOT NULL,
    "tahun" INTEGER NOT NULL,
    "judul_seminar" TEXT NOT NULL,
    "penyelenggara" TEXT NOT NULL,
    "status_keikutsertaan" "StatusKeikutsertaan" NOT NULL DEFAULT 'Peserta',
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "mahasiswa_konferensi_pkey" PRIMARY KEY ("mahasiswa_konferensi_id")
);

-- CreateTable
CREATE TABLE "mahasiswa_organisasi_profesi" (
    "mahasiswa_organisasi_profesi_id" TEXT NOT NULL,
    "mahasiswa_id" TEXT NOT NULL,
    "tahun" INTEGER NOT NULL,
    "nama_organisasi" TEXT NOT NULL,
    "jenjang_anggota_jabatan" TEXT NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "mahasiswa_organisasi_profesi_pkey" PRIMARY KEY ("mahasiswa_organisasi_profesi_id")
);

-- CreateTable
CREATE TABLE "mahasiswa_pelatihan_professional" (
    "mahasiswa_pelatihan_professional_id" TEXT NOT NULL,
    "mahasiswa_id" TEXT NOT NULL,
    "nama_pelatihan" TEXT NOT NULL,
    "penyelenggara" TEXT NOT NULL,
    "mulai" TIMESTAMP(3) NOT NULL,
    "selesai" TIMESTAMP(3),
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "mahasiswa_pelatihan_professional_pkey" PRIMARY KEY ("mahasiswa_pelatihan_professional_id")
);

-- CreateTable
CREATE TABLE "mahasiswa_pendidikan" (
    "mahasiswa_pendidikan_id" TEXT NOT NULL,
    "mahasiswa_id" TEXT NOT NULL,
    "nama_sekolah" TEXT NOT NULL,
    "tahun_lulus" INTEGER NOT NULL,
    "jurusan" TEXT NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "mahasiswa_pendidikan_pkey" PRIMARY KEY ("mahasiswa_pendidikan_id")
);

-- CreateTable
CREATE TABLE "mahasiswa_piagam" (
    "mahasiswa_piagam_id" TEXT NOT NULL,
    "mahasiswa_id" TEXT NOT NULL,
    "bentuk_penghargaan" TEXT NOT NULL,
    "pemberi_penghargaan" TEXT NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "mahasiswa_piagam_pkey" PRIMARY KEY ("mahasiswa_piagam_id")
);

-- CreateTable
CREATE TABLE "mahasiswa_riwayat_pekerjaan" (
    "mahasiswa_riwayat_pekerjaan_id" TEXT NOT NULL,
    "mahasiswa_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "posisi_jabatan" TEXT NOT NULL,
    "alamat" TEXT,
    "uraian_tugas" TEXT,
    "mulai_bekerja" TIMESTAMP(3) NOT NULL,
    "selesai_bekerja" TIMESTAMP(3),
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "mahasiswa_riwayat_pekerjaan_pkey" PRIMARY KEY ("mahasiswa_riwayat_pekerjaan_id")
);

-- CreateTable
CREATE TABLE "mata_kuliah" (
    "mata_kuliah_id" TEXT NOT NULL,
    "program_studi_id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "sks" INTEGER NOT NULL,
    "semester" TEXT NOT NULL,
    "silabus" TEXT,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "mata_kuliah_pkey" PRIMARY KEY ("mata_kuliah_id")
);

-- CreateTable
CREATE TABLE "mata_kuliah_mahasiswa" (
    "mata_kuliah_mahasiswa_id" TEXT NOT NULL,
    "mahasiswa_id" TEXT NOT NULL,
    "mata_kuliah_id" TEXT NOT NULL,
    "rpl" BOOLEAN NOT NULL DEFAULT false,
    "keterangan" "KeteranganMataKuliah",
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "mata_kuliah_mahasiswa_pkey" PRIMARY KEY ("mata_kuliah_mahasiswa_id")
);

-- CreateTable
CREATE TABLE "user_has_permissions" (
    "permission_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "user_has_permissions_pkey" PRIMARY KEY ("permission_id","user_id")
);

-- CreateTable
CREATE TABLE "user_has_roles" (
    "role_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "user_has_roles_pkey" PRIMARY KEY ("role_id","user_id")
);

-- CreateTable
CREATE TABLE "orang_tua" (
    "orang_tua_id" TEXT NOT NULL,
    "mahasiswa_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "pekerjaan" TEXT,
    "jenis_ortu" "JenisOrtu" NOT NULL,
    "penghasilan" DOUBLE PRECISION NOT NULL,
    "email" TEXT NOT NULL,
    "nomor_hp" TEXT NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "orang_tua_pkey" PRIMARY KEY ("orang_tua_id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3),

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "pekerjaan_mahasiswa" (
    "pekerjaan_mahasiswa_id" TEXT NOT NULL,
    "mahasiswa_id" TEXT NOT NULL,
    "alamat_id" TEXT NOT NULL,
    "institusi_tempat_bekerja" TEXT NOT NULL,
    "jabatan" TEXT NOT NULL,
    "status_pekerjaan" "StatusPekerjaan" NOT NULL DEFAULT 'Lainnya',
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "pekerjaan_mahasiswa_pkey" PRIMARY KEY ("pekerjaan_mahasiswa_id")
);

-- CreateTable
CREATE TABLE "pendaftaran" (
    "pendaftaran_id" TEXT NOT NULL,
    "mahasiswa_id" TEXT NOT NULL,
    "kode_pendaftar" TEXT NOT NULL,
    "no_ujian" TEXT NOT NULL,
    "periode" TEXT NOT NULL,
    "gelombang" TEXT NOT NULL,
    "sistem_kuliah" "SistemKuliah" NOT NULL DEFAULT 'REGULER',
    "jalur_pendaftaran" TEXT NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "pendaftaran_pkey" PRIMARY KEY ("pendaftaran_id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "permission_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "guard_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("permission_id")
);

-- CreateTable
CREATE TABLE "pesantren" (
    "pesantren_id" TEXT NOT NULL,
    "mahasiswa_id" TEXT NOT NULL,
    "nama_pesantren" TEXT NOT NULL,
    "lama_pesantren" TEXT NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "pesantren_pkey" PRIMARY KEY ("pesantren_id")
);

-- CreateTable
CREATE TABLE "program_studi" (
    "program_studi_id" TEXT NOT NULL,
    "university_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "jenjang" TEXT,
    "akreditasi" TEXT NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "program_studi_pkey" PRIMARY KEY ("program_studi_id")
);

-- CreateTable
CREATE TABLE "provinsi" (
    "provinsi_id" TEXT NOT NULL,
    "country_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "provinsi_pkey" PRIMARY KEY ("provinsi_id")
);

-- CreateTable
CREATE TABLE "role_has_permissions" (
    "permission_id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,

    CONSTRAINT "role_has_permissions_pkey" PRIMARY KEY ("permission_id","role_id")
);

-- CreateTable
CREATE TABLE "roles" (
    "role_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "guard_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "sanggahan_assesmen" (
    "sanggahan_assesmen_id" TEXT NOT NULL,
    "mahasiswa_id" TEXT NOT NULL,
    "proses_banding" BOOLEAN NOT NULL DEFAULT false,
    "diskusi_banding" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "sanggahan_assesmen_pkey" PRIMARY KEY ("sanggahan_assesmen_id")
);

-- CreateTable
CREATE TABLE "sanggahan_assesmen_mk" (
    "sanggahan_assesmen_mk_id" TEXT NOT NULL,
    "sanggahan_assesmen_id" TEXT NOT NULL,
    "mata_kuliah_mahasiswa_id" TEXT NOT NULL,
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "sanggahan_assesmen_mk_pkey" PRIMARY KEY ("sanggahan_assesmen_mk_id")
);

-- CreateTable
CREATE TABLE "sanggahan_assesmen_pihak" (
    "sanggahan_assesmen_pihak_id" TEXT NOT NULL,
    "sanggahan_assesmen_id" TEXT NOT NULL,
    "nama_pihak" TEXT NOT NULL,
    "jabatan_pihak" TEXT,
    "instansi_pihak" TEXT,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "sanggahan_assesmen_pihak_pkey" PRIMARY KEY ("sanggahan_assesmen_pihak_id")
);

-- CreateTable
CREATE TABLE "sk_rektor" (
    "sk_rektor_id" TEXT NOT NULL,
    "nama_sk" TEXT NOT NULL,
    "tahun_sk" INTEGER NOT NULL DEFAULT 2025,
    "nomor_sk" TEXT NOT NULL,
    "nama_file" TEXT NOT NULL,
    "nama_dokumen" TEXT NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "sk_rektor_pkey" PRIMARY KEY ("sk_rektor_id")
);

-- CreateTable
CREATE TABLE "sk_rektor_assesor" (
    "sk_rektor_id" TEXT NOT NULL,
    "assesor_mahasiswa_id" TEXT NOT NULL,

    CONSTRAINT "sk_rektor_assesor_pkey" PRIMARY KEY ("sk_rektor_id","assesor_mahasiswa_id")
);

-- CreateTable
CREATE TABLE "sk_rektor_mahasiswa" (
    "sk_rektor_id" TEXT NOT NULL,
    "mahasiswa_id" TEXT NOT NULL,

    CONSTRAINT "sk_rektor_mahasiswa_pkey" PRIMARY KEY ("sk_rektor_id","mahasiswa_id")
);

-- CreateTable
CREATE TABLE "skor_assesmen" (
    "skor_assesmen_id" TEXT NOT NULL,
    "hasil_assesmen_id" TEXT NOT NULL,
    "portofolio" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tulis" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "wawancara" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "demo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "skor_rata_rata" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "nilai_huruf" TEXT,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "skor_assesmen_pkey" PRIMARY KEY ("skor_assesmen_id")
);

-- CreateTable
CREATE TABLE "status_mahasiswa_assesment" (
    "status_mahasiswa_assesment_id" TEXT NOT NULL,
    "nama_status" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "urutan" INTEGER NOT NULL,
    "keterangan" TEXT,

    CONSTRAINT "status_mahasiswa_assesment_pkey" PRIMARY KEY ("status_mahasiswa_assesment_id")
);

-- CreateTable
CREATE TABLE "status_mahasiswa_assesment_history" (
    "status_mahasiswa_assesment_history_id" TEXT NOT NULL,
    "status_mahasiswa_assesment_id" TEXT NOT NULL,
    "daftar_ulang_id" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3),
    "keterangan" TEXT,

    CONSTRAINT "status_mahasiswa_assesment_history_pkey" PRIMARY KEY ("status_mahasiswa_assesment_history_id")
);

-- CreateTable
CREATE TABLE "tipe_asesor" (
    "tipe_asesor_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "icon" TEXT,
    "deskripsi" TEXT,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tipe_asesor_pkey" PRIMARY KEY ("tipe_asesor_id")
);

-- CreateTable
CREATE TABLE "university" (
    "university_id" TEXT NOT NULL,
    "alamat_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "akreditasi" TEXT NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "university_pkey" PRIMARY KEY ("university_id")
);

-- CreateTable
CREATE TABLE "university_jabatan" (
    "university_jabatan_id" TEXT NOT NULL,
    "university_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "university_jabatan_pkey" PRIMARY KEY ("university_jabatan_id")
);

-- CreateTable
CREATE TABLE "university_jabatan_orang" (
    "university_jabatan_orang_id" TEXT NOT NULL,
    "university_jabatan_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "university_jabatan_orang_pkey" PRIMARY KEY ("university_jabatan_orang_id")
);

-- CreateTable
CREATE TABLE "user" (
    "user_id" TEXT NOT NULL,
    "alamat_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified_at" TIMESTAMP(3),
    "tempat_lahir" TEXT,
    "tanggal_lahir" TIMESTAMP(3),
    "jenis_kelamin" "JenisKelamin" NOT NULL DEFAULT 'PRIA',
    "pendidikan_terakhir" "Jenjang" NOT NULL DEFAULT 'TIDAK_TAMAT_SD',
    "avatar" TEXT,
    "agama" TEXT,
    "telepon" TEXT,
    "nomor_wa" TEXT,
    "nomor_hp" TEXT,
    "remember_token" TEXT,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "userlogin" (
    "userlogin_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "userlogin_pkey" PRIMARY KEY ("userlogin_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_guard_name_key" ON "permissions"("name", "guard_name");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_guard_name_key" ON "roles"("name", "guard_name");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "alamat" ADD CONSTRAINT "alamat_desa_id_fkey" FOREIGN KEY ("desa_id") REFERENCES "desa"("desa_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asesor" ADD CONSTRAINT "asesor_tipe_asesor_id_fkey" FOREIGN KEY ("tipe_asesor_id") REFERENCES "tipe_asesor"("tipe_asesor_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asesor_akademik" ADD CONSTRAINT "asesor_akademik_asesor_id_fkey" FOREIGN KEY ("asesor_id") REFERENCES "asesor"("asesor_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asesor_akademik_keanggotaan_asosiasi" ADD CONSTRAINT "asesor_akademik_keanggotaan_asosiasi_asesor_akademik_id_fkey" FOREIGN KEY ("asesor_akademik_id") REFERENCES "asesor_akademik"("asesor_akademik_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asesor_praktisi" ADD CONSTRAINT "asesor_praktisi_asesor_id_fkey" FOREIGN KEY ("asesor_id") REFERENCES "asesor"("asesor_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assesor_mahasiswa" ADD CONSTRAINT "assesor_mahasiswa_asesor_id_fkey" FOREIGN KEY ("asesor_id") REFERENCES "asesor"("asesor_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assesor_mahasiswa" ADD CONSTRAINT "assesor_mahasiswa_mahasiswa_id_fkey" FOREIGN KEY ("mahasiswa_id") REFERENCES "mahasiswa"("mahasiswa_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bukti_form" ADD CONSTRAINT "bukti_form_mahasiswa_id_fkey" FOREIGN KEY ("mahasiswa_id") REFERENCES "mahasiswa"("mahasiswa_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bukti_form" ADD CONSTRAINT "bukti_form_jenis_dokumen_id_fkey" FOREIGN KEY ("jenis_dokumen_id") REFERENCES "jenis_dokumen"("jenis_dokumen_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bukti_form_evaluasi_diri" ADD CONSTRAINT "bukti_form_evaluasi_diri_bukti_form_id_fkey" FOREIGN KEY ("bukti_form_id") REFERENCES "bukti_form"("bukti_form_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bukti_form_evaluasi_diri" ADD CONSTRAINT "bukti_form_evaluasi_diri_evaluasi_diri_id_fkey" FOREIGN KEY ("evaluasi_diri_id") REFERENCES "evaluasi_diri"("evaluasi_diri_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "capaian_pembelajaran" ADD CONSTRAINT "capaian_pembelajaran_mata_kuliah_id_fkey" FOREIGN KEY ("mata_kuliah_id") REFERENCES "mata_kuliah"("mata_kuliah_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daftar_ulang" ADD CONSTRAINT "daftar_ulang_mahasiswa_id_fkey" FOREIGN KEY ("mahasiswa_id") REFERENCES "mahasiswa"("mahasiswa_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daftar_ulang" ADD CONSTRAINT "daftar_ulang_program_studi_id_fkey" FOREIGN KEY ("program_studi_id") REFERENCES "program_studi"("program_studi_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "desa" ADD CONSTRAINT "desa_kecamatan_id_fkey" FOREIGN KEY ("kecamatan_id") REFERENCES "kecamatan"("kecamatan_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluasi_diri" ADD CONSTRAINT "evaluasi_diri_mata_kuliah_mahasiswa_id_fkey" FOREIGN KEY ("mata_kuliah_mahasiswa_id") REFERENCES "mata_kuliah_mahasiswa"("mata_kuliah_mahasiswa_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluasi_diri" ADD CONSTRAINT "evaluasi_diri_capaian_pembelajaran_id_fkey" FOREIGN KEY ("capaian_pembelajaran_id") REFERENCES "capaian_pembelajaran"("capaian_pembelajaran_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hasil_assesmen" ADD CONSTRAINT "hasil_assesmen_evaluasi_diri_id_fkey" FOREIGN KEY ("evaluasi_diri_id") REFERENCES "evaluasi_diri"("evaluasi_diri_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "informasi_kependudukan" ADD CONSTRAINT "informasi_kependudukan_mahasiswa_id_fkey" FOREIGN KEY ("mahasiswa_id") REFERENCES "mahasiswa"("mahasiswa_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institusi_lama" ADD CONSTRAINT "institusi_lama_mahasiswa_id_fkey" FOREIGN KEY ("mahasiswa_id") REFERENCES "mahasiswa"("mahasiswa_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institusi_lama" ADD CONSTRAINT "institusi_lama_alamat_id_fkey" FOREIGN KEY ("alamat_id") REFERENCES "alamat"("alamat_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kabupaten" ADD CONSTRAINT "kabupaten_provinsi_id_fkey" FOREIGN KEY ("provinsi_id") REFERENCES "provinsi"("provinsi_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kecamatan" ADD CONSTRAINT "kecamatan_kabupaten_id_fkey" FOREIGN KEY ("kabupaten_id") REFERENCES "kabupaten"("kabupaten_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mahasiswa" ADD CONSTRAINT "mahasiswa_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mahasiswa_konferensi" ADD CONSTRAINT "mahasiswa_konferensi_mahasiswa_id_fkey" FOREIGN KEY ("mahasiswa_id") REFERENCES "mahasiswa"("mahasiswa_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mahasiswa_organisasi_profesi" ADD CONSTRAINT "mahasiswa_organisasi_profesi_mahasiswa_id_fkey" FOREIGN KEY ("mahasiswa_id") REFERENCES "mahasiswa"("mahasiswa_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mahasiswa_pelatihan_professional" ADD CONSTRAINT "mahasiswa_pelatihan_professional_mahasiswa_id_fkey" FOREIGN KEY ("mahasiswa_id") REFERENCES "mahasiswa"("mahasiswa_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mahasiswa_pendidikan" ADD CONSTRAINT "mahasiswa_pendidikan_mahasiswa_id_fkey" FOREIGN KEY ("mahasiswa_id") REFERENCES "mahasiswa"("mahasiswa_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mahasiswa_piagam" ADD CONSTRAINT "mahasiswa_piagam_mahasiswa_id_fkey" FOREIGN KEY ("mahasiswa_id") REFERENCES "mahasiswa"("mahasiswa_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mahasiswa_riwayat_pekerjaan" ADD CONSTRAINT "mahasiswa_riwayat_pekerjaan_mahasiswa_id_fkey" FOREIGN KEY ("mahasiswa_id") REFERENCES "mahasiswa"("mahasiswa_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mata_kuliah" ADD CONSTRAINT "mata_kuliah_program_studi_id_fkey" FOREIGN KEY ("program_studi_id") REFERENCES "program_studi"("program_studi_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mata_kuliah_mahasiswa" ADD CONSTRAINT "mata_kuliah_mahasiswa_mahasiswa_id_fkey" FOREIGN KEY ("mahasiswa_id") REFERENCES "mahasiswa"("mahasiswa_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mata_kuliah_mahasiswa" ADD CONSTRAINT "mata_kuliah_mahasiswa_mata_kuliah_id_fkey" FOREIGN KEY ("mata_kuliah_id") REFERENCES "mata_kuliah"("mata_kuliah_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_has_permissions" ADD CONSTRAINT "user_has_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("permission_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_has_permissions" ADD CONSTRAINT "user_has_permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_has_roles" ADD CONSTRAINT "user_has_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_has_roles" ADD CONSTRAINT "user_has_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orang_tua" ADD CONSTRAINT "orang_tua_mahasiswa_id_fkey" FOREIGN KEY ("mahasiswa_id") REFERENCES "mahasiswa"("mahasiswa_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pekerjaan_mahasiswa" ADD CONSTRAINT "pekerjaan_mahasiswa_mahasiswa_id_fkey" FOREIGN KEY ("mahasiswa_id") REFERENCES "mahasiswa"("mahasiswa_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pendaftaran" ADD CONSTRAINT "pendaftaran_mahasiswa_id_fkey" FOREIGN KEY ("mahasiswa_id") REFERENCES "mahasiswa"("mahasiswa_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pesantren" ADD CONSTRAINT "pesantren_mahasiswa_id_fkey" FOREIGN KEY ("mahasiswa_id") REFERENCES "mahasiswa"("mahasiswa_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_studi" ADD CONSTRAINT "program_studi_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "university"("university_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provinsi" ADD CONSTRAINT "provinsi_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "country"("country_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_has_permissions" ADD CONSTRAINT "role_has_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("permission_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_has_permissions" ADD CONSTRAINT "role_has_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sanggahan_assesmen" ADD CONSTRAINT "sanggahan_assesmen_mahasiswa_id_fkey" FOREIGN KEY ("mahasiswa_id") REFERENCES "mahasiswa"("mahasiswa_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sanggahan_assesmen_mk" ADD CONSTRAINT "sanggahan_assesmen_mk_sanggahan_assesmen_id_fkey" FOREIGN KEY ("sanggahan_assesmen_id") REFERENCES "sanggahan_assesmen"("sanggahan_assesmen_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sanggahan_assesmen_mk" ADD CONSTRAINT "sanggahan_assesmen_mk_mata_kuliah_mahasiswa_id_fkey" FOREIGN KEY ("mata_kuliah_mahasiswa_id") REFERENCES "mata_kuliah_mahasiswa"("mata_kuliah_mahasiswa_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sanggahan_assesmen_pihak" ADD CONSTRAINT "sanggahan_assesmen_pihak_sanggahan_assesmen_id_fkey" FOREIGN KEY ("sanggahan_assesmen_id") REFERENCES "sanggahan_assesmen"("sanggahan_assesmen_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sk_rektor_assesor" ADD CONSTRAINT "sk_rektor_assesor_sk_rektor_id_fkey" FOREIGN KEY ("sk_rektor_id") REFERENCES "sk_rektor"("sk_rektor_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sk_rektor_assesor" ADD CONSTRAINT "sk_rektor_assesor_assesor_mahasiswa_id_fkey" FOREIGN KEY ("assesor_mahasiswa_id") REFERENCES "assesor_mahasiswa"("assesor_mahasiswa_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sk_rektor_mahasiswa" ADD CONSTRAINT "sk_rektor_mahasiswa_sk_rektor_id_fkey" FOREIGN KEY ("sk_rektor_id") REFERENCES "sk_rektor"("sk_rektor_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sk_rektor_mahasiswa" ADD CONSTRAINT "sk_rektor_mahasiswa_mahasiswa_id_fkey" FOREIGN KEY ("mahasiswa_id") REFERENCES "mahasiswa"("mahasiswa_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skor_assesmen" ADD CONSTRAINT "skor_assesmen_hasil_assesmen_id_fkey" FOREIGN KEY ("hasil_assesmen_id") REFERENCES "hasil_assesmen"("hasil_assesmen_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status_mahasiswa_assesment_history" ADD CONSTRAINT "status_mahasiswa_assesment_history_status_mahasiswa_assesm_fkey" FOREIGN KEY ("status_mahasiswa_assesment_id") REFERENCES "status_mahasiswa_assesment"("status_mahasiswa_assesment_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "university" ADD CONSTRAINT "university_alamat_id_fkey" FOREIGN KEY ("alamat_id") REFERENCES "alamat"("alamat_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "university_jabatan" ADD CONSTRAINT "university_jabatan_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "university"("university_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "university_jabatan_orang" ADD CONSTRAINT "university_jabatan_orang_university_jabatan_id_fkey" FOREIGN KEY ("university_jabatan_id") REFERENCES "university_jabatan"("university_jabatan_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_alamat_id_fkey" FOREIGN KEY ("alamat_id") REFERENCES "alamat"("alamat_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userlogin" ADD CONSTRAINT "userlogin_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

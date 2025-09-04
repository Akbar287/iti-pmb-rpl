-- CreateTable
CREATE TABLE "jenis_kegiatan" (
    "jenis_kegiatan_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "jenis_kegiatan_pkey" PRIMARY KEY ("jenis_kegiatan_id")
);

-- CreateTable
CREATE TABLE "setting_main_page" (
    "setting_main_page_id" TEXT NOT NULL,
    "university_id" TEXT NOT NULL,
    "background_file_utama" BYTEA NOT NULL,
    "text_main_page_1" TEXT NOT NULL,
    "text_main_page_2" TEXT NOT NULL,
    "text_main_page_3" TEXT NOT NULL,
    "selayang_pandang_text" TEXT NOT NULL,
    "selayang_pandang_deskripsi" TEXT NOT NULL,
    "selayang_pandang_background_file" BYTEA NOT NULL,
    "why_text" TEXT NOT NULL,
    "why_deskripsi" TEXT NOT NULL,
    "community_text" TEXT NOT NULL,
    "community_deskripsi" TEXT NOT NULL,
    "kegiatan_text" TEXT NOT NULL,
    "kegiatan_deskripsi" TEXT NOT NULL,
    "berita_text" TEXT NOT NULL,
    "berita_deskripsi" TEXT NOT NULL,

    CONSTRAINT "setting_main_page_pkey" PRIMARY KEY ("setting_main_page_id")
);

-- CreateTable
CREATE TABLE "setting_kegiatan" (
    "setting_kegiatan_id" TEXT NOT NULL,
    "jenis_kegiatan_id" TEXT NOT NULL,
    "setting_main_page_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "lokasi" TEXT,
    "deskripsi" TEXT,
    "waktu_mulai" TIMESTAMP(3) NOT NULL,
    "waktu_selesai" TIMESTAMP(3),

    CONSTRAINT "setting_kegiatan_pkey" PRIMARY KEY ("setting_kegiatan_id")
);

-- CreateTable
CREATE TABLE "setting_community" (
    "setting_community_id" TEXT NOT NULL,
    "setting_main_page_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "gambar" BYTEA NOT NULL,

    CONSTRAINT "setting_community_pkey" PRIMARY KEY ("setting_community_id")
);

-- CreateTable
CREATE TABLE "setting_why" (
    "setting_why_id" TEXT NOT NULL,
    "setting_main_page_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,

    CONSTRAINT "setting_why_pkey" PRIMARY KEY ("setting_why_id")
);

-- CreateTable
CREATE TABLE "setting_number" (
    "setting_number_id" TEXT NOT NULL,
    "setting_main_page_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" INTEGER NOT NULL,
    "angka" TEXT NOT NULL,

    CONSTRAINT "setting_number_pkey" PRIMARY KEY ("setting_number_id")
);

-- CreateTable
CREATE TABLE "setting_testimony" (
    "setting_testimony_id" TEXT NOT NULL,
    "setting_main_page_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "jabatan" TEXT NOT NULL,
    "jurusan_tahun" TEXT NOT NULL,
    "testimoni" TEXT NOT NULL,
    "foto" BYTEA NOT NULL,

    CONSTRAINT "setting_testimony_pkey" PRIMARY KEY ("setting_testimony_id")
);

-- CreateTable
CREATE TABLE "setting_berita" (
    "setting_berita_id" TEXT NOT NULL,
    "setting_main_page_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "gambar" BYTEA NOT NULL,
    "populer" BOOLEAN NOT NULL DEFAULT false,
    "waktu" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "setting_berita_pkey" PRIMARY KEY ("setting_berita_id")
);

-- AddForeignKey
ALTER TABLE "setting_main_page" ADD CONSTRAINT "setting_main_page_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "university"("university_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "setting_kegiatan" ADD CONSTRAINT "setting_kegiatan_jenis_kegiatan_id_fkey" FOREIGN KEY ("jenis_kegiatan_id") REFERENCES "jenis_kegiatan"("jenis_kegiatan_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "setting_kegiatan" ADD CONSTRAINT "setting_kegiatan_setting_main_page_id_fkey" FOREIGN KEY ("setting_main_page_id") REFERENCES "setting_main_page"("setting_main_page_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "setting_community" ADD CONSTRAINT "setting_community_setting_main_page_id_fkey" FOREIGN KEY ("setting_main_page_id") REFERENCES "setting_main_page"("setting_main_page_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "setting_why" ADD CONSTRAINT "setting_why_setting_main_page_id_fkey" FOREIGN KEY ("setting_main_page_id") REFERENCES "setting_main_page"("setting_main_page_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "setting_number" ADD CONSTRAINT "setting_number_setting_main_page_id_fkey" FOREIGN KEY ("setting_main_page_id") REFERENCES "setting_main_page"("setting_main_page_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "setting_testimony" ADD CONSTRAINT "setting_testimony_setting_main_page_id_fkey" FOREIGN KEY ("setting_main_page_id") REFERENCES "setting_main_page"("setting_main_page_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "setting_berita" ADD CONSTRAINT "setting_berita_setting_main_page_id_fkey" FOREIGN KEY ("setting_main_page_id") REFERENCES "setting_main_page"("setting_main_page_id") ON DELETE CASCADE ON UPDATE CASCADE;

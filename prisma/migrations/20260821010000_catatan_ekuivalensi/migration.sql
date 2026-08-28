-- Asesor perlu mencatat alasan pengakuan/penolakan ekuivalensi transfer SKS,
-- terutama ketika SKS pada transkrip berbeda dengan SKS mata kuliah di sistem.
ALTER TABLE "transkrip_nilai_relation" ADD COLUMN     "catatan" TEXT;

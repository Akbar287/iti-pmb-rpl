
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.AlamatScalarFieldEnum = {
  AlamatId: 'AlamatId',
  DesaId: 'DesaId',
  Alamat: 'Alamat',
  KodePos: 'KodePos'
};

exports.Prisma.AsesorScalarFieldEnum = {
  AsesorId: 'AsesorId',
  TipeAsesorId: 'TipeAsesorId',
  UserId: 'UserId',
  CreatedAt: 'CreatedAt',
  UpdatedAt: 'UpdatedAt',
  DeletedAt: 'DeletedAt'
};

exports.Prisma.AsesorAkademikScalarFieldEnum = {
  AsesorAkademikId: 'AsesorAkademikId',
  AsesorId: 'AsesorId',
  Pangkat: 'Pangkat',
  JabatanFungsionalAkademik: 'JabatanFungsionalAkademik',
  NipNidn: 'NipNidn',
  NamaPerguruanTinggi: 'NamaPerguruanTinggi',
  AlamatPerguruanTinggi: 'AlamatPerguruanTinggi',
  PendidikanTerakhirBidangKeilmuan: 'PendidikanTerakhirBidangKeilmuan',
  CreatedAt: 'CreatedAt',
  UpdatedAt: 'UpdatedAt',
  DeletedAt: 'DeletedAt'
};

exports.Prisma.AsesorAkademikKeanggotaanAsosiasiScalarFieldEnum = {
  AsesorAkademikKeanggotaanAsosiasiId: 'AsesorAkademikKeanggotaanAsosiasiId',
  AsesorAkademikId: 'AsesorAkademikId',
  NamaAsosiasi: 'NamaAsosiasi',
  NomorKeanggotaan: 'NomorKeanggotaan',
  CreatedAt: 'CreatedAt',
  UpdatedAt: 'UpdatedAt'
};

exports.Prisma.AsesorPraktisiScalarFieldEnum = {
  AsesorPraktisiId: 'AsesorPraktisiId',
  AsesorId: 'AsesorId',
  NamaAsosiasi: 'NamaAsosiasi',
  NomorKeanggotaan: 'NomorKeanggotaan',
  Jabatan: 'Jabatan',
  AlamatKantor: 'AlamatKantor',
  NamaInstansi: 'NamaInstansi',
  JabatanInstansi: 'JabatanInstansi',
  BidangKeahlian: 'BidangKeahlian',
  CreatedAt: 'CreatedAt',
  UpdatedAt: 'UpdatedAt',
  DeletedAt: 'DeletedAt'
};

exports.Prisma.AssesorMahasiswaScalarFieldEnum = {
  AssesorMahasiswaId: 'AssesorMahasiswaId',
  PendaftaranId: 'PendaftaranId',
  AsesorId: 'AsesorId',
  Urutan: 'Urutan',
  Confirmation: 'Confirmation',
  CreatedAt: 'CreatedAt',
  UpdatedAt: 'UpdatedAt'
};

exports.Prisma.BuktiFormScalarFieldEnum = {
  BuktiFormId: 'BuktiFormId',
  PendaftaranId: 'PendaftaranId',
  JenisDokumenId: 'JenisDokumenId',
  NamaFile: 'NamaFile',
  NamaDokumen: 'NamaDokumen',
  CreatedAt: 'CreatedAt',
  UpdatedAt: 'UpdatedAt'
};

exports.Prisma.BuktiFormEvaluasiDiriScalarFieldEnum = {
  BuktiFormId: 'BuktiFormId',
  EvaluasiDiriId: 'EvaluasiDiriId'
};

exports.Prisma.CapaianPembelajaranScalarFieldEnum = {
  CapaianPembelajaranId: 'CapaianPembelajaranId',
  MataKuliahId: 'MataKuliahId',
  Nama: 'Nama',
  Urutan: 'Urutan',
  Active: 'Active',
  CreatedAt: 'CreatedAt',
  UpdatedAt: 'UpdatedAt',
  DeletedAt: 'DeletedAt'
};

exports.Prisma.CountryScalarFieldEnum = {
  CountryId: 'CountryId',
  Nama: 'Nama'
};

exports.Prisma.DaftarUlangScalarFieldEnum = {
  DaftarUlangId: 'DaftarUlangId',
  PendaftaranId: 'PendaftaranId',
  ProgramStudiId: 'ProgramStudiId',
  Nim: 'Nim',
  JenjangKkniDituju: 'JenjangKkniDituju',
  KipK: 'KipK',
  Aktif: 'Aktif',
  MengisiBiodata: 'MengisiBiodata',
  Finalisasi: 'Finalisasi',
  TanggalDaftar: 'TanggalDaftar',
  TanggalDaftarUlang: 'TanggalDaftarUlang',
  CreatedAt: 'CreatedAt',
  UpdatedAt: 'UpdatedAt'
};

exports.Prisma.DesaScalarFieldEnum = {
  DesaId: 'DesaId',
  KecamatanId: 'KecamatanId',
  Nama: 'Nama'
};

exports.Prisma.EvaluasiDiriScalarFieldEnum = {
  EvaluasiDiriId: 'EvaluasiDiriId',
  MataKuliahMahasiswaId: 'MataKuliahMahasiswaId',
  CapaianPembelajaranId: 'CapaianPembelajaranId',
  ProfiensiPengetahuan: 'ProfiensiPengetahuan',
  TanggalPengesahan: 'TanggalPengesahan',
  CreatedAt: 'CreatedAt',
  UpdatedAt: 'UpdatedAt'
};

exports.Prisma.HasilAssesmenScalarFieldEnum = {
  HasilAssesmenId: 'HasilAssesmenId',
  EvaluasiDiriId: 'EvaluasiDiriId',
  Valid: 'Valid',
  Autentik: 'Autentik',
  Terkini: 'Terkini',
  Memadai: 'Memadai',
  Assesmen: 'Assesmen',
  Nilai: 'Nilai',
  Diakui: 'Diakui',
  TanggalAssesmen: 'TanggalAssesmen',
  CreatedAt: 'CreatedAt',
  UpdatedAt: 'UpdatedAt'
};

exports.Prisma.InformasiKependudukanScalarFieldEnum = {
  InformasiKependudukanId: 'InformasiKependudukanId',
  PendaftaranId: 'PendaftaranId',
  NoKk: 'NoKk',
  NoNik: 'NoNik',
  Suku: 'Suku',
  CreatedAt: 'CreatedAt',
  UpdatedAt: 'UpdatedAt'
};

exports.Prisma.InstitusiLamaScalarFieldEnum = {
  InstitusiLamaId: 'InstitusiLamaId',
  PendaftaranId: 'PendaftaranId',
  AlamatId: 'AlamatId',
  Jenjang: 'Jenjang',
  JenisInstitusi: 'JenisInstitusi',
  NamaInstitusi: 'NamaInstitusi',
  Jurusan: 'Jurusan',
  Nisn: 'Nisn',
  Npsn: 'Npsn',
  TahunLulus: 'TahunLulus',
  NilaiLulusan: 'NilaiLulusan',
  CreatedAt: 'CreatedAt',
  UpdatedAt: 'UpdatedAt'
};

exports.Prisma.JenisDokumenScalarFieldEnum = {
  JenisDokumenId: 'JenisDokumenId',
  Jenis: 'Jenis',
  NomorDokumen: 'NomorDokumen',
  Keterangan: 'Keterangan'
};

exports.Prisma.KabupatenScalarFieldEnum = {
  KabupatenId: 'KabupatenId',
  ProvinsiId: 'ProvinsiId',
  Nama: 'Nama'
};

exports.Prisma.KecamatanScalarFieldEnum = {
  KecamatanId: 'KecamatanId',
  KabupatenId: 'KabupatenId',
  Nama: 'Nama'
};

exports.Prisma.MahasiswaScalarFieldEnum = {
  MahasiswaId: 'MahasiswaId',
  UserId: 'UserId',
  StatusPerkawinan: 'StatusPerkawinan',
  CreatedAt: 'CreatedAt',
  UpdatedAt: 'UpdatedAt'
};

exports.Prisma.MahasiswaKonferensiScalarFieldEnum = {
  MahasiswaKonferensiId: 'MahasiswaKonferensiId',
  PendaftaranId: 'PendaftaranId',
  Tahun: 'Tahun',
  JudulSeminar: 'JudulSeminar',
  Penyelenggara: 'Penyelenggara',
  StatusKeikutsertaan: 'StatusKeikutsertaan',
  CreatedAt: 'CreatedAt',
  UpdatedAt: 'UpdatedAt'
};

exports.Prisma.MahasiswaOrganisasiProfesiScalarFieldEnum = {
  MahasiswaOrganisasiProfesiId: 'MahasiswaOrganisasiProfesiId',
  PendaftaranId: 'PendaftaranId',
  Tahun: 'Tahun',
  NamaOrganisasi: 'NamaOrganisasi',
  JenjangAnggotaJabatan: 'JenjangAnggotaJabatan',
  CreatedAt: 'CreatedAt',
  UpdatedAt: 'UpdatedAt'
};

exports.Prisma.MahasiswaPelatihanProfessionalScalarFieldEnum = {
  MahasiswaPelatihanProfessionalId: 'MahasiswaPelatihanProfessionalId',
  PendaftaranId: 'PendaftaranId',
  NamaPelatihan: 'NamaPelatihan',
  Penyelenggara: 'Penyelenggara',
  Mulai: 'Mulai',
  Selesai: 'Selesai',
  CreatedAt: 'CreatedAt',
  UpdatedAt: 'UpdatedAt'
};

exports.Prisma.MahasiswaPendidikanScalarFieldEnum = {
  MahasiswaPendidikanId: 'MahasiswaPendidikanId',
  PendaftaranId: 'PendaftaranId',
  NamaSekolah: 'NamaSekolah',
  TahunLulus: 'TahunLulus',
  Jurusan: 'Jurusan',
  CreatedAt: 'CreatedAt',
  UpdatedAt: 'UpdatedAt'
};

exports.Prisma.MahasiswaPiagamScalarFieldEnum = {
  MahasiswaPiagamId: 'MahasiswaPiagamId',
  PendaftaranId: 'PendaftaranId',
  Tahun: 'Tahun',
  BentukPenghargaan: 'BentukPenghargaan',
  PemberiPenghargaan: 'PemberiPenghargaan',
  CreatedAt: 'CreatedAt',
  UpdatedAt: 'UpdatedAt'
};

exports.Prisma.MahasiswaRiwayatPekerjaanScalarFieldEnum = {
  MahasiswaRiwayatPekerjaanId: 'MahasiswaRiwayatPekerjaanId',
  PendaftaranId: 'PendaftaranId',
  Nama: 'Nama',
  PosisiJabatan: 'PosisiJabatan',
  Alamat: 'Alamat',
  UraianTugas: 'UraianTugas',
  MulaiBekerja: 'MulaiBekerja',
  SelesaiBekerja: 'SelesaiBekerja',
  CreatedAt: 'CreatedAt',
  UpdatedAt: 'UpdatedAt'
};

exports.Prisma.MataKuliahScalarFieldEnum = {
  MataKuliahId: 'MataKuliahId',
  ProgramStudiId: 'ProgramStudiId',
  Kode: 'Kode',
  Nama: 'Nama',
  Sks: 'Sks',
  Semester: 'Semester',
  Silabus: 'Silabus',
  CreatedAt: 'CreatedAt',
  UpdatedAt: 'UpdatedAt',
  DeletedAt: 'DeletedAt'
};

exports.Prisma.MataKuliahMahasiswaScalarFieldEnum = {
  MataKuliahMahasiswaId: 'MataKuliahMahasiswaId',
  PendaftaranId: 'PendaftaranId',
  MataKuliahId: 'MataKuliahId',
  Rpl: 'Rpl',
  Keterangan: 'Keterangan',
  StatusMataKuliahMahasiswa: 'StatusMataKuliahMahasiswa',
  CreatedAt: 'CreatedAt',
  UpdatedAt: 'UpdatedAt'
};

exports.Prisma.UserHasPermissionsScalarFieldEnum = {
  PermissionId: 'PermissionId',
  UserId: 'UserId'
};

exports.Prisma.UserHasRolesScalarFieldEnum = {
  RoleId: 'RoleId',
  UserId: 'UserId'
};

exports.Prisma.OrangTuaScalarFieldEnum = {
  OrangTuaId: 'OrangTuaId',
  PendaftaranId: 'PendaftaranId',
  Nama: 'Nama',
  Pekerjaan: 'Pekerjaan',
  JenisOrtu: 'JenisOrtu',
  Penghasilan: 'Penghasilan',
  Email: 'Email',
  NomorHp: 'NomorHp',
  CreatedAt: 'CreatedAt',
  UpdatedAt: 'UpdatedAt'
};

exports.Prisma.PasswordResetTokensScalarFieldEnum = {
  Email: 'Email',
  Token: 'Token',
  CreatedAt: 'CreatedAt'
};

exports.Prisma.PekerjaanMahasiswaScalarFieldEnum = {
  PekerjaanMahasiswaId: 'PekerjaanMahasiswaId',
  PendaftaranId: 'PendaftaranId',
  AlamatId: 'AlamatId',
  InstitusiTempatBekerja: 'InstitusiTempatBekerja',
  Jabatan: 'Jabatan',
  StatusPekerjaan: 'StatusPekerjaan',
  CreatedAt: 'CreatedAt',
  UpdatedAt: 'UpdatedAt'
};

exports.Prisma.PendaftaranScalarFieldEnum = {
  PendaftaranId: 'PendaftaranId',
  MahasiswaId: 'MahasiswaId',
  KodePendaftar: 'KodePendaftar',
  NoUjian: 'NoUjian',
  Periode: 'Periode',
  Gelombang: 'Gelombang',
  SistemKuliah: 'SistemKuliah',
  JalurPendaftaran: 'JalurPendaftaran',
  CreatedAt: 'CreatedAt',
  UpdatedAt: 'UpdatedAt'
};

exports.Prisma.PermissionScalarFieldEnum = {
  PermissionId: 'PermissionId',
  Name: 'Name',
  GuardName: 'GuardName',
  CreatedAt: 'CreatedAt',
  UpdatedAt: 'UpdatedAt'
};

exports.Prisma.PesantrenScalarFieldEnum = {
  PesantrenId: 'PesantrenId',
  PendaftaranId: 'PendaftaranId',
  NamaPesantren: 'NamaPesantren',
  LamaPesantren: 'LamaPesantren',
  CreatedAt: 'CreatedAt',
  UpdatedAt: 'UpdatedAt'
};

exports.Prisma.ProgramStudiScalarFieldEnum = {
  ProgramStudiId: 'ProgramStudiId',
  UniversityId: 'UniversityId',
  Nama: 'Nama',
  Jenjang: 'Jenjang',
  Akreditasi: 'Akreditasi',
  CreatedAt: 'CreatedAt',
  UpdatedAt: 'UpdatedAt',
  DeletedAt: 'DeletedAt'
};

exports.Prisma.ProvinsiScalarFieldEnum = {
  ProvinsiId: 'ProvinsiId',
  CountryId: 'CountryId',
  Nama: 'Nama'
};

exports.Prisma.RoleHasPermissionsScalarFieldEnum = {
  PermissionId: 'PermissionId',
  RoleId: 'RoleId'
};

exports.Prisma.RoleScalarFieldEnum = {
  RoleId: 'RoleId',
  Name: 'Name',
  GuardName: 'GuardName',
  Icon: 'Icon',
  CreatedAt: 'CreatedAt',
  UpdatedAt: 'UpdatedAt'
};

exports.Prisma.SanggahanAssesmenScalarFieldEnum = {
  SanggahanAssesmenId: 'SanggahanAssesmenId',
  PendaftaranId: 'PendaftaranId',
  ProsesBanding: 'ProsesBanding',
  DiskusiBanding: 'DiskusiBanding',
  CreatedAt: 'CreatedAt',
  UpdatedAt: 'UpdatedAt'
};

exports.Prisma.SanggahanAssesmenMkScalarFieldEnum = {
  SanggahanAssesmenMkId: 'SanggahanAssesmenMkId',
  SanggahanAssesmenId: 'SanggahanAssesmenId',
  MataKuliahMahasiswaId: 'MataKuliahMahasiswaId',
  Keterangan: 'Keterangan',
  CreatedAt: 'CreatedAt',
  UpdatedAt: 'UpdatedAt'
};

exports.Prisma.SanggahanAssesmenPihakScalarFieldEnum = {
  SanggahanAssesmenPihakId: 'SanggahanAssesmenPihakId',
  SanggahanAssesmenId: 'SanggahanAssesmenId',
  NamaPihak: 'NamaPihak',
  JabatanPihak: 'JabatanPihak',
  InstansiPihak: 'InstansiPihak',
  CreatedAt: 'CreatedAt',
  UpdatedAt: 'UpdatedAt'
};

exports.Prisma.SkRektorScalarFieldEnum = {
  SkRektorId: 'SkRektorId',
  NamaSk: 'NamaSk',
  TahunSk: 'TahunSk',
  NomorSk: 'NomorSk',
  NamaFile: 'NamaFile',
  NamaDokumen: 'NamaDokumen',
  CreatedAt: 'CreatedAt',
  UpdatedAt: 'UpdatedAt'
};

exports.Prisma.SkRektorAssesorScalarFieldEnum = {
  SkRektorId: 'SkRektorId',
  AssesorMahasiswaId: 'AssesorMahasiswaId'
};

exports.Prisma.SkRektorMahasiswaScalarFieldEnum = {
  SkRektorId: 'SkRektorId',
  PendaftaranId: 'PendaftaranId'
};

exports.Prisma.SkorAssesmenScalarFieldEnum = {
  SkorAssesmenId: 'SkorAssesmenId',
  HasilAssesmenId: 'HasilAssesmenId',
  Portofolio: 'Portofolio',
  Tulis: 'Tulis',
  Wawancara: 'Wawancara',
  Demo: 'Demo',
  SkorRataRata: 'SkorRataRata',
  NilaiHuruf: 'NilaiHuruf',
  CreatedAt: 'CreatedAt',
  UpdatedAt: 'UpdatedAt'
};

exports.Prisma.StatusMahasiswaAssesmentScalarFieldEnum = {
  StatusMahasiswaAssesmentId: 'StatusMahasiswaAssesmentId',
  NamaStatus: 'NamaStatus',
  Icon: 'Icon',
  Urutan: 'Urutan',
  Keterangan: 'Keterangan'
};

exports.Prisma.StatusMahasiswaAssesmentHistoryScalarFieldEnum = {
  StatusMahasiswaAssesmentHistoryId: 'StatusMahasiswaAssesmentHistoryId',
  StatusMahasiswaAssesmentId: 'StatusMahasiswaAssesmentId',
  DaftarUlangId: 'DaftarUlangId',
  Tanggal: 'Tanggal',
  Keterangan: 'Keterangan'
};

exports.Prisma.TipeAsesorScalarFieldEnum = {
  TipeAsesorId: 'TipeAsesorId',
  Nama: 'Nama',
  Icon: 'Icon',
  Deskripsi: 'Deskripsi',
  CreatedAt: 'CreatedAt',
  UpdatedAt: 'UpdatedAt',
  DeletedAt: 'DeletedAt'
};

exports.Prisma.UniversityScalarFieldEnum = {
  UniversityId: 'UniversityId',
  AlamatId: 'AlamatId',
  Nama: 'Nama',
  Akreditasi: 'Akreditasi',
  CreatedAt: 'CreatedAt',
  UpdatedAt: 'UpdatedAt',
  DeletedAt: 'DeletedAt'
};

exports.Prisma.UniversitySosialMediaScalarFieldEnum = {
  UniversitySosialMediaId: 'UniversitySosialMediaId',
  UniversityId: 'UniversityId',
  Nama: 'Nama',
  Username: 'Username',
  Icon: 'Icon'
};

exports.Prisma.UniversityInformasiScalarFieldEnum = {
  UniversityInformasiId: 'UniversityInformasiId',
  UniversityId: 'UniversityId',
  Nama: 'Nama',
  Informasi: 'Informasi'
};

exports.Prisma.UniversityJabatanScalarFieldEnum = {
  UniversityJabatanId: 'UniversityJabatanId',
  UniversityId: 'UniversityId',
  Nama: 'Nama',
  Keterangan: 'Keterangan',
  CreatedAt: 'CreatedAt',
  UpdatedAt: 'UpdatedAt',
  DeletedAt: 'DeletedAt'
};

exports.Prisma.UniversityJabatanOrangScalarFieldEnum = {
  UniversityJabatanOrangId: 'UniversityJabatanOrangId',
  UniversityJabatanId: 'UniversityJabatanId',
  Nama: 'Nama',
  Keterangan: 'Keterangan',
  CreatedAt: 'CreatedAt',
  UpdatedAt: 'UpdatedAt',
  DeletedAt: 'DeletedAt'
};

exports.Prisma.UserScalarFieldEnum = {
  UserId: 'UserId',
  AlamatId: 'AlamatId',
  Nama: 'Nama',
  Email: 'Email',
  EmailVerifiedAt: 'EmailVerifiedAt',
  TempatLahir: 'TempatLahir',
  TanggalLahir: 'TanggalLahir',
  JenisKelamin: 'JenisKelamin',
  PendidikanTerakhir: 'PendidikanTerakhir',
  Avatar: 'Avatar',
  Agama: 'Agama',
  Telepon: 'Telepon',
  NomorWa: 'NomorWa',
  NomorHp: 'NomorHp',
  RememberToken: 'RememberToken',
  CreatedAt: 'CreatedAt',
  UpdatedAt: 'UpdatedAt',
  DeletedAt: 'DeletedAt'
};

exports.Prisma.UserloginScalarFieldEnum = {
  UserloginId: 'UserloginId',
  UserId: 'UserId',
  Username: 'Username',
  Password: 'Password',
  Credential: 'Credential'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.ProfiensiPengetahuan = exports.$Enums.ProfiensiPengetahuan = {
  SANGAT_BAIK: 'SANGAT_BAIK',
  BAIK: 'BAIK',
  TIDAK_PERNAH: 'TIDAK_PERNAH'
};

exports.Jenjang = exports.$Enums.Jenjang = {
  TIDAK_TAMAT_SD: 'TIDAK_TAMAT_SD',
  SD: 'SD',
  SMP: 'SMP',
  SMA: 'SMA',
  D3: 'D3',
  S1: 'S1',
  S2: 'S2',
  S3: 'S3'
};

exports.StatusPerkawinan = exports.$Enums.StatusPerkawinan = {
  Lajang: 'Lajang',
  Menikah: 'Menikah',
  Cerai: 'Cerai'
};

exports.StatusKeikutsertaan = exports.$Enums.StatusKeikutsertaan = {
  Peserta: 'Peserta',
  Panitia: 'Panitia',
  Pembicara: 'Pembicara'
};

exports.KeteranganMataKuliah = exports.$Enums.KeteranganMataKuliah = {
  Transfer_SKS: 'Transfer_SKS',
  Perolehan_SKS: 'Perolehan_SKS'
};

exports.StatusMataKuliahMahasiswa = exports.$Enums.StatusMataKuliahMahasiswa = {
  DRAFT: 'DRAFT',
  EVALUASI_MANDIRI: 'EVALUASI_MANDIRI',
  DALAM_ASESSMEN: 'DALAM_ASESSMEN',
  DISANGGAH: 'DISANGGAH',
  PERLU_DIREVISI: 'PERLU_DIREVISI',
  SELESAI: 'SELESAI'
};

exports.JenisOrtu = exports.$Enums.JenisOrtu = {
  AYAH: 'AYAH',
  IBU: 'IBU',
  KAKEK: 'KAKEK',
  NENEK: 'NENEK'
};

exports.StatusPekerjaan = exports.$Enums.StatusPekerjaan = {
  PegawaiTetap: 'PegawaiTetap',
  PegawaiHonorer: 'PegawaiHonorer',
  Pns: 'Pns',
  Lainnya: 'Lainnya'
};

exports.SistemKuliah = exports.$Enums.SistemKuliah = {
  RPL: 'RPL',
  REGULER: 'REGULER'
};

exports.JenisKelamin = exports.$Enums.JenisKelamin = {
  PRIA: 'PRIA',
  WANITA: 'WANITA'
};

exports.Prisma.ModelName = {
  Alamat: 'Alamat',
  Asesor: 'Asesor',
  AsesorAkademik: 'AsesorAkademik',
  AsesorAkademikKeanggotaanAsosiasi: 'AsesorAkademikKeanggotaanAsosiasi',
  AsesorPraktisi: 'AsesorPraktisi',
  AssesorMahasiswa: 'AssesorMahasiswa',
  BuktiForm: 'BuktiForm',
  BuktiFormEvaluasiDiri: 'BuktiFormEvaluasiDiri',
  CapaianPembelajaran: 'CapaianPembelajaran',
  Country: 'Country',
  DaftarUlang: 'DaftarUlang',
  Desa: 'Desa',
  EvaluasiDiri: 'EvaluasiDiri',
  HasilAssesmen: 'HasilAssesmen',
  InformasiKependudukan: 'InformasiKependudukan',
  InstitusiLama: 'InstitusiLama',
  JenisDokumen: 'JenisDokumen',
  Kabupaten: 'Kabupaten',
  Kecamatan: 'Kecamatan',
  Mahasiswa: 'Mahasiswa',
  MahasiswaKonferensi: 'MahasiswaKonferensi',
  MahasiswaOrganisasiProfesi: 'MahasiswaOrganisasiProfesi',
  MahasiswaPelatihanProfessional: 'MahasiswaPelatihanProfessional',
  MahasiswaPendidikan: 'MahasiswaPendidikan',
  MahasiswaPiagam: 'MahasiswaPiagam',
  MahasiswaRiwayatPekerjaan: 'MahasiswaRiwayatPekerjaan',
  MataKuliah: 'MataKuliah',
  MataKuliahMahasiswa: 'MataKuliahMahasiswa',
  UserHasPermissions: 'UserHasPermissions',
  UserHasRoles: 'UserHasRoles',
  OrangTua: 'OrangTua',
  PasswordResetTokens: 'PasswordResetTokens',
  PekerjaanMahasiswa: 'PekerjaanMahasiswa',
  Pendaftaran: 'Pendaftaran',
  Permission: 'Permission',
  Pesantren: 'Pesantren',
  ProgramStudi: 'ProgramStudi',
  Provinsi: 'Provinsi',
  RoleHasPermissions: 'RoleHasPermissions',
  Role: 'Role',
  SanggahanAssesmen: 'SanggahanAssesmen',
  SanggahanAssesmenMk: 'SanggahanAssesmenMk',
  SanggahanAssesmenPihak: 'SanggahanAssesmenPihak',
  SkRektor: 'SkRektor',
  SkRektorAssesor: 'SkRektorAssesor',
  SkRektorMahasiswa: 'SkRektorMahasiswa',
  SkorAssesmen: 'SkorAssesmen',
  StatusMahasiswaAssesment: 'StatusMahasiswaAssesment',
  StatusMahasiswaAssesmentHistory: 'StatusMahasiswaAssesmentHistory',
  TipeAsesor: 'TipeAsesor',
  University: 'University',
  UniversitySosialMedia: 'UniversitySosialMedia',
  UniversityInformasi: 'UniversityInformasi',
  UniversityJabatan: 'UniversityJabatan',
  UniversityJabatanOrang: 'UniversityJabatanOrang',
  User: 'User',
  Userlogin: 'Userlogin'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)

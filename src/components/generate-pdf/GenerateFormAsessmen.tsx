import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { GenerateFormAsessmenType } from '@/types/GeneratePdfTypes';
import { ProfiensiPengetahuan } from '@/generated/prisma';
import path from 'path';
import { Check } from 'lucide-react';

const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const formatDate = (date: Date | null): string => {
    if (!date) return '..............';
    const d = new Date(date);
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const formatMonthYear = (date: Date): string => {
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

const logoPath = path.join(process.cwd(), 'public', 'images', 'logo.png');
const HEADER_TITLE_HEIGHT = 28;
const HEADER_SUB_HEIGHT = 17;
const HEADER_NUM_HEIGHT = 11;
const HEADER_MERGED_HEIGHT = HEADER_TITLE_HEIGHT + HEADER_SUB_HEIGHT;

const safeText = (value: unknown, fallback = ''): string => {
    if (value === null || value === undefined) return fallback;
    const text = String(value).trim();
    return text || fallback;
};

const formatNilai = (value: number | null): string => {
    if (value === null) return '-';
    return Number.isInteger(value) ? String(value) : value.toFixed(2);
};

const styles = StyleSheet.create({
    page: {
        // Margin standar dokumen: kiri 4cm, atas 4cm, kanan 3cm, bawah 3cm.
        paddingLeft: '2cm',
        paddingTop: '2cm',
        paddingRight: '2cm',
        paddingBottom: '2cm',
        backgroundColor: '#ffffff',
        fontFamily: 'Times-Roman',
        fontSize: 9,
    },
    // Cover
    coverFormNumber: {
        textAlign: 'right',
        fontFamily: 'Helvetica-Bold',
        fontSize: 11,
        marginBottom: 60,
    },
    coverInstitution: {
        textAlign: 'center',
        fontFamily: 'Helvetica-Bold',
        fontSize: 16,
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    coverProdi: {
        textAlign: 'center',
        fontFamily: 'Helvetica-Bold',
        fontSize: 12,
        marginBottom: 160,
    },
    coverLogoWrap: {
        alignItems: 'center',
        marginBottom: 160,
    },
    coverLogo: {
        width: 120,
        height: 120,
    },
    coverTitle: {
        textAlign: 'center',
        fontFamily: 'Helvetica-Bold',
        fontSize: 13,
        marginBottom: 32,
    },
    coverPlace: {
        textAlign: 'center',
        fontFamily: 'Helvetica-Bold',
        fontSize: 11,
    },
    // Identity page
    identityTitle: {
        textAlign: 'center',
        fontFamily: 'Helvetica-Bold',
        fontSize: 12,
        marginBottom: 16,
    },
    identityRow: {
        flexDirection: 'row',
        marginBottom: 3,
    },
    identityLabel: {
        width: '35%',
        fontWeight: 'bold',
        fontSize: 12,
    },
    identitySep: { width: '3%', fontSize: 12 },
    identityValue: { width: '65%', fontSize: 12 },
    paragraph: {
        fontSize: 12,
        marginTop: 10,
        textAlign: 'justify',
        lineHeight: 1.4,
    },
    closingNoteBlock: {
        marginTop: 10,
    },
    closingNoteText: {
        fontSize: 12,
        textAlign: 'justify',
        lineHeight: 1.4,
        marginBottom: 2,
    },
    // Mata kuliah section
    mkHeader: {
        fontSize: 12,
        marginBottom: 3,
    },
    mkDesc: {
        fontSize: 9,
        textAlign: 'justify',
        marginBottom: 6,
        lineHeight: 1.3,
    },
    // Table
    table: { width: '100%' },
    rowHeader: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderColor: '#000000',
        backgroundColor: '#fdf6d8',
    },
    rowSub: {
        flexDirection: 'row',
        borderLeftWidth: 1,
        borderColor: '#000000',
        backgroundColor: '#fdf6d8',
    },
    row: {
        flexDirection: 'row',
        borderLeftWidth: 1,
        borderColor: '#000000',
    },
    headerCell: {
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#000000',
        padding: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cell: {
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#000000',
        padding: 2,
        justifyContent: 'center',
    },
    cellCenter: {
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#000000',
        padding: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        fontSize: 7,
        fontFamily: 'Helvetica-Bold',
        textAlign: 'center',
    },
    cellText: { fontSize: 7, fontFamily: 'Helvetica' },
    cellTextCenter: { fontSize: 7, fontFamily: 'Helvetica', textAlign: 'center' },
    // Header tabel 3 baris (emulasi rowspan/colspan)
    tableHead: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderColor: '#000000',
        backgroundColor: '#fdf6d8',
        flexShrink: 0,
    },
    headCol: {
        flexDirection: 'column',
        flexShrink: 0,
    },
    headTitle: {
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#000000',
        padding: 2,
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 0,
        flexShrink: 0,
    },
    headSubRow: {
        flexDirection: 'row',
        flexGrow: 0,
        flexShrink: 0,
    },
    headSubCell: {
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#000000',
        padding: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 0,
        flexShrink: 0,
    },
    headNumRow: {
        flexDirection: 'row',
        flexGrow: 0,
        flexShrink: 0,
    },
    headNumCell: {
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 0,
        flexShrink: 0,
    },
    // Column widths (sum 100%)
    colCapaian: { width: '28%' },
    colProf: { width: '6%' },
    colVatm: { width: '4%' },
    colBuktiNo: { width: '9%' },
    colBuktiJenis: { width: '9%' },
    colAsesmen: { width: '7%' },
    colNilai: { width: '6%' },
    colStatus: { width: '7%' },
    // grouped headers
    colProfGroup: { width: '18%' },
    colVatmGroup: { width: '16%' },
    colBuktiGroup: { width: '18%' },
    keterangan: {
        fontSize: 8,
        marginTop: 4,
    },
    // signature
    signRight: {
        marginTop: 14,
        alignItems: 'flex-end',
    },
    signText: { fontSize: 10 },
    signName: { fontSize: 10, marginTop: 54 },
    komentarBox: {
        borderWidth: 1,
        borderColor: '#000000',
        padding: 8,
        marginTop: 14,
        minHeight: 60,
    },
    komentarLabel: { fontSize: 10, fontFamily: 'Helvetica-Bold', marginBottom: 6 },
    komentarText: { fontSize: 10 },
    validasiWrap: { marginTop: 12 },
    validasiDate: { fontSize: 10 },
    validasiRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    validasiBlock: { width: '45%' },
    validasiTitle: { fontSize: 9, marginBottom: 44 },
    validasiName: { fontSize: 9, fontFamily: 'Helvetica-Bold' },
    // Tabel referensi profisiensi
    profRefTable: {
        width: '100%',
        marginTop: 8,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderColor: '#000000',
    },
    profRefRow: {
        flexDirection: 'row',
    },
    profRefColLabel: {
        width: '30%',
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#000000',
        padding: 6,
        justifyContent: 'center',
    },
    profRefColUraian: {
        width: '70%',
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#000000',
        padding: 6,
    },
    profRefHeaderText: {
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    profRefLabelText: {
        fontSize: 12,
        textAlign: 'center',
    },
    profRefBulletRow: {
        flexDirection: 'row',
        marginBottom: 2,
    },
    profRefBullet: {
        fontSize: 12,
        width: 12,
    },
    profRefUraianText: {
        fontSize: 12,
        flex: 1,
        lineHeight: 1.3,
    },
    // Daftar bukti
    listRow: {
        flexDirection: 'row',
        marginBottom: 2,
    },
    listMarker: {
        fontSize: 12,
        width: 18,
    },
    listText: {
        fontSize: 12,
        flex: 1,
        lineHeight: 1.3,
        textAlign: 'justify',
    },
});

// Daftar bukti yang dapat digunakan (1-15) dan prinsip verifikasi (VATM).
const BUKTI_REF: string[] = [
    'Ijazah dan/atau Transkrip Nilai dari Mata Kuliah yang pernah ditempuh di jenjang Pendidikan Tinggi sebelumnya (khusus untuk transfer sks);',
    'Daftar Riwayat pekerjaan dengan rincian tugas yang dilakukan;',
    'Sertifikat Kompetensi;',
    'sertifikat pengoperasian/lisensi yang sesuai dengan jabatan kerja dimiliki;',
    'Foto pekerjaan yang pernah dilakukan dan deskripsi pekerjaan;',
    'Buku harian;',
    'Lembar tugas/lembar kerja ketika bekerja di perusahaan;',
    'Dokumen analisis/perancangan (parsial atau lengkap) ketika bekerja di perusahaan;',
    'Logbook;',
    'Catatan pelatihan di lokasi tempat kerja;',
    'Keanggotaan asosiasi profesi yang relevan;',
    'Referensi / surat keterangan/ laporan verifikasi pihak ketiga dari pemberi kerja / supervisor;',
    'Penghargaan dari industri; dan',
    'Penilaian kinerja dari perusahaan',
    'Dokumen lain yang relevan',
];

const PRINSIP_BUKTI_REF: string[] = [
    'Valid/Sahih: ada hubungan yang jelas antara persyaratan bukti dari unit kompetensi/mata kuliah yang akan dinilai dengan bukti yang menjadi dasar penilaian;',
    'Autentik/Asli: dapat dibuktikan bahwa buktinya adalah karya calon sendiri.',
    'Terkini: bukti menunjukkan pengetahuan dan keterampilan kandidat saat ini;',
    'Memadai/Cukup: kriteria mengacu kepada kriteria unjuk kerja dan panduan bukti: mendemonstrasikan kompetensi selama periode waktu tertentu; mengacu kepada semua dimensi kompetensi; dan mendemonstrasikan kompetensi dalam konteks yang berbeda;',
];

const term: string[] = [
    'Semua informasi yang saya tuliskan adalah sepenuhnya benar dan saya bertanggung-jawab atas seluruh data dalam formulir ini dan apabila dikemudian hari ternyata informasi yang saya sampaikan tersebut adalah tidak benar, maka saya bersedia menerima sangsi sesuai dengan ketentuan yang berlaku;',
    'Saya memberikan ijin kepada pihak pengelola program RPL, untuk melakukan pemeriksaan kebenaran informasi yang saya berikan dalam formulir evaluasi diri ini kepada seluruh pihak yang terkait dengan data akademik sebelumnya dan kepada perusahaan tempat saya bekerja sebelumnya dan atau saat ini saya bekerja;',
    'Saya bersedia untuk mengikuti asesmen lanjutan untuk membuktikan kompetensi saya, sesuai waktu dan tempat/platform daring yang ditentukan oleh unit RPL.'
]

// Daftar uraian profisiensi sesuai pedoman Form 03.
const PROFISIENSI_REF: { label: string; uraian: string[] }[] = [
    {
        label: 'Sangat baik',
        uraian: [
            'Saya melakukan tugas ini dengan sangat baik, atau',
            'Saya menguasai bahan kajian ini dengan sangat baik, atau',
            'Saya memiliki keterampilan ini, selalu digunakan dalam pekerjaan dengan tepat tanpa ada kesalahan',
        ],
    },
    {
        label: 'Baik',
        uraian: [
            'Saya melakukan tugas ini dengan baik, atau',
            'Saya menguasai bahan kajian ini dengan baik, atau',
            'Saya memiliki keterampilan ini, dan kadang-kadang digunakan dalam pekerjaan',
        ],
    },
    {
        label: 'Tidak pernah',
        uraian: [
            'Saya tidak pernah melakukan tugas ini, atau',
            'Saya tidak menguasai bahan kajian ini, atau',
            'Saya tidak memiliki keterampilan ini',
        ],
    },
];

// Tanda centang pada kolom profisiensi yang dipilih calon.
const profCheck = (current: ProfiensiPengetahuan | null, target: ProfiensiPengetahuan): string =>
    current === target ? '√ v' : '';

// Hasil evaluasi asesor: v jika terpenuhi, x jika tidak / belum dinilai.
const vatm = (dinilai: boolean, flag: boolean): string => (dinilai ? (flag ? 'v' : 'x') : 'x');

export const GenerateFormAsessmen = ({ data }: { data: GenerateFormAsessmenType }) => {
    const now = new Date();
    const mataKuliahList = data.MataKuliah ?? [];

    return (
        <Document>
            {/* ── Halaman Sampul ── */}
            <Page size="A4" style={styles.page} orientation='portrait'>
                <Text style={styles.coverFormNumber}>Form (03)</Text>
                <Text style={styles.coverInstitution}>
                    {safeText(data.Universitas?.Nama, 'INSTITUT TEKNOLOGI INDONESIA')}
                </Text>
                <Text style={styles.coverProdi}>Program Studi {safeText(data.ProgramStudi?.Nama, '-')}</Text>
                <View style={styles.coverLogoWrap}>
                    <Image src={logoPath} style={styles.coverLogo} />
                </View>
                <Text style={styles.coverTitle}>
                    FORMULIR EVALUASI DIRI CALON MAHASISWA{'\n'}REKOGNISI PEMBELAJARAN LAMPAU (RPL)
                </Text>
                <Text style={styles.coverPlace}>
                    Tangerang Selatan{'\n'}{formatMonthYear(now)}
                </Text>
            </Page>

            {/* ── Halaman Identitas ── */}
            <Page size="A4" style={styles.page}>
                <Text style={styles.paragraph}>Formulir Evaluasi Diri (Form 03)</Text>
                <Text style={styles.identityTitle}>FORMULIR EVALUASI DIRI</Text>

                <View style={styles.identityRow}>
                    <Text style={styles.identityLabel}>NAMA PERGURUAN TINGGI</Text>
                    <Text style={styles.identitySep}>:</Text>
                    <Text style={styles.identityValue}>{safeText(data.Universitas?.Nama, '-')}</Text>
                </View>
                <View style={styles.identityRow}>
                    <Text style={styles.identityLabel}>PROGRAM STUDI</Text>
                    <Text style={styles.identitySep}>:</Text>
                    <Text style={styles.identityValue}>{safeText(data.ProgramStudi?.Nama, '-')}</Text>
                </View>
                <View style={styles.identityRow}>
                    <Text style={styles.identityLabel}>Nama Calon</Text>
                    <Text style={styles.identitySep}>:</Text>
                    <Text style={styles.identityValue}>{safeText(data.Nama, '-')}</Text>
                </View>
                <View style={styles.identityRow}>
                    <Text style={styles.identityLabel}>Tempat/Tgl lahir</Text>
                    <Text style={styles.identitySep}>:</Text>
                    <Text style={styles.identityValue}>
                        {safeText(data.TempatLahir, '-')}, {formatDate(data.TanggalLahir)}
                    </Text>
                </View>
                <View style={styles.identityRow}>
                    <Text style={styles.identityLabel}>Alamat</Text>
                    <Text style={styles.identitySep}>:</Text>
                    <Text style={styles.identityValue}>{safeText(data.Alamat, '-')}</Text>
                </View>
                <View style={styles.identityRow}>
                    <Text style={styles.identityLabel}>Nomor Telpon/HP</Text>
                    <Text style={styles.identitySep}>:</Text>
                    <Text style={styles.identityValue}>{safeText(data.NomorHp, '-')}</Text>
                </View>
                <View style={styles.identityRow}>
                    <Text style={styles.identityLabel}>Alamat E Mail</Text>
                    <Text style={styles.identitySep}>:</Text>
                    <Text style={styles.identityValue}>{safeText(data.Email, '-')}</Text>
                </View>

                <Text style={styles.paragraph}>
                    Isilah setiap kriteria unjuk kerja atau capaian pembelajaran pada halaman-halaman
                    berikut sesuai dengan tingkat profesiansi yang saudara miliki. Saudara harus jujur
                    dalam melakukan penilaian ini.
                </Text>

                <Text style={styles.paragraph}>
                    <Text style={{ fontWeight: 'bold' }}>Catatan:</Text> Jika saudara merasa yakin dengan kemampuan yang saudara miliki atas pencapaian profesiensi setiap kriteria unjuk kerja atau capaian pembelajaran yang dideskripsikan pada halaman berikut, dimohon saudara dapat melampirkan bukti yang valid, autentik, terkini, dan memadai untuk mendukung klaim saudara atas pencapaian profesiensi yang baik, dan/atau sangat baik tersebut.
                </Text>

                <Text style={styles.paragraph}>
                    Identifikasi tingkat profesiensi pencapaian saudara dalam kriteria unjuk kerja atau capaian pembelajaran dengan menggunakan jawaban berikut ini:
                </Text>

                <View style={styles.profRefTable}>
                    {/* Header */}
                    <View style={styles.profRefRow} wrap={false}>
                        <View style={styles.profRefColLabel}>
                            <Text style={styles.profRefHeaderText}>Profisiensi/kemampuan</Text>
                        </View>
                        <View style={styles.profRefColUraian}>
                            <Text style={styles.profRefHeaderText}>Uraian</Text>
                        </View>
                    </View>
                    {/* Baris */}
                    {PROFISIENSI_REF.map((item) => (
                        <View key={item.label} style={styles.profRefRow} wrap={false}>
                            <View style={styles.profRefColLabel}>
                                <Text style={styles.profRefLabelText}>{item.label}</Text>
                            </View>
                            <View style={styles.profRefColUraian}>
                                {item.uraian.map((u, i) => (
                                    <View key={i} style={styles.profRefBulletRow}>
                                        <Text style={styles.profRefBullet}>•</Text>
                                        <Text style={styles.profRefUraianText}>{u}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))}
                </View>

                <Text style={styles.paragraph}>
                    Bukti yang dapat digunakan untuk mendukung klaim saudara atas pencapaian
                    profesiensi yang baik dan atau sangat baik tersebut antara lain:
                </Text>
                {BUKTI_REF.map((b, i) => (
                    <View key={i} style={styles.listRow}>
                        <Text style={styles.listMarker}>{i + 1}.</Text>
                        <Text style={styles.listText}>{b}</Text>
                    </View>
                ))}

                <Text style={styles.paragraph}>
                    Bukti (portofolio) untuk mendukung klaim calon atas pernyataan kriteria capaian
                    pembelajaran mata kuliah atau modul pembelajaran yang dilampirkan calon pada saat
                    mengajukan lamaran akan diverifikasi dan divalidasi oleh Asesor sesuai prinsip
                    bukti, yaitu, sahih/valid (V), autentik (A), terkini (T) dan cukup/memadai (M), yaitu:
                </Text>
                {PRINSIP_BUKTI_REF.map((p, i) => (
                    <View key={i} style={styles.listRow}>
                        <Text style={styles.listMarker}>•</Text>
                        <Text style={styles.listText}>{p}</Text>
                    </View>
                ))}
            </Page>

            {/* ── Per Mata Kuliah ── */}
            {mataKuliahList.length === 0 ? (
                <Page size="A4" style={styles.page} orientation='landscape'>
                    <Text style={{ fontSize: 10, marginTop: 20, textAlign: 'center' }}>
                        Belum ada mata kuliah RPL yang diajukan untuk evaluasi diri.
                    </Text>
                </Page>
            ) : (
                mataKuliahList.map((mk, mkIndex) => {
                    const komentar = ''

                    return (
                        <Page
                            key={mk.MataKuliahMahasiswaId || mkIndex}
                            size="A4"
                            style={styles.page}
                            orientation='landscape'
                        >
                            <Text style={styles.mkHeader}>
                                {mkIndex + 1}. Mata Kuliah: {safeText(mk.Kode)}- {safeText(mk.Nama)}
                            </Text>
                            {mk.Deskripsi ? (
                                <Text style={styles.mkDesc}>{mk.Deskripsi}</Text>
                            ) : null}

                            {/* Tabel evaluasi */}
                            <View style={styles.table}>
                                {/* Header tabel — 3 baris (judul, sub-judul, nomor) */}
                                <View style={styles.tableHead} wrap={false}>
                                    {/* Kemampuan Akhir / Sub Capaian (merge baris 1-2) */}
                                    <View style={[styles.headCol, styles.colCapaian]}>
                                        <View style={[styles.headTitle, { height: HEADER_MERGED_HEIGHT }]}>
                                            <Text style={styles.headerText}>Kemampuan Akhir Yang Diharapkan/</Text>
                                            <Text style={styles.headerText}>Sub. Capaian Pembelajaran Mata Kuliah</Text>
                                        </View>
                                        <View style={[styles.headNumRow, { height: HEADER_NUM_HEIGHT }]}>
                                            <View style={[styles.headNumCell, { width: '100%' }]}><Text style={styles.headerText}>1</Text></View>
                                        </View>
                                    </View>

                                    {/* Profiesiensi (3 sub-kolom) */}
                                    <View style={[styles.headCol, styles.colProfGroup]}>
                                        <View style={[styles.headTitle, { height: HEADER_TITLE_HEIGHT }]}>
                                            <Text style={styles.headerText}>Profiesiensi pengetahuan dan</Text>
                                            <Text style={styles.headerText}>keterampilan saat ini*</Text>
                                        </View>
                                        <View style={[styles.headSubRow, { height: HEADER_SUB_HEIGHT }]}>
                                            <View style={[styles.headSubCell, { width: '33.34%' }]}><Text style={styles.headerText}>Sangat baik</Text></View>
                                            <View style={[styles.headSubCell, { width: '33.33%' }]}><Text style={styles.headerText}>Baik</Text></View>
                                            <View style={[styles.headSubCell, { width: '33.33%' }]}><Text style={styles.headerText}>Tidak pernah</Text></View>
                                        </View>
                                        <View style={[styles.headNumRow, { height: HEADER_NUM_HEIGHT }]}>
                                            <View style={[styles.headNumCell, { width: '100%' }]}><Text style={styles.headerText}>2</Text></View>
                                        </View>
                                    </View>

                                    {/* Hasil evaluasi Asesor (V A T M) */}
                                    <View style={[styles.headCol, styles.colVatmGroup]}>
                                        <View style={[styles.headTitle, { height: HEADER_TITLE_HEIGHT }]}>
                                            <Text style={styles.headerText}>Hasil evaluasi Asesor</Text>
                                            <Text style={styles.headerText}>(diisi oleh Asesor)</Text>
                                        </View>
                                        <View style={[styles.headSubRow, { height: HEADER_SUB_HEIGHT }]}>
                                            <View style={[styles.headSubCell, { width: '25%' }]}><Text style={styles.headerText}>V</Text></View>
                                            <View style={[styles.headSubCell, { width: '25%' }]}><Text style={styles.headerText}>A</Text></View>
                                            <View style={[styles.headSubCell, { width: '25%' }]}><Text style={styles.headerText}>T</Text></View>
                                            <View style={[styles.headSubCell, { width: '25%' }]}><Text style={styles.headerText}>M</Text></View>
                                        </View>
                                        <View style={[styles.headNumRow, { height: HEADER_NUM_HEIGHT }]}>
                                            <View style={[styles.headNumCell, { width: '100%' }]}><Text style={styles.headerText}>3</Text></View>
                                        </View>
                                    </View>

                                    {/* Bukti yang disampaikan (Nomor / Jenis) */}
                                    <View style={[styles.headCol, styles.colBuktiGroup]}>
                                        <View style={[styles.headTitle, { height: HEADER_TITLE_HEIGHT }]}>
                                            <Text style={styles.headerText}>Bukti yang disampaikan*</Text>
                                        </View>
                                        <View style={[styles.headSubRow, { height: HEADER_SUB_HEIGHT }]}>
                                            <View style={[styles.headSubCell, { width: '50%' }]}><Text style={styles.headerText}>Nomor Dokumen</Text></View>
                                            <View style={[styles.headSubCell, { width: '50%' }]}><Text style={styles.headerText}>Jenis dokumen</Text></View>
                                        </View>
                                        <View style={[styles.headNumRow, { height: HEADER_NUM_HEIGHT }]}>
                                            <View style={[styles.headNumCell, { width: '50%' }]}><Text style={styles.headerText}>4</Text></View>
                                            <View style={[styles.headNumCell, { width: '50%' }]}><Text style={styles.headerText}>5</Text></View>
                                        </View>
                                    </View>

                                    {/* Asesmen Lanjut (merge baris 1-2) */}
                                    <View style={[styles.headCol, styles.colAsesmen]}>
                                        <View style={[styles.headTitle, { height: HEADER_MERGED_HEIGHT }]}>
                                            <Text style={styles.headerText}>Asesmen Lanjut</Text>
                                        </View>
                                        <View style={[styles.headNumRow, { height: HEADER_NUM_HEIGHT }]}>
                                            <View style={[styles.headNumCell, { width: '100%' }]}><Text style={styles.headerText}>6</Text></View>
                                        </View>
                                    </View>

                                    {/* Nilai (merge baris 1-2) */}
                                    <View style={[styles.headCol, styles.colNilai]}>
                                        <View style={[styles.headTitle, { height: HEADER_MERGED_HEIGHT }]}>
                                            <Text style={styles.headerText}>Nilai (Angka)</Text>
                                        </View>
                                        <View style={[styles.headNumRow, { height: HEADER_NUM_HEIGHT }]}>
                                            <View style={[styles.headNumCell, { width: '100%' }]}><Text style={styles.headerText}>7</Text></View>
                                        </View>
                                    </View>

                                    {/* Diakui / Tidak diakui (merge baris 1-2) */}
                                    <View style={[styles.headCol, styles.colStatus]}>
                                        <View style={[styles.headTitle, { height: HEADER_MERGED_HEIGHT }]}>
                                            <Text style={styles.headerText}>Diakui/ Tidak diakui</Text>
                                        </View>
                                        <View style={[styles.headNumRow, { height: HEADER_NUM_HEIGHT }]}>
                                            <View style={[styles.headNumCell, { width: '100%' }]}><Text style={styles.headerText}>8</Text></View>
                                        </View>
                                    </View>
                                </View>

                                {/* Baris capaian */}
                                {mk.CapaianPembelajaran.length === 0 ? (
                                    <View style={styles.row} wrap={false}>
                                        <View style={[styles.cell, { width: '100%' }]}>
                                            <Text style={styles.cellTextCenter}>
                                                Belum ada capaian pembelajaran yang terdaftar.
                                            </Text>
                                        </View>
                                    </View>
                                ) : (
                                    mk.CapaianPembelajaran.map((cp, cpIndex) => {
                                        const nomorDok = cp.Bukti.map(b => b.NomorDokumen).filter(Boolean).join(', ');
                                        const jenisDok = cp.Bukti.map(b => b.Jenis).filter(Boolean).join(', ');
                                        const nilaiCol = mk.Diakui ? safeText(mk.NilaiHuruf, '-') : '----';
                                        return (
                                            <View key={cp.CapaianPembelajaranId} style={styles.row} wrap={false}>
                                                <View style={[styles.cell, styles.colCapaian]}>
                                                    <Text style={styles.cellText}>{cpIndex + 1}. {safeText(cp.Nama)}</Text>
                                                </View>
                                                <View style={[styles.cellCenter, styles.colProf]}>
                                                    <Text style={styles.cellTextCenter}>{profCheck(cp.Profiensi, ProfiensiPengetahuan.SANGAT_BAIK)}</Text>
                                                </View>
                                                <View style={[styles.cellCenter, styles.colProf]}>
                                                    <Text style={styles.cellTextCenter}>{profCheck(cp.Profiensi, ProfiensiPengetahuan.BAIK)}</Text>
                                                </View>
                                                <View style={[styles.cellCenter, styles.colProf]}>
                                                    <Text style={styles.cellTextCenter}>{profCheck(cp.Profiensi, ProfiensiPengetahuan.TIDAK_PERNAH)}</Text>
                                                </View>
                                                <View style={[styles.cellCenter, styles.colVatm]}>
                                                    <Text style={styles.cellTextCenter}>{data.Asesor.length === 0 ? '' : vatm(cp.Dinilai, cp.Valid)}</Text>
                                                </View>
                                                <View style={[styles.cellCenter, styles.colVatm]}>
                                                    <Text style={styles.cellTextCenter}>{data.Asesor.length === 0 ? '' : vatm(cp.Dinilai, cp.Autentik)}</Text>
                                                </View>
                                                <View style={[styles.cellCenter, styles.colVatm]}>
                                                    <Text style={styles.cellTextCenter}>{data.Asesor.length === 0 ? '' : vatm(cp.Dinilai, cp.Terkini)}</Text>
                                                </View>
                                                <View style={[styles.cellCenter, styles.colVatm]}>
                                                    <Text style={styles.cellTextCenter}>{data.Asesor.length === 0 ? '' : vatm(cp.Dinilai, cp.Memadai)}</Text>
                                                </View>
                                                <View style={[styles.cellCenter, styles.colBuktiNo]}>
                                                    <Text style={styles.cellTextCenter}>{nomorDok || (mk.Diakui ? '-' : '----')}</Text>
                                                </View>
                                                <View style={[styles.cell, styles.colBuktiJenis]}>
                                                    <Text style={styles.cellTextCenter}>{jenisDok || (mk.Diakui ? '-' : '----')}</Text>
                                                </View>
                                                <View style={[styles.cellCenter, styles.colAsesmen]}>
                                                    <Text style={styles.cellTextCenter}></Text>
                                                </View>
                                                <View style={[styles.cellCenter, styles.colNilai]}>
                                                    <Text style={styles.cellTextCenter}>
                                                        {data.Asesor.length === 0 ? '' : cp.Nilai !== null ? formatNilai(cp.Nilai) : nilaiCol}
                                                    </Text>
                                                </View>
                                                <View style={[styles.cellCenter, styles.colStatus]}>
                                                    <Text style={styles.cellTextCenter}>{data.Asesor.length === 0 ? '' : mk.Diakui ? 'Diakui' : 'Tidak diakui'}</Text>
                                                </View>
                                            </View>
                                        );
                                    })
                                )}
                            </View>

                            <Text style={styles.keterangan}>
                                Keterangan: tanda * diisi oleh calon peserta RPL
                            </Text>

                            {/* Tanda tangan calon */}
                            <View style={styles.signRight}>
                                <Text style={styles.signText}>Tangerang Selatan, {formatDate(now)}</Text>
                                <Text style={styles.signText}>Tanda Tangan Calon Mahasiswa</Text>
                                <Text style={styles.signName}>({safeText(data.Nama, '.................................')})</Text>
                            </View>

                            {/* Komentar penilai */}
                            <View style={styles.komentarBox}>
                                <Text style={styles.komentarLabel}>Komentar Penilai:</Text>
                                <Text style={styles.komentarText}>{komentar}</Text>
                            </View>

                            {/* Validasi penilai */}
                            <View style={styles.validasiWrap}>
                                <Text style={styles.validasiDate}>
                                    Tanggal Pengesahan : {formatDate(mk.TanggalPengesahan)}
                                </Text>
                                <Text style={styles.validasiDate}>Validasi oleh :</Text>
                                <View style={styles.validasiRow}>
                                    <View style={styles.validasiBlock}>
                                        <Text style={styles.validasiTitle}>Penilai 1</Text>
                                        <Text style={styles.validasiName}>
                                            {safeText((data.Asesor ?? []).find(a => a.Urutan === 1)?.Nama, '.................................')}
                                        </Text>
                                    </View>
                                    <View style={styles.validasiBlock}>
                                        <Text style={styles.validasiTitle}>Penilai 2</Text>
                                        <Text style={styles.validasiName}>
                                            {safeText((data.Asesor ?? []).find(a => a.Urutan === 2)?.Nama, '.................................')}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </Page>
                    );
                })
            )}
            <Page size="A4" style={styles.page} orientation='portrait'>
                <View style={styles.closingNoteBlock}>
                    <Text style={styles.closingNoteText}>Keterangan:</Text>
                    <Text style={styles.closingNoteText}>
                        Kolom 1: Diisi oleh Program Studi, berupa Pernyataan Kemampuan Akhir
                        yang Diharapkan/Capaian Pembelajaran Mata Kuliah.
                    </Text>
                    <Text style={styles.closingNoteText}>
                        Kolom 2: Diisi oleh Calon mahasiswa/pelamar RPL sesuai dengan tingkat profesiensi yang
                        dikuasainya atas pernyataan yang diuraikan di kolom 1.
                    </Text>
                    <Text style={styles.closingNoteText}>
                        Kolom 3: Diisi oleh Asesor setelah calon mengisi kolom 2 dan melampirkan BUKTI
                        (Portofolio) yang disebutkan pada kolom 5 dan disusun nomor urutnya sesuai yang
                        dinyatakan pada kolom 4.
                    </Text>
                    <Text style={styles.closingNoteText}>
                        Kolom 4: Nomor urut BUKTI Portofolio sebagaimana jenis BUKTI yang diuraikan pada
                        kolom 4.
                    </Text>
                    <Text style={styles.closingNoteText}>
                        Kolom 5: Jenis BUKTI portofolio. Bukti ini dapat digunakan secara berulang untuk
                        mendukung klaim beberapa pernyataan yang diuraikan pada kolom 1.
                    </Text>
                    <Text style={[styles.closingNoteText, { marginTop: 30 }]}>
                        Saya telah membaca dan mengisi Formulir Evaluasi Diri ini untuk mengikuti asesmen
                        RPL dan dengan ini saya menyatakan:
                    </Text>
                    {term.map((item, index) => (
                        <Text key={index} style={styles.closingNoteText}>
                            {index + 1}. {item}
                        </Text>
                    ))}
                </View>
                {/* Tanda tangan calon */}
                <View style={styles.signRight}>
                    <Text style={styles.signText}>Tangerang Selatan, {formatDate(now)}</Text>
                    <Text style={styles.signText}>Tanda Tangan Calon Mahasiswa</Text>
                    <Text style={styles.signName}>({safeText(data.Nama, '.................................')})</Text>
                </View>
            </Page>
        </Document >
    );
};

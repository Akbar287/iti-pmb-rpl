import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { GenerateSkType } from '@/types/GeneratePdfTypes';
import path from 'path';
import { FormAssessmentPortraitTemplate } from '@/types/FormAssessmentTemplate';
import { getSkHasilPlaceholderValues } from '@/lib/sk-hasil-template';
import { RekapitulasiTemplateBlocks } from './RekapitulasiTemplateContent';

// Helper function to format date
const formatDate = (date: Date): string => {
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const d = new Date(date);
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const safeText = (value: unknown, fallback = ''): string => {
    if (value === null || value === undefined) return fallback;
    const text = String(value).trim();
    return text || fallback;
};

// Helper function to format periode (e.g., '2024/2025 Genap' -> 'Genap 2024/2025')
const formatPeriode = (periode: string): string => {
    const parts = periode.trim().split(' ');
    if (parts.length >= 2) {
        const tahun = parts[0];
        const semester = parts.slice(1).join(' ');
        return `${semester} ${tahun}`;
    }
    return periode;
};

// Order of social media to display
const socialMediaOrder = ['Website', 'Instagram', 'X', 'Facebook'];

// Get icon symbol based on social media name
const getSocialIcon = (name: string): string => {
    switch (name.toLowerCase()) {
        case 'website': return '⊕';
        case 'instagram': return '◉';
        case 'x':
        case 'twitter': return '✕';
        case 'facebook': return 'f';
        case 'youtube': return '▶';
        default: return '•';
    }
};

// Get icon color based on social media name
const getSocialColor = (name: string): string => {
    switch (name.toLowerCase()) {
        case 'website': return '#0066cc';
        case 'instagram': return '#E1306C';
        case 'x':
        case 'twitter': return '#000000';
        case 'facebook': return '#1877F2';
        case 'youtube': return '#FF0000';
        default: return '#333333';
    }
};

// Logo path
const logoPath = path.join(process.cwd(), 'public', 'images', 'logo.png');

// Styles
const styles = StyleSheet.create({
    page: {
        padding: 25,
        backgroundColor: '#ffffff',
        fontFamily: 'Times-Roman',
        fontSize: 9,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 8,
        borderBottomWidth: 3,
        borderBottomColor: '#000000',
        marginBottom: 5,
    },
    logoContainer: {
        width: '15%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoImage: {
        width: 60,
        height: 60,
    },
    headerTextContainer: {
        width: '85%',
        alignItems: 'center',
    },
    institutionName: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 22,
        textTransform: 'uppercase',
        marginBottom: 3,
        letterSpacing: 1,
    },
    addressText: {
        fontFamily: 'Helvetica',
        fontSize: 11,
        marginBottom: 1,
    },
    phoneText: {
        fontFamily: 'Helvetica',
        fontSize: 11,
        marginBottom: 3,
    },
    socialRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    socialItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    socialIcon: {
        fontSize: 9,
        marginRight: 2,
    },
    socialText: {
        fontSize: 9,
        fontFamily: 'Helvetica',
    },
    formNumber: {
        textAlign: 'right',
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        marginTop: 5,
        marginBottom: 5,
    },
    titleContainer: {
        marginVertical: 10,
        alignItems: 'center',
    },
    title: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 12,
        textDecoration: 'underline',
        textAlign: 'center',
    },
    infoContainer: {
        flexDirection: 'row',
        marginBottom: 15,
        marginTop: 10,
    },
    infoColumn: {
        width: '50%',
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 3,
    },
    infoLabel: {
        width: '45%',
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
    },
    infoSeparator: {
        width: '5%',
        fontSize: 9,
    },
    infoValue: {
        width: '50%',
        fontSize: 9,
        fontFamily: 'Helvetica',
    },

    // Table styles
    tableContainer: {
        marginTop: 10,
    },
    table: {
        width: '100%',
    },
    tableMainHeader: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#000000',
        backgroundColor: '#f5f5f5',
    },
    tableSubHeader: {
        flexDirection: 'row',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#000000',
        backgroundColor: '#f5f5f5',
    },
    tableRow: {
        flexDirection: 'row',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#000000',
        minHeight: 18,
    },

    // Column widths - total 100%
    col1: { width: '28%' },
    col2: { width: '24%' },
    col3: { width: '24%' },
    col4: { width: '24%' },

    // Sub columns for Col1 (28% = 8 + 15 + 5)
    col1Kode: { width: '8%' },
    col1Nama: { width: '15%' },
    col1Sks: { width: '5%' },

    // Sub columns for Col2 (24% = 14 + 5 + 5)
    col2Nama: { width: '14%' },
    col2Sks: { width: '5%' },
    col2Nilai: { width: '5%' },

    // Sub columns for Col3 (24% = 14 + 5 + 5)
    col3Nama: { width: '14%' },
    col3Sks: { width: '5%' },
    col3Nilai: { width: '5%' },

    // Sub columns for Col4 (24% = 19 + 5)
    col4Nama: { width: '19%' },
    col4Sks: { width: '5%' },

    headerCell: {
        borderRightWidth: 1,
        borderRightColor: '#000000',
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerCellLast: {
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 7,
        fontFamily: 'Helvetica-Bold',
        textAlign: 'center',
    },
    subHeaderText: {
        fontSize: 6,
        fontFamily: 'Helvetica-Bold',
        textAlign: 'center',
    },
    cell: {
        borderRightWidth: 1,
        borderRightColor: '#000000',
        padding: 3,
        justifyContent: 'center',
    },
    cellLast: {
        padding: 3,
        justifyContent: 'center',
    },
    cellText: {
        fontSize: 7,
        fontFamily: 'Helvetica',
    },
    cellTextCenter: {
        fontSize: 7,
        fontFamily: 'Helvetica',
        textAlign: 'center',
    },
});

// Portrait Page Styles for Keputusan Rektor
const portraitStyles = StyleSheet.create({
    page: {
        padding: 50,
        paddingTop: 40,
        paddingBottom: 40,
        backgroundColor: '#ffffff',
        fontFamily: 'Times-Roman',
        fontSize: 11,
    },
    header: {
        textAlign: 'center',
        marginBottom: 5,
    },
    headerBold: {
        fontFamily: 'Times-Bold',
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 2,
    },
    headerNormal: {
        fontFamily: 'Times-Roman',
        fontSize: 11,
        textAlign: 'center',
        marginBottom: 2,
    },
    headerRed: {
        fontFamily: 'Times-Roman',
        fontSize: 11,
        textAlign: 'center',
        color: 'black',
        marginBottom: 2,
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        marginTop: 10,
        marginBottom: 10,
    },
    sectionTitle: {
        fontFamily: 'Times-Bold',
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 15,
    },
    sectionLabel: {
        fontFamily: 'Times-Bold',
        fontSize: 11,
        marginBottom: 5,
    },
    listItem: {
        flexDirection: 'row',
        marginBottom: 4,
        paddingLeft: 10,
    },
    listNumber: {
        width: 20,
        fontFamily: 'Times-Roman',
        fontSize: 11,
    },
    listContent: {
        flex: 1,
        fontFamily: 'Times-Roman',
        fontSize: 11,
        textAlign: 'justify',
    },
    redText: {
        color: 'black',
    },
    signatureSection: {
        marginTop: 30,
        alignItems: 'flex-end',
        paddingRight: 20,
    },
    signatureText: {
        fontFamily: 'Times-Roman',
        fontSize: 11,
        textAlign: 'right',
    },
    signatureName: {
        fontFamily: 'Times-Roman',
        fontSize: 11,
        textAlign: 'center',
        marginTop: 60,
    },
    tembusanSection: {
        marginTop: 30,
    },
    tembusanTitle: {
        fontFamily: 'Times-Roman',
        fontSize: 11,
        textDecoration: 'underline',
        marginBottom: 5,
    },
    tembusanItem: {
        fontFamily: 'Times-Roman',
        fontSize: 11,
        marginBottom: 2,
    },
});

// Table Row Data Interface
interface TableRowData {
    col1: { kode: string; nama: string; sks: number };
    col2: { nama: string; sks: number; nilai: string } | null;
    col3: { nama: string; sks: number; nilai: string } | null;
    col4: { nama: string; sks: number } | null;
}

// Komponen Document
export const GenerateSkPdf = ({
    data,
    NomorSk,
    JenisSk,
    portraitTemplate,
}: {
    data: GenerateSkType
    NomorSk: string
    JenisSk: string
    portraitTemplate: FormAssessmentPortraitTemplate
}) => {
    // Sort social media
    const sortedSocialMedia = data.Universitas.UniversitySocialMedia
        .filter(sm => socialMediaOrder.includes(sm.Nama))
        .sort((a, b) => socialMediaOrder.indexOf(a.Nama) - socialMediaOrder.indexOf(b.Nama));
    const templatePlaceholders = getSkHasilPlaceholderValues(
        data,
        NomorSk,
        JenisSk
    );

    // Process table data - Column 1 as reference
    const tableRows: TableRowData[] = data.MataKuliah.map(mk => {
        // Find matching MataKuliahMahasiswa by MataKuliah.Kode or MataKuliahId
        const matchingMkm = data.MataKuliahMahasiswa.find(
            mkm => mkm.MataKuliah.Kode === mk.MataKuliahId || mkm.MataKuliah.Nama === mk.Nama
        );

        let col2Data = null;
        let col3Data = null;
        let col4Data = null;

        if (matchingMkm) {
            // Check Keterangan to determine which column
            if (matchingMkm.Keterangan === 'Transfer_SKS') {
                col2Data = {
                    nama: matchingMkm.MataKuliah.Nama,
                    // SKS mengacu ke kolom (03) / master mata kuliah, bukan SKS
                    // hasil transkrip yang bisa kosong atau salah.
                    sks: mk.Sks,
                    nilai: matchingMkm.TranskripNilai.NilaiAsessmen,
                };
            } else if (matchingMkm.Keterangan === 'Perolehan_SKS') {
                col3Data = {
                    nama: matchingMkm.MataKuliah.Nama,
                    sks: matchingMkm.MataKuliah.Sks,
                    nilai: matchingMkm.SkorAsessmen.NilaiHuruf || '',
                };
            }
        } else {
            // Not in MataKuliahMahasiswa -> show in Column 4
            col4Data = {
                nama: mk.Nama,
                sks: mk.Sks,
            };
        }

        return {
            col1: {
                kode: mk.Kode,
                nama: mk.Nama,
                sks: mk.Sks,
            },
            col2: col2Data,
            col3: col3Data,
            col4: col4Data,
        };
    });

    // Table Header Component
    const TableHeader = () => (
        <>
            {/* Main Header Row */}
            <View style={styles.tableMainHeader} wrap={false}>
                <View style={[styles.headerCell, styles.col1]}>
                    <Text style={styles.headerText}>MATA KULIAH KURIKULUM DI PT TUJUAN (ITI)</Text>
                </View>
                <View style={[styles.headerCell, styles.col2]}>
                    <Text style={styles.headerText}>MATA KULIAH DI PERGURUAN TINGGI TUJUAN</Text>
                    <Text style={styles.headerText}>YANG DIAKUI BERDASARKAN TRANSKRIP</Text>
                    <Text style={styles.headerText}>(PENDIDIKAN FORMAL)</Text>
                </View>
                <View style={[styles.headerCell, styles.col3]}>
                    <Text style={styles.headerText}>MATA KULIAH DI PERGURUAN TINGGI</Text>
                    <Text style={styles.headerText}>TUJUAN YANG DIAKUI BERDASARKAN</Text>
                    <Text style={styles.headerText}>PENDIDIKAN NONFORMAL, INFORMAL</Text>
                    <Text style={styles.headerText}>DAN / ATAU PENGALAMAN KERJA</Text>
                </View>
                <View style={[styles.headerCellLast, styles.col4]}>
                    <Text style={styles.headerText}>MATA KULIAH YANG MASIH HARUS</Text>
                    <Text style={styles.headerText}>DITEMPUH BERDASARKAN KURIKULUM DI</Text>
                    <Text style={styles.headerText}>PT TUJUAN (ITI)</Text>
                </View>
            </View>

            {/* Sub Header Row */}
            <View style={styles.tableSubHeader} wrap={false}>
                <View style={[styles.headerCell, styles.col1Kode]}>
                    <Text style={styles.subHeaderText}>KODE MK</Text>
                    <Text style={styles.subHeaderText}>(01)</Text>
                </View>
                <View style={[styles.headerCell, styles.col1Nama]}>
                    <Text style={styles.subHeaderText}>NAMA MK</Text>
                    <Text style={styles.subHeaderText}>(02)</Text>
                </View>
                <View style={[styles.headerCell, styles.col1Sks]}>
                    <Text style={styles.subHeaderText}>SKS</Text>
                    <Text style={styles.subHeaderText}>(03)</Text>
                </View>
                <View style={[styles.headerCell, styles.col2Nama]}>
                    <Text style={styles.subHeaderText}>NAMA MK</Text>
                    <Text style={styles.subHeaderText}>(04)</Text>
                </View>
                <View style={[styles.headerCell, styles.col2Sks]}>
                    <Text style={styles.subHeaderText}>SKS</Text>
                    <Text style={styles.subHeaderText}>(05)</Text>
                </View>
                <View style={[styles.headerCell, styles.col2Nilai]}>
                    <Text style={styles.subHeaderText}>NILAI</Text>
                    <Text style={styles.subHeaderText}>(06)</Text>
                </View>
                <View style={[styles.headerCell, styles.col3Nama]}>
                    <Text style={styles.subHeaderText}>NAMA MK</Text>
                    <Text style={styles.subHeaderText}>(07)</Text>
                </View>
                <View style={[styles.headerCell, styles.col3Sks]}>
                    <Text style={styles.subHeaderText}>SKS</Text>
                    <Text style={styles.subHeaderText}>(08)</Text>
                </View>
                <View style={[styles.headerCell, styles.col3Nilai]}>
                    <Text style={styles.subHeaderText}>NILAI</Text>
                    <Text style={styles.subHeaderText}>(09)</Text>
                </View>
                <View style={[styles.headerCell, styles.col4Nama]}>
                    <Text style={styles.subHeaderText}>NAMA MK</Text>
                    <Text style={styles.subHeaderText}>(10)</Text>
                </View>
                <View style={[styles.headerCellLast, styles.col4Sks]}>
                    <Text style={styles.subHeaderText}>SKS</Text>
                    <Text style={styles.subHeaderText}>(11)</Text>
                </View>
            </View>
        </>
    );

    return (
        <Document>
            {portraitTemplate.pages
                .filter((page) => page.placement === 'before_landscape')
                .map((page) => (
                    <Page
                        key={page.id}
                        size="A4"
                        orientation="portrait"
                        style={portraitStyles.page}
                    >
                        <RekapitulasiTemplateBlocks
                            blocks={page.blocks}
                            placeholders={templatePlaceholders}
                            logoPath={logoPath}
                        />
                    </Page>
                ))}

            {/* Page 1 - Keputusan Rektor (Portrait) */}
            {false && (
            <Page size="A4" orientation="portrait" style={portraitStyles.page}>
                {/* Header */}
                {/* Header */}
                <View style={styles.headerContainer} fixed>
                    <View style={styles.logoContainer}>
                        <Image src={logoPath} style={styles.logoImage} />
                    </View>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.institutionName}>{safeText(data.Universitas?.Nama, 'INSTITUT TEKNOLOGI INDONESIA')}</Text>
                        <Text style={styles.addressText}>
                            {safeText(data.Universitas?.Alamat, 'Jl. Raya Puspiptek')}, Tangerang Selatan - {safeText(data.Universitas?.KodePos, '15314')}
                        </Text>
                        <Text style={styles.phoneText}>(021) 7562757</Text>
                        <View style={styles.socialRow}>
                            {sortedSocialMedia.map((sm, index) => (
                                <View key={sm.UniversitySocialMediaId || index} style={styles.socialItem}>
                                    <Text style={{ ...styles.socialIcon, color: getSocialColor(safeText(sm.Nama)) }}>
                                        {getSocialIcon(safeText(sm.Nama))}
                                    </Text>
                                    <Text style={styles.socialText}>
                                        {safeText(sm.Nama) === 'X' ? `@${safeText(sm.Username).replace('@', '')}` : safeText(sm.Username)}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
                <View style={portraitStyles.header}>
                    <Text style={portraitStyles.headerBold}>KEPUTUSAN REKTOR</Text>
                    <Text style={portraitStyles.headerBold}>INSTITUT TEKNOLOGI INDONESIA</Text>
                    <Text style={portraitStyles.headerNormal}>Nomor {NomorSk}</Text>
                    <Text style={portraitStyles.headerBold}>Tentang</Text>
                    <Text style={portraitStyles.headerNormal}>PENETAPAN HASIL PENILAIAN PENDIDIKAN AKADEMIK S1</Text>
                    <Text style={portraitStyles.headerNormal}>JALUR REKOGNISI PEMBELAJARAN LAMPAU (RPL) SKEMA <Text style={portraitStyles.redText}>{JenisSk}</Text></Text>
                    <Text style={portraitStyles.headerNormal}>ATAS NAMA <Text style={portraitStyles.redText}>{data.Nama.toUpperCase()}</Text></Text>
                    <Text style={portraitStyles.headerNormal}>PROGRAM STUDI <Text style={portraitStyles.redText}>{data.ProgramStudi.Nama.toUpperCase()}</Text> INSTITUT TEKNOLOGI INDONESIA</Text>
                    <Text style={portraitStyles.headerNormal}>SEMESTER <Text style={portraitStyles.redText}>{formatPeriode(data.Periode).toUpperCase()}</Text></Text>
                </View>

                <View style={portraitStyles.separator} />

                <Text style={portraitStyles.sectionTitle}>REKTOR INSTITUT TEKNOLOGI INDONESIA</Text>

                {/* Menimbang */}
                <Text style={portraitStyles.sectionLabel}>Menimbang :</Text>
                <View style={portraitStyles.listItem}>
                    <Text style={portraitStyles.listNumber}>1.</Text>
                    <Text style={portraitStyles.listContent}>Bahwa untuk memperoleh pengakuan yang layak melalui {JenisSk === 'TRANSFER KREDIT' ? "penyesuaian sub Capaian Pembelajaran Mata Kuliah yang diperoleh dari pendidikan formal sebelumnya" : "capaian pembelajaran yang diperoleh dari pendidikan formal, nonformal, informal dan / atau pengalaman kerja"};</Text>
                </View>
                <View style={portraitStyles.listItem}>
                    <Text style={portraitStyles.listNumber}>2.</Text>
                    <Text style={portraitStyles.listContent}>Bahwa untuk mendorong motivasi dan kepercayaan diri untuk terus belajar sepanjang hayat;</Text>
                </View>
                <View style={portraitStyles.listItem}>
                    <Text style={portraitStyles.listNumber}>3.</Text>
                    <Text style={portraitStyles.listContent}>Bahwa untuk peningkatan keterjangkauan dan keterjaminan akses memperoleh pendidikan tinggi;</Text>
                </View>
                <View style={portraitStyles.listItem}>
                    <Text style={portraitStyles.listNumber}>4.</Text>
                    <Text style={portraitStyles.listContent}>Bahwa berdasarkan hasil {JenisSk === 'TRANSFER KREDIT' ? 'check equivalence dari transkrip akademik pendidikan formal sebelumnya' : 'verifikasi dan validasi oleh penilai atas penilaian mandiri mahasiswa'} dalam rangka penerimaan mahasiswa baru melalui Program Pendidikan Akademik S1 Jalur Rekognisi Pembelajaran Lampau (RPL) Skema <Text style={portraitStyles.redText}>{JenisSk.toLowerCase()}</Text> Program Studi <Text style={portraitStyles.redText}>{data.ProgramStudi.Nama}</Text> Semester <Text style={portraitStyles.redText}>{formatPeriode(data.Periode)}</Text>;</Text>
                </View>
                <View style={portraitStyles.listItem}>
                    <Text style={portraitStyles.listNumber}>5.</Text>
                    <Text style={portraitStyles.listContent}>Bahwa berdasarkan pertimbangan pada butir 1, 2, 3 dan 4 di atas, perlu diterbitkan Keputusan Rektor tentang Penetapan Hasil Penilaian Pendidikan Akademik S1 Jalur Rekognisi Pembelajaran Lampau (RPL) Skema <Text style={portraitStyles.redText}>{JenisSk.toLowerCase()}</Text> Atas Nama <Text style={portraitStyles.redText}>{data.Nama}</Text> Program Studi <Text style={portraitStyles.redText}>{data.ProgramStudi.Nama}</Text> Institut Teknologi Indonesia Semester <Text style={portraitStyles.redText}>{formatPeriode(data.Periode)}</Text>;</Text>
                </View>

                {/* Mengingat */}
                <Text style={[portraitStyles.sectionLabel, { marginTop: 10 }]}>Mengingat :</Text>
                <View style={portraitStyles.listItem}>
                    <Text style={portraitStyles.listNumber}>1.</Text>
                    <Text style={portraitStyles.listContent}>Undang Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional</Text>
                </View>
                <View style={portraitStyles.listItem}>
                    <Text style={portraitStyles.listNumber}>2.</Text>
                    <Text style={portraitStyles.listContent}>Undang Undang Nomor 12 Tahun 2012 tentang Pendidikan Tinggi</Text>
                </View>
                <View style={portraitStyles.listItem}>
                    <Text style={portraitStyles.listNumber}>3.</Text>
                    <Text style={portraitStyles.listContent}>Peraturan Presiden Nomor 8 Tahun 2012 tentang Kerangka Kualifikasi Nasional Indonesia</Text>
                </View>
                <View style={portraitStyles.listItem}>
                    <Text style={portraitStyles.listNumber}>4.</Text>
                    <Text style={portraitStyles.listContent}>Peraturan Menteri Pendidikan Tinggi, Sains dan Teknologi Nomor 39 Tahun 2025 tentang Penjaminan Mutu Pendidikan Tinggi.</Text>
                </View>
                <View style={portraitStyles.listItem}>
                    <Text style={portraitStyles.listNumber}>5.</Text>
                    <Text style={portraitStyles.listContent}>Peraturan Menteri Pendidikan, Kebudayaan, Riset, dan Teknologi Nomor 41 Tahun 2021 tentang Rekognisi Pembelajaran Lampau.</Text>
                </View>
                <View style={portraitStyles.listItem}>
                    <Text style={portraitStyles.listNumber}>6.</Text>
                    <Text style={portraitStyles.listContent}>Keputusan Dirjen Dikti Kementerian Pendidikan Tinggi, Sains dan Teknologi Nomor 112/B/KPT/2025 tentang Petunjuk Teknis Rekognisi Pembelajaran Lampau pada Perguruan Tinggi yang Menyelenggarakan Pendidikan Akademik</Text>
                </View>
                <View style={portraitStyles.listItem}>
                    <Text style={portraitStyles.listNumber}>7.</Text>
                    <Text style={portraitStyles.listContent}>Keputusan Rektor ITI No. 445/Kept-ITI/XII/2022 tentang Penetapan SOP Pelaksanaan Asesmen Jalur RPL Pendidikan Akademik di Lingkungan Institut Teknologi Indonesia</Text>
                </View>
                <View style={portraitStyles.listItem}>
                    <Text style={portraitStyles.listNumber}>8.</Text>
                    <Text style={portraitStyles.listContent}>Keputusan Rektor No. 665/Kept-ITI/XII/2025 tentang Penetapan Penilai Pengakuan Mata Kuliah Pendidikan Akademik Jalur Rekognisi Pembelajaran Lampau (RPL) Institut Teknologi Indonesia</Text>
                </View>
            </Page>
            )}

            {/* Page 2 - Keputusan Rektor Continued (Portrait) */}
            {false && (
            <Page size="A4" orientation="portrait" style={portraitStyles.page}>
                <View style={portraitStyles.listItem}>
                    <Text style={portraitStyles.listNumber}>9.</Text>
                    <Text style={portraitStyles.listContent}>Keputusan Rektor No. 318R/Kept-ITI/VIII/2024 tentang Penetapan Tim Pengelola Rekognisi Pembelajaran Lampau (RPL) Pendidikan Akademik Institut Teknologi Indonesia</Text>
                </View>
                <View style={portraitStyles.listItem}>
                    <Text style={portraitStyles.listNumber}>10.</Text>
                    <Text style={portraitStyles.listContent}>Keputusan Rektor No. 319/Kept-ITI/VIII/2024 tentang Penetapan Pedoman Penyelenggaraan Rekognisi Pembelajaran Lampau (RPL) Tipe A pada Pendidikan Akademik Institut Teknologi Indonesia</Text>
                </View>
                <View style={portraitStyles.listItem}>
                    <Text style={portraitStyles.listNumber}>11.</Text>
                    <Text style={portraitStyles.listContent}>Keputusan Rektor No. 320R/Kept-ITI/VIII/2024 tentang Penetapan Dokumen Penilaian Rekognisi Pembelajaran Lampau (RPL) Pendidikan Akademik pada Program Studi di Lingkungan Institut Teknologi Indonesia</Text>
                </View>
                <View style={portraitStyles.listItem}>
                    <Text style={portraitStyles.listNumber}>12.</Text>
                    <Text style={portraitStyles.listContent}>Surat Keputusan Yayasan Pengembangan Teknologi Indonesia Nomor 8/KEPT-PU/YPTI/III/2025 tentang Pengangkatan Pjs Rektor Institut Teknologi Indonesia</Text>
                </View>

                {/* Memperhatikan */}
                <Text style={[portraitStyles.sectionLabel, { marginTop: 15 }]}>Memperhatikan :</Text>
                <View style={portraitStyles.listItem}>
                    <Text style={portraitStyles.listNumber}>1.</Text>
                    <Text style={portraitStyles.listContent}>Hasil Penilaian oleh Penilai dari Program Studi <Text style={portraitStyles.redText}>{data.ProgramStudi.Nama}</Text> Institut Teknologi Indonesia tanggal {formatDate(new Date())}</Text>
                </View>

                {/* Memutuskan */}
                <Text style={[portraitStyles.sectionTitle, { marginTop: 20 }]}>Memutuskan</Text>

                {/* Menetapkan */}
                <Text style={portraitStyles.sectionLabel}>Menetapkan :</Text>
                <View style={portraitStyles.listItem}>
                    <Text style={portraitStyles.listNumber}>1.</Text>
                    <Text style={portraitStyles.listContent}>Hasil {JenisSk === 'TRANSFER KREDIT' ? "penilaian Pendidikan Akademik S1 Jalur" : "verifikasi dan validasi atas penilaian mandiri"} Rekognisi Pembelajaran Lampau (RPL) skema <Text style={portraitStyles.redText}>{JenisSk.toLowerCase()}</Text> atas nama <Text style={portraitStyles.redText}>{data.Nama}</Text> pada Program Pendidikan Akademik S1 Program Studi <Text style={portraitStyles.redText}>{data.ProgramStudi.Nama}</Text> Institut Teknologi Indonesia</Text>
                </View>
                <View style={portraitStyles.listItem}>
                    <Text style={portraitStyles.listNumber}>2.</Text>
                    <Text style={portraitStyles.listContent}>Hasil penilaian terlampir bersama dengan Keputusan Rektor ini.</Text>
                </View>
                <View style={portraitStyles.listItem}>
                    <Text style={portraitStyles.listNumber}>3.</Text>
                    <Text style={portraitStyles.listContent}>Hasil penilaian yang sudah dilaksanakan oleh penilai merupakan pengakuan sks dari {JenisSk === 'TRANSFER KREDIT' ? "sub Capaian Pembelajaran Mata Kuliah yang diperoleh dari pendidikan formal sebelumnya" : "capaian pembelajaran yang diperoleh dari pendidikan formal, nonformal, informal dan / atau pengalaman kerja"}</Text>
                </View>
                <View style={portraitStyles.listItem}>
                    <Text style={portraitStyles.listNumber}>4.</Text>
                    <Text style={portraitStyles.listContent}>Mata kuliah yang wajib ditempuh pada Program Studi <Text style={portraitStyles.redText}>{data.ProgramStudi.Nama}</Text> ITI terdapat pada kolom 10 dan 11 terlampir</Text>
                </View>

                {/* Signature */}
                <View style={portraitStyles.signatureSection}>
                    <Text style={portraitStyles.signatureText}>Ditetapkan di Tangerang Selatan</Text>
                    <Text style={portraitStyles.signatureText}>Pada Tanggal {formatDate(new Date())}</Text>
                    {(() => {
                        const rektor = data.Universitas.UniversityJabatan.find(
                            j => j.NamaJabatan.toLowerCase().includes('rektor') && !j.NamaJabatan.toLowerCase().includes('wakil')
                        );
                        return (
                            <Text style={portraitStyles.signatureName}>
                                ({rektor?.Nama || 'Prof. Dr. Ir. Syopiansyah Jaya Putra, M.Sis, IPU, Asean Eng'})
                            </Text>
                        );
                    })()}
                </View>

                {/* Tembusan */}
                <View style={portraitStyles.tembusanSection}>
                    <Text style={portraitStyles.tembusanTitle}>Tembusan</Text>
                    <Text style={portraitStyles.tembusanItem}>Warek Akademik, Penelitian dan Kemahasiswaan</Text>
                    <Text style={portraitStyles.tembusanItem}>Ka. SPMI</Text>
                    <Text style={portraitStyles.tembusanItem}>Pjs. Ka. Bag Pusat Pelayanan Akademik</Text>
                    <Text style={portraitStyles.tembusanItem}>Ka. Sub. Bag Data dan Sistem Informasi</Text>
                    <Text style={portraitStyles.tembusanItem}>Ka. PPMB</Text>
                    <Text style={portraitStyles.tembusanItem}>Ka. Prodi {data.ProgramStudi.Nama}</Text>
                </View>
            </Page>
            )}

            {/* Page 3+ - Landscape Table (existing content) */}
            <Page size="A4" orientation="landscape" style={styles.page}>

                {/* Header */}
                <View style={styles.headerContainer} fixed>
                    <View style={styles.logoContainer}>
                        <Image src={logoPath} style={styles.logoImage} />
                    </View>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.institutionName}>{data.Universitas.Nama || 'INSTITUT TEKNOLOGI INDONESIA'}</Text>
                        <Text style={styles.addressText}>
                            {data.Universitas.Alamat || 'Jl. Raya Puspiptek'}, Tangerang Selatan - {data.Universitas.KodePos || '15314'}
                        </Text>
                        <Text style={styles.phoneText}>(021) 7562757</Text>
                        <View style={styles.socialRow}>
                            {sortedSocialMedia.map((sm, index) => (
                                <View key={sm.UniversitySocialMediaId || index} style={styles.socialItem}>
                                    <Text style={{ ...styles.socialIcon, color: getSocialColor(sm.Nama) }}>
                                        {getSocialIcon(sm.Nama)}
                                    </Text>
                                    <Text style={styles.socialText}>
                                        {sm.Nama === 'X' ? `@${sm.Username.replace('@', '')}` : sm.Username}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Form Number */}
                <Text style={styles.formNumber}>Form (07)</Text>

                {/* Title */}
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>
                        DAFTAR NILAI PENILAIAN RPL{' '}
                        {JenisSk.toUpperCase().includes('TRANSFER')
                            ? 'TRANSFER KREDIT'
                            : 'PEROLEHAN KREDIT'}
                    </Text>
                </View>

                {/* Info Section */}
                <View style={styles.infoContainer}>
                    <View style={styles.infoColumn}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>NAMA</Text>
                            <Text style={styles.infoSeparator}>:</Text>
                            <Text style={styles.infoValue}>{data.Nama}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>PROGRAM STUDI</Text>
                            <Text style={styles.infoSeparator}>:</Text>
                            <Text style={styles.infoValue}>{data.ProgramStudi.Nama}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>PERGURUAN TINGGI</Text>
                            <Text style={styles.infoSeparator}>:</Text>
                            <Text style={styles.infoValue}>{data.Universitas.Nama}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>TEMPAT, TGL LAHIR</Text>
                            <Text style={styles.infoSeparator}>:</Text>
                            <Text style={styles.infoValue}>{data.TempatLahir}, {formatDate(data.TanggalLahir)}</Text>
                        </View>
                    </View>
                    <View style={styles.infoColumn}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>PERGURUAN TINGGI ASAL</Text>
                            <Text style={styles.infoSeparator}>:</Text>
                            <Text style={styles.infoValue}>{data.InstitusiLama.NamaInstitusi}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>NIM</Text>
                            <Text style={styles.infoSeparator}>:</Text>
                            <Text style={styles.infoValue}>{data.InstitusiLama.Nisn}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>PROGRAM STUDI ASAL</Text>
                            <Text style={styles.infoSeparator}>:</Text>
                            <Text style={styles.infoValue}>{data.InstitusiLama.Jurusan}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>JENJANG PENDIDIKAN SEBELUMNYA</Text>
                            <Text style={styles.infoSeparator}>:</Text>
                            <Text style={styles.infoValue}>{data.InstitusiLama.Jenjang}</Text>
                        </View>
                    </View>
                </View>

                {/* Table */}
                <View style={styles.tableContainer}>
                    <View style={styles.table}>
                        {/* Table Headers */}
                        <TableHeader />

                        {/* Data Rows */}
                        {tableRows.map((row, index) => (
                            <View key={index} style={styles.tableRow} wrap={false}>
                                {/* Column 1 - MataKuliah Kurikulum */}
                                <View style={[styles.cell, styles.col1Kode]}>
                                    <Text style={styles.cellText}>{row.col1.kode}</Text>
                                </View>
                                <View style={[styles.cell, styles.col1Nama]}>
                                    <Text style={styles.cellText}>{row.col1.nama}</Text>
                                </View>
                                <View style={[styles.cell, styles.col1Sks]}>
                                    <Text style={styles.cellTextCenter}>{row.col1.sks}</Text>
                                </View>

                                {/* Column 2 - Transfer SKS */}
                                <View style={[styles.cell, styles.col2Nama]}>
                                    <Text style={styles.cellText}>{row.col2?.nama || ''}</Text>
                                </View>
                                <View style={[styles.cell, styles.col2Sks]}>
                                    <Text style={styles.cellTextCenter}>{row.col2?.sks || ''}</Text>
                                </View>
                                <View style={[styles.cell, styles.col2Nilai]}>
                                    <Text style={styles.cellTextCenter}>{row.col2?.nilai || ''}</Text>
                                </View>

                                {/* Column 3 - Perolehan SKS */}
                                <View style={[styles.cell, styles.col3Nama]}>
                                    <Text style={styles.cellText}>{row.col3?.nama || ''}</Text>
                                </View>
                                <View style={[styles.cell, styles.col3Sks]}>
                                    <Text style={styles.cellTextCenter}>{row.col3?.sks || ''}</Text>
                                </View>
                                <View style={[styles.cell, styles.col3Nilai]}>
                                    <Text style={styles.cellTextCenter}>{row.col3?.nilai || ''}</Text>
                                </View>

                                {/* Column 4 - Belum Ditempuh */}
                                <View style={[styles.cell, styles.col4Nama]}>
                                    <Text style={styles.cellText}>{row.col4?.nama || ''}</Text>
                                </View>
                                <View style={[styles.cellLast, styles.col4Sks]}>
                                    <Text style={styles.cellTextCenter}>{row.col4?.sks || ''}</Text>
                                </View>
                            </View>
                        ))}

                        {/* Footer Row - SKS Totals */}
                        <View style={styles.tableRow} wrap={false}>
                            {/* Column 1 Footer */}
                            <View style={[styles.cell, { width: '23%', backgroundColor: '#f5f5f5' }]}>
                                <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', textAlign: 'center' }}>JUMLAH SKS</Text>
                            </View>
                            <View style={[styles.cell, styles.col1Sks, { backgroundColor: '#f5f5f5' }]}>
                                <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', textAlign: 'center' }}>
                                    {tableRows.reduce((sum, row) => sum + row.col1.sks, 0)}
                                </Text>
                            </View>

                            {/* Column 2 Footer */}
                            <View style={[styles.cell, { width: '19%', backgroundColor: '#f5f5f5' }]}>
                                <Text style={{ fontSize: 6, fontFamily: 'Helvetica-Bold', textAlign: 'center' }}>
                                    JUMLAH SKS BERDASARKAN PENGAKUAN DARI PENDIDIKAN FORMAL (TRANSKRIP)
                                </Text>
                            </View>
                            <View style={[styles.cell, styles.col2Nilai, { backgroundColor: '#f5f5f5' }]}>
                                <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', textAlign: 'center' }}>
                                    {tableRows.reduce((sum, row) => sum + (row.col2?.sks || 0), 0)}
                                </Text>
                            </View>

                            {/* Column 3 Footer */}
                            <View style={[styles.cell, { width: '19%', backgroundColor: '#f5f5f5' }]}>
                                <Text style={{ fontSize: 6, fontFamily: 'Helvetica-Bold', textAlign: 'center' }}>
                                    JUMLAH SKS BERDASARKAN PENGAKUAN DARI PENDIDIKAN NONFORMAL, INFORMAL DAN /ATAU PENGALAMAN KERJA
                                </Text>
                            </View>
                            <View style={[styles.cell, styles.col3Nilai, { backgroundColor: '#f5f5f5' }]}>
                                <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', textAlign: 'center' }}>
                                    {tableRows.reduce((sum, row) => sum + (row.col3?.sks || 0), 0)}
                                </Text>
                            </View>

                            {/* Column 4 Footer */}
                            <View style={[styles.cell, { width: '19%', backgroundColor: '#f5f5f5' }]}>
                                <Text style={{ fontSize: 6, fontFamily: 'Helvetica-Bold', textAlign: 'center' }}>
                                    JUMLAH SKS YANG MASIH HARUS DITEMPUH
                                </Text>
                            </View>
                            <View style={[styles.cellLast, styles.col4Sks, { backgroundColor: '#f5f5f5' }]}>
                                <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', textAlign: 'center' }}>
                                    {tableRows.reduce((sum, row) => sum + (row.col4?.sks || 0), 0)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Signature Section */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, paddingHorizontal: 20 }} wrap={false}>
                    {/* Signature 1 - Wakil Rektor Bidang Akademik */}
                    {(() => {
                        const wakilRektor = data.Universitas.UniversityJabatan.find(
                            j => j.NamaJabatan.includes('Wakil Rektor Bidang Akademik')
                        );
                        return (
                            <View style={{ width: '30%', alignItems: 'center' }}>
                                <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 60 }}>
                                    Plt. {wakilRektor?.NamaJabatan || 'Wakil Rektor Bidang Akademik, Penelitian dan Kemahasiswaan'}
                                </Text>
                                <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', textAlign: 'center' }}>
                                    ({wakilRektor?.Nama || '.................................'})
                                </Text>
                            </View>
                        );
                    })()}

                    {/* Signature 2 - Ka. Pusat Akademik */}
                    {(() => {
                        const kaPusat = data.Universitas.UniversityJabatan.find(
                            j => j.NamaJabatan.includes('Ka. Pusat Akademik')
                        );
                        return (
                            <View style={{ width: '30%', alignItems: 'center' }}>
                                <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 60 }}>
                                    Kepala Pusat Akademik
                                </Text>
                                <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', textAlign: 'center' }}>
                                    ({kaPusat?.Nama || '.................................'})
                                </Text>
                            </View>
                        );
                    })()}

                    {/* Signature 3 - Ketua Program Studi (matching current prodi) */}
                    {(() => {
                        const kaProdi = data.Universitas.UniversityJabatan.find(
                            j => j.NamaJabatan.includes(data.ProgramStudi.Nama) ||
                                j.NamaJabatan.includes('Ka. Program Studi')
                        );
                        const today = new Date();
                        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
                        const dateStr = `Tangerang Selatan, ${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

                        return (
                            <View style={{ width: '30%', alignItems: 'center' }}>
                                <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', textAlign: 'center', color: 'red' }}>
                                    {dateStr}
                                </Text>
                                <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', textAlign: 'center', color: 'red', marginBottom: 50 }}>
                                    Ketua Program Studi {data.ProgramStudi.Nama}
                                </Text>
                                <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', textAlign: 'center' }}>
                                    ({kaProdi?.Nama || '.................................'})
                                </Text>
                            </View>
                        );
                    })()}
                </View>

            </Page>
            {portraitTemplate.pages
                .filter((page) => page.placement === 'after_landscape')
                .map((page) => (
                    <Page
                        key={page.id}
                        size="A4"
                        orientation="portrait"
                        style={portraitStyles.page}
                    >
                        <RekapitulasiTemplateBlocks
                            blocks={page.blocks}
                            placeholders={templatePlaceholders}
                            logoPath={logoPath}
                        />
                    </Page>
                ))}
        </Document>
    );
};

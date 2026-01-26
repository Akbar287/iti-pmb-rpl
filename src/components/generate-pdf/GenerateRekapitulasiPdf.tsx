import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { GenerateRekapitulasiType } from '@/types/GeneratePdfTypes';
import path from 'path';

// Helper function to format date
const formatDate = (date: Date): string => {
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const d = new Date(date);
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
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
        padding: 30,
        backgroundColor: '#ffffff',
        fontFamily: 'Times-Roman',
        fontSize: 9,
    },
    // Header
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
        fontSize: 20,
        textTransform: 'uppercase',
        marginBottom: 3,
        letterSpacing: 1,
    },
    addressText: {
        fontFamily: 'Helvetica',
        fontSize: 10,
        marginBottom: 1,
    },
    phoneText: {
        fontFamily: 'Helvetica',
        fontSize: 10,
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
        fontSize: 8,
        marginRight: 2,
    },
    socialText: {
        fontSize: 8,
        fontFamily: 'Helvetica',
    },
    // Form number
    formNumber: {
        textAlign: 'right',
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        marginTop: 5,
        marginBottom: 5,
    },
    // Title
    titleContainer: {
        marginVertical: 8,
        alignItems: 'center',
    },
    title: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 11,
        textAlign: 'center',
        marginBottom: 2,
    },
    subtitle: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 11,
        textAlign: 'center',
    },
    // Info Section
    infoContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        marginTop: 8,
    },
    infoColumn: {
        width: '50%',
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 2,
    },
    infoLabel: {
        width: '50%',
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
    },
    infoSeparator: {
        width: '5%',
        fontSize: 9,
    },
    infoValue: {
        width: '45%',
        fontSize: 9,
        fontFamily: 'Helvetica',
    },
    programStudiRow: {
        flexDirection: 'row',
        marginBottom: 8,
        marginTop: 5,
    },
    programStudiLabel: {
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        width: '25%',
    },
    programStudiSeparator: {
        width: '3%',
        fontSize: 9,
    },
    programStudiValue: {
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
    },
    // Table styles
    tableContainer: {
        marginTop: 5,
    },
    table: {
        width: '100%',
    },
    // Main header row
    tableMainHeader: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#000000',
    },
    tableSubHeader: {
        flexDirection: 'row',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#000000',
    },
    tableRow: {
        flexDirection: 'row',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#000000',
        minHeight: 16,
    },
    tableFooterRow: {
        flexDirection: 'row',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#000000',
        minHeight: 20,
    },
    // Column widths - total 100%
    colNo: { width: '4%' },
    colKode: { width: '8%' },
    colNama: { width: '20%' },
    colPortofolio: { width: '8%' },
    colTulis: { width: '8%' },
    colWawancara: { width: '9%' },
    colDemo: { width: '8%' },
    colTranskrip: { width: '8%' },
    colSkor: { width: '8%' },
    colNilai: { width: '7%' },
    colStatus: { width: '12%' },
    // Header cells
    headerCell: {
        borderRightWidth: 1,
        borderRightColor: '#000000',
        padding: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerCellLast: {
        padding: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        textAlign: 'center',
    },
    subHeaderText: {
        fontSize: 7,
        fontFamily: 'Helvetica-Bold',
        textAlign: 'center',
    },
    // Data cells
    cell: {
        borderRightWidth: 1,
        borderRightColor: '#000000',
        padding: 2,
        justifyContent: 'center',
    },
    cellLast: {
        padding: 2,
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
    cellTextRed: {
        fontSize: 7,
        fontFamily: 'Helvetica-Bold',
        textAlign: 'center',
        color: '#cc0000',
    },
    // Footer
    footerLabel: {
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        textAlign: 'right',
    },
    footerValue: {
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        textAlign: 'center',
    },
    // Signature section
    signatureContainer: {
        marginTop: 40,
        paddingRight: 20,
    },
    signatureDateContainer: {
        alignItems: 'flex-end',
        marginBottom: 20,
    },
    signatureDate: {
        fontSize: 10,
        fontFamily: 'Helvetica',
    },
    signatureRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    signatureBlock: {
        width: '30%',
        alignItems: 'center',
    },
    signatureTitle: {
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 60,
        textAlign: 'center',
    },
    signatureName: {
        fontSize: 9,
        fontFamily: 'Helvetica',
        textAlign: 'center',
    },
});

// Table Row Data Interface
interface TableRowData {
    no: number;
    kode: string;
    nama: string;
    portofolio: number | null;
    tulis: number | null;
    wawancara: number | null;
    demo: number | null;
    transkrip: string;
    skorRataRata: number | null;
    nilaiHuruf: string;
    status: 'Diakui' | 'Tidak Diakui';
    isRpl: boolean;
}

// Component
export const GenerateRekapitulasiPdf = ({ data }: { data: GenerateRekapitulasiType }) => {
    // Sort social media
    const sortedSocialMedia = data.Universitas.UniversitySocialMedia
        .filter(sm => socialMediaOrder.includes(sm.Nama))
        .sort((a, b) => socialMediaOrder.indexOf(a.Nama) - socialMediaOrder.indexOf(b.Nama));

    // Process table data - Using MataKuliah as the base reference
    const tableRows: TableRowData[] = data.MataKuliah.map((mk, index) => {
        // Find matching MataKuliahMahasiswa
        const matchingMkm = data.MataKuliahMahasiswa.find(
            mkm => mkm.MataKuliah.Kode === mk.Kode || mkm.MataKuliah.Nama === mk.Nama
        );

        if (matchingMkm) {
            const isRpl = matchingMkm.Rpl || false;
            const hasAsessmen = matchingMkm.SkorAsessmen.SkorAssesmenId !== '';
            const isFromTranskrip = matchingMkm.TranskripNilai.TranskripNilaiId !== '';

            return {
                no: index + 1,
                kode: mk.Kode,
                nama: mk.Nama,
                portofolio: hasAsessmen && isRpl ? matchingMkm.SkorAsessmen.Portofolio : null,
                tulis: hasAsessmen && isRpl ? matchingMkm.SkorAsessmen.Tulis : null,
                wawancara: hasAsessmen && isRpl ? matchingMkm.SkorAsessmen.Wawancara : null,
                demo: hasAsessmen && isRpl ? matchingMkm.SkorAsessmen.Demo : null,
                transkrip: isFromTranskrip ? matchingMkm.TranskripNilai.Nilai : '',
                skorRataRata: hasAsessmen ? matchingMkm.SkorAsessmen.SkorRataRata : null,
                nilaiHuruf: hasAsessmen ? matchingMkm.SkorAsessmen.NilaiHuruf : (isFromTranskrip ? matchingMkm.TranskripNilai.NilaiAsessmen : ''),
                status: matchingMkm.SkorAsessmen.Diakui || matchingMkm.TranskripNilai.Diakui ? 'Diakui' : 'Tidak Diakui',
                isRpl,
            };
        }

        // Not in MataKuliahMahasiswa
        return {
            no: index + 1,
            kode: mk.Kode,
            nama: mk.Nama,
            portofolio: null,
            tulis: null,
            wawancara: null,
            demo: null,
            transkrip: '',
            skorRataRata: null,
            nilaiHuruf: '',
            status: 'Tidak Diakui',
            isRpl: false,
        };
    });

    // Calculate total SKS diakui
    const totalSksDialui = tableRows
        .filter(row => row.status === 'Diakui')
        .reduce((acc, row) => {
            const mk = data.MataKuliah.find(m => m.Kode === row.kode);
            return acc + (mk?.Sks || 0);
        }, 0);

    // Table Header Component
    const TableHeader = () => (
        <>
            {/* Main Header Row */}
            <View style={styles.tableMainHeader} wrap={false}>
                <View style={[styles.headerCell, styles.colNo]}>
                    <Text style={styles.headerText}>No</Text>
                </View>
                <View style={[styles.headerCell, styles.colKode]}>
                    <Text style={styles.headerText}>Kode Mata</Text>
                    <Text style={styles.headerText}>Kuliah</Text>
                </View>
                <View style={[styles.headerCell, styles.colNama]}>
                    <Text style={styles.headerText}>Nama Mata Kuliah</Text>
                </View>
                <View style={[styles.headerCell, { width: '33%' }]}>
                    <Text style={styles.headerText}>Skor Hasil Penilaian</Text>
                    <Text style={styles.headerText}>(diisi sesuai dengan kebutuhan)</Text>
                </View>
                <View style={[styles.headerCell, styles.colSkor]}>
                    <Text style={styles.headerText}>Skor</Text>
                    <Text style={styles.headerText}>rata-rata</Text>
                    <Text style={styles.headerText}>Asesmen</Text>
                </View>
                <View style={[styles.headerCell, styles.colNilai]}>
                    <Text style={styles.headerText}>Nilai</Text>
                    <Text style={styles.headerText}>Huruf</Text>
                </View>
                <View style={[styles.headerCellLast, styles.colStatus]}>
                    <Text style={styles.headerText}>Status</Text>
                    <Text style={styles.headerText}>(Diakui/Tidak Diakui)</Text>
                </View>
            </View>

            {/* Sub Header Row for Skor columns */}
            <View style={styles.tableSubHeader} wrap={false}>
                <View style={[styles.headerCell, styles.colNo]}>
                    <Text style={styles.subHeaderText}>(1)</Text>
                </View>
                <View style={[styles.headerCell, styles.colKode]}>
                    <Text style={styles.subHeaderText}>(2)</Text>
                </View>
                <View style={[styles.headerCell, styles.colNama]}>
                    <Text style={styles.subHeaderText}>(3)</Text>
                </View>
                <View style={[styles.headerCell, styles.colPortofolio]}>
                    <Text style={styles.subHeaderText}>Portofolio</Text>
                    <Text style={styles.subHeaderText}>(4)</Text>
                </View>
                <View style={[styles.headerCell, styles.colTulis]}>
                    <Text style={styles.subHeaderText}>Tulis</Text>
                    <Text style={styles.subHeaderText}>(5)</Text>
                </View>
                <View style={[styles.headerCell, styles.colWawancara]}>
                    <Text style={styles.subHeaderText}>Wawancara</Text>
                    <Text style={styles.subHeaderText}>(6)</Text>
                </View>
                <View style={[styles.headerCell, styles.colDemo]}>
                    <Text style={styles.subHeaderText}>Demo</Text>
                    <Text style={styles.subHeaderText}>(7)</Text>
                </View>
                <View style={[styles.headerCell, styles.colTranskrip]}>
                    <Text style={styles.subHeaderText}>Transkrip</Text>
                    <Text style={styles.subHeaderText}>(8)</Text>
                </View>
                <View style={[styles.headerCell, styles.colSkor]}>
                    <Text style={styles.subHeaderText}>(9)</Text>
                </View>
                <View style={[styles.headerCell, styles.colNilai]}>
                    <Text style={styles.subHeaderText}>(10)</Text>
                </View>
                <View style={[styles.headerCellLast, styles.colStatus]}>
                    <Text style={styles.subHeaderText}>(11)</Text>
                </View>
            </View>
        </>
    );

    return (
        <Document>
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
                <Text style={styles.formNumber}>Form (05)</Text>

                {/* Title */}
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>REKAPITULASI HASIL PENILAIAN RPL PEROLEHAN KREDIT</Text>
                    <Text style={styles.subtitle}>INSTITUT TEKNOLOGI INDONESIA</Text>
                </View>

                {/* Info Section */}
                <View style={styles.infoContainer}>
                    {/* Left Column */}
                    <View style={styles.infoColumn}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Nama Pemohon RPL</Text>
                            <Text style={styles.infoSeparator}>:</Text>
                            <Text style={styles.infoValue}>{data.Nama}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Alamat</Text>
                            <Text style={styles.infoSeparator}>:</Text>
                            <Text style={styles.infoValue}>{data.Alamat}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>No. Hp</Text>
                            <Text style={styles.infoSeparator}>:</Text>
                            <Text style={styles.infoValue}>{data.NomorHp}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Email</Text>
                            <Text style={styles.infoSeparator}>:</Text>
                            <Text style={{ ...styles.infoValue, color: '#0066cc', textDecoration: 'underline' }}>{data.Email}</Text>
                        </View>
                    </View>
                    {/* Right Column */}
                    <View style={styles.infoColumn}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Jenjang Pendidikan Sebelumnya</Text>
                            <Text style={styles.infoSeparator}>:</Text>
                            <Text style={styles.infoValue}>{data.InstitusiLama.Jenjang}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Program Studi Sebelummnya</Text>
                            <Text style={styles.infoSeparator}>:</Text>
                            <Text style={styles.infoValue}>{data.InstitusiLama.Jurusan}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Jenjang KKNI yang dituju</Text>
                            <Text style={styles.infoSeparator}>:</Text>
                            <Text style={styles.infoValue}>{data.InstitusiLama.JenjangKKNIDituju}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Nama Perguruan Tinggi Asal</Text>
                            <Text style={styles.infoSeparator}>:</Text>
                            <Text style={styles.infoValue}>{data.InstitusiLama.NamaInstitusi}</Text>
                        </View>
                    </View>
                </View>

                {/* Program Studi Tujuan */}
                <View style={styles.programStudiRow}>
                    <Text style={styles.programStudiLabel}>Program Studi Tujuan</Text>
                    <Text style={styles.programStudiSeparator}>:</Text>
                    <Text style={styles.programStudiValue}>{data.ProgramStudi.Nama}</Text>
                </View>

                {/* Table */}
                <View style={styles.tableContainer}>
                    <View style={styles.table}>
                        {/* Table Headers */}
                        <TableHeader />

                        {/* Data Rows */}
                        {tableRows.map((row, index) => (
                            <View key={index} style={styles.tableRow} wrap={false}>
                                <View style={[styles.cell, styles.colNo]}>
                                    <Text style={styles.cellTextCenter}>{row.no}</Text>
                                </View>
                                <View style={[styles.cell, styles.colKode]}>
                                    <Text style={styles.cellText}>{row.kode}</Text>
                                </View>
                                <View style={[styles.cell, styles.colNama]}>
                                    <Text style={styles.cellText}>{row.nama}</Text>
                                </View>
                                <View style={[styles.cell, styles.colPortofolio]}>
                                    <Text style={styles.cellTextCenter}>{row.portofolio !== null ? row.portofolio : '-'}</Text>
                                </View>
                                <View style={[styles.cell, styles.colTulis]}>
                                    <Text style={styles.cellTextCenter}>{row.tulis !== null ? row.tulis : '-'}</Text>
                                </View>
                                <View style={[styles.cell, styles.colWawancara]}>
                                    <Text style={styles.cellTextCenter}>{row.wawancara !== null ? row.wawancara : '-'}</Text>
                                </View>
                                <View style={[styles.cell, styles.colDemo]}>
                                    <Text style={styles.cellTextCenter}>{row.demo !== null ? row.demo : '-'}</Text>
                                </View>
                                <View style={[styles.cell, styles.colTranskrip]}>
                                    <Text style={styles.cellTextCenter}>{row.transkrip || '-'}</Text>
                                </View>
                                <View style={[styles.cell, styles.colSkor]}>
                                    <Text style={styles.cellTextCenter}>{row.skorRataRata !== null ? row.skorRataRata : '-'}</Text>
                                </View>
                                <View style={[styles.cell, styles.colNilai]}>
                                    <Text style={styles.cellTextCenter}>{row.nilaiHuruf || '-'}</Text>
                                </View>
                                <View style={[styles.cellLast, styles.colStatus]}>
                                    <Text style={row.status === 'Diakui' ? styles.cellTextCenter : styles.cellTextRed}>
                                        {row.status}
                                    </Text>
                                </View>
                            </View>
                        ))}

                        {/* Footer Row - Total SKS */}
                        <View style={styles.tableFooterRow} wrap={false}>
                            <View style={[styles.cell, { width: '88%' }]}>
                                <Text style={styles.footerLabel}>Jumlah SKS Diakui</Text>
                            </View>
                            <View style={[styles.cellLast, styles.colStatus]}>
                                <Text style={styles.footerValue}>{totalSksDialui}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Page>

            {/* Page 2 - Signature Section */}
            <Page size="A4" orientation="landscape" style={styles.page}>
                {/* Signature Section */}
                <View style={styles.signatureContainer}>
                    {/* Date */}
                    <View style={styles.signatureDateContainer}>
                        <Text style={styles.signatureDate}>Tangerang Selatan, {formatDate(new Date())}</Text>
                    </View>

                    {/* Signatures */}
                    <View style={styles.signatureRow}>
                        {/* Penilai I */}
                        <View style={styles.signatureBlock}>
                            <Text style={styles.signatureTitle}>Penilai I</Text>
                            <Text style={styles.signatureName}>
                                ({data.Asesor.find(x => x.Urutan == 1)?.Nama || '.................................'})
                            </Text>
                        </View>

                        {/* Penilai II */}
                        <View style={styles.signatureBlock}>
                            <Text style={styles.signatureTitle}>Penilai II</Text>
                            <Text style={styles.signatureName}>
                                ({data.Asesor.find(x => x.Urutan == 2)?.Nama || '.................................'})
                            </Text>
                        </View>

                        {/* Pemohon */}
                        <View style={styles.signatureBlock}>
                            <Text style={styles.signatureTitle}>Pemohon</Text>
                            <Text style={styles.signatureName}>({data.Nama})</Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
};
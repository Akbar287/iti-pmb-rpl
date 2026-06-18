import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { GenerateBeritaAcaraType } from '@/types/GeneratePdfTypes';
import path from 'path';

const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const formatDate = (date: Date): string => {
    const d = new Date(date);
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const logoPath = path.join(process.cwd(), 'public', 'images', 'logo.png');

const safeText = (value: unknown, fallback = ''): string => {
    if (value === null || value === undefined) return fallback;
    const text = String(value).trim();
    return text || fallback;
};

const styles = StyleSheet.create({
    page: {
        paddingTop: '1.5cm',
        paddingBottom: '1.5cm',
        paddingHorizontal: '2cm',
        backgroundColor: '#ffffff',
        fontFamily: 'Times-Roman',
        fontSize: 12,
        flexDirection: 'column',
    },
    logoWrap: {
        alignItems: 'center',
        marginBottom: 12,
    },
    logo: {
        width: 80,
        height: 80,
    },
    title: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 1,
    },
    paragraph: {
        marginTop: 10,
        textAlign: 'justify',
        lineHeight: 1,
    },
    paragraphTight: {
        marginTop: 3,
        textAlign: 'justify',
        lineHeight: 1,
    },
    // Table
    table: {
        marginTop: 10,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderColor: '#000000',
    },
    tableRow: {
        flexDirection: 'row',
    },
    thNama: {
        width: '50%',
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#000000',
        paddingVertical: 4,
        paddingHorizontal: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    thSks: {
        width: '25%',
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#000000',
        paddingVertical: 4,
        paddingHorizontal: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    thText: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 1,
    },
    tdNama: {
        width: '50%',
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#000000',
        paddingVertical: 4,
        paddingHorizontal: 10,
        justifyContent: 'center',
    },
    tdSks: {
        width: '25%',
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#000000',
        paddingVertical: 4,
        paddingHorizontal: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tdNamaText: {
        fontSize: 12,
        marginVertical: 1,
    },
    tdSksText: {
        fontSize: 12,
        textAlign: 'center',
    },
    closingDate: {
        marginTop: 18,
        textAlign: 'right',
    },
    // Pendorong agar tanda tangan turun ke bawah dan mengisi 1 halaman penuh.
    spacer: {
        flexGrow: 1,
        minHeight: 12,
    },
    signRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    signBlock: {
        width: '25%',
        alignItems: 'center',
    },
    signTitle: {
        fontSize: 12,
        textAlign: 'center',
    },
    signGap: {
        height: 90,
    },
    signName: {
        fontSize: 12,
        textAlign: 'center',
    },
});

export const GenerateBeritaAcara = ({ data }: { data: GenerateBeritaAcaraType }) => {
    const penilai1 = (data.Penilai ?? []).find(p => p.Urutan === 1)?.Nama ?? '';
    const penilai2 = (data.Penilai ?? []).find(p => p.Urutan === 2)?.Nama ?? '';
    const prodi = safeText(data.ProgramStudi?.Nama, '-');

    return (
        <Document>
            <Page size="A4" orientation="landscape" style={styles.page}>
                {/* Logo */}
                <View style={styles.logoWrap}>
                    <Image src={logoPath} style={styles.logo} />
                </View>

                {/* Judul */}
                <Text style={styles.title}>BERITA ACARA RAPAT PLENO PENGESAHAN PENILAIAN PROGRAM AKADEMIK</Text>
                <Text style={styles.title}>JALUR REKOGNISI PEMBELAJARAN LAMPAU (RPL)</Text>

                {/* Paragraf pembuka */}
                <Text style={styles.paragraph}>
                    Pada hari ini tanggal {formatDate(data.TanggalRapat)} telah diselenggarakan Rapat Pleno
                    untuk pengesahan penilaian Program Akademik Jalur Rekognisi Pembelajaran Lampau (RPL)
                    atas nama calon mahasiswa : {safeText(data.Nama, '-')} yang akan aktif kuliah pada
                    Semester {safeText(data.Semester, 'Ganjil')} Tahun Akademik {safeText(data.TahunAkademik, '-')} pada
                    Program Studi {prodi}
                </Text>
                <Text style={styles.paragraphTight}>
                    Hasil penilaian yang telah dilaksanakan dan disahkan adalah berikut ini
                </Text>

                {/* Tabel hasil */}
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={styles.thNama}><Text style={styles.thText}>Nama Penilai</Text></View>
                        <View style={styles.thSks}><Text style={styles.thText}>Jumlah SKS yang Diakui</Text></View>
                        <View style={styles.thSks}><Text style={styles.thText}>Jumlah SKS yang Masih Harus Diambil</Text></View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tdNama}>
                            <Text style={styles.tdNamaText}>{safeText(penilai1, '.................................')}</Text>
                            <Text style={styles.tdNamaText}>{safeText(penilai2, '.................................')}</Text>
                        </View>
                        <View style={styles.tdSks}><Text style={styles.tdSksText}>{data.SksDiakui}</Text></View>
                        <View style={styles.tdSks}><Text style={styles.tdSksText}>{data.SksHarusDiambil}</Text></View>
                    </View>
                </View>

                {/* Penutup */}
                <Text style={styles.paragraph}>Berita acara ini dilengkapi dengan lampiran SK Pengakuan.</Text>
                <Text style={[styles.paragraphTight, { marginTop: -3 }]}>
                    Demikian berita acara rapat pleno ini agar dapat digunakan sebagaimana perlunya
                </Text>

                {/* Tanggal */}
                <Text style={styles.closingDate}>
                    Tangerang Selatan, {formatDate(data.TanggalRapat)}
                </Text>

                {/* Spacer mendorong tanda tangan ke bawah */}
                <View style={styles.spacer} />

                {/* Tanda tangan */}
                <View style={styles.signRow}>
                    <View style={styles.signBlock}>
                        <Text style={styles.signTitle}>Penilai I</Text>
                    </View>
                    <View style={styles.signBlock}>
                        <Text style={styles.signTitle}>Penilai II</Text>
                    </View>
                    <View style={styles.signBlock}>
                        <Text style={styles.signTitle}>Ketua Program Studi</Text>
                        <Text style={styles.signTitle}>{prodi}</Text>
                    </View>
                    <View style={styles.signBlock}>
                        <Text style={styles.signTitle}>Ketua Tim Komite</Text>
                    </View>
                </View>

                <View style={styles.signGap} />

                <View style={styles.signRow}>
                    <View style={styles.signBlock}>
                        <Text style={styles.signName}>( {safeText(penilai1, '.................................')} )</Text>
                    </View>
                    <View style={styles.signBlock}>
                        <Text style={styles.signName}>( {safeText(penilai2, '.................................')} )</Text>
                    </View>
                    <View style={styles.signBlock}>
                        <Text style={styles.signName}>( {safeText(data.Kaprodi, '.................................')} )</Text>
                    </View>
                    <View style={styles.signBlock}>
                        <Text style={styles.signName}>( {safeText(data.KetuaKomite, '.................................')} )</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

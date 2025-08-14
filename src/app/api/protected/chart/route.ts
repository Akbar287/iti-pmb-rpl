import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { prisma } from '@/lib/prisma'
import { Session } from 'next-auth'
import { getSession } from '@/provider/api'

const app = new Hono().basePath('/api/protected/chart')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const _r = c.req.query('_r')
    if (!_r) {
        return c.json(
            { data: [], status: 'error', message: 'role id is required' },
            { status: 400 }
        )
    }

    const role = await prisma.role.findFirst({
        where: { RoleId: _r as string },
        select: { RoleId: true, Name: true },
    })

    if (!role) {
        return c.json(
            { data: [], status: 'error', message: 'Role not found' },
            { status: 404 }
        )
    }

    if (role.Name.match('Rektor')) {
    } else if (role.Name.match('Kaprodi')) {
        let data = []
        // Chart 1
        let rawCounts = await prisma.$queryRawUnsafe(`
            SELECT 
                ps.nama AS program_studi,
                ta.nama AS tipe_asesor,
                COUNT(*) as jumlah
            FROM asesor_program_studi aps
            JOIN asesor a ON aps.asesor_id = a.asesor_id
            JOIN program_studi ps ON aps.program_studi_id = ps.program_studi_id
            JOIN tipe_asesor ta ON a.tipe_asesor_id = ta.tipe_asesor_id
            WHERE a.deleted_at IS NULL AND ps.deleted_at IS NULL
            GROUP BY ps.nama, ta.nama
            ORDER BY ps.nama, ta.nama
        `)

        let chartDataMap: Record<string, any> = {}

        for (const row of rawCounts as any[]) {
            const { program_studi, tipe_asesor, jumlah } = row

            if (!chartDataMap[program_studi]) {
                chartDataMap[program_studi] = { date: program_studi }
            }

            chartDataMap[program_studi][tipe_asesor] = parseInt(jumlah)
        }

        let temp = Object.values(chartDataMap).map((item) => ({
            date: item.date,
            'Asesor Akademik': item['Asesor Akademik'] || 0,
            'Asesor Praktisi': item['Asesor Praktisi'] || 0,
        }))
        data.push({ chart_1:  temp})
        rawCounts = null
        chartDataMap = {}

        // Chart 2
        let rawCounts1 = await prisma.tipeAsesor.findMany({
            select: {
                TipeAsesorId: true,
                Nama: true,
                _count: {
                    select: {
                        Asesor: true,
                    },
                },
            },
        })

        data.push({
            chart_2: rawCounts1.map((r, i) => ({
                tipe: r.Nama,
                count: r._count.Asesor,
                fill: `var(--chart-${i + 1})`,
            })),
        })

        // Chart 3
        let rawChart3 = await prisma.programStudi.findMany({
            select: {
                ProgramStudiId: true,
                Nama: true,
                _count: {
                    select: {
                        DaftarUlang: true,
                        MataKuliah: true,
                    },
                },
            },
        })
        data.push({
            chart_3: rawChart3.map((r, i) => ({
                program_studi: r.Nama,
                count: r._count.DaftarUlang,
                fill: `var(--chart-${(i % 2) + 1})`,
            })),
        })

        data.push({
            chart_4: rawChart3.map((r, i) => ({
                program_studi: r.Nama,
                count: r._count.MataKuliah,
                fill: `var(--chart-${(i % 2) + 1})`,
            })),
        })

        return c.json(
            {
                data: data,
                status: 'success',
                message: 'Chart data retrieved successfully',
            },
            { status: 200 }
        )
    } else if (role.Name.match('Asesor')) {
        const session: Session | null = await getSession()
        
        const asesor = await prisma.asesor.findFirst({
            where: { UserId: session?.user.id },
            include: {
                AsesorProgramStudi: {
                    include: {
                        ProgramStudi: true,
                    },
                },
            },
        })

        if (!asesor) {
            throw new Error('Asesor tidak ditemukan')
        }

        let data: {
            chart1: any, chart2: any
        } = { chart1: [], chart2: [] }

        // Chart 1 - Jml Mhs yg sudah dan belum di asses
        let results: {
            programStudi: string
            sudahAsses: number
            belumAsses: number
        }[] = []

        for (const aps of asesor.AsesorProgramStudi) {
            const programStudiId = aps.ProgramStudiId

            const mahasiswaList = await prisma.pendaftaran.findMany({
                where: {
                    DaftarUlang: {
                        some: {
                            ProgramStudiId: programStudiId,
                        }
                    },
                    AssesorMahasiswa: {
                        some: {
                            AsesorId: asesor.AsesorId,
                        },
                    },
                },
                select: {
                    PendaftaranId: true,
                    StatusMahasiswaAssesmentHistory: {
                        where: {
                            Aktif: true,
                            StatusMahasiswaAssesment: {
                                NamaStatus: 'Asessmen Oleh Asesor',
                            },
                        },
                        select: {
                            StatusMahasiswaAssesmentHistoryId: true,
                        },
                    },
                },
            })

            let sudahAsses = 0
            let belumAsses = 0

            mahasiswaList.forEach((mhs) => {
                if (mhs.StatusMahasiswaAssesmentHistory.length > 0) {
                    sudahAsses++
                } else {
                    belumAsses++
                }
            })

            results.push({
                programStudi: aps.ProgramStudi.Nama,
                sudahAsses,
                belumAsses,
            })
        }
        data.chart1 = results
        results = []

        //Chart 2 - Jml Mhs per status
        let rawData = await prisma.statusMahasiswaAssesment.findMany({
            select: {
                NamaStatus: true,
                StatusMahasiswaAssesmentHistory: {
                where: {
                    Aktif: true,
                    Pendaftaran: {
                    AssesorMahasiswa: {
                        some: {
                        Asesor: {
                            UserId: session?.user.id
                        },
                        },
                    },
                    },
                },
                select: {
                    StatusMahasiswaAssesmentHistoryId: true,
                },
                },
            },
        });

        let hasil = rawData.map((item) => ({
            Status: item.NamaStatus,
            Jumlah: item.StatusMahasiswaAssesmentHistory.length,
        }));

        rawData = []
        data.chart2 = hasil
        hasil = []

        return c.json(
            {
                data: data,
                status: 'success',
                message: 'Chart data retrieved successfully',
            },
            { status: 200 }
        )

    } else if (role.Name.match('Mahasiswa')) {
        const session: Session | null = await getSession()
        if (!session || !session.user || !session.user.id) {
            return c.json(
                { data: [], status: 'error', message: 'Session not found' },
                { status: 401 }
            )
        }

        let data = []

        let rawData = await prisma.mahasiswa.findFirst({
            where: { UserId: session.user.id },
            select: {
                Pendaftaran: {
                    select: {
                        PendaftaranId: true,
                        KodePendaftar: true,
                        DaftarUlang: {
                            select: {
                                ProgramStudi: {
                                    select: { Nama: true }
                                }
                            }
                        },
                        _count: {
                            select: {
                                Pesantren: true,
                                InstitusiLama: true,
                                PekerjaanMahasiswa: true,
                                InformasiKependudukan: true,
                                OrangTua: true,
                                MahasiswaRiwayatPekerjaan: true,
                                MahasiswaPendidikan: true,
                                MahasiswaOrganisasiProfesi: true,
                                MahasiswaPiagam: true,
                                MahasiswaKonferensi: true,
                                MahasiswaPelatihanProfessional: true,
                            }
                        }
                    }
                }
            }
        })

        data.push({chart1: rawData?.Pendaftaran.map(p => ({
            PendaftarId: p.PendaftaranId,
            KodePendaftar: p.KodePendaftar,
            ProgramStudi: p.DaftarUlang.length > 0 ? p.DaftarUlang[0].ProgramStudi.Nama : 'Tidak ada',
            Pesantren: p._count.Pesantren,
            InstitusiLama: p._count.InstitusiLama,
            PekerjaanMahasiswa: p._count.PekerjaanMahasiswa,
            InformasiKependudukan: p._count.InformasiKependudukan,
            OrangTua: p._count.OrangTua,
            MahasiswaRiwayatPekerjaan: p._count.MahasiswaRiwayatPekerjaan,
            MahasiswaPendidikan: p._count.MahasiswaPendidikan,
            MahasiswaOrganisasiProfesi: p._count.MahasiswaOrganisasiProfesi,
            MahasiswaPiagam: p._count.MahasiswaPiagam,
            MahasiswaKonferensi: p._count.MahasiswaKonferensi,
            MahasiswaPelatihanProfessional: p._count.MahasiswaPelatihanProfessional,
        }))})
        rawData = null

        // Chart 2
        let pendaftarans = await prisma.pendaftaran.findMany({
            where: {
                Mahasiswa: {
                    UserId : session.user.id,
                },
            },
            select: {
                PendaftaranId: true,
                KodePendaftar: true,
                BuktiForm: {
                select: {
                    BuktiFormId: true,
                    JenisDokumenId: true,
                    JenisDokumen: {
                    select: {
                        Jenis: true,
                        NomorDokumen: true,
                    },
                    },
                },
                },
            },
        });

        let jenisDokumens = await prisma.jenisDokumen.findMany({
            select: {
                JenisDokumenId: true,
                Jenis: true,
                NomorDokumen: true,
            },
        });

        let rawChart2 = pendaftarans.map((pendaftaran) => {
            const buktiFormsMap = new Map(
                pendaftaran.BuktiForm.map((bf) => [bf.JenisDokumenId, bf])
            );

            const buktiFormData = jenisDokumens.map((jenis) => {
                const found = buktiFormsMap.get(jenis.JenisDokumenId);
                return {
                JenisDokumen: jenis.Jenis,
                NomorDokumen: jenis.NomorDokumen,
                BuktiFormId: found?.BuktiFormId || null,
                Upload: found ? 1 : 0,
                };
            });

            return {
                PendaftaranId: pendaftaran.PendaftaranId,
                KodePendaftar: pendaftaran.KodePendaftar,
                BuktiForm: buktiFormData,
            };
        });

        data.push({chart2: rawChart2})
        pendaftarans = []
        jenisDokumens = []

        // Chart 3
        let chart3 = await prisma.pendaftaran.findMany({
            where: {
                Mahasiswa: {
                    UserId: session.user.id,
                },
            },
            select: {
                PendaftaranId: true,
                KodePendaftar: true,
                SanggahanAssesmen: {
                    select: {
                        SanggahanAssesmenId: true,
                        SanggahanAssesmenMk: {
                            select: {
                                MataKuliahMahasiswa: {
                                    select: { MataKuliah: { select: {Nama: true} } }
                                }
                            }
                        }
                    }
                },
                DaftarUlang: {
                    select: {
                        ProgramStudi: {
                            select: { Nama: true }
                        }
                    }
                }
            }
        })

        data.push({chart3: chart3.map(c => ({
            PendaftaranId: c.PendaftaranId,
            KodePendaftar: c.KodePendaftar,
            SanggahanAssesmen: c.SanggahanAssesmen.map(s => ({
                SanggahanAssesmenId: s.SanggahanAssesmenId,
                MataKuliah: s.SanggahanAssesmenMk.map(mk => mk.MataKuliahMahasiswa.MataKuliah.Nama).join(', '),
            })),
            ProgramStudi: c.DaftarUlang.length > 0 ? c.DaftarUlang[0].ProgramStudi.Nama : 'Tidak ada',
        }))})

        // Chart 4
        let pendaftaran2 = await prisma.pendaftaran.findMany({
            where: {
                Mahasiswa: {
                    UserId: session.user.id,
                },
            },
            select: {
                PendaftaranId: true,
                KodePendaftar: true,
                StatusMahasiswaAssesmentHistory: {
                select: {
                    StatusMahasiswaAssesmentId: true,
                    Tanggal: true,
                    Keterangan: true,
                    Aktif: true,
                    StatusMahasiswaAssesment: {
                    select: {
                        StatusMahasiswaAssesmentId: true,
                        NamaStatus: true,
                        Urutan: true,
                    },
                    },
                },
                },
            },
        });

        let allStatuses = await prisma.statusMahasiswaAssesment.findMany({
            select: {
                StatusMahasiswaAssesmentId: true,
                NamaStatus: true,
                Urutan: true,
            },
            orderBy: {
                Urutan: 'asc',
            },
        });
        
        let dataRaw = pendaftaran2.map((pendaftar) => {
            const historyMap = new Map<string, {
                Tanggal: Date | null;
                Keterangan: string | null;
                Aktif: boolean;
                Urutan: number;
            }>();

            let maxAktifUrutan = 0;

            pendaftar.StatusMahasiswaAssesmentHistory.forEach((h) => {
                historyMap.set(h.StatusMahasiswaAssesmentId, {
                Tanggal: h.Tanggal,
                Keterangan: h.Keterangan,
                Aktif: h.Aktif,
                Urutan: h.StatusMahasiswaAssesment.Urutan,
                });

                if (h.Aktif && h.StatusMahasiswaAssesment.Urutan > maxAktifUrutan) {
                maxAktifUrutan = h.StatusMahasiswaAssesment.Urutan;
                }
            });

            const statusList = allStatuses.map((status) => {
                const history = historyMap.get(status.StatusMahasiswaAssesmentId);
                return {
                    StatusId: status.StatusMahasiswaAssesmentId,
                    Status: status.NamaStatus,
                    Urutan: status.Urutan,
                    Tanggal: history?.Tanggal ?? null,
                    Keterangan: history?.Keterangan ?? null,
                    Aktif: status.Urutan <= maxAktifUrutan ? 1 : 0,
                };
            });

            return {
                PendaftaranId: pendaftar.PendaftaranId,
                KodePendaftar: pendaftar.KodePendaftar,
                Status: statusList,
            };
        });
        pendaftaran2 = []
        allStatuses=[]

        data.push({chart4: dataRaw})
        dataRaw = []
        
        return c.json({
            data: data,
            status: 'success',
            message: 'Chart data retrieved successfully',
        }, { status: 200})
    } else if (role.Name.match('Admin')) {
    } else if (role.Name.match('PMB')) {

        // chart 1 - Jumlah Mahasiswa per Program Studi
        let data = []
        const countPerProdi = await prisma.programStudi.findMany({
            where: { DeletedAt: null },
            select: {
                ProgramStudiId: true,
                Nama: true,
                _count: { select: { DaftarUlang: true }},
            },
        });

        const hasilPerProdi = countPerProdi.map(p => ({
            programStudiId: p.ProgramStudiId,
            programStudi: p.Nama,
            jumlahMahasiswa: p._count.DaftarUlang,
        }));

        data.push( {hasilPerProdi} );


        // Chart 2 - Jumlah Mahasiswa per status
        const byStatus = await prisma.statusMahasiswaAssesmentHistory.groupBy({
            by: ['StatusMahasiswaAssesmentId'],
            where: { Aktif: true },
            _count: { _all: true },
        });


        const allStatuses = await prisma.statusMahasiswaAssesment.findMany({
            select: { StatusMahasiswaAssesmentId: true, NamaStatus: true, Urutan: true },
            orderBy: { Urutan: 'asc' },
        });

        const byId = new Map(byStatus.map(s => [s.StatusMahasiswaAssesmentId, s._count._all]));

        const countPerStatusLengkap = allStatuses.map(s => ({
            statusId: s.StatusMahasiswaAssesmentId,
            status: s.NamaStatus,
            jumlah: byId.get(s.StatusMahasiswaAssesmentId) ?? 0,
        }));

        data.push({ countPerStatusLengkap });

        // Chart 3 - Jumlah MK per Program Studi
        const mkPerProdi = await prisma.programStudi.findMany({
            where: { DeletedAt: null },
            select: {
                ProgramStudiId: true,
                Nama: true,
                _count: {
                select: {
                    MataKuliah: true
                },
                },
            },
        });

        const hasilMK = mkPerProdi.map(p => ({
            programStudiId: p.ProgramStudiId,
            programStudi: p.Nama,
            jumlahMataKuliah: p._count.MataKuliah,
        }));

        data.push({ hasilMK });

        const prodis = await prisma.programStudi.findMany({
            where: { DeletedAt: null },
            select: { ProgramStudiId: true, Nama: true },
        });

        const hasilCP = await Promise.all(
        prodis.map(async (p) => {
            const countCP = await prisma.capaianPembelajaran.count({
            where: {
                DeletedAt: null,
                MataKuliah: {
                ProgramStudiId: p.ProgramStudiId,
                DeletedAt: null,
                },
                Active: true,
            },
            });

            return {
            programStudiId: p.ProgramStudiId,
            programStudi: p.Nama,
            jumlahCapaianPembelajaran: countCP,
            };
        }));

        data.push({ hasilCP });

        return c.json({
            data: data,
            status: 'success',
            message: 'Chart data retrieved successfully',
        },{ status: 200 })
    } else if (role.Name.match('Akademik')) {

        let data = []
        // Chart 1
        const [withRelationAsesor, withoutRelationAsesor] = await Promise.all([
            prisma.assesorMahasiswa.count({
                where: { 
                    Confirmation: true,
                    SkRektorAssesor: { some: {} } },
            }),
            prisma.assesorMahasiswa.count({
                where: { 
                    Confirmation: true,
                    SkRektorAssesor: { none: {} } },
            }),
        ]);

        data.push([
            {
                name: 'Asesor Sudah SK',
                total: withRelationAsesor,
                fill: 'var(--chart-1)',
            },{
                name: "Asesor Belum SK",
                total: withoutRelationAsesor,
                fill: 'var(--chart-2)',
            }
        ])

        const [withRelationMhs, withoutRelationMhs] = await Promise.all([
            prisma.pendaftaran.count({
                where: { SkRektorMahasiswa: { some: {} } },
            }),
            prisma.pendaftaran.count({
                where: { SkRektorMahasiswa: { none: {} } },
            }),
        ]);

        data.push([{
            name: 'Mahasiswa Sudah SK',
            total: withRelationMhs,
            fill: 'var(--chart-1)',
        }, {
            name: 'Mahasiswa Belum SK',
            total: withoutRelationMhs,
            fill: 'var(--chart-2)',
        }])

        return c.json(
            {
                data,
                status: 'success',
                message: 'Chart data retrieved successfully',
            },
            { status: 200 }
        )
    } else {
    }
})

export const GET = handle(app)

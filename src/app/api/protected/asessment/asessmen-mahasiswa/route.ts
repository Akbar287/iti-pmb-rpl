import { Prisma } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { getSession } from '@/provider/api'
import { ResponseMhsFromAsesorSession } from '@/types/PenunjukanAsesor'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/asessment/asessmen-mahasiswa')

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const session = await getSession()
    const jenis = c.req.query('jenis')

    if (session) {
        // if(jenis === 'fill-all-rekapitulasi') {
        //     const pendaftaranId = c.req.query('PendaftaranId')

        //     const temp= await prisma.pendaftaran.findFirst({select: {
        //         MataKuliahMahasiswa: {
        //             select: {
        //                 MataKuliahMahasiswaId: true,
        //                 SkorAssesmen: {select: {SkorAssesmenId: true}}
        //             }
        //         }
        //     }, where: {PendaftaranId: pendaftaranId}})

        //     let newData : SkorAssesmen[] = []
        //     temp?.MataKuliahMahasiswa.forEach(mkm => {
        //         if(mkm.SkorAssesmen.length === 0) {
        //             newData.push({
        //                 SkorAssesmenId: '',
        //                 MataKuliahMahasiswaId: mkm.MataKuliahMahasiswaId,
        //                 Portofolio: getRandomInt(80, 98),
        //                 Tulis: getRandomInt(80, 98),
        //                 Wawancara: getRandomInt(80, 98),
        //                 Demo: getRandomInt(80, 98),
        //                 Diakui: true,
        //                 SkorRataRata: getRandomInt(90, 99),
        //                 NilaiHuruf: 'A',
        //                 CreatedAt: new Date(),
        //                 UpdatedAt: new Date(),
        //             })
        //         }
        //     })

        //     const data = await prisma.skorAssesmen.createMany({data: newData.map(x => ({
        //         MataKuliahMahasiswaId: x.MataKuliahMahasiswaId,
        //         Portofolio: x.Portofolio,
        //         Tulis: x.Tulis,
        //         Wawancara: x.Wawancara,
        //         Demo: x.Demo,
        //         Diakui: x.Diakui,
        //         SkorRataRata: x.SkorRataRata,
        //         NilaiHuruf: x.NilaiHuruf,
        //         CreatedAt: x.CreatedAt,
        //         UpdatedAt: x.UpdatedAt,
        //     }))})

        //     return c.json({
        //         status: 'success', message: 'All data has been saved', data
        //     }, 200)
        // }

        // if(jenis === 'fill-all-asessment') {
        //     const pendaftaranId = c.req.query('PendaftaranId')

        //     const evaluasiDiriTanpaHasil = await prisma.evaluasiDiri.findMany({
        //         where: {
        //             MataKuliahMahasiswa: {
        //                 PendaftaranId: pendaftaranId,
        //             },
        //             HasilAssesmen: {
        //                 none: {}
        //             },
        //         },
        //         select: {
        //             EvaluasiDiriId: true,
        //         },
        //     });

        //     if (evaluasiDiriTanpaHasil.length === 0) {
        //         console.log("Semua assesmen sudah lengkap.");
        //         return;
        //     }

        //     const dataToCreate = evaluasiDiriTanpaHasil.map(ed => ({
        //         EvaluasiDiriId: ed.EvaluasiDiriId,
        //         Valid: true,
        //         Autentik: true,
        //         Terkini: true,
        //         Memadai: true,
        //         Assesmen: 'Data Lengkap, Bagus dan Sesuai dengan Keterampilan',
        //         Nilai: getRandomInt(80, 98),
        //         Diakui: true,
        //         TanggalAssesmen: new Date(),
        //     }));

        //     const result = await prisma.hasilAssesmen.createMany({
        //         data: dataToCreate,
        //     });

        //     return c.json(result, 200)
        // }

        if (jenis === 'get-mhs-from-asesor') {
            const page = parseInt(c.req.query('page') || '1', 10)
            const limit = parseInt(c.req.query('limit') || '10', 10)
            const search = c.req.query('search') || ''
            const isMahasiswa = c.req.query('_m')

            let where: Prisma.AsesorWhereInput = {}

            if (search) {
                if (isMahasiswa) {
                    where = {
                        AND: [
                            {
                                UserId: session.user.id,
                            },
                            {
                                AssesorMahasiswa: {
                                    some: {
                                        Pendaftaran: {
                                            StatusMahasiswaAssesmentHistory: {
                                                some: {
                                                    AND: [
                                                        {
                                                            StatusMahasiswaAssesment:
                                                                {
                                                                    NamaStatus:
                                                                        'Asessmen Oleh Asesor',
                                                                },
                                                        },
                                                        {
                                                            Aktif: true,
                                                        },
                                                    ],
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                            {
                                OR: [
                                    {
                                        User: {
                                            Nama: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                    },
                                    {
                                        AssesorMahasiswa: {
                                            some: {
                                                Pendaftaran: {
                                                    Mahasiswa: {
                                                        User: {
                                                            Nama: {
                                                                contains:
                                                                    search,
                                                                mode: 'insensitive',
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                ],
                            },
                        ]
                    }
                } else {
                    where = {
                        AND: [
                            {
                                UserId: session.user.id,
                            },
                            {
                                AssesorMahasiswa: {
                                    some: {
                                        Pendaftaran: {
                                            StatusMahasiswaAssesmentHistory: {
                                                some: {
                                                    AND: [
                                                        {
                                                            StatusMahasiswaAssesment:
                                                                {
                                                                    NamaStatus:
                                                                        'Asessmen Oleh Asesor',
                                                                },
                                                        },
                                                        {
                                                            Aktif: true,
                                                        },
                                                    ],
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                            {
                                OR: [
                                    {
                                        User: {
                                            Nama: {
                                                contains: search,
                                                mode: 'insensitive',
                                            },
                                        },
                                    },
                                    {
                                        AssesorMahasiswa: {
                                            some: {
                                                Pendaftaran: {
                                                    Mahasiswa: {
                                                        User: {
                                                            Nama: {
                                                                contains:
                                                                    search,
                                                                mode: 'insensitive',
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                ],
                            },
                        ]
                    }
                }
            } else {
                if (isMahasiswa) {
                    where = {
                        AND: [
                            {
                                UserId: session.user.id,
                            },
                            {
                                AssesorMahasiswa: {
                                    some: {
                                        Pendaftaran: {
                                            StatusMahasiswaAssesmentHistory: {
                                                some: {
                                                    AND: [
                                                        {
                                                            StatusMahasiswaAssesment:
                                                                {
                                                                    NamaStatus:
                                                                        'Asessmen Oleh Asesor',
                                                                },
                                                        },
                                                        {
                                                            Aktif: true,
                                                        },
                                                    ],
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        ],
                    }
                } else {
                    where = {
                        AND: [
                            {
                                UserId: session.user.id,
                            },
                            {
                                AssesorMahasiswa: {
                                    some: {
                                        Pendaftaran: {
                                            StatusMahasiswaAssesmentHistory: {
                                                some: {
                                                    AND: [
                                                        {
                                                            StatusMahasiswaAssesment:
                                                                {
                                                                    NamaStatus:
                                                                        'Asessmen Oleh Asesor',
                                                                },
                                                        },
                                                        {
                                                            Aktif: true,
                                                        },
                                                    ],
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        ],
                    }
                }
            }

            const [data, total] = await Promise.all([
                prisma.asesor.findFirst({
                    where,
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: { CreatedAt: 'desc' },
                    select: {
                        AssesorMahasiswa: {
                            select: {
                                Urutan: true,
                                Confirmation: true,
                                Pendaftaran: {
                                    select: {
                                        MataKuliahMahasiswa: {
                                            select: {
                                                _count: {
                                                    select: {
                                                        EvaluasiDiri: true,
                                                    },
                                                },
                                                EvaluasiDiri: {
                                                    select: {
                                                        _count: {
                                                            select: {
                                                                HasilAssesmen:
                                                                    true,
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                        PendaftaranId: true,
                                        StatusMahasiswaAssesmentHistory: {
                                            select: {
                                                Aktif: true,
                                                StatusMahasiswaAssesment: {
                                                    select: {
                                                        NamaStatus: true,
                                                    },
                                                },
                                            },
                                        },
                                        DaftarUlang: {
                                            select: {
                                                ProgramStudi: {
                                                    select: {
                                                        ProgramStudiId: true,
                                                        Nama: true,
                                                    },
                                                },
                                            },
                                        },
                                        Mahasiswa: {
                                            select: {
                                                User: {
                                                    select: {
                                                        UserId: true,
                                                        Nama: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                }),
                prisma.asesor.count({
                    where,
                }),
            ])
            let temp1 = 0,
                temp2 = 0

            const response: ResponseMhsFromAsesorSession[] =
                data?.AssesorMahasiswa.map((item) => {
                    ;(temp1 = 0), (temp2 = 0)
                    item.Pendaftaran.MataKuliahMahasiswa.forEach((mkm) => {
                        temp1 += mkm._count.EvaluasiDiri
                        mkm.EvaluasiDiri.forEach((ed) => {
                            temp2 += ed._count.HasilAssesmen
                        })
                    })

                    return {
                        UserId: item.Pendaftaran.Mahasiswa.User.UserId,
                        PendaftaranId: item.Pendaftaran.PendaftaranId,
                        Nama: item.Pendaftaran.Mahasiswa.User.Nama,
                        ProgramStudiId:
                            item.Pendaftaran.DaftarUlang.length > 0
                                ? item.Pendaftaran.DaftarUlang[0].ProgramStudi
                                      .ProgramStudiId
                                : '',
                        NamaProgramStudi:
                            item.Pendaftaran.DaftarUlang.length > 0
                                ? item.Pendaftaran.DaftarUlang[0].ProgramStudi
                                      .Nama
                                : '',
                        Confirmation: item.Confirmation,
                        Urutan: item.Urutan,
                        Status: item.Pendaftaran.StatusMahasiswaAssesmentHistory.find(
                            (x) => x.Aktif
                        )
                            ? item.Pendaftaran.StatusMahasiswaAssesmentHistory.find(
                                  (x) => x.Aktif
                              )?.StatusMahasiswaAssesment.NamaStatus ?? ''
                            : '',
                        TotalAsessmen: temp2,
                        TotalEval: temp1,
                    }
                }) ?? []

            return c.json<{
                data: ResponseMhsFromAsesorSession[]
                page: number
                limit: number
                totalElement: number
                totalPage: number
                isFirst: boolean
                isLast: boolean
                hasNext: boolean
                hasPrevious: boolean
            }>({
                page: page,
                limit: limit,
                data: response,
                totalElement: total,
                totalPage: Math.ceil(total / limit),
                isFirst: page === 1,
                isLast:
                    page === Math.ceil(total / limit) ||
                    Math.ceil(total / limit) === 0,
                hasNext: page < Math.ceil(total / limit),
                hasPrevious: page > 1,
            })
        }

        if (jenis === 'get-mhs-from-asesor-rekapitulasi') {
            const page = parseInt(c.req.query('page') || '1', 10)
            const limit = parseInt(c.req.query('limit') || '10', 10)
            const search = c.req.query('search') || ''
            const isMahasiswa = c.req.query('_m')

            let where: Prisma.AsesorWhereInput = {}
            if(search) {
                if(isMahasiswa) {
                    where ={
                          AND: [
                              {
                                  UserId: session.user.id,
                              },
                              {
                                  AssesorMahasiswa: {
                                      some: {
                                          Pendaftaran: {
                                              StatusMahasiswaAssesmentHistory: {
                                                  some: {
                                                      AND: [
                                                          {
                                                              StatusMahasiswaAssesment:
                                                                  {
                                                                      NamaStatus:
                                                                          'Rekapitulasi Asessmen',
                                                                  },
                                                          },
                                                          {
                                                              Aktif: true,
                                                          },
                                                      ],
                                                  },
                                              },
                                          },
                                      },
                                  },
                              },
                              {
                                  OR: [
                                      {
                                          User: {
                                              Nama: {
                                                  contains: search,
                                                  mode: 'insensitive',
                                              },
                                          },
                                      },
                                      {
                                          AssesorMahasiswa: {
                                              some: {
                                                  Pendaftaran: {
                                                      Mahasiswa: {
                                                          User: {
                                                              Nama: {
                                                                  contains: search,
                                                                  mode: 'insensitive',
                                                              },
                                                          },
                                                      },
                                                  },
                                              },
                                          },
                                      },
                                  ],
                              },
                          ],
                      }
                } else {
                    where ={
                          AND: [
                              {
                                  UserId: session.user.id,
                              },
                              {
                                  AssesorMahasiswa: {
                                      some: {
                                          Pendaftaran: {
                                              StatusMahasiswaAssesmentHistory: {
                                                  some: {
                                                      AND: [
                                                          {
                                                              StatusMahasiswaAssesment:
                                                                  {
                                                                      NamaStatus:
                                                                          'Rekapitulasi Asessmen',
                                                                  },
                                                          },
                                                          {
                                                              Aktif: true,
                                                          },
                                                      ],
                                                  },
                                              },
                                          },
                                      },
                                  },
                              },
                              {
                                  OR: [
                                      {
                                          User: {
                                              Nama: {
                                                  contains: search,
                                                  mode: 'insensitive',
                                              },
                                          },
                                      },
                                      {
                                          AssesorMahasiswa: {
                                              some: {
                                                  Pendaftaran: {
                                                      Mahasiswa: {
                                                          User: {
                                                              Nama: {
                                                                  contains: search,
                                                                  mode: 'insensitive',
                                                              },
                                                          },
                                                      },
                                                  },
                                              },
                                          },
                                      },
                                  ],
                              },
                          ],
                      }
                }
            } else {
                if(isMahasiswa) {
                    where = {
                          AND: [
                              {
                                  UserId: session.user.id,
                              },
                              {
                                  AssesorMahasiswa: {
                                      some: {
                                          Pendaftaran: {
                                              StatusMahasiswaAssesmentHistory: {
                                                  some: {
                                                      AND: [
                                                          {
                                                              StatusMahasiswaAssesment:
                                                                  {
                                                                      NamaStatus:
                                                                          'Rekapitulasi Asessmen',
                                                                  },
                                                          },
                                                          {
                                                              Aktif: true,
                                                          },
                                                      ],
                                                  },
                                              },
                                          },
                                      },
                                  },
                              },
                          ],
                      }
                } else {
                    where = {
                          AND: [
                              {
                                  UserId: session.user.id,
                              },
                              {
                                  AssesorMahasiswa: {
                                      some: {
                                          Pendaftaran: {
                                              StatusMahasiswaAssesmentHistory: {
                                                  some: {
                                                      AND: [
                                                          {
                                                              StatusMahasiswaAssesment:
                                                                  {
                                                                      NamaStatus:
                                                                          'Rekapitulasi Asessmen',
                                                                  },
                                                          },
                                                          {
                                                              Aktif: true,
                                                          },
                                                      ],
                                                  },
                                              },
                                          },
                                      },
                                  },
                              },
                          ],
                      }
                }
            }

            const [data, total] = await Promise.all([
                prisma.asesor.findFirst({
                    where,
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: { CreatedAt: 'desc' },
                    select: {
                        AssesorMahasiswa: {
                            select: {
                                Urutan: true,
                                Confirmation: true,
                                Pendaftaran: {
                                    select: {
                                        _count: {
                                            select: {
                                                MataKuliahMahasiswa: true,
                                            },
                                        },
                                        MataKuliahMahasiswa: {
                                            select: {
                                                _count: {
                                                    select: {
                                                        SkorAssesmen: true,
                                                    },
                                                },
                                            },
                                        },
                                        PendaftaranId: true,
                                        StatusMahasiswaAssesmentHistory: {
                                            select: {
                                                Aktif: true,
                                                StatusMahasiswaAssesment: {
                                                    select: {
                                                        NamaStatus: true,
                                                    },
                                                },
                                            },
                                        },
                                        DaftarUlang: {
                                            select: {
                                                ProgramStudi: {
                                                    select: {
                                                        ProgramStudiId: true,
                                                        Nama: true,
                                                    },
                                                },
                                            },
                                        },
                                        Mahasiswa: {
                                            select: {
                                                User: {
                                                    select: {
                                                        UserId: true,
                                                        Nama: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                }),
                prisma.asesor.count({
                    where,
                }),
            ])

            let temp: number[] = []
            data?.AssesorMahasiswa.forEach((am, index) => {
                temp[index] = 0;
                am.Pendaftaran.MataKuliahMahasiswa.forEach((mkm) => {
                    temp[index] += mkm._count.SkorAssesmen
                })
            })

            const response: ResponseMhsFromAsesorSession[] =
                data?.AssesorMahasiswa.map((item, idx) => {
                    return {
                        UserId: item.Pendaftaran.Mahasiswa.User.UserId,
                        PendaftaranId: item.Pendaftaran.PendaftaranId,
                        Nama: item.Pendaftaran.Mahasiswa.User.Nama,
                        ProgramStudiId:
                            item.Pendaftaran.DaftarUlang.length > 0
                                ? item.Pendaftaran.DaftarUlang[0].ProgramStudi
                                      .ProgramStudiId
                                : '',
                        NamaProgramStudi:
                            item.Pendaftaran.DaftarUlang.length > 0
                                ? item.Pendaftaran.DaftarUlang[0].ProgramStudi
                                      .Nama
                                : '',
                        Confirmation: item.Confirmation,
                        Urutan: item.Urutan,
                        Status: item.Pendaftaran.StatusMahasiswaAssesmentHistory.find(
                            (x) => x.Aktif
                        )
                            ? item.Pendaftaran.StatusMahasiswaAssesmentHistory.find(
                                  (x) => x.Aktif
                              )?.StatusMahasiswaAssesment.NamaStatus ?? ''
                            : '',
                        TotalAsessmen: temp[idx],
                        TotalEval: item.Pendaftaran._count.MataKuliahMahasiswa,
                    }
                }) ?? []

            return c.json<{
                data: ResponseMhsFromAsesorSession[]
                page: number
                limit: number
                totalElement: number
                totalPage: number
                isFirst: boolean
                isLast: boolean
                hasNext: boolean
                hasPrevious: boolean
            }>({
                page: page,
                limit: limit,
                data: response,
                totalElement: total,
                totalPage: Math.ceil(total / limit),
                isFirst: page === 1,
                isLast:
                    page === Math.ceil(total / limit) ||
                    Math.ceil(total / limit) === 0,
                hasNext: page < Math.ceil(total / limit),
                hasPrevious: page > 1,
            })
        }
        return c.json(
            {
                status: 'error',
                message: 'Query Salah',
                data: [],
            },
            404
        )
    }

    return c.json(
        {
            status: 'error',
            message: 'Data tidak ditemukan',
            data: [],
        },
        404
    )
})

app.post('/', async (c) => {
    const body: {
        SkorAssesmenId: string
        MataKuliahMahasiswaId: string
        Portofolio: number
        Tulis: number
        Wawancara: number
        Demo: number
        Diakui: boolean
        SkorRataRata: number
        NilaiHuruf: string | null
    } = await c.req.json()

    const ha = await prisma.skorAssesmen.upsert({
        where: {
            MataKuliahMahasiswaId: body.MataKuliahMahasiswaId,
        },
        update: {
            MataKuliahMahasiswaId: body.MataKuliahMahasiswaId,
            Portofolio: body.Portofolio,
            Tulis: body.Tulis,
            Wawancara: body.Wawancara,
            Demo: body.Demo,
            Diakui: body.Diakui,
            SkorRataRata: body.SkorRataRata,
            NilaiHuruf: body.NilaiHuruf,
            UpdatedAt: new Date(),
        },
        create: {
            MataKuliahMahasiswaId: body.MataKuliahMahasiswaId,
            Portofolio: body.Portofolio,
            Tulis: body.Tulis,
            Wawancara: body.Wawancara,
            Demo: body.Demo,
            Diakui: body.Diakui,
            SkorRataRata: body.SkorRataRata,
            NilaiHuruf: body.NilaiHuruf,
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
        },
    })

    return c.json<{
        SkorAssesmenId: string
        MataKuliahMahasiswaId: string
        Portofolio: number
        Tulis: number
        Wawancara: number
        Demo: number
        Diakui: boolean
        SkorRataRata: number
        NilaiHuruf: string | null
    }>(
        {
            SkorAssesmenId: ha.SkorAssesmenId,
            MataKuliahMahasiswaId: ha.MataKuliahMahasiswaId,
            Portofolio: ha.Portofolio,
            Tulis: ha.Tulis,
            Wawancara: ha.Wawancara,
            Demo: ha.Demo,
            Diakui: ha.Diakui,
            SkorRataRata: ha.SkorRataRata,
            NilaiHuruf: ha.NilaiHuruf,
        },
        200
    )
})
app.put('/', async (c) => {
    const body: {
        HasilAssesmenId: string
        EvaluasiDiriId: string
        Valid: boolean
        Autentik: boolean
        Terkini: boolean
        Memadai: boolean
        Assesmen: string
        Nilai: number
        TanggalAssesmen: Date
    } = await c.req.json()

    const ha = await prisma.hasilAssesmen.upsert({
        where: {
            EvaluasiDiriId: body.EvaluasiDiriId,
        },
        update: {
            Valid: body.Valid,
            Autentik: body.Autentik,
            Terkini: body.Terkini,
            Memadai: body.Memadai,
            Assesmen: body.Assesmen,
            Nilai: body.Nilai,
            TanggalAssesmen: body.TanggalAssesmen,
            UpdatedAt: new Date(),
        },
        create: {
            EvaluasiDiriId: body.EvaluasiDiriId,
            Valid: body.Valid,
            Autentik: body.Autentik,
            Terkini: body.Terkini,
            Memadai: body.Memadai,
            Assesmen: body.Assesmen,
            Nilai: body.Nilai,
            TanggalAssesmen: body.TanggalAssesmen,
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
        },
    })

    return c.json<{
        HasilAssesmenId: string
        EvaluasiDiriId: string
        Valid: boolean
        Autentik: boolean
        Terkini: boolean
        Memadai: boolean
        Assesmen: string
        Nilai: number
        TanggalAssesmen: Date
    }>(
        {
            HasilAssesmenId: ha.HasilAssesmenId,
            EvaluasiDiriId: ha.EvaluasiDiriId,
            Valid: ha.Valid,
            Autentik: ha.Autentik,
            Terkini: ha.Terkini,
            Memadai: ha.Memadai,
            Assesmen: ha.Assesmen ?? '',
            Nilai: ha.Nilai,
            TanggalAssesmen: ha.TanggalAssesmen ?? new Date(),
        },
        200
    )
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)

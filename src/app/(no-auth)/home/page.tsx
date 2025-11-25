import React from 'react'
import About from '@/components/website/halaman_utama/About'
import Advantages from '@/components/website/halaman_utama/Advantages'
import Community from '@/components/website/halaman_utama/Community'
import Events from '@/components/website/halaman_utama/Events'
import Hero from '@/components/website/halaman_utama/Hero'
import News from '@/components/website/halaman_utama/News'
import { prisma } from '@/lib/prisma'

const Page = async () => {
    const dbData = await prisma.settingMainPage.findFirst({
        select: {
            SettingMainPageId: true,
            UniversityId: true,
            TextMainPage1: true,
            TextMainPage2: true,
            TextMainPage3: true,
            SelayangPandangText: true,
            SelayangPandangDeskripsi: true,
            WhyText: true,
            WhyDeskripsi: true,
            CommunityText: true,
            CommunityDeskripsi: true,
            KegiatanText: true,
            KegiatanDeskripsi: true,
            TestomoniText: true,
            TestomoniDeskripsi: true,
            BeritaText: true,
            BeritaDeskripsi: true,
            SettingCommunity: {
                select: {
                    SettingCommunityId: true,
                    SettingMainPageId: true,
                    Title: true,
                },
            },
            SettingBerita: {
                select: {
                    SettingBeritaId: true,
                    SettingMainPageId: true,
                    Title: true,
                    Deskripsi: true,
                    Populer: true,
                    Waktu: true,
                    KategoriBerita: {
                        select: {
                            Nama: true,
                        },
                    },
                },
            },
            SettingNumber: true,
            SettingTestimony: {
                select: {
                    SettingTestimonyId: true,
                    SettingMainPageId: true,
                    Nama: true,
                    Jabatan: true,
                    JurusanTahun: true,
                    Testimoni: true,
                },
            },
            SettingWhy: true,
        },
        where: {
            University: {
                Nama: 'Institut Teknologi Indonesia (ITI)',
            },
        },
    })

    const jenisKegiatan = await prisma.jenisKegiatan.findMany()

    // console.dir(dbData, { depth: null })

    return (
        <React.Fragment>
            <Hero
                data={
                    dbData
                        ? {
                              SettingMainPageId: dbData.SettingMainPageId,
                              TextMainPage1: dbData.TextMainPage1,
                              TextMainPage2: dbData.TextMainPage2,
                              TextMainPage3: dbData.TextMainPage3,
                          }
                        : null
                }
            />
            <div className="bg-white/80 dark:bg-gray-700">
                <About
                    text={
                        dbData
                            ? {
                                  SettingMainPageId: dbData.SettingMainPageId,
                                  SelayangPandangText:
                                      dbData.SelayangPandangText,
                                  SelayangPandangDeskripsi:
                                      dbData.SelayangPandangDeskripsi,
                              }
                            : null
                    }
                    data={dbData ? dbData.SettingNumber : null}
                />
                <Advantages
                    text={
                        dbData
                            ? {
                                  WhyText: dbData.WhyText,
                                  WhyDeskripsi: dbData.WhyDeskripsi,
                              }
                            : null
                    }
                    data={dbData ? dbData.SettingWhy : null}
                />
                <Community
                    text={
                        dbData
                            ? {
                                  CommunityText: dbData.CommunityText,
                                  CommunityDeskripsi: dbData.CommunityDeskripsi,
                                  TestomoniText: dbData.TestomoniText,
                                  TestomoniDeskripsi: dbData.TestomoniDeskripsi,
                              }
                            : null
                    }
                    data={dbData ? dbData.SettingCommunity : null}
                    testimony={dbData ? dbData.SettingTestimony : null}
                />
                <Events
                    jenisKegiatan={jenisKegiatan ? jenisKegiatan : null}
                    SettingMainPageId={dbData ? dbData.SettingMainPageId : null}
                />
                <News
                    text={
                        dbData
                            ? {
                                  BeritaText: dbData.BeritaText,
                                  BeritaDeskripsi: dbData.BeritaDeskripsi,
                              }
                            : null
                    }
                    data={dbData ? dbData.SettingBerita : null}
                />
                {/* <Resources />
                <FocusTopics /> */}
            </div>
        </React.Fragment>
    )
}

export default Page

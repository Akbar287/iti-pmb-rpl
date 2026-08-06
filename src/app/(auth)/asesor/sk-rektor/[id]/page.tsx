import TambahSkRektorAsesorComponent from '@/components/asesor/TambahSkRektorAsesorComponent'
import React from 'react'
import { prisma } from '@/lib/prisma'

// Halaman penerbitan / perubahan SK Penugasan Asesor.
// `id` berisi SkRektorId, atau "baru" untuk menerbitkan SK baru.
const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params

    const sk =
        id === 'baru'
            ? null
            : await prisma.skRektor.findFirst({
                where: { SkRektorId: id },
                select: {
                    SkRektorId: true,
                    NamaSk: true,
                    TahunSk: true,
                    NomorSk: true,
                    NamaFile: true,
                    NamaDokumen: true,
                    Disetujui: true,
                    DisetujuiPada: true,
                    Catatan: true,
                    SkRektorAssesor: {
                        select: {
                            Asesor: {
                                select: {
                                    AsesorId: true,
                                    TipeAsesor: { select: { Nama: true } },
                                    User: {
                                        select: { Nama: true, Email: true },
                                    },
                                },
                            },
                        },
                    },
                },
            })

    const dataServer = {
        SkRektorId: sk?.SkRektorId ?? '',
        NamaSk: sk?.NamaSk ?? '',
        TahunSk: sk ? String(sk.TahunSk) : String(new Date().getFullYear()),
        NomorSk: sk?.NomorSk ?? '',
        NamaFile: sk?.NamaFile ?? '',
        NamaDokumen: sk?.NamaDokumen ?? '',
        Disetujui: sk?.Disetujui ?? false,
        Catatan: sk?.Catatan ?? '',
        Asesor:
            sk?.SkRektorAssesor.map((x) => ({
                AsesorId: x.Asesor.AsesorId,
                NamaAsesor: x.Asesor.User.Nama,
                NamaTipeAsesor: x.Asesor.TipeAsesor.Nama,
                Email: x.Asesor.User.Email,
            })) ?? [],
    }

    return (
        <div className="p-6">
            <h1 className="mb-4 text-2xl font-bold">
                {sk ? 'Ubah SK Penugasan Asesor' : 'Terbitkan SK Penugasan Asesor'}
            </h1>
            <TambahSkRektorAsesorComponent dataServer={dataServer} />
        </div>
    )
}

export default Page

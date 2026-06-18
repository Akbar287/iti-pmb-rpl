import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/provider/api'
import { Session } from 'next-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const app = new Hono().basePath('/api/protected/notifikasi')

app.use('*', withApiAuth)

export interface NotifikasiItem {
    id: string
    tipe: 'status' | 'ticket'
    judul: string
    pesan: string
    url: string
    createdAt: string
}

app.get('/', async (c) => {
    const session: Session | null = await getSession()
    if (!session?.user?.id) {
        return c.json(
            { data: [], status: 'error', message: 'Session not found' },
            { status: 401 }
        )
    }

    const userId = session.user.id
    const roleIds = (session.user.roles ?? []).map((r) => r.RoleId)

    // Notifikasi 1: perubahan status pendaftaran milik mahasiswa ybs.
    const statusEvents = await prisma.statusMahasiswaAssesmentHistory.findMany({
        where: {
            Tanggal: { not: null },
            Pendaftaran: { Mahasiswa: { UserId: userId } },
        },
        select: {
            StatusMahasiswaAssesmentHistoryId: true,
            Tanggal: true,
            Keterangan: true,
            StatusMahasiswaAssesment: { select: { NamaStatus: true } },
            Pendaftaran: { select: { KodePendaftar: true } },
        },
        orderBy: { Tanggal: 'desc' },
        take: 50,
    })

    // Notifikasi 2: tiket bantuan yang dibuat user atau ditujukan ke role-nya.
    const tickets = await prisma.tickets.findMany({
        where: {
            OR: [
                { UserId: userId },
                ...(roleIds.length ? [{ KepadaRoleId: { in: roleIds } }] : []),
            ],
        },
        select: {
            TicketsId: true,
            Subject: true,
            Message: true,
            Status: true,
            UpdatedAt: true,
        },
        orderBy: { UpdatedAt: 'desc' },
        take: 50,
    })

    const notifikasi: NotifikasiItem[] = [
        ...statusEvents.map((s) => ({
            id: `status-${s.StatusMahasiswaAssesmentHistoryId}`,
            tipe: 'status' as const,
            judul: `Status: ${s.StatusMahasiswaAssesment.NamaStatus}`,
            pesan:
                s.Keterangan ||
                `Pendaftaran ${s.Pendaftaran.KodePendaftar} kini berstatus "${s.StatusMahasiswaAssesment.NamaStatus}".`,
            url: '/asessment/hasil-asessmen',
            createdAt: (s.Tanggal as Date).toISOString(),
        })),
        ...tickets.map((t) => ({
            id: `ticket-${t.TicketsId}`,
            tipe: 'ticket' as const,
            judul: `Tiket: ${t.Subject}`,
            pesan: `${t.Message}${t.Status ? ` · ${t.Status}` : ''}`,
            url: '/tickets',
            createdAt: t.UpdatedAt.toISOString(),
        })),
    ].sort(
        (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return c.json(
        {
            data: notifikasi.slice(0, 80),
            status: 'success',
            message: 'Notifikasi retrieved successfully',
        },
        { status: 200 }
    )
})

export const GET = handle(app)

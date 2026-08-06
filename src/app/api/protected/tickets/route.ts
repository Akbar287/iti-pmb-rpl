import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { prisma } from '@/lib/prisma'
import { Prisma, StatusTiketBantuan } from '@/generated/prisma'
import { Pagination } from '@/types/Pagination'
import { Tickets, TicketsDetail } from '@/types/TicketsTypes'

const app = new Hono().basePath('/api/protected/tickets')

app.use('*', withApiAuth);

app.get('/', async (c) => {
    const id = c.req.query('id')
    const page = Number(c.req.query('page') ?? '1')
    const limit = Number(c.req.query('limit') ?? '10')
    const search = c.req.query('search') ?? ''
    const userId = c.req.query('userId') ?? ''
    const roleId = c.req.query('roleId') ?? ''
    const status = c.req.query('status') ?? ''

    if (id) {
        const data = await prisma.tickets.findFirst({
            where: {
                TicketsId: id,
            },
            select: {
                TicketsId: true,
                UserId: true,
                User: {
                    select: {
                        Nama: true
                    }
                },
                Role: {
                    select: {
                        RoleId: true,
                        Name: true
                    }
                },
                KepadaRole: {
                    select: {
                        RoleId: true,
                        Name: true
                    }
                },
                Subject: true,
                Message: true,
                Status: true,
                CreatedAt: true,
                UpdatedAt: true,
                ticketsFiles: {
                    select: {
                        TicketsFileId: true,
                        TicketsId: true,
                        NamaFile: true,
                        NamaDokumen: true,
                        CreatedAt: true,
                        UpdatedAt: true,
                    }
                }
            }
        })
        if (!data) {
            return c.json({ error: 'Not Found' }, 404)
        }
        return c.json<TicketsDetail>({
            TicketsId: data.TicketsId,
            UserId: data.UserId,
            NamaUser: data.User.Nama,
            RoleId: data.Role.RoleId,
            NamaRole: data.Role.Name,
            KepadaRoleId: data.KepadaRole.RoleId,
            NamaKepadaRole: data.KepadaRole.Name,
            Subject: data.Subject,
            Message: data.Message,
            Status: data.Status,
            CreatedAt: data.CreatedAt,
            UpdatedAt: data.UpdatedAt,
            File: data.ticketsFiles.map((file) => ({
                TicketsFileId: file.TicketsFileId,
                NamaFile: file.NamaFile,
                NamaDokumen: file.NamaDokumen,
            }))
        }, 200)
    } else if (page && limit) {
        // Build filter with all conditions
        const conditions: Prisma.TicketsWhereInput[] = []

        if (userId) {
            conditions.push({ UserId: userId })
        }
        if (roleId) {
            conditions.push({ KepadaRoleId: roleId })
        }
        if (status) {
            conditions.push({ Status: status as StatusTiketBantuan })
        }
        if (search) {
            conditions.push({
                OR: [
                    { Subject: { contains: search, mode: 'insensitive' } },
                    { Message: { contains: search, mode: 'insensitive' } }
                ]
            })
        }

        const where: Prisma.TicketsWhereInput = conditions.length > 0 ? { AND: conditions } : {}

        const [data, total] = await Promise.all([
            prisma.tickets.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { CreatedAt: 'desc' },
                select: {
                    TicketsId: true,
                    User: {
                        select: {
                            Nama: true
                        }
                    },
                    Role: {
                        select: {
                            Name: true
                        }
                    },
                    KepadaRole: {
                        select: {
                            Name: true
                        }
                    },
                    Subject: true,
                    Message: true,
                    Status: true,
                }
            }),

            prisma.tickets.count({ where }),
        ])

        return c.json<Pagination<Tickets[]>>({
            page: page,
            limit: limit,
            data: data.map((ticket) => ({
                TicketsId: ticket.TicketsId,
                NamaPengaju: ticket.User.Nama,
                NamaKepadaRole: ticket.KepadaRole.Name,
                Subject: ticket.Subject,
                Message: ticket.Message,
                Status: ticket.Status
            })),
            totalElement: total,
            totalPage: Math.ceil(total / limit),
            isFirst: page === 1,
            isLast:
                page === Math.ceil(total / limit) ||
                Math.ceil(total / limit) === 0,
            hasNext: page < Math.ceil(total / limit),
            hasPrevious: page > 1,
        })
    } else {
        return c.json({ error: 'Not Found' }, 404);
    }
});

app.post('/', async (c) => {
    const body = await c.req.json()
    const data = await prisma.tickets.create({
        data: {
            TicketsId: body.TicketsId,
            UserId: body.UserId,
            RoleId: body.RoleId,
            KepadaRoleId: body.KepadaRoleId,
            Subject: body.Subject,
            Message: body.Message,
            Status: StatusTiketBantuan.PENDING,
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
        },
        select: {
            TicketsId: true,
            User: {
                select: {
                    Nama: true
                }
            },
            KepadaRole: {
                select: {
                    Name: true
                }
            },
            Subject: true,
            Message: true,
            Status: true,
        }
    })
    return c.json<Tickets>({
        TicketsId: data.TicketsId,
        NamaPengaju: data.User.Nama,
        NamaKepadaRole: data.KepadaRole.Name,
        Subject: data.Subject,
        Message: data.Message,
        Status: data.Status
    }, 201)
})

app.put('/', async (c) => {
    const body = await c.req.json()
    const data = await prisma.tickets.update({
        where: {
            TicketsId: body.TicketsId,
        },
        data: {
            TicketsId: body.TicketsId,
            UserId: body.UserId,
            RoleId: body.RoleId,
            KepadaRoleId: body.KepadaRoleId,
            Subject: body.Subject,
            Message: body.Message,
            Status: body.Status,
            UpdatedAt: new Date(),
        },
        select: {
            TicketsId: true,
            User: {
                select: {
                    Nama: true
                }
            },
            KepadaRole: {
                select: {
                    Name: true
                }
            },
            Subject: true,
            Message: true,
            Status: true,
        }
    })
    return c.json<Tickets>({
        TicketsId: data.TicketsId,
        NamaPengaju: data.User.Nama,
        NamaKepadaRole: data.KepadaRole.Name,
        Subject: data.Subject,
        Message: data.Message,
        Status: data.Status
    }, 200)
})

app.delete('/', async (c) => {
    const id = c.req.query('id')
    await prisma.tickets.delete({
        where: {
            TicketsId: id,
        },
    })
    return c.json<null>(null, 200)
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { getSession } from '@/provider/api'
import { UserCreateFormValidation } from '@/validation/ProfilValidation'
import { prisma } from '@/lib/prisma'

const app = new Hono().basePath('/api/protected/profile')

app.use('*', withApiAuth); 

app.put('/', async (c) => {
    const session = await getSession();
    const temp = await prisma.user.findFirst({
        select: {
            UserId: true,
            Userlogin: {
                select: {
                    UserloginId: true,
                    Credential: true
                }
            },
            AlamatId: true
        }, where: {
            UserId: session?.user.id
        }
    })
    const body: UserCreateFormValidation = await c.req.json()
    
    const user = await prisma.user.update({
        data: {
            Nama: body.Nama,
            Email: body.Email,
            TempatLahir: body.TempatLahir,
            TanggalLahir: body.TanggalLahir,
            JenisKelamin: body.JenisKelamin,
            PendidikanTerakhir: body.PendidikanTerakhir,
            Avatar: body.Avatar,
            Agama: body.Agama,
            Telepon: body.Telepon,
            NomorWa: body.NomorWa,
            NomorHp: body.NomorHp,
        },
        where: {
            UserId: session?.user.id
        }
    })

    const userlogin = await prisma.userlogin.update({
        data: {
            Username: body.Username,
        },
        where: {
            UserloginId: temp?.Userlogin.find(c => c.Credential === 'credential')?.UserloginId as string
        }
    })

    const alamat = await prisma.alamat.update({
        data: {
            DesaId: body.DesaId,
            Alamat: body.Alamat, 
            KodePos: body.KodePos,
        }, 
        where: {
            AlamatId: temp?.AlamatId
        }
    })

    return c.json({

    });
})

export const PUT = handle(app)
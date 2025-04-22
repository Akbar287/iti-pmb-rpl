import { PrismaClient } from '@/generated/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { getSession } from '@/provider/api'
import bcrypt from "bcrypt"

const app = new Hono().basePath('/api/protected/profile/password')
const prisma = new PrismaClient()

app.use('*', withApiAuth); 

app.put('/', async (c) => {
    const session = await getSession();
    const temp = await prisma.user.findFirst({
        select: {
            UserId: true,
            Userlogin: {
                select: {
                    Password: true,
                    UserloginId: true,
                    Credential: true
                }
            },
            AlamatId: true
        },
        where: {
            UserId: session?.user.id
        }
    })
    const body: {
        password_lama: string
        password_baru: string
    } = await c.req.json()

    const existingPassword = temp?.Userlogin.find(c => c.Credential === 'credential')?.Password;
    if (!existingPassword) {
        throw new Error('Existing password not found');
    }
    if (await bcrypt.compare(body.password_lama, existingPassword)) {
        await prisma.userlogin.update({
            data: {
                Password: await bcrypt.hash(body.password_baru, await bcrypt.genSalt(10)),
            },
            where: {
                UserloginId: temp?.Userlogin.find(c => c.Credential === 'credential')?.UserloginId as string
            }
        })
        return c.json({
            data: [],
            message: "Berhasil Ubah Password"
        });
    } else {
        return c.json({
            data: [],
            message: "Password Lama Salah"
        });
    }
    

})

export const PUT = handle(app)
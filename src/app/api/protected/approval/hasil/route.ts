import { Prisma } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { RequestPenunjukanAsesor, ResponseAsesorFromProdi, ResponseMhsFromAsesor, ResponsePenunjukanAsesor } from '@/types/PenunjukanAsesor'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/approval/hasil')

app.use('*', withApiAuth)

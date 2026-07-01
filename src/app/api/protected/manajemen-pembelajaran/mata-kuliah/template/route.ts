import { readFile } from 'fs/promises'
import path from 'path'
import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

export const runtime = 'nodejs'

const app = new Hono().basePath(
    '/api/protected/manajemen-pembelajaran/mata-kuliah/template'
)

app.use('*', withApiAuth)

app.get('/', async (c) => {
    const filePath = path.join(
        process.cwd(),
        'src',
        'assets',
        'files',
        'template-mata-kuliah.xls'
    )
    const file = await readFile(filePath)

    return c.body(file as unknown as ArrayBuffer, 200, {
        'Content-Type': 'application/vnd.ms-excel',
        'Content-Disposition':
            'attachment; filename="template-mata-kuliah.xls"',
        'Cache-Control': 'private, max-age=3600',
    })
})

export const GET = handle(app)

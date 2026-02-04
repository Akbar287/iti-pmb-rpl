import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { FonnteResponse, MessageOptions } from 'fonnte-wa'
import { getFonnteClient } from '@/config/fonnet'

const app = new Hono().basePath('/api/protected/whatsapp')

app.use('*', withApiAuth)

app.post('/', async (c) => {
  const Jenis = c.req.query('jenis')

  if (!Jenis) {
    return c.json(
      { status: 'error', message: 'param jenis not found', data: null },
      400
    )
  }

  if (Jenis === 'sendWaText') {
    const target = c.req.query('target')
    const message = c.req.query('message')

    if (!target || !message) {
      return c.json(
        { status: 'error', message: 'param not found', data: null },
        400
      )
    }

    const options: MessageOptions = { target, message }
    const res = await getFonnteClient().sendMessage(options)

    if (!res.status) {
      console.error('Fonnte sendWaText gagal:', res.message)
    }

    return c.json(res)
  }

  if (Jenis === 'sendWaBroadcast') {
    const targets = c.req.queries('target')
    const message = c.req.query('message')

    if (!targets || !message) {
      return c.json(
        { status: 'error', message: 'param not found', data: null },
        400
      )
    }

    const results: FonnteResponse[] = []

    for (const target of targets) {
      const res = await getFonnteClient().sendMessage({ target, message })
      results.push(res)
    }

    return c.json({
      status: true,
      message: 'broadcast sent',
      data: results,
    })
  }

  if (Jenis === 'sendWaButtons') {
    const target = c.req.query('target')
    const message = c.req.query('message')

    if (!target || !message) {
      return c.json(
        { status: 'error', message: 'param not found', data: null },
        400
      )
    }

    const res = await getFonnteClient().sendButtons({
      target,
      message,
      buttonTemplate: {
        buttons: [
          { display: 'Option 1', id: 'opt1' },
          { display: 'Option 2', id: 'opt2' },
          { display: 'Option 3', id: 'opt3' },
        ],
      },
      footer: 'Footer text (optional)',
      header: 'Header text (optional)',
    })

    return c.json(res)
  }

  if (Jenis === 'sendWaList') {
    const target = c.req.query('target')
    const message = c.req.query('message')

    if (!target || !message) {
      return c.json(
        { status: 'error', message: 'param not found', data: null },
        400
      )
    }

    const res = await getFonnteClient().sendList({
      target,
      message,
      listTemplate: {
        title: 'Available options',
        sections: [
          {
            title: 'Section 1',
            rows: [
              {
                title: 'Item 1',
                description: 'Description 1',
                id: 'item1',
              },
              {
                title: 'Item 2',
                description: 'Description 2',
                id: 'item2',
              },
            ],
          },
          {
            title: 'Section 2',
            rows: [
              {
                title: 'Item 3',
                description: 'Description 3',
                id: 'item3',
              },
              {
                title: 'Item 4',
                description: 'Description 4',
                id: 'item4',
              },
            ],
          },
        ],
      },
      footer: 'Footer text (optional)',
    })

    return c.json(res)
  }

  // default (jenis tidak dikenal)
  return c.json(
    {
      status: 'error',
      data: [],
      message: 'api not found',
    },
    404
  )
})

export const POST = handle(app)


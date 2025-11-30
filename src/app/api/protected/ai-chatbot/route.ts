import { Hono } from 'hono'
import { streamText, CoreMessage, gateway } from "ai";
import { handle } from 'hono/vercel'
import { AiChatNoAuth } from "@/config/ai"

const app = new Hono().basePath('/api/protected/ai-chatbot')

export const runtime = 'nodejs'

app.post('/', async (c) => {
    const body = await c.req.json()
    const messages = (body.messages ?? []) as { role: string; content: string }[]
    const aiMessages: CoreMessage[] = [
        ...messages.map((m) => ({
            role: m.role as 'user' | 'assistant' | 'system',
            content: m.content,
        })),
    ]

    const result = await streamText({
        model: gateway(AiChatNoAuth ? AiChatNoAuth : 'groq/gpt-oss-20b'),
        temperature: 0,
        topP: 0.9,
        messages: aiMessages,
    })

    const encoder = new TextEncoder()

    const stream = new ReadableStream({
        async start(controller) {
            try {
                for await (const chunk of result.textStream) {
                    controller.enqueue(encoder.encode(chunk))
                }
                controller.close()
            } catch (err) {
                console.error('stream error', err)
                controller.error(err)
            }
        },
    })

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
        },
    })
})

export const POST = handle(app)

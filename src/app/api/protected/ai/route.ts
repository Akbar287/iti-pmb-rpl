import { withApiAuth } from '@/middlewares/api-auth'
import { Hono } from 'hono'
import { streamText } from "ai";
import { ollama } from "ollama-ai-provider-v2";
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/ai')

app.use('*', withApiAuth)

app.post('/', async (c) => {
    const jenis = c.req.query('_j')

    if (jenis === 'image') {
        const { prompt, imagesBase64 } = await c.req.json<{
            prompt: string;
            imagesBase64: string[];
        }>();

        const result = await streamText({
            model: ollama("qwen2.5vl:7b"),
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: prompt || "Analisis semua gambar berikut.",
                        },
                        ...(imagesBase64 || []).map((img) => ({
                            type: "image" as const,
                            image: img,
                        })),
                    ],
                },
            ],
        });

        // Bungkus textStream jadi ReadableStream plain text
        const encoder = new TextEncoder();

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of result.textStream) {
                        controller.enqueue(encoder.encode(chunk));
                    }
                } catch (err) {
                    console.error("stream error", err);
                } finally {
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "no-cache",
            },
        });
    } else {
        return c.json(null)
    }
})

export const POST = handle(app)
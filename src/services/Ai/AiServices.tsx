
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL


export type ChatMessageDTO = {
  role: 'user' | 'assistant' | 'system'
  content: string
}

// AI Asessment
export async function streamChat(
  HasilAsessmentId: string,
  messages: ChatMessageDTO[],
  onChunk: (chunk: string) => void,
) {
  const res = await fetch(`${BASE_URL}/api/protected/ai?_h=${HasilAsessmentId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
  })

  if (!res.body) throw new Error('Response body is null')

  const reader = res.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    const textChunk = decoder.decode(value, { stream: true })
    if (textChunk) onChunk(textChunk)
  }
}

// Rekapitulasi
export async function streamChatRekapitulasi(
  SkorAsessmentId: string,
  messages: ChatMessageDTO[],
  onChunk: (chunk: string) => void,
) {
  const res = await fetch(`${BASE_URL}/api/protected/ai?_s=${SkorAsessmentId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
  })

  if (!res.body) throw new Error('Response body is null')

  const reader = res.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    const textChunk = decoder.decode(value, { stream: true })
    if (textChunk) onChunk(textChunk)
  }
}

// AI Chatbot / No Auth
export async function streamChatbot(
  messages: ChatMessageDTO[],
  onChunk: (chunk: string) => void,
) {
  const res = await fetch(`${BASE_URL}/api/protected/ai-chatbot`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
  })

  if (!res.body) throw new Error('Response body is null')

  const reader = res.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    const textChunk = decoder.decode(value, { stream: true })
    if (textChunk) onChunk(textChunk)
  }
}
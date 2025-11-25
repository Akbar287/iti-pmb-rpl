import {
  FonnteResponse,
} from 'fonnte-wa'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function sendWaText(
  target: string,
  message: string,
): Promise<FonnteResponse> {
  const params = new URLSearchParams({
    target: String(target),
    message: String(message),
    jenis: String('sendWaText'),
  })
  const res = await fetch(
    `${BASE_URL}/api/protected/whatsapp?${params.toString()}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }
  )
  if (!res.ok) throw new Error('Failed to send Wa')
  return res.json()
}

export async function sendWaBroadcast(
  target: string[],
  message: string,
): Promise<FonnteResponse[]> {
  const temp = target.map((n) => `target=${encodeURIComponent(n)}`).join("&")
  const params = new URLSearchParams({
    message: String(message),
    jenis: String('sendWaBroadcast'),
  })
  const res = await fetch(
    `${BASE_URL}/api/protected/whatsapp?${temp}&${params.toString()}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }
  )
  if (!res.ok) throw new Error('Failed to send Wa braodcast')
  return res.json()
}

export async function sendWaButtons(
  target: string,
  message: string,
): Promise<FonnteResponse> {
  const params = new URLSearchParams({
    target: String(target),
    message: String(message),
    jenis: String('sendWaButtons'),
  })
  const res = await fetch(
    `${BASE_URL}/api/protected/whatsapp?${params.toString()}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }
  )
  if (!res.ok) throw new Error('Failed to send Wa button')
  return res.json()
}

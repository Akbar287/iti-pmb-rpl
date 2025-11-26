export function normalizeJson<T>(text: string): T {
  const noFence = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const match = noFence.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("JSON tidak ditemukan di output LLM");
  }

  return JSON.parse(match[0]) as T;
}

export async function fileToBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

export async function streamAnalyzeImages(opts: {
  prompt: string;
  files: File[];
  onToken: (chunk: string) => void;
}): Promise<string> {
  const { prompt, files, onToken } = opts;

  const imagesBase64: string[] = [];
  for (const file of files) {
    const base64 = await fileToBase64(file);
    imagesBase64.push(base64);
  }

  const res = await fetch("http://localhost:3001/api/analyze-images-stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, imagesBase64 }),
  });

  if (!res.body) {
    throw new Error("Response has no body");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  let fullText = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    fullText += chunk;
    onToken(chunk); 
  }

  return fullText;
}

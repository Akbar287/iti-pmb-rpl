// src/lib/pdfClient.ts
// HANYA dipanggil dari komponen "use client"

export async function pdfFileToBase64Images(
  file: File,
  options?: { maxPages?: number; scale?: number }
): Promise<string[]> {
  if (typeof window === "undefined") {
    throw new Error("pdfFileToBase64Images hanya boleh dipanggil di browser");
  }

  try {
    const pdfjsLib: any = await import("pdfjs-dist/legacy/build/pdf");

    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

    const arrayBuffer = await file.arrayBuffer();

    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    const scale = options?.scale ?? 2;
    const totalPages = pdf.numPages;
    const maxPages = options?.maxPages
      ? Math.min(options.maxPages, totalPages)
      : totalPages;

    const images: string[] = [];

    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas 2D context not available");

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: ctx, viewport }).promise;

      const dataUrl = canvas.toDataURL("image/png");
      const base64 = dataUrl.replace(/^data:image\/png;base64,/, "");
      images.push(base64);
    }

    return images;
  } catch (err) {
    console.error("[pdf] error saat konversi PDF → base64:", err);
    throw err;
  }
}

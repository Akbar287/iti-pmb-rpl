// src/lib/pdfToBase64Images.ts
import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import os from "os";
import path from "path";

const execFileAsync = promisify(execFile);

export async function pdfToBase64Images(pdfBuffer: Buffer): Promise<string[]> {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "pdf2img-"));

  const pdfPath = path.join(tmpDir, "input.pdf");
  await fs.writeFile(pdfPath, pdfBuffer);

  const outputPrefix = path.join(tmpDir, "page"); 

  try {
    await execFileAsync("pdftoppm", ["-png", pdfPath, outputPrefix]);

    const files = await fs.readdir(tmpDir);
    const pngFiles = files
      .filter((f) => f.startsWith("page-") && f.endsWith(".png"))
      .sort((a, b) => {
        const getNum = (name: string) =>
          parseInt(name.slice("page-".length, name.length - ".png".length), 10);
        return getNum(a) - getNum(b);
      });

    const imagesBase64: string[] = [];

    for (const file of pngFiles) {
      const filePath = path.join(tmpDir, file);
      const imgBuffer = await fs.readFile(filePath);
      imagesBase64.push(imgBuffer.toString("base64"));
    }

    return imagesBase64;
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
}

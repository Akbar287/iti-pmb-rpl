import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/provider/api";
import fs from 'fs'
import path from 'path'
import mime from 'mime'

export async function GET(req: NextRequest,{ params }: { params: { filename: string } }) {
    const session = await getSession();
    if (!session) {
        return NextResponse.redirect(new URL("/login", req.nextUrl.origin).toString());
    }

    const filePath = path.join(process.cwd(), 'uploads', 'avatar', params.filename)

    try {
        const stat = fs.statSync(filePath)
        if (!stat.isFile()) {
          return new NextResponse('Not a file', { status: 400 })
        }
    
        const fileStream = fs.createReadStream(filePath)
        const contentType = mime.getType(filePath) || 'application/octet-stream'
    
        return new NextResponse(fileStream as any, {
          headers: {
            'Content-Type': contentType,
          },
        })
    
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'error';
        return NextResponse.json({ data: [], status: 'error', message: errorMessage}, {status: 500});
    }
}

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/provider/api";
import { PrismaClient } from "@/generated/prisma";

export async function PUT(req: NextRequest) {
    const prisma = new PrismaClient();

    const session = await getSession();
    if (!session) {
        return NextResponse.redirect(new URL("/login", req.nextUrl.origin).toString());
    }

    
    try {
        const body = await req.json() as {
          tahunId: string;
          jenisMasukId: string;
          capaian: number;
          capaianRincianId: string;
          StatusIntakeId: string;
        }
        
          const { tahunId, jenisMasukId, capaian, capaianRincianId, StatusIntakeId } = body
    
          await prisma.capaianRincian.update({
            where: {
              capaianRincianId: capaianRincianId
            }, 
            data: {
              capaian: capaian
            }
          })

          return NextResponse.json({
              message: "Data berhasil diubah",
              data: [
                  {tahunId, jenisMasukId, capaian, capaianRincianId, StatusIntakeId}
              ], 
              status: 'success'
          }, {status: 200});
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'error';
        return NextResponse.json({ data: [], status: 'error', message: errorMessage}, {status: 500});
    }
}

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
            id: string
            target: number
            weekday: number
            weekend: number
          }
        
          const { id, target, weekday, weekend } = body
    
          const responseIntake = await prisma.targetIntake.update({
            where: {
              targetIntakeId: id,
            },
            data: {
              target
            },
          })
          
          const responseCapaian = await prisma.capaian.updateMany({
            where: {
              targetIntakeId: id,
            },
            data: {
              weekday, 
              weekend
            },
          })

            return NextResponse.json({
                message: "Data berhasil diubah",
                data: [
                    {id, target, weekday, weekend}
                ], 
                status: 'success'
            }, {status: 200});
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'error';
        return NextResponse.json({ data: [], status: 'error', message: errorMessage}, {status: 500});
    }
}

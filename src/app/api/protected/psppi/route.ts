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
          targetDbId: string;
          targetIntakeId: string;
          capaianId: string;
          targetDb: number;
          targetIntake: number;
          weekday: number;
          weekend: number;
          }
        
          const { targetIntakeId, capaianId, targetDb, targetIntake, weekday, weekend } = body

          console.log({ targetIntakeId, capaianId, targetDb, targetIntake, weekday, weekend })
    
          const resTargetIntake = await prisma.targetIntake.findFirst({
            select: {
              tahunId: true, 
              jenisMasukId: true
            }, 
            where: {
              targetIntakeId
            }
          });

          if(resTargetIntake?.tahunId && resTargetIntake?.jenisMasukId) {
            await prisma.targetDb.updateMany({
              where: {
                tahunId: resTargetIntake.tahunId,
                jenisMasukId: resTargetIntake.jenisMasukId
              },
              data: {
                target: targetDb
              } 
            });
          }

          await prisma.targetIntake.update({
            where: {
              targetIntakeId: targetIntakeId
            }, data: {
              target: targetIntake
            }
          });

          await prisma.capaian.update({
            where: {
              capaianId: capaianId
            }, 
            data: {
              weekday: weekday, 
              weekend: weekend
            }
          })

            return NextResponse.json({
                message: "Data berhasil diubah",
                data: [
                    {
                      targetIntakeId,
                      capaianId,
                      targetDb,
                      targetIntake,
                      weekday,
                      weekend}
                ], 
                status: 'success'
            }, {status: 200});
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'error';
        return NextResponse.json({ data: [], status: 'error', message: errorMessage}, {status: 500});
    }
}

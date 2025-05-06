import { UserDataTable } from '@/components/manajemen-data/pengguna/ManajemenPengguna'
import { Permission, Role } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { RolePermission } from '@/types/RoleAndPermission'
import React from 'react'

const Page = async () => {
    const data = await prisma.role.findMany({
        select: {
            RoleId: true,
            Name: true,
            GuardName: true,
            Icon: true,
            RoleHasPermissions: {
                select: {
                    Permission: {
                        select: {
                            PermissionId: true,
                            Name: true,
                            GuardName: true,
                        },
                    },
                },
            },
        },
    })

    const roleDataServer: RolePermission = data
        .sort((a, b) => a.Name.localeCompare(b.Name))
        .map((d) => ({
            RoleId: d.RoleId,
            Name: d.Name,
            GuardName: d.GuardName,
            Icon: d.Icon,
            Permission: d.RoleHasPermissions.map((p) => ({
                PermissionId: p.Permission.PermissionId,
                Name: p.Permission.Name,
                GuardName: p.Permission.GuardName,
            })),
        }))

    const countryDataServer = await prisma.country.findMany()

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Pengguna</h1>
            <UserDataTable
                countryDataServer={countryDataServer}
                roleDataServer={roleDataServer}
            />
        </div>
    )
}

export default Page

export type RolePermission = {
    RoleId: string
    Name: string
    GuardName: string
    Icon: string | null
    Permission: {
        PermissionId: string
        Name: string
        GuardName: string
    }[]
}[]

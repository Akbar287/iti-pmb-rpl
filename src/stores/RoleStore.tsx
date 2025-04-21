import { Permission, Role } from "@/generated/prisma";
import { create } from "zustand";

type State = {
  role: Role[];
  permission: Permission[];
};

type Actions = {
  cekRole: (roleId: string) => boolean;
  cekPermission: (permissionId: string) => boolean;
  setRole: (role: Role[]) => void;
  setPermission: (permission: Permission[]) => void;
};

const useCountStore = create<State & Actions>((set, get) => ({
  role: [],
  permission: [],
  cekRole: (roleId: string) => get().role.some((r) => r.RoleId === roleId),
  cekPermission: (permissionId: string) =>
    get().permission.some((p) => p.PermissionId === permissionId),
  setRole: (role) => set({ role: role }),
  setPermission: (permission) => set({ permission: permission }),
}));

export default useCountStore;

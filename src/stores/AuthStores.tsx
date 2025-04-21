import { JenisKelamin, Jenjang, User, Userlogin } from "@/generated/prisma";
import { create } from "zustand";

type State = {
  user: User;
  userlogin: Userlogin;
};

type Actions = {
  setUser: (user: User) => void;
  setUserlogin: (userlogin: Userlogin) => void;
};

const useCountStore = create<State & Actions>((set, get) => ({
  user: {
    UserId: "",
    AlamatId: "",
    Nama: "",
    Email: "",
    EmailVerifiedAt: null,
    TempatLahir: null,
    TanggalLahir: null,
    JenisKelamin: JenisKelamin.PRIA,
    PendidikanTerakhir: Jenjang.TIDAK_TAMAT_SD,
    Avatar: "",
    Agama: "",
    Telepon: "",
    NomorWa: "",
    NomorHp: "",
    RememberToken: "",
    CreatedAt: new Date(),
    UpdatedAt: new Date(),
    DeletedAt: null,
  },
  userlogin: {
    UserloginId: "",
    UserId: "",
    Username: "",
    Password: "",
    CreatedAt: new Date(),
    UpdatedAt: new Date(),
    DeletedAt: null,
  },
  setUser: (user) => set({ user: user }),
  setUserlogin: (userlogin) => set({ userlogin: userlogin }),
}));

export default useCountStore;

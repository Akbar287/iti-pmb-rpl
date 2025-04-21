import { z } from "zod"

export const LoginSkemaValidation = z.object({
    username: z
        .string()
        .nonempty("Nama Pengguna diperlukan")
        .min(8, "Nama Pengguna harus memiliki minimal 8 karakter")
        .max(16, "Nama Pengguna harus memiliki maksimal 16 karakter"),
    password: z
        .string()
        .nonempty("Kata Sandi diperlukan")
        .min(8, "Kata Sandi harus memiliki minimal 8 karakter"),
})

export type LoginFormValidation = z.infer<typeof LoginSkemaValidation>

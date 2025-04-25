import { AuthOptions, getServerSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import Bycript from 'bcrypt'
import { Session } from 'next-auth'
import { JWT } from "next-auth/jwt"
import { prisma } from '@/lib/prisma'

const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            type: 'credentials',
            name: 'credentials',
            credentials: {
                username: { label: 'username', type: 'text' },
                password: { label: 'password', type: 'password' },
            },
            async authorize(credentials, req) {
                try {
                    if (!credentials) {
                        throw new Error('No credentials provided')
                    }

                    const userLogin = await prisma.userlogin.findFirst({
                        where: {
                            Username: credentials.username,
                        },
                        select: {
                            Username: true,
                            Password: true,
                            User: {
                                select: {
                                    UserId: true,
                                    Nama: true,
                                    Avatar: true,
                                    Email: true,
                                    UserHasRoles: {
                                        select: {
                                            Role: {
                                                select: {
                                                    RoleId: true,
                                                    GuardName: true,
                                                    Name: true,
                                                    Icon: true
                                                },
                                            },
                                        },
                                    },
                                    UserHasPermissions: {
                                        select: {
                                            Permission: {
                                                select: {
                                                    PermissionId: true,
                                                    Name: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    })

                    if (userLogin === null) {
                        throw new Error('User tidak ditemukan')
                    }

                    if (!userLogin.Password) {
                        throw new Error('Password kosong')
                    }
                    const isPasswordValid = await Bycript.compare(
                        credentials.password,
                        userLogin.Password
                    )
                    if (!isPasswordValid) {
                        throw new Error('Password salah')
                    }

                    const user = {
                        id: userLogin.User.UserId,
                        username: userLogin.Username,
                        nama: userLogin.User.Nama,
                        avatar: userLogin.User.Avatar,
                        email: userLogin.User.Email,
                        roles: userLogin.User.UserHasRoles.flatMap(
                            (f) => f.Role
                        ),
                    }

                    return user
                } catch (error) {
                    if (error instanceof Error) {
                        return Promise.reject(error)
                    }
                    return Promise.reject('An unknown error occurred')
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    callbacks: {
        async jwt({ token, user }:{ token: any; user?: any; }) {
            if (user) {
                token.id = user.id
                token.username = user.username
                token.nama = user.nama
                token.name = user.nama
                token.avatar = user.avatar
                token.picture = user.avatar
                token.email = user.email
                token.roles = user.roles
            }
            return token
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            session.user.id = token.id
            session.user.username = token.username
            session.user.nama = token.nama
            session.user.avatar = token.avatar
            session.user.email = token.email
            session.user.roles = token.roles
            return session
        },
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    cookies: {
        sessionToken: {
            name: `pmb-iti.session-token`,
            options: {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
            },
        },
        callbackUrl: {
            name: `pmb-iti.callback-url`,
            options: {
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            },
        },
        csrfToken: {
            name: `pmb-iti.csrf-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            },
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
}

const getSession = () => getServerSession(authOptions)

export { authOptions, getSession }

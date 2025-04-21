'use client'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import logo from '@/assets/images/Logo-ITI-oke-1.png'
import Link from 'next/link'
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form'
import { signIn, useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { LogInIcon } from 'lucide-react'
import {
    LoginFormValidation,
    LoginSkemaValidation,
} from '@/validation/LoginValidation'
import { useRouter } from 'next/navigation'

export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<'div'>) {
    const router = useRouter()
    const { data: session } = useSession()
    const searchParam = useSearchParams()
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
    const [loading, setLoading] = React.useState<boolean>(false)
    const form = useForm<LoginFormValidation>({
        resolver: zodResolver(LoginSkemaValidation),
        defaultValues: {
            username: '',
            password: '',
        },
    })

    const onSubmit = async (data: LoginFormValidation) => {
        setLoading(true)
        const result = await signIn('credentials', {
            username: data.username,
            password: data.password,
            redirect: false,
            callbackUrl: searchParam.get('callbackUrl') || '/',
        })

        if (result?.error) {
            setErrorMessage(result.error)
            setLoading(false)
        }

        if (result?.ok) {
            // router.push(searchParam.get('callbackUrl') || '/')
            setErrorMessage(null)
            window.location.href = searchParam.get('callbackUrl') || '/'
            setLoading(false)
        }
    }

    React.useEffect(() => {
        if (searchParam.get('msg')) {
            setErrorMessage(searchParam.get('msg') as string)
        }
        if (session) {
            window.location.href = searchParam.get('callbackUrl') || '/'
        }
    }, [])

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col items-center gap-2">
                            <Link href="/">
                                <div className="flex items-center justify-center rounded-md">
                                    <div className="p-2 dark:bg-gray-100 rounded-xl">
                                        <Image
                                            src={logo}
                                            priority
                                            width={120}
                                            height={30}
                                            alt="logo"
                                            style={{
                                                width: 'auto',
                                                height: 'auto',
                                            }}
                                        />
                                    </div>
                                </div>
                                <span className="sr-only">PMB ITI</span>
                            </Link>
                            <h1 className="text-xl font-bold">
                                Selamat Datang di Sistem PMB ITI
                            </h1>
                        </div>
                        {errorMessage && (
                            <Alert
                                variant="destructive"
                                className="bg-transparent border-red-500 "
                            >
                                <LogInIcon className="h-4 w-4" />
                                <AlertTitle className="font-semibold text-red-500">
                                    Kesalahan
                                </AlertTitle>
                                <AlertDescription className="text-red-500">
                                    {errorMessage}
                                </AlertDescription>
                            </Alert>
                        )}
                        <div className="flex flex-col gap-6">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nama Pengguna</FormLabel>
                                        <FormControl>
                                            <Input
                                                readOnly={loading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Nama Pengguna Terdiri dari 6-16
                                            Karakter
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kata Sandi</FormLabel>
                                        <FormControl>
                                            <Input
                                                readOnly={loading}
                                                {...field}
                                                type="password"
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Kata Sandi Terdiri dari 8-16
                                            Karakter
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                disabled={loading}
                                className="mr-2 hover:scale-110 active:scale-90 transition-all duration-100 cursor-pointer "
                            >
                                {loading ? 'Loading' : 'Login'}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4">
                Dengan klik Login, Anda setuju dengan{' '}
                <Link className="hover:text-primary" href="/syarat-ketentuan">
                    Syarat dan Ketentuan
                </Link>{' '}
                and{' '}
                <Link className="hover:text-primary" href="/kebijakan-privasi">
                    Kebijakan Privacy
                </Link>
                .
            </div>
        </div>
    )
}

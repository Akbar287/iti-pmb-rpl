'use client'
import { Separator } from '@radix-ui/react-separator'
import HeroAnimatedBackground from './HeroAnimatedBackground'

const Hero = ({
    data,
}: {
    data: {
        SettingMainPageId: string
        TextMainPage1: string
        TextMainPage2: string
        TextMainPage3: string
    } | null
}) => {
    return (
        <div className="relative min-h-screen w-full">
            <HeroAnimatedBackground />

            {/* Content */}
            <div className="relative container mx-auto flex flex-col items-center justify-center min-h-screen text-center px-4 pt-20">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    {data ? data.TextMainPage1 : 'Selamat Datang di'} <br />
                    <span className="text-primary">
                        {data
                            ? data.TextMainPage2
                            : 'Rekognisi Pembelajaran Lampau (RPL)'}
                    </span>
                </h1>
                <p className="text-xl md:text-4xl text-white/90 max-w-3xl mb-10 ">
                    {data ? data.TextMainPage3 : 'Institut Teknologi Indonesia'}
                </p>
                <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
                    <Separator
                        className="w-full border-white/90 border h-32"
                        orientation="vertical"
                    />
                </div>

                <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce">
                    <a
                        href="#about"
                        className="text-gray-800/80 hover:text-white"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="44"
                            height="44"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Hero

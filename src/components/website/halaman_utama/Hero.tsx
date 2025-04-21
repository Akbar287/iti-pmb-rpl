'use client'
import Foto1 from '@/assets/images/foto-1.png'
import { Separator } from '@radix-ui/react-separator'

const Hero = () => {
    return (
        <div className="relative min-h-screen w-full">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url(${Foto1.src})`,
                    filter: 'blur(10px)',
                    zIndex: -1,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    opacity: 0.8,
                    transition: 'opacity 0.5s ease-in-out',
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white mix-blend-multiply" />
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white via-white/70 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative container mx-auto flex flex-col items-center justify-center min-h-screen text-center px-4 pt-20">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    Selamat Datang di <br />
                    <span className="text-primary">
                        Rekognisi Pembelajaran Lampau (RPL)
                    </span>
                </h1>
                <p className="text-xl md:text-4xl text-white/90 max-w-3xl mb-10 ">
                    Institut Teknologi Indonesia
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

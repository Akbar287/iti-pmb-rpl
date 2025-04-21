import React from 'react'
import About from '@/components/website/halaman_utama/About'
import Advantages from '@/components/website/halaman_utama/Advantages'
import Community from '@/components/website/halaman_utama/Community'
import Events from '@/components/website/halaman_utama/Events'
import FocusTopics from '@/components/website/halaman_utama/FocusTopics'
import Hero from '@/components/website/halaman_utama/Hero'
import News from '@/components/website/halaman_utama/News'
import Resources from '@/components/website/halaman_utama/Resources'

const Page = () => {
    return (
        <React.Fragment>
            <Hero />
            <div className="bg-white/80 dark:bg-gray-700">
                <About />
                <Advantages />
                <Community />
                <Events />
                <News />
                <Resources />
                <FocusTopics />
            </div>
        </React.Fragment>
    )
}

export default Page

import React from 'react'

import { Navbar, Footer, Landing, About, Skills, Education, Experience, Contacts, Projects } from '../../components'
import SeoHelmet from '../../components/Seo/SeoHelmet'
import { seoData } from '../../data/seoData'
import CustomCursor from "../../components/Cursor"; 
function Main() {
    return (
        <div>
            <SeoHelmet
                title={seoData.defaultTitle}
                description={seoData.defaultDescription}
                path="/"
            />
            <CustomCursor/>
            <Navbar />        
            <Landing />
            <About />
            <Education />
            <Skills />
            <Experience />
            <Projects />
            {/*<Achievement />*/}
            {/*<Services />*/}
            {/*<Testimonials />*/}
            {/*<Blog />*/}
            <Contacts />
            <Footer />
        </div>
    )
}

export default Main

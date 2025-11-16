import React from 'react'
import { Helmet } from 'react-helmet'

import { Navbar, Footer, Landing, About, Skills, Education, Experience, Contacts, Projects } from '../../components'
import { headerData } from '../../data/headerData'
import CustomCursor from "../../components/Cursor"; 
function Main() {
    return (
        <div>
            <Helmet>
                <title>{headerData.name} - Portfolio </title>
            </Helmet>
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

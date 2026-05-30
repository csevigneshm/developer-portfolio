import triseasImg from '../assets/png/triseaslogo.png';
import hioxImg from '../assets/png/hioxlogo.jpeg';
import holleyImg from '../assets/png/holleylogo.avif';
import orionImg from '../assets/png/orionlogo.jpg';
import ownLogoImg from '../assets/png/own-logo.jpeg';

export const projectsData = [
    {
        id: 1,
        projectName: 'Triseas Food Company INC',
        projectDesc:
            'Personal project — seafood e-commerce showcase with a custom admin panel for product and inventory management.',
        highlights: [
            'Built the full storefront and admin module using PHP, MySQL, jQuery, and SCSS.',
            'Designed responsive product listing pages for cross-device browsing.',
            'Deployed and maintained as a live business site.',
        ],
        tags: ['PHP', 'MySQL', 'jQuery', 'SCSS'],
        code: '',
        demo: 'https://www.triseasfoodcompanyinc.in/',
        image: triseasImg,
    },
    {
        id: 2,
        projectName: 'HioxIndia.com',
        projectDesc:
            'Feature work and performance improvements on HIOX’s main hosting and services platform.',
        highlights: [
            'Developed renewal rate calculation and promo/offer management modules.',
            'Optimized SQL queries and REST API endpoints for faster response times.',
            'Migrated legacy jQuery scripts to cleaner, maintainable implementations.',
        ],
        tags: ['HTML', 'CSS', 'JavaScript', 'jQuery', 'PHP', 'MySQL', 'REST API'],
        code: '',
        demo: 'https://www.hioxindia.com/',
        image: hioxImg,
        imageLightBg: true,
        imageZoomOut: true,
    },
    {
        id: 3,
        projectName: 'Hiox.com',
        projectDesc:
            'Latest project at HIOX — site update built from scratch with a React dashboard, plus an AI-powered PDF tool to scan documents and interact based on PDF content.',
        highlights: [
            'Started the hiox.com site update from scratch using a React-based dashboard.',
            'Built an AI-powered PDF generator tool to scan PDFs and enable interaction based on document content.',
            'Integrated Node.js and Python backends with Hugging Face models for AI capabilities.',
            'Designed dashboard UI with Material UI and custom CSS.',
        ],
        tags: ['React', 'Material UI', 'CSS', 'Node JS', 'Python', 'Hugging Face'],
        code: '',
        demo: 'https://www.hiox.com/',
        image: hioxImg,
        imageLightBg: true,
        imageZoomOut: true,
    },
    {
        id: 4,
        projectName: 'Hiox Internal Chat',
        projectDesc:
            'Real-time team chat system inspired by Telegram, built for internal communication at HIOX.',
        highlights: [
            'Implemented long polling for near real-time messaging without WebSocket overhead.',
            'Optimized backend message handling for smooth conversation flow.',
            'Designed a clean chat UI for daily internal team use.',
        ],
        tags: ['HTML', 'CSS', 'JavaScript', 'jQuery', 'PHP', 'MySQL', 'Long Polling'],
        code: '',
        demo: '',
        image: hioxImg,
        imageLightBg: true,
        imageZoomOut: true,
    },
    {
        id: 5,
        projectName: 'Holley.com',
        projectDesc:
            'Feature development on a large US automotive e-commerce platform under Agile delivery.',
        highlights: [
            'Built the Compare Tool for side-by-side product evaluation.',
            'Contributed to Admin Tool enhancements for internal operations.',
            'Followed GitHub workflow with Jira tickets, code reviews, and team collaboration.',
        ],
        tags: ['TypeScript', 'PHP', 'SCSS', 'MySQL', 'GitHub', 'Analytics', 'Docker', 'Linux', 'Zeplin'],
        code: '',
        demo: 'https://www.holley.com/',
        image: holleyImg,
        imageZoomOut: true,
    },
    {
        id: 6,
        projectName: 'NEBULA — GenAI SDLC Platform',
        projectDesc:
            'Full-stack GenAI platform — React frontend and Python backend automating SDLC tasks such as documentation, code generation, and test case creation.',
        highlights: [
            'Built React (TypeScript) UI modules for AI-generated output display.',
            'Developed Python backend integrations for GenAI-driven SDLC workflows.',
            'Worked on end-to-end flows for documentation and test case generation features.',
        ],
        tags: ['React', 'Python', 'TypeScript', 'GenAI'],
        code: '',
        demo: '',
        image: orionImg,
    },
    {
        id: 7,
        projectName: 'vignesh-dev.in',
        projectDesc:
            'Personal live site hosting my portfolio and self-built tools — deployed on a VPS with custom domain and SSL.',
        highlights: [
            'Built and customized a React portfolio for personal branding and content.',
            'Set up Nginx, SSL, and Git-based deploy pipeline on Hostinger VPS.',
            'Configured SEO meta tags, structured data, and responsive layouts.',
        ],
        tags: ['React', 'JavaScript', 'CSS', 'Nginx'],
        code: 'https://github.com/csevigneshm/developer-portfolio',
        demo: 'https://vignesh-dev.in/',
        image: ownLogoImg
    },
    {
        id: 8,
        projectName: 'Productivity Tracker',
        projectDesc:
            'Daily productivity tracking app hosted at tracker.vignesh-dev.in — built to log habits, tasks, and progress for career growth.',
        highlights: [
            'Built with a React frontend and Laravel backend for daily productivity and career-focused goal tracking.',
            'Hosted as a subdomain under vignesh-dev.in on the same VPS infrastructure.',
            'Designed for consistent daily use to measure and improve work habits over time.',
        ],
        tags: ['React', 'Laravel', 'Typecript', 'VPS', 'MySQL'],
        code: 'https://github.com/csevigneshm/productivity-tracker',
        demo: 'https://tracker.vignesh-dev.in/',
        image: ownLogoImg
    },
];

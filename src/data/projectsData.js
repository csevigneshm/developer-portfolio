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
            'HIOX platform upgrade built from scratch with a React dashboard and an AI-powered PDF tool using Python for document processing and generation.',
        highlights: [
            'Built a React dashboard from scratch for the Hiox.com platform upgrade.',
            'Developed an AI-powered PDF generation tool with a Python backend and Hugging Face integration.',
            'Connected React frontend modules to Python APIs for document scanning and content-based interaction.',
            'Designed dashboard UI with Material UI and custom CSS.',
        ],
        tags: ['React', 'Python', 'Material UI', 'CSS', 'Node JS', 'Hugging Face'],
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
        tags: ['TypeScript', 'PHP', 'SCSS', 'MySQL', 'GitHub', 'Analytics', 'Docker', 'Linux', 'Zeplin', 'Python'],
        code: '',
        demo: 'https://www.holley.com/',
        image: holleyImg,
        imageZoomOut: true,
    },
    {
        id: 6,
        projectName: 'NEBULA — GenAI PDLC Platform',
        projectDesc:
            'Orion Innovation COI internal GenAI platform with a React frontend and Python FastAPI backend, using OpenAI embeddings and RAG retrieval to automate the Product Development Life Cycle.',
        highlights: [
            'Built React (TypeScript) UI modules to display AI-generated PRD, SRS, HLD, LLD, and Scrum artifacts.',
            'Developed Python FastAPI services with OpenAI embeddings, vector storage, and RAG retrieval for GenAI workflows.',
            'Integrated LLM-powered pipelines for documentation, code generation, test cases, and code review automation.',
        ],
        tags: ['React', 'Python', 'FastAPI', 'TypeScript', 'RAG', 'GenAI'],
        code: '',
        demo: '',
        image: orionImg,
    },
    {
        id: 7,
        projectName: 'vignesh-dev.in',
        projectDesc:
            'Personal portfolio deployed on a VPS with a React frontend and an AI chatbot (Vro) powered by a Python RAG backend over resume content.',
        highlights: [
            'Built a React portfolio with responsive layouts, SEO meta tags, and structured data.',
            'Integrated Vro Chat — a resume-aware AI chatbot using React UI, FastAPI, OpenAI embeddings, and RAG retrieval.',
            'Set up Nginx, SSL, and a Git-based deploy pipeline on Hostinger VPS.',
        ],
        tags: ['React', 'Python', 'FastAPI', 'RAG', 'JavaScript', 'Nginx'],
        code: 'https://github.com/csevigneshm/developer-portfolio',
        demo: 'https://vignesh-dev.in/',
        image: ownLogoImg
    },
];

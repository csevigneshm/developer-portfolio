export const siteUrl = 'https://vignesh-dev.in';

export const seoData = {
    siteName: 'vignesh-dev.in',
    defaultTitle: 'Vignesh M | Software Engineer | vignesh-dev.in',
    defaultDescription:
        'Official portfolio of Vignesh M (Vignesh Moorthy) — Software Engineer and Full-Stack Web Developer. Explore projects, experience, skills, and contact details at vignesh-dev.in.',
    keywords: [
        'Vignesh',
        'Vignesh M',
        'Vignesh Moorthy',
        'vignesh-dev',
        'vignesh-dev.in',
        'Vignesh developer',
        'Vignesh software engineer',
        'Vignesh portfolio',
        'Software Engineer Chennai',
        'Full Stack Developer',
        'web developer portfolio',
        'Vignesh web developer',
    ].join(', '),
    author: 'Vignesh M',
    ogImage: `${siteUrl}/og-image.jpeg`,
    twitterHandle: '@Vignesh_d3v',
    locale: 'en_IN',
};

export const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Vignesh M',
    alternateName: ['Vignesh Moorthy', 'Vignesh Developer', 'vignesh-dev'],
    url: siteUrl,
    jobTitle: 'Software Engineer',
    image: `${siteUrl}/og-image.jpeg`,
    description: seoData.defaultDescription,
    email: 'csevigneshm@gmail.com',
    address: {
        '@type': 'PostalAddress',
        addressLocality: 'Chennai',
        addressRegion: 'Tamil Nadu',
        addressCountry: 'IN',
    },
    sameAs: [
        'https://www.linkedin.com/in/vignez-dev',
        'https://github.com/csevigneshm',
        'https://x.com/Vignesh_d3v',
        'https://vignesh-dev.blogspot.com/',
        'https://stackoverflow.com/users/23084391/vignez',
    ],
};

export const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'vignesh-dev.in',
    alternateName: 'Vignesh M Portfolio',
    url: siteUrl,
    description: seoData.defaultDescription,
    inLanguage: 'en-IN',
    author: {
        '@type': 'Person',
        name: 'Vignesh M',
    },
};

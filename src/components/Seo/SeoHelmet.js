import React from 'react';
import { Helmet } from 'react-helmet';

import { seoData, siteUrl } from '../../data/seoData';

function SeoHelmet({
    title = seoData.defaultTitle,
    description = seoData.defaultDescription,
    path = '/',
    noindex = false,
}) {
    const canonical = `${siteUrl}${path === '/' ? '' : path}`;

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={seoData.keywords} />
            <meta name="author" content={seoData.author} />
            <link rel="canonical" href={canonical} />

            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={seoData.ogImage} />
            <meta property="og:url" content={canonical} />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content={seoData.siteName} />
            <meta property="og:locale" content={seoData.locale} />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={seoData.ogImage} />
            <meta name="twitter:creator" content={seoData.twitterHandle} />

            {noindex ? (
                <meta name="robots" content="noindex, nofollow" />
            ) : (
                <meta name="robots" content="index, follow" />
            )}
        </Helmet>
    );
}

export default SeoHelmet;

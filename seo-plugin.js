const PROFILE = {
    name: 'Trần Quang Khánh',
    jobTitle: 'Product-Minded Full-Stack & Creative Developer',
    description: 'Full-stack developer building scalable backend systems, product-focused web applications, and interactive 3D experiences.',
    email: 'tranquangkhanh2k1qv@gmail.com',
    github: 'https://github.com/khanh0601',
    linkedin: 'https://www.linkedin.com/in/trần-quang-khánh-958aa62a0/',
    zalo: 'https://zalo.me/0392728283',
    whatsapp: 'https://wa.me/84392728283',
};

const ROUTES = ['/', '/about', '/gallery', '/studio', '/contact'];

function normalizeSiteUrl(value) {
    if (!value) return '';
    const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    return withProtocol.replace(/\/$/, '');
}

function escapeHtml(value) {
    return value.replace(/[&<>"']/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;',
    })[character]);
}

export function generateSeoHtml() {
    let siteUrl = '';

    return {
        name: 'khanh-static-seo',
        configResolved(config) {
            siteUrl = normalizeSiteUrl(
                config.env.VITE_SITE_URL ||
                process.env.VITE_SITE_URL ||
                process.env.VERCEL_PROJECT_PRODUCTION_URL ||
                process.env.VERCEL_URL
            );
        },
        transformIndexHtml(html) {
            const personId = siteUrl ? `${siteUrl}/#person` : '#person';
            const websiteId = siteUrl ? `${siteUrl}/#website` : '#website';
            const jsonLd = {
                '@context': 'https://schema.org',
                '@graph': [
                    {
                        '@type': 'Person',
                        '@id': personId,
                        name: PROFILE.name,
                        jobTitle: PROFILE.jobTitle,
                        description: PROFILE.description,
                        email: `mailto:${PROFILE.email}`,
                        knowsAbout: ['TypeScript', 'NestJS', 'Next.js', 'React', 'PostgreSQL', 'Redis', 'Docker', 'Three.js', 'GSAP'],
                        sameAs: [PROFILE.github, PROFILE.linkedin, PROFILE.zalo, PROFILE.whatsapp],
                        ...(siteUrl ? { url: siteUrl } : {}),
                    },
                    {
                        '@type': 'WebSite',
                        '@id': websiteId,
                        name: `${PROFILE.name} | Full-Stack Developer Portfolio`,
                        description: PROFILE.description,
                        publisher: { '@id': personId },
                        ...(siteUrl ? { url: siteUrl } : {}),
                    },
                    {
                        '@type': 'ProfilePage',
                        mainEntity: { '@id': personId },
                        about: { '@id': personId },
                        ...(siteUrl ? { url: siteUrl } : {}),
                    },
                ],
            };

            const absoluteImage = siteUrl ? `${siteUrl}/og-image.png` : '/og-image.png';
            const urlTags = siteUrl
                ? `<link rel="canonical" href="${siteUrl}/" />\n  <meta property="og:url" content="${siteUrl}/" />`
                : '';

            return html.replace('</head>', `  ${urlTags}\n  <meta property="og:image" content="${absoluteImage}" />\n  <meta name="twitter:image" content="${absoluteImage}" />\n  <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>\n</head>`);
        },
        generateBundle() {
            const llmsContent = `# ${PROFILE.name}\n> ${PROFILE.jobTitle}\n\n${PROFILE.description}\n\n## Contact\n- GitHub: ${PROFILE.github}\n- LinkedIn: ${PROFILE.linkedin}\n- Email: ${PROFILE.email}\n- Zalo: ${PROFILE.zalo}\n- WhatsApp: ${PROFILE.whatsapp}\n`;
            this.emitFile({ type: 'asset', fileName: 'llms.txt', source: llmsContent });

            const robots = `User-agent: *\nAllow: /\n${siteUrl ? `\nSitemap: ${siteUrl}/sitemap.xml\n` : ''}`;
            this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots });

            if (siteUrl) {
                const urls = ROUTES.map(route => `  <url><loc>${escapeHtml(`${siteUrl}${route}`)}</loc></url>`).join('\n');
                this.emitFile({
                    type: 'asset',
                    fileName: 'sitemap.xml',
                    source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
                });
            }
        },
    };
}

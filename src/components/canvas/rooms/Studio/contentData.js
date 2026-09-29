/**
 * Static experience and skills shown on the Studio monitor tower.
 * Keep this content aligned with Trần Quang Khánh's verified portfolio data.
 */

export const PLATFORM_CONFIG = {
    backend: {
        color: '#315f8c',
        accentColor: '#1d3f61',
        icon: '{ }',
        label: 'Backend',
        shape: 'monitor',
    },
    product: {
        color: '#7258a8',
        accentColor: '#49366f',
        icon: '◆',
        label: 'Product',
        shape: 'tv',
    },
    frontend: {
        color: '#2f8175',
        accentColor: '#1e5b52',
        icon: '◫',
        label: 'Frontend',
        shape: 'monitor',
    },
    devops: {
        color: '#b16a2c',
        accentColor: '#75451d',
        icon: '∞',
        label: 'DevOps',
        shape: 'tv',
    },
    leadership: {
        color: '#9b4f62',
        accentColor: '#66303e',
        icon: '↗',
        label: 'Leadership',
        shape: 'phone',
    },
};

export const CONTENT_DATA = [
    {
        id: 'backend-systems',
        platform: 'backend',
        title: 'Scalable Backend Systems',
        description: 'Designing modular NestJS services with TypeScript, PostgreSQL, Prisma, Redis, BullMQ, Socket.IO, and secure role-based access.',
        date: '2026-01-01',
    },
    {
        id: 'product-engineering',
        platform: 'product',
        title: 'Product-Minded Engineering',
        description: 'Turning business requirements into maintainable products with clear user journeys, reliable APIs, payments, and measurable outcomes.',
        date: '2025-12-01',
    },
    {
        id: 'frontend-experiences',
        platform: 'frontend',
        title: 'Interactive Web Experiences',
        description: 'Building responsive interfaces with Next.js, React, Three.js, React Three Fiber, and GSAP while keeping performance and accessibility in focus.',
        date: '2025-11-01',
    },
    {
        id: 'delivery-devops',
        platform: 'devops',
        title: 'Reliable Delivery & DevOps',
        description: 'Shipping applications with Docker, Docker Compose, CI/CD pipelines, Nginx, caching, queues, monitoring, and production-minded workflows.',
        date: '2025-10-01',
    },
    {
        id: 'team-leadership',
        platform: 'leadership',
        title: 'Mentoring & Team Growth',
        description: 'Supporting junior developers through code reviews, technical workshops, clean architecture guidance, and practical system design.',
        date: '2025-09-01',
    },
];

export const getContentByPlatform = (platform) => {
    if (platform === 'all') return CONTENT_DATA;
    return CONTENT_DATA.filter(item => item.platform === platform);
};

export const getLatestContent = () => (
    [...CONTENT_DATA].sort((a, b) => new Date(b.date) - new Date(a.date))[0]
);

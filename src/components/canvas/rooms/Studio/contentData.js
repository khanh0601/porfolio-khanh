/**
 * Content data shown on the CRT monitor tower in The Lab / Studio.
 * Derived directly from Trần Quang Khánh's verified engineering portfolio and commercial projects.
 */

export const PLATFORM_CONFIG = {
    creative: {
        color: '#e06d53',
        accentColor: '#b34d36',
        icon: '🎨',
        label: 'Creative Tech',
        shape: 'monitor',
    },
    wordpress: {
        color: '#2f8175',
        accentColor: '#1d574e',
        icon: '⚡',
        label: 'WordPress Core',
        shape: 'tv',
    },
    saas: {
        color: '#315f8c',
        accentColor: '#1d3f61',
        icon: '{ }',
        label: 'SaaS & Realtime',
        shape: 'monitor',
    },
    payments: {
        color: '#b16a2c',
        accentColor: '#75451d',
        icon: '💳',
        label: 'Payments & APIs',
        shape: 'tv',
    },
    leadership: {
        color: '#9b4f62',
        accentColor: '#66303e',
        icon: '👥',
        label: 'Team Lead',
        shape: 'phone',
    },
};

export const CONTENT_DATA = [
    {
        id: 'creative-3d-motion',
        platform: 'creative',
        title: 'Three.js 3D & GSAP Motion Engineering',
        description: 'Building immersive 3D product visualizers (Rotimatic) with Three.js, Lenis smooth scrolling, and dynamic GSAP timelines across high-traffic commercial web applications.',
        date: '2026-02-01',
    },
    {
        id: 'enterprise-wordpress',
        platform: 'wordpress',
        title: 'Deep WordPress Architecture & Systems',
        description: 'Extending WordPress far beyond standard themes: Custom $wpdb EAV modeling, double-entry accounting ledgers, GraphQL integrations, and high-performance script deferring.',
        date: '2026-01-15',
    },
    {
        id: 'realtime-orderbook',
        platform: 'saas',
        title: 'Real-Time Order Books & eKYC Workflows',
        description: 'Architecting B2C trading platforms (CaskXchange) with Next.js 15, React 19, Socket.IO live Ask/Bid matching, and webcam-based OCR facial verification.',
        date: '2025-12-10',
    },
    {
        id: 'payments-webhooks',
        platform: 'payments',
        title: 'Resilient Payment Gateways & Webhooks',
        description: 'Integrating PayOS (VietQR) with HMAC-SHA256 signature verification, Stripe Connect workflows, automated eSIM inventory synchronization, and webhook idempotency.',
        date: '2025-11-05',
    },
    {
        id: 'team-lead-delivery',
        platform: 'leadership',
        title: 'Team Leadership & Direct Client Discovery',
        description: 'Leading a 3-developer team, translating complex business demands into clean sprints, mentoring junior engineers from zero, and delivering SaaS solutions on schedule.',
        date: '2025-10-01',
    },
];

export const getContentByPlatform = (platform) => {
    if (platform === 'all') return CONTENT_DATA;
    return CONTENT_DATA.filter(item => item.platform === platform);
};

export const getLatestContent = () => (
    [...CONTENT_DATA].sort((a, b) => new Date(b.date) - new Date(a.date))[0]
);

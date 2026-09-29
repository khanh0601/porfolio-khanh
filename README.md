# 🎨 Trần Quang Khánh | Interactive 3D Portfolio

<div align="center">
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Three.js-0.182-black?style=for-the-badge&logo=threedotjs" alt="Three.js" />
  <img src="https://img.shields.io/badge/R3F-9.4-purple?style=for-the-badge&logo=react" alt="React Three Fiber" />
  <img src="https://img.shields.io/badge/GSAP-3.14-green?style=for-the-badge&logo=greensock" alt="GSAP" />
  <img src="https://img.shields.io/badge/Vite-7.2-646CFF?style=for-the-badge&logo=vite" alt="Vite" />
</div>

<br/>

Interactive portfolio of **Trần Quang Khánh**, a product-minded full-stack developer. The experience combines modern web engineering with an immersive React Three Fiber interface.

> [!NOTE]
> Ensure hardware acceleration is enabled in your browser settings to experience the smooth 60 FPS high-tier rendering of this application.

## 🚀 Key Performance Architectures (2026 Standards)

This application is strictly optimized for cross-device operability, achieving zero lag spikes even on mobile processors through several bespoke architectural implementations:

1. **Invisible Semantic SEO Fallback:** Bypasses WebGL canvas SEO limitations via strategic `sr-only-seo` indexing DOM injections, rendering fully visible semantic trees to native search-engine crawlers without mounting heavy bundles.
2. **Progressive Scene Loading:** Loads only the entrance on the critical path, then streams the corridor, UI, analytics, and individual rooms in separate chunks when needed.
3. **Baked Global Tinting & Lighing Extraction:** Replaced real-time WebGL shadow maps and infinite light rays with baked-in global textures (`apply_global_tint.js`), dropping the GPU compute overhead entirely while maintaining visual depth.
4. **DOM Mutation Bypassing:** Critical SVG preloader animation properties write directly to `ref.current.style`, intentionally bypassing React render cycles to conserve CPU.
5. **Adaptive Device Tiering:** Auto-detects `navigator.deviceMemory`, hardware concurrency, and viewport sizes to scale WebGL resolutions (`dpr`), antialiasing algorithms, and texture loading strictness on the fly.

---

## 🏗️ 3D Scene Architecture

```mermaid
graph TD;
    A[App.jsx] --> B[SceneProvider Context];
    A --> C[canvas];
    A --> D[2D DOM / SEO / HUD];
    
    C --> E[Experience.jsx];
    E --> F[Entrance - critical assets];
    E --> G[Infinite Corridor - background load];
    
    G --> H[Gallery Room - lazy chunk];
    G --> I[Studio Room - lazy chunk];
    G --> J[Contact Room - lazy chunk];
    G --> K[About Room - lazy chunk];
    
    H -.-> L{useTexture & useGLTF};
    L -.-> M(GPU Memory);
```

---

## 🛠️ Local Development Setup

To run this application natively on your local machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/khanh0601/YOUR_REPOSITORY.git
   cd YOUR_REPOSITORY
   ```

2. **Install dependencies:**
   Make sure you are on Node.js v20+.
   ```bash
   npm install
   ```

3. **Start the local Dev Server:**
   ```bash
   npm run dev
   ```

> [!IMPORTANT]
> Since this project uses high-resolution 3D textures, the development server can feel slower than the optimized production output. For realistic performance testing, run `npm run build && npm run preview`.

## Deploying to Vercel

The repository includes `vercel.json` with the Vite build settings, SPA deep-link rewrites, security headers, and static-asset caching. Import the repository into Vercel with the project root set to this directory; no dashboard build overrides are required.

Add these variables in **Project Settings → Environment Variables**:

- `VITE_WEB3FORMS_KEY` — required for the contact form.
- `VITE_SITE_URL` — the public production URL, used for canonical URLs and the sitemap.
- `VITE_ALLOWED_ORIGINS` — comma-separated production and preview hostnames allowed to submit the contact form.
- `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` — optional analytics.

Apply contact-form variables to Production and Preview as appropriate. Vercel automatically adds `X-Robots-Tag: noindex` to standard Preview Deployments.

## 🤝 Contributing & Feedback

All PRs improving the shader physics, 3D math logic, or component memoization runtimes are welcome. Please refer to our new `.github` Issue and Pull Request templates when submitting!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingRoom`)


## License

The code in this repository is licensed under the [MIT License](LICENSE). 
**Note:** Personal content, images, and copywriting are copyright of Trần Quang Khánh and may not be reused without permission.
3. Commit your Changes (`git commit -m 'feat: Added realistic liquid simulation to Contact Room'`)
4. Push to the Branch (`git push origin feature/AmazingRoom`)
5. Open a Pull Request

---

*Portfolio of [Trần Quang Khánh](https://github.com/khanh0601).*

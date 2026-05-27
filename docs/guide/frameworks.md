# Frameworks

All frameworks share the same AI system (`DESIGN.md`, `GUARDRAILS.md`, skills, enforcement scripts). Only the source code differs.

## Next.js 14

**Best for:** Full-stack landing pages with SSR, API routes, image optimization.

```
Framework:    Next.js 14 App Router
Styling:      Tailwind CSS (+ your UI lib choice)
API:          /app/api/inquiry/route.ts (Zod validation + honeypot)
Images:       next/image with WebP/AVIF
Deploy:       Vercel (zero config)
```

```bash
npm create crucible@latest my-project
# → select: nextjs
```

**UI lib support:** All 9 options available.

## Astro 4

**Best for:** Best Lighthouse scores. Static-first, islands architecture for interactive parts.

```
Framework:    Astro 4
Styling:      Tailwind CSS
Contact form: Vanilla JS fetch in <script> block
Deploy:       Vercel, Netlify, Cloudflare Pages
```

```bash
npm create crucible@latest my-project
# → select: astro
```

**UI lib support:** Tailwind, daisyUI, Bootstrap, None. React-based libs require enabling `@astrojs/react` integration manually.

## Vite + React

**Best for:** SPA approach, client-side only, maximum flexibility.

```
Framework:    Vite 5 + React 18
Styling:      Tailwind CSS (+ your UI lib choice)
Routing:      Hash links (#section)
Deploy:       Any static host
```

```bash
npm create crucible@latest my-project
# → select: vite-react
```

**UI lib support:** All 9 options available.

## Vanilla JS

**Best for:** Zero framework overhead. Pure HTML + CSS + minimal JS.

```
Framework:    None
Bundler:      Vite (dev server + build)
Styling:      Plain CSS custom properties (tokens.css)
Token check:  scripts/check-design-tokens.mjs
Deploy:       Any static host
```

```bash
npm create crucible@latest my-project
# → select: vanilla
```

**UI lib support:** Tailwind, Bootstrap, None.

::: info Vanilla token enforcement
Instead of checking for Tailwind arbitrary values, the vanilla token checker scans all `.css`, `.html`, and `.js` files for raw hex values outside of `tokens.css`.
:::

## Framework comparison

| | Next.js | Astro | Vite+React | Vanilla |
|---|:---:|:---:|:---:|:---:|
| SSR | ✅ | ✅ (SSG) | ❌ | ❌ |
| API routes | ✅ | Add-on | ❌ | ❌ |
| TypeScript | ✅ | ✅ | ✅ | ❌ |
| Tailwind | ✅ | ✅ | ✅ | ❌ |
| React UI libs | ✅ | ⚠️ | ✅ | ❌ |
| Bundle size | Medium | Small | Medium | Tiny |
| Lighthouse | High | Highest | High | Highest |

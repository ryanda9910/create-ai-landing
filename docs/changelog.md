# Changelog

All notable changes documented here. Format: [Keep a Changelog](https://keepachangelog.com/).

## [1.1.0] — 2026-05-27

### Added
- UI library selection prompt (9 options): tailwind, shadcn/ui, Ant Design, Material UI, Mantine, Chakra UI, daisyUI, Bootstrap, none
- 3-layer template merge: `shared/` → `frameworks/` → `ui-libs/`
- Provider overlays auto-wired for antd, mui, mantine, chakra (Next.js + Vite+React)
- `components.json` + `lib/utils.ts` generated for shadcn/ui
- daisyUI: `tailwind.config.ts` overlay with plugin registered
- Bootstrap: `UI_SETUP.md` with import guide and coexistence notes
- `frameworkExtraDeps` in `_config.json` — per-framework extra packages

### Changed
- CLI now asks 10 questions (UI library added after framework)
- Docs deploy: now triggers on every push to `main`

## [1.0.0] — 2026-05-27

### Added
- Renamed from `create-ai-landing` to **crucible** (`create-crucible` on npm)
- New CLI command: `npm create crucible@latest`
- Crucible logo (SVG mark + wordmark)
- GitHub repo renamed to `ryanda9910/crucible`

### Changed
- `bin`: `create-ai-landing` → `create-crucible`
- VitePress base path: `/create-ai-landing/` → `/crucible/`

## [0.2.0] — 2026-05-27

### Added
- Multi-framework support: Astro 4, Vite + React, Vanilla JS
- Framework selection as CLI prompt
- Restructured templates: `shared/` + `frameworks/` architecture
- Vanilla JS token checker (`scripts/check-design-tokens.mjs`)
- VitePress documentation site
- Conventional commits + commitlint + Husky
- GitHub Actions CI + auto-publish workflow
- `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`

## [0.1.0] — 2026-05-27

### Added
- Initial release: Next.js 14 App Router scaffold
- `CLAUDE.md`, `DESIGN.md`, `GUARDRAILS.md` with brand interpolation
- `.claude/skills/` — copywriter, qa-mobile, ui-designer
- `scripts/check-design-tokens.ts`
- Hero, Services, Process, Contact, Header, Footer components
- API route with Zod validation + honeypot
- 9-question interactive CLI

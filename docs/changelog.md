# Changelog

All notable changes documented here. Format: [Keep a Changelog](https://keepachangelog.com/).

## [1.4.0] — 2026-05-27

### Added
- **AI tool selection**: new CLI prompt — choose Claude Code, Cursor, Windsurf, Continue, GitHub Copilot, or None
- **Cursor rules**: `.cursor/rules/copywriter.mdc`, `qa-mobile.mdc`, `code-review.mdc` generated when Cursor is selected
- **Windsurf rules**: `.windsurf/rules/` equivalents with `trigger: model_decision` frontmatter
- **Continue rules**: `.continue/rules/` equivalents with `alwaysApply: false` frontmatter
- **GitHub Copilot instructions**: `.github/instructions/*.instructions.md` with `applyTo` glob frontmatter
- **`/code-review` skill**: new Claude Code skill covering TypeScript quality, correctness, security, performance, and code hygiene — distinct from `/ui-designer` and `/qa-mobile`
- Layer 3 in template generator: AI tool rules applied after shared + framework layers, before UI lib overlay
- 36 new unit tests (106 total): AI tool layer coverage for all 4 tools + negative tests for `claude`/`none`/`undefined`

### Changed
- CLI prompts: 14 → 15 (AI coding tool added before Figma URL)
- `generateProject` signature: optional `aiTool` parameter added

## [1.3.0] — 2026-05-27

### Added
- **Profile types**: brand/organization vs individual/personal — CTA labels, section headers, and DESIGN.md adapt to who the page is for
- **12 design themes**: minimalist, dark-studio, brutalist, glassmorphism, retro, editorial, corporate, playful, cyberpunk, swiss, organic, luxury — each injects typography, motion, component, and anti-pattern guidance into `DESIGN.md § 0`
- **Figma import**: optional Figma file URL + PAT — extracts color styles + text styles via Figma REST API; overrides `PRIMARY_COLOR`/`ACCENT_COLOR` and populates `DESIGN.md` color and typography sections
- New derived template vars: `OWNER_LABEL`, `IDENTITY_LABEL`, `CTA_LABEL`, `CTA_CONTEXT`, `ABOUT_LABEL`, `DESIGN_THEME_NOTES`, `FIGMA_COLORS_SECTION`, `FIGMA_TYPOGRAPHY_SECTION`
- `src/themes.ts` — 12 ThemeDefinition objects with full aesthetic specs
- `src/figma.ts` — Figma REST API client with color/text style extraction
- `FIGMA_TOKEN` env var support (skip PAT prompt)
- 70 unit tests (up from 48) covering themes, profile types, Figma mock
- CI: unit test job added between build and e2e

### Changed
- CLI prompts: 10 → 14 (added design aesthetic, who is this for, Figma URL, Figma PAT)
- `DESIGN.md` template: new `§ 0` for design theme, `IDENTITY_LABEL`/`CTA_LABEL`/`ABOUT_LABEL` vars throughout

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

# Quick Start

<div style="margin:1.5rem 0">
  <img src="/demo.gif" alt="crucible CLI demo" style="width:100%;border-radius:10px;border:1px solid var(--vp-c-divider)" />
</div>

## Requirements

- Node.js ≥ 18
- pnpm (recommended) or npm

## Create a project

```bash
npm create crucible@latest my-project
# or
npx create-crucible my-project
```

The CLI asks 14 questions:

| Question | Example |
|---|---|
| Project name | `volta-studio` |
| Framework | Next.js 14 / Astro 4 / Vite+React / Vanilla JS |
| UI library | shadcn/ui, Ant Design, MUI, Mantine, Chakra, daisyUI, Bootstrap, None |
| Design aesthetic | minimalist, brutalist, glassmorphism, editorial, luxury, … (12 options) |
| Who is this for? | Brand / Organization — or — Individual / Personal |
| Brand / your name | `Volta Studio` or `Alex Chen` |
| Tagline | `Every frame needs a sound.` |
| Industry | Music / Photo / Agency / SaaS / Other |
| City | `Jakarta` |
| Primary color | `#0A0A0B` |
| Accent color | `#D4A574` |
| Domain | `voltastudio.com` |
| Email | `hello@voltastudio.com` |
| Figma file URL *(optional)* | paste URL → colors + typography auto-extracted |

## Install and run

```bash
cd my-project
pnpm install
pnpm dev
```

## What to fill in manually

After scaffolding, open these files:

```
DESIGN.md               → complete voice, feel, and component pattern descriptions
src/lib/services.ts     → your actual services + deliverables
src/lib/process.ts      → your actual process steps
src/lib/site.ts         → verify brand info (auto-filled by CLI)
```

## Before committing

```bash
pnpm precommit
```

Runs lint + typecheck + design token check. Commit blocked if hardcoded hex values are found in components.

## Using with Claude Code

Claude reads `CLAUDE.md` automatically on session start. Use the skills to scope work:

```
/copywriter    Write hero copy for the studio
/qa-mobile     Check all tap targets and form accessibility
/ui-designer   Build the Works section with project cards
```

Each skill loads role-specific constraints before doing any work.

::: tip UI library wired automatically
If you selected a provider-based UI lib (Ant Design, MUI, Mantine, Chakra UI), the provider is already wired into `layout.tsx` / `main.tsx`. Run `pnpm install` and it works.
:::

::: tip Figma import (optional)
Provide a Figma file URL at the last prompt. If your Figma styles have names containing "primary", "brand", "accent", or "cta", those colors are extracted and injected into `tokens.css` and `DESIGN.md` automatically. You need a [Personal Access Token](https://www.figma.com/developers/api#access-tokens) or set `FIGMA_TOKEN` in your env.
:::

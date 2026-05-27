# Quick Start

## Requirements

- Node.js ≥ 18
- pnpm (recommended) or npm

## Create a project

```bash
npm create crucible@latest my-project
# or
npx create-crucible my-project
```

The CLI asks 10 questions:

| Question | Example |
|---|---|
| Project name | `volta-studio` |
| Framework | Next.js 14 / Astro 4 / Vite+React / Vanilla JS |
| UI library | shadcn/ui, Ant Design, MUI, Mantine, Chakra, daisyUI, Bootstrap, None |
| Brand name | `Volta Studio` |
| Tagline | `Every frame needs a sound.` |
| Industry | Music / Photo / Agency / SaaS / Other |
| City | `Jakarta` |
| Primary color | `#0A0A0B` |
| Accent color | `#D4A574` |
| Domain | `voltastudio.com` |
| Email | `hello@voltastudio.com` |

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

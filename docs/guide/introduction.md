# Introduction

## What is crucible?

`crucible` (npm: `create-crucible`) is a CLI scaffold for landing pages. It generates a complete project with a full AI agent system built in — not just a component library, but a constraint system that shapes how AI writes code and copy for your specific brand.

## The problem it solves

Most AI-generated landing pages look the same because the AI has no information about the brand. Without constraints, it defaults to:

- Generic copy ("Professional solutions for discerning clients")
- 3-column equal grids with stock icons
- Hex values hardcoded in every component
- Missing `<form>` wrappers, broken Enter key submission
- Black placeholder OG images

`crucible` solves this by generating a **constraint system** alongside the code:

```
your-project/
  CLAUDE.md          ← AI reads this every session
  DESIGN.md          ← exact colors, fonts, anti-patterns
  GUARDRAILS.md      ← learned failure patterns
  .claude/skills/    ← role-based AI constraints
  scripts/           ← automated enforcement
```

## The core idea

```
Slop     = AI without constraints
Not slop = AI inside a design system + guardrails + concrete specs
```

A crucible is the vessel where raw material transforms into refined output. Your brand inputs go in — a constrained, AI-ready scaffold comes out. The walls are set. The AI works inside them.

## What gets generated

Running `npm create crucible@latest my-project` generates:

1. **AI meta-files** — `CLAUDE.md`, `DESIGN.md`, `GUARDRAILS.md` pre-filled with your brand
2. **Claude Code skills** — `copywriter`, `qa-mobile`, `ui-designer` in `.claude/skills/`
3. **Token enforcement** — script blocks hardcoded hex at commit time
4. **Precommit pipeline** — lint + typecheck + token check
5. **Component skeletons** — Hero, Services, Process, Contact, Header, Footer
6. **Data layer** — `src/lib/site.ts`, `services.ts`, `process.ts` — content separate from markup
7. **API route** — contact form with Zod validation + honeypot (Next.js)
8. **UI library** — your chosen lib's deps injected + providers wired

## Who is it for?

- Developers building brand landing pages with Claude Code, Cursor, or Copilot
- Agencies who want a repeatable AI-assisted workflow per client
- Indie builders who want to ship faster without generating generic output

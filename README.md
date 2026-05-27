# create-ai-landing

Scaffold a landing page with a full AI agent system built in.

```bash
npx @aldoryanda/create-ai-landing my-project
```

Answers 9 questions → generates a complete Next.js 14 landing page with:

- `CLAUDE.md` — AI session briefing, pre-filled with your brand
- `DESIGN.md` — design system ground truth (colors, typography, anti-patterns)
- `GUARDRAILS.md` — failure memory, pre-loaded with common pitfalls
- `.claude/skills/` — copywriter, qa-mobile, ui-designer role constraints
- `scripts/check-design-tokens.ts` — blocks hardcoded hex at commit
- `pnpm precommit` — lint + typecheck + token check in one command
- Full component skeletons: Hero, Services, Process, Contact, Header, Footer
- API route with Zod validation + honeypot
- `src/lib/site.ts` — single source of truth for brand name, domain, email

## What gets personalized

| Variable | Example |
|---|---|
| `BRAND_NAME` | Volta Studio |
| `TAGLINE` | Every beat tells a story. |
| `PRIMARY_COLOR` | #1A1A2E |
| `ACCENT_COLOR` | #E94560 |
| `CITY` | Bandung |
| `DOMAIN` | voltastudio.com |
| `EMAIL` | hello@voltastudio.com |

## After scaffolding

```
cd my-project
pnpm install
# Fill in:
#   DESIGN.md        → complete your color/type system
#   src/lib/         → add your real content
#   GUARDRAILS.md    → will fill itself as you build
pnpm dev
```

## The idea

AI output quality = quality of the environment you build.

```
Slop     = AI without constraints
Not slop = AI with design system + guardrails + concrete specs
```

Built from lessons building [Sonara Studio](https://github.com/ryanda9910) landing page with Claude Code.

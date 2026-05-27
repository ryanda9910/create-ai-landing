# AI Skills

Skills are role-based constraint files for Claude Code. Each skill loads specific rules before doing any work.

## Location

```
.claude/skills/
  copywriter/SKILL.md
  qa-mobile/SKILL.md
  ui-designer/SKILL.md
```

::: warning Important
Skills MUST be in `.claude/skills/`, not `.agents/skills/`. Claude Code only loads from the `.claude/` directory.
:::

## /copywriter

Enforces voice, tone, and specificity rules from `DESIGN.md`.

**Rules enforced:**
- No superlatives (world-class, innovative, passionate)
- Specific over vague — name the city, the format, the gear, the numbers
- Headlines max 10 words
- CTAs verb-first, max 4 words

**Usage:**
```
/copywriter Write hero section copy for a film scoring studio in Jakarta
/copywriter Review the Services section copy for slop
```

## /qa-mobile

Runs a checklist against the built UI at 375px viewport.

**Checks:**
- All tap targets ≥44px (WCAG)
- `<form>` wrapper present on all forms
- `<nav>` elements have `aria-label`
- No horizontal overflow at 375px
- OG image is not a black placeholder
- Video has poster fallback
- `prefers-reduced-motion` respected

**Usage:**
```
/qa-mobile Run full mobile QA check
```

## /ui-designer

Enforces design system rules when implementing components.

**Rules enforced:**
- All colors via token names (`bg-accent`, not `bg-[#D4A574]`)
- All spacing from scale (`p-4`, not `p-[18px]`)
- No inline `style={}` props
- No new CSS custom properties without updating `DESIGN.md`
- Hover states required on all interactive elements
- `prefers-reduced-motion` check on any animation

**Usage:**
```
/ui-designer Build the Works section with 6 project cards
```

## /code-review

Reviews code for correctness, TypeScript quality, security, and performance. Complements `/ui-designer` (design tokens) and `/qa-mobile` (mobile viewport) — does not overlap with either.

**Checks:**
- Pre-flight gate: `pnpm precommit`, `tsc --noEmit`, no `console.log` in `src/`
- TypeScript: no `any`, no bare `!` non-null assertions, typed event handlers, explicit prop interfaces
- Correctness: `useEffect` cleanup, stable `.map()` keys, `e.preventDefault()` before async, stuck-spinner prevention
- Security: server-side validation, Zod schema, honeypot, no leaked env vars, `rel="noopener noreferrer"` on external links
- Performance: lazy imports for heavy libraries, `next/image` usage, no sync ops in render
- Code hygiene: no dead imports, no commented-out code, named exports, `cn()` for classNames

**Usage:**
```
/code-review Review the Contact component before merge
/code-review Full pre-deploy code review
```

## AI tool rule mirrors

If you selected an AI coding tool during scaffolding, the same skill rules are mirrored into tool-native formats:

| AI Tool | Rule location | Invocation |
|---|---|---|
| **Cursor** | `.cursor/rules/*.mdc` | `@copywriter`, `@qa-mobile`, `@code-review` |
| **Windsurf** | `.windsurf/rules/*.md` | Model picks rules automatically (`model_decision`) |
| **Continue** | `.continue/rules/*.md` | Manual invocation |
| **GitHub Copilot** | `.github/instructions/*.instructions.md` | Applied by file glob |

The Claude Code skills in `.claude/skills/` are always included regardless of which AI tool you chose.

## Adding a custom skill

Create `.claude/skills/your-skill/SKILL.md`:

```md
---
name: your-skill
description: One-line description of what this skill does
---

# Your Skill Name

## Rules
- Rule 1
- Rule 2

## Usage
Explain when and how to invoke this skill.
```

The `name` and `description` frontmatter fields are required.

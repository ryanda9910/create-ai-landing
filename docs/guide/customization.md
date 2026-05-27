# Brand & Content

## What's pre-filled by the CLI

When you run `npm create crucible@latest`, these variables are injected into every file:

| Variable | Where it appears |
|---|---|
| `BRAND_NAME` | `CLAUDE.md`, `DESIGN.md`, `GUARDRAILS.md`, `site.ts`, Header, Footer |
| `TAGLINE` | Hero headline, OG meta, `DESIGN.md` |
| `PRIMARY_COLOR` | `tokens.css` CSS custom properties |
| `ACCENT_COLOR` | `tokens.css` CSS custom properties |
| `CITY` | Hero eyebrow, Footer, `DESIGN.md` |
| `DOMAIN` | OG meta, `site.ts`, API route |
| `EMAIL` | Footer, Contact section, `site.ts` |
| `YEAR` | Footer copyright |

## What you fill in manually

After scaffolding, open these files:

### `src/lib/services.ts`
Replace placeholder brackets with your actual services:
```ts
{
  title: 'Film Scoring',
  tagline: 'We score to picture, not to a brief.',
  description: '32-piece Jakarta session ensemble. Stems, sync-ready...',
  deliverables: ['Full score', 'Stems', 'Sync license'],
}
```

### `src/lib/process.ts`
Replace with your actual workflow steps and durations.

### `DESIGN.md` sections 1 and 3
Fill in voice description and feel:
```md
**Voice:** Formal but accessible. Technical details without gatekeeping.
**Feel:** Boutique precision. Dark, warm, specific.
```

### Hero description in `Hero.tsx` / `Hero.astro`
Replace the placeholder comment with a specific description:
```tsx
// Replace this:
[Your specific description here. Avoid vague adjectives.]

// With this:
Film scoring, Dolby Atmos mixing, and artist production.
Built out of Jakarta — delivered to wherever the work goes.
```

## Colors

Colors in `tokens.css` use `color-mix()` for surface and border derivation. If you need exact values, replace them directly:

```css
:root {
  --color-bg:      #1A1A2E;
  --color-surface: #1E2340;   /* manual override */
  --color-border:  #2A2F50;   /* manual override */
}
```

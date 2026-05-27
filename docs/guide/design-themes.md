# Design Themes

Pick a world design aesthetic at scaffold time. The theme injects a full guidance block into `DESIGN.md § 0` — typography, spacing, motion, component patterns, color philosophy, and a list of anti-patterns for that aesthetic.

## Available themes

| Slug | Name | Character |
|---|---|---|
| `minimalist` | Minimalist | Clean, maximum white space, single accent |
| `dark-studio` | Dark Studio | Dark bg, cinematic, moody |
| `brutalist` | Brutalist | Raw, bold, anti-polish |
| `glassmorphism` | Glassmorphism | Frosted glass, backdrop blur, layered |
| `retro` | Retro / Vintage | Warm, nostalgic, serif-heavy |
| `editorial` | Editorial | Magazine grid, large display type |
| `corporate` | Corporate | Structured, professional, trustworthy |
| `playful` | Playful | Colorful, rounded, energetic |
| `cyberpunk` | Cyberpunk | Neon on dark, glitch aesthetic |
| `swiss` | Swiss / Bauhaus | Geometric, grid-based, sans-serif only |
| `organic` | Organic | Earthy, natural, sustainable |
| `luxury` | Luxury | Premium, refined, metallic accents |

## What gets injected

Each theme writes a block like this into `DESIGN.md § 0`:

```md
## 0. Design Theme: brutalist

**Typography:** Bold sans-serif only. Oversize display. No serifs.
**Spacing:** Tight, asymmetric. Break the grid intentionally.
**Motion:** Snap (50ms). No easing curves. No transitions except on interaction.
**Components:** No border-radius. Hard shadows (4px 4px 0 black). Raw `<hr>` separators.
**Color:** 2 colors max + black + white. High contrast, no gradients.
**Anti-patterns:** Drop shadows, rounded cards, smooth scroll animations, gradient buttons.
```

The AI reads `DESIGN.md § 0` every session, so every component, copy, and layout decision is filtered through the aesthetic from the start.

## Choosing a theme

The design aesthetic prompt appears after UI library selection:

```
◇  Design aesthetic
│  ○ Minimalist       — clean, max white space, single accent
│  ● Dark Studio      — dark bg, cinematic, moody
│  ○ Brutalist        — raw, bold, anti-polish
│  ○ Glassmorphism    — frosted glass, backdrop blur, layered
│  ...
```

## Changing the theme after scaffold

Edit `DESIGN.md § 0` directly. Replace the theme name and guidance block with whichever aesthetic you want. The AI reads the file content, not the original CLI selection.

# Figma Import

Provide a Figma file URL at scaffold time. crucible extracts color styles and text styles from the file and injects them into `DESIGN.md` and `tokens.css` automatically.

## How it works

1. You provide a Figma file URL (any plan — uses the public Styles API)
2. crucible fetches the file via `GET /v1/files/:file_id`
3. Color styles and text styles are extracted from `response.styles`
4. Node values are fetched via `GET /v1/files/:file_id/nodes`
5. Heuristics map style names to semantic tokens:
   - Name contains `primary`, `brand`, `main` → `PRIMARY_COLOR`
   - Name contains `accent`, `cta`, `highlight` → `ACCENT_COLOR`
   - Fallback: first color = primary, second = accent
6. Results written to `DESIGN.md § 2` (colors) and `DESIGN.md § 3` (typography)

## Authentication

You need a Figma Personal Access Token:

1. Go to [figma.com](https://www.figma.com) → Settings → Security → Personal access tokens
2. Generate a token with read access
3. Provide it at the CLI prompt — or set `FIGMA_TOKEN` in your env to skip the prompt:

```bash
FIGMA_TOKEN=fig-pat-... npm create crucible@latest my-project
```

## What gets injected

### DESIGN.md § 2 — Colors

```md
## 2. Color Tokens

### Extracted from Figma

| Token name | Hex | Usage |
|---|---|---|
| Primary/Brand | #1A1A2E | Primary brand color |
| Accent/CTA | #E94560 | Accent / call-to-action |
| Surface/Light | #F8F8F8 | Light surface background |
| ... | ... | ... |
```

### DESIGN.md § 3 — Typography

```md
## 3. Typography

### Extracted from Figma

| Style name | Font | Size | Weight | Line height |
|---|---|---|---|---|
| Display/XL | Fraunces | 72px | 700 | 1.1 |
| Body/Base | Inter | 16px | 400 | 1.6 |
| ... | ... | ... | ... | ... |
```

## Supported file types

Any Figma file you have at least view access to. The import reads **color styles** and **text styles** defined in the file. Local styles defined on individual frames are not extracted — only published/named styles.

## Without Figma

Press Enter to skip the Figma URL prompt. `DESIGN.md` is generated with placeholder color and typography sections for you to fill in manually. `PRIMARY_COLOR` and `ACCENT_COLOR` use the hex values you entered in the color prompts.

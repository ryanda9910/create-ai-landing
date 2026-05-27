# Adding a Framework

Want to add SvelteKit, Nuxt, Remix, or another framework? Here's the exact process.

## 1. Create template directory

```bash
mkdir -p templates/frameworks/{your-framework}/src/{components,lib,styles}
```

## 2. Required files

Every framework template must include:

| File | Purpose |
|---|---|
| `package.json.tmpl` | Dependencies with `{{BRAND_SLUG}}` name |
| `src/lib/site.ts.tmpl` | `SITE` object with brand vars |
| `src/lib/services.ts.tmpl` | Services data structure |
| `src/lib/process.ts.tmpl` | Process steps |
| `src/styles/tokens.css.tmpl` | CSS custom properties |
| Framework config | `astro.config.mjs`, `vite.config.ts`, etc. |
| Entry point | `index.html`, `src/app/page.tsx`, etc. |
| Sections | Hero, Services, Process, Contact components |
| Layout | Header, Footer |

## 3. Template variables

Use `{{VAR_NAME}}` syntax in `.tmpl` files:

```
{{BRAND_NAME}}     Volta Studio
{{BRAND_SLUG}}     volta-studio
{{TAGLINE}}        Every frame needs a sound.
{{INDUSTRY}}       music
{{CITY}}           Jakarta
{{PRIMARY_COLOR}}  #0A0A0B
{{ACCENT_COLOR}}   #D4A574
{{DOMAIN}}         voltastudio.com
{{EMAIL}}          hello@voltastudio.com
{{YEAR}}           2026
{{FRAMEWORK}}      your-framework
{{UI_LIB}}         tailwind
```

Files without `.tmpl` extension are copied as-is.

## 4. Register in CLI

Add to the `framework` select in `src/index.ts`:

```ts
{ value: 'your-framework', label: 'Framework Name', hint: 'Short description' },
```

Also add UI lib options for the new framework in the `UI_LIB_OPTIONS` map:

```ts
'your-framework': [
  { value: 'tailwind',  label: 'Tailwind CSS',  hint: 'default' },
  // add compatible libs
  { value: 'none',      label: 'None',           hint: 'plain CSS' },
],
```

## 5. Shared files (don't duplicate)

These come from `templates/shared/` — don't include them in your framework template:

- `CLAUDE.md.tmpl`
- `DESIGN.md.tmpl`
- `GUARDRAILS.md.tmpl`
- `.claude/skills/`
- `docs/DESIGN-DECISIONS.md.tmpl`
- `scripts/check-design-tokens.ts`

## 6. Key requirements

All framework templates must:
- Use CSS custom properties from `tokens.css` (no hardcoded hex)
- Include `aria-label` on all `<nav>` elements
- Wrap contact form in `<form>` with submit handler
- Respect `prefers-reduced-motion` on video/animation
- All tap targets ≥44px

## 7. Documentation

Add a section to `docs/guide/frameworks.md` with:
- Use case
- Configuration summary
- CLI command

## 8. Submit PR

See [Contributing](/guide/contributing) for the full PR process.

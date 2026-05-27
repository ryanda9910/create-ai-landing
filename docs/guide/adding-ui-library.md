# Adding a UI Library

Want to add Radix UI, PrimeReact, Headless UI, or another library? Here's the exact process.

## Structure

Each UI library lives in `templates/ui-libs/{name}/`:

```
templates/ui-libs/your-lib/
  _config.json              ← required: deps + metadata
  shared/                   ← files merged for all compatible frameworks
  nextjs/                   ← files merged only for Next.js
  vite-react/               ← files merged only for Vite+React
  astro/                    ← files merged only for Astro
  vanilla/                  ← files merged only for Vanilla
```

## 1. Create `_config.json`

```json
{
  "name": "Your Library Name",
  "compatibleFrameworks": ["nextjs", "vite-react"],
  "deps": {
    "your-lib": "^2.0.0"
  },
  "devDeps": {},
  "frameworkExtraDeps": {
    "nextjs": {
      "your-lib-nextjs": "^2.0.0"
    }
  },
  "frameworkExtraDevDeps": {}
}
```

- `deps` — injected into `dependencies` for all compatible frameworks
- `devDeps` — injected into `devDependencies`
- `frameworkExtraDeps` — additional deps for a specific framework only
- `compatibleFrameworks` — informational (CLI prompt handles filtering)

## 2. Add overlay files (optional)

For provider-based libs, create overlay entry points that replace the framework's defaults:

**Next.js — `nextjs/src/app/providers.tsx`:**
```tsx
'use client';
import { YourProvider } from 'your-lib';

export function Providers({ children }: { children: React.ReactNode }) {
  return <YourProvider>{children}</YourProvider>;
}
```

**Next.js — `nextjs/src/app/layout.tsx.tmpl`:**
```tsx
import { Providers } from './providers';
// ... metadata ...
export default function RootLayout({ children }) {
  return (
    <html lang="en"><body><Providers>{children}</Providers></body></html>
  );
}
```

**Vite+React — `vite-react/src/main.tsx`:**
```tsx
import { YourProvider } from 'your-lib';
createRoot(...).render(
  <StrictMode>
    <YourProvider><App /></YourProvider>
  </StrictMode>
);
```

## 3. Register in CLI

Add to `UI_LIB_OPTIONS` in `src/index.ts`, under each compatible framework:

```ts
{ value: 'your-lib', label: 'Your Library', hint: 'short description' },
```

## 4. Document it

Add a section to `docs/guide/ui-libraries.md`:
- What gets generated
- Compatible frameworks
- Post-install steps
- Theme customization example

## 5. Test

```bash
pnpm dev
# → select nextjs → select your-lib → verify output package.json has correct deps
# → verify provider files exist in output
```

## 6. Submit PR

See [Contributing](/guide/contributing).

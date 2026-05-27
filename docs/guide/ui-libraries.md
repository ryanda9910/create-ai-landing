# UI Libraries

crucible supports 9 UI library options. Select one at scaffold time — deps are injected into `package.json` and providers are wired up automatically.

## How it works

The generator runs a 3-layer merge:

```
templates/shared/           ← AI system files (always)
templates/frameworks/{fw}/  ← framework source (always)
templates/ui-libs/{lib}/    ← UI lib overlay (optional)
```

The overlay adds:
- Extra deps to `package.json`
- Provider files (`providers.tsx`)
- Updated entry points (`layout.tsx`, `main.tsx`)
- Config files (`components.json`, `tailwind.config.ts`)

---

## Tailwind CSS *(default)*

No extra setup. Already configured in all React and Astro frameworks.

```
Compatible: Next.js, Astro, Vite+React, Vanilla JS
```

---

## shadcn/ui

Radix UI primitives + Tailwind class composition. The most popular headless + styled system.

```
Compatible: Next.js, Vite+React
```

**What gets generated:**
- `components.json` — shadcn configuration (RSC-aware per framework)
- `src/lib/utils.ts` — `cn()` utility using `clsx` + `tailwind-merge`
- All required deps injected: `@radix-ui/react-slot`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`

**After scaffolding:**
```bash
pnpm install
npx shadcn@latest add button card input label textarea
```

---

## Ant Design 5

Enterprise-grade React component library. Ships with 60+ production-ready components.

```
Compatible: Next.js, Vite+React
```

**What gets generated (Next.js):**
- `src/app/providers.tsx` — `AntdRegistry` + `ConfigProvider` with dark theme
- `src/app/layout.tsx` — wraps `<body>` with `<Providers>`
- Deps: `antd`, `@ant-design/nextjs-registry`

**What gets generated (Vite+React):**
- `src/main.tsx` — wraps `<App>` with `ConfigProvider` (dark theme preset)
- Deps: `antd`

**Customize theme:**
```tsx
// src/app/providers.tsx
<ConfigProvider
  theme={{
    algorithm: theme.darkAlgorithm,
    token: { colorPrimary: '#your-accent' },
  }}
>
```

---

## Material UI 6

Google Material Design. Comprehensive component system with deep theming.

```
Compatible: Next.js, Vite+React
```

**What gets generated (Next.js):**
- `src/app/providers.tsx` — `AppRouterCacheProvider` + `ThemeProvider` with dark palette
- `src/app/layout.tsx` — wraps body with providers
- Deps: `@mui/material`, `@emotion/react`, `@emotion/styled`, `@mui/material-nextjs`, `@emotion/cache`

**What gets generated (Vite+React):**
- `src/main.tsx` — wraps `<App>` with `ThemeProvider`
- Deps: `@mui/material`, `@emotion/react`, `@emotion/styled`

**Customize theme:**
```tsx
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#your-accent' },
  },
});
```

---

## Mantine 7

Full-featured component library with 100+ components and built-in dark mode support.

```
Compatible: Next.js, Vite+React
```

**What gets generated (Next.js):**
- `src/app/providers.tsx` — `MantineProvider` with dark default
- `src/app/layout.tsx` — includes `<ColorSchemeScript />` in `<head>` (prevents flash)
- Deps: `@mantine/core`, `@mantine/hooks`
- Dev deps: `postcss-preset-mantine`

**What gets generated (Vite+React):**
- `src/main.tsx` — wraps `<App>` with `MantineProvider`
- Same deps

::: warning PostCSS config
Mantine requires `postcss-preset-mantine` in `postcss.config.js`. Add it if your framework uses PostCSS:
```js
module.exports = {
  plugins: { 'postcss-preset-mantine': {}, 'postcss-simple-vars': {} },
};
```
:::

---

## Chakra UI 3

Accessible component system. v3 dropped Emotion and framer-motion dependencies.

```
Compatible: Next.js, Vite+React
```

**What gets generated (Next.js):**
- `src/app/providers.tsx` — `ChakraProvider` with `defaultSystem`
- `src/app/layout.tsx` — wraps body with providers
- Deps: `@chakra-ui/react`

**What gets generated (Vite+React):**
- `src/main.tsx` — wraps `<App>` with `ChakraProvider`
- Same deps

**Custom system:**
```tsx
import { createSystem, defaultConfig } from '@chakra-ui/react';
const system = createSystem(defaultConfig, {
  theme: { tokens: { colors: { brand: { value: '#your-accent' } } } },
});
```

---

## daisyUI 4

Tailwind plugin that adds semantic component classes (`btn`, `card`, `navbar`, etc).

```
Compatible: Next.js, Astro, Vite+React
```

**What gets generated:**
- `tailwind.config.ts` — replaces framework default with daisyUI plugin + dark theme preset
- Dev deps: `daisyui`

**Using components:**
```html
<button class="btn btn-primary">Start a project</button>
<div class="card bg-base-100 shadow-xl">...</div>
<div class="hero min-h-screen">...</div>
```

Your brand colors can map to daisyUI theme variables in `tokens.css`.

---

## Bootstrap 5

Classic CSS framework. Works anywhere including Astro and Vanilla JS.

```
Compatible: Next.js, Astro, Vite+React, Vanilla JS
```

**What gets generated:**
- `UI_SETUP.md` — import instructions + coexistence notes
- Deps: `bootstrap`

**Add import to your main CSS:**
```css
/* src/styles/tokens.css — add at top */
@import 'bootstrap/dist/css/bootstrap.min.css';
```

::: warning Tailwind coexistence
Bootstrap and Tailwind CSS reset styles conflict. For landing pages, use one or the other. `UI_SETUP.md` in your generated project explains how to scope them if needed.
:::

---

## None *(plain CSS)*

No UI library. Use CSS custom properties from `tokens.css` and write components from scratch.

```
Compatible: All frameworks
```

Best for: Projects where you want full control, or plan to add a UI lib manually later.

---

## Compatibility matrix

| UI Library | Next.js | Astro | Vite+React | Vanilla |
|---|:---:|:---:|:---:|:---:|
| Tailwind CSS | ✅ | ✅ | ✅ | ✅ |
| shadcn/ui | ✅ | — | ✅ | — |
| Ant Design | ✅ | — | ✅ | — |
| Material UI | ✅ | — | ✅ | — |
| Mantine | ✅ | — | ✅ | — |
| Chakra UI | ✅ | — | ✅ | — |
| daisyUI | ✅ | ✅ | ✅ | — |
| Bootstrap | ✅ | ✅ | ✅ | ✅ |
| None | ✅ | ✅ | ✅ | ✅ |

Astro supports React-based libs by enabling `@astrojs/react` integration — they're not pre-configured by crucible since Astro's component model is framework-agnostic.

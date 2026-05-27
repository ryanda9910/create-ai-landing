---
name: ui-designer
description: Implement UI components following the design system. Enforces token usage, component patterns, and motion rules.
---

# UI Designer Skill

## Read first
Open `DESIGN.md` fully before writing any component. No exceptions.

## Token enforcement

Before writing any className:
- Colors: use token names only (`bg-accent`, `text-primary`) — NEVER `bg-[#hex]`
- Spacing: use scale only (`p-4`, `gap-6`) — NEVER `p-[18px]`
- Run `pnpm check:tokens` after any UI work

## Typography rules

- Headlines → `font-display` class (serif)
- Body → default font
- Specs, timestamps, technical data → `font-mono`
- Section labels → `label-uppercase` class

## Component checklist before submitting

- [ ] All colors use tokens, no hardcoded hex
- [ ] All spacing uses scale values
- [ ] Interactive elements are ≥ 44px tap target
- [ ] Hover state present on all interactive elements
- [ ] `transition-colors duration-300` on hover (no instant color jumps)
- [ ] `prefers-reduced-motion` respected for any animation
- [ ] No `rounded-xl` or `rounded-2xl` — max `rounded-md` (6px)

## New component pattern

```tsx
// One folder per component
// src/components/sections/ComponentName/ComponentName.tsx
// Export from src/components/sections/ComponentName/index.ts

import { cn } from '@/lib/utils';

interface ComponentNameProps {
  className?: string;
}

export function ComponentName({ className }: ComponentNameProps) {
  return (
    <section className={cn('py-24 md:py-32', className)}>
      <div className="container-page">
        {/* content */}
      </div>
    </section>
  );
}
```

## What NOT to do

- Do NOT introduce new CSS custom properties without adding to DESIGN.md first
- Do NOT use `@apply` in component files (use `cn()` instead)
- Do NOT add inline `style={}` props
- Do NOT use `!important`

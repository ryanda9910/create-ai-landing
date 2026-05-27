---
layout: home

hero:
  name: "crucible"
  text: "Landing pages that aren't slop"
  tagline: Scaffold a landing page with a full AI agent system built in — DESIGN.md, GUARDRAILS, skills, and token enforcement baked in from day one.
  image:
    src: /icon-crucible.svg
    alt: crucible
  actions:
    - theme: brand
      text: Get Started →
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/ryanda9910/crucible

features:
  - icon: 🎨
    title: DESIGN.md — Ground Truth
    details: Color tokens, typography rules, spacing scale, and a forbidden anti-pattern list. Every AI session reads this before touching any UI.

  - icon: 🧠
    title: GUARDRAILS.md — Institutional Memory
    details: Every mistake documented. SVG optimizer bug, broken form patterns, tap target violations — logged once, never repeated.

  - icon: 🧩
    title: 9 UI Libraries
    details: Tailwind (default), shadcn/ui, Ant Design, Material UI, Mantine, Chakra UI, daisyUI, Bootstrap, or plain CSS. Deps injected and providers wired automatically.

  - icon: 🎭
    title: 12 Design Themes
    details: Pick a world design aesthetic — minimalist, brutalist, glassmorphism, editorial, cyberpunk, luxury, and 6 more. Typography, motion, and anti-pattern guidance injected into DESIGN.md automatically.

  - icon: 👤
    title: Brand or Individual
    details: Scaffold for a studio/company or a personal portfolio. CTA labels, section headers, and DESIGN.md adapt to the profile type automatically.

  - icon: 🖼️
    title: Figma Import
    details: Provide a Figma file URL and PAT. Colors and typography extracted from design styles — PRIMARY_COLOR, ACCENT_COLOR, and DESIGN.md populated from your actual design.

  - icon: 🤖
    title: AI Skills System
    details: Role-based constraints. /copywriter enforces voice rules. /qa-mobile runs the tap-target checklist. /ui-designer enforces design tokens. /code-review gates TypeScript quality, security, and performance.

  - icon: 🛠️
    title: 5 AI Tool Integrations
    details: Claude Code, Cursor, Windsurf, Continue, or GitHub Copilot. Pick at scaffold time — same skill rules written in tool-native format (.cursor/rules/, .windsurf/rules/, .continue/rules/, .github/instructions/).

  - icon: 🔒
    title: Token Enforcement
    details: Script blocks hardcoded hex values at commit time. Design consistency enforced by the build system, not discipline.

  - icon: ⚡
    title: 4 Frameworks
    details: Next.js 14, Astro 4, Vite + React, Vanilla JS. Same AI system — different runtime. Pick what fits your stack.
---

<div class="demo-section">
  <img src="/demo.gif" alt="crucible CLI demo — 10 prompts to a fully wired scaffold" />
</div>

<style>
.demo-section {
  max-width: 860px;
  margin: 3rem auto 0;
  padding: 0 1.5rem;
  text-align: center;
}
.demo-section img {
  width: 100%;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
}
</style>

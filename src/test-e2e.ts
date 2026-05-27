#!/usr/bin/env tsx
/**
 * E2E test suite for crucible generator.
 * Tests all framework × UI lib combinations.
 * Run: pnpm tsx src/test-e2e.ts
 */
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { generateProject } from './generator.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.resolve(__dirname, '..', 'templates');

const VARS = {
  BRAND_NAME:    'Test Studio',
  BRAND_SLUG:    'test-studio',
  TAGLINE:       'Test tagline here.',
  INDUSTRY:      'saas',
  CITY:          'Jakarta',
  PRIMARY_COLOR: '#0A0A0B',
  ACCENT_COLOR:  '#D4A574',
  DOMAIN:        'teststudio.com',
  EMAIL:         'hello@teststudio.com',
  YEAR:          '2026',
  FRAMEWORK:     '',
  UI_LIB:        '',
  DESIGN_THEME:  'minimalist',
  PROFILE_TYPE:  'brand',
};

// All valid combinations
const COMBOS: Array<[string, string]> = [
  // nextjs — all 9
  ['nextjs', 'tailwind'],
  ['nextjs', 'shadcn'],
  ['nextjs', 'antd'],
  ['nextjs', 'mui'],
  ['nextjs', 'mantine'],
  ['nextjs', 'chakra'],
  ['nextjs', 'daisyui'],
  ['nextjs', 'bootstrap'],
  ['nextjs', 'none'],
  // astro — 4
  ['astro', 'tailwind'],
  ['astro', 'daisyui'],
  ['astro', 'bootstrap'],
  ['astro', 'none'],
  // vite-react — all 9
  ['vite-react', 'tailwind'],
  ['vite-react', 'shadcn'],
  ['vite-react', 'antd'],
  ['vite-react', 'mui'],
  ['vite-react', 'mantine'],
  ['vite-react', 'chakra'],
  ['vite-react', 'daisyui'],
  ['vite-react', 'bootstrap'],
  ['vite-react', 'none'],
  // vanilla — 3
  ['vanilla', 'tailwind'],
  ['vanilla', 'bootstrap'],
  ['vanilla', 'none'],
];

// Required files per framework
const REQUIRED_FILES: Record<string, string[]> = {
  nextjs: [
    'CLAUDE.md', 'DESIGN.md', 'GUARDRAILS.md',
    '.claude/skills/copywriter/SKILL.md',
    '.claude/skills/qa-mobile/SKILL.md',
    '.claude/skills/ui-designer/SKILL.md',
    'package.json',
    'src/app/layout.tsx',
    'src/app/page.tsx',
    'src/lib/site.ts',
    'src/styles/tokens.css',
    'tailwind.config.ts',
  ],
  astro: [
    'CLAUDE.md', 'DESIGN.md', 'GUARDRAILS.md',
    '.claude/skills/copywriter/SKILL.md',
    'package.json',
    'src/pages/index.astro',
    'src/lib/site.ts',
    'tailwind.config.ts',
  ],
  'vite-react': [
    'CLAUDE.md', 'DESIGN.md', 'GUARDRAILS.md',
    '.claude/skills/copywriter/SKILL.md',
    'package.json',
    'src/main.tsx',
    'src/App.tsx',
    'src/lib/site.ts',
    'src/styles/tokens.css',
    'tailwind.config.ts',
  ],
  vanilla: [
    'CLAUDE.md', 'DESIGN.md', 'GUARDRAILS.md',
    '.claude/skills/copywriter/SKILL.md',
    'package.json',
    'index.html',
    'src/styles/tokens.css',
  ],
};

// UI lib specific files expected per framework
const UI_LIB_EXPECTED: Record<string, Record<string, string[]>> = {
  shadcn: {
    nextjs: ['src/lib/utils.ts', 'components.json'],
    'vite-react': ['src/lib/utils.ts', 'components.json'],
  },
  antd: {
    nextjs: ['src/app/providers.tsx', 'src/app/layout.tsx'],
    'vite-react': ['src/main.tsx'],
  },
  mui: {
    nextjs: ['src/app/providers.tsx', 'src/app/layout.tsx'],
    'vite-react': ['src/main.tsx'],
  },
  mantine: {
    nextjs: ['src/app/providers.tsx', 'src/app/layout.tsx'],
    'vite-react': ['src/main.tsx'],
  },
  chakra: {
    nextjs: ['src/app/providers.tsx', 'src/app/layout.tsx'],
    'vite-react': ['src/main.tsx'],
  },
  daisyui: {
    nextjs: ['tailwind.config.ts'],
    astro: ['tailwind.config.ts'],
    'vite-react': ['tailwind.config.ts'],
  },
  bootstrap: {
    nextjs: ['UI_SETUP.md'],
    astro: ['UI_SETUP.md'],
    'vite-react': ['UI_SETUP.md'],
    vanilla: ['UI_SETUP.md'],
  },
};

// Deps expected in package.json per UI lib + framework
const UI_LIB_DEPS: Record<string, Record<string, string[]>> = {
  shadcn: {
    nextjs: ['@radix-ui/react-slot', 'class-variance-authority', 'clsx', 'tailwind-merge', 'lucide-react'],
    'vite-react': ['@radix-ui/react-slot', 'class-variance-authority', 'clsx', 'tailwind-merge', 'lucide-react'],
  },
  antd: {
    nextjs: ['antd', '@ant-design/nextjs-registry'],
    'vite-react': ['antd'],
  },
  mui: {
    nextjs: ['@mui/material', '@emotion/react', '@emotion/styled', '@mui/material-nextjs', '@emotion/cache'],
    'vite-react': ['@mui/material', '@emotion/react', '@emotion/styled'],
  },
  mantine: {
    nextjs: ['@mantine/core', '@mantine/hooks'],
    'vite-react': ['@mantine/core', '@mantine/hooks'],
  },
  chakra: {
    nextjs: ['@chakra-ui/react'],
    'vite-react': ['@chakra-ui/react'],
  },
  daisyui: {
    nextjs: [],
    astro: [],
    'vite-react': [],
  },
  bootstrap: {
    nextjs: ['bootstrap'],
    astro: ['bootstrap'],
    'vite-react': ['bootstrap'],
    vanilla: ['bootstrap'],
  },
};

// ── helpers ─────────────────────────────────────────────────────────────────

function checkUninterpolated(dir: string): string[] {
  const issues: string[] = [];
  const walk = (d: string) => {
    const entries = fs.readdirSync(d);
    for (const e of entries) {
      const full = path.join(d, e);
      if (fs.statSync(full).isDirectory()) { walk(full); continue; }
      try {
        const content = fs.readFileSync(full, 'utf8');
        const matches = content.match(/\{\{[A-Z_]+\}\}/g);
        if (matches) issues.push(`${full.replace(dir + '/', '')}: uninterpolated ${[...new Set(matches)].join(', ')}`);
      } catch { /* binary file */ }
    }
  };
  walk(dir);
  return issues;
}

function checkDeps(pkgPath: string, expectedDeps: string[]): string[] {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
  return expectedDeps.filter(d => !allDeps[d]);
}

// ── runner ───────────────────────────────────────────────────────────────────

const results: Array<{ combo: string; pass: boolean; errors: string[] }> = [];
let passed = 0;
let failed = 0;

for (const [framework, uiLib] of COMBOS) {
  const label = `${framework} + ${uiLib}`;
  const tmpDir = path.join(os.tmpdir(), `crucible-test-${framework}-${uiLib}-${Date.now()}`);
  const errors: string[] = [];

  try {
    const vars = { ...VARS, FRAMEWORK: framework, UI_LIB: uiLib };
    await generateProject(TEMPLATES_DIR, tmpDir, vars, framework, uiLib);

    // 1. Required files
    for (const f of REQUIRED_FILES[framework] ?? []) {
      if (!fs.existsSync(path.join(tmpDir, f))) {
        errors.push(`missing required: ${f}`);
      }
    }

    // 2. UI lib specific files
    const libFiles = UI_LIB_EXPECTED[uiLib]?.[framework] ?? [];
    for (const f of libFiles) {
      if (!fs.existsSync(path.join(tmpDir, f))) {
        errors.push(`missing ui-lib file: ${f}`);
      }
    }

    // 3. Uninterpolated vars
    const uninterp = checkUninterpolated(tmpDir);
    errors.push(...uninterp.map(u => `uninterpolated: ${u}`));

    // 4. Expected deps in package.json
    const expectedDeps = UI_LIB_DEPS[uiLib]?.[framework] ?? [];
    const missingDeps = checkDeps(path.join(tmpDir, 'package.json'), expectedDeps);
    errors.push(...missingDeps.map(d => `missing dep: ${d}`));

    // 5. Verify package.json is valid JSON
    try {
      JSON.parse(fs.readFileSync(path.join(tmpDir, 'package.json'), 'utf8'));
    } catch {
      errors.push('package.json invalid JSON');
    }

    // 6. Provider-based libs: verify layout imports Providers
    if (['antd', 'mui', 'mantine', 'chakra'].includes(uiLib) && framework === 'nextjs') {
      const layout = fs.readFileSync(path.join(tmpDir, 'src/app/layout.tsx'), 'utf8');
      if (!layout.includes('Providers')) errors.push('layout.tsx missing Providers import');
    }

    // 7. daisyUI: verify tailwind.config.ts includes daisyui plugin
    if (uiLib === 'daisyui') {
      const tw = fs.readFileSync(path.join(tmpDir, 'tailwind.config.ts'), 'utf8');
      if (!tw.includes('daisyui')) errors.push('tailwind.config.ts missing daisyui plugin');
    }

  } catch (err) {
    errors.push(`generate failed: ${String(err)}`);
  } finally {
    fs.removeSync(tmpDir);
  }

  const pass = errors.length === 0;
  results.push({ combo: label, pass, errors });
  if (pass) {
    passed++;
    process.stdout.write(`\x1b[32m✓\x1b[0m ${label}\n`);
  } else {
    failed++;
    process.stdout.write(`\x1b[31m✗\x1b[0m ${label}\n`);
    for (const e of errors) process.stdout.write(`    \x1b[33m→\x1b[0m ${e}\n`);
  }
}

console.log(`\n${passed + failed} tests — \x1b[32m${passed} passed\x1b[0m, ${failed > 0 ? `\x1b[31m${failed} failed\x1b[0m` : `\x1b[32m${failed} failed\x1b[0m`}`);

if (failed > 0) process.exit(1);

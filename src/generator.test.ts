import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { interpolate, generateProject, buildDerivedVars } from './generator.js';
import { getThemeNotes, THEMES } from './themes.js';
import type { FigmaTokens } from './figma.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.resolve(__dirname, '..', 'templates');

// ── interpolate ──────────────────────────────────────────────────────────────

describe('interpolate', () => {
  it('replaces known var', () => {
    expect(interpolate('Hello {{NAME}}!', { NAME: 'World' })).toBe('Hello World!');
  });

  it('preserves unknown var as-is', () => {
    expect(interpolate('{{UNKNOWN}}', {})).toBe('{{UNKNOWN}}');
  });

  it('replaces multiple vars in one string', () => {
    const result = interpolate('{{A}} + {{B}} = {{C}}', { A: '1', B: '2', C: '3' });
    expect(result).toBe('1 + 2 = 3');
  });

  it('replaces same var multiple times', () => {
    expect(interpolate('{{X}} {{X}}', { X: 'hi' })).toBe('hi hi');
  });

  it('returns empty string unchanged', () => {
    expect(interpolate('', { A: 'x' })).toBe('');
  });

  it('returns string with no vars unchanged', () => {
    expect(interpolate('no vars here', { A: 'x' })).toBe('no vars here');
  });

  it('does not match lowercase keys', () => {
    expect(interpolate('{{brand_name}}', { brand_name: 'x' })).toBe('{{brand_name}}');
  });

  it('does not match empty braces', () => {
    expect(interpolate('{{}}', {})).toBe('{{}}');
  });

  it('preserves partial-matched var if key missing', () => {
    expect(interpolate('{{BRAND_NAME}}', { BRAND: 'x' })).toBe('{{BRAND_NAME}}');
  });
});

// ── generateProject — directory guard ───────────────────────────────────────

describe('generateProject — directory guard', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = path.join(os.tmpdir(), `crucible-unit-${Date.now()}`);
  });

  afterEach(() => {
    fs.removeSync(tmpDir);
  });

  const VARS = {
    BRAND_NAME: 'Test', BRAND_SLUG: 'test', TAGLINE: 'Test tagline.',
    INDUSTRY: 'saas', CITY: 'Jakarta', PRIMARY_COLOR: '#000',
    ACCENT_COLOR: '#fff', DOMAIN: 'test.com', EMAIL: 'hi@test.com',
    YEAR: '2026', FRAMEWORK: 'nextjs', UI_LIB: 'none', DESIGN_THEME: 'minimalist', PROFILE_TYPE: 'brand',
  };

  it('throws when target dir is non-empty', async () => {
    await fs.ensureDir(tmpDir);
    await fs.writeFile(path.join(tmpDir, 'existing.txt'), 'x');
    await expect(generateProject(TEMPLATES_DIR, tmpDir, VARS, 'nextjs', 'none'))
      .rejects.toThrow('not empty');
  });

  it('creates target dir when it does not exist', async () => {
    await generateProject(TEMPLATES_DIR, tmpDir, VARS, 'nextjs', 'none');
    expect(fs.existsSync(tmpDir)).toBe(true);
  });

  it('succeeds with empty existing target dir', async () => {
    await fs.ensureDir(tmpDir);
    await expect(generateProject(TEMPLATES_DIR, tmpDir, VARS, 'nextjs', 'none'))
      .resolves.not.toThrow();
  });
});

// ── generateProject — Layer 1: shared files ──────────────────────────────────

describe('generateProject — shared layer', () => {
  let tmpDir: string;

  const VARS = {
    BRAND_NAME: 'Acme', BRAND_SLUG: 'acme', TAGLINE: 'We build stuff.',
    INDUSTRY: 'tech', CITY: 'Bandung', PRIMARY_COLOR: '#111',
    ACCENT_COLOR: '#eee', DOMAIN: 'acme.io', EMAIL: 'hi@acme.io',
    YEAR: '2025', FRAMEWORK: 'nextjs', UI_LIB: 'none',
    DESIGN_THEME: 'minimalist', PROFILE_TYPE: 'brand',
  };

  beforeEach(async () => {
    tmpDir = path.join(os.tmpdir(), `crucible-unit-${Date.now()}`);
    await generateProject(TEMPLATES_DIR, tmpDir, VARS, 'nextjs', 'none');
  });

  afterEach(() => fs.removeSync(tmpDir));

  it('emits CLAUDE.md', () => expect(fs.existsSync(path.join(tmpDir, 'CLAUDE.md'))).toBe(true));
  it('emits DESIGN.md', () => expect(fs.existsSync(path.join(tmpDir, 'DESIGN.md'))).toBe(true));
  it('emits GUARDRAILS.md', () => expect(fs.existsSync(path.join(tmpDir, 'GUARDRAILS.md'))).toBe(true));
  it('emits copywriter skill', () =>
    expect(fs.existsSync(path.join(tmpDir, '.claude/skills/copywriter/SKILL.md'))).toBe(true));

  it('interpolates BRAND_NAME into CLAUDE.md', () => {
    const content = fs.readFileSync(path.join(tmpDir, 'CLAUDE.md'), 'utf8');
    expect(content).toContain('Acme');
    expect(content).not.toMatch(/\{\{BRAND_NAME\}\}/);
  });

  it('no uninterpolated {{VAR}} in any shared file', () => {
    const walk = (dir: string): string[] => {
      const results: string[] = [];
      for (const e of fs.readdirSync(dir)) {
        const full = path.join(dir, e);
        if (fs.statSync(full).isDirectory()) { results.push(...walk(full)); continue; }
        try {
          const m = fs.readFileSync(full, 'utf8').match(/\{\{[A-Z_]+\}\}/g);
          if (m) results.push(...m);
        } catch { /* binary */ }
      }
      return results;
    };
    expect(walk(tmpDir)).toEqual([]);
  });
});

// ── generateProject — Layer 2: framework files ───────────────────────────────

describe.each([
  ['nextjs',     ['src/app/layout.tsx', 'src/app/page.tsx', 'src/lib/site.ts']],
  ['astro',      ['src/pages/index.astro', 'src/lib/site.ts']],
  ['vite-react', ['src/main.tsx', 'src/App.tsx', 'src/lib/site.ts']],
  ['vanilla',    ['index.html']],
] as [string, string[]][])('generateProject — %s framework', (framework, requiredFiles) => {
  let tmpDir: string;

  const vars = {
    BRAND_NAME: 'Loop', BRAND_SLUG: 'loop', TAGLINE: 'Sound first.',
    INDUSTRY: 'music', CITY: 'Surabaya', PRIMARY_COLOR: '#0f0',
    ACCENT_COLOR: '#f0f', DOMAIN: 'loop.io', EMAIL: 'hi@loop.io',
    YEAR: '2026', FRAMEWORK: framework, UI_LIB: 'none', DESIGN_THEME: 'minimalist', PROFILE_TYPE: 'brand',
  };

  beforeEach(async () => {
    tmpDir = path.join(os.tmpdir(), `crucible-unit-${framework}-${Date.now()}`);
    await generateProject(TEMPLATES_DIR, tmpDir, vars, framework, 'none');
  });

  afterEach(() => fs.removeSync(tmpDir));

  for (const file of requiredFiles) {
    it(`emits ${file}`, () => expect(fs.existsSync(path.join(tmpDir, file))).toBe(true));
  }

  it('package.json is valid JSON', () => {
    expect(() => JSON.parse(fs.readFileSync(path.join(tmpDir, 'package.json'), 'utf8'))).not.toThrow();
  });
});

// ── generateProject — Layer 3: ui-lib overlay ────────────────────────────────

describe('generateProject — shadcn overlay (nextjs)', () => {
  let tmpDir: string;

  const VARS = {
    BRAND_NAME: 'Blade', BRAND_SLUG: 'blade', TAGLINE: 'Sharp.',
    INDUSTRY: 'saas', CITY: 'Yogya', PRIMARY_COLOR: '#333',
    ACCENT_COLOR: '#aaa', DOMAIN: 'blade.dev', EMAIL: 'hi@blade.dev',
    YEAR: '2026', FRAMEWORK: 'nextjs', UI_LIB: 'shadcn', DESIGN_THEME: 'minimalist', PROFILE_TYPE: 'brand',
  };

  beforeEach(async () => {
    tmpDir = path.join(os.tmpdir(), `crucible-unit-shadcn-${Date.now()}`);
    await generateProject(TEMPLATES_DIR, tmpDir, VARS, 'nextjs', 'shadcn');
  });

  afterEach(() => fs.removeSync(tmpDir));

  it('emits components.json', () =>
    expect(fs.existsSync(path.join(tmpDir, 'components.json'))).toBe(true));
  it('emits src/lib/utils.ts', () =>
    expect(fs.existsSync(path.join(tmpDir, 'src/lib/utils.ts'))).toBe(true));
  it('injects @radix-ui/react-slot dep', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(tmpDir, 'package.json'), 'utf8'));
    expect(pkg.dependencies['@radix-ui/react-slot']).toBeDefined();
  });
  it('injects clsx dep', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(tmpDir, 'package.json'), 'utf8'));
    expect(pkg.dependencies['clsx']).toBeDefined();
  });
});

describe('generateProject — antd overlay (nextjs)', () => {
  let tmpDir: string;

  const VARS = {
    BRAND_NAME: 'Forge', BRAND_SLUG: 'forge', TAGLINE: 'Build fast.',
    INDUSTRY: 'saas', CITY: 'Jakarta', PRIMARY_COLOR: '#1890ff',
    ACCENT_COLOR: '#fa8c16', DOMAIN: 'forge.dev', EMAIL: 'hi@forge.dev',
    YEAR: '2026', FRAMEWORK: 'nextjs', UI_LIB: 'antd', DESIGN_THEME: 'minimalist', PROFILE_TYPE: 'brand',
  };

  beforeEach(async () => {
    tmpDir = path.join(os.tmpdir(), `crucible-unit-antd-${Date.now()}`);
    await generateProject(TEMPLATES_DIR, tmpDir, VARS, 'nextjs', 'antd');
  });

  afterEach(() => fs.removeSync(tmpDir));

  it('emits providers.tsx', () =>
    expect(fs.existsSync(path.join(tmpDir, 'src/app/providers.tsx'))).toBe(true));
  it('layout.tsx imports Providers', () => {
    const layout = fs.readFileSync(path.join(tmpDir, 'src/app/layout.tsx'), 'utf8');
    expect(layout).toContain('Providers');
  });
  it('injects antd dep', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(tmpDir, 'package.json'), 'utf8'));
    expect(pkg.dependencies['antd']).toBeDefined();
  });
  it('injects @ant-design/nextjs-registry (framework extra dep)', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(tmpDir, 'package.json'), 'utf8'));
    expect(pkg.dependencies['@ant-design/nextjs-registry']).toBeDefined();
  });
});

describe('generateProject — daisyui overlay (nextjs)', () => {
  let tmpDir: string;

  const VARS = {
    BRAND_NAME: 'Daisy', BRAND_SLUG: 'daisy', TAGLINE: 'Fresh UI.',
    INDUSTRY: 'saas', CITY: 'Bali', PRIMARY_COLOR: '#570df8',
    ACCENT_COLOR: '#f000b8', DOMAIN: 'daisy.dev', EMAIL: 'hi@daisy.dev',
    YEAR: '2026', FRAMEWORK: 'nextjs', UI_LIB: 'daisyui', DESIGN_THEME: 'minimalist', PROFILE_TYPE: 'brand',
  };

  beforeEach(async () => {
    tmpDir = path.join(os.tmpdir(), `crucible-unit-daisyui-${Date.now()}`);
    await generateProject(TEMPLATES_DIR, tmpDir, VARS, 'nextjs', 'daisyui');
  });

  afterEach(() => fs.removeSync(tmpDir));

  it('tailwind.config.ts contains daisyui plugin', () => {
    const tw = fs.readFileSync(path.join(tmpDir, 'tailwind.config.ts'), 'utf8');
    expect(tw).toContain('daisyui');
  });
});

describe('generateProject — tailwind (skips Layer 3)', () => {
  let tmpDir: string;

  const VARS = {
    BRAND_NAME: 'Plain', BRAND_SLUG: 'plain', TAGLINE: 'Simple.',
    INDUSTRY: 'saas', CITY: 'Medan', PRIMARY_COLOR: '#000',
    ACCENT_COLOR: '#fff', DOMAIN: 'plain.dev', EMAIL: 'hi@plain.dev',
    YEAR: '2026', FRAMEWORK: 'nextjs', UI_LIB: 'tailwind', DESIGN_THEME: 'minimalist', PROFILE_TYPE: 'brand',
  };

  beforeEach(async () => {
    tmpDir = path.join(os.tmpdir(), `crucible-unit-tailwind-${Date.now()}`);
    await generateProject(TEMPLATES_DIR, tmpDir, VARS, 'nextjs', 'tailwind');
  });

  afterEach(() => fs.removeSync(tmpDir));

  it('does not emit components.json (no shadcn overlay)', () =>
    expect(fs.existsSync(path.join(tmpDir, 'components.json'))).toBe(false));
  it('does not emit providers.tsx (no provider overlay)', () =>
    expect(fs.existsSync(path.join(tmpDir, 'src/app/providers.tsx'))).toBe(false));
  it('still emits framework files', () =>
    expect(fs.existsSync(path.join(tmpDir, 'src/app/page.tsx'))).toBe(true));
});

describe('generateProject — unknown uiLib with no dir', () => {
  let tmpDir: string;

  const VARS = {
    BRAND_NAME: 'Ghost', BRAND_SLUG: 'ghost', TAGLINE: 'Invisible.',
    INDUSTRY: 'saas', CITY: 'Solo', PRIMARY_COLOR: '#fff',
    ACCENT_COLOR: '#000', DOMAIN: 'ghost.dev', EMAIL: 'hi@ghost.dev',
    YEAR: '2026', FRAMEWORK: 'nextjs', UI_LIB: 'nonexistent-lib', DESIGN_THEME: 'minimalist', PROFILE_TYPE: 'brand',
  };

  beforeEach(() => {
    tmpDir = path.join(os.tmpdir(), `crucible-unit-ghost-${Date.now()}`);
  });

  afterEach(() => fs.removeSync(tmpDir));

  it('resolves without throwing', async () => {
    await expect(generateProject(TEMPLATES_DIR, tmpDir, VARS, 'nextjs', 'nonexistent-lib'))
      .resolves.not.toThrow();
  });

  it('still emits shared + framework files', async () => {
    await generateProject(TEMPLATES_DIR, tmpDir, VARS, 'nextjs', 'nonexistent-lib');
    expect(fs.existsSync(path.join(tmpDir, 'CLAUDE.md'))).toBe(true);
    expect(fs.existsSync(path.join(tmpDir, 'src/app/page.tsx'))).toBe(true);
  });
});

// ── mergePackageJson edge cases (via generateProject) ────────────────────────

describe('mergePackageJson — existing deps preserved', () => {
  let tmpDir: string;

  const VARS = {
    BRAND_NAME: 'Keep', BRAND_SLUG: 'keep', TAGLINE: 'Retain.',
    INDUSTRY: 'saas', CITY: 'Makassar', PRIMARY_COLOR: '#123',
    ACCENT_COLOR: '#456', DOMAIN: 'keep.dev', EMAIL: 'hi@keep.dev',
    YEAR: '2026', FRAMEWORK: 'nextjs', UI_LIB: 'mui', DESIGN_THEME: 'minimalist', PROFILE_TYPE: 'brand',
  };

  beforeEach(async () => {
    tmpDir = path.join(os.tmpdir(), `crucible-unit-merge-${Date.now()}`);
    await generateProject(TEMPLATES_DIR, tmpDir, VARS, 'nextjs', 'mui');
  });

  afterEach(() => fs.removeSync(tmpDir));

  it('original framework deps still present after merge', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(tmpDir, 'package.json'), 'utf8'));
    expect(pkg.dependencies['next']).toBeDefined();
  });

  it('mui deps injected', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(tmpDir, 'package.json'), 'utf8'));
    expect(pkg.dependencies['@mui/material']).toBeDefined();
  });

  it('@mui/material-nextjs injected as framework extra dep', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(tmpDir, 'package.json'), 'utf8'));
    expect(pkg.dependencies['@mui/material-nextjs']).toBeDefined();
  });
});

// ── themes ────────────────────────────────────────────────────────────────────

describe('themes — getThemeNotes', () => {
  it('returns non-empty string for every theme', () => {
    for (const slug of Object.keys(THEMES)) {
      expect(getThemeNotes(slug).length).toBeGreaterThan(50);
    }
  });

  it('returns empty string for unknown theme', () => {
    expect(getThemeNotes('nonexistent')).toBe('');
  });

  it('brutalist notes mention border-radius and shadow', () => {
    const notes = getThemeNotes('brutalist');
    expect(notes).toContain('border-radius');
    expect(notes).toContain('shadow');
  });

  it('luxury notes mention serif', () => {
    const notes = getThemeNotes('luxury');
    expect(notes).toContain('serif');
  });
});

// ── buildDerivedVars ──────────────────────────────────────────────────────────

describe('buildDerivedVars — profile type', () => {
  const base = {
    BRAND_NAME: 'Alex', PROFILE_TYPE: 'individual', DESIGN_THEME: 'minimalist',
    PRIMARY_COLOR: '#fff', ACCENT_COLOR: '#000',
  };

  it('sets OWNER_LABEL = Portfolio for individual', () => {
    const v = buildDerivedVars(base);
    expect(v['OWNER_LABEL']).toBe('Portfolio');
  });

  it('sets IDENTITY_LABEL = Identity for individual', () => {
    expect(buildDerivedVars(base)['IDENTITY_LABEL']).toBe('Identity');
  });

  it('sets CTA_CONTEXT to Work with me for individual', () => {
    expect(buildDerivedVars(base)['CTA_CONTEXT']).toContain('Work with me');
  });

  it('sets OWNER_LABEL = Brand for brand', () => {
    const v = buildDerivedVars({ ...base, PROFILE_TYPE: 'brand' });
    expect(v['OWNER_LABEL']).toBe('Brand');
  });

  it('sets IDENTITY_LABEL = Brand Identity for brand', () => {
    const v = buildDerivedVars({ ...base, PROFILE_TYPE: 'brand' });
    expect(v['IDENTITY_LABEL']).toBe('Brand Identity');
  });

  it('sets CTA_CONTEXT to Start a project for brand', () => {
    const v = buildDerivedVars({ ...base, PROFILE_TYPE: 'brand' });
    expect(v['CTA_CONTEXT']).toContain('Start a project');
  });

  it('injects DESIGN_THEME_NOTES for selected theme', () => {
    const v = buildDerivedVars({ ...base, DESIGN_THEME: 'brutalist' });
    expect(v['DESIGN_THEME_NOTES']).toContain('border-radius');
  });

  it('defaults PROFILE_TYPE to brand when missing', () => {
    const v = buildDerivedVars({ DESIGN_THEME: 'minimalist', PRIMARY_COLOR: '#fff', ACCENT_COLOR: '#000' });
    expect(v['OWNER_LABEL']).toBe('Brand');
  });
});

describe('buildDerivedVars — figma tokens override', () => {
  const base = {
    BRAND_NAME: 'Test', PROFILE_TYPE: 'brand', DESIGN_THEME: 'minimalist',
    PRIMARY_COLOR: '#000000', ACCENT_COLOR: '#ffffff',
  };

  const mockFigma: FigmaTokens = {
    primaryColor: '#1A2B3C',
    accentColor: '#FF6B35',
    colors: [{ name: 'Brand/Primary', hex: '#1A2B3C', r: 0.1, g: 0.17, b: 0.235, a: 1 }],
    textStyles: [{ name: 'Display/H1', fontFamily: 'Inter', fontSize: 64, fontWeight: 700, lineHeight: 72, letterSpacing: -1 }],
    fontFamilies: ['Inter'],
    colorsSection: '| `brand-primary` | `#1A2B3C` | — |',
    typographySection: '| Display/H1 | Inter | 64px | 700 | 72px |',
  };

  it('overrides PRIMARY_COLOR from figma', () => {
    const v = buildDerivedVars(base, mockFigma);
    expect(v['PRIMARY_COLOR']).toBe('#1A2B3C');
  });

  it('overrides ACCENT_COLOR from figma', () => {
    const v = buildDerivedVars(base, mockFigma);
    expect(v['ACCENT_COLOR']).toBe('#FF6B35');
  });

  it('sets FIGMA_COLORS_SECTION from figma', () => {
    const v = buildDerivedVars(base, mockFigma);
    expect(v['FIGMA_COLORS_SECTION']).toContain('#1A2B3C');
  });

  it('sets FIGMA_TYPOGRAPHY_SECTION from figma', () => {
    const v = buildDerivedVars(base, mockFigma);
    expect(v['FIGMA_TYPOGRAPHY_SECTION']).toContain('Inter');
  });

  it('leaves FIGMA_COLORS_SECTION empty when no figma', () => {
    const v = buildDerivedVars(base);
    expect(v['FIGMA_COLORS_SECTION']).toBe('');
  });
});

// ── generateProject — profile type + design theme in output files ─────────────

describe('generateProject — individual profile', () => {
  let tmpDir: string;

  const VARS = {
    BRAND_NAME: 'Alex Chen', BRAND_SLUG: 'alex-chen', TAGLINE: 'I build things.',
    INDUSTRY: 'saas', CITY: 'Singapore', PRIMARY_COLOR: '#111',
    ACCENT_COLOR: '#eee', DOMAIN: 'alexchen.dev', EMAIL: 'hi@alexchen.dev',
    YEAR: '2026', FRAMEWORK: 'nextjs', UI_LIB: 'none',
    DESIGN_THEME: 'minimalist', PROFILE_TYPE: 'individual',
  };

  beforeEach(async () => {
    tmpDir = path.join(os.tmpdir(), `crucible-unit-individual-${Date.now()}`);
    await generateProject(TEMPLATES_DIR, tmpDir, VARS, 'nextjs', 'none');
  });

  afterEach(() => fs.removeSync(tmpDir));

  it('CLAUDE.md contains Portfolio not Brand', () => {
    const content = fs.readFileSync(path.join(tmpDir, 'CLAUDE.md'), 'utf8');
    expect(content).toContain('Portfolio');
  });

  it('CLAUDE.md contains Work with me', () => {
    const content = fs.readFileSync(path.join(tmpDir, 'CLAUDE.md'), 'utf8');
    expect(content).toContain('Work with me');
  });

  it('DESIGN.md contains Identity not Brand Identity', () => {
    const content = fs.readFileSync(path.join(tmpDir, 'DESIGN.md'), 'utf8');
    expect(content).toContain('## 1. Identity');
    expect(content).not.toContain('## 1. Brand Identity');
  });
});

describe('generateProject — design theme in DESIGN.md', () => {
  let tmpDir: string;

  const VARS = {
    BRAND_NAME: 'Rude Co', BRAND_SLUG: 'rude-co', TAGLINE: 'Deal with it.',
    INDUSTRY: 'agency', CITY: 'Berlin', PRIMARY_COLOR: '#fff',
    ACCENT_COLOR: '#000', DOMAIN: 'rudeco.com', EMAIL: 'hi@rudeco.com',
    YEAR: '2026', FRAMEWORK: 'nextjs', UI_LIB: 'none', DESIGN_THEME: 'brutalist', PROFILE_TYPE: 'brand',
  };

  beforeEach(async () => {
    tmpDir = path.join(os.tmpdir(), `crucible-unit-theme-${Date.now()}`);
    await generateProject(TEMPLATES_DIR, tmpDir, VARS, 'nextjs', 'none');
  });

  afterEach(() => fs.removeSync(tmpDir));

  it('DESIGN.md section 0 header contains theme slug', () => {
    const content = fs.readFileSync(path.join(tmpDir, 'DESIGN.md'), 'utf8');
    expect(content).toContain('## 0. Design Theme: brutalist');
  });

  it('DESIGN.md theme notes contain brutalist guidance', () => {
    const content = fs.readFileSync(path.join(tmpDir, 'DESIGN.md'), 'utf8');
    expect(content).toContain('border-radius');
  });
});

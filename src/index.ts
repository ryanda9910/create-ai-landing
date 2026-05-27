#!/usr/bin/env node
import * as p from '@clack/prompts';
import pc from 'picocolors';
import path from 'path';
import { fileURLToPath, URL } from 'url';
import { generateProject } from './generator.js';
import { THEME_OPTIONS } from './themes.js';
import { fetchFigmaTokens } from './figma.js';
import type { FigmaTokens } from './figma.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  await (await import('fs-extra')).default.readFile(
    new URL('../package.json', import.meta.url), 'utf8'
  )
) as { version: string };

if (process.argv.includes('--version') || process.argv.includes('-v')) {
  console.log(pkg.version);
  process.exit(0);
}

async function main() {
  const projectArg = process.argv[2];

  console.log('');
  p.intro(pc.bgBlack(pc.white('  crucible  ')));

  const projectName = projectArg ?? (await p.text({
    message: 'Project directory name',
    placeholder: 'my-landing',
    validate: (v) => (!v ? 'Required.' : undefined),
  }));
  if (p.isCancel(projectName)) { p.cancel('Cancelled.'); process.exit(0); }

  const framework = await p.select({
    message: 'Framework',
    options: [
      { value: 'nextjs',     label: 'Next.js 14',        hint: 'App Router, SSR, API routes' },
      { value: 'astro',      label: 'Astro 4',            hint: 'Static + islands, best Lighthouse scores' },
      { value: 'vite-react', label: 'Vite + React',       hint: 'SPA, client-side only' },
      { value: 'vanilla',    label: 'Vanilla JS',          hint: 'No framework, Vite dev server' },
    ],
  });
  if (p.isCancel(framework)) { p.cancel('Cancelled.'); process.exit(0); }

  const UI_LIB_OPTIONS: Record<string, Array<{ value: string; label: string; hint: string }>> = {
    nextjs: [
      { value: 'tailwind',  label: 'Tailwind CSS',    hint: 'default — already configured' },
      { value: 'shadcn',    label: 'shadcn/ui',        hint: 'Radix + Tailwind component system' },
      { value: 'antd',      label: 'Ant Design 5',     hint: 'enterprise-grade React UI library' },
      { value: 'mui',       label: 'Material UI 6',    hint: 'Google Material Design system' },
      { value: 'mantine',   label: 'Mantine 7',        hint: 'full-featured component library' },
      { value: 'chakra',    label: 'Chakra UI 3',      hint: 'accessible component primitives' },
      { value: 'daisyui',   label: 'daisyUI 4',        hint: 'Tailwind semantic component classes' },
      { value: 'bootstrap', label: 'Bootstrap 5',      hint: 'classic CSS framework' },
      { value: 'none',      label: 'None',             hint: 'plain CSS / CSS modules only' },
    ],
    astro: [
      { value: 'tailwind',  label: 'Tailwind CSS',    hint: 'default — already configured' },
      { value: 'daisyui',   label: 'daisyUI 4',        hint: 'Tailwind semantic component classes' },
      { value: 'bootstrap', label: 'Bootstrap 5',      hint: 'classic CSS framework' },
      { value: 'none',      label: 'None',             hint: 'plain CSS only' },
    ],
    'vite-react': [
      { value: 'tailwind',  label: 'Tailwind CSS',    hint: 'default — already configured' },
      { value: 'shadcn',    label: 'shadcn/ui',        hint: 'Radix + Tailwind component system' },
      { value: 'antd',      label: 'Ant Design 5',     hint: 'enterprise-grade React UI library' },
      { value: 'mui',       label: 'Material UI 6',    hint: 'Google Material Design system' },
      { value: 'mantine',   label: 'Mantine 7',        hint: 'full-featured component library' },
      { value: 'chakra',    label: 'Chakra UI 3',      hint: 'accessible component primitives' },
      { value: 'daisyui',   label: 'daisyUI 4',        hint: 'Tailwind semantic component classes' },
      { value: 'bootstrap', label: 'Bootstrap 5',      hint: 'classic CSS framework' },
      { value: 'none',      label: 'None',             hint: 'plain CSS / CSS modules only' },
    ],
    vanilla: [
      { value: 'tailwind',  label: 'Tailwind CSS',    hint: 'default — already configured' },
      { value: 'bootstrap', label: 'Bootstrap 5',      hint: 'classic CSS framework' },
      { value: 'none',      label: 'None',             hint: 'plain CSS only' },
    ],
  };

  const uiLib = await p.select({
    message: 'UI library',
    options: UI_LIB_OPTIONS[framework as string] ?? UI_LIB_OPTIONS.nextjs,
  });
  if (p.isCancel(uiLib)) { p.cancel('Cancelled.'); process.exit(0); }

  const designTheme = await p.select({
    message: 'Design aesthetic',
    options: THEME_OPTIONS,
  });
  if (p.isCancel(designTheme)) { p.cancel('Cancelled.'); process.exit(0); }

  const profileType = await p.select({
    message: 'Who is this for?',
    options: [
      { value: 'brand',      label: 'Brand / Organization', hint: 'studio, agency, SaaS, company' },
      { value: 'individual', label: 'Individual / Personal',  hint: 'portfolio, freelancer, creator' },
    ],
  });
  if (p.isCancel(profileType)) { p.cancel('Cancelled.'); process.exit(0); }

  const isIndividual = profileType === 'individual';

  const brandName = await p.text({
    message: isIndividual ? 'Your name' : 'Brand name',
    placeholder: isIndividual ? 'Alex Chen' : 'Volta Studio',
    validate: (v) => (!v ? 'Required.' : undefined),
  });
  if (p.isCancel(brandName)) { p.cancel('Cancelled.'); process.exit(0); }

  const tagline = await p.text({
    message: 'Tagline (hero headline)',
    placeholder: 'Every frame needs a sound.',
    validate: (v) => (!v ? 'Required.' : undefined),
  });
  if (p.isCancel(tagline)) { p.cancel('Cancelled.'); process.exit(0); }

  const industry = await p.select({
    message: 'Industry',
    options: [
      { value: 'music',   label: 'Music / Audio Studio' },
      { value: 'photo',   label: 'Photography / Visual' },
      { value: 'agency',  label: 'Creative Agency' },
      { value: 'saas',    label: 'SaaS / Product' },
      { value: 'other',   label: 'Other' },
    ],
  });
  if (p.isCancel(industry)) { p.cancel('Cancelled.'); process.exit(0); }

  const city = await p.text({
    message: 'City / Location',
    placeholder: 'Jakarta',
    validate: (v) => (!v ? 'Required.' : undefined),
  });
  if (p.isCancel(city)) { p.cancel('Cancelled.'); process.exit(0); }

  const primaryColor = await p.text({
    message: 'Primary color (hex)',
    placeholder: '#0A0A0B',
    initialValue: '#0A0A0B',
    validate: (v) => (!/^#[0-9a-fA-F]{6}$/.test(v) ? 'Valid hex required (e.g. #0A0A0B).' : undefined),
  });
  if (p.isCancel(primaryColor)) { p.cancel('Cancelled.'); process.exit(0); }

  const accentColor = await p.text({
    message: 'Accent color (hex)',
    placeholder: '#D4A574',
    initialValue: '#D4A574',
    validate: (v) => (!/^#[0-9a-fA-F]{6}$/.test(v) ? 'Valid hex required.' : undefined),
  });
  if (p.isCancel(accentColor)) { p.cancel('Cancelled.'); process.exit(0); }

  const domain = await p.text({
    message: 'Domain (for OG meta)',
    placeholder: 'voltastudio.com',
    validate: (v) => (!v ? 'Required.' : undefined),
  });
  if (p.isCancel(domain)) { p.cancel('Cancelled.'); process.exit(0); }

  const email = await p.text({
    message: 'Contact email',
    placeholder: 'hello@voltastudio.com',
    validate: (v) => (!v ? 'Required.' : undefined),
  });
  if (p.isCancel(email)) { p.cancel('Cancelled.'); process.exit(0); }

  const aiTool = await p.select({
    message: 'AI coding tool',
    options: [
      { value: 'claude',   label: 'Claude Code',     hint: 'CLAUDE.md + skills already included' },
      { value: 'cursor',   label: 'Cursor',           hint: 'adds .cursor/rules/' },
      { value: 'windsurf', label: 'Windsurf',         hint: 'adds .windsurf/rules/' },
      { value: 'continue', label: 'Continue',         hint: 'adds .continue/rules/' },
      { value: 'copilot',  label: 'GitHub Copilot',   hint: 'adds .github/instructions/' },
      { value: 'none',     label: 'None / Other',     hint: 'no tool-specific files' },
    ],
  });
  if (p.isCancel(aiTool)) { p.cancel('Cancelled.'); process.exit(0); }

  const figmaUrl = await p.text({
    message: 'Figma file URL (optional — press Enter to skip)',
    placeholder: 'https://www.figma.com/design/ABC123/MyDesign',
  });
  if (p.isCancel(figmaUrl)) { p.cancel('Cancelled.'); process.exit(0); }

  let figmaToken: string | symbol = '';
  if (figmaUrl && String(figmaUrl).trim()) {
    figmaToken = process.env['FIGMA_TOKEN'] ?? await p.text({
      message: 'Figma Personal Access Token',
      placeholder: 'fig-pat-...',
      validate: (v) => (!v ? 'Required when Figma URL is provided.' : undefined),
    });
    if (p.isCancel(figmaToken)) { p.cancel('Cancelled.'); process.exit(0); }
  }

  const targetDir = path.resolve(process.cwd(), projectName as string);
  const templatesDir = path.resolve(__dirname, '..', 'templates');

  const vars: Record<string, string> = {
    BRAND_NAME:    brandName as string,
    BRAND_SLUG:    (brandName as string).toLowerCase().replace(/\s+/g, '-'),
    TAGLINE:       tagline as string,
    INDUSTRY:      industry as string,
    CITY:          city as string,
    PRIMARY_COLOR: primaryColor as string,
    ACCENT_COLOR:  accentColor as string,
    DOMAIN:        domain as string,
    EMAIL:         email as string,
    YEAR:          new Date().getFullYear().toString(),
    FRAMEWORK:     framework as string,
    UI_LIB:        uiLib as string,
    DESIGN_THEME:  designTheme as string,
    PROFILE_TYPE:  profileType as string,
    AI_TOOL:       aiTool as string,
  };

  const s = p.spinner();

  let figmaTokens: FigmaTokens | undefined;
  const figmaUrlStr = String(figmaUrl ?? '').trim();
  const figmaTokenStr = String(figmaToken ?? '').trim();

  if (figmaUrlStr && figmaTokenStr) {
    s.start('Fetching design tokens from Figma...');
    try {
      figmaTokens = await fetchFigmaTokens(figmaUrlStr, figmaTokenStr);
      s.stop(`Figma: extracted ${figmaTokens.colors.length} colors, ${figmaTokens.textStyles.length} text styles.`);
    } catch (err) {
      s.stop(pc.yellow(`Figma import skipped: ${String(err)}`));
    }
  }

  s.start('Generating project...');

  try {
    await generateProject(templatesDir, targetDir, vars, framework as string, uiLib as string, figmaTokens, aiTool as string);
    s.stop('Project generated.');
  } catch (err) {
    s.stop('Generation failed.');
    p.log.error(String(err));
    process.exit(1);
  }

  const installCmd = 'pnpm install';
  const devCmd = framework === 'nextjs' ? 'pnpm dev' : 'pnpm dev';

  p.note(
    [
      `cd ${projectName}`,
      installCmd,
      ``,
      `Then fill in:`,
      `  DESIGN.md        → complete your color/type system`,
      `  src/lib/         → add your real content`,
      `  GUARDRAILS.md    → fills itself as you build`,
      ``,
      devCmd,
    ].join('\n'),
    'Next steps',
  );

  p.outro(`${pc.green('✓')} ${pc.bold(brandName as string)} — ${framework} scaffold ready. Build something real.`);
}

main();

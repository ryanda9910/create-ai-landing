#!/usr/bin/env node
import * as p from '@clack/prompts';
import pc from 'picocolors';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateProject } from './generator.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const projectArg = process.argv[2];

  console.log('');
  p.intro(pc.bgBlack(pc.white('  create-ai-landing  ')));

  const projectName = projectArg ?? (await p.text({
    message: 'Project directory name',
    placeholder: 'my-landing',
    validate: (v) => (!v ? 'Required.' : undefined),
  }));

  if (p.isCancel(projectName)) { p.cancel('Cancelled.'); process.exit(0); }

  const brandName = await p.text({
    message: 'Brand name',
    placeholder: 'Volta Studio',
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
      { value: 'music', label: 'Music / Audio Studio' },
      { value: 'photo', label: 'Photography / Visual' },
      { value: 'agency', label: 'Creative Agency' },
      { value: 'saas', label: 'SaaS / Product' },
      { value: 'other', label: 'Other' },
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
    message: 'Domain (for OG image)',
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

  const s = p.spinner();
  s.start('Generating project...');

  const targetDir = path.resolve(process.cwd(), projectName as string);
  const templatesDir = path.resolve(__dirname, '..', 'templates');

  const vars: Record<string, string> = {
    BRAND_NAME: brandName as string,
    BRAND_SLUG: (brandName as string).toLowerCase().replace(/\s+/g, '-'),
    TAGLINE: tagline as string,
    INDUSTRY: industry as string,
    CITY: city as string,
    PRIMARY_COLOR: primaryColor as string,
    ACCENT_COLOR: accentColor as string,
    DOMAIN: domain as string,
    EMAIL: email as string,
    YEAR: new Date().getFullYear().toString(),
  };

  try {
    await generateProject(templatesDir, targetDir, vars);
    s.stop('Project generated.');
  } catch (err) {
    s.stop('Generation failed.');
    p.log.error(String(err));
    process.exit(1);
  }

  p.note(
    [
      `cd ${projectName}`,
      `pnpm install`,
      ``,
      `Then fill in:`,
      `  DESIGN.md        → your color/type system`,
      `  src/lib/         → your real content`,
      `  GUARDRAILS.md    → will fill itself as you build`,
    ].join('\n'),
    'Next steps',
  );

  p.outro(`${pc.green('✓')} ${pc.bold(brandName as string)} landing ready. Build something specific.`);
}

main();

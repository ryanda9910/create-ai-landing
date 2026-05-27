import fs from 'fs-extra';
import path from 'path';
import type { FigmaTokens } from './figma.js';
import { getThemeNotes } from './themes.js';

const TEMPLATE_EXT = '.tmpl';

interface UILibConfig {
  name: string;
  compatibleFrameworks: string[];
  deps: Record<string, string>;
  devDeps: Record<string, string>;
  frameworkExtraDeps?: Partial<Record<string, Record<string, string>>>;
  frameworkExtraDevDeps?: Partial<Record<string, Record<string, string>>>;
}

export function interpolate(content: string, vars: Record<string, string>): string {
  return content.replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`);
}

async function copyTemplate(
  src: string,
  dest: string,
  vars: Record<string, string>,
) {
  const stat = await fs.stat(src);

  if (stat.isDirectory()) {
    const entries = await fs.readdir(src);
    await fs.ensureDir(dest);
    for (const entry of entries) {
      if (entry === '_config.json') continue;
      await copyTemplate(
        path.join(src, entry),
        path.join(dest, entry.replace(TEMPLATE_EXT, '')),
        vars,
      );
    }
    return;
  }

  const raw = await fs.readFile(src, 'utf8');
  const output = src.endsWith(TEMPLATE_EXT) ? interpolate(raw, vars) : raw;
  await fs.ensureDir(path.dirname(dest));
  await fs.writeFile(dest.replace(TEMPLATE_EXT, ''), output, 'utf8');
}

async function mergePackageJson(
  targetDir: string,
  config: UILibConfig,
  framework: string,
) {
  const pkgPath = path.join(targetDir, 'package.json');
  const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf8'));

  const extraDeps = {
    ...config.deps,
    ...(config.frameworkExtraDeps?.[framework] ?? {}),
  };
  const extraDevDeps = {
    ...config.devDeps,
    ...(config.frameworkExtraDevDeps?.[framework] ?? {}),
  };

  if (Object.keys(extraDeps).length > 0) {
    pkg.dependencies = { ...pkg.dependencies, ...extraDeps };
  }
  if (Object.keys(extraDevDeps).length > 0) {
    pkg.devDependencies = { ...pkg.devDependencies, ...extraDevDeps };
  }

  await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
}

export function buildDerivedVars(vars: Record<string, string>, figmaTokens?: FigmaTokens): Record<string, string> {
  const profileType = vars['PROFILE_TYPE'] ?? 'brand';
  const isIndividual = profileType === 'individual';
  const theme = vars['DESIGN_THEME'] ?? 'minimalist';

  const derived: Record<string, string> = {
    OWNER_LABEL: isIndividual ? 'Portfolio' : 'Brand',
    IDENTITY_LABEL: isIndividual ? 'Identity' : 'Brand Identity',
    CTA_CONTEXT: isIndividual ? 'contact form / "Work with me"' : 'inquiry form / "Start a project"',
    CTA_LABEL: isIndividual ? 'Work with me' : 'Start a project',
    ABOUT_LABEL: isIndividual ? 'About' : 'Studio / About',
    DESIGN_THEME_NOTES: getThemeNotes(theme),
    FIGMA_COLORS_SECTION: '',
    FIGMA_TYPOGRAPHY_SECTION: '',
  };

  if (figmaTokens) {
    derived['FIGMA_COLORS_SECTION'] = figmaTokens.colorsSection
      ? `### Extracted from Figma\n\n${figmaTokens.colorsSection}`
      : '';
    derived['FIGMA_TYPOGRAPHY_SECTION'] = figmaTokens.typographySection
      ? `### Extracted from Figma\n\n${figmaTokens.typographySection}`
      : '';
    // Override colors only if Figma provided real values
    if (figmaTokens.primaryColor) derived['PRIMARY_COLOR'] = figmaTokens.primaryColor;
    if (figmaTokens.accentColor) derived['ACCENT_COLOR'] = figmaTokens.accentColor;
  }

  return { ...vars, ...derived };
}

export async function generateProject(
  templatesDir: string,
  targetDir: string,
  vars: Record<string, string>,
  framework: string,
  uiLib: string,
  figmaTokens?: FigmaTokens,
) {
  if (await fs.pathExists(targetDir)) {
    const files = await fs.readdir(targetDir);
    if (files.length > 0) throw new Error(`Directory "${targetDir}" is not empty.`);
  }

  const resolvedVars = buildDerivedVars(vars, figmaTokens);

  // Layer 1: shared AI system files
  const sharedDir = path.join(templatesDir, 'shared');
  await copyTemplate(sharedDir, targetDir, resolvedVars);

  // Layer 2: framework-specific source
  const frameworkDir = path.join(templatesDir, 'frameworks', framework);
  await copyTemplate(frameworkDir, targetDir, resolvedVars);

  // Layer 3: UI library overlay (optional)
  if (uiLib && uiLib !== 'tailwind') {
    const uiLibDir = path.join(templatesDir, 'ui-libs', uiLib);
    if (await fs.pathExists(uiLibDir)) {
      const uiLibShared = path.join(uiLibDir, 'shared');
      if (await fs.pathExists(uiLibShared)) {
        await copyTemplate(uiLibShared, targetDir, resolvedVars);
      }
      const uiLibFramework = path.join(uiLibDir, framework);
      if (await fs.pathExists(uiLibFramework)) {
        await copyTemplate(uiLibFramework, targetDir, resolvedVars);
      }
      const configPath = path.join(uiLibDir, '_config.json');
      if (await fs.pathExists(configPath)) {
        const config: UILibConfig = JSON.parse(await fs.readFile(configPath, 'utf8'));
        await mergePackageJson(targetDir, config, framework);
      }
    }
  }
}

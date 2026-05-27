import fs from 'fs-extra';
import path from 'path';

const TEMPLATE_EXT = '.tmpl';

function interpolate(content: string, vars: Record<string, string>): string {
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

export async function generateProject(
  templatesDir: string,
  targetDir: string,
  vars: Record<string, string>,
) {
  if (await fs.pathExists(targetDir)) {
    const files = await fs.readdir(targetDir);
    if (files.length > 0) throw new Error(`Directory "${targetDir}" is not empty.`);
  }

  await copyTemplate(templatesDir, targetDir, vars);
}

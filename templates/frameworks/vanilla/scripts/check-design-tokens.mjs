import { readdir, readFile } from 'fs/promises';
import { join, extname } from 'path';

const SCAN_DIRS = ['src'];
const SCAN_EXTS = new Set(['.html', '.js', '.ts', '.css']);
const HEX_INLINE = /#[0-9a-fA-F]{3,6}(?![0-9a-fA-F])/g;

async function getFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await getFiles(full));
    else if (SCAN_EXTS.has(extname(entry.name))) files.push(full);
  }
  return files;
}

let violations = 0;
const files = await getFiles('src');

for (const file of files) {
  const content = await readFile(file, 'utf8');
  // Skip CSS custom property definitions (tokens.css)
  if (file.includes('tokens.css')) continue;
  const lines = content.split('\n');
  lines.forEach((line, i) => {
    const matches = line.match(HEX_INLINE);
    if (matches) {
      matches.forEach((m) => {
        console.error(`❌ Hardcoded hex ${m} in ${file}:${i + 1}`);
        violations++;
      });
    }
  });
}

if (violations > 0) {
  console.error(`\n${violations} violation(s). Use CSS custom properties (var(--color-accent), etc.)`);
  process.exit(1);
} else {
  console.log('✓ No hardcoded hex values found.');
}

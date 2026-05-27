/**
 * check-design-tokens.ts
 * Scan all .tsx/.css files for hardcoded design values that should use tokens.
 * Run: pnpm check:tokens
 */

import fg from 'fast-glob';
import fs from 'fs';

const FORBIDDEN: { pattern: RegExp; message: string }[] = [
  { pattern: /#([0-9a-fA-F]{3,6})\b/g, message: 'Hardcoded hex color' },
  { pattern: /\[(\d+)px\]/g, message: 'Arbitrary Tailwind px value' },
  { pattern: /bg-\[#/g, message: 'Arbitrary Tailwind bg color' },
  { pattern: /text-\[#/g, message: 'Arbitrary Tailwind text color' },
  { pattern: /border-\[#/g, message: 'Arbitrary Tailwind border color' },
];

// Files that are allowed to have raw values (token definitions)
const ALLOWLIST = [
  'src/styles/tokens.css',
  'tailwind.config.ts',
  'scripts/',
];

async function main() {
  const files = await fg(['src/**/*.{tsx,ts,css}'], { cwd: process.cwd() });
  const violations: string[] = [];

  for (const file of files) {
    // Skip allowlisted files
    if (ALLOWLIST.some((allowed) => file.includes(allowed))) continue;

    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, idx) => {
      // Skip comments
      if (line.trim().startsWith('//') || line.trim().startsWith('*')) return;

      FORBIDDEN.forEach(({ pattern, message }) => {
        pattern.lastIndex = 0;
        if (pattern.test(line)) {
          violations.push(`  ${file}:${idx + 1} — ${message}\n    ${line.trim()}`);
        }
      });
    });
  }

  if (violations.length > 0) {
    console.error(`\n❌ Design token violations found (${violations.length}):\n`);
    violations.forEach((v) => console.error(v));
    console.error('\nFix: Use CSS variables from src/styles/tokens.css or Tailwind token classes.\n');
    process.exit(1);
  } else {
    console.log('✅ No design token violations found.');
  }
}

main();

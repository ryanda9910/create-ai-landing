export interface FigmaColor {
  name: string;
  hex: string;
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface FigmaTextStyle {
  name: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number | string;
  letterSpacing: number;
}

export interface FigmaTokens {
  primaryColor: string;
  accentColor: string;
  colors: FigmaColor[];
  textStyles: FigmaTextStyle[];
  fontFamilies: string[];
  colorsSection: string;
  typographySection: string;
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.round(n * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function extractFileId(url: string): string | null {
  const match = url.match(/figma\.com\/(?:file|design|proto)\/([A-Za-z0-9]+)/);
  return match ? match[1] : null;
}

// Guess which color is primary/accent from style name heuristics
function guessPrimaryAccent(colors: FigmaColor[]): { primary: string; accent: string } {
  const primaryKeywords = ['primary', 'brand', 'main', 'base', 'key'];
  const accentKeywords = ['accent', 'cta', 'highlight', 'action', 'secondary'];

  const findBy = (keywords: string[]) =>
    colors.find(c => keywords.some(k => c.name.toLowerCase().includes(k)));

  const primary = findBy(primaryKeywords) ?? colors[0];
  const accent = findBy(accentKeywords) ?? colors[1] ?? colors[0];

  return {
    primary: primary?.hex ?? '#0A0A0B',
    accent: accent?.hex ?? '#D4A574',
  };
}

function buildColorsSection(colors: FigmaColor[]): string {
  if (colors.length === 0) return '';
  const table = [
    '| Token name | Hex | Usage |',
    '|---|---|---|',
    ...colors.map(c => `| \`${c.name.toLowerCase().replace(/\s+/g, '-')}\` | \`${c.hex}\` | _(fill in)_ |`),
  ].join('\n');
  return `<!-- Extracted from Figma —— update token names to match your system -->\n\n${table}`;
}

function buildTypographySection(styles: FigmaTextStyle[]): string {
  if (styles.length === 0) return '';
  const table = [
    '| Style name | Font family | Size | Weight | Line height |',
    '|---|---|---|---|---|',
    ...styles.map(s => {
      const lh = typeof s.lineHeight === 'number' ? `${s.lineHeight}px` : s.lineHeight;
      return `| ${s.name} | ${s.fontFamily} | ${s.fontSize}px | ${s.fontWeight} | ${lh} |`;
    }),
  ].join('\n');
  return `<!-- Extracted from Figma -->\n\n${table}`;
}

export async function fetchFigmaTokens(figmaUrl: string, token: string): Promise<FigmaTokens> {
  const fileId = extractFileId(figmaUrl);
  if (!fileId) throw new Error(`Cannot extract file ID from URL: ${figmaUrl}`);

  const headers = { 'X-Figma-Token': token };

  // Step 1: fetch full file to get styles map
  const fileRes = await fetch(`https://api.figma.com/v1/files/${fileId}?depth=1`, { headers });
  if (!fileRes.ok) {
    const err = await fileRes.text();
    throw new Error(`Figma API error ${fileRes.status}: ${err}`);
  }
  const fileData = await fileRes.json() as {
    styles: Record<string, { name: string; styleType: string; nodeId: string }>;
  };

  const stylesMap = fileData.styles ?? {};
  const colorStyleIds = Object.entries(stylesMap)
    .filter(([, s]) => s.styleType === 'FILL')
    .map(([, s]) => s.nodeId);
  const textStyleIds = Object.entries(stylesMap)
    .filter(([, s]) => s.styleType === 'TEXT')
    .map(([, s]) => s.nodeId);

  const colors: FigmaColor[] = [];
  const textStyles: FigmaTextStyle[] = [];

  // Step 2: fetch color style nodes
  if (colorStyleIds.length > 0) {
    const ids = colorStyleIds.slice(0, 20).join(','); // API limit
    const nodesRes = await fetch(`https://api.figma.com/v1/files/${fileId}/nodes?ids=${ids}`, { headers });
    if (nodesRes.ok) {
      const nodesData = await nodesRes.json() as {
        nodes: Record<string, { document: { fills?: Array<{ type: string; color?: { r: number; g: number; b: number; a: number } }> } }>;
      };
      for (const [nodeId, node] of Object.entries(nodesData.nodes)) {
        const styleEntry = Object.values(stylesMap).find(s => s.nodeId === nodeId);
        if (!styleEntry) continue;
        const fill = node.document.fills?.find(f => f.type === 'SOLID' && f.color);
        if (fill?.color) {
          const { r, g, b, a } = fill.color;
          colors.push({ name: styleEntry.name, hex: rgbToHex(r, g, b), r, g, b, a });
        }
      }
    }
  }

  // Step 3: fetch text style nodes
  if (textStyleIds.length > 0) {
    const ids = textStyleIds.slice(0, 20).join(',');
    const nodesRes = await fetch(`https://api.figma.com/v1/files/${fileId}/nodes?ids=${ids}`, { headers });
    if (nodesRes.ok) {
      const nodesData = await nodesRes.json() as {
        nodes: Record<string, { document: { style?: { fontFamily: string; fontSize: number; fontWeight: number; lineHeightPx: number; letterSpacing: number } } }>;
      };
      for (const [nodeId, node] of Object.entries(nodesData.nodes)) {
        const styleEntry = Object.values(stylesMap).find(s => s.nodeId === nodeId);
        if (!styleEntry || !node.document.style) continue;
        const s = node.document.style;
        textStyles.push({
          name: styleEntry.name,
          fontFamily: s.fontFamily,
          fontSize: s.fontSize,
          fontWeight: s.fontWeight,
          lineHeight: Math.round(s.lineHeightPx),
          letterSpacing: s.letterSpacing,
        });
      }
    }
  }

  const { primary, accent } = guessPrimaryAccent(colors);
  const fontFamilies = [...new Set(textStyles.map(s => s.fontFamily))];

  return {
    primaryColor: primary,
    accentColor: accent,
    colors,
    textStyles,
    fontFamilies,
    colorsSection: buildColorsSection(colors),
    typographySection: buildTypographySection(textStyles),
  };
}

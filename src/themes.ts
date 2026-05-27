export interface ThemeDefinition {
  label: string;
  hint: string;
  typography: string;
  spacing: string;
  motion: string;
  componentNotes: string;
  colorNotes: string;
  antiPatterns: string[];
}

export const THEMES: Record<string, ThemeDefinition> = {
  minimalist: {
    label: 'Minimalist',
    hint: 'clean, max white space, single accent',
    typography: 'System sans-serif (Inter, DM Sans). One display weight only. No decorative fonts.',
    spacing: 'Generous — 64px+ between sections. Let content breathe. Avoid visual crowding.',
    motion: 'Subtle fade-in only (300ms, ease-out). No movement unless it communicates something.',
    componentNotes: 'Hairline borders (1px, low opacity). No card shadows. No border-radius > 4px. Near-invisible dividers.',
    colorNotes: 'Near-white or near-black background. One accent color used sparingly. Muted grays for text hierarchy.',
    antiPatterns: [
      'Multiple font families',
      'Colorful illustrations or icons',
      'Busy backgrounds or textures',
      'Multiple CTA buttons in the same view',
      'Decorative dividers or ornaments',
    ],
  },

  'dark-studio': {
    label: 'Dark Studio',
    hint: 'dark bg, cinematic, moody',
    typography: 'Serif display (Fraunces, Playfair, Cormorant) for headlines. Clean sans for body. Mono for specs.',
    spacing: 'Cinematic — tall hero sections, slow scroll rhythm. Section padding: py-32 md:py-48.',
    motion: 'Slow parallax (600ms). Staggered reveal. Respect prefers-reduced-motion strictly.',
    componentNotes: 'Dark surface (#111 or near-black bg). Subtle glow on cards (box-shadow: 0 0 40px rgba(accent, 0.15)). No white backgrounds.',
    colorNotes: 'Deep background (#0A0A0B to #1A1A1A). Warm or cool accent. Avoid pure white text — use #E8E8E6 or similar.',
    antiPatterns: [
      'White or light gray backgrounds',
      'Flat design without depth',
      'Pastel color palette',
      'Comic/playful icons',
      'Tight line-height on display text',
    ],
  },

  brutalist: {
    label: 'Brutalist',
    hint: 'raw, bold, anti-polish',
    typography: 'Oversize bold sans (Impact, Bebas Neue, Arial Black). ALL CAPS for headings. Max contrast.',
    spacing: 'Tight and asymmetric. Break expected grid alignment intentionally. No padding uniformity.',
    motion: 'Instant (50ms or none). No smooth transitions. Hard cuts only.',
    componentNotes: 'Zero border-radius. Hard box-shadow (4px 4px 0 0 black). Raw <hr> separators. Visible borders everywhere.',
    colorNotes: 'Black and white base with ONE jarring accent (neon yellow, red, lime). No gradients ever.',
    antiPatterns: [
      'Rounded cards or buttons',
      'Drop shadows',
      'Smooth scroll animations',
      'Gradient backgrounds',
      'Soft or pastel colors',
      'Centered hero layout',
    ],
  },

  glassmorphism: {
    label: 'Glassmorphism',
    hint: 'frosted glass, backdrop blur, layered depth',
    typography: 'Light-weight sans (300–400 weight). Avoid heavy weights — competes with glass layers.',
    spacing: 'Moderate. Cards float with overlap. Z-axis depth matters more than 2D spacing.',
    motion: 'Smooth blur transitions (400ms). Cards appear to lift on hover. Parallax depth layers.',
    componentNotes: 'background: rgba(255,255,255,0.1). backdrop-filter: blur(20px). border: 1px solid rgba(255,255,255,0.2). Layered stacking creates depth.',
    colorNotes: 'Vibrant gradient background (fixed, blurred). White/light glass elements on top. Accent should be vivid to show through glass.',
    antiPatterns: [
      'Flat opaque cards on flat backgrounds',
      'Heavy dark text on glass',
      'No background gradient (glass needs something to blur)',
      'Overusing blur on text',
      'No depth separation between layers',
    ],
  },

  retro: {
    label: 'Retro / Vintage',
    hint: 'warm, nostalgic, serif-heavy',
    typography: 'Slab serif or old-style serif display (Playfair, Libre Baskerville). Vintage script for accents.',
    spacing: 'Dense — editorial density. 16–24px gaps. Narrow columns with wide margins.',
    motion: 'None preferred. If any: typewriter effect, or VHS scan-line wipes.',
    componentNotes: 'Aged paper textures (CSS grain filter). Sepia or warm-tinted images. Rough/uneven borders (border-image with texture). Worn badge shapes.',
    colorNotes: 'Warm off-white (#F5EFE0) or tobacco background. Muted warm palette: tan, rust, forest green, navy. Desaturated photos.',
    antiPatterns: [
      'Clean modern sans-serif fonts',
      'Bright neon colors',
      'Perfectly geometric shapes',
      'Flat vector illustrations',
      'Dark mode dark backgrounds',
    ],
  },

  editorial: {
    label: 'Editorial',
    hint: 'magazine grid, large display type',
    typography: 'Oversize display serif (60–120px+ headlines). Body in compact sans. Strict typographic hierarchy.',
    spacing: 'Grid-governed. 12-column layout. Asymmetric content blocks. Large whitespace as a design element.',
    motion: 'Page-turn transitions. Text reveals with clip-path. No bounce.',
    componentNotes: 'Thin rules (<hr> 1px). Pull-quotes. Drop caps. Image bleeds to edge. No card components — content IS the layout.',
    colorNotes: 'Black, white, and one editorial accent. Color is used as highlight, not background fill.',
    antiPatterns: [
      'Equal-width columns throughout',
      'Cards with padding and borders',
      'Round profile photos (use square/rectangle)',
      'Generic icon sets',
      'Navigation that looks like an app',
    ],
  },

  corporate: {
    label: 'Corporate',
    hint: 'structured, professional, trustworthy',
    typography: 'Professional sans (Inter, Source Sans, Roboto). Clear hierarchy: H1 bold, body regular, labels semibold.',
    spacing: 'Consistent and predictable. 24px base unit. No surprises — sections align, content is scannable.',
    motion: '200ms quick transitions. Hover states on all interactive elements. No decorative animation.',
    componentNotes: 'Defined card borders. Icon + text lists. Stats/metric callouts. Trust signals (logos, certs, counts). Blue-tinted palette often.',
    colorNotes: 'Blue, navy, or deep green primary. White or light gray backgrounds. Restrained accent — never jarring.',
    antiPatterns: [
      'Playful or handwritten fonts',
      'Irregular layouts or broken grids',
      'High-contrast dark backgrounds',
      'Abstract art or illustrations',
      'Humor or informal copy',
    ],
  },

  playful: {
    label: 'Playful',
    hint: 'colorful, rounded, energetic',
    typography: 'Rounded sans (Nunito, Quicksand, Poppins). Friendly weight — medium to semibold. No harsh angular fonts.',
    spacing: 'Comfortable padding. Content should feel fun, not cramped. Section py-24 with room for color blocks.',
    motion: 'Bounce and spring on hover (cubic-bezier with slight overshoot). Wiggle effects on CTAs. 300–500ms.',
    componentNotes: 'border-radius: 16–24px on cards. Rounded pill buttons. Emoji accents. Colorful background sections. Playful icons (Lucide, Phosphor).',
    colorNotes: 'Multi-color palette — 3–5 vivid hues. Each section can use a different accent. Avoid muddy or desaturated colors.',
    antiPatterns: [
      'Monochrome or grayscale palette',
      'Sharp corners on any interactive element',
      'Dense text walls',
      'Corporate font choices',
      'Serious or formal tone in copy',
    ],
  },

  cyberpunk: {
    label: 'Cyberpunk',
    hint: 'neon on dark, glitch aesthetic',
    typography: 'Mono or condensed tech sans (JetBrains Mono, Orbitron, Share Tech). Mix uppercase and monospace.',
    spacing: 'Tight scanlines. Dense info. HUD-style data display. Asymmetric grid breaks.',
    motion: 'Glitch flicker (CSS clip-path animation). Terminal cursor blink. Scan-line wipes. Fast (100–200ms).',
    componentNotes: 'Glitch borders (before/after pseudo-element offset). Neon glow (text-shadow, box-shadow). CRT scanline overlay (CSS repeating-linear-gradient). Terminal-style inputs.',
    colorNotes: 'Near-black background (#050510). Neon accent: cyan (#00FFFF), magenta (#FF00FF), or acid green (#39FF14). NEVER both cyan AND magenta at full intensity.',
    antiPatterns: [
      'Natural or warm color tones',
      'Serif fonts',
      'Soft rounded corners',
      'Friendly or warm copy tone',
      'Smooth easing animations (use stepped/glitch)',
    ],
  },

  swiss: {
    label: 'Swiss / Bauhaus',
    hint: 'geometric, grid-based, strict sans-serif',
    typography: 'Neutral grotesque only (Helvetica Neue, Aktiv Grotesk, Neue Haas). NEVER decorative fonts. Size and weight are your only tools.',
    spacing: 'Strict 8px grid. Mathematical proportions. Margins and padding always multiples of 8. No exceptions.',
    motion: 'Structural only — no decorative animation. Transitions communicate state, not delight.',
    componentNotes: 'Hard geometry. Red/black/white dominant. Asymmetric but grid-locked. Primary-color accents in rectangles, not organic shapes.',
    colorNotes: 'Near black + white + ONE primary color (often red or blue). No gradients. No textures. Color as structural signal only.',
    antiPatterns: [
      'Decorative or display fonts',
      'Organic or irregular shapes',
      'Multiple accent colors',
      'Gradients or shadows',
      'Centered alignment (favor left-aligned grids)',
    ],
  },

  organic: {
    label: 'Organic',
    hint: 'earthy, natural, sustainable',
    typography: 'Humanist serif (Lora, Merriweather) for body. Natural display (Playfair with normal weight). Avoid geometric sans.',
    spacing: 'Relaxed and natural. Irregular section sizes. Asymmetric crops and overlaps.',
    motion: 'Gentle float/sway (600ms, ease-in-out). Scroll reveals that feel like plants growing. Never mechanical.',
    componentNotes: 'Organic blob shapes (SVG border-radius). No sharp corners. Natural textures (grain, canvas) in CSS. Hand-drawn borders or decorations.',
    colorNotes: 'Earth tones: moss green, warm terracotta, oat beige, clay brown. Desaturated palette. Never neon or synthetic colors.',
    antiPatterns: [
      'Geometric or tech aesthetics',
      'Neon or synthetic colors',
      'Sharp-cornered cards',
      'Monochrome or grayscale only',
      'Fast or mechanical animations',
    ],
  },

  luxury: {
    label: 'Luxury',
    hint: 'premium, refined, metallic accents',
    typography: 'Thin/light display serif (Cormorant Garamond, Didot). Generous tracking (letter-spacing: 0.1em–0.2em). Very controlled hierarchy.',
    spacing: 'Maximum space. Vast padding. Content is sparse. Silence is part of the design.',
    motion: 'Ultra-slow, ultra-smooth (600–900ms, cubic-bezier). Parallax. Image reveals. Never quick.',
    componentNotes: 'Hairline borders (0.5px). Gold, champagne, or silver accent details. No rounded corners. Aspect-ratio-locked image containers.',
    colorNotes: 'Near-black (#0D0D0D) or ivory (#FAF8F4) background. Gold (#C9A96E), champagne (#E8D5A3), or platinum (#B8B8B8) accent. One accent only.',
    antiPatterns: [
      'Bright or saturated colors',
      'Rounded or pill-shaped buttons',
      'Playful or casual typography',
      'Busy backgrounds',
      'Multiple competing CTAs',
      'Sans-serif display text',
    ],
  },
};

export function getThemeNotes(themeSlug: string): string {
  const theme = THEMES[themeSlug];
  if (!theme) return '';
  return [
    `**Typography:** ${theme.typography}`,
    `**Spacing:** ${theme.spacing}`,
    `**Motion:** ${theme.motion}`,
    `**Components:** ${theme.componentNotes}`,
    `**Color guidance:** ${theme.colorNotes}`,
    `**Theme-specific anti-patterns:**`,
    ...theme.antiPatterns.map(p => `- ${p}`),
  ].join('\n');
}

export const THEME_OPTIONS = Object.entries(THEMES).map(([value, t]) => ({
  value,
  label: t.label,
  hint: t.hint,
}));

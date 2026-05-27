import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'crucible',
  description: 'Scaffold a landing page with a full AI agent system built in',
  base: '/crucible/',

  head: [
    ['meta', { name: 'theme-color', content: '#f97316' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'crucible' }],
    ['meta', { property: 'og:description', content: 'Scaffold a landing page with a full AI agent system built in' }],
  ],

  themeConfig: {
    logo: '/icon-crucible.svg',
    siteTitle: 'crucible',

    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'UI Libraries', link: '/guide/ui-libraries' },
      { text: 'Changelog', link: '/changelog' },
      {
        text: 'v1.1.0',
        items: [
          { text: 'npm', link: 'https://www.npmjs.com/package/create-crucible' },
          { text: 'GitHub', link: 'https://github.com/ryanda9910/crucible' },
        ],
      },
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/guide/introduction' },
          { text: 'Quick Start', link: '/guide/getting-started' },
          { text: 'Frameworks', link: '/guide/frameworks' },
          { text: 'UI Libraries', link: '/guide/ui-libraries' },
        ],
      },
      {
        text: 'The AI System',
        items: [
          { text: 'DESIGN.md', link: '/guide/design-md' },
          { text: 'GUARDRAILS.md', link: '/guide/guardrails' },
          { text: 'Skills', link: '/guide/skills' },
          { text: 'Token Enforcement', link: '/guide/token-enforcement' },
        ],
      },
      {
        text: 'Customization',
        items: [
          { text: 'Brand & Content', link: '/guide/customization' },
          { text: 'Adding Sections', link: '/guide/adding-sections' },
          { text: 'API Route', link: '/guide/api-route' },
        ],
      },
      {
        text: 'Contributing',
        items: [
          { text: 'How to Contribute', link: '/guide/contributing' },
          { text: 'Adding a Framework', link: '/guide/adding-framework' },
          { text: 'Adding a UI Library', link: '/guide/adding-ui-library' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ryanda9910/crucible' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/create-crucible' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: '© 2026 ryanda9910',
    },

    editLink: {
      pattern: 'https://github.com/ryanda9910/crucible/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    search: { provider: 'local' },
  },
});

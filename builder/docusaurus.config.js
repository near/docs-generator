// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

/** @type {import('@docusaurus/types').Config} */
const config = {
  plugins: [
    [
      'docusaurus-plugin-typedoc',
      // Plugin / TypeDoc options
      {
        entryPoints: process.env.DOCS_ENTRY_POINT.split(','),
        tsconfig: process.env.DOCS_TS_CONFIG,
        name: 'NEAR JavaScript API',
        includeVersion: true,
        entryPointStrategy: 'expand',
        excludeNotDocumented: false,
        out: '.',
        basePath: process.env.DOCS_BASE_PATH,
        readme: process.env.DOCS_README,
        hideGenerator: false,
        commentStyle: 'jsdoc',
        entryDocument: 'index.md',
        hideMembersSymbol: true,
      },
    ],
  ],
  title: '',
  url: '',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
};

module.exports = config;

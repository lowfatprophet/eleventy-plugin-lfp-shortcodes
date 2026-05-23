# LFP Shortcodes

A comprehensive collection of shortcodes for use in any Eleventy project, with minimal setup and maximum customization. To see most of shortcodes in action on a live page, visit [lowfatprophet's style guide](https://lowfatprophet.netlify.app/style-guide).

## Development

### Installation

Setting the project up for development is straightforward:

```bash
# 1. clone this repository
git clone https://codeberg.org/lowfatprophet/eleventy-plugin-lfp-shortcodes.git
# 2. go into directory
cd eleventy-plugin-lfp-shortcodes
# 3. install all required packages
npm i
```

### Development

Test builds are done with [tsdown](https://tsdown.dev). Configuration is done in `/tsdown.config.ts`.

```bash
npm run dev
```

### Testing

Tests are commenced with [vitest](https://vitest.dev). Configuration is done in `/vitest.config.ts`, test files are placed in `/tests`.

```bash
npm run test
```

### Building

The project is built with [tsdown](https://tsdown.dev). Configuration is done in `/tsdown.config.ts`.

```bash
# runs tests before building
npm run build
# does NOT run test before building; DO NOT USE IN PRODUCTION!
npm run build:dangerously
```

![Source on Codeberg](/assets/source_on_codeberg.svg)
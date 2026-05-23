---
layout: base.njk
order: 1
tags: pages
title: Getting started
---
> [!IMPORTANT]
> **Before putting this package to use**: This is a highly opinionated library of curated shortcodes that are used on the bespoke personal website [lowfatprophet](https://lowfatprophet.netlify.app). The goal for all shortcodes is to be highly versatile and broadly available in the most different scenarios with all current and future versions of Eleventy. This is not always achieved due to the aforementioned roots of this package.

## Installation

Install from [npm](https://npmjs.org). [Node](https://nodejs.org) v22 or higher is required.

```bash
npm install -D @lowfat/eleventy-plugin-lfp-shortcodes
```

Add the plugin in your `.eleventy.js`/`eleventy.config.js`/`eleventy.config.mjs`:

```javascript
import shortcodes from '@lowfat/eleventy-plugin-lfp-shortcodes';

export default async function(eleventyConfig) {
    // your configurations
    eleventyConfig.addPlugin(shortcodes, options);
}
```

Continue reading to learn about configuration via `options`.

## Configuration

The plugin offers a plethora of options, regarding styling and functionality for each shortcode.

Configuration and customization is two-fold:

1. Configuration for essential functionalities can be done by passing certain arguments when calling the shortcode in your template. To learn more about these configurations, have a look at each individual shortcode.
2. Passing a configuration file to the plugin is another way to customize the library's plugins.


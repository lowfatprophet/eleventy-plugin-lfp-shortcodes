---
layout: base.njk
title: LFP Shortcodes Documentation
---
Eleventy offers the integration of shortcodes to use in its templating and content creation ([Shortcode documentation for Eleventy](https://www.11ty.dev/docs/shortcodes/)). They can either be *single* or [*paired*](https://www.11ty.dev/docs/shortcodes/#paired-shortcodes) and work with all default template languages supported by Eleventy (Liquid, Nunjucks, Handlebars, JavaScript).

Each shortcode offers extensive [customization](/configuration). The following example code snippets are written in [Nunjucks](https://mozilla.github.io/nunjucks) (if you prefer or require to use another templating language, refer to [Template Languages](/templating)) and use TypeScript types to describe their interface.

Some shortcodes offer additional functionalities with optional arguments. By and large, you can ignore them entirely if you do not need them, or place an empty string `""` to skip them. (Exceptions to this behavior are noted explicitly.)

See [custom components](/custom-components) to learn about optional and obligatory client-side scripts and stylesheets.

> [!IMPORTANT]
> **Before putting this package to use**: This is a highly opinionated library of curated shortcodes that are used on the bespoke personal website [lowfatprophet](https://lowfatprophet.netlify.app). The goal for all shortcodes is to be highly versatile and broadly available in the most different scenarios with all current and future versions of Eleventy. This is not always achieved due to the aforementioned roots of this package.

Shortcode | Type | Arguments
--- | --- | ---
[**Addendum**](/shortcodes/addendum) | paired | `content, date`[^1]
[**Blockquote**](/shortcodes/blockquote) | paired | `quote[, attribution, cite]`[^1]
[**Detail**](/shortcodes/detail) | paired | `content, summary[, name, id, open]`[^1]
[**Embed**](/shortcodes/embed) | single | `url`
[**Figure**](/shortcodes/figure) | single | `src[, alt, caption, id, attribution]`
[**Inflation**](/shortcodes/inflation) | single | `value, year`
[**Listing**](/shortcodes/listing) | paired | `content[, caption, id, hideCopy]`[^1]
[**Math**](/shortcodes/math) | single | `content`
[**Mathblock**](/shortcodes/mathblock) | paired | `content[, caption, id]`[^1]
[**Poem**](/shortcodes/poem) | paired | `content[, caption]`[^1]
[**Richlink**](/shortcodes/richlink) | single | `url`
[**Table**](/shortcodes/table) | paired | `content[, caption, id]`[^1]

[^1]: With paired shortcodes, the first argument is the content placed inside the shortcode's delimiters.
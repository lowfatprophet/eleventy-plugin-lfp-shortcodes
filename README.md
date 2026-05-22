# LFP Shortcodes

A comprehensive collection of shortcodes for use in any Eleventy project, with minimal setup and maximum customization. To see most of shortcodes in action on a live page, visit [lowfatprophet's style guide](https://lowfatprophet.netlify.app/style-guide).

> [!IMPORTANT]
> **Before putting this package to use**: This is a highly opinionated library of curated shortcodes that are used on the bespoke personal website [lowfatprophet](https://lowfatprophet.netlify.app). The goal for all shortcodes is to be highly versatile and broadly available in the most different scenarios with all current and future versions of Eleventy. This is not always achieved due to the aforementioned roots of this package.

- [Shortcodes](#shortcodes)
- [Usage](#usage)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Template Languages](#template-languages)
- [Development](#development)

## Shortcodes

Eleventy offers the integration of shortcodes to use in its templating and content creation ([Shortcode documentation for Eleventy](https://www.11ty.dev/docs/shortcodes/)). They can either be *single* or [*paired*](https://www.11ty.dev/docs/shortcodes/#paired-shortcodes) and work with all default template languages supported by Eleventy (Liquid, Nunjucks, Handlebars, JavaScript).

Shortcode | Type | Arguments
--- | --- | ---
[**Addendum**](#addendum) | paired | `content, date`[^1]
[**Blockquote**](#blockquote) | paired | `quote[, attribution, cite]`[^1]
[**Detail**](#detail) | paired | `content, summary[, name, id, open]`[^1]
[**Embed**](#embed) | single | `url`
[**Figure**](#figure) | single | `src[, alt, caption, id, attribution]`
[**Inflation**](#inflation) | single | `value, year`
[**Listing**](#listing) | paired | `content[, caption, id, hideCopy]`[^1]
[**Math**](#math) | single | `content`
[**Mathblock**](#mathblock) | paired | `content[, caption, id]`[^1]
[**Poem**](#poem) | paired | `content[, caption]`[^1]
[**Richlink**](#richlink) | single | `url`
[**Table**](#table) | paired | `content[, caption, id]`[^1]

Each shortcode offers extensive [customization](#configuration). The following example code snippets are written in [Nunjucks](https://mozilla.github.io/nunjucks) (if you prefer or require to use another templating language, refer to [Template Languages](#template-languages)) and use TypeScript types to describe their interface.

Some shortcodes offer additional functionalities with optional arguments. By and large, you can ignore them entirely if you do not need them, or place an empty string `""` to skip them. (Exceptions to this behavior are noted explicitly.)

See [Additional Elements](#additional-elements) to learn about optional and obligatory client-side scripts and stylesheets.

### Addendum

Creates an `<aside>` with a date to make transparent why and when content on a page was added.

Argument | Type | Required
--- | --- | ---
content[^1] | `string` | yes
date | `` `{number}-{number}-{number}` `` | yes

#### Example

```nunjucks
{% addendum "2026-05-13" %}
This is content added on May 13th, 2026.
{% endaddendum %}
```

### Blockquote

Creates a `<blockquote>` element with optional attribution.

Argument | Type | Required
--- | --- | ---
quote[^1] | `string` | yes
attribution | `string` | no
cite | `string` | no

#### Example

```nunjucks
{% blockquote "Mark Twain" "https://example.org/mark-twain-quotes" %}
The two most important days in your life are the day you are born and the day you find out why.
{% endblockquote %}
```

### Detail

Creates a `<detail>` element with `<summary>`. Add an optional `id` to reference the element from elsewhere, add `open="true"` for the element to be open by default. `name` allows 

Argument | Type | Required
--- | --- | ---
content[^1] | `string` | yes
summary | `string` | yes
name | `string` | no
id | `string` | no
open | `"true"\|"false"` | no, default: `"false"`

#### Example

```nunjucks
{% detail "This is the detail's summary" "unique-id" "true" %}
```

### Embed

Embeds remote content onto the page. The embedded resource is hidden behind a toggle to respect the user's privacy concerns. [`embeds.js`](#embedsjs) needs to be available for the client in order to provide functionality to this component.

Currently supported URLs:

- Bluesky
- CodePen
- Mastodon
- Reddit
- Spotify
- YouTube

Alternatively, **Embed** can display static files as embeds, currently supported:

- PDF

Static file embeds only work for locally hosted files due to [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)-restrictions.

Argument | Type | Required
--- | --- | ---
url | `string` | yes

#### Example

```nunjucks
{# YouTube embed #}
{% embed "https://youtube.com/watch?v=LpG8vtFMkD0" %}
{% embed "https://youtu.be/LpG8vtFMkD0" %}
{# Spotify embed #}
{% embed "https://open.spotify.com/intl-de/album/7tfW0uYdwTz3QcTAILyrHY" %}
{# Bluesky embed #}
{% embed "https://bsky.app/profile/tazkultur.bsky.social/post/3ljmr7hmn4s2j" %}
{# CodePen embed #}
{% embed "https://codepen.io/lowfatprophet/pen/VYvgpaw" %}
{# Reddit embed #}
{% embed "https://reddit.com/r/Steam/comments/1p8oomu/valve_artist_responds_to_calls_for_steam_to_drop/" %}
{# Mastodon embed #}
{% embed "https://mastodon.social/@deejayy/115454110249651937" %}
```

### Figure

Creates a semantically sound `<figure>` element with optional `<figcatpion>`. Works great with Eleventy's own [image optimization pipeline](https://www.npmjs.com/package/@11ty/eleventy-img).

Add alternative text with `alt` (strongly recommended!), an `id` to reference the image from elsewhere, and attribution for copyrighted images.

Argument | Type | Required
--- | --- | ---
src | `string` | yes
alt | `string` | no
caption | `string` | no
id | `string` | no
attribution | `string` | no

#### Example

```nunjucks
{% figure "https://placehold.co/1600x900", "image in figure with obligatory alt text", "Caption of this figure, including custom id for linking.", "test-figure-1", "https://example.com/attribution-for-image" %}
```

### Inflation

Pass the `value` to calculate and the `year` to which you want to relate. Uses [StatBureau](https://statbureau.org) as external service and will silently fail if no connection can be established, returning the unchanged input `value`.

Only offers inflation rates for Euro, Pound, and US-Dollar.

Argument | Type | Required
--- | --- | ---
value | `string` | yes
year | `string` | yes

#### Example

```nunjucks
{% inflation "1000", "1954" %}
```

### Listing

Creates a semantically sound `<figure>` element with optional `figcaption`, and `id` to reference the element elsewhere. if `hideCopy` is set to `"true"`, the default [button to copy code](#copybuttonjs) to clipboard will not be displayed.

This component plays along nicely with Eleventy's own [syntax highlighting plugin](https://www.11ty.dev/docs/plugins/syntaxhighlight/).

Argument | Type | Required
--- | --- | ---
content[^1] | `string` | yes
caption | `string` | no
id | `string` | no
hideCopy | `"true"\|"false"` | no, default: `"false"`

#### Example

````nunjucks
{% listing "Codeblock inside figure with caption.", "listing-id-1" %}
```python
def codeblock():
    print("Hello World!")
```
{% endlisting %}
````

### Math

Transpiles a given Latex math expression into [MathML](https://developer.mozilla.org/en-US/docs/Web/MathML), using [Temml](https://temml.org/). `math` inlines the result, for block expressions, see [Mathblock](#mathblock). **do not include `$` to delimit the Latex expression.**

Argument | Type | Required
--- | --- | ---
content | `string` | yes

#### Example

```nunjucks
{% math "a^2+b^2=c^2" %}
```

### Mathblock

Works like [Math](#math), but rendering the output inside a `<figure>` element, offering optional `caption`, and `id` to reference the expression elsewhere. **Do not include `$$` to delimit the Latex expression.**

Argument | Type | Required
--- | --- | ---
content[^1] | `string` | yes
caption | `string` | no
id | `string` | no

#### Example

```nunjucks
{% mathblock "Normal distribution", "equation-id-1" %}
\Phi(x)=\frac{1}{\sqrt{2\pi \sigma^2}}\mathrm{e}^\frac{(x-\mu)^2}{2\sigma^2}
{% endmathblock %}
```

### Poem

Wraps the poem inside a `<figure>` element with optional `caption`, preserving whitespace for the poem.

Offers the following customizations by wrapping individual lines in `HTMLSpanElement`s with the approbriate `data`-attributes:

- `data-text-center`: centers this line, centers around caesurae if found in provided text
- `data-text-end`: aligns this line to the end (right for <abbr title="left to right">LTR</abbr>-languages, left <abbr title="right to left">RTL</abbr>-languages).

Argument | Type | Required
--- | --- | ---
content[^1] | `string` | yes
caption | `string` | no

#### Example

```nunjucks
{% poem "The caption", "dir:rtl;line-height:1" %}
Roses are red,
    violets are blue,
I return this shortcode
    right back to you!
{% endpoem %}
```

### Richlink

[Rich links](https://lowfatprophet.netlify.app/notes/2025/09/rich-links/) are a way to enhance the visual appeal of longer textual content, similar to pullquotes. They offer a small preview for the user, before they follow a link, most commonly to another domain. See [notes for the required script](#richlinkjs) to fully utilize this component.

Argument | Type | Required
--- | --- | ---
url | `string` | yes

#### Example

```nunjucks
{% richlink "https://11ty.dev" %}
```

### Table

Creates a `<table>` element, filled with the given table content; **only accepts HTML content, does not parse Markdown tables**. Offers optional `caption` and `id` for the element to be referenced elsewhere. **Leave surrounding `<table>` tags off the string you want to paste as content to the shortcode**.

Argument | Type | Required
--- | --- | ---
content[^1] | `string` | yes
caption | `string` | no
id | `string` | no

#### Example

```nunjucks
{% table "Table Caption", "table-id-1" -%}
{# the table's content, excluding `<table>` tags #}
{% endtable %}
```

### Additonal Elements

Shortcodes execute exclusively during build time, or on the backend. To enhance the markup output, some shortcodes offer additional resources, such as scripts and styles. Scripts add client-side logic while styles offer an extensive base styling for certain elements.

Scripts | Styles | Applied to
--- | --- | ---
[`copybutton.js`](#copybuttonjs) | | [Listing](#listing), [Mathblock](#mathblock)
[`embeds.js`](#embedsjs) | | [Embed](#embed)
[`richlink.js`](#richlinkjs) | [`richlink.css`](#richlinkcss) | [Rich link](#richlink)

#### Scripts

Some shortcodes require additional client-side logic to properly function; though all shortcodes provide a meaningful and sensible fallback if JavaScript execution should not be available for any reason.

Import scripts (e.g., for use with a bundler) provided by this plugin like so:

```javascript
import copybutton from '@lowfat/eleventy-plugin-lfp-shortcodes/scripts/copybutton';
import embeds from '@lowfat/eleventy-plugin-lfp-shortcodes/scripts/embeds';

// your logic ...
```

From there you could even use exported classes in other places of your codebase:

```javascript
import copybutton from '@lowfat/eleventy-plugin-lfp-shortcodes/copybutton';

customElements.define('your-custom-button', class extends HTMLElement {
    // your logic ...
});
```

> [!NOTE]
> These scripts register their exported custom elements in the page's custom element registry as a side effect!

##### `copybutton.js`

The script features a web component that allows for copying text from specified elements. Used for copying code with [Listings](#listing).

##### `embeds.js`

The script provides the necessary functionality for [Embeds](#embed) to propertly load on the page. Embeds require the user to explicitly accept the embedding of remote content by toggling a checkbox. Without this script or user consent, embeds will only display a link to the remotely hosted content.

##### `richlink.js`

The script allows for the user to toggle remotely hosted assets which enrich the [Rich link component's](#richlink) appearance. Without this script or user consent, rich links will not display any images.

#### Stylesheets

Some embeds profit from extensive styling (i.e., the [rich link component](#richlink)). For this reason, this package offers some CSS starter files, which you can extend and build upon.

Alternatively, each shortcode returns semantic markup that you can either style by addressing respective tags (just have a look at the markup output!) or by exploring the [configuration options](#configuration).

##### `richlink.css`

***TBA***

## Usage

### Installation

Install the plugin from [NPM](https://npmjs.com):

```bash
npm i @lowfat/eleventy-plugin-lfp-shortcodes
```

Add the plugin in your `.eleventy.js`/`eleventy.config.js`/`eleventy.config.mjs`:

```javascript
import shortcodes from '@lowfat/eleventy-plugin-lfp-shortcodes';

export default async function(eleventyConfig) {
    // your configurations
    eleventyConfig.addPlugin(shortcodes, options);
}
```

Add your [`options`](#configuration) as the second argument, you will only have to define settings for the shortcodes you actually want to use.

### Configuration

***TBA***

### Template Languages

Shortcode syntax for different template languages can vary quite a bit, see the [Eleventy documentation for shortcodes](https://www.11ty.dev/docs/shortcodes/). EJS, Mustache, and MDX are not supported, since they do not allow shortcodes (as of May 2026).

- [Nunjucks and Liquid](#nunjucks-and-liquid)
- [Handlebars](#handlebars)
- [JavaScript and TypeScript](#javascript-and-typescript)

#### Nunjucks and Liquid

```nunjucks
{# single #}
{% shortcode "argument 1", "argument 2" %}

{# paired #}
{% shortcode "argument 1", "argument 2" %}
<shortcode content>
{% endshortcode %}

{# with "shortcode" as the shortcode's name #}
{# with <shortcode content> as the shortcode's arbitrary content, being rendered separetely, allowing nested shortcodes #}
```

#### Handlebars

The [Handlebars](https://handlebarsjs.com) templating language is available through [the official plugin](https://github.com/11ty/eleventy-plugin-template-languages).

```handlebars
{# single #}
{{{ shortcode "argument 1" "argument 2" }}}

{# paired #}
{{{ shortcode "argument 1" "argument 2" }}}
<shortcode content>
{{{ endshortcode }}}

{{! with "shortcode" as the shortcode's name }}
{{! with <shortcode content> as the shortcode's arbitrary content, being rendered separetely, allowing nested shortcodes }}
```

#### JavaScript and TypeScript

```javascript
// single
this.shortcode('argument 1', 'argument 2');

// paired
this.shortcode(shortcodeContent, 'argument 1', 'argument 2');

// with "shortcode" as the shortcode's name
// with `shortcodeContent` as the shortcode's arbitrary content, being rendered separetely, allowing nested shortcodes
```

Notice that shortcodes are accessed through the global `this` object provided by the Eleventy render engine.

Shortcodes can also be imported as standalone functions, if required. But make sure to either call them in contexts, where Eleventy-provided `this` is accessible or mock it yourself, as some shortcodes require some properties of `this` to be defined:

```javascript
import { addendum } from '@lowfat/eleventy-plugin-lfp-shortcodes';

function render() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call
    const addedContent = addendum.call(
        {
            page: {},
            rawInput: 'Raw input text, preferrably markdown.',
            inputPath: 'path/to/source/document',
        },
        'Some added text',
        '2026-05-13',
    );
    return `<article>${addedContent}</article>`;
}
```

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

## Errata

- Support for Nunjucks syntax highlighting is not great on many platforms, making code snippets in documentation harder to parse.

![Source on Codeberg](/assets/source_on_codeberg.svg)

[^1]: With paired shortcodes, the first argument is the content placed inside the shortcode's delimiters.
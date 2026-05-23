---
layout: base.njk
order: 3
tags: pages
title: Templating
---
Shortcode syntax for different template languages can vary quite a bit, see the [Eleventy documentation for shortcodes](https://www.11ty.dev/docs/shortcodes/). EJS, Mustache, and MDX are not supported, since they do not allow shortcodes (as of May 2026).

## Nunjucks and Liquid

```liquid
{% raw %}{# single #}
{% shortcode "argument 1", "argument 2" %}

{# paired #}
{% shortcode "argument 1", "argument 2" %}
<shortcode content>
{% endshortcode %}

{# with "shortcode" as the shortcode's name #}
{# with <shortcode content> as the shortcode's arbitrary content, being rendered separetely, allowing nested shortcodes #}{% endraw %}
```

## Handlebars

The [Handlebars](https://handlebarsjs.com) templating language is available through [the official plugin](https://github.com/11ty/eleventy-plugin-template-languages).

```handlebars
{% raw %}{# single #}
{{{ shortcode "argument 1" "argument 2" }}}

{# paired #}
{{{ shortcode "argument 1" "argument 2" }}}
<shortcode content>
{{{ endshortcode }}}

{{! with "shortcode" as the shortcode's name }}
{{! with <shortcode content> as the shortcode's arbitrary content, being rendered separetely, allowing nested shortcodes }}{% endraw %}
```

## JavaScript and TypeScript

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

{% codeblock %}
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
{% endcodeblock %}
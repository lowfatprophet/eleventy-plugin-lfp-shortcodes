---
title: Poem
---
Wraps the poem inside a `<figure>` element with optional `caption`, preserving whitespace for the poem.

Offers the following customizations by wrapping individual lines in `HTMLSpanElement`s with the approbriate `data`-attributes:

- `data-text-center`: centers this line, centers around caesurae if found in provided text
- `data-text-end`: aligns this line to the end (right for <abbr title="left to right">LTR</abbr>-languages, left <abbr title="right to left">RTL</abbr>-languages).

Argument | Type | Required
--- | --- | ---
content[^1] | `string` | yes
caption | `string` | no

## Usage

{% codeblock %}
```liquid
{% raw %}{% poem "The caption", "dir:rtl;line-height:1" %}
Roses are red,
    violets are blue,
I return this shortcode
    right back to you!
{% endpoem %}{% endraw %}
```
{% endcodeblock %}

## Example

...

[^1]: With paired shortcodes, the first argument is the content placed inside the shortcode's delimiters.
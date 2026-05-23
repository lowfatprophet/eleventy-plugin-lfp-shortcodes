---
title: Figure
---
Creates a semantically sound `<figure>` element with optional `<figcaption>`. Works great with Eleventy's own [image optimization pipeline](https://www.npmjs.com/package/@11ty/eleventy-img).

Add alternative text with `alt` (strongly recommended!), an `id` to reference the image from elsewhere, and attribution for copyrighted images.

Argument | Type | Required
--- | --- | ---
src | `string` | yes
alt | `string` | no
caption | `string` | no
id | `string` | no
attribution | `string` | no

## Usage

{% codeblock %}
```liquid
{% raw %}{% figure "https://placehold.co/1600x900", "image in figure with obligatory alt text", "Caption of this figure, including custom id for linking.", "test-figure-1", "https://example.com/attribution-for-image" %}{% endraw %}
```
{% endcodeblock %}

## Example

...

[^1]: With paired shortcodes, the first argument is the content placed inside the shortcode's delimiters.
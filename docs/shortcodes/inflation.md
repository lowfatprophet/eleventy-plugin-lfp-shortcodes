---
title: Inflation
---
Pass the `value` to calculate and the `year` to which you want to relate. Uses [StatBureau](https://statbureau.org) as external service and will silently fail if no connection can be established, returning the unchanged input `value`.

Only offers inflation rates for Euro, Pound, and US-Dollar.

Argument | Type | Required
--- | --- | ---
value | `string` | yes
year | `string` | yes

## Usage

{% codeblock %}
```liquid
{% raw %}{% inflation "1000", "1954" %}{% endraw %}
```
{% endcodeblock %}

## Example

...

[^1]: With paired shortcodes, the first argument is the content placed inside the shortcode's delimiters.
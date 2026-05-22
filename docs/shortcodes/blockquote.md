---
title: Blockquote
---
Creates a `<blockquote>` element with optional attribution.

Argument | Type | Required
--- | --- | ---
quote[^1] | `string` | yes
attribution | `string` | no
cite | `string` | no

## Example

```liquid
{% raw %}{% blockquote "Mark Twain" "https://example.org/mark-twain-quotes" %}
The two most important days in your life are the day you are born and the day you find out why.
{% endblockquote %}{% endraw %}
```

[^1]: With paired shortcodes, the first argument is the content placed inside the shortcode's delimiters.
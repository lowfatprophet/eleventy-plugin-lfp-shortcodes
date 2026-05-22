---
title: Addendum
---
Creates an `<aside>` with a date to make transparent why and when content on a page was added.

Argument | Type | Required
--- | --- | ---
content[^1] | `string` | yes
date | `` `{number}-{number}-{number}` `` | yes

## Example

```liquid
{% raw %}{% addendum "2026-05-13" %}
This is content added on May 13th, 2026.
{% endaddendum %}{% endraw %}
```

[^1]: With paired shortcodes, the first argument is the content placed inside the shortcode's delimiters.
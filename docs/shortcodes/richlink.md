---
title: Rich Link
---
[Rich links](https://lowfatprophet.netlify.app/notes/2025/09/rich-links/) are a way to enhance the visual appeal of longer textual content, similar to pullquotes. They offer a small preview for the user, before they follow a link, most commonly to another domain. See [notes for the required script](#richlinkjs) to fully utilize this component.

Argument | Type | Required
--- | --- | ---
url | `string` | yes

## Example

```liquid
{% raw %}{% richlink "https://11ty.dev" %}{% endraw %}
```

[^1]: With paired shortcodes, the first argument is the content placed inside the shortcode's delimiters.
---
title: Table
---
Creates a `<table>` element, filled with the given table content; **only accepts HTML content, does not parse Markdown tables**. Offers optional `caption` and `id` for the element to be referenced elsewhere. **Leave surrounding `<table>` tags off the string you want to paste as content to the shortcode**.

Argument | Type | Required
--- | --- | ---
content[^1] | `string` | yes
caption | `string` | no
id | `string` | no

## Example

```liquid
{% raw %}{% table "Table Caption", "table-id-1" -%}
{# the table's content, excluding `<table>` tags #}
{% endtable %}{% endraw %}
```

[^1]: With paired shortcodes, the first argument is the content placed inside the shortcode's delimiters.
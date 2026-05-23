---
title: Detail
---
Creates a `<detail>` element with `<summary>`. Add an optional `id` to reference the element from elsewhere, add `open="true"` for the element to be open by default. `name` allows 

Argument | Type | Required
--- | --- | ---
content[^1] | `string` | yes
summary | `string` | yes
name | `string` | no
id | `string` | no
open | `"true"\|"false"` | no, default: `"false"`

## Usage

{% codeblock %}
```liquid
{% raw %}{% detail "This is the detail's summary" "unique-id" "true" %}{% endraw %}
```
{% endcodeblock %}

## Example

...

[^1]: With paired shortcodes, the first argument is the content placed inside the shortcode's delimiters.
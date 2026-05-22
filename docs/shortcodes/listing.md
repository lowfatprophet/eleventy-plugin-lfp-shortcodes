---
title: Listing
---
Creates a semantically sound `<figure>` element with optional `figcaption`, and `id` to reference the element elsewhere. if `hideCopy` is set to `"true"`, the default [button to copy code](/custom-components/copy-code-button) to clipboard will not be displayed.

This component plays along nicely with Eleventy's own [syntax highlighting plugin](https://www.11ty.dev/docs/plugins/syntaxhighlight/).

Argument | Type | Required
--- | --- | ---
content[^1] | `string` | yes
caption | `string` | no
id | `string` | no
hideCopy | `"true"\|"false"` | no, default: `"false"`
lineNumbers | `"true"\|"false"` | no, default: `"false"`

## Usage

````liquid
{% raw %}{% listing "Codeblock inside figure with caption." "listing-id-1" %}
```python
def codeblock():
    print("Hello World!")
```
{% endlisting %}{% endraw %}
````

## Example

{% example %}
{% listing "Codeblock inside figure with caption." "listing-id-1" %}
```python
def codeblock():
    print("Hello World!")
```
{% endlisting %}
{% endexample %}

[^1]: With paired shortcodes, the first argument is the content placed inside the shortcode's delimiters.
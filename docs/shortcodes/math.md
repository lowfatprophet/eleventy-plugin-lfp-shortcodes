---
title: Math
---
## Inline

Transpiles a given Latex math expression into [MathML](https://developer.mozilla.org/en-US/docs/Web/MathML), using [Temml](https://temml.org/). `math` inlines the result, for block expressions, see [Mathblock](#mathblock). **do not include `$` to delimit the Latex expression.**

Argument | Type | Required
--- | --- | ---
content | `string` | yes

### Inline example

```liquid
{% raw %}{% math "a^2+b^2=c^2" %}{% endraw %}
```

## Block

Works like [Math](#math), but rendering the output inside a `<figure>` element, offering optional `caption`, and `id` to reference the expression elsewhere. **Do not include `$$` to delimit the Latex expression.**

Argument | Type | Required
--- | --- | ---
content[^1] | `string` | yes
caption | `string` | no
id | `string` | no

### Block example

```liquid
{% raw %}{% mathblock "Normal distribution", "equation-id-1" %}
\Phi(x)=\frac{1}{\sqrt{2\pi \sigma^2}}\mathrm{e}^\frac{(x-\mu)^2}{2\sigma^2}
{% endmathblock %}{% endraw %}
```

[^1]: With paired shortcodes, the first argument is the content placed inside the shortcode's delimiters.
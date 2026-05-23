---
layout: base.njk
order: 5
tags: pages
title: Custom components
---
Some shortcodes require additional client-side logic to properly function; though all shortcodes provide a meaningful and sensible fallback if JavaScript execution should not be available for any reason.

Shortcodes execute exclusively during build time, or on the backend. To enhance the markup output, some shortcodes offer additional resources, such as scripts and styles. Scripts add client-side logic while styles offer an extensive base styling for certain elements.

Scripts | Styles | Applied to
--- | --- | ---
[`copybutton.js`](#copy-code-button) | | [Listing](/shortcodes/listing), [Mathblock](/shortcodes/mathblock)
[`embeds.js`](#embeds) | | [Embed](/shortcodes/embed)
[`richlink.js`](#rich-link) | [`richlink.css`](/stylesheets) | [Rich link](/shortcodes/richlink)

Import scripts (e.g., for use with a bundler) provided by this plugin like so:

{% codeblock %}
```javascript
import copybutton from '@lowfat/eleventy-plugin-lfp-shortcodes/scripts/copybutton';
import embeds from '@lowfat/eleventy-plugin-lfp-shortcodes/scripts/embeds';

// your logic ...
```
{% endcodeblock %}

From there you could even use exported classes in other places of your codebase:

```javascript
import copybutton from '@lowfat/eleventy-plugin-lfp-shortcodes/copybutton';

customElements.define('your-custom-button', class extends HTMLElement {
    // your logic ...
});
```

> [!NOTE]
> These scripts register their exported custom elements in the page's custom element registry as a side effect!

## Copy code button

The script features a web component that allows for copying text from specified elements. Used for copying code with [Listings](/components/listing) and mathematical expressions with [Mathblock](/components/math#mathblock).

## Embed

The script provides the necessary functionality for [Embeds](/shortcodes/embeds) to propertly load on the page. Embeds require the user to explicitly accept the embedding of remote content by toggling a checkbox. Without this script or user consent, embeds will only display a link to the remotely hosted content.

## Rich link

The script allows for the user to toggle remotely hosted assets which enrich the [Rich link component's](/shortcodes/richlink) appearance. Without this script or user consent, rich links will not display any images.
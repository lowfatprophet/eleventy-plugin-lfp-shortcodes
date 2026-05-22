---
title: Embeds
---
Embeds remote content onto the page. The embedded resource is hidden behind a toggle to respect the user's privacy concerns. [`embeds.js`](/custom-components/embed) needs to be available for the client in order to provide functionality to this component.

Currently supported URLs:

- Bluesky
- CodePen
- Mastodon
- Reddit
- Spotify
- YouTube

Alternatively, **Embed** can display static files as embeds, currently supported:

- PDF

Static file embeds only work for locally hosted files due to [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)-restrictions.

Argument | Type | Required
--- | --- | ---
url | `string` | yes

## Example

```liquid
{% raw %}{# YouTube embed #}
{% embed "https://youtube.com/watch?v=LpG8vtFMkD0" %}
{% embed "https://youtu.be/LpG8vtFMkD0" %}
{# Spotify embed #}
{% embed "https://open.spotify.com/intl-de/album/7tfW0uYdwTz3QcTAILyrHY" %}
{# Bluesky embed #}
{% embed "https://bsky.app/profile/tazkultur.bsky.social/post/3ljmr7hmn4s2j" %}
{# CodePen embed #}
{% embed "https://codepen.io/lowfatprophet/pen/VYvgpaw" %}
{# Reddit embed #}
{% embed "https://reddit.com/r/Steam/comments/1p8oomu/valve_artist_responds_to_calls_for_steam_to_drop/" %}
{# Mastodon embed #}
{% embed "https://mastodon.social/@deejayy/115454110249651937" %}{% endraw %}
```

[^1]: With paired shortcodes, the first argument is the content placed inside the shortcode's delimiters.
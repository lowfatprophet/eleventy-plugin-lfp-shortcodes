import Fetch from '@11ty/eleventy-fetch';
import type { LFPBlueskyEmbedResponse, LFPEleventyScope } from '../types.d.ts';
import { setCounter, wbr } from '../util/helper.js';

interface EmbedOptions {
  /**
   * Additional elements that get appended into the resulting HTML right after the iFrame.
   */
  additionalElements?: string;
  /**
   * The referrer policy the iFrame should follow, defaults to `no-referrer`.
   */
  referrerPolicy?: string;
  /**
   * Addittional styles to apply to the iFrame element.
   */
  styles?: string;
  /**
   * Am optional width for the iFrame element, overwriting the default `100%`, accepts CSS sizes.
   */
  width?: string;
}

/**
 * Creates a decent fallback for when embeds are unavailable.
 */
function fallbackPhraser(
  url: string,
  customText: string | null = null,
  downloadable: boolean = false
) {
  return /* html */ `<p>${
    customText
      ? customText
      : /* html */ `<a href="${url}" ${downloadable ? 'download' : ''}>${wbr(url)}</a>`
  }</p>`;
}

/**
 * Creates an `lfp-embed` web component.
 */
function createEmbedComponent(
  url: URL,
  name: string,
  template: string,
  options: EmbedOptions,
  noscript: string | null = null
) {
  return /* html */ `<lfp-embed embed-name="${name}" embed-origin="${url.origin}" embed-url="${url.href}">
  <noscript>
    ${noscript || /* html */ fallbackPhraser(url.href, `See the embedded content from ${name} by following <a href="${url}">this link (${wbr(url.href)})</a>.`)}
  </noscript>
  <template>
    ${template}
  </template>
  ${options?.additionalElements || ''}
</lfp-embed>`;
}

/**
 * Creates an iFrame.
 */
function createFrame(
  url: URL,
  name: string,
  uuid: string,
  iframeAttributes: string,
  options: EmbedOptions = {
    additionalElements: '',
    referrerPolicy: 'no-referrer',
    styles: '',
    width: '100%',
  },
) {
  return createEmbedComponent(
    url,
    name,
    /* html */ `<iframe
  title="Embedded content from ${name}"
  id="embed-${uuid}"
  frameborder="0"
  referrerpolicy="${options.referrerPolicy || 'no-referrer'}"
  width="${options.width || '100%'}"
  loading="lazy"
  ${iframeAttributes}
  style="display:block;margin-inline:auto;${options.styles || ''}"></iframe>`,
    options,
  );
}

/**
 * Implements an embed component for YouTube embeds.
 */
function youtubeEmbed(url: URL, uuid: string) {
  //.   ID:      youtube.com                  youtu.be
  const id = url.searchParams.get('v') ?? url.pathname;
  return createFrame(
    url,
    'YouTube',
    uuid,
    `src="https://youtube.com/embed/${id.replace(/^\//, '')}"
title="YouTube video player"
allow="accelerometer; encrypted-media; fullscreen; gyroscope; picture-in-picture; web-share"`,
    {
      referrerPolicy: 'strict-origin-when-cross-origin',
      styles: 'aspect-ratio:16/9',
    },
  );
}

/**
 * Implements an embed component for Spotify embeds.
 */
function spotifyEmbed(url: URL, uuid: string) {
  return createFrame(
    url,
    'Spotify',
    uuid,
    `src="https://open.spotify.com/embed/${url.pathname
      .split('/')
      // filter out potential international path segment
      .filter(i => !i.startsWith('intl-'))
      .join('/')}"
title="Spotify preview player"
height="352"
allow="encrypted-media; fullscreen; picture-in-picture"`,
    { styles: 'border-radius:12px' },
  );
}

/**
 * Implements an embed component for Bluesky embeds.
 */
async function blueskyEmbed(url: URL, uuid: string): Promise<string | void> {
  const fallback = /* html */ `<p lang="en"><a href="${url}">Follow this link (${url})</a> to view the content on Bluesky.</p>`;

  try {
    // fetch default Bluesky embedding
    const _url = `https://embed.bsky.app/oembed?url=${url.href.replace(':', '%3A')}`;
    const data = await Fetch<LFPBlueskyEmbedResponse>(
      async () => {
        const response = await fetch(_url);
        return response.ok ? response.json() : { status: 'failed' };
      },
      { duration: '1w', type: 'json', requestId: _url },
    );
    if (data.status === 'failed') return fallback;
    // extract the Bluesky embed URI
    const bskyID = data.html.match(/data-bluesky-uri="(.*?)"/)?.at(1);
    if (bskyID)
      return createFrame(
        url,
        'Bluesky',
        uuid,
        // create new frame from Bluesky URI
        `src="https://embed.bsky.app/embed/${bskyID.replace(/^at:\/\//, '')}" scrolling="no"`,
        {
          // additional client-side script is needed for correct and automatically
          // adjusted iframe height to be applied.
          additionalElements: /* html */ `<script data-embed-type="Bluesky" type="module">
  window.addEventListener('message', event => {
    const embed = document.querySelector('#embed-${uuid}');
    const height = event.data.height;
    if (height && embed) embed.style.height = ''.concat(height, 'px');
  });
</script>`,
          styles: 'border:medium;display:block;height:min-content',
        },
      );
  } catch {
    return fallback;
  }
}

/**
 * Implements an embed component for CodePen embeds.
 */
function codepenEmbed(url: URL, uuid: string) {
  const cleanURL = url.href
    .replace('/pen/', '/embed/')
    .replace('/full/', '/embed/');
  return createFrame(
    url,
    'CodePen',
    uuid,
    `src="${cleanURL}?default-tab=result" height="400"`,
  );
}

/**
 * Implements an embed component for Reddit embeds.
 */
async function redditEmbed(url: URL) {
  const scriptSource = 'https://embed.reddit.com/widgets.js';
  return createEmbedComponent(
    url,
    'Reddit',
    /* html */ `<div class="reddit-embed-bq" data-embed-height="622">
  <a href="${url}">See the post on Reddit.</a>
</div>
<script async="" src="${scriptSource}" charset="utf-8"></script>`,
    {},
  );
}

/**
 * Implements an embed component for Mastodon or Fediverse embeds.
 */
async function mastodonEmbed(url: URL, uuid: string) {
  return createFrame(
    url,
    'Mastodon',
    uuid,
    `src="${url.origin}/${url.pathname}/embed"`,
    { styles: 'padding:1ch 0;border:var(--b)' },
  );
}

/**
 * Shortcode to implement an embedded source by simply providing a link to that
 * resource, without the need to copy any embedding code.
 * Currently supports the following sources:
 *
 * - Bluesky
 * - CodePen
 * - Spotify
 * - YouTube
 * @example
 * ```nunjucks
 * {# YouTube embed #}
 * {% embed "https://youtube.com/watch?v=LpG8vtFMkD0" %}
 * {% embed "https://youtu.be/LpG8vtFMkD0" %}
 * {# Spotify embed #}
 * {% embed "https://open.spotify.com/intl-de/album/7tfW0uYdwTz3QcTAILyrHY" %}
 * {# Bluesky embed #}
 * {% embed "https://bsky.app/profile/tazkultur.bsky.social/post/3ljmr7hmn4s2j" %}
 * {# CodePen embed #}
 * {% embed "https://codepen.io/lowfatprophet/pen/VYvgpaw" %}
 * {# Reddit embed #}
 * {% embed "https://reddit.com/r/Steam/comments/1p8oomu/valve_artist_responds_to_calls_for_steam_to_drop/" %}
 * {# Mastodon embed #}
 * {% embed "https://mastodon.social/@deejayy/115454110249651937" %}
 * ```
 */
export async function embed(this: LFPEleventyScope, url: string) {
  if (!url) return '';

  setCounter(this.page, 'embed');

  const fallback = fallbackPhraser(url);

  const _url = new URL(
    // url.startsWith('/') ? `${siteConfig.url.replace(/\/$/, '')}${url}` : url,
    url
  );
  const uuid = crypto.randomUUID();

  switch (_url.hostname) {
    case 'youtube.com':
    case 'youtu.be':
      return youtubeEmbed(_url, uuid) ?? fallback;
    case 'open.spotify.com':
      return spotifyEmbed(_url, uuid) ?? fallback;
    case 'bsky.app': {
      const embed = await blueskyEmbed(_url, uuid);
      return embed ?? fallback;
    }
    case 'codepen.io':
      return codepenEmbed(_url, uuid) ?? fallback;
    case 'reddit.com': {
      const embed = await redditEmbed(_url);
      return embed ?? fallback;
    }
    case 'mastodon.social': {
      
      let embed = await mastodonEmbed(_url, uuid);
      const counter = setCounter(this.page, 'embedMastodon');
      if (counter === 1) {
        const scriptUrl = '/assets/scripts/mastodon-embed.js';
        embed += `<script async="" src="${scriptUrl}"></script>`;
      }
      return embed ?? fallback;
    }
  }

  if (_url.href.endsWith('.pdf')) {
    // if (_url.hostname !== new URL(siteConfig.url).hostname) {
    //   // fail hard if remote resource is accessed
    //   throw new SyntaxError(
    //     'Cannot embed remote resources due to SAME_ORIGIN XSS protection.',
    //   );
    // }

    return /* html */ `<embed type="application/pdf" src="${url}" width="400" height="400">`;
  }

  // TODO: posibly implement embeds for other MIME/document types

  return fallback;
}

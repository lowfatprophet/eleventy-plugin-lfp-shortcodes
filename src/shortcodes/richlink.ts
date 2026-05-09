import Fetch from '@11ty/eleventy-fetch';
import { getLinkPreview } from 'link-preview-js';
import { randomUUID } from 'node:crypto';
import { lookup } from 'node:dns';
import type { ILinkPreviewResponse, LFPEleventyScope, LFPPreviewResponse } from '../types.d.ts';
import { setCounter } from '../util/helper.js';

/**
 * Creates a rich link preview (like Bluesky cards) for the given link, if possible.
 * @example
 * ```nunjucks
 * {% richlink "https://11ty.dev" %}
 * ```
 */
export async function richlink(this: LFPEleventyScope, url: string) {
  // the counter is only used to notify the Nunjucks templating engine that styles for rich links should be included on this page.
  setCounter(this.page, 'richlink');

  try {
    const _url = new URL(url);
    const id = randomUUID();

    const linkData = await Fetch<LFPPreviewResponse>(
      async () => {
        return await getLinkPreview(_url.toString(), {
          followRedirects: 'manual',
          handleRedirects: (baseUrl, forwardedUrl) => {
            // https://npmjs.com/package/link-preview-js?activeTab=readme#redirections
            const urlObj = new URL(baseUrl);
            const forwardedUrlObj = new URL(forwardedUrl);
            return (
              forwardedUrlObj.hostname === urlObj.hostname ||
              forwardedUrlObj.hostname === `www.${urlObj.hostname}` ||
              `www${forwardedUrlObj.hostname}` === urlObj.hostname
            );
          },
          resolveDNSHost: async url => {
            return new Promise((resolve, reject) => {
              lookup(new URL(url).hostname, (err, address) => {
                if (err) {
                  reject(err);
                  return;
                }
                resolve(address);
              });
            });
          },
        });
      },
      { duration: '2w', type: 'json', requestId: _url.toString() },
    ) as ILinkPreviewResponse;

    const image = 'images' in linkData ? linkData.images.at(0) : null;
    const favicon = linkData.favicons.at(0);
    const content = [
      /* html */ `<small class="rl_sn">${linkData.siteName || _url.host}</small>`,
      /* html */ `<a href="${linkData.url}" class="rl_l">${linkData.title}</a>`,
    ];
    if (linkData.description)
      content.push(/* html */ `<p class="rl_e">${linkData.description}</p>`);

    return /* html */ `<lfp-rich-link data-url="${linkData.url}" data-name="richlink-${id}">
  <div class="rl">
    ${
      image
        ? /* html */ `<div class="rl_s" data-src="${image}">
<img src="." alt="" class="rl_img" data-src="${image}" eleventy:ignore>
</div>`
        : ''
    }
    <div class="rl_c">
      ${content.join('')}
      <small class="rl_f" aria-hidden="true">
        ${image && favicon ? /* html */ `<img src="." alt="" class="rl_fav" data-src="${favicon}" eleventy:ignore>` : ''}
        <span>${_url.hostname}</span>
      </small>
    </div>
  </div>
  ${
    image
      ? /* html */ `<small class="rl_pn" aria-hidden="true">
  <input type="checkbox" id="richlink-${id}" name="richlink-${id}"><label for="richlink-${id}">Load images</label>, <a href="/privacy#richlink-details">privacy settings</a>
</small>`
      : ''
  }
</lfp-rich-link>`;
  } catch {
    return /* html */ `<p>Visit <a href="${url}">${url}</a></p>`;
  }
}

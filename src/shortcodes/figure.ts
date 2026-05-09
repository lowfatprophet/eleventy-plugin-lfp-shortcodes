import type { LFPEleventyScope } from '../types.d.ts';
import { hasCaption, ifCaption, ifID, md, setCounter } from '../util/helper.js';

/**
 * Single shortcode for creating figures from images, pictures, or videos.
 * @example
 * ```nunjucks
 * {% figure "https://placehold.co/1600x900" "image in figure with obligatory alt text" "Caption of this figure, including custom id for linking." "test-figure-1" "https://example.com/attribution-for-image" %}
 * ```
 */
export function figure(
  this: LFPEleventyScope,
  src: string,
  alt: string = '',
  caption: string = '',
  id: string = '',
  attribution: string = ''
) {
  const counter = setCounter(this.page, 'figure');

  return /* html */ `<figure ${ifCaption(caption, `aria-label="Figure ${counter}: ${caption}"`)} ${!hasCaption(caption) ? 'role="figure"' : ''} ${ifID(id, `id="${id}"`)}>
  <div class="i">
    <img src="${src}" alt="${alt}" sizes="(max-width: 45em) 50em" loading="lazy" decoding="async">
    <a href="${src}" class="media-link">View original media.</a>
  </div>
  ${/* This line applies an ugly-ass workaround to prevent the markdown parser to create an empty paragraph out of an empty string. The new line symbol is abstracting away this trouble. */ attribution.length > 0 ? `<small>${attribution}</small>` : '\n'}
  ${ifCaption(
    caption,
    /* html */ `<figcaption>
  <small>
    <b>${ifID(id, /* html */ `<a href="#${id}">&para;</a>&nbsp;`)}Figure ${counter}</b>: ${md.renderInline(caption)}
  </small>
</figcaption>`,
  )}
</figure>`;
}

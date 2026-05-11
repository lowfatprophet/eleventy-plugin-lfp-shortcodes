import { randomUUID } from 'node:crypto';
import type { LFPEleventyScope } from '../types.d.ts';
import { hasCaption, ifCaption, ifID, md, setCounter } from '../util/helper.js';

/**
 * Paired shortcode to wrap code or code blocks inside a figure element.
 * @example
 * ```nunjucks
 * {% listing "Codeblock inside figure with caption." "listing-id-1" %}
 * ```python
 * def codeblock():
 *     print("Hello World!")
 * \```
 * {% endlisting %}
 * ```
 */
export function listing(
  this: LFPEleventyScope,
  content: string,
  caption: string = '',
  id: string = '',
  hideCopy: 'true' | 'false' = 'false'
) {
  const counter = setCounter(this.page, 'listing');
  const uuid = randomUUID();
  
  // insert button here instead of programmatically with JavaScript to prevent
  // excessive layout shifts
  return /* html */ `<figure ${!hasCaption(caption) ? 'role="figure"' : ''} ${ifID(id, `id="${id}"`)}>
  ${
    hideCopy === 'false'
      ? /* html */ `<lfp-copy-button button-text="Copy code" copy-target="#code-frame-${uuid}" copy-text="Code copied!">
    <button disabled>Copy code not available</button>
  </lfp-copy-button>`
      : ''
  }
  <div id="code-frame-${uuid}">
    ${content}
  </div>
  ${ifCaption(
    caption,
    /* html */ `<figcaption>
  <small>
    <b>${ifID(id, /* html */ `<a href="#${id}">&para;</a>&nbsp;`)}Listing ${counter}</b>: ${md.renderInline(caption)}
  </small>
</figcaption>`,
  )}</figure>`;
}

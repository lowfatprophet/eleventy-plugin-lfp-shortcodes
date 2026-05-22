import { randomUUID } from 'node:crypto';
import type { LFPEleventyScope, ListingConfig } from '../types.d.ts';
import { getConfig } from '../util/config.js';
import {
  hasCaption,
  ifCaption,
  ifClass,
  ifID,
  ifStyle,
  md,
  setCounter
} from '../util/helper.js';

function getLineNumbers(content: string) {
  return Array.from(
    { length: content.trim().split('\n').length - 2 },
    (_, i) => i + 1,
  ).join(' ');
}

function renderFigCaption(
  caption: string,
  counter: number,
  id: string, {
    captionType, listingLabel, linkIcon, listingLabelClass, listingLabelStyle
  }: Partial<ListingConfig>,
) {
  const frame = (content: string) => /* html */ `<figcaption>${content}</figcaption>`; 
  const _caption = md.renderInline(caption);

  switch (captionType) {
    case 'linkafter':
      return frame(/* html */ `<small>
    <b ${ifClass(listingLabelClass)} ${ifStyle(listingLabelStyle)}>
      ${listingLabel} ${counter}${ifID(id, /* html */ `&nbsp;<a href="#${id}">${linkIcon}</a>`)}
    </b>: ${_caption}
  </small>`);
    case 'linklabel':
      return frame(/* html */ `<small>
    <b ${ifClass(listingLabelClass)} ${ifStyle(listingLabelStyle)}>
      ${listingLabel} ${counter}${ifID(id, /* html */ `<a href="#${id}">${linkIcon}`)}
    </b>: ${_caption}
  ${ifID(id, '</a>')}</small>`);
    case 'nolabel':
      return /* html */ `<small>${_caption}</small>`;
    case 'nolink':
      return /* html */ `<small><b>${listingLabel} ${counter}</b>: ${_caption}</small>`;
    default: /* linkbefore */
      return frame(/* html */ `<small>
    <b ${ifClass(listingLabelClass)} ${ifStyle(listingLabelStyle)}>
      ${ifID(id, /* html */ `<a href="#${id}">${linkIcon}</a>&nbsp;`)}${listingLabel} ${counter}
    </b>: ${_caption}
  </small>`);
  }  
}

/**
 * Paired shortcode to wrap code or code blocks inside a figure element.
 * @example
 * ````nunjucks
 * {% listing "Codeblock inside figure with caption.", "listing-id-1" %}
 * ```python
 * def codeblock():
 *     print("Hello World!")
 * ```
 * {% endlisting %}
 * ````
 */
export async function listing(
  this: LFPEleventyScope,
  content: string,
  caption: string = '',
  id: string = '',
  hideCopy: 'true' | 'false' = 'false',
  lineNumbers: 'true' | 'false' = 'false'
) {
  const { listing: config, css } = getConfig();
  const {
    captionType,
    copyButtonText,
    defaultButtonText,
    linkIcon,
    listingLabel,
    listingLabelClass,
    listingLabelStyle,
    transformer,
  } = Object.assign({
    captionType: 'linkbefore',
    copyButtonText: 'Code copied!',
    defaultButtonText: 'Copy code not available',
    linkIcon: '&para;',
    listingLabel: 'Listing',
    listingLabelClass: '',
    listingLabelStyle: '',
    transformer: async (content: string) => content,
  }, config);

  const counter = setCounter(this.page, 'listing');
  if (config?.customCounterName && lineNumbers === 'true') setCounter(this.page, 'lineNumbers');
  
  const uuid = randomUUID();
  
  // insert button here instead of programmatically with JavaScript to prevent
  // excessive layout shifts
  return /* html */ `<figure ${!hasCaption(caption) ? 'role="figure"' : ''} ${ifID(id, `id="${id}"`)}>
  ${
    hideCopy === 'false'
      ? /* html */ `<lfp-copy-button button-text="Copy code" copy-target="#code-frame-${uuid}" copy-text="${copyButtonText}">
    <button disabled>${defaultButtonText}</button>
  </lfp-copy-button>`
      : ''
  }
  <div id="code-frame-${uuid}" ${css ? `style="margin-block-start:0.5ch" ${lineNumbers === 'true' ? `data-line-numbers="${getLineNumbers(content)}"` : ''}` : ''}>
    ${transformer ? await transformer(content) : content}
  </div>
  ${ifCaption(
    caption,
    renderFigCaption(
      caption,
      counter,
      id,
      { captionType, linkIcon, listingLabel, listingLabelClass, listingLabelStyle } as Partial<ListingConfig>
    ),
  )}</figure>`;
}

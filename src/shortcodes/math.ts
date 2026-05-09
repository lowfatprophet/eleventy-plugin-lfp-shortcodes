import Temml, { type Options as TemmlOptions } from 'temml';
import type { LFPEleventyScope } from '../types.d.ts';
import { hasCaption, ifCaption, ifID, setCounter } from '../util/helper.js';

function renderMath(content: string, options?: Partial<TemmlOptions>) {
  const defaultOptions: Partial<TemmlOptions> = {
    annotate: true,
    throwOnError: true,
  };
  return Temml.renderToString(content, Object.assign(defaultOptions, options));
}

/**
 * Creates an inline math expression. Pass a Latex-style expression, omitting `$` delimieters.
 * @example
 * ```nunjucks
 * Lorem ipsum {% math %}a^2+b^2=c^2{% endmath %} dolor sit amet.
 * ```
 */
export function math(content: string) {
  return renderMath(content);
}

/**
 * Creates a block math expression with optional caption and id for same-page or deep-linking. Pass a Latex-style expression, omitting `$$` delimiters
 * @example
 * ```nunjucks
 * {% mathblock "Normal distribution" "equation-id-1" %}
 * \Phi(x)=\frac{1}{\sqrt{2\pi \sigma^2}}\mathrm{e}^\frac{(x-\mu)^2}{2\sigma^2}
 * {% endmathblock %}
 * ```
 */
export function mathblock(this: LFPEleventyScope, content: string, caption: string = '', id: string = '') {
  const counter = setCounter(this.page, 'mathblock');
  return /* html */ `<figure ${ifCaption(caption, `aria-label="Listing ${counter}: ${caption}"`)} ${!hasCaption(caption) ? 'role="figure"' : ''} ${ifID(id, `id="${id}"`)}>
  <lfp-copy-button copy-target="#expression-frame-${counter} annotation" button-text="Copy expression" copy-text="Expression copied!">
    <button disabled>Copy expression not available</button>
  </lfp-copy-button>
  <div id="expression-frame-${counter}">
    ${renderMath(content, { displayMode: true })}
  </div>
  ${ifCaption(
    caption,
    /* html */ `<figcaption>
  <small>
    <b>${ifID(id, /* html */ `<a href="#${id}">&para;</a>&nbsp;`)}(${counter})</b> ${caption}
  </small>
</figcaption>`,
  )}
</figure>`;
}

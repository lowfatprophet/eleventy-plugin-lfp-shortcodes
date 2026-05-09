import { isURL, md, softSanitize } from "../util/helper.js";

/**
 * Creates a blockquote with optional attribution and cite attribute.
 * @example
 * ```nunjucks
 * {% blockquote "Mark Twain" "https://example.com/mark-twain-quotes" %}
 * The two most important days in your life are the day you are born and the day you find out why.
 * {% endblockquote %}
 * ```
 */
export function blockquote(quote: string, attribution: string = '', cite: string = '') {
  return /* html */ `<blockquote ${isURL(cite) ? `cite="${cite}"` : ''}>
    ${md.renderInline(quote)}
    ${
      attribution.length > 0
        ? /* html */ `<br><small>&mdash; ${softSanitize(md.renderInline(attribution))}</small>`
        : ''
    }
  </blockquote>`
}
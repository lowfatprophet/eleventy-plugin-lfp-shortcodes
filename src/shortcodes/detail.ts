import type { LFPEleventyScope } from "../types.d.ts";
import { ifID } from "../util/helper.js";

/**
 * Paired shortcode for creating a details panel.
 * @example
 * ```nunjucks
 * {% detail "The summary" "name" "true" %}
 * Add a summary that is displayed when the element is closed. Add `name` if you want to have a set of `details`-elements with exclusive open/close functionality (https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details#name).
 * Passing 'true' to `open` has the `details`-element open by default.
 * {% enddetail %}
 * ```
 */
export function detail(
  this: LFPEleventyScope,
  content: string,
  summary: string,
  name: string = '',
  id: string = '',
  open: 'true' | 'false' = 'false'
) {
  return `<details ${name.length > 0 ? `name="${name}"` : ''} ${ifID(id, `id="${id}"`)} ${open === 'true' ? 'open' : ''}>
    <summary>${summary}</summary>
    ${content}
  </details>`;
}

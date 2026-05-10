import type { LFPEleventyScope, LFPShortcodeConfig } from '../types.d.ts';
import { ifCaption, ifID, md, setCounter } from '../util/helper.js';

/**
 * Paired shortcode to add a caption to a table with overflow container.
 * @example
 * ```nunjucks
 * {% table "Table Caption" "table-id-1" -%}
 * {# the table's content, excluding `<table>`-tags #}
 * {% endtable %}
 * ```
 */
export function table(this: LFPEleventyScope, config: LFPShortcodeConfig, content: string, caption: string = '', id: string = '') {
  const counter = setCounter(this.page, 'table');
  const captionContent = ifCaption(
    caption,
    /* html */ `<small>
  <b>${ifID(id, /* html */ `<a href="#${id}">&para;</a>&nbsp;`)}Table ${counter}</b>: ${md.renderInline(caption)}
</small>`,
  );
  return /* html */ `<div style="overflow-x:auto">
  <table ${ifID(id, `id="${id}"`)}>
    <caption>${captionContent}</caption>
    ${content}
  </table>
</div>`;
}
